(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    factory(module);
    module.exports = def(module);
  } else if (typeof define === 'function' && define.amd) {
    define(['module'], function(mod) {
      factory.apply(this, arguments);
      mod.exports = def(mod);
    });
  } else {
    const mod = { exports: {} };
    factory(mod);
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    global.sourcemapCodec = def(mod);
  }
  function def(m) { return 'default' in m.exports ? m.exports.default : m.exports; }
})(this, (function (module) {
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/sourcemap-codec.ts
var sourcemap_codec_exports = {};
__export(sourcemap_codec_exports, {
  decode: () => decode,
  decodeGeneratedRanges: () => decodeGeneratedRanges,
  decodeOriginalScopes: () => decodeOriginalScopes,
  decodeRangeMappings: () => decodeRangeMappings,
  encode: () => encode,
  encodeGeneratedRanges: () => encodeGeneratedRanges,
  encodeOriginalScopes: () => encodeOriginalScopes,
  encodeRangeMappings: () => encodeRangeMappings
});
module.exports = __toCommonJS(sourcemap_codec_exports);

// src/vlq.ts
var comma = ",".charCodeAt(0);
var semicolon = ";".charCodeAt(0);
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var intToChar = new Uint8Array(64);
var charToInt = new Uint8Array(128);
for (let i = 0; i < chars.length; i++) {
  const c = chars.charCodeAt(i);
  intToChar[i] = c;
  charToInt[c] = i;
}
function decodeInteger(reader) {
  let value = 0;
  let shift = 0;
  let integer = 0;
  do {
    const c = reader.next();
    integer = charToInt[c];
    value |= (integer & 31) << shift;
    shift += 5;
  } while (integer & 32);
  return value;
}
function decodeSign(num) {
  return num & 1 ? -2147483648 | -(num >>> 1) : num >>> 1;
}
function encodeInteger(builder, num) {
  do {
    let clamped = num & 31;
    num >>>= 5;
    if (num > 0) clamped |= 32;
    builder.write(intToChar[clamped]);
  } while (num > 0);
}
function encodeSign(num) {
  return num < 0 ? -num << 1 | 1 : num << 1;
}
function hasMoreVlq(reader, max) {
  if (reader.pos >= max) return false;
  return reader.peek() !== comma;
}

// src/strings.ts
var bufLength = 1024 * 16;
var td = typeof TextDecoder !== "undefined" ? /* @__PURE__ */ new TextDecoder() : typeof Buffer !== "undefined" ? {
  decode(buf) {
    const out = Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength);
    return out.toString();
  }
} : {
  decode(buf) {
    let out = "";
    for (let i = 0; i < buf.length; i++) {
      out += String.fromCharCode(buf[i]);
    }
    return out;
  }
};
var StringWriter = class {
  constructor() {
    this.pos = 0;
    this.out = "";
    this.buffer = new Uint8Array(bufLength);
  }
  write(v) {
    const { buffer } = this;
    buffer[this.pos++] = v;
    if (this.pos === bufLength) {
      this.out += td.decode(buffer);
      this.pos = 0;
    }
  }
  flush() {
    const { buffer, out, pos } = this;
    return pos > 0 ? out + td.decode(buffer.subarray(0, pos)) : out;
  }
};
var StringReader = class {
  constructor(buffer) {
    this.pos = 0;
    this.buffer = buffer;
  }
  next() {
    return this.buffer.charCodeAt(this.pos++);
  }
  peek() {
    return this.buffer.charCodeAt(this.pos);
  }
  indexOf(char) {
    const { buffer, pos } = this;
    const idx = buffer.indexOf(char, pos);
    return idx === -1 ? buffer.length : idx;
  }
};

// src/scopes.ts
var EMPTY = [];
function decodeOriginalScopes(input) {
  const { length } = input;
  const reader = new StringReader(input);
  const scopes = [];
  const stack = [];
  let line = 0;
  for (; reader.pos < length; reader.pos++) {
    line += decodeSign(decodeInteger(reader));
    const column = decodeSign(decodeInteger(reader));
    if (!hasMoreVlq(reader, length)) {
      const last = stack.pop();
      last[2] = line;
      last[3] = column;
      continue;
    }
    const kind = decodeSign(decodeInteger(reader));
    const fields = decodeSign(decodeInteger(reader));
    const hasName = fields & 1;
    const scope = hasName ? [line, column, 0, 0, kind, decodeSign(decodeInteger(reader))] : [line, column, 0, 0, kind];
    let vars = EMPTY;
    if (hasMoreVlq(reader, length)) {
      vars = [];
      do {
        const varsIndex = decodeSign(decodeInteger(reader));
        vars.push(varsIndex);
      } while (hasMoreVlq(reader, length));
    }
    scope.vars = vars;
    scopes.push(scope);
    stack.push(scope);
  }
  return scopes;
}
function encodeOriginalScopes(scopes) {
  const writer = new StringWriter();
  for (let i = 0; i < scopes.length; ) {
    i = _encodeOriginalScopes(scopes, i, writer, [0]);
  }
  return writer.flush();
}
function _encodeOriginalScopes(scopes, index, writer, state) {
  const scope = scopes[index];
  const { 0: startLine, 1: startColumn, 2: endLine, 3: endColumn, 4: kind, vars } = scope;
  if (index > 0) writer.write(comma);
  encodeInteger(writer, encodeSign(startLine - state[0]));
  state[0] = startLine;
  encodeInteger(writer, encodeSign(startColumn));
  encodeInteger(writer, encodeSign(kind));
  const fields = scope.length === 6 ? 1 : 0;
  encodeInteger(writer, encodeSign(fields));
  if (scope.length === 6) encodeInteger(writer, encodeSign(scope[5]));
  for (const v of vars) {
    encodeInteger(writer, encodeSign(v));
  }
  for (index++; index < scopes.length; ) {
    const next = scopes[index];
    const { 0: l, 1: c } = next;
    if (l > endLine || l === endLine && c >= endColumn) {
      break;
    }
    index = _encodeOriginalScopes(scopes, index, writer, state);
  }
  writer.write(comma);
  encodeInteger(writer, encodeSign(endLine - state[0]));
  state[0] = endLine;
  encodeInteger(writer, encodeSign(endColumn));
  return index;
}
function decodeGeneratedRanges(input) {
  const { length } = input;
  const reader = new StringReader(input);
  const ranges = [];
  const stack = [];
  let genLine = 0;
  let definitionSourcesIndex = 0;
  let definitionScopeIndex = 0;
  let callsiteSourcesIndex = 0;
  let callsiteLine = 0;
  let callsiteColumn = 0;
  let bindingLine = 0;
  let bindingColumn = 0;
  do {
    const semi = reader.indexOf(";");
    let genColumn = 0;
    for (; reader.pos < semi; reader.pos++) {
      genColumn += decodeSign(decodeInteger(reader));
      if (!hasMoreVlq(reader, semi)) {
        const last = stack.pop();
        last[2] = genLine;
        last[3] = genColumn;
        continue;
      }
      const fields = decodeSign(decodeInteger(reader));
      const hasDefinition = fields & 1;
      const hasCallsite = fields & 2;
      const hasScope = fields & 4;
      let callsite = null;
      let bindings = EMPTY;
      let range;
      if (hasDefinition) {
        const defSourcesIndex = definitionSourcesIndex + decodeSign(decodeInteger(reader));
        definitionScopeIndex = decodeSign(decodeInteger(reader)) + (definitionSourcesIndex === defSourcesIndex ? definitionScopeIndex : 0);
        definitionSourcesIndex = defSourcesIndex;
        range = [genLine, genColumn, 0, 0, defSourcesIndex, definitionScopeIndex];
      } else {
        range = [genLine, genColumn, 0, 0];
      }
      range.isScope = !!hasScope;
      if (hasCallsite) {
        const prevCsi = callsiteSourcesIndex;
        const prevLine = callsiteLine;
        callsiteSourcesIndex += decodeSign(decodeInteger(reader));
        const sameSource = prevCsi === callsiteSourcesIndex;
        callsiteLine = (sameSource ? callsiteLine : 0) + decodeSign(decodeInteger(reader));
        callsiteColumn = (sameSource && prevLine === callsiteLine ? callsiteColumn : 0) + decodeSign(decodeInteger(reader));
        callsite = [callsiteSourcesIndex, callsiteLine, callsiteColumn];
      }
      range.callsite = callsite;
      if (hasMoreVlq(reader, semi)) {
        bindings = [];
        do {
          bindingLine = genLine;
          bindingColumn = genColumn;
          const expressionsCount = decodeSign(decodeInteger(reader));
          let expressionRanges;
          if (expressionsCount < -1) {
            expressionRanges = [[decodeSign(decodeInteger(reader))]];
            for (let i = -1; i > expressionsCount; i--) {
              const prevBl = bindingLine;
              bindingLine += decodeSign(decodeInteger(reader));
              bindingColumn = (bindingLine === prevBl ? bindingColumn : 0) + decodeSign(decodeInteger(reader));
              const expression = decodeSign(decodeInteger(reader));
              expressionRanges.push([expression, bindingLine, bindingColumn]);
            }
          } else {
            expressionRanges = [[expressionsCount]];
          }
          bindings.push(expressionRanges);
        } while (hasMoreVlq(reader, semi));
      }
      range.bindings = bindings;
      ranges.push(range);
      stack.push(range);
    }
    genLine++;
    reader.pos = semi + 1;
  } while (reader.pos < length);
  return ranges;
}
function encodeGeneratedRanges(ranges) {
  if (ranges.length === 0) return "";
  const writer = new StringWriter();
  for (let i = 0; i < ranges.length; ) {
    i = _encodeGeneratedRanges(ranges, i, writer, [0, 0, 0, 0, 0, 0, 0]);
  }
  return writer.flush();
}
function _encodeGeneratedRanges(ranges, index, writer, state) {
  const range = ranges[index];
  const {
    0: startLine,
    1: startColumn,
    2: endLine,
    3: endColumn,
    isScope,
    callsite,
    bindings
  } = range;
  if (state[0] < startLine) {
    catchupLine(writer, state[0], startLine);
    state[0] = startLine;
    state[1] = 0;
  } else if (index > 0) {
    writer.write(comma);
  }
  encodeInteger(writer, encodeSign(range[1] - state[1]));
  state[1] = range[1];
  const fields = (range.length === 6 ? 1 : 0) | (callsite ? 2 : 0) | (isScope ? 4 : 0);
  encodeInteger(writer, encodeSign(fields));
  if (range.length === 6) {
    const { 4: sourcesIndex, 5: scopesIndex } = range;
    if (sourcesIndex !== state[2]) {
      state[3] = 0;
    }
    encodeInteger(writer, encodeSign(sourcesIndex - state[2]));
    state[2] = sourcesIndex;
    encodeInteger(writer, encodeSign(scopesIndex - state[3]));
    state[3] = scopesIndex;
  }
  if (callsite) {
    const { 0: sourcesIndex, 1: callLine, 2: callColumn } = range.callsite;
    if (sourcesIndex !== state[4]) {
      state[5] = 0;
      state[6] = 0;
    } else if (callLine !== state[5]) {
      state[6] = 0;
    }
    encodeInteger(writer, encodeSign(sourcesIndex - state[4]));
    state[4] = sourcesIndex;
    encodeInteger(writer, encodeSign(callLine - state[5]));
    state[5] = callLine;
    encodeInteger(writer, encodeSign(callColumn - state[6]));
    state[6] = callColumn;
  }
  if (bindings) {
    for (const binding of bindings) {
      if (binding.length > 1) encodeInteger(writer, encodeSign(-binding.length));
      const expression = binding[0][0];
      encodeInteger(writer, encodeSign(expression));
      let bindingStartLine = startLine;
      let bindingStartColumn = startColumn;
      for (let i = 1; i < binding.length; i++) {
        const expRange = binding[i];
        encodeInteger(writer, encodeSign(expRange[1] - bindingStartLine));
        bindingStartLine = expRange[1];
        encodeInteger(writer, encodeSign(expRange[2] - bindingStartColumn));
        bindingStartColumn = expRange[2];
        encodeInteger(writer, encodeSign(expRange[0]));
      }
    }
  }
  for (index++; index < ranges.length; ) {
    const next = ranges[index];
    const { 0: l, 1: c } = next;
    if (l > endLine || l === endLine && c >= endColumn) {
      break;
    }
    index = _encodeGeneratedRanges(ranges, index, writer, state);
  }
  if (state[0] < endLine) {
    catchupLine(writer, state[0], endLine);
    state[0] = endLine;
    state[1] = 0;
  } else {
    writer.write(comma);
  }
  encodeInteger(writer, encodeSign(endColumn - state[1]));
  state[1] = endColumn;
  return index;
}
function catchupLine(writer, lastLine, line) {
  do {
    writer.write(semicolon);
  } while (++lastLine < line);
}

// src/range-mappings.ts
function decodeRangeMappings(input) {
  const { length } = input;
  const reader = new StringReader(input);
  const rangeMappings = [];
  do {
    const semi = reader.indexOf(";");
    const indices = [];
    let index = 0;
    while (reader.pos < semi) {
      index += decodeInteger(reader);
      indices.push(index);
    }
    rangeMappings.push(indices);
    reader.pos = semi + 1;
  } while (reader.pos <= length);
  return rangeMappings;
}
function encodeRangeMappings(decoded) {
  if (decoded.length === 0) return "";
  const writer = new StringWriter();
  for (let i = 0; i < decoded.length; i++) {
    const indices = decoded[i];
    if (i > 0) writer.write(semicolon);
    let index = 0;
    for (let j = 0; j < indices.length; j++) {
      const offset = indices[j];
      encodeInteger(writer, offset - index);
      index = offset;
    }
  }
  return writer.flush();
}

// src/sourcemap-codec.ts
function decode(mappings) {
  const { length } = mappings;
  const reader = new StringReader(mappings);
  const decoded = [];
  let genColumn = 0;
  let sourcesIndex = 0;
  let sourceLine = 0;
  let sourceColumn = 0;
  let namesIndex = 0;
  do {
    const semi = reader.indexOf(";");
    const line = [];
    let sorted = true;
    let lastCol = 0;
    genColumn = 0;
    while (reader.pos < semi) {
      let seg;
      genColumn += decodeSign(decodeInteger(reader));
      if (genColumn < lastCol) sorted = false;
      lastCol = genColumn;
      if (hasMoreVlq(reader, semi)) {
        sourcesIndex += decodeSign(decodeInteger(reader));
        sourceLine += decodeSign(decodeInteger(reader));
        sourceColumn += decodeSign(decodeInteger(reader));
        if (hasMoreVlq(reader, semi)) {
          namesIndex += decodeSign(decodeInteger(reader));
          seg = [genColumn, sourcesIndex, sourceLine, sourceColumn, namesIndex];
        } else {
          seg = [genColumn, sourcesIndex, sourceLine, sourceColumn];
        }
      } else {
        seg = [genColumn];
      }
      line.push(seg);
      reader.pos++;
    }
    if (!sorted) sort(line);
    decoded.push(line);
    reader.pos = semi + 1;
  } while (reader.pos <= length);
  return decoded;
}
function sort(line) {
  line.sort(sortComparator);
}
function sortComparator(a, b) {
  return a[0] - b[0];
}
function encode(decoded) {
  const writer = new StringWriter();
  let sourcesIndex = 0;
  let sourceLine = 0;
  let sourceColumn = 0;
  let namesIndex = 0;
  for (let i = 0; i < decoded.length; i++) {
    const line = decoded[i];
    if (i > 0) writer.write(semicolon);
    if (line.length === 0) continue;
    let genColumn = 0;
    for (let j = 0; j < line.length; j++) {
      const segment = line[j];
      if (j > 0) writer.write(comma);
      encodeInteger(writer, encodeSign(segment[0] - genColumn));
      genColumn = segment[0];
      if (segment.length === 1) continue;
      encodeInteger(writer, encodeSign(segment[1] - sourcesIndex));
      encodeInteger(writer, encodeSign(segment[2] - sourceLine));
      encodeInteger(writer, encodeSign(segment[3] - sourceColumn));
      sourcesIndex = segment[1];
      sourceLine = segment[2];
      sourceColumn = segment[3];
      if (segment.length === 4) continue;
      encodeInteger(writer, encodeSign(segment[4] - namesIndex));
      namesIndex = segment[4];
    }
  }
  return writer.flush();
}
}));
//# sourceMappingURL=sourcemap-codec.umd.js.map
