---
title: "<form>"
canary: true
---

<Canary>

React's extensions to `<form>` are currently only available in React's canary and experimental channels. In stable releases of React `<form>` works only as a [built-in browser HTML component](https://react.dev/reference/react-dom/components#all-html-components). Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).

</Canary>


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

To create interactive controls for submitting information, render the [built-in browser `<form>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form). 🚧

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

[See more examples below.](#usage)

#### 🚧 Props {/*props*/}

`<form>` supports all [common element props.](/reference/react-dom/components/common#props)

Additionally, `<form>` supports passing a function directly to the `action` and `formAction` props to handle form submission.

* [`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#disabled): A boolean. Specifies what to do when a form is submitted. The form data can be handled with client or server side code.
* [`<button>`]
    * [`formAction`] prop that overrides `<form>`'s `action` prop
    * [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): A string. Overrides the parent `<form action>` for `type="submit"` and `type="image"`.



#### 🚧 Caveats {/*caveats*/}

* 🚧

---

## Usage {/*usage*/}

### 🚧 Submitting forms to the server {/*progressively-enhanching-forms*/}

Render a `<form>` with a input and submit button. Pass a function marked with `'use server';` to the `action` prop of form to run the function when the form is submitted.

<Sandpack>

```js App.js
'use client'

import { search } from './actions.js'

export default function Search() {
  return (
    <form action={search}>
        <input name="query" />
        <button type="submit">Search</button>
    </form>

  );
}
```

```js actions.js
'use server'

import { queryDb } from './lib.js';

export async function search(formData) {
    const query = formData.get('query')
    const results = queryDb(query)
}
```
```js lib.js hidden
export function queryDb(query) {
    return "hi"
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>


### Handling form submissions on the client {/*handle-form-submission-on-the-client*/}

Render a `<form>` with a input and submit button. Pass a function to the `action` prop of form to run the function when the form is submitted.

<Sandpack>

```js App.js
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

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### Display a pending state during form submission {/*display-a-pending-state-during-form-submission*/}
You can track the status of a form submission with the `useFormStatus` Hook. The `useFormStatus` Hook provides information on the form's state, like when the form is pending. The `pending` property indicates whether the form is currently in the process of being submitted. You can use this property to update the UI while the form is being submitted like disabling buttons or alterning wording.

<Sandpack>

```js App.js
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Button() {
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
      <Button />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

```js actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>  

<Pitfall>

The `useFormStatus` Hook must be called from a Component that is located inside `<form>`. You cannot call `useFormStatus` from the same Component that returns `<form>`.

```js
function Form() {
  const { pending } = useFormStatus() // 🚩 `pending` will never be `true`
  return <form action={submit}> //...
}
```

Instead call `useFormStatus` from inside a Component that is located inside `<form>`.

```js
function Button(){
    const { pending } = useFormStatus() // ✅ `pending` will be derived from the parent form state
    return <button disabled={pending}> //...
}

function Form() {
  return <form> <Button /> //...
}
```

</Pitfall>

### Optimistically updating form data {/*optimistically-updating-form-data*/}
The `useOptimistic` Hook provides a way to optimistically update the user interface before a background operation, like a network request, completes. In the context of forms, this technique helps to make apps feel more responsive. When a user submits a form, instead of waiting for the server's response to reflect the changes, the interface is immediately updated with the expected outcome. 

For example, when a user types a message into the form and hits the "Send" button, the `useOptimistic` Hook allows the message to immediately appear in the list with a "Sending..." label, even before the message is actually sent to a server. This "optimistic" approach gives the impression of speed and responsiveness. The form then attempts to truly send the message in the background. Once the server confirms the message has been received, the "Sending..." label is removed.

<Sandpack>


```js App.js
import { experimental_useOptimistic as useOptimistic, useState } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        message: newMessage,
        sending: true
      }
    ]
  );

  return (
    <div>
      {optimisticMessages.map((m, i) => (
        <div key={i}>
          {m.message}
          <small>{m.sending ? " (Sending...)" : ""}</small>
        </div>
      ))}
      <form
        action={sendMessage}
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          addOptimisticMessage(formData.get("message"));
          form.reset();
          await sendMessage(formData);
        }}
      >
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { message: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages([...messages, { message: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### Handling form submission errors {/*handling-form-submission-errors*/}

In some cases the function called by a `<form>`'s `action` prop throw an error. You can handle these errors by wrapping `<form>` in an Error Boundary. If function called by a `<form>`'s `action` prop throws an error the fallback for the error boundary will be displayed.

<Sandpack>

```js App.js
import { ErrorBoundary } from "react-error-boundary";
import { action } from "./actions.js"

export default function Search() {
  return (
    <ErrorBoundary fallback={<p>There was an error while submitting the form</p>}>
      <form action={action}>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
    </ErrorBoundary>

  );
}
```

```js actions.js hidden
export async function search() {
  return new Promise((_, reject) => reject())
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

To surface specific error messages to your users from a form action you can use the `useFormState` Hook. `useFormState` takes two parameters: an action and a inital state, and returns two values, a state varible and a new action. When you use the action returned by `useFormState` it will call the action passed to `useFormState` with the current state as an argument. The value that the actions passed to `useFormState` returns will be used as the new value for the state var.

<Sandpack>

```js App.js
import { useState } from "react";
import { useFormState } from "react-dom";

let maxUsers = 1;

export default function NewsletterSignUp() {
  const [signups, setSignups] = useState(0);
  async function addEmailToNewsletter(prevState) {
    if (signups >= maxUsers) {
      return "maximum users reached";
    }
    setSignups(signups + 1);
  }
  const [errorMessage, formAction] = useFormState(addEmailToNewsletter, null);
  return (
    <form action={formAction}>
      <label>
        Email:
        <input type="text" />
      </label>
      <button disabled={!!errorMessage} type="submit">
        Sign up
      </button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>


</Sandpack>

### Processing forms differently with different submit buttons {/*processing-forms-differently-with-different-submit-buttons*/}

Forms can be designed to handle multiple submission actions based on the button pressed by the user. Each button can be associated with a distinct action or behavior. When a user taps a specific button, the form is submitted, and a corresponding action, defined by that button's attributes and action, is executed. For instance, a form might allow users to either save their input as a draft or submit it for review with separate buttons.

<Sandpack>

```js App.js
export default function Search() {
  function publish(formAction) {
    const content = formAction.get("content");
    const button = formAction.get("button");
    alert(`'${content}' was published with the '${button}' button`);
  }

  function save(formAction) {
    const content = formAction.get("content");
    alert(`Your draft of '${content}' has been saved!`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <button type="submit" name="button" value="submit">Publish</button>
      <button formAction={save}>Save draft</button>
    </form>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>
