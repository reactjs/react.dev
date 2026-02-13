---
title: use
---

<Intro>

`use` is a React API that lets you read the value of a resource like a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `use(resource)` {/*use*/}

Call `use` in your component to read the value of a resource like a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).

```js
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
```

Unlike React Hooks, `use` can be called within loops and conditional statements like `if`. Like React Hooks, the function that calls `use` must be a Component or Hook.

When called with a Promise, `use` integrates with [`Suspense`](/reference/react/Suspense) and [Error Boundaries](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). The component calling `use` *suspends* while the Promise passed to `use` is pending. If the component that calls `use` is wrapped in a Suspense boundary, the fallback will be displayed. Once the Promise is resolved, the Suspense fallback is replaced by the rendered components using the data returned by `use`. If the Promise passed to `use` is rejected, the fallback of the nearest Error Boundary will be displayed.

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `resource`: This is the source of the data you want to read a value from. A resource can be a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or a [context](/learn/passing-data-deeply-with-context).

#### Returns {/*returns*/}

The `use` API returns the value that was read from the resource like the resolved value of a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).

#### Caveats {/*caveats*/}

* `use` must be called inside a Component or a Hook.
* `use` cannot be called inside a try-catch block. Instead, wrap your component in an [Error Boundary](#displaying-an-error-with-an-error-boundary), or use the Promise's [`.catch` method](#providing-an-alternative-value-with-promise-catch) to provide an alternative value.
* When fetching data in a [Server Component](/reference/rsc/server-components), prefer `async` and `await` over `use`. `async` and `await` pick up rendering from the point where `await` was invoked, whereas `use` re-renders the component after the data is resolved.
* Prefer creating Promises in [Server Components](/reference/rsc/server-components) and passing them to [Client Components](/reference/rsc/use-client) over creating Promises in Client Components. Promises created in Client Components are recreated on every render. Promises passed from a Server Component to a Client Component are stable across re-renders. [See this example.](#streaming-data-from-server-to-client)
* Promises passed to `use` must be stable across renders. Creating a new Promise inside a component on every render will cause React to display the Suspense fallback on every re-render. [See caching Promises below.](#caching-promises-for-client-components)
* Reading context with `use` is not supported in [Server Components](/reference/rsc/server-components).

---

## Usage {/*usage*/}

### Reading context with `use` {/*reading-context-with-use*/}

When a [context](/learn/passing-data-deeply-with-context) is passed to `use`, it works similarly to [`useContext`](/reference/react/useContext). While `useContext` must be called at the top level of your component, `use` can be called inside conditionals like `if` and loops like `for`.

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ...
```

`use` returns the <CodeStep step={2}>context value</CodeStep> for the <CodeStep step={1}>context</CodeStep> you passed. To determine the context value, React searches the component tree and finds **the closest context provider above** for that particular context.

To pass context to a `Button`, wrap it or one of its parent components into the corresponding context provider.

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

It doesn't matter how many layers of components there are between the provider and the `Button`. When a `Button` *anywhere* inside of `Form` calls `use(ThemeContext)`, it will receive `"dark"` as the value.

Unlike [`useContext`](/reference/react/useContext), <CodeStep step={2}>`use`</CodeStep> can be called in conditionals and loops like <CodeStep step={1}>`if`</CodeStep>.

```js [[1, 2, "if"], [2, 3, "use"]]
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

<CodeStep step={2}>`use`</CodeStep> is called from inside a <CodeStep step={1}>`if`</CodeStep> statement, allowing you to conditionally read values from a Context.

<Pitfall>

Like `useContext`, `use(context)` always looks for the closest context provider *above* the component that calls it. It searches upwards and **does not** consider context providers in the component from which you're calling `use(context)`.

</Pitfall>

<Sandpack>

```js
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button show={true}>Sign up</Button>
      <Button show={false}>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = use(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ show, children }) {
  if (show) {
    const theme = use(ThemeContext);
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
  return false
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Reading a Promise with `use` {/*reading-a-promise-with-use*/}

Call `use` with a Promise to read its resolved value. The component will [suspend](/reference/react/Suspense) while the Promise is pending.

```js [[1, 4, "use(albumsPromise)"]]
import { use } from 'react';

function Albums({ albumsPromise }) {
  const albums = use(albumsPromise);
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

The component that calls <CodeStep step={1}>`use`</CodeStep> must be wrapped in a [`Suspense`](/reference/react/Suspense) boundary. While the Promise is pending, the Suspense fallback is displayed. Once the Promise resolves, React reads the value with `use` and replaces the fallback with the rendered component.

<Recipes titleText="Reading a Promise with use vs fetching in an Effect" titleId="examples-promise">

#### Fetching data with `use` {/*fetching-data-with-use*/}

Calling `use` with a cached Promise is the recommended way to fetch data. The component suspends while the Promise is pending, and React displays the nearest Suspense fallback. Rejected Promises propagate to the nearest [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary).

<Sandpack>

```js src/App.js active
import { use, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { fetchData } from './data.js';

export default function App() {
  return (
    <ErrorBoundary fallback={<p>Could not fetch albums.</p>}>
      <Suspense fallback={<Loading />}>
        <Albums />
      </Suspense>
    </ErrorBoundary>
  );
}

function Albums() {
  const albums = use(fetchData('/albums'));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

function Loading() {
  return <h2>Loading...</h2>;
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }];
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

<Solution />

#### Fetching data with `useEffect` {/*fetching-data-with-useeffect*/}

Without `use`, a common approach is to fetch data in an Effect and update state when the data arrives. This requires managing loading and error states manually, and the component renders empty on first paint before the Effect fires.

<Sandpack>

```js src/App.js active
import { useState, useEffect } from 'react';
import { fetchAlbums } from './data.js';

export default function App() {
  const [albums, setAlbums] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlbums()
      .then(data => {
        setAlbums(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
export async function fetchAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }];
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

##### Promises passed to `use` must be stable across renders {/*promises-must-be-stable*/}

Promises created inside a component are recreated on every render. This causes React to show the Suspense fallback repeatedly and prevents content from appearing. Instead, pass a Promise from a Suspense-compatible data source. These include Suspense-enabled frameworks and client-side caching solutions such as a [`fetchData` wrapper](#caching-promises-for-client-components), or pass a Promise from a Server Component.

```js
function Albums() {
  // 🔴 Creating a new Promise on every render
  const albums = use(fetchAlbums());
  // ...
}
```

```js
// ✅ Cache the Promise so it's stable across renders
const albums = use(fetchData('/albums'));
```

</Pitfall>

---

### Streaming data from server to client {/*streaming-data-from-server-to-client*/}

Data can be streamed from the server to the client by passing a Promise as a prop from a <CodeStep step={1}>Server Component</CodeStep> to a <CodeStep step={2}>Client Component</CodeStep>.

```js [[1, 4, "App"], [2, 2, "Message"], [3, 7, "Suspense"], [4, 8, "messagePromise", 30], [4, 5, "messagePromise"]]
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

The <CodeStep step={2}>Client Component</CodeStep> then takes <CodeStep step={4}>the Promise it received as a prop</CodeStep> and passes it to the <CodeStep step={5}>`use`</CodeStep> API. This allows the <CodeStep step={2}>Client Component</CodeStep> to read the value from <CodeStep step={4}>the Promise</CodeStep> that was initially created by the Server Component.

```js [[2, 6, "Message"], [4, 6, "messagePromise"], [4, 7, "messagePromise"], [5, 7, "use"]]
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```
Because <CodeStep step={2}>`Message`</CodeStep> is wrapped in <CodeStep step={3}>[`Suspense`](/reference/react/Suspense)</CodeStep>, the fallback will be displayed until the Promise is resolved. When the Promise is resolved, the value will be read by the <CodeStep step={5}>`use`</CodeStep> API and the <CodeStep step={2}>`Message`</CodeStep> component will replace the Suspense fallback.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 1000, "⚛️"));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

</Sandpack>

<Note>

When passing a Promise from a Server Component to a Client Component, its resolved value must be serializable to pass between server and client. Data types like functions aren't serializable and cannot be the resolved value of such a Promise.

</Note>


<DeepDive>

#### Should I resolve a Promise in a Server or Client Component? {/*resolve-promise-in-server-or-client-component*/}

A Promise can be passed from a Server Component to a Client Component and resolved in the Client Component with the `use` API. You can also resolve the Promise in a Server Component with `await` and pass the required data to the Client Component as a prop.

```js
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />
}
```

But using `await` in a [Server Component](/reference/rsc/server-components) will block its rendering until the `await` statement is finished. Passing a Promise from a Server Component to a Client Component prevents the Promise from blocking the rendering of the Server Component.

</DeepDive>

---

### Displaying an error with an Error Boundary {/*displaying-an-error-with-an-error-boundary*/}

If the Promise passed to `use` is rejected, the error propagates to the nearest [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Wrap the component that calls `use` in an Error Boundary to display a fallback when the Promise is rejected.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function MessageContainer({ messagePromise }) {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <Suspense fallback={<p>⌛Downloading message...</p>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Here is the message: {content}</p>;
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve, reject) => setTimeout(reject, 1000));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

### Providing an alternative value with `Promise.catch` {/*providing-an-alternative-value-with-promise-catch*/}

If you'd like to provide an alternative value when the Promise passed to `use` is rejected, you can use the Promise's <CodeStep step={1}>[`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)</CodeStep> method.

```js [[1, 6, "catch"],[2, 7, "return"]]
import { Message } from './message.js';

export default function App() {
  const messagePromise = new Promise((resolve, reject) => {
    reject();
  }).catch(() => {
    return "no new message found.";
  });

  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

To use the Promise's <CodeStep step={1}>`catch`</CodeStep> method, call <CodeStep step={1}>`catch`</CodeStep> on the Promise object. <CodeStep step={1}>`catch`</CodeStep> takes a single argument: a function that takes an error message as an argument. Whatever is <CodeStep step={2}>returned</CodeStep> by the function passed to <CodeStep step={1}>`catch`</CodeStep> will be used as the resolved value of the Promise.

---

### Showing stale content with `useTransition` {/*showing-stale-content-with-usetransition*/}

When data changes (for example, when navigating between pages), you can combine `use` with [`useTransition`](/reference/react/useTransition) to keep displaying the previous content while new data loads. The `isPending` flag from `useTransition` lets you show a loading indicator while keeping old content visible.

```js
function App({ albumsPromise }) {
  const albums = use(albumsPromise);
  const [isPending, startTransition] = useTransition();
  // ...
}
```

When an update is wrapped in `startTransition`, React keeps showing the current content instead of switching to the Suspense fallback. The component re-renders with the new data once the Promise resolves.

<Sandpack>

```js src/App.js active
import { use, Suspense, useState, useTransition } from 'react';
import { fetchData } from './data.js';

export default function App() {
  const [artistId, setArtistId] = useState('the-beatles');
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <div>
        <button
          onClick={() => {
            startTransition(() => {
              setArtistId('the-beatles');
            });
          }}
        >
          The Beatles
        </button>
        <button
          onClick={() => {
            startTransition(() => {
              setArtistId('led-zeppelin');
            });
          }}
        >
          Led Zeppelin
        </button>
        <button
          onClick={() => {
            startTransition(() => {
              setArtistId('pink-floyd');
            });
          }}
        >
          Pink Floyd
        </button>
      </div>
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        <Suspense fallback={<p>Loading...</p>}>
          <Albums artistId={artistId} />
        </Suspense>
      </div>
    </>
  );
}

function Albums({ artistId }) {
  const albums = use(fetchData('/' + artistId + '/albums'));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums('the-beatles');
  } else if (url === '/led-zeppelin/albums') {
    return await getAlbums('led-zeppelin');
  } else if (url === '/pink-floyd/albums') {
    return await getAlbums('pink-floyd');
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums(artistId) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  if (artistId === 'the-beatles') {
    return [{
      id: 1,
      title: 'Let It Be',
      year: 1970
    }, {
      id: 2,
      title: 'Abbey Road',
      year: 1969
    }, {
      id: 3,
      title: 'Yellow Submarine',
      year: 1969
    }];
  } else if (artistId === 'led-zeppelin') {
    return [{
      id: 4,
      title: 'Coda',
      year: 1982
    }, {
      id: 5,
      title: 'In Through the Out Door',
      year: 1979
    }, {
      id: 6,
      title: 'Presence',
      year: 1976
    }];
  } else {
    return [{
      id: 7,
      title: 'The Wall',
      year: 1979
    }, {
      id: 8,
      title: 'Wish You Were Here',
      year: 1975
    }, {
      id: 9,
      title: 'The Dark Side of the Moon',
      year: 1973
    }];
  }
}
```

</Sandpack>

---

### Showing updated content progressively with nested Suspense {/*showing-updated-content-progressively-with-nested-suspense*/}

When a page needs to load multiple pieces of data, you can use `use` in multiple components wrapped in nested [`Suspense`](/reference/react/Suspense) boundaries. Each boundary reveals its content independently as the data for that section loads, allowing the UI to fill in progressively.

```js
<Suspense fallback={<BigSpinner />}>
  <Biography artistId={artist.id} />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums artistId={artist.id} />
    </Panel>
  </Suspense>
</Suspense>
```

Each component calls `use(fetchData(...))` independently. When the biography data resolves first, it appears while the albums section still shows its fallback. When the albums data resolves, it replaces the albums fallback.

<Sandpack>

```js src/App.js active
import { use, Suspense } from 'react';
import { fetchData } from './data.js';

export default function App() {
  return (
    <ArtistPage
      artist={{
        id: 'the-beatles',
        name: 'The Beatles',
      }}
    />
  );
}

function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<BigSpinner />}>
        <Biography artistId={artist.id} />
        <Suspense fallback={<AlbumsGlimmer />}>
          <Panel>
            <Albums artistId={artist.id} />
          </Panel>
        </Suspense>
      </Suspense>
    </>
  );
}

function BigSpinner() {
  return <h2>Loading...</h2>;
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}

function Biography({ artistId }) {
  const bio = use(fetchData('/' + artistId + '/bio'));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

function Panel({ children }) {
  return (
    <section className="panel">
      <h2>Albums</h2>
      {children}
    </section>
  );
}

function Albums({ artistId }) {
  const albums = use(fetchData('/' + artistId + '/albums'));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/bio') {
    return await getBio();
  } else if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }];
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

