---
title: className
---

<Intro>

To access a `CSS` class in React, use the `className` attribute. This applies to all regular DOM and SVG elements like `<div>`, `<p>`, `<a>`, and others. If you use React with Web Components (which is uncommon), use the `class` attribute instead.

<Note>

Since the `class` keyword is reserved for creating a class in JavaScript, `className` is used to differentiate the `CSS` class in React.

</Note>

</Intro>

<InlineToc />

## Usage {/*usage*/}

### Using the `className` attribute {/*using-the-classname-attribute*/}

In this example, a component called `Button` is being rendered. It returns a `<button>` element that has a `className` specified. The `className` attribute in this case refers to the CSS style `.buttonStyle`, which defines styles for `button`.

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
