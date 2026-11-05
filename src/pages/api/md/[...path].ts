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
    path.join(process.cwd(), 'src/content', filePath + '.md'),
    path.join(process.cwd(), 'src/content', filePath, 'index.md'),
  ];

  for (const fullPath of candidates) {
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.status(200).send(content + FOOTER);
    } catch {
      // Try next candidate
    }
  }

  res.status(404).send('Not found');
}
