---
title: defaultValue
---

<Intro>

`defaultValue` is the uncontrolled version of `value` attribute, which sets the value of a input.

</Intro>

- [Usage](#usage)
  - [Using `defaultValue` attribute](#using-defaultValue-attribute)

## Usage {/*usage*/}

### Using `defaultValue` attribute {/*using-defaultValue-attributes*/}

Here, in the example below, the `MyComponent` component is rendering an `<textarea>` with the attribute `defaultValue` set. Hence, the `<textarea>` has default text when the components mounts.

<Sandpack>

``` js App.js

import React from 'react';
import { useState } from 'react';

export default function MyComponent() {
  const [value, setValue] = useState("First name");

    return (
      <>
        <h3>Input</h3>
        <label htmlFor="content">
          Enter Name
        </label>
        <textarea
          id="content"
          defaultValue={value}
        />
      </>
    );
  }

```
</Sandpack>
