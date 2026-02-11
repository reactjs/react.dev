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
| `'use server'` directive | Not supported | Marks server actions callable from client |
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
| `'use server'` | Web Worker (server) | Marks server actions. Can be module-level (all exports are actions) or function-level. Callable from client via props or form `action`. |

**Directive detection** is a string match on the first non-comment statement. The directive must appear exactly as `'use client';` or `'use server';` (single or double quotes, semicolon optional).

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
| `/src/styles.css` | Base styles |

### No External Dependencies

`<SandpackRSC>` does not support external npm packages. Only `react` and `react-dom` are available. Do not include `package.json` in RSC examples.

---

## Constraints and Pitfalls

### What Server Components Cannot Do

| Cannot | Reason |
|--------|--------|
| Use hooks (`useState`, `useEffect`, etc.) | Server components are stateless, run once |
| Attach event handlers (`onClick`, `onChange`) | No interactivity on server |
| Access browser APIs (`window`, `document`, `localStorage`) | Runs in Web Worker, not browser |
| Import client components without `'use client'` | Client code must be explicitly marked |
| Use `useContext` | Context is a client concept |

### What Client Components Cannot Do

| Cannot | Reason |
|--------|--------|
| Be `async` | Client components render synchronously |
| Import server-only files directly | Would execute server code in browser |
| Use `'use server'` at module level | That marks a server actions file |
| Read from databases or file systems | Runs in browser |

### Sucrase Compilation Limitations

| Limitation | Detail |
|------------|--------|
| No TypeScript type erasure for complex generics | Sucrase handles basic TS but not all edge cases |
| No decorators | Not supported by Sucrase |
| No dynamic `import()` | Worker module system uses synchronous `require()` |
| CommonJS output only (server side) | Server files compiled to CJS with `var` declarations |

### Other Constraints

| Constraint | Detail |
|------------|--------|
| FormData serialization | FormData is not structurally cloneable for `postMessage`; serialized as `[key, value]` entries and reconstructed in Worker |
| Module resolution | Custom `resolvePath()` — only relative paths (`./`, `../`) with `.js`, `.jsx`, `.ts`, `.tsx` extensions. No `node_modules` resolution. |
| CSS imports | `require('*.css')` returns empty object. No CSS bundling in the Worker. |
| Circular dependencies | Partially supported — partially populated exports returned during circular `require()` |
| React version | Client: `^19.2.1` via Sandpack CDN. Server: pinned to pre-bundled version in `worker-bundle.source.js`. Must stay in sync. |

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

### Data Flow (14 Steps)

1. MDX parser extracts code blocks from `<SandpackRSC>` children
2. `createFileMap()` converts code blocks to Sandpack file map
3. `sandpack-rsc-setup.ts` injects infrastructure files (client bridge, worker bundle, webpack shim)
4. `SandpackProvider` initializes Sandpack with custom bundler URL
5. Sandpack compiles client files and boots the iframe
6. `RscFileBridge` listens for Sandpack `done` events
7. `RscFileBridge` posts all raw file contents to iframe via `postMessage`
8. `rsc-client.source.js` receives files, classifies by directive
9. Client files compiled by Sucrase and registered as webpack modules
10. Server files + manifest sent to Worker via `postMessage` (`deploy` message)
11. Worker compiles server files with Sucrase to CJS, executes with `new Function()`
12. Worker calls `renderToReadableStream()` from `react-server-dom-webpack/server.browser`
13. Flight stream chunks sent back to client via `postMessage` with Transferable `Uint8Array` buffers
14. Client consumes stream with `createFromReadableStream()`, renders via React DOM `startTransition`

### Key Source Files

| File                                                             | Purpose |
|------------------------------------------------------------------|---------|
| `src/components/MDX/Sandpack/sandpack-rsc/index.tsx`             | Lazy-loading wrapper, file map extraction |
| `src/components/MDX/Sandpack/sandpack-rsc/SandpackRSCRoot.tsx`   | SandpackProvider setup, custom bundler URL, UI layout |
| `src/components/MDX/Sandpack/sandpack-rsc/RscFileBridge.tsx`     | Monitors Sandpack; posts raw files to iframe |
| `src/components/MDX/Sandpack/sandpack-rsc/sandpack-rsc-setup.ts` | Loads raw source files, assembles infrastructure file map |
| `.../sandbox-code/src/worker-server.source.js`                   | Worker runtime: module system, Sucrase compilation, `renderToReadableStream()` |
| `.../sandbox-code/src/rsc-client.source.js`                      | Client bridge: Worker creation, file classification, Flight stream consumption |
| `.../sandbox-code/src/webpack-shim.source.js`                    | Minimal `__webpack_require__` / `__webpack_module_cache__` shim |
| `.../sandbox-code/src/worker-bundle.source.js`                   | Pre-bundled IIFE (generated): React server + RSDW/server + Sucrase |
| `scripts/buildRscWorker.mjs`                                     | esbuild script: bundles worker-server.source.js into worker-bundle.source.js |
| `next.config.js` (lines 49-60)                                   | Webpack `raw-loader` rule for `.source.js` files |
| `src/components/MDX/MDXComponents.tsx`                           | Registers `<SandpackRSC>` as MDX component |

