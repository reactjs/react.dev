import type {Metadata, Viewport} from 'next';
import {SharedRootBody, SharedRootHead} from '../components/_/root-layout';
import {siteConfig} from '../siteConfig';
import {preload} from 'react-dom';

import '@docsearch/css';
import '../styles/algolia.css';
import '../styles/index.css';
import '../styles/sandpack.css';

export default function RootLayout({children}: React.PropsWithChildren) {
  [
    'https://react.dev/fonts/Source-Code-Pro-Regular.woff2',
    'https://react.dev/fonts/Source-Code-Pro-Bold.woff2',
    'https://react.dev/fonts/Optimistic_Display_W_Md.woff2',
    'https://react.dev/fonts/Optimistic_Display_W_SBd.woff2',
    'https://react.dev/fonts/Optimistic_Display_W_Bd.woff2',
    'https://react.dev/fonts/Optimistic_Text_W_Md.woff2',
    'https://react.dev/fonts/Optimistic_Text_W_Bd.woff2',
    'https://react.dev/fonts/Optimistic_Text_W_Rg.woff2',
    'https://react.dev/fonts/Optimistic_Text_W_It.woff2',
  ].forEach((href) => {
    preload(href, {as: 'font', type: 'font/woff2', crossOrigin: 'anonymous'});
  });

  return (
    <html
      lang={siteConfig.languageCode}
      dir={siteConfig.isRTL ? 'rtl' : 'ltr'}
      suppressHydrationWarning>
      <head>
        <SharedRootHead />
      </head>
      <SharedRootBody>{children}</SharedRootBody>
    </html>
  );
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://' + getDomain(siteConfig.languageCode)),
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    url: './',
    images: ['/images/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@reactjs',
    creator: '@reactjs',
    images: ['/images/og-default.png'],
  },
  facebook: {
    appId: '623268441017527',
  },
};

function getDomain(languageCode: string): string {
  const subdomain = languageCode === 'en' ? '' : languageCode + '.';
  return subdomain + 'react.dev';
}
