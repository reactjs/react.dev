---
title: forwardRef
---

<Intro>

`forwardRef()` lets your component receive a [ref](/learn/manipulating-the-dom-with-refs) and forward it to a child component.

```js
const SomeComponent = forwardRef((props, ref) => {
  // ...
});
```

</Intro>

<InlineToc />

---

## Usage {/*usage*/}

### Exposing a DOM node to the parent component {/*exposing-a-dom-node-to-the-parent-component*/}

By default, components don't expose their DOM nodes. To opt in, wrap your component in a `forwardRef()` call:

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

You will receive a <CodeStep step={1}>ref</CodeStep> as the second argument after props. Pass it to the DOM node that you want to expose:

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

Now the parent `Form` component can access `MyInput`'s internal <CodeStep step={2}>`<input>` DOM node</CodeStep> by [passing a ref](/apis/useref#manipulating-the-dom-with-a-ref) to it:

```js [[1, 2, "ref"], [1, 10, "ref", 30], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name" ref={ref} />
      <button onClick={handleClick}>Edit</button>
    </form>
  )
}
```

This `Form` component passes a ref to `MyInput`. The `MyInput` component *forwards* that ref to the `<input>` browser tag. As a result, the `Form` component can access the `<input>` DOM node and call [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) on it.

Keep in mind that by exposing a ref to the DOM node inside your component, you're making it harder to change your component's internals later. You will typically expose DOM nodes from reusable low-level components like buttons or text inputs, but you won't do it for application-level components like an avatar or a comment.


### Using `forwardRef` with `useImperativeHandle` hook {/*eusing-forwardref-with-useImperativeHandle-hook*/}

When you use `forwardRef`, and a child component receives the `ref` from its parent component, it is possible that a parent component can manipulate the child components. Limiting the DOM exposure is ideal.

To restrict exposing functionality to parent components use [`useImperativeHandle`](#api/useimperativehandle) hook.

**Here's how it works:**

1. [`useImperativeHandle`](#api/useimperativehandle) enables you to restrict the exposure of the functions to the parent components.

2. `forwardRef` facilitates the flow of data from parent to the child component. And, `useImperativeHandle` modifies the `ref` provided by `forwardRef` to expose only the necessary DOM node.

```js {1,6}
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

```

3. The `inputref` below is the modified `ref`. Just like with `forwardRef()` the `Form` component passes a `ref` to `MyInput`. The `MyInput` component forwards that ref to the `<input>` browser tag. As a result, the `Form` component can access the `<input>` DOM node and call `focus()` on it.

``` js {5,10}
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
<Recipes titleText="Example of exposing a DOM node to the parent component and using useImperativeHandle()" titleId="examples-forwardref">

<Sandpack>

```js
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

<Solution />

</Recipes>

---

## Reference {/*reference*/}

### `const SomeComponent = forwardRef((props, ref) => { // ...});` {/*forwardref*/}

Call `forwardRef()` to let your component receive a ref and forward it to a child component.

```js
import { forwardRef, useRef } from 'react';

const SomeComponent = forwardRef((props, ref) => {
  // ...
});

```
#### Parameters {/*parameters*/}

`forwardRef()` accepts a rendering function as an argument. React calls this function with `props` and `ref` as two arguments.

```js
forwardRef((props, ref) => {return <input {...props} ref={ref} />;}
```

* `props`: Pass the `props` to your child component.

* `ref`:  The `ref` object that us created with `useRef()` and has current value that you can modify later.

#### Returns {/*returns*/}

`forwardRef()` returns a React node.