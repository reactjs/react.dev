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
        <div className="h-auto flex flex-col lg:flex-row">
          <div className="sticky top-0 py-0 lg:w-80 flex-none lg:static shadow lg:shadow-none z-50">
            <Nav />
          </div>

          {/* No fallback UI so need to be careful not to suspend directly inside. */}
          <React.Suspense fallback={null}>
            <div className="flex flex-1 w-full h-full self-stretch min-w-0">
              <main className="w-full self-stretch h-full mx-auto relative w-full min-w-0">
                <article key={asPath}>{children}</article>
                <Footer />
              </main>
            </div>
          </React.Suspense>

          <div className="lg:w-80 flex-none lg:max-w-xs hidden 2xl:block">
            {toc.length > 0 && <Toc headings={toc} />}
          </div>
        </div>
      </SidebarContext.Provider>
    </>
  );
}
