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
import {useActiveSection} from 'hooks/useActiveSection';
import {Logo} from '../../Logo';
import {Feedback} from '../Feedback';
import NavLink from './NavLink';
import {SidebarContext} from 'components/Layout/useRouteMeta';
import {SidebarRouteTree} from '../Sidebar/SidebarRouteTree';
import type {RouteItem} from '../useRouteMeta';
import sidebarHome from '../../../sidebarHome.json';
import sidebarLearn from '../../../sidebarLearn.json';
import sidebarReference from '../../../sidebarReference.json';

declare global {
  interface Window {
    __theme: string;
    __setPreferredTheme: (theme: string) => void;
  }
}

const feedbackIcon = (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.41477 2.29921C8.41479 2.29923 8.41476 2.2992 8.41477 2.29921L8.48839 2.35275C8.91454 2.66267 9.22329 3.10774 9.36429 3.61547C9.50529 4.12319 9.47029 4.6637 9.26497 5.14899L8.33926 7.33703H11C11.7072 7.33703 12.3855 7.61798 12.8856 8.11807C13.3857 8.61817 13.6667 9.29645 13.6667 10.0037V12.6704C13.6667 13.5544 13.3155 14.4023 12.6904 15.0274C12.0652 15.6525 11.2174 16.0037 10.3333 16.0037H5C3.93914 16.0037 2.92172 15.5823 2.17157 14.8321C1.42142 14.082 1 13.0646 1 12.0037V10.7531C1 9.68422 1.36696 8.6477 2.03953 7.81688L6.27886 2.58006C6.53107 2.26851 6.89328 2.06562 7.29077 2.01335C7.68823 1.96109 8.09061 2.06347 8.41477 2.29921ZM7.63054 3.37753C7.58264 3.34269 7.52323 3.32759 7.46459 3.33531C7.40594 3.34302 7.35245 3.37296 7.31519 3.41899L3.07585 8.65581C2.59545 9.24925 2.33333 9.98963 2.33333 10.7531V12.0037C2.33333 12.7109 2.61428 13.3892 3.11438 13.8893C3.61448 14.3894 4.29275 14.6704 5 14.6704H10.3333C10.8638 14.6704 11.3725 14.4596 11.7475 14.0846C12.1226 13.7095 12.3333 13.2008 12.3333 12.6704V10.0037C12.3333 9.65007 12.1929 9.31093 11.9428 9.06088C11.6928 8.81084 11.3536 8.67036 11 8.67036H7.33333C7.10979 8.67036 6.90112 8.55832 6.77763 8.37198C6.65413 8.18564 6.63225 7.94981 6.71936 7.74393L8.03701 4.62947C8.125 4.42149 8.14001 4.18984 8.07958 3.97224C8.01916 3.75467 7.88687 3.56396 7.70425 3.43113L7.63054 3.37753Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.2517 25.7047C19.2517 25.7047 19.2517 25.7047 19.2517 25.7047L19.1781 25.6512C18.752 25.3412 18.4432 24.8962 18.3022 24.3884C18.1612 23.8807 18.1962 23.3402 18.4015 22.8549L19.3272 20.6669L16.6665 20.6669C15.9593 20.6669 15.281 20.3859 14.7809 19.8858C14.2808 19.3857 13.9998 18.7075 13.9998 18.0002L13.9998 15.3335C13.9998 14.4495 14.351 13.6016 14.9761 12.9765C15.6013 12.3514 16.4491 12.0002 17.3332 12.0002L22.6665 12.0002C23.7274 12.0002 24.7448 12.4216 25.4949 13.1718C26.2451 13.9219 26.6665 14.9393 26.6665 16.0002L26.6665 17.2508C26.6665 18.3197 26.2995 19.3562 25.627 20.187L21.3876 25.4238C21.1354 25.7354 20.7732 25.9383 20.3757 25.9906C19.9783 26.0428 19.5759 25.9404 19.2517 25.7047ZM20.036 24.6264C20.0839 24.6612 20.1433 24.6763 20.2019 24.6686C20.2606 24.6609 20.3141 24.6309 20.3513 24.5849L24.5907 19.3481C25.0711 18.7547 25.3332 18.0143 25.3332 17.2508L25.3332 16.0002C25.3332 15.293 25.0522 14.6147 24.5521 14.1146C24.052 13.6145 23.3738 13.3335 22.6665 13.3335L17.3332 13.3335C16.8027 13.3335 16.294 13.5443 15.919 13.9193C15.5439 14.2944 15.3332 14.8031 15.3332 15.3335L15.3332 18.0002C15.3332 18.3538 15.4736 18.693 15.7237 18.943C15.9737 19.1931 16.3129 19.3335 16.6665 19.3335L20.3332 19.3335C20.5567 19.3335 20.7654 19.4456 20.8889 19.6319C21.0124 19.8183 21.0343 20.0541 20.9471 20.26L19.6295 23.3744C19.5415 23.5824 19.5265 23.8141 19.5869 24.0317C19.6473 24.2492 19.7796 24.4399 19.9623 24.5728L20.036 24.6264Z"
      fill="currentColor"
    />
  </svg>
);

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

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const scrollParentRef = useRef<HTMLDivElement>(null);
  const feedbackAutohideRef = useRef<any>(null);
  const section = useActiveSection();
  const {asPath} = useRouter();
  const feedbackPopupRef = useRef<null | HTMLDivElement>(null);

  // In desktop mode, use the route tree for current route.
  let routeTree: RouteItem = useContext(SidebarContext);
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
        routeTree = sidebarHome as RouteItem;
        break;
      case 'learn':
        routeTree = sidebarLearn as RouteItem;
        break;
      case 'apis':
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

  function handleFeedback() {
    clearTimeout(feedbackAutohideRef.current);
    setShowFeedback(!showFeedback);
  }

  // Hide the Feedback widget on any click outside.
  useEffect(() => {
    if (!showFeedback) {
      return;
    }
    function handleDocumentClickCapture(e: MouseEvent) {
      if (!feedbackPopupRef.current!.contains(e.target as any)) {
        e.stopPropagation();
        e.preventDefault();
        setShowFeedback(false);
      }
    }
    document.addEventListener('click', handleDocumentClickCapture, {
      capture: true,
    });
    return () =>
      document.removeEventListener('click', handleDocumentClickCapture, {
        capture: true,
      });
  }, [showFeedback]);

  function selectTab(nextTab: 'learn' | 'apis' | 'home') {
    setTab(nextTab);
    scrollParentRef.current!.scrollTop = 0;
  }

  return (
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
            <div className="px-1 mb-px bg-highlight dark:bg-highlight-dark rounded text-link dark:text-link-dark uppercase font-bold tracking-wide text-xs whitespace-nowrap">
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
        <div className="px-0 pt-2 w-full 2xl:max-w-xs hidden lg:flex items-center self-center border-b-0 lg:border-b border-border dark:border-border-dark">
          <NavLink href="/" isActive={section === 'home'}>
            Home
          </NavLink>
          <NavLink href="/learn" isActive={section === 'learn'}>
            Learn
          </NavLink>
          <NavLink href="/apis/react" isActive={section === 'apis'}>
            API
          </NavLink>
        </div>
        <div className="flex my-4 h-10 mx-0 w-full lg:hidden justify-end lg:max-w-sm">
          <Search />
          <button
            aria-label="Give feedback"
            type="button"
            className={cn(
              'inline-flex lg:hidden items-center rounded-full px-1.5 ml-4 lg:ml-6 relative top-px',
              {
                'bg-card dark:bg-card-dark': showFeedback,
              }
            )}
            onClick={handleFeedback}>
            {feedbackIcon}
          </button>
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
          <div
            ref={feedbackPopupRef}
            className={cn(
              'fixed top-12 right-0',
              showFeedback ? 'block' : 'hidden'
            )}>
            <Feedback
              onSubmit={() => {
                clearTimeout(feedbackAutohideRef.current);
                feedbackAutohideRef.current = setTimeout(() => {
                  setShowFeedback(false);
                }, 1000);
              }}
            />
          </div>
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
            isActive={tab === 'home'}
            onClick={() => selectTab('home')}>
            Home
          </TabButton>
          <TabButton
            isActive={tab === 'learn'}
            onClick={() => selectTab('learn')}>
            Learn
          </TabButton>
          <TabButton
            isActive={tab === 'apis'}
            onClick={() => selectTab('apis')}>
            API
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
          {!isOpen && (
            <div className="px-5 sm:pt-10 lg:pt-4">
              <Search />
            </div>
          )}
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
                isForceExpanded={isOpen}
              />
            </Suspense>
            <div className="h-20" />
          </nav>
          <div className="fixed bottom-0 hidden lg:block">
            <Feedback />
          </div>
        </aside>
      </div>
    </div>
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
