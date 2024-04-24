---
title: "React 19 Beta Upgrade Guide"
---

April 1, 2024 by [Ricky Hanlon](https://twitter.com/rickhanlonii)

---

<Note>

Stream [React Conf 2024]((https://conf.react.dev)) live May 15–16!

</Note>

<Intro>

Today we're releasing a beta version of React 19, the next major version of React.  In this post, we will guide you through the steps for upgrading.

If you'd like to help us test React 19, follow the steps in this upgrade guide and [report any issues](https://github.com/facebook/react/issues/new/choose) you encounter.

</Intro>

- [Installing](#installing)
- [Removing deprecated React APIs](#removing-deprecated-react-apis)
- [Removing deprecated React DOM APIs](#removing-deprecated-react-dom-apis)
- [Breaking Changes](#breaking-changes)
- [New Deprecations](#new-deprecations)
- [Other Breaking Changes](#other-breaking-changes)
- [Other Notable changes](#other-notable-changes)

For a list of new features added to React 19, see the [React 19 Release Post](/blog/2024/04/01/react-19).

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


If you the new transform is not enabled, you will see this warning:

<ConsoleBlockMulti>

<ConsoleLogLine level="warning">

Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform

</ConsoleLogLine>

</ConsoleBlockMulti>


We expect most apps will not be affected since the transform is enabled in most environments already. For manual instructions on how to upgrade, please see the [announcement post](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).

</Note>

## Removing deprecated React APIs {/*removing-deprecated-react-apis*/}

### Removing `propTypes` and `defaultProps` {/*removing-proptypes-and-defaultprops*/}
`PropTypes` were deprecated in [April 2017 (v15.5.0)](https://legacy.reactjs.org/blog/2017/04/07/react-v15.5.0.html#new-deprecation-warnings). 

In React 19, we're removing the `propType` checks from the React package, and using them will be silently ignored. If you're using `propTypes`, we recommend migrating to TypeScript or another type-checking solution.

We're also removing `defaultProps` from function components in place of ES6 default parameters. Class components will continue to support `defaultProps` since there is no ES6 alternative.

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

Legacy Context was deprecated in [October 2018 (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html).

Legacy Context was only available in class components using the APIs `contextTypes` and `getChildContext`, and was replaced with `contextType` due to subtle bugs that were easy to miss. In React 19, we're removing Legacy Context to make React slightly smaller and faster.

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
String refs were deprecated in [March, 2018 (v16.3.0)](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html).

Class components supported string refs before being replaced by ref callbacks due to [multiple downsides](https://github.com/facebook/react/issues/1373). In React 19, we're removing string refs to make React simpler and easier to understand.

If you're still using string refs in class components, you'll need to migrate to ref callbacks:

```js
// Before
class MyComponent extends React.Component {
  componentDidMount() {
    this.refs.input.focus();
  }

  render() {
    return <input ref='input' />;
  }
}
```

```js
// After
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
Module pattern factories were deprecated in [August 2019 (v16.9.0)](https://legacy.reactjs.org/blog/2019/08/08/react-v16.9.0.html#deprecating-module-pattern-factories).

This pattern was rarely used and supporting it causes React to be slightly larger and slower than necessary. In React 19, we're removing support for module pattern factories, and you'll need to migrate to regular functions:

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
`createFactory` was deprecated in [February 2020 (v16.13.0)](https://legacy.reactjs.org/blog/2020/02/26/react-v16.13.0.html#deprecating-createfactory).

Using `createFactory` was common before broad support for JSX, but it's rarely used today and can be replaced with JSX. In React 19, we're removing `createFactory` and you'll need to migrate to JSX:

```js
// Before
import { createFactory } from 'react';

const button = createFactory('button');
```

```js
// After
const button = <button />;
```

### Removing `react-test-renderer/shallow` {/*removing-react-test-renderer-shallow*/}

In React 18, we updated `react-test-renderer/shallow` to reexport [react-shallow-renderer](https://github.com/enzymejs/react-shallow-renderer). In React 19, we're removing `react-test-render/shallow` to prefer installing the package directly:

```bash
npm install react-shallow-renderer --save-dev
```
```diff
- import ShallowRenderer from 'react-test-renderer/shallow';
+ import ShallowRenderer from 'react-shallow-renderer';
```

<Note>

#### Please reconsider shallow rendering {/*please-reconsider-shallow-rendering*/}

Shallow rendering depends on React internals and can block you from future upgrades. We recommend migrating your tests to [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) or [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/getting-started). 

</Note>

## Removing deprecated React DOM APIs {/*removing-deprecated-react-dom-apis*/}

### Removing `react-dom/test-utils` {/*removing-react-dom-test-utils*/}

We've moved `act` from `react-dom/test-utils` to the `react` package:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

`ReactDOMTestUtils.act` is deprecated in favor of `React.act`. Import `act` from `react` instead of `react-dom/test-utils`. See https://react.dev/warnings/react-dom-test-utils for more info.

</ConsoleLogLine>

</ConsoleBlockMulti>

To fix this warning, you can import `act` from `react`:

```diff
- import {act} from 'react-dom/test-utils'
+ import {act} from 'react';
```

All other `test-utils` functions have been removed. These utilities were uncommon, and made it too easy to depend on low level implementation details of your components and React. In React 19, these functions will error when called and their exports will be removed in a future version.

See the [warning page](https://react.dev/warnings/react-dom-test-utils) to for alternatives.

### Removing `ReactDOM.render` {/*removing-reactdom-render*/}

TODO

### Removing `ReactDOM.hydrate` {/*removing-reactdom-hydrate*/}

TODO

### Removing `unmountComponentAtNode` {/*removing-unmountcomponentatnode*/}

TODO

### Removing `ReactDOM.findDOMNode` {/*removing-reactdom-finddomnode*/}
`ReactDOM.findDOMNode` was [deprecated in October 2018 (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html#deprecations-in-strictmode) because it was a legacy escape hatch that was slow to execute, fragile to refactoring, only returned the first child, and broke abstraction levels (see more [here](https://legacy.reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)). In React 19, we're removing `ReactDOM.findDOMNode` and you'll need to migrate to using refs:

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

## Breaking Changes {/*breaking-changes*/}

### SECRET_INTERNALS have been renamed {/*secret-internals-have-been-renamed*/}

TODO

### Do not re-throw errors {/*do-not-rethrow-errors*/}

TODO
TODO: need expect(act()).toThrow();

### Transitions in popstate are now synchronous. {/*transitions-in-popstate-are-now-synchronous*/}

TODO

### StrictMode improvements {/*strict-mode-improvements*/}

TODO

## New Deprecations {/*new-deprecations*/}

### Deprecating `react-test-renderer` {/*deprecating-react-test-renderer*/}

We are deprecating `react-test-renderer` because it implements its own renderer environment that doesn't match the environment users use, promotes testing implementation details, and relies on introspection of React's internals.

The test renderer was created before there were more viable testing strategies available like [React Testing Library](https://testing-library.com), and we now recommend using a modern testing library instead.

In React 19, `react-test-renderer` log a deprecation warning, and has switched to concurrent rendering by default. We recommend migrating your tests to [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) or [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/getting-started) for a modern and well supported testing experience.



## Other Breaking Changes {/*other-breaking-changes*/}

- UMD builds have been removed
- react: Warn when using defaultProps in functions, memo, lazy, and forwardRef (TODO)
- react: Warn when spreading “key” as part of props in DEV  (TODO)
- react-dom: Remove `errorInfo.digest` with warning (TODO)
- react-dom: Removed unstable_renderSubtreeIntoContainer (TODO)
- react-dom: Warn and don’t set empty string attributes for src/href (TODO: land)
- react-dom: Error and do not allow javascript URLs in src/href (TODO: land)

## Other Notable changes {/*other-notable-changes*/}

#### React {/*other-notable-changes-react*/}

#### React DOM {/*other-notable-changes-react-dom*/}
- Removed layout effect warning during SSR.
- Removed workaround for IE style sorting hydration errors (TODO: land)
