---
title: error-boundaries
version: rc
---

<Intro>

Validates usage of Error Boundaries instead of try/catch for errors in child components.

</Intro>

<RC>

This rule is available in the RC version of `eslint-plugin-react-hooks`.

You can try it by upgrading the lint plugin [to the most recent RC version](/learn/react-compiler/installation#eslint-integration).

</RC>

## Rule Details {/*rule-details*/}

Try/catch blocks can't catch errors that happen during React's rendering process. Errors thrown in rendering methods or hooks bubble up through the component tree. Only [Error Boundaries](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) can catch these errors.

### Invalid {/*invalid*/}

Examples of incorrect code for this rule:

```js {expectedErrors: {'react-compiler': [4]}}
// ❌ Try/catch won't catch render errors
function Parent() {
  try {
    return <ChildComponent />; // If this throws, catch won't help
  } catch (error) {
    return <div>Error occurred</div>;
  }
}
```

### Valid {/*valid*/}

Examples of correct code for this rule:

```js
// ✅ Using error boundary
function Parent() {
  return (
    <ErrorBoundary>
      <ChildComponent />
    </ErrorBoundary>
  );
}
```

## Troubleshooting {/*troubleshooting*/}

### Why is the linter telling me not to wrap `use` in `try`/`catch`? {/*why-is-the-linter-telling-me-not-to-wrap-use-in-trycatch*/}

The `use` hook doesn't throw errors in the traditional sense, it suspends component execution. When `use` encounters a pending promise, it suspends the component and lets React show a fallback. Only Suspense and Error Boundaries can handle these cases. The linter warns against `try`/`catch` around `use` to prevent confusion as the `catch` block would never run.

```js {expectedErrors: {'react-compiler': [5]}}
// ❌ Try/catch around `use` hook
function Component({promise}) {
  try {
    const data = use(promise); // Won't catch - `use` suspends, not throws
    return <div>{data}</div>;
  } catch (error) {
    return <div>Failed to load</div>; // Unreachable
  }
}

// ✅ Error boundary catches `use` errors
function App() {
  return (
    <ErrorBoundary fallback={<div>Failed to load</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <DataComponent promise={fetchData()} />
      </Suspense>
    </ErrorBoundary>
  );
}
```