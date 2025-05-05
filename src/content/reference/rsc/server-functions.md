---
title: Server Functions
---

<RSC>

Server Functions are for use in [React Server Components](/reference/rsc/server-components).

**Note:** Until September 2024, we referred to all Server Functions as "Server Actions". If a Server Function is passed to an action prop or called from inside an action then it is a Server Action, but not all Server Functions are Server Actions. The naming in this documentation has been updated to reflect that Server Functions can be used for multiple purposes.

</RSC>

<Intro>

Server Functions allow Client Components to call async functions executed on the server.

</Intro>

<InlineToc />

<Note>

#### How do I build support for Server Functions? {/*how-do-i-build-support-for-server-functions*/}

While Server Functions in React 19 are stable and will not break between minor versions, the underlying APIs used to implement Server Functions in a React Server Components bundler or framework do not follow semver and may break between minors in React 19.x. 

To support Server Functions as a bundler or framework, we recommend pinning to a specific React version, or using the Canary release. We will continue working with bundlers and frameworks to stabilize the APIs used to implement Server Functions in the future.

</Note>

When a Server Function is defined with the [`"use server"`](/reference/rsc/use-server) directive, your framework will automatically create a reference to the server function, and pass that reference to the Client Component. When that function is called on the client, React will send a request to the server to execute the function, and return the result.

Server Functions can be created in Server Components and passed as props to Client Components, or they can be imported and used in Client Components.

## Usage {/*usage*/}

### Creating a Server Function from a Server Component {/*creating-a-server-function-from-a-server-component*/}

Server Components can define Server Functions with the `"use server"` directive:

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Server Component
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Server Function
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
  return <button onClick={() => onClick()}>Create Empty Note</button>
}
```

For more, see the docs for [`"use server"`](/reference/rsc/use-server).


### Importing Server Functions from Client Components {/*importing-server-functions-from-client-components*/}

Client Components can import Server Functions from files that use the `"use server"` directive:

```js [[1, 3, "createNote"]]
"use server";

export async function createNote() {
  await db.notes.create();
}

```

When the bundler builds the `EmptyNote` Client Component, it will create a reference to the `createNote` function in the bundle. When the `button` is clicked, React will send a request to the server to execute the `createNote` function using the reference provided:

```js [[1, 2, "createNote"], [1, 5, "createNote"], [1, 7, "createNote"]]
"use client";
import {createNote} from './actions';

function EmptyNote() {
  console.log(createNote);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
  <button onClick={() => createNote()} />
}
```

For more, see the docs for [`"use server"`](/reference/rsc/use-server).

### Server Functions with Actions {/*server-functions-with-actions*/}

Server Functions can be called from Actions on the client:

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
      if (error) {
        setError(error);
      } else {
        setName('');
      }
    })
  }
  
  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {error && <span>Failed: {error}</span>}
    </form>
  )
}
```

This allows you to access the `isPending` state of the Server Function by wrapping it in an Action on the client.

For more, see the docs for [Calling a Server Function outside of `<form>`](/reference/rsc/use-server#calling-a-server-function-outside-of-form)

### Server Functions with Form Actions {/*using-server-functions-with-form-actions*/}

Server Functions work with the new Form features in React 19.

You can pass a Server Function to a Form to automatically submit the form to the server:


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

For more, see the docs for [Server Functions in Forms](/reference/rsc/use-server#server-functions-in-forms).

### Server Functions with `useActionState` {/*server-functions-with-use-action-state*/}

You can call Server Functions with `useActionState` for the common case where you just need access to the action pending state and last returned response:

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

When using `useActionState` with Server Functions, React will also automatically replay form submissions entered before hydration finishes. This means users can interact with your app even before the app has hydrated.

For more, see the docs for [`useActionState`](/reference/react-dom/hooks/useFormState).

### Progressive enhancement with `useActionState` {/*progressive-enhancement-with-useactionstate*/}

Server Functions also support progressive enhancement with the third argument of `useActionState`.

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
