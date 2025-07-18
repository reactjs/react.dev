---
title: "React Labs: View Transitions, Activity, and more"
author: Ricky Hanlon
date: 2025/04/23
description: In React Labs posts, we write about projects in active research and development. In this post, we're sharing two new experimental features that are ready to try today, and updates on other areas we're working on now.
---

April 23, 2025 by [Ricky Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

In React Labs posts, we write about projects in active research and development. In this post, we're sharing two new experimental features that are ready to try today, and updates on other areas we're working on now.

</Intro>


<Note>

React Conf 2025 is scheduled for October 7–8 in Henderson, Nevada! 

We're looking for speakers to help us create talks about the features covered in this post. If you're interested in speaking at ReactConf, [please apply here](https://forms.reform.app/react-conf/call-for-speakers/) (no talk proposal required).

For more info on tickets, free streaming, sponsoring, and more, see [the React Conf website](https://conf.react.dev).

</Note>

Today, we're excited to release documentation for two new experimental features that are ready for testing:

- [View Transitions](#view-transitions)
- [Activity](#activity)

We're also sharing updates on new features currently in development:
- [React Performance Tracks](#react-performance-tracks)
- [Compiler IDE Extension](#compiler-ide-extension)
- [Automatic Effect Dependencies](#automatic-effect-dependencies)
- [Fragment Refs](#fragment-refs)
- [Concurrent Stores](#concurrent-stores)

---

# New Experimental Features {/*new-experimental-features*/}

View Transitions and Activity are now ready for testing in `react@experimental`. These features have been tested in production and are stable, but the final API may still change as we incorporate feedback.

You can try them by upgrading React packages to the most recent experimental version:

- `react@experimental`
- `react-dom@experimental`

Read on to learn how to use these features in your app, or check out the newly published docs:

- [`<ViewTransition>`](/reference/react/ViewTransition): A component that lets you activate an animation for a Transition.
- [`addTransitionType`](/reference/react/addTransitionType): A function that allows you to specify the cause of a Transition.
- [`<Activity>`](/reference/react/Activity): A component that lets you hide and show parts of the UI.

## View Transitions {/*view-transitions*/}

React View Transitions are a new experimental feature that makes it easier to add animations to UI transitions in your app. Under-the-hood, these animations use the new [`startViewTransition`](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition) API available in most modern browsers.

To opt-in to animating an element, wrap it in the new `<ViewTransition>` component:

```js
// "what" to animate.
<ViewTransition>
  <div>animate me</div>
</ViewTransition>
```

This new component lets you declaratively define "what" to animate when an animation is activated. 

You can define "when" to animate by using one of these three triggers for a View Transition:

```js
// "when" to animate.

// Transitions
startTransition(() => setState(...));

// Deferred Values
const deferred = useDeferredValue(value);

// Suspense
<Suspense fallback={<Fallback />}>
  <div>Loading...</div>
</Suspense>
```

By default, these animations use the [default CSS animations for View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using#customizing_your_animations) applied (typically a smooth cross-fade). You can use [view transition pseudo-selectors](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using#the_view_transition_pseudo-element_tree) to define "how" the animation runs. For example, you can use `*` to change the default animation for all transitions:

```
// "how" to animate.
::view-transition-old(*) {
  animation: 300ms ease-out fade-out;
}
::view-transition-new(*) {
  animation: 300ms ease-in fade-in;
}
```

When the DOM updates due to an animation trigger&mdash;like `startTransition`, `useDeferredValue`, or a `Suspense` fallback switching to content&mdash;React will use [declarative heuristics](/reference/react/ViewTransition#viewtransition) to automatically determine which `<ViewTransition>` components to activate for the animation. The browser will then run the animation that's defined in CSS.

If you're familiar with the browser's View Transition API and want to know how React supports it, check out [How does `<ViewTransition>` Work](/reference/react/ViewTransition#how-does-viewtransition-work) in the docs. 

In this post, let's take a look at a few examples of how to use View Transitions. 

We'll start with this app, which doesn't animate any of the following interactions:
- Click a video to view the details.
- Click "back" to go back to the feed.
- Type in the list to filter the videos.

<Sandpack>

```js src/App.js active
import TalkDetails from './Details'; import Home from './Home'; import {useRouter} from './router';

export default function App() {
  const {url} = useRouter();

  // 🚩This version doesn't include any animations yet
  return url === '/' ? <Home /> : <TalkDetails />;
}
```

```js src/Details.js
import { fetchVideo, fetchVideoDetails } from "./data";
import { Thumbnail, VideoControls } from "./Videos";
import { useRouter } from "./router";
import Layout from "./Layout";
import { use, Suspense } from "react";
import { ChevronLeft } from "./Icons";

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <Suspense fallback={<VideoInfoFallback />}>
          <VideoInfo id={video.id} />
        </Suspense>
      </div>
    </Layout>
  );
}

```

```js src/Home.js
import { Video } from "./Videos";
import Layout from "./Layout";
import { fetchVideos } from "./data";
import { useId, useState, use } from "react";
import { IconSearch } from "./Icons";

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState("");
  const foundVideos = filterVideos(videos, searchText);
  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <div className="video-list">
        {foundVideos.length === 0 && (
          <div className="no-results">No results</div>
        )}
        <div className="videos">
          {foundVideos.map((video) => (
            <Video key={video.id} video={video} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

```

```js src/Icons.js
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
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
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js
import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();
  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {heading}
          {isPending && <span className="loader"></span>}
        </div>
      </div>

      <div className="bottom">
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
```

```js src/LikeButton.js
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js
import { useState } from "react";
import LikeButton from "./LikeButton";
import { useRouter } from "./router";
import { PauseIcon, PlayIcon } from "./Icons";
import { startTransition } from "react";

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    >
      {children}
    </div>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
  {
    id: '5',
    title: 'Fifth video',
    description: 'Video description',
    image: 'yellow',
  },
  {
    id: '6',
    title: 'Sixth video',
    description: 'Video description',
    image: 'gray',
  },
];

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js
import {
  useState,
  createContext,
  use,
  useTransition,
  useLayoutEffect,
  useEffect,
} from "react";

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

export function Router({ children }) {
  const [routerState, setRouterState] = useState({
    pendingNav: () => {},
    url: document.location.pathname,
  });
  const [isPending, startTransition] = useTransition();

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }
  function navigate(url) {
    // Update router state in transition.
    startTransition(() => {
      go(url);
    });
  }

  function navigateBack(url) {
    // Update router state in transition.
    startTransition(() => {
      go(url);
    });
  }

  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}
```

```css src/styles.css
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}

.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}

.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}

.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}

.thumbnail.yellow {
  background-image: conic-gradient(at top right, #c76a15, #FABD62, #2b3491);
}

.thumbnail.gray {
  background-image: conic-gradient(at top right, #c76a15, #4E5769, #2b3491);
}

.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
}

.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}

.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}

.video .info:hover {
  text-decoration: underline;
}

.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}

.video-description {
  color: #5e687e;
  font-size: 13px;
}

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Note>

#### View Transitions do not replace CSS and JS driven animations {/*view-transitions-do-not-replace-css-and-js-driven-animations*/}

View Transitions are meant to be used for UI transitions such as navigation, expanding, opening, or re-ordering. They are not meant to replace all the animations in your app.

In our example app above, notice that there are already animations when you click the "like" button and in the Suspense fallback glimmer. These are good use cases for CSS animations because they are animating a specific element.

</Note>

### Animating navigations {/*animating-navigations*/}

Our app includes a Suspense-enabled router, with [page transitions already marked as Transitions](/reference/react/useTransition#building-a-suspense-enabled-router), which means navigations are performed with `startTransition`:

```js
function navigate(url) {
  startTransition(() => {
    go(url);
  });
}
```

`startTransition` is a View Transition trigger, so we can add `<ViewTransition>` to animate between pages:

```js
// "what" to animate
<ViewTransition key={url}>
  {url === '/' ? <Home /> : <TalkDetails />}
</ViewTransition>
```

When the `url` changes, the `<ViewTransition>` and new route are rendered. Since the `<ViewTransition>` was updated inside of `startTransition`, the `<ViewTransition>` is activated for an animation.


By default, View Transitions include the browser default cross-fade animation. Adding this to our example, we now have a cross-fade whenever we navigate between pages: 

<Sandpack>

```js src/App.js active
import {unstable_ViewTransition as ViewTransition} from 'react'; import Details from './Details'; import Home from './Home'; import {useRouter} from './router';

export default function App() {
  const {url} = useRouter();
  
  // Use ViewTransition to animate between pages.
  // No additional CSS needed by default.
  return (
    <ViewTransition>
      {url === '/' ? <Home /> : <Details />}
    </ViewTransition>
  );
}
```

```js src/Details.js hidden
import { fetchVideo, fetchVideoDetails } from "./data";
import { Thumbnail, VideoControls } from "./Videos";
import { useRouter } from "./router";
import Layout from "./Layout";
import { use, Suspense } from "react";
import { ChevronLeft } from "./Icons";

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <Suspense fallback={<VideoInfoFallback />}>
          <VideoInfo id={video.id} />
        </Suspense>
      </div>
    </Layout>
  );
}

```

```js src/Home.js hidden
import { Video } from "./Videos";
import Layout from "./Layout";
import { fetchVideos } from "./data";
import { useId, useState, use } from "react";
import { IconSearch } from "./Icons";

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState("");
  const foundVideos = filterVideos(videos, searchText);
  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <div className="video-list">
        {foundVideos.length === 0 && (
          <div className="no-results">No results</div>
        )}
        <div className="videos">
          {foundVideos.map((video) => (
            <Video key={video.id} video={video} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
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
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js
import {unstable_ViewTransition as ViewTransition} from 'react'; import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();
  
  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {heading}
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js hidden
import { useState } from "react";
import LikeButton from "./LikeButton";
import { useRouter } from "./router";
import { PauseIcon, PlayIcon } from "./Icons";
import { startTransition } from "react";

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    >
      {children}
    </div>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
  {
    id: '5',
    title: 'Fifth video',
    description: 'Video description',
    image: 'yellow',
  },
  {
    id: '6',
    title: 'Sixth video',
    description: 'Video description',
    image: 'gray',
  },
];

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js
import {useState, createContext,use,useTransition,useLayoutEffect,useEffect} from "react";

export function Router({ children }) {
  const [isPending, startTransition] = useTransition();
  
  function navigate(url) {
    // Update router state in transition.
    startTransition(() => {
      go(url);
    });
  }
  
  
  
  
  const [routerState, setRouterState] = useState({
    pendingNav: () => {},
    url: document.location.pathname,
  });
  

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }
  

  function navigateBack(url) {
    startTransition(() => {
      go(url);
    });
  }

  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}
```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}

.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}

.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}

.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}

.thumbnail.yellow {
  background-image: conic-gradient(at top right, #c76a15, #FABD62, #2b3491);
}

.thumbnail.gray {
  background-image: conic-gradient(at top right, #c76a15, #4E5769, #2b3491);
}

.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
}

.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}

.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}

.video .info:hover {
  text-decoration: underline;
}

.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}

.video-description {
  color: #5e687e;
  font-size: 13px;
}

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Since our router already updates the route using `startTransition`, this one line change to add `<ViewTransition>` activates with the default cross-fade animation. 

If you're curious how this works, see the docs for [How does `<ViewTransition>` work?](/reference/react/ViewTransition#how-does-viewtransition-work)

<Note>

#### Opting out of `<ViewTransition>` animations {/*opting-out-of-viewtransition-animations*/}

In this example, we're wrapping the root of the app in `<ViewTransition>` for simplicity, but this means that all transitions in the app will be animated, which can lead to unexpected animations. 

To fix, we're wrapping route children with `"none"` so each page can control its own animation:

```js
// Layout.js
<ViewTransition default="none">
  {children}
</ViewTransition>
```

In practice, navigations should be done via "enter" and "exit" props, or by using Transition Types. 

</Note>

### Customizing animations {/*customizing-animations*/}

By default, `<ViewTransition>` includes the default cross-fade from the browser.

To customize animations, you can provide props to the `<ViewTransition>` component to specify which animations to use, based on [how the `<ViewTransition>` activates](/reference/react/ViewTransition#props).

For example, we can slow down the `default` cross fade animation:

```js
<ViewTransition default="slow-fade">
  <Home />
</ViewTransition>
```

And define `slow-fade` in CSS using [view transition classes](/reference/react/ViewTransition#view-transition-class):

```css
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

Now, the cross fade is slower:

<Sandpack>

```js src/App.js active
import { unstable_ViewTransition as ViewTransition } from "react";
import Details from "./Details";
import Home from "./Home";
import { useRouter } from "./router";

export default function App() {
  const { url } = useRouter();

  // Define a default animation of .slow-fade.
  // See animations.css for the animation definiton.
  return (
    <ViewTransition default="slow-fade">
      {url === '/' ? <Home /> : <Details />}
    </ViewTransition>
  );
}
```

```js src/Details.js hidden
import { fetchVideo, fetchVideoDetails } from "./data";
import { Thumbnail, VideoControls } from "./Videos";
import { useRouter } from "./router";
import Layout from "./Layout";
import { use, Suspense } from "react";
import { ChevronLeft } from "./Icons";

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <Suspense fallback={<VideoInfoFallback />}>
          <VideoInfo id={video.id} />
        </Suspense>
      </div>
    </Layout>
  );
}

```

```js src/Home.js hidden
import { Video } from "./Videos";
import Layout from "./Layout";
import { fetchVideos } from "./data";
import { useId, useState, use } from "react";
import { IconSearch } from "./Icons";

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState("");
  const foundVideos = filterVideos(videos, searchText);
  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <div className="video-list">
        {foundVideos.length === 0 && (
          <div className="no-results">No results</div>
        )}
        <div className="videos">
          {foundVideos.map((video) => (
            <Video key={video.id} video={video} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
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
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react'; import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();

  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {heading}
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js hidden
import { useState } from "react";
import LikeButton from "./LikeButton";
import { useRouter } from "./router";
import { PauseIcon, PlayIcon } from "./Icons";
import { startTransition } from "react";

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    >
      {children}
    </div>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
  {
    id: '5',
    title: 'Fifth video',
    description: 'Video description',
    image: 'yellow',
  },
  {
    id: '6',
    title: 'Sixth video',
    description: 'Video description',
    image: 'gray',
  },
];

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js hidden
import {
  useState,
  createContext,
  use,
  useTransition,
  useLayoutEffect,
  useEffect,
} from "react";

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

export function Router({ children }) {
  const [routerState, setRouterState] = useState({
    pendingNav: () => {},
    url: document.location.pathname,
  });
  const [isPending, startTransition] = useTransition();

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }
  function navigate(url) {
    // Update router state in transition.
    startTransition(() => {
      go(url);
    });
  }

  function navigateBack(url) {
    // Update router state in transition.
    startTransition(() => {
      go(url);
    });
  }

  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}
```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}

.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}

.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}

.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}

.thumbnail.yellow {
  background-image: conic-gradient(at top right, #c76a15, #FABD62, #2b3491);
}

.thumbnail.gray {
  background-image: conic-gradient(at top right, #c76a15, #4E5769, #2b3491);
}

.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
}

.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}

.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}

.video .info:hover {
  text-decoration: underline;
}

.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}

.video-description {
  color: #5e687e;
  font-size: 13px;
}

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```


```css src/animations.css
/* Define .slow-fade using view transition classes */
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './animations.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

See [Styling View Transitions](/reference/react/ViewTransition#styling-view-transitions) for a full guide on styling `<ViewTransition>`.

### Shared Element Transitions {/*shared-element-transitions*/}

When two pages include the same element, often you want to animate it from one page to the next.

To do this you can add a unique `name` to the `<ViewTransition>`:

```js
<ViewTransition name={`video-${video.id}`}>
  <Thumbnail video={video} />
</ViewTransition>
```

Now the video thumbnail animates between the two pages:

<Sandpack>

```js src/App.js
import { unstable_ViewTransition as ViewTransition } from "react";
import Details from "./Details";
import Home from "./Home";
import { useRouter } from "./router";

export default function App() {
  const { url } = useRouter();

  // Keeping our default slow-fade.
  // This allows the content not in the shared
  // element transition to cross-fade.
  return (
    <ViewTransition default="slow-fade">
      {url === "/" ? <Home /> : <Details />}
    </ViewTransition>
  );
}
```

```js src/Details.js hidden
import { fetchVideo, fetchVideoDetails } from "./data";
import { Thumbnail, VideoControls } from "./Videos";
import { useRouter } from "./router";
import Layout from "./Layout";
import { use, Suspense } from "react";
import { ChevronLeft } from "./Icons";

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <Suspense fallback={<VideoInfoFallback />}>
          <VideoInfo id={video.id} />
        </Suspense>
      </div>
    </Layout>
  );
}

```

```js src/Home.js hidden
import { Video } from "./Videos";
import Layout from "./Layout";
import { fetchVideos } from "./data";
import { useId, useState, use } from "react";
import { IconSearch } from "./Icons";

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState("");
  const foundVideos = filterVideos(videos, searchText);
  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <div className="video-list">
        {foundVideos.length === 0 && (
          <div className="no-results">No results</div>
        )}
        <div className="videos">
          {foundVideos.map((video) => (
            <Video key={video.id} video={video} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
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
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react'; import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();

  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {heading}
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js active
import { useState, unstable_ViewTransition as ViewTransition } from "react"; import LikeButton from "./LikeButton"; import { useRouter } from "./router"; import { PauseIcon, PlayIcon } from "./Icons"; import { startTransition } from "react";

export function Thumbnail({ video, children }) {
  // Add a name to animate with a shared element transition.
  // This uses the default animation, no additional css needed.
  return (
    <ViewTransition name={`video-${video.id}`}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      >
        {children}
      </div>
    </ViewTransition>
  );
}

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
  {
    id: '5',
    title: 'Fifth video',
    description: 'Video description',
    image: 'yellow',
  },
  {
    id: '6',
    title: 'Sixth video',
    description: 'Video description',
    image: 'gray',
  },
];

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js hidden
import {
  useState,
  createContext,
  use,
  useTransition,
  useLayoutEffect,
  useEffect,
} from "react";

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

export function Router({ children }) {
  const [routerState, setRouterState] = useState({
    pendingNav: () => {},
    url: document.location.pathname,
  });
  const [isPending, startTransition] = useTransition();

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }
  function navigate(url) {
    // Update router state in transition.
    startTransition(() => {
      go(url);
    });
  }

  function navigateBack(url) {
    // Update router state in transition.
    startTransition(() => {
      go(url);
    });
  }

  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}
```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}

.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}

.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}

.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}

.thumbnail.yellow {
  background-image: conic-gradient(at top right, #c76a15, #FABD62, #2b3491);
}

.thumbnail.gray {
  background-image: conic-gradient(at top right, #c76a15, #4E5769, #2b3491);
}

.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
}

.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}

.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}

.video .info:hover {
  text-decoration: underline;
}

.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}

.video-description {
  color: #5e687e;
  font-size: 13px;
}

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```


```css src/animations.css
/* No additional animations needed */









/* Previously defined animations below */





::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './animations.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

By default, React automatically generates a unique `name` for each element activated for a transition (see [How does `<ViewTransition>` work](/reference/react/ViewTransition#how-does-viewtransition-work)). When React sees a transition where a `<ViewTransition>` with a `name` is removed and a new `<ViewTransition>` with the same `name` is added, it will activate a shared element transition.

For more info, see the docs for [Animating a Shared Element](/reference/react/ViewTransition#animating-a-shared-element).

### Animating based on cause {/*animating-based-on-cause*/}

Sometimes, you may want elements to animate differently based on how it was triggered. For this use case, we've added a new API called `addTransitionType` to specify the cause of a transition:

```js {4,11}
function navigate(url) {
  startTransition(() => {
    // Transition type for the cause "nav forward"
    addTransitionType('nav-forward');
    go(url);
  });
}
function navigateBack(url) {
  startTransition(() => {
    // Transition type for the cause "nav backward"
    addTransitionType('nav-back');
    go(url);
  });
}
```

With transition types, you can provide custom animations via props to `<ViewTransition>`. Let's add a shared element transition to the header for "6 Videos" and "Back":

```js {4,5}
<ViewTransition
  name="nav"
  share={{
    'nav-forward': 'slide-forward',
    'nav-back': 'slide-back',
  }}>
  {heading}
</ViewTransition>
```

Here we pass a `share` prop to define how to animate based on the transition type. When the share transition activates from `nav-forward`, the view transition class `slide-forward` is applied. When it's from `nav-back`, the `slide-back` animation is activated. Let's define these animations in CSS:

```css
::view-transition-old(.slide-forward) {
    /* when sliding forward, the "old" page should slide out to left. */
    animation: ...
}

::view-transition-new(.slide-forward) {
    /* when sliding forward, the "new" page should slide in from right. */
    animation: ...
}

::view-transition-old(.slide-back) {
    /* when sliding back, the "old" page should slide out to right. */
    animation: ...
}

::view-transition-new(.slide-back) {
    /* when sliding back, the "new" page should slide in from left. */
    animation: ...
}
```

Now we can animate the header along with thumbnail based on navigation type:

<Sandpack>

```js src/App.js hidden
import { unstable_ViewTransition as ViewTransition } from "react";
import Details from "./Details";
import Home from "./Home";
import { useRouter } from "./router";

export default function App() {
  const { url } = useRouter();

  // Keeping our default slow-fade.
  return (
    <ViewTransition default="slow-fade">
      {url === "/" ? <Home /> : <Details />}
    </ViewTransition>
  );
}
```

```js src/Details.js hidden
import { fetchVideo, fetchVideoDetails } from "./data";
import { Thumbnail, VideoControls } from "./Videos";
import { useRouter } from "./router";
import Layout from "./Layout";
import { use, Suspense } from "react";
import { ChevronLeft } from "./Icons";

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <Suspense fallback={<VideoInfoFallback />}>
          <VideoInfo id={video.id} />
        </Suspense>
      </div>
    </Layout>
  );
}

```

```js src/Home.js hidden
import { Video } from "./Videos";
import Layout from "./Layout";
import { fetchVideos } from "./data";
import { useId, useState, use } from "react";
import { IconSearch } from "./Icons";

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState("");
  const foundVideos = filterVideos(videos, searchText);
  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <div className="video-list">
        {foundVideos.length === 0 && (
          <div className="no-results">No results</div>
        )}
        <div className="videos">
          {foundVideos.map((video) => (
            <Video key={video.id} video={video} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
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
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js active
import {unstable_ViewTransition as ViewTransition} from 'react'; import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();
  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {/* Custom classes based on transition type. */}
          <ViewTransition
            name="nav"
            share={{
              'nav-forward': 'slide-forward',
              'nav-back': 'slide-back',
            }}>
            {heading}
          </ViewTransition>
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js hidden
import { useState, unstable_ViewTransition as ViewTransition } from "react";
import LikeButton from "./LikeButton";
import { useRouter } from "./router";
import { PauseIcon, PlayIcon } from "./Icons";
import { startTransition } from "react";

export function Thumbnail({ video, children }) {
  // Add a name to animate with a shared element transition.
  // This uses the default animation, no additional css needed.
  return (
    <ViewTransition name={`video-${video.id}`}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      >
        {children}
      </div>
    </ViewTransition>
  );
}

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
  {
    id: '5',
    title: 'Fifth video',
    description: 'Video description',
    image: 'yellow',
  },
  {
    id: '6',
    title: 'Sixth video',
    description: 'Video description',
    image: 'gray',
  },
];

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js
import {useState, createContext, use, useTransition, useLayoutEffect, useEffect, unstable_addTransitionType as addTransitionType} from "react";

export function Router({ children }) {
  const [isPending, startTransition] = useTransition();
  
  function navigate(url) {
    startTransition(() => {
      // Transition type for the cause "nav forward"
      addTransitionType('nav-forward');
      go(url);
    });
  }
  function navigateBack(url) {
    startTransition(() => {
      // Transition type for the cause "nav backward"
      addTransitionType('nav-back');
      go(url);
    });
  }


  const [routerState, setRouterState] = useState({pendingNav: () => {}, url: document.location.pathname});

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }
  
  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}

.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}

.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}

.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}

.thumbnail.yellow {
  background-image: conic-gradient(at top right, #c76a15, #FABD62, #2b3491);
}

.thumbnail.gray {
  background-image: conic-gradient(at top right, #c76a15, #4E5769, #2b3491);
}

.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
}

.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}

.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}

.video .info:hover {
  text-decoration: underline;
}

.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}

.video-description {
  color: #5e687e;
  font-size: 13px;
}

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```


```css src/animations.css
/* Animations for view transition classed added by transition type */
::view-transition-old(.slide-forward) {
    /* when sliding forward, the "old" page should slide out to left. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
}

::view-transition-new(.slide-forward) {
    /* when sliding forward, the "new" page should slide in from right. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
}

::view-transition-old(.slide-back) {
    /* when sliding back, the "old" page should slide out to right. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-right;
}

::view-transition-new(.slide-back) {
    /* when sliding back, the "new" page should slide in from left. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-left;
}

/* New keyframes to support our animations above. */
@keyframes fade-in {
    from {
        opacity: 0;
    }
}

@keyframes fade-out {
    to {
        opacity: 0;
    }
}

@keyframes slide-to-right {
    to {
        transform: translateX(50px);
    }
}

@keyframes slide-from-right {
    from {
        transform: translateX(50px);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes slide-to-left {
    to {
        transform: translateX(-50px);
    }
}

@keyframes slide-from-left {
    from {
        transform: translateX(-50px);
    }
    to {
        transform: translateX(0);
    }
}

/* Previously defined animations. */

/* Default .slow-fade. */
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './animations.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

### Animating Suspense Boundaries {/*animating-suspense-boundaries*/}

Suspense will also activate View Transitions. 

To animate the fallback to content, we can wrap `Suspense` with `<ViewTranstion>`:

```js
<ViewTransition>
  <Suspense fallback={<VideoInfoFallback />}>
    <VideoInfo />
  </Suspense>
</ViewTransition>
```

By adding this, the fallback will cross-fade into the content. Click a video and see the video info animate in:

<Sandpack>

```js src/App.js hidden
import { unstable_ViewTransition as ViewTransition } from "react";
import Details from "./Details";
import Home from "./Home";
import { useRouter } from "./router";

export default function App() {
  const { url } = useRouter();

  // Default slow-fade animation.
  return (
    <ViewTransition default="slow-fade">
      {url === "/" ? <Home /> : <Details />}
    </ViewTransition>
  );
}
```

```js src/Details.js active
import { use, Suspense, unstable_ViewTransition as ViewTransition } from "react"; import { fetchVideo, fetchVideoDetails } from "./data"; import { Thumbnail, VideoControls } from "./Videos"; import { useRouter } from "./router"; import Layout from "./Layout"; import { ChevronLeft } from "./Icons";

function VideoDetails({ id }) {
  // Cross-fade the fallback to content.
  return (
    <ViewTransition default="slow-fade">
      <Suspense fallback={<VideoInfoFallback />}>
          <VideoInfo id={id} />
      </Suspense>
    </ViewTransition>
  );
}

function VideoInfoFallback() {
  return (
    <div>
      <div className="fit fallback title"></div>
      <div className="fit fallback description"></div>
    </div>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <VideoDetails id={video.id} />
      </div>
    </Layout>
  );
}

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <div>
      <p className="fit info-title">{details.title}</p>
      <p className="fit info-description">{details.description}</p>
    </div>
  );
}
```

```js src/Home.js hidden
import { Video } from "./Videos";
import Layout from "./Layout";
import { fetchVideos } from "./data";
import { useId, useState, use } from "react";
import { IconSearch } from "./Icons";

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState("");
  const foundVideos = filterVideos(videos, searchText);
  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <div className="video-list">
        {foundVideos.length === 0 && (
          <div className="no-results">No results</div>
        )}
        <div className="videos">
          {foundVideos.map((video) => (
            <Video key={video.id} video={video} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
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
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';
import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();
  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {/* Custom classes based on transition type. */}
          <ViewTransition
            name="nav"
            share={{
              'nav-forward': 'slide-forward',
              'nav-back': 'slide-back',
            }}>
            {heading}
          </ViewTransition>
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js hidden
import { useState, unstable_ViewTransition as ViewTransition } from "react";
import LikeButton from "./LikeButton";
import { useRouter } from "./router";
import { PauseIcon, PlayIcon } from "./Icons";
import { startTransition } from "react";

export function Thumbnail({ video, children }) {
  // Add a name to animate with a shared element transition.
  // This uses the default animation, no additional css needed.
  return (
    <ViewTransition name={`video-${video.id}`}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      >
        {children}
      </div>
    </ViewTransition>
  );
}

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
  {
    id: '5',
    title: 'Fifth video',
    description: 'Video description',
    image: 'yellow',
  },
  {
    id: '6',
    title: 'Sixth video',
    description: 'Video description',
    image: 'gray',
  },
];

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js hidden
import {useState, createContext, use, useTransition, useLayoutEffect, useEffect, unstable_addTransitionType as addTransitionType} from "react";

export function Router({ children }) {
  const [isPending, startTransition] = useTransition();
  const [routerState, setRouterState] = useState({pendingNav: () => {}, url: document.location.pathname});
  function navigate(url) {
    startTransition(() => {
      // Transition type for the cause "nav forward"
      addTransitionType('nav-forward');
      go(url);
    });
  }
  function navigateBack(url) {
    startTransition(() => {
      // Transition type for the cause "nav backward"
      addTransitionType('nav-back');
      go(url);
    });
  }

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }
  
  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}

.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}

.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}

.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}

