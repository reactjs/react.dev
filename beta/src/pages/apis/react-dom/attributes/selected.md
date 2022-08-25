---
title: selected
---

<Intro>

When creating a drop down list using the `<select>` tag, to mark an `<option>` as selected, **reference the value of that option in the `value` attribute of its `<select>` tag**.

</Intro>

- [Usage](#usage)
  - [Using the `selected` property in the `<select>` tag](#using-selected-property)

## Usage {/*usage*/}

### Using the `selected` property in the `<select>` tag {/*using-selected-property*/}

In this example, we are rendering a `Dropdown` component. Here, to mark the value of `selected` in the dropdown, the `value` attribute is set with the reference value `mypet`. Hence, every time the value of `mypet` changes, the change is set as the `value` of the `<select>` tag.

<Sandpack>

``` js App.js

import React from 'react';
import { useState } from 'react';

export default function Dropdown() {
  const [myPet, setMyPet] = useState("Tarantula");

  const handleChange = (event) => {
    setMyPet(event.target.value)
  }

  return (
    <form>
    <label> Which is your favorite pet?
      <select value={myPet} onChange={handleChange}>
        <option value="Tarantula">Tarantula</option>
        <option value="Ants">Ants</option>
        <option value="Parrot">Parrot</option>
      </select>
      </label>

    </form>
  )
}
```

</Sandpack>
