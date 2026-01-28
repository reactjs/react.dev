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
import sidebarBlog from '../sidebarBlog.json';

interface RouteItem {
  title?: string;
  path?: string;
  routes?: RouteItem[];
}

interface Sidebar {
  title: string;
  routes: RouteItem[];
}

function extractRoutes(
  routes: RouteItem[],
  baseUrl: string
): {title: string; url: string}[] {
  const result: {title: string; url: string}[] = [];

  for (const route of routes) {
    if (route.title && route.path) {
      result.push({
        title: route.title,
        url: `${baseUrl}${route.path}.md`,
      });
    }
    if (route.routes) {
      result.push(...extractRoutes(route.routes, baseUrl));
    }
  }

  return result;
}

const sidebars: Sidebar[] = [
  sidebarLearn as Sidebar,
  sidebarReference as Sidebar,
  sidebarBlog as Sidebar,
];

export const getServerSideProps: GetServerSideProps = async ({res}) => {
  const subdomain =
    siteConfig.languageCode === 'en' ? '' : siteConfig.languageCode + '.';
  const baseUrl = 'https://' + subdomain + 'react.dev';

  const lines = [
    '# React Documentation',
    '',
    '> The library for web and native user interfaces.',
  ];

  for (const sidebar of sidebars) {
    lines.push('');
    lines.push(`## ${sidebar.title}`);
    lines.push('');

    const routes = extractRoutes(sidebar.routes, baseUrl);
    for (const route of routes) {
      lines.push(`- [${route.title}](${route.url})`);
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
