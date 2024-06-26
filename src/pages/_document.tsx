/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Html, Head, Main, NextScript} from 'next/document';
import {siteConfig} from '../siteConfig';

const MyDocument = () => {
  return (
    <Html lang={siteConfig.languageCode} dir={siteConfig.isRTL ? 'rtl' : 'ltr'}>
      <Head />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#404756" />
      <meta name="msapplication-TileColor" content="#2b5797" />
      <meta name="theme-color" content="#23272f" />
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}');`,
        }}
      />
      <body className="font-text font-medium antialiased text-lg bg-wash dark:bg-wash-dark text-secondary dark:text-secondary-dark leading-base">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  let logShown = false;
                  function setUwu(isUwu) {
                    try {
                      if (isUwu) {
                        localStorage.setItem('uwu', true);
                        document.documentElement.classList.add('uwu');
                        if (!logShown) {
                          console.log('uwu mode! turn off with ?uwu=0');
                          console.log('logo credit to @sawaratsuki1004 via https://github.com/SAWARATSUKI/ServiceLogos');
                          logShown = true;
                        }
                      } else {
                        localStorage.removeItem('uwu');
                        document.documentElement.classList.remove('uwu');
                        console.log('uwu mode off. turn on with ?uwu');
                      }
                    } catch (err) { }
                  }
                  window.__setUwu = setUwu;
                  function checkQueryParam() {
                    const params = new URLSearchParams(window.location.search);
                    const value = params.get('uwu');
                    switch(value) {
                      case '':
                      case 'true':
                      case '1':
                        return true;
                      case 'false':
                      case '0':
                        return false;
                      default:
                        return null;
                    }
                  }
                  function checkLocalStorage() {
                    try {
                      return localStorage.getItem('uwu') === 'true';
                    } catch (err) {
                      return false;
                    }
                  }
                  const uwuQueryParam = checkQueryParam();
                  if (uwuQueryParam != null) {
                    setUwu(uwuQueryParam);
                  } else if (checkLocalStorage()) {
                    document.documentElement.classList.add('uwu');
                  }
                } catch (err) { }
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                (function () {
                  function setTheme(newTheme) {
                    window.__theme = newTheme;
                    if (newTheme === 'dark') {
                      document.documentElement.classList.add('dark');
                    } else if (newTheme === 'light') {
                      document.documentElement.classList.remove('dark');
                    }
                  }

                  var preferredTheme;
                  try {
                    preferredTheme = localStorage.getItem('theme');
                  } catch (err) { }

                  window.__setPreferredTheme = function(newTheme) {
                    preferredTheme = newTheme;
                    setTheme(newTheme);
                    try {
                      localStorage.setItem('theme', newTheme);
                    } catch (err) { }
                  };

                  var initialTheme = preferredTheme;
                  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

                  if (!initialTheme) {
                    initialTheme = darkQuery.matches ? 'dark' : 'light';
                  }
                  setTheme(initialTheme);

                  darkQuery.addEventListener('change', function (e) {
                    if (!preferredTheme) {
                      setTheme(e.matches ? 'dark' : 'light');
                    }
                  });

                  // Detect whether the browser is Mac to display platform specific content
                  // An example of such content can be the keyboard shortcut displayed in the search bar
                  document.documentElement.classList.add(
                      window.navigator.platform.includes('Mac')
                      ? "platform-mac" 
                      : "platform-win"
                  );
                })();
              `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;
