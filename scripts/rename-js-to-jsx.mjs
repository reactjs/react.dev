#!/usr/bin/env node
'use strict';

import fs from 'fs';
import path from 'path';
import {parse} from '@babel/parser';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'src', 'content');
const DRY_RUN = process.argv.includes('--dry-run');

// ---------------------------------------------------------------------------
// JSX detection via Babel AST
// ---------------------------------------------------------------------------

function containsJSX(code) {
  try {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx'],
      errorRecovery: true,
    });
    return walkForJSX(ast);
  } catch {
    return /<[A-Z]|<>|<\/>/.test(code);
  }
}

function walkForJSX(node, seen = new WeakSet()) {
  if (!node || typeof node !== 'object' || seen.has(node)) return false;
  seen.add(node);
  if (node.type === 'JSXElement' || node.type === 'JSXFragment') return true;
  for (const val of Object.values(node)) {
    if (Array.isArray(val)) {
      for (const item of val) {
        if (item && typeof item === 'object' && walkForJSX(item, seen))
          return true;
      }
    } else if (val && typeof val === 'object') {
      if (walkForJSX(val, seen)) return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// File discovery
// ---------------------------------------------------------------------------

function collectMDX(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...collectMDX(full));
    else if (/\.mdx?$/.test(ent.name)) out.push(full);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---------------------------------------------------------------------------
// Process one MDX file
// ---------------------------------------------------------------------------

function processFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  if (!/<Sandpack|<SandpackRSC/.test(src)) return null;

  const lines = src.split('\n');
  let changed = false;
  const renames = [];

  // 1. Find Sandpack / SandpackRSC block ranges
  const blocks = [];
  let bStart = -1;
  let bTag = null;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (bStart === -1) {
      const m = t.match(/^<(Sandpack|SandpackRSC)([\s>]|$)/);
      if (m) {
        bStart = i;
        bTag = m[1];
      }
    } else if (t === `</${bTag}>`) {
      blocks.push({start: bStart, end: i});
      bStart = -1;
      bTag = null;
    }
  }

  // 2. Process each block
  for (const block of blocks) {
    // 2a. Parse code fences
    const fences = [];
    let inFence = false;
    let fMeta = '',
      fLang = '',
      fMetaLine = -1,
      fCodeStart = -1;

    for (let i = block.start + 1; i < block.end; i++) {
      if (!inFence) {
        const m = lines[i].match(/^```(\w+)\s*(.*)$/);
        if (m) {
          inFence = true;
          fMetaLine = i;
          fLang = m[1];
          fMeta = m[2].trim();
          fCodeStart = i + 1;
        }
      } else if (lines[i].trim() === '```') {
        fences.push({
          metaLine: fMetaLine,
          codeStart: fCodeStart,
          codeEnd: i - 1,
          lang: fLang,
          meta: fMeta,
        });
        inFence = false;
      }
    }

    // 2b. Identify .js files containing JSX → build rename map
    const renameMap = new Map(); // basename.js → basename.jsx

    for (const f of fences) {
      if (f.lang !== 'js' && f.lang !== 'jsx') continue;

      const tokens = f.meta
        .split(/\s+/)
        .filter((tok) => tok && !tok.startsWith('{'));
      const jsName = tokens.find((tok) => tok.endsWith('.js'));
      if (!jsName) continue;

      const code =
        f.codeStart <= f.codeEnd
          ? lines.slice(f.codeStart, f.codeEnd + 1).join('\n')
          : '';
      if (!code.trim()) continue;

      if (containsJSX(code)) {
        const base = path.basename(jsName);
        renameMap.set(base, base.replace(/\.js$/, '.jsx'));

        const newName = jsName.replace(/\.js$/, '.jsx');
        lines[f.metaLine] = lines[f.metaLine].replace(jsName, newName);
        changed = true;
        renames.push(`${jsName} → ${newName}`);
      }
    }

    if (renameMap.size === 0) continue;

    // 2c. Update imports referencing renamed files
    for (const f of fences) {
      if (f.lang !== 'js' && f.lang !== 'jsx') continue;

      for (let i = f.codeStart; i <= f.codeEnd; i++) {
        let line = lines[i];
        for (const [oldBase, newBase] of renameMap) {
          const re = new RegExp(
            `(?<=/)${escapeRe(oldBase)}(?=['"])`,
            'g'
          );
          const updated = line.replace(re, newBase);
          if (updated !== line) {
            line = updated;
            changed = true;
          }
        }
        lines[i] = line;
      }
    }
  }

  if (!changed) return null;

  if (!DRY_RUN) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  }
  return renames;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log(
  `${DRY_RUN ? '[DRY RUN] ' : ''}Scanning ${path.relative(ROOT, CONTENT_DIR)} …\n`
);

const files = collectMDX(CONTENT_DIR);
let modCount = 0;
let renameCount = 0;

for (const f of files) {
  const result = processFile(f);
  if (result) {
    modCount++;
    renameCount += result.length;
    console.log(path.relative(ROOT, f));
    for (const r of result) console.log(`  ${r}`);
  }
}

console.log(
  `\n${DRY_RUN ? 'Would modify' : 'Modified'} ${modCount} file(s), ${renameCount} rename(s).`
);
