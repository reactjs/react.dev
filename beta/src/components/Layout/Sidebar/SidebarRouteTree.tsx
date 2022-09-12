/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import cn from 'classnames';
import {RouteItem} from 'components/Layout/useRouteMeta';
import {useRouter} from 'next/router';
import {removeFromLast} from 'utils/removeFromLast';
import {useRouteMeta} from '../useRouteMeta';
import {SidebarLink} from './SidebarLink';
import useCollapse from 'react-collapsed';
import {useLayoutEffect} from 'react';
import usePendingRoute from 'hooks/usePendingRoute';

interface SidebarRouteTreeProps {
  isForceExpanded: boolean;
  routeTree: RouteItem;
  level?: number;
}

function CollapseWrapper({
  isExpanded,
  duration,
  children,
}: {
  isExpanded: boolean;
  duration: number;
  children: any;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const timeoutRef = React.useRef<number | null>(null);
  const {getCollapseProps} = useCollapse({
    isExpanded,
    duration,
  });

  // Disable pointer events while animating.
  const isExpandedRef = React.useRef(isExpanded);
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
      const wasExpanded = isExpandedRef.current;
      if (wasExpanded === isExpanded) {
        return;
      }
      isExpandedRef.current = isExpanded;
      if (ref.current !== null) {
        const node: HTMLDivElement = ref.current;
        node.style.pointerEvents = 'none';
        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
          node.style.pointerEvents = '';
        }, duration + 100);
      }
    });
  }

  return (
    <div
      ref={ref}
      className={cn(isExpanded ? 'opacity-100' : 'opacity-50')}
      style={{
        transition: `opacity ${duration}ms ease-in-out`,
        animation: `nav-fadein ${duration}ms ease-in-out`,
      }}>
      <div {...getCollapseProps()}>{children}</div>
    </div>
  );
}

export function SidebarRouteTree({
  isForceExpanded,
  routeTree,
  level = 0,
}: SidebarRouteTreeProps) {
  const {breadcrumbs} = useRouteMeta(routeTree);
  const cleanedPath = useRouter().asPath.split(/[\?\#]/)[0];
  const pendingRoute = usePendingRoute();

  const slug = cleanedPath;
  const currentRoutes = routeTree.routes as RouteItem[];
  const expandedPath = currentRoutes.reduce(
    (acc: string | undefined, curr: RouteItem) => {
      if (acc) return acc;
      const breadcrumb = breadcrumbs.find((b) => b.path === curr.path);
      if (breadcrumb) {
        return curr.path;
      }
      if (curr.path === cleanedPath) {
        return cleanedPath;
      }
      return undefined;
    },
    undefined
  );

  const expanded = expandedPath;
  return (
    <ul>
      {currentRoutes.map(({path, title, routes, wip, heading}) => {
        const pagePath = path && removeFromLast(path, '.');
        const selected = slug === pagePath;

        // if current route item has no path and children treat it as an API sidebar heading
        if (!path || !pagePath || heading) {
          return (
            <SidebarRouteTree
              level={level + 1}
              isForceExpanded={isForceExpanded}
              routeTree={{title, routes}}
            />
          );
        }

        // if route has a path and child routes, treat it as an expandable sidebar item
        if (routes) {
          const isExpanded = isForceExpanded || expanded === path;
          return (
            <li key={`${title}-${path}-${level}-heading`}>
              <SidebarLink
                key={`${title}-${path}-${level}-link`}
                href={pagePath}
                isPending={pendingRoute === pagePath}
                selected={selected}
                level={level}
                title={title}
                wip={wip}
                isExpanded={isExpanded}
                isBreadcrumb={expandedPath === path}
                hideArrow={isForceExpanded}
              />
              <CollapseWrapper duration={250} isExpanded={isExpanded}>
                <SidebarRouteTree
                  isForceExpanded={isForceExpanded}
                  routeTree={{title, routes}}
                  level={level + 1}
                />
              </CollapseWrapper>
            </li>
          );
        }

        // if route has a path and no child routes, treat it as a sidebar link
        return (
          <li key={`${title}-${path}-${level}-link`}>
            <SidebarLink
              isPending={pendingRoute === pagePath}
              href={path.startsWith('https://') ? path : pagePath}
              selected={selected}
              level={level}
              title={title}
              wip={wip}
            />
          </li>
        );
      })}
    </ul>
  );
}
