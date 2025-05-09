/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import cn from 'classnames';
import Image from 'next/image';
import NextLink from 'next/link';
import * as React from 'react';
import {Suspense} from 'react';

import {IconClose} from 'components/Icon/IconClose';
import {IconHamburger} from 'components/Icon/IconHamburger';
import {IconSearch} from 'components/Icon/IconSearch';
import NavItem from 'components/NavItem';
import {Search} from 'components/Search';
import {useMenuAndScroll} from 'hooks';
import {siteConfig} from 'siteConfig';
import {Logo} from '../../Logo';
import {Feedback} from '../Feedback';
import {SidebarRouteTree} from '../Sidebar';
import type {RouteItem} from '../getRouteMeta';
import BrandMenu from './BrandMenu';
import {IconGitHub} from 'components/Icon/IconGitHub';
import {IconLanguage} from 'components/Icon/IconLanguage';
import {IconLight} from 'components/Icon/IconLight';
import {IconDark} from 'components/Icon/IconDark';

declare global {
  interface Window {
    __theme: string;
    __setPreferredTheme: (theme: string) => void;
  }
}

function Link({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <NextLink
      href={`${href}`}
      className="inline leading-normal transition duration-100 ease-in border-b border-opacity-0 text-primary dark:text-primary-dark hover:text-link hover:dark:text-link-dark border-link hover:border-opacity-100"
      {...props}>
      {children}
    </NextLink>
  );
}

function Kbd(props: {children?: React.ReactNode; wide?: boolean}) {
  const {wide, ...rest} = props;
  const width = wide ? 'w-10' : 'w-5';

  return (
    <kbd
      className={`${width} h-5 border border-transparent me-1 bg-wash dark:bg-wash-dark text-gray-30 align-middle p-0 inline-flex justify-center items-center text-xs text-center rounded-md`}
      {...rest}
    />
  );
}

