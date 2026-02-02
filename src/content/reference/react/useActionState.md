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
* `initialState`: The value you want the state to be initially. React ignores this argument after invoking the action for the first time.
* **optional** `permalink`: A string containing the unique page URL that this form modifies.
  * For use on pages with [React Server Components](/reference/rsc/server-components) with progressive enhancement.
  * If `reducerAction` is a [Server Function](/reference/rsc/server-functions) and the form is submitted before the JavaScript bundle loads, the browser will navigate to the specified permalink URL rather than the current page's URL.

#### Returns {/*returns*/}

`useActionState` returns an array with exactly three values:

1. The current state. During the first render, it will match the `initialState` you passed. After the action is invoked, it will match the value returned by the `reducerAction`.
2. An `action` function that you call inside [Actions](/reference/react/useTransition#functions-called-in-starttransition-are-called-actions).
3. The `isPending` flag that tells you whether there is a pending Action.

#### Caveats {/*caveats*/}

* `useActionState` is a Hook, so it must be called **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a new component and move the state into it.
* React queues and executes multiple calls to `action` sequentially, allowing each `reducerAction` to use the result of the previous Action.
* The `action` function has a stable identity, so you will often see it omitted from Effect dependencies, but including it will not cause the Effect to fire. If the linter lets you omit a dependency without errors, it is safe to do. [Learn more about removing Effect dependencies.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)
* When using the `permalink` option, ensure the same form component is rendered on the destination page (including the same `reducerAction` and `permalink`) so React knows how to pass the state through. Once the page becomes interactive, this parameter has no effect.
* When using Server Functions, `initialState` needs to be serializable (values like plain objects, arrays, strings, and numbers).
* If `action` throws an error, React cancels all queued actions and shows the nearest [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary).

<Pitfall>

When calling the `action` function, you must wrap the call in [`startTransition`](/reference/react/startTransition). If you call `action` without `startTransition`, the `isPending` flag will not update correctly, and React will show a warning in development.

</Pitfall>

---

### `reducerAction` function {/*reduceraction*/}

The `reducerAction` function passed to `useActionState` receives the previous state and returns a new state.

Unlike reducers in `useReducer`, the `reducerAction` can be async and perform side effects:

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

Each time you call `action`, React calls the `reducerAction` to perform side effects and compute the result of that Action. If the `action` is called multiple times, React queues and executes them in order so the result of the previous call is available for current call.

#### Parameters {/*reduceraction-parameters*/}

* `previousState`: The current state of the Action. Initially this is equal to the `initialState`. After the first call to `action`, it's equal to the last state returned.

* `update`: The argument passed to `action`. It can be a value of any type. Similar to `useReducer` conventions, it is usually an object with a `type` property identifying it and, optionally, other properties with additional information.

#### Returns {/*reduceraction-returns*/}

`reducerAction` returns the new state, and triggers a re-render with that state.

#### Caveats {/*reduceraction-caveats*/}

* `reducerAction` is not invoked twice in StrictMode since `reducerAction` is designed to allow side effects.

<DeepDive>

#### Why is it called `reducerAction`? {/*why-is-it-called-reduceraction*/}

The function passed to `useActionState` is called a *reducer action* because:

- It *reduces* the previous state into a new state, like `useReducer`.
- It's called inside a Transition and can perform side effects, like an Action.

Conceptually, `useActionState` is like `useReducer`, but you can do side effects in the reducer.

</DeepDive>

---

## Usage {/*usage*/}

### Adding state to an Action {/*adding-state-to-an-action*/}

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
2. The <CodeStep step={2}>`action` function</CodeStep> that lets you trigger the `reducerAction`.
3. The <CodeStep step={3}>pending state</CodeStep> that tells you whether `action` is in progress.

To trigger the Action, call the <CodeStep step={2}>`action` function</CodeStep> inside an [Action](/reference/react/useTransition#functions-called-in-starttransition-are-called-actions). React will call your `reducerAction` with the previous state and argument passed to `action`, and return the new <CodeStep step={1}>state</CodeStep>.

<Sandpack>

```js src/App.js
import { useActionState, startTransition } from 'react';
import { addToCart } from './api';
import Total from './Total';

async function addTicket(prevCount) {
  return await addToCart(prevCount);
}

export default function Checkout() {
  const [count, action, isPending] = useActionState(addTicket, 0);

  function handleClick() {
    startTransition(() => {
      action();
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span>{isPending && '🌀 '}Qty: {count}</span>
      </div>
      <div className="row">
        <button onClick={handleClick}>Add Ticket</button>
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </div>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>{isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}</span>
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}
```

</Sandpack>

Every time you click "Add Ticket," React queues a call to `addTicket`. React shows the pending state until all of the tickets are added, and then re-renders with the final state.

<DeepDive>

#### How `useActionState` queuing works {/*how-useactionstate-queuing-works*/}

Try clicking "Add Ticket" multiple times. Every time you click, a new `addTicket` is queued. Since there's an artificial 1 second delay, that means 4 clicks will take ~4 seconds to complete.

**This is intentional in the design of `useActionState`.** 

We have to wait for the previous result of `addTicket` in order to pass the `prevCount` to the next call to `addTicket`. That means React has to wait for the previous Action to finish before calling the next Action. 

You can typically solve this by [using with useOptimistic](/reference/react/useActionState#using-with-useoptimistic) but for more complex cases you may want to consider [cancelling queued actions](#cancelling-queued-actions) or not using `useActionState`.

</DeepDive>

### Using multiple Action types {/*using-multiple-action-types*/}

To handle multiple types, you can pass an argument to `action`. 

By convention, it is common to write it as a switch statement. For each case in the switch, calculate and return some next state. The argument can have any shape, but it is common to pass objects with a `type` property identifying the action.

<Sandpack>

```js src/App.js
import { useActionState, startTransition } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, action, isPending] = useActionState(updateCart, 0);

  function handleAdd() {
    startTransition(() => {
      action({type: 'ADD'});
    });
  }

  function handleRemove() {
    startTransition(() => {
      action({type: 'REMOVE'});
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span className="stepper">
          <span className="pending">{isPending && '🌀'}</span>
          <span className="qty">{count}</span>
          <span className="buttons">
            <button onClick={handleAdd}>▲</button>
            <button onClick={handleRemove}>▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={count} />
    </div>
  );
}

async function updateCart(prevCount, update) {
  switch (update.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>{formatter.format(quantity * 9999)}</span>
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

<DeepDive>

#### How is `useActionState` different from `useReducer`? {/*useactionstate-vs-usereducer*/}

You might notice this example looks a lot like `useReducer`, but they serve different purposes:

- **Use `useReducer`** to manage state of your UI. The reducer must be pure.

- **Use `useActionState`** to manage state of your Actions. The reducer can perform side effects.

You can think of `useActionState` as `useReducer` for side effects from user Actions. Since it computes the next Action to take based on the previous Action, it has to [order the calls sequentially](/reference/react/useActionState#how-useactionstate-queuing-works). If you want to perform Action in parallel, use `useState` and `useTransition` directly.

</DeepDive>

---

### Using with Action props {/*using-with-action-props*/}

When you pass the `action` function to a component that exposes an [Action prop](/reference/react/useTransition#exposing-action-props-from-components), you don't need to wrap the call in `startTransition` yourself. The component handles the transition internally.

This example shows using the `increaseAction` and `decreaseAction` props of a QuantityStepper component:


<Sandpack>

```js src/App.js
import { useActionState } from 'react';
import { addToCart, removeFromCart } from './api';
import QuantityStepper from './QuantityStepper';
import Total from './Total';

export default function Checkout() {
  const [count, action, isPending] = useActionState(updateCart, 0);

  function addAction() {
    action({type: 'ADD'});
  }

  function removeAction() {
    action({type: 'REMOVE'});
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <QuantityStepper
          value={count}
          increaseAction={addAction}
          decreaseAction={removeAction}
        />
      </div>
      <hr />
      <Total quantity={count} />
    </div>
  );
}

async function updateCart(prevCount, update) {
  switch (update.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/QuantityStepper.js
import { useTransition } from 'react';

export default function QuantityStepper({value, increaseAction, decreaseAction}) {
  const [isPending, startTransition] = useTransition();

  function handleIncrease() {
    startTransition(async () => {
      await increaseAction();
    });
  }

  function handleDecrease() {
    startTransition(async () => {
      await decreaseAction();
    });
  }

  return (
    <span className="stepper">
      <span className="pending">{isPending && '🌀'}</span>
      <span className="qty">{value}</span>
      <span className="buttons">
        <button onClick={handleIncrease}>▲</button>
        <button onClick={handleDecrease}>▼</button>
      </span>
    </span>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>{formatter.format(quantity * 9999)}</span>
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

Since `<QuantityStepper>` has built-in support for pending state, the loading indicator is shown automatically.

---

### Using with `useOptimistic` {/*using-with-useoptimistic*/}

You can combine `useActionState` with [`useOptimistic`](/reference/react/useOptimistic) to show immediate UI feedback:


<Sandpack>

```js src/App.js
import { useActionState, useOptimistic } from 'react';
import { addToCart, removeFromCart } from './api';
import QuantityStepper from './QuantityStepper';
import Total from './Total';

async function updateCart(prevCount, update) {
  switch (update.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}

export default function Checkout() {
  const [count, action, isPending] = useActionState(updateCart, 0);
  const [optimisticCount, setOptimisticCount] = useOptimistic(count);

  async function addAction() {
    setOptimisticCount(c => c + 1);
    await action({type: 'ADD'});
  }

  async function removeAction() {
    setOptimisticCount(c => Math.max(0, c - 1));
    await action({type: 'REMOVE'});
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <QuantityStepper
          value={optimisticCount}
          increaseAction={addAction}
          decreaseAction={removeAction}
        />
      </div>
      <hr />
      <Total quantity={optimisticCount} isPending={isPending} />
    </div>
  );
}
```

```js src/QuantityStepper.js
import { useTransition } from 'react';

export default function QuantityStepper({value, increaseAction, decreaseAction}) {
  const [isPending, startTransition] = useTransition();

  function handleIncrease() {
    startTransition(async () => {
      await increaseAction();
    });
  }

  function handleDecrease() {
    startTransition(async () => {
      await decreaseAction();
    });
  }

  return (
    <span className="stepper">
      <span className="pending">{isPending && '🌀'}</span>
      <span className="qty">{value}</span>
      <span className="buttons">
        <button onClick={handleIncrease}>▲</button>
        <button onClick={handleDecrease}>▼</button>
      </span>
    </span>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>{isPending ? '🌀' : ''}{formatter.format(quantity * 9999)}</span>
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>


When the stepper arrow is clicked, `setOptimisticCount` immediately updates the quantity, and `action()` queues the `updateCart`. We show a pending indicator on both the quantity and total to give the user feedback that their update is still being applied.

---

### Using with `<form>` action props {/*use-with-a-form*/}

The `action` function can be passed as the `action` prop to a `<form>`.

When used this way, React automatically wraps the submission in a transition, so you don't need to call `startTransition` yourself. The `reducerAction` receives the previous state and the submitted `FormData`:

<Sandpack>

```js src/App.js
import { useActionState, useOptimistic } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, action, isPending] = useActionState(updateCart, 0);
  const [optimisticCount, setOptimisticCount] = useOptimistic(count);

  async function formAction(formData) {
    const type = formData.get('type');
    if (type === 'ADD') {
      setOptimisticCount(c => c + 1);
    } else {
      setOptimisticCount(c => Math.max(0, c - 1));
    }
    return action(formData);
  }

  return (
    <form action={formAction} className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span className="stepper">
          <span className="pending">{isPending && '🌀'}</span>
          <span className="qty">{optimisticCount}</span>
          <span className="buttons">
            <button type="submit" name="type" value="ADD">▲</button>
            <button type="submit" name="type" value="REMOVE">▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={optimisticCount} isPending={isPending} />
    </form>
  );
}

async function updateCart(prevCount, formData) {
  const type = formData.get('type');
  switch (type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>{isPending ? '🌀' : ''}{formatter.format(quantity * 9999)}</span>
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

In this example, when the user clicks the stepper arrows, the button submits the form and `useActionState` calls `updateCart` with the form data. The action uses `useOptimistic` to immediately show the new quantity while the server confirms the update.

<RSC>

When used with a [Server Function](/reference/rsc/server-functions), `useActionState` allows the server's response to be shown before hydration (when React attaches to server-rendered HTML) completes. You can also use the optional `permalink` parameter for progressive enhancement (allowing the form to work before JavaScript loads) on pages with dynamic content. This is typically handled by your framework for you.

</RSC>

---

### Cancelling queued Actions {/*cancelling-queued-actions*/}

You can use an AbortController pattern to cancel pending Actions:

<Sandpack>

```js src/App.js
import { useActionState, useOptimistic, useRef } from 'react';
import { addToCart, removeFromCart } from './api';
import QuantityStepper from './QuantityStepper';
import Total from './Total';

export default function Checkout() {
  const abortRef = useRef(null);
  const [count, action, isPending] = useActionState(updateCart, 0);
  
  const [optimisticCount, setOptimisticCount] = useOptimistic(count);

  async function addAction() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    setOptimisticCount(c => c + 1);
    await action({type: 'ADD', signal: abortRef.current.signal});
  }

  async function removeAction() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    setOptimisticCount(c => Math.max(0, c - 1));
    await action({type: 'REMOVE', signal: abortRef.current.signal});
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <QuantityStepper
          value={optimisticCount}
          increaseAction={addAction}
          decreaseAction={removeAction}
        />
      </div>
      <hr />
      <Total quantity={optimisticCount} isPending={isPending} />
    </div>
  );
}


async function updateCart(prevCount, update) {
  switch (update.type) {
    case 'ADD': {
      try {
        return await addToCart(prevCount, {signal: update.signal});
      } catch (e) {
        return prevCount + 1;
      }
    }
    case 'REMOVE': {
      try {
        return await removeFromCart(prevCount, {signal: update.signal});
      } catch (e) {
        return prevCount - 1;
      }
    }
  }
  return prevCount;
}
```

```js src/QuantityStepper.js
import { useTransition } from 'react';

export default function QuantityStepper({value, increaseAction, decreaseAction}) {
  const [isPending, startTransition] = useTransition();

  function handleIncrease() {
    startTransition(async () => {
      await increaseAction();
    });
  }

  function handleDecrease() {
    startTransition(async () => {
      await decreaseAction();
    });
  }

  return (
    <span className="stepper">
      <span className="pending">{isPending && '🌀'}</span>
      <span className="qty">{value}</span>
      <span className="buttons">
        <button onClick={handleIncrease}>▲</button>
        <button onClick={handleDecrease}>▼</button>
      </span>
    </span>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>{isPending ? '🌀' : ''}{formatter.format(quantity * 9999)}</span>
    </div>
  );
}
```

```js src/api.js hidden
class AbortError extends Error {
  name = "AbortError";
  constructor(message = "The operation was aborted") {
    super(message);
  }
}

function sleep(ms, signal){
  if (!signal) return new Promise((resolve) => setTimeout(resolve, ms));
  if (signal.aborted) return Promise.reject(new AbortError());

    return new Promise((resolve, reject) => {
      const id = setTimeout(() => {
        signal.removeEventListener("abort", onAbort);
        resolve();
      }, ms);
    
      const onAbort = () => {
        clearTimeout(id);
        reject(new AbortError());
      };
    
      signal.addEventListener("abort", onAbort, { once: true });
    });
}
export async function addToCart(count, opts) {
  await sleep(1000, opts?.signal);
  return count + 1;
}

export async function removeFromCart(count, opts) {
  await sleep(1000, opts?.signal);
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

Try clicking increase or decrease multiple times, and notice that the total updates within 1 second no matter how many times you click. This works because we're using an AbortController to "complete" the previous Action so the next Action can proceed.

<Pitfall>

Aborting an Action isn't always safe, which is why `useActionState` doesn't do it by default.

</Pitfall>

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

If you call `action` multiple times and some of them don't run, it may be because an earlier `action` call threw an error. When a `reducerAction` throws, React skips all subsequently queued `action` calls.

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
