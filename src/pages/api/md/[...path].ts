/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {NextApiRequest, NextApiResponse} from 'next';
import fs from 'fs';
import path from 'path';

import remark from 'remark';
import visit from 'unist-util-visit';

const CONTENT_ROOT = path.join(process.cwd(), 'src/content');
const NOOP_ORIGIN = 'https://noop';

function rewriteInternalLinks(markdown: string): string {
  const processor = remark().use(() => (tree) => {
    visit(tree, 'link', (node: unknown) => {
      if (typeof node !== 'object' || node === null || !('url' in node)) {
        return;
      }
      if (typeof node.url !== 'string') {
        return;
      }

      if (!node.url.startsWith('/')) {
        return;
      }

      let url: URL;
      try {
        url = new URL(node.url, NOOP_ORIGIN);
      } catch {
        return;
      }

      const pathname = url.pathname;

      // Skip links that already have a file extension (e.g. .png, .svg)
      if (/\.\w+$/.test(pathname)) {
        return;
      }

      url.pathname = pathname.endsWith('/')
        ? `${pathname.slice(0, -1)}.md`
        : `${pathname}.md`;

      node.url = url.toString().replace(NOOP_ORIGIN, '');
    });
  });

  return processor.processSync(markdown).toString();
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const pathSegments = req.query.path;
  if (!pathSegments) {
    return res.status(404).send('Not found');
  }

  const filePath = Array.isArray(pathSegments)
    ? pathSegments.join('/')
    : pathSegments;

  // Block /index.md URLs - use /foo.md instead of /foo/index.md
  if (filePath.endsWith('/index') || filePath === 'index') {
    return res.status(404).send('Not found');
  }

  // Try exact path first, then with /index
  const candidates = [
    path.join(CONTENT_ROOT, filePath + '.md'),
    path.join(CONTENT_ROOT, filePath, 'index.md'),
  ];

  for (const candidate of candidates) {
    const fullPath = path.resolve(candidate);
    if (!fullPath.startsWith(CONTENT_ROOT + path.sep)) {
      continue;
    }

    try {
      const raw = fs.readFileSync(fullPath, 'utf8');
      const content = rewriteInternalLinks(raw);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.status(200).send(content);
    } catch {
      // Try next candidate
    }
  }

  res.status(404).send('Not found');
}
