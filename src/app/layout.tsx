import {siteConfig} from '../siteConfig';
import {Analytics} from 'components/Analytics';
import {ScrollHandler} from 'components/SafariScrollHandler';

import '@docsearch/css';
import '../styles/algolia.css';
import '../styles/index.css';
import '../styles/sandpack.css';

import {Suspense} from 'react';
import {DevContentRefresher} from 'components/DevContentRefresher';
import {ThemeScript} from 'components/ThemeScript';
import {UwuScript} from 'components/UwuScript';
import {Metadata} from 'next';

export const viewport = {
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: '#23272f'},
    {media: '(prefers-color-scheme: dark)', color: '#23272f'},
  ],
};

export const metadata: Metadata = {
  description:
    'React is the library for web and native user interfaces. Build user interfaces out of individual pieces called components written in JavaScript.',
  openGraph: {
    siteName: 'React',
    type: 'website',
    images: [{url: '/images/og-default.png'}],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@reactjs',
    creator: '@reactjs',
    images: ['/images/og-default.png'],
  },
  verification: {
    google: 'sIlAGs48RulR4DdP95YSWNKZIEtCqQmRjzn-Zq-CcD0',
  },
  other: {
    'msapplication-TileColor': '#2b5797',
    'fb:app_id': '623268441017527',
  },
  icons: {
    icon: [
      {url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png'},
      {url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png'},
    ],
    apple: [
      {url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png'},
    ],
    other: [
      {rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#404756'},
    ],
  },
  manifest: '/site.webmanifest',
};

function FontPreload() {
  return (
    <>
      <link
        rel="preload"
        href="/fonts/Source-Code-Pro-Regular.woff2"
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
        href="/fonts/Optimistic_Display_W_MdIt.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Optimistic_Text_W_BdIt.woff2"
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
      </head>
      <body className="font-text font-medium antialiased text-lg bg-wash dark:bg-wash-dark text-secondary dark:text-secondary-dark leading-base">
        <ScrollHandler />
        <ThemeScript />
        <UwuScript />
        {process.env.NODE_ENV !== 'production' && <DevContentRefresher />}
        {children}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
