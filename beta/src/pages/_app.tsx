/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {AppProps} from 'next/app';
import {useRouter} from 'next/router';
import {ga} from '../utils/analytics';

import '@docsearch/css';
import '../styles/algolia.css';
import '../styles/index.css';
import '../styles/sandpack.css';
import '@codesandbox/sandpack-react/dist/index.css';

if (typeof window !== 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    ga('create', process.env.NEXT_PUBLIC_GA_TRACKING_ID, 'auto');
  }
  const terminationEvent = 'onpagehide' in window ? 'pagehide' : 'unload';
  window.addEventListener(terminationEvent, function () {
    ga('send', 'timing', 'JS Dependencies', 'unload');
  });
}

export default function MyApp({Component, pageProps}: AppProps) {
  const router = useRouter();

  React.useEffect(() => {
    // This is kind of a lie.
    // We still rely on the manual Next.js scrollRestoration logic.
    // However, we *also* don't want Safari grey screen during the back swipe gesture.
    // Seems like it doesn't hurt to enable auto restore *and* Next.js logic at the same time.
    history.scrollRestoration = 'auto';
  }, []);

  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      ga('set', 'page', url);
      ga('send', 'pageview');
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}
