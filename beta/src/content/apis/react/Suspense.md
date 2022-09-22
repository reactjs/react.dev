---
title: Suspense
---

<Intro>

`Suspense` is a React component that displays a fallback until its children have finished loading.


```js
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

</Intro>

<InlineToc />

---

## Usage {/*usage*/}

### Displaying a fallback while something is loading {/*displaying-a-fallback-while-something-is-loading*/}

You can wrap any part of your application with a Suspense component. If either data or code in <CodeStep step={2}>its children</CodeStep> hasn't loaded yet, React will switch to rendering the <CodeStep step={1}>`fallback`</CodeStep> prop instead. For example:

```js [[1, 3, "<LoadingSpinner />"], [2, 4, "<Comments />"]]
<>
  <Post />
  <Suspense fallback={<LoadingSpinner />}>
    <Comments />
  </Suspense>
</>
```

Suppose that `Comments` takes longer to load than `Post`. Without a Suspense boundary, React wouldn't be able to show either component until both have loaded — `Post` would be blocked by `Comments`.

Because of the Suspense boundary, `Post` doesn't need to wait for `Comments`. React renders `LoadingSpinner` in its place. Once `Comments` finishes loading, React replaces `LoadingSpinner` with `Comments`.

Suspense will never show unintentional "holes" in your content. For example, if `PhotoAlbums` has loaded but `Notes` have not, with the structure below, it will still show a `LoadingSpinner` instead of the entire `Grid`:

```js {4-7}
<>
  <ProfileHeader />
  <Suspense fallback={<LoadingSpinner />}>
    <Grid>
      <PhotoAlbums />
      <Notes />
    </Grid>
  </Suspense>
</>
```

To reveal nested content as it loads, you need to [add more Suspense boundaries.](#revealing-nested-content-as-it-loads)

<Gotcha>

**Only Suspense-enabled data sources will activate a Suspense boundary.** These data sources are said to *suspend* when the data needed to render has not yet loaded. Currently, Suspense is only supported for:

- [Lazy-loading components](#suspense-for-code-splitting)
- Data fetching with opinionated frameworks like [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/), [Next.js](https://nextjs.org/docs/advanced-features/react-18), [Hydrogen](https://hydrogen.shopify.dev/), and [Remix](https://remix.run/)

Suspense-enabled data fetching without the use of an opinionated framework is not yet supported. The requirements for implementing a Suspense-enabled data source are unstable and undocumented. An official API for integrating data sources with Suspense will be released in a future version of React.

Suspense does not detect when data is fetched inside an Effect or event handler.

</Gotcha>

---

### Revealing nested content as it loads {/*revealing-nested-content-as-it-loads*/}

When a component suspends, it activates the fallback of only the nearest parent Suspense boundary. This means you can nest multiple Suspense boundaries to create a loading sequence. Each Suspense boundary's fallback will be filled in as the next level of content becomes available.

To illustrate, consider the following example:

```js {1,4}
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

- If `Post` hasn't loaded yet, `BigSpinner` is shown in place of the entire main content area.
- Once `Post` finishes loading, `BigSpinner` is replaced by the main content.
- If `Comments` hasn't loaded yet, `CommentsGlimmer` is shown in its place.
- Finally, once `Comments` finishes loading, it replaces `CommentsGlimmer`. 

---

### Lazy-loading components with Suspense {/*lazy-loading-components-with-suspense*/}

The [`lazy`](/apis/react/lazy) API is powered by Suspense. When you render a component imported with `lazy`, it will suspend if it hasn't loaded yet. This allows you to display a loading indicator while your component's code is loading.

```js {3,12-15}
import { lazy, Suspense, useState } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  // ...
  return (
    <>
      ...
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Preview</h2>
          <MarkdownPreview />
        </Suspense>
      )}
    </>
  );
}
```

In this example, the code for `MarkdownPreview` won't be loaded until you attempt to render it. If `MarkdownPreview` hasn't loaded yet, `Loading` will be shown in its place. Try ticking the checkbox:

<Sandpack>

```js App.js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Hello, **world**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Show preview
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Preview</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// Add a fixed delay so you can see the loading state
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

```js Loading.js
export default function Loading() {
  return <p><i>Loading...</i></p>;
}
```

```js MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label {
  display: block;
}

input, textarea {
  margin-bottom: 10px;
}

body {
  min-height: 200px;
}
```

</Sandpack>

This demo loads with an artificial delay. The next time you untick and tick the checkbox, `Preview` will be cached, so there will be no loading state displayed. To see the loading state again, click "Reset" on the sandbox.

---

## Reference {/*reference*/}

### `Suspense` {/*suspense*/}

#### Props {/*suspense-props*/}
* `children`: The actual UI you intend to render. If `children` suspends while rendering, the Suspense boundary will switch to rendering `fallback`.
* `fallback`: An alternate UI to render in place of the actual UI if it has not finished loading. Any valid React node is accepted, though in practice, a fallback is a lightweight placeholder view, such as a loading spinner or skeleton. Suspense will automatically switch to `fallback` when `children` suspends, and back to `children` when the data is ready. If `fallback` suspends while rendering, it will activate the closest parent Suspense boundary.

### Caveats {/*caveats*/}

- React does not preserve any state for renders that got suspended before they were able to mount for the first time. When the component has loaded, React will retry rendering the suspended tree from scratch.
- If Suspense was displaying content for the tree, but then it suspended again, the `fallback` will be shown again unless the update causing it was caused by [`startTransition`](/apis/react/startTransition) or [`useDeferredValue`](/apis/react/useDeferredValue).
- If React needs to hide the already visible content because it suspended again, it will clean up [layout Effects](/apis/react/useLayoutEffect) in the content tree. When the content is ready to be shown again, React will fire the layout Effects again. This lets you make sure that Effects measuring the DOM layout don't try to do this while the content is hidden.
- React includes under-the-hood optimizations like *Streaming Server Rendering* and *Selective Hydration* that are integrated with Suspense. Read [an architectural overview](https://github.com/reactwg/react-18/discussions/37) and watch [a technical talk](https://www.youtube.com/watch?v=pj5N-Khihgc) to learn more.

---

## Troubleshooting {/*troubleshooting*/}

### How do I prevent the UI from being replaced by a fallback during an update? {/*preventing-unwanted-fallbacks*/}

Replacing visible UI with a fallback creates a jarring user experience. This can happen when an update causes a component to suspend, and the nearest Suspense boundary is already showing content to the user.

To prevent this from happening, mark the update as non-urgent using [`startTransition`](/apis/react/startTransition). During a transition, React will wait until enough data has loaded to prevent an unwanted fallback from appearing:

```js {2-3,5}
function handleNextPageClick() {
  // If this update suspends, don't hide the already displayed content
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```

This will avoid hiding existing content. However, any newly rendered `Suspense` boundaries will still immediately display fallbacks to avoid blocking the UI and let the user see the content as it becomes available.

**React will only prevent unwanted fallbacks during non-urgent updates**. It will not delay a render if it's the result of an urgent update. You must opt in with an API like [`startTransition`](/apis/react/startTransition) or [`useDeferredValue`](/apis/react/useDeferredValue).

If your router is integrated with Suspense, it should wrap its updates into [`startTransition`](/apis/react/startTransition) automatically.
