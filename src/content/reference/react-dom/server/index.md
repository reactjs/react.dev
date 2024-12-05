---
title: Server React DOM APIs
---

<Intro>

The `react-dom/server` APIs let you server-side render React components to HTML. These APIs are only used on the server at the top level of your app to generate the initial HTML. A [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) may call them for you. Most of your components don't need to import or use them.

</Intro>

---

## Server APIs for Node.js Streams {/*server-apis-for-nodejs-streams*/}

These methods are only available in the environments with [Node.js Streams:](https://nodejs.org/api/stream.html)

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) renders a React tree to a pipeable [Node.js Stream.](https://nodejs.org/api/stream.html)

---

## Server APIs for Web Streams {/*server-apis-for-web-streams*/}

These methods are only available in the environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), which includes browsers, Deno, and some modern edge runtimes:

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) renders a React tree to a [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

---

## Legacy Server APIs for non-streaming environments {/*legacy-server-apis-for-non-streaming-environments*/}

These methods can be used in the environments that don't support streams:

* [`renderToString`](/reference/react-dom/server/renderToString) renders a React tree to a string.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) renders a non-interactive React tree to a string.

They have limited functionality compared to the streaming APIs.
