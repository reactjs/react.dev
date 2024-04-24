---
title: "React 19 Beta Upgrade Guide"
---

April 1, 2024 by [Ricky Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>


As we shared in the [release post](/blog/2024/04/01/react-19), 19 adds new features like Actions, optimistic updates, and React Server Components. It also includes long-requested improvements like using refs without `forwardRef`, using `<Context>` as a provider, better error handling, and faster JSX.

The improvements added to React 19 require some breaking changes, but we've worked to make the upgrade as smooth as possible. We're also removing many long time deprecated APIs to make React simpler and easier to understand.

</Intro>


<Note>



#### Upgrade to 18.3 first {/*upgrade-to-18-3-first*/}

To help make the upgrade to React 19 easier, we've published a `react@18.3` release that only includes warnings for deprecated APIs and other changes that will be removed in React 19.

We recommend upgrading to React 18.3 first to help identify any issues before upgrading to React 19.

</Note>

In this post, we will guide you through the steps for upgrading. If you'd like to help us test React 19, follow the steps in this upgrade guide and [report any issues](https://github.com/facebook/react/issues/new/choose) you encounter.

- [Installing](#installing)
- [Breaking Changes](#breaking-changes)
- [Removed React APIs](#removed-react-apis)
- [Removed React DOM APIs](#removed-react-dom-apis)
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

<ConsoleLogLine level="error">

Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform

</ConsoleLogLine>

</ConsoleBlockMulti>


We expect most apps will not be affected since the transform is enabled in most environments already. For manual instructions on how to upgrade, please see the [announcement post](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).

</Note>

If you're using TypeScript, you also need to update the types.
During the beta period, the types are available in different packages which need to be enforced in your `package.json`:

```json
{
  "dependencies": {
    "@types/react": "npm:types-react@alpha",
    "@types/react-dom": "npm:types-react-dom@alpha"
  },
  "overrides": {
    "@types/react": "npm:types-react@alpha",
    "@types/react-dom": "npm:types-react-dom@alpha"
  }
}
```g

Or if you're using yarn:

```json
{
  "dependencies": {
    "@types/react": "npm:types-react@alpha",
    "@types/react-dom": "npm:types-react-dom@alpha"
  },
  "resolutions": {
    "@types/react": "npm:types-react@alpha",
    "@types/react-dom": "npm:types-react-dom@alpha"
  }
}
```

Once React 19 is released as stable, you can install the types as usual from `@types/react` and `@types/react-dom`.

Most of the type related breaking changes are codemoddable with [`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/):

```bash
# Run the codemod
npx types-react-codemod@latest preset-19 ./path-to-your-react-ts-files

# If you have a lot of unsound access to `element.props`,
# you can run this additional codemod:
npx types-react-codemod@latest react-element-default-any-props ./path-to-your-react-ts-files
```

## Breaking Changes {/*breaking-changes*/}

### `element.ref` not supported {/*element-ref-not-supported*/}

TODO

### Errors in render are not re-thrown {/*errors-in-render-are-not-re-thrown*/}

TODO
TODO: need expect(act()).toThrow();

### Transitions in popstate are now synchronous {/*transitions-in-popstate-are-now-synchronous*/}

TODO

### StrictMode changes {/*strict-mode-improvements*/}

TODO

- https://github.com/facebook/react/pull/25583
- https://github.com/facebook/react/pull/25049

### SECRET_INTERNALS have been renamed {/*secret-internals-have-been-renamed*/}

TODO

## Removed deprecated React APIs {/*removed-deprecated-react-apis*/}

### Removed: `propTypes` and `defaultProps` for functions {/*removed-proptypes-and-defaultprops*/}
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

### Removed: Legacy Context using `contextTypes` and `getChildContext` {/*removed-removing-legacy-context*/}

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

### Removed: string refs {/*removed-string-refs*/}
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

### Removed: Module pattern factories {/*removed-module-pattern-factories*/}
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

### Removed: `React.createFactory` {/*removed-createfactory*/}
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

### Removed: `react-test-renderer/shallow` {/*removed-react-test-renderer-shallow*/}

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

## Removed deprecated React DOM APIs {/*removed-deprecated-react-dom-apis*/}

### Removed: `react-dom/test-utils` {/*removed-react-dom-test-utils*/}

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

### Removed: `ReactDOM.render` {/*removed-reactdom-render*/}

`ReactDOM.render` was deprecated in [March 2022 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide). In React 19, we're removing `ReactDOM.render` and you'll need to migrate to using [`ReactDOM.createRoot`](https://react.dev/reference/react-dom/client/createRoot):

```js
// Before
import {render} from 'react-dom';
render(<App />, document.getElementById('root'));

// After
import {createRoot} from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### Removed: `ReactDOM.hydrate` {/*removed-reactdom-hydrate*/}

`ReactDOM.hydrate` was deprecated in [March 2022 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide). In React 19, we're removing `ReactDOM.hydrate` you'll need to migrate to using [`ReactDOM.hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot),

```js
// Before
import {hydrate} from 'react-dom';
hydrate(<App />, document.getElementById('root'));

// After
import {hydrateRoot} from 'react-dom/client';
hydrate(document.getElementById('root'), <App />);
```


### Removed: `unmountComponentAtNode` {/*removed-unmountcomponentatnode*/}

`ReactDOM.unmountComponentAtNode` was deprecated in [March 2022 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide). In React 19, you'll need to migrate to using `root.unmount()`.


```js
// Before
unmountComponentAtNode(document.getElementById('root'));

// After
root.unmount();
```

For more see `root.unmount()` for [`createRoot`](https://react.dev/reference/react-dom/client/createRoot#root-unmount) and [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot#root-unmount).


### Removed: `ReactDOM.findDOMNode` {/*removed-reactdom-finddomnode*/}
`ReactDOM.findDOMNode` was [deprecated in October 2018 (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html#deprecations-in-strictmode). 

We're removing `findDOMNode` because it was a legacy escape hatch that was slow to execute, fragile to refactoring, only returned the first child, and broke abstraction levels (see more [here](https://legacy.reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)). You can replace `ReactDOM.findDOMNode` with [DOM refs](/learn/manipulating-the-dom-with-refs):

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

## New Deprecations {/*new-deprecations*/}

### Deprecating `react-test-renderer` {/*deprecating-react-test-renderer*/}

We are deprecating `react-test-renderer` because it implements its own renderer environment that doesn't match the environment users use, promotes testing implementation details, and relies on introspection of React's internals.

The test renderer was created before there were more viable testing strategies available like [React Testing Library](https://testing-library.com), and we now recommend using a modern testing library instead.

In React 19, `react-test-renderer` log a deprecation warning, and has switched to concurrent rendering by default. We recommend migrating your tests to [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) or [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/getting-started) for a modern and well supported testing experience.


## Removed deprecated TypeScript types

Some of the removed have types been moved to more relevant packages, like `Validator` moving to `PropTypes`.
Others are no longer needed to describe React's behavior.
 Removing them means one less thing to learn.

### Codemoddable

| Type                    | Codemod                                                                                                                   | Replacement                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `ReactChild`            | [`deprecated-react-child`](https://github.com/eps1lon/types-react-codemod#deprecated-react-child)                         | `React.ReactElement \| number \| string` |
| `ReactFragment`         | [`deprecated-react-fragment`](https://github.com/eps1lon/types-react-codemod#deprecated-react-fragment)                   | `Iterable<React.ReactNode>`              |
| `ReactNodeArray`        | [`deprecated-react-node-array`](https://github.com/eps1lon/types-react-codemod#deprecated-react-node-array)               | `ReadonlyArray<React.ReactNode>`         |
| `ReactText`             | [`deprecated-react-text`](https://github.com/eps1lon/types-react-codemod#deprecated-react-text)                           | `number \| string`                       |
| `Requireable`           | [`deprecated-prop-types-types`](https://github.com/eps1lon/types-react-codemod#deprecated-prop-types-types)               | `Requireable` from `prop-types`          |
| `ValidationMap`         | [`deprecated-prop-types-types`](https://github.com/eps1lon/types-react-codemod#deprecated-prop-types-types)               | `ValidationMap` from `prop-types`        |
| `Validator`             | [`deprecated-prop-types-types`](https://github.com/eps1lon/types-react-codemod#)                                          | `Validator` from `prop-types`            |
| `VoidFunctionComponent` | [`deprecated-void-function-component`](https://github.com/eps1lon/types-react-codemod#deprecated-void-function-component) | `FunctionComponent`                      |
| `VFC`                   | [`deprecated-void-function-component`](https://github.com/eps1lon/types-react-codemod#)                                   | `FC`                                     |
| `WeakValidationMap`     | [`deprecated-prop-types-types`](https://github.com/eps1lon/types-react-codemod#deprecated-prop-types-tpyes)               | `WeakValidationMap` from `prop-types`    |

### Not Codemoddable

During [example migrations](https://github.com/users/eps1lon/projects/3/views/9), these types were not used at all.
If you feel a codemod is missing, it can be tracked in the [list of missing React 19 codemods](https://github.com/eps1lon/types-react-codemod/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22React+19%22+label%3Aenhancement).

| Type                    | Replacement                                                                                                    |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| `ClassicComponentClass` | `ClassicComponentClass` from `create-react-class`                                                              |
| `ClassicComponent`      | `ClassicComponent` from `create-react-class`                                                                   |
| `ClassicElement<Props>` | `ClassicElement<Props, InstanceType<T>>` from `create-react-class`                                             |
| `ComponentSpec`         | `ComponentSpec` from the `create-react-class` package                                                          |
| `Mixin`                 | `Mixin` from the `create-react-class` package                                                                  |
| `ReactChildren`         | `typeof React.Children`                                                                                        |
| `ReactHTML`             | Either `ReactHTML` from `react-dom-factories` or, if you used `keyof ReactHTML`, use `HTMLElementType` instead |
| `ReactSVG`              | Either `ReactSVG` from `react-dom-factories` or, if you used `keyof ReactSVG`, use `SVGElementType` instead    |
| `SFCFactory`            | No replacement                                                                                                 |

### JSX Namespace

A long-time request is to remove the global `JSX` namespace from our types in favor of `React.JSX`.
This helps prevent pollution of global types which prevents conflicts between different UI libraries that leverage JSX.
This change is [codemoddable with `scoped-jsx`](https://github.com/eps1lon/types-react-codemod#scoped-jsx).

You'll now need to wrap module augmentation of the JSX namespace in `declare module "....":

```diff
// global.d.ts

+ declare module "react" {
    namespace JSX {
      interface IntrinsicElements {
        "my-element": {
          myElementProps: string;
        };
      }
    }
+ }
```

The exact module specifier depends on the JSX runtime you specified in the `compilerOptions` of your `tsconfig.json`.
For `"jsx": "react-jsx"` it would be `react/jsx-runtime`.
For `"jsx": "react-jsxdev"` it would be `react/jsx-dev-runtime`.
For `"jsx": "react"` and `"jsx": "preserve"` it would be `react`.

### Changes to Type Parameters

#### `useReducer`

`useReducer` now has improved type inference thanks to [@mfp22](https://github.com/mfp22).

However, this required a breaking change where `useReducer` doesn't accept the full reducer type as a type parameter but instead either needs none (and rely on contextual typing) or needs both the state and action type.

The new best practice is _not_ to pass type arguments to `useReducer`.

```diff
-useReducer<React.Reducer<State, Action>>(reducer)
+useReducer(reducer)
```

However, this may not work in edge cases where you can explicitly type the state and action, by passing in the `Action` in a tuple:

```diff
-useReducer<React.Reducer<State, Action>>(reducer)
+useReducer<State, [Action]>(reducer)
```

If you define the reducer inline, we encourage to annotate the function parameters instead:

```diff
-useReducer<React.Reducer<State, Action>>((state, action) => state)
+useReducer((state: State, action: Action) => state)
```

This, of course, is also what you'd also have to do if you move the reducer outside of the `useReducer` call:

```ts
const reducer = (state: State, action: Action) => state;
```


#### `ReactElement`

The `props` of React elements now default to `unknown` instead of `any` if the element is typed as `ReactElement`. This does not affect you if you pass a type argument to `ReactElement`:

```ts
type Example2 = ReactElement<{ id: string }>["props"];
//   ^? { id: string }
```

But if you relied on the default, you now have to handle `unknown`:

```ts
type Example = ReactElement["props"];
//   ^? Before, was 'any', now 'unknown'
```

If you rely on this behavior, use the [`react-element-default-any-props` codemod](https://github.com/eps1lon/types-react-codemod#react-element-default-any-props).
You should only need it if you have a lot of legacy code relying on unsound access of element props.
Element introspection only exists as an escape hatch and you should make it explicit that your props access is unsound via an explicit `any`.

### Ref cleanup

Due to the introduction of ref cleanup functions, returning anything else from a ref callback will now be rejected by TypeScript.

The fix is usually to stop using implicit returns e.g.

```diff
-<div ref={current => (instance = current)} />
+<div ref={current => {instance = current}} />
```

The original code returned the instance of the `HTMLDivElement` and TypeScript wouldn't know if this was _supposed_ to be a cleanup function or if you didn't want to return a cleanup function.

You can codemod this pattern with [`no-implicit-ref-callback-return
`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return)

#### Ref changes

All the of the changes in this section are codemoddable with [`preset-19` from `types-react-codemod`](https://github.com/eps1lon/types-react-codemod/#preset-19)

A long-time complaint of how TypeScript and React work has been `useRef`.
We've changed the types so that `useRef` now requires an argument.
This significantly simplifies its type signature. It'll now behave more like `createContext`.

```ts
// @ts-expect-error: Expected 1 argument but saw none
useRef();
// Passes
useRef(undefined);
// @ts-expect-error: Expected 1 argument but saw none
createContext();
// Passes
createContext(undefined);
```

This now also means that all refs are mutable.
You'll no longer hit the issue where you can't mutate a ref because you initialised it with `null`:

```ts
const ref = useRef<number>(null);

// Cannot assign to 'current' because it is a read-only property
ref.current = 1;
```

`MutableRef` is now deprecated in favor of a single `RefObject` type which `useRef` will always return:

```ts
interface RefObject<T> {
  current: T
}

declare function useRef<T>: RefObject<T>
```

`useRef` still has a convenience overload for `useRef<T>(null)` that automatically returns `RefObject<T | null>`.
To ease migration due to the required argument for `useRef`, a convenience overload for `useRef(undefined)` was added that automatically returns `RefObject<T | undefined>`.

Check out [[RFC] Make all refs mutable](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/64772) for prior discussions about this change.

## Other Breaking Changes {/*other-breaking-changes*/}

- UMD builds have been removed
- react: Warn when using defaultProps in functions, memo, lazy, and forwardRef (TODO)
- react: Don't prerender siblings of suspended component https://github.com/facebook/react/pull/26380
- react: warnAboutSpreadingKeyToJSX https://github.com/facebook/react/pull/25697
- react: unified sync lane https://github.com/facebook/react/pull/25700
- react: element.ref not supported
- react-dom: Remove `errorInfo.digest` with warning (TODO)
- react-dom: Removed unstable_renderSubtreeIntoContainer (TODO)
- react-dom: Warn and don’t set empty string attributes for src/href (TODO: land)
- react-dom: Error and do not allow javascript URLs in src/href (TODO: land) https://github.com/facebook/react/pull/26507
- react-dom: Restore old behavior for empty href props on anchor tags
- react-is: Remove deprecated methods from react-is

## Other Notable changes {/*other-notable-changes*/}

#### React {/*other-notable-changes-react*/}
- better infinite loop detection
- unified sync lane

#### React DOM {/*other-notable-changes-react-dom*/}
- Removed layout effect warning during SSR.
- Removed workaround for IE style sorting hydration errors (TODO: land)

#### React ART {/*other-notable-changes-react-art*/}
- React ART now runs in concurrent rendering 
