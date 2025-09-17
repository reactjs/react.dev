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
  const lines = content.split('\n');
  const lineOffsets = computeLineOffsets(lines);
  const blocks = [];

  let currentBlock = null;

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const fenceMatch = line.match(/^```(\w+)(.*)$/);

    if (fenceMatch) {
      const lang = fenceMatch[1];
      if (!SUPPORTED_LANGUAGES.has(lang)) {
        currentBlock = null;
        continue;
      }

      const metaPortion = fenceMatch[2] || '';
      const metadata = parseFenceMetadata(metaPortion);
      currentBlock = {
        lang,
        metadata,
        filePath,
        codeLines: [],
        codeStartLine: index + 2,
        position: {
          start: {line: index + 1, column: 0},
          end: {line: index + 1, column: 0},
        },
        fence: {
          lineIndex: index,
          rawText: line,
          metaText: metaPortion,
          range: [lineOffsets[index] || 0, (lineOffsets[index] || 0) + line.length],
        },
      };
      continue;
    }

    if (line === '```' && currentBlock) {
      currentBlock.position.end = {line: index + 1, column: 0};
      currentBlock.code = currentBlock.codeLines.join('\n');
      delete currentBlock.codeLines;
      blocks.push(currentBlock);
      currentBlock = null;
      continue;
    }

    if (currentBlock) {
      currentBlock.codeLines.push(line);
    }
  }

  return {
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
