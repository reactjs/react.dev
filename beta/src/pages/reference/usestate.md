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

<Recipes titleText="Common useState examples" titleId="examples-common">

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


### Form (object) {/*form-object*/}

In this example, the `form` state variable holds an object. Each input has a change handler that calls `setForm` with the next state of the entire form. The `{ ...form }` spread syntax ensures that [the state object is replaced rather than mutated.](/learn/updating-objects-in-state)

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

In this example, the `todos` state variable holds an array. Each button handler calls `setTodos` with the next version of that array. The `[...todos]` spread syntax, `todos.map()` and `todos.filter()` ensure [the state array is replaced rather than mutated.](/learn/updating-arrays-in-state)

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

## Special cases {/*special-cases*/}

### Passing the same value to `setState` {/*passing-the-same-value-to-setstate*/}

If you pass the current state to `setState`, React **will skip re-rendering the component and its children**:

```js
setCount(count); // Won't trigger a re-render
```

React uses the [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) algorithm to compare the values.

This is a performance optimization. React might still need to call your component function in some cases, but it will discard the result and bail out of re-rendering the child tree if the state has not changed.

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

This is useful when you want to update state based on the state _you have just set_ (like `123` above) and that has not yet been reflected to the screen. By using updaters, you can [queue multiple updates](/learn/queueing-a-series-of-state-updates) on top of each other:

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

React puts the updater functions in a queue and runs them during the next render. You can think of a regular `setState(something)` call as a `setState(() => something)` call where the pending state is not used.

<Note>

**Updaters need to be [pure functions that only calculate and return the next state](/learn/keeping-components-pure).** Don't "do" things or set state from the updater functions. React runs updater functions **twice in development only** in Strict Mode to stress-test them. This shouldn't affect pure functions, so it helps find accidental impurities.

</Note>

<DeepDive title="Is using an updater always preferred?">

You might hear a recomendation to always write code like `setCount(c => c + 1)` if the state you're setting is calculated from the previous state. There is no harm in it, but it is also not always necessary.

In most cases, there is no difference between these two approaches. React always makes sure that for intentional user actions, like clicks, the `count` state variable would be updated before the next click. This means there is no risk of a click handler seeing a "stale" `count` at the beginning of the event handler.

However, if you do multiple updates within the same event, updaters can be helpful. They're also helpful if accessing the state variable itself is inconvenient (you might run into this when optimizing re-renders).

If you prefer consistency over slightly more verbose syntax, it's reasonable to always write an updater if the state you're setting is calculated from the previous state. If it's calculated from the previous state of some *other* state variable, you might want to combine them into one object and [use a reducer](/learn/extracting-state-logic-into-a-reducer).

</DeepDive>

### Passing an initializer to `useState` {/*passing-an-initializer-to-usestate*/}

The initial state that you pass to `useState` is only used for the initial render. For the next renders, this argument is ignored. If creating the initial state is expensive, it is wasteful to create and throw it away many times. **You can pass a function to `useState` to calculate the initial state.** React will only run it during the initialization.

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

This is a performance optimization. Initializers let you avoid creating large objects or arrays on re-renders.

<Note>

**Initializers need to be [pure functions that only calculate and return the initial state](/learn/keeping-components-pure).** Don't "do" things or set state from the initializer functions. React runs initializer functions **twice in development only** in Strict Mode to stress-test them. This shouldn't affect pure functions, so it helps find accidental impurities.

</Note>

<Recipes titleText="Special useState examples" titleId="examples-special">

### Passing an updater to setState {/*passing-an-updater-to-setstate*/}

In this example, the `increment` method increments the counter with `setNumber(n => n + 1)`. Verify both "+3" and "+1" buttons work. The "+3" button calls `increment()` three times, which enqueues three separate state updates to the `number`:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  function increment() {
    setNumber(n => n + 1)
  }

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => increment()}>
        +1
      </button>
    </>
  );
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Notice how if you change the code to `setNumber(number + 1)`, the "+3" button no longer works. This is because `number` [always refers to what's currently on the screen](/learn/state-as-a-snapshot). When you call `setNumber(number + 1)`, `number` stays the same until the next render.

<Solution />

### Passing an initializer to useState {/*passing-an-initializer-to-usestate*/}

In this example, the initial state is populated with an array. Recreating this array during every render would be wasteful, so we pass a function to `useState`. React calls the initializer to figure out what the initial state should be, and puts it in `todos`.

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

<Solution />

### Preventing re-renders with same state {/*preventing-re-renders-with-same-state*/}

In this example, the two buttons switch the `tab` state between `'home'` and `'about'`. This sandbox has a logging utility function that helps us visualize what React is doing. Initially, React renders the Home tab. (Double renders are due to [Strict Mode](/reference/strictmode).)

If you press "Home" _again_, neither the Home component nor its children will re-render. This is because you're calling `setTab('home')` but `tab` is already `'home'`. That's the special behavior of `setState` when the value is the same.

<Sandpack>

```js
import { useState } from 'react';

export default function MySite() {
  const [tab, setTab] = useState('home');
  debugLog('rendered MySite');

  return (
    <>
      <nav>
        <button onClick={() => setTab('home')}>
          Home
        </button>
        <button onClick={() => setTab('about')}>
          About
        </button>
      </nav>
      {tab === 'home' && <Home />}
      {tab === 'about' && <About />}
    </>
  );
}

function Home() {
  debugLog('rendered Home');
  return <h1>Home sweet home</h1>
}

function About() {
  debugLog('rendered About');
  return <h1>About me</h1>
}

function debugLog(text) {
  const message = document.createElement('p');
  message.textContent = text;
  message.style.fontFamily = 12;
  message.style.color = 'grey';
  document.body.appendChild(message);
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

You'll notice that if you switch to About and then press About again, you might get an extra log of the parent component render. React may still need to call the parent component in some cases, but it won't re-render any of the children.

<Solution />

</Recipes>
