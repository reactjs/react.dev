import blogIndex from 'blogIndex.json';
import blogIndexRecentRouteTree from 'blogIndexRecent.json';
import {ExternalLink} from 'components/ExternalLink';
import {IconRss} from 'components/Icon/IconRss';
import {Page} from 'components/Layout/Page';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import Link from 'next/link';
import * as React from 'react';
import {getAuthor} from 'utils/getAuthor';
import {removeFromLast} from 'utils/removeFromLast';
import toCommaSeparatedList from 'utils/toCommaSeparatedList';

export default function Archive() {
  return (
    <div className="mx-auto max-w-5xl container px-4 sm:px-6 lg:px-8 pt-16">
      <header className="py-16 ">
        <div className="flex items-center justify-between">
          <h1 className="text-5xl font-bold">Blog Archive</h1>
          <a
            href="/feed.xml"
            className="p-2 betterhover:hover:bg-gray-20 transition duration-150 ease-in-out rounded-lg inline-flex items-center">
            <IconRss className="w-5 h-5 mr-2" />
            RSS
          </a>
        </div>
        <p className="text-gray-70 text-2xl">
          Historical archive of React news, announcements, and release notes.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-40">
        {blogIndex.routes.map((post) => (
          <div key={post.path}>
            <h3 className="font-bold text-xl ">
              <Link href={removeFromLast(post.path, '.')}>
                <a>{post.title}</a>
              </Link>
            </h3>
            <div className="flex items-center">
              <div>
                <p className="text-sm leading-5 text-gray-80">
                  By{' '}
                  {toCommaSeparatedList(post.author, (author) => (
                    <ExternalLink
                      href={getAuthor(author).url}
                      className="font-bold betterhover:hover:underline">
                      <span>{getAuthor(author).name}</span>
                    </ExternalLink>
                  ))}
                </p>
                <div className="flex text-sm leading-5 text-gray-50">
                  <time dateTime={post.date}>
                    {format(parseISO(post.date), 'MMMM dd, yyyy')}
                  </time>
                  <span className="mx-1">·</span>
                  <span>{post.readingTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Archive.displayName = 'Index';

Archive.appShell = function AppShell(props: {children: React.ReactNode}) {
  return <Page routeTree={blogIndexRecentRouteTree} {...props} />;
};
