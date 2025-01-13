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

`captureOwnerStack` reads the current **owner** Component stack and returns it as a string.
If no owner stack is available, it returns an empty string.

```js
captureOwnerStack();
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `captureOwnerStack()` {/*captureownerstack*/}

Call `captureOwnerStack` to get the current owner Component stack.

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

`captureOwnerStack` returns `string`.

#### Caveats {/*caveats*/}

`captureOwnerStack` is only available in development builds of React.
In production builds, the `captureOwnerStack` export does not exist.

Only call `captureOwnerStack` in development environments:

```tsx
// Use a namespace import to avoid errors in production when using ES modules.
// Non-existing exports throw a `SyntaxError` in ES modules.
import * as React from 'react';

let ownerStack = '';
if (process.env.NODE_ENV !== 'prodction') {
  ownerStack = React.captureOwnerStack();
}
```

## Owner Component stacks vs parent Component stacks {/*owner-component-stacks-vs-parent-component-stacks*/}

The owner Component stack is different from the **parent** Component stack available error handlers like [`errorInfo.componentStack` in `onUncaughtError`](http://localhost:3000/reference/react-dom/client/hydrateRoot#show-a-dialog-for-uncaught-errors).

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
The **parent** component stack of that error would be

```
at SubComponent
at fieldset
at Component
at main
at React.Suspense
at App
```

However, the owner stack would only read

```
at SubComponent
at Component
```

Neither `App` nor the DOM components (e.g. `fieldset`) are considered owners in this stack since they didn't contribute to "creating" the node containing `SubComponent`. `App` and DOM components only forwarded the node. `App` just rendered the `children` node as opposed to `Component` which created a node containing `SubComponent` via `<SubComponent />`.

Neither `Navigation` nor `legend` are in the stack at all since it's only a sibling to a node containing `<SubComponent />`.

### When to use which {/*when-to-use-which*/}

The parent stack is useful for contextual information e.g. [`React.Suspense`](/reference/react/Suspense), [React Context](https://react.dev/reference/react/createContext), or [`<form>`](/reference/react-dom/components/form).

The owner stack is useful for tracing the flow of props. Owner stacks are equivalent to [call stacks](https://developer.mozilla.org/en-US/docs/Glossary/Call_stack) if all JSX would be converted to direct function calls e.g. `Component({label: "disabled"})` instead of `<Component label="disabled" />`.

## Usage {/*usage*/}

### Expanding error stacks {/*expanding-error-stacks*/}

In addition to the stack trace of the <CodeStep step={1}>error</CodeStep> itself, you can use <CodeStep step={2}>`captureOwnerStack`</CodeStep> to append the stack trace of the owner Component.
This can help trace the error especially when the error is caused by props. The owner Component stack helps trace the flow of props.

```jsx [[9, 15, "error"], [34, 10, "captureOwnerStack"]]
import * as React from 'react'
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onCaughtError: (error, errorInfo) => {
      if (process.env.NODE_ENV !== 'production') {
        const ownerStack = React.captureOwnerStack();
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
