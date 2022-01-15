/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */
const fs = require('fs');
const walk = require('./walk');

/**
 * Validate if there is a custom heading id and exit if there isn't a heading
 * @param {string} line
 * @returns
 */
function validateHeaderId(line) {
  if (!line.startsWith('#')) {
    return;
  }

  const match = /\{\/\*(.*?)\*\/}/.exec(line);
  const id = match;
  if (!id) {
    console.error(
      'Run yarn fix-headings to generate headings.'
    );
    process.exit(1);
  }
}

/**
 * Loops through the lines to skip code blocks
 * @param {Array<string>} lines
 */
function validateHeaderIds(lines) {
  let inCode = false;
  const results = [];
  lines.forEach((line) => {
    // Ignore code blocks
    if (line.startsWith('```')) {
      inCode = !inCode;

      results.push(line);
      return;
    }
    if (inCode) {
      results.push(line);
      return;
    }
    validateHeaderId(line);
  });
}
/**
 * paths are basically array of path for which we have to validate heading IDs
 * @param {Array<string>} paths
 */
async function main(paths) {
  paths = paths.length === 0 ? ['src/pages'] : paths;
  const files = paths.map((path) => [...walk(path)]).flat();

  files.forEach((file) => {
    if (!(file.endsWith('.md') || file.endsWith('.mdx'))) {
      return;
    }

    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    validateHeaderIds(lines);
  });
}

module.exports = main;
