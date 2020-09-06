---
id: faq-state
title: Component State
permalink: docs/faq-state.html
layout: docs
category: FAQ
---

### What does `setState` do? {#what-does-setstate-do}

`setState()` schedules an update to a component's `state` object. When state changes, the component responds by re-rendering.

### What is the difference between `state` and `props`? {#what-is-the-difference-between-state-and-props}

[`props`](/docs/components-and-props.html) (short for "properties") and [`state`](/docs/state-and-lifecycle.html) are both plain JavaScript objects. While both hold information that influences the output of render, they are different in one important way: `props` get passed *to* the component (similar to function parameters) whereas `state` is managed *within* the component (similar to variables declared within a function).

Here are some good resources for further reading on when to use `props` vs `state`:
* [Props vs State](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)
* [ReactJS: Props vs. State](https://lucybain.com/blog/2016/react-state-vs-pros/)

### Why is `setState` giving me the wrong value? {#why-is-setstate-giving-me-the-wrong-value}

In React, both `this.props` and `this.state` represent the *rendered* values, i.e. what's currently on the screen.

Calls to `setState` are asynchronous - don't rely on `this.state` to reflect the new value immediately after calling `setState`. Pass an updater function instead of an object if you need to compute values based on the current state (see below for details).

Example of code that will *not* behave as expected:

```jsx
incrementCount() {
  // Note: this will *not* work as intended.
  this.setState({count: this.state.count + 1});
}

handleSomething() {
  // Let's say `this.state.count` starts at 0.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();
  // When React re-renders the component, `this.state.count` will be 1, but you expected 3.

  // This is because `incrementCount()` function above reads from `this.state.count`,
  // but React doesn't update `this.state.count` until the component is re-rendered.
  // So `incrementCount()` ends up reading `this.state.count` as 0 every time, and sets it to 1.

  // The fix is described below!
}
```

See below for how to fix this problem.

### How do I update state with values that depend on the current state? {#how-do-i-update-state-with-values-that-depend-on-the-current-state}

Pass a function instead of an object to `setState` to ensure the call always uses the most updated version of state (see below). 

### What is the difference between passing an object or a function in `setState`? {#what-is-the-difference-between-passing-an-object-or-a-function-in-setstate}

Passing an update function allows you to access the current state value inside the updater. Since `setState` calls are batched, this lets you chain updates and ensure they build on top of each other instead of conflicting:

```jsx
incrementCount() {
  this.setState((state) => {
    // Important: read `state` instead of `this.state` when updating.
    return {count: state.count + 1}
  });
}

handleSomething() {
  // Let's say `this.state.count` starts at 0.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();

  // If you read `this.state.count` now, it would still be 0.
  // But when React re-renders the component, it will be 3.
}
```

[Learn more about setState](/docs/react-component.html#setstate)

### When is `setState` asynchronous? {#when-is-setstate-asynchronous}

Currently, `setState` is asynchronous inside event handlers.

This ensures, for example, that if both `Parent` and `Child` call `setState` during a click event, `Child` isn't re-rendered twice. Instead, React "flushes" the state updates at the end of the browser event. This results in significant performance improvements in larger apps.

This is an implementation detail so avoid relying on it directly. In the future versions, React will batch updates by default in more cases.

### Why doesn't React update `this.state` synchronously? {#why-doesnt-react-update-thisstate-synchronously}

As explained in the previous section, React intentionally "waits" until all components call `setState()` in their event handlers before starting to re-render. This boosts performance by avoiding unnecessary re-renders.

However, you might still be wondering why React doesn't just update `this.state` immediately without re-rendering.

There are two main reasons:

* This would break the consistency between `props` and `state`, causing issues that are very hard to debug.
* This would make some of the new features we're working on impossible to implement.

This [GitHub comment](https://github.com/facebook/react/issues/11527#issuecomment-360199710) dives deep into the specific examples.

### Should I use a state management library like Redux or MobX? {#should-i-use-a-state-management-library-like-redux-or-mobx}

[Maybe.](https://redux.js.org/faq/general#when-should-i-use-redux)

It's a good idea to get to know React first, before adding in additional libraries. You can build quite complex applications using only React.
