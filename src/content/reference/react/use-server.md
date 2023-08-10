---
title: "'use server'"
canary: true
---

<Canary>

`'use server'` is needed only if you're [using React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) or building a library compatible with them.

</Canary>


<Intro>

`'use server'` marks server-side functions that can be called from client-side code.

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `'use server'` {/*use-server*/}

Add `'use server';` at the very top of an async function to mark that the function can be executed by the client.

```js
async function addToCart(data) {
  'use server';
  // ...
}

// <ProductDetailPage addToCart={addToCart} />
```

This function can be passed to the client. When called on the client, it will make a network request to the server that includes a serialized copy of any arguments passed. If the server function returns a value, that value will be serialized and returned to the client.

Alternatively, add `'use server';` at the very top of a file to mark all exports within that file as async server functions that can be used anywhere, including imported in client component files.

#### Caveats {/*caveats*/}

* Remember that parameters to functions marked with `'use server'` are fully client-controlled. For security, always treat them as untrusted input, making sure to validate and escape the arguments as appropriate.
* To avoid the confusion that might result from mixing client- and server-side code in the same file, `'use server'` can only be used in server-side files; the resulting functions can be passed to client components through props.
* Because the underlying network calls are always asynchronous, `'use server'` can be used only on async functions.
* Directives like `'use server'` must be at the very beginning of their function or file, above any other code including imports (comments above directives are OK). They must be written with single or double quotes, not backticks. (The `'use xyz'` directive format somewhat resembles the `useXyz()` Hook naming convention, but the similarity is coincidental.)

## Usage {/*usage*/}

<Wip>

This section is incomplete. See also the [Next.js documentation for Server Components](https://beta.nextjs.org/docs/rendering/server-and-client-components).

</Wip>
