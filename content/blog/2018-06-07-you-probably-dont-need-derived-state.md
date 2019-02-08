---
title: "You Probably Don't Need Derived State"
author: [bvaughn]
---

React 16.4 included a [bugfix for getDerivedStateFromProps](/blog/2018/05/23/react-v-16-4.html#bugfix-for-getderivedstatefromprops) which caused some existing bugs in React components to reproduce more consistently. If this release exposed a case where your application was using an anti-pattern and didn't work properly after the fix, we're sorry for the churn. In this post, we will explain some common anti-patterns with derived state and our preferred alternatives.

For a long time, the lifecycle `componentWillReceiveProps` was the only way to update state in response to a change in props without an additional render. In version 16.3, [we introduced a replacement lifecycle, `getDerivedStateFromProps`](/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes) to solve the same use cases in a safer way. At the same time, we've realized that people have many misconceptions about how to use both methods, and we've found anti-patterns that result in subtle and confusing bugs. The `getDerivedStateFromProps` bugfix in 16.4 [makes derived state more predictable](https://github.com/facebook/react/issues/12898), so the results of misusing it are easier to notice.

> Note
>
> All of the anti-patterns described in this post apply to both the older `componentWillReceiveProps` and the newer `getDerivedStateFromProps`.

 This blog post will cover the following topics:
* [When to use derived state](#when-to-use-derived-state)
* [Common bugs when using derived state](#common-bugs-when-using-derived-state)
  * [Anti-pattern: Unconditionally copying props to state](#anti-pattern-unconditionally-copying-props-to-state)
  * [Anti-pattern: Erasing state when props change](#anti-pattern-erasing-state-when-props-change)
* [Preferred solutions](#preferred-solutions)
* [What about memoization?](#what-about-memoization)

## When to Use Derived State {#when-to-use-derived-state}

`getDerivedStateFromProps` exists for only one purpose. It enables a component to update its internal state as the result of **changes in props**. Our previous blog post provided some examples, like [recording the current scroll direction based on a changing offset prop](/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props) or [loading external data specified by a source prop](/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change).

We did not provide many examples, because as a general rule, **derived state should be used sparingly**. All problems with derived state that we have seen can be ultimately reduced to either (1) unconditionally updating state from props or (2) updating state whenever props and state don't match. (We'll go over both in more detail below.)

* If you're using derived state to memoize some computation based only on the current props, you don't need derived state. See [What about memoization?](#what-about-memoization) below.
* If you're updating derived state unconditionally or updating it whenever props and state don't match, your component likely resets its state too frequently. Read on for more details.

## Common Bugs When Using Derived State {#common-bugs-when-using-derived-state}

The terms ["controlled"](/docs/forms.html#controlled-components) and ["uncontrolled"](/docs/uncontrolled-components.html) usually refer to form inputs, but they can also describe where any component's data lives. Data passed in as props can be thought of as **controlled** (because the parent component _controls_ that data). Data that exists only in internal state can be thought of as **uncontrolled** (because the parent can't directly change it).

The most common mistake with derived state is mixing these two; when a derived state value is also updated by `setState` calls, there isn't a single source of truth for the data. The [external data loading example](/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change) mentioned above may sound similar, but it's different in a few important ways. In the loading example, there is a clear source of truth for both the "source" prop and the "loading" state. When the source prop changes, the loading state should **always** be overridden. Conversely, the state is overridden only when the prop **changes** and is otherwise managed by the component.

Problems arise when any of these constraints are changed. This typically comes in two forms. Let's take a look at both.

### Anti-pattern: Unconditionally copying props to state {#anti-pattern-unconditionally-copying-props-to-state}

A common misconception is that `getDerivedStateFromProps` and `componentWillReceiveProps` are only called when props "change". These lifecycles are called any time a parent component rerenders, regardless of whether the props are "different" from before. Because of this, it has always been unsafe to _unconditionally_ override state using either of these lifecycles. **Doing so will cause state updates to be lost.**

Let’s consider an example to demonstrate the problem. Here is a `EmailInput` component that "mirrors" an email prop in state:
```js
class EmailInput extends Component {
  state = { email: this.props.email };

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }

  handleChange = event => {
    this.setState({ email: event.target.value });
  };

  componentWillReceiveProps(nextProps) {
    // This will erase any local state updates!
    // Do not do this.
    this.setState({ email: nextProps.email });
  }
}
```

At first, this component might look okay. State is initialized to the value specified by props and updated when we type into the `<input>`. But if our component's parent rerenders, anything we've typed into the `<input>` will be lost! ([See this demo for an example.](https://codesandbox.io/s/m3w9zn1z8x)) This holds true even if we were to compare `nextProps.email !== this.state.email` before resetting.

In this simple example, adding `shouldComponentUpdate` to rerender only when the email prop has changed could fix this. However in practice, components usually accept multiple props; another prop changing would still cause a rerender and improper reset. Function and object props are also often created inline, making it hard to implement a `shouldComponentUpdate` that reliably returns true only when a material change has happened. [Here is a demo that shows that happening.](https://codesandbox.io/s/jl0w6r9w59) As a result, `shouldComponentUpdate` is best used as a performance optimization, not to ensure correctness of derived state.

Hopefully it's clear by now why **it is a bad idea to unconditionally copy props to state**. Before reviewing possible solutions, let's look at a related problematic pattern: what if we were to only update the state when the email prop changes?

### Anti-pattern: Erasing state when props change {#anti-pattern-erasing-state-when-props-change}

Continuing the example above, we could avoid accidentally erasing state by only updating it when `props.email` changes:

```js
class EmailInput extends Component {
  state = {
    email: this.props.email
  };

  componentWillReceiveProps(nextProps) {
    // Any time props.email changes, update state.
    if (nextProps.email !== this.props.email) {
      this.setState({
        email: nextProps.email
      });
    }
  }
  
  // ...
}
```

> Note
>
> Even though the example above shows `componentWillReceiveProps`, the same anti-pattern applies to `getDerivedStateFromProps`.

We've just made a big improvement. Now our component will erase what we've typed only when the props actually change.

There is still a subtle problem. Imagine a password manager app using the above input component. When navigating between details for two accounts with the same email, the input would fail to reset. This is because the prop value passed to the component would be the same for both accounts! This would be a surprise to the user, as an unsaved change to one account would appear to affect other accounts that happened to share the same email. ([See demo here.](https://codesandbox.io/s/mz2lnkjkrx))

This design is fundamentally flawed, but it's also an easy mistake to make. ([I've made it myself!](https://twitter.com/brian_d_vaughn/status/959600888242307072)) Fortunately there are two alternatives that work better. The key to both is that **for any piece of data, you need to pick a single component that owns it as the source of truth, and avoid duplicating it in other components.** Let's take a look at each of the alternatives.

## Preferred Solutions {#preferred-solutions}

### Recommendation: Fully controlled component {#recommendation-fully-controlled-component}

One way to avoid the problems mentioned above is to remove state from our component entirely. If the email address only exists as a prop, then we don't have to worry about conflicts with state. We could even convert `EmailInput` to a lighter-weight function component:
```js
function EmailInput(props) {
  return <input onChange={props.onChange} value={props.email} />;
}
```

This approach simplifies the implementation of our component, but if we still want to store a draft value, the parent form component will now need to do that manually. ([Click here to see a demo of this pattern.](https://codesandbox.io/s/7154w1l551))

### Recommendation: Fully uncontrolled component with a `key` {#recommendation-fully-uncontrolled-component-with-a-key}

Another alternative would be for our component to fully own the "draft" email state. In that case, our component could still accept a prop for the _initial_ value, but it would ignore subsequent changes to that prop:

```js
class EmailInput extends Component {
  state = { email: this.props.defaultEmail };

  handleChange = event => {
    this.setState({ email: event.target.value });
  };

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }
}
```

In order to reset the value when moving to a different item (as in our password manager scenario), we can use the special React attribute called `key`. When a `key` changes, React will [_create_ a new component instance rather than _update_ the current one](/docs/reconciliation.html#keys). Keys are usually used for dynamic lists but are also useful here. In our case, we could use the user ID to recreate the email input any time a new user is selected:

```js
<EmailInput
  defaultEmail={this.props.user.email}
  key={this.props.user.id}
/>
```

Each time the ID changes, the `EmailInput` will be recreated and its state will be reset to the latest `defaultEmail` value. ([Click here to see a demo of this pattern.](https://codesandbox.io/s/6v1znlxyxn)) With this approach, you don't have to add `key` to every input. It might make more sense to put a `key` on the whole form instead. Every time the key changes, all components within the form will be recreated with a freshly initialized state.

In most cases, this is the best way to handle state that needs to be reset.

> Note
>
> While this may sound slow, the performance difference is usually insignificant. Using a key can even be faster if the components have heavy logic that runs on updates since diffing gets bypassed for that subtree.

#### Alternative 1: Reset uncontrolled component with an ID prop {#alternative-1-reset-uncontrolled-component-with-an-id-prop}

If `key` doesn't work for some reason (perhaps the component is very expensive to initialize), a workable but cumbersome solution would be to watch for changes to "userID" in `getDerivedStateFromProps`:

```js
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail,
    prevPropsUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (props.userID !== state.prevPropsUserID) {
      return {
        prevPropsUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

This also provides the flexibility to only reset parts of our component's internal state if we so choose. ([Click here to see a demo of this pattern.](https://codesandbox.io/s/rjyvp7l3rq))

> Note
>
> Even though the example above shows `getDerivedStateFromProps`, the same technique can be used with `componentWillReceiveProps`.

#### Alternative 2: Reset uncontrolled component with an instance method {#alternative-2-reset-uncontrolled-component-with-an-instance-method}

More rarely, you may need to reset state even if there's no appropriate ID to use as `key`. One solution is to reset the key to a random value or autoincrementing number each time you want to reset. One other viable alternative is to expose an instance method to imperatively reset the internal state:

```js
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail
  };

  resetEmailForNewUser(newEmail) {
    this.setState({ email: newEmail });
  }

  // ...
}
```

The parent form component could then [use a `ref` to call this method](/docs/glossary.html#refs). ([Click here to see a demo of this pattern.](https://codesandbox.io/s/l70krvpykl))

Refs can be useful in certain cases like this one, but generally we recommend you use them sparingly. Even in the demo, this imperative method is nonideal because two renders will occur instead of one.

-----

### Recap {#recap}

To recap, when designing a component, it is important to decide whether its data will be controlled or uncontrolled.

Instead of trying to **"mirror" a prop value in state**, make the component **controlled**, and consolidate the two diverging values in the state of some parent component. For example, rather than a child accepting a "committed" `props.value` and tracking a "draft" `state.value`, have the parent manage both `state.draftValue` and `state.committedValue` and control the child's value directly. This makes the data flow more explicit and predictable.

For **uncontrolled** components, if you're trying to reset state when a particular prop (usually an ID) changes, you have a few options:
* **Recommendation: To reset _all internal state_, use the `key` attribute.**
* Alternative 1: To reset _only certain state fields_, watch for changes in a special property (e.g. `props.userID`).
* Alternative 2: You can also consider fall back to an imperative instance method using refs.

## What about memoization? {#what-about-memoization}

We've also seen derived state used to ensure an expensive value used in `render` is recomputed only when the inputs change. This technique is known as [memoization](https://en.wikipedia.org/wiki/Memoization).

Using derived state for memoization isn't necessarily bad, but it's usually not the best solution. There is inherent complexity in managing derived state, and this complexity increases with each additional property. For example, if we add a second derived field to our component state then our implementation would need to separately track changes to both.

Let's look at an example of one component that takes one prop—a list of items—and renders the items that match a search query entered by the user. We could use derived state to store the filtered list:

```js
class Example extends Component {
  state = {
    filterText: "",
  };

  // *******************************************************
  // NOTE: this example is NOT the recommended approach.
  // See the examples below for our recommendations instead.
  // *******************************************************

  static getDerivedStateFromProps(props, state) {
    // Re-run the filter whenever the list array or filter text change.
    // Note we need to store prevPropsList and prevFilterText to detect changes.
    if (
      props.list !== state.prevPropsList ||
      state.prevFilterText !== state.filterText
    ) {
      return {
        prevPropsList: props.list,
        prevFilterText: state.filterText,
        filteredList: props.list.filter(item => item.text.includes(state.filterText))
      };
    }
    return null;
  }

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{this.state.filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

This implementation avoids recalculating `filteredList` more often than necessary. But it is more complicated than it needs to be, because it has to separately track and detect changes in both props and state in order to properly update the filtered list. In this example, we could simplify things by using `PureComponent` and moving the filter operation into the render method: 

```js
// PureComponents only rerender if at least one state or prop value changes.
// Change is determined by doing a shallow comparison of state and prop keys.
class Example extends PureComponent {
  // State only needs to hold the current filter text value:
  state = {
    filterText: ""
  };

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // The render method on this PureComponent is called only if
    // props.list or state.filterText has changed.
    const filteredList = this.props.list.filter(
      item => item.text.includes(this.state.filterText)
    )

    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

The above approach is much cleaner and simpler than the derived state version. Occasionally, this won't be good enough—filtering may be slow for large lists, and `PureComponent` won't prevent rerenders if another prop were to change. To address both of these concerns, we could add a memoization helper to avoid unnecessarily re-filtering our list:

```js
import memoize from "memoize-one";

class Example extends Component {
  // State only needs to hold the current filter text value:
  state = { filterText: "" };

  // Re-run the filter whenever the list array or filter text changes:
  filter = memoize(
    (list, filterText) => list.filter(item => item.text.includes(filterText))
  );

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // Calculate the latest filtered list. If these arguments haven't changed
    // since the last render, `memoize-one` will reuse the last return value.
    const filteredList = this.filter(this.props.list, this.state.filterText);

    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

This is much simpler and performs just as well as the derived state version!

When using memoization, remember a couple of constraints:

1. In most cases, you'll want to **attach the memoized function to a component instance**. This prevents multiple instances of a component from resetting each other's memoized keys.
1. Typically you'll want to use a memoization helper with a **limited cache size** in order to prevent memory leaks over time. (In the example above, we used `memoize-one` because it only caches the most recent arguments and result.)
1. None of the implementations shown in this section will work if `props.list` is recreated each time the parent component renders. But in most cases, this setup is appropriate.

## In closing {#in-closing}

In real world applications, components often contain a mix of controlled and uncontrolled behaviors. This is okay! If each value has a clear source of truth, you can avoid the anti-patterns mentioned above.

It is also worth re-iterating that `getDerivedStateFromProps` (and derived state in general) is an advanced feature and should be used sparingly because of this complexity. If your use case falls outside of these patterns, please share it with us on [GitHub](https://github.com/reactjs/reactjs.org/issues/new) or [Twitter](https://twitter.com/reactjs)!
