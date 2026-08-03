/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

import {Suspense} from 'react';
import * as React from 'react';
import {Footer} from './Footer';
import {Toc} from './Toc';
import {DocsPageFooter} from 'components/DocsFooter';
import PageHeading from 'components/PageHeading';
import {getRouteMeta} from './getRouteMeta';
import {useDeserializedMDX} from './useDeserializedMDX';
import {TocContext} from '../MDX/TocContext';
import {LanguagesContext} from '../MDX/LanguagesContext';
import type {RouteItem} from './getRouteMeta';
import type {PageData} from 'lib/readMarkdownPage';

import(/* webpackPrefetch: true */ '../MDX/CodeBlock/CodeBlock');

export function DocsContent({
  data,
  pathname,
  routeTree,
}: {
  data: PageData;
  pathname: string;
  routeTree: RouteItem;
}) {
  const {parsedContent, parsedToc} = useDeserializedMDX(data.content, data.toc);
  const {route, nextRoute, prevRoute, breadcrumbs} = getRouteMeta(
    pathname,
    routeTree
  );
  const title = data.meta.title || route?.title || '';
  const version = data.meta.version;
  const description = data.meta.description || route?.description || '';

  return (
    <>
      {/* No fallback UI so need to be careful not to suspend directly inside. */}
      <Suspense fallback={null}>
        <main className="min-w-0 isolate">
          <article
            className="font-normal break-words text-primary dark:text-primary-dark"
            key={pathname}>
            <div className="ps-0">
              <div>
                <PageHeading
                  title={title}
                  version={version}
                  description={description}
                  tags={route?.tags}
                  breadcrumbs={breadcrumbs}
                />
              </div>
              <div className="px-5 sm:px-12">
                <div className="max-w-7xl mx-auto">
                  <TocContext value={parsedToc}>
                    <LanguagesContext value={data.languages}>
                      {parsedContent}
                    </LanguagesContext>
                  </TocContext>
                </div>
                <DocsPageFooter
                  route={route}
                  nextRoute={nextRoute}
                  prevRoute={prevRoute}
                />
              </div>
            </div>
          </article>
          <div className="self-stretch w-full">
            <div className="w-full px-5 pt-10 mx-auto sm:px-12 md:px-12 md:pt-12 lg:pt-10">
              <hr className="mx-auto max-w-7xl border-border dark:border-border-dark" />
            </div>
            <div className="py-12 px-5 sm:px-12 md:px-12 sm:py-12 md:py-16 lg:py-14">
              <Footer />
            </div>
          </div>
        </main>
      </Suspense>
      <div className="hidden -mt-16 lg:max-w-custom-xs 2xl:block">
        {parsedToc.length > 0 && <Toc headings={parsedToc} key={pathname} />}
      </div>
    </>
  );
}
