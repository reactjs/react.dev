/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Suspense} from 'react';
import type {Metadata, Viewport} from 'next';
import {Analytics} from 'components/Analytics';
import {DevContentRefresher} from 'components/DevContentRefresher';
import {SafariScrollHandler} from 'components/SafariScrollHandler';
import {ThemeScript} from 'components/ThemeScript';
import {UwuScript} from 'components/UwuScript';
import {siteConfig} from 'siteConfig';

import '@docsearch/css';
import '../styles/algolia.css';
import '../styles/index.css';
import '../styles/sandpack.css';

export const viewport: Viewport = {
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: '#23272f'},
    {media: '(prefers-color-scheme: dark)', color: '#23272f'},
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://react.dev'),
  description:
    'React is the library for web and native user interfaces. Build user interfaces out of individual pieces called components written in JavaScript.',
  manifest: '/site.webmanifest',
  openGraph: {
    images: ['/images/og-default.png'],
    siteName: 'React',
    type: 'website',
  },
  other: {
    'fb:app_id': '623268441017527',
    'msapplication-TileColor': '#2b5797',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@reactjs',
    images: ['/images/og-default.png'],
    site: '@reactjs',
  },
  verification: {
    google: 'sIlAGs48RulR4DdP95YSWNKZIEtCqQmRjzn-Zq-CcD0',
  },
  icons: {
    apple: [
      {url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png'},
    ],
    icon: [
      {url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png'},
      {url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png'},
    ],
    other: [
      {rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#404756'},
    ],
  },
};

function FontPreload() {
  return (
    <>
      <link
        rel="preconnect"
        href={`https://${siteConfig.algolia.appId}-dsn.algolia.net`}
      />
      <link
        rel="preload"
        href="/fonts/Source-Code-Pro-Regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Source-Code-Pro-Bold.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Optimistic_Display_W_Md.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Optimistic_Display_W_SBd.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Optimistic_Display_W_Bd.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Optimistic_Text_W_Md.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Optimistic_Text_W_Bd.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Optimistic_Text_W_Rg.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Optimistic_Text_W_It.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    </>
  );
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang={siteConfig.languageCode}
      dir={siteConfig.isRTL ? 'rtl' : 'ltr'}
      suppressHydrationWarning>
      <head>
        <FontPreload />
        <ThemeScript />
        <UwuScript />
      </head>
      <body className="font-text font-medium antialiased text-lg bg-wash dark:bg-wash-dark text-secondary dark:text-secondary-dark leading-base">
        <SafariScrollHandler />
        {process.env.NODE_ENV !== 'production' ? <DevContentRefresher /> : null}
        {children}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
