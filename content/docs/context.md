---
id: context
title: Context
permalink: docs/context.html
---

Context provides a way to pass data through the component tree without having to pass props down manually at every level.

In a typical React application, data is passed top-down (parent to child) via props, but this can be cumbersome for certain types of props (e.g. locale preference, UI theme) that are required by many components within an application. Context provides a way to share values like this between components without having to explicitly pass a prop through every level of the tree.

- [Motivation](#motivation)
- [API](#api)
  - [React.createContext](#reactcreatecontext)
  - [Provider](#provider)
  - [Consumer](#consumer)
- [Examples](#examples)
  - [Static Context](#static-context)
  - [Dynamic Context](#dynamic-context)
- [Legacy API](#legacy-api)


## Motivation

Context is designed to relieve the pain of passing props down through a deeply nested component tree. For example, in the code below we manually thread through a color prop in order to style the Button and Message components:

`embed:context/motivation-problem.js`

Using context, we can avoid passing props through intermediate elements:

`embed:context/motivation-solution.js`

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
 { value => { /* render something based on the context value */ } }
</Consumer>
```

A React component that subscribes to context changes.

Requires a [function as a child](/docs/render-props.html#using-props-other-than-render). This function receives the current context value and returns a React node. It will be called whenever the Provider's value is updated.

> Note:
> 
> For more information about this pattern, see [render props](/docs/render-props.html).

## Examples

### Static Context

Here is an example illustrating how you might inject a "theme" using context:

`embed:context/theme-example.js`

### Dynamic Context

A more complex example with dynamic values for the theme:

**theme-context.js**
`embed:context/theme-detailed-theme-context.js`

**themed-button.js**
`embed:context/theme-detailed-themed-button.js`

**app.js**
`embed:context/theme-detailed-app.js`

## Legacy API

> The legacy context API was deprecated in React 16.3 and will be removed in version 17.
> 
> React previously shipped with an experimental context API. The old API will be supported in all 16.x releases, but applications using it should migrate to the new version. Read the [legacy context docs here](/docs/legacy-context.html).
