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
import {ExternalLink} from 'components/ExternalLink';
import {siteConfig} from 'siteConfig';

import(/* webpackPrefetch: true */ '../MDX/CodeBlock/CodeBlock');

function getGithubEditUrl(path: string): string {
  return `${siteConfig.editUrl}/../content${path}.md`;
}

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
                  <div className="flex justify-center lg:justify-start px-4 md:px-5">
                    <ExternalLink
                      href={getGithubEditUrl(cleanedPath)}
                      className="flex flex-row border-b border-transparent hover:border-gray-10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 mr-2">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                      Edit on Github
                    </ExternalLink>
                  </div>
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
