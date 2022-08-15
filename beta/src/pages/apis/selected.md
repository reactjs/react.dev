---
title: selected
---

<Intro>

While creating a drop down list using the `<select>` tag, if you want to mark an `<option>` as selected, then **reference the value of that option in the `value` attribute of its `<select>` instead**.

</Intro>

- [Usage](#usage)
  - [Using `selected` for `<select>`](#using-selected-property)

## Usage {/*usage*/}

### Using `selected` in `<select>` tag {/*using-selected-property*/}

In this example, we are rendering a `Dropdown` component. Here, to mark the value `selected` in the dropdown, the 'value' attribute is being set with the refernced value of `mypet`. Hence, every time the value of `mypet` changes it is set as the `value` of `<select>` tag.

<Sandpack>

``` js App.js

import React from 'react';
import { useState } from 'react';

export default function Dropdown() {
  const [myPet, setMyPet] = useState("Dog");

  const handleChange = (event) => {
    setMyPet(event.target.value)
  }

  return (
    <form>
    <label> Which is your favourite pet?
      <select value={myPet} onChange={handleChange}>
        <option value="Dog">Dog</option>
        <option value="Cat">Cat</option>
        <option value="Hamster">Hamster</option>
      </select>
      </label>

    </form>
  )
}
```

</Sandpack>
