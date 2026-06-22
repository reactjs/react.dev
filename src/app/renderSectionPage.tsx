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

interface RenderArgs {
  /** Segments below `src/content/`, e.g. ['learn', 'state'] or ['warnings', 'foo']. */
  segments: string[];
  section: PageSection;
  routeTree: RouteItem;
}

export async function renderSectionPage({
  segments,
  section,
  routeTree,
}: RenderArgs) {
  const data = await safeReadPage(segments);
  if (!data) notFound();
  const pathname = '/' + segments.join('/');
  return (
    <DocsPage
      data={data}
      pathname={pathname}
      section={section}
      routeTree={routeTree}
    />
  );
}

export async function sectionPageMetadata({
  segments,
  section,
}: {
  segments: string[];
  section: PageSection;
}): Promise<Metadata> {
  const data = await safeReadPage(segments);
  if (!data) return {};
  const pathname = '/' + segments.join('/');
  return buildPageMetadata({data, pathname, section});
}

async function safeReadPage(segments: string[]) {
  try {
    return await readMarkdownPage(segments);
  } catch (err) {
    console.error(
      '[renderSectionPage] readMarkdownPage failed for',
      segments,
      err
    );
    return null;
  }
}
