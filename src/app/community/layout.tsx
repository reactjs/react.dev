/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {SidebarNav} from 'components/Layout/SidebarNav';
import {TopNav} from 'components/Layout/TopNav';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import sidebarCommunity from '../../sidebarCommunity.json';
import type {Metadata} from 'next';
import {buildNotFoundMetadata} from 'lib/buildPageMetadata';

export const metadata: Metadata = buildNotFoundMetadata();

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const routeTree = sidebarCommunity as RouteItem;
  return (
    <>
      <TopNav section="community" routeTree={routeTree} />
      <div className="grid grid-cols-only-content lg:grid-cols-sidebar-content 2xl:grid-cols-sidebar-content-toc">
        <div className="lg:-mt-16 z-10">
          <div className="fixed top-0 py-0 shadow lg:pt-16 lg:sticky start-0 end-0 lg:shadow-none">
            <SidebarNav routeTree={routeTree} />
          </div>
        </div>
        {children}
      </div>
    </>
  );
}
