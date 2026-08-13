/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {SidebarNav} from 'components/Layout/SidebarNav';
import {TopNav} from 'components/Layout/TopNav';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import sidebarLearn from '../../sidebarLearn.json';

export default function LearnLayout({children}: {children: React.ReactNode}) {
  const routeTree = sidebarLearn as RouteItem;
  return (
    <>
      <TopNav section="learn" routeTree={routeTree} />
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
