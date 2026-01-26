---
title: useOptimistic
---

<Intro>

`useOptimistic` is a React Hook that lets you optimistically update the UI.

```js
const [optimisticState, addOptimistic] = useOptimistic(state, reducer?);
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useOptimistic(state, reducer?)` {/*use*/}

Call `useOptimistic` at the top level of your component to declare optimistic state.



```js
import { useOptimistic } from 'react';

function MyComponent({name, todos}) {
  const [optimisticAge, setOptimisticAge] = useOptimistic(28);
  const [optimisticName, setOptimisticName] = useOptimistic(name);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos, todoReducer);
}
```

<DeepDive>

#### How optimistic state works {/*how-optimistic-state-works*/}

`useOptimistic` lets you show a temporary value while a transition is running:

```js
const [value, setValue] = useState('a');
const [optimistic, setOptimistic] = useOptimistic(value);

startTransition(async () => {
  setOptimistic('b');
  setValue('b');
});
```

When the setter is called inside a transition, `useOptimistic` will render that value while the transition is in progress. Otherwise, the `value` passed to `useOptimistic` is rendered.

This state is called the "optimistic" state because it is used to immediately present the user with the result of performing an action, even though the action or transition actually takes time to complete.

When the action or transition completes, `useOptimistic` returns the current `value` you passed in.

**How the update flows**

1. **Immediate optimistic update**: When `setOptimistic('b')` is called, `optimistic` immediately becomes `'b'` and React renders with this value.

2. **Transition scheduled**: `setValue('b')` schedules an update to the real state, but this update won't commit until the transition completes.

3. **Optimistic state persists during async work**: If the transition suspends or uses `await`, the optimistic `'b'` continues showing while React waits.

4. **Single render commit**: When all async work finishes, the new state (`'b'`) and optimistic state (`'b'`) commit together in a single render.

There's no extra render to "clear" the optimistic value—the optimistic and real state converge in the same render when the transition completes.

**How the final state is determined**

The `state` argument to `useOptimistic` determines what displays after the transition finishes. How this works depends on the pattern you use:

- **Hardcoded values** like `useOptimistic(false)`: After the transition, `state` is still `false`, so the UI shows `false`. This is useful for pending states where you always start from `false`.

- **Props or state passed in** like `useOptimistic(isLiked)`: If the parent updates `isLiked` during the transition, the new value is used after the transition ends. This is how the UI reflects the result of the action.

- **Reducer pattern** like `useOptimistic(items, fn)`: If `items` changes while the transition is pending, React re-runs your `reducer` with the new `items` to recalculate what to show. This keeps your optimistic additions on top of the latest data.

**What happens when the action fails**

If the Action throws an error, the Transition still ends, and React renders with whatever `state` currently is. Since the parent typically only updates `state` on success, a failure means `state` hasn't changed—so the UI shows what it showed before the optimistic update. You can catch the error to show a message to the user.

</DeepDive>

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `state`: The value returned when there are no pending Actions or Transitions.
* **optional** `reducer(currentState, optimisticValue)`: The reducer function that specifies how the optimistic state gets updated. It must be pure, should take the current state and the optimistic value as arguments, and should return the next optimistic state.


#### Returns {/*returns*/}

`useOptimistic` returns an array with exactly two values:

