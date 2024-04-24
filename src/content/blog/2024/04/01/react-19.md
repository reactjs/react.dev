---
title: "React 19 Beta"
---

April 1, 2024, by [The React Team](/community/team)

---

**TODO**
- Content
  - [ ] Finish RSC and RSA sections and examples
  - [ ] Finish other incomplete sections 
  - [ ] Write Deep Dives
  - [ ] Review changelog and add any missing sections
  - [ ] Finish inline todos
- Polish
  - [ ] Header capitalization consistency
  - [ ] React concept capitalization
  - [ ] Package name capitalization (react-dom vs React DOM)
  - [ ] Format code with prettier

--- 

<Intro>

<Note>

Stream [React Conf 2024]((https://conf.react.dev)) live May 15–16!

</Note>

React 19 Beta is now available on npm! 

In our [React 19 Upgrade Guide](/blog/2024/04/01/react-19-upgrade-guide), we shared step-by-step instructions for upgrading your app to the React 19 Beta. In this post, we'll give an overview of the new features in React 19 Beta, and how you can adopt them.

- [What's new in React 19](#whats-new-in-react-19)
- [Improvements in React 19](#improvements-in-react-19)
- [How to Upgrade](#how-to-upgrade)

For a list of breaking changes, see the [Upgrade Guide](/blog/2024/04/01/react-19-upgrade-guide).

_Note for React Native users: React 19 will ship a future version of React Native with the New React Native Architecture._

</Intro>



---

## What's new in React 19 {/*whats-new-in-react-19*/}

### Actions {/*actions*/}

A common use case in React apps is to perform a data mutation and then update state in response. For example, when a user submits a form to change their name, you will make an API request, and then handle the response. In the past, you would need to handle pending states, errors, optimistic updates, and sequential requests manually.

For example, you could handle the pending state in `useState`:

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

In React 19, we're adding support for using async functions in transitions to handle pending states, errors, forms, and optimistic updates automatically.

For example, you can use `useTransition` to handle the pending state for you:

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


The async transition will immediately set the `isPending` state to true, make the async request(s), and render any state updates as transitions. This allows you to keep the current UI responsive and interactive while the data is changing.

<Note>

#### By convention, functions that use async transitions are called "Actions". {/*by-convention-functions-that-use-async-transitions-are-called-actions*/}

Actions automatically manage submitting data for you:

- **Pending state**: Actions provide a pending state that starts at the beginning of a request and automatically resets when the final state update is committed.
- **Optimistic updates**: Actions support the new [`useOptimistic`](#new-feature-optimistic-updates) hook so you can show users instant feedback while the requests are submitting.
- **Error handling**: Actions provide error handling so you can and display Error Boundaries when a request fails, and revert optimistic updates to their original value automatically.
- **Forms**: Actions integrate with new `action` and `formActions` props as [`<form>` Actions](#form-actions). This means form submissions use Actions by default and reset the form automatically after submission.

</Note>

Async transitions are the raw primitive that power Actions, and you can always drop down to `useTransition`, `useState`, and `useOptimistic` to create your own custom behavior. We're also introducing the [`useActionState`](#new-hook-useactionstate) and [`useFormStatus`](#new-hook-useformstatus) hooks to support the common cases for Actions and Forms.

For more information, see the docs for [`useTransition`](/reference/react/useTransition) and the next sections.

### New Hook: `useActionState` {/*new-hook-useactionstate*/}

To make the common cases easier for Actions, we've added a new hook called `useActionState`:

```js {2,9}
const [name, setName] = useState('');
const [error, submitAction, isPending] = useActionState(async () => {
  const {error} = await updateName(name);
  setName('');
  
  // You can return any result of the action.
  // Here, we return only the error.
  return error;
});
```

`useActionState` accepts a function (the "Action"), and returns a wrapped Action to call. This works because Actions compose. When the wrapped Action is called, `useActionState` will return the last result of the Action as `data`, and the pending state of the Action as `pending`. 

<Note>

`React.useActionState` was previously called `ReactDOM.useFormState` in the Canary releases, but we've renamed it and deprecated `useFormState`.

See [#28491](https://github.com/facebook/react/pull/28491) for more info.

</Note>

For more information, see the docs for [`useActionState`](/reference/react/useActionState).

### `<form>` Actions {/*form-actions*/}

Actions are also integrated with React 19's new `<form>` features. We've added `action` and `formAction` props to React DOM `<form>`, `<input>`, and `<button>` elements to automatically submit forms with Actions:

```js {1,3,7-8}
const [submitAction, state, isPending] = useActionState(async (formData) => {
  return await updateName(formData.get('name'));
})

return (
  <form action={submitAction}>
    <input type="text" name="name" disabled={isPending}/>
    {!state.success && <span>Failed: {state.error}</span>}
  </form>
)
```

When a `<form>` Action succeeds, React will automatically reset the form for uncontrolled components. If you need to reset the `<form>` manually, you can call the new [`requestFormReset`](/todo) React DOM API.

For more information, see the docs for [`<form>`](/reference/react-dom/components/form), [`<input>`](/reference/react-dom/components/input), and [`<button>`](/reference/react-dom/components/button).

### New Hook: `useFormStatus` {/*new-hook-useformstatus*/}

In design systems, it's common to write design components that need access to information about the `<form>` they're in, without drilling props down to the component. This can be done via Context, but to make the common case easier, we've added a new hook `useFormStatus`:

```js [[1, 2, "pending"], [1, 3, "pending"]]
function DesignButton() {
  const {pending} = useFormStatus();
  return <button type="submit" disabled={pending} />
}
```

`useFormStatus` reads the status of the parent `<form>` as if the form was a Context provider.

For more information, see the docs for [`useFormStatus`](/reference/react-dom/hooks/useFormStatus).

### New Hook: `useOptimistic` {/*new-feature-optimistic-updates*/}

Another common UI pattern when performing a data mutation is to show the final state optimistically while the async request is underway. In React 19, we're adding a new hook called `useOptimistic` to make this easier:

```js {2,6,13,19}
const [name, setName] = useState("");
const [optimisticName, setOptimisticName] = useOptimistic(name);

const submitAction = async (formData) => {
  const newName = formData.get("name");
  setOptimisticName(newName);
  const updatedName = await updateName(newName);
  setName(updatedName);
};

return (
  <form action={submitAction}>
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
The `useOptimistic` hook will immediately render the `optimisticName` while the `updateName` request is in progress. When the update finishes or errors, React will automatically switch back to the original `name` value.

For more information, see the docs for [`useOptimistic`](/reference/react/useOptimistic).

### New API: `use` {/*new-feature-use*/}

In React 19 we're introducing a new API to read resources in render: `use`.

For example, you can read a promise with `use`, and React will Suspend until the promise resolves:

```js {1,6}
import {use} from 'react';

function Comments({commentsPromise}) {
  // NOTE: this will resume the promise from the server.
  // It will suspend until the data is available.
  const comments = use(commentsPromise);
  return comments.map(commment => <p>{comment}</p>);
}
```

Or you can read context with `use`:

```js {1,5}
import {use} from 'react';
import ThemeContext from './ThemeContext'

function ThemedPage({children}) {
  const theme = use(ThemeContext);
  return (
    <div className={theme === 'dark' ? 'dark' : 'light'}>
      {children}
    </div>
  );
}
```

The `use` API can only be called in render, similar to hooks. Unlike hooks, `use` can be called conditionally. In the future we plan to support more ways to consume resources in render with `use`.

For more information, see the docs for [`use`](/reference/react/use).


### React Server Components {/*react-server-components*/}

### Server Components {/*server-components*/}

Server Components are a new option that allows rendering components ahead of time, before bundling, in an environment separate from your application (the "server"). They can run once at build time, or can be run for each request to a web server.

Today we're releasing React Server Components as semver stable in React 19. TODO: re-write This means libraries that ship Server Components and Server Actions can target React 19 as a peer dependency for use in frameworks that support the [Full-stack React Architecture](/learn/start-a-new-react-project#which-features-make-up-the-react-teams-full-stack-architecture-vision).

For more, see the docs for [React Server Components](/reference/rsc/server-components). 

<DeepDive>

#### How do I use Server Components? {/*how-do-i-use-server-components*/}

We first announced React Server Components in a [demo in December 2020](https://legacy.reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html). In 2022, we merged the [RFC for React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) and the [RFC for React Server Module Conventions](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md) and partnered with Next.js for the first implementation in the Next.js 13 App Router beta. We worked with the Next.js team to implement Server Components via the stable Canary channel, and Server Components shipped as the default in Next.js 14.

We will continue working with bundlers and framework authors to expand support for React Server Components.

TODO:
- need a framework
- bundler: link to "How do bundler authors support Directives?"
- router: link to "How do I make Server Components dynamic?"


</DeepDive>

### Server Actions {/*server-actions*/}

Server Actions allow Client Components to call async functions executed on the server.

When a Server Action is defined with the `"use server"` directive, your framework will automatically create a reference to the server function, and pass that reference to the Client Component. When that function is called on the client, React will send a request to the server to execute the function, and return the result.

Server Actions can be created in Server Components and passed as props to Client Components, or they can be imported and used in Client Components.

For more, see the docs for [React Server Actions](/reference/rsc/server-actions).

<DeepDive>

#### How do I use Server Actions? {/*how-do-i-use-server-actions*/}

TODO

</DeepDive>

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

### Diffs for Hydration Errors {/*diffs-for-hydration-errors*/}

We also improved error reporting for hydration errors. For example, instead of logging multiple errors in DEV without any information about the mismatch:

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

Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if an SSR-ed Client Component used:{'\n'}
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

### `<Context>` as a provider {/*context-as-a-provider*/}

In React 19, you can render `<Context>` as a provider instead of `<Context.Provider>`:


```js {5,7}
const ThemeContext = createContext('');

function App({children}) {
  return (
    <ThemeContext value="dark">
      {children}
    </ThemeContext>
  );  
}
```

In future versions we will deprecate `<Context.Provider>`.

For more, see [`createContext`](/reference/react/createContext).

### Cleanup functions for DOM refs {/*cleanup-functions-for-dom-refs*/}

We now support returning a cleanup function from DOM ref callbacks:

```js {7-11}
function Input() {
  const ref = useRef();
  
  return <input ref={(ref) => {
    ref.current = ref;

    // NEW: return a cleanup funtion to reset
    // the ref when element is removed from DOM. 
    return () => {
      ref.current = null;
    }
  }} />;
}
```

When the component unmounts, React will call the cleanup function returned from the ref callback. 

<Note>

Previously, React would call ref functions with `null` when unmounting the component. If your ref returns a cleanup function, React will now skip this step.

In future versions, we will deprecate calling the ref with `null` when unmounting components.

</Note>

Due to the introduction of ref cleanup functions, returning anything else from a ref callback will now be rejected by TypeScript.

The fix is usually to stop using implicit returns e.g.

```diff
-<div ref={current => (instance = current)} />
+<div ref={current => {instance = current}} />
```

The original code returned the instance of the `HTMLDivElement` and TypeScript wouldn't know if this was _supposed_ to be a cleanup function or if you didn't want to return a cleanup function.

You can codemod this pattern with [`no-implicit-ref-callback-return
`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return)

For more, see [Manipulating the DOM with refs](/learn/manipulating-the-dom-with-refs).

### `useRef` changes in TypeScript


All the of the changes in this section are codemoddable with [`preset-19` from `types-react-codemod`](https://github.com/eps1lon/types-react-codemod/#preset-19)

A long-time complaint of how TypeScript and React work has been `useRef`.
We've changed the types so that `useRef` now requires an argument.
This significantly simplifies its type signature. It'll now behave more like `createContext`.

```ts
// @ts-expect-error: Expected 1 argument but saw none
useRef();
// Passes
useRef(undefined);
// @ts-expect-error: Expected 1 argument but saw none
createContext();
// Passes
createContext(undefined);
```

This now also means that all refs are mutable.
You'll no longer hit the issue where you can't mutate a ref because you initialised it with `null`:

```ts
const ref = useRef<number>(null);

// Cannot assign to 'current' because it is a read-only property
ref.current = 1;
```

`MutableRef` is now deprecated in favor of a single `RefObject` type which `useRef` will always return:

```ts
interface RefObject<T> {
  current: T
}

declare function useRef<T>: RefObject<T>
```

`useRef` still has a convenience overload for `useRef<T>(null)` that automatically returns `RefObject<T | null>`.
To ease migration due to the required argument for `useRef`, a convenience overload for `useRef(undefined)` was added that automatically returns `RefObject<T | undefined>`.

Check out [[RFC] Make all refs mutable](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/64772) for prior discussions about this change.

### `useDeferredValue` inital value {/*use-deferred-value-initial-value*/}

We've added an `initalValue` option to `useDeferredValue`:

```js [[1, 1, "deferredValue"], [1, 4, "deferredValue"], [2, 4, "''"]]
function Search({deferredValue}) {
  // On inital render the value is ''.
  // Then a re-render is scheduled with the deferredValue.
  const value = useDeferredValue(deferredValue, '');
  
  return (
    <Results query={value} />
  );
}
````

When <CodeStep step={2}>initialValue</CodeStep> is provided, `useDeferredValue` will return it as `value` for the initial render of the component, and scheduled a re-render in the background with the <CodeStep step={1}>deferredValue</CodeStep> returned.

For more, see [`useDeferredValue`](/reference/react/useDeferredValue).

### Better `useReducer` typings

`useReducer` now has improved type inference thanks to [@mfp22](https://github.com/mfp22).

However, this required a breaking change where `useReducer` doesn't accept the full reducer type as a type parameter but instead either needs none (and rely on contextual typing) or needs both the state and action type.

The new best practice is _not_ to pass type arguments to `useReducer`.

```diff
-useReducer<React.Reducer<State, Action>>(reducer)
+useReducer(reducer)
```

However, this may not work in edge cases where you can explicitly type the state and action, by passing in the `Action` in a tuple:

```diff
-useReducer<React.Reducer<State, Action>>(reducer)
+useReducer<State, [Action]>(reducer)
```

If you define the reducer inline, we encourage to annotate the function parameters instead:

```diff
-useReducer<React.Reducer<State, Action>>((state, action) => state)
+useReducer((state: State, action: Action) => state)
```

This, of course, is also what you'd also have to do if you move the reducer outside of the `useReducer` call:

```ts
const reducer = (state: State, action: Action) => state;
```

### Support for Document Metadata {/*support-for-metadata-tags*/}

In HTML, document metadata tags like `<title>` and `<meta>` are reserved for placement in the `<head>` section of the document. In React, it's often convenient these elements deeper in the tree where the data for those tags is available. In the past, these elements would need to be inserted manually in an effect, or by libraries like [`react-helmet`](github.com/nfl/react-helmet). 

In React 19, we're adding support for rendering document metadata tags in components natively:

```js {5,6}
function BlogPost({post}) {
  return (
    <article>
      <h1>{post.title}</h1>
      <title>{post.title}</title>
      <meta name="keywords" content={post.keywords} />
    </article>
  );
}
```

When React renders this component, it will see the `<title>` and `<meta>` tags, and automatically hoist them to the `<head>` section of document. By supporting these metadata tags natively, we're able to ensure they work with client-only apps, streaming SSR, and Server Components. 

For more info, see the docs for [`<title>`](/reference/react-dom/components/title) and [`<meta>`](/reference/react-dom/components/meta)

### Support for Document Resources {/*support-for-document-resources*/}

In HTML, document resource tags like `<script>`, `<style>` and `<link>` are used to load external resources for the page. In React, it's often convenient these elements deeper in the tree, but in the past React would silently ignore these tags when rendered in a component. These elements can be inserted manually in an effect, and libraries like [`react-helmet`](github.com/nfl/react-helmet) have made this easier.

In React 19, we're adding support for rendering document resources:

```js
return (
  <div>
    <p>Hello World</p>
    <title>Hello World</title>
    <link rel="icon" href="favicon.ico" />
    <style>{` p { color: red; } `}</style>
    <script src="script.js" async />
  </div>
);
```
When React renders this component, it will see the `<link>`, `<style>`, and `<script>` tags and hoist them to the `<head>` of the document.

For some resource elements, React will suspend while waiting for the resource to load (such as a `<link>` to a CSS file). This ensures that styles are available before the components are displayed, preventing flashes of un-styled content. React may also dedupe some elements to ensure duplicate resources are not loaded.

To optimize performance, React will dedupe elements if they refer to equivalent resources. For more details, read the docs for [Resource and Metadata Components](/reference/react-dom/components#resource-and-metadata-components).

### Compatability with third-party scripts and extensions {/*compatability-with-third-party-scripts-and-extensions*/}

We've improved hydration to account for third-party scripts and browser extensions.

When hydrating, if an element that renders on the client doesn't match the element found in the HTML from the server, React will force a client re-render to fix up the content. Previously, if an element was inserted by third-party scripts or browser extensions, it would trigger a mismatch error and client render.

In React 19 unexpected tags in the `<head>` and `<body>` will be skipped over, avoiding the mismatch errors. If React needs to re-render the entire document due to an unrelated hydration mismatch, it will leave in place stylesheets inserted by third-party scripts and browser extensions.

### Better Error Reporting {/*error-handling*/}

We improved error handling in React 19 to remove duplication and provide options for handling caught and uncaught errors. For example, when there's an error in render caught by an Error Boundary, previously React would throw the error twice (once for the original error, then again after failing to automatically recover), and then call `console.error` with info about where the error occurred. 

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

Additionally, we've added two new root options to complement `onRecoverableError`:

- `onCaughtError`: called when React catches an error in an Error Boundary.
- `onUncaughtError`: called when an error is thrown and not caught by an Error Boundary.
- `onRecoverableError`: called when an error is thrown and automatically recovered.

For more info and examples, see the docs for [`createRoot`](/reference/react-dom/client/createRoot) and [`hydrateRoot`](/reference/react-dom/client/createRoot).

### Custom Element Support {/*support-for-web-components*/}

TODO


#### How to Upgrade {/*how-to-upgrade*/}
See the [React 19 Upgrade Guide](/blog/2024/04/01/react-19-upgrade-guide) for step-by-step instructions and a full list of breaking and notable changes.

### Changes to the `ReactElement` TypeScript type

The `props` of React elements now default to `unknown` instead of `any` if the element is typed as `ReactElement`. This does not affect you if you pass a type argument to `ReactElement`:

```ts
type Example2 = ReactElement<{ id: string }>["props"];
//   ^? { id: string }
```

But if you relied on the default, you now have to handle `unknown`:

```ts
type Example = ReactElement["props"];
//   ^? Before, was 'any', now 'unknown'
```

If you rely on this behavior, use the [`react-element-default-any-props` codemod](https://github.com/eps1lon/types-react-codemod#react-element-default-any-props).
You should only need it if you have a lot of legacy code relying on unsound access of element props.
Element introspection only exists as an escape hatch and you should make it explicit that your props access is unsound via an explicit `any`.

### The JSX Namespace in TypeScript

A long-time request is to remove the global `JSX` namespace from our types in favor of `React.JSX`.
This helps prevent pollution of global types which prevents conflicts between different UI libraries that leverage JSX.
This change is [codemoddable with `scoped-jsx`](https://github.com/eps1lon/types-react-codemod#scoped-jsx).

You'll now need to wrap module augmentation of the JSX namespace in `declare module "....":

```diff
// global.d.ts

+ declare module "react" {
    namespace JSX {
      interface IntrinsicElements {
        "my-element": {
          myElementProps: string;
        };
      }
    }
+ }
```

The exact module specifier depends on the JSX runtime you specified in the `compilerOptions` of your `tsconfig.json`.
For `"jsx": "react-jsx"` it would be `react/jsx-runtime`.
For `"jsx": "react-jsxdev"` it would be `react/jsx-dev-runtime`.
For `"jsx": "react"` and `"jsx": "preserve"` it would be `react`.
