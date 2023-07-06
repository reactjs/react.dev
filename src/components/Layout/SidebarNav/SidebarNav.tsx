/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Suspense} from 'react';
import * as React from 'react';
import cn from 'classnames';
import {Search} from 'components/Search';
import {Feedback} from '../Feedback';
import {SidebarRouteTree} from '../Sidebar/SidebarRouteTree';
import type {RouteItem} from '../getRouteMeta';
import {IconHamburger} from '../../Icon/IconHamburger';
import {IconClose} from '../../Icon/IconClose';

declare global {
  interface Window {
    __theme: string;
    __setPreferredTheme: (theme: string) => void;
  }
}
export default function SidebarNav({
  routeTree,
  breadcrumbs,
  isExpanded,
  toggleLeftSideBar,
}: {
  routeTree: RouteItem;
  breadcrumbs: RouteItem[];
  isExpanded: boolean;
  toggleLeftSideBar: () => void;
}) {
  // HACK. Fix up the data structures instead.
  if ((routeTree as any).routes.length === 1) {
    routeTree = (routeTree as any).routes[0];
  }
  // Minimized if !isExpanded
  if (isExpanded) {
    return (
      <div
        className={cn(
          'sticky top-0 lg:bottom-0 lg:h-[calc(100vh-4rem)] flex flex-col'
        )}>
        <button
          type="button"
          aria-label="Close Sidebar"
          onClick={toggleLeftSideBar}
          className={cn(
            'absolute top-5 right-6 z-10 active:scale-95 transition-transform flex rounded-full items-center' +
              ' justify-center hover:bg-primary/5 hover:dark:bg-primary-dark/5 outline-link'
          )}>
          <IconClose />
        </button>
        <div
          className="overflow-y-scroll no-bg-scrollbar lg:w-[342px] grow bg-wash dark:bg-wash-dark"
          style={{
            overscrollBehavior: 'contain',
          }}>
          <aside
            className={cn(
              `lg:grow flex-col w-full pb-8 lg:pb-0 lg:max-w-xs z-10 hidden lg:block`
            )}>
            <nav
              role="navigation"
              style={{'--bg-opacity': '.2'} as React.CSSProperties} // Need to cast here because CSS vars aren't considered valid in TS types (cuz they could be anything)
              className="w-full lg:h-auto grow pr-0 lg:pr-5 pt-6 lg:pb-16 md:pt-4 lg:pt-4 scrolling-touch scrolling-gpu">
              {/* No fallback UI so need to be careful not to suspend directly inside. */}
              <Suspense fallback={null}>
                <SidebarRouteTree
                  routeTree={routeTree}
                  breadcrumbs={breadcrumbs}
                  isForceExpanded={false}
                />
              </Suspense>
              <div className="h-20" />
            </nav>
            <div className="fixed bottom-0 hidden lg:block">
              <Feedback />
            </div>
          </aside>
        </div>
      </div>
    );
  } else {
    return (
      <div className={cn('sticky top-0 lg:bottom-0 ')}>
        <div
          className="w-full scrolling-touch
             scrolling-gpu flex flex-row justify-center">
          <button
            type="button"
            aria-label="Menu"
            onClick={toggleLeftSideBar}
            className={cn(
              'active:scale-95 transition-transform flex w-12 h-12 rounded-full items-center justify-center hover:bg-primary/5 hover:dark:bg-primary-dark/5 outline-link'
            )}>
            <IconHamburger />
          </button>
        </div>
      </div>
    );
  }
}
