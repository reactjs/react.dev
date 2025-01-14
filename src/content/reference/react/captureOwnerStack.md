---
title: captureOwnerStack
---

<Wip>

**This API is experimental and is not available in a stable version of React yet.**

You can try it by upgrading React packages to the most recent experimental version:

- `react@experimental`

Experimental versions of React may contain bugs. Don't use them in production.

</Wip>

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

```js
import * as React from 'react';

function Component() {
  if (process.env.NODE_ENV !== 'production') {
    const ownerStack = React.captureOwnerStack();
    console.log(ownerStack);
  }
}
```

#### Parameters {/*parameters*/}

`captureOwnerStack` does not take any parameters.

#### Returns {/*returns*/}

`captureOwnerStack` returns `string | null`.

If no Owner Stack is available, it returns an empty string.
Outside of development builds, `null` is returned.

#### Caveats {/*caveats*/}

- Owner Stacks are only available in development. `captureOwnerStack` will always return `null` outside of development.

## Owner Stack vs Component Stack {/*owner-stack-vs-component-stack*/}

The Owner Stack is different from the Component Stack available error handlers like [`errorInfo.componentStack` in `onUncaughtError`](/reference/react-dom/client/hydrateRoot#show-a-dialog-for-uncaught-errors).

For example, consider the following code:

```tsx
import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';

function SubComponent({disabled}) {
  if (disabled) {
    throw new Error('disabled');
  }
}

function Component({label}) {
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

function App({children}) {
  return (
    <React.Suspense fallback="loading...">
      <main>
        <Navigation />
        {children}
      </main>
    </React.Suspense>
  );
}

createRoot(document.createElement('div')).render(
  <App>
    <Component label="disabled" />
  </App>
);
```

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
at SubComponent
at Component
```

Neither `App` nor the DOM components (e.g. `fieldset`) are considered Owners in this Stack since they didn't contribute to "creating" the node containing `SubComponent`. `App` and DOM components only forwarded the node. `App` just rendered the `children` node as opposed to `Component` which created a node containing `SubComponent` via `<SubComponent />`.

Neither `Navigation` nor `legend` are in the stack at all since it's only a sibling to a node containing `<SubComponent />`.

## Usage {/*usage*/}

### Expanding error stacks {/*expanding-error-stacks*/}

In addition to the stack trace of the <CodeStep step={1}>error</CodeStep> itself, you can use <CodeStep step={2}>`captureOwnerStack`</CodeStep> to append the Owner Stack.
This can help trace the error especially when the error is caused by props. The Owner Stack helps trace the flow of props.

```jsx [[9, 15, "error"], [34, 10, "captureOwnerStack"]]
import { captureOwnerStack } from 'react'
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onCaughtError: (error, errorInfo) => {
      if (process.env.NODE_ENV !== 'production') {
        const ownerStack = captureOwnerStack();
        error.stack += ownerStack;
      }
      console.error(
        'Caught error',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

## Troubleshooting {/*troubleshooting*/}

### The Owner Stack is `null` {/*the-owner-stack-is-null*/}

`captureOwnerStack` was called outside of development builds.
For performance reasons, React will not keep track of Owners in production.

### The Owner Stack is empty {/*the-owner-stack-is-empty*/}

The call of `captureOwnerStack` happened outside of a React controlled function e.g. in a `setTimeout` callback.
During render, Effects, Events, and React error handlers (e.g. `hydrateRoot#options.onCaughtError`) Owner Stacks should be available.
