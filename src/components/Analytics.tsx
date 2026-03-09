'use client';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import Script from 'next/script';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const terminationEvent = 'onpagehide' in window ? 'pagehide' : 'unload';
    const handleTermination = () => {
      window.gtag?.('event', 'timing', {
        event: 'unload',
        event_label: 'JS Dependencies',
      });
    };

    window.addEventListener(terminationEvent, handleTermination);
    return () => {
      window.removeEventListener(terminationEvent, handleTermination);
    };
  }, []);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    window.gtag?.('event', 'pageview', {
      event_label: pathname,
    });
  }, [pathname]);

  if (!process.env.NEXT_PUBLIC_GA_TRACKING_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}');
        `}
      </Script>
    </>
  );
}
