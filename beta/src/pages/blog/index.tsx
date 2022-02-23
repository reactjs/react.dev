import blogIndexRecentRouteTree from 'blogIndexRecent.json';
import {ExternalLink} from 'components/ExternalLink';
import {IconRss} from 'components/Icon/IconRss';
import {LayoutBlog} from 'components/Layout/LayoutBlog';
import styles from 'components/MDX/MDXComponents.module.css';
import {Seo} from 'components/Seo';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import Link from 'next/link';
import * as React from 'react';
import {getAuthor} from 'utils/getAuthor';
import {removeFromLast} from 'utils/removeFromLast';
import toCommaSeparatedList from 'utils/toCommaSeparatedList';

export default function RecentPosts() {
  return (
    <>
      <div className="w-full lg:pt-8 px-5 sm:px-12">
        <div className="max-w-4xl mx-auto w-full container pt-10">
          <header className="pt-14 pb-8">
            <div className="flex items-center justify-between">
              <Seo
                title="Blog"
                description="Offical React.js news, announcements, and release notes."
              />
              <h1 className="text-5xl font-bold  dark:text-primary-dark mb-8">
                Blog
              </h1>
              <a
                href="/feed.xml"
                className="p-2 bg-card betterhover:hover:bg-secondary-button dark:bg-secondary-button-dark betterhover:hover:dark:bg-card-dark transition duration-150 ease-in-out rounded-lg inline-flex items-center">
                <IconRss className="w-5 h-5 mr-2" />
                RSS
              </a>
            </div>
            <p className=" dark:text-primary-dark text-xl leading-large">
              Offical React.js news, announcements, and release notes.
            </p>
          </header>
          <div className="space-y-12 pb-40">
            {blogIndexRecentRouteTree.routes.map((post) => (
              <div key={post.path}>
                <h3 className="font-bold leading-8 dark:text-primary-dark text-2xl mb-2 hover:underline">
                  <Link href={removeFromLast(post.path, '.')}>
                    <a>{post.title}</a>
                  </Link>
                </h3>
                <div
                  className={
                    styles.markdown +
                    ' text-gray-70 dark:text-primary-dark mb-0'
                  }
                  dangerouslySetInnerHTML={{__html: post.excerpt.trim()}}
                />
                <div className="flex items-center">
                  <div>
                    <p className="text-sm leading-5 text-gray-80 dark:text-gray-10">
                      By{' '}
                      {toCommaSeparatedList(post.author, (author) => (
                        <ExternalLink
                          key={author}
                          href={getAuthor(author).url}
                          className="font-bold betterhover:hover:underline">
                          <span>{getAuthor(author).name}</span>
                        </ExternalLink>
                      ))}
                    </p>
                    <div className="flex text-sm leading-5 text-gray-50 dark:text-gray-20">
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
            <div className="text-center">
              <Link href="/blog/all">
                <a className="p-2 text-center bg-card font-bold betterhover:hover:bg-secondary-button dark:bg-secondary-button-dark betterhover:hover:dark:bg-card-dark transition duration-150 ease-in-out rounded-lg inline-flex items-center">
                  View all articles
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-20 w-full lg:max-w-xs lg:sticky top-0 h-full hidden xl:block"></div>
    </>
  );
}

RecentPosts.displayName = 'Index';

RecentPosts.appShell = function AppShell(props: {children: React.ReactNode}) {
  return <LayoutBlog {...props} />;
};
