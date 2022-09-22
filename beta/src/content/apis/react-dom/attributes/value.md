---
title: value
---

<Intro>

The `value` attribute is supported by the `<input>`, `<select>`, and `<textarea>` components. You can use it to set the value of the component. This is useful for building controlled components.

[`defaultValue`](/apis/react-dom/attributes/defaultValue) is the uncontrolled equivalent, which sets the value of the component when it is first mounted.

</Intro>

<InlineToc />

## Usage {/*usage*/}

### Using the `value` attribute {/*using-the-value-attribute*/}

In this example, an `<input>` of the type `radio` is being rendered. To set the selection, the `value` attribute is used.

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
