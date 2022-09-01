---
title: Suspense
---

<Intro>

`Suspense` is a React Component that displays a fallback until its children have finished loading.


```js
<Suspense fallback={<Placeholder />}>
  <ComponentThatLoadsData />
</Suspense>
```

</Intro>

- [Usage](#usage)
  - [Displaying a fallback while data is loading](#displaying-a-fallback-while-data-is-loading)
  - [Revealing nested content as it loads](#revealing-nested-content-as-it-loads)
  - [Lazy loading components with Suspense](#suspense-for-code-splitting)
  - [Fetching data with Suspense](#suspense-for-data-fetching)
- [Reference](#reference)
  - [Props](#props)
- [Troubleshooting](#troubleshooting)
  - [How do I prevent the UI from being replaced by a fallback during an update?](#preventing-unwanted-fallbacks)

---

## Usage {/*usage*/}

### Displaying a fallback while data is loading {/*displaying-a-fallback-while-data-is-loading*/}

You can wrap any part of your application with a Suspense component. If the data in <CodeStep step={2}>its children</CodeStep> hasn't loaded yet, React will switch to rendering the <CodeStep step={1}>`fallback`</CodeStep> prop instead. For example:

```js [[1, 3, "<LoadingSpinner />"], [2, 4, "<Comments />"]]
<>
  <Post />
  <Suspense fallback={<LoadingSpinner />}>
    <Comments />
  </Suspense>
</>
```

Suppose that `<Comments />` takes longer to load than `<Post />`. Without a Suspense boundary, React wouldn't be able to show either component until both have loaded — `<Post />` would be blocked by `<Comments />`.

Because of the Suspense boundary, `<Post />` doesn't need to wait for `<Comments />`. React renders `<LoadingSpinner />` in its place. Once `<Comments />` finishes loading, it replaces `<LoadingSpinner />` with `<Comments />`.

Only Suspense-enabled data sources will activate a Suspense boundary's `fallback` prop. These data sources are said to *suspend* when the data needed to render has not yet loaded. Refer to the sections on [lazy loading](#suspense-for-code-splitting) and [data fetching](#suspense-for-data-fetching) for more information.

Suspense does not detect when data is fetched inside an Effect or event handler.

### Revealing nested content as it loads {/*revealing-nested-content-as-it-loads*/}

When a component suspends, it activates the fallback of only the nearest parent Suspense boundary. This means you can nest multiple Suspense boundaries to create a loading sequence. Each Suspense boundary's fallback will be filled in as the next level of content becomes available.

To illustrate, consider the following example:

```js
<Suspense fallback={<BigSpinner />}>
  <MainContent>
    <Post />
    <Suspense fallback={<CommentsGlimmer />}>
      <Comments />
    </Suspense>
  </MainContent>
</Suspense>
```

The sequence will be:

- If `<Post />` hasn't loaded yet, `<BigSpinner />` is shown in place of the entire main content area.
- Once `<Post />` finishes loading, `<BigSpinner />` is replaced by the main content.
- If `<Comments />` hasn't loaded yet, `<CommentsGlimmer />` is shown in its place.
- Finally, once `<Comments />` finishes loading, it replaces `<CommentsGlimmer />`. 

### Lazy loading components with Suspense {/*suspense-for-code-splitting*/}

The [`lazy`](/apis/react/lazy) API is powered by Suspense. When you render a component imported with `lazy`, it will suspend if it hasn't loaded yet.

```js
import { Suspense, lazy } from 'react';

const MoreInfo = lazy(() => import('./MoreInfo'));

function Details({showMore}) {
  return (
    <>
      <Info />
      {showMore ? (
        <Suspense fallback={<LoadingSpinner />}>
          <MoreInfo />
        </Suspense>
      ) : null}
    </>
  );
}
```

In this example, the code for `<MoreInfo />` won't be loaded until you attempt to render it. If `<MoreInfo />` hasn't loaded yet, `<LoadingSpinner />` will be shown in its place.

### Fetching data with Suspense {/*suspense-for-data-fetching*/}

<Note>
The requirements for implementing a Suspense-enabled data source are currently unstable and undocumented. An official API for integrating data sources with Suspense is in progress, and will be released soon in an upcoming minor.
</Note>

General support for data fetching with Suspense without the use of a framework is not yet officially supported. However, you can use Suspense for data fetching in opinionated frameworks like [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/), [Next.js](https://nextjs.org/docs/advanced-features/react-18), [Hydrogen](https://hydrogen.shopify.dev/), and [Remix](https://remix.run/).

## Reference {/*reference*/}

### Props {/*props*/}
* `children`: The actual UI you intend to render. If `children` suspends while rendering, the Suspense boundary will switch to rendering `fallback`.
* `fallback`: An alternate UI to render in place of the actual UI if it has not finished loading. Any valid React node is accepted, though in practice, a fallback is a lightweight placeholder view, such as a loading spinner or skeleton. Suspense will automatically switch to `fallback` when `children` suspends, and back to `children` when the data is ready. If `fallback` suspends while rendering, it will activate the next parent Suspense boundary.

## Troubleshooting {/*troubleshooting*/}

### How do I prevent the UI from being replaced by a fallback during an update? {/*preventing-unwanted-fallbacks*/}

Replacing visible UI with a fallback creates a jarring user experience. This can happen when an update causes a component to suspend, and the nearest Suspense boundary is already showing content to the user.

To prevent this from happening, the typical solution is to mark the update as non-urgent using [`startTransition`](/apis/react/startTransition). During a transition, React will wait until enough data has loaded to prevent an unwanted fallback from appearing.

**React will only prevent unwanted fallbacks during non-urgent updates**. It will not delay a render if it's the result of an urgent update. You must opt in with an API like `startTransition` or [`useDeferredValue`](/apis/react/useDeferredValue).

As a best practice, navigation-style updates should be automatically wrapped with `startTransition` by your routing framework, as well as core UI components like dropdowns or tab switchers. If your framework implements this pattern, most user code will not need to call `startTransition` explicitly.

