---
title: checked
---

<Intro>

`checked` attribute can be used to indicate whether an `<input>` element of the type `checkbox` and `radiobutton` is checked. This is useful for building controlled components. `defaultChecked` is the uncontrolled equivalent, which sets whether the component is checked when it is first mounted.

</Intro>

- [Usage](#usage)
  - [Using `checked` attribute](#using-checked-attribute)

## Usage {/*usage*/}

### Using `checked` attribute {/*using-checked-attributes*/}

Let's see some examples of using `checked` attribute while rendering a component in React.

In the following example, you can see that we are rendering an `input` of the type `checkbox` with the attribute `checked` set to `false` using the `useState` hook.

<Sandpack>

``` js
import { useState } from 'react';

export default function Checkbox() {
  const [checked, setChecked] = useState(false);

  return (
    <label>
      <input type="checkbox"
        checked = {checked}
        onChange={() => setChecked(!checked)}
      />
      Select
    </label>
  );
}

```
</Sandpack>


Here, in the example below, the `Checkbox` component is rendering an `input` of the type `checkbox` with the attribute `defaultChecked` set to `true` using the `useState` hook.

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
