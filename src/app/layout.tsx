/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Metadata, Viewport} from 'next';
import Script from 'next/script';
import {siteConfig} from '../siteConfig';
import {AnalyticsTracker, ScrollRestoration} from './clientEffects';

import '@docsearch/css';
import '../styles/algolia.css';
import '../styles/index.css';
import '../styles/sandpack.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#23272f',
};

export const metadata: Metadata = {
  metadataBase: new URL(
    `https://${
      siteConfig.languageCode === 'en' ? '' : siteConfig.languageCode + '.'
    }react.dev`
  ),
  applicationName: 'React',
  icons: {
    icon: [
      {url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png'},
      {url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png'},
    ],
    apple: [{url: '/apple-touch-icon.png', sizes: '180x180'}],
    other: [
      {rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#404756'},
    ],
  },
  manifest: '/site.webmanifest',
  // Items here render as `<meta name="...">`. Property-style tags
  // (`<meta property="...">`) like `fb:app_id` must be rendered directly
  // in `<head>` below, since Next's `metadata.other` only emits `name=`.
  other: {
    'msapplication-TileColor': '#2b5797',
    'google-site-verification': 'sIlAGs48RulR4DdP95YSWNKZIEtCqQmRjzn-Zq-CcD0',
  },
};

const themeScript = `
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
            console.log('logo credit to @sawaratsuki1004 via https://github.com/SAWARATSUKI/KawaiiLogos');
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

  document.documentElement.classList.add(
      window.navigator.platform.includes('Mac')
      ? "platform-mac"
      : "platform-win"
  );
})();
`;

const FONT_PRELOADS = [
  'Source-Code-Pro-Regular.woff2',
  'Source-Code-Pro-Bold.woff2',
  'Optimistic_Display_W_Md.woff2',
  'Optimistic_Display_W_SBd.woff2',
  'Optimistic_Display_W_Bd.woff2',
  'Optimistic_Text_W_Md.woff2',
  'Optimistic_Text_W_Bd.woff2',
  'Optimistic_Text_W_Rg.woff2',
  'Optimistic_Text_W_It.woff2',
];

export default function RootLayout({children}: {children: React.ReactNode}) {
  const gaId = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
  return (
    <html lang={siteConfig.languageCode} dir={siteConfig.isRTL ? 'rtl' : 'ltr'}>
      <head>
        {/* RSS autodiscovery */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="React Blog RSS Feed"
          href="/rss.xml"
        />
        {/* Preconnect to Algolia DocSearch for faster first-open search */}
        <link
          rel="preconnect"
          href={`https://${siteConfig.algolia.appId}-dsn.algolia.net`}
        />
        {/* Facebook app id is a property-style meta tag and can't be expressed
            via Next's `metadata.other`, which emits `name=` tags. */}
        <meta property="fb:app_id" content="623268441017527" />
        {FONT_PRELOADS.map((file) => (
          <link
            key={file}
            rel="preload"
            href={`https://react.dev/fonts/${file}`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
        {gaId && (
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
        )}
        {gaId && (
          <Script
            id="ga-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${gaId}', {send_page_view: false});`,
            }}
          />
        )}
      </head>
      <body className="font-text font-medium antialiased text-lg bg-wash dark:bg-wash-dark text-secondary dark:text-secondary-dark leading-base">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{__html: themeScript}}
        />
        <ScrollRestoration />
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
