/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Suspense} from 'react';
import * as React from 'react';
import cn from 'classnames';
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
        'sticky top-0 md:bottom-0 md:h-[calc(100vh-4rem)] flex flex-col'
      )}>
      <div
        className="overflow-y-scroll no-bg-scrollbar md:w-full grow bg-wash dark:bg-wash-dark"
        style={{
          overscrollBehavior: 'contain',
        }}>
        <aside
          className={cn(
            `md:grow flex-col w-full pb-8 md:pb-0 md:max-w-none z-10 hidden md:block`
          )}>
          <nav
            role="navigation"
            style={{'--bg-opacity': '.2'} as React.CSSProperties} // Need to cast here because CSS vars aren't considered valid in TS types (cuz they could be anything)
            className="w-full pt-6 scrolling-touch md:h-auto grow pe-0 md:pe-5 md:pb-16 md:pt-4 scrolling-gpu">
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
          <div className="fixed bottom-0 hidden md:block">
            <Feedback />
          </div>
        </aside>
      </div>
    </div>
  );
}
