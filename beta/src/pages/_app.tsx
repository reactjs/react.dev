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
    const {layout, toc, children} = mdxContent.props;
    switch (layout.section) {
      case 'apis':
        routeTree = sidebarReference as RouteItem;
        break;
      case 'learn':
        routeTree = sidebarLearn as RouteItem;
        break;
    }

    const wrappedChildren = wrapChildrenInMaxWidthContainers(children);
    content = (
      <MarkdownPage toc={toc} meta={layout.meta}>
        {wrappedChildren}
      </MarkdownPage>
    );
  }

  return (
    <Page routeTree={routeTree}>
      <React.Fragment key={router.pathname}>{content}</React.Fragment>
    </Page>
  );
}

function MaxWidth({children}: {children: any}) {
  return <div className="max-w-4xl ml-0 2xl:mx-auto">{children}</div>;
}

function wrapChildrenInMaxWidthContainers(
  children: React.ReactNode
): React.ReactNode {
  // Auto-wrap everything except a few types into
  // <MaxWidth> wrappers. Keep reusing the same
  // wrapper as long as we can until we meet
  // a full-width section which interrupts it.
  let fullWidthTypes = [
    'Sandpack',
    'FullWidth',
    'Illustration',
    'IllustrationBlock',
    'Challenges',
    'Recipes',
  ];
  let wrapQueue: React.ReactNode[] = [];
  let finalChildren: React.ReactNode[] = [];
  function flushWrapper(key: string | number) {
    if (wrapQueue.length > 0) {
      finalChildren.push(<MaxWidth key={key}>{wrapQueue}</MaxWidth>);
      wrapQueue = [];
    }
  }
  function handleChild(child: any, key: string | number) {
    if (child == null) {
      return;
    }
    if (typeof child !== 'object') {
      wrapQueue.push(child);
      return;
    }
    if (fullWidthTypes.includes(child.props.mdxType)) {
      flushWrapper(key);
      finalChildren.push(child);
    } else {
      wrapQueue.push(child);
    }
  }
  React.Children.forEach(children, handleChild);
  flushWrapper('last');
  return finalChildren;
}
