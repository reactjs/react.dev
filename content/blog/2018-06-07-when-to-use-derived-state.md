---
title: "When to Use Derived State?"
author: [bvaughn]
---

React 16.4 included a [bugfix for getDerivedStateFromProps](/blog/2018/05/23/react-v-16-4.html#bugfix-for-getderivedstatefromprops) that caused some pain in the React community. We apologize for this. We take such changes very seriously. In this case we believe it was the right decision, but we could have done a better job with communication.

The `getDerivedStateFromProps` lifecycle was introduced in 16.3. At the time, we provided [some examples](/blog/2018/03/27/update-on-async-rendering.html#examples) of how to use the new lifecycle to derive state from props. Our primary goal was to help people migrate from legacy lifecycles to newer ones that are safer to use with the [upcoming async rendering mode](blog/2018/03/01/sneak-peek-beyond-react-16.html).

Since that blog post was written, we've observed some common usage patterns for both the legacy `componentWillReceiveProps` and the newer `getDerivedStateFromProps` that cause bugs or otherwise confusing behavior. The 16.4 bugfix [makes this behavior more predictable](https://github.com/facebook/react/issues/12898), but the fixes aren't always obvious. Hopefully this blog post will help!

Let's take a look at the following topics:
* [When should I use derived state?](#when-should-i-use-derived-state)
* [When should I avoid derived state?](#when-should-i-avoid-derived-state)
* [What about memoization?](#what-about-memoization)

## When should I use derived state?

`getDerivedStateFromProps` exists for only one purpose. It enables a component to update its internal state as the result of **changes in external props**. This distinction is important. The problems we've seen so far can be ultimately reduced to either (1) unconditionally updating state from props or (2) updating state whenever props and state don't match. (We'll go over both in more detail below.)

So what does it mean to update state as the result of changes in props? Our previous blog post provided a few examples, like [managing the current scroll direction based on an offset prop](/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props) or [loading external data specified by a source prop](/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change).

As a general rule, if you're not sure about whether you should use `getDerivedStateFromProps`, here are some questions to ask yourself:
* Is the state **derived** from props (as opposed to just mirroring it)?
* Is the state update specifically triggered by a **props change** (and not just the current props value)?

If your answer to either of the above questions is "no" then there are better patterns to use.

## When should I avoid derived state?

The terms ["controlled"](/docs/forms.html#controlled-components) and ["uncontrolled"](/docs/uncontrolled-components.html) are often used to refer to form components, but they can also be used to describe where a component's state lives. Data that is passed in as props can be thought of as **controlled** and one that exists only in internal state can be thought of as **uncontrolled**.

The most common mistake with derived state is mixing these two. In other words, when props control a value in state that is also updated by `setState` calls. This may sound similar to the [external data loading example](/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change) mentioned above, but it's different in a few important ways.

In the loading example, there is a clear source of truth for both the "source" prop and the "loading" state. When the source prop changes, the loading state should **always** be overridden. Conversely the state should only be overridden when the prop **changes** and should otherwise be managed by the component.

Problems arise when any of these constraints are changed. This typically comes in two forms. Let's take a look at both.

### Anti-pattern: Props always override state

A common misconception about both `getDerivedStateFromProps` and `componentWillReceiveProps` is that they are only called when props "change". However, any time a parent component re-renders, the child component still receives the new props. Because of this, it is (and has always been) unsafe to _unconditionally_ override state values using either of these lifecycles.

Before React 16.4, it was difficult to reproduce such bugs consistently because they depend on the timing of parent re-rendering. To expose them consistently, we made `getDerivedStateFromProps` in React 16.4 fire for renders caused by `setState` or `forceUpdate` too. Let’s consider an example to demonstrate the problem.

Here is a `EmailInput` component that accepts an email prop:
```js
class EmailInput extends Component {
  state = {
    email: this.props.email
  };

  static getDerivedStateFromProps(props, state) {
    // This is bad! Do not do this!
    if (props.email) {
      return { email: props.email };
    }
    return null;
  }

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }

  handleChange = event => {
    this.setState({ email: event.target.value });
  };
}
```

At first, this component might look okay. State is initialized to the value specified by props and updated when we type into the `<input>`. But once our component re-renders– either because it called `setState` or because its parent re-rendered– anything we've typed into the `<input>` will be lost! (See [this demo for an example](codesandbox://when-to-use-derived-state/derived-state-anti-pattern).)

At this point, you might be wondering if this component would have worked with version 16.3. Unfortunately, the answer is "no". Before moving on, let's take a look at why this is.

For the simple example above, we could "fix" the problem of unexpected re-renders using `shouldComponentUpdate`. However in practice, components usually accept multiple props, and our component would re-render if any one of them changed. Even if none of them "changed", props that are functions or objects are often created inline and so will always bypass `shouldComponentUpdate`. For example, what if our component accepted a function to validate the current email address?
```js
<EmailInput
  email={this.props.user.email}
  validate={this.validateEmail.bind(this)}
/>
```

The above example binds the validation callback inline and so it will pass a new function prop every time it renders– effectively bypassing `shouldComponentUpdate` entirely. [Here is a demo](codesandbox://when-to-use-derived-state/derived-state-anti-pattern) that uses a timer to illustrate this problem. Because it might break at any time your component needs to accept new props, this design pattern is inherently fragile.

Hopefully it's clear by now why unconditionally overriding state with props is a bad idea. But what if we were to only update the state when the email prop changes? We'll take a look at that pattern next.

### Anti-pattern: Props override state whenever they change

Building on our example above, we could avoid accidentally erasing state by only updating it when `props.email` changes:

```js
class EmailInput extends Component {
  state = {
    prevPropsEmail: this.props.email,
    email: this.props.email
  };

  static getDerivedStateFromProps(props, state) {
    // Any time props.email changes, update state.
    if (props.email !== state.prevPropsEmail) {
      return {
        prevPropsEmail: props.email,
        email: props.email
      };
    }
    return null;
  }
  
  // ...
}
```

We've just made a big improvement. Now our component will no longer erase what we've typed every time it renders. At this point, what we have is fairly similar to the [scroll direction example](blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props) we mentioned before. (It will also more closely mirror how `componentWillReceiveProps` would have been used in the past.)

There is still one subtle problem though, and it's probably easiest to illustrate with an example. Let's say our `EmailInput` component is used inside of an "edit profile" form. The first time the form is rendered, the component will display our email address. Let's say we edited the form (including our email address) but then changed our mind and clicked a "reset" button. At this point, we would expect all form fields to return to their initial values– but the `EmailInput` component **will not be reset**. Do you know why?

The reason for this is that `props.email` never actually changed in the above scenario. Both times the "edit profile" form rendered, it would pass our saved email address via props.

This problem could manifest itself even without a "Reset" button. For example, imagine a password manager app using the above input component. When navigating between details for two accounts with the same initial email, the input would fail to reset because the prop value passed to the component would be the same! This would be a surprise to the user, as a draft change to one account would appear to affect other accounts that happened to share the same email.

This design is fundamentally flawed, but it's also an easy mistake to make. [I've made it myself.](https://twitter.com/brian_d_vaughn/status/959600888242307072) Fortunately there are two alternatives that work better. The key to both is that **for any piece of state, you need to pick a single component that owns it as the source of truth, and avoid duplicating it in other components.** Let's take a look at each.

#### Alternative 1: Fully controlled component

One way to avoid the problems mentioned above is to remove state from our component entirely. If the email address only exists as a prop, then we don't have to worry about conflicts with state. In this case, we could even convert `EmailInput` to a lighter-weight functional component:
```js
function EmailInput(props) {
  return <input onChange={props.onChange} value={props.email} />;
}
```

This approach simplifies the implementation of our component but it also has a potential downside: our component now requires more effort to use. For example, the parent form component will now also need to manage local (unsaved) email state.

#### Alternative 2: Fully uncontrolled component

Another alternative would be for our component to fully own the local email state. It could still accept a prop for the initial value, but it would ignore any changes to that prop afterward. For example:

```js
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail
  };

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }

  handleChange = event => {
    this.setState({ email: event.target.value });
  };
}
```

This design makes the component a little easier to use, but it also has a downside. Let's say that our "edit profile" form could be used to edit multiple users. Whenever a new user is selected, the form should reset the email field. If our `EmailInput` is uncontrolled, it will ignore any changes to `props.defaultEmail`. So how could we support this use case?

#### Option 1: Reset uncontrolled component with a `key`

One approach would be to use a special React attribute called `key`. React uses this property to decide whether to [_update_ a component instance or _create_ a new one](/docs/reconciliation.html#keys). In our case, we could use an attribute like a user id to recreate the email input any time a new user is selected. Each time the `EmailInput` is recreated, it will "reset" its state to the value specified by the `defaultEmail` prop.

```js
<EmailInput
  defaultEmail={this.props.user.email}
  key={this.props.user.id}
/>
```

> Note
>
> With this approach, you don't have to add `key` to every input. Instead, it might make sense to put a `key` on the whole form. Every time the key changes, all components within the form will be re-created with a freshly initialized state. While this may sound slow, in practice the difference is often insignificant. It can even be faster if the components have heavy logic that runs on updates.

#### Option 2: Reset uncontrolled component with an id prop

Recreating this simple example component is cheap, but what if the component was expensive to initialize? Or what if it had other state that we _did not want to reset_?

A slight variation on the above approach would be to watch for changes in a prop like "id" and use it to reset state:

```js
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail,
    prevPropsID: this.props.id
  };

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (props.id !== state.prevPropsID) {
      return {
        prevPropsID: props.id,
        email: props.email
      };
    }
    return null;
  }

  // ...
}
```

This approach can scale better with multiple state values, since fewer comparisons are required. It also provides the flexibility to only reset parts of our component's internal state.

#### Option 3: Reset uncontrolled component with an instance method

Not every component accepts a special prop like "id". (For example, what if we were writing a list component instead, and wanted to accept a scroll offset prop?) For cases like this, we could expose an instance method to imperatively reset the internal state:

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

The parent form component could then [use a `ref` to call this method](/docs/glossary.html#refs).

> Note
>
> Refs can be useful when interfacing with imperative third party APIs or in certain, limited use cases like the one mentioned above, but generally we recommend you use them sparingly.

To recap, components may contain a mix of controlled and uncontrolled data. When designing a component, it is important to decide which type of data each property will be. **Controlled** properties are often easier to _write_, but they can require more effort to _use_ as they place the burden of state management on the parent component. **Uncontrolled** properties are often easier to _use_, but they may require special consideration about how to properly update after the component has been created.

There are a couple of options for resetting an uncontrolled component's state. Which one is best depends on the component you are writing. Here is a rough guide:
1. To reset _all internal state_, use the `key` attribute.
2. To reset _some internal state_, watch for changes in a special property (e.g. `props.id`).
3. Otherwise, consider falling back to an imperative instance method called with a `ref`.

## What about memoization?

Another thing we've seen derived state used for is memoization. This isn't necessarily bad, but there are reasons you may want to avoid it. Hopefully the above examples illustrate that there is a certain amount of complexity inherent in using `getDerivedStateFromProps`. This complexity increases with each derived property. For example, if we add a second derived field to our component state then our implementation would need to separately track changes to both:

```js
class Example extends Component {
  state = {};

  static getDerivedStateFromProps(props, state) {
    const updatedState = {};
    if (props.bar !== state.prevBarFromProps) {
      updatedState.prevBarFromProps = props.bar;
      updatedState.derivedBar = deriveBar(props.bar);
    }
    if (props.foo !== state.prevFooFromProps) {
      updatedState.prevFooFromProps = props.foo;
      updatedState.derivedFoo = deriveFoo(props.foo);
    }
    // Other derived fields would go here...
    return updatedState;
  }

  // ...
}
```

Although the above pattern _works_, it isn't what `getDerivedStateFromProps` is meant to be used for. This component isn't reacting to **changes in props**. It's just computing values based on the **current props**, and there is a simpler way to do this that doesn't even require state.

Let's look at another example to illustrate this. Here is a component that accepts an array of items as `props.list` and allows a user to filter the array by entering text. We could use `getDerivedStateFromProps` for this purpose:

```js
class Example extends Component {
  state = {
    filterText: "",
    prevFilterText: ""
  };

  static getDerivedStateFromProps(props, state) {
    // Re-run the filter whenever the list array or filter text change:
    if (
      props.list !== state.prevPropsList ||
      state.prevFilterText !== state.filterText
    ) {
      // Note that to do this, state needs to explicitly track both:
      // prevPropsList - so we can detect a change in props.list
      // prevFilterText - so we can detect a change in state.filterText
      return {
        prevPropsList: props.list,
        prevFilterText: state.filterText,
        filteredList: props.list.filter(item => item.text.includes(state.filterText))
      };
    }
    return null;
  }

  render() {
    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{this.state.filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };
}
```

This implementation is more complicated than it needs to be, because it has to separately track and detect changes in both props and state in order to properly memoize. This is true of any memoized function, which suggests an alternative! We could accomplish the behavior with **less complexity** using a memoization helper:

```js
import memoize from "memoize-one";

class Example extends Component {
  // State only needs to hold the current filter text value:
  state = {
    filterText: ""
  };

  // Re-run the filter whenever the list array or filter text change:
  filter = memoize(
    (list, filterText) => list.filter(
      item => item.text.includes(filterText)
    )
  );

  render() {
    const filteredList = this.filter(this.props.list, this.state.filterText);

    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };
}
```

This is much simpler and should perform just as well as the previous version!

There are a couple of constraints to consider when using memoization though:

1. In most cases, you'll want to **attach the memoized function to a component instance**. This prevents multiple instances of a component from resetting each other's memoized keys.
1. Typically you'll want to use a memoization helper with a **limited cache size** in order to prevent memory from "leaking" over time. (In the example above, we used `memoize-one` because it only caches the most recent argument and result.)
1. Memoization will not work properly if `props.items` is recreated each time the parent component renders. Hopefully, this should not be the case for large arrays. If it were, you'd want to address that problem first! (This limitation also applies to the `getDerivedStateFromProps` version above.)

## In closing

The examples above are intentionally simplified in order to highlight specific coding patterns. In real world applications, components often contain a mix of controlled and uncontrolled behaviors. This is okay! Just be careful to ensure that each behavior has a clear source of truth in order to avoid the anti-patterns mentioned above.

If you have a use case that you think falls outside of these patterns, please share it with us on [GitHub](https://github.com/reactjs/reactjs.org/issues/new) or Twitter!