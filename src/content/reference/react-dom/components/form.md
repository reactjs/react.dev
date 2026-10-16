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

* [`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): A string containing a URL, or a function. If you pass a URL, the form behaves like a standard HTML form. If you pass a function, it handles the submission. See [Handling form submission with an action prop](#handle-form-submission-with-an-action-prop).
  * If you pass a function to `action`, React runs it in a [Transition](/reference/react/useTransition) following [the Action prop pattern](/reference/react/useTransition#exposing-action-props-from-components).
  * The function may be async. React calls it with a single argument containing the [form data](https://developer.mozilla.org/en-US/docs/Web/API/FormData) of the submitted form.
  * A `formAction` prop on a `<button>`, `<input type="submit">`, or `<input type="image">` overrides this `action`.
* [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method): A string that specifies the HTTP method to use when `action` is a URL. Defaults to `get`.
* `onSubmit`: An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Fires when the form is submitted. See [Handling form submission with an event handler](#handle-form-submission-with-an-event-handler).

#### Caveats {/*caveats*/}

* If you pass a function to `action` or `formAction`, the HTTP method will be `POST` regardless of the value of the `method` prop.
* If you pass a function to `action` or `formAction`, React resets all [uncontrolled](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form) field elements after the Action succeeds. See [Preserving form values after an Action](#preserve-form-values-after-an-action).

---

## Usage {/*usage*/}

### Handling form submission with an event handler {/*handle-form-submission-with-an-event-handler*/}

Pass a function to the `onSubmit` event handler to run code when the form is submitted. By default, the browser sends the form data to the current URL and refreshes the page. Calling [`e.preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) in the event handler overrides this behavior.

If you also pass a function to `action`, React runs it after `onSubmit` unless `onSubmit` calls `e.preventDefault()`.

<Sandpack>

