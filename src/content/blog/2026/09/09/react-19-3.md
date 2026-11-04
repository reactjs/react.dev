---
title: "React 19.3"
author: The React Team
date: 2026/09/09
description: React 19.3 adds new features like View Transitions, Fragment Refs, browser(), Trusted Types, and more.
---

September 9, 2026 by [The React Team](/community/team)

---

<Intro>

React 19.3 is now available on npm!

</Intro>


[Last year](/blog/2025/04/23/react-labs-view-transitions-activity-and-more), we shared View Transitions and Fragment Refs as new experimental APIs coming to React. We're excited to announce that both of these are now stable in React 19.3!

In this post, we'll go over how they work, and also cover some other notable changes in this release.

<InlineToc />

---

## New React Features {/*new-react-features*/}

### View Transitions {/*view-transition*/}

The new `<ViewTransition>` component lets you animate elements as they enter, exit, move, or resize using the browser's [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API). We shared it as an experimental API [last year](/blog/2025/04/23/react-labs-view-transitions-activity-and-more#view-transitions), and in 19.3 it's stable and ready to use.

To animate part of your UI, wrap it in `<ViewTransition>`:

```js
import { ViewTransition } from 'react';

{isShowing && (
  <ViewTransition>
    <Component />
  </ViewTransition>
)}
```

Now, whenever an update marked as a [Transition](/reference/react/useTransition) changes the child component's style, or causes the `ViewTransition` to be mounted or unmounted, React will animate that update.

{/*
Updates outside of a Transition don't trigger animations, as those are meant to be urgent and reflected immediately in the UI. State updates inside of [startTransition](/reference/react/startTransition), a [`<Suspense>`](/reference/react/Suspense) reveal, or an update from [`useDeferredValue`](/reference/react/useDeferredValue) all cause a View Transition to animate.
*/}

React chooses which animation to run based on how the tree changed:

- **enter**: the `<ViewTransition>` is added.
- **exit**: the `<ViewTransition>` is removed.
- **update**: the children of a `<ViewTransition>` change style or content.
- **share**: a named `<ViewTransition>` is removed in one place and added in another.

Note that updates not marked as Transitions don't trigger animations, as those are meant to be urgent and reflected immediately in the UI. State updates inside of [startTransition](/reference/react/startTransition), a [`<Suspense>`](/reference/react/Suspense) reveal, or an update from [`useDeferredValue`](/reference/react/useDeferredValue) all cause a View Transition to animate.

Here's a simple example of an enter/exit animation:

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import { ViewTransition, useState, startTransition } from 'react';
import { Video } from './Video';
import videos from './data';

export default function Component() {
  const [showItem, setShowItem] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem && (
        <ViewTransition>
          <Video video={videos[0]} />
        </ViewTransition>
      )}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
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
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
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
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

By default, `<ViewTransition>` animates with a smooth cross-fade. You can customize each kind of animation by passing a [View Transition Class](/reference/react/ViewTransition#view-transition-class) and defining the animation in CSS, or you can use the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) to trigger animations imperatively with the [event props](/reference/react/ViewTransition#view-transition-event) (`onEnter`, `onExit`, `onShare`, `onUpdate`).

{/*
There are a couple of rules to keep in mind. A `<ViewTransition>` only animates on enter and exit if it's the first thing rendered in its subtree, before any DOM node, and each shared `name` must be unique across your app at any given time. See [Troubleshooting](/reference/react/ViewTransition#troubleshooting) for the details.
 */}

Currently, `<ViewTransition>` only works in the DOM. We're working on support for React Native and other platforms.

For more, see the [`<ViewTransition>` docs](/reference/react/ViewTransition).

---

#### `addTransitionType` {/*add-transition-type*/}

Sometimes, you'll want to customize which animation is used for the same state update. For example, navigating a carousel _forward_ to the third slide should animate the slides right-to-left, while navigating it _backward_ should animate them left-to-right, even though both actions set the currentSlide to 3.

You can customize the animation for a given View Transition by calling `addTransitionType` alongside the state update. This lets you add more information about the _cause_ of a particular transition:

```js {3,10}
function nextSlide() {
  startTransition(() => {
    addTransitionType('next');
    setCurrentSlide(c => c + 1);
  });
}

function previousSlide() {
  startTransition(() => {
    addTransitionType('previous');
    setCurrentSlide(c => c - 1);
  });
}
```

Then, you can specify different animations based on that transition type:

```js
<ViewTransition
  enter={{
    'next': 'from-right',
    'previous': 'from-left',
  }}
  exit={{
    'next': 'to-left',
    'previous': 'to-right',
  }}
>
  <Page />
</ViewTransition>
```

Here's an example:

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  addTransitionType,
  useState,
  startTransition,
  Fragment
} from 'react';
import { Video } from './Video';
import videos from './data';
import './animations.css';

