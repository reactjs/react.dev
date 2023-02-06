/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {createContext, useState, useContext, Suspense} from 'react';
import ButtonLink from '../ButtonLink';
import {IconRestart} from '../Icon/IconRestart';
import {Logo} from 'components/Logo';
import Link from 'components/MDX/Link';
import CodeBlock from 'components/MDX/CodeBlock';
import {IconNavArrow} from 'components/Icon/IconNavArrow';

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
          <div className="my-5 self-center flex gap-2 w-full sm:w-auto flex-col sm:flex-row">
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
                  </Link>{' '}
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
                  approaches become part of React.
                  <br />
                  <ButtonLink
                    href={'/'}
                    type="primary"
                    size="lg"
                    className="mt-16 justify-center"
                    label="Learn about our latest research">
                    Learn about our latest research
                    <IconNavArrow
                      displayDirection="right"
                      className="inline ml-1"
                    />
                  </ButtonLink>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden relative px-5">
          <div className="border-2 border-link dark:border-link-dark rounded-lg absolute h-full border left-1/2"></div>
          <div className="-mb-12 flex justify-between flex-row-reverse items-center w-full left-timeline">
            <div className="order-1 w-5/12"></div>
            <div className="order-1 w-5/12 px-1 py-4 text-right">
              <p className="mb-2 text-base text-link dark:text-link-dark">
                Q1 2022
              </p>
              <h4 className="mb-3 font-bold text-xl sm:text-2xl lg:text-3xl">
                React v18
              </h4>
              <p className="text-base lg:text-md leading-normal text-secondary-text dark:text-secondary-text-dark">
                Lorem ipsum dolor
              </p>
            </div>
          </div>
          <div className="-mb-12 flex justify-between items-center w-full right-timeline">
            <div className="order-1 w-5/12"></div>
            <div className="order-1  w-5/12 px-1 py-4 text-left">
              <p className="mb-2 text-base text-link dark:text-link-dark">
                Q4 2020
              </p>
              <h4 className="mb-3 font-bold text-xl sm:text-2xl lg:text-3xl">
                Server components
              </h4>
              <p className="text-base lg:text-md leading-normal text-secondary-text dark:text-secondary-text-dark">
                Lorem ipsum dolor
              </p>
            </div>
          </div>
          <div className="-mb-12 flex justify-between flex-row-reverse items-center w-full left-timeline">
            <div className="order-1 w-5/12"></div>
            <div className="order-1 w-5/12 px-1 py-4 text-right">
              <p className="mb-2 text-base text-link dark:text-link-dark">
                Q4 2020
              </p>
              <h4 className="mb-3 font-bold text-xl sm:text-2xl lg:text-3xl">
                React v17
              </h4>
              <p className="text-base lg:text-md leading-normal text-secondary-text dark:text-secondary-text-dark">
                Lorem ipsum dolor
              </p>
            </div>
          </div>

          <div className="-mb-12 flex justify-between items-center w-full right-timeline">
            <div className="order-1 w-5/12"></div>
            <div className="order-1 w-5/12 px-1 py-4 text-left">
              <p className="mb-2 text-base text-link dark:text-link-dark">
                Q1 2019
              </p>
              <h4 className="mb-3 font-bold text-xl sm:text-2xl lg:text-3xl">
                Hooks
              </h4>
              <p className="text-base lg:text-md leading-normal text-secondary-text dark:text-secondary-text-dark">
                Lorem ipsum dolor
              </p>
            </div>
          </div>
          <div className="flex justify-between flex-row-reverse items-center w-full left-timeline">
            <div className="order-1 w-5/12"></div>
            <div className="order-1 w-5/12 px-1 py-4 text-right">
              <p className="mb-2 text-base text-link dark:text-link-dark">
                Q4 2017
              </p>
              <h4 className="mb-3 font-bold text-xl sm:text-2xl lg:text-3xl">
                React v16
              </h4>
              <p className="text-base lg:text-md leading-normal text-secondary-text dark:text-secondary-text-dark">
                Lorem ipsum dolor
              </p>
            </div>
          </div>
        </div>

        <div className="mx-5">
          <div className="mx-auto mt-40 max-w-6xl bg-blue-80 rounded-3xl flex-col-reverse lg:flex-row flex items-center">
            <div className="w-full lg:w-6/12 p-12 flex-col text-white flex grow items-end justify-start my-0 mx-auto">
              <h3 className="w-full leading-tight font-bold text-4xl mb-6 text-left">
                Stability without stagnation
              </h3>
              <p className="text-xl leading-normal text-secondary-dark w-full text-left">
                React approaches changes with care. Every React commit is tested
                on business-critical surfaces with hundreds of millions of
                users.
              </p>
            </div>

            <div className="text-secondary-dark w-full lg:w-6/12 px-20 py-60 rounded-tl-3xl rounded-tr-3xl lg:rounded-r-3xl lg:rounded-tl-none justify-center leading-6 overflow-x-auto flex items-center bg-blue-60 overflow-hidden">
              Illustration goes here
            </div>
          </div>
        </div>

        <div className="my-16 px-5 flex flex-col w-full">
          <div className="py-12 lg:py-20 text-base text-secondary dark:text-secondary-dark flex flex-col w-full justify-center items-center">
            <Logo className="text-link dark:text-link-dark w-28 lg:w-36 mt-12 h-auto mx-auto self-start" />
            <div className="flex flex-wrap">
              <div className="mb-8 mt-4">
                <h1 className="text-center text-5xl lg:text-6xl flex wrap font-bold leading-tight text-primary dark:text-primary-dark">
                  Welcome to the React community
                </h1>
                <p className="text-3xl lg:text-4xl w-full text-center text-secondary dark:text-secondary-dark leading-relaxed self-center my-2">
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
    <div className="lg:pl-10 lg:pr-5 w-full">
      <div className="my-16 lg:my-20 max-w-6xl mx-auto flex flex-col w-full border-t lg:border border-border dark:border-opacity-10 lg:rounded-2xl bg-card dark:bg-card-dark">
        <div className="flex-col-reverse gap-0 lg:gap-5 lg:rounded-xl bg-gray-10 dark:bg-gray-70 shadow-inner lg:flex-row flex grow w-full mx-auto items-center">
          <div className="lg:-m-5 h-full shadow-xl lg:rounded-2xl bg-wash dark:bg-gray-95 w-full flex grow flex-col border-t lg:border border-border dark:border-border-dark">
            <div className="w-full bg-card dark:bg-wash-dark lg:rounded-t-2xl border-b border-border dark:border-border-dark">
              <h3 className="text-sm my-1 mx-5 text-tertiary dark:text-tertiary-dark select-none">
                Album.js
              </h3>
            </div>
            <CodeBlock
              isFromPackageImport={false}
              noShadow={true}
              noMargin={true}>
              <div>{`function Album({ album }) {
  return (
    <div>
      <Artwork image={album.artwork} />
      <h3>{album.title}</h3>
      <p>{album.year}</p>
      <SaveButton album={album} />
    </div>
  );
}
          `}</div>
            </CodeBlock>
          </div>
          <div className="w-full p-5 flex grow justify-center">
            <ExamplePanel>
              <Album
                album={{
                  name: 'Album title',
                  year: 'Release year',
                  artwork: null,
                }}
              />
            </ExamplePanel>
          </div>
        </div>
      </div>
    </div>
  );
}

