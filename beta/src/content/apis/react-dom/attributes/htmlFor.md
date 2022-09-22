---
title: htmlFor
---

<Intro>

In React, the `htmlFor` attribute is used to specify which `form` element a `<label>` corresponds to.

<Note>

Since `for` is a reserved word in JavaScript, `htmlFor` is used instead of the HTML attribute `for` in React.

</Note>

</Intro>

<InlineToc />

## Usage {/*usage*/}

### Using the `htmlFor` property {/*using-the-htmlFor-property*/}

In this example, a `<label>` is bound to an `<input>` element with the `id` attribute. To denote the relation, the `htmlFor` and the `id` attributes are given the same value.

<Sandpack>

``` js App.js
export default function MyComponent() {

return (
    <>
    <label htmlFor= "name">Enter your Name:
    <input id="name" />
    </label>
    </>
  );

}
```

</Sandpack>
