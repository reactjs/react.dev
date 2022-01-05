/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import sidebarHome from 'sidebarHome.json';
import {MarkdownPage, MarkdownProps} from './MarkdownPage';
import {Page} from './Page';
import {RouteItem} from './useRouteMeta';

interface PageFrontmatter {
  title: string;
  status: string;
}

export default function withDocs(p: PageFrontmatter) {
  function LayoutHome(props: MarkdownProps<PageFrontmatter>) {
    return <MarkdownPage {...props} meta={p} />;
  }
  LayoutHome.appShell = AppShell;
  return LayoutHome;
}

function AppShell(props: {children: React.ReactNode}) {
  return <Page routeTree={sidebarHome as RouteItem} {...props} />;
}
