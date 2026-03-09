/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {generateLlmsText} from 'utils/llms';

export async function GET() {
  return new Response(generateLlmsText(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
