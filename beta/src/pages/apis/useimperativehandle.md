---
title: useImperativeHandle
---

<Intro>

`useImperativeHandle` customizes the instance value that is exposed to the parent components when using `ref`.

```js
useImperativeHandle(ref, createHandle, [deps])
```
</Intro>

- [Usage](#usage)
  - [Exposing required functions to a parent component](#exposing-required-functions-to-a-parent-component)
  - [Using `forwardRef` hook with `useImperativeHandle`](#Using-forwardref-hook-with-useimperativehandle)
- [Reference](#reference)
  - [`useImperativeHandle(ref, createHandle, [deps])`](#useimperativehandle)


## Usage {/*usage*/}


### Exposing required functions to a parent component {/*exposing-required-functions-to-a-parent-component*/}

`useImperativeHandle` allows child components to determine which functions are exposed to a parent component when using `ref`.

For example, blur(), focus(), etc. You can also expose custom-built functions to a parent component.

`useImperativeHandle` receives a `ref` as the first argument from the hook[`forwardRef`](api/forwardref). And within the `useImperativeHandle` only the `focus()` method is exposed.

Assign the current value of the `realInputRef` to focus().

```js {4,9}

import {forwardRef, useRef, useImperativeHandle} from 'react';

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Only expose focus and nothing else
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});

//...

```

Next, `realInputRef` inside `MyInput` holds the actual input DOM node. However, `useImperativeHandle` instructs React to provide your own special object as the value of a ref to the parent component.


```js {12}

import {forwardRef, useRef, useImperativeHandle} from 'react';

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Only expose focus and nothing else
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});

//...
```

The `ref` that is returned to the parent component is the modified value from the child component. When the `onClick` event of DOM node i.e. `<button>` is triggered, the focus is set on the `<MyInput component>`.


```js {10}
export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}

```

### `useImperativeHandle` with `forwardRef` hook {/*useimperativehandle-with-forwardref-hook*/}


We recommend that you use `useImperativeHandle` with [`forwardRef`](api/forwardref) and avoid using `ref`. `forwardRef` forwards the `ref` from the parent component to the child component, and `useImperativeHandle` can modify the ref and expose the necessary functions-- this facilitates lightweight bidirectional flow.

<Sandpack>

``` js

import {
  forwardRef,
  useRef,
  useImperativeHandle
} from 'react';

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Only expose focus and nothing else
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}

```

</Sandpack>

## Reference {/*reference*/}

### `useImperativeHandle(ref, createHandle, [deps])` {/*useimperativehandleref-createhandle-deps*/}

Call `useImperativeHandle` outside any component to use it.

```js
import { useImperativeHandle } from 'react';

useImperativeHandle(ref, createHandle, [deps])
```
### Parameters {/*parameters*/}
**ref**- `useImperativeHandle` accepts a `ref`  from the parent component as a parameter.

**function**- A `createhandle` function whose return value replaces the stored value in the `ref` object and the whole function is updated when the dependency array changes.

**dependency array**- A array of dependency can be passed to determine when the `ref` value in a function gets updated. If one of the dependencies changes then the `ref` value is updated.

### Returns {/*returns*/}

`useImperativeHandle` returns a custom function or in-built function of the child component. This return value modifies the `ref` object passed by the parent component.