```js src/App.js
export default function Search() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const query = formData.get('query');
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

Reading form data with `onSubmit` works in every version of React and gives you direct access to the [submit event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event). Prefer the [`action` prop](#handle-form-submission-with-an-action-prop) when you want Transitions, pending state, Error Boundaries, or [Server Functions](/reference/rsc/server-functions).

</Note>

---

### Handling form submission with an action prop {/*handle-form-submission-with-an-action-prop*/}

Pass a function to the `action` prop to run it when the form is submitted. React calls the function with a [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object containing the values of every input with a `name` attribute. Your inputs can be [uncontrolled](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form). You don't need `value`/`onChange` pairs, an `onSubmit` handler, or `e.preventDefault()`.

When you pass a function to `action`, React:

* Runs the function in a [Transition](/reference/react/useTransition), keeping the page responsive.
* Makes the pending state available to child components via [`useFormStatus`](/reference/react-dom/hooks/useFormStatus).
* Propagates any errors to the nearest Error Boundary.
* Resets the form's uncontrolled fields when the function succeeds. To keep their values, see [Preserving form values after an Action](#preserve-form-values-after-an-action).

Because the Action runs in a Transition, you can also use [`useActionState`](/reference/react/useActionState) to manage form state and [`useOptimistic`](/reference/react/useOptimistic) for optimistic UI. For [Server Functions](/reference/rsc/server-functions) and progressive enhancement, see [Handling form submission with a Server Function](#handle-form-submission-with-a-server-function).

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
    const query = formData.get('query');
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

---

### Handling form submission with a Server Function {/*handle-form-submission-with-a-server-function*/}

Render a `<form>` with an input and submit button. Pass a Server Function (a function marked with [`'use server'`](/reference/rsc/use-server)) to the form's `action` prop to run the function when the form is submitted.

Passing a Server Function to a form's `action` prop allows users to submit the form before JavaScript loads or when JavaScript is disabled. This matches how forms behave when you pass a URL to `action`.

You can use hidden form fields to pass data to the Server Function. React includes the hidden field values in the [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) passed to the function.

```jsx
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(formData) {
    'use server';
    const productId = formData.get('productId');
    await updateCart(productId);
  }
  return (
    <form action={addToCart}>
      <input type="hidden" name="productId" value={productId} />
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

Instead of using a hidden form field, call the <CodeStep step={1}>`bind`</CodeStep> method to pass an extra argument to the Server Function. This binds <CodeStep step={2}>`productId`</CodeStep> as an argument before the <CodeStep step={3}>`formData`</CodeStep> that React passes to the function.

```jsx [[1, 8, "bind"], [2,8, "productId"], [2,4, "productId"], [3,4, "formData"]]
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(productId, formData) {
    'use server';
    await updateCart(productId);
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

---

### Displaying a pending state during form submission {/*display-a-pending-state-during-form-submission*/}

To display a pending state when a form is being submitted, you can call the `useFormStatus` Hook in a component rendered in a `<form>` and read the `pending` property returned.

Here, we use the `pending` property to indicate the form is submitting.

<Sandpack>

```js src/App.js
import { useFormStatus } from 'react-dom';
import { submitForm } from './actions.js';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
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
export async function submitForm(formData) {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

To learn more about the `useFormStatus` Hook, see the [reference documentation](/reference/react-dom/hooks/useFormStatus).

---

### Optimistically updating form data {/*optimistically-updating-form-data*/}

The `useOptimistic` Hook provides a way to optimistically update the user interface before a background operation, like a network request, completes. In the context of forms, this technique helps to make apps feel more responsive. When a user submits a form, instead of waiting for the server's response to reflect the changes, the interface is immediately updated with the expected outcome.

For example, when a user types a message into the form and hits the "Send" button, the `useOptimistic` Hook allows the message to immediately appear in the list with a "Sending..." label, even before the message is actually sent to a server. This "optimistic" approach gives the impression of speed and responsiveness. The form then attempts to truly send the message in the background. Once the server confirms the message has been received, the "Sending..." label is removed.

<Sandpack>

```js src/App.js
import { useOptimistic, useState, useRef } from 'react';
import { deliverMessage } from './actions.js';

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get('message'));
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
    { text: 'Hello there!', sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get('message'));
    setMessages((messages) => [...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js hidden
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```

</Sandpack>

To learn more about the `useOptimistic` Hook, see the [reference documentation](/reference/react/useOptimistic).

---

### Handling form submission errors {/*handling-form-submission-errors*/}

To handle errors thrown by a function passed to a `<form>`'s `action` prop, wrap the form in an Error Boundary. React displays the boundary's fallback when the function throws.

<Sandpack>

```js src/App.js
import { ErrorBoundary } from 'react-error-boundary';

export default function Search() {
  function search() {
    throw new Error('search error');
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
  "main": "/index.js"
}
```

</Sandpack>

---

### Displaying a form submission error without JavaScript {/*display-a-form-submission-error-without-javascript*/}

Displaying a form submission error message before the JavaScript bundle loads for progressive enhancement requires that:

1. `<form>` be rendered by a [Client Component](/reference/rsc/use-client)
1. the function passed to the `<form>`'s `action` prop be a [Server Function](/reference/rsc/server-functions)
1. the `useActionState` Hook be used to display the error message

Define the Server Function in a separate file with the [`'use server'`](/reference/rsc/use-server) directive. It receives the previous state followed by the submitted `FormData`:

```js
// actions.js
'use server';

import { signUpNewUser } from './api.js';

export async function signup(previousState, formData) {
  const email = formData.get('email');
  try {
    await signUpNewUser(email);
    return null;
  } catch (error) {
    return error.message;
  }
}
```

In a Client Component, pass the Server Function to `useActionState`. Pass the returned Action to the form's `action` prop and render the returned state:

```js
// Signup.js
'use client';

import { useActionState } from 'react';
import { signup } from './actions.js';

export default function Signup() {
  const [message, signupAction] = useActionState(signup, null);
  return (
    <form action={signupAction}>
      <label htmlFor="email">Email: </label>
      <input name="email" id="email" placeholder="react@example.com" />
      <button>Sign up</button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

If the form is submitted before JavaScript loads, React includes the Server Function's returned error message in the server-rendered response.

---

### Preserving form values after an Action {/*preserve-form-values-after-an-action*/}

When you pass a function to `action` or `formAction`, React resets the form's [uncontrolled fields](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form) after the Action succeeds. To keep the submitted values, store each value in state and pass it to that field's `defaultValue`. The reset then restores each field to its `defaultValue` instead of clearing it.

To keep those values when users submit the form before JavaScript loads, render the `<form>` from a [Client Component](/reference/rsc/use-client) and pass a [Server Function](/reference/rsc/server-functions) to [`useActionState`](/reference/react/useActionState). Pass the Action it returns to the form's `action` prop. The Server Function receives the previous state, followed by the submitted `FormData`, as shown in [Displaying a form submission error without JavaScript](#display-a-form-submission-error-without-javascript). Return an object with the values to keep, and pass each value, such as `state.title`, to the matching field's `defaultValue`:

```js
// actions.js
'use server';

import { saveTitle } from './api.js';

export async function updateTitle(previousState, formData) {
  const title = formData.get('title');
  await saveTitle(title);
  return { title };
}
```

```js
// EditForm.js
'use client';

import { useActionState } from 'react';
import { updateTitle } from './actions.js';

export default function EditForm() {
  const [state, updateTitleAction, isPending] = useActionState(updateTitle, {
    title: 'My draft',
  });

  return (
    <form action={updateTitleAction}>
      <input name="title" defaultValue={state.title} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

Users can submit the form before JavaScript loads. After the Action succeeds, `defaultValue={state.title}` restores the title from the returned object.

For a form that submits only after JavaScript loads, store the values with [`useState`](/reference/react/useState). Update that state when the Action finishes. React applies the new `defaultValue`, then resets the form, so each field shows the submitted value:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function EditForm() {
  const [title, setTitle] = useState('My draft');

  async function saveAction(formData) {
    await new Promise((res) => setTimeout(res, 1000));
    setTitle(formData.get('title'));
  }

  return (
    <form action={saveAction}>
      <input name="title" defaultValue={title} />
      <button type="submit">Save</button>
    </form>
  );
}
```

</Sandpack>

Call a Server Function from `saveAction`, then store the string it returns. Because `saveAction` is defined in the Client Component, users can submit this form only after JavaScript loads:

```js
// actions.js
'use server';

import { saveTitle } from './api.js';

export async function submitTitle(formData) {
  const title = formData.get('title');
  await saveTitle(title);
  return title;
}
```

```js
// EditForm.js
'use client';

import { useState } from 'react';
import { submitTitle } from './actions.js';

export default function EditForm() {
  const [title, setTitle] = useState('My draft');

  async function saveAction(formData) {
    const savedTitle = await submitTitle(formData);
    setTitle(savedTitle);
  }

  return (
    <form action={saveAction}>
      <input name="title" defaultValue={title} />
      <button type="submit">Save</button>
    </form>
  );
}
```

<DeepDive>

#### Other ways to control form resets {/*other-ways-to-control-form-resets*/}

The examples above keep every submitted value by storing it before the reset. You can also choose which values survive, or when the reset runs:

* **Keep values only when validation fails.** Return the same state shape from every submission. When validation fails, include the submitted `FormData` and read each field with `state.submitted?.get('title') ?? ''`. When validation succeeds, set that `FormData` to `null` so the reset clears those fields. [`useActionState`](/reference/react/useActionState#displaying-validation-errors-and-preserving-form-values) shows this pattern.

* **Skip the reset with `onSubmit`.** Handle the submission in `onSubmit`, call `e.preventDefault()`, and run the Action inside [`startTransition`](/reference/react/useTransition). Because the form's `action` does not run, React does not reset the form. Users can submit this form only after JavaScript loads.

* **Reset at a specific moment.** Call the form element's [`reset()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset) method to immediately reset uncontrolled fields to their default values. To schedule a reset as part of an Action or Transition, call [`requestFormReset`](/blog/2024/12/05/react-19#form-actions) from `react-dom` instead.

* **Reset the form and the component state together.** Change the [`key`](/learn/preserving-and-resetting-state#resetting-a-form-with-a-key) of the component that renders the form. React recreates the component and its DOM, which resets the fields and any local state.

</DeepDive>

---

### Handling multiple submission types {/*handling-multiple-submission-types*/}

A form can have more than one submit button, each running a different Action. A button without `formAction` runs the form's `action`; a button with `formAction` runs its own Action instead. For example, the form below publishes an article by default, but its **Save draft** button stores the current content without publishing it:

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
        // Reset the form
        return new FormData();
      default:
        return state;
    }
  }, new FormData());

  function publish(formData) {
    dispatchFormState({
      type: 'publish',
      data: formData,
    });
  }

  function save(formData) {
    dispatchFormState({
      type: 'save',
      data: formData,
    });
  }

  return (
    <form action={publish}>
      <textarea
        name="content"
        rows={4}
        cols={40}
        defaultValue={formState?.get('content') || ''}
      />
      <br />
      <button type="submit" name="button" value="submit">Publish</button>
      <button formAction={save}>Save draft</button>
    </form>
  );
}
```

</Sandpack>