.thumbnail.yellow {
  background-image: conic-gradient(at top right, #c76a15, #FABD62, #2b3491);
}

.thumbnail.gray {
  background-image: conic-gradient(at top right, #c76a15, #4E5769, #2b3491);
}

.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
}

.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}

.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}

.video .info:hover {
  text-decoration: underline;
}

.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}

.video-description {
  color: #5e687e;
  font-size: 13px;
}

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```


```css src/animations.css
/* Slide the fallback down */
::view-transition-old(.slide-down) {
    animation: 150ms ease-out both fade-out, 150ms ease-out both slide-down;
}

/* Slide the content up */
::view-transition-new(.slide-up) {
    animation: 210ms ease-in 150ms both fade-in, 400ms ease-in both slide-up;
}

/* Define the new keyframes */
@keyframes slide-up {
    from {
        transform: translateY(10px);
    }
    to {
        transform: translateY(0);
    }
}

@keyframes slide-down {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(10px);
    }
}

/* Previously defined animations below */

/* Animations for view transition classed added by transition type */
::view-transition-old(.slide-forward) {
    /* when sliding forward, the "old" page should slide out to left. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
}

::view-transition-new(.slide-forward) {
    /* when sliding forward, the "new" page should slide in from right. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
}

::view-transition-old(.slide-back) {
    /* when sliding back, the "old" page should slide out to right. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-right;
}

::view-transition-new(.slide-back) {
    /* when sliding back, the "new" page should slide in from left. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-left;
}

/* Keyframes to support our animations above. */
@keyframes fade-in {
    from {
        opacity: 0;
    }
}

@keyframes fade-out {
    to {
        opacity: 0;
    }
}

@keyframes slide-to-right {
    to {
        transform: translateX(50px);
    }
}

@keyframes slide-from-right {
    from {
        transform: translateX(50px);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes slide-to-left {
    to {
        transform: translateX(-50px);
    }
}

@keyframes slide-from-left {
    from {
        transform: translateX(-50px);
    }
    to {
        transform: translateX(0);
    }
}

/* Default .slow-fade. */
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './animations.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

We can also provide custom animations using an `exit` on the fallback, and `enter` on the content:

```js {3,8}
<Suspense
  fallback={
    <ViewTransition exit="slide-down">
      <VideoInfoFallback />
    </ViewTransition>
  }
>
  <ViewTransition enter="slide-up">
    <VideoInfo id={id} />
  </ViewTransition>
</Suspense>
```

Here's how we'll define `slide-down` and `slide-up` with CSS:

```css {1, 6}
::view-transition-old(.slide-down) { 
  /* Slide the fallback down */
  animation: ...;
}

::view-transition-new(.slide-up) {
  /* Slide the content up */
  animation: ...;
}
```

Now, the Suspense content replaces the fallback with a sliding animation:

<Sandpack>

```js src/App.js hidden
import { unstable_ViewTransition as ViewTransition } from "react";
import Details from "./Details";
import Home from "./Home";
import { useRouter } from "./router";

export default function App() {
  const { url } = useRouter();

  // Default slow-fade animation.
  return (
    <ViewTransition default="slow-fade">
      {url === "/" ? <Home /> : <Details />}
    </ViewTransition>
  );
}
```

```js src/Details.js active
import { use, Suspense, unstable_ViewTransition as ViewTransition } from "react"; import { fetchVideo, fetchVideoDetails } from "./data"; import { Thumbnail, VideoControls } from "./Videos"; import { useRouter } from "./router"; import Layout from "./Layout"; import { ChevronLeft } from "./Icons";

function VideoDetails({ id }) {
  return (
    <Suspense
      fallback={
        // Animate the fallback down.
        <ViewTransition exit="slide-down">
          <VideoInfoFallback />
        </ViewTransition>
      }
    >
      {/* Animate the content up */}
      <ViewTransition enter="slide-up">
        <VideoInfo id={id} />
      </ViewTransition>
    </Suspense>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <VideoDetails id={video.id} />
      </div>
    </Layout>
  );
}

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}
```

```js src/Home.js hidden
import { Video } from "./Videos";
import Layout from "./Layout";
import { fetchVideos } from "./data";
import { useId, useState, use } from "react";
import { IconSearch } from "./Icons";

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState("");
  const foundVideos = filterVideos(videos, searchText);
  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <div className="video-list">
        {foundVideos.length === 0 && (
          <div className="no-results">No results</div>
        )}
        <div className="videos">
          {foundVideos.map((video) => (
            <Video key={video.id} video={video} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
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
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';
import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();
  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {/* Custom classes based on transition type. */}
          <ViewTransition
            name="nav"
            share={{
              'nav-forward': 'slide-forward',
              'nav-back': 'slide-back',
            }}>
            {heading}
          </ViewTransition>
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js hidden
import { useState, unstable_ViewTransition as ViewTransition } from "react";
import LikeButton from "./LikeButton";
import { useRouter } from "./router";
import { PauseIcon, PlayIcon } from "./Icons";
import { startTransition } from "react";

export function Thumbnail({ video, children }) {
  // Add a name to animate with a shared element transition.
  // This uses the default animation, no additional css needed.
  return (
    <ViewTransition name={`video-${video.id}`}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      >
        {children}
      </div>
    </ViewTransition>
  );
}

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
  {
    id: '5',
    title: 'Fifth video',
    description: 'Video description',
    image: 'yellow',
  },
  {
    id: '6',
    title: 'Sixth video',
    description: 'Video description',
    image: 'gray',
  },
];

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js hidden
import {useState, createContext, use, useTransition, useLayoutEffect, useEffect, unstable_addTransitionType as addTransitionType} from "react";

export function Router({ children }) {
  const [isPending, startTransition] = useTransition();
  const [routerState, setRouterState] = useState({pendingNav: () => {}, url: document.location.pathname});
  function navigate(url) {
    startTransition(() => {
      // Transition type for the cause "nav forward"
      addTransitionType('nav-forward');
      go(url);
    });
  }
  function navigateBack(url) {
    startTransition(() => {
      // Transition type for the cause "nav backward"
      addTransitionType('nav-back');
      go(url);
    });
  }

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }
  
  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}

.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}

.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}

.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}

.thumbnail.yellow {
  background-image: conic-gradient(at top right, #c76a15, #FABD62, #2b3491);
}

.thumbnail.gray {
  background-image: conic-gradient(at top right, #c76a15, #4E5769, #2b3491);
}

.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
}

.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}

.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}

.video .info:hover {
  text-decoration: underline;
}

.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}

.video-description {
  color: #5e687e;
  font-size: 13px;
}

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```


```css src/animations.css
/* Slide the fallback down */
::view-transition-old(.slide-down) {
    animation: 150ms ease-out both fade-out, 150ms ease-out both slide-down;
}

/* Slide the content up */
::view-transition-new(.slide-up) {
    animation: 210ms ease-in 150ms both fade-in, 400ms ease-in both slide-up;
}

/* Define the new keyframes */
@keyframes slide-up {
    from {
        transform: translateY(10px);
    }
    to {
        transform: translateY(0);
    }
}

@keyframes slide-down {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(10px);
    }
}

/* Previously defined animations below */

/* Animations for view transition classed added by transition type */
::view-transition-old(.slide-forward) {
    /* when sliding forward, the "old" page should slide out to left. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
}

::view-transition-new(.slide-forward) {
    /* when sliding forward, the "new" page should slide in from right. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
}

::view-transition-old(.slide-back) {
    /* when sliding back, the "old" page should slide out to right. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-right;
}

::view-transition-new(.slide-back) {
    /* when sliding back, the "new" page should slide in from left. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-left;
}

/* Keyframes to support our animations above. */
@keyframes fade-in {
    from {
        opacity: 0;
    }
}

@keyframes fade-out {
    to {
        opacity: 0;
    }
}

@keyframes slide-to-right {
    to {
        transform: translateX(50px);
    }
}

@keyframes slide-from-right {
    from {
        transform: translateX(50px);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes slide-to-left {
    to {
        transform: translateX(-50px);
    }
}

@keyframes slide-from-left {
    from {
        transform: translateX(-50px);
    }
    to {
        transform: translateX(0);
    }
}

/* Default .slow-fade. */
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './animations.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>


### Animating Lists {/*animating-lists*/}

You can also use `<ViewTransition>` to animate lists of items as they re-order, like in a searchable list of items:

```js {3,5}
<div className="videos">
  {filteredVideos.map((video) => (
    <ViewTransition key={video.id}>
      <Video video={video} />
    </ViewTransition>
  ))}
</div>
```

To activate the ViewTransition, we can use `useDeferredValue`:

```js {2}
const [searchText, setSearchText] = useState('');
const deferredSearchText = useDeferredValue(searchText);
const filteredVideos = filterVideos(videos, deferredSearchText);
```

Now the items animate as you type in the search bar:

<Sandpack>

```js src/App.js hidden
import { unstable_ViewTransition as ViewTransition } from "react";
import Details from "./Details";
import Home from "./Home";
import { useRouter } from "./router";

export default function App() {
  const { url } = useRouter();

  // Default slow-fade animation.
  return (
    <ViewTransition default="slow-fade">
      {url === "/" ? <Home /> : <Details />}
    </ViewTransition>
  );
}
```

```js src/Details.js hidden
import { use, Suspense, unstable_ViewTransition as ViewTransition } from "react";
import { fetchVideo, fetchVideoDetails } from "./data";
import { Thumbnail, VideoControls } from "./Videos";
import { useRouter } from "./router";
import Layout from "./Layout";
import { ChevronLeft } from "./Icons";

function VideoDetails({id}) {
  // Animate from Suspense fallback to content
  return (
    <Suspense
      fallback={
        // Animate the fallback down.
        <ViewTransition exit="slide-down">
          <VideoInfoFallback />
        </ViewTransition>
      }
    >
      {/* Animate the content up */}
      <ViewTransition enter="slide-up">
        <VideoInfo id={id} />
      </ViewTransition>
    </Suspense>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <VideoDetails id={video.id} />
      </div>
    </Layout>
  );
}

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}
```

```js src/Home.js
import { useId, useState, use, useDeferredValue, unstable_ViewTransition as ViewTransition } from "react";import { Video } from "./Videos";import Layout from "./Layout";import { fetchVideos } from "./data";import { IconSearch } from "./Icons";

function SearchList({searchText, videos}) {
  // Activate with useDeferredValue ("when") 
  const deferredSearchText = useDeferredValue(searchText);
  const filteredVideos = filterVideos(videos, deferredSearchText);
  return (
    <div className="video-list">
      <div className="videos">
        {filteredVideos.map((video) => (
          // Animate each item in list ("what") 
          <ViewTransition key={video.id}>
            <Video video={video} />
          </ViewTransition>
        ))}
      </div>
      {filteredVideos.length === 0 && (
        <div className="no-results">No results</div>
      )}
    </div>
  );
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState('');
  
  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <SearchList videos={videos} searchText={searchText} />
    </Layout>
  );
}

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}
```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
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
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';
import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();
  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {/* Custom classes based on transition type. */}
          <ViewTransition
            name="nav"
            share={{
              'nav-forward': 'slide-forward',
              'nav-back': 'slide-back',
            }}>
            {heading}
          </ViewTransition>
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js hidden
import { useState, unstable_ViewTransition as ViewTransition } from "react";
import LikeButton from "./LikeButton";
import { useRouter } from "./router";
import { PauseIcon, PlayIcon } from "./Icons";
import { startTransition } from "react";

export function Thumbnail({ video, children }) {
  // Add a name to animate with a shared element transition.
  // This uses the default animation, no additional css needed.
  return (
    <ViewTransition name={`video-${video.id}`}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      >
        {children}
      </div>
    </ViewTransition>
  );
}

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
  {
    id: '5',
    title: 'Fifth video',
    description: 'Video description',
    image: 'yellow',
  },
  {
    id: '6',
    title: 'Sixth video',
    description: 'Video description',
    image: 'gray',
  },
];

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js hidden
import {useState, createContext, use, useTransition, useLayoutEffect, useEffect, unstable_addTransitionType as addTransitionType} from "react";

export function Router({ children }) {
  const [isPending, startTransition] = useTransition();
  const [routerState, setRouterState] = useState({pendingNav: () => {}, url: document.location.pathname});
  function navigate(url) {
    startTransition(() => {
      // Transition type for the cause "nav forward"
      addTransitionType('nav-forward');
      go(url);
    });
  }
  function navigateBack(url) {
    startTransition(() => {
      // Transition type for the cause "nav backward"
      addTransitionType('nav-back');
      go(url);
    });
  }

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }
  
  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}

.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}

.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}

.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}

.thumbnail.yellow {
  background-image: conic-gradient(at top right, #c76a15, #FABD62, #2b3491);
}

.thumbnail.gray {
  background-image: conic-gradient(at top right, #c76a15, #4E5769, #2b3491);
}

.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
}

.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}

.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}

.video .info:hover {
  text-decoration: underline;
}

.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}

.video-description {
  color: #5e687e;
  font-size: 13px;
}

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```


