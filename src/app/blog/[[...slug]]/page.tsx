/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Metadata} from 'next';
import sidebarBlog from '../../../sidebarBlog.json';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import {collectSectionPaths} from 'lib/collectPaths';
import {renderSectionPage, sectionPageMetadata} from '../../renderSectionPage';

interface PageProps {
  params: Promise<{slug?: string[]}>;
}

export async function generateStaticParams() {
  const paths = await collectSectionPaths('blog');
  return paths.map((slug) => ({slug}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  'use cache';
  const {slug} = await params;
  return sectionPageMetadata({
    section: 'blog',
    segments: ['blog', ...(slug ?? [])],
    routeTree: sidebarBlog as RouteItem,
  });
}

export default async function BlogPage({params}: PageProps) {
  'use cache';
  const {slug} = await params;
  return renderSectionPage({
    section: 'blog',
    segments: ['blog', ...(slug ?? [])],
    routeTree: sidebarBlog as RouteItem,
  });
}
