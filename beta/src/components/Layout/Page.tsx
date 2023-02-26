/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Suspense} from 'react';
import * as React from 'react';
import {useRouter} from 'next/router';
import {Nav} from './Nav';
import {Footer} from './Footer';
import {Toc} from './Toc';
import SocialBanner from '../SocialBanner';
import {DocsPageFooter} from 'components/DocsFooter';
import {Seo} from 'components/Seo';
import PageHeading from 'components/PageHeading';
import {getRouteMeta} from './getRouteMeta';
import {TocContext} from '../MDX/TocContext';
import sidebarLearn from '../../sidebarLearn.json';
import sidebarReference from '../../sidebarReference.json';
import type {TocItem} from 'components/MDX/TocContext';
import type {RouteItem} from 'components/Layout/getRouteMeta';

import(/* webpackPrefetch: true */ '../MDX/CodeBlock/CodeBlock');

interface PageProps {
  children: React.ReactNode;
  toc: Array<TocItem>;
  routeTree: RouteItem;
  meta: {title?: string; description?: string};
  section: 'learn' | 'reference' | 'home';
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
  return (
    <>
      <SocialBanner />
      <div className="grid grid-cols-only-content lg:grid-cols-sidebar-content 2xl:grid-cols-sidebar-content-toc">
        <div className="fixed lg:sticky top-0 left-0 right-0 py-0 shadow lg:shadow-none z-50">
          <Nav
            routeTree={routeTree}
            breadcrumbs={breadcrumbs}
            section={section}
          />
        </div>
        {/* No fallback UI so need to be careful not to suspend directly inside. */}
        <Suspense fallback={null}>
          <main className="min-w-0">
            <div className="lg:hidden h-16 mb-2" />
            <article className="break-words" key={asPath}>
              <div className="pl-0">
                <Seo title={title} isHomePage={isHomePage} />
                {!isHomePage && (
                  <PageHeading
                    title={title}
                    description={description}
                    tags={route?.tags}
                    breadcrumbs={breadcrumbs}
                  />
                )}
                <div className="px-5 sm:px-12">
                  <div className="max-w-7xl mx-auto">
                    <TocContext.Provider value={toc}>
                      {children}
                    </TocContext.Provider>
                  </div>
                  <DocsPageFooter
                    route={route}
                    nextRoute={nextRoute}
                    prevRoute={prevRoute}
                  />
                </div>
              </div>
            </article>
            <Footer />
          </main>
        </Suspense>
        <div className="hidden lg:max-w-xs 2xl:block">
          {toc.length > 0 && <Toc headings={toc} key={asPath} />}
        </div>
      </div>
    </>
  );
}
