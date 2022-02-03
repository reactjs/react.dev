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
import {Button} from 'components/Button';
import {MobileNav} from '../Nav/MobileNav';

const SIDEBAR_BREAKPOINT = 1023;

export function Sidebar({isMobileOnly}: {isMobileOnly?: boolean}) {
  const {menuRef, isOpen} = React.useContext(MenuContext);
  const isMobileSidebar = useMediaQuery(SIDEBAR_BREAKPOINT);
  let routeTree = React.useContext(SidebarContext);
  const isHidden = isMobileSidebar ? !isOpen : false;

  // HACK. Fix up the data structures instead.
  if ((routeTree as any).routes.length === 1) {
    routeTree = (routeTree as any).routes[0];
  }

  const feedbackIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      className="mr-2"
      viewBox="0 0 24 24">
      <g fill="none" fillRule="evenodd" transform="translate(-444 -204)">
        <g fill="currentColor" transform="translate(354.5 205)">
          <path d="M102.75 14C102.75 14.6905 102.1905 15.25 101.5 15.25 100.8095 15.25 100.25 14.6905 100.25 14 100.25 13.3095 100.8095 12.75 101.5 12.75 102.1905 12.75 102.75 13.3095 102.75 14M101 5.25L101.5 11 102 5.25C102 5.25 102 4.75 101.5 4.75 101 4.75 101 5.25 101 5.25" />
          <path
            fillRule="nonzero"
            d="M100.25282,5.31497221 L100.75282,11.0649722 C100.832243,11.9783426 102.167757,11.9783426 102.24718,11.0649722 L102.74718,5.31497221 L102.75,5.25 C102.75,5.08145956 102.716622,4.88119374 102.60832,4.6645898 C102.407353,4.2626558 102.01337,4 101.5,4 C100.98663,4 100.592647,4.2626558 100.39168,4.6645898 C100.283378,4.88119374 100.25,5.08145956 100.25,5.25 L100.25282,5.31497221 Z M101.249053,5.22834322 L101.24717,5.25 L101.75283,5.25 L101.750947,5.22834322 L101.5,5.20652174 L101.249053,5.22834322 Z M101.25,5.25 L101.75,5.25 C101.75,5.29354044 101.747872,5.30630626 101.73332,5.3354102 C101.688603,5.4248442 101.57587,5.5 101.5,5.5 C101.42413,5.5 101.311397,5.4248442 101.26668,5.3354102 C101.252128,5.30630626 101.25,5.29354044 101.25,5.25 Z"
          />
          <path
            fillRule="nonzero"
            d="M96.2928885,18.5085 L109.75,18.5085 C111.268908,18.5085 112.5085,17.268908 112.5085,15.75 L112.5085,3.25 C112.5085,1.73109202 111.268908,0.4915 109.75,0.4915 L93.25,0.4915 C91.731092,0.4915 90.4915,1.73109202 90.4915,3.25 L90.4915,21.5 C90.4915,22.3943136 91.5519083,22.8250723 92.1764221,22.2491522 L92.230357,22.1957095 L96.2928885,18.5085 Z M92.0085,3.25 C92.0085,2.56890798 92.568908,2.0085 93.25,2.0085 L109.75,2.0085 C110.431092,2.0085 110.9915,2.56890798 110.9915,3.25 L110.9915,15.75 C110.9915,16.431092 110.431092,16.9915 109.75,16.9915 L96,16.9915 C95.8115227,16.9915 95.6297966,17.0616721 95.4902321,17.1883427 L92.0085,20.3484106 L92.0085,3.25 Z"
          />
        </g>
        <polygon points="444 228 468 228 468 204 444 204" />
      </g>
    </svg>
  );
  return (
    <aside
      className={cn(
        `lg:flex-grow lg:flex flex-col w-full pt-4 pb-8 lg:pb-0 lg:max-w-xs fixed lg:sticky bg-wash dark:bg-wash-dark z-10 top-0`,
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
        className="w-full h-screen lg:h-auto flex-grow pr-0 lg:pr-5 pt-6 pb-44 lg:pb-0 lg:py-6 md:pt-4 lg:pt-4 overflow-y-scroll lg:overflow-y-auto scrolling-touch scrolling-gpu"
      >
        {isMobileSidebar ? (
          <MobileNav />
        ) : (
          <SidebarRouteTree routeTree={routeTree} />
        )}
      </nav>
      <div className="px-2 py-3 shadow-inner rounded-lg m-4 bg-card dark:bg-card-dark sticky bottom-0 lg:px-3 hidden lg:flex">
        <p className="w-full font-bold">Is this page useful?</p>
        <button
          className="bg-secondary-button dark:bg-secondary-button-dark rounded-lg text-primary dark:text-primary-dark px-3 mr-2"
          onClick={() => {
            gtag('event', 'feedback', {
              event_category: 'button',
              event_label: window.location.pathname,
              value: 1,
            });
          }}>
          <svg
            width="16"
            height="18"
            viewBox="0 0 16 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.36603 0.384603C9.36605 0.384617 9.36601 0.384588 9.36603 0.384603L9.45902 0.453415C9.99732 0.851783 10.3873 1.42386 10.5654 2.07648C10.7435 2.72909 10.6993 3.42385 10.44 4.04763L9.27065 6.86008H12.6316C13.5249 6.86008 14.3817 7.22121 15.0134 7.86402C15.6451 8.50683 16 9.37868 16 10.2877V13.7154C16 14.8518 15.5564 15.9416 14.7668 16.7451C13.9771 17.5486 12.9062 18 11.7895 18H5.05263C3.71259 18 2.42743 17.4583 1.47988 16.4941C0.532325 15.5299 0 14.2221 0 12.8585V11.2511C2.40928e-06 9.87711 0.463526 8.54479 1.31308 7.47688L6.66804 0.745592C6.98662 0.345136 7.44414 0.08434 7.94623 0.0171605C8.4483 -0.0500155 8.95656 0.0815891 9.36603 0.384603ZM8.37542 1.77064C8.31492 1.72587 8.23987 1.70646 8.16579 1.71637C8.09171 1.72628 8.02415 1.76477 7.97708 1.82393L2.62213 8.55522C2.0153 9.31801 1.68421 10.2697 1.68421 11.2511V12.8585C1.68421 13.7676 2.03909 14.6394 2.67079 15.2822C3.30249 15.925 4.15927 16.2862 5.05263 16.2862H11.7895C12.4595 16.2862 13.1021 16.0153 13.5759 15.5332C14.0496 15.0511 14.3158 14.3972 14.3158 13.7154V10.2877C14.3158 9.83321 14.1383 9.39729 13.8225 9.07588C13.5066 8.75448 13.0783 8.57392 12.6316 8.57392H8C7.71763 8.57392 7.45405 8.4299 7.29806 8.19039C7.14206 7.95087 7.11442 7.64774 7.22445 7.38311L8.88886 3.37986C9 3.11253 9.01896 2.81477 8.94262 2.53507C8.8663 2.25541 8.69921 2.01027 8.46853 1.83954L8.37542 1.77064Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <button
          className="bg-secondary-button dark:bg-secondary-button-dark rounded-lg text-primary dark:text-primary-dark px-3"
          onClick={() => {
            gtag('event', 'feedback', {
              event_category: 'button',
              event_label: window.location.pathname,
              value: 0,
            });
          }}>
          <svg
            width="16"
            height="18"
            viewBox="0 0 16 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.63397 17.6154C6.63395 17.6154 6.63399 17.6154 6.63397 17.6154L6.54098 17.5466C6.00268 17.1482 5.61269 16.5761 5.43458 15.9235C5.25648 15.2709 5.30069 14.5761 5.56004 13.9524L6.72935 11.1399L3.36842 11.1399C2.47506 11.1399 1.61829 10.7788 0.986585 10.136C0.354883 9.49316 8.1991e-07 8.62132 8.99384e-07 7.71225L1.19904e-06 4.28458C1.29838e-06 3.14824 0.443605 2.05844 1.23323 1.25492C2.02286 0.451403 3.09383 -1.12829e-06 4.21053 -1.03067e-06L10.9474 -4.41715e-07C12.2874 -3.24565e-07 13.5726 0.541687 14.5201 1.50591C15.4677 2.47013 16 3.77789 16 5.1415L16 6.74893C16 8.12289 15.5365 9.45521 14.6869 10.5231L9.33196 17.2544C9.01338 17.6549 8.55586 17.9157 8.05377 17.9828C7.5517 18.05 7.04344 17.9184 6.63397 17.6154ZM7.62458 16.2294C7.68508 16.2741 7.76013 16.2935 7.83421 16.2836C7.90829 16.2737 7.97585 16.2352 8.02292 16.1761L13.3779 9.44478C13.9847 8.68199 14.3158 7.73033 14.3158 6.74892L14.3158 5.1415C14.3158 4.23242 13.9609 3.36058 13.3292 2.71777C12.6975 2.07496 11.8407 1.71383 10.9474 1.71383L4.21053 1.71383C3.5405 1.71383 2.89793 1.98468 2.42415 2.46679C1.95038 2.94889 1.68421 3.60277 1.68421 4.28458L1.68421 7.71225C1.68421 8.16679 1.86166 8.60271 2.1775 8.92411C2.49335 9.24552 2.92174 9.42608 3.36842 9.42608L8 9.42608C8.28237 9.42608 8.54595 9.5701 8.70195 9.80961C8.85794 10.0491 8.88558 10.3523 8.77555 10.6169L7.11114 14.6201C7 14.8875 6.98105 15.1852 7.05738 15.4649C7.1337 15.7446 7.30079 15.9897 7.53147 16.1605L7.62458 16.2294Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </aside>
  );
}