export default function TopNav({
  routeTree,
  breadcrumbs,
  section,
}: {
  routeTree: RouteItem;
  breadcrumbs: RouteItem[];
  section: 'learn' | 'reference' | 'community' | 'blog' | 'home' | 'unknown';
}) {
  const {
    isMenuOpen,
    setIsMenuOpen,
    showSearch,
    isScrolled,
    scrollParentRef,
    scrollDetectorRef,
    onOpenSearch,
    onCloseSearch,
  } = useMenuAndScroll(routeTree);

  return (
    <>
      <Search
        isOpen={showSearch}
        onOpen={onOpenSearch}
        onClose={onCloseSearch}
      />
      <div ref={scrollDetectorRef} />
      <div
        className={cn(
          isMenuOpen
            ? 'h-screen sticky top-0 lg:bottom-0 lg:h-screen flex flex-col shadow-nav dark:shadow-nav-dark z-20'
            : 'z-40 sticky top-0'
        )}>
        <nav
          className={cn(
            'duration-300 backdrop-filter backdrop-blur-lg backdrop-saturate-200 transition-shadow bg-opacity-90 items-center w-full flex justify-between bg-wash dark:bg-wash-dark dark:bg-opacity-95 px-1.5 lg:pe-5 lg:ps-4 z-40',
            {'dark:shadow-nav-dark shadow-nav': isScrolled || isMenuOpen}
          )}>
          <div className="flex items-center justify-between w-full h-16 gap-0 sm:gap-3">
            <div className="flex flex-row 3xl:flex-1 items-centers">
              <button
                type="button"
                aria-label="Menu"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  'active:scale-95 transition-transform flex lg:hidden w-12 h-12 rounded-full items-center justify-center hover:bg-primary/5 hover:dark:bg-primary-dark/5 outline-link',
                  {
                    'text-link dark:text-link-dark': isMenuOpen,
                  }
                )}>
                {isMenuOpen ? <IconClose /> : <IconHamburger />}
              </button>
              <BrandMenu>
                <div className="flex items-center">
                  <div className="uwu-visible flex items-center justify-center h-full">
                    <NextLink href="/">
                      <Image
                        alt="logo by @sawaratsuki1004"
                        title="logo by @sawaratsuki1004"
                        className="h-8"
                        priority
                        width={63}
                        height={32}
                        src="/images/uwu.png"
                      />
                    </NextLink>
                  </div>
                  <div className="uwu-hidden">
                    <NextLink
                      href="/"
                      className={`active:scale-95 overflow-hidden transition-transform relative items-center text-primary dark:text-primary-dark p-1 whitespace-nowrap outline-link rounded-full 3xl:rounded-xl inline-flex text-lg font-normal gap-2`}>
                      <Logo
                        className={cn(
                          'text-sm me-0 w-10 h-10 text-brand dark:text-brand-dark flex origin-center transition-all ease-in-out'
                        )}
                      />
                      <span className="sr-only 3xl:not-sr-only">React</span>
                    </NextLink>
                  </div>
                </div>
              </BrandMenu>
              <div className="flex flex-column justify-center items-center">
                <NextLink
                  href="/versions"
                  className=" flex py-2 flex-column justify-center items-center text-gray-50 dark:text-gray-30 hover:text-link hover:dark:text-link-dark hover:underline text-sm ms-1 cursor-pointer">
                  v{siteConfig.version}
                </NextLink>
              </div>
            </div>
            <div className="items-center justify-center flex-1 hidden w-full md:flex 3xl:w-auto 3xl:shrink-0 3xl:justify-center">
              <button
                type="button"
                className={cn(
                  'flex 3xl:w-[56rem] 3xl:mx-0 relative ps-4 pe-1 py-1 h-10 bg-gray-30/20 dark:bg-gray-40/20 outline-none focus:outline-link betterhover:hover:bg-opacity-80 pointer items-center text-start w-full text-gray-30 rounded-full align-middle text-base'
                )}
                onClick={onOpenSearch}>
                <IconSearch className="align-middle me-3 text-gray-30 shrink-0 group-betterhover:hover:text-gray-70" />
                Search
                <span className="hidden ms-auto sm:flex item-center me-1">
                  <Kbd data-platform="mac">⌘</Kbd>
                  <Kbd data-platform="win" wide>
                    Ctrl
                  </Kbd>
                  <Kbd>K</Kbd>
                </span>
              </button>
            </div>
            <div className="text-base justify-center items-center gap-1.5 flex 3xl:flex-1 flex-row 3xl:justify-end">
              <div className="mx-2.5 gap-1.5 hidden lg:flex">
                <NavItem isActive={section === 'learn'} url="/learn">
                  Learn
                </NavItem>
                <NavItem
                  isActive={section === 'reference'}
                  url="/reference/react">
                  Reference
                </NavItem>
                <NavItem isActive={section === 'community'} url="/community">
                  Community
                </NavItem>
                <NavItem isActive={section === 'blog'} url="/blog">
                  Blog
                </NavItem>
              </div>
              <div className="flex w-full md:hidden"></div>
              <div className="flex items-center -space-x-2.5 xs:space-x-0 ">
                <div className="flex md:hidden">
                  <button
                    aria-label="Search"
                    type="button"
                    className="flex items-center justify-center w-12 h-12 transition-transform rounded-full active:scale-95 md:hidden hover:bg-secondary-button hover:dark:bg-secondary-button-dark outline-link"
                    onClick={onOpenSearch}>
                    <IconSearch className="w-5 h-5 align-middle" />
                  </button>
                </div>
                <div className="flex dark:hidden">
                  <button
                    type="button"
                    aria-label="Use Dark Mode"
                    onClick={() => {
                      window.__setPreferredTheme('dark');
                    }}
                    className="flex items-center justify-center w-12 h-12 transition-transform rounded-full active:scale-95 hover:bg-primary/5 hover:dark:bg-primary-dark/5 outline-link">
                    {/* {darkIcon} */}
                    <IconDark />
                  </button>
                </div>
                <div className="hidden dark:flex">
                  <button
                    type="button"
                    aria-label="Use Light Mode"
                    onClick={() => {
                      window.__setPreferredTheme('light');
                    }}
                    className="flex items-center justify-center w-12 h-12 transition-transform rounded-full active:scale-95 hover:bg-primary/5 hover:dark:bg-primary-dark/5 outline-link">
                    {/* {lightIcon} */}
                    <IconLight />
                  </button>
                </div>
                <div className="flex">
                  <Link
                    href="/community/translations"
                    aria-label="Translations"
                    className="active:scale-95 transition-transform flex w-12 h-12 rounded-full items-center justify-center hover:bg-primary/5 hover:dark:bg-primary-dark/5 outline-link">
                    <IconLanguage />
                  </Link>
                </div>
                <div className="flex">
                  <Link
                    href="https://github.com/facebook/react/releases"
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="Open on GitHub"
                    className="flex items-center justify-center w-12 h-12 transition-transform rounded-full active:scale-95 hover:bg-primary/5 hover:dark:bg-primary-dark/5 outline-link">
                    {/* {githubIcon} */}
                    <IconGitHub />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {isMenuOpen && (
          <div
            ref={scrollParentRef}
            className="overflow-y-scroll isolate no-bg-scrollbar lg:w-[342px] grow bg-wash dark:bg-wash-dark">
            <aside
              className={cn(
                `lg:grow lg:flex flex-col w-full pb-8 lg:pb-0 lg:max-w-custom-xs z-40`,
                isMenuOpen ? 'block z-30' : 'hidden lg:block'
              )}>
              <nav
                role="navigation"
                style={{'--bg-opacity': '.2'} as React.CSSProperties} // Need to cast here because CSS vars aren't considered valid in TS types (cuz they could be anything)
                className="w-full pt-4 scrolling-touch lg:h-auto grow pe-0 lg:pe-5 lg:py-6 md:pt-4 lg:pt-4 scrolling-gpu">
                {/* No fallback UI so need to be careful not to suspend directly inside. */}
                <Suspense fallback={null}>
                  <div className="ps-3 xs:ps-5 xs:gap-0.5 xs:text-base overflow-x-auto flex flex-row lg:hidden text-base font-bold text-secondary dark:text-secondary-dark">
                    <NavItem isActive={section === 'learn'} url="/learn">
                      Learn
                    </NavItem>
                    <NavItem
                      isActive={section === 'reference'}
                      url="/reference/react">
                      Reference
                    </NavItem>
                    <NavItem
                      isActive={section === 'community'}
                      url="/community">
                      Community
                    </NavItem>
                    <NavItem isActive={section === 'blog'} url="/blog">
                      Blog
                    </NavItem>
                  </div>
                  <div
                    role="separator"
                    className="mt-4 mb-2 border-b ms-5 border-border dark:border-border-dark"
                  />
                  <SidebarRouteTree
                    // Don't share state between the desktop and mobile versions.
                    // This avoids unnecessary animations and visual flicker.
                    key={isMenuOpen ? 'mobile-overlay' : 'desktop-or-hidden'}
                    routeTree={routeTree}
                    breadcrumbs={breadcrumbs}
                    isForceExpanded={isMenuOpen}
                  />
                </Suspense>
                <div className="h-16" />
              </nav>
              <div className="fixed bottom-0 hidden lg:block">
                <Feedback />
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
