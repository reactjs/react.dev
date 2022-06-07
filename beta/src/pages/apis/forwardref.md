---
title: forwardref
---

<Intro>

`forwardref` forwards the [ref](api/useref) attribute it receives to a child React component.

```js
const MyInputComponent= forwardRef((props, ref) => (return component));
```

</Intro>

- [Usage](#usage)
  - [Forwarding refs to the DOM](#forwarding-refs-to-the-DOM)
  - [`forwardref` with useImperativeHandle hook](#forwardref-with-useImperativeHandle-hook)
- [Reference](#reference)
  - [`const MyInputComponent = forwardRef((props, ref) => {return <input {...props} ref={ref} />;});`](#forwardref)

---

## Usage {/*usage*/}

### Forwarding refs to the DOM {/*forwarding-refs-to-the-DOM*/}

Call `forwardref` to wrap a component that needs a `ref` to be passed to it by another component.

```js

import { forwardRef, useRef } from 'react';

const MyInputComponent = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

```

The forwardref takes two arguments (props, ref). The second ref argument only exists when you define a component with forwardRef call. This way MyInputComponent can get reference to the underlying button’s DOM node—if necessary. By default, the MyInputComponent component does not opt into using ref.

```js

function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      < MyInputComponent ref={inputRef} />
      <button onClick={handleClick}>
       Focus the input
      </button>
    </>
  );

//...
```

Note: Ref forwarding is an opt-in feature that lets some components take a ref they receive, and pass it further down (in other words, “forward” it) to a child.

Read more about [accessing another component’s DOM nodes](https://beta.reactjs.org/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) and see examples.

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
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

---

### `forwardref` with useImperativeHandle hook {/*fforwardref-with-useImperativeHandle-hook*/}

`forwardref` with `useImperativeHandle` hook is another usage for `forwardref`.

When we use `forwardref` and child component receieves the `ref`from its parent component, there is a possiblity that parent component can manipulate the child components. It would be ideal to limit the exposed functionality to only the ones that are necessary.

The restriction of exposing functionality to parent components can be achieved by using 'useImperativeHandle' hook.

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

---

## Reference {/*reference*/}

### `const MyInputComponent = forwardRef((props, ref) => {return <input {...props} ref={ref} />;});` {/*forwardref*/}

Call `forwardref` to wrap a component that needs ref to be passed to it by another component.

```js
import { forwardRef, useRef } from 'react';

const MyInputComponent = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

```
#### Parameters {/*parameters*/}

`forwardRef` accepts a rendering function as an argument. React will call this function with props and ref as two arguments.

forwardRef((props, ref) => {return <input {...props} ref={ref} />;}

#### Returns {/*returns*/}

`forwardref` returns a React node.
