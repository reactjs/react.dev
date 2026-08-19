---
title: requestFormReset
---

<Intro>

`requestFormReset` lets you reset a React-managed form after an Action or Transition finishes.

```js
requestFormReset(form)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `requestFormReset(form)` {/*requestformreset*/}

Call `requestFormReset` to request that a form resets after the current Action or Transition completes.

```js
import { startTransition } from 'react';
import { requestFormReset } from 'react-dom';

function handleSubmit(form) {
  startTransition(async () => {
    const formData = new FormData(form);
    requestFormReset(form);
    await save(formData);
  });
}
```

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `form`: an [HTML form element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement) rendered by React.

#### Returns {/*returns*/}

`requestFormReset` returns nothing.

#### Caveats {/*caveats*/}

* Pass a form element that is rendered by React. Passing a non-form element, or a form not managed by React, throws an error.
* `requestFormReset` is intended for Actions and Transitions. If called outside an Action or Transition, React warns in development and performs a synchronous reset.
* `requestFormReset` is useful when you implement form submission logic yourself (for example with `onSubmit` + `startTransition`) and still want React's form reset behavior.
* This API requests a reset for uncontrolled form fields. For controlled fields, handle resets by updating state, such as in `onReset`.

---

## Usage {/*usage*/}

### Requesting a reset in a custom form Action {/*requesting-a-reset-in-a-custom-form-action*/}

React automatically resets uncontrolled fields after a successful `<form action={...}>` submission. When you implement submission manually, you can opt into the same behavior by calling `requestFormReset`.

```js
import { startTransition } from 'react';
import { requestFormReset } from 'react-dom';

function SearchForm() {
  async function onSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      requestFormReset(form);
      await submitSearch(formData);
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <input name="query" defaultValue="react" />
      <button type="submit">Search</button>
    </form>
  );
}
```

If your submission uses the built-in `<form action={...}>` behavior, you don't need to call `requestFormReset` manually.
