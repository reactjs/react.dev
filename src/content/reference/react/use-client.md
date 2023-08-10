---
title: "'use client'"
canary: true
---

<Canary>

`'use client'` is needed only if you're [using React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) or building a library compatible with them.
</Canary>


<Intro>

`'use client'` marks source files whose components execute on the client.

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `'use client'` {/*use-client*/}

Add `'use client';` at the very top of a file to mark that the file (including any child components it uses) executes on the client, regardless of where it's imported.

```js
'use client';

import { useState } from 'react';

export default function RichTextEditor(props) {
  // ...
```

When a file marked `'use client'` is imported from a server component, [compatible bundlers](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) will treat the import as the "cut-off point" between server-only code and client code. Components at or below this point in the module graph can use client-only React features like [`useState`](/reference/react/useState).

#### Caveats {/*caveats*/}

* It's not necessary to add `'use client'` to every file that uses client-only React features, only the files that are imported from server component files. `'use client'` denotes the _boundary_ between server-only and client code; any components further down the tree will automatically be executed on the client. In order to be rendered from server components, components exported from `'use client'` files must have serializable props.
* When a `'use client'` file is imported from a server file, the imported values can be rendered as a React component or passed via props to a client component. Any other use will throw an exception.
* When a `'use client'` file is imported from another client file, the directive has no effect. This allows you to write client-only components that are simultaneously usable from server and client components.
* All the code in `'use client'` file as well as any modules it imports (directly or indirectly) will become a part of the client module graph and must be sent to and executed by the client in order to be rendered by the browser. To reduce client bundle size and take full advantage of the server, move state (and the `'use client'` directives) lower in the tree when possible, and pass rendered server components [as children](/learn/passing-props-to-a-component#passing-jsx-as-children) to client components.
* Because props are serialized across the server–client boundary, note that the placement of these directives can affect the amount of data sent to the client; avoid data structures that are larger than necessary.
* Components like a `<MarkdownRenderer>` that use neither server-only nor client-only features should generally not be marked with `'use client'`. That way, they can render exclusively on the server when used from a server component, but they'll be added to the client bundle when used from a client component.
* Libraries published to npm should include `'use client'` on exported React components that can be rendered with serializable props that use client-only React features, to allow those components to be imported and rendered by server components. Otherwise, users will need to wrap library components in their own `'use client'` files which can be cumbersome and prevents the library from moving logic to the server later. When publishing prebundled files to npm, ensure that `'use client'` source files end up in a bundle marked with `'use client'`, separate from any bundle containing exports that can be used directly on the server.
* Client components will still run as part of server-side rendering (SSR) or build-time static site generation (SSG), which act as clients to transform React components' initial render output to HTML that can be rendered before JavaScript bundles are downloaded. But they can't use server-only features like reading directly from a database.
* Directives like `'use client'` must be at the very beginning of a file, above any imports or other code (comments above directives are OK). They must be written with single or double quotes, not backticks. (The `'use xyz'` directive format somewhat resembles the `useXyz()` Hook naming convention, but the similarity is coincidental.)

## Usage {/*usage*/}

<Wip>

This section is incomplete. See also the [Next.js documentation for Server Components](https://beta.nextjs.org/docs/rendering/server-and-client-components).

</Wip>
