---
title: Extracting State Logic into a Reducer
---

<Intro>

Components with many state updates spread across many event handlers can get overwhelming. For these cases, you can consolidate all the state update logic outside your component in a single function, called a "reducer."

</Intro>

<YouWillLearn>

- What a reducer function is
- How to refactor `useState` to `useReducer`
- When to use a reducer
- How to write one well

</YouWillLearn>

## Consolidate state logic with a reducer {/*consolidate-state-logic-with-a-reducer*/}

As your components grow in complexity, it can get harder to see all the different ways that a component's state gets updated at a glance. For example, the `TaskBoard` component below holds an array of `tasks` in state and uses three different event handlers to add, remove, and edit tasks:

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskBoard() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([...tasks, {
      id: nextId++,
      text: text,
      done: false
    }]);
  }

  function handleChangeTask(task) {
    setTasks(tasks.map(t => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTask(taskId) {
    setTasks(
      tasks.filter(t => t.id !== taskId)
    );
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false },
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
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
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

Each of its event handlers calls `setTasks` in order to update the state. As this component grows, so does the amount of state logic sprinkled throughout it. To reduce this complexity and keep all your logic in one easy-to-access place, you can move that state logic into a single function outside your component, **called a "reducer."**

Reducers are a different way to handle state. You can migrate from `useState` to `useReducer` in three steps:

1. **Move** from setting state to dispatching actions.
2. **Write** a reducer function.
3. **Use** the reducer from your component.

### Step 1: Move from setting state to dispatching actions {/*step-1-move-from-setting-state-to-dispatching-actions*/}

Your event handlers currently specify *what to do* by setting state:

```js
function handleAddTask(text) {
  setTasks([...tasks, {
    id: nextId++,
    text: text,
    done: false
  }]);
}

function handleChangeTask(task) {
  setTasks(tasks.map(t => {
    if (t.id === task.id) {
      return task;
    } else {
      return t;
    }
  }));
}

function handleDeleteTask(taskId) {
  setTasks(
    tasks.filter(t => t.id !== taskId)
  );
}
```

Remove all the state setting logic. What you are left with are three event handlers:

* `handleAddTask(text)` is called when the user presses "Add".
* `handleChangeTask(task)` is called when the user toggles a task or presses "Save".
* `handleDeleteTask(taskId)` is called when the user presses "Delete".

Managing state with reducers is slightly different from directly setting state. Instead of telling React "what to do" by setting state, you specify "what the user just did" by dispatching "actions" from your event handlers. (The state update logic will live elsewhere!) So instead of "setting `tasks`" via event handler, you're dispatching an "added/removed/deleted a task" action. This is more descriptive of the user's intent.

```js
function handleAddTask(text) {
  dispatch({
    type: 'added',
    id: nextId++,
    text: text,
  });
}

function handleChangeTask(task) {
  dispatch({
    type: 'changed',
    task: task
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId
  });
}
```

The object you pass to `dispatch` is called an "action:"

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // "action" object:
    {
      type: 'deleted',
      id: taskId
    }
  );
}
```

It is a regular JavaScript object. You decide what to put in it, but generally it should contain the minimal information about *what happened*. (You will add the `dispatch` function itself in a later step.)

<Convention conventionFor="action objects">

An action object can have any shape. By convention, it is common to give it a string `type` that describes what happened, and pass any additional information in other fields. The `type` is specific to a component, so in this example either `'added'` or `'added_task'` would be fine. Choose a name that says what happened!

```js
dispatch({
  // specific to component
  type: 'what_happened',
  // other fields go here
});
```

</Convention>

### Step 2: Write a reducer function {/*step-2-write-a-reducer-function*/}

A reducer function is where you will put your state logic. It takes two arguments, the current state and the action object, and it returns the next state:

```js
function yourReducer(state, action) {
  // return next state for React to set
}
```

React will set the state to what you return from the reducer.

To move your state setting logic from your event handlers to a reducer function in this example, you will:

1. Declare the current state (`tasks`) as the first argument.
2. Declare the `action` object as the second argument.
3. Return the *next* state from the reducer (which React will set the state to).

Here is all the state setting logic migrated to a reducer function:

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [...tasks, {
      id: action.id,
      text: action.text,
      done: false
    }];
  } else if (action.type === 'changed') {
    return tasks.map(t => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter(t => t.id !== action.id);
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}
```

> Because the reducer function takes state (`tasks`) as an argument, you can **declare it outside of your component.** This decreases the indentation level and can make your code easier to read.

<Convention conventionFor="reducer functions">

The code above uses if/else statements, but it's a convention to use [switch statements](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch) inside reducers. The result is the same, but it can be easier to read switch statements at a glance. We'll be using them throughout the rest of this documentation like so:

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

We recommend to wrap each `case` block into the `{` and `}` curly braces so that variables declared inside of different `case`s don't clash with each other. Also, a `case` should usually end with a `return`. If you forget to `return`, the code will "fall through" to the next `case`, which can lead to mistakes!

If you're not yet comfortable with switch statements, using if/else is completely fine.

</Convention>


<DeepDive title="Why are reducers called this way?">

Although reducers can "reduce" the amount of code inside your component, they are actually named after the [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) operation that you can perform on arrays.

The `reduce()` operation lets you take an array and "accumulate" a single value out of many:

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

The function you pass to `reduce` is known as a "reducer". It takes the _result so far_ and the _current item,_ then it returns the _next result._ React reducers are an example of the same idea: they take the _state so far_ and the _action_, and return the _next state._ In this way, they accumulate actions over time into state.

You could even use the `reduce()` method with an `initialState` and an array of `actions` to calculate the final state by passing your reducer function to it:

<Sandpack>

```js index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  { type: 'added', id: 1, text: 'Visit Kafka Museum' },
  { type: 'added', id: 2, text: 'Watch a puppet show' },
  { type: 'deleted', id: 1 },
  { type: 'added', id: 3, text: 'Lennon Wall pic' },
];

let finalState = actions.reduce(
  tasksReducer,
  initialState
);

const output = document.getElementById('output');
output.textContent = JSON.stringify(
  finalState,
  null,
  2
);
```

```js tasksReducer.js
export default function tasksReducer(
  tasks,
  action
) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

You probably won't need to do this yourself, but this is similar to what React does!

</DeepDive>

### Step 3: Use the reducer from your component {/*step-3-use-the-reducer-from-your-component*/}

Finally, you need to hook up the `tasksReducer` to your component. Make sure to import the `useReducer` Hook from React:

```js
import { useReducer } from 'react';
```

Then you can replace `useState`:

```js
const [tasks, setTasks] = useState(initialTasks);
```

with `useReducer` like so:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

The `useReducer` Hook is similar to `useState`—you must pass it an initial state and it returns a stateful value and a way to set state (in this case, the dispatch function). But it's a little different.

The `useReducer` Hook takes two arguments: 

1. A reducer function
2. An initial state

And it returns:

1. A stateful value
2. A dispatch function (to "dispatch" user actions to the reducer)

Now it's fully wired up! Here, the reducer is declared at the bottom of the component file:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskBoard() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false }
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
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
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

If you want, you can even move the reducer to a different file:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

export default function TaskBoard() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>  
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false },
];
```

```js tasksReducer.js
export default function tasksReducer(
  tasks,
  action
) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
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
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

Component logic can be easier to read when you separate concerns like this. Now the event handlers only specify *what happened* by dispatching actions, and the reducer function determines *how the state updates* in response to them.

## Comparing `useState` and `useReducer` {/*comparing-usestate-and-usereducer*/}

Reducers are not without downsides! Here's a few ways you can compare them:

* **Code size:** Generally, with `useState` you have to write less code upfront. With `useReducer`, you have to write both a reducer function _and_ dispatch actions. However, `useReducer` can help cut down on the code if many event handlers modify state in a similar way.
* **Readability:** `useState` is very easy to read when the state updates are simple. When they get more complex, they can bloat your component's code and make it difficult to scan. In this case, `useReducer` lets you cleanly separate the *how* of update logic from the *what happened* of event handlers.
* **Debugging:** When you have a bug with `useState`, it can be difficult to tell _where_ the state was set incorrectly, and _why_. With `useReducer`, you can add a console log into your reducer to see every state update, and _why_ it happened (due to which `action`). If each `action` is correct, you'll know that the mistake is in the reducer logic itself. However, you have to step through more code than with `useState`.
* **Testing:** A reducer is a pure function that doesn't depend on your component. This means that you can export and test it separately in isolation. While generally it's best to test components in a more realistic environment, for complex state update logic it can be useful to assert that your reducer returns a particular state for a particular initial state and action.
* **Personal preference:** Some people like reducers, others don't. That's okay. It's a matter of preference. You can always convert between `useState` and `useReducer` back and forth: they are equivalent!

We recommend using a reducer if you often encounter bugs due to incorrect state updates in some component, and want to introduce more structure to its code. You don't have to use reducers for everything: feel free to mix and match! You can even `useState` and `useReducer` in the same component.

## Writing reducers well {/*writing-reducers-well*/}

Keep these two tips in mind when writing reducers:

* **Reducers must be pure.** Similar to [state updater functions](/learn/queueing-a-series-of-state-updates), reducers run during rendering! (Actions are queued until the next render.) This means that reducers [must be pure](/learn/keeping-components-pure)—same inputs always result in the same output. They should not send requests, schedule timeouts, or perform any side effects (operations that impact things outside the component). They should update [objects](/learn/updating-objects-in-state) and [arrays](/learn/updating-arrays-in-state) without mutations.
* **Actions describe "what happened," not "what to do."** For example, if a user presses "Reset" on a form with five fields managed by a reducer, it makes more sense to dispatch one `reset_form` action rather than five separate `set_field` actions. If you log every action in a reducer, that log should be clear enough for you to reconstruct what interactions or responses happened in what order. This helps with debugging!

## Writing concise reducers with Immer {/*writing-concise-reducers-with-immer*/}

Just like with [updating objects](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) and [arrays](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer) in regular state, you can use the Immer library to make reducers more concise. Here, [`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) lets you mutate the state with `push` or `arr[i] =` assignment:

