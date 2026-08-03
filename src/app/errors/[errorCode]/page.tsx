/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Metadata} from 'next';
import {listErrorCodes, loadErrorDecoderData} from 'lib/loadErrorDecoderData';
import {ErrorDecoderView} from '../ErrorDecoderView';

interface PageProps {
  params: Promise<{errorCode: string}>;
}

export async function generateStaticParams() {
  const codes = await listErrorCodes();
  return codes.map((errorCode) => ({errorCode}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {errorCode} = await params;
  return {title: `Minified React error #${errorCode}`};
}

export default async function ErrorDecoderPage({params}: PageProps) {
  const {errorCode} = await params;
  const data = await loadErrorDecoderData(errorCode);
  return <ErrorDecoderView data={data} pathname={`/errors/${errorCode}`} />;
}
