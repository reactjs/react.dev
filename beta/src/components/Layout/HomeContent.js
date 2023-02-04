/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {createContext, useState, useContext, Suspense} from 'react';
import ButtonLink from '../ButtonLink';
import {IconRestart} from '../Icon/IconRestart';
import {Logo} from 'components/Logo';
import Link from 'components/MDX/Link';
import CodeBlock from 'components/MDX/CodeBlock';

export function HomeContent() {
  return (
    <>
      <div className="pl-0">
        <div className="mx-5 mt-12 mb-20 flex flex-col justify-center">
          <Logo className="mt-4 mb-3 text-link dark:text-link-dark w-24 lg:w-28 self-center" />
          <h1 className="text-5xl lg:text-6xl self-center flex font-bold leading-snug text-primary dark:text-primary-dark">
            React
          </h1>
          <p className="text-4xl py-1 text-center text-secondary dark:text-primary-dark leading-snug self-center">
            The library for web and native user interfaces
          </p>
          <div className="my-5 self-center flex gap-2 w-full sm:w-auto">
            <ButtonLink
              href={'/learn'}
              type="primary"
              size="lg"
              className="w-full sm:w-auto justify-center"
              label="Take the Tutorial">
              Learn React
            </ButtonLink>
            <ButtonLink
              href={'/reference/react'}
              type="secondary"
              size="lg"
              className="w-full sm:w-auto justify-center"
              label="Take the Tutorial">
              API Reference
            </ButtonLink>
          </div>
        </div>
        <div className="">
          <div className="mx-auto bg-card dark:bg-card-dark shadow-inner mt-8 flex flex-col w-full">
            <div className="flex-col gap-2 flex grow w-full my-16 lg:my-20 mx-auto items-center">
              <div className="px-5 lg:px-0 max-w-4xl text-center text-white text-opacity-80">
                <h3 className="leading-tight text-primary dark:text-primary-dark font-semibold text-4xl lg:text-5xl mb-6">
                  Create user interfaces from components
                </h3>
                <p className="text-xl lg:text-2xl text-secondary dark:text-secondary-dark leading-normal">
                  React lets you build user interfaces out of individual pieces
                  called components. Create your own React components like a
                  button, a panel, or an avatar. Then combine them into entire
                  screens, pages, and apps.
                </p>
              </div>
              <Example1 />
              <div className="px-5 lg:px-0 max-w-4xl text-center text-white text-opacity-80">
                <p className="text-xl lg:text-2xl text-secondary dark:text-secondary-dark leading-normal">
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
            <div className="flex-col gap-2 flex grow w-full my-16 lg:my-20 mx-auto items-center">
              <div className="px-5 lg:px-0 max-w-4xl text-center text-opacity-80">
                <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-4xl lg:text-5xl mb-6">
                  Write components with code and markup
                </h3>
                <p className="text-xl lg:text-2xl leading-normal">
                  React components are JavaScript functions. Want to show
                  something conditionally? Use an <Code>if</Code> statement.
                  Need to display a list? Use a <Code>for</Code> loop or array{' '}
                  <Code>map()</Code>. Learning React is learning programming.
                </p>
              </div>
              <div className="max-w-6xl mx-auto flex flex-col w-full">
                <Example2 />
              </div>
              <div className="px-5 lg:px-0 max-w-4xl text-center text-opacity-80">
                <p className="text-xl lg:text-2xl leading-normal">
                  This markup syntax is called JSX. It is a JavaScript syntax
                  extension popularized by React. Putting JSX markup close to
                  related rendering logic makes React components easy to create,
                  maintain, and delete.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="shadow-inner bg-card dark:bg-card-dark">
          <div className="max-w-6xl mx-auto flex flex-col w-full">
            <div className="flex-col gap-2 flex grow w-full my-16 lg:my-20 mx-auto items-center">
              <div className="px-5 lg:px-0 max-w-4xl text-center text-opacity-80">
                <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-4xl lg:text-5xl mb-6">
                  Go full-stack with a framework
                </h3>
                <p className="text-xl lg:text-2xl text-secondary dark:text-secondary-dark leading-normal">
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
              <div className="px-5 lg:px-0 max-w-4xl text-center text-secondary dark:text-secondary-dark">
                <p className="text-xl lg:text-2xl text-secondary dark:text-secondary-dark leading-normal">
                  To frameworks, React is more than a library—React is an
                  architecture. React provides a unified programming model that
                  spans across client and server so that you can use both of
                  them for what they are best at.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <div className="max-w-6xl mx-auto flex flex-col w-full">
            <div className="flex-col gap-2 flex grow w-full my-16 lg:my-20 mx-auto items-center">
              <div className="px-5 lg:px-0 max-w-4xl text-center text-opacity-80">
                <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-4xl lg:text-5xl mb-6">
                  Make the best use of the platform
                </h3>
                <p className="text-xl lg:text-2xl leading-normal text-secondary dark:text-secondary-dark">
                  Web users expect pages to load fast. React can render into an
                  HTML stream on the server, gradually revealing more content
                  even before React itself has loaded on the client. React
                  relies on modern web standards to keep the page responsive
                  even during rendering.
                </p>
              </div>
              <br />
              <div className="px-5 lg:px-0 max-w-4xl text-center text-opacity-80">
                <p className="text-xl lg:text-2xl text-secondary dark:text-secondary-dark leading-normal">
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

        <div className="">
          <div className="max-w-6xl mx-auto flex flex-col w-full">
            <div className="flex-col gap-2 flex grow w-full my-16 lg:my-20 mx-auto items-center">
              <div className="px-5 lg:px-0 max-w-4xl text-center text-opacity-80">
                <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-4xl lg:text-5xl mb-6">
                  Use as little or as much React as you need
                </h3>
                <p className="text-xl lg:text-2xl leading-normal text-secondary dark:text-secondary-dark">
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
            </div>
          </div>
        </div>

        <div className="">
          <div className="max-w-6xl mx-auto flex flex-col w-full">
            <div className="flex-col gap-2 flex grow w-full my-16 lg:my-20 mx-auto items-center">
              <div className="px-5 lg:px-0 max-w-4xl text-center text-opacity-80">
                <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-4xl lg:text-5xl mb-6">
                  Stability without stagnation
                </h3>
                <p className="text-xl lg:text-2xl leading-normal text-secondary dark:text-secondary-dark">
                  React approaches changes with care. Every React commit is
                  tested on business-critical surfaces with hundreds of millions
                  of users. When an API is deprecated, we add warnings and
                  publish automatic scripts to assist with the migration. The
                  100,000 React components in the Meta codebase help validate
                  every migration strategy. The React team is also always
                  researching how to improve React. React has a high bar for
                  taking an idea from research to production. Only proven
                  approaches become part of React. Learn about our latest
                  research
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="my-16 lg:my-20 px-12 flex flex-col w-full">
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

        <div className="bg-link bg-opacity-8 my-16 lg:my-20 max-w-6xl mx-auto rounded-3xl p-20 text-base text-secondary dark:text-secondary-dark flex flex-col w-full justify-center items-center">
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

        <div className="my-16 lg:my-20 px-12 flex flex-col w-full">
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
    <div className="lg:mx-2 w-full">
      <div className="my-16 lg:my-20 p-2 max-w-6xl mx-auto flex flex-col w-full border border-border dark:border-opacity-10 lg:rounded-2xl bg-card dark:bg-card-dark">
        <div className="flex-col-reverse lg:flex-row gap-2 flex grow w-full mx-auto items-center">
          <div className="h-full rounded-2xl bg-wash dark:bg-gray-95 w-full p-2 flex grow flex-col border-t border border-border dark:border-border-dark">
            <h3 className="text-sm my-2 mx-4 text-gray-30 dark:text-gray-50 select-none">
              Comment.js
            </h3>
            <CodeBlock isFromPackageImport={false} noShadow={true}>
              <div>{`function Comment({ comment }) {
  return (
    <div>
      <Avatar user={comment.author} />
      <ProfileLink to={comment.author} />
      <p>{comment.text}</p>
    </div>
  );
}
          `}</div>
            </CodeBlock>
          </div>
          <div className="w-full p-8 flex grow justify-center">
            <ExamplePanel>
              <Comment
                comment={{
                  text: 'The quick brown fox jumps over the lazy dog',
                  postedAt: '2m ago',
                  author: {
                    name: 'First name',
                    image: null,
                  },
                }}
              />
            </ExamplePanel>
          </div>
        </div>
      </div>
    </div>
  );
}

