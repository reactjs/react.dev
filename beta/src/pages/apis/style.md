---
title: style
---

<Intro>

In React, the `style` attribute accepts a `JavaScript` object with camelCased properties rather than a CSS string. This is consistent with the DOM style JavaScript property, is more efficient, and prevents XSS security holes.

</Intro>

<Note>

`style` is used in some examples of this documentaion for demonstration purpose. Using the style attribute as the primary means of styling elements is not recommended.

In most cases, `className` should be used to reference classes defined in an external CSS stylesheet. `style` is most often used in React applications to add dynamically-computed styles at render time.

`style` attribute, can only be passed to the built-in DOM elements.

</Note>

- [Usage](#usage)
  - [Using `style` attribute](#using-style-attribute)

## Usage {/*usage*/}

### Using `style` attribute {/*using-style-attribute*/}

Here is an example that demonstrates the usage of `style` attribute with `<button>` element. The `buttonstyle` is a object that holds the styliing properties. You can observe that `fontSize` property is camelCased as opposed to the usual hypenated.

<Sandpack>

``` js App.js
import React from 'react';
import { useState } from 'react';

export default function MyComponent() {

const buttonStyle = {
  color: 'black',
  background: 'aqua',
  height: 30,
  fontSize: 20

};

  return (
     <button style={buttonStyle}>Click Me!</button>
  )
}

```
</Sandpack>

If you want to apply inline style, then observe the below example. Here, the `style` attribute has the styling properties passed within the **two sets of curly braces**.

<Sandpack>

``` js App.js
import React from 'react';
import { useState } from 'react';

export default function MyComponent() {

  return (
     <h1 style={{fontSize:30}}>Welcome to React Docs</h1>
  )
}

```
</Sandpack>
