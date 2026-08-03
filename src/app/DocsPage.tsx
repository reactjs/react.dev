/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

import {Page, type PageSection} from 'components/Layout/Page';
import {useDeserializedMDX} from 'components/Layout/useDeserializedMDX';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import type {PageData} from 'lib/readMarkdownPage';

interface DocsPageProps {
  data: PageData;
  pathname: string;
  section: PageSection;
  routeTree: RouteItem;
}

export function DocsPage({data, pathname, section, routeTree}: DocsPageProps) {
  const {parsedContent, parsedToc} = useDeserializedMDX(data.content, data.toc);
  return (
    <Page
      toc={parsedToc}
      routeTree={routeTree}
      meta={data.meta}
      section={section}
      pathname={pathname}
      languages={data.languages}>
      {parsedContent}
    </Page>
  );
}
