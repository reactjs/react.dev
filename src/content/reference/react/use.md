---
title: use
---

<Wip>
The `use` hook is only supported under when using [React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks). React Server Components are only available in React’s canary and experimental channels. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).
</Wip>

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
  const messsage = use(messagePromise);
  const theme = use(ThemeContext);
  //...
```

Unlike all other React Hooks, the `use` Hook can be called within conditional statements like loops and `if` statements. Like other React Hooks, the parent function of a Hook must be a React component or Hook.

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `resource`: this is the source of the data you want to read a value from. Resources can be a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).

#### Returns {/*returns*/}

The `use` Hook returns the value that was read from the resource like the resolved value of a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).

#### Caveats {/*caveats*/}

* `use` is not recommended for data fetching from a [Server Component](/reference/react/components#server-components). `async` and `await` are preferred when fetching data from a [Server Component](/reference/react/components#server-components). For example, instead of calling `use` in a [Server Component](/reference/react/components#server-components):

  ```js
  const user = use(fetch('/api/user'))
  ```
   you can use `await`:
  ```js
  const user = await fetch('/api/user')
  ```

  <Note>
  Using `await` in a [Server Component](/reference/react/components#server-components) will block the rendering of the [Server Component](/reference/react/components#server-components) until the `await` statement is finished. To render the [Server Component](/reference/react/components#server-components) immediately and stream data to the client, you can pass a promise from a [Server Component](/reference/react/components#server-components) to a [Client Component](/reference/react/components#client-components) as a prop and wrap it in [Suspense](/reference/react/Suspense). [See this example below](#promises-from-server-components).
  </Note>

* The parent function of the `use` Hook must be a React component or a Hook. For example, the `use` Hook cannot be used in function closures like “map”:
  ```jsx
  function Message({messagePromise}) {
    function download() {
      // ❌ The parent function is not a Component or Hook!
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
* `use` cannot be called in a try-catch block. To handle errors either wrap your component that calls the `use` Hook in an error boundary or call the promise's `catch` method to handle the error and return a new value to resolve the promise. [See more examples below.](#dealing-with-rejected-promises)
* When passing promises to `use` the promise must be cached with the `cache` function, a state variable, or context to prevent the promise from being recreated on every render. In this exammple the `fetchMsg` returns a promise that is passed to the `use` Hook. `fetchMsg` is called and passed directly to `use` which means the promise returned by `fetchMsg` will be recreated on every render:
  ```js
  import { use } from "react";

  function Messages() {
    // ❌  the promise to be recreated on every render
    const msg = use(fetchMsg());
    }
    return <p>{msg}</p>
  }
  ```
  instead, pass the promise to a state variable (or context). In this example the promise returned by `fetchMsg` is cached across renders preventing the promise from being recreted on every render:
  ```js
  import { use, useState } from "react";

  function Messages() {
    // ✅ This works! `useState` caches the promise
    const [msgPromise] = useState(() => fetchMsg())
    return <p>{use(msgPromise)}</p>
  }
  ```
  or wrap the function returing the promise in React's `cache` function. `cache` wraps the `fetchMsg` function and caches the result, preventing the promise returned by `fetchMsg` from being recreted on every render:
  ```js
  import { use, cache } from "react";

  function Messages() {
    // ✅ This works! `cache` caches the promise
    const msg = use(cache(fetchMsg()));
    return <p>{msg}</p>
  }
  ```
* Components that pass a promise to `use` must be wraped in [`Suspense`](/reference/react/Suspense) to prevent the Component from "poping in" when the promise is resolved. In this example the `Message` Component calls the `use` hook. Because the `Message` Component is not wraped in [`Suspense`](/reference/react/Suspense) the `Message` component will abruptly pop into the page when `messagePromise` is resolved:
  ```js
  function Messages({messagePromise}) {
    // ❌ the `Message` component will pop-in
    return <Message messagePromise={messagePromise} />
  }
  ```
  In this example the `Message` Component calls the `use` hook. The `Message` Component is wraped in [`Suspense`](/reference/react/Suspense). This means that the `MessageFallback` component will be replaced by the `Message` component once the `messagePromise` is resolved:
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

---

## Usage {/*usage*/}

<Wip>

This section is incomplete. See also the [draft use RFC](https://github.com/acdlite/rfcs/blob/first-class-promises/text/0000-first-class-support-for-promises.md#usepromise).

</Wip>

### Streaming data from the server to the client {/*streaming-data-from-server-to-client*/}

`use` functions similarly to the `await` with JavaScript promises but is compatible with React's renderer and [`Suspense`](/reference/react/Suspense). 🚧

The Client Component accept a promise as a prop and then uses the `use` Hook to unwrap the promise to its resolved value. The resolved value is then displayed by the Client Component in the JSX the Client Component returns.

The Server Component imports the Client Component in includes it in the JSX the Server Component returns. The promise is passed from the Server Componentn to the Client Component as a prop. The Client Component is wrapped in [`Suspense`](/reference/react/Suspense). The fallback will be displayed until the promise is resolved. Then the [`Suspense`](/reference/react/Suspense) fallback will be replaced by the Client Component with the resolved value from the promise.

<Sandpack>

```js message.js active
"use client";

import { use } from "react";

export function Message({ messageReqest }) {
  const content = use(messageReqest);
  return <p>Here is the message: {content}</p>;
}
```

```js App.js
import { Suspense, useState } from "react";
import { Message } from "./message.js";

function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 3000, "⚛️"));
}

export default function App() {
  const [msgReq, setMsgReq] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMsgReq(fetchMessage());
    setShow(true);
  }

  if (show) {
    return (
      <Suspense fallback={<p>waiting for message...</p>}>
        <Message messageReqest={msgReq} />
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

### Consume async browser APIs with `use` {/*consume-async-browser-apis*/}

Promises can be passed as a prop from a parent Client Component to a child Client Component when the promise is stored in a state variables of the parent component. The parent component should wrap the Client Component calling `use` in [`Suspense`](/reference/react/Suspense) to avoid pop-in:

<Pitfall>
put the promise in a useState prevents the promise from being recreated on every rerender
</Pitfall>

<Pitfall>
Wrap components that call `use` in [`Suspense`](/reference/react/Suspense) to prevent pop in when
a promise is resolved
</Pitfall>

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

### Promises from data fetching libraries {/*promises-from-libraries*/}

<Pitfall>
put the promise in a useState prevents the promise from being recreated on every rerender
</Pitfall>

<Sandpack>

```js App.js active
import { Suspense, useState } from "react";
import { Message } from "./message.js";
import { fetchMessage } from "./data-fetching-lib.js";

export default function App() {
  const [msgReq, setMsgReq] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMsgReq(fetchMessage());
    setShow(true);
  }

  if (show) {
    return (
      <Suspense fallback={<p>waiting for message...</p>}>
        <Message messageReqest={msgReq} />
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

```js message.js
"use client";

import { use } from "react";

export function Message({ messageReqest }) {
  const content = use(messageReqest);
  return <p>Here is the message: {content}</p>;
}
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


### Dealing with rejected promises {/*dealing-with-rejected-promises*/}

<Pitfall>
`use` cannot be called in a try-catch block. Instead of a try-catch block wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`.
</Pitfall>

You can wrap the component you are passing a promise to as a prompt in a `ErrorBoundary`. In the case, that the promise is rejected the fallback for the `ErrorBoundary` will be displayed:

<Sandpack>

```js App.js active
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Message } from "./message.js";

function fetchMessage() {
  return new Promise((resolve, reject) => setTimeout(reject, 3000));
}

export default function App() {
  const [msgReq, setMsgReq] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMsgReq(fetchMessage());
    setShow(true);
  }

  if (show) {
    return (
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <Suspense fallback={<p>waiting for message...</p>}>
          <Message messageReqest={msgReq} />
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

export function Message({ messageReqest }) {
  const content = use(messageReqest);
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

You can also use the promise `catch` method to handle errors in lieu of an error boundary. The catch method is called on the original promise object. `catch` takes a single argument: a function that takes an error message as an argument. Typically the error is logged inside the body of the function you pass to `catch`. Whatever is returned by the function passed to `catch` will be used as the resolved value of the promise:

<Sandpack>

```js App.js
import { Suspense, useState } from "react";
import { Message } from "./message.js";

function fetchMessage() {
  return new Promise((resolve, reject) => {
    setTimeout(reject, 3000, "this is a error message");
  }).catch((error) => {
    console.log(error);
    return "there was a error resolving the promise";
  });
}

export default function App() {
  const [msgReq, setMsgReq] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMsgReq(fetchMessage());
    setShow(true);
  }

  if (show) {
    return (
      <Suspense fallback={<p>waiting for message...</p>}>
        <Message messageReqest={msgReq} />
      </Suspense>
    );
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js message.js
"use client";

import { use } from "react";

export function Message({ messageReqest }) {
  const content = use(messageReqest);
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


### Reading the value in a context {/*reading-the-value-of-a-context*/}

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

---

## Troubleshooting {/*troubleshooting*/}

### async/await is not supported in client components {/*async-not-support-in-client-components*/}

🚧 You haven't passed the promise correctly to `use`

### Suspense Exception error {/*suspense-exception-error*/}

I’m geting this error: 

<ConsoleBlock level="error">

Suspense Exception: This is not a real error! It\'s an implementation detail of \'use\' to interrupt the current render. You must either rethrow it immediately, or move the \'use\' call outside of the \'try/catch\' block. Capturing without rethrowing will lead to unexpected behavior. To handle async errors, wrap your component in an error boundary, or call the promise's \'.catch\' method and pass the result to \'use\'

</ConsoleBlock>

You are either calling `use` outside of a React component or Hook function, or calling `use` in a try-catch block. If you are calling `use` outside a React component or Hook function, move the `use` call to a React component or Hook function. If you are calling `use` inside a `try-catch` block. Instead of a try-catch block wrap your component in an error boundary, or call the promise's `catch` to catch the error and resolve the promise with another value. [See these examples](#dealing-with-rejected-promises).