```css src/animations.css
/* No additional animations needed */









/* Previously defined animations below */






/* Slide animation for Suspense */
::view-transition-old(.slide-down) {
    animation: 150ms ease-out both fade-out, 150ms ease-out both slide-down;
}

::view-transition-new(.slide-up) {
    animation: 210ms ease-in 150ms both fade-in, 400ms ease-in both slide-up;
}

/* Animations for view transition classed added by transition type */
::view-transition-old(.slide-forward) {
    /* when sliding forward, the "old" page should slide out to left. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
}

::view-transition-new(.slide-forward) {
    /* when sliding forward, the "new" page should slide in from right. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
}

::view-transition-old(.slide-back) {
    /* when sliding back, the "old" page should slide out to right. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-right;
}

::view-transition-new(.slide-back) {
    /* when sliding back, the "new" page should slide in from left. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-left;
}

/* Keyframes to support our animations above. */
@keyframes slide-up {
    from {
        transform: translateY(10px);
    }
    to {
        transform: translateY(0);
    }
}

@keyframes slide-down {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(10px);
    }
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
}

@keyframes fade-out {
    to {
        opacity: 0;
    }
}

@keyframes slide-to-right {
    to {
        transform: translateX(50px);
    }
}

@keyframes slide-from-right {
    from {
        transform: translateX(50px);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes slide-to-left {
    to {
        transform: translateX(-50px);
    }
}

@keyframes slide-from-left {
    from {
        transform: translateX(-50px);
    }
    to {
        transform: translateX(0);
    }
}


/* Default .slow-fade. */
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './animations.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

### Final result {/*final-result*/}

By adding a few `<ViewTransition>` components and a few lines of CSS, we were able to add all the animations above into the final result.

We're excited about View Transitions and think they will level up the apps you're able to build. They're ready to start trying today in the experimental channel of React releases.

Let's remove the slow fade, and take a look at the final result:

<Sandpack>

```js src/App.js
import {unstable_ViewTransition as ViewTransition} from 'react'; import Details from './Details'; import Home from './Home'; import {useRouter} from './router';