---

### Re-fetching data {/*re-fetching-data*/}

When you want to refresh the same data (for example, with a "Refresh" button), you can pass a version number into the cache key and trigger a re-render with [`startTransition`](/reference/react/startTransition). When `version` changes, the cache key changes, so `fetchData` creates a new Promise. While that Promise is pending, React keeps showing the existing content because the update is inside a Transition.

```js
function Albums({ version }) {
  const albums = use(fetchData(`/albums?v=${version}`));
  // ...
}
```

The version is part of the cache key, so the old Promise stays cached at the old key. If a non-Transition re-render happens while the refresh is in progress, React reads the old cached Promise and avoids showing the Suspense fallback.

<Sandpack>

```js src/App.js active
import { Suspense, useState, useTransition } from 'react';
import { use } from 'react';
import { fetchData } from './data.js';

export default function App() {
  const [versi, setVersion] = useState(0);
  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => {
      setVersion(v => v + 1);
    });
  }

  return (
    <>
      <button
        onClick={handleRefresh}
        disabled={isPending}
      >
        {isPending ? 'Refreshing...' : 'Refresh'}
      </button>
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        <Suspense fallback={<Loading />}>
          <Albums version={version} />
        </Suspense>
      </div>
    </>
  );
}

function Albums({ version }) {
  const albums = use(fetchData(`/the-beatles/albums?v=${version}`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

function Loading() {
  return <h2>Loading...</h2>;
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/the-beatles/albums')) {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }];
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

<Note>

Frameworks that support Suspense typically provide their own caching and invalidation mechanisms. Building a custom cache like the one above is useful for understanding the pattern, but in practice you should use your framework's data fetching solution.

</Note>

---

### Preloading data on hover {/*preloading-data-on-hover*/}

You can start loading data before it's needed by calling `fetchData` during a hover event. Since `fetchData` caches the Promise, the data may already be available by the time the user clicks. If the Promise has resolved by the time `use` reads it, React renders the component immediately without showing a Suspense fallback.

```js
<button
  onMouseEnter={() => fetchData(`/${id}/albums`)}
  onClick={() => {
    startTransition(() => {
      setArtistId(id);
    });
  }}
