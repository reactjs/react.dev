/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import type {PageSection} from 'components/Layout/Page';
import {readMarkdownPage} from 'lib/readMarkdownPage';
import {buildPageMetadata} from 'lib/buildPageMetadata';
import {DocsPage} from './DocsPage';
import {DocsContent} from 'components/Layout/DocsContent';

interface RenderArgs {
  /** Segments below `src/content/`, e.g. ['learn', 'state'] or ['warnings', 'foo']. */
  segments: string[];
  section: PageSection;
  routeTree: RouteItem;
}

async function loadSection(segments: string[]) {
  const data = await readMarkdownPage(segments);
  if (!data) notFound();
  return {data, pathname: '/' + segments.join('/')};
}

export async function renderSectionPage({
  segments,
  section,
  routeTree,
}: RenderArgs) {
  const {data, pathname} = await loadSection(segments);
  return (
    <DocsPage
      data={data}
      pathname={pathname}
      section={section}
      routeTree={routeTree}
    />
  );
}

export async function renderSectionContent({segments, routeTree}: RenderArgs) {
  const {data, pathname} = await loadSection(segments);
  return <DocsContent data={data} pathname={pathname} routeTree={routeTree} />;
}

export async function sectionPageMetadata({
  segments,
  section,
  routeTree,
}: {
  segments: string[];
  section: PageSection;
  routeTree?: RouteItem;
}): Promise<Metadata> {
  const data = await readMarkdownPage(segments);
  if (!data) return {};
  const pathname = '/' + segments.join('/');
  return buildPageMetadata({data, pathname, section, routeTree});
}
