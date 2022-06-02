/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 */

import React, {useEffect, useState} from 'react';
import {ExternalLink} from './ExternalLink';

// TODO: Unify with the old site settings.
// Turning this off also requires changing the Page top value to pull up the sidebar.
const bannerText = 'Support Ukraine 🇺🇦';
const bannerLink = 'https://opensource.fb.com/support-ukraine';
const bannerLinkText = 'Help Provide Humanitarian Aid to Ukraine.';

export default function SocialBanner() {
  const [showBanner, setShowBanner] = useState(true);
  const updateVisibility = () => setShowBanner(window.scrollY <= 6);
  useEffect(() => {
    setShowBanner(window.scrollY <= 6);
    window.addEventListener('scroll', updateVisibility);
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);
  return (
    <div
      className={
        showBanner
          ? `w-full bg-gray-100 dark:bg-gray-700 fixed py-2 h-16 sm:h-10 sm:py-0 flex items-center justify-center flex-col sm:flex-row z-[100]`
          : 'hidden'
      }>
      {bannerText}
      <ExternalLink
        className="ml-0 sm:ml-1 text-link dark:text-link-dark hover:underline"
        href={bannerLink}>
        {bannerLinkText}
      </ExternalLink>
    </div>
  );
}
