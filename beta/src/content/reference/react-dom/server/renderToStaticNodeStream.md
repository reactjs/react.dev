---
title: renderToStaticNodeStream
---

<Intro>

`renderToStaticNodeStream` renders a non-interactive React tree to a [Node.js Readable Stream.](https://nodejs.org/api/stream.html#readable-streams)

```js
const stream = renderToStaticNodeStream(reactNode)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `renderToStaticNodeStream(reactNode)` {/*rendertostaticnodestream*/}

On the server, call `renderToStaticNodeStream` to get a [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams).

```js
const stream = renderToStaticNodeStream(<Page />);
stream.pipe(response);
```

The stream will produce non-interactive HTML output of your React components.

#### Parameters {/*parameters*/}

* `reactNode`: A React node you want to render to HTML. For example, a JSX element like `<Page />`.

#### Returns {/*returns*/}

A [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) that outputs an HTML string. The resulting HTML can't be hydrated on the client.

#### Caveats {/*caveats*/}

* `renderToStaticNodeStream` output cannot be hydrated.

* This method will wait for all [Suspense boundaries](/reference/react/Suspense) to complete before returning any output.

* As of React 18, this method buffers all of its output, so it doesn't actually provide any streaming benefits.

* The returned stream is a byte stream encoded in utf-8. If you need a stream in another encoding, take a look at a project like [iconv-lite](https://www.npmjs.com/package/iconv-lite), which provides transform streams for transcoding text.

---

## Usage {/*usage*/}

### Rendering a React tree as static HTML to a Node.js Readable Stream {/*rendering-a-react-tree-as-static-html-to-a-nodejs-readable-stream*/}

Call `renderToStaticNodeStream` to get a [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) which you can pipe to your server response:

```js {5-6}
import { renderToStaticNodeStream } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const stream = renderToStaticNodeStream(<Page />);
  stream.pipe(response);
});
```

The stream will produce the initial non-interactive HTML output of your React components.

<Pitfall>

This method renders **non-interactive HTML that cannot be hydrated.** This is useful if you want to use React as a simple static page generator, or if you're rendering completely static content like emails.

Interactive apps should use [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) on the server and [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) on the client.

</Pitfall>
