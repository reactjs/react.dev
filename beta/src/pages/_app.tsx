/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {AppProps} from 'next/app';
import {useRouter} from 'next/router';
import {MarkdownPage} from 'components/Layout/MarkdownPage';
import {Page} from 'components/Layout/Page';
import {ga} from '../utils/analytics';
import type {RouteItem} from 'components/Layout/useRouteMeta';
import sidebarHome from '../sidebarHome.json';
import sidebarLearn from '../sidebarLearn.json';
import sidebarReference from '../sidebarReference.json';

import '@docsearch/css';
import '../styles/algolia.css';
import '../styles/index.css';
import '../styles/sandpack.css';
import '@codesandbox/sandpack-react/dist/index.css';

if (typeof window !== 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    ga('create', process.env.NEXT_PUBLIC_GA_TRACKING_ID, 'auto');
  }
  const terminationEvent = 'onpagehide' in window ? 'pagehide' : 'unload';
  window.addEventListener(terminationEvent, function () {
    ga('send', 'timing', 'JS Dependencies', 'unload');
  });
}

export default function MyApp({Component, pageProps}: AppProps) {
  const router = useRouter();
  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      ga('set', 'page', url);
      ga('send', 'pageview');
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  let routeTree = sidebarHome as RouteItem;
  let content = <Component {...pageProps} />;
  if ((Component as any).isMDXComponent) {
    const mdxContent = (Component as any)({}); // HACK: Extract MDX out of the generated wrapper
    const {section, meta} = mdxContent.props.layout; // Injected by md-layout-loader.js
    switch (section) {
      case 'apis':
        routeTree = sidebarReference as RouteItem;
        break;
      case 'learn':
        routeTree = sidebarLearn as RouteItem;
        break;
    }
    content = (
      <MarkdownPage meta={meta}>{mdxContent.props.children}</MarkdownPage>
    );
  }

  return <Page routeTree={routeTree}>{content}</Page>;
}
