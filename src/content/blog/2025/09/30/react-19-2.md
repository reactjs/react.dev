---
title: "React 19.2"
author: The React Team
date: 2025/09/30
description: This release continues to build on the scheduling capabilities of concurrent rendering with Activity, adds performance tracks to help optimize your code for concurrent rendering, and new APIs to improve the developer experience.
---

September 30, 2025 by [The React Team](/community/team)

---

<Intro>

React 19.2 is now available on npm!

</Intro>

This is our third release in the last year, following React 19 in December and React 19.1 in June. In this post, we'll give an overview of the new features in React 19.2, and highlight some notable changes.

<InlineToc />



---

## New Features {/*new-features*/}

### `<Activity />` {/*activity*/}

`<Activity>` lets you break your app into "activities" that can be controlled and prioritized.

You can use Activity as an alternative to conditionally rendering parts of your app:

```js
// Before
{isVisible && <Page />}

// After
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Page />
</Activity>
```

In React 19.2, Activity supports two modes: `visible` and `hidden`.

- `hidden`: hides the children, unmounts effects, and defers all updates until React has nothing left to work on. 
- `visible`: shows the children, mounts effects, and allows updates to be processed normally.

This means you can pre-render and keep rendering hidden parts of the app without impacting the performance of anything visible on screen. 

You can use Activity to render hidden parts of the app that a user is likely to navigate to next, or to save the state of parts the user navigates away from. This helps make navigations quicker by loading data, css, and images in the background, and allows back navigations to maintain state such as input fields.

In the future, we plan to add more modes to Activity for different use cases.

For examples on how to use Activity, check out the [Activity docs](/reference/react/activity).

---

### React Performance Tracks {/*react-performance-tracks*/}


React 19.2 adds a new set of [custom tracks](https://developer.chrome.com/docs/devtools/performance/extension) to Chrome DevTools performance profiles to provide more information about the performance of your React app:

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

For more information, see the [React Performance Tracks docs](/reference/dev-tools/react-performance-tracks).

---

### `useEffectEvent` {/*use-effect-event*/}

When using Effects you may want to read the most recent props or state inside an Effect without re-running the Effect when those values change. For example, in the following code the `theme` prop is used inside an Effect, but we don’t want the Effect to re-run when `theme` changes:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]);
  // ...
```

To solve this, most users just disable the lint rule and exclude the dependency. But that can lead to bugs since the linter can no longer help you keep the dependencies up to date if you need to update the Effect later.

React 19.2 introduces `useEffectEvent`, which lets you declare "Effect Events" that can be called inside Effects. Effect Events always access the latest values from props and state when they are invoked, so you can read the latest values without re-running the Effect:

With `useEffectEvent`, we can define the `onConnected` callback as an "Effect Event". Now, it doesn't re-run when the values change, but it can still “see” the latest values of your props and state:

```js {2,3,4,9}
function ChatRoom({ roomId, theme, threadId }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId, threadId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, threadId]); // ✅ All dependencies declared
  // ...
```

<Note>

#### Please don't over use `useEffectEvent` {/*please-dont-over-use-useeffectevent*/}

We introduced `useEffectEvent` as an experimental API several years ago, and you may be curious why it took so long to ship. We've considered multiple alternatives, but all of them have different tradeoffs that can make it too easy to accidentally opt out of reactivity, especially if it is overused.  

We're shipping `useEffectEvent` because it helps solve a common problem, but we recommend using it sparingly. In the future we'll continue to explore solutions to improve the reactive model more broadly.

</Note>


For more information, see [Separating Events from Effects](/learn/separating-events-from-effects) and the [`useEffectEvent` docs](/reference/react/useEffectEvent).

---

### `cacheSignal` {/*cache-signal*/}

<RSC>

`cacheSignal` is only for use with [React Server Components](/reference/rsc/server-components).

</RSC>

`cacheSignal` allows you to know when the [`cache()`](/reference/react/cache) lifetime is over:

```
import {cache, cacheSignal} from 'react';
const dedupedFetch = cache(fetch);