>
```

In this example, hovering over an artist button starts fetching their albums in the background. Without hovering first, clicking shows a loading fallback. Try hovering over a button for a moment before clicking to see the difference.

<Sandpack>

```js src/App.js active
import { Suspense, useState, useTransition } from 'react';
import Albums from './Albums.js';
import { fetchData } from './data.js';

export default function App() {
  const [artistId, setArtistId] = useState('the-beatles');
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <div>
        {['the-beatles', 'led-zeppelin', 'pink-floyd'].map(id => (
          <button
            key={id}
            onMouseEnter={() => {
              fetchData(`/${id}/albums`);
            }}
            onClick={() => {
              startTransition(() => {
                setArtistId(id);
              });
            }}
          >
            {id === 'the-beatles' ? 'The Beatles' :
             id === 'led-zeppelin' ? 'Led Zeppelin' :
             'Pink Floyd'}
          </button>
        ))}
      </div>
      <Suspense key={artistId} fallback={<Loading />}>
        <Albums artistId={artistId} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>Loading...</h2>;
}
```

```js src/Albums.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    const promise = getData(url);
    // Set status fields so React can read the value
    // synchronously if the Promise resolves before
    // `use` is called (e.g. when preloading on hover).
    promise.status = 'pending';
    promise.then(
      value => {
        promise.status = 'fulfilled';
        promise.value = value;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    cache.set(url, promise);
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/the-beatles/albums')) {
    return await getAlbums('the-beatles');
  } else if (url.startsWith('/led-zeppelin/albums')) {
    return await getAlbums('led-zeppelin');
  } else if (url.startsWith('/pink-floyd/albums')) {
    return await getAlbums('pink-floyd');
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums(artistId) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 80);
  });

  if (artistId === 'the-beatles') {
    return [{
      id: 13,
      title: 'Let It Be',
      year: 1970
    }, {
      id: 12,
      title: 'Abbey Road',
      year: 1969
    }, {
      id: 11,
      title: 'Yellow Submarine',
      year: 1969
    }];
  } else if (artistId === 'led-zeppelin') {
    return [{
      id: 10,
      title: 'Coda',
      year: 1982
    }, {
      id: 9,
      title: 'In Through the Out Door',
      year: 1979
    }, {
      id: 8,
      title: 'Presence',
      year: 1976
    }];
  } else {
    return [{
      id: 7,
      title: 'The Wall',
      year: 1979
    }, {
      id: 6,
      title: 'Animals',
      year: 1977
    }, {
      id: 5,
      title: 'Wish You Were Here',
      year: 1975
    }];
  }
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

