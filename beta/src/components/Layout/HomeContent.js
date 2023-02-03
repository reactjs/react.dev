/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {createContext, useState, useContext, Suspense} from 'react';
import ButtonLink from '../ButtonLink';
import {Logo} from 'components/Logo';
import Link from 'components/MDX/Link';
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
                <Example1 />
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

        <div className="">
          <div className="max-w-6xl mx-auto flex flex-col w-full">
            <div className="flex-col gap-2 flex grow w-full my-20 mx-auto items-center">
              <div className="max-w-2xl text-center text-opacity-80">
                <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-5xl mb-6">
                  Write components
                  <br />
                  with code and markup
                </h3>
                <p className="text-xl leading-normal">
                  React components are JavaScript functions. Want to show
                  something conditionally? Use an <code>if</code> statement.
                  Need to display a list? Use a <code>for</code> loop or array{' '}
                  <code>map()</code>. Learning React is learning programming.
                </p>
              </div>
              <div className="max-w-6xl mx-auto flex flex-col w-full">
                <Example2 />
              </div>
              <div className="max-w-2xl text-center text-opacity-80">
                <p className="text-xl leading-normal">
                  This markup syntax is called JSX. It is a JavaScript syntax
                  extension popularized by React. Putting JSX markup close to
                  related rendering logic makes React components easy to create,
                  maintain, and delete.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-card-dark">
          <div className="max-w-6xl mx-auto flex flex-col w-full">
            <div className="flex-col gap-2 flex grow w-full my-20 mx-auto items-center">
              <div className="max-w-2xl text-center text-opacity-80">
                <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-5xl mb-6">
                  Go full-stack
                  <br />
                  with a framework
                </h3>
                <p className="text-xl leading-normal">
                  React is a library. It lets you put components together, but
                  it doesn’t prescribe solutions for routing and data fetching.
                  To get the most out of React, we recommend a React framework
                  like{' '}
                  <Link href="https://github.com/vercel/next.js">Next.js</Link>,{' '}
                  <Link href="https://remix.run/">Remix</Link>, and{' '}
                  <Link href="https://expo.dev/">Expo</Link>. Frameworks let you
                  create full-stack apps with very little configuration.
                </p>
              </div>
              <div className="max-w-6xl mx-auto flex flex-col w-full">
                <Example3 />
              </div>
              <div className="max-w-2xl text-center text-opacity-80">
                <p className="text-xl leading-normal">
                  For frameworks, React is more than a library—React is an
                  architecture. React provides a single unified programming
                  model that spans across the client <i>and</i> the server to
                  let you use both for what they’re best at.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <div className="max-w-6xl mx-auto flex flex-col w-full">
            <div className="flex-col gap-2 flex grow w-full my-20 mx-auto items-center">
              <div className="max-w-2xl text-center text-opacity-80">
                <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-5xl mb-6">
                  Make the best
                  <br />
                  use of the platform
                </h3>
                <p className="text-xl leading-normal">
                  Web users expect pages to load fast. React can render into an
                  HTML stream on the server, gradually revealing more content
                  even before React itself has loaded on the client. React
                  relies on modern web standards to keep the page responsive
                  even during rendering.
                </p>
              </div>

              <div className="max-w-2xl text-center text-opacity-80">
                <p className="text-xl leading-normal">
                  Mobile app users expect native look-and-feel. With{' '}
                  <Link href="https://reactnative.dev">React Native</Link>, you
                  can create Android and iOS apps with React. These user
                  interfaces can feel truly native because they <i>are</i> truly
                  native. Your React components render real Android and iOS
                  views natively provided by the platform.
                </p>
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

function Example1() {
  return (
    <div className="flex-col lg:flex-row gap-20 flex grow w-full mx-auto items-center">
      <div className="flex grow">
        <CodeBlock isFromPackageImport={false}>
          <div>{`import { Stack, Row, Avatar, Link, Timestamp } from 'your-design-system';

export function Comment({ comment }) {
  const { author } = comment;
  return (
    <Stack>
      <Row>
        <Avatar user={author} />
        <Link to={author.url}>{author.name}</Link>
        <Timestamp time={comment.postedAt} />
      </Row>
      {comment.text}
    </Stack>
  );
}
          `}</div>
        </CodeBlock>
      </div>
      <div className="max-w-xl">
        <ExamplePanel>
          <Comment
            comment={{
              text: 'The quick brown fox jumps over the lazy dog',
              postedAt: '2m ago',
              author: {
                name: 'Firstname',
                image: null,
              },
            }}
          />
        </ExamplePanel>
      </div>
    </div>
  );
}

const PostContext = createContext(null);
const author = {
  name: 'Firstname',
  image: null,
};

