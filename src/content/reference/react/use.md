---
title: use
---

<Wip>
The `use` hook is only supported under when using [React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) which is only available in React’s canary and experimental channels. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).
</Wip>

<Intro>

`use` is a React Hook that lets you read the value of data provider like a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](https://react.dev/learn/passing-data-deeply-with-context).

```js
const value = use(provider);
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `use(provider)` {/*use*/}

Call `use` in your component to read the value of a data provider like a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](https://react.dev/learn/passing-data-deeply-with-context).

```js
import { use } from 'react';

function MyComponent({ messageReqest }) {
  const content = use(messageReqest);
  const theme = use(ThemeContext);
  // ...
```

Unlike all other React Hooks, the `use` Hook can be called within conditional statements like loops and `if` statements. Like other React Hooks, the parent function of a Hook must be a React component or Hook.

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `provider`: this is the source of the data you want to read a value from. Common values for a provider are a promise or context.

#### Returns {/*returns*/}

The `use` Hook returns the value that was read from the provider like the value of a promise or context.

#### Caveats {/*caveats*/}

* `use` is not recommended for data fetching from a [Server Component](/reference/react/components#server-components). `async` and `await` are preferred when fetching data from a [Server Component](/reference/react/components#server-components). For example, instead of using `use` in a [Server Component](/reference/react/components#server-components) with `fetch`:

  ```js
  const data = use(fetch('/data'))
  ```
  use `await` with `fetch` to get your data.
  ```js
  const data = await fetch('/data')
  ```

  <Note>
  Using `await` in a [Server Component](/reference/react/components#server-components) will block the rendering of the [Server Component](/reference/react/components#server-components) until what is being `await` completes. To render the [Server Component](/reference/react/components#server-components) and stream the data to the client as it is retrived, you can pass a promise as a prop to a [Client Component](/reference/react/components#client-components) and wrap it in suspense [like in this example](#🚧)
  </Note>

* The parent function of the `use` Hook must be a React component or a Hook. For example, the `use` Hook cannot be used in function closures like “map”:
  ```js
  export default function Messages() {
    const [msg, setMsg] = useState("No messages yet");
    function download() {
      // ❌ The parent closure is not a component or Hook!
      // This will cause a compiler error.
      setMsg(use(fetchMsg()));
    }
    return (
      <>
        <p>{msg}</p>
        <button onClick={download}>Download new message</button>
      </>
    );
  }
  ```
  instead, use a loop to iterate through an array:
  ```js
  export default function Messages() {
    const [msg, setMsg] = useState(null);
    function download() {
      setMsg(fetchMsg());
    }
    return (
      <>
        {/* ✅ This works! The parent function is a component. */}
        {/* TODO: wrap `use`` in Suspense */}
        {msg ? <p>{use(msg)}</p> : <p>{"No messages yet"}</p>}
        <button onClick={download}>Download new message</button>
      </>
    );
  }
  ```
* `use` cannot be called in a try-catch block. To handle errors either wrap your component that calls the `use` Hook in an error boundary or call the promise's `catch` method to handle the error and return a new value to resolve the promise. [See more examples below.](#dealing-with-rejected-promises)

---

## Usage {/*usage*/}

<Wip>

This section is incomplete. See also the [draft use RFC](https://github.com/acdlite/rfcs/blob/first-class-promises/text/0000-first-class-support-for-promises.md#usepromise).

</Wip>


### Getting data from a promise {/*getting-data-from-a-promise*/}

`use` functions similarly to the `await` with JavaScript promises but is compatible with React's renderer and suspense. 🚧

<Recipes titleText="Reading promises with use" titleId="reading-promises-with-use">

#### Promises from Server Components {/*promises-from-server-components*/}

The Client Component accept a promise as a prop and then uses the `use` Hook to unwrap the promise to its resolved value. The resolved value is then displayed by the Client Component in the JSX the Client Component returns.

The Server Component imports the Client Component in includes it in the JSX the Server Component returns. The promise is passed from the Server Componentn to the Client Component as a prop. The Client Component is wrapped in a suspense boundary. The fallback will be displayed until the promise is resolved. Then the suspense fallback will be replaced by the Client Component with the resolved value from the promise.

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

<Solution />

#### Promises from useState {/*promises-from-usestate*/}

Promises can be passed as a prop from a parent Client Component to a child Client Component when the promise is stored in a state variables of the parent component. The parent component should wrap the Client Component calling `use` in a suspense bounardy to avoid pop-in:

<Sandpack>

```js App.js
"use client";

import { use, Suspense, useState } from "react";

function Message({ timer }) {
  const message = use(timer);
  return <p>Here is the message: {message}</p>;
}

export default function App() {
  const [timer, setTimer] = useState(
    () => new Promise((resolve) => setTimeout(resolve, 3000, "⚛️"))
  );
  function resetTimer() {
    const promise = new Promise((resolve) => setTimeout(resolve, 1000, "⚛️"));
    setTimer(promise);
  }

  return (
    <>
      <Suspense fallback={<p>waiting for message...</p>}>
        <Message timer={timer} />
      </Suspense>
      <button onClick={resetTimer}>Reset</button>
    </>
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
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```
</Sandpack>

<Solution />

#### Promises from data fetching libraries {/*promises-from-libraries*/}

🚧

<Sandpack />

<Solution />

</Recipes>

### Dealing with rejected promises {/*dealing-with-rejected-promises*/}

`use` cannot be called in a try-catch block. Instead of a try-catch block wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`.

You can wrap the suspense boundary for the component you are passing a promise to as a prompt in a `ErrorBoundary`. In the case that the promise is rejected the fallback for the `ErrorBoundary` will be displayed:

<Sandpack>

```js App.js

import { use, Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Message from "./client-component"

export default function App() {
  const initTimer = new Promise((resolve, reject) => setTimeout(reject, 3000));
  const [timer] = useState(initTimer);
  return (
    <>
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <Suspense fallback={<p>waiting for message...</p>}>
          <Message timer={timer} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
```

```js client-component.js
"use client";

import { use } from "react";

export default function Message({ timer }) {
  const message = use(timer);
  return <p>Here is the message: {message}</p>;
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
    "react-error-boundary": "4.0.3",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```
</Sandpack>

You can also use the promise `catch` method to handle errors in lieu of an error boundary. The catch method is called on the original promise object. `catch` takes a single argument: a function that takes an error message as an argument. Typically the error is logged inside the body of the function you pass to `catch`. Whatever is returned by the function passed to `catch` will be used as the resolved value of the promise:

<Sandpack>

```js App.js

import { use, Suspense, useState } from "react";
import Message from "./client-component"

export default function App() {
  const [timer] = useState(() =>
    new Promise((resolve, reject) => {
      setTimeout(reject, 3000, "this is a error message");
    }).catch((error) => {
      console.log(error);
      return "there was a error resolving the promise";
    })
  );
  return (
    <>
      <Suspense fallback={<p>waiting for message...</p>}>
        <Message timer={timer} />
      </Suspense>
    </>
  );
}
```

```js client-component.js
"use client";

import { use } from "react";

export default function Message({ timer }) {
  const message = use(timer);
  return <p>Here is the message: {message}</p>;
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


### Reading the value of a context {/*reading-the-value-of-a-context*/}

🚧

---

## Troubleshooting {/*troubleshooting*/}

### Suspense Exception error {/*suspense-exception-error*/}

I’m geting this error: 

<ConsoleBlock level="error">

Suspense Exception: This is not a real error! It\'s an implementation detail of \'use\' to interrupt the current render. You must either rethrow it immediately, or move the \'use\' call outside of the \'try/catch\' block. Capturing without rethrowing will lead to unexpected behavior. To handle async errors, wrap your component in an error boundary, or call the promise's \'.catch\' method and pass the result to \'use\'

</ConsoleBlock>

You are either calling `use` outside of a React component or Hook function, or calling `use` in a try-catch block. If you are calling `use` outside a React component or Hook function, move the `use` call to a React component or Hook function. If you are calling `use` inside a `try-catch` block. Instead of a try-catch block wrap your component in an error boundary, or call the promise's `catch` to catch the error and resolve the promise with another value. [See these examples](#dealing-with-rejected-promises).
