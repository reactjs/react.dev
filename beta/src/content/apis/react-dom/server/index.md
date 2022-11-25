---
title: react-dom/server
---

<Intro>

The `react-dom/server` APIs let you render React components to HTML on the server. These APIs are only used on the server at the top level of your app to generate the initial HTML. A [framework](/learn/start-a-new-react-project#building-with-a-full-featured-framework) may call them for you. Most of your components don't need to import or use them.

</Intro>

<InlineToc />

---

## React DOM Server APIs for Node.js Streams {/*react-dom-server-apis-for-nodejs-streams*/}

These methods are only available in the environments with [Node.js Streams:](https://nodejs.org/api/stream.html)

* [`renderToPipeableStream`](/apis/react-dom/server/renderToPipeableStream) renders a React tree to a pipeable [Node.js Stream.](https://nodejs.org/api/stream.html)
* [`renderToStaticNodeStream`](/apis/react-dom/server/renderToStaticNodeStream) renders a non-interactive React tree to a [Node.js Readable Stream.](https://nodejs.org/api/stream.html#readable-streams)

---

## React DOM Server APIs for Web Streams {/*react-dom-server-apis-for-web-streams*/}

These methods are only available in the environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), which includes browsers, Deno, and some modern edge runtimes:

* [`renderToReadableStream`](/apis/react-dom/server/renderToReadableStream) renders a React tree to a [Readable](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) Web Stream.

---

## React DOM Server APIs for non-streaming environments {/*react-dom-server-apis-for-non-streaming-environments*/}

These methods can be used in the environments that don't support streams:

* [`renderToString`](/apis/react-dom/server/renderToString) renders a React tree to a string.
* [`renderToStaticMarkup`](/apis/react-dom/server/renderToStaticMarkup) renders a non-interactive React tree to a string.

They have limited functionality compared to the streaming APIs.

---

## Deprecated React DOM Server APIs {/*deprecated-react-dom-server-apis*/}

<Deprecated>

This API will be removed in a future major version of React.

</Deprecated>

* [`renderToNodeStream`](/apis/react-dom/server/renderToNodeStream) renders a React tree to a [Node.js Readable stream.](https://nodejs.org/api/stream.html#readable-streams) (Deprecated.)
