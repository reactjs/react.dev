---
title: value
---

<Intro>

The `value` attribute is supported by `<input>`, `<select>` and `<textarea>` elements. You can use it to set the value of an element. This is useful for building controlled components.

</Intro>

- [Usage](#usage)
  - [Using `value` attribute](#using-value-attribute)

## Usage {/*usage*/}

### Using `value` attribute {/*using-value-attributes*/}

In the example below, `<input>` element of the `type="radio"`is being rendered. To set the selection, the `value` attribute is used.

<Sandpack>

``` js App.js

import { React, useState } from 'react';

export default function MyForm() {
  const [selection, setMySelection] = useState("");

  const handleChange = (e) => {
    setMySelection(e.target.value);
  }

  return (
    <>
      <h2>Which of the following is true?</h2>
      <label>
      <input type="radio" value="reactbest" checked={selection === 'reactbest'} onChange={handleChange} />
      React is the best!
      </label>
      <label>
      <input type="radio" value="reactcool" checked={selection === 'reactcool'} onChange={handleChange} />
      React is cool!
      </label>
    </>
  );
}

```
</Sandpack>
