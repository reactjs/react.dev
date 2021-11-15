/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {MDXProvider} from '@mdx-js/react';
import recentPostsRouteTree from 'blogIndexRecent.json';
import {DocsPageFooter} from 'components/DocsFooter';
import {ExternalLink} from 'components/ExternalLink';
import {MDXComponents} from 'components/MDX/MDXComponents';
import {Seo} from 'components/Seo';
import {Toc} from 'components/Layout/Toc';
import format from 'date-fns/format';
import {useRouter} from 'next/router';
import * as React from 'react';
import {getAuthor} from 'utils/getAuthor';
import toCommaSeparatedList from 'utils/toCommaSeparatedList';
import {Page} from './Page';
import {RouteItem, useRouteMeta} from './useRouteMeta';
import {useTwitter} from './useTwitter';

interface PageFrontmatter {
  id?: string;
  title: string;
  author: string[];
  date?: string;
}

interface LayoutPostProps {
  /** Sidebar/Nav */
  routes: RouteItem[];
  /** Markdown frontmatter */
  meta: PageFrontmatter;
  /** The mdx */
  children: React.ReactNode;
}

/** Return the date of the current post given the path */
function getDateFromPath(path: string) {
  // All paths are /blog/year/month/day/title
  const [year, month, day] = path
    .substr(1) // first `/`
    .split('/') // make an array
    .slice(1) // ignore blog
    .map((i) => parseInt(i, 10)); // convert to numbers

  return {
    date: format(new Date(year, month, day), 'MMMM dd, yyyy'),
    dateTime: [year, month, day].join('-'),
  };
}

function LayoutPost({meta, children}: LayoutPostProps) {
  const {pathname} = useRouter();
  const {date, dateTime} = getDateFromPath(pathname);
  const {route, nextRoute, prevRoute} = useRouteMeta();
  const anchors = React.Children.toArray(children)
    .filter(
      (child: any) =>
        child.props?.mdxType && ['h2', 'h3'].includes(child.props.mdxType)
    )
    .map((child: any) => ({
      url: '#' + child.props.id,
      depth: parseInt(child.props.mdxType.replace('h', ''), 0),
      text: child.props.children,
    }));
  useTwitter();
  return (
    <>
      <div className="w-full px-12">
        <div className="h-full mx-auto max-w-4xl relative pt-16 w-full overflow-x-hidden">
          <Seo title={meta.title} />
          <h1 className="mb-6 pt-8 text-4xl md:text-5xl font-bold leading-snug tracking-tight text-primary dark:text-primary-dark">
            {meta.title}
          </h1>
          <p className="mb-6 text-lgtext-secondary dark:text-secondary-dark">
            By{' '}
            {toCommaSeparatedList(meta.author, (author) => (
              <ExternalLink
                href={getAuthor(author).url}
                className="text-link dark:text-link-dark underline font-bold">
                {getAuthor(author).name}
              </ExternalLink>
            ))}
            <span className="mx-2">·</span>
            <span className="lead inline-flex text-gray-50">
              <time dateTime={dateTime}>{date}</time>
            </span>
          </p>

          <MDXProvider components={MDXComponents}>{children}</MDXProvider>
          <DocsPageFooter
            route={route}
            nextRoute={nextRoute}
            prevRoute={prevRoute}
          />
        </div>
      </div>
      <div className="w-full lg:max-w-xs h-full hidden 2xl:block">
        <Toc headings={anchors} />
      </div>
    </>
  );
}

function AppShell(props: {children: React.ReactNode}) {
  return <Page routeTree={recentPostsRouteTree as RouteItem} {...props} />;
}

export default function withLayoutPost(meta: any) {
  function LayoutPostWrapper(props: LayoutPostProps) {
    return <LayoutPost {...props} meta={meta} />;
  }

  LayoutPostWrapper.appShell = AppShell;

  return LayoutPostWrapper;
}
