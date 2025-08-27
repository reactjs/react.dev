/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

/**
 * While Next.js provides file-based routing, we still need to construct
 * a sidebar for navigation and provide each markdown page
 * previous/next links and titles. To do this, we construct a nested
 * route object that is infinitely nestable.
 */

export type RouteTag =
  | 'foundation'
  | 'intermediate'
  | 'advanced'
  | 'experimental'
  | 'deprecated';

export interface RouteItem {
  /** Page title (for the sidebar) */
  title: string;
  /** Optional version flag for heading */
  version?: 'canary' | 'major';
  /** Optional page description for heading */
  description?: string;
  /* Additional meta info for page tagging */
  tags?: RouteTag[];
  /** Path to page */
  path?: string;
  /** Whether the entry is a heading */
  heading?: boolean;
  /** List of sub-routes */
  routes?: RouteItem[];
  /** Adds a section header above the route item */
  hasSectionHeader?: boolean;
  /** Title of section header */
  sectionHeader?: string;
  /** Whether it should be omitted in breadcrumbs */
  skipBreadcrumb?: boolean;
}

export interface Routes {
  /** List of routes */
  routes: RouteItem[];
}

/** Routing metadata about a given route and its siblings and parent */
export interface RouteMeta {
  /** The previous route (older post) */
  prevRoute?: RouteItem;
  /** The next route (newer post) */
  nextRoute?: RouteItem;
  /** The current route */
  route?: RouteItem;
  /** Trail of parent routes */
  breadcrumbs?: RouteItem[];
  /** Order in the section */
  order?: number;
}

type TraversalContext = RouteMeta & {
  currentIndex: number;
  _foundRoute?: boolean;
};

export function getRouteMeta(cleanedPath: string, routeTree: RouteItem) {
  const breadcrumbs = getBreadcrumbs(cleanedPath, routeTree);
  const ctx: TraversalContext = {
    currentIndex: 0,
  };
  buildRouteMeta(cleanedPath, routeTree, ctx);
  const {currentIndex: _, ...meta} = ctx;
  return {
    ...meta,
    breadcrumbs: breadcrumbs.length > 0 ? breadcrumbs : [routeTree],
  };
}

// Performs a depth-first search to find the current route and its previous/next route
function buildRouteMeta(
  searchPath: string,
  currentRoute: RouteItem,
  ctx: TraversalContext
) {
  if (currentRoute.path === searchPath) {
    ctx.route = currentRoute;
    ctx.order = ctx.currentIndex;
    ctx._foundRoute = true;
    return;
  }

  if (!ctx._foundRoute && currentRoute.path) {
    ctx.nextRoute = currentRoute; // newer post
  } else if (ctx._foundRoute && currentRoute.path && !ctx.prevRoute) {
    ctx.prevRoute = currentRoute; // older post
    return; // Stop once prevRoute is found
  }

  if (!currentRoute.routes) return;

  for (const route of currentRoute.routes) {
    buildRouteMeta(searchPath, route, ctx);
  }

  if (!ctx._foundRoute && currentRoute.path) {
    ctx.currentIndex++;
  }
}

// iterates the route tree from the current route to find its ancestors for breadcrumbs
function getBreadcrumbs(
  path: string,
  currentRoute: RouteItem,
  breadcrumbs: RouteItem[] = []
): RouteItem[] {
  if (currentRoute.path === path) {
    return breadcrumbs;
  }

  if (!currentRoute.routes) {
    return [];
  }

  for (const route of currentRoute.routes) {
    const childRoute = getBreadcrumbs(path, route, [
      ...breadcrumbs,
      currentRoute,
    ]);
    if (childRoute?.length) {
      return childRoute;
    }
  }

  return [];
}
