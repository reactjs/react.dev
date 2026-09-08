/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Page, type PageSection} from 'components/Layout/Page';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import type {PageData} from 'lib/readMarkdownPage';
import {renderCompiledMDX} from 'utils/compileMDX';
import type {ReactNode} from 'react';

interface DocsPageProps {
  data: PageData;
  pathname: string;
  section: PageSection;
  routeTree: RouteItem;
  children?: ReactNode;
}

export async function DocsPage({
  data,
  pathname,
  section,
  routeTree,
  children,
}: DocsPageProps) {
  const {content, toc} = await renderCompiledMDX(data);
  return (
    <Page
      toc={toc}
      routeTree={routeTree}
      meta={data.meta}
      section={section}
      pathname={pathname}
      showCopyPage>
      {children ?? content}
    </Page>
  );
}
