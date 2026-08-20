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
import {buildPageMetadata, getPageUrls} from 'lib/buildPageMetadata';
import {DocsPage} from './DocsPage';
import {HomeContent} from 'components/Layout/HomeContent';

export async function generateMetadata(): Promise<Metadata> {
  const data = await readMarkdownPage([]);
  if (!data) return {};
  return buildPageMetadata({data, pathname: '/', section: 'home'});
}

function HomePageUrlMetadata() {
  const {canonicalUrl, languages} = getPageUrls('/');
  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      {Object.entries(languages).map(([language, url]) => (
        <link key={language} rel="alternate" hrefLang={language} href={url} />
      ))}
      <meta property="og:url" content={canonicalUrl} />
    </>
  );
}

export default async function HomePage() {
  const data = await readMarkdownPage([]);
  if (!data) notFound();
  return (
    <>
      <HomePageUrlMetadata />
      <DocsPage
        data={data}
        pathname="/"
        section="home"
        routeTree={sidebarHome as RouteItem}>
        <HomeContent />
      </DocsPage>
    </>
  );
}
