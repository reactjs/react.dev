/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Suspense} from 'react';
import * as React from 'react';
import {useRouter} from 'next/router';
import {SidebarNav} from './SidebarNav';
import {Footer} from './Footer';
import {Toc} from './Toc';
import SocialBanner from '../SocialBanner';
import {DocsPageFooter} from 'components/DocsFooter';
import {Seo} from 'components/Seo';
import PageHeading from 'components/PageHeading';
import {getRouteMeta} from './getRouteMeta';
import {TocContext} from '../MDX/TocContext';
import type {TocItem} from 'components/MDX/TocContext';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import {HomeContent} from './HomeContent';
import {TopNav} from './TopNav';

import(/* webpackPrefetch: true */ '../MDX/CodeBlock/CodeBlock');

interface PageProps {
  children: React.ReactNode;
  toc: Array<TocItem>;
  routeTree: RouteItem;
  meta: {title?: string; description?: string};
  section: 'learn' | 'reference' | 'community' | 'blog' | 'home';
}

export function Page({children, toc, routeTree, meta, section}: PageProps) {
  const {asPath} = useRouter();
  const cleanedPath = asPath.split(/[\?\#]/)[0];
  const {route, nextRoute, prevRoute, breadcrumbs} = getRouteMeta(
    cleanedPath,
    routeTree
  );
  const title = meta.title || route?.title || '';
  const description = meta.description || route?.description || '';
  const isHomePage = cleanedPath === '/';

  let content;
  if (isHomePage) {
    content = <HomeContent />;
  } else {
    content = (
      <div className="pl-0">
        <Seo title={title} isHomePage={isHomePage} />
        <PageHeading
          title={title}
          description={description}
          tags={route?.tags}
          breadcrumbs={breadcrumbs}
        />
        <div className="px-5 sm:px-12">
          <div className="max-w-7xl mx-auto">
            <TocContext.Provider value={toc}>{children}</TocContext.Provider>
          </div>
          <DocsPageFooter
            route={route}
            nextRoute={nextRoute}
            prevRoute={prevRoute}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo title={title} isHomePage={isHomePage} />
      <SocialBanner />
      <TopNav
        section={section}
        routeTree={routeTree}
        breadcrumbs={breadcrumbs}
      />
      <div
        className={
          isHomePage
            ? ''
            : 'grid grid-cols-only-content lg:grid-cols-sidebar-content 2xl:grid-cols-sidebar-content-toc'
        }>
        <div className={'lg:-mt-20 ' + (isHomePage ? 'hidden' : '')}>
          <div className="lg:pt-20 fixed lg:sticky top-0 left-0 right-0 py-0 shadow lg:shadow-none">
            <SidebarNav routeTree={routeTree} breadcrumbs={breadcrumbs} />
          </div>
        </div>
        {/* No fallback UI so need to be careful not to suspend directly inside. */}
        <Suspense fallback={null}>
          <main className="min-w-0">
            <article className="break-words" key={asPath}>
              {content}
            </article>
            <Footer hideSurvey={isHomePage} />
          </main>
        </Suspense>
        <div className="-mt-20 hidden lg:max-w-xs 2xl:block">
          {toc.length > 0 && <Toc headings={toc} key={asPath} />}
        </div>
      </div>
    </>
  );
}