export default function Component() {
  const [selected, setSelected] = useState(0)
  const video = videos[selected];

  return (
    <>
      <div className="button-container">
        <button
          onClick={() => {
            startTransition(() => {
              addTransitionType('previous');
              setSelected(c => c > 0 ? c - 1 : videos.length - 1 )
            });
          }}>
          ⬅️
        </button>
        <button
          onClick={() => {
            startTransition(() => {
              addTransitionType('next');
              setSelected(c => c + 1 < videos.length ? c + 1 : 0)
            });
          }}>
          ➡️
        </button>
      </div>

      <ViewTransition
        key={video.id}
        enter={{
          'next': 'from-right',
          'previous': 'from-left'
        }}
        exit={{
          'next': 'to-left',
          'previous': 'to-right'
        }}
      >
        <Video video={video} />
      </ViewTransition>
    </>
  );
}
```

```js src/data.js hidden
export default [
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
```

```css src/animations.css
::view-transition-old(*),
::view-transition-new(*) {
  animation-duration: 250ms;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

::view-transition-new(.from-right) {
  --offset: 100%;
  animation-name: slide-in;
}

::view-transition-new(.from-left) {
  --offset: -100%;
  animation-name: slide-in;
}

::view-transition-old(.to-right) {
  --offset: 100%;
  animation-name: slide-out;
}

::view-transition-old(.to-left) {
  --offset: -100%;
  animation-name: slide-out;
}

@keyframes slide-in {
  from {
    transform: translateX(var(--offset));
    opacity: 0;
  }
}

@keyframes slide-out {
  to {
    transform: translateX(var(--offset));
    opacity: 0;
  }
}
```

```css src/styles.css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.button-container {
  display: flex;
  gap: 8px;
}
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
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
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
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

React also adds every Transition Type to the element as a browser [view transition type](https://www.w3.org/TR/css-view-transitions-2/#active-view-transition-pseudo-examples), so you can scope animations in CSS with `:active-view-transition-type(...)`.

To learn more, see the [`addTransitionType` docs](/reference/react/addTransitionType).

---

#### Animating fallbacks, images, and fonts with Suspense {/*animating-fallbacks-images-and-fonts-with-suspense*/}

One of the most exciting things about View Transitions in React is how they integrate with Suspense.

You can animate a Suspense boundary as it reveals its children by wrapping it in `<ViewTransition>`:

```js
<ViewTransition>
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
</ViewTransition>
```

When the children finish loading, React will trigger an **update** animation from the fallback to the final content.

Here's an example. Try pressing ➕ to render a LazyVideo that suspends the first time it's rendered:

<Sandpack>

```js src/Video.js hidden
import { ViewTransition } from 'react';

function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: 'loading'};
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import { Suspense, useState, startTransition, use, ViewTransition } from 'react';
import { Video, VideoPlaceholder } from './Video';
import { fetchVideo } from './data';

export default function Component() {
  const [showItem, setShowItem] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >
        {showItem ? '➖' : '➕'}
      </button>

      {showItem && (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      )}
    </>
  );
}

function LazyVideo() {
  const video = use(fetchVideo());

  return <Video video={video} />;
}
```


```js src/data.js hidden
let cache = null;

export function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'First video',
          description: 'Video description',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}
```

```css
::view-transition-old(*),
::view-transition-new(*) {
  /* animation-duration: 750ms; */
  /* animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); */
}
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
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
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  z-index: 999;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

While this works, you'll notice that the video also animates in and out on subsequent reveals, even though it's already been loaded. (You might also notice that the fallback fades in the first time it's shown.)

In general, animations with Suspense work best when they're used sparingly, and avoided for cached UI that would otherwise appear instantly.

Here are some principles for achieving good UX when animating with Suspense:

- Fallbacks should appear immediately _without animation_
- A fallback should update to its final content _with animation_
- Children that don't suspend should appear immediately _without animation_

This keeps your app feeling snappy when things are already loaded, and only uses animation to make the update from fallback to final content more seamless.

To fix our example above, we can disable all animations other than updates:

```js {1}
<ViewTransition update="auto" default="none">
  <Suspense fallback={<Fallback />}>
    <Component />
  </Suspense>
</ViewTransition>
```

Let's see how it behaves now:

<Sandpack>

```js src/Video.js hidden
import { ViewTransition } from 'react';

function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: 'loading'};
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import { Suspense, useState, startTransition, use, ViewTransition } from 'react';
import { Video, VideoPlaceholder } from './Video';
import { fetchVideo } from './data';

export default function Component() {
  const [showItem, setShowItem] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >
        {showItem ? '➖' : '➕'}
      </button>

      {showItem && (
        <ViewTransition update="auto" default="none">
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      )}
    </>
  );
}

function LazyVideo() {
  const video = use(fetchVideo());

  return <Video video={video} />;
}
```


```js src/data.js hidden
let cache = null;

export function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'First video',
          description: 'Video description',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}
