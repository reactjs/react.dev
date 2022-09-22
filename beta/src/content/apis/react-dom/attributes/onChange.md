---
title: onChange
---

<Intro>

The `onChange` event fires every time there is a change in a `form` field.

We intentionally do not use the existing browser behavior because `onChange` is a misnomer for its behavior. React relies on this event to handle user input in real-time.

</Intro>

- [Usage](#usage)
  - [Using the the `onChange` property](#using-the-the-onChange-property)

## Usage {/*usage*/}

### Using the `onChange` property {/*using-the-onChange-property*/}




In the following examples, a form field with the `<input>` element is being rendered. The `onChange` event fires when there is a change in the `<input>` field, and then the corresponding function is executed.

<Recipes titleText="onChange property examples for various types of <input> elements" titleId="examples-basic">

### `onChange` for input type `text` {/*onChange-for-input-type-text*/}

<Sandpack>

``` js App.js

import React from 'react';

export default function MyForm() {

  function handleChange(event) {
    console.log(event.target.value);
  }

  return (
    <label> Enter First Name:
    <input type="text" name="firstName" onChange={handleChange} />
    </label>
  );
}
```

</Sandpack>

<Solution />

### `onChange` for input type `radio` {/*onChange-for-input-type-radio*/}

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

<Solution />

### `onChange` for input type `checkbox` {/*onChange-for-input-type-checkbox*/}

<Sandpack>

``` js App.js

import React from 'react';
import { useState } from 'react';

export default function MyForm() {
    const [mySelection, setMySelection] = useState("");

  return (
    <>
    <h2>Which of the following do you like?</h2>
    <label>
    <input type="checkbox" onChange={setMySelection} />
    Ice cream
    </label>
    <label>
    <input type="checkbox" onChange={setMySelection} />
    Chocolate
    </label>
    <label>
    <input type="checkbox" onChange={setMySelection} />
    Coffee
    </label>
    </>
  );
}
```

</Sandpack>

<Solution />

### `onChange` for input type `date` {/*onChange-for-input-type-date*/}

<Sandpack>

``` js App.js

import React from 'react';
import { useState } from 'react';

export default function MyForm() {
    const [mySelection, setMySelection] = useState("");

  return (
    <>
    <h2>Select a date</h2>
    <label>Date:
    <input type="date" onChange={setMySelection} />
    </label>
    </>
  );
}
```

</Sandpack>

<Solution />

### `onChange` for input type `file` {/*onChange-for-input-type-file*/}

<Sandpack>

``` js App.js

import React from 'react';
import { useState } from 'react';

export default function MyForm() {
    const [mySelection, setMySelection] = useState("");

  return (
    <>
    <h2>Upload a file</h2>
    <label>
    <input type="file" onChange={setMySelection} />
    </label>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

In this example, a form field with the `<select>` element is being rendered. The onChange event fires when there is a change in the `value` field, and then the corresponding function is executed.

<Recipes titleText="onChange property example for <select> elements" titleId="examples-select">

### `onChange` for `<select>` element {/*onChange-for-select-element*/}

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
    <>
    <form>
    <label> Which is your favourite pet?
      <select value={myPet} onChange={handleChange}>
        <option value="Tarantula">Tarantula</option>
        <option value="Snake">Snake</option>
        <option value="Parrot">Parrot</option>
      </select>
      </label>
    </form>
    </>
  )
}
```

</Sandpack>

<Solution />

</Recipes>
