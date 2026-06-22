/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Metadata} from 'next';
import sidebarHome from '../../sidebarHome.json';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import {renderSectionPage, sectionPageMetadata} from '../renderSectionPage';

export async function generateMetadata(): Promise<Metadata> {
  'use cache';
  return sectionPageMetadata({section: 'unknown', segments: ['versions']});
}

export default async function VersionsPage() {
  'use cache';
  return renderSectionPage({
    section: 'unknown',
    segments: ['versions'],
    routeTree: sidebarHome as RouteItem,
  });
}