```

```css
::view-transition-old(*),
::view-transition-new(*) {
  /* animation-duration: 5000ms; */
  /* animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); */
}
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
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
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  z-index: 999;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Notice how the fallback appears immediately when tapping the button, which keeps our UI feeling responsive to user actions. Additionally, once the video has been loaded, toggling it is instant.

There are other patterns you can use depending on what effect you want to achieve. To learn more, check out the docs on [animating with Suspense](/reference/react/ViewTransition#animating-from-suspense-content).

---

In addition to animating fallbacks, View Transitions act as a way to opt images or fonts into triggering Suspense while they load.

This lets you avoid the browser's default behavior where images or fonts may flicker in whenever they happen to finish loading, and instead build coordinated loading sequences that consider all of a component's resources.

Wrap images or fonts inside of `<ViewTransition>` to trigger Suspense while they load:

```js
<ViewTransition>
  <Suspense fallback={<Fallback />}>
    <img src={imageSrc} />

    <style href={fontSrc} precedence="default">
      {`@font-face {
        font-family: 'Fancy';
        src: url(${fontSrc}) format('truetype');
        font-display: swap;
      }`}
    </style>
  </Suspense>
</ViewTransition>
```

Here's an example of a component that suspends until its data, image, and font have all loaded:


<Sandpack>

```js
import { ViewTransition, Suspense, use, useState, startTransition } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';
import { ProfileCard, ProfileCardLoading } from './ProfileCard.js';
import { VanillaProfileCard } from './VanillaProfileCard.js';

export default function App() {
  const [resources, setResources] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setResources({
              quotePromise: fetchQuote(),
              stylesheet: freshStylesheetUrl(),
              image: freshImageUrl(),
            });
          });
        }}>
        Show profile
      </button>

      {resources && (
        <ViewTransition update='auto' default='none'>
          <Suspense fallback={<ProfileCardLoading />}>
            <ProfileCard resources={resources} />
          </Suspense>
        </ViewTransition>
      )}

      <hr />

      <VanillaProfileCard />
    </>
  );
}
```

```js src/ProfileCard.js
import { use } from 'react';

export function ProfileCard({ resources }) {
  const quote = use(resources.quotePromise);
  return (
    <>
      <link rel="stylesheet" href={resources.stylesheet} precedence="default" />
      <div className="profile-card">
        <img src={resources.image} alt="Jack Pope" width={80} height={80} />
        <div>
          <p className="name">Jack Pope</p>
          <p className="bio">{quote}</p>
        </div>
      </div>
    </>
  );
}

export function ProfileCardLoading() {
  return (
    <div className="profile-card">
      <div className="avatar-placeholder" />
      <div>
        <p className="name name-placeholder">&nbsp;</p>
        <p className="bio bio-placeholder">&nbsp;</p>
      </div>
    </div>
  );
}
```


```js src/VanillaProfileCard.js
import { useRef } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';

export function VanillaProfileCard() {
  const ref = useRef(null);
  async function show() {
    const quote = await fetchQuote();
    const doc = ref.current.contentWindow.document;
    doc.open();
    doc.write(`
      <style>
        body { margin: 0; font-family: sans-serif; }
        img { object-fit: cover; }
        .profile-card { display: flex; gap: 12px; align-items: center; }
        .profile-card img { border-radius: 50%; background: #dfe3e9; }
        .name { margin: 0 0 4px; font-family: 'Caveat', sans-serif; font-size: 22px; line-height: 28px; font-weight: bold; }
        .bio { margin: 0; font-family: 'Caveat', sans-serif; font-size: 20px; line-height: 26px; }
      </style>
      <div class="profile-card">
        <img src="${freshImageUrl()}" alt="Jack Pope" width="80" height="80" />
        <div>
          <p class="name">Jack Pope</p>
          <p class="bio">${quote}</p>
        </div>
      </div>
      <link rel="stylesheet" href="${freshStylesheetUrl()}">
    `);
    doc.close();
  }
  return (
    <>
      <button onClick={show}>Show profile (without React)</button>
      <iframe ref={ref} title="Vanilla profile card" className="vanilla-frame" />
    </>
  );
}
```

```js src/resources.js hidden
// Add a unique parameter so the resources aren't cached,
// and every run shows the loading state.
export function freshStylesheetUrl() {
  return (
    'https://fonts.googleapis.com/css2?family=Caveat&display=swap' +
    '&t=' +
    Date.now()
  );
}

export function freshImageUrl() {
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.

export async function fetchQuote() {
  // Add a fake delay to make waiting noticeable.
  await new Promise((resolve) => {
    setTimeout(resolve, 250);
  });
  return 'The best way to predict the future is to invent it.';
}
```

```css
#root {
  min-height: 320px;
}
button {
  margin-right: 8px;
}
hr {
  margin: 16px 0;
}
img {
  object-fit: cover;
}
.profile-card {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 1em;
}
.profile-card img {
  border-radius: 50%;
  background: #dfe3e9;
}
.name {
  margin: 0 0 4px;
  font-family: 'Caveat', sans-serif;
  font-size: 22px;
  line-height: 28px;
  font-weight: bold;
}
.bio {
  margin: 0;
  font-family: 'Caveat', sans-serif;
  font-size: 20px;
  line-height: 26px;
}
.profile-card img {
  display: block;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder,
.bio-placeholder {
  border-radius: 4px;
  background: #dfe3e9;
  color: transparent;
}
.name-placeholder {
  width: 90px;
}
.bio-placeholder {
  width: 220px;
}
.vanilla-frame {
  display: block;
  margin-top: 1em;
  border: none;
  width: 100%;
  height: 110px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

To learn more about waiting for images, fonts, or stylesheets to load, see the [Suspense docs](/reference/react/Suspense#waiting-for-a-font-to-load).

---

### Fragment Refs {/*fragment-refs*/}

When you need lower-level control over a component's DOM nodes—for example to attach an event listener, observe visibility, or move focus—you can usually use a ref. But there are some situations where this is difficult:

- Components that render a group of siblings with no single parent
- Components that don't pass along their `ref` prop to another element

```js
function Component() {
  // How can we work with the list of DOM nodes rendered by this component?
  return (
    {posts.map(post => (
      <Heading key={post.id}>
        {post.title}
      </Heading>
    ))}
  )
}
```

Adding a wrapper `<div>` just to hold a ref sometimes works, but it can also interfere with your component's styling or layout. Moreover, if a component doesn't expose a `ref` prop, you would need to modify that component to do so, which might be impossible if it comes from a library you don't control.

Fragment Refs solve these problems by providing a limited set of commonly used DOM methods that work with any React component, regardless of what it renders.

In 19.3, you can use them by passing a ref directly to a [`<Fragment>`](/reference/react/Fragment). This ref gives you a `FragmentInstance`, which you can use to work with the Fragment's DOM children:

```js {2,5-6,10}
function Component() {
  const fragmentRef = useRef(null);

  useEffect(() => {
    const fragmentInstance = fragmentRef.current;
    fragmentInstance.focus();
  }, []);

  return (
    <Fragment ref={fragmentRef}>
      {posts.map(post => (
        <Heading key={post.id}>
          {post.title}
        </Heading>
      ))}
    </Fragment>
  )
}
```

The `FragmentInstance` operates on the children's DOM _as a group_, without changing its structure:

- `addEventListener`, `removeEventListener`, and `dispatchEvent` manage events for first-level children.
- `focus`, `focusLast`, and `blur` move focus across nested children, depth-first.
- `observeUsing` and `unobserveUsing` connect an `IntersectionObserver` or `ResizeObserver`.
- `getClientRects`, `getRootNode`, `compareDocumentPosition`, and `scrollIntoView` let you measure and scroll to the fragment's first-level children.

Thus, Fragment Refs let you attach behavior to other components without requiring you to modify those component's internals, or without changing the DOM structure that they already produce.

This example shows an `InView` component with an `onChange` prop that fires whenever its children enter or exit the viewport:

<Sandpack>

```js src/App.js active
import { useState } from 'react';
import Card from './Card';
import InView from './InView';

export default function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={isVisible ? 'page visible' : 'page'}>
      <div className="filler">Scroll down</div>

      <InView onChange={setIsVisible}>
        <Card title="First section" />
        <Card title="Second section" />
      </InView>

      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```js src/Card.js
export default function Card({ title }) {
  return <div className="card">{title}</div>;
}
```

```js src/InView.js
import {
  Fragment,
  useRef,
  useLayoutEffect,
} from 'react';

export default function InView({ onChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const visibleElements = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            visibleElements.add(e.target);
          } else {
            visibleElements.delete(e.target);
          }
        });
        onChange(visibleElements.size > 0);
      }
    );
    const fragmentInstance = fragmentRef.current;
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
    };
  }, [onChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}
```

```css
.page {
  transition: background 0.3s;
}

.page.visible {
  background: #d4edda;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 8px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Notice how `InView` is able to add behavior to its children, even though there's no single parent DOM element, and in spite of `Card` not exposing a `ref` prop.

To learn more about working with Fragment Refs, see the [`<Fragment>` docs](/reference/react/Fragment).

---

## New React DOM Features {/*new-react-dom-features*/}

### `browser` {/*browser*/}

If your app uses server rendering, your components will render in two different environments:

- On the server, components render to produce the initial HTML
- On the client, components render to enrich that HTML with event handlers

Most of time, your components should be able to produce HTML that matches their initial client-rendered output, ensuring they hydrate correctly while still letting users see as much content as possible on the initial load.

But in rare cases, a component may not be able to produce meaningful UI on the server. For example, it might depend on a browser-only API like `localStorage`, or it might read from the browser's local timezone. In these cases, you may want to opt that component out of server rendering altogether.

Previously, you might do this using some state that you'd update in an effect, or by checking for the presence of browser APIs like `window`:

```js
function Component() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, [])

  // ...
}