---

### Caching Promises for Client Components {/*caching-promises-for-client-components*/}

When creating Promises in Client Components, you must cache them so a stable Promise is reused across re-renders. Creating a new Promise directly in render causes React to display the Suspense fallback on every re-render.

```js
// ✅ Cache the Promise so the same one is reused across renders
let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}
```

The `fetchData` function returns the same Promise each time it's called with the same URL. When `use` receives the same Promise on a re-render, it reads the already-resolved value synchronously without suspending.

<Note>

The way you cache Promises depends on the framework you use with Suspense. Frameworks typically provide built-in caching mechanisms. If you don't use a framework, you can use a simple module-level cache like the one above, or a library that supports Suspense-compatible caching.

</Note>

<Sandpack>

```js src/App.js active
import { use, Suspense, useState } from 'react';
import { fetchData } from './data.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Re-render
      </button>
      <p>Render count: {count}</p>
      <Suspense fallback={<p>Loading...</p>}>
        <Albums />
      </Suspense>
    </>
  );
}

function Albums() {
  const albums = use(fetchData('/albums'));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }];
}
```

</Sandpack>

---

### Avoiding Suspense fallbacks for already-resolved data {/*avoiding-suspense-fallbacks-for-already-resolved-data*/}

When a Promise is already settled (resolved or rejected), React can read its value immediately without suspending — but only if the Promise has `status` and `value` (or `reason`) fields set. This is because even `Promise.resolve(value)` resolves asynchronously via a microtask, so without these fields, `use` always suspends on the first render.

