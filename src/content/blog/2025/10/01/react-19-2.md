---
title: "React 19.2"
author: The React Team
date: 2025/10/01
description: React 19.2 adds new features like Activity, React Performance Tracks, useEffectEvent, and more.
---

October 1, 2025 by [The React Team](/community/team)

---

<Intro>

React 19.2 is now available on npm!

</Intro>

This is our third release in the last year, following React 19 in December and React 19.1 in June. In this post, we'll give an overview of the new features in React 19.2, and highlight some notable changes.

<InlineToc />

---

## New React Features {/*new-react-features*/}

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

For examples on how to use Activity, check out the [Activity docs](/reference/react/Activity).

---

### `useEffectEvent` {/*use-effect-event*/}

One common pattern with `useEffect` is to notify the app code about some kind of "events" from an external system. For example, when a chat room gets connected, you might want to display a notification:

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

The problem with the code above is that a change to any values used inside such an "event" will cause the surrounding Effect to re-run. For example, changing the `theme` will cause the chat room to reconnect. This makes sense for values related to the Effect logic itself, like `roomId`, but it doesn't make sense for `theme`.

To solve this, most users just disable the lint rule and exclude the dependency. But that can lead to bugs since the linter can no longer help you keep the dependencies up to date if you need to update the Effect later.

With `useEffectEvent`, you can split the "event" part of this logic out of the Effect that emits it:

```js {2,3,4,9}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared (Effect Events aren't dependencies)
  // ...
```

Similar to DOM events, Effect Events always “see” the latest props and state.

**Effect Events should _not_ be declared in the dependency array**. You'll need to upgrade to `eslint-plugin-react-hooks@latest` so that the linter doesn't try to insert them as dependencies. Note that Effect Events can only be declared in the same component or Hook as "their" Effect. These restrictions are verified by the linter.

<Note>

#### When to use `useEffectEvent` {/*when-to-use-useeffectevent*/}

You should use `useEffectEvent` for functions that are conceptually "events" that happen to be fired from an Effect instead of a user event (that's what makes it an "Effect Event"). You don't need to wrap everything in `useEffectEvent`, or to use it just to silence the lint error, as this can lead to bugs.

For a deep dive on how to think about Event Effects, see: [Separating Events from Effects](/learn/separating-events-from-effects#extracting-non-reactive-logic-out-of-effects).

</Note>

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

### Performance Tracks {/*performance-tracks*/}

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

The [React Performance Tracks docs](/reference/dev-tools/react-performance-tracks) explain everything included in the tracks, but here is a high-level overview.

#### Scheduler ⚛ {/*scheduler-*/}

The Scheduler track shows what React is working on for different priorities such as "blocking" for user interactions, or "transition" for updates inside startTransition. Inside each track, you will see the type of work being performed such as the event that scheduled an update, and when the render for that update happened.

We also show information such as when an update is blocked waiting for a different priority, or when React is waiting for paint before continuing. The Scheduler track helps you understand how React splits your code into different priorities, and the order it completed the work.

See the [Scheduler track](/reference/dev-tools/react-performance-tracks#scheduler) docs to see everything included.

#### Components ⚛ {/*components-*/}

The Components track shows the tree of components that React is working on either to render or run effects. Inside you'll see labels such as "Mount" for when children mount or effects are mounted, or "Blocked" for when rendering is blocked due to yielding to work outside React.

The Components track helps you understand when components are rendered or run effects, and the time it takes to complete that work to help identify performance problems.

See the [Components track docs](/reference/dev-tools/react-performance-tracks#components) for see everything included.

---

## New React DOM Features {/*new-react-dom-features*/}

### Partial Pre-rendering {/*partial-pre-rendering*/}

In 19.2 we're adding a new capability to pre-render part of the app ahead of time, and resume rendering it later.

This feature is called "Partial Pre-rendering", and allows you to pre-render the static parts of your app and serve it from a CDN, and then resume rendering the shell to fill it in with dynamic content later.

To pre-render an app to resume later, first call `prerender` with an `AbortController`:

```
const {prelude, postponed} = await prerender(<App />, {
  signal: controller.signal,
});

// Save the postponed state for later
await savePostponedState(postponed);

// Send prelude to client or CDN.
```

Then, you can return the `prelude` shell to the client, and later call `resume` to "resume" to a SSR stream:

```
const postponed = await getPostponedState(request);
const resumeStream = await resume(<App />, postponed);

// Send stream to client.
```

Or you can call `resumeAndPrerender` to resume to get static HTML for SSG:

```
const postponedState = await getPostponedState(request);
const { prelude } = await resumeAndPrerender(<App />, postponedState);

// Send complete HTML prelude to CDN.
```

For more info, see the docs for the new APIs:
- `react-dom/server`
  - [`resume`](/reference/react-dom/server/resume): for Web Streams.
  - [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream) for Node Streams.
- `react-dom/static`
  - [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) for Web Streams.
  - [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) for Node Streams.

Additionally, the prerender apis now return a `postpone` state to pass to the `resume` apis.

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

As well as the new `resume` APIs:
- [`resume`](/reference/react-dom/server/resume) is available for Node.js.
- [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) is available for Node.js.


<Pitfall>

#### Prefer Node Streams for server-side rendering in Node.js {/*prefer-node-streams-for-server-side-rendering-in-nodejs*/}

In Node.js environments, we still highly recommend using the Node Streams APIs:

- [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)
- [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream)
- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)
- [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream)

This is because Node Streams are much faster than Web Streams in Node, and Web Streams do not support compression by default, leading to users accidentally missing the benefits of streaming.

</Pitfall>

---

### `eslint-plugin-react-hooks` v6 {/*eslint-plugin-react-hooks*/}

We also published `eslint-plugin-react-hooks@latest` with flat config by default in the `recommended` preset, and opt-in for new React Compiler powered rules.

To continue using the legacy config, you can change to `recommended-legacy`:

```diff
- extends: ['plugin:react-hooks/recommended']
+ extends: ['plugin:react-hooks/recommended-legacy']
```

For a full list of compiler enabled rules, [check out the linter docs](/reference/eslint-plugin-react-hooks#recommended).

Check out the `eslint-plugin-react-hooks` [changelog for a full list of changes](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/CHANGELOG.md#610).

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

_Thanks to [Ricky Hanlon](https://bsky.app/profile/ricky.fm) for [writing this post](https://www.youtube.com/shorts/T9X3YkgZRG0), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Matt Carroll](https://twitter.com/mattcarrollcode), [Jack Pope](https://jackpope.me), and [Joe Savona](https://x.com/en_JS) for reviewing this post._
