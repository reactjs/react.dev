// Server Worker for RSC Sandboxes
// Runs inside a Blob URL Web Worker.
// Pre-bundled by esbuild with React (server build), react-server-dom-webpack/server.browser, and Sucrase.

// IMPORTANT
// If this file changes, run:
//   yarn prebuild:rsc

var React = require('react');
var ReactJSXRuntime = require('react/jsx-runtime');
var RSDWServer = require('react-server-dom-webpack/server.browser');
var Sucrase = require('sucrase');
var acorn = require('acorn-loose');

var deployed = null;

// Module map proxy: generates module references on-demand for client components.
// When server code imports a 'use client' file, it gets a proxy reference
// that serializes into the Flight stream.
function createModuleMap() {
  return new Proxy(
    {},
    {
      get: function (target, key) {
        if (key in target) return target[key];
        var parts = String(key).split('#');
        var moduleId = parts[0];
        var exportName = parts[1] || 'default';
        var entry = {
          id: moduleId,
          chunks: [moduleId],
          name: exportName,
          async: true,
        };
        target[key] = entry;
        return entry;
      },
    }
  );
}

// Server actions registry
var serverActionsRegistry = {};

function registerServerReference(impl, moduleId, name) {
  var ref = RSDWServer.registerServerReference(impl, moduleId, name);
  var id = moduleId + '#' + name;
  serverActionsRegistry[id] = impl;
  return ref;
}

// Detect 'use client' / 'use server' directives using acorn-loose,
// matching the same approach as react-server-dom-webpack/node-register.
function parseDirective(code) {
  if (code.indexOf('use client') === -1 && code.indexOf('use server') === -1) {
    return null;
  }
  try {
    var body = acorn.parse(code, {
      ecmaVersion: '2024',
      sourceType: 'source',
    }).body;
  } catch (x) {
    return null;
  }
  for (var i = 0; i < body.length; i++) {
    var node = body[i];
    if (node.type !== 'ExpressionStatement' || !node.directive) break;
    if (node.directive === 'use client') return 'use client';
    if (node.directive === 'use server') return 'use server';
  }
  return null;
}

