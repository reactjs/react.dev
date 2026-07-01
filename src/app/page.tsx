/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import sidebarHome from '../sidebarHome.json';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import {readMarkdownPage} from 'lib/readMarkdownPage';
import {buildPageMetadata} from 'lib/buildPageMetadata';
import {DocsPage} from './DocsPage';

export async function generateMetadata(): Promise<Metadata> {
  const data = await readMarkdownPage([]);
  if (!data) return {};
  return buildPageMetadata({data, pathname: '/', section: 'home'});
}

export default async function HomePage() {
  const data = await readMarkdownPage([]);
  if (!data) notFound();
  return (
    <DocsPage
      data={data}
      pathname="/"
      section="home"
      routeTree={sidebarHome as RouteItem}
    />
  );
}
