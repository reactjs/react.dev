/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function getRelativeLine(loc) {
  return loc?.start?.line ?? loc?.line ?? 1;
}

function getRelativeColumn(loc) {
  return loc?.start?.column ?? loc?.column ?? 0;
}

function getRelativeEndLine(loc, fallbackLine) {
  if (loc?.end?.line != null) {
    return loc.end.line;
  }
  if (loc?.line != null) {
    return loc.line;
  }
  return fallbackLine;
}

function getRelativeEndColumn(loc, fallbackColumn) {
  if (loc?.end?.column != null) {
    return loc.end.column;
  }
  if (loc?.column != null) {
    return loc.column;
  }
  return fallbackColumn;
}

/**
 * @param {import('./markdown').MarkdownCodeBlock} block
 * @param {Array<{detail: any, loc: any, message: string}>} diagnostics
 * @returns {Array<{detail: any, message: string, relativeStartLine: number, markdownLoc: {start: {line: number, column: number}, end: {line: number, column: number}}}>}
 */
function normalizeDiagnostics(block, diagnostics) {
  return diagnostics.map(({detail, loc, message}) => {
    const relativeStartLine = Math.max(getRelativeLine(loc), 1);
    const relativeStartColumn = Math.max(getRelativeColumn(loc), 0);
    const relativeEndLine = Math.max(
      getRelativeEndLine(loc, relativeStartLine),
      relativeStartLine
    );
    const relativeEndColumn = Math.max(
      getRelativeEndColumn(loc, relativeStartColumn),
      relativeStartColumn
    );

    const markdownStartLine = block.codeStartLine + relativeStartLine - 1;
    const markdownEndLine = block.codeStartLine + relativeEndLine - 1;

    return {
      detail,
      message,
      relativeStartLine,
      markdownLoc: {
        start: {
          line: markdownStartLine,
          column: relativeStartColumn,
        },
        end: {
          line: markdownEndLine,
          column: relativeEndColumn,
        },
      },
    };
  });
}

module.exports = {
  normalizeDiagnostics,
};
