/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Suspense} from 'react';
import * as React from 'react';
import {useRouter} from 'next/router';
import {Footer} from './Footer';
import SocialBanner from '../SocialBanner';
import {Seo} from 'components/Seo';
import {getRouteMeta} from './getRouteMeta';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import ButtonLink from '../ButtonLink';
import {IconNavArrow} from '../Icon/IconNavArrow';
import {Search} from '../Search';
import {TopNav} from './TopNav';
import(/* webpackPrefetch: true */ '../MDX/CodeBlock/CodeBlock');

interface PageProps {
  routeTree: RouteItem;
  meta: {title?: string; description?: string};
}

export function HomePage({routeTree, meta}: PageProps) {
  const {asPath} = useRouter();
  const cleanedPath = asPath.split(/[\?\#]/)[0];
  const {route, nextRoute, prevRoute, breadcrumbs} = getRouteMeta(
    cleanedPath,
    routeTree
  );
  const title = meta.title || route?.title || '';
  return (
    <>
      <SocialBanner />
      <TopNav routeTree={routeTree} breadcrumbs={breadcrumbs} />
      {/* No fallback UI so need to be careful not to suspend directly inside. */}
      <Suspense fallback={null}>
        <main className="min-w-0">
          <div className="lg:hidden h-16 mb-2" />
          <article className="break-words" key={asPath}>
            <div className="pl-0">
              <Seo title={title} isHomePage={true} />
              <div className="px-5 sm:px-12">
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col justify-center items-center m-16">
                    <h1 className="text-6xl text-center flex wrap font-bold leading-tight text-primary dark:text-primary-dark">
                      The library for user interfaces
                    </h1>
                    <h2 className="text-xl mt-2 text-center flex wrap leading-tight text-primary dark:text-primary-dark">
                      Neque porro quisquam est qui dolorem ipsum quia dolor sit
                      amet, consectetur, adipisci velit...
                    </h2>
                    <div className="flex-col-reverse md:flex-row flex mt-4 md:mt-16">
                      <div>
                        <ButtonLink
                          href="/learn"
                          className="w-full mt-4 md:mt-0"
                          type="primary"
                          size="md">
                          Learn React
                          <IconNavArrow
                            displayDirection="right"
                            className="inline ml-1"
                          />
                        </ButtonLink>
                      </div>
                      <div className=" w-72 md:ml-4">
                        <Search fullsize />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
          <Footer hideSurvey />
        </main>
      </Suspense>
    </>
  );
}
