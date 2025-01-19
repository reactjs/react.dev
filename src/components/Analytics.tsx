'use client';

import {useEffect} from 'react';
import Script from 'next/script';
import {usePathname, useSearchParams} from 'next/navigation';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    if (pathname && window.gtag) {
      const cleanedUrl = `${pathname}${
        searchParams?.toString() ? `?${searchParams.toString()}` : ''
      }`.split(/[\?\#]/)[0];
      window.gtag('event', 'pageview', {
        event_label: cleanedUrl,
      });
    }
  }, [pathname, searchParams]);

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
