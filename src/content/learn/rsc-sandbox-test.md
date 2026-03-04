---
title: RSC Sandbox Test
---

## Basic Server Component {/*basic-server-component*/}

<SandpackRSC>

```js src/App.js
export default function App() {
  return <h1>Hello from a Server Component!</h1>;
}
```

</SandpackRSC>

## Server + Client Components {/*server-client*/}

<SandpackRSC>

```js src/App.js
import Counter from './Counter';

export default function App() {
  return (
    <div>
      <h1>Server Component</h1>
      <p>This text is rendered on the server.</p>
      <Counter />
    </div>
  );
}
```

```js src/Counter.js
'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

</SandpackRSC>

## Async Server Component with Suspense {/*async-suspense*/}

<SandpackRSC>

```js src/App.js
import { Suspense } from 'react';
import Albums from './Albums';

export default function App() {
  return (
    <div>
      <h1>Music</h1>
      <Suspense fallback={<p>Loading albums...</p>}>
        <Albums />
      </Suspense>
    </div>
  );
}
```

```js src/Albums.js
async function fetchAlbums() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return ['Abbey Road', 'Let It Be', 'Revolver'];
}

export default async function Albums() {
  const albums = await fetchAlbums();
  return (
    <ul>
      {albums.map(album => (
        <li key={album}>{album}</li>
      ))}
    </ul>
  );
}
```

</SandpackRSC>

## Streaming Proof {/*streaming-proof*/}

This demo proves streaming is incremental. The shell renders instantly with a `<Suspense>` fallback. After 2 seconds the async component streams in and replaces it — without re-rendering the outer content. The timestamps show the gap.

<SandpackRSC>

```js src/App.js
import { Suspense } from 'react';
import SlowData from './SlowData';
import Timestamp from './Timestamp';

export default function App() {
  return (
    <div>
      <h1>Streaming Proof</h1>
      <p>Shell rendered at: <Timestamp /></p>
      <Suspense fallback={<p>⏳ Waiting for data to stream in...</p>}>
        <SlowData />
      </Suspense>
    </div>
  );
}
```

```js src/SlowData.js
import Timestamp from './Timestamp';

async function fetchData() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return ['Chunk A', 'Chunk B', 'Chunk C'];
}

