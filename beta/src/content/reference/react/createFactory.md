---
title: createFactory
---

<Deprecated>

This API will be removed in a future major version of React. [See the alternatives.](#alternatives)

</Deprecated>

<Intro>

`createFactory` lets you create a function that produces React elements of a given type.

```js
const factory = createFactory(type)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `createFactory(type)` {/*createfactory*/}

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

* `type`: The `type` argument must be a valid React component type. For example, it could be a tag name string (such as `'div'` or `'span'`), or a React component (a function, a class, or a special component like [`Fragment`](/reference/react/Fragment)).

#### Returns {/*returns*/}

Returns a factory function. That factory function receives a `props` object as the first argument, followed by a list of `...children` arguments, and returns a React element with the given `type`, `props` and `children`.

---

## Usage {/*usage*/}

### Creating React elements with a factory {/*creating-react-elements-with-a-factory*/}

Although most React projects use [JSX](/learn/writing-markup-with-jsx) to describe the user interface, JSX is not required. In the past, `createFactory` used to be one of the ways you could describe the user interface without JSX.

Call `createFactory` to create a *factory function* for a specific element type like `'button'`:

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

Calling that factory function will produce React elements with the props and children you have provided:

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

This is how `createFactory` was used as an alternative to JSX. However, `createFactory` is deprecated, and you should not call `createFactory` in any new code. See how to migrate away from `createFactory` below.

---

## Alternatives {/*alternatives*/}

### Copying `createFactory` into your project {/*copying-createfactory-into-your-project*/}

If your project has many `createFactory` calls, copy this `createFactory.js` implementation into your project:

<Sandpack>

```js App.js
import { createFactory } from './createFactory.js';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

```js createFactory.js
import { createElement } from 'react';

export function createFactory(type) {
  return createElement.bind(null, type);
}
```

</Sandpack>

This lets you keep all of your code unchanged except the imports.

---

### Replacing `createFactory` with `createElement` {/*replacing-createfactory-with-createelement*/}

If you have a few `createFactory` calls that you don't mind porting manually, and you don't want to use JSX, you can replace every call a factory function with a [`createElement`](/reference/react/createElement) call. For example, you can replace this code:

```js {1,3,6}
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

with this code:


```js {1,4}
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

Here is a complete example of using React without JSX:

<Sandpack>

```js App.js
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

</Sandpack>

---

### Replacing `createFactory` with JSX {/*replacing-createfactory-with-jsx*/}

Finally, you can use JSX instead of `createFactory`. This is the most common way to use React:

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

<Pitfall>

Sometimes, your existing code might pass some variable as a `type` instead of a constant like `'button'`:

```js {3}
function Heading({ isSubheading, ...props }) {
  const type = isSubheading ? 'h2' : 'h1';
  const factory = createFactory(type);
  return factory(props);
}
```

To do the same in JSX, you need to rename your variable to start with an uppercase letter like `Type`:

```js {2,3}
function Heading({ isSubheading, ...props }) {
  const Type = isSubheading ? 'h2' : 'h1';
  return <Type {...props} />;
}
```

Otherwise React will interpret `<type>` as a built-in HTML tag because it is lowercase.

</Pitfall>
