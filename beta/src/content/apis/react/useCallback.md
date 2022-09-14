---
title: useCallback
---

<Intro>

`useCallback` is a React Hook that lets you cache a function definition between re-renders.

```js
const memoizedFn = useCallback(fn, dependencies)
```

</Intro>

<InlineToc />

---

## Usage {/*usage*/}

### Skipping re-rendering of components {/*skipping-re-rendering-of-components*/}

By default, when a component re-renders, React re-renders all of its children recursively. This is fine for components that don't require much calculation to re-render. Components higher up the tree or slower components can opt into *skipping re-renders when their props are the same* by wrapping themselves in [`memo`](/apis/react/memo):

```js {1,7}
import { memo } from 'react';

function ShippingForm({ onSubmit }) {
  // ...
}

export default memo(ShippingForm);
```

Let's say the `ProductPage` component passes a `handleSubmit` function to that `ShippingForm` component:

```js {2-7,11}
function ProductPage({ product, referrerId, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + product.id + '/buy', {
      orderDetails,
      referrerId
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

Suppose the user toggles the theme, and the `ProductPage` receives a different `theme` prop. You might expect that `ShippingForm` will skip re-rendering because its props are not affected by the `theme`.

Unfortunately, even if only the `theme` changes, the `ShippingForm` will have to re-render. Its [`memo`](/apis/react/memo) optimization will not work because the value of the `onSubmit` prop will be *different on every re-render.* In JavaScript, `function() {}` and `() => {}` function declarations always create a *different* function, similar to how `{}` creates a *different* object. By passing `handleSubmit`, you always pass a *different* function to `ShippingForm`.

**To prevent `handleSubmit` from changing on every re-render, wrap its definition into the `useCallback` Hook:**

```js [[3, 4, "handleSubmit"], [2, 9, "[product, referrerId]"]]
import { useCallback } from 'react';

function ProductPage({ product, referrerId, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + product.id + '/buy', {
      orderDetails,
      referrerId
    });
  }, [product, referrerId]);
  // ...
```


You need to pass two things to `useCallback`:

1. A function that you want to pass down to the child component.
2. A <CodeStep step={2}>list of dependencies</CodeStep> including every value within your component that's used inside your function.

On the initial render, the <CodeStep step={3}>returned function</CodeStep> you'll get from `useCallback` will be the function you passed.

On every next render, React will compare the <CodeStep step={2}>dependencies</CodeStep> with the dependencies you passed during the last render. If none of the dependencies have changed (compared with [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useCallback` will return the function you passed on the *last* render. Otherwise, React will return the function you passed on *this* render.

In other words, `useCallback` will cache your function, and return it on re-renders until the dependencies change. If both `product` and `referrerId` are the same as before, the `ProductPage` will pass the *same* `handleSubmit` function to the `ShippingForm`. The `ShippingForm` is wrapped in [`memo`](/apis/react/memo), so it will skip a render with same props.

<Note>

**You should only rely on `useCallback` as a performance optimization.** If your code doesn't work without it, find the underlying problem and fix it first. Then you may add `useCallback` to improve performance.

</Note>

<DeepDive title="How is useCallback related to useMemo?">

You will often see [`useMemo`](/apis/react/useMemo) alongside `useCallback`. They are both useful when you're trying to optimize a child component. They let you [memoize](https://en.wikipedia.org/wiki/Memoization) (or, in other words, cache) something you're passing down:

```js {4-6,8-13,17}
import { useMemo, useCallback } from 'react';

function ProductPage({ product, referrerId }) {
  const requirements = useMemo(() => { // Calls your function and caches its result
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // Caches your function itself
    post('/product/' + product.id + '/buy', {
      orderDetails,
      referrerId
    });
  }, [product, referrerId]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

The difference is in *what* they're letting you cache:

* **[`useMemo`](/apis/react/useMemo) caches the *result* of calling your function.** In this example, it caches the result of calling `computeRequirements(product)` so that it doesn't change unless `product` has changed. This lets you pass the `requirements` object down without unnecessarily re-rendering `ShippingForm`. When necessary, React will call the function you've passed during rendering to calculate the result.
* **`useCallback` caches *the function itself.*** Unlike `useMemo`, it does not call the function you provide. Instead, it caches the function you provided so that `handleSubmit` *itself* doesn't change unless `product` or `referrerId` has changed. This lets you pass the `handleSubmit` function down without unnecessarily re-rendering `ShippingForm`. Your code won't be called until the user submits the form.

If you're already familiar with [`useMemo`,](/apis/react/useMemo) you might find it helpful to think of `useCallback` as this:

```js
// Simplified implementation (inside React)
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[Read more about the difference between `useMemo` and `useCallback`.](/apis/react/useMemo#memoizing-a-function)

</DeepDive>

<Recipes titleText="The difference between useCallback and declaring a function directly" titleId="examples-rerendering">

#### Skipping re-rendering with `useCallback` and `memo` {/*skipping-re-rendering-with-usecallback-and-memo*/}

In this example, the `ShippingForm` component is **artificially slowed down** so that you can see what happens when a React component you're rendering is genuinely slow. Try incrementing the counter and toggling the theme.

When you increment the counter, the `ShippingForm` re-renders. Since its rendering is artificially slowed down, the interaction feels slow. Then try toggling the theme. You'll notice that toggling the theme is fast because the slowed-down `ShippingForm` component skips re-rendering. It is able to skip re-rendering because it's wrapped in [`memo`](/apis/react/memo) *and* the props passed to it are the same as during the last render. Specifically, the `handleSubmit` function does not change between the re-renders thanks to `useCallback`. Its dependencies (`product` and `referrerId`) have not changed, so `useCallback` returns a cached function.

<Sandpack>

```js App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

const product = {
  id: 123,
  name: 'A hot air balloon'
};

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        product={product}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

function sendData(product, orderDetails, referrerId) {
  console.log('POST /products/' + product.id + '/buy?ref=' + referrerId);
  console.log(orderDetails);
}
```

```js ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ product, referrerId, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + product.id + '/buy', {
      orderDetails,
      referrerId
    });
  }, [product, referrerId]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js ShippingForm.js
import { memo, useState } from 'react';

function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default memo(ShippingForm);
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Always re-rendering a component {/*always-re-rendering-a-component*/}

This example is the same as the previous one, but it doesn't have a `useCallback` call.

Try switching the theme in this example. It should feel much slower than the first one!

When you toggle the theme, the `App` component re-renders. The `ProductPage` component re-renders too and creates a new `handleSubmit` function. Creating a function by itself is not a problem, but it passes this function down to the **artificially slowed down** `ShippingForm` component. Although `ShippingForm` is wrapped in [`memo`,](/apis/react/memo) it can't skip re-rendering because its `onSubmit` prop is different from the last time. Toggling the theme feels slow even though `ShippingForm` doesn't use `theme`.

<Sandpack>

```js App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

const product = {
  id: 123,
  name: 'A hot air balloon'
};

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        product={product}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

function sendData(product, orderDetails, referrerId) {
  console.log('POST /products/' + product.id + '/buy?ref=' + referrerId);
  console.log(orderDetails);
}
```

```js ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ product, referrerId, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + product.id + '/buy', {
      orderDetails,
      referrerId
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js ShippingForm.js
import { memo, useState } from 'react';

function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default memo(ShippingForm);
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


However, here is the same code **with the artificial slowdown removed:**

<Sandpack>

```js App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

const product = {
  id: 123,
  name: 'A hot air balloon'
};

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        product={product}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

function sendData(product, orderDetails, referrerId) {
  console.log('POST /products/' + product.id + '/buy?ref=' + referrerId);
  console.log(orderDetails);
}
```

```js ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ product, referrerId, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + product.id + '/buy', {
      orderDetails,
      referrerId
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js ShippingForm.js
import { memo, useState } from 'react';

function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('Rendering <ShippingForm />');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default memo(ShippingForm);
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


Quite often, code without memoization works fine. If your interactions are fast enough, you don't need memoization.

Keep in mind that you need to run React in production mode, disable [React Developer Tools](/learn/react-developer-tools), and use devices similar to the ones your app's users have in order to get a realistic sense of what's actually slowing down your app.

<Solution />

</Recipes>

---

### Updating state from a memoized callback {/*updating-state-from-a-memoized-callback*/}

Sometimes, you might need to update state based on previous state from a memoized callback.

This `handleAddTodo` function specifies `todos` as a dependency because it computes the next todos from it:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

You'll usually want your memoized functions to have as few dependencies as possible. **When you read some state only to calculate the next state, you can remove that dependency by passing an [updater function](/apis/react/useState#updating-state-based-on-the-previous-state) instead:**

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // No need for the todos dependency
  // ...
```

Here, instead of making `todos` a dependency of your function and reading it there, you pass an instruction about *how* to update the state (`todos => [...todos, newTodo]`) to React. [Read more about updater functions.](/apis/react/useState#updating-state-based-on-the-previous-state)

### Preventing an Effect from firing too often {/*preventing-an-effect-from-firing-too-often*/}

Sometimes, you might want to call a function from inside an [Effect:](/learn/synchronizing-with-effects)

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    // ...
```

This creates a problem. [Every reactive value must be declared as a dependency of your Effect.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) However, if you declare `createOptions` as a dependency, it will cause your Effect to constantly reconnect to the chat room:


```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 Problem: This dependency changes on every render
  // ...
```

To solve this, you can wrap the function you need to call from an Effect into `useCallback`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Only changes when roomId changes

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ Only changes when createOptions changes
  // ...
```

This ensures that the `createOptions` function is the same between re-renders if the `roomId` is the same. **However, it's even better to remove the need for a function dependency** by pulling the function *inside* the Effect:

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Only changes when roomId changes
  // ...
```

[Read more about removing unnecessary Effect dependencies.](/learn/removing-effect-dependencies)

---

## Reference {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

Call `useCallback` at the top level of your component to declare a memoized callback:

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ product, referrerId, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + product.id + '/buy', {
      orderDetails,
      referrerId
    });
  }, [product, referrerId]);
```

[See more examples above.](#examples-rerendering)

#### Parameters {/*parameters*/}

* `fn`: The function value that you want to memoize. It can take any arguments and return any values. React will return (not call!) your function back to you during the initial render. On subsequent renders, React will return the same function again if the `dependencies` have not changed since the last render. Otherwise, it will give you the function that you have passed during the current render, and store it in case it can be reused later. React will not call the function. The function is returned to you so you can decide when and whether to call it.

* `dependencies`: The list of all reactive values referenced inside of the `fn` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is [configured for React](/learn/editor-setup#linting), it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison algorithm.

#### Returns {/*returns*/}

On the initial render, `useCallback` returns the `fn` function you have passed.

During subsequent renders, it will either return an already stored `fn`  function from the last render (if the dependencies haven't changed), or return the `fn` function you have passed during this render.

#### Caveats {/*caveats*/}

* `useCallback` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a new component and move the state into it.
* React **will not throw away the cached function unless there is a specific reason to do that.** For example, in development, React throws away the cache when you edit the file of your component. Both in development and in production, React will throw away the cache if your component suspends during the initial mount. In the future, React may add more features that take advantage of throwing away the cache--for example, if React adds built-in support for virtualized lists in the future, it would make sense to throw away the cache for items that scroll out of the virtualized table viewport. This should match your expectations if you rely on `useCallback` as a performance optimization. Otherwise, a [state variable](/apis/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) or a [ref](/apis/react/useRef#avoiding-recreating-the-ref-contents) may be more appropriate.

---

## Troubleshooting {/*troubleshooting*/}

### Every time my component renders, `useCallback` returns a different function {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

Make sure you've specified the dependency array as a second argument!

If you forget the dependency array, `useCallback` will return a new function every time:

```js {7}
function ProductPage({ product, referrerId }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + product.id + '/buy', {
      orderDetails,
      referrerId
    });
  }); // 🔴 Returns a new function every time: no dependency array
  // ...
```

This is the corrected version passing the dependency array as a second argument:

```js {7}
function ProductPage({ product, referrerId }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + product.id + '/buy', {
      orderDetails,
      referrerId
    });
  }, [product, referrerId]); // ✅ Does not return a new function unnecessarily
  // ...
```

If this doesn't help, then the problem is that at least one of your dependencies is different from the previous render. You can debug this problem by manually logging your dependencies to the console:

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [product, referrerId]);

  console.log([product, referrerId]);
```

You can then right-click on the arrays from different re-renders in the console and select "Store as a global variable" for both of them. Assuming the first one got saved as `temp1` and the second one got saved as `temp2`, you can then use the browser console to check whether each dependency in both arrays is the same:

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

When you find which dependency is breaking memoization, either find a way to remove it, or [memoize it as well.](/api/react/useMemo#memoizing-a-dependency-of-another-hook)