<Sandpack>

```js App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex(t =>
        t.id === action.task.id
      );
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskBoard() {
  const [tasks, dispatch] = useImmerReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false },
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
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
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Reducers must be pure, so they shouldn't mutate state. But Immer provides you with a special `draft` object which is safe to mutate. Under the hood, Immer will create a copy of your state with the changes you made to the `draft`. This is why reducers managed by `useImmerReducer` can mutate their first argument and don't need to return state.

<Recap>

* To convert from `useState` to `useReducer`:
  1. Dispatch actions from event handlers.
  2. Write a reducer function that returns the next state for a given state and action.
  3. Replace `useState` with `useReducer`.
* Reducers require you to write a bit more code, but they help with debugging and testing.
* Reducers must be pure.
* Actions describe "what happened," not "what to do."
* Use Immer if you want to write reducers in a mutating style.

</Recap>



<Challenges>

### Dispatch actions from event handlers {/*dispatch-actions-from-event-handlers*/}

Currently, the event handlers in `ContactList.js` and `Chat.js` have `// TODO` comments. This is why typing into the input doesn't work, and clicking on the buttons doesn't change the selected recipient.

Replace these two `// TODO`s with the code to `dispatch` the corresponding actions. To see the expected shape and the type of the actions, check the reducer in `messengerReducer.js`. The reducer is already written so you won't need to change it. You only need to dispatch the actions in `ContactList.js` and `Chat.js`.

