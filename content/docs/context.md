---
id: context
title: Context
permalink: docs/context.html
---

Context provides a way to pass data through the component tree without having to pass props down manually at every level.

- [API](#api)
  - [React.createContext](#reactcreatecontext)
  - [Provider](#provider)
  - [Consumer](#consumer)
- [Examples](#examples)
  - [Static Context](#static-context)
  - [Dynamic Context](#dynamic-context)
- [Motivation](#motivation)
- [Legacy API](#legacy-api)

## API

### `React.createContext`

```js
const {Provider, Consumer} = React.createContext([default]);
```

Creates a `{ Provider, Consumer }` pair.

Takes one argument, the default context that Consumers will receive when they don't have a matching Provider.


### `Provider`

```js
<Provider value={/* some value */}>
```

A React component that allows Consumers to subscribe to context changes.

Takes one prop, `value`, which will be passed to the [render prop](/docs/render-props.html) of child Consumers for the matching context anywhere in the component tree. One Provider can be connected to many Consumers.

### `Consumer`

```js
<Consumer>
 { value => { /* render something based on the context value */ } }
</Consumer>
```

A React component that subscribes to context changes. 

Takes a function as the `children` prop that receives the `value` prop of the matching Provider. This function will be called whenever the Provider's value is updated.

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

## Motivation

Context is designed to relieve the pain of passing props down through a deeply nested component tree. For example, in the code below we manually thread through a color prop in order to style the Button and Message components. Using context, we can avoid passing props through intermediate elements.

```js
class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.props.color}}>
        {this.props.children}
      </button>
    );
  }
}

class Message extends React.Component {
  render() {
    return (
      <div>
        {/*
          The Message component must take `color` as as prop to pass it to the
          Button. Using context, the Button could connect to the color context
          on its own.
        */} 
        {this.props.text} <Button color={this.props.color}>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  render() {
    const color = "purple";
    const children = this.props.messages.map((message) =>
      <Message text={message.text} color={color} />
    );
    return <div>{children}</div>;
  }
}
```

## Legacy API

> The legacy context API was deprecated in React 16.3
> 
> React previously shipped with an experimental context API. The old API will be supported in all 16.x releases, but applications using it should migrate to the new version. Read the [legacy context docs here](/docs/legacy-context.html).