1. `optimisticState`: The resulting optimistic state. It is equal to `state` unless an Action or Transition is pending, in which case it is equal to the value returned by `reducer` (or the value passed to the set function if no `reducer` was provided).
2. The [`set` function](#setoptimistic) that lets you update the optimistic state to a different value inside an Action or Transition.

---

### `set` functions, like `setOptimistic(optimisticValue)` {/*setoptimistic*/}

The `set` function returned by `useOptimistic` lets you update the state to a different value inside an Action or Transition and trigger an immediate re-render. You can pass the next state directly, or a function that calculates it from the previous state:

```js
const [optimisticLike, setOptimisticLike] = useOptimistic(name);

function handleClick() {
  startTransition(async () => {
    setOptimisticLike(true);
    setOptimisticLike(liked => !liked);
    await saveChanges();
  });
}
```

#### Parameters {/*setoptimistic-parameters*/}

* `nextState`: The value that you want the optimistic state to be. If you provided a `reducer` to `useOptimistic`, this value will be passed as the second argument to your reducer. It can be a value of any type.
    * If you pass a function as `nextState`, it will be treated as an _updater function_. It must be pure, should take the pending state as its only argument, and should return the next state. React will put your updater function in a queue and re-render your component. During the next render, React will calculate the next state by applying the queued updaters to the previous state similar to [`useState` updaters](/reference/react/useState#setstate-parameters)

#### Returns {/*setoptimistic-returns*/}

`set` functions do not have a return value.

#### Caveats {/*setoptimistic-caveats*/}

* The `set` function must be called inside a [Transition](/reference/react/useTransition) using [`startTransition`](/reference/react/startTransition) or inside an [Action](/reference/react/useTransition#perform-non-blocking-updates-with-actions). If you call the setter outside an Action or Transition, the optimistic value will briefly appear and then immediately revert.

---

## Usage {/*usage*/}

### Adding optimistic state to a component {/*adding-optimistic-state-to-a-component*/}

Call useOptimistic at the top level of your component to declare one or more optimistic states.

```js [[1, 4, "age"], [1, 5, "name"], [1, 6, "todos"], [2, 4, "optimisticAge"], [2, 5, "optimisticName"], [2, 6, "optimisticTodos"], [3, 4, "setOptimisticAge"], [3, 5, "setOptimisticName"], [3, 6, "setOptimisticTodos"], [4, 6, "reducer"]]
import { useOptimistic } from 'react';

function MyComponent({age, name, todos}) {
  const [optimisticAge, setOptimisticAge] = useOptimistic(age);
  const [optimisticName, setOptimisticName] = useOptimistic(name);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos, reducer);
  // ...
```

`useOptimistic` returns an array with exactly two items:

1. The <CodeStep step={2}>current state</CodeStep> of the optimistic value, returning the <CodeStep step={1}>state</CodeStep> provided.
2. The <CodeStep step={3}>set function</CodeStep> that lets you temporarily change the state during an Action or Transition.
   * If a <CodeStep step={1}>reducer</CodeStep> is provided, it will run before rendering the temporary state.

To use the optimistic state, call the set function inside a Transition:

```js [[3, 3, "setOptimisticAge"]]
function handleClick(e) {
  startTransition(() => {
    setOptimisticAge(42);
    onAgeChange(42);
  });
}
```

Or call it inside an action:

```js [[3, 3, "setOptimisticName"]]
async function submitAction() {
  // By convention, Actions are called inside startTransition.
  setOptimisticName('Taylor');
  await updateName('Taylor');
}
```

React will render the optimistic state first, then complete the Action or Transition with the new value.

### Adding pending state to a component {/*adding-pending-state-to-a-component*/}

To show a pending state while an Action is running, use `useOptimistic` with a boolean.

Here's a button that shows "Submitting..." while the Action is pending using the [Action prop pattern](/reference/react/useTransition#exposing-action-props-from-components):

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Button from './Button';
import { submitForm } from './actions.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Button action={async () => {
        await submitForm();
        setCount(c => c + 1);
      }}>Increment</Button>
      {count > 0 && <p>Submitted {count}!</p>}
    </div>
  );
}
```

```js src/Button.js active
import { useOptimistic, startTransition } from 'react';

