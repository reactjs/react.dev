---
id: faq-state
title: Component State
permalink: docs/faq-state.html
layout: docs
category: FAQ
---

### What Should Go in State?

**State should contain data that a component's event handlers may change to trigger a UI update.** In real apps this data tends to be very small and JSON-serializable. When building a stateful component, think about the minimal possible representation of its state, and only store those properties in `this.state`. Inside of `render()` simply compute any other information you need based on this state. You'll find that thinking about and writing applications in this way tends to lead to the most correct application, since adding redundant or computed values to state means that you need to explicitly keep them in sync rather than rely on React computing them for you.

### What Shouldn’t Go in State?

`this.state` should only contain the minimal amount of data needed to represent your UI's state. As such, it should not contain:

* **Computed data:** Don't worry about precomputing values based on state — it's easier to ensure that your UI is consistent if you do all computation within `render()`. For example, if you have an array of list items in state and you want to render the count as a string, simply render `this.state.listItems.length + ' list items'` in your `render()` method rather than storing it on state.
* **React components:** Build them in `render()` based on underlying props and state.
* **Duplicated data from props:** Try to use props as the source of truth where possible. One valid use to store props in state is to be able to know its previous values, because props can change over time.

### What does setState do?

`setState()` schedules an update to a component's `state` object. When state changes, the component responds by re-rendering.

### Why is `setState` is giving me the wrong value?

Calls to `setState` are asynchronous - don't rely on `this.state` to reflect the new value immediately after calling `setState`. Pass an updater function instead of an object if you need compute values based on the current state (see below for details).

Example of code that will not behave as expected:

```jsx
incrementCount() {
  // Note: this will *not* work as intended.
  this.setState({count: this.state.count + 1});
}

handleSomething() {
  // this.state.count is 1, then we do this:
  this.incrementCount();
  this.incrementCount(); // state wasn't updated yet, so this sets 2 not 3
}
```

See below for how to fix this problem.

### How do I update state with values that depend on the current state? 

Pass a function instead of an object to setState to ensure the call always uses the most updated version of state (see below). 

### What is the difference between passing an object or a function in setState?

Passing an update function allows you to access the current state value inside the updater. Since `setState` calls are batched, this lets you chain updates and ensure they build on top of each other instead of conflicting:

```jsx
incrementCount() {
  this.setState((prevState) => {
    return {count: prevState.count + 1}
  });
}

handleSomething() {
  // this.state.count is 1, then we do this:
  this.incrementCount();
  this.incrementCount(); // count is now 3
}
```

[Learn more about setState](/docs/react-component.html#setstate)

### Should I use a state management library like Redux or MobX?

[Maybe.](http://redux.js.org/docs/faq/General.html#general-when-to-use)

It's a good idea to get to know React first, before adding in additional libraries. You can build quite complex applications using only React.
