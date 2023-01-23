/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {useRouter} from 'next/router';
import {DocsPageFooter} from 'components/DocsFooter';
import {Seo} from 'components/Seo';
import PageHeading from 'components/PageHeading';
import {useRouteMeta, RouteItem} from './useRouteMeta';
import {useActiveSection} from '../../hooks/useActiveSection';
import {TocContext} from '../MDX/TocContext';

import(/* webpackPrefetch: true */ '../MDX/CodeBlock/CodeBlock');

interface Props {
  meta: {title?: string; description?: string};
  children?: React.ReactNode;
  routeTree: RouteItem;
  toc: Array<{
    url: string;
    text: React.ReactNode;
    depth: number;
  }>;
}

export function MarkdownPage({children, meta, toc, routeTree}: Props) {
  const {route, nextRoute, prevRoute} = useRouteMeta(routeTree);
  const section = useActiveSection();
  const title = meta.title || route?.title || '';
  const description = meta.description || route?.description || '';
  const isHomePage = section === 'home';
  return (
    <>
      <div className="pl-0">
        <Seo title={title} />
        {!isHomePage && (
          <PageHeading
            title={title}
            description={description}
            tags={route?.tags}
            routeTree={routeTree}
          />
        )}
        <div className="px-5 sm:px-12">
          <div className="max-w-7xl mx-auto">
            <TocContext.Provider value={toc}>{children}</TocContext.Provider>
          </div>
          <DocsPageFooter
            route={route}
            nextRoute={nextRoute}
            prevRoute={prevRoute}
          />
        </div>
      </div>
    </>
  );
}
