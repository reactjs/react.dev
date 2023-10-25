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

Add `'use server'` at the top of an async function body to mark that that function can be called by the client. We refer to server functions that have been marked with `'use server'` as server actions.

```js
async function addToCart(data) {
  'use server';
  // ...
}
```

As a server action, you can pass `addToCart` as a prop to a Client Component to be called on the client.

When calling a server action on the client, it will make a network request to the server that includes a serialized copy of any arguments passed. If the server action returns a value, that value will be serialized and returned to the client.

Instead of individually marking functions with `'use server'`, you can add the directive to the top of a file to mark all exports within that file as server actions.

### Serializable parameters and return values {/*serializable-parameters-and-return-values*/}

* 

### Closures {/*closures*/}

* This section should be about defining Server Actions and what is persisted, briefly that values in function sc

### Security {/*security*/}

* Brief point here about tainting values


#### Caveats {/*caveats*/}

* Remember that parameters to functions marked with `'use server'` are fully client-controlled. For security, always treat them as untrusted input, making sure to validate and escape the arguments as appropriate.
* To avoid the confusion that might result from mixing client- and server-side code in the same file, `'use server'` can only be used in server-side files; the resulting functions can be passed to client components through props.
* Because the underlying network calls are always asynchronous, `'use server'` can be used only on async functions.
* Directives like `'use server'` must be at the very beginning of their function or file, above any other code including imports (comments above directives are OK). They must be written with single or double quotes, not backticks. (The `'use xyz'` directive format somewhat resembles the `useXyz()` Hook naming convention, but the similarity is coincidental.)

## Usage {/*usage*/}


### Server Actions in forms {/*server-actions-in-forms*/}

* Server actions in Server Components, wins of progressive enhancement
* Server action call from Client Component
* Receiving a return value with `useFormState`

### Server Actions outside of forms {/*server-actions-outside-of-forms*/}

* Transitions, must wrap in transition
* Cannot be progressively enhanced because cant define



This section is a work in progress. 

This API can be used in any framework that supports React Server Components. You may find additional documentation from them.
* [Next.js documentation](https://nextjs.org/docs/getting-started/react-essentials)
* More coming soon
</Wip>