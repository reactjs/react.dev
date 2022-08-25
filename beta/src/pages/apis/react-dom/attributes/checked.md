---
title: checked
---

<Intro>

The `checked` attribute is supported by the `<input>` components of type `checkbox` or `radio button`. You can use it set whether the component is checked. This is useful for building controlled components.

[`defaultChecked`](/apis/react-dom/attributes/defaultChecked) is the uncontrolled equivalent, which sets whether the component is checked when it is first mounted.

</Intro>

- [Usage](#usage)
  - [Using the `checked` attribute](#using-the-checked-attribute)

## Usage {/*usage*/}

### Using the `checked` attribute {/*using-the-checked-attribute*/}

In this example, an `<input>` of the type `checkbox` is being rendered. We set the `checked` attribute to `false` using the [`useState`](/apis/react/useState) hook.

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