const PostContext = createContext(null);
const author = {
  name: 'First name',
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
    <div className="lg:mx-2">
      <div className="my-16 lg:my-20 p-2 max-w-6xl mx-auto flex flex-col w-full border-y lg:border border-border dark:border-border-dark lg:rounded-3xl bg-card dark:bg-wash-dark">
        <div className="flex-col-reverse lg:flex-row gap-2 flex grow w-full mx-auto items-center">
          <div className="rounded-2xl bg-wash dark:bg-gray-95 w-full p-2 flex grow flex-col border-t border border-border dark:border-border-dark">
            <h3 className="text-sm my-2 mx-4 text-gray-30 dark:text-gray-50 select-none">
              CommentList.js
            </h3>
            <CodeBlock isFromPackageImport={false} noShadow={true}>
              <div>{`function CommentList({ comments }) {
  let heading = 'Be the first to comment';
  if (comments.length > 0) {
    heading = comments.length + ' Comments';
  }
  return (
    <section>
      <h1>{heading}</h1>
      {comments.map(comment =>
        <Comment key={comment.id} comment={comment} />
      )}
    </section>
  );
}`}</div>
            </CodeBlock>
          </div>
          <div className="w-full p-8 py-8 flex grow justify-center">
            <ExamplePanel noShadow={false} noPadding={true}>
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
    <div className="lg:mx-2">
      <div className="my-16 lg:my-20 p-2 max-w-6xl mx-auto flex flex-col w-full border border-border dark:border-opacity-10 lg:rounded-2xl bg-card dark:bg-card-dark">
        <div className="flex-col-reverse lg:flex-row gap-2 flex grow w-full mx-auto items-center">
          <div className="rounded-2xl bg-wash dark:bg-gray-95 w-full p-2 flex grow flex-col border-t border border-border dark:border-border-dark">
            <h3 className="text-sm my-2 mx-4 text-gray-30 dark:text-gray-50 select-none">
              PostPage.js
            </h3>
            <CodeBlock isFromPackageImport={false} noShadow={true}>
              <div>{`async function PostPage({ slug }) {
  const post = await db.findPost({ slug });
  return (
    <PostLayout coverUrl={post.coverUrl}>
      <Suspense fallback={<CommentsSkeleton />}>
        <PostComments postId={post.id} />
      </Suspense>
    </PostLayout>
  );
}

async function PostComments({ postId }) {
  const comments = await db.findComments({ postId });
  return (
    <>
      <CommentList comments={comments} />
      <AddComment postId={postId} />
    </>
  );
}`}</div>
            </CodeBlock>
          </div>
          <div className="w-full p-8 flex grow justify-center">
            <BrowserChrome>
              <ExamplePanel noPadding={true} noShadow={true}>
                <PostContext.Provider
                  value={{
                    currentUser: author,
                    onAddComment: handleAddComment,
                  }}>
                  <PostPage
                    post={{
                      coverUrl: 'https://i.imgur.com/Q7TJkPm.jpg',
                      comments,
                    }}
                  />
                </PostContext.Provider>
              </ExamplePanel>
            </BrowserChrome>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExamplePanel({children, noPadding, noShadow}) {
  return (
    <div
      style={{
        padding: noPadding ? 0 : '20px 20px 0 20px',
        boxShadow: noShadow
          ? 'none'
          : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderRadius: 20,
        margin: '0 auto',
        color: '#404756',
        fontSize: 15,
        lineHeight: 1.5,
        backgroundColor: '#fefefe',
        minHeight: 40,
        overflow: 'hidden',
        width: '100%',
      }}>
      {children}
    </div>
  );
}

function BrowserChrome({children}) {
  return (
    <div className="bg-wash dark:bg-gray-95 shadow-xl relative overflow-hidden w-full border border-border dark:border-opacity-10 rounded-2xl">
      <div className="w-full h-16 border-b border-border backdrop-filter rounded-t-2xl overflow-hidden backdrop-blur-lg backdrop-saturate-200 bg-white bg-opacity-90 z-10 absolute top-0 py-4 px-4 gap-2 flex flex-row items-center">
        <div className="bg-gray-10 text-sm text-gray-50 text-center rounded-full p-1 w-full flex-row flex space-between items-center">
          <div className="h-6 w-6" />
          <div className="w-full leading-snug">localhost:3000</div>
          <div className="flex items-center p-1.5 rounded-full hover:bg-gray-20 hover:bg-opacity-50 cursor-pointer justify-center">
            <IconRestart className="text-primary text-lg" />
          </div>
        </div>
      </div>
      <div className="">{children}</div>
    </div>
  );
}

function PostPage({post}) {
  // TODO: fix suspense
  return (
    <>
      <CommentsSkeleton />
      <PostCover imageUrl={post.coverUrl}>
        <Suspense fallback={<CommentsSkeleton />}>
          <PostComments post={post} />
        </Suspense>
      </PostCover>
    </>
  );
}

function CommentsSkeleton() {
  return (
    <div className="absolute inset-0 z-10 mt-16 flex flex-col items-center overflow-hidden">
      <div className="w-full">
        <div className="relative overflow-hidden before:-skew-x-12 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.75s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent">
          <div className="space-y-3 space-x-5">
            <div className="h-40 bg-gray-10"></div>
            <div className="pt-3.5">
              <div className="h-5 w-32 rounded-lg bg-gray-10"></div>
            </div>
            <div className="flex flex-row items-center gap-3 pt-2">
              <div className="h-8 w-8 rounded-full bg-gray-10"></div>
              <div className="h-3 w-12 rounded-lg bg-gray-10"></div>
            </div>
            <div className="h-3.5 w-2/5 rounded-lg bg-gray-10"></div>
            <div className="flex flex-row items-center gap-3 pt-3">
              <div className="h-8 w-8 rounded-full bg-gray-10"></div>
              <div className="h-3 w-20 rounded-lg bg-gray-10"></div>
            </div>
            <div className="h-3.5 w-3/5 rounded-lg bg-gray-10"></div>
            <div className="flex flex-row items-center gap-3 pt-3">
              <div className="h-8 w-8 rounded-full bg-gray-10"></div>
              <div className="h-3 w-20 rounded-lg bg-gray-10"></div>
            </div>
            <div className="h-3.5 w-3/5 rounded-lg bg-gray-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
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
        maxHeight: 320,
        position: 'relative',
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
      }}>
      <Stack gap={0}>
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
      <div style={{overflowY: 'scroll'}}>
        <div
          style={{
            height: 160,
            marginTop: 64,
            overflow: 'hidden',
          }}>
          <img
            src={imageUrl}
            alt="Cover image"
            width="100%"
            style={{maxWidth: '100%'}}
          />
        </div>
        {children}
      </div>
    </>
  );
}

