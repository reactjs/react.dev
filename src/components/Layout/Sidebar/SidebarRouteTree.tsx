/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {
  useRef,
  useEffect,
  Fragment,
  useState,
  useCallback,
  useMemo,
} from 'react';
import cn from 'classnames';
import {useRouter} from 'next/router';
import {SidebarButton} from './SidebarButton';
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

/**
 * CollapseWrapper Component:
 * Handles smooth expanding and collapsing of sidebar items.
 */
const CollapseWrapper = ({
  isExpanded,
  duration,
  children,
}: {
  isExpanded: boolean;
  duration: number;
  children: any;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const {getCollapseProps} = useCollapse({isExpanded, duration});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ref.current && (ref.current.style.pointerEvents = 'none');
      timeoutRef.current = window.setTimeout(() => {
        ref.current && (ref.current.style.pointerEvents = '');
      }, duration + 100);
    }
  }, [isExpanded, duration]);

  return (
    <div
      ref={ref}
      className={cn(isExpanded ? 'opacity-100' : 'opacity-50')}
      style={{transition: `opacity ${duration}ms ease-in-out`}}>
      <div {...getCollapseProps()}>{children}</div>
    </div>
  );
};

/**
 * SidebarRouteTree Component:
 * Dynamically generates the sidebar menu with collapsible sections.
 */
export function SidebarRouteTree({
  isForceExpanded,
  breadcrumbs,
  routeTree,
  level = 0,
}: SidebarRouteTreeProps) {
  const router = useRouter();
  const slug = router.asPath.split(/[?#]/)[0]; // Extract current route path
  const pendingRoute = usePendingRoute();

  // Memoize the current route list for performance optimization
  const currentRoutes = useMemo(
    () => routeTree.routes as RouteItem[],
    [routeTree.routes]
  );

  // State to track expanded items
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  /**
   * Toggle function to handle sidebar dropdowns.
   * Closes the currently expanded item if clicked again.
   * Ensures only one section is open at a time.
   */
  const handleToggle = useCallback((path: string) => {
    setExpandedItem((prev) => (prev === path ? null : path));
  }, []);

  return (
    <ul>
      {currentRoutes.map(
        (
          {
            path,
            title,
            routes,
            version,
            heading,
            hasSectionHeader,
            sectionHeader,
          },
          index
        ) => {
          const selected = slug === path;
          let listItem = null;

          if (!path || heading) {
            // Render nested sidebar sections
            listItem = (
              <SidebarRouteTree
                level={level + 1}
                isForceExpanded={isForceExpanded}
                routeTree={{title, routes}}
                breadcrumbs={[]}
              />
            );
          } else if (routes) {
            // Handle collapsible sidebar sections
            const isBreadcrumb =
              breadcrumbs.length > 1 &&
              breadcrumbs[breadcrumbs.length - 1].path === path;
            const isExpanded = expandedItem === path;

            listItem = (
              <li key={`${title}-${path}-${level}-heading`}>
                <SidebarButton
                  key={`${title}-${path}-${level}-link`}
                  title={title}
                  heading={false}
                  level={level}
                  onClick={() => handleToggle(path)}
                  isExpanded={isExpanded}
                  isBreadcrumb={isBreadcrumb}
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
            // Render individual sidebar links
            listItem = (
              <li key={`${title}-${path}-${level}-link`}>
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

          // Render section headers if applicable
          if (hasSectionHeader) {
            let sectionHeaderText = sectionHeader
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
          }
          return listItem;
        }
      )}
    </ul>
  );
}
