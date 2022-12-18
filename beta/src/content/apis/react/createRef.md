---
title: createRef
---

<Pitfall>

`createRef` is mostly used for [class components.](/apis/react/Component) Function components typically rely on [`useRef`](/apis/react/useRef) instead.

</Pitfall>

<Intro>

`createRef` creates a [ref](/learn/referencing-values-with-refs) object which can contain arbitrary value.

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

</Intro>

<InlineToc />

---

## Usage {/*usage*/}

### Declaring a ref in a class component {/*declaring-a-ref-in-a-class-component*/}

To declare a ref inside a [class component,](/apis/react/Component) call `createRef` and assign its result to a class field:

```js {4}
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

If you now pass `ref={this.inputRef}` to an `<input>` in your JSX, React will populate `this.inputRef.current` with the input DOM node. For example, here is how you make a button that focuses the input:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

<Pitfall>

`createRef` is mostly used for [class components.](/apis/react/Component) Function components typically rely on [`useRef`](/apis/react/useRef) instead.

</Pitfall>

---

## Alternatives {/*alternatives*/}

### Migrating from a class with `createRef` to a function with `useRef` {/*migrating-from-a-class-with-createref-to-a-function-with-useref*/}

We recommend to use function components instead of [class components](/apis/react/Component) in the new code. If you have some existing class components using `createRef`, here is how you can convert them. This is the original code:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

When you [convert this component from a class to a function,](/apis/react/Component#alternatives) replace calls to `createRef` with calls to [`useRef`:](/apis/react/useRef)

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
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

### `createRef()` {/*createref*/}

Call `createRef` to declare a [ref](/learn/referencing-values-with-refs) inside a [class component.](/apis/react/Component)

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
```

<Pitfall>

`createRef` is mostly used for [class components.](/apis/react/Component) Function components typically rely on [`useRef`](/apis/react/useRef) instead.

</Pitfall>

#### Parameters {/*parameters*/}

`createRef` takes no parameters.

#### Returns {/*returns*/}

`createRef` returns an object with a single property:

* `current`: Initially, it's set to the `null`. You can later set it to something else. If you pass the ref object to React as a `ref` attribute to a JSX node, React will set its `current` property.

#### Caveats {/*caveats*/}

* `createRef` always returns a *different* object. It's equivalent to writing `{ current: null }` yourself.
* In a function component, you probably want [`useRef`](/apis/react/useRef) instead which always returns the same object.
* `const ref = useRef()` is equivalent to `const [ref, _] = useState(() => createRef(null))`.


