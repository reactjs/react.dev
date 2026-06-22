/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import 'server-only';
import fs from 'fs';
import path from 'path';
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
 */
export async function readMarkdownPage(segments: string[]): Promise<PageData> {
  const routePath = segments.join('/') || 'index';
  let mdx: string;
  try {
    mdx = fs.readFileSync(path.join(ROOT, routePath + '.md'), 'utf8');
  } catch {
    mdx = fs.readFileSync(path.join(ROOT, routePath, 'index.md'), 'utf8');
  }
  const {toc, content, meta, languages} = await compileMDX(mdx, routePath, {});
  return {toc, content, meta, languages};
}
