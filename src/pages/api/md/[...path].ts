/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {NextApiRequest, NextApiResponse} from 'next';
import fs from 'fs';
import path from 'path';

const FOOTER = `
---

## Sitemap

[Overview of all docs pages](/llms.txt)
`;

// Anchor the content directory so Turbopack's NFT tracer can
// statically determine that reads are scoped to src/content.
const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

function readContentFile(relativePath: string): string | null {
  // Prevent path traversal outside CONTENT_DIR
  const resolved = path.resolve(CONTENT_DIR, relativePath);
  if (!resolved.startsWith(CONTENT_DIR + path.sep)) {
    return null;
  }
  try {
    return fs.readFileSync(resolved, 'utf8');
  } catch {
    return null;
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const pathSegments = req.query.path;
  if (!pathSegments) {
    return res.status(404).send('Not found');
  }

  const filePath = Array.isArray(pathSegments)
    ? pathSegments.join(path.sep)
    : pathSegments;

  // Block /index.md URLs - use /foo.md instead of /foo/index.md
  if (filePath.endsWith('/index') || filePath === 'index') {
    return res.status(404).send('Not found');
  }

  // Try exact path first, then with /index
  const content =
    readContentFile(filePath + '.md') ??
    readContentFile(path.join(filePath, 'index.md'));

  if (content === null) {
    return res.status(404).send('Not found');
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.status(200).send(content + FOOTER);
}
