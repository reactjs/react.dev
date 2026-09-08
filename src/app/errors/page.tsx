/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Metadata} from 'next';
import {buildPageMetadata} from 'lib/buildPageMetadata';
import {loadErrorDecoderData} from 'lib/loadErrorDecoderData';
import {ErrorDecoderView} from './ErrorDecoderView';

export async function generateMetadata(): Promise<Metadata> {
  const data = await loadErrorDecoderData(null);
  return buildPageMetadata({
    data,
    pathname: '/errors',
    section: 'unknown',
    title: 'Minified Error Decoder',
  });
}

export default async function ErrorDecoderIndex() {
  const data = await loadErrorDecoderData(null);
  return <ErrorDecoderView data={data} pathname="/errors" />;
}
