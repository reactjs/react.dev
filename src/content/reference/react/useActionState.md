---
title: useActionState
---

<Intro>

`useActionState` is a React Hook that lets you track the state of an [Action](/reference/react/useTransition#functions-called-in-starttransition-are-called-actions).

```js
const [state, action, isPending] = useActionState(reducerAction, initialState, permalink?);
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useActionState(reducerAction, initialState, permalink?)` {/*useactionstate*/}

Call `useActionState` at the top level of your component to create state for the result of an Action.

```js
import { useActionState } from 'react';

function reducerAction(state, action) {
  // ...
}

function MyComponent() {
  const [state, action, isPending] = useActionState(reducerAction, {quantity: 1});
  // ...
  
}
```

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `reducerAction`: The function to be called when the Action is triggered. When called, it receives the previous state (initially the `initialState` you provided, then its previous return value) as its first argument, followed by the arguments passed to the `action`.
* `initialState`: The value you want the state to be initially. It can be any serializable value (a value that can be converted to JSON). React ignores this argument after invoking the action for the first time.
* **optional** `permalink`: A string containing the unique page URL that this form modifies. For use on pages with [React Server Components](/reference/rsc/server-components) with progressive enhancement (allowing the form to work before JavaScript loads): if `reducerAction` is a [Server Function](/reference/rsc/server-functions) and the form is submitted before the JavaScript bundle loads, the browser will navigate to the specified permalink URL rather than the current page's URL.

#### Returns {/*returns*/}

`useActionState` returns an array with exactly three values:

1. The current state. During the first render, it will match the `initialState` you passed. After the action is invoked, it will match the value returned by the `reducerAction`.
2. An `action` function that you call inside [Actions](/reference/react/useTransition#functions-called-in-starttransition-are-called-actions).
3. The `isPending` flag that tells you whether there is a pending Action.

#### Caveats {/*caveats*/}

* React queues and executes multiple calls to `action` sequentially so the `reducerAction` can be called with the previous result of the Action. This is by design: in order to trigger side effects based on the previous result, you have to wait for the previous `action` to finish to know its result.
* `useActionState` is a Hook, so it must be called **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a new component and move the state into it.
* The `action` function has a stable identity, so you will often see it omitted from Effect dependencies, but including it will not cause the Effect to fire. If the linter lets you omit a dependency without errors, it is safe to do. [Learn more about removing Effect dependencies.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)
* When using the `permalink` option, ensure the same form component is rendered on the destination page (including the same `reducerAction` and `permalink`) so React knows how to pass the state through. Once the page becomes interactive, this parameter has no effect.
* Calling `action` during render throws an error: "Cannot update form state while rendering."
* If `action` throws an error, React cancels all subsequent queued actions, and shows the nearest [error boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). To dispatch new actions after an error boundary catches an error, the component must remount (the action queue is cleared when the error boundary renders).
* If the component unmounts while `isPending` is true, any pending actions will complete but their state updates are silently ignored. React will not show an "update on unmounted component" warning.

<Pitfall>

When calling the `action` function, you must wrap the call in [`startTransition`](/reference/react/startTransition). If you call `action` without `startTransition`, the `isPending` flag will not update correctly, and React will show a warning in development.

</Pitfall>

### `reducerAction` function {/*reduceraction*/}

The `reducerAction` function passed to `useActionState` receives the previous state and returns a new state, similar to the `reducer` passed to `useReducer`. However, the similarity ends there—`reducerAction` is designed for async operations with side effects, not pure synchronous state logic.

Unlike the `reducer` in `useReducer`, the `reducerAction` can be async and perform side effects: 

```js
async function reducerAction(previousState, update) {
  const newState = await post(update);
  return newState;
}

function MyCart({initialCart}) {
  const [state, action, isPending] = useActionState(reducerAction, initialCart);
  // ...
}
```

For each call to `action`, React calls the `reducerAction` to perform side effects and compute the result of that Action. If the `action` is called multiple times, React queues and executes them in order so the result of the previous call is available for current call.

#### Parameters {/*reduceraction-parameters*/}

* `previousState`: The current state of the Action. Initially this is equal to the `initialState`. After the first call to `action`, it's equal to the last state returned.

* `update`: The argument passed to `action`. It can be a value of any type. Similar to `useReducer` conventions, it is usually an object with a `type` property identifying it and, optionally, other properties with additional information.

#### Returns {/*reduceraction-returns*/}

`reducerAction` returns the new state, and triggers a re-render with that state.

#### Caveats {/*reduceraction-caveats*/}

* Unlike `useReducer`, the `reducerAction` for `useActionState` is not invoked twice in StrictMode. This is because the `reducer` for `useReducer` must be pure (without side effects), but the `reducerAction` for `useActionState` is designed to allow side-effects. However, the component using `useActionState` may still double-render in StrictMode. Calling `action` in event handlers is fine (the handler only runs once), but be careful with calling `action` in Effects—the Effect may run twice in development.

<Note>

Despite the "reducer" in its name, `reducerAction` is not a pure reducer like those used with `useReducer` or Redux. It can be async and perform side effects. See ["Why is it called reducerAction?"](#why-reduceraction-name) below for more details.

</Note>

<DeepDive>

#### Why is it called reducerAction? {/*why-reduceraction-name*/}

The name comes from its function signature: `(previousState, payload) => newState`. This matches the classic reducer pattern where the new state is computed from the previous state plus some input.

However, the similarities to Redux reducers end at the signature:

| | reducerAction | Redux/useReducer |
|---|---|---|
| **Purity** | Can have side effects | Must be pure |
| **Async** | Can be async | Must be sync |
| **StrictMode** | Called once | Called twice |
| **Purpose** | Handle async operations | Compute next state |

The `reducerAction` is called a "reducer" because it *reduces* the previous state and an action into a new state. But unlike traditional reducers, it's designed to perform the async work itself rather than describing what happened. If the term is confusing, you can think of it as an "action handler" or "async state updater" instead.

</DeepDive>

---

## Usage {/*usage*/}

### Update state based on an Action {/*update-state-based-on-an-action*/}

Call `useActionState` at the top level of your component to create state for the result of an Action.

```js [[1, 7, "count"], [2, 7, "action"], [3, 7, "isPending"]]
import { useActionState } from 'react';

async function increment(prevCount) {
  // ...
}
function Counter() {
  const [count, action, isPending] = useActionState(increment, 0);
  
  // ...
}
```

`useActionState` returns an array with exactly three items:

1. The <CodeStep step={1}>current state</CodeStep>, initially set to the initial state you provided.
2. The <CodeStep step={2}>`action` function</CodeStep> that lets you trigger the action.
3. The <CodeStep step={3}>pending state</CodeStep> that tells you whether `action` is in progress.

To trigger the Action, call the <CodeStep step={2}>`action` function</CodeStep> inside an Action prop or [`startTransition`](/reference/react/startTransition). React will call your `reducerAction` with the previous state and argument passed to `action`, and return the new <CodeStep step={1}>state</CodeStep>.

<Sandpack>

```js src/App.js
import { useActionState, startTransition } from 'react';

async function increment(prevCount) {
  await new Promise(resolve => setTimeout(resolve, 500));
  return prevCount + 1;
}

export default function Counter() {
  const [count, action, isPending] = useActionState(increment, 0);

  function handleClick() {
    startTransition(() => {
      action();
    });
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>
        {isPending ? 'Incrementing...' : 'Increment'}
      </button>
    </div>
  );
}
```

```css
div {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
```

</Sandpack>



<DeepDive>

#### How is useActionState different from useReducer? {/*useactionstate-vs-usereducer*/}

`useActionState` and `useReducer` both let you update state based on the previous state, but they serve different purposes:

| | useActionState | useReducer |
|---|---|---|
| **Designed for** | Async operations with side effects | Pure sync state logic |
| **Function purity** | Can have side effects, async | Must be pure, sync |
| **StrictMode behavior** | Called once | Called twice (to detect impurities) |
| **Pending state** | Built-in `isPending` | Manual tracking |
| **Queuing** | Automatically queues async calls | Immediate sync updates |

**Use `useReducer`** when you have complex state logic with multiple sub-values or when the next state depends on the previous one in a predictable, synchronous way. The reducer must be pure.

**Use `useActionState`** when you need to call an async function (like a server request) and track its pending and result state. The `reducerAction` is designed to perform side effects.

#### Related Hooks {/*related-hooks*/}

**[`useFormStatus`](/reference/react-dom/hooks/useFormStatus)** reads the submission status of a parent `<form>`. Use it in child components to access `pending`, `data`, `method`, and `action` without prop drilling. Unlike `useActionState`, it doesn't manage state—it only reads form status.

**`useState` + `useTransition`** is a manual alternative. You can achieve similar behavior by combining these hooks yourself, but `useActionState` bundles the pending state, action queuing, and state updates into a single hook with less boilerplate.

#### When not to use useActionState {/*when-not-to-use*/}

- **Simple synchronous state:** Use [`useState`](/reference/react/useState) for state that updates immediately without async operations.
- **Complex synchronous logic:** Use [`useReducer`](/reference/react/useReducer) when you have multiple related state values or complex update logic that doesn't involve async operations.

</DeepDive>

### Migrating from other patterns {/*migrating-from-other-patterns*/}

If you have existing code that manually tracks loading and error state, you can simplify it with `useActionState`.

**Before: Manual state management**

```js
const [data, setData] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

async function handleSubmit(formData) {
  setIsLoading(true);
  setError(null);
  try {
    const result = await submitToServer(formData);
    setData(result);
  } catch (e) {
    setError(e.message);
  } finally {
    setIsLoading(false);
  }
}
```

**After: Using useActionState**

```js
const [state, action, isPending] = useActionState(async (prev, formData) => {
  try {
    const result = await submitToServer(formData);
    return { data: result, error: null };
  } catch (e) {
    return { data: prev.data, error: e.message };
  }
}, { data: null, error: null });
```

The `useActionState` version eliminates the boilerplate of managing `isLoading` manually and ensures correct state updates even when multiple submissions are queued.

#### When to use data fetching libraries instead {/*when-to-use-data-fetching-libraries*/}

`useActionState` is designed for **mutations**—actions that change data on the server and need to track pending state. For **data fetching**, consider using dedicated libraries like React Query, SWR, or your framework's data loading primitives.

Use data fetching libraries when you need:
- **Caching:** Avoid refetching data you already have
- **Background refetching:** Keep data fresh automatically
- **Deduplication:** Prevent duplicate requests for the same data
- **Optimistic updates with rollback:** Complex undo logic on failure

Use `useActionState` when you need:
- **Sequential execution:** Each action waits for the previous one
- **Form submissions:** Mutations triggered by user input
- **Pending state for mutations:** Show loading state during server updates

<Note>

#### How action queuing works {/*how-action-queuing-works*/}

When you call `action` multiple times, React queues them and processes them sequentially in the order they were called. While actions are queued:

- **No intermediate renders:** React does not re-render between queued actions. Each action receives the state returned by the previous action, and a single render occurs after all queued actions complete.
- **`isPending` stays `true`:** The pending state remains `true` until all queued actions finish processing.
- **Errors cancel the queue:** If an action throws an error, React cancels all remaining queued actions and shows the nearest error boundary.

This queuing behavior ensures that each action can depend on the result of the previous one, which is essential for sequential operations like form submissions.

</Note>

---

### Combine with useOptimistic for optimistic updates {/*combine-with-useoptimistic*/}

For the best user experience, you can combine `useActionState` with [`useOptimistic`](/reference/react/useOptimistic) to show immediate UI feedback while the server request is in progress. The optimistic state displays instantly, and reverts automatically if the action fails.

This pattern works well for interactions like toggling a like button, where you want the UI to respond immediately:

<Sandpack>

```js src/App.js
import { useActionState, useOptimistic, startTransition } from 'react';
import { toggleLikeOnServer } from './actions.js';

export default function LikeButton({ initialLiked }) {
  const [state, action, isPending] = useActionState(
    async (prevState) => {
      const result = await toggleLikeOnServer(!prevState.liked);
      if (result.error) {
        return { liked: prevState.liked, error: result.error };
      }
      return { liked: result.liked, error: null };
    },
    { liked: initialLiked ?? false, error: null }
  );

  const [optimisticLiked, setOptimisticLiked] = useOptimistic(state.liked);

  function handleClick() {
    startTransition(() => {
      setOptimisticLiked(!optimisticLiked);
      action();
    });
  }

  return (
    <div>
      <button onClick={handleClick} disabled={isPending}>
        {optimisticLiked ? '❤️ Liked' : '🤍 Like'}
      </button>
      {state.error && <p className="error">{state.error}</p>}
    </div>
  );
}
```

```js src/actions.js hidden
export async function toggleLikeOnServer(newLiked) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Simulate occasional server errors
  if (Math.random() < 0.3) {
    return { error: 'Failed to save. Please try again.' };
  }
  return { liked: newLiked };
}
```

```css
.error {
  color: red;
}
```

</Sandpack>

When the button is clicked:
1. `setOptimisticLiked` immediately updates the UI to show the new like state
2. `action()` sends the request to the server
3. If the server succeeds, the `state.liked` updates to match the optimistic value
4. If the server fails, the optimistic state automatically reverts to the previous value

Use this pattern when you want instant feedback but still need to track server results and handle errors gracefully.

---

### Pass arguments to the Action {/*pass-arguments-to-action*/}

You can pass arguments to the `reducerAction` through the `action` function. The `reducerAction` receives the previous state as its first argument, followed by any arguments you pass to `action`.

<Sandpack>

```js src/App.js
import { useActionState, startTransition } from 'react';

async function changeCount(prevCount, amount) {
  await new Promise(resolve => setTimeout(resolve, 500));
  return prevCount + amount;
}

export default function Counter() {
  const [count, action, isPending] = useActionState(changeCount, 0);

  function handleIncrement() {
    startTransition(() => {
      action(1);
    });
  }

  function handleDecrement() {
    startTransition(() => {
      action(-1);
    });
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleDecrement}>-1</button>
      <button onClick={handleIncrement}>+1</button>
      {isPending && <p>Updating...</p>}
    </div>
  );
}
```

```css
div {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

div > div {
  display: flex;
  gap: 8px;
}
```

</Sandpack>

---

### Handle errors and display structured state {/*handle-errors-structured-state*/}

The state can be any **serializable value** (a value that can be converted to JSON), including objects. This is useful for tracking success/error states and returning additional information from the action.

When making HTTP requests, you should handle different types of errors:
- **Network errors**: When the request fails to reach the server (e.g., no internet connection)
- **HTTP errors**: When the server responds with a 4xx or 5xx status code
- **Validation errors**: When the server returns field-specific validation errors

<Sandpack>

```js src/App.js
import { useState, useActionState, startTransition } from 'react';

async function submitData(prevState, formData) {
  const name = formData.name;

  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      // Handle HTTP errors
      if (response.status === 400) {
        // Validation errors from server
        const data = await response.json();
        return { success: false, fieldErrors: data.errors };
      }
      // Server errors (5xx) or other client errors (4xx)
      return { success: false, error: 'Server error. Please try again.' };
    }

    const data = await response.json();
    return { success: true, message: `Saved "${data.name}"` };
  } catch (e) {
    // Handle network errors (fetch throws when network fails)
    return { success: false, error: 'Network error. Check your connection.' };
  }
}

export default function DataForm() {
  const [name, setName] = useState('');
  const [result, action, isPending] = useActionState(submitData, null);

  function handleSubmit() {
    startTransition(() => {
      action({ name });
    });
  }

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
        disabled={isPending}
      />
      <button onClick={handleSubmit} disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
      {result?.success && <p className="success">{result.message}</p>}
      {result?.fieldErrors?.name && (
        <p className="error">{result.fieldErrors.name}</p>
      )}
      {result?.error && <p className="error">{result.error}</p>}
    </div>
  );
}
```

```js src/server.js hidden
// This simulates a server API endpoint.
// In a real app, this would be your backend.

export async function handleRequest(name) {
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate validation errors (400)
  if (!name || name.trim() === '') {
    return {
      status: 400,
      body: { errors: { name: 'Name is required' } }
    };
  }

  if (name.length < 3) {
    return {
      status: 400,
      body: { errors: { name: 'Name must be at least 3 characters' } }
    };
  }

  // Simulate occasional server errors (500)
  if (Math.random() < 0.2) {
    return { status: 500, body: { message: 'Internal server error' } };
  }

  // Success
  return { status: 200, body: { name } };
}
```

```js src/index.js hidden
import { handleRequest } from './server.js';

// Mock the fetch API to simulate server responses
const originalFetch = window.fetch;
window.fetch = async (url, options) => {
  if (url === '/api/submit') {
    const body = JSON.parse(options.body);
    const result = await handleRequest(body.name);
    return {
      ok: result.status >= 200 && result.status < 300,
      status: result.status,
      json: async () => result.body
    };
  }
  return originalFetch(url, options);
};

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```css
div {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 300px;
}

.success {
  color: green;
}

.error {
  color: red;
}
```

</Sandpack>

The example above demonstrates a complete error handling pattern:

1. **Try/catch** wraps the entire request to catch network failures
2. **`response.ok`** checks for HTTP errors (status 200-299 is ok, anything else is not)
3. **Status code checking** distinguishes validation errors (400) from server errors (5xx)
4. **Structured error state** separates field-specific errors (`fieldErrors`) from general errors (`error`)

---

### Queue multiple actions {/*queue-multiple-actions*/}

When you call `action` multiple times, React queues and executes them sequentially. Each `action` receives the state returned by the previous `action`. The component does not re-render between queued actions—React waits until all queued actions complete before updating the UI.

<Sandpack>

```js src/App.js
import { useActionState, startTransition } from 'react';

let nextId = 0;

async function addItem(prevItems, name) {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...prevItems, { id: nextId++, name }];
}

export default function ShoppingList() {
  const [items, action, isPending] = useActionState(addItem, []);

  function handleAddMultiple() {
    startTransition(() => {
      action('Apples');
      action('Bananas');
      action('Oranges');
    });
  }

  return (
    <div>
      <button onClick={handleAddMultiple} disabled={isPending}>
        {isPending ? 'Adding items...' : 'Add 3 items'}
      </button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

```css
div {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

ul {
  margin: 0;
  padding-left: 20px;
}
```

</Sandpack>

<Note>

If the `reducerAction` throws an error, React cancels all remaining queued `action` calls and shows the nearest error boundary. To prevent this, catch errors within your `reducerAction` and return an error state instead of throwing.

</Note>

---

### Using action state in action props {/*using-action-state-in-action-props*/}

When you pass the `action` function to a component that exposes an [Action prop](/reference/react/useTransition#exposing-action-props-from-components), you don't need to wrap the call in `startTransition` yourself. The component handles the transition internally.

This example shows an `App` that uses `useActionState` for the count and passes `action` to `SubmitButton`'s `action` prop:

<Sandpack>

```js src/App.js active
import { useActionState } from 'react';
import SubmitButton from './SubmitButton';
import { incrementOnServer } from './actions.js';

async function increment(count) {
  await incrementOnServer();
  return count + 1;
}

export default function App() {
  const [count, action, isPending] = useActionState(increment, 0);

  return (
    <div>
      <SubmitButton action={action} isPending={isPending}>
        Increment
      </SubmitButton>
      <p>Count: {count}</p>
    </div>
  );
}
```

```js src/SubmitButton.js
import { startTransition } from 'react';

export default function SubmitButton({ action, isPending, children }) {
  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => action())}
    >
      {isPending ? 'Submitting...' : children}
    </button>
  );
}
```

```js src/actions.js hidden
export async function incrementOnServer() {
  await new Promise(resolve => setTimeout(resolve, 1000));
}
```

```css
div {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
```

</Sandpack>

The `SubmitButton` component wraps the `action` call in `startTransition`, so `isPending` updates correctly. This pattern lets you build reusable button components that handle transitions internally.

---

### Use with a form {/*use-with-a-form*/}

The `action` function can be passed as the `action` prop to a form. When used this way, React automatically wraps the submission in a transition, so you don't need to call `startTransition` yourself. The `reducerAction` receives the previous state and the submitted `FormData`.

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import EditName from './EditName';

export default function App() {
  const [name, setName] = useState('Taylor');

  function handleSubmit(newName) {
    startTransition(() => {
      setName(newName);
    });
  }

  return <EditName name={name} onSubmit={handleSubmit} />;
}
```

```js src/EditName.js active
import { useActionState } from 'react';
import { updateName } from './actions.js';

export default function EditName({ name, onSubmit }) {
  const [state, formAction, isPending] = useActionState(submitAction, null);

  async function submitAction(prevState, formData) {
    const newName = formData.get('name');
    const result = await updateName(newName);
    if (result.error) {
      return result;
    }
    onSubmit(result.name);
    return null;
  }

  return (
    <form action={formAction}>
      <p>Your name is: {name}</p>
      <label>
        Change it:
        <input
          type="text"
          name="name"
          disabled={isPending}
        />
      </label>
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  );
}
```

```js src/actions.js hidden
export async function updateName(name) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (!name || name.trim() === '') {
    return { error: 'Name cannot be empty' };
  }
  return { name };
}
```

```css
form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 300px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.error {
  color: red;
}
```

</Sandpack>

In this example, when the user submits the form, `useActionState` calls the `reducerAction` with the form data. The `reducerAction` validates the name, calls the server, and either returns an error state or calls `onSubmit` to update the parent.

When used with a [Server Function](/reference/rsc/server-functions), `useActionState` allows the server's response to be shown before hydration (when React attaches to server-rendered HTML) completes. You can also use the optional `permalink` parameter for progressive enhancement (allowing the form to work before JavaScript loads) on pages with dynamic content.

---

## Troubleshooting {/*troubleshooting*/}

### My action can no longer read the submitted form data {/*action-cant-read-form-data*/}

When you use `useActionState`, the `reducerAction` receives an extra argument as its first argument: the previous or initial state. The submitted form data is therefore its second argument instead of its first.

```js
// Without useActionState
function action(formData) {
  const name = formData.get('name');
}

// With useActionState
function action(prevState, formData) {
  const name = formData.get('name');
}
```

---

### My `isPending` flag is not updating {/*ispending-not-updating*/}

If you're calling the action manually (not through a form's `action` prop), make sure you wrap the call in [`startTransition`](/reference/react/startTransition):

```js
import { useActionState, startTransition } from 'react';

function MyComponent() {
  const [state, action, isPending] = useActionState(myAction, null);

  function handleClick() {
    // ✅ Correct: wrap in startTransition
    startTransition(() => {
      action();
    });
  }

  // ...
}
```

When the action is passed to a form's `action` prop or a button's `formAction` prop, React automatically wraps it in a transition.

---

### I'm getting an error: "Cannot update form state while rendering" {/*cannot-update-during-render*/}

You cannot call `action` during render. This causes an infinite loop because calling `action` schedules a state update, which triggers a re-render, which calls `action` again.

```js
function MyComponent() {
  const [state, action, isPending] = useActionState(myAction, null);

  // ❌ Wrong: calling action during render
  action();

  // ...
}
```

Only call `action` in response to user events (like form submissions or button clicks) or in Effects.

---

### My actions are being skipped {/*actions-skipped*/}

If you call `action` multiple times and some of them don't run, it may be because an earlier `action` call threw an error. When an `reducerAction` throws, React skips all subsequently queued `action` calls.

To handle this, catch errors within your `reducerAction` and return an error state instead of throwing:

```js
async function myReducerAction(prevState, data) {
  try {
    const result = await submitData(data);
    return { success: true, data: result };
  } catch (error) {
    // ✅ Return error state instead of throwing
    return { success: false, error: error.message };
  }
}
```

---

### I want to reset the state {/*reset-state*/}

`useActionState` doesn't provide a built-in reset function. To reset the state, you can design your `reducerAction` to handle a reset signal:

```js
const initialState = { name: '', error: null };

async function formAction(prevState, payload) {
  // Handle reset
  if (payload === null) {
    return initialState;
  }
  // Normal action logic
  const result = await submitData(payload);
  return result;
}

function MyComponent() {
  const [state, action, isPending] = useActionState(formAction, initialState);

  function handleReset() {
    startTransition(() => {
      action(null); // Pass null to trigger reset
    });
  }

  // ...
}
```

Alternatively, you can add a `key` prop to the component using `useActionState` to force it to remount with fresh state.
