/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 */

import React from 'react';
import {ExternalLink} from './ExternalLink';

// TODO: Unify with the old site settings.
const bannerText = 'Support Ukraine 🇺🇦';
const bannerLink = 'https://opensource.fb.com/support-ukraine';
const bannerLinkText = 'Help Provide Humanitarian Aid to Ukraine';

// Keep these synced:
const bannerHeightJs = 40;
const bannerHeightTw = 'h-[40px]';

if (typeof window !== 'undefined') {
  // Assume it's Next.js scroll restoration.
  const realScrollTo = window.scrollTo;
  (window as any).scrollTo = function scrollToPatchedForSocialBanner(
    x: number,
    y: number
  ) {
    if (y === 0) {
      // We're trying to reset scroll.
      // If we already scrolled past the banner, consider it as y = 0.
      y = Math.min(window.scrollY, bannerHeightJs);
    }
    return realScrollTo(x, y);
  };
}

export default function SocialBanner() {
  return (
    <div
      className={
        bannerHeightTw +
        ` w-full bg-gray-100 dark:bg-gray-700 text-base md:text-lg py-2 sm:py-0 flex items-center justify-center flex-col sm:flex-row z-[100]`
      }>
      <div className="hidden sm:block">{bannerText}</div>
      <ExternalLink
        className="ml-0 sm:ml-1 text-link dark:text-link-dark hover:underline"
        href={bannerLink}>
        <div className="inline sm:hidden">🇺🇦 </div>
        {bannerLinkText}
        <span className="hidden sm:inline">.</span>
      </ExternalLink>
    </div>
  );
}
