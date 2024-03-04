---
title: Props and State are immutable
---

<Intro>
A component's props and state are immutable [snapshots](learn/state-as-a-snapshot) with respect to a single render.
</Intro>

---

You can think of the props and state values as snapshots that are updated after rendering. For this reason, you don't modify the props or state variables directly: instead you use the setter function provided to you to tell React that state needs to update the next time the component is rendered.

## Props {/*props*/}
When followed, this rule allows React to understand that values that flow from props aren't mutated when they're passed as arguments to functions. Mutating props may also indicate a bug in your app – changing values on the props object doesn't cause the component to update, leaving your users with an outdated UI.

```js {2}
function Post({ item }) {
  item.url = new Url(item.url, base); // ❌ never mutate props directly
  return <Link url={item.url}>{item.title}</Link>;
}
```

```js {2}
function Post({ item }) {
  const url = new Url(item.url, base); // ✅ make a copy instead
  return <Link url={url}>{item.title}</Link>;
}
```

## State {/*state*/}
`useState` returns an immutable tuple of the state variable and a setter to update that state.

```js
const [stateVariable, setter] = useState(0);
```

Rather than updating the state variable in-place, we need to update it using the setter function that is returned by `useState`. Changing values on the state variable doesn't cause the component to update, leaving your users with an outdated UI. Using the setter function informs React that the state has changed, and that we need to queue a re-render to update the UI.

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    count = count + 1; // ❌ never mutate state directly
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1); // ✅ use the setter function returned by useState
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```