async function Component() {
  await dedupedFetch(url, { signal: cacheSignal() });
}
```

This allows you to clean up or abort work when the result will no longer be used in the cache, such as:

- React has successfully completed rendering
- The render was aborted
- The render has failed

For more info, see the [`cacheSignal` docs](/reference/react/cacheSignal).

---

## Notable Changes {/*notable-changes*/}

### Batching Suspense Boundaries for SSR {/*batching-suspense-boundaries-for-ssr*/}

We fixed a behavioral bug where Suspense boundaries would reveal differently depending on if they were rendered on the client or when streaming from server-side rendering. 

Starting in 19.2, React will batch reveals of server-rendered Suspense boundaries for a short time, to allow more content to be revealed together and align with the client-rendered behavior.

<Diagram name="19_2_batching_before" height={162} width={1270} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a page rectangle showing a glimmer loading state with faded bars. The second panel shows the top half of the page revealed and highlighted in blue. The third panel shows the entire the page revealed and highlighted in blue.">

Previously, during streaming server-side rendering, suspense content would immediately replace fallbacks.

</Diagram>

<Diagram name="19_2_batching_after" height={162} width={1270} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a page rectangle showing a glimmer loading state with faded bars. The second panel shows the same page. The third panel shows the entire the page revealed and highlighted in blue.">

In React 19.2, suspense boundaries are batched for a small amount of time, to allow revealing more content together.

</Diagram>

This fix also prepares apps for supporting `<ViewTransition>` for Suspense during SSR. By revealing more content together, animations can run in larger batches of content, and avoid chaining animations of content that stream in close together.

<Note>

React uses heuristics to ensure throttling does not impact core web vitals and search ranking.

For example, if the total page load time is approaching 2.5s (which is the time considered "good" for [LCP](https://web.dev/articles/lcp)), React will stop batching and reveal content immediately so that the throttling is not the reason to miss the metric. 

</Note>

---

### SSR: Web Streams support for Node {/*ssr-web-streams-support-for-node*/}

React 19.2 adds support for Web Streams for streaming SSR in Node.js:
- [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) is now available for Node.js
- [`prerender`](/reference/react-dom/static/prerender) is now available for Node.js

<Pitfall>

#### Prefer Node Streams for server-side rendering in Node.js {/*prefer-node-streams-for-server-side-rendering-in-nodejs*/}

In Node.js environments, we still highly recommend using the Node Streams APIs:

- [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)
- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)

This is because Node Streams are much faster than Web Streams in Node, and Web Streams do not support compression by default, leading to users accidentally missing the benefits of streaming.

</Pitfall>

---

### Update the default `useId` prefix {/*update-the-default-useid-prefix*/}

In 19.2, we're updating the default `useId` prefix from `:r:` (19.0.0) or `«r»` (19.1.0) to `_r_`.

The original intent of using a special character that was not valid for CSS selectors was that it would be unlikely to collide with IDs written by users. However, to support View Transitions, we need to ensure that IDs generated by `useId` are valid for `view-transition-name` and XML 1.0 names.

---

## Changelog {/*changelog*/}

Other notable changes
- `react-dom`: Allow nonce to be used on hoistable styles [#32461](https://github.com/facebook/react/pull/32461)
- `react-dom`: Warn for using a React owned node as a Container if it also has text content [#32774](https://github.com/facebook/react/pull/32774)

Notable bug fixes
- `react`: Stringify context as "SomeContext" instead of "SomeContext.Provider" [#33507](https://github.com/facebook/react/pull/33507)
- `react`: Fix infinite useDeferredValue loop in popstate event [#32821](https://github.com/facebook/react/pull/32821)
- `react`: Fix a bug when an initial value was passed to useDeferredValue [#34376](https://github.com/facebook/react/pull/34376)
- `react`: Fix a crash when submitting forms with Client Actions [#33055](https://github.com/facebook/react/pull/33055)
- `react`: Hide/unhide the content of dehydrated suspense boundaries if they resuspend [#32900](https://github.com/facebook/react/pull/32900)
- `react`: Avoid stack overflow on wide trees during Hot Reload [#34145](https://github.com/facebook/react/pull/34145)
- `react`: Improve component stacks in various places [#33629](https://github.com/facebook/react/pull/33629), [#33724](https://github.com/facebook/react/pull/33724), [#32735](https://github.com/facebook/react/pull/32735), [#33723](https://github.com/facebook/react/pull/33723)
- `react`: Fix a bug with React.use inside React.lazy-ed Component [#33941](https://github.com/facebook/react/pull/33941)
- `react-dom`: Stop warning when ARIA 1.3 attributes are used [#34264](https://github.com/facebook/react/pull/34264)
- `react-dom`: Fix a bug with deeply nested Suspense inside Suspense fallbacks [#33467](https://github.com/facebook/react/pull/33467)
- `react-dom`: Avoid hanging when suspending after aborting while rendering [#34192](https://github.com/facebook/react/pull/34192)

For a full list of changes, please see the [Changelog](https://github.com/facebook/react/blob/main/CHANGELOG.md).


---

_Thanks to everyone who helped review this post._
