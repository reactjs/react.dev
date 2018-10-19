Start Date: 2018-10-19
- RFC PR: (leave this empty)
- React Issue: (leave this empty)

# Summary

`contextType` is a convenience API for accessing the React [context](https://reactjs.org/docs/context.html) from class components. It works similar to `Context.Consumer` but lets you handle the common case where you only need a single context more ergonomically.

It **does not replace** `Context.Consumer`. It is a shortcut for the most common case that helps reduce component tree nesting.

# Basic example

```js 
// Works with new context API
const ThemeContext = React.createContext('dark');

class Button extends React.Component {
  static contextType = ThemeContext; // Alternative to using Consumer

  componentDidMount() {
    console.log(this.context); // You can read it in lifecycles
  }

  render() {
    const theme = this.context; // And in render
    return <div className={theme} />;
  }
}
```

This component subscribes to context similar to `ThemeContext.Consumer`, but lets you avoid an extra nesting layer when you want to access context from a lifecycle method.

# Motivation

The new context API introduced in 16.3 is a low-level primitive. It was designed to work the same way both with class components and with function components, and it solves name clashes and other issues with the legacy context API.

However, the legacy context API is still more ergonomic for the case when you need to access context in a lifecycle method. With the render prop context API, you can still do it but it is awkward:

```js
class ThemedButton extends React.Component {
  componentDidMount() {
    console.log(this.props.theme);
  }

  render() {
    return <div className={this.props.theme} />;
  }
}

const Button = React.forwardRef((props, ref) => (
  <ThemeContext.Consumer>
    {theme => <ThemedButton {...props} theme={theme} ref={ref} />
  </ThemeContext.Consumer>
);
```

This particular case (when we need to access a single context from lifecycle methods) is sufficiently common compared to other cases that it's worth building a convenience API for. It is also valuable for some [interop](https://github.com/facebook/react/issues/13336) scenarios.

Importantly, this API is designed to speed up the adoption of the new context. Supporting legacy context makes React larger and slower, and we see the need for more pragmatic solutions to help people move away for it.

>Note
>
>This isn't the first "convenience API" in React. It is similar to how React has a convenience `createRef` API even though a more powerful callback ref API exists. The goal is to help simplify the 80% case with a more direct API, at the cost of some redundancy.

# Detailed design

When a class component has `contextType` defined, it is assumed to be a Context object (return value of `React.createContext`). React flags this component as a context consumer, and provides the current value of this context as `this.context`. It is available both in the render phase and in the lifecycle methods.

## Why Didn't We Do This Way Back?

Arguably this could have been a part of the initial `React.createContext` proposal. We'd still, however, need a low-level API for function components or combining multiple contexts. So this couldn't be the only API. At the time `React.createContext` was proposed, we were hoping to be able to make more targeted optimizations to context propagation. However, as we worked on Suspense, we realized that we need the capability to read context without an explicit `Consumer` render prop anyway — otherwise accessing a Suspense cache is too cumbersome. Since this makes the original performance optimization justification weaker, and we might as well add a convenience API if we can't take advantage of the low-level API constraints.

This API proposal is intentionally limited and **doesn't** support multiple contexts directly. It is only a shortcut for the common case. If you need to read several contexts (or read it from function components), you can use the existing API.

# Drawbacks

* Adds another way to do the same thing. (But without the nesting.)
* Might be confused with the legacy API due to the similarity.
* Doesn't let you use multiple contexts without a render prop.
* Code using this API is more hassle to move into a function component.

# Alternatives

* Don't do anything (status quo). This significantly slows down the adoption of new context.
* Call the field something different, like `contextConsumerType`.
* Support using multiple contexts from one class component.

# Adoption strategy

You don't need to use it, but it's a nicer migration path from the legacy context. 

# How we teach this

https://github.com/reactjs/reactjs.org/pull/1265
