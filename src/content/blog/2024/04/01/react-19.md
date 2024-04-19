---
title: "React 19 Beta"
---

April 1, 2024 by [The React Team](/community/team)

---

<Intro>

React 19 Beta is now available on npm! 

In our [React 19 Upgrade Guide](/blog/04/01/react-19-upgrade-guide), we shared step-by-step instructions for upgrading your app to the React 19 Beta. In this post, we'll give an overview of the new features in React 19 Beta, and how you can adopt them.

_Note for React Native users: React 19 will ship a future version of React Native with the New React Native Architecture._

</Intro>

<Note>

React Conf 2024 is scheduled for May 15–16 in Henderson, Nevada!

For more see [the React Conf website](https://conf.react.dev).

</Note>

---

## What's new in React 19 {/*whats-new-in-react-19*/}

### New Feature: Actions {/*new-feature-actions*/}

A common use case in React apps is to perform a data mutation and then update state in response. For example, when a user submits a form to change their name, you will make an API request, and then handle the response. Since this is an async request, you need to handle the pending state in a separate useState call:

```js {5,8,10}
const [name, setName] = useState('');
const [error, setError] = useState(null);

// Manually handle the pending state
const [isPending, setIsPending] = useState(false);

const handleSubmit = async () => {
  setIsPending(true);
  const {error} = await updateName(name);
  setIsPending(false);
  if (error) {
    setError(error);
  } else {
    setName('');
  }
}
```

In React 19, we added support for using async functions in transitions:

```js {5,8,15}
const [name, setName] = useState('');
const [error, setError] = useState(null);

// Pending state is handled for you
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
```

By convention, functions that use async transitions are called "Actions". Actions will immediately set the `isPending` state to true, make the async request(s), and render any state updates as transitions. This allows you to keep the current UI responsive and interactive while the data is changing.

For more information, see the docs for [`useTransition`](/reference/react/useTransition).

### New Hook: `useActionState` {/*new-hook-useactionstate*/}

You can always create an Action by dropping down to `useTransition`, but to make the common cases easier we've added a new hook called `useActionState`:

```js {2,6}
const [name, setName] = useState('');
const [submitAction, data, isPending] = useActionState(async () => {
  return  await updateName(name);
  setName('');
  return result;
});
```

`useActionState` accepts an function (the "Action"), and returns a new Action to call. This works because Actions compose. When the new Action is called, `useActionState` will return the last result of the Action as `data`, and the pending state of the Action as `pending`. 

For more information, see the docs for [`useActionState`](/reference/react/useActionState).

### New Feature: Form Actions {/*new-feature-form-actions*/}

Actions are also integrated with React 19's new Form features. We've added an `action` prop to React DOM `<form>` elements to automatically submit forms with Actions:

```js {1,3,7-8}
const [submitAction, state, isPending] = useActionState(async (formData) => {
  return updateName(formData.get('name'));
})

return (
  <form action={submitAction}>
    <input type="text" name="name" disabled={isPending}/>
    {!state.success && <span>Failed: {state.error}</span>}
  </form>
)
```

When a `<form>` Action succeeds, React will automatically reset the form for uncontrolled components. If you need to reset the `<form>` manually, you can call the new [`requestFormReset`](/todo) react-dom API.

### New Hook: useFormStatus {/*new-hook-useformstatus*/}

In design systems, it's common to write design components that need access to the nearest Form status, without passing the status down to the component. This can be done via Context, but to make the common case easier, we've added a new hook `useFormStatus`:

```js {2,5-6}
function NameInput() {
  const {data, pending} = useFormStatus();
  return (
    <>
      <input type="text" name="name" disabled={pending} />
      {!data.sucess && <span>Failed: {data.error}</span>}
    </>
  )
}
```

`useFormStatus` works like Context for the nearest `<form>` element, returning it's `pending` state, the last submitted form `data`, and the `action`.

For more information, see the docs for [`useFormStatus`](/reference/react-dom/hooks/useFormStatus).

### New Hook: useOptimistic {/*new-feature-optimistic-updates*/}

Another common UI pattern when performing a data mutation is to show the final state optimistically while the async request is underway. In React 19, we're adding a new hook called `useOptimistic` to make this easier:

```js {2,6,13,19}
const [name, setName] = useState("");
const [optimisticName, setOptimisticName] = useOptimistic(name);

const handleSubmit = async (formData) => {
  const newName = formData.get("name");
  setOptimisticName(newName);
  const updatedName = await updateName(newName);
  setName(updatedName);
};

return (
  <form action={handleSubmit}>
    <p>Your name is: {optimisticName}</p>
    <p>
      <label>Change Name:</label>
      <input
        type="text"
        name="name"
        disabled={name !== optimisticName}/>
    </p>
  </form>
);
```
The `useOptimisitc` hook will immediately render the `optimisticName` while the `updateName` request is in progress. When the update finishes, React will automatically switch back to the original `name` value.

For more information, see the docs for [`useOptimistic`](/reference/react/useOptimistic).

### New Feature: Server Actions {/*new-feature-server-actions*/}

TODO

<Note>
TODO: Requires a bundler and framework that supports Server Actions.
</Note>

### New Feature: Server Components {/*new-feature-server-components*/}

TODO

<Note>
TODO: Requires a bundler and framework that supports RSC.
</Note>

### New Feature: `use` {/*new-feature-use*/}

TODO

### New Feature: Resource and Metadata Components {/*new-feature-resource-and-metadata-components*/}

In HTML, many elements are reserved for placement in the `<head>` section of the document. This includes metadata elements like `<title>` and `<meta>`, and some forms of resource elements like `<script>`, `<style>` and `<link>`. In React, it's often convenient these elements deeper in the tree.

These elements can be inserted manually in an effect, and libraries like [`react-helmet`](github.com/nfl/react-helmet) have made this easier. In React 19, we're adding support for rendering most `<head>` tags in components natively:

```js
return (
  <div>
    <p>Hello World</p>
    <title>Hello World</title>
    <meta name="keywords" content="React 19" />
    <link rel="icon" href="favicon.ico" />
    <style>{` p { color: red; } `}</style>
    <script src="script.js" async />
  </div>
);
```

By supporting these elements natively, we're able to ensure they work with client-only apps, streaming SSR, and Server Components. For some resource elements, React can suspend while waiting for the resource to load (such as a style or async script tag). This ensures that styles and scripts are available before the components are displayed, preventing flashes of un-styled content and race conditions for scripts.

To maintain compatibility with HTML and optimize performance, React will dedupe and hoist some but not all elements for all props. For the specific constraints, read the docs for [Resource and Metadata Components](/reference/react-dom/components#resource-and-metadata-components).

## Improvements in React 19 {/*improvements-in-react-19*/}

### `ref` as a prop {/*ref-as-a-prop*/}

In 16.3 we introduced `forwardRef` as way for function components to expose `ref` to a parent:

```js [[2, 1, "forwardRef"], [1, 1, "ref"], [1, 2, "ref", 20]]
const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} />
});

//...
<MyInput ref={ref} />
```

Starting in React 19, you can now access `ref` as a prop for function components:

```js [[1, 1, "ref"], [1, 2, "ref", 20]]
function MyInput({ref}) {
  return <input ref={ref} />
}

//...
<MyInput ref={ref} />
```

<Note>

Todo: This requires the new transform, correct?

</Note>

For more information, see [Manipulating the DOM with refs](/learn/manipulating-the-dom-with-refs)

### Better Error Reporting {/*error-handling*/}

We improved error handling in React 19 to remove duplication and provide options for handling caught and uncaught errors. For example, when there's an error in render caught by an error boundary, previously React would throw the error twice (once for the original error, then again after failing to automatically recover), and then call `console.error` with info about where the error occurred. 

This resulted in three errors for every caught error:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: hit<span className="ms-2 text-gray-30">{'    <--'} Duplicate</span>
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.

</ConsoleLogLine>

</ConsoleBlockMulti>

In React 19, we log a single error with all the error information included:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...{'\n'}
The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
{'  '}at ErrorBoundary
{'  '}at App

</ConsoleLogLine>

</ConsoleBlockMulti>

Additionally, we've added two new root options to compliment `onRecoverableError`:

- `onCaughtError`: called when React catches an error in an Error Boundary.
- `onUncaughtError`: called when an error is thrown and not caught by an Error Boundary.
- `onRecoverableError`: called when an error is thrown and automatically recovered.

For more info and examples, see the docs for [`createRoot`](/reference/react-dom/client/createRoot) and [`hydrateRoot`](/reference/react-dom/client/createRoot).

### Better Hydration Errors {/*better-hydration-errors*/}

We also improved error reporting for hydration errors. For example, instead of logging multiple errors in DEV without any information about what mismatched:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: Text content does not match server-rendered HTML.
{'  '}at checkForUnmatchedText
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

We now log a single message with a diff of the mismatch:


<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:{'\n'}
\- A server/client branch `if (typeof window !== 'undefined')`.
\- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
\- Date formatting in a user's locale which doesn't match the server.
\- External changing data without sending a snapshot of it along with the HTML.
\- Invalid HTML tag nesting.{'\n'}
It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.{'\n'}
https://react.dev/link/hydration-mismatch {'\n'}
{'  '}\<App\>
{'    '}\<span\>
{'+    '}Client
{'-    '}Server{'\n'}
{'  '}at throwOnHydrationMismatch
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

### Custom Element Support {/*support-for-web-components*/}

TODO


### TODO {/*todo*/}

More improvements?
- Resource loading APIs
- Strict Mode improvements
- useDeferredValue initalValue
- Context.Provider is replaced with Context
- Refs can now return a cleanup function. (TODO: docs)


## How to Upgrade {/*how-to-upgrade*/}
See the React 19 Upgrade Guide for step-by-step instructions and a full list of breaking and notable changes.



