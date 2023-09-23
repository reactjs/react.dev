---
title: useFormStatus
canary: true
---

<Canary>

The `useFormStatus` Hook is currently only available in React's canary and experimental channels. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`useFormStatus` is a Hook that allows you to make updates to the UI based on the status of a form.

```js
const { pending } = useFormStatus();
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useFormStatus()` {/*usformstatus*/}


Call `useFormStatus` at the top level of your component to subscribe to the status of the form that wraps your component.

```js
function Button() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>Submit</button>
}
```

The `useFormStatus` Hook provides information on the form's status, like when the form is pending. The `pending` property indicates whether the form is currently in the process of being submitted. You can use this property to update the UI while the form is being submitted like disabling form submission buttons or the wording in your UI.

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

`useFormStatus` does not take any parameters.

#### Returns {/*returns*/}

* `pending`: A boolean. If true, the form wrapping the Component calling `useFormStatus` is pending submission.

#### Caveats {/*caveats*/}

* The `useFormStatus` Hook must be called from a Component that is located inside `<form>`. You cannot call `useFormStatus` from the same Component that returns `<form>`.

---

## Usage {/*usage*/}

### Display a pending state during form submission {/*display-a-pending-state-during-form-submission*/}
To display a pending state while a form is submitting, call the `useFormStatus` Hook at the top level of a component that is wraped in the form. The `useFormStatus` Hook provides the `pending` property which is `true` when the form is in the process of being submitted and `false` otherwise. You can use this property to disable the submit button when a form is already being submitted. You can also change the text of the UI to indicate the form is submitting, like changing the text of a button from "Submit" to "Submitting".

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
  return <form action={submit}></form>
}
```

Instead call `useFormStatus` from inside a Component that is located inside `<form>`.

```js
function Button(){
    // ✅ `pending` will be derived from the 
    // form that wraps the Button Component
    const { pending } = useFormStatus() 
    return <button disabled={pending}> //...
}

function Form() {
  return <form><Button /></form>
}
```

</Pitfall>

---

## Troubleshooting {/*troubleshooting*/}

### `pending` is never `true` {/*pending-is-never-true*/}

The `pending` attribute will always have the value `true` if the `useFormStatus` Hook is called from the same component that returns `<form>`. The `useFormStatus` Hook must be called from a Component that is located inside `<form>`. You cannot call `useFormStatus` from the same Component that returns `<form>`.

```js
function Form() {
  const { pending } = useFormStatus() // 🚩 `pending` will never be `true`
  return <form action={submit}> //...
}
```

Instead call `useFormStatus` from inside a Component that is located inside `<form>`.

```js
function Button(){
    // ✅ `pending` will be derived from the 
    // form that wraps the Button Component
    const { pending } = useFormStatus() 
    return <button disabled={pending}> //...
}

function Form() {
  return <form><Button /></form>
}
```
