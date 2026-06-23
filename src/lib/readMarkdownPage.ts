/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import 'server-only';
import fs from 'fs/promises';
import path from 'path';
import {cacheLife} from 'next/cache';
import compileMDX from 'utils/compileMDX';

export interface PageData {
  content: string;
  toc: string;
  meta: any;
  languages: any;
}

const ROOT = path.join(process.cwd(), 'src/content');

/**
 * Read and compile an MDX page from src/content. Resolves either
 * `<segments>.md` or `<segments>/index.md`. Throws if neither exists.
 *
 * Cached at this layer (keyed on `segments`) so the page render and its
 * `generateMetadata` share one compile, and so callers don't each need
 * their own `'use cache'`. Content only changes on deploy, so `'max'`.
 */
export async function readMarkdownPage(segments: string[]): Promise<PageData> {
  'use cache';
  cacheLife('max');
  const routePath = segments.join('/') || 'index';
  let mdx: string;
  try {
    mdx = await fs.readFile(path.join(ROOT, routePath + '.md'), 'utf8');
  } catch {
    mdx = await fs.readFile(path.join(ROOT, routePath, 'index.md'), 'utf8');
  }
  const {toc, content, meta, languages} = await compileMDX(mdx, routePath, {});
  return {toc, content, meta, languages};
}
