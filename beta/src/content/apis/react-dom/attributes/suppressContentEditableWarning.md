---
title: suppressContentEditableWarning
---

<Intro>

When an element with children is marked as `contentEditable`, a warning is generated. You can suppress that warning by setting the `suppressContentEditableWarning` attribute to `true`.

</Intro>

<Note>

Don’t use `suppressContentEditableWarning` unless you are building a library like [Draft.js](https://draftjs.org/) that manages `contentEditable` manually.
</Note>

<InlineToc />

## Usage {/*usage*/}

### Using the `suppressContentEditableWarning` attribute {/*using-the-suppressContentEditableWarning-attribute*/}

In this example, the `<div>` is editable because the `contentEditable` attribute is set to true. Typically you would you get a warning, but this example is warning-free because the `suppressContentEditableWarning` attribute is set to true.

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