function Heading({children}) {
  return (
    <h1
      style={{
        fontWeight: 'bold',
        fontSize: 20,
        color: '#222',
        paddingBottom: 15,
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
        zIndex: 10,
        paddingBottom: 15,
        background: 'white',
        width: '100%',
      }}>
      <hr style={{paddingTop: 15}} />
      <Row>
        <Avatar user={currentUser} />
        <form
          style={{width: '100%', display: 'flex', alignItems: 'center'}}
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
            style={{
              backgroundColor: 'transparent',
              outline: 'none',
              width: '100%',
            }}
          />
        </form>
      </Row>
    </div>
  );
}

function Comment({comment}) {
  const {author} = comment;
  return (
    <div style={{margin: '0 0 20px 0'}}>
      <Stack gap={8}>
        <Row>
          <Avatar user={author} />
          <ExampleLink to={author.url}>{author.name}</ExampleLink>
        </Row>
        {comment.text}
      </Stack>
    </div>
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

function Code({children}) {
  return (
    <span className="font-mono inline rounded-lg bg-secondary-button dark:bg-secondary-button-dark py-0.5 px-1">
      {children}
    </span>
  );
}

function Row({children}) {
  return <div style={{display: 'flex', flexDirection: 'row'}}>{children}</div>;
}

function ExampleLink({children}) {
  return (
    <div
      style={{
        fontSize: 17,
        marginTop: 3,
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
        minHeight: 32,
        minWidth: 32,
        borderRadius: '50%',
        position: 'relative',
        display: 'flex',
        alignItems: 'end',
        overflow: 'hidden',
        justifyContent: 'center',
        verticalAlign: 'middle',
        transition: 'all 0.4s ease-in-out',
        backgroundColor: '#EBECF0',
        backgroundImage: user.image ? `url(${user.image.url})` : null,
        backgroundSize: 'cover',
      }}>
      {user.image ? null : <AvatarPlaceholder />}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '50%',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.1)',
        }}
      />
    </div>
  );
}

