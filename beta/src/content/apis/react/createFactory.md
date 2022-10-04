---
title: createFactory
---

<Deprecated>

This API will be removed in a future major version of React. Use [JSX](/learn/writing-markup-with-jsx) or [`createElement`](/api/react/createElement) instead.

</Deprecated>

<Intro>

`createFactory` lets you create a function that produces React elements of a given type.

```js
const factory = createFactory(type)
```

</Intro>

<InlineToc />

---

## Usage {/*usage*/}

### Creating React elements {/*creating-react-elements*/}

You shouldn't use `createFactory` in new code. In the existing code, it's typically used as an alternative to [JSX:](/learn/writing-markup-with-jsx)

<Sandpack>

```js App.js
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

</Sandpack>

Since `createFactory` has been deprecated, you need to remove it from your project's code.

For example, you can convert it to use [`createElement`](/api/react/createElement) instead of `createFactory` like this:

<Sandpack>

```js App.js
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
};
```

</Sandpack>

Alternatively, you can convert it to use [JSX:](/learn/writing-markup-with-jsx)

<Sandpack>

```js App.js
export default function App() {
  return (
    <button onClick={() => {
      alert('Clicked!');
    }}>
      Click me
    </button>
  );
};
```

</Sandpack>

Every pattern that uses `createFactory` can be converted to either of the two styles above.

<DeepDive title="How is createFactory implemented?">

The full implementation of `createFactory` looks like this:

```js
import { createElement } from 'react';

function createFactory(type) {
  return createElement.bind(null, type);
}
```

If your project uses `createFactory` a lot, you may copy this helper into your project or publish it on npm.

</DeepDive>

---

## Reference {/*reference*/}

### `createFactory(type)` {/*createfactory*/}


<Deprecated>

This API will be removed in a future major version of React. Use [JSX](/learn/writing-markup-with-jsx) or [`createElement`](/api/react/createElement) instead.

</Deprecated>

Call `createFactory(type)` to create a factory function which produces React elements of a given `type`.

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

Then you can use it to create React elements without JSX:

```js
export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

#### Parameters {/*parameters*/}

* `type`: The `type` argument must be a valid React component type. For example, it could be a tag name string (such as `'div'` or `'span'`), or a React component (a function, a class, or a special component like [`Fragment`](/apis/react/Fragment)).

#### Returns {/*returns*/}

Returns a factory function. That factory function receives a `props` object as the first argument, followed by a list of `...children` arguments, and returns a React element with the given `type`, `props` and `children`.