<Hint>

The `dispatch` function is already available in both of these components because it was passed as a prop. So you need to call `dispatch` with the corresponding action object.

To check the action object shape, you can look at the reducer and see which `action` fields it expects to see. For example, the `changed_selection` case in the reducer looks like this:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```

This means that your action object should have a `type: 'changed_selection'`. You also see the `action.contactId` being used, so you need to include a `contactId` property into your action.

</Hint>

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {
  initialState,
  messengerReducer
} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(
    messengerReducer,
    initialState
  );
  const message = state.message;
  const contact = contacts.find(c =>
    c.id === state.selectedId
  );
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello'
};

export function messengerReducer(
  state,
  action
) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: ''
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  dispatch,
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              // TODO: dispatch changed_selection
            }}>
              {selectedId === contact.id ? (
                <b>{contact.name}</b>
              ) : (
                contact.name
              )}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({
  contact,
  message,
  dispatch
}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={e => {
          // TODO: dispatch edited_message
          // (Read the input value from e.target.value)
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

From the reducer code, you can infer that actions need to look like this:

```js
// When the user presses "Alice"
dispatch({
  type: 'changed_selection',
  contactId: 1
});

// When user types "Hello!"
dispatch({
  type: 'edited_message',
  message: 'Hello!'
});
```

Here is the example updated to dispatch the corresponding messages:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {
  initialState,
  messengerReducer
} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(
    messengerReducer,
    initialState
  );
  const message = state.message;
  const contact = contacts.find(c =>
    c.id === state.selectedId
  );
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello'
};

export function messengerReducer(
  state,
  action
) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: ''
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  dispatch,
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              dispatch({
                type: 'changed_selection',
                contactId: contact.id
              });
            }}>
              {selectedId === contact.id ? (
                <b>{contact.name}</b>
              ) : (
                contact.name
              )}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({
  contact,
  message,
  dispatch
}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={e => {
          dispatch({
            type: 'edited_message',
            message: e.target.value
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

</Solution>

### Clear the input on sending a message {/*clear-the-input-on-sending-a-message*/}

Currently, pressing "Send" doesn't do anything. Add an event handler to the "Send" button that will:

1. Show an `alert` with the recipient's email and the message.
2. Clear the message input.

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {
  initialState,
  messengerReducer
} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(
    messengerReducer,
    initialState
  );
  const message = state.message;
  const contact = contacts.find(c =>
    c.id === state.selectedId
  );
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello'
};

export function messengerReducer(
  state,
  action
) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: ''
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  dispatch,
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              dispatch({
                type: 'changed_selection',
                contactId: contact.id
              });
            }}>
              {selectedId === contact.id ? (
                <b>{contact.name}</b>
              ) : (
                contact.name
              )}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import { useState } from 'react';

export default function Chat({
  contact,
  message,
  dispatch
}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={e => {
          dispatch({
            type: 'edited_message',
            message: e.target.value
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

There are a couple of ways you could do it in the "Send" button event handler. One approach is to show an alert and then dispatch an `edited_message` action with an empty `message`:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {
  initialState,
  messengerReducer
} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(
    messengerReducer,
    initialState
  );
  const message = state.message;
  const contact = contacts.find(c =>
    c.id === state.selectedId
  );
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello'
};

export function messengerReducer(
  state,
  action
) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: ''
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  dispatch,
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              dispatch({
                type: 'changed_selection',
                contactId: contact.id
              });
            }}>
              {selectedId === contact.id ? (
                <b>{contact.name}</b>
              ) : (
                contact.name
              )}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import { useState } from 'react';

export default function Chat({
  contact,
  message,
  dispatch
}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={e => {
          dispatch({
            type: 'edited_message',
            message: e.target.value
          });
        }}
      />
      <br />
      <button onClick={() => {
        alert(`Sending "${message}" to ${contact.email}`);
        dispatch({
          type: 'edited_message',
          message: '',
        });
      }}>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

This works and clears the input when you hit "Send."

However, *from the user's perspective*, sending a message is a different action than editing the field. To reflect that, you could instead create a *new* action called `sent_message`, and handle it separately in the reducer:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {
  initialState,
  messengerReducer
} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(
    messengerReducer,
    initialState
  );
  const message = state.message;
  const contact = contacts.find(c =>
    c.id === state.selectedId
  );
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js messengerReducer.js active
export const initialState = {
  selectedId: 0,
  message: 'Hello'
};

export function messengerReducer(
  state,
  action
) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: ''
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: ''
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  dispatch,
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              dispatch({
                type: 'changed_selection',
                contactId: contact.id
              });
            }}>
              {selectedId === contact.id ? (
                <b>{contact.name}</b>
              ) : (
                contact.name
              )}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import { useState } from 'react';

export default function Chat({
  contact,
  message,
  dispatch
}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={e => {
          dispatch({
            type: 'edited_message',
            message: e.target.value
          });
        }}
      />
      <br />
      <button onClick={() => {
        alert(`Sending "${message}" to ${contact.email}`);
        dispatch({
          type: 'sent_message',
        });
      }}>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

The resulting behavior is the same. But keep in mind that action types should ideally describe "what the user did" rather than "how you want the state to change". This makes it easier to later add more features.

With either solution, it's important that you **don't** place the `alert` inside a reducer. The reducer should be a pure function--it should only calculate the next state. It should not "do" anything, including displaying messages to the user. That should happen in the event handler. (To help catch mistakes like this, React will call your reducers multiple times in Strict Mode. This is why, if you put an alert in a reducer, it fires twice.)

</Solution>

### Restore input values when switching between tabs {/*restore-input-values-when-switching-between-tabs*/}

In this example, switching between different recipients always clears the text input:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // Clears the input
  };
```