function Example2() {
  const [comments, setComments] = useState([
    {
      id: 0,
      text: 'The quick brown fox jumps over the lazy dog',
      postedAt: '2m ago',
      author,
    },
    {
      id: 1,
      text: 'The quick brown fox jumps over the lazy dog',
      postedAt: '2m ago',
      author,
    },
    {
      id: 2,
      text: 'The quick brown fox jumps over the lazy dog',
      postedAt: '2m ago',
      author,
    },
  ]);

  function handleAddComment(text) {
    setComments((c) => [
      ...c,
      {
        id: c.length,
        text,
        postedAt: 'just now',
        author,
      },
    ]);
  }

  return (
    <div className="flex-col lg:flex-row gap-20 flex grow w-full mx-auto items-center">
      <div className="flex grow">
        <CodeBlock isFromPackageImport={false}>
          <div>{`import { Stack, Heading } from 'your-design-system';
import { Comment } from './Comment.js';

export function CommentList({ comments, children }) {
  let headingText = 'Be the first to comment';
  if (comments.length > 0) {
    headingText = comments.length + ' Comments';
  }
  return (
    <Stack gap={16}>
      <Heading>{headingText}</Heading>
      {comments.map(comment =>
        <Comment key={comment.id} comment={comment} />
      )}
      {children}
    </Stack>
  );
}`}</div>
        </CodeBlock>
      </div>
      <div className="max-w-xl">
        <ExamplePanel>
          <PostContext.Provider
            value={{
              currentUser: author,
              onAddComment: handleAddComment,
            }}>
            <CommentList comments={comments} />
          </PostContext.Provider>
        </ExamplePanel>
      </div>
    </div>
  );
}

function Example3() {
  const [comments, setComments] = useState([
    {
      id: 0,
      text: 'fika :D',
      postedAt: '1h ago',
      author: {
        name: 'Luna',
        image: {
          url: 'https://i.imgur.com/B3E9zDz.jpg',
        },
      },
    },
    {
      id: 1,
      text: `ok, I have to ask. What is FIKA?`,
      postedAt: '12m ago',
      author: {
        name: 'Samuel',
        image: {
          url: 'https://i.imgur.com/OUkVY2C.jpg',
        },
      },
    },
    {
      id: 2,
      text:
        `It's a thing the core team used to do, I believe (never been to one). ` +
        `Basically grab a drink and/or snack and just chill for a bit together`,
      postedAt: '7m ago',
      author: {
        name: 'Lauren',
        image: {
          url: 'https://i.imgur.com/8ayW9oH.jpg',
        },
      },
    },
    {
      id: 3,
      text: `When I ask to get cofee, I really mean "fika".`,
      postedAt: '4m ago',
      author: {
        name: 'Sebastian',
        image: {
          url: 'https://i.imgur.com/FX7DZbQ.jpg',
        },
      },
    },
    {
      id: 4,
      text: `There's no english word for it.`,
      postedAt: '4m ago',
      author: {
        name: 'Sebastian',
        image: {
          url: 'https://i.imgur.com/FX7DZbQ.jpg',
        },
      },
    },
    {
      id: 5,
      text: `we need more sweets to go with the coffee!`,
      postedAt: '2m ago',
      author: {
        name: 'Yuzhi',
        image: {
          url: 'https://i.imgur.com/jxLrU8B.jpg',
        },
      },
    },
  ]);

  function handleAddComment(text) {
    setComments((c) => [
      ...c,
      {
        id: c.length,
        text,
        postedAt: 'just now',
        author,
      },
    ]);
  }

  return (
    <div className="flex-col lg:flex-row gap-20 flex grow w-full mx-auto items-center">
      <div className="flex grow">
        <CodeBlock isFromPackageImport={false}>
          <div>{`import { Suspense } from 'react';
import { PostCover, CommentList, AddComment } from './components';
import { db } from './database.js';

export default async function PostPage({ params }) {
  const post = await db.findPost({ slug: params.slug });
  return (
    <PostCover imageUrl={post.coverUrl}>
      <Suspense fallback={<CommentsSkeleton />}>
        <PostComments postId={post.id} />
      </Suspense>
    </PostCover>
  );
}

async function PostComments({ postId }) {
  return (
    <CommentList comments={await db.findComments({ postId })}>
      <AddComment />
    </CommentList>
  );
}`}</div>
        </CodeBlock>
      </div>
      <div className="max-w-xl">
        <BrowserChrome>
          <ExamplePanel>
            <PostContext.Provider
              value={{
                currentUser: author,
                onAddComment: handleAddComment,
              }}>
              <PostPage
                post={{
                  coverUrl:
                    'https://scontent-lcy1-1.xx.fbcdn.net/v/t1.15752-9/325627001_1075043223360852_6145649023119737113_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=ae9488&_nc_ohc=YepLoUA6kagAX8eEoQd&_nc_ht=scontent-lcy1-1.xx&uss=92da8eebfce9f94a&odm=b3ZlcnJlYWN0ZWQ4OTEud29ya3BsYWNlLmNvbQ&oe2=6403CA36&oh=03_AdSFsiiDB06aO6D8zrrWXG2ou1ek7tJ2GD0YXI71gyynCQ&oe=63DC5A82',
                  comments,
                }}
              />
            </PostContext.Provider>
          </ExamplePanel>
        </BrowserChrome>
      </div>
    </div>
  );
}

