---
title: preserve-manual-memoization
version: rc
---

<Intro>

Validates that existing manual memoization is preserved by the compiler. React Compiler will only compile components and hooks if its inference [matches or exceeds the existing manual memoization](/learn/react-compiler/introduction#what-should-i-do-about-usememo-usecallback-and-reactmemo).

</Intro>

<RC>

This rule is available in the RC version of `eslint-plugin-react-hooks`.

You can try it by upgrading the lint plugin [to the most recent RC version](/learn/react-compiler/installation#eslint-integration).

</RC>

## Rule Details {/*rule-details*/}

React Compiler preserves your existing `useMemo`, `useCallback`, and `React.memo` calls. If you've manually memoized something, the compiler assumes you had a good reason and won't remove it. However, incomplete dependencies prevent the compiler from understanding your code's data flow and applying further optimizations.

### Invalid {/*invalid*/}

Examples of incorrect code for this rule:

```js
// ❌ Missing dependencies in useMemo
function Component({ data, filter }) {
  const filtered = useMemo(
    () => data.filter(filter),
    [data] // Missing 'filter' dependency
  );

  return <List items={filtered} />;
}

// ❌ Missing dependencies in useCallback
function Component({ onUpdate, value }) {
  const handleClick = useCallback(() => {
    onUpdate(value);
  }, [onUpdate]); // Missing 'value'

  return <button onClick={handleClick}>Update</button>;
}
```

### Valid {/*valid*/}

Examples of correct code for this rule:

```js
// ✅ Complete dependencies
function Component({ data, filter }) {
  const filtered = useMemo(
    () => data.filter(filter),
    [data, filter] // All dependencies included
  );

  return <List items={filtered} />;
}

// ✅ Or let the compiler handle it
function Component({ data, filter }) {
  // No manual memoization needed
  const filtered = data.filter(filter);
  return <List items={filtered} />;
}
```

## Troubleshooting {/*troubleshooting*/}

### Should I remove my manual memoization? {/*remove-manual-memoization*/}

You might wonder if React Compiler makes manual memoization unnecessary:

```js
// Do I still need this?
function Component({items, sortBy}) {
  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      return a[sortBy] - b[sortBy];
    });
  }, [items, sortBy]);

  return <List items={sorted} />;
}
```

You can safely remove it if using React Compiler:

```js
// ✅ Better: Let the compiler optimize
function Component({items, sortBy}) {
  const sorted = [...items].sort((a, b) => {
    return a[sortBy] - b[sortBy];
  });

  return <List items={sorted} />;
}
```