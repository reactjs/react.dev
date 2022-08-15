---
title: onChange
---

<Intro>

The `onChange` event fires everytime there is a change in there is a change in a `form` field.

We intentionally do not use the existing browser behavior, because `onChange` is a misnomer for its behavior and React relies on this event to handle user input in real time.



</Intro>

- [Usage](#usage)
  - [Using `onChange` property](#using-onChange-property)

## Usage {/*usage*/}

### Using `onChange` property {/*using-onChange-property*/}

In the example below, a form filed with the `<input>` element is being rendered. The `onChange` event fires when there is a change in the `<input>` field and corresponding function is executed.


<Sandpack>

``` js App.js

import React from 'react';

export default function MyForm() {

  function handleChange(event) {
    console.log(event.target.value);
  }

  return (
    <label> Enter First Name:
    <input name="firstName" onChange={handleChange} />
    </label>
  );
}
```

</Sandpack>
