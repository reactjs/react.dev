/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {MDXProvider} from '@mdx-js/react';
import {DocsPageFooter} from 'components/DocsFooter';
import {MDXComponents} from 'components/MDX/MDXComponents';
import {Seo} from 'components/Seo';
import PageHeading from 'components/PageHeading';
import {useRouteMeta} from './useRouteMeta';
import {Toc} from './Toc';
export interface MarkdownProps<Frontmatter> {
  meta: Frontmatter & {description?: string};
  children?: React.ReactNode;
}

function MaxWidth({children}: {children: any}) {
  return <div className="max-w-4xl ml-0 2xl:mx-auto">{children}</div>;
}

export function MarkdownPage<
  T extends {title: string; status?: string} = {title: string; status?: string}
>({children, meta}: MarkdownProps<T>) {
  const {route, nextRoute, prevRoute} = useRouteMeta();
  const title = meta.title || route?.title || '';
  const description = meta.description || route?.description || '';
  const toc = meta.toc.length > 0 ? [{depth: 1, text: 'Overview', url: '#'}, ...meta.toc] : meta.toc

  if (!route) {
    console.error('This page was not added to one of the sidebar JSON files.');
  }
  const isHomePage = route?.path === '/';

  // Auto-wrap everything except a few types into
  // <MaxWidth> wrappers. Keep reusing the same
  // wrapper as long as we can until we meet
  // a full-width section which interrupts it.
  let fullWidthTypes = [
    'Sandpack',
    'APIAnatomy',
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

  return (
    <article className="h-full mx-auto relative w-full min-w-0">
      <div className="lg:pt-0 pt-20 pl-0 lg:pl-80 2xl:px-80 ">
        <Seo title={title} />
        {!isHomePage && (
          <PageHeading
            title={title}
            description={description}
            tags={route?.tags}
          />
        )}
        <div className="px-5 sm:px-12">
          <div className="max-w-7xl mx-auto">
            <MDXProvider components={MDXComponents}>
              {finalChildren}
            </MDXProvider>
          </div>
          <DocsPageFooter
            route={route}
            nextRoute={nextRoute}
            prevRoute={prevRoute}
          />
        </div>
      </div>
      <div className="w-full lg:max-w-xs hidden 2xl:block">
        {!isHomePage && toc.length > 0 && <Toc headings={toc} />}
      </div>
    </article>
  );
}
