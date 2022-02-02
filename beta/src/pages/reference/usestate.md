---
title: useState()
---

<Intro>

The `useState` Hook lets your component ["remember" information that changes over time](/learn/state-a-components-memory) (called state). It returns two values: the current state, and the function that lets you update it.

```js
const [state, setState] = useState(initialState);
```

</Intro>

## Declaring a state variable {/*declaring-a-state-variable*/}

You can declare one or more [state variables](/learn/state-a-components-memory) at the top level of your component:

<APIAnatomy>

<AnatomyStep title="You pass: Initial state">

Pass any value that you want the state to be initially.

<small>You can also pass an <a href="#passing-an-initializer-to-usestate">initializer function</a>.</small>

</AnatomyStep>

<AnatomyStep title="You get: Current state">

This is the current state value that you can display in JSX.

</AnatomyStep>

<AnatomyStep title="You get: State setter">

This is the function that lets you update the state later.

</AnatomyStep>

```js [[2, 4, "name"], [3, 4, "setName"], [1, 4, "'Taylor'"], [2, 6, "age"], [3, 6, "setAge"], [1, 6, "28"]]
import { useState } from 'react';

function Form() {
  const [name, setName] = useState('Taylor');

  const [age, setAge] = useState(28);

  // ...
```

</APIAnatomy>

This `[` and `]` syntax is called [array destructuring](/learn/a-javascript-refresher#array-destructuring) and it lets you read values from an array. The array returned by `useState` always has exactly two items--it's a pair. By convention, name them like `[thing, setThing]`.

## Using state {/*using-state*/}

First, declare the state variables you need. Then, update them on interaction and display them in your JSX:

<APIAnatomy>

<AnatomyStep title="Declare a state variable">

Call `useState` and pass the initial state to it. React will store the state that you passed, and give it back to you.

</AnatomyStep>

<AnatomyStep title="Set state on interaction">

To change the state, call the state setter function with the next state value. React will put that value into state instead.

<small>You can also pass an <a href="#passing-a-state-updater-to-setstate">updater function</a>.</small>

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

<Recipes>

### Text field (string) {/*text-field-string*/}

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
    </>
  );
}
```

</Sandpack>

<Solution />

### Checkbox (boolean) {/*checkbox-boolean*/}

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

### Form (object) {/*form-object*/}

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
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

### Multiple state variables {/*multiple-state-variables*/}

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

</Sandpack>

<Solution />

</Recipes>

<Gotcha>

Calling `setState` [only affects the next render](/learn/state-as-a-snapshot) and **does not change state in the already running code:**

```js {4}
function handleClick() {
  console.log(count);  // 0
  setCount(count + 1); // Request a re-render with 1
  console.log(count);  // Still 0!
}
```

</Gotcha>

## When not to use it {/*when-not-to-use-it*/}

* Don't use state when a regular variable works. State is only used to [persist information between re-renders](/learn/state-a-components-memory).
* Don't add [redundant state](/learn/choosing-the-state-structure#avoid-redundant-state). If you can calculate something during render, you don't need state for it.

## Special cases {/*special-cases*/}

### Passing the same value to `setState` {/*passing-the-same-value-to-setstate*/}

If you pass the current state to `setState`, React **will skip re-rendering the component**:

```js
setCount(count); // Won't trigger a re-render
```

This is a performance optimization. React uses the [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) algorithm to compare the values.


### Updating objects and arrays in state {/*updating-objects-and-arrays-in-state*/}

You can hold objects and arrays in state, too. However, you should always *replace* objects in state rather than modify the existing ones. [Updating objects](/learn/updating-objects-in-state) and [updating arrays](/learn/updating-arrays-in-state) describe common patterns that help avoid bugs.

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  )
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

### Passing a state updater to `setState` {/*passing-a-state-updater-to-setstate*/}

Instead of passing the next state, **you may pass a function to `setState`.** Such a function, like `c => c + 1` in this example, is called an "updater". React will call your updater during the next render to calculate the final state.

<APIAnatomy>

<AnatomyStep title="Setting state with next value">

Usually, when you set state, you replace it.

</AnatomyStep>

<AnatomyStep title="Setting state with an updater">

But you can pass an updater function to transform it.

</AnatomyStep>

```js [[1, 2, "123"], [2, 4, "c => c + 1"]]
function handleClick() {
  setCount(123);

  setCount(c => c + 1); // Result: 124
}
```

</APIAnatomy>

Your updater function will receive the pending state and should return the next state.

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

Updaters are a bit verbose but sometimes they come in handy. They let you access the pending state rather than the last rendered state. This is helpful if you want to [queue multiple updates](/learn/queueing-a-series-of-state-updates) on top of each other.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1);
  }

  return (
    <>
      <h1>{count}</h1>
      <button onClick={handleClick}>
        Add 3
      </button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Updater functions run during rendering. This is why [they should be pure](/learn/keeping-components-pure). In other words, your **updater functions should only calculate and return the next state**. They should not try to "do" things or set state.

If you don't have a particular reason to use an updater, you can stick with passing the next state directly.

<Gotcha>

Because `setState()` acts differently when you pass a function, you can't put a function in state like this:

```js
const [func, setFunc] = useState(initialFunc);

function handleClick() {
  setFunc(otherFunc);
}
```

If you really need to put a function in state (which is rare), you can do this instead:

```js
const [func, setFunc] = useState(() => initialFunc);

function handleClick() {
  setFunc(() => otherFunc);
}
```

</Gotcha>

### Passing an initializer to `useState` {/*passing-an-initializer-to-usestate*/}

The initial state that you pass to `useState` is only used for the initial render. For next renders, this argument is ignored. If creating the initial state is expensive, it is wasteful to create and throw it away many times. **You can pass a function to `useState` to calculate the initial state.** React will only run it during the initialization.


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

This is a performance optimization. You can use it to avoid creating large objects or arrays on re-renders.

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
  const [todos, setTodos] = useState(
    () => createInitialTodos()
  );

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

Initializer functions run during rendering. This is why [they should be pure](/learn/keeping-components-pure). In other words, your **initializer functions should only calculate and return the initial state**. They should not try to "do" things or set state.

If you don't have a particular reason to use an initializer, you can stick with passing the initial state directly.

