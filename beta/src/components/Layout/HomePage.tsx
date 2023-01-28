/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Suspense} from 'react';
import * as React from 'react';
import {useRouter} from 'next/router';
import {Footer} from './Footer';
import SocialBanner from '../SocialBanner';
import {Seo} from 'components/Seo';
import {getRouteMeta} from './getRouteMeta';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import ButtonLink from '../ButtonLink';
import {TopNav} from './TopNav';
import {Logo} from 'components/Logo';
import Link from 'next/link';
import CodeBlock from 'components/MDX/CodeBlock';
import(/* webpackPrefetch: true */ '../MDX/CodeBlock/CodeBlock');

interface PageProps {
  routeTree: RouteItem;
  meta: {title?: string; description?: string};
}

export function HomePage({routeTree, meta}: PageProps) {
  const {asPath} = useRouter();
  const cleanedPath = asPath.split(/[\?\#]/)[0];
  const {route, nextRoute, prevRoute, breadcrumbs} = getRouteMeta(
    cleanedPath,
    routeTree
  );
  const title = meta.title || route?.title || '';
  return (
    <>
      <SocialBanner />
      <TopNav routeTree={routeTree} breadcrumbs={breadcrumbs} />
      {/* No fallback UI so need to be careful not to suspend directly inside. */}
      <Suspense fallback={null}>
        <main className="min-w-0">
          <div className="lg:hidden h-16 mb-2" />
          <article className="break-words" key={asPath}>
            <div className="pl-0">
              <Seo title={title} isHomePage={true} />
              <div className="mt-12 mb-20 flex flex-col justify-center">
                <Logo className="my-4 text-link dark:text-link-dark w-20 sm:w-28 self-center" />
                <h1 className="text-6xl self-center flex font-bold leading-snug text-primary dark:text-primary-dark">
                  React
                </h1>
                <p className="text-4xl py-1 text-center text-secondary dark:text-primary-dark leading-snug self-center">
                  The library for web and native user interfaces
                </p>
                <div className="my-5 self-center flex gap-2">
                  <ButtonLink
                    href={'/learn'}
                    type="primary"
                    size="lg"
                    label="Take the Tutorial">
                    Learn React
                  </ButtonLink>
                  <ButtonLink
                    href={'/apis/react'}
                    type="secondary"
                    size="lg"
                    label="Take the Tutorial">
                    API Reference
                  </ButtonLink>
                </div>
              </div>
              <div className="">
                <div className="mx-auto bg-blue-60 dark:bg-blue-60 dark:bg-opacity-20 shadow-inner px-12 mt-8 flex flex-col w-full">
                  <div className="flex-col gap-8 flex grow w-full my-12 mx-auto items-center">
                    <div className="max-w-2xl text-center text-white text-opacity-80">
                      <h3 className="leading-tight text-white font-bold text-5xl mb-6">
                        Create user interfaces
                        <br /> from components
                      </h3>
                      <p className="text-xl leading-normal">
                        React lets you build user interfaces out of individual
                        pieces called components. Create your own React
                        components like a button, a panel, or an avatar. Then
                        combine them into entire screens, pages, and apps.
                      </p>
                    </div>
                    <div className="flex grow w-full max-w-2xl">
                      <CodeBlock
                        children={undefined}
                        isFromPackageImport={false}>
                        <div className="w-full">
                          {`function UserPanel({ user }) {
  return (
    <Panel color="grey">
      <Avatar image={user.image} />
      <Label size="xl">{user.name}</Label>
      <FollowButton user={user} />
    </Panel>
  );
}`}
                        </div>
                      </CodeBlock>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-card dark:bg-card-dark p-20">
                <div className="max-w-5xl mx-auto flex flex-col w-full">
                  <div className="flex-row gap-8 flex grow w-full mx-auto items-center">
                    <div className="max-w-xl">
                      <h3 className="leading-tight text-primary font-bold text-5xl mb-6 text-left">
                        Write components with code and markup
                      </h3>
                      <p className="text-xl leading-normal text-left">
                        React components are JavaScript functions. Want to show
                        something conditionally? Use an `if` statement. Need to
                        display a list? Use a `for` loop or array `map`.
                        Learning React is learning programming.
                      </p>
                    </div>
                    <div className="flex grow">
                      <CodeBlock
                        children={undefined}
                        isFromPackageImport={false}>
                        <div>{`function SearchResults({ users, query }) {
  if (users.length === 0) {
    return <EmptyMessage text="No matches" />;
  }
  return (
    <Grid cols={3} rows={10} title="Search results">
      {users.map(user =>
        <UserPanel user={user} key={user.id} />
      )}
    </Grid>
  );
}`}</div>
                      </CodeBlock>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-20 mx-auto flex gap-8 flex-row max-w-6xl">
                <div className="w-5/12 bg-red-60 p-16 rounded-3xl flex-col flex items-center">
                  <div className="flex-col text-white flex grow items-end justify-start my-0 mx-auto">
                    <h3 className="w-full leading-tight font-bold text-5xl mb-6 text-left">
                      Use as little or as much React as you need
                    </h3>
                    <p className="text-xl leading-normal text-left">
                      Many teams build their entire user interface with React.
                      For example, the web experiences of
                      <Link href="https://facebook.com"> Facebook</Link>,
                      <Link href="https://instagram.com"> Instagram</Link>,
                      <Link href="https://www.tiktok.com/en/"> TikTok</Link>,
                      <Link href="https://twitter.com/"> Twitter</Link>,
                      <Link href="https://airbnb.com/"> Airbnb</Link>,
                      <Link href="https://spotify.com/"> Spotify</Link>,
                      <Link href="https://trello.com/"> Trello</Link>, and
                      <Link href="https://www.nytimes.com/">
                        {' '}
                        The New York Times
                      </Link>{' '}
                      are fully powered by React.{' '}
                    </p>
                  </div>
                  <div className="rounded-lg w-full p-8 mt-8 flex justify-center leading-6 h-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg text-[13.6px] overflow-hidden">
                    Illustration goes here
                  </div>
                </div>

                <div className="w-7/12 bg-green-60 p-16 rounded-3xl flex-col flex items-center">
                  <div className="flex-col text-white flex grow items-end justify-start my-0 mx-auto">
                    <h3 className="w-full leading-tight font-bold text-5xl mb-6 text-left">
                      Stability without stagnation
                    </h3>
                    <p className="text-xl leading-normal text-left">
                      React approaches changes with care. Every React commit is
                      tested on business-critical surfaces with hundreds of
                      millions of users. When an API is deprecated, we add
                      warnings and publish automatic scripts to assist with the
                      migration. The 100,000 React components in the Meta
                      codebase help validate every migration strategy. The React
                      team is also always researching how to improve React.
                      React has a high bar for taking an idea from research to
                      production. Only proven approaches become part of React.
                      Learn about our latest research
                    </p>
                  </div>
                  <div className="rounded-lg w-full p-8 mt-8 flex justify-center leading-6 h-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg text-[13.6px] overflow-hidden">
                    Illustration goes here
                  </div>
                </div>
              </div>

              <div className="mx-auto flex mt-8 mb-20 gap-8 flex-row max-w-6xl">
                <div className="w-7/12 bg-blue-60 p-16 rounded-3xl flex-col flex items-center">
                  <div className="rounded-lg w-full p-8 flex justify-center leading-6 h-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg text-[13.6px] overflow-hidden">
                    Illustration goes here
                  </div>

                  <div className="flex-col text-white flex grow items-end justify-start mt-12 mx-auto">
                    <h3 className="w-full leading-tight font-bold text-5xl mb-6 text-left">
                      Let a framework take care of the rest
                    </h3>
                    <p className="text-xl text-white text-opacity-80 leading-normal text-left">
                      React is a library. It lets you create components and put
                      them together, but it doesn't prescribe solutions for
                      routing and data fetching. To take full advantage of
                      React, we recommend using a mature React framework. React
                      frameworks like{' '}
                      <Link href="https://github.com/vercel/next.js">
                        Next.js
                      </Link>
                      , <Link href="https://remix.run">Remix</Link>, and{' '}
                      <Link href="https://expo.dev">Expo</Link> let you create
                      full-stack React apps with little configuration.
                    </p>
                  </div>
                </div>

                <div className="w-5/12 bg-purple-60 p-16 rounded-3xl flex-col flex items-center">
                  <div className="flex-col text-white flex grow items-end justify-start my-0 mx-auto">
                    <h3 className="w-full leading-tight font-bold text-5xl mb-6 text-left">
                      Match underlying platform expectations
                    </h3>
                    <p className="text-xl text-white text-opacity-80 leading-normal text-left">
                      Users expect pages to load fast. On the web, React can
                      progressively render to a stream of HTML, enabling content
                      to be revealed gradually while the rest of the app's code
                      and React itself are still loading. React takes advantage
                      of modern web standards to keep the page responsive even
                      during rendering.
                    </p>
                  </div>
                  <div className="rounded-lg w-full p-8 mt-8 flex justify-center leading-6 h-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg text-[13.6px] overflow-hidden">
                    Illustration goes here
                  </div>
                </div>
              </div>

              <div className="max-w-6xl mx-auto bg-red-60 p-16 mb-8 rounded-3xl flex-col flex items-center">
                <div className="flex-col text-white flex grow items-end justify-start my-0 mx-auto">
                  <h3 className="w-full leading-tight font-bold text-5xl mb-6 text-left">
                    Use as little or as much React as you need
                  </h3>
                  <p className="text-xl leading-normal text-left">
                    Many teams build their entire user interface with React. For
                    example, the web experiences of
                    <Link href="https://facebook.com"> Facebook</Link>,
                    <Link href="https://instagram.com"> Instagram</Link>,
                    <Link href="https://www.tiktok.com/en/"> TikTok</Link>,
                    <Link href="https://twitter.com/"> Twitter</Link>,
                    <Link href="https://airbnb.com/"> Airbnb</Link>,
                    <Link href="https://spotify.com/"> Spotify</Link>,
                    <Link href="https://trello.com/"> Trello</Link>, and
                    <Link href="https://www.nytimes.com/">
                      {' '}
                      The New York Times
                    </Link>{' '}
                    are fully powered by React.{' '}
                  </p>
                </div>
                <div className="rounded-lg w-full p-8 mt-8 flex justify-center leading-6 h-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg text-[13.6px] overflow-hidden">
                  Illustration goes here
                </div>
              </div>

              <div className="mx-auto flex gap-8 flex-row max-w-6xl">
                <div className="w-6/12 bg-blue-60 p-16 rounded-3xl flex-col flex items-center">
                  <div className="rounded-lg w-full p-8 flex justify-center leading-6 h-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg text-[13.6px] overflow-hidden">
                    Illustration goes here
                  </div>

                  <div className="flex-col text-white flex grow items-end justify-start mt-12 mx-auto">
                    <h3 className="w-full leading-tight font-bold text-5xl mb-6 text-left">
                      Let a framework take care of the rest
                    </h3>
                    <p className="text-xl text-white text-opacity-80 leading-normal text-left">
                      React is a library. It lets you create components and put
                      them together, but it doesn't prescribe solutions for
                      routing and data fetching. To take full advantage of
                      React, we recommend using a mature React framework. React
                      frameworks like{' '}
                      <Link href="https://github.com/vercel/next.js">
                        Next.js
                      </Link>
                      , <Link href="https://remix.run">Remix</Link>, and{' '}
                      <Link href="https://expo.dev">Expo</Link> let you create
                      full-stack React apps with little configuration.
                    </p>
                  </div>
                </div>

                <div className="w-6/12 bg-purple-60 p-16 rounded-3xl flex-col flex items-center">
                  <div className="flex-col text-white flex grow items-end justify-start my-0 mx-auto">
                    <h3 className="w-full leading-tight font-bold text-5xl mb-6 text-left">
                      Match underlying platform expectations
                    </h3>
                    <p className="text-xl text-white text-opacity-80 leading-normal text-left">
                      Users expect pages to load fast. On the web, React can
                      progressively render to a stream of HTML, enabling content
                      to be revealed gradually while the rest of the app's code
                      and React itself are still loading. React takes advantage
                      of modern web standards to keep the page responsive even
                      during rendering.
                    </p>
                  </div>
                  <div className="rounded-lg w-full p-8 mt-8 flex justify-center leading-6 h-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg text-[13.6px] overflow-hidden">
                    Illustration goes here
                  </div>
                </div>
              </div>

              <div className="max-w-6xl mx-auto bg-green-60 p-16 mt-8 rounded-3xl flex-col flex items-center">
                <div className="flex-col text-white flex grow items-end justify-start my-0 mx-auto">
                  <h3 className="w-full leading-tight font-bold text-5xl mb-6 text-left">
                    Stability without stagnation
                  </h3>
                  <p className="text-xl leading-normal text-left">
                    React approaches changes with care. Every React commit is
                    tested on business-critical surfaces with hundreds of
                    millions of users. When an API is deprecated, we add
                    warnings and publish automatic scripts to assist with the
                    migration. The 100,000 React components in the Meta codebase
                    help validate every migration strategy. The React team is
                    also always researching how to improve React. React has a
                    high bar for taking an idea from research to production.
                    Only proven approaches become part of React. Learn about our
                    latest research
                  </p>
                </div>
                <div className="rounded-lg w-full p-8 mt-8 flex justify-center leading-6 h-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg text-[13.6px] overflow-hidden">
                  Illustration goes here
                </div>
              </div>

              <div className="p-20 text-base text-secondary dark:text-secondary-dark flex flex-col w-full justify-center items-center">
                <Logo className="text-link dark:text-link-dark w-16 sm:w-36 mt-12 h-auto mx-auto self-start" />
                <div className="flex flex-wrap">
                  <div className="mb-8 mt-4">
                    <h1 className="text-6xl mr-4 flex wrap font-bold leading-tight text-primary dark:text-primary-dark">
                      Welcome to the React community
                    </h1>
                    <p className="text-4xl w-full text-center text-secondary dark:text-primary-dark leading-relaxed self-center my-2">
                      Get started today.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
          <Footer hideSurvey />
        </main>
      </Suspense>
    </>
  );
}
