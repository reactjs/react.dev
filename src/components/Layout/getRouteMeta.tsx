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
  /** Optional page description for heading */
  description?: string;
  /* Additional meta info for page tagging */
  tags?: RouteTag[];
  /** Path to page */
  path?: string;
  /** Whether the entry is a heading */
  heading?: boolean;
  /** Whether the page is under construction */
  wip?: boolean;
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
}

export function getRouteMeta(cleanedPath: string, routeTree: RouteItem) {
  const breadcrumbs = getBreadcrumbs(cleanedPath, routeTree);
  return {
    ...buildRouteMeta(cleanedPath, routeTree, {}),
    breadcrumbs: breadcrumbs.length > 0 ? breadcrumbs : [routeTree],
  };
}

// Performs a depth-first search to find the current route and its previous/next route
function buildRouteMeta(
  searchPath: string,
  currentRoute: RouteItem,
  ctx: RouteMeta
): RouteMeta {
  const {routes} = currentRoute;

  if (ctx.route && !ctx.nextRoute) {
    ctx.nextRoute = currentRoute;
  }

  if (currentRoute.path === searchPath) {
    ctx.route = currentRoute;
  }

  if (!ctx.route) {
    ctx.prevRoute = currentRoute;
  }

  if (!routes) {
    return ctx;
  }

  for (const route of routes) {
    buildRouteMeta(searchPath, route, ctx);
  }

  return ctx;
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
