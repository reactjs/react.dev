/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import sidebarCommunity from '../../sidebarCommunity.json';
import {NotFoundContent} from 'components/Layout/NotFoundContent';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import type {Metadata} from 'next';
import {buildNotFoundMetadata} from 'lib/buildPageMetadata';

export const metadata: Metadata = buildNotFoundMetadata();

export default function NotFound() {
  return (
    <NotFoundContent
      routeTree={sidebarCommunity as RouteItem}
      sectionPath="/community"
    />
  );
}
