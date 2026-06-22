/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import path from 'path';
import {NextResponse} from 'next/server';

const FOOTER = `
---

## Sitemap

[Overview of all docs pages](/llms.txt)
`;

export async function GET(
  _req: Request,
  ctx: {params: Promise<{path: string[]}>}
) {
  const {path: pathSegments} = await ctx.params;
  if (!pathSegments || pathSegments.length === 0) {
    return new NextResponse('Not found', {status: 404});
  }

  const filePath = pathSegments.join('/');

  // Block /index.md URLs - use /foo.md instead of /foo/index.md
  if (filePath.endsWith('/index') || filePath === 'index') {
    return new NextResponse('Not found', {status: 404});
  }

  const candidates = [
    path.join(process.cwd(), 'src/content', filePath + '.md'),
    path.join(process.cwd(), 'src/content', filePath, 'index.md'),
  ];

  for (const fullPath of candidates) {
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      return new NextResponse(content + FOOTER, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch {
      // Try next candidate
    }
  }

  return new NextResponse('Not found', {status: 404});
}
