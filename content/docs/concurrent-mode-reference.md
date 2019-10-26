---
id: concurrent-mode-reference
title: Concurrent Mode API Reference (Experimental)
permalink: docs/concurrent-mode-reference.html
prev: concurrent-mode-adoption.html
---

>Caution:
>
>This page describes **experimental features that are [not yet available](/docs/concurrent-mode-adoption.html) in a stable release**. Don't rely on experimental builds of React in production apps. These features may change significantly and without a warning before they become a part of React.
>
>This documentation is aimed at early adopters and people who are curious. If you're new to React, don't worry about these features -- you don't need to learn them right now.

This page is an API reference for the React [Concurrent Mode](/docs/concurrent-mode-intro.html). If you're looking for a guided introduction instead, check out [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html).

**Note: This is a Community Preview and not the final stable version. There will likely be future changes to these APIs. Use at your own risk!**

- [Enabling Concurrent Mode](#concurrent-mode)
    - [`createRoot`](#createroot)
    - [`createBlockingRoot`](#createblockingroot)
- [Suspense](#suspense)
    - [`Suspense`](#suspensecomponent)
    - [`SuspenseList`](#suspenselist)
    - [`useTransition`](#usetransition)
    - [`useDeferredValue`](#usedeferredvalue)

## Enabling Concurrent Mode {#concurrent-mode}

### `createRoot` {#createroot}

```js
ReactDOM.createRoot(rootNode).render(<App />);
```

Replaces `ReactDOM.render(<App />, rootNode)` and enables Concurrent Mode.

For more information on Concurrent Mode, check out the [Concurrent Mode documentation.](/docs/concurrent-mode-intro.html)

### `createBlockingRoot` {#createblockingroot}

```js
ReactDOM.createBlockingRoot(rootNode).render(<App />)
```

Replaces `ReactDOM.render(<App />, rootNode)` and enables [Blocking Mode](/docs/concurrent-mode-adoption.html#migration-step-blocking-mode).

Opting into Concurrent Mode introduces semantic changes to how React works. This means that you can't use Concurrent Mode in just a few components. Because of this, some apps may not be able to migrate directly to Concurrent Mode. 

Blocking Mode only contains a small subset of Concurrent Mode features and is intended as an intermediary migration step for apps that are unable to migrate directly.

## Suspense API {#suspense}

### `Suspense` {#suspensecomponent}

```js
<Suspense fallback={<h1>Loading...</h1>}>
  <ProfilePhoto />
  <ProfileDetails />
</Suspense>
```

`Suspense` lets your components "wait" for something before they can render, showing a fallback while waiting.

In this example, `ProfileDetails` is waiting for an asynchronous API call to fetch some data. While we wait for `ProfileDetails` and `ProfilePhoto`, we will show the `Loading...` fallback instead. It is important to note that until all children inside `<Suspense>` has loaded, we will continue to show the fallback.

`Suspense` takes two props:
* **fallback** takes a loading indicator. The fallback is shown until all of the children of the `Suspense` component have finished rendering.
* **unstable_avoidThisFallback** takes a boolean. It tells React whether to "skip" revealing this boundary during the initial load. This API will likely be removed in a future release.

### `<SuspenseList>` {#suspenselist}

```js
<SuspenseList revealOrder="forwards">
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={1} />
  </Suspense>
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={2} />
  </Suspense>
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={3} />
  </Suspense>
  ...
</SuspenseList>
```

`SuspenseList` helps coordinate many components that can suspend by orchestrating the order in which these components are revealed to the user.

When multiple components need to fetch data, this data may arrive in an unpredictable order. However, if you wrap these items in a `SuspenseList`, React will not show an item in the list until previous items have been displayed (this behavior is adjustable).

`SuspenseList` takes two props:
* **revealOrder (forwards, backwards, together)** defines the order in which the `SuspenseList` children should be revealed.
  * `together` reveals *all* of them when they're ready instead of one by one.
* **tail (collapsed, hidden)** dictates how unloaded items in a `SuspenseList` is shown. 
    * By default, `SuspenseList` will show all fallbacks in the list.
    * `collapsed` shows only the next fallback in the list.
    * `hidden` doesn't show any unloaded items.

Note that `SuspenseList` only operates on the closest `Suspense` and `SuspenseList` components below it. It does not search for boundaries deeper than one level. However, it is possible to nest multiple `SuspenseList` components in each other to build grids.

### `useTransition` {#usetransition}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
```

`useTransition` allows components to avoid undesirable loading states by waiting for content to load before **transitioning to the next screen**. It also allows components to defer slower, data fetching updates until subsequent renders so that more crucial updates can be rendered immediately.

The `useTransition` hook returns two values in an array.
* `startTransition` is a function that takes a callback. We can use it to tell React which state we want to defer.
* `isPending` is a boolean. It's React's way of informing us whether we're waiting for the transition to finish.

**If some state update causes a component to suspend, that state update should be wrapped in a transition.**

```js
const SUSPENSE_CONFIG = {timeoutMs: 2000 };

function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
  return (
    <>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            const nextUserId = getNextId(resource.userId);
            setResource(fetchProfileData(nextUserId));
          });
        }}
      >
        Next
      </button>
      {isPending ? " Loading..." : null}
      <Suspense fallback={<Spinner />}>
        <ProfilePage resource={resource} />
      </Suspense>
    </>
  );
}
```

In this code, we've wrapped our data fetching with `startTransition`. This allows us to start fetching the profile data right away, while deferring the render of the next profile page and its associated `Spinner` for 2 seconds (the time shown in `timeoutMs`).

The `isPending` boolean lets React know that our component is transitioning, so we are able to let the user know this by showing some loading text on the previous profile page.

**For an in-depth look at transitions, you can read [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html#transitions).**

#### useTransition Config {#usetransition-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

`useTransition` accepts an **optional Suspense Config** with a `timeoutMs`. This timeout (in milliseconds) tells React how long to wait before showing the next state (the new Profile Page in the above example).

**Note: We recommend that you share Suspense Config between different modules.**


### `useDeferredValue` {#usedeferredvalue}

```js
const deferredValue = useDeferredValue(value, { timeoutMs: 2000 });
```

Returns a deferred version of the value that may "lag behind" it for at most `timeoutMs`.

This is commonly used to keep the interface responsive when you have something that renders immediately based on user input and something that needs to wait for a data fetch.

A good example of this is a text input.

```js
function App() {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text, {timeoutMs: 2000 }); 

  return (
    <div className="App">
      {/* Keep passing the current text to the input */}
      <input value={text} onChange={handleChange} />
      ...
      {/* But the list is allowed to "lag behind" when necessary */}
      <MySlowList text={deferredText} />
    </div>
  );
 }
```

This allows us to start showing the new text for the `input` immediately, which allows the webpage to feel responsive. Meanwhile, `MySlowList` "lag behind" for up to 2 seconds according to the `timeoutMs` before updating, allowing it to render with the current text in the background.

**For an in-depth look at deferring values, you can read [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html#deferring-a-value).**

#### useDeferredValue Config {#usedeferredvalue-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

`useDeferredValue` accepts an **optional Suspense Config** with a `timeoutMs`. This timeout (in milliseconds) tells React how long the deferred value is allowed to lag behind.

React will always try to use a shorter lag when network and device allows it.