---

## Build System

### Rebuilding the Worker Bundle

After modifying `worker-server.source.js` or `webpack-shim.source.js`:

```bash
node scripts/buildRscWorker.mjs
```

This runs esbuild with:
- `format: 'iife'`, `platform: 'browser'`
- `conditions: ['react-server', 'browser']` (activates React server export conditions)
- `minify: true`
- Prepends `webpack-shim.source.js` to the output

### Raw-Loader Configuration

In `next.config.js`, `.source.js` files are loaded as raw strings:

```javascript
config.module.rules.unshift({
  test: /\.source\.js$/,
  enforce: 'pre',  // Bypass Babel/react-refresh
  use: [{ loader: 'raw-loader', options: { esModule: false } }],
});
```

`enforce: 'pre'` ensures raw-loader runs before any other loaders (Babel, react-refresh).

### Custom Bundler URL

```
https://786946de.sandpack-bundler-4bw.pages.dev
```

A custom Sandpack bundler deployment on Cloudflare Pages. Configured in `SandpackRSCRoot.tsx`.

### RSDW Client Inline Import

The `react-server-dom-webpack` client module is loaded directly from `node_modules` via an inline raw-loader import in `sandpack-rsc-setup.ts`:

```typescript
const rsdwClientCode = require(
  '!!raw-loader!react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.production.js'
).default;
```

---

## Debugging

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module './Component'` | Missing file or wrong path in import | Check file names match exactly (case-sensitive) |
| `X is not a function` | Server component imported without `'use client'` in client file | Add `'use client'` directive to the importing file, or restructure imports |
| Flight stream parse error | Server code threw during render | Check server component for runtime errors (bad data, missing imports) |
| `__webpack_require__ is not defined` | Worker bundle not rebuilt after shim changes | Run `node scripts/buildRscWorker.mjs` |
| Blank preview, no errors | Infrastructure files not injected | Verify `sandpack-rsc-setup.ts` loads all `.source.js` files |
| `FormData is not defined` | Using FormData in server action without proper serialization | The system handles this automatically; check for custom FormData usage |
| Hooks in server component | `useState`/`useEffect` used without `'use client'` | Move interactive code to a client component |

### Debugging Steps

1. **Check browser console** — Flight stream errors and Worker errors surface here
2. **Check the Worker** — In DevTools, navigate to Sources > Worker threads to inspect the Worker
3. **Verify directives** — Ensure `'use client'` / `'use server'` are the first statement (no imports before them)
4. **Test in isolation** — Create a minimal `<SandpackRSC>` with just `App.js` to rule out file interaction issues
5. **Rebuild worker bundle** — After any changes to `.source.js` files: `node scripts/buildRscWorker.mjs`

### Development Commands

```bash
node scripts/buildRscWorker.mjs   # Rebuild worker bundle after source changes
yarn dev                           # Start dev server to test examples
yarn build                         # Full production build (includes worker)
```

---

## Anti-Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| `'use client'` in `App.js` | Makes entire app client-rendered, defeats RSC purpose | Keep `App.js` as server component; extract interactive parts to separate client files |
| Hooks in server component | Runtime error — hooks not available in Worker | Move to `'use client'` component |
| `import` before `'use client'` | Directive not detected (must be first statement) | Move `'use client'` to line 1 |
| `package.json` in `<SandpackRSC>` | External dependencies not supported | Remove; use only React built-ins |
| `window`/`document` in server file | Not available in Web Worker | Move to `'use client'` component |
| Server component importing client component without directive | Client code executes in Worker and fails | Add `'use client'` to the client file |
| Passing non-serializable props to client components | Flight protocol can only serialize JSON-compatible values + React elements + server references | Use serializable data; pass server actions for functions |
| `async` client component | Client components cannot be async | Only server components can be `async` |
| `<Sandpack>` instead of `<SandpackRSC>` | Standard Sandpack has no RSC support | Use `<SandpackRSC>` for RSC examples |
