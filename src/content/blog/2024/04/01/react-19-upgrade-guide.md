---
title: "React 19 Beta Upgrade Guide"
---

April 1, 2024 by [The React Team](/community/team)

---

<Intro>

Today we're releasing a beta version of React 19, the next major version of React.  In this post, we will guide you through the steps for upgrading.

If you'd like to help us test React 19, follow the steps in this upgrade guide and [report any issues](https://github.com/facebook/react/issues/new/choose) you encounter.

</Intro>

<InlineToc />

<Note>

React Conf 2024 is scheduled for May 15–16 in Henderson, Nevada!

For more see [the React Conf website](https://conf.react.dev).

</Note>

---
## Installing {/*installing*/}

To install the latest version of React:

```bash
npm install react react-dom
```

Or if you’re using yarn:

```bash
yarn add react react-dom
```
<Note>
#### New JSX Transform is now required {/*new-jsx-transform-is-now-required*/}

We introduced a [new JSX transform](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) in 2020 to improve bundle size and use JSX without importing React. In React 19, we're adding additional improvements like using ref as a prop and JSX speed improvements that require the new transform.


If you haven't already, you will need to enable the new transform in your project. We expect most apps will not be effected since the transform is enabled in most environments already. For manual instructions on how to upgrade, please see the [announcement post](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).

</Note>

## Removing deprecated React APIs {/*removing-deprecated-react-apis*/}

### Removing PropTypes and DefaultProps {/*removing-proptypes-and-defaultprops*/}
`PropTypes` were been [deprecated in v15.5.0](https://legacy.reactjs.org/blog/2017/04/07/react-v15.5.0.html#new-deprecation-warnings). 

In React 19, we're removing the PropType checks from the React package, and using them will be silently ignored. If you're using PropTypes, we recommend migrating to TypeScript or another type-checking solution. We're also removing `defaultProps` in place of ES6 default parameters.

```js
// Before
import PropTypes from 'prop-types';

function Heading({text}) {
  return <h1>{text}</h1>;
}
Heading.propTypes = {
  text: PropTypes.string,
};
Heading.defaultProps = {
  text: 'Hello, world!',
};
```
```ts
// After
interface Props {
  text?: string;
}
function Heading({text = 'Hello, world!'}: Props) {
  return <h1>{text}</h1>;
}
```

### Removing Legacy Context {/*removing-legacy-context*/}

Legacy Context using `contextTypes` and `getChildContext` was [deprecated in v16.6.0](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html) due to subtle bugs that were easy to miss. In React 19, we're removing Legacy Context to make React slightly smaller and faster.

If you're still using Legacy Context in class components, you'll need to migrate to the new `contextType` API:

```js
// Before
import PropTypes from 'prop-types';

class Parent extends React.Component {
  static childContextTypes = {
    foo: PropTypes.string.isRequired,
  };

  getChildContext() {
    return { foo: 'bar' };
  }

  render() {
    return <Child />;
  }
}

class Child extends React.Component {
  static contextTypes = {
    foo: PropTypes.string.isRequired,
  };

  render() {
    return <div>{this.context.foo}</div>;
  }
}
```

```js
// After
const FooContext = React.createContext();

class Parent extends React.Component {
  render() {
    return (
      <FooContext value='bar'>
        <Child />
      </FooContext>
    );
  }
}

class Child extends React.Component {
  static contextType = FooContext;

  render() {
    return <div>{this.context}</div>;
  }
}
```

### Removing string refs {/*removing-string-refs*/}
String refs were [deprecated in v16.3.0](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html) because they had [multiple downsides](https://github.com/facebook/react/issues/1373). In React 19, we're removing string refs to make React simpler and easier to understand.

If you're still using string refs in class components, you'll need to migrate to ref callbacks:

```js
// Before
class MyComponent extends React.Component {
  componentDidMount() {
    this.refs['input'].focus();
  }

  render() {
    return <input ref='input' />;
  }
}
```

```js
// After
// Before
class MyComponent extends React.Component {
  componentDidMount() {
    this.input.focus();
  }

  render() {
    return <input ref={input => this.input = input} />;
  }
}
```

<Note>

To help with the migration, we've created a [react-codemod](/todo) that will automatically update your code to use ref callbacks.

TODO: instructions.

</Note>

### Removing module pattern factories {/*removing-module-pattern-factories*/}
Module pattern factories were [deprecated in v16.9.0](https://legacy.reactjs.org/blog/2019/08/08/react-v16.9.0.html#deprecating-module-pattern-factories) because they were rarely used and supporting it causes React to be slightly larger and slower than necessary. In React 19, we're removing support for module pattern factories, and you'll need to migrate to regular functions:

```js
// Before
function FactoryComponent() {
  return { render() { return <div />; } }
}
```

```js
// After
function FactoryComponent() {
  return <div />;
}
```

### Removing `createFactory` {/*removing-createfactory*/}
`createFactory` was [deprecated in v16.13.0](https://legacy.reactjs.org/blog/2020/02/26/react-v16.13.0.html#deprecating-createfactory) because it was rarely used and is replaced by JSX. In React 19, we're removing `createFactory` and you'll need to migrate to JSX:

```js
// Before
import { createFactory } from 'react';

const button = createFactory('button');
```

```js
// After
const button = <button />;
```

## Removing deprecated React DOM APIs {/*removing-deprecated-react-dom-apis*/}


### Removing `ReactDOM.render` {/*removing-reactdom-render*/}

TODO

### Removing `ReactDOM.hydrate` {/*removing-reactdom-hydrate*/}

TODO

### Removing `unmountComponentAtNode` {/*removing-unmountcomponentatnode*/}

TODO

### Removing `ReactDOM.findDOMNode` {/*removing-reactdom-finddomnode*/}
`ReactDOM.findDOMNode` was [deprecated in v16.3.0](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html) because it was a legacy escape hatch that was slow to execute, fragile to refactoring, only returned the first child, and broke abstraction levels (see more [here](https://legacy.reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)). In React 19, we're removing `ReactDOM.findDOMNode` and you'll need to migrate to using refs:

```js
// Before
import {findDOMNode} from 'react-dom';

function AutoselectingInput() {
  useEffect(() => {
    const input = findDOMNode(this);
    input.select()
  }, []);

  return <input defaultValue="Hello" />;
}
```

```js
// After
function AutoselectingInput() {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.select();
  }, []);

  return <input ref={ref} defaultValue="Hello" />
}
```

## Removing react-test-renderer and test-utils {/*react-test-renderer-and-test-utils*/}

TODO

<Note>

TODO: note about React Native.

</Note>

## Removing UMD builds {/*umd-builds*/}

TODO


## New Deprecations {/*new-deprecations*/}

- react: Warn when using defaultProps in functions, memo, lazy, and forwardRef (TODO)
- react: Warn when spreading “key” as part of props in DEV  (TODO)

## Other Breaking Changes {/*breaking-changes*/}

- react-dom: Remove errorInfo.digest with warning (TODO)
- react-dom: Removed unstable_renderSubtreeIntoContainer (TODO)
- react-dom: Warn and don’t set empty string attributes for src/href (TODO: land)
- react-dom: Error and do not allow javascript URLs in src/href (TODO: land)

## Other notable changes {/*other-notable-changes*/}

#### React {/*other-notable-changes-react*/}
- act moved to top-level React package (TODO)
- unstable_batchedUpdates is a noop (TODO).
- Transitions in popstate are now synchronous.

#### React DOM {/*other-notable-changes-react-dom*/}
- Removed layout effect warning during SSR.
- Removed workaround for IE style sorting hydration errors (TODO: land)
