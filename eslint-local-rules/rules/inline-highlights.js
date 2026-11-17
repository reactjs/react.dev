/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const INLINE_HIGHLIGHT_REGEX = /(\[\[.*\]\])/;

function validateInlineHighlights(meta, code) {
  const match = INLINE_HIGHLIGHT_REGEX.exec(meta);
  if (!match) {
    return [];
  }

  let highlights;
  try {
    highlights = JSON.parse(match[1]);
  } catch (error) {
    return ['Code highlight metadata must be valid JSON'];
  }

  if (!Array.isArray(highlights)) {
    return ['Code highlight metadata must be an array'];
  }

  const lines = code.split('\n');
  const errors = [];

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