export default function App() {
  const {url} = useRouter();

  // Animate with a cross fade between pages.
  return (
    <ViewTransition key={url}>
      {url === '/' ? <Home /> : <Details />}
    </ViewTransition>
  );
}
```

```js src/Details.js
import { use, Suspense, unstable_ViewTransition as ViewTransition } from "react"; import { fetchVideo, fetchVideoDetails } from "./data"; import { Thumbnail, VideoControls } from "./Videos"; import { useRouter } from "./router"; import Layout from "./Layout"; import { ChevronLeft } from "./Icons";

function VideoDetails({id}) {
  // Animate from Suspense fallback to content
  return (
    <Suspense
      fallback={
        // Animate the fallback down.
        <ViewTransition exit="slide-down">
          <VideoInfoFallback />
        </ViewTransition>
      }
    >
      {/* Animate the content up */}
      <ViewTransition enter="slide-up">
        <VideoInfo id={id} />
      </ViewTransition>
    </Suspense>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <VideoDetails id={video.id} />
      </div>
    </Layout>
  );
}

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}
```

```js src/Home.js
import { useId, useState, use, useDeferredValue, unstable_ViewTransition as ViewTransition } from "react";import { Video } from "./Videos";import Layout from "./Layout";import { fetchVideos } from "./data";import { IconSearch } from "./Icons";

