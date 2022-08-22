---
title: suppressContentEditableWarning
---

<Intro>

When an element with children is also marked as `contentEditable`, a warning is generated. You can suppress that warning by setting `suppressContentEditableWarning` attribute to `true`.

</Intro>

<Note>

Don’t use `suppressContentEditableWarning` unless you are building a library like [Draft.js](https://draftjs.org/), that manages contentEditable manually.
</Note>

- [Usage](#usage)
  - [Using the `suppressContentEditableWarning` attribute](#using-the-style-suppressContentEditableWarning)

## Usage {/*usage*/}

### Using the `suppressContentEditableWarning` attribute {/*using-the-style-suppressContentEditableWarning*/}

In the example below, the `<div>` is editable because the `contentEditable` attribute is set to `true`, and you get a warning when this happens.

Make the code warning-free by setting`suppressContentEditableWarning` to `true`.

<Sandpack>

``` js App.js
import React from 'react';
import { useState } from 'react';

export default function MyComponent() {

  return (
    <>
      <label> Editable `div` container
      <div style={{borderStyle:'solid'}} contentEditable={true} suppressContentEditableWarning={true} >
      <h1>Hello</h1>
      </div>
      </label>
      </>
      );

}

```
</Sandpack>
