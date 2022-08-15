---
title: suppressContentEditableWarning
---

<Intro>

When an element with children is also marked as `contentEditable` there is warning. You can suppress that warning by setting `suppressContentEditableWarning` attribute to true.

</Intro>

<Note>

Don’t use `suppressContentEditableWarning` unless you are building a library like [Draft.js](https://draftjs.org/), that manages contentEditable manually.
</Note>

- [Usage](#usage)
  - [Using `suppressContentEditableWarning` attribute](#using-style-suppressContentEditableWarning)

## Usage {/*usage*/}

### Using `suppressContentEditableWarning` attribute {/*using-style-suppressContentEditableWarning*/}

In the example below, the `<div>` is editable because `contentEditable` attribute is set to true, and you get a warning when this happens.

To make the code warning free, `suppressContentEditableWarning` is set to true.

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
