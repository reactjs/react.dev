---
title: Choosing the State Structure
---

<Intro>

Structuring state well can make a difference between a component that is pleasant to modify and debug, and one that is a constant source of bugs. Here are some tips you should consider when structuring state.

</Intro>

<YouWillLearn>

* When to use a single vs multiple state variables
* What to avoid when organizing state
* How to fix common issues with the state structure

</YouWillLearn>

## Principles for structuring state

When you write a component that holds some state, you'll have to make choices about how many state variables to use and what the shape of their data should be. While it's possible to write correct programs even with a suboptimal state structure, there are a few principles that can guide you to make better choices:

1. **Group related state.** If you always update two or more state variables at the same time, consider merging them into a single state variable.
2. **Avoid contradictions in state.** When the state is structured in a way that several pieces of state may contradict and "disagree" with each other, you leave room for mistakes. Try to avoid this.
3. **Avoid redundant state.** If you can calculate some information from the component's props or its existing state variables during rendering, you should not put that information into that component's state.
4. **Avoid duplication in state.** When the same data is duplicated between multiple state variables, or within nested objects, it is difficult to keep them in sync. Reduce duplication when you can.
5. **Avoid deeply nested state.** Deeply hierarchical state is not very convenient to update. When possible, prefer to structure state in a flat way.

The goal behind these principles is to *make state easy to update without introducing mistakes*. Removing redundant and duplicate data from state helps ensure that different pieces of it don't get out of sync. This is similar to how a database engineer might want to ["normalize" the database structure](https://docs.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description) to reduce the chance of bugs. To paraphrase Albert Einstein, **"Make your state as simple as it can be--but no simpler."**

Now let's see how these principles apply in action.

## Group related state

You might sometimes be unsure between using a single or multiple state variables.

Should you do this?

```js
const [x, setX] = useState(0);
const [y, setY] = useState(0);
```

Or this?

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Technically, you can use either of these approaches. But **if some two state variables always change together, it might be a good idea to unify them into a single state variable**. Then you won't forget to always keep them in sync, like in this example where hovering updates both of the red dot's coordinates:

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

Another case where you'll group data into an object or an array is when you don't know how many different pieces of state you'll need. For example, it's helpful when you have a form where the user can add custom fields.

<Gotcha>

If your state variable is an object, remember that you can't update only one field in it without explicitly copying the other fields. For example, you can't do `setPosition({ x: 100 })` in the above example because it would not have the `y` property at all! Instead, if you wanted to set `x` alone, you would either do `setPosition({ ...position, x: 100 })` or you would need to split them into two state variables, and do `setX(100)`.

</Gotcha>

## Avoid contradictions in state

Here is a form with `isSending` and `isSent` state variables:

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);
    await sendMessage(text);
    setIsSending(false);
    setIsSent(true);
  }

  if (isSent) {
    return <h1>Sent!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        type="submit"
      >
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

// Pretend to send a message.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

While this code works, it leaves the door open for "impossible" states. For example, if you forget to call `setIsSent` and `setIsSending` together, you may end up in a situation where both `isSending` and `isSent` are `true` at the same time. The more complex your component is, the harder it will be to understand what happened.

**Since `isSending` and `isSent` should never be `true` at the same time, it is better to replace them with one `status` state variable that may take one of *three* valid states:** `'typing'` (initial), `'sending'`, and `'sent'`:

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('typing');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    await sendMessage(text);
    setStatus('sent');
  }

  const isSending = status === 'sending';
  const isSent = status === 'sent';

  if (isSent) {
    return <h1>Sent!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        type="submit"
      >
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

// Pretend to send a message.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

You can still declare some constants for readability:

```js
const isSending = status === 'sending';
const isSent = status === 'sent';
```

But they're not state variables, so you don't need to worry about them getting out of sync with each other.


## Avoid redundant state

If you can calculate some information from the component's props or its existing state variables during rendering, you **should not** put that information into that component's state.

For example, take this form. It works, but can you find any redundant state in it?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <h3>
        Your full name is: {fullName}
      </h3>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

This form has three state variables: `firstName`, `lastName`, and `fullName`. However, `fullName` is redundant. **You can always calculate `fullName` from `firstName` and `lastName` during render, so remove it from state.**

This is how you can do it:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <h3>
        Your full name is: {fullName}
      </h3>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Here, `fullName` is *not* a state variable. Instead, it's calculated during render:

```js
const fullName = firstName + ' ' + lastName;
```

As a result, the change handlers don't need to do anything special to update it. When you call `setFirstName` or `setLastName`, you trigger a re-render, and then the next `fullName` will be calculated from the fresh data.

<DeepDive title="Don't mirror props in state">

A common example of redundant state is code like this:

```js
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
```

Here, a `color` state variable is initialized to the `messageColor` prop. The problem with this code is that **if the parent component passes a different value of `messageColor` later (for example, changing it from `'blue'` to `'red'`), the `color` *state variable* would not be updated!** The state is only initialized during the first render.

This is why "mirroring" some prop in a state variable like this can lead to confusion. Instead, use the `messageColor` prop directly in your code. If you want to give it a shorter name inside your component, use a regular constant:

```js
function Message({ messageColor }) {
  const color = messageColor;
```

This way it won't get out of sync with the prop passed from the parent component.

"Mirroring" props into state only makes sense when you *want* to ignore all updates for a specific prop. By convention, start the prop name with `initial` or `default` to clarify that this prop's new values are ignored:

```js
function Message({ initialColor }) {
  // The `color` state variable holds the *first* value of `initialColor`.
  // Further changes to the `initialColor` prop are ignored.
  const [color, setColor] = useState(initialColor);
```

</DeepDive>

## Avoid duplication in state 

This menu list component lets you choose a single dish out of several:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'Raddish', id: 0 },
  { title: 'Celery', id: 1 },
  { title: 'Carrot', id: 2 },
]

