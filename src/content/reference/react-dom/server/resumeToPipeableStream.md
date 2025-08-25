---
title: resumeToPipeableStream
canary: true
---

<Intro>

`resume` streams a pre-rendered React tree  to a pipeable [Node.js Stream.](https://nodejs.org/api/stream.html)

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
import {getPostponedState} from 'storage';

async function handler(request) {
  const postponed = await getPostponedState(request);
  const {pipe} = await resumeToPipeableStream(<App />, postponed, {
    onShellReady: () => {
      pipe(response);
    }
  });
}
```

TODO: when do you call hydrateRoot? In the shell or when you resume?

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: The React node you called `prerender` with. For example, a JSX element like `<App />`. It is expected to represent the entire document, so the `App` component should render the `<html>` tag.
* `postponedState`: The opaque `postpone` object returned from `prerender`, loaded from wherever you stored it (e.g. redis, a file, or S3).
* **optional** `options`: An object with streaming options.
  * **optional** `nonce`: A [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) string to allow scripts for [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **optional** `onAllReady`: A callback that fires when all rendering is complete. You can use this instead of `onShellReady` [for crawlers and static generation.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) If you start streaming here, you won't get any progressive loading. The stream will contain the final HTML.
  * **optional** `onError`: A callback that fires whenever there is a server error, whether [recoverable](#recovering-from-errors-outside-the-shell) or [not.](#recovering-from-errors-inside-the-shell) By default, this only calls `console.error`. If you override it to [log crash reports,](#logging-crashes-on-the-server) make sure that you still call `console.error`.
  * **optional** `onShellReady`: A callback that fires right after the [initial shell](#specifying-what-goes-into-the-shell) has been replayed. You can call `pipe` here to start streaming. React will [stream the additional content](#streaming-more-content-as-it-loads) after the shell along with the inline `<script>` tags that replace the HTML loading fallbacks with the content.
  * **optional** `onShellError`: A callback that fires if there was an error rendering the initial shell.  It receives the error as an argument. No bytes were emitted from the stream yet, and neither `onShellReady` nor `onAllReady` will get called, so you can [output a fallback HTML shell.](#recovering-from-errors-inside-the-shell)

TODO: what's the behavior of `onShellError`? Is this only for when the shell replay errors?


#### Returns {/*returns*/}

`resume` returns a Promise:

returns an object with two methods:

* `pipe` outputs the HTML into the provided [Writable Node.js Stream.](https://nodejs.org/api/stream.html#writable-streams) Call `pipe` in `onShellReady` if you want to enable streaming, or in `onAllReady` for crawlers and static generation.
* `abort` lets you [abort server rendering](#aborting-server-rendering) and render the rest on the client.


#### Caveats {/*caveats*/}
- `resume` does not accept options for `bootstrapScripts`, `bootstrapScriptContent`, or `bootstrapModules`. Instead, you need to pass these options to the `prerender` call that generates the `postponedState`. These may be injected either during pre-render or resume.
- `resume` does not accept `identifierPrefix`, `namespaceURI`, or `progressiveChunkSize` since these need to be the same in both `prerender` and `resume`.
- Since `nonce` cannot be provided to prerender, you should only provide `nonce` to `resume` if you're not providing scripts to prerender.
- `resume` re-renders from the root until it finds a component that was not fully pre-rendered, and skips fully pre-rendered components.
- TODO: no `namespaceURI`
- TODO: can't set status codes.

---

## Usage {/*usage*/}

### Resuming a prerender to a Node.js Stream {/*resuming-a-prerender-to-a-node-js-stream*/}

TODO

---

### Logging crashes on the server {/*logging-crashes-on-the-server*/}

By default, all errors on the server are logged to console. You can override this behavior to log crash reports:

```js {9-10}
import { resume } from 'react-dom/server';
import { getPostponedState } from 'storage';
import { logServerCrashReport } from 'logging';

async function handler(request, response) {
  const postponed = await getPostponedState(request);
  const {pipe} = await resumeToPipeableStream(<App />, postponed, {
    onShellReady: () => {
      pipe(response);
    },
    onError(error) {
      console.error(error);
      logServerCrashReport(error);
    }
  });
}
```

If you provide a custom `onError` implementation, don't forget to also log errors to the console like above.

---

### Recovering from errors replaying the shell {/*recovering-from-errors-inside-the-shell*/}

TODO: this is for when the shell completed.

In this example, prerender successfully rendered a shell containing `ProfileLayout`, `ProfileCover`, and `PostsGlimmer`:

```js {3-5,7-8}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

If an error occurs while replaying those components, React won't have any meaningful HTML to send to the client. TODO: how to recover from this, since the promise is resolved. I think it will just encode an error in the stream and trigger an error boundary?

```js {2,13-18}
// TODO
```

If there is an error while replaying the shell, it will be logged to `onError`.

### Recovering from errors re-creating the shell {/*recovering-from-errors-re-creating-the-shell*/}

TODO: this is for when the shell errors, and re-creating the shell fails.

---

### Recovering from errors outside the shell {/*recovering-from-errors-outside-the-shell*/}

TODO: confirm this section is correct.

In this example, the `<Posts />` component is wrapped in `<Suspense>` so it is *not* a part of the shell:

```js {6}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

If an error happens in the `Posts` component or somewhere inside it, React will [try to recover from it:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

1. It will emit the loading fallback for the closest `<Suspense>` boundary (`PostsGlimmer`) into the HTML.
2. It will "give up" on trying to render the `Posts` content on the server anymore.
3. When the JavaScript code loads on the client, React will *retry* rendering `Posts` on the client.

If retrying rendering `Posts` on the client *also* fails, React will throw the error on the client. As with all the errors thrown during rendering, the [closest parent error boundary](/reference/react/Component#static-getderivedstatefromerror) determines how to present the error to the user. In practice, this means that the user will see a loading indicator until it is certain that the error is not recoverable.

If retrying rendering `Posts` on the client succeeds, the loading fallback from the server will be replaced with the client rendering output. The user will not know that there was a server error. However, the server `onError` callback and the client [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) callbacks will fire so that you can get notified about the error.

---

### Setting the status code {/*setting-the-status-code*/}

TODO: you can't set the status code in resume, unless you're calling prerender in the same request. If so, set the status code between `prerender` and `resume`.

---

### Handling different errors in different ways {/*handling-different-errors-in-different-ways*/}

TODO: update this example.

You can [create your own `Error` subclasses](https://javascript.info/custom-errors) and use the [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) operator to check which error is thrown. For example, you can define a custom `NotFoundError` and throw it from your component. Then you can save the error in `onError` and do something different before returning the response depending on the error type:

```js {2-3,5-15,22,28,33}
async function handler(request) {
  let didError = false;
  let caughtError = null;

  function getStatusCode() {
    if (didError) {
      if (caughtError instanceof NotFoundError) {
        return 404;
      } else {
        return 500;
      }
    } else {
      return 200;
    }
  }

  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        caughtError = error;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

---

### Waiting for all content to load for crawlers and static generation {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

TODO: this doesn't make sense for `resume` right?

---

### Aborting server rendering {/*aborting-server-rendering*/}

TODO