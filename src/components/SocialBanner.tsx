/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 */

import {useRef, useEffect} from 'react';
import cn from 'classnames';
import {ExternalLink} from './ExternalLink';

const bannerText = 'Join us for React Conf on Oct 7-8.';
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
        `h-[40px] flex w-full bg-gray-100 dark:bg-gray-700 text-base md:text-lg py-2 items-center justify-center flex-col flex-row z-[100]`
      )}>
      <div className="block">
        {bannerText}
        <ExternalLink
          className="ms-1 text-link dark:text-link-dark hover:underline"
          href={bannerLink}>
          {bannerLinkText}
        </ExternalLink>
      </div>
    </div>
  );
}
