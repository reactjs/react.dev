---
title: PureComponent
---

<Pitfall>

We recommend to define components as functions instead of classes. [See how to migrate.](#alternatives)

</Pitfall>

<Intro>

`PureComponent` is similar to [`Component`](/apis/react/Component) but it skips re-renders for same props and state. Class components are still supported by React, but we don't recommend using them in new code.

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Usage {/*usage*/}

### Skipping unnecessary re-renders for class components {/*skipping-unnecessary-re-renders-for-class-components*/}

React normally re-renders a component whenever its parent re-renders. As an optimization, you can create a component that React will not re-render when its parent re-renders so long as its new props and state are the same as the old props and state. [Class components](/apis/react/Component) can opt into this behavior by extending `PureComponent`:

```js {1}
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

A React component should always have [pure rendering logic.](/learn/keeping-components-pure) This means that it must return the same output if its props, state, and context haven't changed. By using `PureComponent`, you are telling React that your component complies with this requirement, so React doesn't need to re-render as long as its props and state haven't changed. However, your component will still re-render if a context that it's using changes.

In this example, notice that the `Greeting` component re-renders whenever `name` is changed (because that's one of its props), but not when `address` is changed (because it's not passed to `Greeting` as a prop):

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Pitfall>

We recommend to define components as functions instead of classes. [See how to migrate.](#alternatives)

</Pitfall>

---

## Alternatives {/*alternatives*/}

### Migrating from a `PureComponent` class component to a function {/*migrating-from-a-purecomponent-class-component-to-a-function*/}

We recommend to use function components instead of [class components](/apis/react/Component) in the new code. If you have some existing class components using `PureComponent`, here is how you can convert them. This is the original code:

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

When you [convert this component from a class to a function,](/apis/react/Component#alternatives) wrap it in [`memo`:](/apis/react/memo)

<Sandpack>

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

Unlike `PureComponent`, [`memo`](/apis/react/memo) does not compare the new and the old state. In function components, calling the [`set` function](/apis/react/useState#setstate) with the same state [already prevents re-renders by default,](/apis/react/memo#updating-a-memoized-component-using-state) even without `memo`.

</Note>

---

## Reference {/*reference*/}

### `PureComponent` {/*purecomponent*/}

To skip re-rendering a class component for same props and state, extend `PureComponent` instead of [`Component`:](/apis/react/Component)

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`PureComponent` is a subclass of `Component` and supports [all the `Component` APIs.](/apis/react/Component#reference) Extending `PureComponent` is equivalent to defining a custom [`shouldComponentUpdate`](/apis/react/Component#shouldcomponentupdate) method that shallowly compares props and state.


[See more examples.](#usage)


