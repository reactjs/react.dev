/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const remark = require('remark');
const {parseFenceMetadata} = require('./metadata');

/**
 * @typedef {Object} MarkdownCodeBlock
 * @property {string} code
 * @property {number} codeStartLine
 * @property {{start: {line: number, column: number}, end: {line: number, column: number}}} position
 * @property {{lineIndex: number, rawText: string, metaText: string, range: [number, number]}} fence
 * @property {string} filePath
 * @property {string} lang
 * @property {import('./metadata').FenceMetadata} metadata
 */

const SUPPORTED_LANGUAGES = new Set([
  'js',
  'jsx',
  'javascript',
  'ts',
  'tsx',
  'typescript',
]);

function computeLineOffsets(lines) {
  const offsets = [];
  let currentOffset = 0;

  for (const line of lines) {
    offsets.push(currentOffset);
    currentOffset += line.length + 1;
  }

  return offsets;
}

function parseMarkdownFile(content, filePath) {
  const tree = remark().parse(content);
  const lines = content.split('\n');
  const lineOffsets = computeLineOffsets(lines);
  const blocks = [];

  function traverse(node) {
    if (!node || typeof node !== 'object') {
      return;
    }

    if (node.type === 'code') {
      const rawLang = node.lang || '';
      const normalizedLang = rawLang.toLowerCase();
      if (!normalizedLang || !SUPPORTED_LANGUAGES.has(normalizedLang)) {
        return;
      }

      const fenceLineIndex = (node.position?.start?.line ?? 1) - 1;
      const fenceStartOffset = node.position?.start?.offset ?? 0;
      const fenceLine = lines[fenceLineIndex] ?? '';
      const fenceEndOffset = fenceStartOffset + fenceLine.length;

      let metaText = '';
      if (fenceLine) {
        const prefixMatch = fenceLine.match(/^`{3,}\s*/);
        const prefixLength = prefixMatch ? prefixMatch[0].length : 3;
        metaText = fenceLine.slice(prefixLength + rawLang.length);
      } else if (node.meta) {
        metaText = ` ${node.meta}`;
      }

      const metadata = parseFenceMetadata(metaText);

      blocks.push({
        lang: rawLang || normalizedLang,
        metadata,
        filePath,
        code: node.value || '',
        codeStartLine: (node.position?.start?.line ?? 1) + 1,
        position: {
          start: {
            line: fenceLineIndex + 1,
            column: (node.position?.start?.column ?? 1) - 1,
          },
          end: {
            line: fenceLineIndex + 1,
            column: (node.position?.start?.column ?? 1) - 1 + fenceLine.length,
          },
        },
        fence: {
          lineIndex: fenceLineIndex,
          rawText: fenceLine,
          metaText,
          range: [fenceStartOffset, fenceEndOffset],
        },
      });
      return;
    }

    if ('children' in node && Array.isArray(node.children)) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  traverse(tree);

  return {
    content,
    blocks,
    lines,
    lineOffsets,
  };
}

module.exports = {
  SUPPORTED_LANGUAGES,
  computeLineOffsets,
  parseMarkdownFile,
};
