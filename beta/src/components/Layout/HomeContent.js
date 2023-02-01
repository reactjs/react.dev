/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {createContext, useState, useContext} from 'react';
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

        <div className="p-20">
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
          <div>{`
function PostComment({ author, text, postedAt }) {
  return (
    <Stack>
      <Row>
        <Avatar user={author} />
        <Link to={author.url}>{author.name}</Link>
        <Timestamp time={postedAt} />
      </Row>
      {text}
    </Stack>
  );
}
          `}</div>
        </CodeBlock>
      </div>
      <div className="max-w-xl">
        <ExamplePanel>
          <PostComment
            text="The quick brown fox jumps over the lazy dog"
            postedAt="2m ago"
            author={{
              name: 'Lauren',
              image: {
                url: 'https://pbs.twimg.com/profile_images/1467169010437570562/THFD56Pc_400x400.jpg',
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
  name: 'Lauren',
  image: {
    url: 'https://pbs.twimg.com/profile_images/1467169010437570562/THFD56Pc_400x400.jpg',
  },
};

function Example2() {
  const [comments, setComments] = useState([
    {
      id: 0,
      text: 'The quick brown fox jumps over the lazy dog',
      postedAt: '4m ago',
      author,
    },
    {
      id: 1,
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
          <div>{`function Post({ imageUrl, description, comments }) {
  let headingText = 'Be the first to comment';
  if (comments.length > 0) {
    headingText = comments.length + ' Comments';
  }
  return (
    <Stack gap={16}>
      <CoverImage src={imageUrl} alt={description} />
      <Heading>{headingText}</Heading>
      {comments.map(comment =>
        <PostComment key={comment.id} {...comment} />
      )}
      <AddComment />
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
            <Post
              imageUrl="https://www.nasa.gov/sites/default/files/styles/full_width/public/thumbnails/image/main_image_star-forming_region_carina_nircam_final-1280.jpg"
              description="A picture of the galaxy"
              comments={comments}
            />
          </PostContext.Provider>
        </ExamplePanel>
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

function Post({imageUrl, description, comments}) {
  let headingText = 'Be the first to comment';
  if (comments.length > 0) {
    headingText = comments.length + ' Comments';
  }
  return (
    <Stack gap={16}>
      <CoverImage src={imageUrl} alt={description} />
      <Heading>{headingText}</Heading>
      {comments.map((comment) => (
        <PostComment key={comment.id} {...comment} />
      ))}
      <AddComment />
    </Stack>
  );
}

function CoverImage({src, alt}) {
  return (
    <img
      src={src}
      alt={alt}
      width="300"
      style={{
        transform: 'scale(1.2)',
        transformOrigin: 'bottom',
      }}
    />
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
    <>
      <hr />
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
            style={{backgroundColor: 'transparent'}}
          />
        </form>
      </Row>
    </>
  );
}

function PostComment({author, text, postedAt}) {
  return (
    <Stack>
      <Row>
        <Avatar user={author} />
        <ExampleLink to={author.url}>{author.name}</ExampleLink>
        <Timestamp time={postedAt} />
      </Row>
      {text}
    </Stack>
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
    <img
      src={user?.image?.url}
      style={{
        marginRight: 10,
        marginBottom: 5,
        height: 30,
        width: 30,
        borderRadius: '50%',
        display: 'inline-block',
        verticalAlign: 'middle',
        transition: 'all 0.4s ease-in-out',
        backgroundColor: '#aaa',
      }}
    />
  );
}
