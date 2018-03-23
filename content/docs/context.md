---
id: context
title: Context
permalink: docs/context.html
---

Context provides a way to pass data through the component tree without having to pass props down manually at every level.

In a typical React application, data is passed top-down (parent to child) via props, but this can be cumbersome for certain types of props (e.g. locale preference, UI theme) that are required by many components within an application. Context provides a way to share values like this between components without having to explicitly pass a prop through every level of the tree.

- [When to Use Context](#when-to-use-context)
- [API](#api)
  - [React.createContext](#reactcreatecontext)
  - [Provider](#provider)
  - [Consumer](#consumer)
- [Examples](#examples)
  - [Static Context](#static-context)
  - [Dynamic Context](#dynamic-context)
  - [Consuming Multiple Contexts](#consuming-multiple-contexts)
  - [Accessing Context in Lifecycle Methods](#accessing-context-in-lifecycle-methods)
  - [Forwarding Refs to Context Consumers](#forwarding-refs-to-context-consumers)
- [Legacy API](#legacy-api)


## When to Use Context

Context is designed to share data that can be considered "global" for a tree of React components, such as the current authenticated user, theme, or preferred language. For example, in the code below we manually thread through a "theme" prop in order to style the Button component:

`embed:context/motivation-problem.js`

Using context, we can avoid passing props through intermediate elements:

`embed:context/motivation-solution.js`

> Note
>
> Don't use context just to avoid passing props a few levels down. Stick to cases where the same data needs to accessed in many components at multiple levels.

## API

### `React.createContext`

```js
const {Provider, Consumer} = React.createContext(defaultValue);
```

Creates a `{ Provider, Consumer }` pair.

Optionally accepts a default value to be passed to Consumers without a Provider ancestor.

### `Provider`

```js
<Provider value={/* some value */}>
```

A React component that allows Consumers to subscribe to context changes.

Accepts a `value` prop to be passed to Consumers that are descendants of this Provider. One Provider can be connected to many Consumers. Providers can be nested to override values deeper within the tree.

### `Consumer`

```js
<Consumer>
  {value => /* render something based on the context value */}
</Consumer>
```

A React component that subscribes to context changes.

Requires a [function as a child](/docs/render-props.html#using-props-other-than-render). The function receives the current context value and returns a React node. All consumers are re-rendered whenever the Provider value changes. Changes are determined by comparing the new and old values using the same algorithm as [`Object.is`](developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).

> Note
> 
> For more information about this pattern, see [render props](/docs/render-props.html).

## Examples

### Dynamic Context

A more complex example with dynamic values for the theme:

**theme-context.js**
`embed:context/theme-detailed-theme-context.js`

**themed-button.js**
`embed:context/theme-detailed-themed-button.js`

**app.js**
`embed:context/theme-detailed-app.js`

## Consuming Multiple Contexts

To keep context re-rendering fast, React needs to make each context consumer a separate node in the tree. 

`embed:context/multiple-contexts.js`

If two or more context values are often used together, you might want to consider creating your own render prop component that provides both. [React Context Composer](https://github.com/FormidableLabs/react-context-composer/) is a simple library to help with this.

## Accessing Context in Lifecycle Methods

Accessing values from context in lifecycle methods is a relatively common use case. Instead of adding context to every lifecycle method, you just need to pass it as a prop, and then work with it just like you'd normally work with a prop.

`embed:context/lifecycles.js`

## Forwarding Refs to Context Consumers

One issue with the render prop API is that refs don't automatically get passed to wrapped elements. To get around this, use `React.forwardRef`:

**fancy-button.js**
`embed:context/forwarding-refs-fancy-button.js`

**app.js**
`embed:context/forwarding-refs-app.js`

## Legacy API

> Note
> 
> React previously shipped with an experimental context API. The old API will be supported in all 16.x releases, but applications using it should migrate to the new version. The legacy API will be removed in a future major React versin. Read the [legacy context docs here](/docs/legacy-context.html).
 