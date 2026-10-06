---
title: experimental_optimisticKey
version: experimental
---

<Experimental>

**This API is experimental and is not available in a stable version of React yet.**

You can try it by upgrading React packages to the most recent experimental version:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Experimental versions of React may contain bugs. Don't use them in production.

</Experimental>

<Intro>

`optimisticKey` lets you create temporary keys for new items.

```js
import { optimisticKey } from 'react';

<Item key={optimisticKey} item={optimisticItem} />
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `optimisticKey` {/*optimistickey*/}

`optimisticKey` is a special value you can use as a `key` prop for elements that represent optimistic items -- items shown immediately before the server confirms them. When the transition completes and the real item renders in the same position, React transfers the component state from the optimistic element to the real one, instead of destroying and recreating it.

```js
import { useOptimistic, optimisticKey } from 'react';

const [optimisticItems, addOptimisticItem] = useOptimistic(
  items,
  (current, newItem) => [
    ...current,
    { id: optimisticKey, text: newItem.text }
  ]
);

// In JSX:
{optimisticItems.map(item => (
  <Item key={item.id} text={item.text} />
))}
```

[See more examples below.](#usage)

#### Returns {/*returns*/}

`optimisticKey` is a Symbol value. Pass it as the `key` prop to an element to mark it as an optimistic placeholder. When the transition settles and a real-keyed element appears in the same slot, React transfers the component state from the optimistic element to the real one.

#### Caveats {/*caveats*/}

* `optimisticKey` matches by position (slot) in the list, not by content or identity. If items are removed or reordered between the optimistic render and the final render, state may transfer to the wrong component.
* An old `optimisticKey` matches a new real key (state transfers from optimistic to real), but a new `optimisticKey` does **not** match an old real key. It is specifically for *new* items that don't have a real key yet.
* `React.Children.map()`, `React.Children.forEach()`, and similar helpers don't support `optimisticKey` and fall back to index-based behavior. In development, React logs an error.
* In React Server Components, if any part of a key path uses `optimisticKey`, the entire key collapses to `optimisticKey`.

---

## Usage {/*usage*/}

### Preserving state when adding items optimistically {/*preserving-state-when-adding-items-optimistically*/}

When you optimistically add items to a list with [`useOptimistic`](/reference/react/useOptimistic), you need to assign a `key` to each new element. If you use a fake key like `crypto.randomUUID()`, React destroys the component when the real item arrives with a different key -- losing all component state like focus, scroll position, or expanded/collapsed state. `optimisticKey` tells React to transfer the component state to whatever real-keyed element appears in the same position when the transition completes.

In this example, each todo has an expandable detail view. Expand a todo right after adding it -- the expanded state is preserved when the server responds:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { addTodo } from './actions.js';
import TodoList from './TodoList';

export default function App() {
  const [todos, setTodos] = useState([
    { id: '1', text: 'Learn React' },
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
import { useState, useOptimistic, startTransition, optimisticKey } from 'react';

function TodoItem({ text, pending }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <li>
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? '\u25BC' : '\u25B6'}
      </button>
      {' '}
      {text}
      {pending && ' (Saving...)'}
      {expanded && <p style={{ marginLeft: 24 }}>Details for: {text}</p>}
    </li>
  );
}

export default function TodoList({ todos, addTodoAction }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (currentTodos, newTodo) => [
      ...currentTodos,
      { id: optimisticKey, text: newTodo.text, pending: true }
    ]
  );

  function handleAddTodo(text) {
    startTransition(async () => {
      addOptimisticTodo({ text });
      await addTodoAction({ text });
    });
  }

  return (
    <div>
      <button onClick={() => handleAddTodo('New todo')}>
        Add Todo
      </button>
      <ul>
        {optimisticTodos.map(todo => (
          <TodoItem
            key={todo.id}
            text={todo.text}
            pending={todo.pending}
          />
        ))}
      </ul>
    </div>
  );
}
```

```js src/actions.js hidden
let nextId = 2;
export async function addTodo(todo) {
  await new Promise((res) => setTimeout(res, 1000));
  return { id: String(nextId++), text: todo.text };
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Note>

Compare this to the [`useOptimistic`](/reference/react/useOptimistic#optimistically-adding-to-a-list) example, which uses `crypto.randomUUID()` as the key. That approach works for showing optimistic items, but loses component state when the real item replaces it. Use `optimisticKey` when your list items have internal state you want to preserve.

</Note>

---

### Adding multiple optimistic items {/*adding-multiple-optimistic-items*/}

Each `optimisticKey` usage represents a separate slot. If you add multiple optimistic items (for example, by submitting multiple times before the first completes), each optimistic item gets its own `optimisticKey` and matches by position to the corresponding real item when the transitions settle.

```js
// Each optimistic item gets its own optimisticKey.
// They match to real items by position.
const [optimisticItems, addItem] = useOptimistic(
  items,
  (current, newItem) => [...current, { id: optimisticKey, text: newItem }]
);

// If you submit "A" then "B" before "A" completes,
// both render with optimisticKey. When the transitions
// settle, the first optimistic item transfers its state
// to the first new real item, and the second to the second.
```

React matches optimistic items to real items in the order they appear. The first optimistic item transfers its state to the first new real item, the second optimistic item to the second new real item, and so on.

---

## Troubleshooting {/*troubleshooting*/}

### I'm getting an error: "React.Children helpers don't support optimisticKey" {/*react-children-helpers-dont-support-optimistickey*/}

You may see this error:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

React.Children helpers don't support optimisticKey.

</ConsoleLogLine>

</ConsoleBlockMulti>

`React.Children.map()`, `React.Children.forEach()`, and other helpers don't support `optimisticKey`. They fall back to index-based behavior. If you need to transform children that may have `optimisticKey`, render them directly instead of using `React.Children` helpers.

---

### My component state wasn't preserved {/*my-component-state-wasnt-preserved*/}

`optimisticKey` uses slot-based (position-based) matching. React assumes the real item will render in the same position as the optimistic item. If items are removed or reordered between the optimistic render and the final render, the positions may not line up, and state could transfer to the wrong component or not transfer at all.

To minimize issues:

- Avoid removing saved items while optimistic items are pending.
- Add optimistic items at the end of the list.
- Keep the list structure stable during the transition.

---

### My optimistic item matched an existing item it shouldn't have {/*my-optimistic-item-matched-an-existing-item*/}

`optimisticKey` matching is one-directional. An old `optimisticKey` will match a new real key (state transfers out). But a new `optimisticKey` will **not** match an old real key. This is by design -- `optimisticKey` is not a wildcard key.

If you are optimistically *updating* an existing item (not adding a new one), you already know the item's key. Use [`useOptimistic`](/reference/react/useOptimistic) with the item's real key instead:

```js
// ✅ For updating existing items, use the real key
const [optimisticTodos, updateTodo] = useOptimistic(
  todos,
  (current, updated) =>
    current.map(todo =>
      todo.id === updated.id ? { ...todo, ...updated } : todo
    )
);

// 🚩 Don't use optimisticKey for existing items
// optimisticKey is only for NEW items without a real key
```
