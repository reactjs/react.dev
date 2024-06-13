---
title: Server Actions
canary: true
---

<Intro>

Server Actions allow Client Components to call async functions executed on the server.

</Intro>

<InlineToc />

<Note>

#### How do I build support for Server Actions? {/*how-do-i-build-support-for-server-actions*/}

While Server Actions in React 19 are stable and will not break between major versions, the underlying APIs used to implement Server Actions in a React Server Components bundler or framework do not follow semver and may break between minors in React 19.x. 

To support Server Actions as a bundler or framework, we recommend pinning to a specific React version, or using the Canary release. We will continue working with bundlers and frameworks to stabilize the APIs used to implement Server Actions in the future.

</Note>

When a Server Action is defined with the `"use server"` directive, your framework will automatically create a reference to the server function, and pass that reference to the Client Component. When that function is called on the client, React will send a request to the server to execute the function, and return the result.

Server Actions can be created in Server Components and passed as props to Client Components, or they can be imported and used in Client Components.

### Creating a Server Action from a Server Component {/*creating-a-server-action-from-a-server-component*/}

Server Components can define Server Actions with the `"use server"` directive:

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Server Component
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Server Action
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

When React renders the `EmptyNote` Server Component, it will create a reference to the `createNoteAction` function, and pass that reference to the `Button` Client Component. When the button is clicked, React will send a request to the server to execute the `createNoteAction` function with the reference provided:

```js {5}
"use client";

export default function Button({onClick}) { 
  console.log(onClick); 
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={onClick}>Create Empty Note</button>
}
```

For more, see the docs for [`"use server"`](/reference/rsc/use-server).


### Importing Server Actions from Client Components {/*importing-server-actions-from-client-components*/}

Client Components can import Server Actions from files that use the `"use server"` directive:

```js [[1, 3, "createNoteAction"]]
"use server";

export async function createNoteAction() {
  await db.notes.create();
}

```

When the bundler builds the `EmptyNote` Client Component, it will create a reference to the `createNoteAction` function in the bundle. When the `button` is clicked, React will send a request to the server to execute the `createNoteAction` function using the reference provided:

```js [[1, 2, "createNoteAction"], [1, 5, "createNoteAction"], [1, 7, "createNoteAction"]]
"use client";
import {createNoteAction} from './actions';

function EmptyNote() {
  console.log(createNoteAction);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  <button onClick={createNoteAction} />
}
```

For more, see the docs for [`"use server"`](/reference/rsc/use-server).

### Composing Server Actions with Actions {/*composing-server-actions-with-actions*/}

Server Actions can be composed with Actions on the client:

```js [[1, 3, "updateName"]]
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
}
```

```js [[1, 3, "updateName"], [1, 13, "updateName"], [2, 11, "submitAction"],  [2, 23, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  const submitAction = async () => {
    startTransition(async () => {
      const {error} = await updateName(name);
      if (!error) {
        setError(error);
      } else {
        setName('');
      }
    })
  }
  
  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  )
}
```

This allows you to access the `isPending` state of the Server Action by wrapping it in an Action on the client.

For more, see the docs for [Calling a Server Action outside of `<form>`](/reference/rsc/use-server#calling-a-server-action-outside-of-form)

### Form Actions with Server Actions {/*form-actions-with-server-actions*/}

Server Actions work with the new Form features in React 19.

You can pass a Server Action to a Form to automatically submit the form to the server:


```js [[1, 3, "updateName"], [1, 7, "updateName"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  )
}
```

When the Form submission succeeds, React will automatically reset the form. You can add `useActionState` to access the pending state, last response, or to support progressive enhancement.

For more, see the docs for [Server Actions in Forms](/reference/rsc/use-server#server-actions-in-forms).

### Server Actions with `useActionState` {/*server-actions-with-use-action-state*/}

You can compose Server Actions with `useActionState` for the common case where you just need access to the action pending state and last returned response:

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "submitAction"], [2, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  );
}
```

When using `useActionState` with Server Actions, React will also automatically replay form submissions entered before hydration finishes. This means users can interact with your app even before the app has hydrated.

For more, see the docs for [`useActionState`](/reference/react-dom/hooks/useFormState).

### Progressive enhancement with `useActionState` {/*progressive-enhancement-with-useactionstate*/}

Server Actions also support progressive enhancement with the third argument of `useActionState`.

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "/name/update"], [3, 6, "submitAction"], [3, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, null, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

When the <CodeStep step={2}>permalink</CodeStep> is provided to `useActionState`, React will redirect to the provided URL if the form is submitted before the JavaScript bundle loads.

For more, see the docs for [`useActionState`](/reference/react-dom/hooks/useFormState).
