/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import path from 'path';

// --- Sidebar route types ---

export interface RouteItem {
  title?: string;
  path?: string;
  routes?: RouteItem[];
  hasSectionHeader?: boolean;
  sectionHeader?: string;
}

export interface PageEntry {
  title: string;
  path: string;
}

export interface Sidebar {
  title: string;
  path: string;
  routes: RouteItem[];
}

// --- Page collection ---

/**
 * Walk sidebar routes and collect flat page entries.
 * Skips external links and section headers without paths.
 */
export function collectPages(routes: RouteItem[]): PageEntry[] {
  const pages: PageEntry[] = [];
  for (const route of routes) {
    // Skip section headers without paths
    if (route.hasSectionHeader && !route.path) {
      continue;
    }
    // Skip external links
    if (route.path?.startsWith('http')) {
      continue;
    }
    // Collect this page if it has a title and path
    if (route.title && route.path) {
      pages.push({
        title: route.title,
        // Strip leading slash for consistency
        path: route.path.replace(/^\//, ''),
      });
    }
    // Recurse into children
    if (route.routes) {
      pages.push(...collectPages(route.routes));
    }
  }
  return pages;
}

// --- Markdown file resolution ---

const contentCache = new Map<string, string | null>();

/**
 * Resolve a page path (e.g. "reference/react/useState") to its markdown
 * content under src/content/. Returns null if no matching file exists.
 *
 * Validates resolved paths stay within src/content/ to prevent traversal.
 * Caches results in memory for repeated reads.
 */
export function readContentFile(pagePath: string): string | null {
  const cached = contentCache.get(pagePath);
  if (cached !== undefined) {
    return cached;
  }

  const contentDir = path.resolve(process.cwd(), 'src/content');
  const candidates = [
    path.resolve(contentDir, pagePath + '.md'),
    path.resolve(contentDir, pagePath, 'index.md'),
  ];

  for (const fullPath of candidates) {
    // Prevent path traversal outside src/content/
    if (!fullPath.startsWith(contentDir + path.sep)) {
      continue;
    }
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      contentCache.set(pagePath, content);
      return content;
    }
  }

  contentCache.set(pagePath, null);
  return null;
}
