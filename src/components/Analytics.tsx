'use client';

import {useEffect} from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export function Analytics() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const terminationEvent = 'onpagehide' in window ? 'pagehide' : 'unload';
      const handleTermination = () => {
        window.gtag?.('event', 'timing', {
          event_label: 'JS Dependencies',
          event: 'unload',
        });
      };
      window.addEventListener(terminationEvent, handleTermination);
      return () =>
        window.removeEventListener(terminationEvent, handleTermination);
    }
  }, []);

  useEffect(() => {
    // If only we had router events. But patching pushState is what Vercel Analytics does.
    // https://va.vercel-scripts.com/v1/script.debug.js
    const originalPushState = history.pushState;

    history.pushState = function (...args) {
      const oldCleanedUrl = window.location.href.split(/[\?\#]/)[0];
      originalPushState.apply(history, args);
      const newCleanedUrl = window.location.href.split(/[\?\#]/)[0];
      if (oldCleanedUrl !== newCleanedUrl) {
        window?.gtag('set', 'page', newCleanedUrl);
        window?.gtag('send', 'pageview');
      }
    };
    return () => {
      history.pushState = originalPushState;
    };
  }, []);

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
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}');
        `}
      </Script>
    </>
  );
}
