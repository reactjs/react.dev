---
title: exhaustive-deps
---

<Intro>

Validates that dependency arrays for React hooks contain all necessary dependencies.

</Intro>

## Rule Details {/*rule-details*/}

React hooks like `useEffect`, `useMemo`, and `useCallback` accept dependency arrays. When a value referenced inside these hooks isn't included in the dependency array, React won't re-run the effect or recalculate the value when that dependency changes. This causes stale closures where the hook uses outdated values.

## Common Violations {/*common-violations*/}

This error often happens when you try to "trick" React about dependencies to control when an effect runs. Effects should synchronize your component with external systems. The dependency array tells React which values the effect uses, so React knows when to re-synchronize.

If you find yourself fighting with the linter, you likely need to restructure your code. See [Removing Effect Dependencies](/learn/removing-effect-dependencies) to learn how.

### Invalid {/*invalid*/}

Examples of incorrect code for this rule:

```js
// ❌ Missing dependency
useEffect(() => {
  console.log(count);
}, []); // Missing 'count'

// ❌ Missing prop
useEffect(() => {
  fetchUser(userId);
}, []); // Missing 'userId'

// ❌ Incomplete dependencies
useMemo(() => {
  return items.sort(sortOrder);
}, [items]); // Missing 'sortOrder'
```

### Valid {/*valid*/}

Examples of correct code for this rule:

```js
// ✅ All dependencies included
useEffect(() => {
  console.log(count);
}, [count]);

// ✅ All dependencies included
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

## Troubleshooting {/*troubleshooting*/}

### Adding a function dependency causes infinite loops {/*function-dependency-loops*/}

You have an effect, but you're creating a new function on every render:

```js
// ❌ Causes infinite loop
const logItems = () => {
  console.log(items);
};

useEffect(() => {
  logItems();
}, [logItems]); // Infinite loop!
```

In most cases, you don't need the effect. Call the function where the action happens instead:

```js
// ✅ Call it from the event handler
const logItems = () => {
  console.log(items);
};

return <button onClick={logItems}>Log</button>;

// ✅ Or derive during render if there's no side effect
items.forEach(item => {
  console.log(item);
});
```

If you genuinely need the effect (for example, to subscribe to something external), make the dependency stable:

```js
// ✅ useCallback keeps the function reference stable
const logItems = useCallback(() => {
  console.log(items);
}, [items]);

useEffect(() => {
  logItems();
}, [logItems]);

// ✅ Or move the logic straight into the effect
useEffect(() => {
  console.log(items);
}, [items]);
```

### Running an effect only once {/*effect-on-mount*/}

You want to run an effect once on mount, but the linter complains about missing dependencies:

```js
// ❌ Missing dependency
useEffect(() => {
  sendAnalytics(userId);
}, []); // Missing 'userId'
```

Either include the dependency (recommended) or use a ref if you truly need to run once:

```js
// ✅ Include dependency
useEffect(() => {
  sendAnalytics(userId);
}, [userId]);

// ✅ Or use a ref guard inside an effect
const sent = useRef(false);

useEffect(() => {
  if (sent.current) {
    return;
  }

  sent.current = true;
  sendAnalytics(userId);
}, [userId]);
```

## Options {/*options*/}

This rule accepts an options object:

```js
{
  "rules": {
    "react-hooks/exhaustive-deps": ["warn", {
      "additionalHooks": "(useMyCustomHook|useAnotherHook)"
    }]
  }
}
```

- `additionalHooks`: Regex for hooks that should be checked for exhaustive dependencies
