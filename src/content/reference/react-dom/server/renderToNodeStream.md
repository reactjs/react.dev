---
title: renderToNodeStream
---

<Deprecated>

This API will be removed in a future major version of React. Use [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) instead.

</Deprecated>

<Intro>

`renderToNodeStream` renders a React tree to a [Node.js Readable Stream.](https://nodejs.org/api/stream.html#readable-streams)

```js
const stream = renderToNodeStream(reactNode)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `renderToNodeStream(reactNode)` {/*rendertonodestream*/}

On the server, call `renderToNodeStream` to get a [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) which you can pipe into the response.

```js
import { renderToNodeStream } from 'react-dom/server';

const stream = renderToNodeStream(<App />);
stream.pipe(response);
```

On the client, call [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) to make the server-generated HTML interactive.

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: A React node you want to render to HTML. For example, a JSX element like `<App />`.

#### Returns {/*returns*/}

A [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) that outputs an HTML string.

#### Caveats {/*caveats*/}

* This method will wait for all [Suspense boundaries](/reference/react/Suspense) to complete before returning any output.

* As of React 18, this method buffers all of its output, so it doesn't actually provide any streaming benefits. This is why it's recommended that you migrate to [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) instead.

* The returned stream is a byte stream encoded in utf-8. If you need a stream in another encoding, take a look at a project like [iconv-lite](https://www.npmjs.com/package/iconv-lite), which provides transform streams for transcoding text.

---

## Usage {/*usage*/}

### Rendering a React tree as HTML to a Node.js Readable Stream {/*rendering-a-react-tree-as-html-to-a-nodejs-readable-stream*/}

Call `renderToNodeStream` to get a [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) which you can pipe to your server response:

```js {5-6}
import { renderToNodeStream } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const stream = renderToNodeStream(<App />);
  stream.pipe(response);
});
```

The stream will produce the initial non-interactive HTML output of your React components. On the client, you will need to call [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) to *hydrate* that server-generated HTML and make it interactive.