function ExamplePanel({children}) {
  return (
    <div
      style={{
        fontSize: 14,
        color: '#444',
      }}>
      <div
        style={{
          margin: 25,
          padding: 20,
          backgroundColor: '#fefefe',
          boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.1)',
          borderRadius: 10,
          minHeight: 40,
          overflow: 'hidden',
        }}>
        {children}
      </div>
    </div>
  );
}

function BrowserChrome({children}) {
  return <div>{children}</div>;
}

function PostPage({post}) {
  return (
    <PostCover imageUrl={post.coverUrl}>
      <Suspense fallback={<CommentsSkeleton />}>
        <PostComments post={post} />
      </Suspense>
    </PostCover>
  );
}

function CommentsSkeleton() {
  // TODO: add glimmer here
  return <div />;
}

function PostComments({post}) {
  return (
    <CommentList comments={post.comments}>
      <AddComment />
    </CommentList>
  );
}

function CommentList({comments, children}) {
  let headingText = 'Be the first to comment';
  if (comments.length > 0) {
    headingText = comments.length + ' Comments';
  }
  return (
    <div
      style={{
        maxHeight: 300,
        width: 300,
        overflow: 'scroll',
        position: 'relative',
      }}>
      <Stack gap={16}>
        <Heading>{headingText}</Heading>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
        {children}
      </Stack>
    </div>
  );
}

function PostCover({imageUrl, children}) {
  return (
    <>
      <img
        src={imageUrl}
        alt="Cover image"
        width="300"
        style={{
          transform: 'scale(1.2) translateY(-10px)',
          transformOrigin: 'bottom',
          background: 'transparent',
        }}
      />
      {children}
    </>
  );
}

function Heading({children}) {
  return (
    <h1
      style={{
        fontWeight: 'bold',
        fontSize: 23,
        color: '#222',
      }}>
      {children}
    </h1>
  );
}

function AddComment() {
  const {currentUser, onAddComment} = useContext(PostContext);
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        background: 'white',
        width: '100%',
      }}>
      <hr style={{paddingTop: 10}} />
      <Row>
        <Avatar user={currentUser} />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const json = Object.fromEntries(formData.entries());
            onAddComment(json.text);
            e.target.reset();
          }}>
          <input
            name="text"
            placeholder="Add a comment..."
            autoComplete="off"
            style={{backgroundColor: 'transparent'}}
          />
        </form>
      </Row>
    </div>
  );
}

function Comment({comment}) {
  const {author} = comment;
  return (
    <div>
      <Stack>
        <Row>
          <Avatar user={author} />
          <ExampleLink to={author.url}>{author.name}</ExampleLink>
          <Timestamp time={comment.postedAt} />
        </Row>
        {comment.text}
      </Stack>
    </div>
  );
}

function Timestamp({time}) {
  return (
    <span
      style={{
        color: '#aaa',
      }}>
      {time}
    </span>
  );
}

function Stack({children, gap}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap,
      }}>
      {children}
    </div>
  );
}

function Row({children}) {
  return <div style={{display: 'flex', flexDirection: 'row'}}>{children}</div>;
}

function ExampleLink({children}) {
  return (
    <div
      style={{
        fontSize: 16,
        marginRight: 10,
        color: '#222',
        fontWeight: 'bold',
      }}>
      {children}
    </div>
  );
}

function Avatar({user}) {
  return (
    <div
      style={{
        marginRight: 10,
        marginBottom: 5,
        height: 30,
        width: 30,
        borderRadius: '50%',
        display: 'inline-block',
        verticalAlign: 'middle',
        transition: 'all 0.4s ease-in-out',
        backgroundImage: user.image
          ? `url(${user.image.url})`
          : 'linear-gradient(63deg, rgba(184,101,164,1) 0%, rgba(226,105,59,1) 100%)',
        backgroundSize: 'cover',
      }}
    />
  );
}
