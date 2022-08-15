---
title: className
---

<Intro>

In React, to access a `CSS` class, use `className` attribute. This applies to all regular DOM and SVG elements like `<div>`, `<p>`, `<a>`, and others. If you use React with Web Components (which is uncommon), use the class attribute instead.

Note: In JavaScript the `class` keyword id reserved for creating a class, which is why React diffrentiates the `CSS` sepecific class as `className`.

</Intro>

- [Usage](#usage)
  - [Using `className` attribute](#using-classname-attribute)

## Usage {/*usage*/}

### Using `className` attribute {/*using-classname-attributes*/}

The example below demonstrates the usage of`className` attribute with React. Here, a component called `Button`is being rendered. It returns a `<button>` element that has an attribute `className` specified. This `className` attribute refers to the CSS style `.buttonStyle`, which defines styles for `button`.

<Sandpack>

``` js App.js
import { useState } from 'react';
import './Styles.css';

export default function Button() {

  return (
    <button className= 'buttonStyle'> Send </button>
  );
}

```

```css Styles.css

.buttonStyle { color:#0000FE; background-color: lightblue; }

```
</Sandpack>
