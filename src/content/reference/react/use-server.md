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

Add `'use server'` at the top of an async function body to mark the function as callable by the client. We refer to server functions that have been marked with `'use server'` as _server actions_.

```js
async function addToCart(data) {
  'use server';
  // ...
}
```

As a server action, you can pass `addToCart` as a prop to a Client Component to be invoked on the client.

When calling a server action on the client, it will make a network request to the server that includes a serialized copy of any arguments passed. If the server action returns a value, that value will be serialized and returned to the client.

Instead of individually marking functions with `'use server'`, you can add the directive to the top of a file to mark all exports within that file as server actions.

### Serializable arguments and return values {/*serializable-parameters-and-return-values*/}

As client code calls the server action over the network, any arguments passed will need to be serializable.

Here are supported types for server action arguments:

* Primitives
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), only symbols registered in the global Symbol registry via [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Iterables
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
* [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instances
* Plain [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), those created with [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), with serializable properties
* Functions that are server actions
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Notably, these are not supported:
* React Elements, or [JSX](https://react.dev/learn/writing-markup-with-jsx)
* Functions, this includes component functions or any other function that is not a server action
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Objects that are not an instance of [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), or are [null-prototype objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Symbols not registered globally, ex. `Symbol('my new symbol')`


Supported serializable return values are the same as [serializable props](/reference/react/use-client#passing-props-from-server-to-client-components) for a boundary Client Component.


### Security considerations {/*security*/}

Recall that parameters to server actions are fully client-controlled. For security, always treat them as untrusted input, and make sure to validate and escape arguments as appropriate.

In addition, we recommend validating user authorization for any server mutations a server action may perform.

<Wip>

Beyond arguments, server actions also encode closures which are sent to the client and back to when the server action is called. To prevent sending sensitive data, there are experimental taint APIs to prevent unique values and objects from being passed to client code.

See [experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue) and [experimental_taintObjectReference](/reference/react/experimental_taintObjectReference).

</Wip>


#### Caveats {/*caveats*/}
* `'use server'` can only be used in server-side files; the resulting functions can be passed to Client Components through props.
* Because the underlying network calls are always asynchronous, `'use server'` can be used only on async functions.
* server actions must be called in [transitions](). When used in a `<form action>`, form will ensure the server action is called in a transition. Elsewhere, you will need to manually call a server action in a transition.
* Directives like `'use server'` must be at the very beginning of their function or file, above any other code including imports (comments above directives are OK). They must be written with single or double quotes, not backticks.

## Usage {/*usage*/}

### Server actions in forms {/*server-actions-in-forms*/}

The most common use case of server actions will be calling server functions that mutate data. On the browser, the [HTML form element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) is the traditional approach for a user to submit a mutation. With React Server Components, React introduces first-class support for server actions in [forms](/reference/react-dom/components/form).

Here is a form that allows a user to request a username.

```js
// UsernameForm.js
'use client';

export default UsernameForm({submit}) {
  return (
    <form action={submit}>
      <input type="text" name="username" />
      <button type="submit">Request</button>
    </form>
  );
}
```

```js
// App.js
import UsernameForm from './UsernameForm';

function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default App() {
  <UsernameForm submit={requestUsername}>
}
```

In this example `UsernameForm` is a Client Component and receives a server action as the prop `submit`. When a user submits this form, there is a network request to the server function `requestUsername`.

When calling a server action in a `<form action>`, React will supply the form's [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) as the first argument to the server action.

<Note>

We force `UsernameForm` as a Client Component with `'use client'` purely for demonstration. In general, it is not recommended to add the `'use client'` directive if the component does not use [client-only features](reference/react/use-client#usage).

</Note>

#### Progressive Enhancement in `<form>` {/*progressive-enhancement-in-form*/}

In the above example, the `<form>` is rendered in a Client Component. By instead rendering the `<form>` in a Server Component, React can support [progressively enhanced](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) forms.

In this context, we mean that server-rendered forms can provide the baseline experience of submitting a form without JavaScript. This is useful for apps that are server-side rendered (SSR) where HTML scaffolding is sent to the client first, before any code is downloaded to add interactivity.

<DeepDive>

#### What is the difference between SSR and React Server Components (RSC)? {/*what-is-the-difference-between-ssr-and-react-server-components-rsc*/}

Server-side rendering and React Server Components are two features for optimizing performance of React apps and can complement one another.

Server-side rendering (SSR) is the concept of taking a single render pass of a React app to resolve it to its base UI primitives, HTML elements for the web. This HTML is sent down to the client to serve as "scaffolding" while JavaScript is still being downloaded and evaluated.

SRR is an optimization for ["time to paint"](https://developer.mozilla.org/en-US/docs/Glossary/First_paint) but it still requires all your app code to download and be evaluated on the client. The client then needs to [hydrate](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) this scaffolding to add interactivity.

React Server Components (RSC) is the concept of breaking up your React [module dependency tree](/reference/react/use-client#marking-client-components-with-use-client) to determine what components can be rendered on the server and what can be sent to the client. In contrast to SSR, components that are rendered on the server have access to server APIs and can make data-fetches.

These rendered Server Components are streamed down to the client in a special encoding to be translated to HTML or whatever client UI primitive. There is no hydration due to [limitations of Server Components](https://react-dev-git-use-client-fbopensource.vercel.app/reference/react/use-client#limitations).

RSC is an optimization for ["time to interactive"](https://developer.mozilla.org/en-US/docs/Glossary/Time_to_interactive) as it reduces the code that needs to be downloaded and run by the client.

</DeepDive>

Here is the same username request form but rendered as a Server Component.

```js
// App.js

export default App() {
  function requestUsername(formData) {
    'use server';
    const username = formData.get('username');
    // ...
  }

  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Request</button>
    </form>
  );
}
```

The `<form>` is rendered in a Server Component but the form submission will take place on the client. Before [hydration](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) or if JavaScript is disabled, this form will still allow users to call the server action.

#### Handling return values {/*handling-return-values*/}

You'll notice that in a username request form, there might be the chance that a username is not available. `requestUsername` should tell us if it fails or not. How does the form receive the return value of the server action?

Here is where you can use [`useFormState`](/reference/react-dom/hooks/useFormState), a hook designed for receiving a server action return value that supports progressive enhancement.

```js
// App.js
import {useFormState} from 'react';

export default App() {
  function requestUsername(formData) {
    'use server';
    const username = formData.get('username');
    if (canRequest(username)) {
      // ...
      return 'successful';
    }
    return 'failed';
  }

  const [returnValue, action] = useFormState(requestUsername, 'n/a');

  return (
    <>
      <form action={requestUsername}>
        <input type="text" name="username" />
        <button type="submit">Request</button>
      </form>
      <p>Last submission request returned: {returnValue}</p>
    </>
  );
}
```

### Calling a server action outside of `<form>` {/*calling-a-server-action-outside-of-form*/}

Server actions are exposed server endpoints to client code and can in theory be called anywhere in client code.

```js
import incrementLike from './actions';
import {useState, useTransition} from 'react';

function LikeButton() {
  const [pending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => startTransition(async () => {
    const currentCount = await incrementLike();
    setLikeCount(currentCount);
  });

  return (
    <>
      <p>Total Likes: {likeCount}</p>
      <button onClick={onClick} disabled={pending}>Like</button>;
    </>
  );
}
```

If you call a server action outside of a [form](/reference/react-dom/components/form), which has first-class support for server actions, you can only do so in a Client Component, which lacks progressive enhancement. In addition, you'll need to manually call the server action in a transition `<form action>` takes care of this for you.

To read a server action return value, you'll need to `await` the promise returned.