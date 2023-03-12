/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useState, useRef, useContext, useEffect, Suspense} from 'react';
import * as React from 'react';
import cn from 'classnames';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import {disableBodyScroll, enableBodyScroll} from 'body-scroll-lock';

import {IconClose} from 'components/Icon/IconClose';
import {IconHamburger} from 'components/Icon/IconHamburger';
import {Search} from 'components/Search';
import {Logo} from '../../Logo';
import {ButtonShowFeedback, Feedback, FeedbackProvider} from '../Feedback';
import NavLink from './NavLink';
import {SidebarRouteTree} from '../Sidebar/SidebarRouteTree';
import type {RouteItem} from '../getRouteMeta';
import sidebarLearn from '../../../sidebarLearn.json';
import sidebarReference from '../../../sidebarReference.json';

declare global {
  interface Window {
    __theme: string;
    __setPreferredTheme: (theme: string) => void;
  }
}

const darkIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24">
    <g fill="none" fillRule="evenodd" transform="translate(-444 -204)">
      <path
        fill="currentColor"
        fillRule="nonzero"
        d="M102,21 C102,18.1017141 103.307179,15.4198295 105.51735,13.6246624 C106.001939,13.2310647 105.821611,12.4522936 105.21334,12.3117518 C104.322006,12.1058078 103.414758,12 102.5,12 C95.8722864,12 90.5,17.3722864 90.5,24 C90.5,30.6277136 95.8722864,36 102.5,36 C106.090868,36 109.423902,34.4109093 111.690274,31.7128995 C112.091837,31.2348572 111.767653,30.5041211 111.143759,30.4810139 C106.047479,30.2922628 102,26.1097349 102,21 Z M102.5,34.5 C96.7007136,34.5 92,29.7992864 92,24 C92,18.2007136 96.7007136,13.5 102.5,13.5 C102.807386,13.5 103.113925,13.5136793 103.419249,13.5407785 C101.566047,15.5446378 100.5,18.185162 100.5,21 C100.5,26.3198526 104.287549,30.7714322 109.339814,31.7756638 L109.516565,31.8092927 C107.615276,33.5209452 105.138081,34.5 102.5,34.5 Z"
        transform="translate(354.5 192)"
      />
      <polygon points="444 228 468 228 468 204 444 204" />
    </g>
  </svg>
);

const lightIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24">
    <g fill="none" fillRule="evenodd" transform="translate(-444 -204)">
      <g fill="currentColor" transform="translate(354 144)">
        <path
          fillRule="nonzero"
          d="M108.5 24C108.5 27.5902136 105.590214 30.5 102 30.5 98.4097864 30.5 95.5 27.5902136 95.5 24 95.5 20.4097864 98.4097864 17.5 102 17.5 105.590214 17.5 108.5 20.4097864 108.5 24zM107 24C107 21.2382136 104.761786 19 102 19 99.2382136 19 97 21.2382136 97 24 97 26.7617864 99.2382136 29 102 29 104.761786 29 107 26.7617864 107 24zM101 12.75L101 14.75C101 15.1642136 101.335786 15.5 101.75 15.5 102.164214 15.5 102.5 15.1642136 102.5 14.75L102.5 12.75C102.5 12.3357864 102.164214 12 101.75 12 101.335786 12 101 12.3357864 101 12.75zM95.7255165 14.6323616L96.7485165 16.4038616C96.9556573 16.7625614 97.4143618 16.8854243 97.7730616 16.6782835 98.1317614 16.4711427 98.2546243 16.0124382 98.0474835 15.6537384L97.0244835 13.8822384C96.8173427 13.5235386 96.3586382 13.4006757 95.9999384 13.6078165 95.6412386 13.8149573 95.5183757 14.2736618 95.7255165 14.6323616zM91.8822384 19.0244835L93.6537384 20.0474835C94.0124382 20.2546243 94.4711427 20.1317614 94.6782835 19.7730616 94.8854243 19.4143618 94.7625614 18.9556573 94.4038616 18.7485165L92.6323616 17.7255165C92.2736618 17.5183757 91.8149573 17.6412386 91.6078165 17.9999384 91.4006757 18.3586382 91.5235386 18.8173427 91.8822384 19.0244835zM90.75 25L92.75 25C93.1642136 25 93.5 24.6642136 93.5 24.25 93.5 23.8357864 93.1642136 23.5 92.75 23.5L90.75 23.5C90.3357864 23.5 90 23.8357864 90 24.25 90 24.6642136 90.3357864 25 90.75 25zM92.6323616 30.2744835L94.4038616 29.2514835C94.7625614 29.0443427 94.8854243 28.5856382 94.6782835 28.2269384 94.4711427 27.8682386 94.0124382 27.7453757 93.6537384 27.9525165L91.8822384 28.9755165C91.5235386 29.1826573 91.4006757 29.6413618 91.6078165 30.0000616 91.8149573 30.3587614 92.2736618 30.4816243 92.6323616 30.2744835zM97.0244835 34.1177616L98.0474835 32.3462616C98.2546243 31.9875618 98.1317614 31.5288573 97.7730616 31.3217165 97.4143618 31.1145757 96.9556573 31.2374386 96.7485165 31.5961384L95.7255165 33.3676384C95.5183757 33.7263382 95.6412386 34.1850427 95.9999384 34.3921835 96.3586382 34.5993243 96.8173427 34.4764614 97.0244835 34.1177616zM103 35.25L103 33.25C103 32.8357864 102.664214 32.5 102.25 32.5 101.835786 32.5 101.5 32.8357864 101.5 33.25L101.5 35.25C101.5 35.6642136 101.835786 36 102.25 36 102.664214 36 103 35.6642136 103 35.25zM108.274483 33.3676384L107.251483 31.5961384C107.044343 31.2374386 106.585638 31.1145757 106.226938 31.3217165 105.868239 31.5288573 105.745376 31.9875618 105.952517 32.3462616L106.975517 34.1177616C107.182657 34.4764614 107.641362 34.5993243 108.000062 34.3921835 108.358761 34.1850427 108.481624 33.7263382 108.274483 33.3676384zM112.117762 28.9755165L110.346262 27.9525165C109.987562 27.7453757 109.528857 27.8682386 109.321717 28.2269384 109.114576 28.5856382 109.237439 29.0443427 109.596138 29.2514835L111.367638 30.2744835C111.726338 30.4816243 112.185043 30.3587614 112.392183 30.0000616 112.599324 29.6413618 112.476461 29.1826573 112.117762 28.9755165zM113.25 23L111.25 23C110.835786 23 110.5 23.3357864 110.5 23.75 110.5 24.1642136 110.835786 24.5 111.25 24.5L113.25 24.5C113.664214 24.5 114 24.1642136 114 23.75 114 23.3357864 113.664214 23 113.25 23zM111.367638 17.7255165L109.596138 18.7485165C109.237439 18.9556573 109.114576 19.4143618 109.321717 19.7730616 109.528857 20.1317614 109.987562 20.2546243 110.346262 20.0474835L112.117762 19.0244835C112.476461 18.8173427 112.599324 18.3586382 112.392183 17.9999384 112.185043 17.6412386 111.726338 17.5183757 111.367638 17.7255165zM106.975517 13.8822384L105.952517 15.6537384C105.745376 16.0124382 105.868239 16.4711427 106.226938 16.6782835 106.585638 16.8854243 107.044343 16.7625614 107.251483 16.4038616L108.274483 14.6323616C108.481624 14.2736618 108.358761 13.8149573 108.000062 13.6078165 107.641362 13.4006757 107.182657 13.5235386 106.975517 13.8822384z"
          transform="translate(0 48)"
        />
        <path
          d="M98.6123,60.1372 C98.6123,59.3552 98.8753,58.6427 99.3368,58.0942 C99.5293,57.8657 99.3933,57.5092 99.0943,57.5017 C99.0793,57.5012 99.0633,57.5007 99.0483,57.5007 C97.1578,57.4747 95.5418,59.0312 95.5008,60.9217 C95.4578,62.8907 97.0408,64.5002 98.9998,64.5002 C99.7793,64.5002 100.4983,64.2452 101.0798,63.8142 C101.3183,63.6372 101.2358,63.2627 100.9478,63.1897 C99.5923,62.8457 98.6123,61.6072 98.6123,60.1372"
          transform="translate(3 11)"
        />
      </g>
      <polygon points="444 228 468 228 468 204 444 204" />
    </g>
  </svg>
);