function Component() {
  const isBrowser = typeof window !== 'undefined';

  // ...
}
```

In 19.3, React now includes a first-class API for this technique.

A component can call `use(browser())` to opt out of server-side rendering:

```js {5}
import { use } from 'react';
import { browser } from 'react-dom';

function Component() {
  use(browser());

  // ...
}
```

This will trigger Suspense on the server, but _not_ in the client. During server-side rendering, the nearest Suspense boundary's fallback will show in the HTML. Once the component is hydrated on the client, `use(browser())` does not suspend, allowing the component to continue rendering as normal.

Here's an example of a component that renders the local time zone from your device. Press **Reload** to see the initial HTML followed by React's first render on the client:

<Sandpack>

```js
import { Suspense, use } from 'react';
import { browser } from 'react-dom';

function TimeZone() {
  use(browser());
  const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

  return <p>{timeZone}</p>
}

export default function App() {
  return (
    <>
      <p>Your current time zone is:</p>
      <Suspense fallback="Loading...">
        <TimeZone />
      </Suspense>
    </>
  );
}
```


```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Event details</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Wait so both the fallback and hydrated content are visible.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Conditional browser rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 240px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Because TimeZone suspends on the server, the initial HTML includes the Suspense fallback. After a small artificial delay, React hydrates the page, allowing the component to render as normal in the browser.

