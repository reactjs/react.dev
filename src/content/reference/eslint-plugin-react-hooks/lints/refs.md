---
title: refs
---

<Intro>

Validates correct usage of refs, not reading/writing during render. See the "pitfalls" section in [`useRef()` usage](/reference/react/useRef#usage).

</Intro>

## Rule Details {/*rule-details*/}

Refs hold values that aren't used for rendering. Unlike state, changing a ref doesn't trigger a re-render. Reading or writing `ref.current` during render breaks React's expectations. Refs might not be initialized when you try to read them, and their values can be stale or inconsistent.

## Common Violations {/*common-violations*/}

- Reading `ref.current` during render
- Updating `refs` during render
- Using `refs` for values that should be state

### Invalid {/*invalid*/}

Examples of incorrect code for this rule:

```js
// ❌ Reading ref during render
function Component() {
  const ref = useRef(0);
  const value = ref.current; // Don't read during render
  return <div>{value}</div>;
}

// ❌ Modifying ref during render
function Component({value}) {
  const ref = useRef(null);
  ref.current = value; // Don't modify during render
  return <div />;
}
```

### Valid {/*valid*/}

Examples of correct code for this rule:

```js
// ✅ Read ref in effects/handlers
function Component() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      console.log(ref.current.offsetWidth); // OK in effect
    }
  });

  return <div ref={ref} />;
}

// ✅ Use state for UI values
function Component() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```