export default function Button({ action, children }) {
  const [isPending, setIsPending] = useOptimistic(false);

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          setIsPending(true);
          await action();
        });
      }}
    >
      {isPending ? 'Submitting...' : children}
    </button>
  );
}
```

```js src/actions.js hidden
export async function submitForm() {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

When the button is clicked, `setIsPending(true)` immediately updates the display to show "Submitting..." and disables the button. When the Action is done, `isPending` is rendered as `false` automatically.

### Updating props or state optimistically {/*updating-props-or-state-optimistically*/}

You can wrap props or state in `useOptimistic` to update it immediately while a Transition is in progress.

In this example, `LikeButton` receives `isLiked` as a prop and immediately toggles it when clicked:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { toggleLike } from './actions.js';
import LikeButton from './LikeButton';

export default function App() {
  const [isLiked, setIsLiked] = useState(false);

  async function toggleLikeAction() {
    await toggleLike();
    startTransition(() => {
      setIsLiked(liked => !liked);
    });
  }

  return <LikeButton isLiked={isLiked} toggleLikeAction={toggleLikeAction} />;
}
```

```js src/LikeButton.js active
import { useOptimistic, startTransition } from 'react';

export default function LikeButton({ isLiked, toggleLikeAction }) {
  const [optimisticIsLiked, setOptimisticIsLiked] = useOptimistic(isLiked);

  function handleClick() {
    startTransition(async () => {
      setOptimisticIsLiked(!optimisticIsLiked);
      await toggleLikeAction();
    });
  }

  return (
    <button onClick={handleClick}>
      {optimisticIsLiked ? '❤️ Unlike' : '🤍 Like'}
    </button>
  );
}
```

```js src/actions.js hidden
export async function toggleLike() {
  await new Promise((res) => setTimeout(res, 1000));
  // In a real app, this would update the server
}
```

</Sandpack>

When the button is clicked, `setOptimisticIsLiked` immediately updates the displayed state to show the heart as liked. Meanwhile, `toggleLikeAction` action runs in the background. When the action completes, the parent updates the canonical `isLiked` state, and the optimistic state is rendered to match this new value.

<Note>

This example reads from `optimisticIsLiked` to calculate the next value. This works for simple cases, but if the base state might change while your action is pending, you may want to use a state updater or the reducer.

See [Updating state based on the current state](#updating-state-based-on-current-state) for an example.

</Note>

### Updating state based on the current state {/*updating-state-based-on-current-state*/}

The previous example toggles `isLiked` by reading from the current optimistic state:

```js
setOptimisticIsLiked(!optimisticIsLiked);
```

This works fine for simple cases, but can cause issues if the base state changes while your action is pending. For example, if another user's action changes the `isLiked` state on the server while you're waiting, your toggle could apply to the wrong value.

To calculate the optimistic state relative to the current state, pass an updater function:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { toggleLike } from './actions.js';
import LikeButton from './LikeButton';

export default function App() {
  const [isLiked, setIsLiked] = useState(false);

  async function toggleLikeAction() {
    await toggleLike();
    startTransition(() => {
      setIsLiked(liked => !liked);
    });
  }

  return <LikeButton isLiked={isLiked} toggleLikeAction={toggleLikeAction} />;
}
```

```js src/LikeButton.js active
import { useOptimistic, startTransition } from 'react';

export default function LikeButton({ isLiked, toggleLikeAction }) {
  const [optimisticIsLiked, setOptimisticIsLiked] = useOptimistic(isLiked);

  function handleClick() {
    startTransition(async () => {
      setOptimisticIsLiked(liked => !liked);
      await toggleLikeAction();
    });
  }

  return (
    <button onClick={handleClick}>
      {optimisticIsLiked ? '❤️ Unlike' : '🤍 Like'}
    </button>
  );
}
```

```js src/actions.js hidden
export async function toggleLike() {
  await new Promise((res) => setTimeout(res, 1000));
  // In a real app, this would update the server
}
```

</Sandpack>

Here, `liked => !liked` always toggles the latest state. If the base `isLiked` changes during the transition, React will recalculate the optimistic value returned.

<DeepDive>

#### Choosing between updaters and reducers {/*choosing-between-updaters-and-reducers*/}

`useOptimistic` supports two patterns for calculating state based on current state:

**Updater functions** work just like [useState updaters](/reference/react/useState#updating-state-based-on-the-previous-state). Pass a function to the setter:

```js
const [optimistic, setOptimistic] = useOptimistic(value);
setOptimistic(current => !current);
```

**Reducers** separate the update logic from the setter call:

```js
const [optimistic, dispatch] = useOptimistic(value, (current, action) => {
  // Calculate next state based on current and action
});
dispatch(action);
```

| Use Case | Pattern | Example |
|----------|---------|---------|
| Boolean toggle | Updater | `setOptimistic(liked => !liked)` |
| Increment/decrement | Updater | `setOptimistic(count => count + 1)` |
| Add item to list | Reducer | `useOptimistic(items, (list, item) => [...list, item])` |
| Multiple action types | Reducer | `useOptimistic(state, (current, action) => { switch(action.type) { ... } })` |

**Use updaters** for simple calculations where the setter call naturally describes the update. This is similar to using `setState(prev => ...)` with `useState`.

**Use reducers** when you need to pass data to the update (like which item to add) or when handling multiple types of updates with a single hook.

Both patterns ensure React can update your optimistic value if the state changes while your Transition is pending.

</DeepDive>

### Updating multiple values together {/*updating-multiple-values-together*/}

When an optimistic update affects multiple related values, use a reducer to update them together. This ensures the UI stays consistent. Here's a follow button that updates both the follow state and follower count:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { followUser, unfollowUser } from './actions.js';
import FollowButton from './FollowButton';

export default function App() {
  const [user, setUser] = useState({
    name: 'React',
    isFollowing: false,
    followerCount: 10500
  });

  async function followAction(shouldFollow) {
    if (shouldFollow) {
      await followUser(user.name);
    } else {
      await unfollowUser(user.name);
    }
    startTransition(() => {
      setUser(current => ({
        ...current,
        isFollowing: shouldFollow,
        followerCount: current.followerCount + (shouldFollow ? 1 : -1)
      }));
    });
  }

  return <FollowButton user={user} followAction={followAction} />;
}
```

```js src/FollowButton.js active
import { useOptimistic, startTransition } from 'react';

export default function FollowButton({ user, followAction }) {
  const [optimisticState, updateOptimistic] = useOptimistic(
    { isFollowing: user.isFollowing, followerCount: user.followerCount },
    (current, isFollowing) => ({
      isFollowing,
      followerCount: current.followerCount + (isFollowing ? 1 : -1)
    })
  );

  function handleClick() {
    const newFollowState = !optimisticState.isFollowing;
    startTransition(async () => {
      updateOptimistic(newFollowState);
      await followAction(newFollowState);
    });
  }

  return (
    <div>
      <p><strong>{user.name}</strong></p>
      <p>{optimisticState.followerCount} followers</p>
      <button onClick={handleClick}>
        {optimisticState.isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
}
```

```js src/actions.js hidden
export async function followUser(name) {
  await new Promise((res) => setTimeout(res, 1000));
}

export async function unfollowUser(name) {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

The reducer receives the new `isFollowing` value and calculates both the new follow state and the updated follower count in a single update. This ensures the button text and count always stay in sync.

### Using optimistic state in Action props {/*using-optimistic-state-in-action-props*/}

When you pass a function to an [Action prop](/reference/react/useTransition#exposing-action-props-from-components), you can call the optimistic setter directly without wrapping it in `startTransition`. This includes form actions:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import EditName from './EditName';

export default function App() {
  const [name, setName] = useState('Alice');

  return <EditName name={name} setName={setName} />;
}
```

```js src/EditName.js active
import { useOptimistic } from 'react';
import { updateName } from './actions.js';

export default function EditName({ name, setName }) {
  const [optimisticName, setOptimisticName] = useOptimistic(name);

  async function submitAction(formData) {
    const newName = formData.get('name');
    setOptimisticName(newName);
    const updatedName = await updateName(newName);
    setName(updatedName);
  }

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <p>
        <label>Change it: </label>
        <input
          type="text"
          name="name"
          disabled={name !== optimisticName}
        />
      </p>
    </form>
  );
}
```

```js src/actions.js hidden
export async function updateName(name) {
  await new Promise((res) => setTimeout(res, 1000));
  return name;
}
```

</Sandpack>

In this example, when the user submits the form, the `optimisticName` updates immediately to show the new value while the server request is in progress. When the request completes, React updates the real `name` state and the Transition ends.

<DeepDive>

#### Why doesn't this need `startTransition`? {/*why-doesnt-this-need-starttransition*/}

The optimistic setter must be called inside a Transition to work correctly. When you pass a function to an Action prop, React automatically calls that function inside a Transition context. This means the action is already running inside a Transition when invoked.

Since you're already in a Transition, calling `setOptimisticName` directly is valid. The `await` inside the async function keeps the Transition open until the server responds, at which point the optimistic state reverts to the real state.

</DeepDive>

### Optimistically adding to a list {/*optimistically-adding-to-a-list*/}

When you need to optimistically add items to a list, use the `reducer` parameter:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { addTodo } from './actions.js';
import TodoList from './TodoList';

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React' }
  ]);

  async function addTodoAction(newTodo) {
    const savedTodo = await addTodo(newTodo);
    startTransition(() => {
      setTodos(todos => [...todos, savedTodo]);
    });
  }

  return <TodoList todos={todos} addTodoAction={addTodoAction} />;
}
```

```js src/TodoList.js active
import { useOptimistic, startTransition } from 'react';

export default function TodoList({ todos, addTodoAction }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (currentTodos, newTodo) => [
      ...currentTodos,
      { id: newTodo.id, text: newTodo.text, pending: true }
    ]
  );

  function handleAddTodo(text) {
    const newTodo = { id: crypto.randomUUID(), text: text };
    startTransition(async () => {
      addOptimisticTodo(newTodo);
      await addTodoAction(newTodo);
    });
  }

  return (
    <div>
      <button onClick={() => handleAddTodo('New todo')}>Add Todo</button>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id}>
            {todo.text} {todo.pending && "(Adding...)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/actions.js hidden
export async function addTodo(todo) {
  await new Promise((res) => setTimeout(res, 1000));
  // In a real app, this would save to the server
  return { ...todo, pending: false };
}
```

</Sandpack>

The `reducer` receives the current list of todos and the new todo to add. This is important because if the `todos` prop changes while your add is pending (for example, another user added a todo), React will update your optimistic value by re-running the reducer with the updated list. This ensures your new todo is added to the latest list, not an outdated copy.

<Note>

Each optimistic item includes a `pending: true` flag so you can show loading state for individual items. When the server responds and the parent updates the canonical `todos` list with the saved item, the optimistic state reverts and displays the confirmed item without the pending flag.

</Note>

### Handling multiple action types {/*handling-multiple-action-types*/}

When you need to handle multiple types of optimistic updates (like adding and removing items), use a reducer pattern with action objects. 

This shopping cart example shows how to handle add and remove with a single reducer:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { addToCart, removeFromCart, updateQuantity } from './actions.js';
import ShoppingCart from './ShoppingCart';

export default function App() {
  const [cart, setCart] = useState([]);

  const cartActions = {
    async add(item) {
      await addToCart(item);
      startTransition(() => {
        setCart(current => {
          const exists = current.find(i => i.id === item.id);
          if (exists) {
            return current.map(i =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          }
          return [...current, { ...item, quantity: 1 }];
        });
      });
    },
    async remove(id) {
      await removeFromCart(id);
      startTransition(() => {
        setCart(current => current.filter(item => item.id !== id));
      });
    },
    async updateQuantity(id, quantity) {
      await updateQuantity(id, quantity);
      startTransition(() => {
        setCart(current =>
          current.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      });
    }
  };

  return <ShoppingCart cart={cart} cartActions={cartActions} />;
}
```

```js src/ShoppingCart.js active
import { useOptimistic, startTransition } from 'react';

export default function ShoppingCart({ cart, cartActions }) {
  const [optimisticCart, dispatch] = useOptimistic(
    cart,
    (currentCart, action) => {
      switch (action.type) {
        case 'add':
          const exists = currentCart.find(item => item.id === action.item.id);
          if (exists) {
            return currentCart.map(item =>
              item.id === action.item.id
                ? { ...item, quantity: item.quantity + 1, pending: true }
                : item
            );
          }
          return [...currentCart, { ...action.item, quantity: 1, pending: true }];
        case 'remove':
          return currentCart.filter(item => item.id !== action.id);
        case 'update_quantity':
          return currentCart.map(item =>
            item.id === action.id
              ? { ...item, quantity: action.quantity, pending: true }
              : item
          );
        default:
          return currentCart;
      }
    }
  );

  function handleAdd(item) {
    startTransition(async () => {
      dispatch({ type: 'add', item });
      await cartActions.add(item);
    });
  }

  function handleRemove(id) {
    startTransition(async () => {
      dispatch({ type: 'remove', id });
      await cartActions.remove(id);
    });
  }

  function handleUpdateQuantity(id, quantity) {
    startTransition(async () => {
      dispatch({ type: 'update_quantity', id, quantity });
      await cartActions.updateQuantity(id, quantity);
    });
  }

  const total = optimisticCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Shopping Cart</h2>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => handleAdd({ id: 1, name: 'T-Shirt', price: 25 })}>
          Add T-Shirt ($25)
        </button>{' '}
        <button onClick={() => handleAdd({ id: 2, name: 'Mug', price: 15 })}>
          Add Mug ($15)
        </button>
      </div>
      {optimisticCart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {optimisticCart.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price} ×
              {item.quantity}
              {' '}= ${item.price * item.quantity}
              <button onClick={() => handleRemove(item.id)} style={{ marginLeft: 8 }}>
                Remove
              </button>
              {item.pending && ' ...'}
            </li>
          ))}
        </ul>
      )}
      <p><strong>Total: ${total}</strong></p>
    </div>
  );
}
```

```js src/actions.js hidden
export async function addToCart(item) {
  await new Promise((res) => setTimeout(res, 800));
}

export async function removeFromCart(id) {
  await new Promise((res) => setTimeout(res, 800));
}

export async function updateQuantity(id, quantity) {
  await new Promise((res) => setTimeout(res, 800));
}
```

</Sandpack>

The reducer handles three action types (`add`, `remove`, `update_quantity`) and returns the new optimistic state for each. Each action sets a `pending: true` flag so you can show visual feedback while the server action runs.

### Optimistic delete with error recovery {/*optimistic-delete-with-error-recovery*/}

When deleting items optimistically, you should handle the case where the Action fails.

This example shows how to display an error message when a delete fails, and the UI automatically rolls back to show the item again.

Try deleting 'Deploy to production':

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { deleteItem } from './actions.js';
import ItemList from './ItemList';

export default function App() {
  const [items, setItems] = useState([
    { id: 1, name: 'Learn React' },
    { id: 2, name: 'Build an app' },
    { id: 3, name: 'Deploy to production' },
  ]);

  async function deleteAction(id) {
    await deleteItem(id);
    startTransition(() => {
      setItems(current => current.filter(item => item.id !== id));
    });
  }

  return <ItemList items={items} deleteAction={deleteAction} />;
}
```

```js src/ItemList.js active
import { useState, useOptimistic, startTransition } from 'react';

export default function ItemList({ items, deleteAction }) {
  const [error, setError] = useState(null);
  const [optimisticItems, removeItem] = useOptimistic(
    items,
    (currentItems, idToRemove) =>
      currentItems.map(item =>
        item.id === idToRemove
          ? { ...item, deleting: true }
          : item
      )
  );

  function handleDelete(id) {
    setError(null);
    startTransition(async () => {
      removeItem(id);
      try {
        await deleteAction(id);
      } catch (e) {
        setError(e.message);
      }
    });
  }

  return (
    <div>
      <h2>Your Items</h2>
      {error && (
        <p style={{ color: 'red', padding: 8, background: '#fee' }}>
          {error}
        </p>
      )}
      <ul>
        {optimisticItems.map(item => (
          <li
            key={item.id}
            style={{
              opacity: item.deleting ? 0.5 : 1,
              textDecoration: item.deleting ? 'line-through' : 'none',
              transition: 'opacity 0.2s'
            }}
          >
            {item.name}
            <button
              onClick={() => handleDelete(item.id)}
              disabled={item.deleting}
              style={{ marginLeft: 8 }}
            >
              {item.deleting ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/actions.js hidden
export async function deleteItem(id) {
  await new Promise((res) => setTimeout(res, 1000));
  // Item 3 always fails to demonstrate error recovery
  if (id === 3) {
    throw new Error('Cannot delete. Permission denied.');
  }
}
```

</Sandpack>

When the delete fails, the optimistic state automatically switches back (since the transition completes), and the item reappears in the list. 

---

## Troubleshooting {/*troubleshooting*/}

### I'm getting an error: "An optimistic state update occurred outside a transition or action" {/*an-optimistic-state-update-occurred-outside-a-transition-or-action*/}

You may see this error:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

An optimistic state update occurred outside a transition or action. To fix, move the update to an action, or wrap with startTransition.

</ConsoleLogLine>

</ConsoleBlockMulti>

The optimistic setter function must be called inside a transition: 

```js
// ❌ Incorrect: outside a transition
function handleClick() {
  setOptimistic(newValue);  // Warning!
  // ...
}

// ✅ Correct: inside a transition
function handleClick() {
  startTransition(async () => {
    setOptimistic(newValue);
    // ...
  });
}

// ✅ Also correct: inside an Action prop
function submitAction(formData) {
  setOptimistic(newValue);
  // ...
}
```

When you call the setter outside a transition, the optimistic value will briefly appear and then immediately revert back to the original value. This happens because there's no transition to "hold" the optimistic state while your action runs.

### I'm getting an error: "Cannot update optimistic state while rendering" {/*cannot-update-optimistic-state-while-rendering*/}

You may see this error:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Cannot update optimistic state while rendering.

</ConsoleLogLine>

</ConsoleBlockMulti>

This error occurs when you call the optimistic setter during the render phase of a component. You can only call it from event handlers, effects, or other callbacks:

```js
// ❌ Incorrect: calling during render
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  // This runs during render - not allowed!
  setPending(true);
  
  // ...
}

// ✅ Correct: calling inside startTransition
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  function handleClick() {
    startTransition(() => {
      setPending(true);
      // ...
    });
  }

  // ...
}

// ✅ Also Correct: calling from an Action prop
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  function action() {
    setPending(true);
    // ...
  }

  // ...
}
```

### My optimistic updates show stale values {/*my-optimistic-updates-show-stale-values*/}

If your optimistic state seems to be based on old data, it might be because the canonical state changed while your action was pending. React will update your optimistic value by re-running `reducer` with the new state.

If you're using the simple form without `reducer`, the value you passed directly replaces the state, which may not be what you want when the base state has changed. Consider using the `reducer` form to calculate the optimistic state relative to the current state. 

See [Updating state based on the current state](#updating-state-based-on-current-state) for a detailed explanation.

```js
// May show stale data if state changes during action
const [optimistic, setOptimistic] = useOptimistic(count);
setOptimistic(5);  // Always sets to 5, even if count changed

// Better: relative updates handle state changes correctly
const [optimistic, adjust] = useOptimistic(count, (current, delta) => current + delta);
adjust(1);  // Always adds 1 to whatever the current count is
```

### I don't know if my optimistic update is pending {/*i-dont-know-if-my-optimistic-update-is-pending*/}

To know when `useOptimistic` is pending, you have two options:


1. **Check if `optimisticValue === value`**

```js
const [optimistic, setOptimistic] = useOptimistic(value);
const isPending = optimistic !== value;
```

If the values are not equal, there's a Transition in progress. This is the same as wrapping with an additional `useTransition`, so an additional wrapper is not necessary.

2. **Add a `pending` flag in your reducer**

```js
const [optimistic, addOptimistic] = useOptimistic(
  items,
  (state, newItem) => [...state, { ...newItem, isPending: true }]
);
```

Including a `pending` flag in your optimistic reducer lets you check when any item in the state is pending.
