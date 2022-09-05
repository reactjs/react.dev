/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import cn from 'classnames';
import {RouteItem} from 'components/Layout/useRouteMeta';
import {useRouter} from 'next/router';
import {useActiveSection} from 'hooks/useActiveSection';
import {SidebarRouteTree} from '../Sidebar';
import sidebarHome from '../../../sidebarHome.json';
import sidebarLearn from '../../../sidebarLearn.json';
import sidebarReference from '../../../sidebarReference.json';

export function MobileNav() {
  // This is where we actually are according to the router.
  const section = useActiveSection();

  // Let the user switch tabs there and back without navigating.
  // Seed the tab state from the router, but keep it independent.
  const [tab, setTab] = React.useState(section);

  let tree = null;
  switch (tab) {
    case 'home':
      tree = sidebarHome.routes[0];
      break;
    case 'learn':
      tree = sidebarLearn.routes[0];
      break;
    case 'apis':
      tree = sidebarReference.routes[0];
      break;
  }

  return (
    <>
      <div className="sticky top-0 px-5 mb-2 bg-wash dark:bg-wash-dark flex justify-end border-b border-border dark:border-border-dark items-center self-center w-full z-10">
        <TabButton isActive={tab === 'home'} onClick={() => setTab('home')}>
          Home
        </TabButton>
        <TabButton isActive={tab === 'learn'} onClick={() => setTab('learn')}>
          Learn
        </TabButton>
        <TabButton isActive={tab === 'apis'} onClick={() => setTab('apis')}>
          API
        </TabButton>
      </div>
      {/* No fallback UI so need to be careful not to suspend directly inside. */}
      <React.Suspense fallback={null}>
        <SidebarRouteTree routeTree={tree as RouteItem} isMobile={true} />
      </React.Suspense>
    </>
  );
}

function TabButton({
  children,
  onClick,
  isActive,
}: {
  children: any;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isActive: boolean;
}) {
  const classes = cn(
    'inline-flex items-center w-full border-b-2 justify-center text-base leading-9 px-3 py-0.5 hover:text-link hover:gray-5',
    {
      'text-link dark:text-link-dark dark:border-link-dark border-link font-bold':
        isActive,
      'border-transparent': !isActive,
    }
  );
  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
