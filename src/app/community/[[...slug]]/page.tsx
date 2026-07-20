/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Metadata} from 'next';
import sidebarCommunity from '../../../sidebarCommunity.json';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import {collectSectionPaths} from 'lib/collectPaths';
import {
  renderSectionContent,
  sectionPageMetadata,
} from '../../renderSectionPage';

interface PageProps {
  params: Promise<{slug?: string[]}>;
}

export async function generateStaticParams() {
  const paths = await collectSectionPaths('community');
  return paths.map((slug) => ({slug}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params;
  return sectionPageMetadata({
    section: 'community',
    segments: ['community', ...(slug ?? [])],
  });
}

export default async function CommunityPage({params}: PageProps) {
  const {slug} = await params;
  return renderSectionContent({
    section: 'community',
    segments: ['community', ...(slug ?? [])],
    routeTree: sidebarCommunity as RouteItem,
  });
}