If you're building a Suspense-enabled library, you can set these fields on the Promises you return to avoid unnecessary fallbacks:

```js
function fetchData(url) {
  const promise = fetch(url).then(r => r.json());
  promise.status = 'pending';
  promise.then(
    value => {
      promise.status = 'fulfilled';
      promise.value = value;
    },
    reason => {
      promise.status = 'rejected';
      promise.reason = reason;
    },
  );
  return promise;
}
```

React checks the `status` field when `use` is called. If `status` is `'fulfilled'`, it reads `value` synchronously. If `status` is `'rejected'`, it throws `reason`. If the field is missing or `'pending'`, it suspends.

<Note>

This is primarily useful for Suspense-enabled library authors. React will set the `status` field itself on Promises that don't have it, but setting it yourself avoids an extra render when the data is already available.

</Note>

<Recipes titleText="Difference between Promises with and without status fields" titleId="examples-promise-status">

#### Without `status` field {/*without-status-field*/}

When passing a regular `Promise.resolve()` to `use`, even though the value is already known, React suspends because it can't read the value until the Promise resolves via a microtask. Click the button to see the fallback flash briefly.

<Sandpack>

```js src/App.js active
import { Suspense, use, useState } from 'react';

function fetchUser(id) {
  // Even though Promise.resolve() is "instant",
  // the value isn't available synchronously.
  // React must suspend until the microtask resolves.
  return Promise.resolve({ name: `User #${id}` });
}

