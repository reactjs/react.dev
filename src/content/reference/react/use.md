---
title: use
---

<Wip>
This section is incomplete. See also the [draft use RFC](https://github.com/acdlite/rfcs/blob/first-class-promises/text/0000-first-class-support-for-promises.md#usepromise).
</Wip>

[//]: # (TODO: replace the `<Note></Note>` below with `<Canary></Canary>` once https://github.com/reactjs/react.dev/pull/6173 is merged)
<Note>
The `use` Hook is currently only available in React’s canary and experimental channels. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels). 
</Note>

<Intro>

`use` is a React Hook that lets you read the value of a resource like a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `use(resource)` {/*use*/}

Call `use` in your component to read the value of a resource like a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).

```jsx
import { use } from 'react';

function Message({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
```

Unlike all other React Hooks, the `use` Hook can be called within conditional statements like loops and `if` statements. Like other React Hooks, the function that calls `use` must be React component or Hook.

When called with a promise, the `use` Hook integrates with [`Suspense`](/reference/react/Suspense) and [error boundaries](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). The component calling `use` *suspends* while the Promise passed to `use` is pending. If the component that calls `use` is wrapped in a Suspense boundary the fallback of that Suspense component will be displayed.  Once the Promise is resolved, React hides the Suspense component fallback and renders the component(s) inside the Suspense boundary with the data returned by the `use` Hook. If the Promise passed to `use` is rejected, the fallback of the nearest Error Boundary will be displayed.

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `resource`: this is the source of the data you want to read a value from. A resources can be a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or a [context](/learn/passing-data-deeply-with-context).

#### Returns {/*returns*/}

The `use` Hook returns the value that was read from the resource like the resolved value of a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).

#### Caveats {/*caveats*/}

* The `use` Hook must be called inside a React component or a Hook.
* `use` is not recommended for data fetching from a [server component](/reference/react/components#server-components). `async` and `await` are preferred when fetching data from a server component.
* When passing Promises to `use`, you must store the Promise in a state variable or context to avoid recreating the Promise on every rerender. When invoking a function that returns a Promise, you can to store the returned Promise with a cache mechanism like React's `cache` function.

---

## Usage {/*usage*/}

### Reading Promises with `use` {/*reading-promises-with-use*/}

`use` functions similarly to the `await` with JavaScript Promises but is compatible with React's renderer and [`Suspense`](/reference/react/Suspense). Browser APIs or data fetching libraries that return a Promise can be passed to `use` to read the value of the Promise.

In the example below we'll use <CodeStep step={1}>[`navigator.storage.estimate()`](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate)</CodeStep>, a browser API that provides information on how much storage is being used by the current page and how much space is available. <CodeStep step={1}>`navigator.storage.estimate()`</CodeStep> is an asynchronous function that returns a Promise which resolves once the information is available.

```js [[1,6, "navigator.storage.estimate()"], [2,6, "storagePromise"], [3,6, "useState"], [4,7, "use"], [5,8, "storage.quota"]]
'use client';

import { use, useState } from 'react';

function StorageInfo() {
  const [storagePromise] = useState(navigator.storage.estimate());
  const storage = use(storagePromise);
  return <p>An estimated {storage.quota} bytes available</p>;
}
```

1. First, the Promise returned by <CodeStep step={1}>`navigator.storage.estimate()`</CodeStep> is stored in the <CodeStep step={2}>`storagePromise`</CodeStep> state variable created by <CodeStep step={3}>`useState`</CodeStep>. This prevents the call to <CodeStep step={1}>`navigator.storage.estimate()`</CodeStep> and the Promise it returns from being recreated across renders.
2. Next, <CodeStep step={2}>`storagePromise`</CodeStep> is passed to <CodeStep step={4}>`use`</CodeStep> to read the resolved value of the Promise.
3. Finally, the resolved value of the Promise can now be used safely. This includes surfacing data read by <CodeStep step={4}>`use`</CodeStep> like <CodeStep step={5}>`storage.quota`</CodeStep> in the JSX returned by the component.

<Pitfall>

When passing Promises to `use`, the Promise must be cached with the `cache` function, a state variable, or context to prevent the Promise from being recreated on every render.

```js
function Component() {
  use(new Promise(...)); // ❌ Promise will be recreated on every render
  // ...
```

Instead, pass the Promise to a state variable or context or wrap the function that returns the Promise in `cache`:

```js
import { use, useState, cache } from 'react';

function Component() {
  const [promise] = useState(() => new Promise(...)); // ✅ Promise persists across renders
  const data = use(cache(fnThatReturnsAPromise())); // ✅ Promise persists across renders
  // ...
```

Storing the results of a API call in a state variable, context, or cache means that value returned by `use` will not be updated if the underlying API returns a new value. If the underlying data changes you must call the API again and update the state variable or context to the new promise returned by the API call:

```js
function StorageInfo() {
  const [storagePromise, setStoragePromise] = useState(
    navigator.storage.estimate();
  );
  function updateStorageInfo() {
    setStoragePromise(navigator.storage.estimate());
  }
  const storage = use(storagePromise);
  return (
    <>
      <p>An estimated {storage.quota} bytes available</p>
      <button onClick={updateStorageInfo}>Update storage info</button>
    </>
  );
}
```

</Pitfall>


<Recipes>

#### Read Promises from asynchronous browser APIs {/*read-promises-from-asynchronous-browser-apis*/}

In this example, the Promise from `navigator.storage.estimate()` is stored in a state variable and passed to the `StorageInfo` component as a prop. The Promise is then read by `use` and the result is displayed to the user. While waiting for the Promise to resolve, the fallback of Suspense component that wraps `StorageInfo` is displayed.

<Sandpack>

```js App.js
'use client';

import { use, useState, Suspense } from 'react';
import prettyBytes from 'pretty-bytes';

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
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox server component
// demo enviornemnt once it is created
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

#### Read Promises from data fetching libraries {/*read-promises-from-data-fetching-libraries*/}

You can read the values of Promises returned from data fetching libraries with the `use` Hook. In this example the function `fetchMessage` is imported from a mock data fetching library. The Promise returned by `fetchMessage` is stored in the `messagePromise` state variable and then passed to `use` to read. The result is then displayed to the user. While waiting for the Promise to resolve, the fallback of the Suspense component that wraps `Message` is displayed.

<Sandpack>

```js App.js active
'use client';

import { use, useState, Suspense } from 'react';
import { fetchMessage } from './data-fetching-lib.js';

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

function MessageContainer() {
  const [messagePromise] = useState(fetchMessage());
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
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
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox server component
// demo enviornemnt once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js data-fetching-lib.js hidden
export function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 1000, '⚛️'));
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

