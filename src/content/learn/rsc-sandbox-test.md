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