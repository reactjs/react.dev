---
name: docs-rsc-sandpack
description: Use when adding interactive RSC (React Server Components) code examples to React docs using <SandpackRSC>, or when modifying the RSC sandpack infrastructure.
---

# RSC Sandpack Patterns

For general Sandpack conventions (code style, naming, file naming, line highlighting, hidden files, CSS guidelines), see `/docs-sandpack`. This skill covers only RSC-specific patterns.

## Quick Start Template

Minimal single-file `<SandpackRSC>` example:

```mdx
<SandpackRSC>

` ` `js src/App.js
export default function App() {
  return <h1>Hello from a Server Component!</h1>;
}
` ` `

</SandpackRSC>
```

---

## How It Differs from `<Sandpack>`

| Feature | `<Sandpack>` | `<SandpackRSC>` |
|---------|-------------|-----------------|
| Execution model | All code runs in iframe | Server code runs in Web Worker, client code in iframe |
| `'use client'` directive | Ignored (everything is client) | Required to mark client components |
| `'use server'` directive | Not supported | Marks Server Functions callable from client |
| `async` components | Not supported | Supported (server components can be async) |
| External dependencies | Supported via `package.json` | Not supported (only React + react-dom) |
| Entry point | `App.js` with `export default` | `src/App.js` with `export default` |
| Component tag | `<Sandpack>` | `<SandpackRSC>` |

---

## File Directives

Files are classified by the directive at the top of the file:

| Directive | Where it runs | Rules |
|-----------|--------------|-------|
| (none) | Web Worker (server) | Default. Can be `async`. Can import other server files. Cannot use hooks, event handlers, or browser APIs. |
| `'use client'` | Sandpack iframe (browser) | Must be first statement. Can use hooks, event handlers, browser APIs. Cannot be `async`. Cannot import server files. |
| `'use server'` | Web Worker (server) | Marks Server Functions. Can be module-level (all exports are actions) or function-level. Callable from client via props or form `action`. |

---

## Common Patterns

### 1. Server + Client Components

```mdx
<SandpackRSC>

` ` `js src/App.js
import Counter from './Counter';

export default function App() {
  return (
    <div>
      <h1>Server-rendered heading</h1>
      <Counter />
    </div>
  );
}
` ` `

` ` `js src/Counter.js
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
` ` `

</SandpackRSC>
```

### 2. Async Server Component with Suspense

```mdx
<SandpackRSC>

` ` `js src/App.js
import { Suspense } from 'react';
import Albums from './Albums';

export default function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Albums />
    </Suspense>
  );
}
` ` `

` ` `js src/Albums.js
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
` ` `

</SandpackRSC>
```

### 3. Server Functions (Actions)

```mdx
<SandpackRSC>

` ` `js src/App.js
import { addLike, getLikeCount } from './actions';
import LikeButton from './LikeButton';

export default async function App() {
  const count = await getLikeCount();
  return (
    <div>
      <p>Likes: {count}</p>
      <LikeButton addLike={addLike} />
    </div>
  );
}
` ` `

` ` `js src/actions.js
'use server';

let count = 0;

export async function addLike() {
  count++;
}

export async function getLikeCount() {
  return count;
}
` ` `

` ` `js src/LikeButton.js
'use client';

export default function LikeButton({ addLike }) {
  return (
    <form action={addLike}>
      <button type="submit">Like</button>
    </form>
  );
}
` ` `

</SandpackRSC>
```

---

## File Structure Requirements

### Entry Point

- **`src/App.js` is required** as the main entry point
- Must have `export default` (function component)
- Case-insensitive fallback: `src/app.js` also works

### Auto-Injected Infrastructure Files

These files are automatically injected by `sandpack-rsc-setup.ts` and should never be included in MDX:

| File | Purpose |
|------|---------|
| `/src/index.js` | Bootstraps the RSC pipeline |
| `/src/rsc-client.js` | Client bridge — creates Worker, consumes Flight stream |
| `/src/rsc-server.js` | Wraps pre-bundled worker runtime as ES module |
| `/node_modules/__webpack_shim__/index.js` | Minimal webpack compatibility layer |
| `/node_modules/__rsdw_client__/index.js` | `react-server-dom-webpack/client` as local dependency |

### No External Dependencies

`<SandpackRSC>` does not support external npm packages. Only `react` and `react-dom` are available. Do not include `package.json` in RSC examples.

---

## Architecture Reference

### Three-Layer Architecture

```
react.dev page (Next.js)
  ┌─────────────────────────────────────────┐
  │  <SandpackRSC>                          │
  │  ┌─────────┐  ┌──────────────────────┐  │
  │  │ Editor  │  │ Preview (iframe)     │  │
  │  │ App.js  │  │ Client React app     │  │
  │  │ (edit)  │  │ consumes Flight      │  │
  │  │         │  │ stream from Worker   │  │
  │  └─────────┘  └──────────┬───────────┘  │
  └───────────────────────────┼─────────────┘
                              │ postMessage
  ┌───────────────────────────▼─────────────┐
  │  Web Worker (Blob URL)                  │
  │  - React server build (pre-bundled)     │
  │  - react-server-dom-webpack/server      │
  │  - webpack shim                         │
  │  - User server code (Sucrase → CJS)    │
  └─────────────────────────────────────────┘
```

### Key Source Files

| File                                                            | Purpose                                                                        |
|-----------------------------------------------------------------|--------------------------------------------------------------------------------|
| `src/components/MDX/Sandpack/sandpack-rsc/RscFileBridge.tsx`    | Monitors Sandpack; posts raw files to iframe                                   |
| `src/components/MDX/Sandpack/SandpackRSCRoot.tsx`               | SandpackProvider setup, custom bundler URL, UI layout                          |
| `src/components/MDX/Sandpack/templateRSC.ts`                    | RSC template files                                                             |
| `.../sandbox-code/src/__react_refresh_init__.js`                | React Refresh shim                                                             |
| `.../sandbox-code/src/rsc-server.js`                            | Worker runtime: module system, Sucrase compilation, `renderToReadableStream()` |
| `.../sandbox-code/src/rsc-client.source.js`                     | Client bridge: Worker creation, file classification, Flight stream consumption |
| `.../sandbox-code/src/webpack-shim.js`                          | Minimal `__webpack_require__` / `__webpack_module_cache__` shim                |
| `.../sandbox-code/src/worker-bundle.dist.js`                    | Pre-bundled IIFE (generated): React server + RSDW/server + Sucrase             |
| `scripts/buildRscWorker.mjs`                                    | esbuild script: bundles rsc-server.js into worker-bundle.dist.js               |

---

## Build System

### Rebuilding the Worker Bundle

After modifying `rsc-server.js` or `webpack-shim.js`:

```bash
node scripts/buildRscWorker.mjs
```

This runs esbuild with:
- `format: 'iife'`, `platform: 'browser'`
- `conditions: ['react-server', 'browser']` (activates React server export conditions)
- `minify: true`
- Prepends `webpack-shim.js` to the output

### Raw-Loader Configuration

In `templateRSC.js` files are loaded as raw strings with the `!raw-loader`.

The strings are necessary to provide to Sandpack as local files (skips Sandpack bundling). 


### Development Commands

```bash
node scripts/buildRscWorker.mjs   # Rebuild worker bundle after source changes
yarn dev                           # Start dev server to test examples
```