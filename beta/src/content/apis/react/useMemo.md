---
title: useMemo
---

<Intro>

`useMemo` is a React Hook that lets you skip recalculating a value on a re-render.

```js
const value = useMemo(calculateValue, dependencies)
```

</Intro>

<InlineToc />

---

## Usage {/*usage*/}

### Skipping expensive recalculations {/*skipping-expensive-recalculations*/}

By default, React will re-run the entire body of your component every time that it re-renders. For example, if this `TodoList` updates its state or receives new props from its parent, the `filterTodos` function will re-run:

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

**Usually, this isn't a problem because most calculations are very fast.** However, if you're filtering or transforming a large array, or doing some other expensive computation, you might want to skip doing it again unless something has changed. If both `todos` and `tab` are the same as they were during the last render, you can instruct React to reuse the `visibleTodos` you've already calculated during the last render. This technique is called *[memoization.](https://en.wikipedia.org/wiki/Memoization)*

To declare a memoized value, wrap your calculation into a `useMemo` call at the top level of your component:

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

You need to pass two things to `useMemo`:

1. A <CodeStep step={1}>calculation function</CodeStep> that takes no arguments, like `() =>`, and returns what you wanted to calculate.
2. A <CodeStep step={2}>list of dependencies</CodeStep> including every value within your component that's used inside your calculation.

On the initial render, the <CodeStep step={3}>value</CodeStep> you'll get from `useMemo` will be the result of calling your <CodeStep step={1}>calculation</CodeStep>.

