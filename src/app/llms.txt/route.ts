/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {NextResponse} from 'next/server';
import {siteConfig} from '../../siteConfig';
import sidebarLearn from '../../sidebarLearn.json';
import sidebarReference from '../../sidebarReference.json';

interface RouteItem {
  title?: string;
  path?: string;
  routes?: RouteItem[];
  hasSectionHeader?: boolean;
  sectionHeader?: string;
}

interface Sidebar {
  title: string;
  routes: RouteItem[];
}

interface Page {
  title: string;
  url: string;
}

interface SubGroup {
  heading: string;
  pages: Page[];
}

interface Section {
  heading: string | null;
  pages: Page[];
  subGroups: SubGroup[];
}

function cleanSectionHeader(header: string): string {
  return header
    .replace(/@\{\{version\}\}/g, '')
    .replace(/-/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
}

function extractSectionedRoutes(
  routes: RouteItem[],
  baseUrl: string
): Section[] {
  const sections: Section[] = [];
  let currentSection: Section | null = null;

  for (const route of routes) {
    if (route.path?.startsWith('http')) continue;

    if (route.hasSectionHeader && route.sectionHeader) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        heading: cleanSectionHeader(route.sectionHeader),
        pages: [],
        subGroups: [],
      };
      continue;
    }

    if (!currentSection) continue;

    if (route.title && route.routes && route.routes.length > 0) {
      const subGroup: SubGroup = {heading: route.title, pages: []};
      if (route.path) {
        subGroup.pages.push({
          title: route.title,
          url: `${baseUrl}${route.path}.md`,
        });
      }
      for (const child of route.routes) {
        if (child.title && child.path && !child.path.startsWith('http')) {
          subGroup.pages.push({
            title: child.title,
            url: `${baseUrl}${child.path}.md`,
          });
        }
      }
      if (subGroup.pages.length > 0) currentSection.subGroups.push(subGroup);
    } else if (route.title && route.path) {
      currentSection.pages.push({
        title: route.title,
        url: `${baseUrl}${route.path}.md`,
      });
    }
  }

  if (currentSection) sections.push(currentSection);
  return sections;
}

function extractGroupedRoutes(
  routes: RouteItem[],
  baseUrl: string
): SubGroup[] {
  const groups: SubGroup[] = [];
  for (const route of routes) {
    if (route.hasSectionHeader) continue;
    if (route.path?.startsWith('http')) continue;

    if (route.title && route.routes && route.routes.length > 0) {
      const pages: Page[] = [];
      if (route.path) {
        pages.push({title: route.title, url: `${baseUrl}${route.path}.md`});
      }
      for (const child of route.routes) {
        if (child.title && child.path && !child.path.startsWith('http')) {
          pages.push({title: child.title, url: `${baseUrl}${child.path}.md`});
        }
      }
      if (pages.length > 0) groups.push({heading: route.title, pages});
    } else if (route.title && route.path) {
      groups.push({
        heading: route.title,
        pages: [{title: route.title, url: `${baseUrl}${route.path}.md`}],
      });
    }
  }
  return groups;
}

function usesSectionHeaders(routes: RouteItem[]): boolean {
  return routes.some((r) => r.hasSectionHeader && r.sectionHeader);
}

export async function GET() {
  const subdomain =
    siteConfig.languageCode === 'en' ? '' : siteConfig.languageCode + '.';
  const baseUrl = 'https://' + subdomain + 'react.dev';

  const lines = [
    '# React Documentation',
    '',
    '> The library for web and native user interfaces.',
  ];

  const sidebars: Sidebar[] = [
    sidebarLearn as Sidebar,
    sidebarReference as Sidebar,
  ];

  for (const sidebar of sidebars) {
    lines.push('');
    lines.push(`## ${sidebar.title}`);

    if (usesSectionHeaders(sidebar.routes)) {
      const sections = extractSectionedRoutes(sidebar.routes, baseUrl);
      for (const section of sections) {
        if (section.heading) {
          lines.push('');
          lines.push(`### ${section.heading}`);
        }
        for (const page of section.pages) {
          lines.push(`- [${page.title}](${page.url})`);
        }
        for (const subGroup of section.subGroups) {
          lines.push('');
          lines.push(`#### ${subGroup.heading}`);
          for (const page of subGroup.pages) {
            lines.push(`- [${page.title}](${page.url})`);
          }
        }
      }
    } else {
      const groups = extractGroupedRoutes(sidebar.routes, baseUrl);
      for (const group of groups) {
        lines.push('');
        lines.push(`### ${group.heading}`);
        for (const page of group.pages) {
          lines.push(`- [${page.title}](${page.url})`);
        }
      }
    }
  }

  return new NextResponse(lines.join('\n'), {
    status: 200,
    headers: {'Content-Type': 'text/plain; charset=utf-8'},
  });
}
