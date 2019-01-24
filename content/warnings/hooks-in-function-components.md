---
title: Hooks can only be called inside the body of a function component.
layout: single
permalink: warnings/hooks-in-function-components.html
---

You are probably here because you got the following error message:

> Hooks can only be called inside the body of a function component.

This usually means that you've tried to call one on React's [Hooks](/hooks-intro.html) from outside the body of a [function component](/docs/components-and-props.html#function-and-class-components). This breaks the [Rules of Hooks](/docs/hooks-rules.html). Some examples of code that could trigger this error -

### Calling a hook inside an event handler:

```jsx
function App() {
  return (
    <button
      onClick={() => {
        useEffect(() => {
          console.log("clicked");
        });
      }}
    >
      click me
    </button>
  );
}
```

In this case, you don't need the `useEffect` call, and can log the message directly. Rewriting the above example -

```jsx
function App() {
  return (
    <button
      onClick={() => {
        console.log("clicked");
      }}
    >
      click me
    </button>
  );
}
```

### Calling a hook inside useMemo:

```jsx
function App() {
  const value = useMemo(() => {
    const [counter, setCounter] = useState(0);
    return counter;
  }, []);
  return value;
}
```

### Calling a hook inside .memo's comparator:

```jsx
const App = React.Memo(
  props => {
    return "the sum is " + props.left + props.right;
  },
  (a, b) => {
    useEffect(() => {
      // ...
    });
    return a.left === b.left && a.right === b.right;
  }
);
```

NB: In rare edge cases, you could also get this error in case you've configured your app incorrectly. 2 cases we've come across -

- if you've accidentally included multiple versions of React in the same bundle [(#14039)](https://github.com/facebook/react/issues/14039)
- if you've updated react to a newer version with hooks, but forgotten to update react-dom as well [(#13991)](https://github.com/facebook/react/issues/13991)
