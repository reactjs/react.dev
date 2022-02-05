---
title: useState
---

<Intro>

`useState` is a React Hook that lets you add a [state variable](/learn/state-a-components-memory) to your component.

</Intro>

## On this page {/*on-this-page*/}

- [Reference](#reference)
  - [`useState(initialState)`](#usestate)
  - [`set` functions, like `setSomething(nextState)`](#setstate)
- [Usage](#usage)
  - [Adding state to a component](#adding-state-to-a-component)
  - [Updating state based on the previous state](#updating-state-based-on-the-previous-state)
  - [Updating objects and arrays in state](#updating-objects-and-arrays-in-state)
  - [Avoiding recreating the initial state](#avoiding-recreating-the-initial-state)
  - [Resetting state with a key](#resetting-state-with-a-key)
  - [Storing information from previous renders](#storing-information-from-previous-renders)

## Reference {/*reference*/}

### `useState(initialState)` {/*usestate*/}

Call `useState` at the top level of your component to declare a [state variable](/learn/state-a-components-memory).

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

The convention is to name state variables like `[something, setSomething]` using [array destructuring](/learn/a-javascript-refresher#array-destructuring).

[See more examples below.](#examples-basic)

#### Arguments {/*arguments*/}

* `initialState`: The value you want the state to be initially. It can be a value of any type, but there is a special behavior for functions. This argument is ignored after the initial render.
  * If you pass a function as `initialState`, it will be treated as an _initializer function_. It should be pure, should take no arguments, and should return a value of any type. React will call your initializer function when initializing the component, and store its return value as the initial state. [See an example below.](#avoiding-recreating-the-initial-state)

#### Returns {/*returns*/}

`useState` returns an array with exactly two values:

1. The current state. During the first render, it will match the `initialState` you have passed.
2. The [`set` function](#setstate) that lets you update the state to a different value and trigger a re-render.

#### Caveats {/*caveats*/}

* `useState` is a Hook, so you can only call it at the top level of your component or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a new component and move the state there.
* In Strict Mode, React will call your initializer function twice in order to help you find accidental impurities. This is development-only behavior and does not affect production. If your initializer function is pure (as it should be), this should not affect the logic of your component. The result from one of the calls will be ignored.

---

### `set` functions, like `setSomething(nextState)` {/*setstate*/}

The `set` function returned by `useState` lets you update the state to a different value and trigger a re-render. You can pass the next state directly, or a function that calculates it from the previous state:

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### Arguments {/*setstate-arguments*/}

* `nextState`: The value that you want the state to be. It can be a value of any type, but there is a special behavior for functions.
  * If you pass a function as `nextState`, it will be treated as an _updater function_. It must be pure, should take the pending state as its only argument, and should return the next state. React will put your updater function in a queue and re-render your component. During the next render, React will calculate the next state by applying all of the queued updaters to the previous state. [See an example below.](#updating-state-based-on-the-previous-state)

#### Returns {/*setstate-returns*/}

`set` functions do not have a return value.

#### Caveats {/*caveats*/}

* The `set` function only updates the state variable for the next render. If you read the state variable after calling the `set` function, you will still get the value that was on the screen before your call.

* If the new value you provide is identical to the current `state`, as determined by an [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison, React will bail out of re-rendering the component and its children. However, in some cases React may still need to call your component before discarding the result.

* Calling the `set` function *during rendering* is only allowed from within the currently rendering component. React will discard its output and immediately attempt to render it again with the new state. React will do this in a loop until you either stop setting state, or do it too many times. This pattern is called "derived state". It is uncommon, but you can use it to store information from previous renders. [See an example below.](#storing-information-from-previous-renders)

* In Strict Mode, React will call your updater function twice in order to help you find accidental impurities. This is development-only behavior and does not affect production. If your updater function is pure (as it should be), this should not affect the logic of your component. The result from one of the calls will be ignored.

---

## Usage {/*usage*/}

### Adding state to a component {/*adding-state-to-a-component*/}

First, declare the state variables you need. Then, update them on interaction and display them in your JSX.

<APIAnatomy>

<AnatomyStep title="Declare a state variable">

Call `useState` and pass the initial state to it. React will store the state that you passed, and give it back to you.

</AnatomyStep>

<AnatomyStep title="Set state on interaction">

To change the state, call the state setter function with the next state value. React will put that value into state instead.

</AnatomyStep>

<AnatomyStep title="Render state in the UI">

Use the state in your JSX.

</AnatomyStep>

```js [[1, 4, "const [count, setCount] = useState(0);"], [2, 7, "setCount(count + 1);"], [3, 12, "count"]]
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

</APIAnatomy>

<Recipes titleText="Basic useState examples" titleId="examples-basic">

### Counter (number) {/*counter-number*/}

In this example, the `count` state variable holds a number. Clicking the button increments it.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

</Sandpack>

<Solution />

### Text field (string) {/*text-field-string*/}

In this example, the `text` state variable holds a string. When you type, `handleChange` reads the latest input value from the browser input DOM element, and calls `setText` to update the state. This allows you to display the current `text` below.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText('hello')}>
        Reset
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

### Checkbox (boolean) {/*checkbox-boolean*/}

In this example, the `liked` state variable holds a boolean. When you click the input, `setLiked` updates the `liked` state variable with whether the browser checkbox input is checked. The `liked` variable is used to render the text below the checkbox.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        I liked this
      </label>
      <p>You {liked ? 'liked' : 'did not like'} this.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

### Form (two variables) {/*form-two-variables*/}

You can declare more than one state variable in the same component. Each state variable is completely independent.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(28);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Happy birthday!
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

Read [state as a component's memory](/learn/state-a-components-memory) to learn more.

<Gotcha>

Calling the `set` function only [affects the next render](/learn/state-as-a-snapshot) and **does not change state in the running code**:

```js {3,4}
function handleClick() {
  console.log(count);  // 0
  setCount(count + 1); // Request a re-render with 1
  console.log(count);  // Still 0!
}
```

If you need the next state, you can save it in a variable before passing it to the `set` function.

</Gotcha>

---

### Updating state based on the previous state {/*updating-state-based-on-the-previous-state*/}

This code looks like it increments the counter three times, but it only increments once:

```js
const [count, setCount] = useState(0);

function handleClick() {
  setCount(count + 1); // setCount(0 + 1)
  setCount(count + 1); // setCount(0 + 1)
  setCount(count + 1); // setCount(0 + 1)
}
```

This is because calling `setCount` will not update the `count` until the next render, so each call becomes `setCount(0 + 1)`. **To make a series of state changes, each of which depends on the previous state,** pass an *updater function* to `setCount`. React will queue them and run them all to calculate state on next render.

<APIAnatomy>

<AnatomyStep title="You receive: Pending state">

You get the latest state with the previously queued updates applied to it. For example, if `count` was `0` and you call `setCount(c => c + 1)` three times in a row, then the pending `c` state will be `0` in the first updater, `1` in the second one, and `2` in the third one, and `3` is the final state.

</AnatomyStep>

<AnatomyStep title="You return: Next state">

You return the next state you want to see on the screen.

</AnatomyStep>

```js [[1, 3, "c", 0], [2, 3, "c + 1"], [1, 6, "c", 0], [2, 6, "c + 1"], [1, 9, "c", 0], [2, 9, "c + 1"]]
function handleClick() {
  // 0 => 1
  setCount(c => c + 1);

  // 1 => 2
  setCount(c => c + 1);

  // 2 => 3
  setCount(c => c + 1);
}
```

</APIAnatomy>

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1);
    console.log(count); // Still 0 until next render!
  }

  return (
    <>
      <h1>{count}</h1>
      <button onClick={handleClick}>+3</button>
    </>
  );
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Read [state as a snapshot](/learn/state-as-a-snapshot) and [queueing a series of state changes](/learn/queueing-a-series-of-state-updates) to learn more.

<Note>

**Updaters need to be [pure functions that only calculate and return the next state](/learn/keeping-components-pure).** Don't "do" things or set state from the updater functions. React runs updater functions **twice in development only** in Strict Mode to stress-test them. This shouldn't affect pure functions, so it helps find accidental impurities.

</Note>

<DeepDive title="Is using an updater always preferred?">

You might hear a recomendation to always write code like `setCount(c => c + 1)` if the state you're setting is calculated from the previous state. There is no harm in it, but it is also not always necessary.

In most cases, there is no difference between these two approaches. React always makes sure that for intentional user actions, like clicks, the `count` state variable would be updated before the next click. This means there is no risk of a click handler seeing a "stale" `count` at the beginning of the event handler.

However, if you do multiple updates within the same event, updaters can be helpful. They're also helpful if accessing the state variable itself is inconvenient (you might run into this when optimizing re-renders).

If you prefer consistency over slightly more verbose syntax, it's reasonable to always write an updater if the state you're setting is calculated from the previous state. If it's calculated from the previous state of some *other* state variable, you might want to combine them into one object and [use a reducer](/learn/extracting-state-logic-into-a-reducer).

</DeepDive>

---


### Updating objects and arrays in state {/*updating-objects-and-arrays-in-state*/}

You can put objects and arrays into state. In React, state is considered read-only, so **you should *replace* it rather than *mutate* your existing objects**. For example, if you have a `form` object in state, don't update it like this:

```js
// Don't mutate an object in state like this:
form.firstName = 'Taylor';
```

Instead, replace the whole object by creating a new one:

```js
setForm({
  ...form,
  firstName: 'Taylor'
});
```

<Recipes titleText="Examples of objects and arrays in state" titleId="examples-objects">

### Form (object) {/*form-object*/}

In this example, the `form` state variable holds an object. Each input has a change handler that calls `setForm` with the next state of the entire form. The `{ ...form }` spread syntax ensures that the state object is replaced rather than mutated.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        First name:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Last name:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Email:
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

### List (array) {/*list-array*/}

In this example, the `todos` state variable holds an array. Each button handler calls `setTodos` with the next version of that array. The `[...todos]` spread syntax, `todos.map()` and `todos.filter()` ensure the state array is replaced rather than mutated.

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

</Recipes>

Read [updating objects in state](/learn/updating-objects-in-state) and [updating arrays in state](/learn/updating-arrays-in-state) to learn more.

---

### Avoiding recreating the initial state {/*avoiding-recreating-the-initial-state*/}

The initial state that you pass to `useState` is only used for the initial render. For the next renders, this argument is ignored. If creating the initial state is expensive, it is wasteful to create and throw it away on every render. To avoid this, **you can pass an *initializer function* to `useState`.** React will only run it during the initialization to calculate the initial state, but won't run it for re-renders. This is a performance optimization.

<APIAnatomy>

<AnatomyStep title="Initializing state with a value">

Most often, you will provide the initial state during render.

</AnatomyStep>

<AnatomyStep title="Initializing state with a function">

But you can also give React a function that calculates the initial state instead. React will only call that function when initializing the component, and won't call it again.

</AnatomyStep>

```js [[1, 2, "''"], [2, 5, "() => createInitialTodos()"]]
function TodoList() {
  const [text, setText] = useState('');

  const [todos, setTodos] = useState(
    () => createInitialTodos()
  );

  // ...
```

</APIAnatomy>

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item #' + i
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);

  return (
    <ul>
      {todos.map(item => (
        <li key={item.id}>
          {item.text}
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

<Note>

**Initializers need to be [pure functions that only calculate and return the initial state](/learn/keeping-components-pure).** Don't "do" things or set state from the initializer functions. React runs initializer functions **twice in development only** in Strict Mode to stress-test them. This shouldn't affect pure functions, so it helps find accidental impurities.

</Note>

---

### Resetting state with a key {/*resetting-state-with-a-key*/}

Typically, you might encounter the `key` attribute when [rendering lists](/learn/rendering-lists). However, it also serves another purpose.

You can **reset a component's state by passing a different `key` to a component.** In this example, the Reset button changes the `version` state variable, which we pass as a `key` to the `Form`. When the `key` changes, React re-creates the `Form` component (and all of its children) from scratch, so its state gets reset.

Read [preserving and resetting state](/learn/preserving-and-resetting-state) to learn more.

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Hello, {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### Storing information from previous renders {/*storing-information-from-previous-renders*/}

Usually, you will update state in event handlers. However, in rare cases you might want to adjust state in response to rendering -- for example, you might want to change a state variable when a prop changes.

In most cases, you don't need this:

* **If the value you need can be computed entirely from the current props or other state, [remove that redundant state altogether](/learn/choosing-the-state-structure#avoid-redundant-state).** If you're worried about recomputing too often, the [`useMemo` Hook](/apis/usememo) can help.
* If you want to reset the entire component tree's state, [pass a different `key` to your component.](#resetting-state-with-a-key)
* If you can, update all the relevant state in the event handlers.

In the rare case that none of these apply, there is a pattern you can use to update state based on the values that have been rendered so far, by calling a `set` function while your component is rendering.

Here's an example. This `CountLabel` component displays the `count` prop passed to it:

```js CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

Say you want to show whether the counter has *increased or decreased* since the last change. The `count` prop doesn't tell you this -- you need to keep track of its previous value. Add the `prevCount` state variable to track it. Add another state variable called `trend` to hold whether the count has increased or decreased. Compare `prevCount` with `count`, and if they're not equal, update both `prevCount` and `trend`. Now you can show both the current count prop and *how it has changed since the last render*.

<Sandpack>

```js App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```js CountLabel.js active
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

Note that if you call a `set` function while rendering, it must be inside a condition like `prevCount !== count`, and there must be a call like `setPrevCount(count)` inside of the condition. Otherwise, your component would re-render in a loop until it crashes. Also, you can only update the state of the *currently rendering* component like this. Calling the `set` function of *another* component during rendering is an error. Finally, your `set` call should still [update state without mutation](#updating-objects-and-arrays-in-state) -- this special case doesn't mean you can break other rules of [pure functions](/learn/keeping-components-pure).

This pattern can be hard to understand and is usually best avoided. However, it's better than updating state in an effect. When you call the `set` function during render, React will re-render that component immediately after your component exits with a `return` statement, and before rendering the children. This way, children don't need to render twice. The rest of your component function will still execute (and the result will be thrown away), but if your condition is below all the calls to Hooks, you may add `return null` inside it to restart rendering earlier.
