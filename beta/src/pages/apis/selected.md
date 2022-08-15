---
title: selected
---

<Intro>

While creating a drop down list using the `<select>` tag, if you want to mark an `<option>` as selected, then **reference the value of that option in the `value` of its `<select>` instead**.

</Intro>

- [Usage](#usage)
  - [Using `selected` for `<select>`](#using-selected-property)

## Usage {/*usage*/}

### Using `selected` in `<select>` tag {/*using-selected-property*/}




<Sandpack>

``` js App.js

import React from 'react';
import { useState } from 'react';

export default function MyPet() {
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
