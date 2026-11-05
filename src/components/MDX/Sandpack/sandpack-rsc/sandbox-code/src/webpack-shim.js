// Minimal webpack shim for RSDW compatibility.
// Works in both browser (window) and worker (self) contexts via globalThis.

var moduleCache = {};

globalThis.__webpack_module_cache__ = moduleCache;

globalThis.__webpack_require__ = function (moduleId) {
  var cached = moduleCache[moduleId];
  if (cached) return cached.exports !== undefined ? cached.exports : cached;
  throw new Error('Module "' + moduleId + '" not found in webpack shim cache');
};

globalThis.__webpack_chunk_load__ = function () {
  return Promise.resolve();
};

globalThis.__webpack_require__.u = function (chunkId) {
  return chunkId;
};

globalThis.__webpack_get_script_filename__ = function (chunkId) {
  return chunkId;
};
