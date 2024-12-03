/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useRef, useLayoutEffect, Fragment} from 'react';

import cn from 'classnames';
import {useRouter} from 'next/router';
import {SidebarLink} from './SidebarLink';
import {useCollapse} from 'react-collapsed';
import usePendingRoute from 'hooks/usePendingRoute';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import {siteConfig} from 'siteConfig';

interface SidebarRouteTreeProps {
  isForceExpanded: boolean;
  breadcrumbs: RouteItem[];
  routeTree: RouteItem;
  level?: number;
  expandedPath: string | null;
  setExpandedPath: (path: string | null) => void;
  collapsedPaths: Set<string>;
  setCollapsedPaths: React.Dispatch<React.SetStateAction<Set<string>>>;
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
  const ref = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const {getCollapseProps} = useCollapse({
    isExpanded,
    duration,
  });

  // Disable pointer events while animating.
  const isExpandedRef = useRef(isExpanded);
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
      }}>
      <div {...getCollapseProps()}>{children}</div>
    </div>
  );
}

export function SidebarRouteTree({
  isForceExpanded,
  breadcrumbs,
  routeTree,
  level = 0,
  expandedPath,
  setExpandedPath,
  collapsedPaths,
  setCollapsedPaths,
}: SidebarRouteTreeProps) {
  const slug = useRouter().asPath.split(/[\?\#]/)[0];
  const pendingRoute = usePendingRoute();
  const currentRoutes = routeTree.routes as RouteItem[];

  const handleExpand = (path: string) => {
    setExpandedPath(path);
    setCollapsedPaths((prev) => {
      const newSet = new Set(prev);
      newSet.delete(path);
      return newSet;
    });
  };

  const handleToggle = (path: string) => {
    if (expandedPath === path) {
      setExpandedPath(null);
      setCollapsedPaths((prev) => new Set(prev).add(path));
    } else {
      setExpandedPath(path);
      setCollapsedPaths((prev) => {
        const newSet = new Set(prev);
        newSet.delete(path);
        if (expandedPath) {
          newSet.add(expandedPath);
        }
        return newSet;
      });
    }
  };

  return (
    <ul>
      {currentRoutes.map(
        (
          {
            path,
            title,
            routes,
            canary,
            heading,
            hasSectionHeader,
            sectionHeader,
          },
          index
        ) => {
          const selected = slug === path;
          const isBreadcrumb = breadcrumbs.some((item) => item.path === path);
          const isExpanded =
            isForceExpanded ||
            expandedPath === path ||
            (selected && !collapsedPaths.has(path)) ||
            (isBreadcrumb && !collapsedPaths.has(path as string));

          let listItem = null;
          if (!path || heading) {
            // if current route item has no path and children treat it as an API sidebar heading
            listItem = (
              <SidebarRouteTree
                key={`${title}-${index}`}
                level={level + 1}
                isForceExpanded={isForceExpanded}
                routeTree={{title, routes}}
                breadcrumbs={[]}
                expandedPath={expandedPath}
                setExpandedPath={setExpandedPath}
                collapsedPaths={collapsedPaths}
                setCollapsedPaths={setCollapsedPaths}
              />
            );
          } else if (routes) {
            // if route has a path and child routes, treat it as an expandable sidebar item
            listItem = (
              <li key={`${title}-${path}-${level}-heading`}>
                <SidebarLink
                  key={`${title}-${path}-${level}-link`}
                  href={path}
                  isPending={pendingRoute === path}
                  selected={selected}
                  level={level}
                  title={title}
                  canary={canary}
                  isExpanded={isExpanded}
                  hideArrow={isForceExpanded}
                  onExpand={() => {
                    handleExpand(path);
                  }}
                  onToggle={() => {
                    handleToggle(path);
                  }}
                />
                <CollapseWrapper duration={250} isExpanded={isExpanded}>
                  <SidebarRouteTree
                    isForceExpanded={isForceExpanded}
                    routeTree={{title, routes}}
                    breadcrumbs={breadcrumbs}
                    level={level + 1}
                    expandedPath={expandedPath}
                    setExpandedPath={setExpandedPath}
                    collapsedPaths={collapsedPaths}
                    setCollapsedPaths={setCollapsedPaths}
                  />
                </CollapseWrapper>
              </li>
            );
          } else {
            // if route has a path and no child routes, treat it as a sidebar link
            listItem = (
              <li key={`${title}-${path}-${level}-link`}>
                <SidebarLink
                  isPending={pendingRoute === path}
                  href={path}
                  selected={selected}
                  level={level}
                  title={title}
                  canary={canary}
                  onExpand={() => {
                    if (level == 0) {
                      setExpandedPath(null);
                    }
                  }}
                />
              </li>
            );
          }
          if (hasSectionHeader) {
            let sectionHeaderText =
              sectionHeader != null
                ? sectionHeader.replace('{{version}}', siteConfig.version)
                : '';
            return (
              <Fragment key={`${sectionHeaderText}-${level}-separator`}>
                {index !== 0 && (
                  <li
                    role="separator"
                    className="mt-4 mb-2 ms-5 border-b border-border dark:border-border-dark"
                  />
                )}
                <h3
                  className={cn(
                    'mb-1 text-sm font-bold ms-5 text-tertiary dark:text-tertiary-dark',
                    index !== 0 && 'mt-2'
                  )}>
                  {sectionHeaderText}
                </h3>
              </Fragment>
            );
          } else {
            return listItem;
          }
        }
      )}
    </ul>
  );
}
