---
title: forwardRef()
---

<Intro>

`forwardRef()` lets your component receive a [ref](/learn/manipulating-the-dom-with-refs) and forward it to a child component.

```js
const SomeComponent = forwardRef((props, ref) => {
  // ...
});
```

</Intro>

---

## Usage {/*usage*/}

### Exposing a DOM node to the parent component {/*exposing-a-dom-node-to-the-parent-component*/}

By default, components don't expose their DOM nodes. To opt in, wrap your component in a `forwardRef` call:

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


