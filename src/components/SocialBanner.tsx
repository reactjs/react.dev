/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 */

import {useRef, useEffect} from 'react';
import cn from 'classnames';
import {ExternalLink} from './ExternalLink';

const bannerText = 'Join us for React Conf on May 15-16.';
const bannerLink = 'https://conf.react.dev/';
const bannerLinkText = 'Learn more.';

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
        `h-[40px] hidden lg:flex w-full bg-gray-100 dark:bg-gray-700 text-base md:text-lg py-2 sm:py-0 items-center justify-center flex-col sm:flex-row z-[100]`
      )}>
      <div className="hidden sm:block">{bannerText}</div>
      <ExternalLink
        className="ms-0 sm:ms-1 text-link dark:text-link-dark hover:underline"
        href={bannerLink}>
        {bannerLinkText}
      </ExternalLink>
    </div>
  );
}
