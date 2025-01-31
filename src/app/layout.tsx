import {siteConfig} from '../siteConfig';
import {Analytics} from 'components/Analytics';
import {ScrollHandler} from 'components/SafariScrollHandler';

import '@docsearch/css';
import '../styles/algolia.css';
import '../styles/index.css';
import '../styles/sandpack.css';

import {generateMetadata as generateSeoMetadata} from '../utils/generateMetadata';
import {Suspense} from 'react';
import {DevContentRefresher} from 'components/DevContentRefresher';
import {ThemeScript} from 'components/ThemeScript';
import {UwuScript} from 'components/UwuScript';

export async function generateMetadata() {
  const metadata = generateSeoMetadata({
    title: 'React',
    isHomePage: true,
    path: '/',
  });

  return {
    metadata,
  };
}

export const viewport = {
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: '#23272f'},
    {media: '(prefers-color-scheme: dark)', color: '#23272f'},
  ],
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
