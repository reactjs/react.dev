/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

// To do: Make this ESM.
// To do: properly check heading numbers (headings with the same text get
// numbered, this script doesn’t check that).

const assert = require('assert');
const fs = require('fs');
const GithubSlugger = require('github-slugger');

let modules

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function (file) {
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

  const match = /^(#+\s+)(.+?)(\s*\{(?:\/\*|#)([a-z0-9\-_]+?)(?:\*\/)?\}\s*)?$/.exec(line);
  const before = match[1] + match[2]
  const proc = modules.unified().use(modules.remarkParse).use(modules.remarkSlug)
  const tree = proc.runSync(proc.parse(before))
  const head = tree.children[0]
  assert(head && head.type === 'heading', 'expected `' + before + '` to be a heading, is it using a normal space after `#`?')
  const autoId = head.data.id
  const existingId = match[4]
  const id = existingId || autoId
  // Ignore numbers:
  const cleanExisting = existingId ? existingId.replace(/-\d+$/, '') : undefined
  const cleanAuto = autoId.replace(/-\d+$/, '')

  if (cleanExisting && cleanExisting !== cleanAuto) {
    console.log('Note: heading `%s` has a different ID (`%s`) than what GH generates for it: `%s`:', before, existingId, autoId)
  }

  return match[1] + match[2] + ' {/*' + id + '*/}';
}

function addHeaderIDs(lines) {
  // Sluggers should be per file
  const slugger = new GithubSlugger();
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

    results.push(addHeaderID(line, slugger));
  });
  return results;
}

const [path] = process.argv.slice(2);

main()

async function main() {
  const [unifiedMod, remarkParseMod, remarkSlugMod] = await Promise.all([import('unified'), import('remark-parse'), import('remark-slug')])
  const unified = unifiedMod.default
  const remarkParse = remarkParseMod.default
  const remarkSlug = remarkSlugMod.default
  modules = {unified, remarkParse, remarkSlug}

  const files = walk(path);

  files.forEach((file) => {
    if (!(file.endsWith('.md') || file.endsWith('.mdx'))) {
      return;
    }

    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    const updatedLines = addHeaderIDs(lines);
    fs.writeFileSync(file, updatedLines.join('\n'));
  });

}
