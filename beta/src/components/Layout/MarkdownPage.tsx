/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
// @ts-ignore
import {MDXContext} from '@mdx-js/react';
import {DocsPageFooter} from 'components/DocsFooter';
import {MDXComponents} from 'components/MDX/MDXComponents';
import {Seo} from 'components/Seo';
import PageHeading from 'components/PageHeading';
import {useRouteMeta} from './useRouteMeta';
import {Toc} from './Toc';

export interface MarkdownProps<Frontmatter> {
  meta: Frontmatter & {description?: string};
  children?: React.ReactNode;
  toc: Array<{
    url: string;
    text: React.ReactNode;
    depth: number;
  }>;
}

export function MarkdownPage<
  T extends {title: string; status?: string} = {title: string; status?: string}
>({children, meta, toc}: MarkdownProps<T>) {
  const {route, nextRoute, prevRoute} = useRouteMeta();
  const title = meta.title || route?.title || '';
  const description = meta.description || route?.description || '';

  if (!route) {
    console.error('This page was not added to one of the sidebar JSON files.');
  }
  const isHomePage = route?.path === '/';
  return (
    <>
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
            <MDXContext.Provider value={MDXComponents}>
              {children}
            </MDXContext.Provider>
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
    </>
  );
}
