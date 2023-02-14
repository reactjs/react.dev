/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {
  createContext,
  useState,
  useContext,
  useId,
  Fragment,
  Suspense,
  useTransition,
} from 'react';
import cn from 'classnames';
import ButtonLink from '../ButtonLink';
import {IconRestart} from '../Icon/IconRestart';
import BlogCard from 'components/MDX/BlogCard';
import {IconChevron} from 'components/Icon/IconChevron';
import {IconSearch} from 'components/Icon/IconSearch';
import {Logo} from 'components/Logo';
import Link from 'components/MDX/Link';
import CodeBlock from 'components/MDX/CodeBlock';
import {IconNavArrow} from 'components/Icon/IconNavArrow';

export function HomeContent() {
  return (
    <>
      <div className="pl-0">
        <div className="mx-5 mt-12 mb-16 sm:mb-20 lg:mb-24 flex flex-col justify-center">
          <Logo className="mt-4 mb-3 text-link dark:text-link-dark w-24 lg:w-28 self-center" />
          <h1 className="text-5xl lg:text-6xl self-center flex font-bold leading-snug text-primary dark:text-primary-dark">
            React
          </h1>
          <p className="text-4xl max-w-lg md:max-w-full py-1 text-center text-secondary dark:text-primary-dark leading-snug self-center">
            The library for web and native user interfaces
          </p>
          <div className="mt-5 self-center flex gap-2 w-full sm:w-auto flex-col sm:flex-row">
            <ButtonLink
              href={'/learn'}
              type="primary"
              size="lg"
              className="w-full sm:w-auto justify-center"
              label="Learn React">
              Learn React
            </ButtonLink>
            <ButtonLink
              href={'/reference/react'}
              type="secondary"
              size="lg"
              className="w-full sm:w-auto justify-center"
              label="API Reference">
              API Reference
            </ButtonLink>
          </div>
        </div>

        <div className="mx-auto bg-card dark:bg-card-dark shadow-inner flex flex-col w-full">
          <div className="flex-col gap-2 flex grow w-full my-12 sm:my-16 lg:my-20 mx-auto items-center">
            <div className="px-5 lg:px-0 max-w-4xl lg:text-center text-white text-opacity-80">
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
            <div className="px-5 lg:px-0 max-w-4xl lg:text-center text-white text-opacity-80">
              <p className="text-xl lg:text-2xl text-secondary dark:text-secondary-dark leading-normal">
                Whether you work on your own or with thousands of other
                developers, using React feels the same. It is designed to let
                you seamlessly combine components written by independent people,
                teams, and organizations.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col w-full">
          <div className="flex-col gap-2 flex grow w-full my-12 sm:my-16 lg:my-20 mx-auto items-center">
            <div className="px-5 lg:px-0 max-w-4xl lg:text-center text-opacity-80">
              <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-4xl lg:text-5xl mb-6">
                Write components with code and markup
              </h3>
              <p className="text-xl lg:text-2xl leading-normal">
                React components are JavaScript functions. Want to show
                something conditionally? Use an <Code>if</Code> statement. Need
                to display a list? Use a <Code>for</Code> loop or array{' '}
                <Code>map()</Code>. Learning React is learning programming.
              </p>
            </div>
            <div className="max-w-6xl mx-auto flex flex-col w-full">
              <Example2 />
            </div>
            <div className="px-5 lg:px-0 max-w-4xl lg:text-center text-opacity-80">
              <p className="text-xl lg:text-2xl leading-normal">
                This markup syntax is called JSX. It is a JavaScript syntax
                extension popularized by React. Putting JSX markup close to
                related rendering logic makes React components easy to create,
                maintain, and delete.
              </p>
            </div>
          </div>
        </div>

        <div className="shadow-inner bg-card dark:bg-card-dark">
          <div className="max-w-6xl mx-auto flex flex-col w-full">
            <div className="flex-col gap-2 flex grow w-full my-12 sm:my-16 lg:my-20 mx-auto items-center">
              <div className="px-5 lg:px-0 max-w-4xl lg:text-center text-opacity-80">
                <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-4xl lg:text-5xl mb-6">
                  Add interactivity anywhere
                </h3>
                <p className="text-xl lg:text-2xl leading-normal text-secondary dark:text-secondary-dark">
                  Each React component receives some data and returns what
                  should appear on the screen. You can update that data in
                  response to an interaction, for example when typing into an
                  input. React will update the screen to match the new data.
                </p>
              </div>
              <div className="max-w-6xl mx-auto flex flex-col w-full">
                <Example3 />
              </div>
              <div className="px-5 lg:px-0 max-w-4xl lg:text-center text-opacity-80">
                <p className="text-xl lg:text-2xl leading-normal">
                  You don’t have to build your whole page in React. Add the
                  React <Code>{'<script>'}</Code> tag to your HTML page, and
                  render interactive React components anywhere on it.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col w-full">
          <div className="flex-col gap-2 flex grow w-full my-12 sm:my-16 lg:my-20 mx-auto items-center">
            <div className="px-5 lg:px-0 max-w-4xl lg:text-center text-opacity-80">
              <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-4xl lg:text-5xl mb-6">
                Go full-stack with a framework
              </h3>
              <p className="text-xl lg:text-2xl text-secondary dark:text-secondary-dark leading-normal">
                React is a library. It lets you put components together, but it
                doesn’t prescribe how to do routing and data fetching. To build
                an entire app with React, we recommend a full-stack React
                framework like{' '}
                <Link href="https://github.com/vercel/next.js">Next.js</Link>,{' '}
                <Link href="https://github.com/gatsbyjs/gatsby/">Gatsby</Link>,
                and <Link href="https://github.com/remix-run/remix">Remix</Link>
                .
              </p>
            </div>
            <div className="max-w-6xl mx-auto flex flex-col w-full">
              <Example4 />
            </div>
            <div className="px-5 lg:px-0 max-w-4xl lg:text-center text-secondary dark:text-secondary-dark">
              <p className="text-xl lg:text-2xl text-secondary dark:text-secondary-dark leading-normal">
                To frameworks, React is more than a library—React is an
                architecture. React provides a unified asynchronous component
                model across the entire stack so that you can use both client{' '}
                <i>and</i> server for what they do best.
              </p>
            </div>
          </div>
        </div>

        <div className="shadow-inner bg-card dark:bg-card-dark">
          <div className="max-w-4xl lg:max-w-7xl mx-auto flex flex-col w-full">
            <div className="flex-col gap-2 flex grow w-full my-12 sm:my-16 lg:my-20 mx-auto items-center">
              <div className="mx-5 max-w-4xl lg:text-center text-opacity-80">
                <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-4xl lg:text-5xl mb-6">
                  Use the best from every platform
                </h3>
                <p className="text-xl lg:text-2xl text-secondary dark:text-secondary-dark leading-normal">
                  People love web and native apps for different reasons. React
                  lets you build both web apps and native apps in the same
                  paradigm. It uses each platform’s unique strengths to let your
                  user interfaces feel just right on every platform.
                </p>
              </div>
              <div className="max-w-7xl flex flex-col lg:flex-row my-12 sm:my-16 lg:my-20 mx-5 lg:mx-10 gap-5 lg:gap-5">
                <div className="shadow-inner bg-secondary-button dark:bg-secondary-button-dark rounded-2xl p-6 xs:p-10 lg:w-6/12 max-w-4xl lg:text-center lg:items-center lg:justify-center flex flex-col text-opacity-80">
                  <WebIcons />
                  <h4 className="leading-tight dark:text-primary-dark text-primary font-bold text-3xl lg:text-4xl mb-4 lg:mb-6">
                    Stay true to the web
                  </h4>
                  <p className="h-full lg:text-xl leading-normal text-secondary dark:text-secondary-dark">
                    People expect web app pages to load fast. On the server,
                    React lets you start streaming HTML while you’re still
                    fetching data, progressivelly filling in the remaining
                    content before any JavaScript code loads. On the client,
                    React can use standard web APIs to keep UI responsive even
                    in the middle of rendering.
                  </p>
                </div>
                <div className="shadow-inner bg-secondary-button dark:bg-secondary-button-dark rounded-2xl p-6 xs:p-10 lg:w-6/12 max-w-4xl lg:text-center lg:items-center lg:justify-center text-opacity-80 flex flex-col">
                  <NativeIcons />
                  <h4 className="leading-tight dark:text-primary-dark text-primary font-bold text-3xl lg:text-4xl mb-4 lg:mb-6">
                    Go truly native, too
                  </h4>
                  <p className="h-full lg:text-xl text-secondary dark:text-secondary-dark leading-normal">
                    People expect native apps to look and feel native.{' '}
                    <Link href="https://reactnative.dev">React Native</Link> and{' '}
                    <Link href="https://github.com/expo/expo">Expo</Link> let
                    you build apps in React for Android, iOS, and more. These
                    apps can look and feel native because their user interfaces{' '}
                    <i>are</i> truly native. It’s not a web view—your React
                    components render real Android and iOS views provided by the
                    platform.
                  </p>
                </div>
              </div>
              <div className="px-5 lg:px-0 max-w-4xl lg:text-center text-secondary dark:text-secondary-dark">
                <p className="text-xl lg:text-2xl text-secondary dark:text-secondary-dark leading-normal">
                  With React, you can be a web <i>and</i> a native developer.
                  Your team can ship to many platforms without sacrificing the
                  user experience. Your organization can bridge the platform
                  silos, and form teams that own entire features end-to-end.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col w-full">
          <div className="flex-col gap-2 flex grow w-full my-12 sm:my-16 lg:my-20 mx-auto items-center">
            <div className="px-5 lg:px-0 max-w-4xl lg:text-center text-opacity-80">
              <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-4xl lg:text-5xl mb-6">
                Evolve with the proven approaches
              </h3>
              <p className="text-xl lg:text-2xl text-secondary dark:text-secondary-dark leading-normal">
                React approaches changes with care. Every React commit is tested
                on business-critical surfaces with over a billion users. Over
                100,000 React components in the Meta codebase help validate
                every migration strategy.
              </p>

              <p className="py-8 text-xl lg:text-2xl leading-normal text-secondary dark:text-secondary-dark">
                TODO
              </p>

              <p className="text-xl lg:text-2xl text-secondary dark:text-secondary-dark leading-normal">
                The React team is always researching how to improve React. Some
                of these research projects take years to realize. React has a
                high bar for taking an idea from research to production. Only
                proven approaches become part of React.
              </p>

              {/*<p className="min-h-[500px] text-xl lg:text-2xl leading-normal text-secondary dark:text-secondary-dark">
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
                  </ButtonLink></p>*/}
            </div>
          </div>
        </div>
        {/*<div className="overflow-hidden relative px-5">
          <div className="border-2 border-link dark:border-link-dark rounded-lg absolute h-full left-1/2"></div>
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
        </div>*/}
        <div className="bg-wash dark:bg-wash-dark max-w-4xl lg:max-w-7xl mx-auto w-full flex items-center flex-col px-5">
          <div className="h-px max-w-4xl w-full flex grow bg-border dark:bg-border-dark" />
          <div className="max-w-4xl lg:max-w-7xl mx-auto flex flex-col w-full lg:px-5">
            <div className="flex-col gap-2 flex grow w-full my-12 sm:my-16 lg:my-20 mx-auto items-center">
              <div className="w-full lg:text-center text-opacity-80">
                <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-4xl lg:text-5xl mb-8">
                  Blog
                </h3>
                <div className="mx-auto flex-col lg:flex-row gap-5 flex grow w-full items-start text-left">
                  <BlogCard
                    title="React Labs: What We've Been Working On – June 2022"
                    date="June 15, 2022"
                    url="/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022"></BlogCard>
                  <BlogCard
                    title="React v18.0"
                    date="March 29, 2022"
                    url="/blog/2022/03/29/react-v18"></BlogCard>
                  <BlogCard
                    title="How to Upgrade to React 18"
                    date="March 8, 2022"
                    url="/blog/2022/03/08/react-18-upgrade-guide"></BlogCard>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="shadow-inner bg-card dark:bg-card-dark">
            <div className="mx-auto flex flex-col max-w-4xl">
              <div className="flex-row gap-2 flex gap-10 grow w-full mt-12 sm:mt-16 lg:mt-20 mx-auto items-center">
                <div className="px-5 lg:px-0 max-w-4xl lg:text-center text-opacity-80">
                  <h3 className="leading-tight dark:text-primary-dark text-primary font-bold text-4xl lg:text-5xl mb-6">
                    Join a community of millions
                  </h3>
                  <p className="text-xl lg:text-xl leading-normal text-secondary dark:text-secondary-dark">
                    You&apos;re not alone. Two million developers visit the
                    React site every month and the React Developer Tools
                    extension has over three million weekly active users. React
                    is something that people and teams can agree on.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative flex overflow-x-hidden w-auto">
              <div className="w-full py-12 animate-marquee whitespace-nowrap flex flex-row">
                <CommunityImages />
              </div>
              <div className="w-full absolute left-0 right-0 top-0 py-12 animate-marquee2 whitespace-nowrap flex flex-row">
                <CommunityImages />
              </div>
            </div>
            <div className="mx-auto flex flex-col max-w-4xl">
              <div className="flex-row gap-2 flex gap-10 grow w-full mb-12 sm:mb-16 lg:mb-20 mx-auto items-center">
                <div className="px-5 lg:px-0 max-w-4xl lg:text-center text-opacity-80">
                  <p className="text-xl lg:text-xl leading-normal text-secondary dark:text-secondary-dark">
                    If you&apos;re debugging an obscure problem, chances are,
                    somebody has already run into it before and shared a
                    solution. React also has a vibrant ecosystem. Whether you
                    need a table, a chart, a fully accessible datepicker, a
                    production-grade data fetching strategy, or a 3D rendering
                    engine, chances are you&apos;ll find what you need.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col w-full">
          <div className="flex-col gap-2 flex grow w-full my-12 sm:my-16 lg:my-20 mx-auto items-center">
            <div className="px-5 lg:px-0 mb-6 max-w-4xl text-center text-opacity-80">
              <Logo className="text-link dark:text-link-dark w-24 sm:w-28 lg:w-32  mt-12 h-auto mx-auto self-start" />
              <h3 className="mt-4 mb-8 leading-tight dark:text-primary-dark text-primary font-bold text-4xl lg:text-5xl">
                Welcome to the React community!
              </h3>
              <ButtonLink
                href={'/learn'}
                type="primary"
                size="lg"
                label="Take the Tutorial">
                Get Started
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function CommunityImages() {
  return (
    <>
      <div className="flex justify-center px-2.5 lg:px-5 w-6/12 lg:w-3/12">
        <img
          src="https://i.imgur.com/zBJvLHG.jpg"
          className="aspect-video rotate-2 transition-all hover:rotate-0"
        />
      </div>
      <div className="flex justify-center px-2.5 lg:px-5 w-6/12 lg:w-3/12">
        <img
          src="https://i.imgur.com/zBJvLHG.jpg"
          className="aspect-video rotate-[-2deg] transition-all hover:rotate-0"
        />
      </div>

      <div className="flex justify-center px-2.5 lg:px-5 w-6/12 lg:w-3/12">
        <img
          src="https://i.imgur.com/zBJvLHG.jpg"
          className="aspect-video rotate-2 transition-all hover:rotate-0"
        />
      </div>

      <div className="flex justify-center px-2.5 lg:px-5 w-6/12 lg:w-3/12">
        <img
          src="https://i.imgur.com/zBJvLHG.jpg"
          className="aspect-video rotate-[-2deg] transition-all hover:rotate-0"
        />
      </div>
    </>
  );
}

function Example1() {
  return (
    <div className="lg:pl-10 lg:pr-5 w-full">
      <div className="my-12 sm:my-16 lg:my-20 max-w-6xl mx-auto flex flex-col w-full lg:rounded-2xl bg-card dark:bg-card-dark">
        <div className="flex-col gap-0 lg:gap-5 lg:rounded-2xl bg-gray-10 dark:bg-gray-70 shadow-inner lg:flex-row flex grow w-full mx-auto items-center">
          <div className="lg:-m-5 h-full shadow-nav dark:shadow-nav-dark lg:rounded-2xl bg-wash dark:bg-gray-95 w-full flex grow flex-col">
            <div className="w-full bg-card dark:bg-wash-dark lg:rounded-t-2xl border-b border-black/5 dark:border-white/5">
              <h3 className="text-sm my-1 mx-5 text-tertiary dark:text-tertiary-dark select-none">
                VideoRow.js
              </h3>
            </div>
            <CodeBlock
              isFromPackageImport={false}
              noShadow={true}
              noMargin={true}>
              <div>{`function VideoRow({ video }) {
  return (
    <div>
      <VideoThumbnail video={video} />
      <a href={video.url}>
        <h3>{video.title}</h3>
        <p>{video.description}</p>
      </a>
      <LikeButton video={video} />
    </div>
  );
}
          `}</div>
            </CodeBlock>
          </div>
          <div className="w-full p-2.5 xs:p-5 lg:p-10 flex grow justify-center">
            <ExamplePanel>
              <VideoRow
                video={{
                  title: 'My video',
                  description: 'Video description',
                  image: 'blue',
                  url: null,
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
  const videos = [
    {
      id: 0,
      title: 'First video',
      description: 'Video description',
      image: 'blue',
    },
    {
      id: 1,
      title: 'Second video',
      description: 'Video description',
      image: 'red',
    },
    {
      id: 2,
      title: 'Third video',
      description: 'Video description',
      image: 'green',
    },
  ];

  return (
    <div className="lg:pl-10 lg:pr-5 w-full">
      <div className="my-12 sm:my-16 lg:my-20 max-w-6xl mx-auto flex flex-col w-full lg:rounded-2xl bg-card dark:bg-card-dark">
        <div className="flex-col gap-0 lg:gap-5 lg:rounded-2xl bg-gray-10 dark:bg-gray-70 shadow-inner lg:flex-row flex grow w-full mx-auto items-center">
          <div className="lg:-m-5 h-full shadow-nav dark:shadow-nav-dark lg:rounded-2xl bg-wash dark:bg-gray-95 w-full flex grow flex-col">
            <div className="w-full bg-card dark:bg-wash-dark lg:rounded-t-2xl border-b border-black/5 dark:border-white/5">
              <h3 className="text-sm my-1 mx-5 text-tertiary dark:text-tertiary-dark select-none">
                VideoList.js
              </h3>
            </div>
            <CodeBlock
              isFromPackageImport={false}
              noShadow={true}
              noMargin={true}>
              <div>{`function VideoList({ videos, emptyHeading }) {
  const count = videos.length;
  let heading = emptyHeading;
  if (count > 0) {
    const noun = count > 1 ? 'Videos' : 'Video';
    heading = count + ' ' + noun;
  }
  return (
    <section>
      <h2>{heading}</h2>
      {videos.map(video =>
        <VideoRow key={video.id} video={video} />
      )}
    </section>
  );
}`}</div>
            </CodeBlock>
          </div>
          <div className="lg:-my-20 w-full p-2.5 xs:p-5 lg:p-10 flex grow justify-center">
            <ExamplePanel noShadow={false} noPadding={true}>
              <VideoList videos={videos} />
            </ExamplePanel>
          </div>
        </div>
      </div>
    </div>
  );
}

function Example3() {
  const videos = [
    {
      id: 0,
      title: 'React: The Documentary',
      description: 'The origin story of React (2023)',
      image: 'https://i.imgur.com/F5SIYH7.jpg',
      url: 'https://www.youtube.com/watch?v=8pDqJVdNa44',
    },
    {
      id: 1,
      title: 'Introducing Server Components',
      description: 'Dan Abramov and Lauren Tan (2020)',
      image: 'https://i.imgur.com/SK8Smd8.jpg',
      url: 'https://www.youtube.com/watch?v=TQQPAU21ZUw',
    },
    {
      id: 2,
      title: 'Introducing React Hooks',
      description: 'Sophie Alpert and Dan Abramov (2018)',
      image: 'https://i.imgur.com/LgqfWd4.jpg',
      url: 'https://www.youtube.com/watch?v=V-QO-KO90iQ',
    },
    {
      id: 3,
      title: 'Introducing React Native',
      description: 'Tom Occhino (2015)',
      image: 'https://i.imgur.com/suhZaIj.jpg',
      url: 'https://www.youtube.com/watch?v=KVZ-P-ZI6W4',
    },
    {
      id: 4,
      title: 'Rethinking Best Practices',
      description: 'Pete Hunt (2013)',
      image: 'https://i.imgur.com/Zmcmt2E.jpg',
      url: 'https://www.youtube.com/watch?v=x7cQ3mrcKaY',
    },
  ];

  return (
    <div className="lg:pl-10 lg:pr-5 w-full">
      <div className="my-12 sm:my-16 lg:my-20 max-w-6xl mx-auto flex flex-col w-full lg:rounded-2xl bg-card dark:bg-card-dark">
        <div className="flex-col gap-0 lg:gap-5 lg:rounded-2xl bg-gray-10 dark:bg-gray-70 shadow-inner lg:flex-row flex grow w-full mx-auto items-center">
          <div className="lg:-m-5 h-full shadow-nav dark:shadow-nav-dark lg:rounded-2xl bg-wash dark:bg-gray-95 w-full flex grow flex-col">
            <div className="w-full bg-card dark:bg-wash-dark lg:rounded-t-2xl border-b border-black/5 dark:border-white/5">
              <h3 className="text-sm my-1 mx-5 text-tertiary dark:text-tertiary-dark select-none">
                SearchableVideoList.js
              </h3>
            </div>
            <CodeBlock
              isFromPackageImport={false}
              noShadow={true}
              noMargin={true}>
              <div>{`import { useState } from 'react';

function SearchableVideoList({ videos }) {
  const [searchText, setSearchText] = useState('');
  const foundVideos = filterVideos(videos, searchText);
  return (
    <>
      <SearchInput
        value={searchText}
        onChange={newText => setSearchText(newText)} />
      <VideoList
        videos={foundVideos}
        emptyHeading={\`No matches for "\${searchText}"\`} />
    </>
  );
}`}</div>
            </CodeBlock>
          </div>
          <div className="lg:-my-20 w-full p-2.5 xs:p-5 lg:p-10 flex grow justify-center">
            <BrowserChrome domain="example.com" path={'videos.html'}>
              <ExamplePanel noShadow={false} noPadding={true} height="30rem">
                <h1 className="mt-20 mx-4 mb-1 font-bold text-3xl text-primary">
                  React Videos
                </h1>
                <p className="mx-4 mb-0 leading-snug text-secondary text-xl">
                  A brief history of React
                </p>
                <SearchableVideoList videos={videos} />
              </ExamplePanel>
            </BrowserChrome>
          </div>
        </div>
      </div>
    </div>
  );
}

function Example4() {
  const [slug, setSlug] = useState('react-conf-2021');
  return (
    <div className="lg:pl-10 lg:pr-5 w-full">
      <div className="my-12 sm:my-16 lg:my-20 max-w-6xl mx-auto flex flex-col w-full lg:rounded-2xl bg-card dark:bg-card-dark">
        <div className="flex-col gap-0 lg:gap-5 lg:rounded-2xl bg-gray-10 dark:bg-gray-70 shadow-inner lg:flex-row flex grow w-full mx-auto items-center">
          <div className="lg:-m-5 h-full shadow-nav dark:shadow-nav-dark lg:rounded-2xl bg-wash dark:bg-gray-95 w-full flex grow flex-col">
            <div className="w-full bg-card dark:bg-wash-dark lg:rounded-t-2xl border-b border-black/5 dark:border-white/5">
              <h3 className="text-sm my-1 mx-5 text-tertiary dark:text-tertiary-dark select-none">
                confs/[slug].js
              </h3>
            </div>
            <CodeBlock
              isFromPackageImport={false}
              noShadow={true}
              noMargin={true}>
              <div>{`import { db } from './database.js';
import { Suspense } from 'react';

async function ConferencePage({ slug }) {
  const conf = await db.Confs.find({ slug });
  return (
    <ConferenceLayout conf={conf}>
      <Suspense fallback={<TalksLoading />}>
        <Talks confId={conf.id} />
      </Suspense>
    </ConferenceLayout>
  );
}

async function Talks({ confId }) {
  const talks = await db.Talks.findAll({ confId });
  const videos = talks.map(talk => talk.video);
  return <SearchableVideoList videos={videos} />;
}`}</div>
            </CodeBlock>
          </div>
          <div className="lg:-my-20 w-full p-2.5 xs:p-5 lg:p-10 flex grow justify-center">
            <NavContext.Provider value={{slug, setSlug}}>
              <BrowserChrome
                domain="example.com"
                path={'confs/' + slug}
                hasRefresh={true}>
                <ExamplePanel noPadding={true} noShadow={true} height="35rem">
                  <Suspense fallback={null}>
                    <div style={{animation: 'fadein 200ms'}}>
                      <ConferencePage slug={slug} />
                    </div>
                  </Suspense>
                </ExamplePanel>
              </BrowserChrome>
            </NavContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExamplePanel({children, noPadding, noShadow, height}) {
  return (
    <div
      className={cn(
        'rounded-2xl mx-auto text-secondary leading-normal bg-white overflow-hidden w-full overflow-y-scroll',
        noPadding ? 'p-0' : 'p-4 pr-2',
        noShadow ? 'shadow-none' : 'shadow-nav dark:shadow-nav-dark'
      )}
      style={{height}}>
      {children}
    </div>
  );
}

const NavContext = createContext(null);

function BrowserChrome({children, hasRefresh, domain, path}) {
  const [restartId, setRestartId] = useState(0);

  function handleRestart() {
    confCache = new Map();
    talksCache = new Map();
    setRestartId((i) => i + 1);
  }

  return (
    <div className="bg-wash dark:bg-gray-95 shadow-nav dark:shadow-nav-dark relative overflow-hidden w-full dark:border-opacity-10 rounded-2xl">
      <div className="w-full h-16 rounded-t-2xl shadow-md backdrop-filter overflow-hidden backdrop-blur-lg backdrop-saturate-200 bg-white bg-opacity-90 z-10 absolute top-0 py-4 px-4 gap-2 flex flex-row items-center">
        <div className="relative bg-gray-10 text-sm text-tertiary text-center rounded-full p-1 w-full flex-row flex space-between items-center">
          <div className="h-6 w-6" />
          <div className="w-full leading-snug">
            <span className="text-gray-30">{domain}/</span>
            {path}
          </div>
          {hasRefresh && (
            <div
              className={
                'bg-card rounded-full flex justify-center items-center ' +
                (restartId > 0 ? '' : 'animation-pulse')
              }>
              <button
                onClick={handleRestart}
                className="flex items-center p-1.5 rounded-full hover:bg-gray-20 hover:bg-opacity-50 cursor-pointer justify-center">
                <IconRestart className="text-primary text-lg" />
              </button>
            </div>
          )}
        </div>
        {restartId > 0 && (
          <div
            key={restartId}
            className="z-10 loading h-0.5 bg-link transition-all duration-200 absolute bottom-0 left-0"
            style={{
              animation: `progressbar ${loadTalksDelay + 100}ms ease-in-out`,
            }}
          />
        )}
      </div>
      <div key={restartId}>{children}</div>
    </div>
  );
}

function ConferencePage({slug}) {
  const conf = use(fetchConf(slug));
  return (
    <ConferenceLayout conf={conf}>
      <Suspense fallback={<TalksLoading />}>
        <Talks confId={conf.id} />
      </Suspense>
    </ConferenceLayout>
  );
}

function TalksLoading() {
  return (
    <div className="flex flex-col items-center h-[24rem] overflow-hidden">
      <div className="w-full">
        <div className="relative overflow-hidden before:-skew-x-12 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent">
          <div className="space-y-4 space-x-4">
            <div className="pt-4 pb-1 pl-4 pr-4">
              <div className="h-10 w-full rounded-full bg-gray-10"></div>
            </div>
            <div className="pb-1">
              <div className="h-5 w-20 rounded-lg bg-gray-10"></div>
            </div>
            <div className="flex flex-row items-center gap-3">
              <div className="aspect-video w-32 xs:w-36 rounded-lg bg-gray-10"></div>
              <div className="flex flex-col gap-2">
                <div className="h-3 w-40 rounded-lg bg-gray-10"></div>
                <div className="h-3 w-32 rounded-lg bg-gray-10"></div>
                <div className="h-3 w-24 rounded-lg bg-gray-10"></div>
              </div>
            </div>
            <div className="flex flex-row items-center gap-3">
              <div className="aspect-video w-32 xs:w-36 rounded-lg bg-gray-10"></div>
              <div className="flex flex-col gap-2">
                <div className="h-3 w-40 rounded-lg bg-gray-10"></div>
                <div className="h-3 w-32 rounded-lg bg-gray-10"></div>
                <div className="h-3 w-24 rounded-lg bg-gray-10"></div>
              </div>
            </div>
            <div className="flex flex-row items-center gap-3">
              <div className="aspect-video w-32 xs:w-36 rounded-lg bg-gray-10"></div>
              <div className="flex flex-col gap-2">
                <div className="h-3 w-40 rounded-lg bg-gray-10"></div>
                <div className="h-3 w-32 rounded-lg bg-gray-10"></div>
                <div className="h-3 w-24 rounded-lg bg-gray-10"></div>
              </div>
            </div>
            <div className="flex flex-row items-center gap-3">
              <div className="aspect-video w-32 xs:w-36 rounded-lg bg-gray-10"></div>
              <div className="flex flex-col gap-2">
                <div className="h-3 w-40 rounded-lg bg-gray-10"></div>
                <div className="h-3 w-32 rounded-lg bg-gray-10"></div>
                <div className="h-3 w-24 rounded-lg bg-gray-10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Talks({confId}) {
  const videos = use(fetchTalks(confId));
  return <SearchableVideoList videos={videos} />;
}

function SearchableVideoList({videos}) {
  const [searchText, setSearchText] = useState('');
  const foundVideos = filterVideos(videos, searchText);
  return (
    <>
      <SearchInput value={searchText} onChange={setSearchText} />
      <VideoList
        videos={foundVideos}
        emptyHeading={`No matches for "${searchText}"`}
      />
    </>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(' ')
    .filter((s) => s !== '');
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + ' ' + video.description)
      .toLowerCase()
      .split(' ');
    return keywords.every((kw) => words.some((w) => w.startsWith(kw)));
  });
}

function VideoList({videos, emptyHeading}) {
  let heading = emptyHeading;
  const count = videos.length;
  if (count > 0) {
    heading = count + ' Video';
    if (count > 1) heading += 's';
  }
  return (
    <div className="relative p-4">
      <h2 className="font-bold text-xl text-primary pb-4 leading-snug">
        {heading}
      </h2>
      <div className="flex flex-col gap-4">
        {videos.map((video) => (
          <VideoRow key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}

function SearchInput({value, onChange}) {
  const id = useId();
  return (
    <form className="mx-4 mt-4">
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <IconSearch className="text-gray-30 w-4" />
        </div>
        <input
          type="text"
          id={id}
          className="flex pl-11 py-4 h-10 w-full bg-secondary-button outline-none betterhover:hover:bg-opacity-80 pointer items-center text-left text-primary rounded-full align-middle text-base"
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function ConferenceLayout({conf, children}) {
  const {slug, setSlug} = useContext(NavContext);
  const [isPending, startTransition] = useTransition();
  return (
    <div
      className={cn(
        'transition-opacity delay-100',
        isPending ? 'opacity-90' : 'opacity-100 overflow-y-scroll'
      )}>
      <Cover background={conf.cover}>
        <select
          defaultValue={slug}
          onChange={(e) => {
            startTransition(() => {
              setSlug(e.target.value);
            });
          }}
          className="appearance-none pr-8 bg-transparent text-primary-dark text-2xl font-bold mb-0.5"
          style={{
            backgroundSize: '4px 4px, 4px 4px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition:
              'calc(100% - 20px) calc(1px + 50%),calc(100% - 16px) calc(1px + 50%)',
            backgroundImage:
              'linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%)',
          }}>
          <option value="react-conf-2021">React Conf 2021</option>
          <option value="react-conf-2019">React Conf 2019</option>
        </select>
      </Cover>
      <Fragment key={conf.id}>{children}</Fragment>
    </div>
  );
}

function Cover({background, children}) {
  return (
    <div className="h-40 mt-16 overflow-hidden relative items-center flex">
      <div className="absolute inset-0 px-4 py-2 flex items-end bg-gradient-to-t from-black/40 via-black/0">
        {children}
      </div>
      <img src={background} alt="" className="w-full object-cover" />
    </div>
  );
}

function VideoRow({video}) {
  return (
    <div className="flex flex-row items-center gap-3">
      <VideoThumbnail video={video} />
      <a
        href={video.url}
        target="_blank"
        rel="noreferrer"
        className="group flex flex-col flex-1 gap-0.5">
        <h2
          className={cn(
            'text-base leading-tight text-primary font-bold',
            video.url && 'group-hover:underline'
          )}>
          {video.title}
        </h2>
        <p className="text-tertiary text-sm leading-snug">
          {video.description}
        </p>
      </a>
      <LikeButton />
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

function VideoThumbnail({video}) {
  const {image} = video;
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'aspect-video w-32 xs:w-36 select-none flex-col shadow-inner-border rounded-lg flex items-center overflow-hidden justify-center align-middle text-white/50 bg-cover bg-white bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))]',
        image === 'blue' && 'from-yellow-50 via-blue-50 to-purple-60',
        image === 'red' && 'from-yellow-50 via-red-50 to-purple-60',
        image === 'green' && 'from-yellow-50 via-green-50 to-purple-60',
        image === 'purple' && 'from-yellow-50 via-purple-50 to-purple-60',
        typeof image === 'object' && 'from-gray-80 via-gray-95 to-gray-70',
        video.url && 'hover:opacity-95 transition-opacity'
      )}
      style={{
        backgroundImage:
          typeof image === 'string' && image.startsWith('http')
            ? 'url(' + image + ')'
            : null,
      }}>
      {typeof image !== 'string' ? (
        <>
          <div className="transition-opacity mt-2.5 -space-x-2 flex flex-row w-full justify-center">
            {image.speakers.map((src, i) => (
              <img
                key={i}
                className="h-8 w-8 border-2 shadow-md border-gray-70 object-cover rounded-full"
                src={src}
                alt=""
              />
            ))}
          </div>
          <div className="mt-1">
            <span className="inline-flex text-xs font-normal items-center text-primary-dark py-1 whitespace-nowrap outline-link px-1.5 rounded-lg">
              <Logo className="text-xs mr-1 w-4 h-4 text-link-dark" />
              React Conf
            </span>
          </div>
        </>
      ) : image.startsWith('http') ? null : (
        <ThumbnailPlaceholder />
      )}
    </a>
  );
}

function ThumbnailPlaceholder() {
  return (
    <svg
      className="drop-shadow-xl"
      width="36"
      height="36"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36 69C54.2254 69 69 54.2254 69 36C69 17.7746 54.2254 3 36 3C17.7746 3 3 17.7746 3 36C3 54.2254 17.7746 69 36 69ZM52.1716 38.6337L28.4366 51.5801C26.4374 52.6705 24 51.2235 24 48.9464V23.0536C24 20.7764 26.4374 19.3295 28.4366 20.4199L52.1716 33.3663C54.2562 34.5034 54.2562 37.4966 52.1716 38.6337Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LikeButton() {
  const [saved, setSaved] = useState(false);
  return (
    <button
      className={cn(
        'flex items-center justify-center w-10 h-10 cursor-pointer rounded-full text-tertiary hover:bg-card',
        saved && 'text-red-50'
      )}
      aria-label={saved ? 'Unsave' : 'Save'}
      onClick={() => setSaved(!saved)}>
      {saved ? (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
}

function NativeIcons() {
  return (
    <div className="flex lg:items-center lg:justify-center gap-5 mb-5 lg:mb-8">
      <svg
        className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl shadow-2xl bg-wash"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M89.9356 44.0658C89.4752 44.4231 81.3451 49.0042 81.3451 59.1906C81.3451 70.9729 91.6903 75.1411 91.9999 75.2443C91.9523 75.4984 90.3564 80.9529 86.5455 86.5105C83.1474 91.4013 79.5984 96.2841 74.1995 96.2841C68.8006 96.2841 67.4112 93.148 61.1787 93.148C55.105 93.148 52.9454 96.3873 48.007 96.3873C43.0686 96.3873 39.6229 91.8618 35.6611 86.3041C31.072 79.7778 27.3643 69.639 27.3643 60.0163C27.3643 44.5819 37.3998 36.3963 47.2766 36.3963C52.5246 36.3963 56.8993 39.842 60.1942 39.842C63.3303 39.842 68.221 36.1898 74.1916 36.1898C76.4543 36.1898 84.5844 36.3963 89.9356 44.0658ZM71.3572 29.6556C73.8264 26.7259 75.573 22.6609 75.573 18.5958C75.573 18.0321 75.5254 17.4605 75.4222 17C71.4048 17.1509 66.6252 19.6756 63.7432 23.0182C61.4804 25.5906 59.3685 29.6556 59.3685 33.7762C59.3685 34.3955 59.4717 35.0148 59.5193 35.2133C59.7734 35.2609 60.1863 35.3165 60.5991 35.3165C64.2036 35.3165 68.7371 32.9029 71.3572 29.6556Z"
          fill="black"
        />
      </svg>

      <svg
        className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl shadow-2xl bg-wash"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M22.1378 84.6843C19.1119 84.6843 16 87.1151 16 91.363C16 95.259 18.7358 98 22.1378 98C24.9457 98 26.1963 96.1105 26.1963 96.1105V96.9286C26.2071 97.1436 26.2971 97.3469 26.4489 97.4991C26.6008 97.6513 26.8036 97.7416 27.018 97.7523H29.0473V84.9626H26.1963V86.5864C26.1963 86.5864 24.9346 84.6843 22.1378 84.6843ZM22.6458 87.3002C25.1359 87.3002 26.4434 89.4958 26.4434 91.3686C26.4434 93.4557 24.8916 95.4371 22.65 95.4371C20.7775 95.4371 18.9023 93.9163 18.9023 91.3422C18.9009 89.0102 20.5152 87.2932 22.6458 87.2932V87.3002Z"
          fill="black"
        />
        <path
          d="M33.01 97.7636C32.9013 97.7667 32.793 97.7475 32.692 97.7072C32.5909 97.6669 32.4991 97.6063 32.4222 97.5292C32.3452 97.4521 32.2848 97.3601 32.2446 97.2587C32.2044 97.1574 32.1852 97.0489 32.1883 96.9399V84.9628H35.0407V86.5462C35.6861 85.5722 36.9478 84.6692 38.8855 84.6692C42.0529 84.6692 43.7435 87.1988 43.7435 89.5655V97.7636H41.7573C41.5268 97.7625 41.3061 97.6703 41.1431 97.5069C40.9801 97.3435 40.8881 97.1223 40.887 96.8912V90.2C40.887 88.8893 40.0861 87.2962 38.2317 87.2962C36.2316 87.2962 35.0393 89.1912 35.0393 90.975V97.7636H33.01Z"
          fill="black"
        />
        <path
          d="M52.0506 84.6843C49.0248 84.6843 45.9128 87.1151 45.9128 91.363C45.9128 95.259 48.6486 98 52.0506 98C54.8641 98 56.1133 96.1105 56.1133 96.1105V96.9286C56.1241 97.1436 56.2141 97.3469 56.3659 97.4991C56.5178 97.6513 56.7206 97.7416 56.9351 97.7523H58.9643V78.5747H56.1133V86.5919C56.1133 86.5919 54.8475 84.6843 52.0506 84.6843ZM52.5586 87.3002C55.0487 87.3002 56.3562 89.4958 56.3562 91.3686C56.3562 93.4557 54.8045 95.4371 52.5628 95.4371C50.6904 95.4371 48.8152 93.9163 48.8152 91.3422C48.8138 89.0102 50.4225 87.2932 52.5586 87.2932V87.3002Z"
          fill="black"
        />
        <path
          d="M62.9232 97.7634C62.8145 97.7665 62.7064 97.7473 62.6054 97.707C62.5044 97.6667 62.4126 97.6061 62.3358 97.5289C62.259 97.4518 62.1987 97.3598 62.1587 97.2584C62.1186 97.1571 62.0996 97.0487 62.1029 96.9397V84.9626H64.9539V87.0942C65.4438 85.9004 66.5029 84.8179 68.385 84.8179C68.7253 84.8211 69.0648 84.8532 69.3997 84.9139V87.8692C68.9654 87.7128 68.5078 87.631 68.0464 87.6271C66.0462 87.6271 64.9539 89.5222 64.9539 91.3073V97.7634H62.9232Z"
          fill="black"
        />
        <path
          d="M86.6997 97.7635C86.591 97.7668 86.4826 97.7477 86.3815 97.7075C86.2803 97.6673 86.1884 97.6067 86.1114 97.5295C86.0345 97.4524 85.9741 97.3603 85.9339 97.2589C85.8938 97.1574 85.8748 97.0489 85.878 96.9398V84.9626H88.7318V97.7635H86.6997Z"
          fill="black"
        />
        <path
          d="M97.089 84.6843C94.0632 84.6843 90.9526 87.1151 90.9526 91.363C90.9526 95.259 93.6884 98 97.089 98C99.897 98 101.149 96.1105 101.149 96.1105V96.9286C101.16 97.1436 101.25 97.3469 101.402 97.4991C101.553 97.6513 101.756 97.7416 101.971 97.7523H104V78.5747H101.149V86.5919C101.149 86.5919 99.8873 84.6843 97.089 84.6843ZM97.5971 87.3002C100.095 87.3002 101.395 89.4958 101.395 91.3686C101.395 93.4557 99.8429 95.4371 97.6026 95.4371C95.7288 95.4371 93.855 93.9163 93.855 91.3422C93.8536 89.0102 95.4678 87.2932 97.5971 87.2932V87.3002Z"
          fill="black"
        />
        <path
          d="M87.2813 82.2103C88.3231 82.2103 89.1676 81.3637 89.1676 80.3194C89.1676 79.2751 88.3231 78.4285 87.2813 78.4285C86.2395 78.4285 85.395 79.2751 85.395 80.3194C85.395 81.3637 86.2395 82.2103 87.2813 82.2103Z"
          fill="black"
        />
        <path
          d="M76.9184 84.6731C73.7496 84.6731 70.2712 87.0496 70.2712 91.3407C70.2712 95.2547 73.236 97.9999 76.9143 97.9999C81.4475 97.9999 83.66 94.3475 83.66 91.3643C83.66 87.705 80.8104 84.6731 76.9212 84.6731H76.9184ZM76.9282 87.3432C79.1198 87.3432 80.7549 89.1131 80.7549 91.3476C80.7549 93.6226 79.0199 95.3827 76.9351 95.3827C75.0002 95.3827 73.1194 93.8035 73.1194 91.3922C73.1194 88.9405 74.9086 87.3488 76.9282 87.3488V87.3432Z"
          fill="black"
        />
        <path
          d="M81.4769 35.895L88.7723 23.2263C88.9677 22.8863 89.021 22.4826 88.9207 22.1034C88.8203 21.7241 88.5743 21.4 88.2365 21.2018C88.0696 21.1035 87.8848 21.0394 87.693 21.0133C87.5011 20.9871 87.306 20.9993 87.119 21.0493C86.9319 21.0992 86.7566 21.1859 86.6031 21.3043C86.4497 21.4227 86.3213 21.5704 86.2253 21.7389L78.8355 34.5704C73.196 31.988 66.85 30.5493 60.0237 30.5493C53.1975 30.5493 46.8501 31.988 41.212 34.5704L33.8208 21.7389C33.7265 21.565 33.5983 21.4118 33.4439 21.2884C33.2895 21.165 33.1119 21.0739 32.9217 21.0205C32.7316 20.9671 32.5326 20.9524 32.3367 20.9774C32.1408 21.0025 31.9519 21.0666 31.7811 21.1661C31.6104 21.2656 31.4613 21.3984 31.3427 21.5567C31.224 21.715 31.1383 21.8955 31.0904 22.0876C31.0426 22.2797 31.0337 22.4794 31.0643 22.675C31.0948 22.8706 31.1642 23.0581 31.2683 23.2263L38.5623 35.895C25.9827 42.7268 17.4645 55.4915 16.0557 70.4337H104C102.587 55.4915 94.0661 42.7268 81.4769 35.895ZM39.8365 58.053C39.1072 58.0533 38.3943 57.8368 37.7878 57.4308C37.1814 57.0248 36.7086 56.4477 36.4294 55.7723C36.1502 55.097 36.0771 54.3538 36.2193 53.6368C36.3615 52.9199 36.7126 52.2612 37.2283 51.7443C37.744 51.2274 38.401 50.8754 39.1162 50.7329C39.8315 50.5903 40.5728 50.6636 41.2465 50.9435C41.9202 51.2234 42.496 51.6973 42.9009 52.3052C43.3059 52.9131 43.5219 53.6278 43.5217 54.3589C43.5209 55.3389 43.132 56.2785 42.4405 56.9712C41.749 57.6639 40.8113 58.053 39.8337 58.053H39.8365ZM80.2068 58.053C79.4776 58.053 78.7648 57.8363 78.1585 57.4301C77.5523 57.024 77.0798 56.4467 76.8008 55.7714C76.5218 55.096 76.4488 54.3529 76.5912 53.636C76.7336 52.9191 77.0848 52.2606 77.6005 51.7438C78.1162 51.2271 78.7733 50.8752 79.4885 50.7328C80.2037 50.5903 80.945 50.6637 81.6186 50.9436C82.2922 51.2235 82.8679 51.6974 83.2728 52.3053C83.6777 52.9133 83.8937 53.6279 83.8934 54.3589C83.8932 54.8443 83.7976 55.3249 83.6121 55.7733C83.4266 56.2217 83.1548 56.629 82.8122 56.9721C82.4695 57.3152 82.0629 57.5872 81.6154 57.7727C81.1679 57.9581 80.6883 58.0534 80.2041 58.053H80.2068Z"
          fill="#32DE84"
        />
      </svg>
    </div>
  );
}

function WebIcons() {
  return (
    <div className="flex lg:items-center lg:justify-center gap-5 mb-5 lg:mb-8">
      <svg
        fill="none"
        className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl shadow-2xl bg-wash"
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#ee)">
          <path
            d="m60 81.99c12.15 0 22-9.8497 22-22 0-12.15-9.8497-22-22-22s-22 9.8498-22 22c0 12.15 9.8497 22 22 22z"
            fill="#fff"
          />
          <path
            d="m60 38h38.099c-3.8606-6.6892-9.4144-12.244-16.103-16.106-6.6884-3.862-14.276-5.8948-21.999-5.8943-7.7232 5e-4 -15.31 2.0345-21.998 5.8973-6.6879 3.8629-12.241 9.4184-16.101 16.108l19.05 32.995 0.017-0.0044c-1.9378-3.3417-2.9604-7.1352-2.9648-10.998-0.0043-3.8629 1.0098-7.6586 2.9401-11.005 1.9303-3.346 4.7086-6.124 8.0548-8.0539 3.3463-1.93 7.1422-2.9437 11.005-2.9389z"
            fill="url(#cc)"
          />
          <path
            d="m60 77.417c9.619 0 17.417-7.7977 17.417-17.417 0-9.6189-7.7977-17.417-17.417-17.417-9.6189 0-17.417 7.7977-17.417 17.417 0 9.619 7.7977 17.417 17.417 17.417z"
            fill="#1A73E8"
          />
          <path
            d="m79.05 71.006-19.05 32.994c7.7233 1e-3 15.311-2.031 21.999-5.8925 6.6886-3.8614 12.243-9.4158 16.104-16.105 3.8607-6.6888 5.8927-14.276 5.8917-22-1e-3 -7.7232-2.036-15.31-5.8996-21.997h-38.099l-0.0045 0.017c3.8629-0.0074 7.6595 1.0036 11.007 2.9313 3.3476 1.9277 6.1278 4.7038 8.0604 8.0485s2.9492 7.1398 2.9474 11.003c-0.0017 3.8629-1.0219 7.657-2.9575 11z"
            fill="url(#bb)"
          />
          <path
            d="m40.949 71.006-19.049-32.995c-3.8626 6.688-5.8963 14.275-5.8966 21.998s2.0328 15.31 5.8949 21.999 9.4171 12.242 16.106 16.102c6.6893 3.8603 14.277 5.8913 22 5.8893l19.049-32.994-0.0123-0.0124c-1.925 3.349-4.699 6.1314-8.0422 8.0666s-7.1375 2.9549-11 2.9562-7.6579-1.0158-11.002-2.9488c-3.3445-1.9329-6.1203-4.7134-8.0476-8.0612z"
            fill="url(#aa)"
          />
        </g>
        <defs>
          <linearGradient
            id="cc"
            x1="21.898"
            x2="98.099"
            y1="43.5"
            y2="43.5"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#D93025" offset="0" />
            <stop stopColor="#EA4335" offset="1" />
          </linearGradient>
          <linearGradient
            id="bb"
            x1="53.99"
            x2="92.09"
            y1="103.41"
            y2="37.42"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#FCC934" offset="0" />
            <stop stopColor="#FBBC04" offset="1" />
          </linearGradient>
          <linearGradient
            id="aa"
            x1="64.763"
            x2="26.663"
            y1="101.25"
            y2="35.261"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E8E3E" offset="0" />
            <stop stopColor="#34A853" offset="1" />
          </linearGradient>
          <clipPath id="ee">
            <rect
              transform="translate(16 16)"
              width="88"
              height="88"
              fill="#fff"
            />
          </clipPath>
        </defs>
      </svg>

      <svg
        className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl shadow-2xl bg-wash"
        fill="none"
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="m101.3 42.856c-1.9371-4.6598-5.8655-9.691-8.9417-11.282 2.1941 4.2494 3.7168 8.8131 4.5137 13.529l0.0081 0.0748c-5.0393-12.564-13.585-17.63-20.564-28.66-0.3605-0.5624-0.7106-1.1313-1.05-1.7066-0.175-0.3005-0.3388-0.6074-0.491-0.92-0.2895-0.5606-0.5126-1.153-0.6647-1.7653 2e-4 -0.0282-0.01-0.0556-0.0287-0.0768s-0.0445-0.0348-0.0725-0.0382c-0.0275-0.0075-0.0565-0.0075-0.084 0-0.0057 0-0.0149 0.0104-0.0218 0.0127s-0.0219 0.0126-0.0322 0.0172l0.0172-0.0299c-11.195 6.555-14.994 18.69-15.343 24.76-4.4708 0.3074-8.7453 1.9549-12.266 4.7277-0.3673-0.3111-0.7512-0.6021-1.15-0.8717-1.0156-3.5547-1.0588-7.3168-0.1253-10.894-4.1114 1.9917-7.7645 4.8151-10.728 8.2915h-0.0207c-1.7664-2.239-1.6422-9.622-1.541-11.164-0.5225 0.21-1.0214 0.4749-1.4881 0.7901-1.5593 1.1129-3.0171 2.3617-4.3562 3.7317-1.5259 1.5472-2.9196 3.2193-4.1664 4.9991v0.0069-0.0081c-2.8656 4.0625-4.898 8.6523-5.98 13.504l-0.0598 0.2944c-0.1644 0.9247-0.3105 1.8525-0.4382 2.783 0 0.0333-0.0069 0.0644-0.0103 0.0977-0.3902 2.0279-0.6319 4.0815-0.7234 6.1445v0.23c0.0098 11.16 4.2056 21.91 11.758 30.126 7.5526 8.216 17.912 13.3 29.032 14.247s22.19-2.312 31.023-9.132c8.8332-6.8204 14.786-16.706 16.683-27.704 0.075-0.575 0.136-1.1443 0.203-1.725 0.918-7.5875-0.076-15.284-2.891-22.389zm-51.371 34.889c0.2082 0.1001 0.4037 0.2082 0.6176 0.3036l0.031 0.0196c-0.2162-0.1035-0.4324-0.2112-0.6486-0.3232zm46.954-32.556v-0.0425l0.0081 0.0471-0.0081-0.0046z"
          fill="url(#l)"
        />
        <path
          d="m101.3 42.856c-1.9371-4.6598-5.8655-9.691-8.9417-11.282 2.1941 4.2494 3.7168 8.8131 4.5137 13.529v0.0426l0.0081 0.0471c3.4349 9.8307 2.9384 20.609-1.3869 30.082-5.1083 10.961-17.473 22.195-36.828 21.649-20.913-0.5923-39.33-16.11-42.773-36.436-0.6268-3.205 0-4.83 0.3151-7.4347-0.4299 2.0233-0.6697 4.0823-0.7165 6.1502v0.23c0.0098 11.16 4.2056 21.91 11.758 30.126 7.5526 8.216 17.912 13.3 29.032 14.247s22.19-2.312 31.023-9.1321c8.8332-6.8204 14.786-16.706 16.683-27.704 0.075-0.575 0.136-1.1443 0.203-1.725 0.918-7.5875-0.076-15.284-2.891-22.389z"
          fill="url(#i)"
        />
        <path
          d="m101.3 42.856c-1.9371-4.6598-5.8655-9.691-8.9417-11.282 2.1941 4.2494 3.7168 8.8131 4.5137 13.529v0.0426l0.0081 0.0471c3.4349 9.8307 2.9384 20.609-1.3869 30.082-5.1083 10.961-17.473 22.195-36.828 21.649-20.913-0.5923-39.33-16.11-42.773-36.436-0.6268-3.205 0-4.83 0.3151-7.4347-0.4299 2.0233-0.6697 4.0823-0.7165 6.1502v0.23c0.0098 11.16 4.2056 21.91 11.758 30.126 7.5526 8.216 17.912 13.3 29.032 14.247s22.19-2.312 31.023-9.1321c8.8332-6.8204 14.786-16.706 16.683-27.704 0.075-0.575 0.136-1.1443 0.203-1.725 0.918-7.5875-0.076-15.284-2.891-22.389z"
          fill="url(#h)"
        />
        <path
          d="m79.644 48.095c0.0966 0.0678 0.1863 0.1357 0.2772 0.2035-1.1196-1.9852-2.5133-3.8028-4.14-5.3992-13.853-13.855-3.6306-30.042-1.9067-30.864l0.0172-0.0253c-11.195 6.555-14.994 18.69-15.343 24.76 0.5198-0.0357 1.035-0.0794 1.5663-0.0794 3.9723 0.0073 7.8719 1.0664 11.302 3.0696 3.4303 2.0031 6.2689 4.879 8.2272 8.335z"
          fill="url(#g)"
        />
        <path
          d="m60.144 50.862c-0.0736 1.1086-3.9905 4.9323-5.3602 4.9323-12.674 0-14.732 7.6671-14.732 7.6671 0.5612 6.4561 5.06 11.774 10.498 14.587 0.2484 0.1288 0.5002 0.2449 0.7521 0.3588 0.4362 0.1932 0.8724 0.3718 1.3087 0.5359 1.8664 0.6605 3.8212 1.0377 5.7994 1.1189 22.215 1.0419 26.518-26.565 10.487-34.576 3.7818-0.492 7.6116 0.4378 10.747 2.6094-1.9583-3.4561-4.7969-6.3319-8.2272-8.3351-3.4302-2.0031-7.3298-3.0622-11.302-3.0695-0.529 0-1.0465 0.0437-1.5663 0.0794-4.4708 0.3073-8.7453 1.9548-12.266 4.7276 0.6797 0.575 1.4467 1.3432 3.0625 2.936 3.0245 2.9796 10.781 6.0662 10.798 6.4285z"
          fill="url(#f)"
        />
        <path
          d="m60.144 50.862c-0.0736 1.1086-3.9905 4.9323-5.3602 4.9323-12.674 0-14.732 7.6671-14.732 7.6671 0.5612 6.4561 5.06 11.774 10.498 14.587 0.2484 0.1288 0.5002 0.2449 0.7521 0.3588 0.4362 0.1932 0.8724 0.3718 1.3087 0.5359 1.8664 0.6605 3.8212 1.0377 5.7994 1.1189 22.215 1.0419 26.518-26.565 10.487-34.576 3.7818-0.492 7.6116 0.4378 10.747 2.6094-1.9583-3.4561-4.7969-6.3319-8.2272-8.3351-3.4302-2.0031-7.3298-3.0622-11.302-3.0695-0.529 0-1.0465 0.0437-1.5663 0.0794-4.4708 0.3073-8.7453 1.9548-12.266 4.7276 0.6797 0.575 1.4467 1.3432 3.0625 2.936 3.0245 2.9796 10.781 6.0662 10.798 6.4285z"
          fill="url(#e)"
        />
        <path
          d="m44.205 40.015c0.3611 0.23 0.6589 0.4301 0.92 0.6107-1.0156-3.5547-1.0589-7.3168-0.1254-10.894-4.1113 1.9917-7.7644 4.8151-10.728 8.2915 0.2173-0.0057 6.6826-0.1219 9.9337 1.9918z"
          fill="url(#d)"
        />
        <path
          d="m15.902 60.487c3.4397 20.325 21.86 35.843 42.773 36.436 19.354 0.5474 31.719-10.688 36.828-21.649 4.3254-9.4729 4.8223-20.251 1.3869-30.082v-0.0425c0-0.0334-0.0069-0.0529 0-0.0426l0.0081 0.0748c1.5812 10.324-3.6697 20.325-11.878 27.088l-0.0253 0.0575c-15.994 13.026-31.301 7.8591-34.399 5.75-0.2162-0.1035-0.4324-0.2112-0.6486-0.3231-9.3253-4.4574-13.178-12.954-12.352-20.24-2.2137 0.0326-4.3893-0.5774-6.2632-1.7561-1.874-1.1788-3.3659-2.8757-4.295-4.8852 2.4479-1.4997 5.2391-2.3475 8.1075-2.4626 2.8685-0.1152 5.7186 0.5062 8.2789 1.8048 5.2783 2.3962 11.285 2.6323 16.735 0.6578-0.0173-0.3622-7.774-3.45-10.798-6.4285-1.6158-1.5927-2.3828-2.3598-3.0625-2.9359-0.3673-0.3112-0.7512-0.6022-1.15-0.8717-0.2645-0.1806-0.5623-0.3761-0.92-0.6107-3.251-2.1137-9.7163-1.9975-9.9302-1.9918h-0.0207c-1.7664-2.239-1.6422-9.622-1.541-11.164-0.5226 0.21-1.0214 0.4749-1.4881 0.7901-1.5594 1.1129-3.0171 2.3617-4.3562 3.7317-1.5314 1.5428-2.9309 3.2111-4.1837 4.9876v0.0069-0.0081c-2.8656 4.0624-4.898 8.6523-5.98 13.504-0.0219 0.0908-1.6054 7.0138-0.8246 10.604z"
          fill="url(#c)"
        />
        <path
          d="m75.784 42.9c1.6271 1.5982 3.0208 3.4178 4.14 5.405 0.2449 0.1852 0.4738 0.3692 0.6681 0.5474 10.105 9.315 4.8105 22.482 4.416 23.42 8.2087-6.7632 13.455-16.765 11.878-27.088-5.0416-12.57-13.587-17.635-20.567-28.666-0.3605-0.5624-0.7106-1.1313-1.05-1.7066-0.175-0.3005-0.3388-0.6074-0.491-0.92-0.2895-0.5606-0.5126-1.153-0.6647-1.7653 2e-4 -0.0282-0.01-0.0556-0.0287-0.0768s-0.0445-0.0348-0.0725-0.0382c-0.0275-0.0075-0.0565-0.0075-0.084 0-0.0057 0-0.0149 0.0104-0.0218 0.0127s-0.0219 0.0126-0.0322 0.0172c-1.7239 0.8177-11.946 17.004 1.909 30.859z"
          fill="url(#b)"
        />
        <path
          d="m80.585 48.846c-0.2142-0.1927-0.4371-0.3754-0.6682-0.5474-0.0908-0.0679-0.1805-0.1357-0.2771-0.2036-3.1351-2.1715-6.965-3.1014-10.747-2.6093 16.031 8.0155 11.73 35.618-10.487 34.576-1.9781-0.0812-3.933-0.4584-5.7994-1.119-0.4362-0.1633-0.8725-0.3419-1.3087-0.5359-0.2519-0.115-0.5037-0.23-0.7521-0.3588l0.031 0.0196c3.0981 2.1148 18.4 7.2818 34.399-5.75l0.0253-0.0575c0.399-0.9315 5.6936-14.102-4.416-23.414z"
          fill="url(#a)"
        />
        <path
          d="m40.052 63.462s2.0573-7.667 14.732-7.667c1.3696 0 5.29-3.8238 5.3601-4.9324-5.4501 1.9745-11.456 1.7384-16.735-0.6578-2.5602-1.2986-5.4104-1.9199-8.2788-1.8048-2.8684 0.1152-5.6596 0.963-8.1075 2.4626 0.9291 2.0095 2.421 3.7064 4.2949 4.8852 1.874 1.1788 4.0496 1.7888 6.2632 1.7561-0.8257 7.2875 3.0268 15.784 12.352 20.24 0.2081 0.1 0.4036 0.2081 0.6175 0.3036-5.4429-2.8118-9.9371-8.1294-10.498-14.586z"
          fill="url(#k)"
        />
        <path
          d="m101.3 42.856c-1.9371-4.6598-5.8655-9.691-8.9417-11.282 2.1941 4.2494 3.7168 8.8131 4.5137 13.529l0.0081 0.0748c-5.0393-12.564-13.585-17.63-20.564-28.66-0.3605-0.5624-0.7106-1.1313-1.05-1.7066-0.175-0.3005-0.3388-0.6074-0.491-0.92-0.2895-0.5606-0.5126-1.153-0.6647-1.7653 2e-4 -0.0282-0.01-0.0556-0.0287-0.0768s-0.0445-0.0348-0.0725-0.0382c-0.0275-0.0075-0.0565-0.0075-0.084 0-0.0057 0-0.0149 0.0104-0.0218 0.0127s-0.0219 0.0126-0.0322 0.0172l0.0172-0.0299c-11.195 6.555-14.994 18.69-15.343 24.76 0.5198-0.0356 1.035-0.0793 1.5663-0.0793 3.9723 0.0073 7.8719 1.0663 11.302 3.0695 3.4303 2.0032 6.2689 4.879 8.2272 8.335-3.1351-2.1715-6.9649-3.1014-10.747-2.6093 16.031 8.0155 11.73 35.618-10.487 34.576-1.9782-0.0813-3.933-0.4584-5.7994-1.119-0.4363-0.1633-0.8725-0.3419-1.3087-0.5359-0.2519-0.115-0.5037-0.23-0.7521-0.3588l0.031 0.0196c-0.2162-0.1035-0.4324-0.2112-0.6486-0.3232 0.2082 0.1001 0.4037 0.2082 0.6176 0.3036-5.443-2.8129-9.9372-8.1305-10.498-14.587 0 0 2.0574-7.667 14.732-7.667 1.3697 0 5.29-3.8238 5.3602-4.9324-0.0173-0.3622-7.774-3.45-10.798-6.4285-1.6158-1.5927-2.3828-2.3598-3.0625-2.9359-0.3673-0.3111-0.7512-0.6021-1.15-0.8717-1.0156-3.5547-1.0588-7.3168-0.1253-10.894-4.1114 1.9917-7.7645 4.8151-10.728 8.2915h-0.0207c-1.7664-2.239-1.6422-9.622-1.541-11.164-0.5225 0.21-1.0214 0.4749-1.4881 0.7901-1.5593 1.1129-3.0171 2.3617-4.3562 3.7317-1.5259 1.5472-2.9196 3.2193-4.1664 4.9991v0.0069-0.0081c-2.8656 4.0625-4.898 8.6523-5.98 13.504l-0.0598 0.2944c-0.084 0.3921-0.46 2.3839-0.5141 2.8117v0c-0.3439 2.0561-0.5636 4.131-0.6578 6.2135v0.23c0.0098 11.16 4.2056 21.91 11.758 30.126 7.5526 8.216 17.912 13.3 29.032 14.247s22.19-2.312 31.023-9.132c8.8332-6.8204 14.786-16.706 16.683-27.704 0.075-0.575 0.136-1.1443 0.203-1.725 0.918-7.5875-0.076-15.284-2.891-22.389z"
          fill="url(#j)"
        />
        <defs>
          <linearGradient
            id="l"
            x1="95.404"
            x2="21.414"
            y1="26.252"
            y2="97.638"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF44F" offset=".048" />
            <stop stopColor="#FFE847" offset=".111" />
            <stop stopColor="#FFC830" offset=".225" />
            <stop stopColor="#FF980E" offset=".368" />
            <stop stopColor="#FF8B16" offset=".401" />
            <stop stopColor="#FF672A" offset=".462" />
            <stop stopColor="#FF3647" offset=".534" />
            <stop stopColor="#E31587" offset=".705" />
          </linearGradient>
          <radialGradient
            id="i"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="translate(91.985 22.211) scale(92.916 92.917)"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFBD4F" offset=".129" />
            <stop stopColor="#FFAC31" offset=".186" />
            <stop stopColor="#FF9D17" offset=".247" />
            <stop stopColor="#FF980E" offset=".283" />
            <stop stopColor="#FF563B" offset=".403" />
            <stop stopColor="#FF3750" offset=".467" />
            <stop stopColor="#F5156C" offset=".71" />
            <stop stopColor="#EB0878" offset=".782" />
            <stop stopColor="#E50080" offset=".86" />
          </radialGradient>
          <radialGradient
            id="h"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="translate(58.032 60.198) scale(92.916 92.917)"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#960E18" offset=".3" />
            <stop stopColor="#B11927" stopOpacity=".74" offset=".351" />
            <stop stopColor="#DB293D" stopOpacity=".343" offset=".435" />
            <stop stopColor="#F5334B" stopOpacity=".094" offset=".497" />
            <stop stopColor="#FF3750" stopOpacity="0" offset=".53" />
          </radialGradient>
          <radialGradient
            id="g"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="translate(69.234 1.1246) scale(67.314)"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF44F" offset=".132" />
            <stop stopColor="#FFDC3E" offset=".252" />
            <stop stopColor="#FF9D12" offset=".506" />
            <stop stopColor="#FF980E" offset=".526" />
          </radialGradient>
          <radialGradient
            id="f"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="translate(47.755 84.468) scale(44.242 44.242)"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#3A8EE6" offset=".353" />
            <stop stopColor="#5C79F0" offset=".472" />
            <stop stopColor="#9059FF" offset=".669" />
            <stop stopColor="#C139E6" offset="1" />
          </radialGradient>
          <radialGradient
            id="e"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="translate(63.11 52.583) rotate(-13.592) scale(23.457 27.462)"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#9059FF" stopOpacity="0" offset=".206" />
            <stop stopColor="#8C4FF3" stopOpacity=".064" offset=".278" />
            <stop stopColor="#7716A8" stopOpacity=".45" offset=".747" />
            <stop stopColor="#6E008B" stopOpacity=".6" offset=".975" />
          </radialGradient>
          <radialGradient
            id="d"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="translate(56.859 18.409) scale(31.827)"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFE226" offset="0" />
            <stop stopColor="#FFDB27" offset=".121" />
            <stop stopColor="#FFC82A" offset=".295" />
            <stop stopColor="#FFA930" offset=".502" />
            <stop stopColor="#FF7E37" offset=".732" />
            <stop stopColor="#FF7139" offset=".792" />
          </radialGradient>
          <radialGradient
            id="c"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="translate(81.876 -1.7782) scale(135.79)"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF44F" offset=".113" />
            <stop stopColor="#FF980E" offset=".456" />
            <stop stopColor="#FF5634" offset=".622" />
            <stop stopColor="#FF3647" offset=".716" />
            <stop stopColor="#E31587" offset=".904" />
          </radialGradient>
          <radialGradient
            id="b"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="translate(70.431 5.7724) rotate(83.976) scale(99.526 65.318)"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF44F" offset="0" />
            <stop stopColor="#FFE847" offset=".06" />
            <stop stopColor="#FFC830" offset=".168" />
            <stop stopColor="#FF980E" offset=".304" />
            <stop stopColor="#FF8B16" offset=".356" />
            <stop stopColor="#FF672A" offset=".455" />
            <stop stopColor="#FF3647" offset=".57" />
            <stop stopColor="#E31587" offset=".737" />
          </radialGradient>
          <radialGradient
            id="a"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="translate(56.11 30.198) scale(84.778)"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF44F" offset=".137" />
            <stop stopColor="#FF980E" offset=".48" />
            <stop stopColor="#FF5634" offset=".592" />
            <stop stopColor="#FF3647" offset=".655" />
            <stop stopColor="#E31587" offset=".904" />
          </radialGradient>
          <radialGradient
            id="k"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="translate(78.488 35.16) scale(92.789)"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF44F" offset=".094" />
            <stop stopColor="#FFE141" offset=".231" />
            <stop stopColor="#FFAF1E" offset=".509" />
            <stop stopColor="#FF980E" offset=".626" />
          </radialGradient>
          <linearGradient
            id="j"
            x1="94.515"
            x2="31.557"
            y1="25.87"
            y2="88.827"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF44F" stopOpacity=".8" offset=".167" />
            <stop stopColor="#FFF44F" stopOpacity=".634" offset=".266" />
            <stop stopColor="#FFF44F" stopOpacity=".217" offset=".489" />
            <stop stopColor="#FFF44F" stopOpacity="0" offset=".6" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        fill="none"
        className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl shadow-2xl bg-wash"
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="m60 104c24.3 0 44-19.7 44-44s-19.7-44-44-44-44 19.7-44 44 19.7 44 44 44z"
          fill="url(#aaa)"
        />
        <path
          d="m60.002 100.1v-6.756"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m60.002 26.624v-6.7563"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m53.018 99.512 1.1732-6.6536m11.585-65.704 1.1732-6.6536"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m46.278 97.689 2.3108-6.3488m22.819-62.694 2.3108-6.3488"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m39.91 94.765 3.3781-5.851m33.359-57.779 3.3782-5.8511"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m34.252 90.737 4.3428-5.1756m42.885-51.109 4.3429-5.1756"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m29.227 85.774 5.1756-4.3428m51.109-42.885 5.1756-4.3428"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m25.244 80.033 5.8511-3.3781m57.779-33.359 5.8511-3.3781"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m22.238 73.725 6.3488-2.3108m62.694-22.819 6.3488-2.3108"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m20.469 67.009 6.6535-1.1733m65.704-11.585 6.6536-1.1732"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m19.9 60.002h6.7563m66.718 0h6.7558"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m20.488 53.062 6.6536 1.1732m65.704 11.585 6.6536 1.1732"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m22.309 46.295 6.3488 2.3108m62.694 22.819 6.3488 2.3108"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m25.229 39.99 5.8511 3.3781m57.779 33.359 5.851 3.3781"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m29.24 34.19 5.1756 4.3428m51.109 42.885 5.1756 4.3429"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m34.166 29.281 4.3428 5.1756m42.885 51.109 4.3428 5.1755"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m39.918 25.256 3.3781 5.8511m33.359 57.779 3.3781 5.8511"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m46.28 22.3 2.3108 6.3487m22.819 62.694 2.3107 6.3488"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m52.992 20.554 1.1733 6.6536m11.585 65.704 1.1732 6.6536"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m56.484 99.953 0.2945-3.3653m6.4037-73.194 0.2944-3.3653"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m49.629 98.788 0.8743-3.263m19.016-70.97 0.8743-3.263"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m43.024 96.33 1.4276-3.0616m31.052-66.59 1.4277-3.0616"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m36.978 92.875 1.9376-2.7672m42.143-60.186 1.9376-2.7672"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m31.658 88.369 2.3887-2.3886m51.954-51.954 2.3887-2.3886"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m27.141 83.051 2.7672-1.9376m60.186-42.143 2.7672-1.9376"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m23.653 76.966 3.0616-1.4277m66.59-31.052 3.0617-1.4276"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m21.24 70.41 3.263-0.8744m70.97-19.016 3.263-0.8743"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m20 63.507 3.3653-0.2944m73.194-6.4037 3.3652-0.2944"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m20.03 56.514 3.3653 0.2944m73.194 6.4037 3.3653 0.2944"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m21.19 49.657 3.2631 0.8743m70.97 19.016 3.263 0.8744"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m23.624 43.042 3.0616 1.4276m66.59 31.052 3.0616 1.4277"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m27.127 37.029 2.7671 1.9376m60.186 42.143 2.7672 1.9376"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m31.654 31.661 2.3887 2.3887m51.954 51.954 2.3887 2.3887"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m36.935 27.134 1.9376 2.7672m42.143 60.186 1.9376 2.7672"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m43.044 23.676 1.4276 3.0616m31.052 66.59 1.4277 3.0616"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m49.59 21.297 0.8743 3.263m19.016 70.97 0.8743 3.263"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m56.449 20.063 0.2944 3.3653m6.4037 73.194 0.2944 3.3652"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth=".84706"
        />
        <path
          d="m91.222 33.87-34.71 22.211-27.785 30.15 34.879-21.704 27.616-30.656z"
          clipRule="evenodd"
          fill="#fff"
          fillRule="evenodd"
        />
        <path
          d="m91.222 33.87-34.71 22.211 7.094 8.4453 27.616-30.656z"
          clipRule="evenodd"
          fill="#FF3B30"
          fillRule="evenodd"
        />
        <defs>
          <linearGradient
            id="aaa"
            x1="59.999"
            x2="59.999"
            y1="104.01"
            y2="15.992"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E6FF1" offset="0" />
            <stop stopColor="#28CEFB" offset="1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// TODO: upgrade React and use the built-in version.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      (result) => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      (reason) => {
        promise.status = 'rejected';
        promise.reason = reason;
      }
    );
    throw promise;
  }
}

let confCache = new Map();
let talksCache = new Map();
const loadConfDelay = 250;
const loadTalksDelay = 1000;

function fetchConf(slug) {
  if (confCache.has(slug)) {
    return confCache.get(slug);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      if (slug === 'react-conf-2021') {
        resolve({
          id: 0,
          cover: 'https://i.imgur.com/zBJvLHG.jpg',
          name: 'React Conf 2021',
        });
      } else if (slug === 'react-conf-2019') {
        resolve({
          id: 1,
          cover: 'https://i.imgur.com/L4VckWD.png',
          name: 'React Conf 2019',
        });
      }
    }, loadConfDelay);
  });
  confCache.set(slug, promise);
  return promise;
}

function fetchTalks(confId) {
  if (talksCache.has(confId)) {
    return talksCache.get(confId);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      if (confId === 0) {
        resolve([
          {
            id: 0,
            title: 'React 18 Keynote',
            description:
              'Andrew Clark, Lauren Tan, Juan Tejada, and Ricky Hanlon',
            url: 'https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=1',
            image: {
              speakers: [
                'https://i.imgur.com/D69ZvSY.jpg',
                'https://i.imgur.com/RznoMDK.jpg',
                'https://i.imgur.com/CeGgjK3.jpg',
                'https://i.imgur.com/tK5OEus.jpg',
              ],
            },
          },
          {
            id: 1,
            title: 'React 18 for App Developers',
            description: 'Shruti Kapoor',
            url: 'https://www.youtube.com/watch?v=ytudH8je5ko&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=2',
            image: {
              speakers: ['https://i.imgur.com/cyaiwpP.jpg'],
            },
          },
          {
            id: 2,
            title: 'Streaming Server Rendering with Suspense',
            description: 'Shaundai Person',
            url: 'https://www.youtube.com/watch?v=pj5N-Khihgc&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=3',
            image: {
              speakers: ['https://i.imgur.com/RUmFLhB.jpg'],
            },
          },
          {
            id: 3,
            title: 'The First React Working Group',
            description: 'Aakansha Doshi',
            url: 'https://www.youtube.com/watch?v=qn7gRClrC9U&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=4',
            image: {
              speakers: ['https://i.imgur.com/xRs64T1.jpg'],
            },
          },
          {
            id: 4,
            title: 'React Developer Tooling',
            description: 'Brian Vaughn',
            url: 'https://www.youtube.com/watch?v=oxDfrke8rZg&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=5',
            image: {
              speakers: ['https://i.imgur.com/IasQNDL.jpg'],
            },
          },
          {
            id: 5,
            title: 'React without memo',
            description: 'Xuan Huang (黄玄)',
            url: 'https://www.youtube.com/watch?v=lGEMwh32soc&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=6',
            image: {
              speakers: ['https://i.imgur.com/Zloqi0V.jpg'],
            },
          },
          {
            id: 6,
            title: 'React Docs Keynote',
            description: 'Rachel Nabors',
            url: 'https://www.youtube.com/watch?v=mneDaMYOKP8&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=7',
            image: {
              speakers: ['https://i.imgur.com/NkwwAZF.png'],
            },
          },
          {
            id: 7,
            title: 'Things I Learnt from the New React Docs',
            description: "Debbie O'Brien",
            url: 'https://www.youtube.com/watch?v=-7odLW_hG7s&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=8',
            image: {
              speakers: ['https://i.imgur.com/uhF5Hyo.jpg'],
            },
          },
          {
            id: 8,
            title: 'Learning in the Browser',
            description: 'Sarah Rainsberger',
            url: 'https://www.youtube.com/watch?v=5X-WEQflCL0&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=9',
            image: {
              speakers: ['https://i.imgur.com/s36xhcT.jpg'],
            },
          },
          {
            id: 9,
            title: 'The ROI of Designing with React',
            description: 'Linton Ye',
            url: 'https://www.youtube.com/watch?v=7cPWmID5XAk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=10',
            image: {
              speakers: ['https://i.imgur.com/Frxfjpq.jpg'],
            },
          },
          {
            id: 10,
            title: 'Interactive Playgrounds with React',
            description: 'Delba de Oliveira',
            url: 'https://www.youtube.com/watch?v=zL8cz2W0z34&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=11',
            image: {
              speakers: ['https://i.imgur.com/N1zNMrC.jpg'],
            },
          },
          {
            id: 11,
            title: 'Re-introducing Relay',
            description: 'Robert Balicki',
            url: 'https://www.youtube.com/watch?v=lhVGdErZuN4&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=12',
            image: {
              speakers: ['https://i.imgur.com/vxgsVlt.jpg'],
            },
          },
          {
            id: 12,
            title: 'React Native Desktop',
            description: 'Eric Rozell and Steven Moyes',
            url: 'https://www.youtube.com/watch?v=9L4FFrvwJwY&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=13',
            image: {
              speakers: [
                'https://i.imgur.com/roifbxu.jpg',
                'https://i.imgur.com/Y0k7sBd.jpg',
              ],
            },
          },
          {
            id: 13,
            title: 'On-device Machine Learning for React Native',
            description: 'Roman Rädle',
            url: 'https://www.youtube.com/watch?v=NLj73vrc2I8&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=14',
            image: {
              speakers: ['https://i.imgur.com/pECN2Yi.jpg'],
            },
          },
          {
            id: 14,
            title: 'React 18 for External Store Libraries',
            description: 'Daishi Kato',
            url: 'https://www.youtube.com/watch?v=oPfSC5bQPR8&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=15',
            image: {
              speakers: ['https://i.imgur.com/NqPgNiJ.jpg'],
            },
          },
          {
            id: 15,
            title: 'Building Accessible Components with React 18',
            description: 'Diego Haz',
            url: 'https://www.youtube.com/watch?v=dcm8fjBfro8&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=16',
            image: {
              speakers: ['https://i.imgur.com/47mWLlJ.jpg'],
            },
          },
          {
            id: 16,
            title: 'Accessible Japanese Form Components with React',
            description: 'Tafu Nakazaki',
            url: 'https://www.youtube.com/watch?v=S4a0QlsH0pU&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=17',
            image: {
              speakers: ['https://i.imgur.com/yJvnZQy.jpg'],
            },
          },
          {
            id: 17,
            title: 'UI Tools for Artists',
            description: 'Lyle Troxell',
            url: 'https://www.youtube.com/watch?v=b3l4WxipFsE&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=18',
            image: {
              speakers: ['https://i.imgur.com/cs03udp.jpg'],
            },
          },
          {
            id: 18,
            title: 'Hydrogen + React 18',
            description: 'Helen Lin',
            url: 'https://www.youtube.com/watch?v=HS6vIYkSNks&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=19',
            image: {
              speakers: ['https://i.imgur.com/4S4N5n1.jpg'],
            },
          },
        ]);
      } else if (confId === 1) {
        resolve([
          {
            id: 19,
            title: 'Keynote (Part 1)',
            description: 'Tom Occhino',
            url: 'https://www.youtube.com/watch?v=QnZHO7QvjaM&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh',
            image: {
              speakers: [
                'https://conf2019.reactjs.org/img/speakers/tomocchino.jpg',
              ],
            },
          },
          {
            id: 20,
            title: 'Keynote (Part 2)',
            description: 'Yuzhi Zheng',
            url: 'https://www.youtube.com/watch?v=uXEEL9mrkAQ&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=2',
            image: {
              speakers: ['https://conf2019.reactjs.org/img/speakers/yuzhi.jpg'],
            },
          },
          {
            id: 21,
            title: 'Building The New Facebook With React and Relay (Part 1)',
            description: 'Frank Yan',
            url: 'https://www.youtube.com/watch?v=9JZHodNR184&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=3',
            image: {
              speakers: ['https://conf2019.reactjs.org/img/speakers/frank.jpg'],
            },
          },
          {
            id: 22,
            title: 'Building The New Facebook With React and Relay (Part 2)',
            description: 'Ashley Watkins',
            url: 'https://www.youtube.com/watch?v=KT3XKDBZW7M&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=4',
            image: {
              speakers: [
                'https://conf2019.reactjs.org/img/speakers/ashley.jpg',
              ],
            },
          },
          {
            id: 23,
            title: 'How Our Team Is Using React Native to Save The World',
            description: 'Ashley Watkins',
            url: 'https://www.youtube.com/watch?v=zVHWugBPGBE&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=5',
            image: {
              speakers: [
                'https://conf2019.reactjs.org/img/speakers/_Tany_.jpg',
              ],
            },
          },
          {
            id: 24,
            title:
              'Using Hooks and Codegen to Bring the Benefits of GraphQL to REST APIs',
            description: 'Tejas Kumar',
            url: 'https://www.youtube.com/watch?v=cdsnzfJUqm0&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=6',
            image: {
              speakers: [
                'https://conf2019.reactjs.org/img/speakers/tejaskumar_.jpg',
              ],
            },
          },
          {
            id: 25,
            title: 'Building a Custom React Renderer',
            description: 'Sophie Alpert',
            url: 'https://www.youtube.com/watch?v=CGpMlWVcHok&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=7',
            image: {
              speakers: [
                'https://conf2019.reactjs.org/img/speakers/sophiebits.jpg',
              ],
            },
          },
          {
            id: 26,
            title: 'Is React Translated Yet?',
            description: 'Nat Alison',
            url: 'https://www.youtube.com/watch?v=lLE4Jqaek5k&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=12',
            image: {
              speakers: [
                'https://conf2019.reactjs.org/img/speakers/tesseralis.jpg',
              ],
            },
          },
          {
            id: 27,
            title: 'Building (And Re-Building) the Airbnb Design System',
            description: 'Maja Wichrowska and Tae Kim',
            url: 'https://www.youtube.com/watch?v=fHQ1WSx41CA&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=13',
            image: {
              speakers: [
                'https://conf2019.reactjs.org/img/speakers/majapw.jpg',
                'https://conf2019.reactjs.org/img/speakers/taekimjr.jpg',
              ],
            },
          },
          {
            id: 28,
            title: 'Accessibility Is a Marathon, Not a Sprint',
            description: 'Brittany Feenstra',
            url: 'https://www.youtube.com/watch?v=ONSD-t4gBb8&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=14',
            image: {
              speakers: [
                'https://conf2019.reactjs.org/img/speakers/brittanyIRL.jpg',
              ],
            },
          },
          {
            id: 29,
            title: 'The State of React State in 2019',
            description: 'Becca Bailey',
            url: 'https://www.youtube.com/watch?v=wUMMUyQtMSg&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=15',
            image: {
              speakers: [
                'https://conf2019.reactjs.org/img/speakers/beccaliz.jpg',
              ],
            },
          },
          {
            id: 30,
            title: 'Let’s Program Like It’s 1999',
            description: 'Lee Byron',
            url: 'https://www.youtube.com/watch?v=vG8WpLr6y_U&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=16',
            image: {
              speakers: ['https://conf2019.reactjs.org/img/speakers/leeb.jpg'],
            },
          },
          {
            id: 31,
            title: 'React Developer Tooling',
            description: 'Brian Vaughn',
            url: 'https://www.youtube.com/watch?v=Mjrfb1r3XEM&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=17',
            image: {
              speakers: ['https://conf2019.reactjs.org/img/speakers/brian.jpg'],
            },
          },
          {
            id: 32,
            title: 'Data Fetching With Suspense In Relay',
            description: 'Joe Savona',
            url: 'https://www.youtube.com/watch?v=Tl0S7QkxFE4&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=18',
            image: {
              speakers: ['https://conf2019.reactjs.org/img/speakers/joe.jpg'],
            },
          },
          {
            id: 33,
            title: 'Automatic Visualizations of the Frontend',
            description: 'Cameron Yick',
            url: 'https://www.youtube.com/watch?v=SbreAPNmZOk&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=19',
            image: {
              speakers: [
                'https://conf2019.reactjs.org/img/speakers/hydrosquall.jpg',
              ],
            },
          },
          {
            id: 34,
            title: 'React Is Fiction',
            description: 'Jenn Creighton',
            url: 'https://www.youtube.com/watch?v=kqh4lz2Lkzs&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=20',
            image: {
              speakers: [
                'https://conf2019.reactjs.org/img/speakers/gurlcode.jpg',
              ],
            },
          },
          {
            id: 35,
            title: 'Progressive Web Animations',
            description: 'Alexandra Holachek',
            url: 'https://www.youtube.com/watch?v=laPsceJ4tTY&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=21',
            image: {
              speakers: [
                'https://conf2019.reactjs.org/img/speakers/aholachek.jpg',
              ],
            },
          },
          {
            id: 36,
            title:
              'Creating Games, Animations and Interactions with the Wick Editor',
            description: 'Luca Damasco',
            url: 'https://www.youtube.com/watch?v=laPsceJ4tTY&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=21',
            image: {
              speakers: [
                'https://conf2019.reactjs.org/img/speakers/Lucapodular.jpg',
              ],
            },
          },
          {
            id: 37,
            title: 'Building React-Select',
            description: 'Jed Watson',
            url: 'https://www.youtube.com/watch?v=yS0jUnmBujE&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=25',
            image: {
              speakers: [
                'https://conf2019.reactjs.org/img/speakers/JedWatson.jpg',
              ],
            },
          },
          {
            id: 38,
            title: 'Promoting Transparency in Government Spending with React',
            description: 'Lizzie Salita',
            url: 'https://www.youtube.com/watch?v=CVfXICcNfHE&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=26',
            image: {
              speakers: [
                'https://conf2019.reactjs.org/img/speakers/ebsalita.jpg',
              ],
            },
          },
          {
            id: 39,
            title: 'Wonder-driven Development: Using React to Make a Spaceship',
            description: 'Alex Anderson',
            url: 'https://www.youtube.com/watch?v=aV0uOPWHKt4&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=27',
            image: {
              speakers: [
                'https://conf2019.reactjs.org/img/speakers/ralex1993.jpg',
              ],
            },
          },
        ]);
      }
    }, loadTalksDelay);
  });
  talksCache.set(confId, promise);
  return promise;
}