This is because you don't want to share a single message draft between several recipients. But it would be better if your app "remembered" a draft for each contact separately, restoring them when you switch contacts.

Your task is to change the way the state is structured so that you remember a separate message draft *per contact*. You would need to make a few changes to the reducer, the initial state, and the components.

<Hint>

You can structure your state like this:

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor', // Draft for contactId = 0
    1: 'Hello, Alice' // Draft for contactId = 1
  }
};
```

The `[key]: value` [computed property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names) syntax can help you update the `messages` object:

```js
{
  ...state.messages,
  [id]: message
}
```

</Hint>

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {
  initialState,
  messengerReducer
} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(
    messengerReducer,
    initialState
  );
  const message = state.message;
  const contact = contacts.find(c =>
    c.id === state.selectedId
  );
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello'
};

export function messengerReducer(
  state,
  action
) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: ''
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: ''
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  dispatch,
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              dispatch({
                type: 'changed_selection',
                contactId: contact.id
              });
            }}>
              {selectedId === contact.id ? (
                <b>{contact.name}</b>
              ) : (
                contact.name
              )}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({
  contact,
  message,
  dispatch
}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={e => {
          dispatch({
            type: 'edited_message',
            message: e.target.value
          });
        }}
      />
      <br />
      <button onClick={() => {
        alert(`Sending "${message}" to ${contact.email}`);
        dispatch({
          type: 'sent_message',
        });
      }}>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

You'll need to update the reducer to store and update a separate message draft per contact:

```js
// When the input is edited
case 'edited_message': {
  return {
    // Keep other state like selection
    ...state,
    messages: {
      // Keep messages for other contacts
      ...state.messages,
      // But change the selected contact's message
      [state.selectedId]: action.message
    }
  };
}
```

You would also update the `Messenger` component to read the message for the currently selected contact:

```js
const message = state.messages[state.selectedId];
```

Here is the complete solution:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {
  initialState,
  messengerReducer
} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(
    messengerReducer,
    initialState
  );
  const message = state.messages[state.selectedId];
  const contact = contacts.find(c =>
    c.id === state.selectedId
  );
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob'
  }
};

export function messengerReducer(
  state,
  action
) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message
        }
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: ''
        }
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  dispatch,
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              dispatch({
                type: 'changed_selection',
                contactId: contact.id
              });
            }}>
              {selectedId === contact.id ? (
                <b>{contact.name}</b>
              ) : (
                contact.name
              )}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({
  contact,
  message,
  dispatch
}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={e => {
          dispatch({
            type: 'edited_message',
            message: e.target.value
          });
        }}
      />
      <br />
      <button onClick={() => {
        alert(`Sending "${message}" to ${contact.email}`);
        dispatch({
          type: 'sent_message',
        });
      }}>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Notably, you didn't need to change any of the event handlers to implement this different behavior. Without a reducer, you would have to change every event handler that updates the state.

</Solution>

### Implement `useReducer` from scratch {/*implement-usereducer-from-scratch*/}

In the earlier examples, you imported the `useReducer` Hook from React. This time, you will implement *the `useReducer` Hook itself!* Here is a stub to get your started. It shouldn't take more than 10 lines of code.

To test your changes, try typing into the input or select a contact.

<Hint>

Here is a more detailed sketch of the implementation:

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ???
  }

  return [state, dispatch];
}
```

