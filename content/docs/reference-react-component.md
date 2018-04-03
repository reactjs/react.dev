---
id: react-component
title: React.Component
layout: docs
category: Reference
permalink: docs/react-component.html
redirect_from:
  - "docs/component-api.html"
  - "docs/component-specs.html"
  - "docs/component-specs-ko-KR.html"
  - "docs/component-specs-zh-CN.html"
  - "tips/UNSAFE_componentWillReceiveProps-not-triggered-after-mounting.html"
  - "tips/dom-event-listeners.html"
  - "tips/initial-ajax.html"
  - "tips/use-react-with-other-libraries.html"
---

[Components](/docs/components-and-props.html) let you split the UI into independent, reusable pieces, and think about each piece in isolation. `React.Component` is provided by [`React`](/docs/react-api.html).

## Overview

`React.Component` is an abstract base class, so it rarely makes sense to refer to `React.Component` directly. Instead, you will typically subclass it, and define at least a [`render()`](#render) method.

Normally you would define a React component as a plain [JavaScript class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes):

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

If you don't use ES6 yet, you may use the `create-react-class` module instead. Take a look at [Using React without ES6](/docs/react-without-es6.html) to learn more.

Note that **we don't recommend creating your own base component classes**. Code reuse is primarily achieved through composition rather than inheritance in React. Take a look at [these common scenarios](/docs/composition-vs-inheritance.html) to get a feel for how to use composition.

### The Component Lifecycle

Each component has several "lifecycle methods" that you can override to run code at particular times in the process. Methods prefixed with **`will`** are called right before something happens, and methods prefixed with **`did`** are called right after something happens.

#### Mounting

These methods are called when an instance of a component is being created and inserted into the DOM:

- [`constructor()`](#constructor)
- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [`componentWillMount()` / `UNSAFE_componentWillMount()`](#unsafe_componentwillmount)
- [`render()`](#render)
- [`componentDidMount()`](#componentdidmount)

#### Updating

An update can be caused by changes to props or state. These methods are called when a component is being re-rendered:

- [`componentWillReceiveProps()` / `UNSAFE_componentWillReceiveProps()`](#unsafe_componentwillreceiveprops)
- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [`componentWillUpdate()` / `UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)
- [`render()`](#render)
- [`getSnapshotBeforeUpdate()`](#getsnapshotbeforeupdate)
- [`componentDidUpdate()`](#componentdidupdate)

#### Unmounting

This method is called when a component is being removed from the DOM:

- [`componentWillUnmount()`](#componentwillunmount)

#### Error Handling

This method is called when there is an error during rendering, in a lifecycle method, or in the constructor of any child component.

- [`componentDidCatch()`](#componentdidcatch)

### Other APIs

Each component also provides some other APIs:

  - [`setState()`](#setstate)
  - [`forceUpdate()`](#forceupdate)

### Class Properties

  - [`defaultProps`](#defaultprops)
  - [`displayName`](#displayname)

### Instance Properties

  - [`props`](#props)
  - [`state`](#state)

* * *

## Reference

### `render()`

```javascript
render()
```

The `render()` method is required.

When called, it should examine `this.props` and `this.state` and return one of the following types:

- **React elements.** Typically created via JSX. An element can either be a representation of a native DOM component (`<div />`), or a user-defined composite component (`<MyComponent />`).
- **String and numbers.** These are rendered as text nodes in the DOM.
- **Portals**. Created with [`ReactDOM.createPortal`](/docs/portals.html).
- `null`. Renders nothing.
- **Booleans**. Render nothing. (Mostly exists to support `return test && <Child />` pattern, where `test` is boolean.)

When returning `null` or `false`, `ReactDOM.findDOMNode(this)` will return `null`.

The `render()` function should be pure, meaning that it does not modify component state, it returns the same result each time it's invoked, and it does not directly interact with the browser. If you need to interact with the browser, perform your work in `componentDidMount()` or the other lifecycle methods instead. Keeping `render()` pure makes components easier to think about.

> Note
>
> `render()` will not be invoked if [`shouldComponentUpdate()`](#shouldcomponentupdate) returns false.

#### Fragments

You can also return multiple items from `render()` using an array:

```javascript
render() {
  return [
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

> Note:
>
> Don't forget to [add keys](/docs/lists-and-keys.html#keys) to elements in a fragment to avoid the key warning.

Since [React 16.2.0](/blog/2017/11/28/react-v16.2.0-fragment-support.html), the same can also be accomplished using [fragments](/docs/fragments.html), which don't require keys for static items:

```javascript
render() {
  return (
    <React.Fragment>
      <li>First item</li>
      <li>Second item</li>
      <li>Third item</li>
    </React.Fragment>
  );
}
```

* * *

### `constructor()`

```javascript
constructor(props)
```

The constructor for a React component is called before it is mounted. When implementing the constructor for a `React.Component` subclass, you should call `super(props)` before any other statement. Otherwise, `this.props` will be undefined in the constructor, which can lead to bugs.

Avoid introducing any side-effects or subscriptions in the constructor. For those use cases, use `componentDidMount()` instead.

The constructor is the right place to initialize state. To do so, just assign an object to `this.state`; don't try to call `setState()` from the constructor. The constructor is also often used to bind event handlers to the class instance.

If you don't initialize state and you don't bind methods, you don't need to implement a constructor for your React component.

In rare cases, it's okay to initialize state based on props. This effectively "forks" the props and sets the state with the initial props. Here's an example of a valid `React.Component` subclass constructor:

```js
constructor(props) {
  super(props);
  this.state = {
    color: props.initialColor
  };
}
```

Beware of this pattern, as state won't be up-to-date with any props update. Instead of syncing props to state, you often want to [lift the state up](/docs/lifting-state-up.html) instead.

If you "fork" props by using them for state, you might also want to implement [`getDerivedStateFromProps()`](#static-getderivedstatefromprops) to keep the state up-to-date with them. But lifting state up is often easier and less bug-prone.

* * *

### `static getDerivedStateFromProps()`

```js
static getDerivedStateFromProps(nextProps, prevState)
```

`getDerivedStateFromProps` is invoked after a component is instantiated as well as when it receives new props. It should return an object to update state, or null to indicate that the new props do not require any state updates.

Note that if a parent component causes your component to re-render, this method will be called even if props have not changed. You may want to compare new and previous values if you only want to handle changes.

Calling `this.setState()` generally doesn't trigger `getDerivedStateFromProps()`.

* * *

### `UNSAFE_componentWillMount()`

```javascript
UNSAFE_componentWillMount()
```

`UNSAFE_componentWillMount()` is invoked just before mounting occurs. It is called before `render()`, therefore calling `setState()` synchronously in this method will not trigger an extra rendering. Generally, we recommend using the `constructor()` instead for initializing state.

Avoid introducing any side-effects or subscriptions in this method. For those use cases, use `componentDidMount()` instead.

This is the only lifecycle hook called on server rendering.

> Note
>
> This lifecycle was previously named `componentWillMount`. That name will continue to work until version 17. Use the [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) to automatically update your components.

* * *

### `componentDidMount()`

```javascript
componentDidMount()
```

`componentDidMount()` is invoked immediately after a component is mounted. Initialization that requires DOM nodes should go here. If you need to load data from a remote endpoint, this is a good place to instantiate the network request.

This method is a good place to set up any subscriptions. If you do that, don't forget to unsubscribe in `componentWillUnmount()`.

Calling `setState()` in this method will trigger an extra rendering, but it will happen before the browser updates the screen. This guarantees that even though the `render()` will be called twice in this case, the user won't see the intermediate state. Use this pattern with caution because it often causes performance issues. It can, however, be necessary for cases like modals and tooltips when you need to measure a DOM node before rendering something that depends on its size or position.

* * *

### `UNSAFE_componentWillReceiveProps()`

```javascript
UNSAFE_componentWillReceiveProps(nextProps)
```

> Note
>
> It is recommended that you use the static [`getDerivedStateFromProps`](#static-getderivedstatefromprops) lifecycle instead of `UNSAFE_componentWillReceiveProps`. [Learn more about this recommendation here.](/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes)

`UNSAFE_componentWillReceiveProps()` is invoked before a mounted component receives new props. If you need to update the state in response to prop changes (for example, to reset it), you may compare `this.props` and `nextProps` and perform state transitions using `this.setState()` in this method.

Note that if a parent component causes your component to re-render, this method will be called even if props have not changed. Make sure to compare the current and next values if you only want to handle changes.

React doesn't call `UNSAFE_componentWillReceiveProps()` with initial props during [mounting](#mounting). It only calls this method if some of component's props may update. Calling `this.setState()` generally doesn't trigger `UNSAFE_componentWillReceiveProps()`.

> Note
>
> This lifecycle was previously named `componentWillReceiveProps`. That name will continue to work until version 17. Use the [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) to automatically update your components.

* * *

### `shouldComponentUpdate()`

```javascript
shouldComponentUpdate(nextProps, nextState)
```

Use `shouldComponentUpdate()` to let React know if a component's output is not affected by the current change in state or props. The default behavior is to re-render on every state change, and in the vast majority of cases you should rely on the default behavior.

`shouldComponentUpdate()` is invoked before rendering when new props or state are being received. Defaults to `true`. This method is not called for the initial render or when `forceUpdate()` is used.

Returning `false` does not prevent child components from re-rendering when *their* state changes.

Currently, if `shouldComponentUpdate()` returns `false`, then [`UNSAFE_componentWillUpdate()`](#componentwillupdate), [`render()`](#render), and [`componentDidUpdate()`](#componentdidupdate) will not be invoked. Note that in the future React may treat `shouldComponentUpdate()` as a hint rather than a strict directive, and returning `false` may still result in a re-rendering of the component.

If you determine a specific component is slow after profiling, you may change it to inherit from [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) which implements `shouldComponentUpdate()` with a shallow prop and state comparison. If you are confident you want to write it by hand, you may compare `this.props` with `nextProps` and `this.state` with `nextState` and return `false` to tell React the update can be skipped.

We do not recommend doing deep equality checks or using `JSON.stringify()` in `shouldComponentUpdate()`. It is very inefficient and will harm performance.

* * *

### `UNSAFE_componentWillUpdate()`

```javascript
UNSAFE_componentWillUpdate(nextProps, nextState)
```

`UNSAFE_componentWillUpdate()` is invoked just before rendering when new props or state are being received. Use this as an opportunity to perform preparation before an update occurs. This method is not called for the initial render.

Note that you cannot call `this.setState()` here; nor should you do anything else (e.g. dispatch a Redux action) that would trigger an update to a React component before `UNSAFE_componentWillUpdate()` returns.

If you need to update `state` in response to `props` changes, use [`getDerivedStateFromProps()`](#static-getderivedstatefromprops) instead.

> Note
>
> This lifecycle was previously named `componentWillUpdate`. That name will continue to work until version 17. Use the [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) to automatically update your components.

> Note
>
> `UNSAFE_componentWillUpdate()` will not be invoked if [`shouldComponentUpdate()`](#shouldcomponentupdate) returns false.

* * *

### `getSnapshotBeforeUpdate()`

`getSnapshotBeforeUpdate()` is invoked right before the most recently rendered output is committed to e.g. the DOM. It enables your component to capture current values (e.g. scroll position) before they are potentially changed. Any value returned by this lifecycle will be passed as a parameter to `componentDidUpdate()`.

For example:

`embed:react-component-reference/get-snapshot-before-update.js`

In the above examples, it is important to read the `scrollHeight` property in `getSnapshotBeforeUpdate` rather than `componentWillUpdate` in order to support async rendering. With async rendering, there may be delays between "render" phase lifecycles (like `componentWillUpdate` and `render`) and "commit" phase lifecycles (like `getSnapshotBeforeUpdate` and `componentDidUpdate`). If a user does something like resize the browser during this time, a `scrollHeight` value read from `componentWillUpdate` will be stale.

* * *

### `componentDidUpdate()`

```javascript
componentDidUpdate(prevProps, prevState, snapshot)
```

`componentDidUpdate()` is invoked immediately after updating occurs. This method is not called for the initial render.

Use this as an opportunity to operate on the DOM when the component has been updated. This is also a good place to do network requests as long as you compare the current props to previous props (e.g. a network request may not be necessary if the props have not changed).

If your component implements the `getSnapshotBeforeUpdate()` lifecycle, the value it returns will be passed as a third "snapshot" parameter to `componentDidUpdate()`. (Otherwise this parameter will be undefined.)

> Note
>
> `componentDidUpdate()` will not be invoked if [`shouldComponentUpdate()`](#shouldcomponentupdate) returns false.

* * *

### `componentWillUnmount()`

```javascript
componentWillUnmount()
```

`componentWillUnmount()` is invoked immediately before a component is unmounted and destroyed. Perform any necessary cleanup in this method, such as invalidating timers, canceling network requests, or cleaning up any subscriptions that were created in `componentDidMount()`.

* * *

### `componentDidCatch()`

```javascript
componentDidCatch(error, info)
```

Error boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed. Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them.

A class component becomes an error boundary if it defines this lifecycle method. Calling `setState()` in it lets you capture an unhandled JavaScript error in the below tree and display a fallback UI. Only use error boundaries for recovering from unexpected exceptions; don't try to use them for control flow.

For more details, see [*Error Handling in React 16*](/blog/2017/07/26/error-handling-in-react-16.html).

> Note
> 
> Error boundaries only catch errors in the components **below** them in the tree. An error boundary can’t catch an error within itself.

* * *

### `setState()`

```javascript
setState(updater[, callback])
```

`setState()` enqueues changes to the component state and tells React that this component and its children need to be re-rendered with the updated state. This is the primary method you use to update the user interface in response to event handlers and server responses.

Think of `setState()` as a *request* rather than an immediate command to update the component. For better perceived performance, React may delay it, and then update several components in a single pass. React does not guarantee that the state changes are applied immediately.

`setState()` does not always immediately update the component. It may batch or defer the update until later. This makes reading `this.state` right after calling `setState()` a potential pitfall. Instead, use `componentDidUpdate` or a `setState` callback (`setState(updater, callback)`), either of which are guaranteed to fire after the update has been applied. If you need to set the state based on the previous state, read about the `updater` argument below.

`setState()` will always lead to a re-render unless `shouldComponentUpdate()` returns `false`. If mutable objects are being used and conditional rendering logic cannot be implemented in `shouldComponentUpdate()`, calling `setState()` only when the new state differs from the previous state will avoid unnecessary re-renders.

The first argument is an `updater` function with the signature:

```javascript
(prevState, props) => stateChange
```

`prevState` is a reference to the previous state. It should not be directly mutated. Instead, changes should be represented by building a new object based on the input from `prevState` and `props`. For instance, suppose we wanted to increment a value in state by `props.step`:

```javascript
this.setState((prevState, props) => {
  return {counter: prevState.counter + props.step};
});
```

Both `prevState` and `props` received by the updater function are guaranteed to be up-to-date. The output of the updater is shallowly merged with `prevState`.

The second parameter to `setState()` is an optional callback function that will be executed once `setState` is completed and the component is re-rendered. Generally we recommend using `componentDidUpdate()` for such logic instead.

You may optionally pass an object as the first argument to `setState()` instead of a function:

```javascript
setState(stateChange[, callback])
```

This performs a shallow merge of `stateChange` into the new state, e.g., to adjust a shopping cart item quantity:

```javascript
this.setState({quantity: 2})
```

This form of `setState()` is also asynchronous, and multiple calls during the same cycle may be batched together. For example, if you attempt to increment an item quantity more than once in the same cycle, that will result in the equivalent of:

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

Subsequent calls will override values from previous calls in the same cycle, so the quantity will only be incremented once. If the next state depends on the previous state, we recommend using the updater function form, instead:

```js
this.setState((prevState) => {
  return {quantity: prevState.quantity + 1};
});
```

For more detail, see:

* [State and Lifecycle guide](/docs/state-and-lifecycle.html)
* [In depth: When and why are `setState()` calls batched?](https://stackoverflow.com/a/48610973/458193)
* [In depth: Why isn't `this.state` updated immediately?](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `forceUpdate()`

```javascript
component.forceUpdate(callback)
```

By default, when your component's state or props change, your component will re-render. If your `render()` method depends on some other data, you can tell React that the component needs re-rendering by calling `forceUpdate()`.

Calling `forceUpdate()` will cause `render()` to be called on the component, skipping `shouldComponentUpdate()`. This will trigger the normal lifecycle methods for child components, including the `shouldComponentUpdate()` method of each child. React will still only update the DOM if the markup changes.

Normally you should try to avoid all uses of `forceUpdate()` and only read from `this.props` and `this.state` in `render()`.

* * *

## Class Properties

### `defaultProps`

`defaultProps` can be defined as a property on the component class itself, to set the default props for the class. This is used for undefined props, but not for null props. For example:

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

If `props.color` is not provided, it will be set by default to `'blue'`:

```js
  render() {
    return <CustomButton /> ; // props.color will be set to blue
  }
```

If `props.color` is set to null, it will remain null:

```js
  render() {
    return <CustomButton color={null} /> ; // props.color will remain null
  }
```

* * *

### `displayName`

The `displayName` string is used in debugging messages. Usually, you don't need to set it explicitly because it's inferred from the name of the function or class that defines the component. You might want to set it explicitly if you want to display a different name for debugging purposes or when you create a higher-order component, see [Wrap the Display Name for Easy Debugging](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging) for details.

* * *

## Instance Properties

### `props`

`this.props` contains the props that were defined by the caller of this component. See [Components and Props](/docs/components-and-props.html) for an introduction to props.

In particular, `this.props.children` is a special prop, typically defined by the child tags in the JSX expression rather than in the tag itself.

### `state`

The state contains data specific to this component that may change over time. The state is user-defined, and it should be a plain JavaScript object.

If some value isn't used for rendering or data flow (for example, a timer ID), you don't have to put it in the state. Such values can be defined as fields on the component instance.

See [State and Lifecycle](/docs/state-and-lifecycle.html) for more information about the state.

Never mutate `this.state` directly, as calling `setState()` afterwards may replace the mutation you made. Treat `this.state` as if it were immutable.