#### Conditional data fetching {/*conditional-data-fetching*/}

In this example, the `Article` Component only calls `use` when the `shouldIncludeByline` is set to true. If `shouldIncludeByline` the Promise returned by the `fetchByline` function is read by the `use` Hook. The value read by `use` Hook is then used to display the byline of the article's author to the user.

<Sandpack>

```js App.js
'use client';

import { use, Suspense, useState } from 'react';
import { fetchByline } from './api.js';

function Article({ title, body, shouldIncludeByline, authorId }) {
  const [byline, setByline] = useState(null);

  if (shouldIncludeByline && !byline) {
    // Because `use` is inside a conditional block, we avoid blocking
    // unncessarily when `shouldIncludeByline` is false.
    setByline(use(fetchByline(authorId)));
  }

  return (
    <div>
      <h1>{title}</h1>
      <h2>{byline}</h2>
      <section>{body}</section>
    </div>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  function showArticle() {
    setShow(true);
  }

  if (!show) {
    return <button onClick={showArticle}>Show article</button>;
  }
  return (
    <Suspense fallback={<p>⌛Loading article...</p>}>
      <Article
        title={'Article Title'}
        body={'this is the body of an article'}
        authorId={'Jordan'}
        shouldIncludeByline={true}
      />
    </Suspense>
  );
}
```

```js index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// Hook is in a stable release of React
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox server component
// demo enviornemnt once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js api.js hidden
export function fetchByline(authorId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('By ' + authorId);
    }, 200);
  });
}
```

```css styles.css hidden
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 15px;
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

When a [context](/learn/passing-data-deeply-with-context) is passed to `use`, it works similarly to [`useContext`](/reference/react/useContext). While `useContext` must be called at the top level of your component, `use` can be called inside conditionals like `if` and loops like `for`. `use` is preferred over `useContext` because it is more flexible.

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

Like `useContext`, `use(context)` always looks for the closest context provider *above* the component that calls it. It searches upwards and **does not** consider context providers in the component from which you're calling `use(context)`.

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

Data can be streamed from the server to the client by passing a Promise as a prop from a server component to a client component:

```js App.js
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

The client component then takes the Promise it received as a prop and passes it to the `use` Hook. This allows the client component to read the value from the Promise that was initially created by the server component:

