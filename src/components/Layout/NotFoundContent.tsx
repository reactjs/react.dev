/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

import PageHeading from 'components/PageHeading';
import Intro from 'components/MDX/Intro';
import Link from 'components/MDX/Link';
import {Footer} from './Footer';
import {getRouteMeta} from './getRouteMeta';
import type {RouteItem} from './getRouteMeta';

export function NotFoundContent({
  routeTree,
  sectionPath,
}: {
  routeTree: RouteItem;
  sectionPath: string;
}) {
  const {breadcrumbs} = getRouteMeta(sectionPath, routeTree);
  return (
    <main className="min-w-0 isolate">
      <article className="font-normal break-words text-primary dark:text-primary-dark">
        <div className="ps-0">
          <div>
            <PageHeading title="Not Found" breadcrumbs={breadcrumbs} />
          </div>
          <div className="px-5 sm:px-12">
            <div className="max-w-7xl mx-auto">
              <Intro>
                <p>This page doesn’t exist.</p>
                <p>
                  If this is a mistake,{' '}
                  <Link href="https://github.com/reactjs/react.dev/issues/new">
                    let us know
                  </Link>
                  , and we will try to fix it!
                </p>
              </Intro>
            </div>
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
  );
}
