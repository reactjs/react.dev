---
title: renderToString
---

<Pitfall>

`renderToString` does not support streaming or waiting for data. [See the alternatives.](#alternatives)

</Pitfall>

<Intro>

`renderToString` renders a React tree to an HTML string.

```js
const html = renderToString(reactNode)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `renderToString(reactNode)` {/*rendertostring*/}

On the server, call `renderToString` to render your app to HTML.

```js {3-4}
const html = renderToString(<App />);
```

On the client, call [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) to make the server-generated HTML interactive.

#### Parameters {/*parameters*/}

* `reactNode`: A React node you want to render to HTML. For example, a JSX node like `<App />`.

#### Returns {/*returns*/}

An HTML string.

#### Caveats {/*caveats*/}

* `renderToString` has limited Suspense support. If a component suspends, `renderToString` immediately sends its fallback as HTML.

* `renderToString` works in the browser, but using it in the client code is [not recommended.](#removing-rendertostring-from-the-client-code)

---

## Usage {/*usage*/}

### Rendering a React tree as HTML to a string {/*rendering-a-react-tree-as-html-to-a-string*/}

Call `renderToString` to render your app to an HTML string which you can send with your server response:

```js {5-6}
import { renderToString } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

This will produce the initial non-interactive HTML output of your React components. On the client, you will need to call [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) to *hydrate* that server-generated HTML and make it interactive.


<Pitfall>

`renderToString` does not support streaming or waiting for data. [See the alternatives.](#alternatives)

</Pitfall>

---

## Alternatives {/*alternatives*/}

### Migrating from `renderToString` to a streaming method on the server {/*migrating-from-rendertostring-to-a-streaming-method-on-the-server*/}

`renderToString` returns a string immediately, so it does not support streaming or waiting for data.

When possible, we recommend to use these fully-featured alternatives:

* If you use Node.js, use [`renderToPipeableStream`.](/reference/react-dom/server/renderToPipeableStream)
* If you use Deno or a modern edge runtime with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), use [`renderToReadableStream`.](/reference/react-dom/server/renderToReadableStream)

You can continue using `renderToString` if your server environment does not support streams.

---

### Removing `renderToString` from the client code {/*removing-rendertostring-from-the-client-code*/}

Sometimes, `renderToString` is used on the client to convert some component to HTML.

```js {1-2}
// 🚩 Unnecessary: using renderToString on the client
import { renderToString } from 'react-dom/server';

const html = renderToString(<MyIcon />);
console.log(html); // For example, "<svg>...</svg>"
```

Importing `react-dom/server` **on the client** unnecessarily increases your bundle size and should be avoided. If you need to render some component to HTML in the browser, use [`createRoot`](/reference/react-dom/client/createRoot) and read HTML from the DOM:

```js
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<MyIcon />);
});
console.log(div.innerHTML); // For example, "<svg>...</svg>"
```

The [`flushSync`](/reference/react-dom/flushSync) call is necessary so that the DOM is updated before reading its [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) property.

---

## Troubleshooting {/*troubleshooting*/}

### When a component suspends, the HTML always contains a fallback {/*when-a-component-suspends-the-html-always-contains-a-fallback*/}

`renderToString` does not fully support Suspense.

If some component suspends (for example, because it's defined with [`lazy`](/reference/react/lazy) or fetches data), `renderToString` will not wait for its content to resolve. Instead, `renderToString` will find the closest [`<Suspense>`](/reference/react/Suspense) boundary above it and render its `fallback` prop in the HTML. The content will not appear until the client code loads.

To solve this, use one of the [recommended streaming solutions.](#migrating-from-rendertostring-to-a-streaming-method-on-the-server) They can stream content in chunks as it resolves on the server so that the user sees the page being progressively filled in even before the client code loads.