function AvatarPlaceholder() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{marginBottom: -1}}
      width="24"
      height="24"
      viewBox="0 0 24 24">
      <g fill="none" fillRule="evenodd" transform="translate(-444 -156)">
        <g fill="#99A1B3" transform="translate(353 156)">
          <path d="M106.75,5.75 C106.75,8.2355 105.0715,10.25 103,10.25 C100.9285,10.25 99.25,8.2355 99.25,5.75 C99.25,3.2645 100.3215,1.25 103,1.25 C105.6785,1.25 106.75,3.2645 106.75,5.75" />
          <path
            fillRule="nonzero"
            d="M107.5,5.75 C107.5,8.62264765 105.518964,11 103,11 C100.481036,11 98.5,8.62264765 98.5,5.75 C98.5,2.60742209 100.059741,0.5 103,0.5 C105.940259,0.5 107.5,2.60742209 107.5,5.75 Z M106,5.75 C106,3.35481964 104.997273,2 103,2 C101.002727,2 100,3.35481964 100,5.75 C100,7.84855959 101.376137,9.5 103,9.5 C104.623863,9.5 106,7.84855959 106,5.75 Z"
          />
          <path d="M110.3008,22.75 L95.6993,22.75 C94.6268,22.75 93.7498,21.873 93.7498,20.801 L93.7498,19.601 C93.7498,16.108 96.6078,13.25 100.1013,13.25 L105.8988,13.25 C109.3923,13.25 112.2498,16.108 112.2498,19.601 L112.2498,20.801 C112.2498,21.873 111.3733,22.75 110.3008,22.75" />
          <path
            fillRule="nonzero"
            d="M110.3008,23.5 L95.6993,23.5 C94.2126937,23.5 92.9998,22.2873208 92.9998,20.801 L92.9998,19.601 C92.9998,15.6936997 96.1936731,12.5 100.1013,12.5 L105.8988,12.5 C109.80635,12.5 112.9998,15.6936231 112.9998,19.601 L112.9998,20.801 C112.9998,22.2873563 111.787371,23.5 110.3008,23.5 Z M110.3008,22 C110.958884,22 111.4998,21.4589886 111.4998,20.801 L111.4998,19.601 C111.4998,16.522032 108.977905,14 105.8988,14 L100.1013,14 C97.022082,14 94.4998,16.5221451 94.4998,19.601 L94.4998,20.801 C94.4998,21.4588343 95.0410614,22 95.6993,22 L110.3008,22 Z"
          />
        </g>
        <polygon points="444 180 468 180 468 156 444 156" />
      </g>
    </svg>
  );
}
