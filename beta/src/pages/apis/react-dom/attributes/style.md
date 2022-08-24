---
title: style
---

<Intro>

In React, the `style` attribute accepts a `JavaScript` object with camelCased properties rather than a CSS string. This is consistent with the DOM style JavaScript property, is more efficient, and prevents XSS security holes.

</Intro>

<Note>

`style` is used in some examples of this documentation for demonstration purposes. Using the style attribute as the primary means of styling elements is not recommended.

In most cases, `className` should be used to reference classes defined in an external CSS stylesheet. `style` attribute is most often used in React applications to add **dynamically-computed** styles at render time.

The `style` attribute can only be passed to the built-in DOM elements.

</Note>

- [Usage](#usage)
  - [Using the `style` attribute](#using-the-style-attribute)

## Usage {/*usage*/}

### Using the `style` attribute {/*using-the-style-attribute*/}

Here is an example that demonstrates the usage of `style` attribute with `<div>` element. `MovingDot` component renders the `<div>` where we capture the cursor movement and **dynamically** add the styling.

Observe that `backgroundColor` property is camelCased as opposed to the usual hyphenated way.

<Note>
If you want to apply inline style, then observe the example. Here, the `style` attribute has the styling properties passed within the **two sets of curly braces**.
</Note>

<Sandpack>

``` js App.js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}

```
</Sandpack>
