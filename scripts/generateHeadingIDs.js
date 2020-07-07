/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

const fs = require('fs');
const GithubSlugger = require('github-slugger');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(walk(file));
    } else {
      /* Is a file */
      results.push(file);
    }
  });
  return results;
}

function stripLinks(line) {
  return line.replace(/\[([^\]]+)\]\([^)]+\)/, (match, p1) => p1);
}

function addHeaderID(line, slugger) {
  // check if we're a header at all
  if (!line.startsWith('#')) {
    return line;
  }
  // check if it already has an id
  if (/\{#[^}]+\}/.test(line)) {
    return line;
  }
  const headingText = line.slice(line.indexOf(' ')).trim();
  const headingLevel = line.slice(0, line.indexOf(' '));
  return `${headingLevel} ${headingText} {#${slugger.slug(
    stripLinks(headingText),
  )}}`;
}

function addHeaderIDs(lines) {
  // Sluggers should be per file
  const slugger = new GithubSlugger();
  let inCode = false;
  const results = [];
  lines.forEach(line => {
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

    results.push(addHeaderID(line, slugger));
  });
  return results;
}

const [path] = process.argv.slice(2);

const files = walk(path);
files.forEach(file => {
  if (!file.endsWith('.md')) {
    return;
  }

  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const updatedLines = addHeaderIDs(lines);
  fs.writeFileSync(file, updatedLines.join('\n'));
});
