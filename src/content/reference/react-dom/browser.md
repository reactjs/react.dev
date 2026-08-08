---
title: browser
version: canary
---

<Canary>

**The `browser` API is currently only available in React’s Canary and Experimental channels.**

[Learn more about React’s release channels here.](/community/versioning-policy#all-release-channels)

</Canary>

<Intro>

`browser` lets you skip rendering part of a React tree on the server, leaving its nearest Suspense fallback in place until that content renders in the browser.

```js
use(browser(reason?));
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `browser(reason?)` {/*browser*/}

Call `browser` inside [`use`](/reference/react/use) to skip rendering a component on the server and render it in the browser instead:

```js
import { use } from 'react';
import { browser } from 'react-dom';

function BrowserOnly() {
  use(browser('This component requires browser APIs.'));
  return <BrowserContent />;
}
```

During server rendering, `use(browser())` stops rendering the component and renders the fallback of the closest [`<Suspense>`](/reference/react/Suspense) boundary instead. In the browser, it has no effect, so the component renders normally.

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* **optional** `reason`: A string or function that provides diagnostic information about why rendering should happen only in the browser. React calls a reason function each time a server renderer encounters the value returned by `browser`; it never calls it in the browser. Use a function for values that are expensive to create, such as `() => new Error(...)`. The resulting value becomes the `cause` of the `Error` passed to `onBrowserBailout`.

#### Returns {/*returns*/}

`browser` returns an opaque value. Pass this value to `use` in a component, or use it as the reason when [aborting a server render](#aborting-pending-server-rendering-for-the-browser). In the browser, passing this value to `use` returns `undefined`.

#### Caveats {/*caveats*/}

* A component that passes a value returned by `browser` to `use` during server rendering must have a `<Suspense>` boundary above it. Otherwise, the entire server render will fail.
* `browser` is not available in a `react-server` environment. You can use it while server-rendering Client Components, but you cannot import it in a [React Server Component](/reference/rsc/server-components).
* Calling `browser()` by itself does not check the current environment or affect rendering. To trigger its behavior, pass the return value to `use` or use it to abort a server render. This means you can create the value at module scope and reuse it.
* To defer a component, pass the value returned by `browser` to `use`. Do not throw the value directly.

---

## Usage {/*usage*/}

### Rendering content only in the browser {/*rendering-content-only-in-the-browser*/}

Call `use` with the value returned by `browser` to skip rendering a component on the server:

```js
import { Suspense, use } from 'react';
import { browser } from 'react-dom';

function BrowserOnlyEditor() {
  use(browser('The editor requires browser APIs.'));
  return <Editor />;
}

export default function Page() {
  return (
    <Suspense fallback={<p>Loading editor...</p>}>
      <BrowserOnlyEditor />
    </Suspense>
  );
}
```

During server rendering, React includes the `Loading editor...` fallback in the HTML. When the app renders in the browser, `use(browser())` continues immediately and React renders the `Editor` instead.

---

### Conditionally rendering in the browser {/*conditionally-rendering-in-the-browser*/}

Like other calls to [`use`](/reference/react/use), `use(browser())` can be called conditionally, including inside a custom Hook. For example, you can wrap a Suspense-enabled data-fetching library's `useQuery` to render initial data on the server, but defer to the browser when that data is missing:

```js {3}
function useBrowserQuery(query, options) {
  if (options.initialData === undefined) {
    use(browser('useBrowserQuery: No initial data was provided.'));
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

On the server, `useBrowserQuery` calls the underlying `useQuery` only when `initialData` is available. Otherwise, `use(browser())` leaves the nearest Suspense fallback in the HTML. In the browser, `use(browser())` continues immediately, so the query library can fetch the data or read it from its client cache.

---

### Reporting browser-only rendering on the server {/*reporting-browser-only-rendering-on-the-server*/}

Provide `onBrowserBailout` to the server renderer to report browser-only rendering. React does not report a browser-only render recovered by a Suspense boundary to the server renderer's `onError` callback or [`hydrateRoot`'s `onRecoverableError`](/reference/react-dom/client/hydrateRoot#error-logging-in-production) callback. This example also passes an optional reason, which React makes available as the reported error's `cause`:

```js
import { Suspense, use } from 'react';
import { browser } from 'react-dom';
import { renderToPipeableStream } from 'react-dom/server';

function BrowserOnlyEditor() {
  use(browser(() => new Error('The editor requires a browser API.')));
  return <Editor />;
}

const { pipe } = renderToPipeableStream(
  <Suspense fallback={<p>Loading editor...</p>}>
    <BrowserOnlyEditor />
  </Suspense>,
  {
    onShellReady() {
      pipe(response);
    },
    onBrowserBailout(error, errorInfo) {
      logBrowserBailout(error, errorInfo);
    }
  }
);
```

`onBrowserBailout` receives two arguments:

1. An `Error` describing the browser-only render. If a reason was supplied to `browser`, it is available as the error's `cause`.
2. An `errorInfo` object containing the `componentStack` of the browser-only render.

The reason function can return any value. Returning a new `Error` gives the cause its own stack without creating that `Error` during rendering in the browser. React does not serialize the reason into the HTML.

If there is no Suspense boundary to provide a fallback, the server render fails. React reports the failure through the renderer's normal error callbacks instead of `onBrowserBailout`.

---

### Aborting pending server rendering for the browser {/*aborting-pending-server-rendering-for-the-browser*/}

You can pass the value returned by `browser` as the reason for aborting a server render. This leaves pending Suspense boundaries in their fallback state so React can render their content in the browser:

```js {1,8}
import { browser } from 'react-dom';
import { renderToPipeableStream } from 'react-dom/server';

const { pipe, abort } = renderToPipeableStream(<App />, {
  onShellReady() {
    pipe(response);
    setTimeout(() => {
      abort(browser('The server render timed out.'));
    }, 10000);
  }
});
```

Unlike other abort reasons, a value returned by `browser` is not reported to the server renderer's `onError` callback or to `hydrateRoot`'s `onRecoverableError` callback. The server renderer reports each recovered Suspense boundary to `onBrowserBailout` instead.

For server rendering APIs that accept an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal), pass `browser()` as the reason to [`AbortController.abort`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort).
