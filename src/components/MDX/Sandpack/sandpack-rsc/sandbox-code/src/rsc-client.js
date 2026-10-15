// RSC Client Entry Point
// Runs inside the Sandpack iframe. Orchestrates the RSC pipeline:
// 1. Creates a Web Worker from pre-bundled server runtime
// 2. Receives file updates from parent (RscFileBridge) via postMessage
// 3. Sends all user files to Worker for directive detection + compilation
// 4. Worker compiles with Sucrase + executes, sends back Flight chunks
// 5. Renders the Flight stream result with React

// Minimal webpack shim for RSDW compatibility.
// Works in both browser (window) and worker (self) contexts via globalThis.

import * as React from 'react';
import * as ReactJSXRuntime from 'react/jsx-runtime';
import * as ReactJSXDevRuntime from 'react/jsx-dev-runtime';
import {useState, startTransition, use} from 'react';
import {jsx} from 'react/jsx-runtime';
import {createRoot} from 'react-dom/client';

import rscServerForWorker from './rsc-server.js';

import './__webpack_shim__';
import {
  createFromReadableStream,
  encodeReply,
} from 'react-server-dom-webpack/client.browser';

import {
  injectIntoGlobalHook,
  register as refreshRegister,
  performReactRefresh,
  isLikelyComponentType,
} from 'react-refresh/runtime';

// Patch the DevTools hook to capture renderer helpers and track roots.
// Must run after react-dom evaluates (injects renderer) but before createRoot().
injectIntoGlobalHook(window);

