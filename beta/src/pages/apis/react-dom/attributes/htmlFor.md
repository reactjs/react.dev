---
title: htmlFor
---

<Intro>

In React, the `htmlFor` attribute is used to specify which `form` element a `<label>` corresponds to.

`htmlFor` attribute is used instead of the HTML attribute `for`, which is a reserved word in JavaScript.

</Intro>

- [Usage](#usage)
  - [Using the `htmlFor` property](#using-the-htmlFor-property)

## Usage {/*usage*/}

### Using `htmlFor` property {/*using-the-htmlFor-property*/}

In the example below, a `<label>` is bound to `<input>` element, who has an `id` attribute. The `<label>` has a `htmlFor` attribute with its value same as the `id` of `<input>` element to denote the relation.

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