export default function CafeMenu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  return (
    <>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.title}
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}</p>
    </>
  );
}
```

</Sandpack>

Currently, it stores the selected item as an object in the `selectedItem` state variable. However, this is not great: **the contents of the `selectedItem` is the same object as one of the items inside the `items` list.** This means that the information about the item itself is duplicated in two places.

Why is this a problem? Let's make each item editable:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'Raddish', id: 0 },
  { title: 'Celery', id: 1 },
  { title: 'Carrot', id: 2 },
]

export default function CafeMenu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}</p>
    </>
  );
}
```

</Sandpack>

Notice how if you first click "Choose" on an item and *then* edit it, **the input updates but the label at the bottom does not reflect the edits.** This is because you have duplicated state, and you forgot to update `selectedItem`.

Although you could update `selectedItem` too, an easier fix is to remove duplication. In this example, instead of a `selectedItem` object (which creates a duplication with objects inside `items`), you hold the `selectedId` in state, and *then* get the `selectedItem` by searching the `items` array for an item with that ID:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'Raddish', id: 0 },
  { title: 'Celery', id: 1 },
  { title: 'Carrot', id: 2 },
]

export default function CafeMenu() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);

  const selectedItem = items.find(item =>
    item.id === selectedId
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedId(item.id);
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}</p>
    </>
  );
}
```

</Sandpack>

(Alternatively, you may hold the selected index in state.)

The state used to be duplicated like this:

* `items = [{ id: 0, text: 'Raddish'}, ...]`
* `selectedItem = {id: 0, text: 'Raddish}`

But after the change it's like this:

* `items = [{ id: 0, text: 'Raddish'}, ...]`
* `selectedId = 0`

The duplication is gone, and you only keep the essential state!

Now if you edit the *selected* item, the message below will update immediately. This is because `setItems` triggers a re-render, and `items.find(...)` would find the item with the updated text. You didn't need to hold *the selected item* in state, because only the *selected ID* is essential. The rest could be calculated during render.

## Avoid deeply nested state

Imagine a todo list where tasks can be arbitrarily nested. You might be tempted to structure its state using nested objects and arrays, like in this example:

<Sandpack>

```js
import { useState } from 'react';

const initialRootTask = {
  id: 1,
  text: 'Root task',
  childTasks: [{
    id: 2,
    text: 'First subtask',
    childTasks: [{
      id: 3,
      text: 'First subtask of first subtask',
      childTasks: []
    }]
  }, {
    id: 4,
    text: 'Second subtask',
    childTasks: [{
      id: 5,
      text: 'First subtask of second subtask',
      childTasks: [],
    }, {
      id: 6,
      text: 'Second subtask of second subtask',
      childTasks: [],
    }]
  }]
};

function Task({ task }) {
  const childTasks = task.childTasks;
  return (
    <>
      <li>{task.text}</li>
      {childTasks.length > 0 && (
        <ol>
          {childTasks.map(task => (
            <Task key={task.id} task={task} />
          ))}
        </ol>
      )}
    </>
  );
}

export default function TaskManager() {
  const [root, setRoot] = useState(initialRootTask);
  return <ol><Task task={root} /></ol>;
}
```

</Sandpack>

Now let's say you want to add a button to delete a task. How would you go about it? [Updating nested state](/learn/updating-objects-and-arrays-in-state#updating-nested-objects-and-arrays) involves making copies of objects all the way up from the part that changed. For example, deleting a deeply nested task would involve copying all its entire parent task chain. For deeply nested state, this can be very cumbersome.

**If the state is too nested to update easily, consider making it "flat".** Here is one way you can restructure this data. Instead of a tree-like structure where each `task` has an array of *its child tasks*, you can have each task hold an array of *its child task IDs*. Then you can store a mapping from each task ID to the corresponding task.

This restructuring of the data might remind you of seeing a database table:

<Sandpack>

```js
import { useState } from 'react';

const initialTasksById = {
  1: {
    id: 1,
    text: 'Root task',
    childIds: [2, 4]
  },
  2: {
    id: 2,
    text: 'First subtask',
    childIds: [3]
  }, 
  3: {
    id: 3,
    text: 'First subtask of first subtask',
    childIds: []
  },
  4: {
    id: 4,
    text: 'Second subtask',
    childIds: [5, 6],   
  },
  5: {
    id: 5,
    text: 'First subtask of second subtask',
    childIds: [],   
  },
  6: {
    id: 6,
    text: 'Second subtask of second subtask',
    childIds: [],   
  },
};

function Task({ id, tasksById }) {
  const task = tasksById[id];
  const childIds = task.childIds;
  return (
    <>
      <li>{task.text}</li>
      {childIds.length > 0 && (
        <ol>
          {childIds.map(childId => (
            <Task
              key={childId}
              id={childId}
              tasksById={tasksById}
            />
          ))}
        </ol>
      )}
    </>
  );
}

export default function TaskManager() {
  const [
    tasksById,
    setTasksById
  ] = useState(initialTasksById);
  return (
    <ol>
      <Task
        id={1}
        tasksById={tasksById}
      />
    </ol>
  );
}
```

</Sandpack>

**Now that the state is "flat" (also known as "normalized"), updating nested items becomes easier.**

In order to remove a task now, you only need to update two levels of state:

- The next version of its *parent* task should not have the deleted child's ID in its `childIds` array.
- The next version of the root `tasksById` object should include the new version of the parent task.

Here is an example of how you could go about it:

<Sandpack>

```js
import { useState } from 'react';

const initialTasksById = {
  1: {
    id: 1,
    text: 'Root task',
    childIds: [2, 4]
  },
  2: {
    id: 2,
    text: 'First subtask',
    childIds: [3]
  }, 
  3: {
    id: 3,
    text: 'First subtask of first subtask',
    childIds: []
  },
  4: {
    id: 4,
    text: 'Second subtask',
    childIds: [5, 6],   
  },
  5: {
    id: 5,
    text: 'First subtask of second subtask',
    childIds: [],   
  },
  6: {
    id: 6,
    text: 'Second subtask of second subtask',
    childIds: [],   
  },
};

export default function TaskManager() {
  const [
    tasksById,
    setTasksById
  ] = useState(initialTasksById);

  function handleRemove(parentId, childId) {
    const parent = tasksById[parentId];
    // Create a new version of the parent task
    // that doesn't include this child ID.
    const nextParent = {
      ...parent,
      childIds: parent.childIds
        .filter(id => id !== childId)
    }
    // Update the root state object...
    setTasksById({
      ...tasksById,
      // ...so that it has the updated parent.
      [parentId]: nextParent,
    });
  }

  return (
    <ol>
      <Task
        id={1}
        parentId={0}
        tasksById={tasksById}
        onRemove={handleRemove}
      />
    </ol>
  );
}

function Task({ id, parentId, tasksById, onRemove }) {
  const task = tasksById[id];
  const childIds = task.childIds;
  return (
    <>
      <li>
        {task.text}
        {parentId !== 0 &&
          <button onClick={() => {
            onRemove(parentId, id);
          }}>
            Remove
          </button>
        }
      </li>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <Task
              key={childId}
              id={childId}
              parentId={id}
              tasksById={tasksById}
              onRemove={onRemove}
            />
          ))}
        </ol>
      }
    </>
  );
}

```

```css
button { margin: 10px; }
```

</Sandpack>

You can nest state as much as you like, but making it "flat" can solve numerous problems. It makes state easier to update, and it helps ensure you don't have duplication in different parts of a nested object.

<DeepDive title="Improving memory usage">

Ideally, you would also add some logic to remove the deleted items (and their children!) from the `itemsById` object to improve memory usage.

This version does that. It also [uses Immer](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) to make the update logic more concise.

<Sandpack>

```js
import { useImmer } from 'use-immer';

const initialTasksById = {
  1: {
    id: 1,
    text: 'Root task',
    childIds: [2, 4]
  },
  2: {
    id: 2,
    text: 'First subtask',
    childIds: [3]
  }, 
  3: {
    id: 3,
    text: 'First subtask of first subtask',
    childIds: []
  },
  4: {
    id: 4,
    text: 'Second subtask',
    childIds: [5, 6],   
  },
  5: {
    id: 5,
    text: 'First subtask of second subtask',
    childIds: [],   
  },
  6: {
    id: 6,
    text: 'Second subtask of second subtask',
    childIds: [],   
  },
};

export default function TaskManager() {
  const [
    tasksById,
    updateTasksById
  ] = useImmer(initialTasksById);

  function handleRemove(parentId, childId) {
    updateTasksById(draft => {
      // Remove from the parent task's child IDs.
      const parent = draft[parentId];
      parent.childIds = parent.childIds
        .filter(id => id !== childId);

      // Forget this task and all its subtree.
      deleteAllChildren(childId);
      function deleteAllChildren(id) {
        const task = draft[id];
        task.childIds.forEach(deleteAllChildren);
        delete draft[id];
      }
    });
  }

  return (
    <ol>
      <Task
        id={1}
        parentId={0}
        tasksById={tasksById}
        onRemove={handleRemove}
      />
    </ol>
  );
}

function Task({ id, parentId, tasksById, onRemove }) {
  const task = tasksById[id];
  const childIds = task.childIds;
  return (
    <>
      <li>
        {task.text}
        {parentId !== 0 &&
          <button onClick={() => {
            onRemove(parentId, id);
          }}>
            Remove
          </button>
        }
      </li>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <Task
              key={childId}
              id={childId}
              parentId={id}
              tasksById={tasksById}
              onRemove={onRemove}
            />
          ))}
        </ol>
      }
    </>
  );
}

```

```css
button { margin: 10px; }
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

</DeepDive>

Sometimes, you can also reduce state nesting by moving some of the nested state into the child components. This works well for ephemeral UI state that doesn't need to be stored, like whether an item is hovered.

<Recap>

* If two state variables always update together, consider merging them into one. 
* Choose your state variables carefully to avoid creating "impossible" states.
* Structure your state in a way that reduces the chances that you'll make a mistake updating it.
* Avoid redundant and duplicate state so that you don't need to keep it in sync.
* Don't put props *into* state unless you specifically want to prevent updates.
* For UI patterns like selection, keep ID or index in state instead of the object itself.
* If updating deeply nested state is cumbersome, try flattening it.

</Recap>



<Challenges>

### Fix a component that's not updating

This `Clock` component receives two props: `color` and `time`. When you select a different color in the select box, the `Clock` component receives a different `color` prop from its parent component. However, for some reason, the displayed color doesn't update. Why? Fix the problem.

<Sandpack>

```js Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  const [color, setColor] = useState(props.color);
  return (
    <h1 style={{ color: color }}>
      {props.time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

<Solution>

The issue is that this component has `color` state initialized with the initial value of the `color` prop. But when the `color` prop changes, this does not affect the state variable! So they get out of sync. To fix this issue, remove the state variable altogether, and use the `color` prop directly.

<Sandpack>

```js Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  return (
    <h1 style={{ color: props.color }}>
      {props.time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

Or, using the destructuring syntax:

<Sandpack>

```js Clock.js active
import { useState } from 'react';

export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

</Solution>

### Fix a broken task counter

This todo list has a footer that shows how many tasks are completed, and how many tasks there are overall. It seems to work at first, but it is buggy. For example, if you mark a task as completed and then delete it, the counter will not be updated correctly. Fix the counter so that it's always correct.

<Hint>

Is any state in this example redundant?

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, text: 'Buy milk', done: true },
  { id: 1, text: 'Eat tacos', done: false },
  { id: 2, text: 'Brew tea', done: false },
];

export default function TaskBoard() {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );
  const [total, setTotal] = useState(3);
  const [done, setDone] = useState(1);

  function handleAddTodo(text) {
    setTotal(total + 1);
    setTodos([
      ...todos,
      {
        id: nextId++,
        text: text,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    if (nextTodo.done) {
      setDone(done + 1);
    } else {
      setDone(done - 1);
    }
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTotal(total - 1);
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
      <hr />
      <b>{done} out of {total} done!</b>
    </>
  );
}
```

```js AddTodo.js hidden
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTodo(text);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js hidden
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
          <label>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={e => {
                onChangeTodo({
                  ...todo,
                  done: e.target.checked
                });
              }}
            />
            {' '}
            {todo.text}
          </label>
          <button onClick={() => onDeleteTodo(todo.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

Although you could carefully change each event handler to update the `total` and `done` counters correctly, the root problem is that these state variables exist at all. They are redundant because you can always calculate the number of tasks (done or total) from the `todos` array itself. Remove the redundant state to fix the bug:

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, text: 'Buy milk', done: true },
  { id: 1, text: 'Eat tacos', done: false },
  { id: 2, text: 'Brew tea', done: false },
];

export default function TaskBoard() {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  const total = todos.length;
  const done = todos
    .filter(t => t.done)
    .length;

  function handleAddTodo(text) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        text: text,
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
      <hr />
      <b>{done} out of {total} done!</b>
    </>
  );
}
```

```js AddTodo.js hidden
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTodo(text);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js hidden
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
          <label>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={e => {
                onChangeTodo({
                  ...todo,
                  done: e.target.checked
                });
              }}
            />
            {' '}
            {todo.text}
          </label>
          <button onClick={() => onDeleteTodo(todo.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

Notice how the event handlers are only concerned with calling `setTodos` after this change. The todo counts are now calculated during the next render from `todos`, so they are always up-to-date.

</Solution>

### Fix the disappearing selection

There is a list of `letters` in state. When you hover or focus a particular letter, it gets highlighted. The currently highlighted letter is stored in the `highlightedLetter` state variable. You can "star" and "unstar" invidual letters, which updates the `letters` array in state.

This code works, but there is a minor UI glitch. When you press "Star" or "Unstar", the highlighting disappears for a moment. However, it reappears as soon as you move your pointer or switch to another letter with keyboard. Why is this happening? Fix it so that the highlighting doesn't disappear after the button click.

<Sandpack>

```js App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [
    letters,
    setLetters
  ] = useState(initialLetters);
  const [
    highlightedLetter,
    setHighlightedLetter
  ] = useState(null);

  function handleHover(letter) {
    setHighlightedLetter(letter);
  }

  function handleStar(starred) {
    setLetters(letters.map(letter => {
      if (letter.id === starred.id) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <ul>
      {letters.map(letter => (
        <Letter
          key={letter.id}
          letter={letter}
          isHighlighted={
            letter === highlightedLetter
          }
          onHover={handleHover}
          onToggleStar={handleStar}
        />
      ))}
    </ul>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter);        
      }}
      onPointerMove={() => {
        onHover(letter);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter);
      }}>
        {letter.isStarred ? 'Unstar' : 'Star'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js data.js
export const initialLetters = [{
  id: 0,
  subject: 'How are you?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Your taxes are due',
  isStarred: false,
}, {
  id: 2,
  subject: 'Reminder: dentist',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

<Solution>

The problem is that you're holding the letter object in `highlightedLetter`. But you're also holding the information for it in the `letters` array itself. So your state has duplication! When you update the `letters` array after the button click, you create a new letter object which is different from `highlightedLetter`. This is why `highlightedLetter === letter` check becomes `false`, and the highlight disappears. It reappears the next time you call `setHighlightedLetter` when the pointer moves.

To fix the issue, remove the duplication from state. Instead of storing *the letter itself* in two places, store the `highlightedId` instead. Then you can check `isHighlighted` for each letter with `letter.id === highlightedId`, which will work even if the `letter` object has changed since the last render.

<Sandpack>

```js App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [
    letters,
    setLetters
  ] = useState(initialLetters);
  const [
    highlightedId,
    setHighlightedId
  ] = useState(null);

  function handleHover(letterId) {
    setHighlightedId(letterId);
  }

  function handleStar(starredId) {
    setLetters(letters.map(letter => {
      if (letter.id === starredId) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <ul>
      {letters.map(letter => (
        <Letter
          key={letter.id}
          letter={letter}
          isHighlighted={
            letter.id === highlightedId
          }
          onHover={handleHover}
          onToggleStar={handleStar}
        />
      ))}
    </ul>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter.id);        
      }}
      onPointerMove={() => {
        onHover(letter.id);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter.id);
      }}>
        {letter.isStarred ? 'Unstar' : 'Star'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js data.js
export const initialLetters = [{
  id: 0,
  subject: 'How are you?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Your taxes are due',
  isStarred: false,
}, {
  id: 2,
  subject: 'Reminder: dentist',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

</Solution>

### Implement multiple selection

In this example, each `Letter` has an `isSelected` prop and an `onToggle` handler that marks it as selected. This works, but the state is stored as a `selectedId` (either `null` or an ID), so only one letter can get selected at any given time.

Change the state structure to support multiple selection. (How would you structure it? Think about this before writing the code.) Each checkbox should become independent from the others. Clicking a selected letter should uncheck it. Finally, the footer should show the correct number of the selected items.

<Hint>

Instead of a single selected ID, you might want to hold an array or a [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) of selected IDs in state.

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [
    selectedId,
    setSelectedId
  ] = useState(null);

  // TODO: allow multiple selection
  const selectedCount = 1;

  function handleToggle(toggledId) {
    // TODO: allow multiple selection
    setSelectedId(toggledId);
  }

  return (
    <ul>
      {letters.map(letter => (
        <Letter
          key={letter.id}
          letter={letter}
          isSelected={
            // TODO: allow multiple selection
            letter.id === selectedId
          }
          onToggle={handleToggle}
        />
      ))}
      <hr />
      <p>
        <b>
          You selected {selectedCount} letters
        </b>
      </p>
    </ul>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js data.js
export const letters = [{
  id: 0,
  subject: 'How are you?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Your taxes are due',
  isStarred: false,
}, {
  id: 2,
  subject: 'Reminder: dentist',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

<Solution>

Instead of a single `selectedId`, keep a `selectedIds` *array* in state. For example, if you select the first and the last letter, it would contain `[0, 2]`. When nothing is selected, it would be an empty `[]` array:

<Sandpack>

```js App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [
    selectedIds,
    setSelectedIds
  ] = useState([]);

  const selectedCount = selectedIds.length;

  function handleToggle(toggledId) {
    // Was it previously selected?
    if (selectedIds.includes(toggledId)) {
      // Then remove this ID from the array.
      setSelectedIds(selectedIds.filter(id =>
        id !== toggledId
      ));
    } else {
      // Otherwise, add this ID to the array.
      setSelectedIds([
        ...selectedIds,
        toggledId
      ]);
    }
  }

  return (
    <ul>
      {letters.map(letter => (
        <Letter
          key={letter.id}
          letter={letter}
          isSelected={
            selectedIds.includes(letter.id)
          }
          onToggle={handleToggle}
        />
      ))}
      <hr />
      <p>
        <b>
          You selected {selectedCount} letters
        </b>
      </p>
    </ul>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js data.js
export const letters = [{
  id: 0,
  subject: 'How are you?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Your taxes are due',
  isStarred: false,
}, {
  id: 2,
  subject: 'Reminder: dentist',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

One minor downside of using an array is that for each item, you're calling `selectedIds.includes(letter.id)` to check whether it's selected. If the array is very large, this can become a performance problem because array search with [`includes()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) takes linear time, and you're doing this search for each individual item.

To fix this, you can hold a [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) in state instead, which provides a fast [`has()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has) operation:

<Sandpack>

```js App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [
    selectedIds,
    setSelectedIds
  ] = useState(new Set());

  const selectedCount = selectedIds.size;

  function handleToggle(toggledId) {
    // Create a copy (to avoid mutation).
    const nextIds = new Set(selectedIds);
    if (nextIds.has(toggledId)) {
      nextIds.delete(toggledId);
    } else {
      nextIds.add(toggledId);
    }
    setSelectedIds(nextIds);
  }

  return (
    <ul>
      {letters.map(letter => (
        <Letter
          key={letter.id}
          letter={letter}
          isSelected={
            selectedIds.has(letter.id)
          }
          onToggle={handleToggle}
        />
      ))}
      <hr />
      <p>
        <b>
          You selected {selectedCount} letters
        </b>
      </p>
    </ul>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js data.js
export const letters = [{
  id: 0,
  subject: 'How are you?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Your taxes are due',
  isStarred: false,
}, {
  id: 2,
  subject: 'Reminder: dentist',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

Now each item does a `selectedIds.has(letter.id)` check, which is very fast.

Keep in mind that you [should not mutate objects in state](/learn/updating-objects-in-state), and that includes Sets, too. This is why the `handleToggle` function creates a *copy* of the Set first, and then updates that copy.

</Solution>

</Challenges>