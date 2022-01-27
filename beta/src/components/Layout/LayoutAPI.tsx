/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import sidebarReference from 'sidebarReference.json';
import {MarkdownPage, MarkdownProps} from './MarkdownPage';
import {Page} from './Page';
import {RouteItem} from './useRouteMeta';

interface PageFrontmatter {
  title: string;
  status: string;
}

export default function withAPI(p: PageFrontmatter) {
  function LayoutAPI(props: MarkdownProps<PageFrontmatter>) {
    return <MarkdownPage {...props} meta={p} />;
  }
  LayoutAPI.appShell = AppShell;
  return LayoutAPI;
}

function AppShell(props: {children: React.ReactNode}) {
  return <Page routeTree={sidebarReference as RouteItem} {...props} />;
}
