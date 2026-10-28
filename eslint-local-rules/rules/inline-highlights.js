/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const INLINE_HIGHLIGHT_REGEX = /\[\[.*\]\]/;

function isHighlightTuple(entry) {
  return (
    Array.isArray(entry) &&
    entry.length >= 3 &&
    Number.isInteger(entry[0]) &&
    Number.isInteger(entry[1]) &&
    typeof entry[2] === 'string'
  );
}

function parseHighlightGroups(meta) {
  const match = meta.match(INLINE_HIGHLIGHT_REGEX);
  if (match === null) {
    // No [[...]] inline highlight marker present (e.g. metadata-only fences
    // like ```js {expectedErrors: ...}) — nothing to validate here.
    return [];
  }
  let parsed;
  try {
    parsed = JSON.parse(match[0]);
  } catch (error) {
    return null;
  }
  if (!Array.isArray(parsed)) {
    return null;
  }
  // Normalize accepted shapes:
  //   - list of highlight tuples: [[step, line, text], ...]
  //   - nested single tuple:      [[[step, line, text]]]
  //   - single bare tuple:        [step, line, text]
  if (parsed.length === 1 && Array.isArray(parsed[0])) {
    const inner = parsed[0];
    if (isHighlightTuple(inner)) {
      // Nested form wrapping exactly one tuple.
      return [inner];
    }
  }
  if (parsed.length > 0 && parsed.every(isHighlightTuple)) {
    return parsed;
  }
  return [parsed];
}

function validateInlineHighlights(meta, code) {
  const groups = parseHighlightGroups(meta);
  if (groups === null) {
    return ['Code highlight metadata must be valid JSON'];
  }
  if (groups.length === 0) {
    return [];
  }
  const errors = [];
  const highlights = groups;

  const lines = code.split('\n');

  for (const highlight of highlights) {
    if (!Array.isArray(highlight) || highlight.length < 3) {
      errors.push('Each code highlight must specify a step, line, and text');
      continue;
    }

    const [, lineNo, text, fromIndex] = highlight;
    if (!Number.isInteger(lineNo) || lineNo < 1 || lineNo > lines.length) {
      errors.push(`Code highlight line ${lineNo} is outside this code block`);
      continue;
    }
    if (typeof text !== 'string') {
      errors.push(`Code highlight text on line ${lineNo} must be a string`);
      continue;
    }

    const line = lines[lineNo - 1];
    let index = line.indexOf(text);
    const lastIndex = line.lastIndexOf(text);
    if (index !== lastIndex) {
      if (fromIndex === undefined) {
        errors.push(
          `Found '${text}' twice on highlighted line ${lineNo}; specify fromIndex`
        );
        continue;
      }
      index = line.indexOf(text, fromIndex);
    }
    if (index === -1) {
      errors.push(`Could not find '${text}' on highlighted line ${lineNo}`);
    }
  }

  return errors;
}

module.exports = {validateInlineHighlights};
