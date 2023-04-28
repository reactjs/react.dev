/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {AppProps} from 'next/app';

import '@docsearch/css';
import '../styles/algolia.css';
import '../styles/index.css';
import '../styles/sandpack.css';
import '../styles/translate.css';
import {useSetTheme} from 'jotai/theme';

let initiated = false;

export default function MyApp({Component, pageProps}: AppProps) {
  const setTheme = useSetTheme();

  if (typeof window !== 'undefined' && !initiated) {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme('');
    darkQuery.addEventListener('change', function (e) {
      setTheme(e.matches ? 'dark' : 'light');
    });

    document.documentElement.classList.add(
      window.navigator.platform.includes('Mac')
        ? 'platform-mac'
        : 'platform-win'
    );

    // Taken from StackOverflow. Trying to detect both Safari desktop and mobile.
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      // This is kind of a lie.
      // We still rely on the manual Next.js scrollRestoration logic.
      // However, we *also* don't want Safari grey screen during the back swipe gesture.
      // Seems like it doesn't hurt to enable auto restore *and* Next.js logic at the same time.
      history.scrollRestoration = 'auto';
    } else {
      // For other browsers, let Next.js set scrollRestoration to 'manual'.
      // It seems to work better for Chrome and Firefox which don't animate the back swipe.
    }

    initiated = true;
  }

  return <Component {...pageProps} />;
}
