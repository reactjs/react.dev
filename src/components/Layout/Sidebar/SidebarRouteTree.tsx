/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useRef, useLayoutEffect, useState, useEffect, Fragment} from 'react';

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
    // eslint-disable-next-line react-compiler/react-compiler
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

interface SidebarItemProps {
  item: RouteItem;
  level: number;
  isForceExpanded: boolean;
  breadcrumbs: RouteItem[];
  slug: string;
  pendingRoute: string | null;
}

function SidebarItem({
  item,
  level,
  isForceExpanded,
  breadcrumbs,
  slug,
  pendingRoute,
}: SidebarItemProps) {
  const {path, title, routes, version, heading} = item;
  const selected = slug === path;
  const isBreadcrumb =
    breadcrumbs.length > 1 && breadcrumbs[breadcrumbs.length - 1].path === path;

  const [isCollapsed, setIsCollapsed] = useState(false);

  const shouldBeExpanded = isForceExpanded || isBreadcrumb || selected;
  const isExpanded = shouldBeExpanded && !isCollapsed;

  useEffect(() => {
    if (!selected) {
      setIsCollapsed(false);
    }
  }, [selected]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (selected) {
      event.preventDefault();
      setIsCollapsed((prev) => !prev);
    }
  };

  if (!path || heading) {
    return (
      <SidebarRouteTree
        level={level + 1}
        isForceExpanded={isForceExpanded}
        routeTree={{title, routes}}
        breadcrumbs={[]}
      />
    );
  } else if (routes) {
    return (
      <li>
        <SidebarLink
          href={path}
          isPending={pendingRoute === path}
          selected={selected}
          level={level}
          title={title}
          version={version}
          isExpanded={isExpanded}
          hideArrow={isForceExpanded}
          onClick={handleClick}
        />
        <CollapseWrapper duration={250} isExpanded={isExpanded}>
          <SidebarRouteTree
            isForceExpanded={isForceExpanded}
            routeTree={{title, routes}}
            breadcrumbs={breadcrumbs}
            level={level + 1}
          />
        </CollapseWrapper>
      </li>
    );
  } else {
    return (
      <li>
        <SidebarLink
          isPending={pendingRoute === path}
          href={path}
          selected={selected}
          level={level}
          title={title}
          version={version}
        />
      </li>
    );
  }
}

export function SidebarRouteTree({
  isForceExpanded,
  breadcrumbs,
  routeTree,
  level = 0,
}: SidebarRouteTreeProps) {
  const slug = useRouter().asPath.split(/[\?\#]/)[0];
  const pendingRoute = usePendingRoute();
  const currentRoutes = routeTree.routes as RouteItem[];
  return (
    <ul>
      {currentRoutes.map((item, index) => {
        const {path, title, hasSectionHeader, sectionHeader} = item;
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
          return (
            <SidebarItem
              key={`${title}-${path}-${level}-item`}
              item={item}
              level={level}
              isForceExpanded={isForceExpanded}
              breadcrumbs={breadcrumbs}
              slug={slug}
              pendingRoute={pendingRoute}
            />
          );
        }
      })}
    </ul>
  );
}
