---
title: use
---

<Wip>
The `use` hook is only supported under when using [React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) which is only available in React’s canary and experimental channels. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).

The `use` hook has only been partially implemented for client components and only supports the following scenarios:

* When the use hook is directly called within a server component.
* When a promise is created in a server component, passed to a client component as a prop, and the client component then uses the `use` hook to unwrap the promise.

</Wip>

<Intro>

`use` is a special React Hook that lets you asynchronously resolve the value of a promise or [context](https://react.dev/learn/passing-data-deeply-with-context).

```js
const value = use(promiseOrContext);
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `use(promiseOrContext)` {/*use*/}

Call `use` in your component to resolve the value of a promise or [context](https://react.dev/learn/passing-data-deeply-with-context).

```js
"use client";

import { use, cache } from "react";

export function MyComponent({ promise }) {
  const user = use(cache(fetch(`/api/user`)));
  return <h1>Hello, {user.name}</h1>
}
```

When using `use` to fetch data from a client component we recommend using wrapping your data fetching function in `cache` to avoid recreating a new promise every time the component is rerendered.

Unlike all other React Hooks, the `use` hook can be called within conditional statements like loops, if statements. Like other React hooks, the parent function of a hook must be a React component or hook.

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `promiseOrContext`: the promise or context you want to resolve.

#### Returns {/*returns*/}

The `use` hook returns the value of the resolved promise or context.

#### Caveats {/*caveats*/}

* `use` is not recommended for data fetching from a server component. async and await is preferred when fetching data from a server component.
* The parent function of the `use` hook must be a React component or a hook. For example, the `use` hook cannot be used in function closures like “map”:
  ```js
  function Component({ids}) {
    return ids.map((id) => {
      // ❌ The parent closure is not a component or Hook!
      // This will cause a compiler error.
      const data = use(fetchThing(id));
      return <Item key={id} data={data} />;
    });
  ```
  instead, use a loop to iterate through an array:
  ```js
  function Component({ids}) {
    const items = [];
    for (const id of ids) {
      // ✅ This works! The parent function is a component.
      const data = use(fetchThing(id));
      items.push(<Item key={id} data={data} />);
    }
    return items;
  }
  ```
* `use` cannot be called in a try-catch block. To handle errors either wrap your component that calls the `use` hook in an error boundary or call the promise's `catch` method to handle the error and return a new value to resolve the promise. [See more examples below.](#dealing-with-rejected-promises)

---

## Usage {/*usage*/}

<Wip>

This section is incomplete. See also the [draft use RFC](https://github.com/acdlite/rfcs/blob/first-class-promises/text/0000-first-class-support-for-promises.md#usepromise).

</Wip>


### Passing a promise from a server component to a client component {/*passing-a-promise*/}

The client component accept a promise as a prop and then uses the `use` hook to unwrap the promise to its resolved value. The resolved value is then displayed by the client component in the JSX the client component returns.

The server component imports the client component in includes it in the JSX the server component returns. The promise is passed from the server componentn to the client component as a prop. The client component is wrapped in a suspense boundary. The fallback will be displayed until the promise is resolved. Then the suspense fallback will be replaced by the client component with the resolved value from the promise.

<Sandpack>

```js client-component.js active
"use client";

import { use } from "react";

export default function ClientComponent({ promise }) {
  const value = use(promise);
  return <p>Here is the value from the promise: {value}</p>;
}
```

```js App.js
import { Suspense } from "react";
import ClientComponent from "./client-component";

export default function ServerComponent() {
  const promise = new Promise((resolve) => setTimeout(resolve, 3000, "⚛️"));

  return (
    <Suspense fallback={<p>waiting for promise to resolve...</p>}>
      <ClientComponent promise={promise} />
    </Suspense>
  );
}
```

```js index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// hook is in a stable release of React
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// TODO: update this example to use
// the Codesandbox server component
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

### Using use on the client with useState {/*use-with-usestate*/}

Promises can be passed as a prop from a parent client component to a child client component when the promise is stored in a state variables of the parent component. The parent component should wrap the client component calling `use` in a suspense bounardy to avoid pop-in:

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
// hook is in a stable release of React
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// TODO: update this example to use
// the Codesandbox server component
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
// hook is in a stable release of React
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// TODO: update this example to use
// the Codesandbox server component
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
// hook is in a stable release of React
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// TODO: update this example to use
// the Codesandbox server component
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

### Suspense Exception error {/*suspense-exception-error*/}

I’m geting this error: 

<ConsoleBlock level="error">
Suspense Exception: This is not a real error! It\'s an implementation detail of \'use\' to interrupt the current render. You must either rethrow it immediately, or move the \'use\' call outside of the \'try/catch\' block. Capturing without rethrowing will lead to unexpected behavior. To handle async errors, wrap your component in an error boundary, or call the promise's \'.catch\' method and pass the result to \'use\'
</ConsoleBlock>

You are either calling `use` outside of a React component or hook function, or calling `use` in a try-catch block. If you are calling `use` outside a React component or hook function, move the `use` call to a React component or hook function. If you are calling `use` inside a `try-catch` block. Instead of a try-catch block wrap your component in an error boundary, or call the promise's `catch` to catch the error and resolve the promise with another value. [See these examples](#dealing-with-rejected-promises).
