---
title: Static React DOM APIs
---

<Intro>

The `react-dom/static` APIs let you generate static HTML for React components. They have limited functionality compared to the streaming APIs. A [framework](/learn/start-a-new-react-project#full-stack-frameworks) may call them for you. Most of your components don't need to import or use them.

</Intro>

---

## Static APIs for Web Streams {/*static-apis-for-web-streams*/}

These methods are only available in the environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), which includes browsers, Deno, and some modern edge runtimes:

* [`prerender`](/reference/react-dom/static/prerender) renders a React tree to static HTML with a [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)


---

## Static APIs for Node.js Streams {/*static-apis-for-nodejs-streams*/}

These methods are only available in the environments with [Node.js Streams](https://nodejs.org/api/stream.html):

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) renders a React tree to static HTML with a [Node.js Stream.](https://nodejs.org/api/stream.html)


