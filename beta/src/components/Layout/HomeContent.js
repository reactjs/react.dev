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
              href={'/reference/react'}
              type="secondary"
              size="lg"
              label="Take the Tutorial">
              API Reference
            </ButtonLink>
          </div>
        </div>
        <div className="">
          <div className="mx-auto bg-card dark:bg-card-dark shadow-inner px-12 mt-8 flex flex-col w-full">
            <div className="flex-col gap-2 flex grow w-full my-20 mx-auto items-center">
              <div className="max-w-4xl text-center text-white text-opacity-80">
                <h3 className="leading-tight text-primary dark:text-primary-dark font-semibold text-5xl mb-6">
                  Create user interfaces from components
                </h3>
                <p className="text-2xl text-secondary dark:text-secondary-dark leading-normal">
                  React lets you build user interfaces out of individual pieces
                  called components. Create your own React components like a
                  button, a panel, or an avatar. Then combine them into entire
                  screens, pages, and apps.
                </p>
              </div>
              <Example1 />
              <div className="max-w-4xl text-center text-white text-opacity-80">
                <p className="text-2xl text-secondary dark:text-secondary-dark leading-normal">
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
              <div className="max-w-4xl text-center text-opacity-80">
                <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-5xl mb-6">
                  Write components with code and markup
                </h3>
                <p className="text-2xl leading-normal">
                  React components are JavaScript functions. Want to show
                  something conditionally? Use an <Code>if</Code> statement.
                  Need to display a list? Use a <Code>for</Code> loop or array{' '}
                  <Code>map()</Code>. Learning React is learning programming.
                </p>
              </div>
              <div className="max-w-6xl mx-auto flex flex-col w-full">
                <Example2 />
              </div>
              <div className="max-w-4xl text-center text-opacity-80">
                <p className="text-2xl leading-normal">
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
            <div className="flex-col gap-2 flex grow w-full my-20 mx-auto items-center">
              <div className="max-w-4xl text-center text-opacity-80">
                <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-5xl mb-6">
                  Go full-stack with a framework
                </h3>
                <p className="text-2xl text-secondary dark:text-secondary-dark leading-normal">
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
              <div className="max-w-4xl text-center text-secondary dark:text-secondary-dark">
                <p className="text-2xl leading-normal">
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
            <div className="flex-col gap-2 flex grow w-full my-20 mx-auto items-center">
              <div className="max-w-4xl text-center text-opacity-80">
                <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-5xl mb-6">
                  Make the best use of the platform
                </h3>
                <p className="text-2xl leading-normal text-secondary dark:text-secondary-dark">
                  Web users expect pages to load fast. React can render into an
                  HTML stream on the server, gradually revealing more content
                  even before React itself has loaded on the client. React
                  relies on modern web standards to keep the page responsive
                  even during rendering.
                </p>
              </div>
              <br />
              <div className="max-w-4xl text-center text-opacity-80">
                <p className="text-2xl leading-normal">
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
            <div className="flex-col gap-2 flex grow w-full my-20 mx-auto items-center">
              <div className="max-w-4xl text-center text-opacity-80">
                <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-5xl mb-6">
                  Use as little or as much React as you need
                </h3>
                <p className="text-2xl leading-normal text-secondary dark:text-secondary-dark">
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
            <div className="flex-col gap-2 flex grow w-full my-20 mx-auto items-center">
              <div className="max-w-4xl text-center text-opacity-80">
                <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-5xl mb-6">
                  Stability without stagnation
                </h3>
                <p className="text-2xl leading-normal text-secondary dark:text-secondary-dark">
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
    <div className="lg:mx-2 w-full">
      <div className="my-20 p-2 max-w-6xl mx-auto flex flex-col w-full border border-border dark:border-opacity-10 lg:rounded-2xl bg-card dark:bg-card-dark">
        <div className="flex-col-reverse lg:flex-row gap-2 flex grow w-full mx-auto items-center">
          <div className="rounded-2xl bg-wash dark:bg-gray-95 w-full p-2 flex grow flex-col border-t border border-border dark:border-border-dark">
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
          <div className="w-full px-2 py-12 flex grow justify-center">
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
      <div className="my-20 p-2 max-w-6xl mx-auto flex flex-col w-full border border-border dark:border-border-dark lg:rounded-2xl bg-card dark:bg-wash-dark">
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
          <div className="w-full px-2 py-8 flex grow justify-center">
            <ExamplePanel padding={true}>
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
      <div className="my-20 p-2 max-w-6xl mx-auto flex flex-col w-full border border-border dark:border-opacity-10 lg:rounded-2xl bg-card dark:bg-card-dark">
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
          <div className="w-full py-12 flex grow justify-center">
            <BrowserChrome>
              <ExamplePanel padding={true}>
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

function ExamplePanel({children, padding}) {
  return (
    <div
      style={{
        padding: padding ? 0 : '20px 20px 0 20px',
        margin: '0 auto',
        color: '#404756',
        backgroundColor: '#fefefe',
        boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.1)',
        borderRadius: 10,
        minHeight: 40,
        overflow: 'hidden',
      }}>
      {children}
    </div>
  );
}

function BrowserChrome({children}) {
  return <div className="max-w-sm">{children}</div>;
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
        maxHeight: 320,
        overflow: 'scroll',
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
      <div
        style={{
          marginLeft: -20,
          marginRight: -20,
          height: 120,
          position: 'sticky',
          top: 0,
          overflow: 'hidden',
        }}>
        <img src={imageUrl} alt="Cover image" width="100%" />
      </div>
      {children}
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
        paddingBottom: 20,
        background: 'white',
        width: '100%',
      }}>
      <hr style={{paddingTop: 15}} />
      <Row>
        <Avatar user={currentUser} />
        <form
          style={{width: '100%'}}
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
      <Stack>
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
        minHeight: 32,
        minWidth: 32,
        borderRadius: '50%',
        display: 'flex',
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