function SearchList({searchText, videos}) {
  // Activate with useDeferredValue ("when") 
  const deferredSearchText = useDeferredValue(searchText);
  const filteredVideos = filterVideos(videos, deferredSearchText);
  return (
    <div className="video-list">
      <div className="videos">
        {filteredVideos.map((video) => (
          // Animate each item in list ("what") 
          <ViewTransition key={video.id}>
            <Video video={video} />
          </ViewTransition>
        ))}
      </div>
      {filteredVideos.length === 0 && (
        <div className="no-results">No results</div>
      )}
    </div>
  );
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState('');
  
  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <SearchList videos={videos} searchText={searchText} />
    </Layout>
  );
}

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}
```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
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
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js
import {unstable_ViewTransition as ViewTransition} from 'react'; import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();
  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {/* Custom classes based on transition type. */}
          <ViewTransition
            name="nav"
            share={{
              'nav-forward': 'slide-forward',
              'nav-back': 'slide-back',
            }}>
            {heading}
          </ViewTransition>
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js
import { useState, unstable_ViewTransition as ViewTransition } from "react"; import LikeButton from "./LikeButton"; import { useRouter } from "./router"; import { PauseIcon, PlayIcon } from "./Icons"; import { startTransition } from "react";

export function Thumbnail({ video, children }) {
  // Add a name to animate with a shared element transition.
  return (
    <ViewTransition name={`video-${video.id}`}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      >
        {children}
      </div>
    </ViewTransition>
  );
}



export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
  {
    id: '5',
    title: 'Fifth video',
    description: 'Video description',
    image: 'yellow',
  },
  {
    id: '6',
    title: 'Sixth video',
    description: 'Video description',
    image: 'gray',
  },
];

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js
import {useState, createContext, use, useTransition, useLayoutEffect, useEffect, unstable_addTransitionType as addTransitionType} from "react";

export function Router({ children }) {
  const [isPending, startTransition] = useTransition();
  function navigate(url) {
    startTransition(() => {
      // Transition type for the cause "nav forward"
      addTransitionType('nav-forward');
      go(url);
    });
  }
  function navigateBack(url) {
    startTransition(() => {
      // Transition type for the cause "nav backward"
      addTransitionType('nav-back');
      go(url);
    });
  }

  const [routerState, setRouterState] = useState({pendingNav: () => {}, url: document.location.pathname});
  
  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }
  
  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}

.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}

.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}

.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}

.thumbnail.yellow {
  background-image: conic-gradient(at top right, #c76a15, #FABD62, #2b3491);
}

.thumbnail.gray {
  background-image: conic-gradient(at top right, #c76a15, #4E5769, #2b3491);
}

.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
}

.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}

.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}

.video .info:hover {
  text-decoration: underline;
}

.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}

.video-description {
  color: #5e687e;
  font-size: 13px;
}

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```


