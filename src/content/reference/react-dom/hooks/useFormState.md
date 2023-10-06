---
title: useFormState
canary: true
---

<Canary>

The `useFormState` Hook is currently only available in React's canary and experimental channels. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels). In addition, you need to use a framework that supports React Server Components to get the full benefit of `useFormState`.

</Canary>

<Intro>

`useFormState` is a Hook that allows you to read the return value of the form action after a form is submitted.

```js
const [state, formAction] = useFormState(action, initalState);
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useFormState()` {/*useformstate*/}

In the context of React Server Components, an *action* is a function that may be [executed when a form is submitted](/reference/react-dom/components/form). You can execute actions on the server or on the client.

{/* TODO T164397693: link to actions documentation once it exists */}

Call `useFormState` at the top level of your component to see the return value of an action after submitting a form. You pass `useFormState` an existing action as well as an initial state, and it returns a new action that you use when submitting your form, along with the latest form state.

```js
function AddToCart({itemID}) {
  const [message, formAction] = useFormState(addToCartAction, null);
  return (
    <form action={formAction}>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit" label="Add to cart" />
      <p>
        {message}
      </p>
    </form>
  )
}
```

The form state is the value returned by the action when the form was last submitted. If the form has not yet been submitted, it is the initial state that you pass.

If used with a server action, `useFormState` allows the server's response from submitting the form to be shown even before hydration has completed.

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `action`: The action to be performed when the form is submitted. When the action is called, it will receive the previous state of the form (initially the `initialState` that you pass, subsequently its previous return value) as its initial argument, followed by the arguments that an action normally receives.
* `initialState`: The value you want the state to be initially. It can be any serializable value. This argument is ignored after the form is first submitted.

{/* TODO T164397693: link to serializable values docs once it exists */}


#### Returns {/*returns*/}

`useFormState` returns an array with exactly two values:

1. The current state. During the first render, it will match the `initialState` you have passed. After the form is submitted, it will match the value returned by the action.
2. A new action that you can pass as the `action` prop to your `form` component.

#### Caveats {/*caveats*/}

* When used with a framework that supports React Server Components, `useFormState` lets you make forms interactive before JavaScript has executed on the client. When used without Server Components, there is no advantage to using it over component local state.
* The action passed to `useFormState` receives an extra argument, the previous or initial state state, as its first argument. This makes its signature different than if it were used directly without `useFormState`.

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

When the form is submitted, the <CodeStep step={3}>action</CodeStep> that you provided will be called. Its return value will become the new <CodeStep step={1}>current state</CodeStep> of the form.

The <CodeStep step={3}>action</CodeStep> that you provide will also receive a new first argument, namely the <CodeStep step={1}>current state</CodeStep> of the form. The first time the form is submitted, this will be the <CodeStep step={4}>initial state</CodeStep> you provided, while with subsequent submissions, it will be the return value from the last time the action was called. The rest of the arguments are the same as if `useFormState` had not been used

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'next state';
}
```

<Recipes titleText="Display information after submitting a form" titleId="display-information-after-submitting-a-form">

#### Display form errors {/*display-form-errors*/}

To display messages such as an error message or toast that's returned by a server action, wrap the action in a call to `useFormState`.

<Sandpack>

```js App.js
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
      <AddToCartForm itemID="1" itemTitle="Javascript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="Javascript: The Good Parts" />
    </>
  )
}
```

```js actions.js
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

```css styles.css hidden
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
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>

<Solution />

#### Display structured information after submitting a form {/*display-structured-information-after-submitting-a-form*/}

The return value from a server action can be any serializable value. For example, it could be an object that includes a boolean indicating whether the action was successful, an error message, or updated information.

<Sandpack>

```js App.js
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
      <AddToCartForm itemID="1" itemTitle="Javascript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="Javascript: The Good Parts" />
    </>
  )
}
```

```js actions.js
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

```css styles.css hidden
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
    "react": "experimental",
    "react-dom": "experimental",
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
