/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs');
const path = require('path');
const {execFileSync} = require('child_process');

const contentDirectory = 'src/content';
const baseSha = process.argv[2];

if (!baseSha) {
  console.error(
    'Pass the base commit SHA to compare heading-order violations.'
  );
  process.exit(1);
}

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return walk(entryPath);
    }
    return entry.name.endsWith('.md') || entry.name.endsWith('.mdx')
      ? [entryPath]
      : [];
  });
}

function findHeadingOrderViolations(content, file) {
  const violations = [];
  const lines = content.split(/\r?\n/);
  let previousLevel = 1;
  let codeFence = null;

  lines.forEach((line, index) => {
    const fence = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
    if (fence) {
      const marker = fence[1][0];
      if (!codeFence) {
        codeFence = {marker, length: fence[1].length};
      } else if (
        marker === codeFence.marker &&
        fence[1].length >= codeFence.length
      ) {
        codeFence = null;
      }
      return;
    }
    if (codeFence) {
      return;
    }

    const heading = /^(#{1,6})[ \t]+(.+?)\s*$/.exec(line);
    if (!heading) {
      return;
    }

    const level = heading[1].length;
    if (level > previousLevel + 1) {
      const text = heading[2].replace(/\s+\{\/\*.*?\*\/}\s*$/, '').trim();
      violations.push({
        file,
        line: index + 1,
        previousLevel,
        level,
        text,
      });
    }
    previousLevel = level;
  });

  return violations;
}

function violationKey(violation) {
  return JSON.stringify([
    violation.file,
    violation.previousLevel,
    violation.level,
    violation.text,
  ]);
}

function readBaseContent(revision, file) {
  try {
    return execFileSync('git', ['show', `${revision}:${file}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch (error) {
    if (error.status === 128) {
      return null;
    }
    throw error;
  }
}

try {
  execFileSync('git', ['rev-parse', '--verify', `${baseSha}^{commit}`], {
    stdio: 'ignore',
  });

  const currentViolations = walk(contentDirectory).flatMap((filePath) => {
    const file = path
      .relative(process.cwd(), filePath)
      .split(path.sep)
      .join('/');
    return findHeadingOrderViolations(fs.readFileSync(filePath, 'utf8'), file);
  });
  const filesWithViolations = [
    ...new Set(currentViolations.map((violation) => violation.file)),
  ];
  const baselineCounts = new Map();

  filesWithViolations.forEach((file) => {
    const content = readBaseContent(baseSha, file);
    const violations = content ? findHeadingOrderViolations(content, file) : [];
    violations.forEach((violation) => {
      const key = violationKey(violation);
      baselineCounts.set(key, (baselineCounts.get(key) || 0) + 1);
    });
  });

  const newViolations = [];
  currentViolations.forEach((violation) => {
    const key = violationKey(violation);
    const count = baselineCounts.get(key) || 0;
    if (count > 0) {
      baselineCounts.set(key, count - 1);
    } else {
      newViolations.push(violation);
    }
  });

  if (newViolations.length > 0) {
    console.error('New heading-order skips found:');
    newViolations.forEach(({file, line, previousLevel, level, text}) => {
      console.error(
        `  ${file}:${line}: h${previousLevel} to h${level}: ${text}`
      );
    });
    process.exitCode = 1;
  } else {
    console.log('No new heading-order skips found.');
  }
} catch (error) {
  console.error(
    'Unable to check heading order against the base commit:',
    error.message
  );
  process.exitCode = 1;
}
