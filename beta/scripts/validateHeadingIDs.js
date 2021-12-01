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
function validateHeaderId(line = 1) {
  if (!line.startsWith('#')) {
    return;
  }

  const match = /\{\/\*(.*?)\*\/}/.exec(line);
  const id = match;
  if (!id) {
    console.error(
      'Uh Oh seems like the markdown misses headings. Can you run yarn generate-ids to generate headings.'
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

const [path] = process.argv.slice(2);

main();

async function main() {
  const files = walk(path);

  files.forEach((file) => {
    if (!(file.endsWith('.md') || file.endsWith('.mdx'))) {
      return;
    }

    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    validateHeaderIds(lines);
  });
}