export default async function SlowData() {
  const items = await fetchData();
  return (
    <div>
      <p>Data streamed in at: <Timestamp /></p>
      <ul>
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/Timestamp.js
'use client';

export default function Timestamp() {
  return <strong>{new Date().toLocaleTimeString()}</strong>;
}
```

</SandpackRSC>

## Flight Data Types {/*flight-data-types*/}

This demo passes Map, Set, Date, and BigInt from a server component through the Flight stream to a client component, proving the full Flight protocol type system works end-to-end.

<SandpackRSC>

```js src/App.js
import DataViewer from './DataViewer';

export default function App() {
  const map = new Map([
    ['alice', 100],
    ['bob', 200],
  ]);
  const set = new Set(['react', 'next', 'remix']);
  const date = new Date('2025-06-15T12:00:00Z');
  const big = 9007199254740993n;

  return (
    <div>
      <h1>Flight Data Types</h1>
      <DataViewer map={map} set={set} date={date} big={big} />
    </div>
  );
}
```

```js src/DataViewer.js
'use client';

export default function DataViewer({ map, set, date, big }) {
  const checks = [
    ['Map', map instanceof Map, () => (
      <ul>{[...map.entries()].map(([k, v]) => <li key={k}>{k}: {v}</li>)}</ul>
    )],
    ['Set', set instanceof Set, () => (
      <ul>{[...set].map(v => <li key={v}>{v}</li>)}</ul>
    )],
    ['Date', date instanceof Date, () => (
      <p>{date.toISOString()}</p>
    )],
    ['BigInt', typeof big === 'bigint', () => (
      <p>{big.toString()}</p>
    )],
  ];

  return (
    <div>
      {checks.map(([label, passed, render]) => (
        <div key={label} style={{ marginBottom: 12 }}>
          <strong>{label}: {passed ? 'pass' : 'FAIL'}</strong>
          {render()}
        </div>
      ))}
    </div>
  );
}
```

</SandpackRSC>

## Promise Streaming with use() {/*promise-streaming-use*/}

The server creates a promise (resolves in 2s) and passes it as a prop through a parent async component that suspends for 3s. When the parent reveals at ~3s, the promise is already resolved — so `use()` returns instantly with no inner fallback. The elapsed time should be ~3000ms (the parent's delay), not ~5000ms (which would mean the promise restarted on the client).

<SandpackRSC>

```js src/App.js
import { Suspense } from 'react';
import SlowParent from './SlowParent';
import UserCard from './UserCard';

async function fetchUser() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { name: 'Alice', role: 'Engineer' };
}

function now() {
  return Date.now();
}

export default function App() {
  const serverTime = now();
  const userPromise = fetchUser();
  return (
    <div>
      <h1>Promise Streaming</h1>
      <p>Promise resolves in 2s. Parent suspends for 3s.</p>
      <Suspense fallback={<p>Outer: waiting for parent (3s)...</p>}>
        <SlowParent>
          <Suspense fallback={<p>Inner: waiting for data (should not appear!)</p>}>
            <UserCard userPromise={userPromise} serverTime={serverTime} />
          </Suspense>
        </SlowParent>
      </Suspense>
    </div>
  );
}
```

```js src/SlowParent.js
export default async function SlowParent({ children }) {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return <div>{children}</div>;
}
```

```js src/UserCard.js
'use client';
import { use } from 'react';

function now() {
  return Date.now();
}
export default function UserCard({ userPromise, serverTime }) {
  const user = use(userPromise);
  const elapsed = now() - serverTime;
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: 8,
      padding: 16,
    }}>
      <strong>{user.name}</strong>
      <p>{user.role}</p>
      <p style={{ fontSize: 13 }}>
        Rendered {elapsed}ms after server created the promise.
      </p>
      <p style={{ color: '#666', fontSize: 12 }}>
        ~3000ms = promise already resolved, waited only for parent.
        ~5000ms would mean the promise restarted on the client.
      </p>
    </div>
  );
}
```

</SandpackRSC>

## Flight Data Types in Server Actions {/*flight-data-types-actions*/}

This demo sends Map, Set, Date, and BigInt from a client component *to* a server action via `encodeReply`/`decodeReply`, then verifies the types survived the round trip.

<SandpackRSC>

```js src/App.js
import { testTypes, getResults } from './actions';
import TestButton from './TestButton';

export default async function App() {
  const results = await getResults();
  return (
    <div>
      <h1>Flight Types in Server Actions</h1>
      <TestButton testTypes={testTypes} />
      {results ? (
        <div>
          {results.map(r => (
            <div key={r.label} style={{ marginBottom: 12 }}>
              <strong>{r.label}: {r.ok ? 'pass' : 'FAIL'}</strong>
              <p>{r.detail}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Click the button to send typed data to the server action.</p>
      )}
    </div>
  );
}
```

```js src/actions.js
'use server';

let results = null;

export async function testTypes(map, set, date, big) {
  results = [
    {
      label: 'Map',
      ok: map instanceof Map,
      detail: map instanceof Map
        ? 'entries: ' + JSON.stringify([...map.entries()])
        : 'received: ' + typeof map,
    },
    {
      label: 'Set',
      ok: set instanceof Set,
      detail: set instanceof Set
        ? 'values: ' + JSON.stringify([...set])
        : 'received: ' + typeof set,
    },
    {
      label: 'Date',
      ok: date instanceof Date,
      detail: date instanceof Date
        ? date.toISOString()
        : 'received: ' + typeof date,
    },
    {
      label: 'BigInt',
      ok: typeof big === 'bigint',
      detail: typeof big === 'bigint'
        ? big.toString()
        : 'received: ' + typeof big,
    },
  ];
}

export async function getResults() {
  return results;
}
```

```js src/TestButton.js
'use client';
import { useTransition } from 'react';

export default function TestButton({ testTypes }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await testTypes(
        new Map([['alice', 100], ['bob', 200]]),
        new Set(['react', 'next', 'remix']),
        new Date('2025-06-15T12:00:00Z'),
        9007199254740993n
      );
    });
  }

  return (
    <button onClick={handleClick} disabled={pending}>
      {pending ? 'Sending...' : 'Send typed data to server'}
    </button>
  );
}
```

</SandpackRSC>

## Server Action Mutation + Re-render {/*action-mutation-rerender*/}

The server action mutates server-side data and returns a confirmation string. The updated list is only visible because the framework automatically re-renders the entire server component tree after the action completes — the server component re-reads the data and streams the new UI to the client.

<SandpackRSC>

```js src/App.js
import { getTodos } from './db';
import { createTodo } from './actions';
import AddTodo from './AddTodo';

