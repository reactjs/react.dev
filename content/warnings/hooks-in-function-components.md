---
title: Hooks can only be called inside the body of a function component.
layout: single
permalink: warnings/hooks-in-function-components.html
---

You are probably here because you got the following error message:

> Hooks can only be called inside the body of a function component.

This usually means that you've tried to call one on react's [hooks]() from outside the body of a [function component](). This breaks the [Rules of Hooks](). Some examples of code that could trigger this error - 

```jsx
// calling a hook inside an event handler
function App(){
  return <button onClick={() => {
    useEffect(() => {
      console.log('clicked')
    })
  }}> 
    click me
  </button>
} 
```
In this case, you don't need the `useEffect` call, and can log the message directly. Rewriting teh above example - 
```jsx
function App(){
  return <button onClick={() => {
    console.log('clicked')
  }}> 
    click me
  </button>
} 
```

```jsx
// calling a hook inside useMemo
function App(){
  const value = useMemo(() => {
    const [counter, setCounter] = useState(0)
    return counter
  }, [])
  return value
}
```

```jsx
// calling a hook inside .memo's comparator
const App = React.Memo((props) => {
  return props.left + props.right
}, (a, b) => a.left === b.left && a.right === b.right)
```

In rare edge cases, you could also get this error in case you've configured your app incorrectly. 2 cases we've come across - 
- if you've accidentally included multiple versions of react in the same bundle [(#14039)](https://github.com/facebook/react/issues/14039)
- if you've updated react to a newer version with hooks, but forgotten to update react-dom as well [(#13991)](https://github.com/facebook/react/issues/13991) 
