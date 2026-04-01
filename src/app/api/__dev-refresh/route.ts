/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {NextResponse} from 'next/server';
import {revalidateTag} from 'next/cache';
import {DEV_CONTENT_CACHE_TAG} from 'utils/content';

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ok: false}, {status: 404});
  }

  revalidateTag(DEV_CONTENT_CACHE_TAG, 'max');
  return NextResponse.json({ok: true});
}
