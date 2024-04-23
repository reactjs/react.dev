/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Suspense} from 'react';
import * as React from 'react';
import cn from 'classnames';
import {Feedback} from '../Feedback';
import {SidebarRouteTree} from '../Sidebar/SidebarRouteTree';
import type {RouteItem} from '../getRouteMeta';
import {useRouter} from 'next/router';

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
  const {push, query} = useRouter();
  const onChangeVersion = React.useCallback(
    (e: any) => {
      push({query: {...query, version: e.target.value}});
    },
    [push, query]
  );

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
            `lg:grow flex-col w-full pb-8 lg:pb-0 lg:max-w-custom-xs z-10 hidden lg:block`
          )}>
          <nav
            role="navigation"
            style={{'--bg-opacity': '.2'} as React.CSSProperties} // Need to cast here because CSS vars aren't considered valid in TS types (cuz they could be anything)
            className="w-full pt-6 scrolling-touch lg:h-auto grow pe-0 lg:pe-5 lg:pb-16 md:pt-4 lg:pt-4 scrolling-gpu">
            {/* No fallback UI so need to be careful not to suspend directly inside. */}
            <Suspense fallback={null}>
              <select
                value={query.version ?? '19.0.0'}
                onChange={onChangeVersion}>
                <option value="18.0.0">Version 18.0.0</option>
                <option value="19.0.0">Version 19.0.0</option>
              </select>
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