function Example2() {
  const [albums, setAlbums] = useState([
    {
      id: 0,
      name: 'First album',
      year: 'Release year',
      artwork: null,
    },
    {
      id: 1,
      name: 'Second album',
      year: 'Release year',
      artwork: null,
    },
    {
      id: 2,
      name: 'Third album',
      year: 'Release year',
      artwork: null,
    },
  ]);

  return (
    <div className="lg:pl-10 lg:pr-5 w-full">
      <div className="my-16 lg:my-20 max-w-6xl mx-auto flex flex-col w-full border-t lg:border border-border dark:border-opacity-10 lg:rounded-xl bg-card dark:bg-card-dark">
        <div className="flex-col-reverse gap-0 lg:gap-5 bg-gray-05 dark:gray-95 shadow-inner lg:rounded-xl lg:flex-row flex grow w-full mx-auto items-center">
          <div className="lg:-m-5 h-full shadow-xl lg:rounded-xl bg-wash dark:bg-gray-95 w-full flex grow flex-col border-t lg:border border-border dark:border-border-dark">
            <div className="w-full bg-card dark:bg-wash-dark lg:rounded-t-xl border-b border-border dark:border-border-dark">
              <h3 className="text-sm my-1 mx-5 text-tertiary dark:text-tertiary-dark select-none">
                AlbumList.js
              </h3>
            </div>
            <CodeBlock
              isFromPackageImport={false}
              noShadow={true}
              noMargin={true}>
              <div>{`function AlbumList({ albums }) {
  let heading = 'No Albums Yet';
  if (albums.length > 0) {
    heading = albums.length + ' Albums';
  }
  return (
    <section>
      <h2>{heading}</h2>
      {albums.map(album =>
        <Album key={album.id} album={album} />
      )}
    </section>
  );
}`}</div>
            </CodeBlock>
          </div>
          <div className="w-full p-5 flex grow justify-center">
            <ExamplePanel noShadow={false} noPadding={true} height={328}>
              <AlbumList albums={albums} />
            </ExamplePanel>
          </div>
        </div>
      </div>
    </div>
  );
}

