---
title: defaultValue
---

<Intro>

`defaultValue` is the uncontrolled version of the `value` attribute, which sets the value of an input when it mounts.

</Intro>

- [Usage](#usage)
  - [Using the `defaultValue` attribute](#using-the-defaultValue-attribute)

## Usage {/*usage*/}

### Using the `defaultValue` attribute {/*using-the-defaultValue-attributes*/}

Here, in the example below, the `MyComponent` component is rendering a `<textarea>` with the attribute `defaultValue` set. Hence, the `<textarea>` has default text when the component mounts.

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
