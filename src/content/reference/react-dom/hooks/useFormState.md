---
title: useFormState
canary: true
---

<Canary>

The `useFormState` Hook is currently only available in React's canary and experimental channels. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`useFormState` is a Hook that allows you to show error messages or other responses after submitting a form.

```js
const [state, formAction] = useFormState(action, initalState);
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useFormState()` {/*useformstate*/}

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

* `action`: The action to be performed when the form is submitted. It can be a server or a client action. When the action is called, it will receive the previous state of the form (initially the `initialState` that you pass, subsequently its previous return value) as its initial argument, followed by the arguments that an action normally receives.
* `initialState`: The value you want the state to be initially. It can be any serializable value. This argument is ignored after the form is first submitted.


#### Returns {/*returns*/}

`useFormState` returns an array with exactly two values:

1. The current state. During the first render, it will match the `initialState` you have passed. After the form is submitted, it will match the value returned by the action.
2. A new action that you can pass as the `action` prop to your `form` component.

---

## Usage {/*usage*/}

### Display a message after submitting a form {/*display-a-message-after-submitting-a-form*/}

To display messages such as an error message or toast that's returned by a server action, wrap the action in a call to `useFormState`.

<Sandpack>

```js App.js
import { useState } from "react";
import { experimental_useFormState as useFormState } from "react-dom";
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


### Display structured information after submitting a form {/*display-structured-information-after-submitting-a-form*/}

The return value from a server action can be any serializable value. For example, it could be an object that includes a boolean indicating whether the action was successful, an error message, or updated information.

<Sandpack>

```js App.js
import { useState } from "react";
import { experimental_useFormState as useFormState } from "react-dom";
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

