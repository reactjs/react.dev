// RSC Client Entry Point
// Runs inside the Sandpack iframe. Orchestrates the RSC pipeline:
// 1. Creates a Web Worker from pre-bundled server runtime
// 2. Receives file updates from parent (RscFileBridge) via postMessage
// 3. Classifies files by directive, sends raw source to Worker
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

export function initClient() {
  // Create Worker from pre-bundled server runtime
  var blob = new Blob([rscServerForWorker], {type: 'application/javascript'});
  var workerUrl = URL.createObjectURL(blob);
  var worker = new Worker(workerUrl);

  // Render tracking
  var renderRequestId = 0;
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
  var root = createRoot(rootEl);
  startTransition(function () {
    root.render(jsx(Root, {initialPromise: initialPromise}));
  });

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
      // Register compiled client modules in the webpack cache before rendering
      if (msg.result && msg.result.compiledClients) {
        registerClientModules(msg.result.compiledClients);
      }
      triggerRender();
    } else if (msg.type === 'rsc-chunk') {
      handleChunk(msg);
    } else if (msg.type === 'rsc-error') {
      console.error('RSC Worker error:', msg.error);
    }
  };

  function callServer(id, args) {
    return encodeReply(args).then(function (body) {
      renderRequestId++;
      var reqId = renderRequestId;

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
    renderRequestId++;
    var reqId = renderRequestId;

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
    var serverFiles = {};
    var clientManifest = {};
    var clientFiles = {};

    Object.keys(files).forEach(function (filePath) {
      var code = files[filePath];

      // Skip non-JS files and infrastructure files
      if (!filePath.match(/\.(js|jsx|ts|tsx)$/)) return;
      if (filePath.indexOf('node_modules') !== -1) return;
      if (filePath === '/src/index.js') return;
      if (filePath === '/src/rsc-client.js') return;
      if (filePath === '/src/rsc-server.js') return;

      // Check for 'use client' directive
      if (hasDirective(code, 'use client')) {
        clientManifest[filePath] = true;
        clientFiles[filePath] = code;
      } else {
        // Server file — send raw source to Worker for compilation
        serverFiles[filePath] = code;
      }
    });

    // Send raw server + client files to Worker (Worker compiles with Sucrase)
    worker.postMessage({
      type: 'deploy',
      requestId: ++renderRequestId,
      serverFiles: serverFiles,
      clientManifest: clientManifest,
      clientFiles: clientFiles,
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
  function registerClientModules(compiledClients) {
    var moduleIds = Object.keys(compiledClients);
    moduleIds.forEach(function (moduleId) {
      var code = compiledClients[moduleId];
      var mod = {exports: {}};
      var clientRequire = function (id) {
        if (id === 'react') return React;
        if (id === 'react/jsx-runtime') return ReactJSXRuntime;
        if (id === 'react/jsx-dev-runtime') return ReactJSXDevRuntime;
        if (id.endsWith('.css')) return {};
        var resolvedId = id.startsWith('.') ? resolvePath(moduleId, id) : id;
        // Try exact match, then with extensions
        var candidates = [resolvedId];
        var exts = ['.js', '.jsx', '.ts', '.tsx'];
        for (var i = 0; i < exts.length; i++) {
          candidates.push(resolvedId + exts[i]);
        }
        for (var j = 0; j < candidates.length; j++) {
          var cached = globalThis.__webpack_module_cache__[candidates[j]];
          if (cached)
            return cached.exports !== undefined ? cached.exports : cached;
        }
        throw new Error('Client require: module "' + id + '" not found');
      };
      try {
        new Function(
          'module',
          'exports',
          'require',
          'React',
          code
        )(mod, mod.exports, clientRequire, React);
      } catch (err) {
        console.error('Error executing client module ' + moduleId + ':', err);
        return;
      }
      globalThis.__webpack_module_cache__[moduleId] = {exports: mod.exports};
    });
  }

  function hasDirective(code, directive) {
    var lines = code.split('\n');
    for (var i = 0; i < Math.min(lines.length, 10); i++) {
      var line = lines[i].trim();
      if (line === '') continue;
      if (line.startsWith('//')) continue;
      if (line.startsWith('/*')) {
        while (i < lines.length && !lines[i].includes('*/')) i++;
        continue;
      }
      if (
        line === "'" + directive + "';" ||
        line === '"' + directive + '";' ||
        line === "'" + directive + "'" ||
        line === '"' + directive + '"'
      ) {
        return true;
      }
      return false;
    }
    return false;
  }
}