```css src/animations.css
/* Slide animations for Suspense the fallback down */
::view-transition-old(.slide-down) {
    animation: 150ms ease-out both fade-out, 150ms ease-out both slide-down;
}

::view-transition-new(.slide-up) {
    animation: 210ms ease-in 150ms both fade-in, 400ms ease-in both slide-up;
}

/* Animations for view transition classed added by transition type */
::view-transition-old(.slide-forward) {
    /* when sliding forward, the "old" page should slide out to left. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
}

::view-transition-new(.slide-forward) {
    /* when sliding forward, the "new" page should slide in from right. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
}

::view-transition-old(.slide-back) {
    /* when sliding back, the "old" page should slide out to right. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-right;
}

::view-transition-new(.slide-back) {
    /* when sliding back, the "new" page should slide in from left. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-left;
}

/* Keyframes to support our animations above. */
@keyframes slide-up {
    from {
        transform: translateY(10px);
    }
    to {
        transform: translateY(0);
    }
}

@keyframes slide-down {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(10px);
    }
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
}

@keyframes fade-out {
    to {
        opacity: 0;
    }
}

@keyframes slide-to-right {
    to {
        transform: translateX(50px);
    }
}

@keyframes slide-from-right {
    from {
        transform: translateX(50px);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes slide-to-left {
    to {
        transform: translateX(-50px);
    }
}

@keyframes slide-from-left {
    from {
        transform: translateX(-50px);
    }
    to {
        transform: translateX(0);
    }
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './animations.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

If you're curious to know more about how they work, check out [How Does `<ViewTransition>` Work](/reference/react/ViewTransition#how-does-viewtransition-work) in the docs.

_For more background on how we built View Transitions, see: [#31975](https://github.com/facebook/react/pull/31975), [#32105](https://github.com/facebook/react/pull/32105), [#32041](https://github.com/facebook/react/pull/32041), [#32734](https://github.com/facebook/react/pull/32734), [#32797](https://github.com/facebook/react/pull/32797) [#31999](https://github.com/facebook/react/pull/31999), [#32031](https://github.com/facebook/react/pull/32031), [#32050](https://github.com/facebook/react/pull/32050), [#32820](https://github.com/facebook/react/pull/32820), [#32029](https://github.com/facebook/react/pull/32029), [#32028](https://github.com/facebook/react/pull/32028), and [#32038](https://github.com/facebook/react/pull/32038) by [@sebmarkbage](https://twitter.com/sebmarkbage) (thanks Seb!)._

---

## Activity {/*activity*/}

In [past](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#offscreen) [updates](/blog/2024/02/15/react-labs-what-we-have-been-working-on-february-2024#offscreen-renamed-to-activity), we shared that we were researching an API to allow components to be visually hidden and deprioritized, preserving UI state with reduced performance costs relative to unmounting or hiding with CSS.

We're now ready to share the API and how it works, so you can start testing it in experimental React versions.

`<Activity>` is a new component to hide and show parts of the UI:

```js [[1, 1, "'visible'"], [2, 1, "'hidden'"]]
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Page />
</Activity>
```

When an Activity is <CodeStep step={1}>visible</CodeStep> it's rendered as normal. When an Activity is <CodeStep step={2}>hidden</CodeStep> it is unmounted, but will save its state and continue to render at a lower priority than anything visible on screen.

You can use `Activity` to save state for parts of the UI the user isn't using, or pre-render parts that a user is likely to use next.

Let's look at some examples improving the View Transition examples above.

<Note>

**Effects don’t mount when an Activity is hidden.**

When an `<Activity>` is `hidden`, Effects are unmounted. Conceptually, the component is unmounted, but React saves the state for later.

In practice, this works as expected if you have followed the [You Might Not Need an Effect](/learn/you-might-not-need-an-effect) guide. To eagerly find problematic Effects, we recommend adding [`<StrictMode>`](/reference/react/StrictMode) which will eagerly perform Activity unmounts and mounts to catch any unexpected side effects.

</Note>

### Restoring state with Activity {/*restoring-state-with-activity*/}

When a user navigates away from a page, it's common to stop rendering the old page:

```js {6,7}
function App() {
  const { url } = useRouter();
  
  return (
    <>
      {url === '/' && <Home />}
      {url !== '/' && <Details />}
    </>
  );
}
```

However, this means if the user goes back to the old page, all of the previous state is lost. For example, if the `<Home />` page has an `<input>` field, when the user leaves the page the `<input>` is unmounted, and all of the text they had typed is lost.

Activity allows you to keep the state around as the user changes pages, so when they come back they can resume where they left off. This is done by wrapping part of the tree in `<Activity>` and toggling the `mode`:

```js {6-8}
function App() {
  const { url } = useRouter();
  
  return (
    <>
      <Activity mode={url === '/' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      {url !== '/' && <Details />}
    </>
  );
}
```

With this change, we can improve on our View Transitions example above. Before, when you searched for a video, selected one, and returned, your search filter was lost. With Activity, your search filter is restored and you can pick up where you left off.

Try searching for a video, selecting it, and clicking "back":

<Sandpack>

```js src/App.js
import { unstable_ViewTransition as ViewTransition, unstable_Activity as Activity } from "react"; import Details from "./Details"; import Home from "./Home"; import { useRouter } from "./router";

export default function App() {
  const { url } = useRouter();
  
  return (
    // View Transitions know about Activity
    <ViewTransition>
      {/* Render Home in Activity so we don't lose state */}
      <Activity mode={url === '/' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      {url !== '/' && <Details />}
    </ViewTransition>
  );
}
```

```js src/Details.js hidden
import { use, Suspense, unstable_ViewTransition as ViewTransition } from "react";
import { fetchVideo, fetchVideoDetails } from "./data";
import { Thumbnail, VideoControls } from "./Videos";
import { useRouter } from "./router";
import Layout from "./Layout";
import { ChevronLeft } from "./Icons";

function VideoDetails({id}) {
  // Animate from Suspense fallback to content
  return (
    <Suspense
      fallback={
        // Animate the fallback down.
        <ViewTransition exit="slide-down">
          <VideoInfoFallback />
        </ViewTransition>
      }
    >
      {/* Animate the content up */}
      <ViewTransition enter="slide-up">
        <VideoInfo id={id} />
      </ViewTransition>
    </Suspense>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <VideoDetails id={video.id} />
      </div>
    </Layout>
  );
}

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}
```

```js src/Home.js hidden
import { useId, useState, use, useDeferredValue, unstable_ViewTransition as ViewTransition } from "react";import { Video } from "./Videos";import Layout from "./Layout";import { fetchVideos } from "./data";import { IconSearch } from "./Icons";

function SearchList({searchText, videos}) {
  // Activate with useDeferredValue ("when") 
  const deferredSearchText = useDeferredValue(searchText);
  const filteredVideos = filterVideos(videos, deferredSearchText);
  return (
    <div className="video-list">
      {filteredVideos.length === 0 && (
        <div className="no-results">No results</div>
      )}
      <div className="videos">
        {filteredVideos.map((video) => (
          // Animate each item in list ("what") 
          <ViewTransition key={video.id}>
            <Video video={video} />
          </ViewTransition>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState('');
  
  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <SearchList videos={videos} searchText={searchText} />
    </Layout>
  );
}

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}
```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
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
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react'; import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();
  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {/* Custom classes based on transition type. */}
          <ViewTransition
            name="nav"
            share={{
              'nav-forward': 'slide-forward',
              'nav-back': 'slide-back',
            }}>
            {heading}
          </ViewTransition>
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js hidden
import { useState, unstable_ViewTransition as ViewTransition } from "react";
import LikeButton from "./LikeButton";
import { useRouter } from "./router";
import { PauseIcon, PlayIcon } from "./Icons";
import { startTransition } from "react";

export function Thumbnail({ video, children }) {
  // Add a name to animate with a shared element transition.
  // This uses the default animation, no additional css needed.
  return (
    <ViewTransition name={`video-${video.id}`}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      >
        {children}
      </div>
    </ViewTransition>
  );
}

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
  {
    id: '5',
    title: 'Fifth video',
    description: 'Video description',
    image: 'yellow',
  },
  {
    id: '6',
    title: 'Sixth video',
    description: 'Video description',
    image: 'gray',
  },
];

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js hidden
import {useState, createContext, use, useTransition, useLayoutEffect, useEffect, unstable_addTransitionType as addTransitionType} from "react";

export function Router({ children }) {
  const [isPending, startTransition] = useTransition();
  const [routerState, setRouterState] = useState({pendingNav: () => {}, url: document.location.pathname});
  function navigate(url) {
    startTransition(() => {
      // Transition type for the cause "nav forward"
      addTransitionType('nav-forward');
      go(url);
    });
  }
  function navigateBack(url) {
    startTransition(() => {
      // Transition type for the cause "nav backward"
      addTransitionType('nav-back');
      go(url);
    });
  }

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }
  
  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}

.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}

.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}

.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}

.thumbnail.yellow {
  background-image: conic-gradient(at top right, #c76a15, #FABD62, #2b3491);
}

.thumbnail.gray {
  background-image: conic-gradient(at top right, #c76a15, #4E5769, #2b3491);
}

.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
}

.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}

.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}

.video .info:hover {
  text-decoration: underline;
}

.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}

.video-description {
  color: #5e687e;
  font-size: 13px;
}

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```


```css src/animations.css
/* No additional animations needed */









/* Previously defined animations below */






/* Slide animations for Suspense the fallback down */
::view-transition-old(.slide-down) {
    animation: 150ms ease-out both fade-out, 150ms ease-out both slide-down;
}

::view-transition-new(.slide-up) {
    animation: 210ms ease-in 150ms both fade-in, 400ms ease-in both slide-up;
}

/* Animations for view transition classed added by transition type */
::view-transition-old(.slide-forward) {
    /* when sliding forward, the "old" page should slide out to left. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
}

::view-transition-new(.slide-forward) {
    /* when sliding forward, the "new" page should slide in from right. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
}

::view-transition-old(.slide-back) {
    /* when sliding back, the "old" page should slide out to right. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-right;
}

::view-transition-new(.slide-back) {
    /* when sliding back, the "new" page should slide in from left. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-left;
}

/* Keyframes to support our animations above. */
@keyframes slide-up {
    from {
        transform: translateY(10px);
    }
    to {
        transform: translateY(0);
    }
}

@keyframes slide-down {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(10px);
    }
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
}

@keyframes fade-out {
    to {
        opacity: 0;
    }
}

@keyframes slide-to-right {
    to {
        transform: translateX(50px);
    }
}

@keyframes slide-from-right {
    from {
        transform: translateX(50px);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes slide-to-left {
    to {
        transform: translateX(-50px);
    }
}

@keyframes slide-from-left {
    from {
        transform: translateX(-50px);
    }
    to {
        transform: translateX(0);
    }
}

/* Default .slow-fade. */
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './animations.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

### Pre-rendering with Activity {/*prerender-with-activity*/}

Sometimes, you may want to prepare the next part of the UI a user is likely to use ahead of time, so it's ready by the time they are ready to use it. This is especially useful if the next route needs to suspend on data it needs to render, because you can help ensure the data is already fetched before the user navigates.

For example, our app currently needs to suspend to load the data for each video when you select one. We can improve this by rendering all of the pages in a hidden `<Activity>` until the user navigates:

```js {2,5,8}
<ViewTransition>
  <Activity mode={url === '/' ? 'visible' : 'hidden'}>
    <Home />
  </Activity>
  <Activity mode={url === '/details/1' ? 'visible' : 'hidden'}>
    <Details id={id} />
  </Activity>
  <Activity mode={url === '/details/1' ? 'visible' : 'hidden'}>
    <Details id={id} />
  </Activity>
<ViewTransition>
```

With this update, if the content on the next page has time to pre-render, it will animate in without the Suspense fallback. Click a video, and notice that the video title and description on the Details page render immediately, without a fallback:

<Sandpack>

```js src/App.js
import { unstable_ViewTransition as ViewTransition, unstable_Activity as Activity, use } from "react"; import Details from "./Details"; import Home from "./Home"; import { useRouter } from "./router"; import {fetchVideos} from './data'

export default function App() {
  const { url } = useRouter();
  const videoId = url.split("/").pop();
  const videos = use(fetchVideos());
  
  return (
    <ViewTransition>
      {/* Render videos in Activity to pre-render them */}
      {videos.map(({id}) => (
        <Activity key={id} mode={videoId === id ? 'visible' : 'hidden'}>
          <Details id={id}/>
        </Activity>
      ))}
      <Activity mode={url === '/' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
    </ViewTransition>
  );
}
```

```js src/Details.js
import { use, Suspense, unstable_ViewTransition as ViewTransition } from "react"; import { fetchVideo, fetchVideoDetails } from "./data"; import { Thumbnail, VideoControls } from "./Videos"; import { useRouter } from "./router"; import Layout from "./Layout"; import { ChevronLeft } from "./Icons";

function VideoDetails({id}) {
  // Animate from Suspense fallback to content.
  // If this is pre-rendered then the fallback
  // won't need to show.
  return (
    <Suspense
      fallback={
        // Animate the fallback down.
        <ViewTransition exit="slide-down">
          <VideoInfoFallback />
        </ViewTransition>
      }
    >
      {/* Animate the content up */}
      <ViewTransition enter="slide-up">
        <VideoInfo id={id} />
      </ViewTransition>
    </Suspense>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details({id}) {
  const { url, navigateBack } = useRouter();
  const video = use(fetchVideo(id));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <VideoDetails id={video.id} />
      </div>
    </Layout>
  );
}

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}
```

```js src/Home.js hidden
import { useId, useState, use, useDeferredValue, unstable_ViewTransition as ViewTransition } from "react";import { Video } from "./Videos";import Layout from "./Layout";import { fetchVideos } from "./data";import { IconSearch } from "./Icons";

function SearchList({searchText, videos}) {
  // Activate with useDeferredValue ("when") 
  const deferredSearchText = useDeferredValue(searchText);
  const filteredVideos = filterVideos(videos, deferredSearchText);
  return (
    <div className="video-list">
      {filteredVideos.length === 0 && (
        <div className="no-results">No results</div>
      )}
      <div className="videos">
        {filteredVideos.map((video) => (
          // Animate each item in list ("what") 
          <ViewTransition key={video.id}>
            <Video video={video} />
          </ViewTransition>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState('');
  
  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <SearchList videos={videos} searchText={searchText} />
    </Layout>
  );
}

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}
```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
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
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react'; import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();
  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {/* Custom classes based on transition type. */}
          <ViewTransition
            name="nav"
            share={{
              'nav-forward': 'slide-forward',
              'nav-back': 'slide-back',
            }}>
            {heading}
          </ViewTransition>
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js hidden
import { useState, unstable_ViewTransition as ViewTransition } from "react";
import LikeButton from "./LikeButton";
import { useRouter } from "./router";
import { PauseIcon, PlayIcon } from "./Icons";
import { startTransition } from "react";

export function Thumbnail({ video, children }) {
  // Add a name to animate with a shared element transition.
  // This uses the default animation, no additional css needed.
  return (
    <ViewTransition name={`video-${video.id}`}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      >
        {children}
      </div>
    </ViewTransition>
  );
}

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
  {
    id: '5',
    title: 'Fifth video',
    description: 'Video description',
    image: 'yellow',
  },
  {
    id: '6',
    title: 'Sixth video',
    description: 'Video description',
    image: 'gray',
  },
];

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js hidden
import {useState, createContext, use, useTransition, useLayoutEffect, useEffect, unstable_addTransitionType as addTransitionType} from "react";

export function Router({ children }) {
  const [isPending, startTransition] = useTransition();
  const [routerState, setRouterState] = useState({pendingNav: () => {}, url: document.location.pathname});
  function navigate(url) {
    startTransition(() => {
      // Transition type for the cause "nav forward"
      addTransitionType('nav-forward');
      go(url);
    });
  }
  function navigateBack(url) {
    startTransition(() => {
      // Transition type for the cause "nav backward"
      addTransitionType('nav-back');
      go(url);
    });
  }

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }
  
  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}

.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}

.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}

.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}

.thumbnail.yellow {
  background-image: conic-gradient(at top right, #c76a15, #FABD62, #2b3491);
}

.thumbnail.gray {
  background-image: conic-gradient(at top right, #c76a15, #4E5769, #2b3491);
}

.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
}

.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}

.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}

.video .info:hover {
  text-decoration: underline;
}

.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}

.video-description {
  color: #5e687e;
  font-size: 13px;
}

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```


```css src/animations.css
/* No additional animations needed */









/* Previously defined animations below */






/* Slide animations for Suspense the fallback down */
::view-transition-old(.slide-down) {
    animation: 150ms ease-out both fade-out, 150ms ease-out both slide-down;
}

::view-transition-new(.slide-up) {
    animation: 210ms ease-in 150ms both fade-in, 400ms ease-in both slide-up;
}

/* Animations for view transition classed added by transition type */
::view-transition-old(.slide-forward) {
    /* when sliding forward, the "old" page should slide out to left. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
}

::view-transition-new(.slide-forward) {
    /* when sliding forward, the "new" page should slide in from right. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
}

::view-transition-old(.slide-back) {
    /* when sliding back, the "old" page should slide out to right. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-right;
}

::view-transition-new(.slide-back) {
    /* when sliding back, the "new" page should slide in from left. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-left;
}

/* Keyframes to support our animations above. */
@keyframes slide-up {
    from {
        transform: translateY(10px);
    }
    to {
        transform: translateY(0);
    }
}

@keyframes slide-down {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(10px);
    }
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
}

@keyframes fade-out {
    to {
        opacity: 0;
    }
}

@keyframes slide-to-right {
    to {
        transform: translateX(50px);
    }
}

@keyframes slide-from-right {
    from {
        transform: translateX(50px);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes slide-to-left {
    to {
        transform: translateX(-50px);
    }
}

@keyframes slide-from-left {
    from {
        transform: translateX(-50px);
    }
    to {
        transform: translateX(0);
    }
}

/* Default .slow-fade. */
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './animations.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

### Server-Side Rendering with Activity {/*server-side-rendering-with-activity*/}

When using Activity on a page that uses server-side rendering (SSR), there are additional optimizations.

If part of the page is rendered with `mode="hidden"`, then it will not be included in the SSR response. Instead, React will schedule a client render for the content inside Activity while the rest of the page hydrates, prioritizing the visible content on screen.

For parts of the UI rendered with `mode="visible"`, React will de-prioritize hydration of content within Activity, similar to how Suspense content is hydrated at a lower priority. If the user interacts with the page, we'll prioritize hydration within the boundary if needed.

These are advanced use cases, but they show the additional benefits considered with Activity.

### Future modes for Activity {/*future-modes-for-activity*/}

In the future, we may add more modes to Activity.

For example, a common use case is rendering a modal, where the previous "inactive" page is visible behind the "active" modal view. The "hidden" mode does not work for this use case because it's not visible and not included in SSR.

Instead, we're considering a new mode that would keep the content visible&mdash;and included in SSR&mdash;but keep it unmounted and de-prioritize updates. This mode may also need to "pause" DOM updates, since it can be distracting to see backgrounded content updating while a modal is open.

Another mode we're considering for Activity is the ability to automatically destroy state for hidden Activities if there is too much memory being used. Since the component is already unmounted, it may be preferable to destroy state for the least recently used hidden parts of the app rather than consume too many resources.

These are areas we're still exploring, and we'll share more as we make progress. For more information on what Activity includes today, [check out the docs](/reference/react/Activity).

---

# Features in development {/*features-in-development*/}

We're also developing features to help solve the common problems below. 

As we iterate on possible solutions, you may see some potential APIs we're testing being shared based on the PRs we are landing. Please keep in mind that as we try different ideas, we often change or remove different solutions after trying them out. 

When the solutions we're working on are shared too early, it can create churn and confusion in the community. To balance being transparent and limiting confusion, we're sharing the problems we're currently developing solutions for, without sharing a particular solution we have in mind. 

As these features progress, we'll announce them on the blog with docs included so you can try them out. 

## React Performance Tracks {/*react-performance-tracks*/}

We're working on a new set of custom tracks to performance profilers using browser APIs that [allow adding custom tracks](https://developer.chrome.com/docs/devtools/performance/extension) to provide more information about the performance of your React app.

This feature is still in progress, so we're not ready to publish docs to fully release it as an experimental feature yet. You can get a sneak preview when using an experimental version of React, which will automatically add the performance tracks to profiles:

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <picture >
      <source srcset="/images/blog/react-labs-april-2025/perf_tracks.png" />
      <img className="w-full light-image" src="/images/blog/react-labs-april-2025/perf_tracks.webp" />
  </picture>
  <picture >
      <source srcset="/images/blog/react-labs-april-2025/perf_tracks_dark.png" />
      <img className="w-full dark-image" src="/images/blog/react-labs-april-2025/perf_tracks_dark.webp" />
  </picture>
</div>

There are a few known issues we plan to address such as performance, and the scheduler track not always "connecting" work across Suspended trees, so it's not quite ready to try. We're also still collecting feedback from early adopters to improve the design and usability of the tracks.

Once we solve those issues, we'll publish experimental docs and share that it's ready to try.

---

## Automatic Effect Dependencies {/*automatic-effect-dependencies*/}

When we released hooks, we had three motivations:

- **Sharing code between components**: hooks replaced patterns like render props and higher-order components to allow you to reuse stateful logic without changing your component hierarchy.
- **Think in terms of function, not lifecycles**: hooks let you split one component into smaller functions based on what pieces are related (such as setting up a subscription or fetching data), rather than forcing a split based on lifecycle methods.
- **Support ahead-of-time compilation**: hooks were designed to support ahead-of-time compilation with less pitfalls causing unintentional de-optimizations caused by lifecycle methods, and limitations of classes.

Since their release, hooks have been successful at *sharing code between components*. Hooks are now the favored way to share logic between components, and there are less use cases for render props and higher order components. Hooks have also been successful at supporting features like Fast Refresh that were not possible with class components. 

### Effects can be hard {/*effects-can-be-hard*/}

Unfortunately, some hooks are still hard to think in terms of function instead of lifecycles. Effects specifically are still hard to understand and are the most common pain point we hear from developers. Last year, we spent a significant amount of time researching how Effects were used, and how those use cases could be simplified and easier to understand.

We found that often, the confusion is from using an Effect when you don't need to. The [You Might Not Need an Effect](/learn/you-might-not-need-an-effect) guide covers many cases for when Effects are not the right solution. However, even when an Effect is the right fit for a problem, Effects can still be harder to understand than class component lifecycles.

We believe one of the reasons for confusion is that developers to think of Effects from the _component's_ perspective (like a lifecycle), instead of the _Effects_ point of view (what the Effect does).

Let's look at an example [from the docs](/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective):

```js
useEffect(() => {
  // Your Effect connected to the room specified with roomId...
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => {
    // ...until it disconnected
    connection.disconnect();
  };
}, [roomId]);
```

Many users would read this code as "on mount, connect to the roomId. whenever `roomId` changes, disconnect to the old room and re-create the connection". However, this is thinking from the component's lifecycle perspective, which means you will need to think of every component lifecycle state to write the Effect correctly. This can be difficult, so it's understandable that Effects seem harder than class lifecycles when using the component perspective.

### Effects without dependencies {/*effects-without-dependencies*/}

Instead, it's better to think from the Effect's perspective. The Effect doesn't know about the component lifecycles. It only describes how to start synchronization and how to stop it. When users think of Effects in this way, their Effects tend to be easier to write, and more resilient to being started and stopped as many times as is needed.

We spent some time researching why Effects are thought of from the component perspective, and we think one of the reasons is the dependency array. Since you have to write it, it's right there and in your face reminding you of what you're "reacting" to and baiting you into the mental model of 'do this when these values change'.

When we released hooks, we knew we could make them easier to use with ahead-of-time compilation. With the React Compiler, you're now able to avoid writing `useCallback` and `useMemo` yourself in most cases. For Effects, the compiler can insert the dependencies for you:

```js
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => {
    connection.disconnect();
  };
}); // compiler inserted dependencies. 
```

With this code, the React Compiler can infer the dependencies for you and insert them automatically so you don't need to see or write them. With features like [the IDE extension](#compiler-ide-extension) and [`useEffectEvent`](/reference/react/experimental_useEffectEvent), we can provide a CodeLens to show you what the Compiler inserted for times you need to debug, or to optimize by removing a dependency. This helps reinforce the correct mental model for writing Effects, which can run at any time to synchronize your component or hook's state with something else.

Our hope is that automatically inserting dependencies is not only easier to write, but that it also makes them easier to understand by forcing you to think in terms of what the Effect does, and not in component lifecycles. 

---

## Compiler IDE Extension {/*compiler-ide-extension*/}

Earlier this week [we shared](/blog/2025/04/21/react-compiler-rc) the React Compiler release candidate, and we're working towards shipping the first SemVer stable version of the compiler in the coming months.

We've also begun exploring ways to use the React Compiler to provide information that can improve understanding and debugging your code. One idea we've started exploring is a new experimental LSP-based React IDE extension powered by React Compiler, similar to the extension used in [Lauren Tan's React Conf talk](https://conf2024.react.dev/talks/5).

Our idea is that we can use the compiler's static analysis to provide more information, suggestions, and optimization opportunities directly in your IDE. For example, we can provide diagnostics for code breaking the Rules of React, hovers to show if components and hooks were optimized by the compiler, or a CodeLens to see [automatically inserted Effect dependencies](#automatic-effect-dependencies).

The IDE extension is still an early exploration, but we'll share our progress in future updates.

---

## Fragment Refs {/*fragment-refs*/}

Many DOM APIs like those for event management, positioning, and focus are difficult to compose when writing with React. This often leads developers to reach for Effects, managing multiple Refs, by using APIs like `findDOMNode` (removed in React 19).

We are exploring adding refs to Fragments that would point to a group of DOM elements, rather than just a single element. Our hope is that this will simplify managing multiple children and make it easier to write composable React code when calling DOM APIs.

Fragment refs are still being researched. We'll share more when we're closer to having the final API finished.

---

## Gesture Animations {/*gesture-animations*/}

We're also researching ways to enhance View Transitions to support gesture animations such as swiping to open a menu, or scroll through a photo carousel. 

Gestures present new challenges for a few reasons:

- **Gestures are continuous**: as you swipe the animation is tied to your finger placement time, rather than triggering and running to completion.
- **Gestures don't complete**: when you release your finger gesture animations can run to completion, or revert to their original state (like when you only partially open a menu) depending on how far you go.
- **Gestures invert old and new**: while you're animating, you want the page you are animating from to stay "alive" and interactive. This inverts the browser View Transition model where the "old" state is a snapshot and the "new" state is the live DOM.

We believe we’ve found an approach that works well and may introduce a new API for triggering gesture transitions. For now, we're focused on shipping `<ViewTransition>`, and will revisit gestures afterward.

---

## Concurrent Stores {/*concurrent-stores*/}

When we released React 18 with concurrent rendering, we also released `useSyncExternalStore` so external store libraries that did not use React state or context could [support concurrent rendering](https://github.com/reactwg/react-18/discussions/70) by forcing a synchronous render when the store is updated.

Using `useSyncExternalStore` comes at a cost though, since it forces a bail out from concurrent features like transitions, and forces existing content to show Suspense fallbacks.

Now that React 19 has shipped, we're revisiting this problem space to create a primitive to fully support concurrent external stores with the `use` API:

```js
const value = use(store);
```

Our goal is to allow external state to be read during render without tearing, and to work seamlessly with all of the concurrent features React offers. 

This research is still early. We'll share more, and what the new APIs will look like, when we're further along. 

---

_Thanks to [Aurora Scharff](https://bsky.app/profile/aurorascharff.no), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Eli White](https://twitter.com/Eli_White), [Lauren Tan](https://bsky.app/profile/no.lol), [Luna Wei](https://github.com/lunaleaps), [Matt Carroll](https://twitter.com/mattcarrollcode), [Jack Pope](https://jackpope.me), [Jason Bonta](https://threads.net/someextent), [Jordan Brown](https://github.com/jbrown215), [Jordan Eldredge](https://bsky.app/profile/capt.dev), [Mofei Zhang](https://threads.net/z_mofei), [Sebastien Lorber](https://bsky.app/profile/sebastienlorber.com), [Sebastian Markbåge](https://bsky.app/profile/sebmarkbage.calyptus.eu), and [Tim Yung](https://github.com/yungsters) for reviewing this post._
