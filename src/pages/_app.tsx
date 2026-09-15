/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
    // Taken from StackOverflow. Trying to detect both Safari desktop and mobile.
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      // This is kind of a lie.
      // We still rely on the manual Next.js scrollRestoration logic.
      // However, we *also* don't want Safari grey screen during the back swipe gesture.
      // Seems like it doesn't hurt to enable auto restore *and* Next.js logic at the same time.
      history.scrollRestoration = 'auto';
      return;
    }

    // For other browsers, Next.js keeps scrollRestoration as 'manual'.
    // That breaks the browser back button after in-page hash navigations
    // (/page -> /page#section -> back): the URL updates but scroll stays put.
    // Save the pre-hash scroll on the current history entry, then restore it
    // when the user navigates back to a hash-less URL on the same page.
    // See https://github.com/reactjs/react.dev/issues/787
    const SCROLL_KEY = '__reactDevHashScrollY';

    const saveScrollBeforeHashNavigation = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const anchor = target.closest('a');
      if (!anchor) {
        return;
      }
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#') || href === '#') {
        return;
      }
      // Ignore modified clicks / new tabs — those don't use history the same way.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      history.replaceState(
        Object.assign({}, history.state, {[SCROLL_KEY]: window.scrollY}),
        ''
      );
    };

    const restoreScrollAfterHashBack = (event: PopStateEvent) => {
      if (window.location.hash) {
        return;
      }
      const state = event.state as {[SCROLL_KEY]?: number} | null;
      const scrollY = state?.[SCROLL_KEY];
      if (typeof scrollY !== 'number') {
        return;
      }
      // Defer so we run after any competing scroll resets from the router.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollY);
        });
      });
    };

    document.addEventListener('click', saveScrollBeforeHashNavigation, true);
    window.addEventListener('popstate', restoreScrollAfterHashBack);
    return () => {
      document.removeEventListener(
        'click',
        saveScrollBeforeHashNavigation,
        true
      );
      window.removeEventListener('popstate', restoreScrollAfterHashBack);
    };
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