```js
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
  return <p>Here is the message: {messageContent}</p>;
}
```
Because `Message` is wrapped in [`Suspense`](/reference/react/Suspense) the Suspense component's fallback will be displayed until the Promise is resolved. When the Promise is resolved the value will be read by the `use` Hook and the `Message` component will replace the [`Suspense`](/reference/react/Suspense) component's fallback.

<Sandpack>

```js message.js active
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```

```js App.js
import { Suspense, useState } from 'react';
import { Message } from './message.js';

function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 1000, '⚛️'));
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
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox server component
// demo enviornemnt once it is created
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
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```
</Sandpack>
<DeepDive>

#### Server components: `await` vs passing a Promise? {/*await-vs-passing-a-promise*/}

Instead of passing a Promise from a server component to a client component you could `await` the Promise in the server component and pass the data to the client component as a prop:

```js
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messageContent = await fetchMessage();
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messageContent={messageContent} />
    </Suspense>
  );
}
```

But using `await` in a [server component](/reference/react/components#server-components) will block the rendering of the [server component](/reference/react/components#server-components) until the `await` statement is finished.

Passing a Promise from a server component to a client component wrapped in a Suspense boundary prevents the Promise from blocking the rendering of the server component. This enables the Suspense component's fallback to be displayed to the user. When the Promise resolves, the value of the Promise is read by `use`. This value is used to render the client component which replaces the Suspense component's fallback.

</DeepDive>

### Dealing with rejected Promises {/*dealing-with-rejected-promises*/}

In some cases a Promise passed to `use` could be rejected. You can handle rejected Promises by either:

1. [Displaying an error to users with error boundary.](#displaying-an-error-to-users-with-error-boundary)
2. [Providing an alternative value with `Promise.catch`](#providing-an-alternative-value-with-promise-catch)

<Pitfall>
`use` cannot be called in a try-catch block. Instead of a try-catch block [wrap your component in an Error Boundary](#displaying-an-error-to-users-with-error-boundary), or [provide an alternative value to use with the Promise's `.catch` method](#providing-an-alternative-value-with-promise-catch).
</Pitfall>

#### Displaying an error to users with a error boundary` {/*displaying-an-error-to-users-with-error-boundary*/}

If you'd like to display an error to your users when a Promise is rejected you can use an [error boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). To use an error boundary wrap the component you are calling the `use` Hook in an error boundary. If the Promise passed to `use` is rejected the fallback for the error boundary will be displayed.

<Sandpack>

```js App.js active
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Message } from './message.js';

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
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Here is the message: {content}</p>;
}
```

```js index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// Hook is in a stable release of React
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox server component
// demo enviornemnt once it is created
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

If you'd like to provide an alternative value when a Promise passed to `use` is rejected you can use an the Promise's [`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) method. To use the Promise's `catch` method, call `catch` on the Promise object. `catch` takes a single argument: a function that takes an error message as an argument. Whatever is returned by the function passed to `catch` will be used as the resolved value of the Promise.

<Sandpack>

```js App.js
import { useState, Suspense } from 'react';
import { MessageComponent } from './message.js';

function fetchMessage() {
  return new Promise((resolve, reject) => reject()).catch(() => {
    return 'no new message found.';
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
        <MessageComponent messagePromise={messagePromise} />
      </Suspense>
    );
  } else {
    return <button onClick={download}>Download new message</button>;
  }
}
```

```js message.js
'use client';

import { use } from 'react';

export function MessageComponent({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Here is the message: {content}</p>;
}
```

```js index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// Hook is in a stable release of React
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox server component
// demo enviornemnt once it is created
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

The `use` Hook only supports [JavaScript Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and React [Context](/learn/passing-data-deeply-with-context) as parameters.

### I'm getting this error: "Suspense Exception: This is not a real error!" {/*suspense-exception-error*/}

You are either calling `use` outside of a React component or Hook function, or calling `use` in a try–catch block. If you are calling `use` inside a try–catch block, wrap your component in an error boundary, or call the Promise's `catch` to catch the error and resolve the Promise with another value. [See these examples](#dealing-with-rejected-promises).

If you are calling `use` outside a React component or Hook function, move the `use` call to a React component or Hook function.

```jsx
function MessageComponent({messagePromise}) {
  function download() {
    // ❌ the function calling `use` is not a Component or Hook
    const message = use(messagePromise);
    // ...
```

instead, call `use` outside any component closures, where the function that calls `use` is a component or Hook:

```jsx
function MessageComponent({messagePromise}) {
  // ✅ `use` is being called from a component. 
  const message = use(messagePromise);
  // ...
```
