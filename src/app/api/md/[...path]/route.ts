/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getMarkdownApiContent} from 'utils/content';

export async function GET(
  _request: Request,
  {params}: {params: Promise<{path?: string[]}>}
) {
  const {path} = await params;
  const content = await getMarkdownApiContent(path);

  if (content == null) {
    return new Response('Not found', {status: 404});
  }

  return new Response(content, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