Thus, for components that cannot produce meaningful UI during server rendering, `browser` lets you use Suspense for their loading states, allowing them to participate with other components that suspend until they're ready to render.

---

Like other calls to `use`, `use(browser())` can be called inside a conditional statement or after an early return. This lets you write components or custom Hooks that can opt out of server rendering based on a condition, such as the value of a prop.

Here's the same example from above, except now our TimeZone component accepts an optional default value it can render as part of the initial HTML:

<Sandpack>

```js
import { Suspense, use } from 'react';
import { browser } from 'react-dom';

function TimeZone({ defaultValue }) {
  if (defaultValue) {
    return <p>{defaultValue}</p>;
  }

  use(browser());
  const localTimeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

  return <p>{localTimeZone}</p>
}

export default function App() {
  return (
    <>
      <div>
        <p>The event's time zone is:</p>
        <TimeZone defaultValue='America/New_York' />
      </div>

      <hr />

      <div>
        <p>Your current time zone is:</p>
        <Suspense fallback="Loading...">
          <TimeZone />
        </Suspense>
      </div>
    </>
  );
}
```


```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Event details</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Wait so both the fallback and hydrated content are visible.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Conditional browser rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 240px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Notice how TimeZone only suspends in the second case, when no default is provided.

Another useful example of this pattern is opting a data-fetching Hook like `useQuery` out of server rendering, unless that query's initial data was passed in (for example from a Server Component or framework's loader function):

```js {3}
function useBrowserQuery(query, options) {
  if (options.initialData === undefined) {
    use(browser());
  }

  return useQuery(query, options);
}