export default function App() {
  const todos = getTodos();
  return (
    <div>
      <h1>Todo List</h1>
      <p style={{ color: '#666', fontSize: 13 }}>
        This list is rendered by a server component
        reading server-side data. It only updates because
        the server re-renders after each action.
      </p>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>{todo}</li>
        ))}
      </ul>
      <AddTodo createTodo={createTodo} />
    </div>
  );
}
```

```js src/db.js
let todos = ['Buy groceries'];

export function getTodos() {
  return [...todos];
}

export function addTodo(text) {
  todos.push(text);
}
```

```js src/actions.js
'use server';
import { addTodo } from './db';

export async function createTodo(text) {
  if (!text) return 'Please enter a todo.';
  addTodo(text);
  return 'Added: ' + text;
}
```

```js src/AddTodo.js
'use client';
import { useState, useTransition } from 'react';

export default function AddTodo({ createTodo }) {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();
    startTransition(async () => {
      const result = await createTodo(text);
      setMessage(result);
      setText('');
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="New todo"
        />
        <button disabled={pending}>
          {pending ? 'Adding...' : 'Add'}
        </button>
      </form>
      {message && (
        <p style={{ color: '#666', fontSize: 13 }}>
          Action returned: "{message}"
        </p>
      )}
    </div>
  );
}
```

</SandpackRSC>

## Inline Server Actions {/*inline-server-actions*/}

Server actions defined inline inside a server component with `'use server'` on the function body. The action closes over module-level state and is passed as a prop — no separate `actions.js` file needed.

<SandpackRSC>

```js src/App.js
import LikeButton from './LikeButton';

let count = 0;

export default function App() {
  async function addLike() {
    'use server';
    count++;
  }

  return (
    <div>
      <h1>Inline Server Actions</h1>
      <p>Likes: {count}</p>
      <LikeButton addLike={addLike} />
    </div>
  );
}
```

```js src/LikeButton.js
'use client';

export default function LikeButton({ addLike }) {
  return (
    <form action={addLike}>
      <button type="submit">Like</button>
    </form>
  );
}
```

</SandpackRSC>

## Server Functions {/*server-functions*/}

<SandpackRSC>

```js src/App.js
import { addLike, getLikeCount } from './actions';
import LikeButton from './LikeButton';

export default async function App() {
  const count = await getLikeCount();
  return (
    <div>
      <h1>Server Functions</h1>
      <p>Likes: {count}</p>
      <LikeButton addLike={addLike} />
    </div>
  );
}
```

```js src/actions.js
'use server';

let count = 0;

export async function addLike() {
  count++;
}

export async function getLikeCount() {
  return count;
}
```

```js src/LikeButton.js
'use client';

export default function LikeButton({ addLike }) {
  return (
    <form action={addLike}>
      <button type="submit">Like</button>
    </form>
  );
}
```

</SandpackRSC>