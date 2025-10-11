---
title: resumeToPipeableStream
---

<Intro>

`resumeToPipeableStream` streams a pre-rendered React tree  to a pipeable [Node.js Stream.](https://nodejs.org/api/stream.html)

```js
const {pipe, abort} = await resumeToPipeableStream(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

This API is specific to Node.js. Environments with [Web Streams,](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) like Deno and modern edge runtimes, should use [`resume`](/reference/react-dom/server/renderToReadableStream) instead.

</Note>

---

## Reference {/*reference*/}

### `resumeToPipeableStream(node, postponed, options?)` {/*resume-to-pipeable-stream*/}

Call `resume` to resume rendering a pre-rendered React tree as HTML into a [Node.js Stream.](https://nodejs.org/api/stream.html#writable-streams)

```js
import { resume } from 'react-dom/server';
import {getPostponedState} from './storage';

async function handler(request, response) {
  const postponed = await getPostponedState(request);
  const {pipe} = resumeToPipeableStream(<App />, postponed, {
    onShellReady: () => {
      pipe(response);
    }
  });
}
```

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: The React node you called `prerender` with. For example, a JSX element like `<App />`. It is expected to represent the entire document, so the `App` component should render the `<html>` tag.
* `postponedState`: The opaque `postpone` object returned from a [prerender API](/reference/react-dom/static/index), loaded from wherever you stored it (e.g. redis, a file, or S3).
* **optional** `options`: An object with streaming options.
  * **optional** `nonce`: A [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) string to allow scripts for [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **optional** `signal`: An [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that lets you [abort server rendering](#aborting-server-rendering) and render the rest on the client.
  * **optional** `onError`: A callback that fires whenever there is a server error, whether [recoverable](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) or [not.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell) By default, this only calls `console.error`. If you override it to [log crash reports,](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server) make sure that you still call `console.error`.
  * **optional** `onShellReady`: A callback that fires right after the [shell](#specifying-what-goes-into-the-shell) has finished. You can call `pipe` here to start streaming. React will [stream the additional content](#streaming-more-content-as-it-loads) after the shell along with the inline `<script>` tags that replace the HTML loading fallbacks with the content.
  * **optional** `onShellError`: A callback that fires if there was an error rendering the shell. It receives the error as an argument. No bytes were emitted from the stream yet, and neither `onShellReady` nor `onAllReady` will get called, so you can [output a fallback HTML shell](#recovering-from-errors-inside-the-shell) or use the prelude.


#### Returns {/*returns*/}

`resume` returns an object with two methods:

* `pipe` outputs the HTML into the provided [Writable Node.js Stream.](https://nodejs.org/api/stream.html#writable-streams) Call `pipe` in `onShellReady` if you want to enable streaming, or in `onAllReady` for crawlers and static generation.
* `abort` lets you [abort server rendering](#aborting-server-rendering) and render the rest on the client.

#### Caveats {/*caveats*/}

- `resumeToPipeableStream` does not accept options for `bootstrapScripts`, `bootstrapScriptContent`, or `bootstrapModules`. Instead, you need to pass these options to the `prerender` call that generates the `postponedState`. You can also inject bootstrap content into the writable stream manually.
- `resumeToPipeableStream` does not accept `identifierPrefix` since the prefix needs to be the same in both `prerender` and `resumeToPipeableStream`.
- Since `nonce` cannot be provided to prerender, you should only provide `nonce` to `resumeToPipeableStream` if you're not providing scripts to prerender.
- `resumeToPipeableStream` re-renders from the root until it finds a component that was not fully pre-rendered. Only fully prerendered Components (the Component and its children finished prerendering) are skipped entirely.

## Usage {/*usage*/}

### Further reading {/*further-reading*/}

Resuming behaves like `renderToReadableStream`. For more examples, check out the [usage section of `renderToReadableStream`](/reference/react-dom/server/renderToReadableStream#usage).
The [usage section of `prerender`](/reference/react-dom/static/prerender#usage) includes examples of how to use `prerenderToNodeStream` specifically.