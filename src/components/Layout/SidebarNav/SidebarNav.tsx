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

declare global {
  interface Window {
    __theme: string;
    __setPreferredTheme: (theme: string) => void;
  }
}

export default function SidebarNav({
  routeTree,
  breadcrumbs,
}: {
  routeTree: RouteItem;
  breadcrumbs: RouteItem[];
}) {
  // HACK. Fix up the data structures instead.
  if ((routeTree as any).routes.length === 1) {
    routeTree = (routeTree as any).routes[0];
  }

  return (
    <div
      className={cn(
        'sticky top-0 flex flex-col lg:bottom-0 lg:h-[calc(100vh-4rem)]'
      )}>
      <div
        className="no-bg-scrollbar grow overflow-y-scroll bg-wash dark:bg-wash-dark lg:w-[342px]"
        style={{
          overscrollBehavior: 'contain',
        }}>
        <aside
          className={cn(
            `z-10 hidden w-full flex-col pb-8 lg:block lg:max-w-xs lg:grow lg:pb-0`
          )}>
          <nav
            role="navigation"
            style={{'--bg-opacity': '.2'} as React.CSSProperties} // Need to cast here because CSS vars aren't considered valid in TS types (cuz they could be anything)
            className="scrolling-touch scrolling-gpu w-full grow pr-0 pt-6 md:pt-4 lg:h-auto lg:pr-5 lg:pb-16 lg:pt-4">
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
}
