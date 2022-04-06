---
id: concurrent-mode-reference
title: Concurrent Mode API Reference (Experimental)
permalink: docs/concurrent-mode-reference.html
prev: concurrent-mode-adoption.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>Caution:
>
>This page is **somewhat outdated** and only exists for historical purposes.
>
>React 18 was released with support for concurrency. However, **there is no "mode" anymore,** and the new behavior is fully opt-in and only enabled [when you use the new features](https://reactjs.org/blog/2022/03/29/react-v18.html#gradually-adopting-concurrent-features).
>
>**For up-to-date high-level information, refer to:**
>* [React 18 Announcement](https://reactjs.org/blog/2022/03/29/react-v18.html)
>* [Upgrading to React 18](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html)
>* [React Conf 2021 Videos](http://localhost:8000/blog/2021/12/17/react-conf-2021-recap.html)
>
>**For details about concurrent APIs in React 18, refer to:**
>* [`React.Suspense`](https://reactjs.org/docs/react-api.html#reactsuspense) reference
>* [`React.startTransition`](https://reactjs.org/docs/react-api.html#starttransition) reference
>* [`React.useTransition`](https://reactjs.org/docs/hooks-reference.html#usetransition) reference
>* [`React.useDeferredValue`](https://reactjs.org/docs/hooks-reference.html#usedeferredvalue) reference
>
>The rest of this page may include content that's stale, broken, or incorrect.

</div>

This page is an API reference for the React [Concurrent Mode](/docs/concurrent-mode-intro.html). If you're looking for a guided introduction instead, check out [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html).

**Note: This is a Community Preview and not the final stable version. There will likely be future changes to these APIs. Use at your own risk!**

- [Enabling Concurrent Mode](#concurrent-mode)
    - [`createRoot`](#createroot)
- [Suspense](#suspense)
    - [`Suspense`](#suspensecomponent)
    - [`SuspenseList`](#suspenselist)
    - [`useTransition`](#usetransition)
    - [`useDeferredValue`](#usedeferredvalue)

## Enabling Concurrent Mode {#concurrent-mode}

<div class="scary">

>Caution:
>
>This explanation is outdated. The strategy of a separate "mode" was abandoned in React 18. Instead, concurrent rendering is only enabled when you use concurrent features.

</div>

### `createRoot` {#createroot}

```js
ReactDOM.createRoot(rootNode).render(<App />);
```

Replaces `ReactDOM.render(<App />, rootNode)` and enables Concurrent Mode.

For more information on Concurrent Mode, check out the [Concurrent Mode documentation.](/docs/concurrent-mode-intro.html)

## Suspense API {#suspense}

### `Suspense` {#suspensecomponent}

```js
<Suspense fallback={<h1>Loading...</h1>}>
  <ProfilePhoto />
  <ProfileDetails />
</Suspense>
```

`Suspense` lets your components "wait" for something before they can render, showing a fallback while waiting.

In this example, `ProfileDetails` is waiting for an asynchronous API call to fetch some data. While we wait for `ProfileDetails` and `ProfilePhoto`, we will show the `Loading...` fallback instead. It is important to note that until all children inside `<Suspense>` have loaded, we will continue to show the fallback.

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
const [isPending, startTransition] = useTransition();
```

`useTransition` allows components to avoid undesirable loading states by waiting for content to load before **transitioning to the next screen**. It also allows components to defer slower, data fetching updates until subsequent renders so that more crucial updates can be rendered immediately.

* `isPending` is a boolean. It's React's way of informing us whether we're waiting for the transition to finish.
The `useTransition` hook returns two values in an array.
* `startTransition` is a function that takes a callback. We can use it to tell React which state we want to defer.

**If some state update causes a component to suspend, that state update should be wrapped in a transition.**

```js
function App() {
  const [resource, setResource] = useState(initialResource);
  const [isPending, startTransition] = useTransition();
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

In this code, we've wrapped our data fetching with `startTransition`. This allows us to start fetching the profile data right away, while deferring the render of the next profile page and its associated `Spinner`.

The `isPending` boolean lets React know that our component is transitioning, so we are able to let the user know this by showing some loading text on the previous profile page.

**For an in-depth look at transitions, you can read [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html#transitions).**

### `useDeferredValue` {#usedeferredvalue}

```js
const deferredValue = useDeferredValue(value);
```

Returns a deferred version of the value that may "lag behind" it.

This is commonly used to keep the interface responsive when you have something that renders immediately based on user input and something that needs to wait for a data fetch.

A good example of this is a text input.

```js
function App() {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text); 

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

This allows us to start showing the new text for the `input` immediately, which allows the webpage to feel responsive. Meanwhile, `MySlowList` "lags behind", allowing it to render with the current text in the background.

**For an in-depth look at deferring values, you can read [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html#deferring-a-value).**
