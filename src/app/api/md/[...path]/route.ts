/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import path from 'path';
import {NextResponse} from 'next/server';
import {cacheLife} from 'next/cache';
import {collectAllContentPaths} from 'lib/collectPaths';

const FOOTER = `
---

## Sitemap

[Overview of all docs pages](/llms.txt)
`;

// The content set is fixed at build time, so prerender every `.md` endpoint
// instead of running a function per request. With Cache Components, this means
// generateStaticParams + a cached body (no `dynamic`/`dynamicParams` configs,
// which are disallowed when cacheComponents is on).
export async function generateStaticParams() {
  const paths = await collectAllContentPaths();
  return paths.map((segments) => ({path: segments}));
}

/**
 * Read a markdown file for the given URL segments. Cached so prerendered
 * `.md` endpoints don't re-read from disk per request. Returns null when no
 * matching file exists.
 */
async function readContentMarkdown(
  pathSegments: string[] | undefined
): Promise<string | null> {
  'use cache';
  cacheLife('max');
  if (!pathSegments || pathSegments.length === 0) return null;

  const filePath = pathSegments.join('/');
  // Block /index.md URLs - use /foo.md instead of /foo/index.md
  if (filePath.endsWith('/index') || filePath === 'index') return null;

  const candidates = [
    path.join(process.cwd(), 'src/content', filePath + '.md'),
    path.join(process.cwd(), 'src/content', filePath, 'index.md'),
  ];
  for (const fullPath of candidates) {
    try {
      return fs.readFileSync(fullPath, 'utf8');
    } catch {
      // Try next candidate
    }
  }
  return null;
}

export async function GET(
  _req: Request,
  ctx: {params: Promise<{path: string[]}>}
) {
  const {path: pathSegments} = await ctx.params;
  const content = await readContentMarkdown(pathSegments);
  if (content == null) {
    return new NextResponse('Not found', {status: 404});
  }
  return new NextResponse(content + FOOTER, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