function Example3() {
  const [artistPromise, setPostPromise] = useState(null);
  const [albumsPromise, setAlbumsPromise] = useState(null);
  const [albums, setAlbums] = useState([
    {
      id: 0,
      name: 'TODO',
      year: '2023',
      artwork: null,
    },
    {
      id: 1,
      name: 'TODO',
      year: '2020',
      artwork: null,
    },
    {
      id: 2,
      name: 'TODO',
      year: '2013',
      artwork: null,
    },
  ]);

  return (
    <div className="lg:pl-10 lg:pr-5 w-full">
      <div className="my-16 lg:my-20 max-w-6xl mx-auto flex flex-col w-full border-t lg:border border-border dark:border-opacity-10 lg:rounded-2xl bg-card dark:bg-card-dark">
        <div className="flex-col-reverse gap-0 lg:gap-5 lg:rounded-xl bg-gray-10 dark:bg-gray-70 shadow-inner lg:flex-row flex grow w-full mx-auto items-center">
          <div className="lg:-m-5 h-full shadow-xl lg:rounded-2xl bg-wash dark:bg-gray-95 w-full flex grow flex-col border-t lg:border border-border dark:border-border-dark">
            <div className="w-full bg-card dark:bg-wash-dark lg:rounded-t-2xl border-b border-border dark:border-border-dark">
              <h3 className="text-sm my-1 mx-5 text-tertiary dark:text-tertiary-dark select-none">
                routes/artists/(slug).js
              </h3>
            </div>
            <CodeBlock
              isFromPackageImport={false}
              noShadow={true}
              noMargin={true}>
              <div>{`async function ArtistPage({ slug }) {
  const artist = await db.findArtist({ slug });
  return (
    <main>
      <Cover background={artist.cover}>
        <h1>{artist.name}</h1>
      </Cover>
      <Suspense fallback={<LoadingDiscography />}>
        <Discography artistId={artist.id} />
      </Suspense>
    </main>
  );
}

async function Discography({ artistId }) {
  const albums = await db.findAlbums({ artistId });
  return <AlbumList albums={albums} />;
}`}</div>
            </CodeBlock>
          </div>
          <div className="w-full p-5 sm:p-5 flex grow justify-center">
            <BrowserChrome
              setPostPromise={setPostPromise}
              setAlbumsPromise={setAlbumsPromise}>
              <ExamplePanel noPadding={true} noShadow={true} height={475}>
                <Suspense fallback={null}>
                  <div style={{animation: 'fadein 200ms'}}>
                    <ArtistPage
                      artist={{
                        cover: 'https://i.imgur.com/Q7TJkPm.jpg',
                        name: 'TODO',
                        albums,
                      }}
                      artistPromise={artistPromise}
                      albumsPromise={albumsPromise}
                    />
                  </div>
                </Suspense>
              </ExamplePanel>
            </BrowserChrome>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExamplePanel({children, noPadding, noShadow, height}) {
  return (
    <div
      style={{
        padding: noPadding ? 0 : '20px',
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
        height,
      }}>
      {children}
    </div>
  );
}

function BrowserChrome({children, setPostPromise, setAlbumsPromise}) {
  function handleRestart() {
    const artistPromise = new Promise((resolve) => {
      setTimeout(() => {
        artistPromise._resolved = true;
        resolve();
      }, 200);
    });
    const albumsPromise = new Promise((resolve) => {
      setTimeout(() => {
        albumsPromise._resolved = true;
        resolve();
      }, 2200);
    });
    setPostPromise(artistPromise);
    setAlbumsPromise(albumsPromise);
  }

  return (
    <div className="bg-wash dark:bg-gray-95 shadow-xl relative overflow-hidden w-full border border-border dark:border-opacity-10 rounded-2xl">
      <div className="w-full h-16 border-b border-border backdrop-filter rounded-t-2xl overflow-hidden backdrop-blur-lg backdrop-saturate-200 bg-white bg-opacity-90 z-10 absolute top-0 py-4 px-4 gap-2 flex flex-row items-center">
        <div className="bg-gray-10 text-sm text-tertiary text-center rounded-full p-1 w-full flex-row flex space-between items-center">
          <div className="h-6 w-6" />
          <div className="w-full leading-snug">
            <span className="text-gray-30">example.com</span>
            /artists/todo
          </div>
          <button
            onClick={handleRestart}
            className="flex items-center p-1.5 rounded-full hover:bg-gray-20 hover:bg-opacity-50 cursor-pointer justify-center">
            <IconRestart className="text-primary text-lg" />
          </button>
        </div>
      </div>
      <div className="">{children}</div>
    </div>
  );
}

function ArtistPage({artist, artistPromise, albumsPromise}) {
  if (artistPromise && !artistPromise._resolved) {
    throw artistPromise;
  }
  return (
    <div style={{overflowY: 'scroll'}}>
      <Cover background={artist.cover}>
        <h1 className="text-xl text-primary-dark font-bold pl-2.5">
          {artist.name}
        </h1>
      </Cover>
      <Suspense fallback={<LoadingDiscography />}>
        <Discography artist={artist} albumsPromise={albumsPromise} />
      </Suspense>
    </div>
  );
}

function LoadingDiscography() {
  return (
    <div className="flex flex-col items-center h-[320px] overflow-hidden">
      <div className="w-full">
        <div className="relative overflow-hidden before:-skew-x-12 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.75s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent">
          <div className="space-y-3 space-x-5">
            <div className="pt-5 pl-5">
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

function Discography({artist, albumsPromise}) {
  if (albumsPromise && !albumsPromise._resolved) {
    throw albumsPromise;
  }

  return <AlbumList albums={artist.albums} />;
}

function AlbumList({albums, children}) {
  let headingText = 'No Albums Yet';
  if (albums.length > 0) {
    headingText = albums.length + ' Albums';
  }
  return (
    <div className="relative max-h-64 pt-5 pl-5 pr-5">
      <h2 className="font-bold text-xl text-primary pb-4 leading-snug">
        {headingText}
      </h2>
      <Stack gap={16}>
        {albums.map((album) => (
          <Album key={album.id} album={album} />
        ))}
        {children}
      </Stack>
    </div>
  );
}

function Cover({background, children}) {
  return (
    <div className="h-40 mt-16 overflow-hidden relative">
      <div className="absolute inset-0 p-3 flex items-end bg-gradient-to-t from-black/50 via-black/0">
        {children}
      </div>
      <img
        src={background}
        alt="Cover image"
        width="100%"
        style={{maxWidth: '100%'}}
      />
    </div>
  );
}

function Album({album}) {
  return (
    <Stack gap={8}>
      <Row gap={12}>
        <Artwork image={album.cover} />
        <Stack>
          <h2 className="text-md mt-2 mr-5 text-primary font-bold">
            {album.name}
          </h2>
          <p className="text-tertiary mb-1 text-base">{album.year}</p>
        </Stack>
        <SaveButton />
      </Row>
    </Stack>
  );
}

function Stack({children, gap}) {
  return (
    <div
      className={'flex flex-col flex-1'}
      style={{
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

function Row({children, gap}) {
  return (
    <div
      className="flex flex-row items-center"
      style={{
        gap,
      }}>
      {children}
    </div>
  );
}

function Artwork({image}) {
  return (
    <div
      className="h-24 w-24 rounded-xl flex items-center overflow-hidden justify-center align-middle text-gray-30 bg-card bg-cover"
      style={{
        backgroundImage: image ? `url(${image})` : null,
      }}>
      {image ? null : <ArtworkPlaceholder />}
    </div>
  );
}

function ArtworkPlaceholder() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M20.42,2.31a1.52,1.52,0,0,0-1.3-.26L8.12,5A1.52,1.52,0,0,0,7,6.41v8.15A3.91,3.91,0,0,0,5,14a4,4,0,1,0,4,4V10.87L19,8.31v3.25A3.91,3.91,0,0,0,17,11a4,4,0,1,0,4,4V3.5A1.5,1.5,0,0,0,20.42,2.31Z"
      />
    </svg>
  );
}

function SaveButton() {
  const [saved, setSaved] = useState(false);
  return (
    <button
      className="flex items-center justify-center w-12 h-12 cursor-pointer rounded-full text-tertiary hover:bg-card"
      aria-label={saved ? 'Unsave' : 'Save'}
      onClick={() => setSaved(!saved)}>
      {saved ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M20.5,2H3.5A1.5,1.5,0,0,0,2,3.5V21a1,1,0,0,0,.56.9,1,1,0,0,0,1-.11L12,15.27l8.39,6.52A1,1,0,0,0,21,22a1,1,0,0,0,.44-.1A1,1,0,0,0,22,21V3.5A1.5,1.5,0,0,0,20.5,2Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M21,22a1,1,0,0,1-.61-.21L12,15.27,3.61,21.79a1,1,0,0,1-1,.11A1,1,0,0,1,2,21V3.5A1.5,1.5,0,0,1,3.5,2h17A1.5,1.5,0,0,1,22,3.5V21a1,1,0,0,1-.56.9A1,1,0,0,1,21,22Zm-9-9a1,1,0,0,1,.61.21L20,19V4H4V19l7.39-5.75A1,1,0,0,1,12,13Z"
          />
        </svg>
      )}
    </button>
  );
}