function UserDetails({ userPromise }) {
  const user = use(userPromise);
  return <p>Hello, {user.name}!</p>;
}

export default function App() {
  const [userPromise, setUserPromise] = useState(null);

  return (
    <div>
      <button onClick={() => setUserPromise(fetchUser(1))}>
        Show User #1
      </button>
      <button onClick={() => setUserPromise(fetchUser(2))}>
        Show User #2
      </button>
      <Suspense fallback={<p>Loading...</p>}>
        {userPromise ? (
          <UserDetails userPromise={userPromise} />
        ) : (
          <p>Click a button to load a user.</p>
        )}
      </Suspense>
    </div>
  );
}
```

</Sandpack>

<Solution />

#### With `status` field {/*with-status-field*/}

When the Promise has `status: 'fulfilled'` and `value` set, React reads the value synchronously without suspending. No fallback is shown even though `use` is called with a Promise.

<Sandpack>

```js src/App.js active
import { Suspense, use, useState } from 'react';

function fetchUser(id) {
  const value = { name: `User #${id}` };
  const promise = Promise.resolve(value);
  // Setting these fields lets React read the
  // value synchronously without suspending.
  promise.status = 'fulfilled';
  promise.value = value;
  return promise;
}

function UserDetails({ userPromise }) {
  const user = use(userPromise);
  return <p>Hello, {user.name}!</p>;
}

export default function App() {
  const [userPromise, setUserPromise] = useState(null);

  return (
    <div>
      <button onClick={() => setUserPromise(fetchUser(1))}>
        Show User #1
      </button>
      <button onClick={() => setUserPromise(fetchUser(2))}>
        Show User #2
      </button>
      <Suspense fallback={<p>Loading...</p>}>
        {userPromise ? (
          <UserDetails userPromise={userPromise} />
        ) : (
          <p>Click a button to load a user.</p>
        )}
      </Suspense>
    </div>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

Don't conditionally call `use` based on whether a Promise is settled. Always call `use` unconditionally and let React handle reading the `status` field. This ensures React DevTools can show that the component may suspend on data.

```js
// 🔴 Don't conditionally skip `use`
if (promise.status === 'fulfilled') {
  return promise.value;
}
const value = use(promise);
```

```js
// ✅ Always call `use` unconditionally
const value = use(promise);
```

</Pitfall>

---

## Troubleshooting {/*troubleshooting*/}

### I'm getting an error: "Suspense Exception: This is not a real error!" {/*suspense-exception-error*/}

You are either calling `use` outside of a React Component or Hook function, or calling `use` in a try-catch block. If you are calling `use` inside a try-catch block, wrap your component in an Error Boundary, or call the Promise's `catch` to catch the error and resolve the Promise with another value. [See these examples.](#displaying-an-error-with-an-error-boundary)

If you are calling `use` outside a React Component or Hook function, move the `use` call to a React Component or Hook function.

```jsx
function MessageComponent({messagePromise}) {
  function download() {
    // ❌ the function calling `use` is not a Component or Hook
    const message = use(messagePromise);
    // ...
```

Instead, call `use` outside any component closures, where the function that calls `use` is a Component or Hook.

```jsx
function MessageComponent({messagePromise}) {
  // ✅ `use` is being called from a component.
  const message = use(messagePromise);
  // ...
```

---

### I'm getting a warning: "A component was suspended by an uncached promise" {/*uncached-promise-error*/}

This warning means you are creating a new Promise inside a component on every render instead of caching it. React needs the same Promise instance across re-renders to track its status.

This commonly happens when calling an `async` function directly in render:

```js
function Albums() {
  // 🔴 This creates a new Promise on every render
  const albums = use(getAlbums());
  // ...
}
```

An `async` function always returns a new Promise, even if the underlying data is cached. To fix this, cache the Promise itself:

```js
// ✅ Cache the Promise so the same one is reused
const albumsPromise = getAlbums(); // called once, outside render
function Albums() {
  const albums = use(albumsPromise);
  // ...
}
```

Or use a caching wrapper that returns the same Promise for the same arguments:

```js
// ✅ fetchData returns the same Promise for the same URL
const albums = use(fetchData('/albums'));
```

See [caching Promises for Client Components](#caching-promises-for-client-components) for more details.
