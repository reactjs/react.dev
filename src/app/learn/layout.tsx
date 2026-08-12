/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

import * as React from 'react';
import {usePathname} from 'next/navigation';
import {SidebarNav} from 'components/Layout/SidebarNav';
import {TopNav} from 'components/Layout/TopNav';
import {getRouteMeta} from 'components/Layout/getRouteMeta';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import sidebarLearn from '../../sidebarLearn.json';

function RestoreHashAfterNavigation({pathname}: {pathname: string}) {
  React.useEffect(() => {
    if (!window.location.hash) {
      return;
    }

    const id = decodeURIComponent(window.location.hash.slice(1));
    // The Learn content remounts after a history traversal, so reapply the
    // fragment once the replacement content is in the DOM.
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}

export default function LearnLayout({children}: {children: React.ReactNode}) {
  const pathname = usePathname() || '/';
  const routeTree = sidebarLearn as RouteItem;
  const {breadcrumbs} = getRouteMeta(pathname, routeTree);
  return (
    <>
      <RestoreHashAfterNavigation pathname={pathname} />
      <TopNav section="learn" routeTree={routeTree} breadcrumbs={breadcrumbs} />
      <div className="grid grid-cols-only-content lg:grid-cols-sidebar-content 2xl:grid-cols-sidebar-content-toc">
        <div className="lg:-mt-16 z-10">
          <div className="fixed top-0 py-0 shadow lg:pt-16 lg:sticky start-0 end-0 lg:shadow-none">
            <SidebarNav routeTree={routeTree} breadcrumbs={breadcrumbs} />
          </div>
        </div>
        <React.Fragment key={pathname}>{children}</React.Fragment>
      </div>
    </>
  );
}
