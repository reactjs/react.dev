---
title: use
---

<Wip>
This section is incomplete. See also the [draft use RFC](https://github.com/acdlite/rfcs/blob/first-class-promises/text/0000-first-class-support-for-promises.md#usepromise).
</Wip>

[//]: # (TODO: replace the `<Note></Note>` below with `<Canary></Canary>` once https://github.com/reactjs/react.dev/pull/6173 is merged)
<Note>
The `use` hook is only supported when using [React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks). React Server Components are only available in React’s canary and experimental channels. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels). 
</Note>

<Intro>

`use` is a React Hook that lets you read the value of a resource like a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `use(resource)` {/*use*/}

Call `use` in your component to read the value of a resource like a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).

```jsx
import { use } from "react";

function Message({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  //...
```

Unlike all other React Hooks, the `use` Hook can be called within conditional statements like loops and `if` statements. Like other React Hooks, the parent function of a Hook must be a React component or Hook.

A component that passes a promise to `use` integrates with [`Suspense`](/reference/react/Suspense) and [`ErrorBoundary`](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). When a pending promise is passed to `use`, the fallback of the closest Suspense Boundary will be displayed. When the promise is resolved, the component calling `use` will be rendered using the data from the resolved promise. The rendered component will then replace the Suspense Boundary fallback. If the promise passed to `use` is rejected, the fallback of the nearest Error Boundary will be displayed. 

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `resource`: this is the source of the data you want to read a value from. A resources can be a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or a [context](/learn/passing-data-deeply-with-context).

#### Returns {/*returns*/}

The `use` Hook returns the value that was read from the resource like the resolved value of a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).

#### Caveats {/*caveats*/}

