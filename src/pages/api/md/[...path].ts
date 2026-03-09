/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {NextApiRequest, NextApiResponse} from 'next';
import {readContentFile} from '../../../utils/docs';

const FOOTER = `
---

## Sitemap

[Overview of all docs pages](/llms.txt)
`;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method not allowed');
  }

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

  const content = readContentFile(filePath);
  if (content === null) {
    return res.status(404).send('Not found');
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.status(200).send(content + FOOTER);
}
