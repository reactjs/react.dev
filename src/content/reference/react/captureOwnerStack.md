---
title: captureOwnerStack
---

<Canary>

The `captureOwnerStack` API is currently only available in React's Canary and experimental channels. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`captureOwnerStack` reads the current Owner Stack in development and returns it as a string if available.

```js
const stack = captureOwnerStack();
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `captureOwnerStack()` {/*captureownerstack*/}

Call `captureOwnerStack` to get the current Owner Stack.

```js {5,5}
import {captureOwnerStack} from 'react';

function Component() {
  if (process.env.NODE_ENV !== 'production') {
    const ownerStack = captureOwnerStack();
    console.log(ownerStack);
  }
}
```

#### Parameters {/*parameters*/}

`captureOwnerStack` does not take any parameters.

#### Returns {/*returns*/}

`captureOwnerStack` returns `string | null`.

If no Owner Stack is available (outside of render, Effects, Events and React error handlers), it returns an empty string (see [Troubleshooting: The Owner Stack is empty](#the-owner-stack-is-empty-the-owner-stack-is-empty)). Outside of development builds, `null` is returned (see [Troubleshooting: The Owner Stack is `null`](#the-owner-stack-is-null-the-owner-stack-is-null)).

#### Caveats {/*caveats*/}

- Owner Stacks are only available in development. `captureOwnerStack` will always return `null` outside of development.

<DeepDive>

#### Owner Stack vs Component Stack {/*owner-stack-vs-component-stack*/}

The Owner Stack is different from the Component Stack available in React error handlers like [`errorInfo.componentStack` in `onUncaughtError`](/reference/react-dom/client/hydrateRoot#show-a-dialog-for-uncaught-errors).

For example, consider the following code:

<Sandpack>

```js src/App.js
import {Suspense} from 'react';

function SubComponent({disabled}) {
  if (disabled) {
    throw new Error('disabled');
  }
}

export function Component({label}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <SubComponent key={label} disabled={label === 'disabled'} />
    </fieldset>
  );
}

function Navigation() {
  return null;
}

export default function App({children}) {
  return (
    <Suspense fallback="loading...">
      <main>
        <Navigation />
        {children}
      </main>
    </Suspense>
  );
}
```

```js src/index.js
import {captureOwnerStack} from 'react';
import {createRoot} from 'react-dom/client';
import App, {Component} from './App.js';
import './styles.css';

createRoot(document.createElement('div'), {
  onUncaughtError: (error, errorInfo) => {
    // The stacks are logged instead of showing them in the UI directly to highlight that browsers will apply sourcemaps to the logged stacks.
    // Note that sourcemapping is only applied in the real browser console not in the fake one displayed on this page.
    console.log(errorInfo.componentStack);
    console.log(captureOwnerStack());
  },
}).render(
  <App>
    <Component label="disabled" />
  </App>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <p>Check the console output.</p>
  </body>
</html>
```

</Sandpack>

`SubComponent` would throw an error.
The Component Stack of that error would be

```
at SubComponent
at fieldset
at Component
at main
at React.Suspense
at App
```

However, the Owner Stack would only read

```
at Component
```

Neither `App` nor the DOM components (e.g. `fieldset`) are considered Owners in this Stack since they didn't contribute to "creating" the node containing `SubComponent`. `App` and DOM components only forwarded the node. `App` just rendered the `children` node as opposed to `Component` which created a node containing `SubComponent` via `<SubComponent />`.

Neither `Navigation` nor `legend` are in the stack at all since it's only a sibling to a node containing `<SubComponent />`.

`SubComponent` is omitted because it's already part of the callstack.

</DeepDive>

## Usage {/*usage*/}

### Improve error reporting {/*improve-error-reporting*/}

Check out the following example to see how to use `captureOwnerStack` to improve error reporting:

- [createRoot usage: Show a dialog for uncaught errors
](/reference/react-dom/client/createRoot#show-a-dialog-for-uncaught-errors)
- [createRoot usage: Displaying Error Boundary errors](/reference/react-dom/client/createRoot#show-a-dialog-for-uncaught-errors)
- [createRoot usage: Displaying a dialog for recoverable errors](/reference/react-dom/client/createRoot#displaying-a-dialog-for-recoverable-errors)

### Expanding error stacks {/*expanding-error-stacks*/}

In addition to the <CodeStep step={1}>stack trace of the error</CodeStep> itself, you can use <CodeStep step={2}>`captureOwnerStack`</CodeStep> to append the Owner Stack.
This can help trace the error especially when the error is caused by props. The Owner Stack helps trace the flow of props.


```js src/index.js [[1, 8, "error.stack"], [2, 7, "captureOwnerStack()"]]
import {captureOwnerStack} from 'react';
import {createRoot} from 'react-dom/client';

const root = createRoot(document.getElementById('root'), {
  onUncaughtError: (error, errorInfo) => {
    if (process.env.NODE_ENV !== 'production') {
      const ownerStack = captureOwnerStack();
      error.stack += ownerStack;
    }

    console.error('Uncaught', error);
  },
}).render(<App />);
```

<Sandpack>

```js
function useCustomHook() {
  throw new Error('Boom!');
}

function Component() {
  useCustomHook();
}

export default function App() {
  return <Component />;
}
```

```js src/index.js
import {captureOwnerStack} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'), {
  onUncaughtError: (error, errorInfo) => {
    if (process.env.NODE_ENV !== 'production') {
      const ownerStack = captureOwnerStack();
      error.stack =
        // The stack is only split because these sandboxes don't implement ignore-listing 3rd party frames via sourcemaps.
        // A framework would ignore-list stackframes from React via sourcemaps and then you could just `error.stack += ownerStack`.
        // To learn more about ignore-listing see https://developer.chrome.com/docs/devtools/x-google-ignore-list
        error.stack.split('\n    at react-stack-bottom-frame')[0] + ownerStack;
    }

    // The stacks are logged instead of showing them in the UI directly to highlight that browsers will apply sourcemaps to the logged stacks.
    // Note that sourcemapping is only applied in the real browser console not in the fake one displayed on this page.
    console.error('Uncaught', error);
  },
}).render(<App />);
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <p>Check the console output.</p>
    <div id="root"></div>
  </body>
</html>
```

</Sandpack>

## Troubleshooting {/*troubleshooting*/}

### The Owner Stack is `null` {/*the-owner-stack-is-null*/}

`captureOwnerStack` was called outside of development builds. For performance reasons, React will not keep track of Owners in production.

### The Owner Stack is empty {/*the-owner-stack-is-empty*/}

The call of `captureOwnerStack` happened outside of a React controlled function e.g. in a `setTimeout` callback. During render, Effects, Events, and React error handlers (e.g. `hydrateRoot#options.onCaughtError`) Owner Stacks should be available.
