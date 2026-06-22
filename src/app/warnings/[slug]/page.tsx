/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Metadata} from 'next';
import sidebarHome from '../../../sidebarHome.json';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import {collectFlatSectionSlugs} from 'lib/collectPaths';
import {renderSectionPage, sectionPageMetadata} from '../../renderSectionPage';

interface PageProps {
  params: Promise<{slug: string}>;
}

export async function generateStaticParams() {
  const slugs = await collectFlatSectionSlugs('warnings');
  return slugs.map((slug) => ({slug}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  'use cache';
  const {slug} = await params;
  return sectionPageMetadata({
    section: 'unknown',
    segments: ['warnings', slug],
  });
}

export default async function WarningPage({params}: PageProps) {
  'use cache';
  const {slug} = await params;
  return renderSectionPage({
    section: 'unknown',
    segments: ['warnings', slug],
    routeTree: sidebarHome as RouteItem,
  });
}
