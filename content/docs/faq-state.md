---
id: faq-state
title: Component State
permalink: docs/faq-state.html
layout: docs
category: FAQ
---

### What does setState do?

`setState()` schedules an update to a component's `state` object. When state changes, the component responds by re-rendering.

### Why is `setState` is giving me the wrong value?

Calls to `setState` are asynchronous - don't rely on `this.state` to reflect the new value immediately after calling `setState`. Pass an updater function instead of an object if you need compute values based on the current state (see below for details).

Example of code that will not behave as expected:

```jsx
incrementCount = () => {
  this.setState({count: this.state.count + 1})
}

handleSomething() {
  // this.state.count is 1, then we do this:
  this.incrementCount()
  this.incrementCount() // state wasn't updated yet, so this sets 2 not 3
}
```

See below for how to fix this problem.

### How do I update state with values that depend on the current state? 

Pass a function instead of an object to setState to ensure the call always uses the most updated version of state (see below). 

### What is the difference between passing an object or a function in setState?

Passing an update function allows you to access the current state value inside the updater. Since `setState` calls are batched, this lets you chain updates and ensure they build on top of each other instead of conflicting:

```jsx
incrementCount = () => {
  this.setState((prevState) => {
    return {count: prevState.count + 1}
  })
}

handleSomething() {
  // this.state.count is 1, then we do this:
  this.incrementCount()
  this.incrementCount() // count is now 3
}
```

[Learn more about setState](/docs/react-component.html#setstate)

### Should I use a state management library like Redux or MobX?

[Maybe.](http://redux.js.org/docs/faq/General.html#general-when-to-use)

It's a good idea to get to know React first, before adding in additional libraries. You can build quite complex applications using only React.
