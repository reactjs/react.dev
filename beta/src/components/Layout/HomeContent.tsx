/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useState} from 'react';
import ButtonLink from '../ButtonLink';
import {Logo} from 'components/Logo';
import Link from 'next/link';
import CodeBlock from 'components/MDX/CodeBlock';

export function HomeContent() {
  return (
    <>
      <div className="pl-0">
        <div className="mt-12 mb-20 flex flex-col justify-center">
          <Logo className="mt-4 mb-3 text-link dark:text-link-dark w-28 self-center" />
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
            <div className="flex-col gap-2 flex grow w-full my-20 mx-auto items-center">
              <div className="max-w-2xl text-center text-white text-opacity-80">
                <h3 className="leading-tight text-white font-bold text-5xl mb-6">
                  Create user interfaces
                  <br /> from components
                </h3>
                <p className="text-xl leading-normal">
                  React lets you build user interfaces out of individual pieces
                  called components. Create your own React components like a
                  button, a panel, or an avatar. Then combine them into entire
                  screens, pages, and apps.
                </p>
              </div>
              <div className="max-w-6xl mx-auto flex flex-col w-full">
                <CodeAnimation />
              </div>
              <div className="max-w-2xl text-center text-white text-opacity-80">
                <p className="text-xl leading-normal">
                  Whether you work on your own or with thousands of other
                  developers, using React feels the same. It is designed to let
                  you seamlessly combine components written by independent
                  people, teams, and organizations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-20">
          <div className="max-w-6xl mx-auto flex flex-col w-full">
            <div className="flex-col lg:flex-row gap-20 flex grow w-full mx-auto items-center">
              <div className="max-w-xl">
                <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-5xl mb-6 text-left">
                  Write components with code and markup
                </h3>
                <p className="text-xl leading-normal text-left">
                  React components are JavaScript functions. Want to show
                  something conditionally? Use an <code>if</code> statement.
                  Need to display a list? Use a <code>for</code> loop or array{' '}
                  <code>map()</code>.
                  <br />
                  <br />
                  Learning React is learning programming.
                </p>
              </div>
              <div className="flex grow">
                <CodeBlock isFromPackageImport={false}>
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

        <div className="mx-5 max-auto">
          <div className="bg-card dark:bg-card-dark shadow-inner rounded-3xl px-12 mt-8 flex flex-col w-full">
            <h3 className="w-full leading-tight font-bold text-5xl text-primary dark:text-primary-dark mt-20 text-center ">
              React homepage section header
            </h3>
            <div className="mt-20 mx-auto flex gap-8 flex-col lg:flex-row max-w-6xl">
              <div className="w-full lg:w-5/12 bg-red-60 p-16 rounded-3xl flex-col flex items-center">
                <div className="flex-col text-white flex grow items-end justify-start my-0 mx-auto">
                  <h3 className="w-full leading-tight font-bold text-5xl mb-6 text-left">
                    Use as little or as much React as you need
                  </h3>
                  <p className="text-xl text-white text-opacity-80 leading-normal text-left">
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
                      The New York Times
                    </Link>
                    are fully powered by React.
                  </p>
                </div>
                <div className="rounded-lg w-full p-8 mt-8 justify-center leading-6 h-full overflow-x-auto flex-1 flex items-center bg-wash dark:bg-gray-95 shadow-lg overflow-hidden">
                  Illustration goes here
                </div>
              </div>

              <div className="w-full lg:w-7/12 bg-green-60 p-16 rounded-3xl flex-col flex items-center">
                <div className="flex-col text-white flex grow items-end justify-start my-0 mx-auto">
                  <h3 className="w-full leading-tight font-bold text-5xl mb-6 text-left">
                    Stability without stagnation
                  </h3>
                  <p className="text-xl text-white text-opacity-80 leading-normal text-left">
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
                <div className="rounded-lg w-full p-8 mt-8 justify-center leading-6 h-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg overflow-hidden">
                  Illustration goes here
                </div>
              </div>
            </div>

            <div className="mx-auto flex mt-8 mb-20 gap-8 flex-col lg:flex-row max-w-6xl">
              <div className="w-full lg:w-7/12 bg-blue-60 p-16 rounded-3xl flex-col flex items-center">
                <div className="rounded-lg w-full p-8 justify-center leading-6 h-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg overflow-hidden">
                  Illustration goes here
                </div>

                <div className="flex-col text-white flex grow items-end justify-start mt-12 mx-auto">
                  <h3 className="w-full leading-tight font-bold text-5xl mb-6 text-left">
                    Let a framework take care of the rest
                  </h3>
                  <p className="text-xl text-white text-opacity-80 leading-normal text-left">
                    React is a library. It lets you create components and put
                    them together, but it doesn&apos;t prescribe solutions for
                    routing and data fetching. To take full advantage of React,
                    we recommend using a mature React framework. React
                    frameworks like
                    <Link href="https://github.com/vercel/next.js">
                      Next.js
                    </Link>
                    , <Link href="https://remix.run">Remix</Link>, and
                    <Link href="https://expo.dev">Expo</Link> let you create
                    full-stack React apps with little configuration.
                  </p>
                </div>
              </div>

              <div className="w-full lg:w-5/12 bg-purple-60 p-16 rounded-3xl flex-col flex items-center">
                <div className="flex-col text-white flex grow items-end justify-start my-0 mx-auto">
                  <h3 className="w-full leading-tight font-bold text-5xl mb-6 text-left">
                    Match underlying platform expectations
                  </h3>
                  <p className="text-xl text-white text-opacity-80 leading-normal text-left">
                    Users expect pages to load fast. On the web, React can
                    progressively render to a stream of HTML, enabling content
                    to be revealed gradually while the rest of the app&apos;s
                    code and React itself are still loading. React takes
                    advantage of modern web standards to keep the page
                    responsive even during rendering.
                  </p>
                </div>
                <div className="rounded-lg w-full p-8 mt-8 justify-center leading-6 h-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg overflow-hidden">
                  Illustration goes here
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="my-20 px-12 flex flex-col w-full">
          <h3 className="w-full leading-tight font-bold text-5xl text-primary dark:text-primary-dark mt-20 text-center ">
            React homepage section header
          </h3>
          <div className="mb-20 mt-20 gap-20 mx-auto flex flex-col lg:flex-row max-w-6xl">
            <div className="w-full lg:w-4/12 rounded-3xl flex-col flex items-center">
              <div className="rounded-lg w-full p-8 mb-8 justify-center leading-6 overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg overflow-hidden">
                Illustration goes here
              </div>
              <div className="flex-col text-primary dark:text-primary-dark flex grow items-end justify-start my-0 mx-auto">
                <h3 className="w-full leading-tight font-bold text-3xl mb-6 text-left">
                  Use as little or as much React as you need
                </h3>
                <p className="text-lg leading-normal text-secondary dark:text-secondary-dark text-left w-full">
                  Many teams build their entire user interface with React.
                </p>
              </div>
            </div>

            <div className="w-full lg:w-4/12 rounded-3xl flex-col flex items-center">
              <div className="rounded-lg w-full p-8 mb-8 justify-center leading-6 overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg overflow-hidden">
                Illustration goes here
              </div>
              <div className="flex-col text-primary dark:text-primary-dark flex grow items-end justify-start my-0 mx-auto">
                <h3 className="w-full leading-tight font-bold text-3xl mb-6 text-left">
                  Stability without stagnation
                </h3>
                <p className="text-lg leading-normal text-secondary dark:text-secondary-dark text-left w-full">
                  React approaches changes with care. Every React commit is
                  tested on business-critical surfaces with hundreds of millions
                  of users.
                </p>
              </div>
            </div>

            <div className="w-full lg:w-4/12 rounded-3xl flex-col flex items-center">
              <div className="rounded-lg w-full p-8 mb-8 justify-center leading-6 overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg overflow-hidden">
                Illustration goes here
              </div>

              <div className="flex-col text-primary dark:text-primary-dark flex grow items-end justify-start mx-auto">
                <h3 className="w-full leading-tight font-bold text-3xl mb-6 text-left">
                  Let a framework take care of the rest
                </h3>
                <p className="text-lg text-secondary dark:text-secondary-dark leading-normal text-left w-full">
                  React is a library. It lets you create components and put them
                  together, but it doesn&apos;t prescribe solutions for routing
                  and data fetching.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-12 flex flex-col w-full">
          <h3 className="w-full leading-tight font-bold text-5xl text-primary dark:text-primary-dark mt-20 text-center ">
            React homepage section header
          </h3>
          <div className="mt-20 mx-auto flex gap-8 flex-col lg:flex-row max-w-6xl">
            <div className="w-full lg:w-6/12 bg-card dark:bg-card-dark p-16 rounded-3xl flex-col flex items-center">
              <div className="flex-col text-primary dark:text-primary-dark flex grow items-end justify-start my-0 mx-auto">
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
                    The New York Times
                  </Link>
                  are fully powered by React.
                </p>
              </div>
              <div className="rounded-lg w-full p-8 mt-8 justify-center leading-6 h-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg overflow-hidden">
                Illustration goes here
              </div>
            </div>

            <div className="w-full lg:w-6/12 bg-card dark:bg-card-dark p-16 rounded-3xl flex-col flex items-center">
              <div className="flex-col text-primary dark:text-primary-dark flex grow items-end justify-start my-0 mx-auto">
                <h3 className="w-full leading-tight font-bold text-5xl mb-6 text-left">
                  Stability without stagnation
                </h3>
                <p className="text-xl leading-normal text-left">
                  React approaches changes with care. Every React commit is
                  tested on business-critical surfaces with hundreds of millions
                  of users. When an API is deprecated, we add warnings and
                  publish automatic scripts to assist with the migration.
                </p>
              </div>
              <div className="rounded-lg w-full p-8 mt-8 justify-center leading-6 h-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg overflow-hidden">
                Illustration goes here
              </div>
            </div>
          </div>
        </div>

        <div className="my-20 px-12 flex flex-col w-full">
          <h3 className="w-full leading-tight font-bold text-5xl text-primary dark:text-primary-dark mt-20 text-center">
            React homepage section header
          </h3>
          <div className="mb-20 mt-12 gap-8 mx-auto flex flex-col max-w-6xl">
            <div className="lg:gap-20 w-full rounded-3xl flex-col lg:flex-row flex items-center">
              <div className="w-full lg:w-6/12 px-20 py-40 rounded-lg my-8 justify-center leading-6 overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg overflow-hidden">
                Illustration goes here
              </div>
              <div className="w-full lg:w-6/12 p-8 flex-col text-primary dark:text-primary-dark flex grow items-end justify-start my-0 mx-auto">
                <h3 className="w-full leading-tight font-bold text-4xl mb-6 text-left">
                  Use as little or as much <br />
                  React as you need
                </h3>
                <p className="text-xl leading-normal text-secondary dark:text-secondary-dark w-full text-left">
                  Many teams build their entire user interface with React.
                </p>
              </div>
            </div>

            <div className="w-full lg:gap-20 rounded-3xl flex-col-reverse lg:flex-row flex items-center">
              <div className="w-full lg:w-6/12 p-8 flex-col text-primary dark:text-primary-dark flex grow items-end justify-start my-0 mx-auto">
                <h3 className="w-full leading-tight font-bold text-4xl mb-6 text-left">
                  Stability without stagnation
                </h3>
                <p className="text-xl leading-normal text-secondary dark:text-secondary-dark w-full text-left">
                  React approaches changes with care. Every React commit is
                  tested on business-critical surfaces with hundreds of millions
                  of users.
                </p>
              </div>

              <div className="w-full lg:w-6/12 px-20 py-40 rounded-lg my-8 justify-center leading-6 overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg overflow-hidden">
                Illustration goes here
              </div>
            </div>

            <div className="w-full rounded-3xl lg:gap-20 flex-col lg:flex-row flex items-center">
              <div className="w-full lg:w-6/12 rounded-lg px-20 py-40 my-8 justify-center leading-6 overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg overflow-hidden">
                Illustration goes here
              </div>

              <div className="flex-col p-8 w-full lg:w-6/12 text-primary dark:text-primary-dark flex grow items-end justify-start mx-auto">
                <h3 className="w-full leading-tight font-bold text-4xl mb-6 text-left">
                  Let a framework take care of the rest
                </h3>
                <p className="text-xl text-secondary dark:text-secondary-dark text-opacity-80 leading-normal text-left">
                  React is a library. It lets you create components and put them
                  together, but it doesn&apos;t prescribe solutions for routing
                  and data fetching.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-link bg-opacity-8 my-20 max-w-6xl mx-auto rounded-3xl p-20 text-base text-secondary dark:text-secondary-dark flex flex-col w-full justify-center items-center">
          <Logo className="text-link dark:text-link-dark w-36 mt-12 h-auto mx-auto self-start" />
          <div className="flex flex-wrap">
            <div className="mb-8 mt-4">
              <h1 className="text-center text-6xl mr-4 flex wrap font-bold leading-tight text-primary dark:text-primary-dark">
                Welcome to the React community
              </h1>
              <p className="text-4xl w-full text-center text-secondary dark:text-secondary-dark leading-relaxed self-center my-2">
                Get started today.
              </p>
            </div>
          </div>
        </div>

        <div className="my-20 px-12 flex flex-col w-full">
          <div className="p-20 text-base text-secondary dark:text-secondary-dark flex flex-col w-full justify-center items-center">
            <Logo className="text-link dark:text-link-dark w-36 mt-12 h-auto mx-auto self-start" />
            <div className="flex flex-wrap">
              <div className="mb-8 mt-4">
                <h1 className="text-center text-6xl mr-4 flex wrap font-bold leading-tight text-primary dark:text-primary-dark">
                  Welcome to the React community
                </h1>
                <p className="text-4xl w-full text-center text-secondary dark:text-secondary-dark leading-relaxed self-center my-2">
                  Get started today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function CodeAnimation() {
  return (
    <div className="flex-col lg:flex-row gap-20 flex grow w-full mx-auto items-center">
      <div className="flex grow">
        <CodeBlock isFromPackageImport={false}>
          <div>{`function Comment({ author, comment }) {
  return (
    <Panel background="grey">
      <ProfileLink to={author}>
        <Avatar image={author.image} />
      </ProfileLink>
      <CommentBody>
        {comment.text}
      </CommentBody>
      <LikeButton />
    </Panel>
  );
}`}</div>
        </CodeBlock>
      </div>
      <div className="max-w-xl">
        <Example />
      </div>
    </div>
  );
}

function Example() {
  return (
    <Comment
      comment={{
        text: 'Machines take me by surprise with great frequency.',
      }}
      author={{
        name: 'Alan Turing',
        image: {url: 'https://i.imgur.com/xWJFmSR.jpg'},
      }}
    />
  );
}

function Comment({author, comment}) {
  return (
    <Panel background="grey">
      <ProfileLink to={author}>
        <Avatar image={author.image} />
      </ProfileLink>
      <CommentBody>{comment.text}</CommentBody>
      <LikeButton />
    </Panel>
  );
}

function Panel({children}) {
  return (
    <div
      style={{
        width: 500,
        height: 300,
        color: 'black',
      }}>
      <div
        style={{
          margin: 25,
          width: 'fit-content',
          padding: 20,
          backgroundColor: '#f0f0f0',
          borderRadius: 10,
          minWidth: 100,
          minHeight: 40,
        }}>
        {children}
      </div>
    </div>
  );
}

function ProfileLink({children, to}) {
  return (
    <div
      style={{
        backgroundColor: '#f0f0f0',
        transition: 'all 0.4s ease-in-out',
      }}>
      {children}
      <div
        style={{
          display: 'inline-block',
        }}>
        {to.name}
      </div>
    </div>
  );
}

function Avatar({image}) {
  return (
    <img
      src={image ? image.url : null}
      style={{
        marginRight: 10,
        marginBottom: 5,
        height: 60,
        width: 60,
        borderRadius: '50%',
        display: 'inline-block',
        verticalAlign: 'middle',
        transition: 'all 0.4s ease-in-out',
        backgroundColor: '#aaa',
      }}
    />
  );
}

function CommentBody({children}) {
  return (
    <div
      style={{
        fontSize: 14,
        color: '#444',
        marginTop: 10,
        marginBottom: 10,
      }}>
      {children}
    </div>
  );
}

function LikeButton() {
  return (
    <button
      style={{
        backgroundColor: '#222',
        color: 'white',
        borderRadius: 4,
        padding: '4px 10px',
      }}>
      Like
    </button>
  );
}