On every next render, React will compare the <CodeStep step={2}>dependencies</CodeStep> with the dependencies you passed during the last render. If none of the dependencies have changed (compared with [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useMemo` will return the value you already calculated on the last render. Otherwise, React will re-run your calculation and return the new value.

**You should only rely on this feature as a performance optimization.** If your code doesn't work at all without it, find the underlying problem and fix the code first, and only then add memoization to improve the performance.

<Note>

If your calculation doesn't fit on a single line, add curly braces and an explicit `return` statement:

```js {2-5}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
  // ...
}
```

This code is equivalent to the previous example.

</Note>

<DeepDive title="How to tell if a calculation is expensive?">

In general, unless you're creating or looping over thousands of objects, it's probably not expensive. If you want to get more confidence, you can add a console log to measure the time spent in a piece of code:

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

Perform the interaction you're measuring (for example, typing into the input). You will then see logs like `filter array: 0.15ms` in your console. If the overall logged time adds up to a significant amount (say, `1ms` or more), it might make sense to memoize that calculation. As an experiment, you can then wrap the calculation in `useMemo` to verify whether the total logged time has decreased for that interaction or not:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // Skipped if todos and tab haven't changed
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo` won't make the *first* render faster. It only helps you skip unnecessary work on updates.

Keep in mind that your machine is probably faster than your users' so it's a good idea to test the performance with an artificial slowdown. For example, Chrome offers a [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) option for this.

Also note that measuring performance in development will not give you the most accurate results. (For example, when [Strict Mode](/apis/react/StrictMode) is on, you will see each component render twice rather than once.) To get the most accurate timings, build your app for production and test it on a device like your users have.

</DeepDive>

<Recipes titleText="The difference between useMemo and calculating a value directly" titleId="examples-recalculation">

#### Skipping recalculation with `useMemo` {/*skipping-recalculation-with-usememo*/}

In this example, the `filterTodos` implementation is **artificially slowed down** so that you can see what happens when some JavaScript function you're calling during rendering is genuinely slow. Try switching the tabs and toggling the theme.

When you switch the tabs, `filterTodos` gets called. That's expected because the `tab` has changed. (It also gets called twice in development, but you should ignore this. React calls your components twice during development to help [find impure code.](/learn/keeping-components-pure))

Notice that when you switch the theme toggle, `filterTodos` *does not* get called. This is because both `todos` and `tab` (which you pass as dependencies to `useMemo`) are the same as they were during the last render. This is what `useMemo` enables.

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');

  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // do nothing to emulate a slow computer
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
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

#### Always recalculating a value {/*always-recalculating-a-value*/}

This example is the same as the previous one, but it doesn't have a `useMemo` call.

Try switching the theme in this example. It should feel much slower than the first one!

When you toggle the theme, the `App` component re-renders. The `TodoList` component re-renders too and receives the next props with the updated `theme`. You haven't wrapped the `filterTodos` call in `useMemo`, so you call `filterTodos` every time.

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');

  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // do nothing to emulate a slow computer
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
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
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Filtering ' + todos.length + ' todos for "' + tab + '" tab.');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
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

Quite often, code without memoization works fine. If your interactions are fast enough, you might not need memoization.

You can try increasing the number of todo items in `utils.js` and see how the behavior changes. This particular calculation wasn't very expensive to begin with, but if the number of todos grows significantly, most of the overhead will be in re-rendering rather than in the filtering. Keep reading below to see how you can optimize re-rendering with `useMemo`.

<Solution />

</Recipes>

---

### Skipping re-rendering of components {/*skipping-re-rendering-of-components*/}

By default, when a component re-renders, React re-renders all of its children recursively. This is fine for components that don't require much calculation to re-render. Components higher up the tree or slower components can opt into *skipping re-renders when their props are the same* by wrapping themselves in [`memo`](/apis/react/memo):

```js {1,7}
import { memo } from 'react';

function List({ items }) {
  // ...
}

export default memo(List);
```

For this optimization to work, the parent component that renders this `<List />` needs to ensure that, if it doesn't want `List` to re-render, every prop it passes to the `List` must be the same as on the last render.

Let's say the parent `TodoList` component looks like this:

```js {2,5}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

With the above code, the `List` optimization will not work because `visibleTodos` will be a different array on every re-render of the `TodoList` component. To fix it, wrap the calculation of `visibleTodos` in `useMemo`:

```js {2,5}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

After this change, as long as `todos` and `tab` haven't changed, thanks to `useMemo`, the `visibleTodos` won't change between re-renders. Since `List` is wrapped in [`memo`](/apis/react/memo), it will only re-render if one of its props is different from its value on the last render. You're passing the same `items` prop, so `List` can skip the re-rendering entirely.

Notice that in this example, it doesn't matter whether `filterTodos` itself is fast or slow. The point isn't to avoid a *slow calculation,* but it's to avoid *passing a different prop value every time* since that would break the [`memo`](/apis/react/memo) optimization of the child `List` component. The `useMemo` call in the parent makes `memo` work for the child.

<Recipes titleText="The difference between skipping re-renders and always re-rendering" titleId="examples-rerendering">

#### Skipping re-rendering with `useMemo` and `memo` {/*skipping-re-rendering-with-usememo-and-memo*/}

In this example, the `List` component is **artificially slowed down** so that you can see what happens when a React component you're rendering is genuinely slow. Try switching the tabs and toggling the theme.

When you switch the tabs, `<List />` gets re-rendered. Changing the `tab` causes the `visibleTodos` to be recreated. Since the `items` passed to the `List` are a different array from the `items` passed to `List` on last render, the `List` must re-render. 

However, when you switch the theme toggle, `<List />` *does not* re-render. This is because both `todos` and `tab` (which you pass as dependencies to `useMemo`) are the same as they were during the last render. This makes the `visibleTodos` the same as on the last render. In `List.js`, the `List` component is wrapped in [`memo`](/apis/react/memo), so it skips re-rendering for the same `items`.

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js TodoList.js active
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js List.js
import { memo } from 'react';

function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');

  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // do nothing to emulate a slow computer
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
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

This example is the same as the previous one, but it doesn't have a `useMemo` call.

Try switching the theme in this example. It should feel much slower than the first one!

When you toggle the theme, the `App` component re-renders. The `TodoList` component re-renders too and receives the next props with the updated theme. You haven’t wrapped the `filterTodos` call in `useMemo`, so `visibleTodos` is a different array on a re-render. When you pass the always-different `visibleTodos` to the `List` component, it has to re-render every time.

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js List.js
import { memo } from 'react';

function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');

  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // do nothing to emulate a slow computer
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
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
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js List.js
import { memo } from 'react';

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
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

Quite often, code without memoization works fine. If your interactions are fast enough, you might not need memoization.

Keep in mind that you need to run React in production mode, disable [React Developer Tools](/learn/react-developer-tools), and use devices similar to the ones your app's users have in order to get a realistic sense of what's actually slowing down your app.

<Solution />

</Recipes>

---

### Memoizing a dependency of another Hook {/*memoizing-a-dependency-of-another-hook*/}

Suppose you have a calculation that depends on a `searchOptions` object:

```js {6}
function Dropdown({ allItems, text }) {
  const searchOptions = { 
    matchMode: 'whole-word',
    text: text
  };
  const visibleItems = searchItems(allItems, searchOptions);
  // ...
}
```

You try to memoize the result of calling `searchItems`:

```js {6-8}
function Dropdown({ allItems, text }) {
  const searchOptions = { 
    matchMode: 'whole-word',
    text: text
  };
  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🔴 Memoization doesn't work: searchOptions is always new
  // ...
```

However, this doesn't improve anything: `searchItems` would still get called on each render.

Here's why this happens. Every time that a component re-renders, all of the code directly inside the component body runs again. **The lines of code creating a new `searchOptions` object will also run on every re-render.** Since `searchOptions` is a dependency of your `useMemo` call, and it's different every time, React will consider the dependencies as being different from the last time, and will have to call your `searchItems` function again.

When you can, it's best to fix this by moving the object creation *inside* the `useMemo` call:

```js {3-6,8}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { 
      matchMode: 'whole-word',
      text: text
    };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ Memoization works
  // ...
```

Now your calculation depends on `text` (which is a string and can't be unintentionally new).

Alternatively, you could memoize the `searchOptions` object *itself* before passing it as a dependency:

```js {2-7,11}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]); // ✅ Memoization works

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ Memoization works
  // ...
```

In this example, the `searchOptions` only gets recalculated when the `text` changes. Then, the `visibleItems` only gets recalculated if either `allItems` or `searchOptions` changes.

You can use a similar approach to prevent [`useEffect`](/api/react/useEffect) from firing again unnecessarily. However, there are usually better solutions than wrapping Effect dependencies in `useMemo`. Read about [removing Effect dependencies.](/learn/removing-effect-dependencies)

---

## Reference {/*reference*/}

### `useMemo(calculateValue, dependencies)` {/*usememo*/}

Call `useMemo` at the top level of your component to declare a memoized value:

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
}
```

[See more examples above.](#examples-recalculation)

#### Parameters {/*parameters*/}

* `calculateValue`: The function calculating the value that you want to memoize. It should be pure, should take no arguments, and should return a value of any type. React will call your function during the initial render. On subsequent renders, React will return the same value again if the `dependencies` have not changed since the last render. Otherwise, it will call `calculateValue`, return its result, and store it in case it can be reused later.

* `dependencies`: The list of all reactive values referenced inside of the `calculateValue` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is [configured for React](/learn/editor-setup#linting), it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison algorithm.

#### Returns {/*returns*/}

On the initial render, `useMemo` returns the result of calling `calculateValue` with no arguments.

During subsequent renders, it will either return an already stored value from the last render (if the dependencies haven't changed), or call `calculateValue` again, and return the result that `calculateValue` has returned.

#### Caveats {/*caveats*/}

* `useMemo` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a new component and move the state into it.
* In Strict Mode, React will **call your calculation function twice** in order to [help you find accidental impurities](#my-calculation-runs-twice-on-every-re-render). This is development-only behavior and does not affect production. If your calculation function is pure (as it should be), this should not affect the logic of your component. The result from one of the calls will be ignored.

---

## Troubleshooting {/*troubleshooting*/}

### My calculation runs twice on every re-render {/*my-calculation-runs-twice-on-every-re-render*/}

In [Strict Mode](/apis/react/StrictMode), React will call some of your functions twice instead of once:

```js {2,5,6}
function TodoList({ todos, tab }) {
  // This component function will run twice for every render.

  const visibleTodos = useMemo(() => {
    // This calculation will run twice if any of the dependencies change.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

This is expected and shouldn't break your code.

This **development-only** behavior helps you [keep components pure](/learn/keeping-components-pure). React uses the result of one of the calls, and ignores the result of the other call. As long as your component and calculation functions are pure, this shouldn't affect your logic. However, if they are accidentally impure, this helps you notice the mistakes and fix it.

For example, this impure calculation function mutates an array you received as a prop:

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 Mistake: mutating a prop
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

Because React calls your calculation twice, you'll see the todo was added twice, so you'll know that there is a mistake. Your calculation can't change the objects that it received, but it can change any *new* objects you created during the calculation. For example, if `filterTodos` always returns a *different* array, you can mutate *that* array:

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ Correct: mutating an object you created during the calculation
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

Read [keeping components pure](/learn/keeping-components-pure) to learn more about purity.

Also, check out the guides on [updating objects](/learn/updating-objects-in-state) and [updating arrays](/learn/updating-arrays-in-state) without mutation.

---


### My `useMemo` call is supposed to return an object, but returns undefined {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

Be careful when returning an object from an arrow function. This code works:

```js
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

This code doesn't work:

```js {1-2}
  // 🔴 You can't return an object from an arrow function with () => {
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

In JavaScript, `() => {` starts the arrow function body, so the `{` brace is not a part of your object. This is why it doesn't return an object, and leads to confusing mistakes. You could fix it by adding parentheses:

```js {1,4}
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

However, it's much clearer to write a `return` statement explicitly.

---

### Every time my component renders, the calculation in `useMemo` re-runs {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

Make sure you've specified the dependency array as a second argument!

If you forget the dependency array, `useMemo` will re-run the calculation every time:

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 Recalculates every time: no dependency array
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

This is the corrected version passing the dependency array as a second argument:

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ Does not recalculate unnecessarily
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

If this doesn't help, then the problem is that at least one of your dependencies is different from the previous render. You can debug this problem by manually logging your dependencies to the console:

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

You can then right-click on the arrays from different re-renders in the console and select "Store as a global variable" for both of them. Assuming the first one got saved as `temp1` and the second one got saved as `temp2`, you can then use the browser console to check whether each dependency in both arrays is the same:

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // Is the third dependency the same between the arrays?
```

When you find which dependency is breaking memoization, either find a way to remove it, or [memoize it as well.](#memoizing-a-dependency-of-another-hook)
