/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * App Router-aware bundle-size analysis.
 *
 * Modeled on Next.js's own `next-stats-action`: sum the gzipped sizes of
 * groups of build-output files and compare a PR build against the base branch.
 * Unlike `nextjs-bundle-analysis`, this reads the real build output
 * (`build-manifest.json` + `.next/static`) rather than the Pages-Router-only
 * `build-manifest.json.pages`, which the App Router leaves empty.
 *
 * Usage:
 *   node scripts/analyzeBundle.mjs report    # writes the current build's stats
 *   node scripts/analyzeBundle.mjs compare   # diffs against the base-branch stats
 *
 * `report`  -> .next/analyze/__bundle_analysis.json   (uploaded as an artifact)
 * `compare` -> .next/analyze/__bundle_analysis_comment.txt  (posted by
 *              analyze_comment.yml). The base-branch artifact is expected under
 *              .next/analyze/base/bundle/ (downloaded by analyze.yml).
 */

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const nextDir = path.join(root, '.next');
const analyzeDir = path.join(nextDir, 'analyze');
const statsFile = path.join(analyzeDir, '__bundle_analysis.json');
const baseDir = path.join(analyzeDir, 'base', 'bundle');
const commentFile = path.join(analyzeDir, '__bundle_analysis_comment.txt');

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  let out = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walk(p));
    else out.push(p);
  }
  return out;
}

function sumGroup(files) {
  let raw = 0;
  let gzip = 0;
  for (const file of files) {
    const buf = fs.readFileSync(file);
    raw += buf.length;
    gzip += zlib.gzipSync(buf).length;
  }
  return {raw, gzip, count: files.length};
}

function report() {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(nextDir, 'build-manifest.json'), 'utf8')
  );
  // The shared bundle that loads on every page (App Router: rootMainFiles).
  const globalFiles = [
    ...(manifest.rootMainFiles || []),
    ...(manifest.polyfillFiles || []),
  ]
    .map((f) => path.join(nextDir, f))
    .filter((f) => fs.existsSync(f));
  const jsFiles = walk(path.join(nextDir, 'static', 'chunks')).filter((f) =>
    f.endsWith('.js')
  );
  const cssFiles = walk(path.join(nextDir, 'static', 'css')).filter((f) =>
    f.endsWith('.css')
  );

  const stats = {
    'Global (loads on every page)': sumGroup(globalFiles),
    'Total JS': sumGroup(jsFiles),
    'Total CSS': sumGroup(cssFiles),
  };

  fs.mkdirSync(analyzeDir, {recursive: true});
  fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
  console.log('Wrote', path.relative(root, statsFile));
  for (const [name, v] of Object.entries(stats)) {
    console.log(`  ${name}: ${formatBytes(v.gzip)} gzip (${v.count} files)`);
  }
}

function formatBytes(bytes) {
  if (Math.abs(bytes) >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }
  return `${(bytes / 1024).toFixed(2)} KB`;
}

function formatDelta(cur, base) {
  const d = cur - base;
  if (d === 0) return 'no change';
  return `${d > 0 ? '🔺 +' : '🟢 -'}${formatBytes(Math.abs(d))}`;
}

// New format: every value is {raw, gzip, count}. The old nextjs-bundle-analysis
// artifact was {"/_app": {raw, gzip}, "__global": {...}} with no `count`.
function isNewFormat(obj) {
  const vals = obj && typeof obj === 'object' ? Object.values(obj) : [];
  return (
    vals.length > 0 &&
    vals.every((v) => v && typeof v.gzip === 'number' && typeof v.count === 'number')
  );
}

function loadBaseStats() {
  if (!fs.existsSync(baseDir)) return null;
  const jsons = fs.readdirSync(baseDir).filter((f) => f.endsWith('.json'));
  if (jsons.length === 0) return null;
  try {
    return JSON.parse(fs.readFileSync(path.join(baseDir, jsons[0]), 'utf8'));
  } catch {
    return null;
  }
}

function compare() {
  const cur = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
  const base = loadBaseStats();

  let md;
  if (base && isNewFormat(base)) {
    md =
      '| Metric | Size (gzip) | Change vs base |\n|---|---|---|\n' +
      Object.entries(cur)
        .map(([name, v]) => {
          const b = base[name];
          const change = b ? formatDelta(v.gzip, b.gzip) : '— (new)';
          return `| ${name} | ${formatBytes(v.gzip)} | ${change} |`;
        })
        .join('\n') +
      '\n';
  } else {
    md =
      '_No comparable base-branch data yet — the base branch has not produced ' +
      'stats in this format. Showing current sizes only; deltas will appear on ' +
      'the next run after this lands on the base branch._\n\n' +
      '| Metric | Size (gzip) |\n|---|---|\n' +
      Object.entries(cur)
        .map(([name, v]) => `| ${name} | ${formatBytes(v.gzip)} |`)
        .join('\n') +
      '\n';
  }

  fs.mkdirSync(analyzeDir, {recursive: true});
  fs.writeFileSync(commentFile, md);
  console.log(md);
}

const mode = process.argv[2];
if (mode === 'report') {
  report();
} else if (mode === 'compare') {
  compare();
} else {
  console.error('Usage: node scripts/analyzeBundle.mjs <report|compare>');
  process.exit(1);
}
