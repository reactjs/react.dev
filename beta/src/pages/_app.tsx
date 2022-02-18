/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {AppProps} from 'next/app';
import {useRouter} from 'next/router';
import '@docsearch/css';
import '../styles/fonts.css';
import '../styles/algolia.css';
import '../styles/index.css';
import '../styles/sandpack.css';
import '@codesandbox/sandpack-react/dist/index.css';
import Script from 'next/script';

const EmptyAppShell: React.FC = ({children}) => <>{children}</>;

if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    dataLayer.push(arguments);
  };
  gtag('js', new Date());
}

export default function MyApp({Component, pageProps}: AppProps) {
  const router = useRouter();
  React.useEffect(() => {
    const handleRouteChange = (url) => {
      // @ts-ignore
      gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
        page_path: url,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  let AppShell = (Component as any).appShell || EmptyAppShell;
  // In order to make sidebar scrolling between pages work as expected
  // we need to access the underlying MDX component.
  if ((Component as any).isMDXComponent) {
    AppShell = (Component as any)({}).props.originalType.appShell;
  }

  return (
    <AppShell>
      <Component {...pageProps} />
      {process.env.NODE_ENV === 'production' && (
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
        />
      )}
    </AppShell>
  );
}
