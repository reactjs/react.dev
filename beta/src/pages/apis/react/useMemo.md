---
title: useMemo
---

<Intro>

`useMemo` is a React Hook that returns a [memoized](https://en.wikipedia.org/wiki/Memoization) value.

```js
const memoizedValue = useMemo(callback, [...dependencies])
```

</Intro>

- [Usage](#usage)
  - [Skip expensive recalculations](#skip-expensive-recalculations)
  - [Skip re-render](#skip-re-render)
- [Reference](#reference)
  - [`useMemo(() => computeExpensiveFunction(a, b), [a, b])`](#usememo)
- [Troubleshooting](#troubleshooting)
  - [Every time my component renders `useMemo` is triggered](#every-time-my-component-renders-useMemo-is-triggered)

---

## Usage {/*usage*/}

### Skip expensive recalculations {/*skip-expensive-recalculations*/}

Call `useMemo` at the top level of your component to declare one or more memoized variables.

```js {5}
import {useMemo} from 'react';

export default function App(){

const visibleTodos = useMemo(() => getVisibleTodos(todos, tab), [todos, tab]);

//...
```

Wrap the function that has the expensive calculations with `useMemo`, so that when the dependencies are unchanged, the calculation of the expensive function is skipped.

In the example below, the function `getVisibleTodos` runs only when either one of the dependencies, i.e., `todos` or `tab` change, and the memoized value gets stored in `visibleTodos`.

``` js {4}
//...
const [todos, setTodos] = useState(createInitialTodos);
const [tab, setTab] = useState("all");
const visibleTodos = useMemo(() => getVisibleTodos(todos, tab), [todos, tab]);

function getVisibleTodos(todos, tab) {
  console.log("Running getVisibleTodos for " + todos.length + " todos");
  return todos.filter((t) => {
    if (tab === "completed") {
      return t.completed;
    }
    return true;
  });
}

//...

```

### Skip re-render of components {/*skip-re-render-of-components*/}

Often you would want to skip re-render of components when not necessary.

`useMemo` helps in skipping the re-render of the components. Avoiding component re-renders can boost the overall performance.

The example below shows that the `TodoList` component is rendered every time there is a change in the `input` field. Also, `visibleTodos` are calculated on every render, and the change in the input should ideally not effect the `visibleTodos`.

```js {30-31,53-57,60}
import React, { useState, useCallback } from "react";
import TodoList from "./TodolistComponent";

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: "Item " + (i + 1),
      completed: false
    });
  }
  return initialTodos;
}

function getVisibleTodos(todos, tab) {
  console.log("Running getVisibleTodos for " + todos.length + " todos");
  return todos.filter((t) => {
    if (tab === "completed") {
      return t.completed;
    }

    return true;
  });
}

export default function App() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [tab, setTab] = useState("all");
  const [draft, setDraft] = useState("");
  const visibleTodos = getVisibleTodos(todos, tab);

  const toggleTodo = useCallback((id) => {
    setTodos((todos) =>
      todos.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            completed: !t.completed
          };
        } else {
          return t;
        }
      })
    );
  }, []);

  return (
    <>
      <button onClick={() => setTab("all")}>All</button>
      <button onClick={() => setTab("completed")}>Completed</button>
      <hr />
      <input
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
        }}
      />
      <hr />
      <TodoList visibleTodos={visibleTodos} toggleTodo={toggleTodo} />
    </>
  );
}
```

Wrap the `getVisibleTodos` in the useMemo hook to avoid re-rendering the `TodoList` component.

```js {7}
//...

export default function App() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [tab, setTab] = useState("all");
  const [draft, setDraft] = useState("");
  const visibleTodos = useMemo(() => getVisibleTodos(todos, tab), [todos, tab]);

  //...

```
To verify whether the `TodoList` is re-rendering on each stroke of input, check the console logs.

<Recipes titleText="Example of skipping expensive recalculation and re-render of components" titleId="examples-skiprecal">

### A todolist {/*a-todolist*/}

The following example uses a combination of hooks such as `useState`, `useCallback`, and `useMemo`. `todos`, `tab`, and `draft` are state variables used to track and set the state.

Here, there are two tabs named `All` and `Completed`. The todolist is populated in the `All` tab initially. When a todo item is checked as completed, that item can now be listed in the `Completed` tab.

Using `useMemo` hook you can skip the expensive recalculation of `getVisibleTodos` function. Also, it skips the re-render of the components when you enter something in the input field.

<Sandpack>

```js App.js {3,4}

import React, { useState, useMemo, useCallback } from "react";
import TodoList from './TodolistComponent';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: "Item " + (i + 1),
      completed: false
    });
  }
  return initialTodos;
}

function getVisibleTodos(todos, tab) {
  console.log("Running getVisibleTodos for " + todos.length + " todos");
  return todos.filter((t) => {
    if (tab === "completed") {
      return t.completed;
    }
    return true;
  });
}

export default function App() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [tab, setTab] = useState("all");
  const [draft, setDraft] = useState("");
  const visibleTodos = useMemo(() => getVisibleTodos(todos, tab), [todos, tab]);

  const toggleTodo = useCallback((id) => {
    setTodos((todos) =>
      todos.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            completed: !t.completed
          };
        } else {
          return t;
        }
      })
    );
  }, []);

  return (
    <>
      <button onClick={() => setTab("all")}>All</button>
      <button onClick={() => setTab("completed")}>Completed</button>
      <hr />
      <input
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
        }}
      />
      <hr />
      <TodoList visibleTodos={visibleTodos} toggleTodo={toggleTodo} />
    </>
  );
}

```
```js TodolistComponent.js

import { memo } from "react";

export default function TodoList({ visibleTodos, toggleTodo }) {
    console.log("TodoList re-render");
    return (
      <ul>
        {visibleTodos.map((item) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={(e) => {
                  toggleTodo(item.id);
                }}
              />
              {item.text}
            </label>
          </li>
        ))}
      </ul>
    );
  }
  TodoList = memo(TodoList);

```

</Sandpack>

<Solution />

</Recipes>

<DeepDive title="Pros and Cons of using `useMemo`">
Pros

`useMemo` only recomputes the memoized value when one of the dependencies has changed. So, re-computing an expensive function on every render is unnecessary.

Cons

Every time a component is rendered:
* an extra call is made to `useMemo`, thus creating performance overhead
* memory gets allocated to hold the memoized variable value, thus creating memory overhead

</DeepDive>


## Reference {/*reference*/}

### `useMemo(() => computeExpensiveValue(a, b), [a, b])` {/*usememo*/}

Call `useMemo` at the top level of your component to declare one or more memoized variables.

```js
import {useMemo} from 'react';
  // ...
```

#### Parameters {/*parameters*/}

* `computeExpensiveValue`: The parameter is the expensive computational function that requires memoization.

* `[a,b]`: This value represents the dependency on which the recompute of the `computeExpensiveValue` rests. There can be an array of dependencies or a single value.

#### Returns {/*returns*/}

`useMemo` returns a value or object depending on the computed value:


## Troubleshooting {/*troubleshooting*/}

### Every time my component renders `useMemo` is triggered {/*every-time-my-component-renders-useMemo-is-triggered*/}

`useMemo` calculates the expensive function on each render when:

1. you have dependencies that change on each render. To debug the issue, `console.log` the dependencies and check if they are changing or remain same on every render.


2. you might have missed specifying the dependencies with `useMemo`, which forces the memoized value to be recalculated every time.

```js {11}
// 🚩 Doesn't work: no dependencies

import React, {useState, UseMemo, useEffect} from 'react'

export default function App(){

const[count, setCount] = useState(0)

const[fontcolor, setFontColor] = useState(true)

const changedCount = useMemo(()=> { return someExpensiveFunction(count)}, [])

//...
```
