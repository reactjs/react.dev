/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const INLINE_HIGHLIGHT_REGEX = /\[\[(.*?)\]\]/g;

function validateInlineHighlights(meta, code) {
  const matches = [...meta.matchAll(INLINE_HIGHLIGHT_REGEX)];
  if (matches.length === 0) {
    return [];
  }

  const errors = [];
  let highlights = [];
  for (const match of matches) {
    let parsed;
    try {
      // The fence marker [[...]] is not itself valid JSON, so wrap the
      // captured content in brackets to parse it as an array. This makes
      // both [1, 1, "text"] and [ [1, 1, "text"] ] (nested form) parse
      // into a three-element highlight tuple.
      parsed = JSON.parse(`[${match[1]}]`);
    } catch (error) {
      errors.push('Code highlight metadata must be valid JSON');
      continue;
    }
    if (!Array.isArray(parsed)) {
      errors.push('Code highlight metadata must be an array');
      continue;
    }
    // A single group may either wrap the list of highlights
    // ([[ [1, 1, "a"], [2, 3, "b"] ]] style) or be one bare
    // three-element tuple ([1, 1, "a"] style).
    if (parsed.length > 0 && parsed.every(entry => Array.isArray(entry))) {
      highlights = highlights.concat(parsed);
    } else {
      highlights.push(parsed);
    }
  }

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