export function initClient() {
  // Create Worker from pre-bundled server runtime
  var blob = new Blob([rscServerForWorker], {type: 'application/javascript'});
  var workerUrl = URL.createObjectURL(blob);
  var worker = new Worker(workerUrl);

  // Render tracking
  var nextStreamId = 0;
  var chunkControllers = {};
  var setCurrentPromise;
  var firstRender = true;
  var workerReady = false;
  var pendingFiles = null;

  function Root({initialPromise}) {
    var _state = useState(initialPromise);
    setCurrentPromise = _state[1];
    return use(_state[0]);
  }

  // Set up React root
  var initialResolve;
  var initialPromise = new Promise(function (resolve) {
    initialResolve = resolve;
  });

  var rootEl = document.getElementById('root');
  if (!rootEl) throw new Error('#root element not found');
  var root = createRoot(rootEl, {
    onUncaughtError: function (error) {
      var msg =
        error && error.digest
          ? error.digest
          : error && error.message
          ? error.message
          : String(error);
      console.error(msg);
      showError(msg);
    },
  });
  startTransition(function () {
    root.render(jsx(Root, {initialPromise: initialPromise}));
  });

  // Error overlay — rendered inside the iframe via DOM so it doesn't
  // interfere with Sandpack's parent-frame message protocol.
  function showError(message) {
    var overlay = document.getElementById('rsc-error-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'rsc-error-overlay';
      overlay.style.cssText =
        'background:#fff;border:2px solid #c00;border-radius:8px;padding:16px;margin:20px;font-family:sans-serif;';
      var heading = document.createElement('h2');
      heading.style.cssText = 'color:#c00;margin:0 0 8px;font-size:16px;';
      heading.textContent = 'Server Error';
      overlay.appendChild(heading);
      var pre = document.createElement('pre');
      pre.style.cssText =
        'margin:0;white-space:pre-wrap;word-break:break-word;font-size:14px;color:#222;';
      overlay.appendChild(pre);
      rootEl.parentNode.insertBefore(overlay, rootEl);
    }
    overlay.lastChild.textContent = message;
    overlay.style.display = '';
    rootEl.style.display = 'none';
  }

  function clearError() {
    var overlay = document.getElementById('rsc-error-overlay');
    if (overlay) overlay.style.display = 'none';
    rootEl.style.display = '';
  }

  // Worker message handler
  worker.onmessage = function (e) {
    var msg = e.data;
    if (msg.type === 'ready') {
      workerReady = true;
      if (pendingFiles) {
        processFiles(pendingFiles);
        pendingFiles = null;
      }
    } else if (msg.type === 'deploy-result') {
      clearError();
      // Register compiled client modules in the webpack cache before rendering
      if (msg.result && msg.result.compiledClients) {
        registerClientModules(
          msg.result.compiledClients,
          msg.result.clientEntries || {}
        );
      }
      triggerRender();
    } else if (msg.type === 'rsc-chunk') {
      handleChunk(msg);
    } else if (msg.type === 'rsc-error') {
      showError(msg.error);
    }
  };

  function callServer(id, args) {
    return encodeReply(args).then(function (body) {
      nextStreamId++;
      var reqId = nextStreamId;

      var stream = new ReadableStream({
        start: function (controller) {
          chunkControllers[reqId] = controller;
        },
      });

      // FormData is not structured-cloneable for postMessage.
      // Serialize to an array of entries; the worker reconstructs it.
      var encodedArgs;
      if (typeof body === 'string') {
        encodedArgs = body;
      } else {
        var entries = [];
        body.forEach(function (value, key) {
          entries.push([key, value]);
        });
        encodedArgs = {__formData: entries};
      }

      worker.postMessage({
        type: 'callAction',
        requestId: reqId,
        actionId: id,
        encodedArgs: encodedArgs,
      });

      var response = createFromReadableStream(stream, {
        callServer: callServer,
      });

      // Update UI with re-rendered root
      startTransition(function () {
        updateUI(
          Promise.resolve(response).then(function (v) {
            return v.root;
          })
        );
      });

      // Return action's return value (for useActionState support)
      return Promise.resolve(response).then(function (v) {
        return v.returnValue;
      });
    });
  }

  function triggerRender() {
    // Close any in-flight streams from previous renders
    Object.keys(chunkControllers).forEach(function (id) {
      try {
        chunkControllers[id].close();
      } catch (e) {}
      delete chunkControllers[id];
    });

    nextStreamId++;
    var reqId = nextStreamId;

    var stream = new ReadableStream({
      start: function (controller) {
        chunkControllers[reqId] = controller;
      },
    });

    worker.postMessage({type: 'render', requestId: reqId});

    var promise = createFromReadableStream(stream, {
      callServer: callServer,
    });

    updateUI(promise);
  }

  function handleChunk(msg) {
    var ctrl = chunkControllers[msg.requestId];
    if (!ctrl) return;
    if (msg.done) {
      ctrl.close();
      delete chunkControllers[msg.requestId];
    } else {
      ctrl.enqueue(msg.chunk);
    }
  }

  function updateUI(promise) {
    if (firstRender) {
      firstRender = false;
      if (initialResolve) initialResolve(promise);
    } else {
      startTransition(function () {
        if (setCurrentPromise) setCurrentPromise(promise);
      });
    }
  }

  // File update handler — receives raw file contents from RscFileBridge
  window.addEventListener('message', function (e) {
    var msg = e.data;
    if (msg.type !== 'rsc-file-update') return;
    if (!workerReady) {
      pendingFiles = msg.files;
      return;
    }
    processFiles(msg.files);
  });

  function processFiles(files) {
    console.clear();
    var userFiles = {};
    Object.keys(files).forEach(function (filePath) {
      if (!filePath.match(/\.(js|jsx|ts|tsx)$/)) return;
      if (filePath.indexOf('node_modules') !== -1) return;
      if (filePath === '/src/index.js') return;
      if (filePath === '/src/rsc-client.js') return;
      if (filePath === '/src/rsc-server.js') return;
      if (filePath === '/src/__webpack_shim__.js') return;
      if (filePath === '/src/__react_refresh_init__.js') return;
      userFiles[filePath] = files[filePath];
    });
    worker.postMessage({
      type: 'deploy',
      files: userFiles,
    });
  }

  // Resolve relative paths (e.g., './Button' from '/src/Counter.js' → '/src/Button')
  function resolvePath(from, to) {
    if (!to.startsWith('.')) return to;
    var parts = from.split('/');
    parts.pop();
    var toParts = to.split('/');
    for (var i = 0; i < toParts.length; i++) {
      if (toParts[i] === '.') continue;
      if (toParts[i] === '..') {
        parts.pop();
        continue;
      }
      parts.push(toParts[i]);
    }
    return parts.join('/');
  }

  // Evaluate compiled client modules and register them in the webpack cache
  // so RSDW client can resolve them via __webpack_require__.
  function registerClientModules(compiledClients, clientEntries) {
    // Clear stale client modules from previous deploys
    Object.keys(globalThis.__webpack_module_cache__).forEach(function (key) {
      delete globalThis.__webpack_module_cache__[key];
    });

    // Store all compiled code for lazy evaluation
    var allCompiled = compiledClients;

    function evaluateModule(moduleId) {
      if (globalThis.__webpack_module_cache__[moduleId]) {
        var cached = globalThis.__webpack_module_cache__[moduleId];
        return cached.exports !== undefined ? cached.exports : cached;
      }
      var code = allCompiled[moduleId];
      if (!code)
        throw new Error('Client require: module "' + moduleId + '" not found');

      var mod = {exports: {}};
      // Register before evaluating to handle circular deps
      var cacheEntry = {exports: mod.exports};
      globalThis.__webpack_module_cache__[moduleId] = cacheEntry;

      var clientRequire = function (id) {
        if (id === 'react') return React;
        if (id === 'react/jsx-runtime') return ReactJSXRuntime;
        if (id === 'react/jsx-dev-runtime') return ReactJSXDevRuntime;
        if (id.endsWith('.css')) return {};
        var resolvedId = id.startsWith('.') ? resolvePath(moduleId, id) : id;
        var candidates = [resolvedId];
        var exts = ['.js', '.jsx', '.ts', '.tsx'];
        for (var i = 0; i < exts.length; i++) {
          candidates.push(resolvedId + exts[i]);
        }
        for (var j = 0; j < candidates.length; j++) {
          if (
            allCompiled[candidates[j]] ||
            globalThis.__webpack_module_cache__[candidates[j]]
          ) {
            return evaluateModule(candidates[j]);
          }
        }
        throw new Error('Client require: module "' + id + '" not found');
      };

      try {
        new Function('module', 'exports', 'require', 'React', code)(
          mod,
          mod.exports,
          clientRequire,
          React
        );
      } catch (err) {
        console.error('Error executing client module ' + moduleId + ':', err);
        return mod.exports;
      }
      // Update the SAME cache entry's exports (don't replace the wrapper)
      cacheEntry.exports = mod.exports;
      return mod.exports;
    }

    // Eagerly evaluate 'use client' entry points; their imports resolve lazily
    Object.keys(clientEntries).forEach(function (moduleId) {
      evaluateModule(moduleId);
    });

    // Register all evaluated components with react-refresh for Fast Refresh.
    // This creates stable "component families" so React can preserve state
    // across re-evaluations when component identity changes.
    Object.keys(globalThis.__webpack_module_cache__).forEach(function (
      moduleId
    ) {
      var moduleExports = globalThis.__webpack_module_cache__[moduleId];
      var exports =
        moduleExports.exports !== undefined
          ? moduleExports.exports
          : moduleExports;
      if (exports && typeof exports === 'object') {
        for (var key in exports) {
          var exportValue = exports[key];
          if (isLikelyComponentType(exportValue)) {
            refreshRegister(exportValue, moduleId + ' %exports% ' + key);
          }
        }
      }
      if (typeof exports === 'function' && isLikelyComponentType(exports)) {
        refreshRegister(exports, moduleId + ' %exports% default');
      }
    });

    // Tell React about updated component families so it can
    // preserve state for components whose implementation changed.
    performReactRefresh();
  }
}
