---
title: set-state-in-render
version: rc
---

<Intro>

Validates against setting state during render, which can trigger additional renders and potential infinite render loops.

</Intro>

<RC>

This rule is available in the RC version of `eslint-plugin-react-hooks`.

You can try it by upgrading the lint plugin [to the most recent RC version](/learn/react-compiler/installation#eslint-integration).

</RC>

## Rule Details {/*rule-details*/}

Calling `setState` during render triggers another render before the current one finishes. This creates an infinite loop that crashes your app.

## Common Violations {/*common-violations*/}

### Invalid {/*invalid*/}

```js {expectedErrors: {'react-compiler': [4]}}
// ❌ setState directly in render
function Component({value}) {
  const [count, setCount] = useState(0);
  setCount(value); // Infinite loop!
  return <div>{count}</div>;
}
```

### Valid {/*valid*/}

```js
// ✅ Derive during render
function Component({items}) {
  const sorted = [...items].sort(); // Just calculate it in render
  return <ul>{sorted.map(/*...*/)}</ul>;
}

// ✅ Set state in event handler
function Component() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}

// ✅ Derive from props instead of setting state
function Component({user}) {
  const name = user?.name || '';
  const email = user?.email || '';
  return <div>{name}</div>;
}
```

## Troubleshooting {/*troubleshooting*/}

### I want to sync state to a prop {/*clamp-state-to-prop*/}

A common problem is trying to "fix" state after it renders. Suppose you want to keep a counter from exceeding a `max` prop:

```js
// ❌ Wrong: clamps during render
function Counter({max}) {
  const [count, setCount] = useState(0);

  if (count > max) {
    setCount(max);
  }

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

As soon as `count` exceeds `max`, an infinite loop is triggered.

Instead, it's often better to move this logic to the event (the place where the state is first set). For example, you can enforce the maximum at the moment you update state:

```js
// ✅ Clamp when updating
function Counter({max}) {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(current => Math.min(current + 1, max));
  };

  return <button onClick={increment}>{count}</button>;
}
```

Now the setter only runs in response to the click, React finishes the render normally, and `count` never crosses `max`.
