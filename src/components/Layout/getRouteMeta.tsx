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
  /** Optional canary flag for heading */
  canary?: boolean;
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

/** Routing metadata about a given route and it's siblings and parent */
export interface RouteMeta {
  /** The previous route */
  prevRoute?: RouteItem;
  /** The next route */
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
  ctx.currentIndex++;

  const {routes} = currentRoute;

  if (ctx.route && !ctx.nextRoute) {
    ctx.nextRoute = currentRoute;
  }

  if (currentRoute.path === searchPath) {
    ctx.route = currentRoute;
    ctx.order = ctx.currentIndex;
    // If we've found a deeper match, reset the previously stored next route.
    // TODO: this only works reliably if deeper matches are first in the tree.
    // We should revamp all of this to be more explicit.
    ctx.nextRoute = undefined;
  }

  if (!ctx.route) {
    ctx.prevRoute = currentRoute;
  }

  if (!routes) {
    return;
  }

  for (const route of routes) {
    buildRouteMeta(searchPath, route, ctx);
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
