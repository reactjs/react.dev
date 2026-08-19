---
title: browser
version: canary
---

<Intro>

<Canary>

**The `browser` API is currently only available in React’s Canary and Experimental channels.**

[Learn more about React’s release channels here.](/community/versioning-policy#all-release-channels)

</Canary>

`browser` lets you render part of a React tree only in the browser.

```js
use(browser(reason?))
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

During server rendering, `use(browser())` stops rendering the component and leaves the closest [`<Suspense>`](/reference/react/Suspense) boundary's fallback in its place. In the browser, `use(browser())` returns `undefined`, so the component renders normally.

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* **optional** `reason`: A string or function that explains why the content needs to render in the browser. If you pass a function, React calls it each time a server renderer encounters the value returned by `browser`. React does not call it in the browser. Use a function for values that are expensive to create, such as `() => new Error(...)`. The string or the function's return value becomes the `cause` of the `Error` passed to `onBrowserBailout`.

#### Returns {/*returns*/}

`browser` returns a value that you can pass to `use` in a component or use as the reason when [aborting a server render](#aborting-pending-server-rendering-for-the-browser). In the browser, passing this value to `use` returns `undefined`.

#### Caveats {/*caveats*/}

* `use(browser())` must be inside a `<Suspense>` boundary during server rendering. Without one, the server render fails.
* `browser` is not available in a `react-server` environment. You can use it while rendering Client Components on the server, but you cannot import it in a [React Server Component](/reference/rsc/server-components).
* Calling `browser()` by itself has no effect. You can create the value at module scope and reuse it.
* To skip rendering a component on the server, pass the value returned by `browser` to `use`. Do not throw it.

---

## Usage {/*usage*/}

### Rendering content only in the browser {/*rendering-content-only-in-the-browser*/}

Call `use` with the value returned by `browser` to skip rendering a component on the server:

Press **Render on the server** to see the fallback first. The demo waits briefly before hydrating and showing the browser-only editor.

<Sandpack>

```js src/App.js active
import { Suspense, use } from 'react';
import { browser } from 'react-dom';

function BrowserOnlyEditor() {
  use(browser('The editor requires browser APIs.'));
  return <label>Draft: <input /></label>;
}

export default function App() {
  return (
    <Suspense fallback={<p>Loading editor...</p>}>
      <BrowserOnlyEditor />
    </Suspense>
  );
}
```

```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Article editor</title>
      </head>
      <body>
        <h1>Article editor</h1>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js
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

const renderButton = document.getElementById('render');
renderButton.addEventListener('click', () => {
  renderButton.disabled = true;
  main(document.getElementById('preview'));
}, { once: true });
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  for await (const chunk of readable) {
    doc.write(decoder.decode(chunk, { stream: true }));
  }
  doc.close();
}
```

```html public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Browser-only rendering</title>
</head>
<body>
  <button id="render">Render on the server</button>
  <br /><br />
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 180px;
  border: 1px solid #aaa;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
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

In a React Server Components app, `use(browser())` must be called from a Client Component. If your framework uses Server Components by default, add the [`'use client'`](/reference/rsc/use-client) directive to that file or move the call to a child Client Component:

```js {1}
'use client';

import { use } from 'react';
import { browser } from 'react-dom';

export default function BrowserOnlyEditor() {
  use(browser('The editor requires browser APIs.'));
  return <Editor />;
}
```

</Note>

---

### Conditionally rendering in the browser {/*conditionally-rendering-in-the-browser*/}

Like other calls to [`use`](/reference/react/use), you can call `use(browser())` conditionally or inside a custom Hook. For example, you can wrap a Suspense-enabled data-fetching library's `useQuery` and skip server rendering when initial data is missing:

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

On the server, `useBrowserQuery` calls `useQuery` only when `initialData` is available. Otherwise, the closest Suspense boundary's fallback remains in the HTML. In the browser, `use(browser())` returns `undefined`, so the query library can fetch the data or read it from its client cache.

---

### Reporting browser-only rendering on the server {/*reporting-browser-only-rendering-on-the-server*/}

Pass an `onBrowserBailout` callback to the server renderer to report browser-only rendering. When React leaves a Suspense fallback for the browser, it does not call the server renderer's `onError` callback or [`hydrateRoot`'s `onRecoverableError`](/reference/react-dom/client/hydrateRoot#error-logging-in-production) callback. This example also passes a reason, which is available as the reported error's `cause`:

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

1. An `Error` describing the browser-only render. If you passed a reason to `browser`, it is available as the error's `cause`.
2. An `errorInfo` object with a `componentStack` showing where browser-only rendering occurred.

The reason function can return any value. Return a new `Error` to give the cause its own stack without creating the `Error` in the browser. React does not serialize the reason into the HTML.

If there is no Suspense boundary to provide a fallback, the server render fails. React reports the failure through the renderer's usual error callbacks instead of `onBrowserBailout`.

---

### Aborting pending server rendering for the browser {/*aborting-pending-server-rendering-for-the-browser*/}

Pass the value returned by `browser` as the reason when aborting a server render. React then leaves pending Suspense boundaries in their fallback state and renders their content in the browser:

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

A `browser` abort reason does not trigger the server renderer's `onError` callback or `hydrateRoot`'s `onRecoverableError` callback. Instead, the server renderer reports each recovered Suspense boundary to `onBrowserBailout`.

For server rendering APIs that accept an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal), pass `browser()` as the reason to [`AbortController.abort`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort).
