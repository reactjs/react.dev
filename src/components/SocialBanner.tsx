/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 */

import {useRef, useEffect} from 'react';
import cn from 'classnames';
import {ExternalLink} from './ExternalLink';

const bannerText = 'Support Ukraine 🇺🇦';
const bannerLink = 'https://opensource.fb.com/support-ukraine';
const bannerLinkText = 'Help Provide Humanitarian Aid to Ukraine';

export default function SocialBanner() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function patchedScrollTo(x: number, y: number) {
      if (y === 0) {
        // We're trying to reset scroll.
        // If we already scrolled past the banner, consider it as y = 0.
        const bannerHeight = ref.current?.offsetHeight ?? 0; // Could be zero (e.g. mobile)
        y = Math.min(window.scrollY, bannerHeight);
      }
      return realScrollTo(x, y);
    }
    const realScrollTo = window.scrollTo;
    (window as any).scrollTo = patchedScrollTo;
    return () => {
      (window as any).scrollTo = realScrollTo;
    };
  }, []);
  return (
    <div
      ref={ref}
      className={cn(
        `z-[100] hidden h-[40px] w-full flex-col items-center justify-center bg-gray-100 py-2 text-base dark:bg-gray-700 sm:flex-row sm:py-0 md:text-lg lg:flex`
      )}>
      <div className="hidden sm:block">{bannerText}</div>
      <ExternalLink
        className="ml-0 text-link hover:underline dark:text-link-dark sm:ml-1"
        href={bannerLink}>
        <div className="inline sm:hidden">🇺🇦 </div>
        {bannerLinkText}
        <span className="hidden sm:inline">.</span>
      </ExternalLink>
    </div>
  );
}
