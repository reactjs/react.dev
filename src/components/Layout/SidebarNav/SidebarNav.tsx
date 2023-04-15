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
        'sticky top-0 lg:bottom-0 lg:h-[calc(100vh-4rem)] flex flex-col'
      )}>
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
}
