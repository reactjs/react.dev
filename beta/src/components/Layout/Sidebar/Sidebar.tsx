/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import cn from 'classnames';
import {SidebarContext} from 'components/Layout/useRouteMeta';
import {MenuContext} from 'components/useMenu';
import {useMediaQuery} from '../useMediaQuery';
import {SidebarRouteTree} from './SidebarRouteTree';
import {Search} from 'components/Search';
import {MobileNav} from '../Nav/MobileNav';
import {Feedback} from '../Feedback';

const SIDEBAR_BREAKPOINT = 1023;

export function Sidebar() {
  const {menuRef, isOpen} = React.useContext(MenuContext);
  const isMobileSidebar = useMediaQuery(SIDEBAR_BREAKPOINT);
  let routeTree = React.useContext(SidebarContext);
  const isHidden = isMobileSidebar ? !isOpen : false;

  // HACK. Fix up the data structures instead.
  if ((routeTree as any).routes.length === 1) {
    routeTree = (routeTree as any).routes[0];
  }
  return (
    <aside
      className={cn(
        `lg:grow lg:flex flex-col w-full pt-4 pb-8 lg:pb-0 lg:max-w-xs fixed lg:sticky bg-wash dark:bg-wash-dark z-10 top-0`,
        isOpen ? 'block z-40' : 'hidden lg:block'
      )}
      aria-hidden={isHidden}>
      <div className="px-5">
        <Search />
      </div>
      <nav
        role="navigation"
        ref={menuRef}
        style={{'--bg-opacity': '.2'} as React.CSSProperties} // Need to cast here because CSS vars aren't considered valid in TS types (cuz they could be anything)
        className="w-full h-screen lg:h-auto grow pr-0 lg:pr-5 pt-6 pb-44 lg:pb-0 lg:py-6 md:pt-4 lg:pt-4 overflow-y-scroll lg:overflow-y-auto scrolling-touch scrolling-gpu">
        {isMobileSidebar ? (
          <MobileNav />
        ) : (
          <SidebarRouteTree routeTree={routeTree} />
        )}
      </nav>
      <div className="sticky bottom-0 hidden lg:block">
        <Feedback />
      </div>
    </aside>
  );
}
