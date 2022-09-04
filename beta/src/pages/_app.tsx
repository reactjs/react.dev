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

    const rawChildren = mdxContent.props.children;
    const toc = getTableOfContents(rawChildren);
    const children = wrapChildrenInMaxWidthContainers(rawChildren);
    content = (
      <MarkdownPage toc={toc} meta={meta}>
        {children}
      </MarkdownPage>
    );
  }

  return <Page routeTree={routeTree}>{content}</Page>;
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

function getTableOfContents(children: React.ReactNode): Array<{
  url: string;
  text: React.ReactNode;
  depth: number;
}> {
  const anchors = React.Children.toArray(children)
    .filter((child: any) => {
      if (child.props?.mdxType) {
        return ['h1', 'h2', 'h3', 'Challenges', 'Recap'].includes(
          child.props.mdxType
        );
      }
      return false;
    })
    .map((child: any) => {
      if (child.props.mdxType === 'Challenges') {
        return {
          url: '#challenges',
          depth: 0,
          text: 'Challenges',
        };
      }
      if (child.props.mdxType === 'Recap') {
        return {
          url: '#recap',
          depth: 0,
          text: 'Recap',
        };
      }
      return {
        url: '#' + child.props.id,
        depth:
          (child.props?.mdxType &&
            parseInt(child.props.mdxType.replace('h', ''), 0)) ??
          0,
        text: child.props.children,
      };
    });
  if (anchors.length > 0) {
    anchors.unshift({
      depth: 1,
      text: 'Overview',
      url: '#',
    });
  }
  return anchors;
}
