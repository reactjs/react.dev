"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _interopRequireWildcard;
var cache;
function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  var defineProp = Object.defineProperty;
  var newObj = {
    __proto__: null,
    default: obj
  };
  var desc;
  var key;
  if (Object(obj) !== obj) {
    return newObj;
  }
  if (!cache && typeof WeakMap === "function") {
    cache = new WeakMap();
  }
  if (cache) {
    if (cache.has(obj)) return cache.get(obj);
    cache.set(obj, newObj);
  }
  for (key in obj) {
    if (key !== "default" && {}.hasOwnProperty.call(obj, key)) {
      desc = defineProp && Object.getOwnPropertyDescriptor(obj, key);
      if (desc && (desc.get || desc.set)) {
        defineProp(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  return newObj;
}

//# sourceMappingURL=interopRequireWildcard.js.map
