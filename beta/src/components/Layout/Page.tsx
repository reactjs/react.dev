/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {MenuProvider} from 'components/useMenu';
import * as React from 'react';
import {useRouter} from 'next/router';
import {Nav} from './Nav';
import {RouteItem, SidebarContext} from './useRouteMeta';
import {useActiveSection} from 'hooks/useActiveSection';
import {Sidebar} from './Sidebar';
import {Footer} from './Footer';
import SocialBanner from '../SocialBanner';
import sidebarHome from '../../sidebarHome.json';
import sidebarLearn from '../../sidebarLearn.json';
import sidebarReference from '../../sidebarReference.json';

interface PageProps {
  children: React.ReactNode;
}

export function Page({children}: PageProps) {
  const {query, asPath} = useRouter();
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
      <MenuProvider>
        <SidebarContext.Provider value={routeTree}>
          <div className="h-auto lg:h-screen flex flex-row">
            <div className="no-bg-scrollbar h-auto lg:h-[calc(100%-40px)] lg:overflow-y-scroll fixed flex flex-row lg:flex-col py-0 top-16 sm:top-10 left-0 right-0 lg:max-w-xs w-full shadow lg:shadow-none z-50">
              <Nav />
              <Sidebar />
            </div>

            {/* No fallback UI so need to be careful not to suspend directly inside. */}
            <React.Suspense fallback={null}>
              <div className="flex flex-1 w-full h-full self-stretch">
                <div className="w-full min-w-0">
                  <main className="flex flex-1 self-stretch mt-16 sm:mt-10 flex-col items-end justify-around">
                    <article
                      key={asPath}
                      className="h-full mx-auto relative w-full min-w-0">
                      {children}
                    </article>
                    <Footer />
                  </main>
                </div>
              </div>
            </React.Suspense>
          </div>
        </SidebarContext.Provider>
      </MenuProvider>
    </>
  );
}
