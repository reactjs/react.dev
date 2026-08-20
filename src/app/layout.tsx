/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Metadata, Viewport} from 'next';
import Script from 'next/script';
import {siteConfig} from '../siteConfig';
import {
  AnalyticsTracker,
  ScrollRestoration,
  ThemeInitFallback,
} from './clientEffects';
import {themeScript} from './themeScript';

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

// Translation forks load the fonts from react.dev too.
const FONT_ORIGIN = 'https://react.dev';
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
    <html
      lang={siteConfig.languageCode}
      dir={siteConfig.isRTL ? 'rtl' : 'ltr'}
      suppressHydrationWarning>
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{__html: themeScript}}
        />
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
            href={`${FONT_ORIGIN}/fonts/${file}`}
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
              __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${gaId}');`,
            }}
          />
        )}
      </head>
      <body className="font-text font-medium antialiased text-lg bg-wash dark:bg-wash-dark text-secondary dark:text-secondary-dark leading-base">
        <ThemeInitFallback />
        <ScrollRestoration />
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
