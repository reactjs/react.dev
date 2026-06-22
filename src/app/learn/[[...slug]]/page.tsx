/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Metadata} from 'next';
import sidebarLearn from '../../../sidebarLearn.json';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import {collectSectionPaths} from 'lib/collectPaths';
import {renderSectionPage, sectionPageMetadata} from '../../renderSectionPage';

interface PageProps {
  params: Promise<{slug?: string[]}>;
}

export async function generateStaticParams() {
  const paths = await collectSectionPaths('learn');
  return paths.map((slug) => ({slug}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  'use cache';
  const {slug} = await params;
  return sectionPageMetadata({
    section: 'learn',
    segments: ['learn', ...(slug ?? [])],
  });
}

export default async function LearnPage({params}: PageProps) {
  'use cache';
  const {slug} = await params;
  return renderSectionPage({
    section: 'learn',
    segments: ['learn', ...(slug ?? [])],
    routeTree: sidebarLearn as RouteItem,
  });
}