* The parent function of the `use` Hook must be a React component or your own Hooks.
* `use` is not recommended for data fetching from a [Server Component](/reference/react/components#server-components). `async` and `await` are preferred when fetching data from a Server Component.
* When passing promises to `use`, you must store the promise in a state variable or context to avoid recreating the promise on every rerender. When invoking a function that returns a promise, you can to store the returned promise with a cache mechanism like React's `cache` function.

---

## Usage {/*usage*/}

### Reading promises with `use` {/*reading-promises-with-use*/}

`use` functions similarly to the `await` with JavaScript promises but is compatible with React's renderer and [`Suspense`](/reference/react/Suspense). Browser APIs or data fetching libraries that return a promise can be passed to `use` to read the value of the promise.

In the example below we'll use <CodeStep step={1}>[`navigator.storage.estimate()`](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate)</CodeStep>, a browser API that provides information on how much storage is being used by the current page and how much space is available. <CodeStep step={1}>`navigator.storage.estimate()`</CodeStep> is an async function that returns a Promise which resolves once the information is available.

```js [[1,6, "navigator.storage.estimate()"], [2,6, "storagePromise"], [3,6, "useState"], [4,7, "use"], [5,8, "storage.quota"]]
"use client";

import { use, useState } from "react"

function StorageInfo() {
  const [storagePromise] = useState(navigator.storage.estimate());
  const storage = use(storagePromise);
  return <p>An estimated {storage.quota} bytes available</p>
}
```

1. First, the promise returned by <CodeStep step={1}>`navigator.storage.estimate()`</CodeStep> is stored in the <CodeStep step={2}>`storagePromise`</CodeStep> state variable created by <CodeStep step={3}>`useState`</CodeStep>. This prevents the call to <CodeStep step={1}>`navigator.storage.estimate()`</CodeStep> and the promise it returns from being recreated across renders.
2. Next, <CodeStep step={2}>`storagePromise`</CodeStep> is passed to <CodeStep step={4}>`use`</CodeStep> to read the resolved value of the promise.
3. Finally, the resolved value of the promise can now be used safely. This includes surfacing data read by <CodeStep step={4}>`use`</CodeStep> like <CodeStep step={5}>`storage.quota`</CodeStep> in the JSX returned by the component.

<Pitfall>

When passing promises to `use`, the promise must be cached with the `cache` function, a state variable, or context to prevent the promise from being recreated on every render.

```js
function Component() {
  use(new Promise(...)) // ❌ promise will be recreated on every render
  // ...
```
instead, pass the promise to a state variable or context or wrap the function that returns the promise in `cache`:

```js
import { use, useState, cache } from "react"

function Component() {
  const [promise] = useState(() => new Promise(...)) // ✅ Promise persists across renders
  const data = use(cache(fnThatReturnsAPromise())) // ✅ Promise persists across renders
  //...
```

</Pitfall>


<Recipes>

#### Read promises from async browser APIs {/*read-promises-from-async-browser-apis*/}

You can read promises returned by async browser APIs like [`navigator.storage.estimate()`](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate) with `use`. In this example, the promise from `navigator.storage.estimate()` is stored in a state variable and passed to the `StorageInfo` component as a prop. The promise is then read by `use` and the result is displayed to the user. While waiting for the promise to resolve, the fallback of the parent Suspense component is displayed.

<Sandpack>

```js App.js
"use client";

import { use, useState, Suspense } from "react";
import prettyBytes from "pretty-bytes";

function StorageInfo({ storagePromise }) {
  const storage = use(storagePromise);
  const utilization = ((storage.usage / storage.quota) * 100).toFixed(2);
  return (
    <ul>
      <li>Using an estimated {prettyBytes(storage.usage)} of storage </li>
      <li>An estimated {prettyBytes(storage.quota)} of storage available</li>
      <li>Using {utilization}% of available storage</li>
    </ul>
  );
}

export default function App() {
  const [storagePromise, setStoragePromise] = useState(null);
  function download() {
    setStoragePromise(navigator.storage.estimate());
  }

  if (!storagePromise) {
    return <button onClick={download}>Get storage info</button>;
  }
  return (
    <Suspense fallback={<p>⌛Waiting for storage data...</p>}>
      <StorageInfo storagePromise={storagePromise} />
    </Suspense>
  );
}
```

```js index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// Hook is in a stable release of React
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// TODO: update this example to use
// the Codesandbox Server Component
// demo enviornemnt once it is created
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0",
    "pretty-bytes": "6.1.0"
  },
  "main": "/index.js"
}
```
</Sandpack>

<Solution />

#### Read promises from data fetching libraries {/*read-promises-from-data-fetching-libraries*/}

You can read the values of promises returned from data fetching libraries with the `use` Hook. In this example the function `fetchMessage` is imported from a mock data fetching library. The promise returned by `fetchMessage` is stored in the `messagePromise` state variable and then passed to `use` to read. The result is then displayed to the user. While waiting for the promise to resolve the fallback of the parent Suspense component is displayed.

<Sandpack>

```js App.js active
"use client";

import { use, useState, Suspense } from "react";
import { fetchMessage } from "./data-fetching-lib.js";

function MessageContainer() {
  const [messagePromise] = useState(fetchMessage());
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export default function App() {
  const [show, setShow] = useState(false);
  function download() {
    setShow(true);
  }

  if (show) {
    return <MessageContainer />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// Hook is in a stable release of React
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// TODO: update this example to use
// the Codesandbox Server Component
// demo enviornemnt once it is created
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js data-fetching-lib.js hidden
export function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 3000, "⚛️"));
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```
</Sandpack>

<Solution />

</Recipes>



### Reading context with `use` {/*reading-context-with-use*/}

When a [context](/learn/passing-data-deeply-with-context) is passed to `use`, it works similarly to [`useContext`](/reference/react/useContext). While `useContext` must be called at the top level of your component, `use` can be called inside conditionals like `if` and loops like `for`.

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ... 
```

`use` returns the <CodeStep step={2}>context value</CodeStep> for the <CodeStep step={1}>context</CodeStep> you passed. To determine the context value, React searches the component tree and finds **the closest context provider above** for that particular context.

To pass context to a `Button`, wrap it or one of its parent components into the corresponding context provider:

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

It doesn't matter how many layers of components there are between the provider and the `Button`. When a `Button` *anywhere* inside of `Form` calls `use(ThemeContext)`, it will receive `"dark"` as the value.

<Pitfall>

`use(context)` always looks for the closest context provider *above* the component that calls it. It searches upwards and **does not** consider context providers in the component from which you're calling `use()`.

</Pitfall>

<Sandpack>

```js
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
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

function Button({ children }) {
  const theme = use(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
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

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```

</Sandpack>

### Streaming data from the server to the client {/*streaming-data-from-server-to-client*/}

Data can be streamed from the server to the client by passing a promise as a prop from a server component to a client component:

```js App.js
import { fetchMessage } from "./lib.js";
import { Message } from "./message.js";

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

The client component then takes the promise it received as a prop and passes it to the `use` Hook. This allows the client component to read the value from the promise that was initially created by the server component:

```js
// message.js
"use client";

import { use } from "react";

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```
Because `Message` is wrapped in [`Suspense`](/reference/react/Suspense) the fallback will be displayed until the promise is resolved. When the promise is resolve the value will be unwrapped by the `use` Hook and the `Message` component will replace the [`Suspense`](/reference/react/Suspense) fallback.

<Sandpack>

```js message.js active
"use client";

import { use } from "react";

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```

```js App.js
import { Suspense, useState } from "react";
import { Message } from "./message.js";

function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 3000, "⚛️"));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return (
      <Suspense fallback={<p>⌛Downloading message...</p>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    );
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// Hook is in a stable release of React
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// TODO: update this example to use
// the Codesandbox Server Component
// demo enviornemnt once it is created
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```
</Sandpack>
<DeepDive>

#### Server components: `await` vs passing a promise? {/*await-vs-passing-a-promise*/}

Instead of passing a promise from a server component to a client component you could `await` the promise in the server component and pass the data to the client component as a prop:

```js
import { fetchMessage } from "./lib.js";
import { Message } from "./message.js";

export default function App() {
  const messageContent = await fetchMessage();
  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messageContent={messageContent} />
    </Suspense>
  );
}
```

But using `await` in a [Server Component](/reference/react/components#server-components) will block the rendering of the [Server Component](/reference/react/components#server-components) until the `await` statement is finished.

Passing a promise from a server component to a client component prevents the promise from blocking the rendering of the server component. This enables a suspense fallback to be displayed to the user. When the promise resolves, the value of the promise is read by `use`. This value is used to render the client component which replaces the suspense fallback.

</DeepDive>

### Dealing with rejected promises {/*dealing-with-rejected-promises*/}

In some cases a promise passed to `use` could be rejected. You can handle rejected promises by either:

1. [Displaying an error to users with ErrorBoundary.](#displaying-an-error-to-users-with-errorboundary)
2. [Providing an alternative value with `Promise.catch`](#providing-an-alternative-value-with-promise-catch)

<Pitfall>
`use` cannot be called in a try-catch block. Instead of a try-catch block [wrap your component in an Error Boundary](#displaying-an-error-to-users-with-errorboundary), or [provide an alternative value to use with the promise's `.catch` method](#providing-an-alternative-value-with-promise-catch).
</Pitfall>

#### Displaying an error to users with `ErrorBoundary` {/*displaying-an-error-to-users-with-errorboundary*/}

If you'd like to display an error to your users when a promise is rejected you can use an `ErrorBoundary`. To use `ErrorBoundary` wrap the component you are calling the `use` Hook in a `ErrorBoundary`. If the promise passed to `use` is rejected the fallback for the `ErrorBoundary` will be displayed.

<Sandpack>

```js App.js active
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Message } from "./message.js";

function fetchMessage() {
  return new Promise((resolve, reject) => setTimeout(reject, 3000));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return (
      <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
        <Suspense fallback={<p>⌛Downloading message...</p>}>
          <Message messagePromise={messagePromise} />
        </Suspense>
      </ErrorBoundary>
    );
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js message.js
"use client";

import { use } from "react";

export function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Here is the message: {content}</p>;
}
```

```js index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// Hook is in a stable release of React
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// TODO: update this example to use
// the Codesandbox Server Component
// demo enviornemnt once it is created
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

#### Providing an alternative value with `Promise.catch` {/*providing-an-alternative-value-with-promise-catch*/}

If you'd like to display provide an alternative value when a promise passed to `use` is rejected you can use an the promise's [`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) method. To use the promise's `catch` method, call `catch` on the promise object. `catch` takes a single argument: a function that takes an error message as an argument. Whatever is returned by the function passed to `catch` will be used as the resolved value of the promise.

<Sandpack>

```js App.js
import { useState, Suspense } from "react";
import { Message } from "./message.js";

function fetchMessage() {
  return new Promise((resolve, reject) => {
    setTimeout(reject, 3000, new Error("no new message found."));
  }).catch((error) => {
    console.log(error.toString());
    return "no new message found.";
  });
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return (
      <Suspense fallback={<p>⌛Downloading message...</p>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    );
  } else {
    return <button onClick={download}>Download new message</button>;
  }
}
```

```js message.js
"use client";

import { use } from "react";

export function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Here is the message: {content}</p>;
}
```

```js index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// Hook is in a stable release of React
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// TODO: update this example to use
// the Codesandbox Server Component
// demo enviornemnt once it is created
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

## Troubleshooting {/*troubleshooting*/}

### I'm getting this error: "An unsupported type was passed to use" {/*im-getting-this-error-an-unsupported-type-was-passed-to-use*/}

The `use` hook only supports [JavaScript promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and React's [Context](/learn/passing-data-deeply-with-context) as parameters.

### I'm getting this error: "Suspense Exception: This is not a real error!" {/*suspense-exception-error*/}

You are either calling `use` outside of a React component or Hook function, or calling `use` in a try-catch block. If you are calling `use` inside a `try-catch` block wrap your component in an error boundary, or call the promise's `catch` to catch the error and resolve the promise with another value. [See these examples](#dealing-with-rejected-promises).

If you are calling `use` outside a React component or Hook function, move the `use` call to a React component or Hook function.

```jsx
function Message({messagePromise}) {
  function download() {
    // ❌ `use`'s parent function is not a Component or Hook!
    const message = use(messagePromise);
    //...
```
instead, call `use` outside any component closures, where the parent function is a component or Hook:
```jsx
function Message({messagePromise}) {
  // ✅ This works! The parent function is a component. 
  const message = use(messagePromise);
  //...
```



### How do I prevent the component calling `use` from abruptly appearing in the UI? {/*how-do-i-prevent-the-component-calling-use-from-abruptly-appearing-in-the-ui*/}

Components that pass a promise to `use` must be wrapped in [`Suspense`](/reference/react/Suspense) to prevent the Component from "popping in" when the promise is resolved. In the examples below, the `Message` Component calls the `use` hook. Because the `Message` Component is not wrapped in [`Suspense`](/reference/react/Suspense) the `Message` component will abruptly pop into the page when `messagePromise` is resolved:
```js
function Messages({messagePromise}) {
  // ❌ the `Message` component will pop-in
  return <Message messagePromise={messagePromise} />
}
```

To fix the "pop-in" issue, wrap the `Message` Component in [`Suspense`](/reference/react/Suspense) with a suitable fallback component. In the example below a `MessageFallback` component will displayed until the `messagePromise` is resolved. Then `MessageFallback` will be replaced by the `Message`:

```jsx
function Messages({messagePromise}) {
  // ✅ fallback is displayed until `Message` is rendered
  return (
    <Suspense fallback={<MessageFallback />}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```