function ProductDetails({ productId, initialData }) {
  const product = useBrowserQuery(`/api/products/${productId}`, {
    initialData,
  });

  return <h1>{product.name}</h1>;
}
```

Now, the ProductDetails component can be included in the HTML, provided it receives `initialData` during server rendering. If not, it suspends until it gets rendered in the browser, at which point `useQuery` can fetch the data or read from its cache as normal.

To learn more about `browser`, [check out the docs](/reference/react-dom/browser).

---

### Trusted Types support {/*trusted-types-support*/}

React 19.3 integrates with the browser [Trusted Types API](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API), a security feature that helps prevent DOM-based XSS attacks. When a site enforces Trusted Types with `Content-Security-Policy: require-trusted-types-for 'script'`, the browser requires that values passed to injection sinks like `innerHTML` are typed objects (`TrustedHTML`, `TrustedScript`, `TrustedScriptURL`) created through your sanitization policies, rather than raw strings.

Previously, React always coerced values to strings (via `'' + value`) before passing them to DOM APIs, which turned Trusted Types objects back into plain strings the browser would reject. React now passes these values through without coercion, so the browser can validate them and your Trusted Types policies work as intended.

---

## New React Server Components Features {/*new-react-server-components-features*/}

### `<Context>` can be rendered directly in Server Components {/*context-can-be-rendered-directly-in-server-components*/}

While Server Components can't _create_ Context, they can _render_ Context by importing it from a `'use client'` module.

Previously, this required the client module to export a separate wrapper component, often called a Provider:

```js {7-9}
// user-context.js
'use client';
import { createContext } from 'react';

export const UserContext = createContext(null);

export function UserProvider({ currentUser, children }) {
  return <UserContext value={currentUser}>{children}</UserContext>;
}
```

```js {8}
// server-component.js
import { UserProvider } from './user-context';

export async function Layout({ children }) {
  const currentUser = await getCurrentUser();

  return (
    <UserProvider currentUser={currentUser}>
      {children}
    </UserProvider>
  )
}
```

Notice that in this example, the provider does nothing other than pass the prop from the Server Component directly to the Context.

In React 19.3, Server Components can import and render Context directly from a `'use client'` module, without an additional wrapping component:

```js {5}
// user-context.js
'use client';
import { createContext } from 'react';

export const UserContext = createContext(null);
```

```js {8}
// server-component.js
import { UserContext } from './user-context';