// Resolve relative paths (e.g., './Counter.js' from '/src/App.js' → '/src/Counter.js')
function resolvePath(from, to) {
  if (!to.startsWith('.')) return to;
  var parts = from.split('/');
  parts.pop(); // remove filename
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

// Deploy new server code into the Worker
// Receives raw source files — compiles them with Sucrase before execution.
function deploy(files) {
  // Build a require function for the server module scope
  var modules = {
    react: React,
    'react/jsx-runtime': ReactJSXRuntime,
  };

  // Compile all files first, then execute on-demand via require.
  // This avoids ordering issues where a file imports another that hasn't been executed yet.
  var compiled = {};
  var compileError = null;
  Object.keys(files).forEach(function (filePath) {
    if (compileError) return;
    try {
      compiled[filePath] = Sucrase.transform(files[filePath], {
        transforms: ['jsx', 'imports'],
        jsxRuntime: 'automatic',
        production: true,
      }).code;
    } catch (err) {
      compileError = filePath + ': ' + (err.message || String(err));
    }
  });

  if (compileError) {
    return {type: 'error', error: compileError};
  }

  // Resolve a module id relative to a requesting file
  function resolveModuleId(from, id) {
    if (modules[id]) return id;
    if (id.startsWith('.')) {
      var resolved = resolvePath(from, id);
      if (modules[resolved] || compiled[resolved]) return resolved;
      var exts = ['.js', '.jsx', '.ts', '.tsx'];
      for (var ei = 0; ei < exts.length; ei++) {
        var withExt = resolved + exts[ei];
        if (modules[withExt] || compiled[withExt]) return withExt;
      }
    }
    return id;
  }

  // Execute a module lazily and cache its exports
  var executing = {};
  var detectedClientFiles = {};

  function executeModule(filePath) {
    if (modules[filePath]) return modules[filePath];
    if (!compiled[filePath]) {
      throw new Error('Module "' + filePath + '" not found');
    }
    if (executing[filePath]) {
      // Circular dependency — return partially populated exports
      return executing[filePath].exports;
    }

    // Replicate node-register's _compile hook:
    // detect directives BEFORE executing the module.
    var directive = parseDirective(files[filePath]);

    if (directive === 'use client') {
      // Don't execute — return a client module proxy (same as node-register)
      modules[filePath] = RSDWServer.createClientModuleProxy(filePath);
      detectedClientFiles[filePath] = true;
      return modules[filePath];
    }

    var mod = {exports: {}};
    executing[filePath] = mod;

    var localRequire = function (id) {
      if (id.endsWith('.css')) return {};
      var resolved = resolveModuleId(filePath, id);
      if (modules[resolved]) return modules[resolved];
      return executeModule(resolved);
    };

    new Function('module', 'exports', 'require', 'React', compiled[filePath])(
      mod,
      mod.exports,
      localRequire,
      React
    );

    modules[filePath] = mod.exports;

    if (directive === 'use server') {
      // Execute normally, then register server references (same as node-register)
      var exportNames = Object.keys(mod.exports);
      for (var i = 0; i < exportNames.length; i++) {
        var name = exportNames[i];
        if (typeof mod.exports[name] === 'function') {
          registerServerReference(mod.exports[name], filePath, name);
        }
      }
    }

    delete executing[filePath];
    return mod.exports;
  }

  // Execute all files (order no longer matters — require triggers lazy execution)
  var mainModule = {exports: {}};
  Object.keys(compiled).forEach(function (filePath) {
    executeModule(filePath);
    if (
      filePath === '/src/App.js' ||
      filePath === './App.js' ||
      filePath === './src/App.js'
    ) {
      mainModule.exports = modules[filePath];
    }
  });

  deployed = {
    module: mainModule.exports,
  };

  return {
    type: 'deployed',
    compiledClients: compiled,
    clientEntries: detectedClientFiles,
  };
}

// Render the deployed app to a Flight stream
function render() {
  if (!deployed) throw new Error('No code deployed');
  var App = deployed.module.default || deployed.module;
  var element = React.createElement(App);
  return RSDWServer.renderToReadableStream(element, createModuleMap(), {
    onError: console.error,
  });
}

// Execute a server action and re-render
function callAction(actionId, encodedArgs) {
  if (!deployed) throw new Error('No code deployed');
  var action = serverActionsRegistry[actionId];
  if (!action) throw new Error('Action "' + actionId + '" not found');
  // Reconstruct FormData from serialized entries (postMessage can't clone FormData)
  var decoded = encodedArgs;
  if (
    typeof encodedArgs !== 'string' &&
    encodedArgs &&
    encodedArgs.__formData
  ) {
    decoded = new FormData();
    for (var i = 0; i < encodedArgs.__formData.length; i++) {
      decoded.append(
        encodedArgs.__formData[i][0],
        encodedArgs.__formData[i][1]
      );
    }
  }
  return Promise.resolve(RSDWServer.decodeReply(decoded)).then(function (args) {
    var resultPromise = Promise.resolve(action.apply(null, args));
    return resultPromise.then(function () {
      var App = deployed.module.default || deployed.module;
      return RSDWServer.renderToReadableStream(
        {root: React.createElement(App), returnValue: resultPromise},
        createModuleMap()
      );
    });
  });
}

// Stream chunks back to the main thread via postMessage
function sendStream(requestId, stream) {
  var reader = stream.getReader();
  function pump() {
    return reader.read().then(function (result) {
      if (result.done) {
        self.postMessage({type: 'rsc-chunk', requestId: requestId, done: true});
        return;
      }
      self.postMessage(
        {
          type: 'rsc-chunk',
          requestId: requestId,
          done: false,
          chunk: result.value,
        },
        [result.value.buffer]
      );
      return pump();
    });
  }
  pump().catch(function (err) {
    self.postMessage({
      type: 'rsc-error',
      requestId: requestId,
      error: String(err),
    });
  });
}

// RPC message handler
self.onmessage = function (e) {
  var msg = e.data;
  if (msg.type === 'deploy') {
    try {
      var result = deploy(msg.files);
      if (result && result.type === 'error') {
        self.postMessage({
          type: 'rsc-error',
          requestId: msg.requestId,
          error: result.error,
        });
      } else if (result) {
        self.postMessage({
          type: 'deploy-result',
          requestId: msg.requestId,
          result: result,
        });
      }
    } catch (err) {
      self.postMessage({
        type: 'rsc-error',
        requestId: msg.requestId,
        error: String(err),
      });
    }
  } else if (msg.type === 'render') {
    try {
      var streamPromise = render();
      Promise.resolve(streamPromise).then(function (stream) {
        sendStream(msg.requestId, stream);
      });
    } catch (err) {
      self.postMessage({
        type: 'rsc-error',
        requestId: msg.requestId,
        error: String(err),
      });
    }
  } else if (msg.type === 'callAction') {
    try {
      callAction(msg.actionId, msg.encodedArgs).then(function (stream) {
        sendStream(msg.requestId, stream);
      });
    } catch (err) {
      self.postMessage({
        type: 'rsc-error',
        requestId: msg.requestId,
        error: String(err),
      });
    }
  }
};

self.postMessage({type: 'ready'});
