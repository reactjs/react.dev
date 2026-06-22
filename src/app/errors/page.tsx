/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Metadata} from 'next';
import {loadErrorDecoderData} from 'lib/loadErrorDecoderData';
import {ErrorDecoderView} from './ErrorDecoderView';

export const metadata: Metadata = {
  title: 'Minified Error Decoder',
};

export default async function ErrorDecoderIndex() {
  'use cache';
  const data = await loadErrorDecoderData(null);
  return <ErrorDecoderView data={data} pathname="/errors" />;
}
