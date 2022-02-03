---
title: useState
---

<Intro>

`useState` is a React Hook that lets you declare a state variable.

```js
let [state, setState] = useState(initialState);
```

</Intro>

## `useState()` {/*usestate*/}

### Arguments {/*arguments*/}

* `initialState`: The value you want the state to be initially. It can be a value of any type, but there is a special behavior for functions. If you pass a function, React will not store it, but will *call* your function instead, and store its return value as the initial state. The `initialState` argument is ignored after the initial render.

### Returns {/*returns*/}

`useState` returns an array with exactly two values:

* `state`: The current state.
* [`setState`](#setstate): A function that lets you update the state to a different value and trigger a re-render.

By convention, we use array destructuring to give them names like `[thing, setThing]`.

### Example {/*example*/}

```js
function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(28);
  // ...
```

### Caveats {/*caveats*/}

* `useState` is a Hook, so you can't call it inside loops or conditions.

## `setState()` {/*setstate*/}

`setState` lets you update the state to a different value and trigger a re-render:

```js
setState(nextState);
```

### Arguments {/*setstate-arguments*/}

* `nextState`: The value that you want the state to be. It can be a value of any type, but there is a special behavior for functions. If you pass a function, React will not store it, but will *call* your function instead during the next render with the pending state, and store its return value.

### Returns {/*setstate-returns*/}

`setState` does not have a return value.


### Example {/*setstate-example*/}

```js
function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(28);

  function handleChange(e) {
    setName(e.target.value);
  }
  
  function handleClick() {
    setAge(a => a + 1);
  }

  // ...
```

### Caveats {/*caveats*/}

* Calling `setState()` only updates the state for the next render. If you read the `state` variable after calling `setState()`, you will still get the value that was on the screen before your call.

* If you call `setState()` with the value that's identical to the current `state`, as determined by an [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison, React will bail out of re-rendering the component and its children. However, in some cases React may still need to call your component before discarding the result.


