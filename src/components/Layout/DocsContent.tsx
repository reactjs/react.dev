/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Footer} from './Footer';
import {Toc} from './Toc';
import {DocsPageFooter} from 'components/DocsFooter';
import PageHeading from 'components/PageHeading';
import {getRouteMeta} from './getRouteMeta';
import type {RouteItem} from './getRouteMeta';
import type {PageData} from 'lib/readMarkdownPage';
import {renderCompiledMDX} from 'utils/compileMDX';

import(/* webpackPrefetch: true */ '../MDX/CodeBlock/CodeBlock');

export async function DocsContent({
  data,
  pathname,
  routeTree,
}: {
  data: PageData;
  pathname: string;
  routeTree: RouteItem;
}) {
  const {content, toc} = await renderCompiledMDX(data);
  const {route, nextRoute, prevRoute, breadcrumbs} = getRouteMeta(
    pathname,
    routeTree
  );
  const title = data.meta.title || route?.title || '';
  const version = data.meta.version;
  const description = data.meta.description || route?.description || '';

  return (
    <>
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
              <div className="max-w-7xl mx-auto">{content}</div>
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
      <div className="hidden -mt-16 lg:max-w-custom-xs 2xl:block">
        {toc.length > 0 && <Toc headings={toc} key={pathname} />}
      </div>
    </>
  );
}