export default function Nav({
  routeTree,
  breadcrumbs,
  section,
}: {
  routeTree: RouteItem;
  breadcrumbs: RouteItem[];
  section: 'learn' | 'reference' | 'home';
}) {
  const [isOpen, setIsOpen] = useState(false);
  const scrollParentRef = useRef<HTMLDivElement>(null);
  const {asPath} = useRouter();

  // In mobile mode, let the user switch tabs there and back without navigating.
  // Seed the tab state from the router, but keep it independent.
  const [tab, setTab] = useState(section);
  const [prevSection, setPrevSection] = useState(section);
  if (prevSection !== section) {
    setPrevSection(section);
    setTab(section);
  }
  if (isOpen) {
    switch (tab) {
      case 'home':
      case 'learn':
        routeTree = sidebarLearn as RouteItem;
        break;
      case 'reference':
        routeTree = sidebarReference as RouteItem;
        break;
    }
  }
  // HACK. Fix up the data structures instead.
  if ((routeTree as any).routes.length === 1) {
    routeTree = (routeTree as any).routes[0];
  }

  // While the overlay is open, disable body scroll.
  useEffect(() => {
    if (isOpen) {
      const preferredScrollParent = scrollParentRef.current!;
      disableBodyScroll(preferredScrollParent);
      return () => enableBodyScroll(preferredScrollParent);
    } else {
      return undefined;
    }
  }, [isOpen]);

  // Close the overlay on any navigation.
  useEffect(() => {
    setIsOpen(false);
  }, [asPath]);

  // Also close the overlay if the window gets resized past mobile layout.
  // (This is also important because we don't want to keep the body locked!)
  useEffect(() => {
    const media = window.matchMedia(`(max-width: 1023px)`);
    function closeIfNeeded() {
      if (!media.matches) {
        setIsOpen(false);
      }
    }
    closeIfNeeded();
    media.addEventListener('change', closeIfNeeded);
    return () => {
      media.removeEventListener('change', closeIfNeeded);
    };
  }, []);

  function selectTab(nextTab: 'learn' | 'reference') {
    setTab(nextTab);
    scrollParentRef.current!.scrollTop = 0;
  }

  return (
    <FeedbackProvider>
      <div
        className={cn(
          'sticky top-0 lg:bottom-0 lg:h-screen flex flex-col',
          isOpen && 'h-screen'
        )}>
        <nav className="items-center w-full flex lg:block justify-between bg-wash dark:bg-wash-dark pt-0 lg:pt-4 pr-5 lg:px-5 z-50">
          <div className="xl:w-full xl:max-w-xs flex items-center">
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setIsOpen(!isOpen)}
              className={cn('flex lg:hidden items-center h-full px-4', {
                'text-link dark:text-link-dark mr-0': isOpen,
              })}>
              {isOpen ? <IconClose /> : <IconHamburger />}
            </button>
            <NextLink href="/">
              <a className="inline-flex text-l font-normal items-center text-primary dark:text-primary-dark py-1 mr-0 sm:mr-3 whitespace-nowrap">
                <Logo className="text-sm mr-2 w-8 h-8 text-link dark:text-link-dark" />
                React Docs
              </a>
            </NextLink>
            <div className="lg:w-full leading-loose hidden sm:flex flex-initial items-center h-auto pr-5 lg:pr-5 pt-0.5">
              <div className="px-1 mb-px bg-highlight dark:bg-highlight-dark rounded uppercase text-link dark:text-link-dark font-bold tracking-wide text-xs whitespace-nowrap">
                Beta
              </div>
            </div>
            <div className="block dark:hidden">
              <button
                type="button"
                aria-label="Use Dark Mode"
                onClick={() => {
                  window.__setPreferredTheme('dark');
                }}
                className="hidden lg:flex items-center h-full pr-2">
                {darkIcon}
              </button>
            </div>
            <div className="hidden dark:block">
              <button
                type="button"
                aria-label="Use Light Mode"
                onClick={() => {
                  window.__setPreferredTheme('light');
                }}
                className="hidden lg:flex items-center h-full pr-2">
                {lightIcon}
              </button>
            </div>
          </div>
          {!isOpen && (
            <div className="hidden lg:block sm:pt-10 lg:pt-4">
              <Search />
            </div>
          )}
          <div className="px-0 pt-2 w-full 2xl:max-w-xs hidden lg:flex items-center self-center border-b-0 lg:border-b border-border dark:border-border-dark">
            <NavLink
              href="/learn"
              isActive={section === 'learn' || section === 'home'}>
              Learn
            </NavLink>
            <NavLink href="/reference/react" isActive={section === 'reference'}>
              Reference
            </NavLink>
          </div>
          <div className="flex my-4 h-10 mx-0 w-full lg:hidden justify-end lg:max-w-sm">
            <Search />
            <ButtonShowFeedback />
            <div className="block dark:hidden">
              <button
                type="button"
                aria-label="Use Dark Mode"
                onClick={() => {
                  window.__setPreferredTheme('dark');
                }}
                className="flex lg:hidden items-center p-1 h-full ml-4 lg:ml-6">
                {darkIcon}
              </button>
            </div>
            <Feedback
              className={(visible) =>
                `fixed top-12 right-0 ${visible ? 'block' : 'hidden'}`
              }
              visibleByDefault={false}
              hideOnClickOutside
            />
            <div className="hidden dark:block">
              <button
                type="button"
                aria-label="Use Light Mode"
                onClick={() => {
                  window.__setPreferredTheme('light');
                }}
                className="flex lg:hidden items-center p-1 h-full ml-4 lg:ml-6">
                {lightIcon}
              </button>
            </div>
          </div>
        </nav>

        {isOpen && (
          <div className="bg-wash dark:bg-wash-dark px-5 flex justify-end border-b border-border dark:border-border-dark items-center self-center w-full z-10">
            <TabButton
              isActive={tab === 'learn' || tab === 'home'}
              onClick={() => selectTab('learn')}>
              Learn
            </TabButton>
            <TabButton
              isActive={tab === 'reference'}
              onClick={() => selectTab('reference')}>
              Reference
            </TabButton>
          </div>
        )}

        <div
          ref={scrollParentRef}
          className="overflow-y-scroll no-bg-scrollbar lg:w-[336px] grow bg-wash dark:bg-wash-dark">
          <aside
            className={cn(
              `lg:grow lg:flex flex-col w-full pb-8 lg:pb-0 lg:max-w-xs z-10`,
              isOpen ? 'block z-40' : 'hidden lg:block'
            )}>
            <nav
              role="navigation"
              style={{'--bg-opacity': '.2'} as React.CSSProperties} // Need to cast here because CSS vars aren't considered valid in TS types (cuz they could be anything)
              className="w-full lg:h-auto grow pr-0 lg:pr-5 pt-6 lg:py-6 md:pt-4 lg:pt-4 scrolling-touch scrolling-gpu">
              {/* No fallback UI so need to be careful not to suspend directly inside. */}
              <Suspense fallback={null}>
                <SidebarRouteTree
                  // Don't share state between the desktop and mobile versions.
                  // This avoids unnecessary animations and visual flicker.
                  key={isOpen ? 'mobile-overlay' : 'desktop-or-hidden'}
                  routeTree={routeTree}
                  breadcrumbs={breadcrumbs}
                  isForceExpanded={isOpen}
                />
              </Suspense>
              <div className="h-20" />
            </nav>
            <Feedback
              className={(visible) =>
                `fixed bottom-0 hidden ${visible ? 'lg:block' : ''}`
              }
              visibleByDefault={true}
            />
          </aside>
        </div>
      </div>
    </FeedbackProvider>
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
    'inline-flex items-center w-full border-b-2 justify-center text-base leading-9 px-3 pb-0.5 hover:text-link hover:gray-5',
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
