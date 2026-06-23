/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import 'server-only';
import fs from 'fs';
import path from 'path';
import {promisify} from 'util';
import {cacheLife} from 'next/cache';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const ROOT = path.join(process.cwd(), 'src/content');
const DEV_ONLY_PAGES = new Set(['learn/rsc-sandbox-test']);

async function getFiles(dir: string, base: string): Promise<string[]> {
  const subdirs = await readdir(dir);
  const files = await Promise.all(
    subdirs.map(async (subdir) => {
      const res = path.resolve(dir, subdir);
      return (await stat(res)).isDirectory()
        ? getFiles(res, base)
        : res.slice(base.length + 1);
    })
  );
  return files.flat().filter((file) => file.endsWith('.md'));
}

function getSegments(file: string): string[] {
  const segments = file.slice(0, -3).replace(/\\/g, '/').split('/');
  if (segments[segments.length - 1] === 'index') {
    segments.pop();
  }
  return segments;
}

/**
 * Collect all content paths under a top-level section folder.
 * Returns each path as an array of segments, *without* the section prefix.
 *
 * Example: for section="learn", returns [['state'], ['state', 'managing-state'], ...]
 */
export async function collectSectionPaths(
  section: string
): Promise<string[][]> {
  'use cache';
  cacheLife('max');
  const dir = path.join(ROOT, section);
  if (!fs.existsSync(dir)) return [];
  const files = await getFiles(dir, dir);
  return files
    .map((file) => getSegments(file))
    .filter((segments) => {
      if (process.env.NODE_ENV !== 'production') return true;
      return !DEV_ONLY_PAGES.has([section, ...segments].join('/'));
    });
}

/**
 * Collect a flat list of slugs (one segment) for a top-level section
 * that only contains direct `.md` files (no subdirectories), e.g. `warnings/`.
 */
export async function collectFlatSectionSlugs(
  section: string
): Promise<string[]> {
  'use cache';
  cacheLife('max');
  const dir = path.join(ROOT, section);
  if (!fs.existsSync(dir)) return [];
  const entries = await readdir(dir);
  return entries
    .filter((name) => name.endsWith('.md') && name !== 'index.md')
    .map((name) => name.slice(0, -3));
}
