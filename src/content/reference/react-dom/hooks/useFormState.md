---
title: useFormState
canary: true
---

<Canary>

The `useFormState` Hook is currently only available in React's Canary and experimental channels. Learn more about [release channels here](/community/versioning-policy#all-release-channels). In addition, you need to use a framework that supports [React Server Components](/reference/react/use-client) to get the full benefit of `useFormState`.

</Canary>

<Intro>

`useFormState` is a Hook that allows you to update state based on the result of a form action.

```js
const [state, formAction] = useFormState(fn, initialState);
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useFormState(action, initialState)` {/*useformstate*/}

{/* TODO T164397693: link to actions documentation once it exists */}

Call `useFormState` at the top level of your component to create component state that is updated [when a form action is invoked](/reference/react-dom/components/form). You pass `useFormState` an existing form action function as well as an initial state, and it returns a new action that you use in your form, along with the latest form state. The latest form state is also passed to the function that you provided.

```js
import { useFormState } from "react-dom";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useFormState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Increment</button>
    </form>
  )
}
```

The form state is the value returned by the action when the form was last submitted. If the form has not yet been submitted, it is the initial state that you pass.

If used with a Server Action, `useFormState` allows the server's response from submitting the form to be shown even before hydration has completed.

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `fn`: The function to be called when the form is submitted or button pressed. When the function is called, it will receive the previous state of the form (initially the `initialState` that you pass, subsequently its previous return value) as its initial argument, followed by the arguments that a form action normally receives.
* `initialState`: The value you want the state to be initially. It can be any serializable value. This argument is ignored after the action is first invoked.

{/* TODO T164397693: link to serializable values docs once it exists */}

#### Returns {/*returns*/}

`useFormState` returns an array with exactly two values:

1. The current state. During the first render, it will match the `initialState` you have passed. After the action is invoked, it will match the value returned by the action.
2. A new action that you can pass as the `action` prop to your `form` component or `formAction` prop to any `button` component within the form.

#### Caveats {/*caveats*/}

* When used with a framework that supports React Server Components, `useFormState` lets you make forms interactive before JavaScript has executed on the client. When used without Server Components, it is equivalent to component local state.
* The function passed to `useFormState` receives an extra argument, the previous or initial state, as its first argument. This makes its signature different than if it were used directly as a form action without using `useFormState`.

---

## Usage {/*usage*/}

### Using information returned by a form action {/*using-information-returned-by-a-form-action*/}

Call `useFormState` at the top level of your component to access the return value of an action from the last time a form was submitted.

```js [[1, 5, "state"], [2, 5, "formAction"], [3, 5, "action"], [4, 5, "null"], [2, 8, "formAction"]]
import { useFormState } from 'react-dom';
import { action } from './actions.js';

function MyComponent() {
  const [state, formAction] = useFormState(action, null);
  // ...
  return (
    <form action={formAction}>
      {/* ... */}
    </form>
  );
}
```

`useFormState` returns an array with exactly two items:

1. The <CodeStep step={1}>current state</CodeStep> of the form, which is initially set to the <CodeStep step={4}>initial state</CodeStep> you provided, and after the form is submitted is set to the return value of the <CodeStep step={3}>action</CodeStep> you provided.
2. A <CodeStep step={2}>new action</CodeStep> that you pass to `<form>` as its `action` prop.

When the form is submitted, the <CodeStep step={3}>action</CodeStep> function that you provided will be called. Its return value will become the new <CodeStep step={1}>current state</CodeStep> of the form.

The <CodeStep step={3}>action</CodeStep> that you provide will also receive a new first argument, namely the <CodeStep step={1}>current state</CodeStep> of the form. The first time the form is submitted, this will be the <CodeStep step={4}>initial state</CodeStep> you provided, while with subsequent submissions, it will be the return value from the last time the action was called. The rest of the arguments are the same as if `useFormState` had not been used.

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'next state';
}
```

<Recipes titleText="Display information after submitting a form" titleId="display-information-after-submitting-a-form">

#### Display form errors {/*display-form-errors*/}

To display messages such as an error message or toast that's returned by a Server Action, wrap the action in a call to `useFormState`.

<Sandpack>

```js src/App.js
import { useState } from "react";
import { useFormState } from "react-dom";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction] = useFormState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {message}
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "Added to cart";
  } else {
    return "Couldn't add to cart: the item is sold out.";
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
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

<Solution />

#### Display structured information after submitting a form {/*display-structured-information-after-submitting-a-form*/}

The return value from a Server Action can be any serializable value. For example, it could be an object that includes a boolean indicating whether the action was successful, an error message, or updated information.

<Sandpack>

```js src/App.js
import { useState } from "react";
import { useFormState } from "react-dom";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [formState, formAction] = useFormState(addToCart, {});
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {formState?.success &&
        <div className="toast">
          Added to cart! Your cart now has {formState.cartSize} items.
        </div>
      }
      {formState?.success === false &&
        <div className="error">
          Failed to add to cart: {formState.message}
        </div>
      }
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return {
      success: true,
      cartSize: 12,
    };
  } else {
    return {
      success: false,
      message: "The item is sold out.",
    };
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
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

<Solution />

</Recipes>

## Troubleshooting {/*troubleshooting*/}

### My action can no longer read the submitted form data {/*my-action-can-no-longer-read-the-submitted-form-data*/}

When you wrap an action with `useFormState`, it gets an extra argument *as its first argument*. The submitted form data is therefore its *second* argument instead of its first as it would usually be. The new first argument that gets added is the current state of the form.

```js
function action(currentState, formData) {
  // ...
}
```
