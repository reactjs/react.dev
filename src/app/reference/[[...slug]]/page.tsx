/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Metadata} from 'next';
import sidebarReference from '../../../sidebarReference.json';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import {collectSectionPaths} from 'lib/collectPaths';
import {renderSectionPage, sectionPageMetadata} from '../../renderSectionPage';

interface PageProps {
  params: Promise<{slug?: string[]}>;
}

export async function generateStaticParams() {
  const paths = await collectSectionPaths('reference');
  return paths.map((slug) => ({slug}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params;
  return sectionPageMetadata({
    section: 'reference',
    segments: ['reference', ...(slug ?? [])],
  });
}

export default async function ReferencePage({params}: PageProps) {
  const {slug} = await params;
  return renderSectionPage({
    section: 'reference',
    segments: ['reference', ...(slug ?? [])],
    routeTree: sidebarReference as RouteItem,
  });
}
