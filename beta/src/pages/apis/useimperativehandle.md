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

Add `useImperativeHandle` to customize which value the parent component will receive when it tries to get a ref to your component. To use this Hook, you need to first opt into exposing the ref at all, which you can do with `forwardRef`.

For example, here `MyInput` component exposes an an object with a single `focus` method:

```js {5-9}
const MyInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  const { label, ...otherProps } = props;

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    }
  }))

  return (
    <label>
      {label}
      <input {...otherProps} ref={inputRef} />
    </label>
  );
});
```

As a result, the parent component can call `focus()` on `MyInput` but will not have access to the underlying `<input>` DOM node.

```js {5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={ref} />
      <button onClick={handleClick}>Focus</button>
    </>
  )
}
```

The object inside `inputRef.current` is the object that you returned from the function in the second argument to `useImperativeHandle` in `MyInput`.



You won't use this technique very often but it's helpful if you want to expose some imperative methods like focusing, scrolling, or triggering animations to the parent component without giving it full access to the underlying DOM node.