export async function Layout({ children }) {
  const currentUser = await getCurrentUser();

  return (
    <UserContext value={currentUser}>
      {children}
    </UserContext>
  )
}
```

This is especially useful for Contexts that solely exist to allow Server Components to share some data with the rest of the client tree.


---

## Changelog {/*changelog*/}

Other notable changes
- `react`: Render Transitions independently instead of entangling them into a single render, so a slow Transition no longer holds up unrelated ones [#37290](https://github.com/react/react/pull/37290)
- `react-dom`: Double invoke Effects in Strict Mode during hydration, matching client-rendered roots [#35961](https://github.com/react/react/pull/35961)
- `react`: Add a warning when `use` is used incorrectly in a conditional [#37104](https://github.com/react/react/pull/37104)
- `react`: Rename "form state" to "action state" in `useActionState` error messages [#35790](https://github.com/react/react/pull/35790)
- `react-dom`: Add support for `onFullscreenChange` and `onFullscreenError` events [#34621](https://github.com/react/react/pull/34621)
- `react-dom`: Add support for the `maskType` SVG property [#35921](https://github.com/react/react/pull/35921)
- `react-dom`: Support `fetchPriority` for module resources [#36835](https://github.com/react/react/pull/36835)
- `react-dom`: Fire `onReset` when React automatically resets a form after a Server Action [#35176](https://github.com/react/react/pull/35176)
- `react-dom`: Include the `submitter` in `submit` events [#35590](https://github.com/react/react/pull/35590)
- `react-dom`: Recognize `credentialless` as a boolean attribute on iframes [#36148](https://github.com/react/react/pull/36148)
- `react-dom`: Batch updates from `resize` events until the next frame [#35117](https://github.com/react/react/pull/35117)
- `react-server`: Transport `Error.cause` [#35810](https://github.com/react/react/pull/35810) and `AggregateError.errors` [#36156](https://github.com/react/react/pull/36156) to the client
- `react-server`: Add support for `<Activity>` in Flight [#34697](https://github.com/react/react/pull/34697)

Notable bug fixes

- `react`: Fix `useDeferredValue` getting stuck on an old value [#36134](https://github.com/react/react/pull/36134)
- `react`: Fix context propagation into Suspense fallbacks [#36160](https://github.com/react/react/pull/36160) and through suspended Suspense boundaries [#35839](https://github.com/react/react/pull/35839)
- `react`: Fix a hang when updating a dehydrated Suspense boundary inside a hidden tree [#37135](https://github.com/react/react/pull/37135)
- `react`: Fix `useSyncExternalStore` missing store mutations that happened while an `<Activity>` tree was hidden [#36947](https://github.com/react/react/pull/36947)
- `react`: Fix `useEffectEvent` to read the latest values in `forwardRef` and `memo` components [#34831](https://github.com/react/react/pull/34831)
- `react`: Fix form status resetting when component state is updated [#34075](https://github.com/react/react/pull/34075)
- `react`: Fix several Fast Refresh bugs with `lazy`, `memo`, and edits that change a component's kind [#36965](https://github.com/react/react/pull/36965), [#36964](https://github.com/react/react/pull/36964), [#36963](https://github.com/react/react/pull/36963), [#36950](https://github.com/react/react/pull/36950)
- `react`: Fix a bug where `<title>` was still hoisted to `<head>` after the `<Activity>` containing the `<title>` changed mode from `visible` to `hidden` [#34983](https://github.com/react/react/pull/34983)
- `react`: Don't let errors escape a hidden `<Activity>` [#35074](https://github.com/react/react/pull/35074)
- `react`: Hide portal contents rendered inside a hidden `<Activity>` [#35091](https://github.com/react/react/pull/35091)
- `react`: Don't reference the internal `<Offscreen>` type in error messages [#35763](https://github.com/react/react/pull/35763)
- `react-dom`: Fix focus for delegated and already-focused elements [#36010](https://github.com/react/react/pull/36010)
- `react-dom`: Fix a `FragmentInstance` listener leak by normalizing capture options per the DOM spec [#36047](https://github.com/react/react/pull/36047)
- `react-dom`: Fix a `<ViewTransition>` crash in Mobile Safari [#35337](https://github.com/react/react/pull/35337)
- `react-dom`: Fix a `<ViewTransition>` crash with `SuspenseList` [#35520](https://github.com/react/react/pull/35520)
- `react-dom`: Update `defaultValue` for `type="number"` inputs to match other input types [#36980](https://github.com/react/react/pull/36980)
- `react-dom`: Avoid setting `innerHTML` when it hasn't changed [#36949](https://github.com/react/react/pull/36949)
- `react-dom`: Fix a false-positive hydration mismatch on `nonce` attributes [#37030](https://github.com/react/react/pull/37030)
- `react-dom`: Fix `react-dom/server` hanging on Deno [#35235](https://github.com/react/react/pull/35235)
- `react-server`: Fix dropped `FormData` entries in `decodeReplyFromBusboy` [#36468](https://github.com/react/react/pull/36468)
- `react-server`: Fix a stack overflow with deep async chains [#35612](https://github.com/react/react/pull/35612) and a `RangeError` from exponential debug info growth [#37481](https://github.com/react/react/pull/37481)

For a full list of changes, please see the [Changelog](https://github.com/react/react/blob/main/CHANGELOG.md).

---

_Thanks to [Sam Selikoff](https://x.com/samselikoff) for writing this post, and to [Matt Carroll](https://mattcarrollcode.com/), [Dan Abramov](https://bsky.app/profile/danabra.mov), and [Andrew Clark](https://x.com/acdlite) for reviewing this post._
