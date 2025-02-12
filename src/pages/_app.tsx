/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useEffect} from 'react';
import {AppProps} from 'next/app';
import {useRouter} from 'next/router';

import '@docsearch/css';
import '../styles/algolia.css';
import '../styles/index.css';
import '../styles/sandpack.css';

if (typeof window !== 'undefined') {
  const terminationEvent = 'onpagehide' in window ? 'pagehide' : 'unload';
  window.addEventListener(terminationEvent, function () {
    // @ts-ignore
    gtag('event', 'timing', {
      event_label: 'JS Dependencies',
      event: 'unload',
    });
  });
}

export default function MyApp({Component, pageProps}: AppProps) {
  const router = useRouter();

  useEffect(() => {
    history.scrollRestoration = 'auto';
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const cleanedUrl = url.split(/[\?\#]/)[0];
      // @ts-ignore
      gtag('event', 'pageview', {
        event_label: cleanedUrl,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}
