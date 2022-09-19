/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {useRouter} from 'next/router';
import {Nav} from './Nav';
import {RouteItem, SidebarContext} from './useRouteMeta';
import {useActiveSection} from 'hooks/useActiveSection';
import {Footer} from './Footer';
import {Toc} from './Toc';
import SocialBanner from '../SocialBanner';
import sidebarHome from '../../sidebarHome.json';
import sidebarLearn from '../../sidebarLearn.json';
import sidebarReference from '../../sidebarReference.json';
import type {TocItem} from 'components/MDX/TocContext';

interface PageProps {
  children: React.ReactNode;
  toc: Array<TocItem>;
}

export function Page({children, toc}: PageProps) {
  const {asPath} = useRouter();
  const section = useActiveSection();
  let routeTree = sidebarHome as RouteItem;
  switch (section) {
    case 'apis':
      routeTree = sidebarReference as RouteItem;
      break;
    case 'learn':
      routeTree = sidebarLearn as RouteItem;
      break;
  }
  return (
    <>
      <SocialBanner />
      <SidebarContext.Provider value={routeTree}>
        <div className="grid grid-cols-only-content lg:grid-cols-sidebar-content 2xl:grid-cols-sidebar-content-toc">
          <div className="fixed lg:sticky top-0 left-0 right-0 py-0 shadow lg:shadow-none z-50">
            <Nav />
          </div>
          {/* No fallback UI so need to be careful not to suspend directly inside. */}
          <React.Suspense fallback={null}>
            <main className="min-w-0">
              <div className="lg:hidden h-16 mb-2" />
              <article className="break-words" key={asPath}>
                {children}
              </article>
              <Footer />
            </main>
          </React.Suspense>
          <div className="hidden lg:max-w-xs 2xl:block">
            {toc.length > 0 && <Toc headings={toc} key={asPath} />}
          </div>
        </div>
      </SidebarContext.Provider>
    </>
  );
}
