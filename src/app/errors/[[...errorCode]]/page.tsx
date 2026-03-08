/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import sidebarLearn from 'sidebarLearn.json';
import {notFound} from 'next/navigation';
import {ErrorDecoderProvider} from 'components/ErrorDecoderProvider';
import {Page} from 'components/Layout/Page';
import {getErrorPageData, getErrorStaticParams} from 'utils/content';

export async function generateStaticParams() {
  return getErrorStaticParams();
}

export default async function ErrorDecoderPage({
  params,
}: {
  params: Promise<{errorCode?: string[]}>;
}) {
  const {errorCode} = await params;
  const pageData = await getErrorPageData(errorCode);

  if (pageData == null) {
    notFound();
  }

  const pathname =
    pageData.errorCode == null ? '/errors' : `/errors/${pageData.errorCode}`;

  return (
    <ErrorDecoderProvider
      errorCode={pageData.errorCode}
      errorMessage={pageData.errorMessage}>
      <Page
        pathname={pathname}
        toc={[]}
        routeTree={sidebarLearn}
        meta={{
          ...pageData.meta,
          title: pageData.errorCode
            ? `Minified React error #${pageData.errorCode}`
            : 'Minified Error Decoder',
        }}
        section="unknown">
        <div className="whitespace-pre-line">{pageData.content}</div>
      </Page>
    </ErrorDecoderProvider>
  );
}
