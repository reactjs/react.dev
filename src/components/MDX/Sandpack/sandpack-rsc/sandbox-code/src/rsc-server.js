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
function deploy(rawFiles, clientManifest, clientFiles) {
  // Build a require function for the server module scope
  var modules = {
    react: React,
    'react/jsx-runtime': ReactJSXRuntime,
  };

  // Create client module proxies for 'use client' files
  Object.keys(clientManifest).forEach(function (moduleId) {
    modules[moduleId] = RSDWServer.createClientModuleProxy(moduleId);
  });

  // Compile all server files first, then execute on-demand via require.
  // This avoids ordering issues where a file imports another that hasn't been executed yet.
  var compiled = {};
  var hasCompileError = false;
  Object.keys(rawFiles).forEach(function (filePath) {
    try {
      compiled[filePath] = Sucrase.transform(rawFiles[filePath], {
        transforms: ['jsx', 'imports'],
        jsxRuntime: 'automatic',
        production: true,
      }).code;
    } catch (err) {
      hasCompileError = true;
    }
  });

  if (hasCompileError) return null;

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
  function executeModule(filePath) {
    if (modules[filePath]) return modules[filePath];
    if (!compiled[filePath]) {
      throw new Error('Module "' + filePath + '" not found');
    }
    if (executing[filePath]) {
      // Circular dependency — return partially populated exports
      return executing[filePath].exports;
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

    // Register server functions from 'use server' modules
    if (hasDirective(rawFiles[filePath], 'use server')) {
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
    manifest: clientManifest,
  };

  // Compile client files with Sucrase so the client can evaluate and register them.
  var compiledClients = {};
  if (clientFiles) {
    Object.keys(clientFiles).forEach(function (filePath) {
      try {
        compiledClients[filePath] = Sucrase.transform(clientFiles[filePath], {
          transforms: ['jsx', 'imports'],
          jsxRuntime: 'automatic',
          production: true,
        }).code;
      } catch (err) {
        self.postMessage({
          type: 'rsc-error',
          requestId: -1,
          error: 'Sucrase compile error in ' + filePath + ': ' + String(err),
        });
      }
    });
  }

  return {type: 'deployed', compiledClients: compiledClients};
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
      var result = deploy(msg.serverFiles, msg.clientManifest, msg.clientFiles);
      if (result) {
        self.postMessage({
          type: 'deploy-result',
          requestId: msg.requestId,
          result: result,
        });
      }
    } catch (err) {
      // Silently ignore — likely mid-edit syntax errors
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
