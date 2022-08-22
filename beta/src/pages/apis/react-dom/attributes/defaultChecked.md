---
title: defaultChecked
---

<Intro>

`defaultChecked` is the uncontrolled equivalent, which sets an element as checked or unchecked when it is first mounted.

</Intro>

- [Usage](#usage)
  - [Using the `defaultChecked` attribute](#using-the-defaultChecked-attribute)

## Usage {/*usage*/}

### Using the `defaultChecked` attribute {/*using-the-defaultChecked-attributes*/}

Here, in the example below, the `Checkbox` component is rendering an `<input>` of the type `checkbox` with the attribute `defaultChecked` set to `true` using the `useState` hook. Hence, the checkbox is checked when the component loads.

<Sandpack>

``` js

import { useState } from 'react';

export default function Checkbox() {
  const [checked, setChecked] = useState(true);

  return (
    <label>
      <input type="checkbox"
        defaultChecked={checked}
        onChange={() => setChecked(!checked)}
      />
      Select
    </label>
  );
}

```
</Sandpack>
