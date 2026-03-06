/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Page} from 'components/Layout/Page';
import {notFound} from 'next/navigation';
import {
  getDocsPageData,
  getDocsStaticParams,
  MissingMarkdownContentError,
} from 'utils/content';

export async function generateStaticParams() {
  return getDocsStaticParams();
}

export default async function MarkdownPage({
  params,
}: {
  params: Promise<{markdownPath?: string[]}>;
}) {
  const {markdownPath} = await params;
  let pageData;

  try {
    pageData = await getDocsPageData(markdownPath);
  } catch (error) {
    if (error instanceof MissingMarkdownContentError) {
      notFound();
    }

    throw error;
  }

  return (
    <Page
      pathname={pageData.pathname}
      toc={pageData.toc}
      routeTree={pageData.routeTree}
      meta={pageData.meta}
      section={pageData.section}
      languages={pageData.languages}>
      {pageData.content}
    </Page>
  );
}
