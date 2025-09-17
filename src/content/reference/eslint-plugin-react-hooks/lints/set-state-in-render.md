---
title: set-state-in-render
---

<Intro>

Validates against setting state during render, which can trigger additional renders and potential infinite render loops.

</Intro>

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

### I need to reset state when props change {/*reset-state-on-prop-change*/}

Sometimes you want to reset internal state when a prop changes:

```js
// ❌ Wrong approach
function EditForm({itemId}) {
  const [formData, setFormData] = useState({});

  // This creates infinite renders
  if (itemId !== lastItemId) {
    setFormData({});
  }

  return <form>...</form>;
}
```

Use a key to reset the component:

```js
// ✅ Use key to reset component
function EditForm({itemId, ...props}) {
  return <EditFormInner key={itemId} {...props} />;
}

function EditFormInner() {
  const [formData, setFormData] = useState({});
  // Component resets when key changes
  return <form>...</form>;
}
```

<Note>
Using a `key` to reset component state is often the cleanest solution. When the key changes, React creates a new component instance with fresh state. Learn more about [Resetting State with Keys](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key).
</Note>