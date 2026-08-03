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
 * `<segments>.md` or `<segments>/index.md`. Returns null when neither exists.
 *
 * Cached at this layer (keyed on `segments`) so the page render and its
 * `generateMetadata` share one compile, and so callers don't each need
 * their own `'use cache'`. Content only changes on deploy, so `'max'`.
 *
 * Returns null (rather than throwing) for a missing file: throwing inside a
 * `'use cache'` scope surfaces as a render error instead of letting callers
 * fall through to `notFound()`.
 */
export async function readMarkdownPage(
  segments: string[]
): Promise<PageData | null> {
  'use cache';
  cacheLife('max');
  const routePath = segments.join('/') || 'index';
  let mdx: string | null = null;
  for (const candidate of [
    path.join(ROOT, routePath + '.md'),
    path.join(ROOT, routePath, 'index.md'),
  ]) {
    try {
      mdx = await fs.readFile(candidate, 'utf8');
      break;
    } catch {
      // Try next candidate.
    }
  }
  if (mdx == null) return null;
  const {toc, content, meta, languages} = await compileMDX(mdx, routePath, {});
  return {toc, content, meta, languages};
}