Recall that a reducer function takes two arguments--the current state and the action object--and it returns the next state. What should your `dispatch` implementation do with it?

</Hint>

<Sandpack>

```js App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {
  initialState,
  messengerReducer
} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(
    messengerReducer,
    initialState
  );
  const message = state.messages[state.selectedId];
  const contact = contacts.find(c =>
    c.id === state.selectedId
  );
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob'
  }
};

export function messengerReducer(
  state,
  action
) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message
        }
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: ''
        }
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```

```js ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  dispatch,
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              dispatch({
                type: 'changed_selection',
                contactId: contact.id
              });
            }}>
              {selectedId === contact.id ? (
                <b>{contact.name}</b>
              ) : (
                contact.name
              )}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js hidden
import { useState } from 'react';

export default function Chat({
  contact,
  message,
  dispatch
}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={e => {
          dispatch({
            type: 'edited_message',
            message: e.target.value
          });
        }}
      />
      <br />
      <button onClick={() => {
        alert(`Sending "${message}" to ${contact.email}`);
        dispatch({
          type: 'sent_message',
        });
      }}>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Dispatching an action calls a reducer with the current state and the action, and stores the result as the next state. This is what it looks like in code:

<Sandpack>

```js App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {
  initialState,
  messengerReducer
} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(
    messengerReducer,
    initialState
  );
  const message = state.messages[state.selectedId];
  const contact = contacts.find(c =>
    c.id === state.selectedId
  );
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob'
  }
};

export function messengerReducer(
  state,
  action
) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message
        }
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: ''
        }
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

```js ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  dispatch,
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              dispatch({
                type: 'changed_selection',
                contactId: contact.id
              });
            }}>
              {selectedId === contact.id ? (
                <b>{contact.name}</b>
              ) : (
                contact.name
              )}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js hidden
import { useState } from 'react';

export default function Chat({
  contact,
  message,
  dispatch
}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={e => {
          dispatch({
            type: 'edited_message',
            message: e.target.value
          });
        }}
      />
      <br />
      <button onClick={() => {
        alert(`Sending "${message}" to ${contact.email}`);
        dispatch({
          type: 'sent_message',
        });
      }}>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Though it doesn't matter in most cases, a slightly more accurate implementation looks like this:

```js
function dispatch(action) {
  setState(s => reducer(s, action));
}
```

This is because the dispatched actions are queued until the next render, [similar to the updater functions](/learn/queueing-a-series-of-state-updates).

</Solution>

</Challenges>