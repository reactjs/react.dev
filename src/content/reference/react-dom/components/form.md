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

To create interactive controls for submitting information, render the [built-in browser `<form>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form).

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

[See more examples below.](#usage)

#### Props {/*props*/}

`<form>` supports all [common element props.](/reference/react-dom/components/common#props)

* [`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): a URL or function. When a URL is passed to `action` the form will behave like the HTML form component. When a function is passed to `action` the function will handle the form submission. The function passed to `action` may be async and will be called with a single argument containing the [form data](https://developer.mozilla.org/en-US/docs/Web/API/FormData) of the submitted form. The `action` prop can be overridden by a `formAction` attribute on a `<button>`, `<input type="submit">`, or `<input type="image">` component.

#### Caveats {/*caveats*/}

* When a function is passed to `action` or `formAction` the HTTP method will be POST regaudless of value of the `method` prop.

---

## Usage {/*usage*/}

### Handling form submission without a server {/*handle-form-submission-on-the-client*/}

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
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### Submitting forms without JavaScript {/*submitting-forms-without-javascript*/}

Render a `<form>` with a input and submit button. Pass a function marked with `'use server'` to the `action` prop of form to run the function when the form is submitted. When used with [Server Components](/reference/react/use-client), the form is [progressively enhanced](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement).

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

In leiu, of using hidden form fields to provide data to the function passed to the `action` prop of `<form>` you can call the `bind` method on the function passed to the `action` prop of `<form>`.

```jsx
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

### Display a pending state during form submission {/*display-a-pending-state-during-form-submission*/}
To display a pending state while a form is submitting, you can call the `useFormStatus` Hook in a component rendered in a `<form>` and read the `pending` property returned.

Here, we use the `pending` property to indicate the form is submitting.

<Sandpack>

```js App.js
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

```js actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
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

<Pitfall>

##### `useFormStatus` will not return status information for a `<form>` rendered in the same component. {/*useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component*/}

The `useFormStatus` Hook only returns status information for a parent `<form>` and not for any `<form>` rendered in the same component calling the Hook, or child components.

```js
function Form() {
  // 🚩 `pending` will never be true
  // useFormStatus does not track the form rendered in this component
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

Instead call `useFormStatus` from inside a component that is located inside `<form>`.

```js
function Submit() {
  // ✅ `pending` will be derived from the form that wraps the Submit component
  const { pending } = useFormStatus();
  return <button disabled={pending}>...</button>;
}

function Form() {
  // This is the <form> `useFormStatus` tracks
  return (
    <form action={submit}>
      <Submit />
    </form>
  );
}
```

</Pitfall>

To learn more about the `useFormStatus` Hook see the [reference documentation](/reference/react-dom/hooks/useFormStatus).

### Optimistically updating form data {/*optimistically-updating-form-data*/}
The `useOptimistic` Hook provides a way to optimistically update the user interface before a background operation, like a network request, completes. In the context of forms, this technique helps to make apps feel more responsive. When a user submits a form, instead of waiting for the server's response to reflect the changes, the interface is immediately updated with the expected outcome.

For example, when a user types a message into the form and hits the "Send" button, the `useOptimistic` Hook allows the message to immediately appear in the list with a "Sending..." label, even before the message is actually sent to a server. This "optimistic" approach gives the impression of speed and responsiveness. The form then attempts to truly send the message in the background. Once the server confirms the message has been received, the "Sending..." label is removed.

<Sandpack>


```js App.js
import { useOptimistic, useState } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    document.getElementById("message-form").reset();
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
      <form action={formAction} id="message-form">
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
    setMessages([...messages, { text: sentMessage }]);
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
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### Handling form submission errors {/*handling-form-submission-errors*/}

In some cases the function called by a `<form>`'s `action` prop throw an error. You can handle these errors by wrapping `<form>` in an Error Boundary. If the function called by a `<form>`'s `action` prop throws an error, the fallback for the error boundary will be displayed.

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
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

To surface error messages to your users from a form action you can use the `useFormState` Hook. `useFormState` takes two parameters: an action and a inital state, and returns two values, a state varible and a form action. The form action is passed to the `action` prop of the form. The value returned by the action passed to `useFormState` is used to update the state varible. This can be used to return error message that can be displayed to a user. When use in conjunction with [Server Actions](/reference/react/use-server) and [Server Components](/reference/react/use-client), the error message is progressively enhanced.

<Sandpack>

```js App.js
import { useFormState } from "react-dom";
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
  const [message, formAction] = useFormState(signup, null);
  return (
    <>
      <h1>Signup for my newsletter</h1>
      <p>Signup with the same email twice to see an error</p>
      <form action={formAction} id="signup-form">
        <label for="email">Email: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Sign up</button>
        {!!message && <p>{message}</p>}
      </form>
    </>
  );
}
```

```js api.js hidden
let emails = [];

export async function signUpNewUser(newEmail) {
  if (emails.includes(newEmail)) {
    throw new Error("This email address has already been added");
  }
  emails.push(newEmail);
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### Processing forms differently with different submit buttons {/*processing-forms-differently-with-different-submit-buttons*/}

Forms can be designed to handle multiple submission actions based on the button pressed by the user. Each button can be associated with a distinct action or behavior. When a user taps a specific button, the form is submitted, and a corresponding action, defined by that button's attributes and action, is executed. For instance, a form might allow users to either save their input as a draft or submit it for review with separate buttons.

<Sandpack>

```js App.js
export default function Search() {
  function publish(formData) {
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${content}' was published with the '${button}' button`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`Your draft of '${content}' has been saved!`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <br />
      <button type="submit" name="button" value="submit">Publish</button>
      <button formAction={save}>Save draft</button>
    </form>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>
