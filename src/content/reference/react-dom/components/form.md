---
title: "<form>"
---

<Intro>

The [built-in browser `<form>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) lets you create interactive controls for submitting information.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<form>` {/*form*/}

To create interactive controls for submitting information, render the [built-in browser `<form>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form).

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

[See more examples below.](#usage)

#### Props {/*props*/}

`<form>` supports all [common element props.](/reference/react-dom/components/common#common-props)

[`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): a URL or function. When a URL is passed to `action` the form will behave like the HTML form component. When a function is passed to `action` the function will handle the form submission in a Transition following [the Action prop pattern](/reference/react/useTransition#exposing-action-props-from-components). The function passed to `action` may be async and will be called with a single argument containing the [form data](https://developer.mozilla.org/en-US/docs/Web/API/FormData) of the submitted form. The `action` prop can be overridden by a `formAction` attribute on a `<button>`, `<input type="submit">`, or `<input type="image">` component.

#### Caveats {/*caveats*/}

* When a function is passed to `action` or `formAction` the HTTP method will be POST regardless of the value of the `method` prop.
* When a function is passed to `action` or `formAction`, React resets all [uncontrolled](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form) field elements after the action succeeds. See [Preserving form values after submission](#preserve-form-values-after-submission).

---

## Usage {/*usage*/}

### Handling form submission with an event handler {/*handle-form-submission-with-an-event-handler*/}

Pass a function to the `onSubmit` event handler to run code when the form is submitted. By default, the browser sends the form data to the current URL and refreshes the page. Call [`e.preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) in your handler to override that behavior.


<Sandpack>

```js src/App.js
export default function Search() {
  function handleSubmit(e) {
    const form = e.target;
    const formData = new FormData(form);
    const query = formData.get("query");
    alert(`You searched for '${query}'`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

</Sandpack>

<Note>

Reading form data with `onSubmit` works in every version of React and gives you direct access to the [submit event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event), so you can call `e.preventDefault()` and read the data yourself. Passing the function to the `action` prop instead runs the submission in a [Transition](/reference/react/useTransition). React then tracks the pending state, sends thrown errors to the nearest error boundary, and lets the form work with [`useActionState`](/reference/react/useActionState) and [`useOptimistic`](/reference/react/useOptimistic). An `action` can also be a [Server Function](/reference/rsc/server-functions), which `onSubmit` does not support.

</Note>

### Handling form submission with an action prop {/*handle-form-submission-with-an-action-prop*/}

Pass a function to the `action` prop to run it when the form is submitted. React calls the function with a [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object containing the values of every input with a `name` attribute. This means your inputs can be [uncontrolled](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form) - no need for `value`/`onChange` pairs, `onSubmit` handler, or `e.preventDefault()`.

When the `action` prop is a [Server Function](/reference/rsc/server-functions), the form is progressively enhanced: submission works before JavaScript loads, and even with JavaScript disabled.

When you pass a function to `action`, React:

* Runs the function in a [Transition](/reference/react/useTransition), keeping the page responsive.
* Makes the pending state available to child components via [`useFormStatus`](/reference/react-dom/hooks/useFormStatus).
* Propagates any errors to the nearest error boundary.
* Resets the form's uncontrolled fields when the function succeeds. To keep their values, see [Preserving form values after submission](#preserve-form-values-after-submission).

Because the action runs in a Transition, you can also use [`useActionState`](/reference/react/useActionState) to manage form state and [`useOptimistic`](/reference/react/useOptimistic) for optimistic UI.

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
    alert(`You searched for '${query}'`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

</Sandpack>


### Handling form submission with a Server Function {/*handle-form-submission-with-a-server-function*/}

Render a `<form>` with an input and submit button. Pass a Server Function (a function marked with [`'use server'`](/reference/rsc/use-server)) to the `action` prop of form to run the function when the form is submitted.

Passing a Server Function to `<form action>` allows users to submit forms without JavaScript enabled or before the code has loaded. This is beneficial to users who have a slow connection, device, or have JavaScript disabled and is similar to the way forms work when a URL is passed to the `action` prop.

You can use hidden form fields to provide data to the `<form>`'s action. The Server Function will be called with the hidden form field data as an instance of [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

```jsx
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(formData) {
    'use server'
    const productId = formData.get('productId')
    await updateCart(productId)
  }
  return (
    <form action={addToCart}>
        <input type="hidden" name="productId" value={productId} />
        <button type="submit">Add to Cart</button>
    </form>

  );
}
```

In lieu of using hidden form fields to provide data to the `<form>`'s action, you can call the <CodeStep step={1}>`bind`</CodeStep> method to supply it with extra arguments. This will bind a new argument (<CodeStep step={2}>`productId`</CodeStep>) to the function in addition to the <CodeStep step={3}>`formData`</CodeStep> that is passed as an argument to the function.

```jsx [[1, 8, "bind"], [2,8, "productId"], [2,4, "productId"], [3,4, "formData"]]
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(productId, formData) {
    "use server";
    await updateCart(productId)
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

When `<form>` is rendered by a [Server Component](/reference/rsc/use-client), and a [Server Function](/reference/rsc/server-functions) is passed to the `<form>`'s `action` prop, the form is [progressively enhanced](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement).

### Preserving form values after submission {/*preserve-form-values-after-submission*/}

By default, the browser clears a form's input state after submission. Forms with a URL `action` follow this behavior, and React mirrors it when `action` is a function-ensuring your form behaves consistently both before and after JavaScript loads.

When you pass a function to `action` or `formAction`, React resets the form's [uncontrolled fields](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form) after the Action succeeds. This reset only affects uncontrolled fields—[inputs controlled with state](/reference/react-dom/components/input#controlling-an-input-with-a-state-variable) are never cleared.

<Recipes titleText="Examples of preserving form values" titleId="examples-preserve-form-values">

#### With `onSubmit` {/*with-onsubmit*/}

Handle submission in an `onSubmit` handler and call `e.preventDefault()` to stop the browser from navigating and refreshing the page.

<Sandpack>

```js src/App.js
import { useState } from "react";
import { submitForm } from "./api.js";

export default function EditForm() {
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    setIsPending(true);
    try {
      await submitForm(formData);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" defaultValue="My draft" />
      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
```

```js src/api.js hidden
export async function submitForm(formData) {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

<Solution />

#### With `onSubmit` and `useTransition` {/*with-onsubmit-and-usetransition*/}

If you also pass a function to the `action` prop—for example, to support [progressive enhancement](/reference/rsc/server-functions)—add an `onSubmit` handler that calls `e.preventDefault()` and runs the Action inside a [Transition](/reference/react/useTransition).

<Sandpack>

```js src/App.js
import { useTransition } from "react";
import { submitForm } from "./api.js";

export default function EditForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e) {
    // Stop React from resetting the form after the Action succeeds
    e.preventDefault();
    const formData = new FormData(e.target);
    startTransition(async () => {
      await submitForm(formData);
    });
  }

  return (
    <form action={submitForm} onSubmit={handleSubmit}>
      <input name="title" defaultValue="My draft" />
      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
```

```js src/api.js hidden
export async function submitForm(formData) {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

<Solution />

#### With `useActionState` {/*with-useactionstate*/}

Alternatively, pass the dispatcher from [`useActionState`](/reference/react/useActionState) to the `action` prop. Return the values you want to keep from your Action, and pass them to each field's `defaultValue`. React restores those values instead of clearing them.

<Sandpack>

```js src/App.js
import { useActionState } from "react";
import { submitForm } from "./api.js";

export default function EditForm() {
  const [state, dispatchAction, isPending] = useActionState(submitForm, {
    title: "My draft",
  });

  return (
    <form action={dispatchAction}>
      <input name="title" defaultValue={state.title} />
      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
```

```js src/api.js hidden
export async function submitForm(previousState, formData) {
  await new Promise((res) => setTimeout(res, 1000));
  return {
    title: formData.get("title"),
  };
}
```

</Sandpack>

<Solution />

</Recipes>

<DeepDive>

#### Resetting only some fields, or resetting on the server {/*resetting-only-some-fields*/}

The `onSubmit` approach above keeps every uncontrolled field. When you need finer control, two other patterns are available:

* **Reset from your own Action API.** If you build an Action-based API and still want the form to reset after the Action runs, call the `requestFormReset` API from `react-dom` with the form element inside the Transition.

* **Reset to server-provided values on validation failure.** The [`useActionState`](#with-useactionstate) example above preserves values after a successful submission. When an Action validates input on the server, you can return the submitted `FormData` and pass it to each field's `defaultValue`. React restores those values instead of clearing them, and the form keeps working before JavaScript loads:

```js
import { useActionState } from "react";
import { submitForm } from "./actions.js";

function EditForm() {
  // The action returns { submitted: formData, error } on failure
  const [state, formAction] = useActionState(submitForm, {
    error: '',
  });
  return (
    <form action={formAction}>
      <input name="title" defaultValue={state.submitted?.get("title") ?? ""} />
      {state.error && <p>{state.error}</p>}
      <button type="submit">Save</button>
    </form>
  );
}
```

Return the original `FormData` object rather than a new one so React can restore the values even before JavaScript has loaded.

</DeepDive>


### Displaying a pending state during form submission {/*display-a-pending-state-during-form-submission*/}
To display a pending state when a form is being submitted, you can call the `useFormStatus` Hook in a component rendered in a `<form>` and read the `pending` property returned.

Here, we use the `pending` property to indicate the form is submitting.

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

To learn more about the `useFormStatus` Hook see the [reference documentation](/reference/react-dom/hooks/useFormStatus).

### Optimistically updating form data {/*optimistically-updating-form-data*/}
The `useOptimistic` Hook provides a way to optimistically update the user interface before a background operation, like a network request, completes. In the context of forms, this technique helps to make apps feel more responsive. When a user submits a form, instead of waiting for the server's response to reflect the changes, the interface is immediately updated with the expected outcome.

For example, when a user types a message into the form and hits the "Send" button, the `useOptimistic` Hook allows the message to immediately appear in the list with a "Sending..." label, even before the message is actually sent to a server. This "optimistic" approach gives the impression of speed and responsiveness. The form then attempts to truly send the message in the background. Once the server confirms the message has been received, the "Sending..." label is removed.

<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages((messages) => [...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```

</Sandpack>
To learn more about the `useOptimistic` Hook see the [reference documentation](/reference/react/useOptimistic).

### Handling form submission errors {/*handling-form-submission-errors*/}

In some cases the function called by a `<form>`'s `action` prop throws an error. You can handle these errors by wrapping `<form>` in an Error Boundary. If the function called by a `<form>`'s `action` prop throws an error, the fallback for the error boundary will be displayed.

<Sandpack>

```js src/App.js
import { ErrorBoundary } from "react-error-boundary";

export default function Search() {
  function search() {
    throw new Error("search error");
  }
  return (
    <ErrorBoundary
      fallback={<p>There was an error while submitting the form</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
    </ErrorBoundary>
  );
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### Displaying a form submission error without JavaScript {/*display-a-form-submission-error-without-javascript*/}

Displaying a form submission error message before the JavaScript bundle loads for progressive enhancement requires that:

1. `<form>` be rendered by a [Client Component](/reference/rsc/use-client)
1. the function passed to the `<form>`'s `action` prop be a [Server Function](/reference/rsc/server-functions)
1. the `useActionState` Hook be used to display the error message

`useActionState` takes two parameters: a [Server Function](/reference/rsc/server-functions) and an initial state. `useActionState` returns two values, a state variable and an Action. The Action returned by `useActionState` should be passed to the `action` prop of the form. The state variable returned by `useActionState` can be used to display an error message. The value returned by the Server Function passed to `useActionState` will be used to update the state variable.

<Sandpack>

```js src/App.js
import { useActionState } from "react";
import { signUpNewUser } from "./api";

export default function Page() {
  async function signup(prevState, formData) {
    "use server";
    const email = formData.get("email");
    try {
      await signUpNewUser(email);
      alert(`Added "${email}"`);
    } catch (err) {
      return err.toString();
    }
  }
  const [message, signupAction] = useActionState(signup, null);
  return (
    <>
      <h1>Signup for my newsletter</h1>
      <p>Signup with the same email twice to see an error</p>
      <form action={signupAction} id="signup-form">
        <label htmlFor="email">Email: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Sign up</button>
        {!!message && <p>{message}</p>}
      </form>
    </>
  );
}
```

```js src/api.js hidden
let emails = [];

export async function signUpNewUser(newEmail) {
  if (emails.includes(newEmail)) {
    throw new Error("This email address has already been added");
  }
  emails.push(newEmail);
}
```

</Sandpack>

Learn more about updating state from a form Action with the [`useActionState`](/reference/react/useActionState) docs

### Handling multiple submission types {/*handling-multiple-submission-types*/}

A form can have more than one submit button, each running a different action. Set the `formAction` prop on a `<button>` to override the `<form>`'s `action` when that button submits the form.

When a button without `formAction` submits the form, React calls the form's `action`. When a button with `formAction` submits the form, React calls that button's action instead. For example, the form below publishes an article by default, but its **Save draft** button stores the current content without publishing it.

<Sandpack>

```js src/App.js
import { useActionState } from 'react';

export default function ArticleForm() {
  // Hold the saved draft in state so the textarea keeps its content after saving
  const [formState, dispatchFormState] = useActionState((state, payload) => {
    const content = payload.data.get('content');
    switch (payload.type) {
      case 'save':
        alert(`Your draft of '${content}' was saved!`);
        // Keep the submitted content as the current draft
        return payload.data;
      case 'publish':
        alert(`'${content}' was published!`);
        // reset the form
        return new FormData();
    }
  }, new FormData());

  function publish(formData) {
    dispatchFormState({
      type: 'publish',
      data: formData
    });
  }

  function save(formData) {
    dispatchFormState({
      type: 'save',
      data: formData
    });
  }

  return (
    <form action={publish}>
      <textarea
        name="content"
        rows={4}
        cols={40}
        defaultValue={formState?.get('content') || ""}
      />
      <br />
      <button type="submit" name="button" value="submit">Publish</button>
      <button formAction={save}>Save draft</button>
    </form>
  );
}

```

</Sandpack>