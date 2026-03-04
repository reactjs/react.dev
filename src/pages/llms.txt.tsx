/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {GetServerSideProps} from 'next';
import {siteConfig} from '../siteConfig';
import sidebarLearn from '../sidebarLearn.json';
import sidebarReference from '../sidebarReference.json';

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

// Clean up section header names (remove version placeholders)
function cleanSectionHeader(header: string): string {
  return header
    .replace(/@\{\{version\}\}/g, '')
    .replace(/-/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
}

// Extract routes for sidebars that use hasSectionHeader to define major sections
// (like the API Reference sidebar)
function extractSectionedRoutes(
  routes: RouteItem[],
  baseUrl: string
): Section[] {
  const sections: Section[] = [];
  let currentSection: Section | null = null;

  for (const route of routes) {
    // Skip external links
    if (route.path?.startsWith('http')) {
      continue;
    }

    // Start a new section when we hit a section header
    if (route.hasSectionHeader && route.sectionHeader) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        heading: cleanSectionHeader(route.sectionHeader),
        pages: [],
        subGroups: [],
      };
      continue;
    }

    // If no section started yet, skip
    if (!currentSection) {
      continue;
    }

    // Route with children - create a sub-group
    if (route.title && route.routes && route.routes.length > 0) {
      const subGroup: SubGroup = {
        heading: route.title,
        pages: [],
      };

      // Include parent page if it has a path
      if (route.path) {
        subGroup.pages.push({
          title: route.title,
          url: `${baseUrl}${route.path}.md`,
        });
      }

      // Add child pages
      for (const child of route.routes) {
        if (child.title && child.path && !child.path.startsWith('http')) {
          subGroup.pages.push({
            title: child.title,
            url: `${baseUrl}${child.path}.md`,
          });
        }
      }

      if (subGroup.pages.length > 0) {
        currentSection.subGroups.push(subGroup);
      }
    }
    // Single page without children
    else if (route.title && route.path) {
      currentSection.pages.push({
        title: route.title,
        url: `${baseUrl}${route.path}.md`,
      });
    }
  }

  // Don't forget the last section
  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

// Extract routes for sidebars that use routes with children as the primary grouping
// (like the Learn sidebar)
function extractGroupedRoutes(
  routes: RouteItem[],
  baseUrl: string
): SubGroup[] {
  const groups: SubGroup[] = [];

  for (const route of routes) {
    // Skip section headers
    if (route.hasSectionHeader) {
      continue;
    }

    // Skip external links
    if (route.path?.startsWith('http')) {
      continue;
    }

    // Route with children - create a group
    if (route.title && route.routes && route.routes.length > 0) {
      const pages: Page[] = [];

      // Include parent page if it has a path
      if (route.path) {
        pages.push({
          title: route.title,
          url: `${baseUrl}${route.path}.md`,
        });
      }

      // Add child pages
      for (const child of route.routes) {
        if (child.title && child.path && !child.path.startsWith('http')) {
          pages.push({
            title: child.title,
            url: `${baseUrl}${child.path}.md`,
          });
        }
      }

      if (pages.length > 0) {
        groups.push({
          heading: route.title,
          pages,
        });
      }
    }
    // Single page without children - group under its own heading
    else if (route.title && route.path) {
      groups.push({
        heading: route.title,
        pages: [
          {
            title: route.title,
            url: `${baseUrl}${route.path}.md`,
          },
        ],
      });
    }
  }

  return groups;
}

// Check if sidebar uses section headers as primary grouping
function usesSectionHeaders(routes: RouteItem[]): boolean {
  return routes.some((r) => r.hasSectionHeader && r.sectionHeader);
}

export const getServerSideProps: GetServerSideProps = async ({res}) => {
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
      // API Reference style: section headers define major groups
      const sections = extractSectionedRoutes(sidebar.routes, baseUrl);
      for (const section of sections) {
        if (section.heading) {
          lines.push('');
          lines.push(`### ${section.heading}`);
        }

        // Output pages directly under section
        for (const page of section.pages) {
          lines.push(`- [${page.title}](${page.url})`);
        }

        // Output sub-groups with #### headings
        for (const subGroup of section.subGroups) {
          lines.push('');
          lines.push(`#### ${subGroup.heading}`);
          for (const page of subGroup.pages) {
            lines.push(`- [${page.title}](${page.url})`);
          }
        }
      }
    } else {
      // Learn style: routes with children define groups
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

  const content = lines.join('\n');

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.write(content);
  res.end();

  return {props: {}};
};

export default function LlmsTxt() {
  return null;
}
