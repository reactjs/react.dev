---
title: Update on Async Rendering
author: [bvaughn]
---

For over a year, the React team has been working to implement asynchronous rendering. Last month during his talk at JSConf Iceland, [Dan unveiled some of the exciting new possibilities async rendering unlocks](/blog/2018/03/01/sneak-peek-beyond-react-16). Now we'd like to share with you some of the lessons we've learned while working on these features, and some recipes to help prepare your components for async rendering when it launches.

One of the biggest lessons we've learned is that some of our legacy component lifecycles tend to encourage unsafe coding practices. They are:

- `componentWillMount`
- `componentWillReceiveProps`
- `componentWillUpdate`

These lifecycle methods have often been misunderstood and subtly misused; furthermore, we anticipate that their potential misuse may be more problematic with async rendering. Because of this, we will be adding an "UNSAFE\_" prefix to these lifecycles in an upcoming release. (Here, "unsafe" refers not to security but instead conveys that code using these lifecycles will be more likely to have bugs in future versions of React, especially once async rendering is enabled.)

## Gradual Migration Path {/*gradual-migration-path*/}

[React follows semantic versioning](/blog/2016/02/19/new-versioning-scheme), so this change will be gradual. Our current plan is:

- **16.3**: Introduce aliases for the unsafe lifecycles, `UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps`, and `UNSAFE_componentWillUpdate`. (Both the old lifecycle names and the new aliases will work in this release.)
- **A future 16.x release**: Enable deprecation warning for `componentWillMount`, `componentWillReceiveProps`, and `componentWillUpdate`. (Both the old lifecycle names and the new aliases will work in this release, but the old names will log a DEV-mode warning.)
- **17.0**: Remove `componentWillMount`, `componentWillReceiveProps`, and `componentWillUpdate` . (Only the new "UNSAFE\_" lifecycle names will work from this point forward.)

**Note that if you're a React application developer, you don't have to do anything about the legacy methods yet. The primary purpose of the upcoming version 16.3 release is to enable open source project maintainers to update their libraries in advance of any deprecation warnings. Those warnings will not be enabled until a future 16.x release.**

We maintain over 50,000 React components at Facebook, and we don't plan to rewrite them all immediately. We understand that migrations take time. We will take the gradual migration path along with everyone in the React community.

If you don't have the time to migrate or test these components, we recommend running a ["codemod"](https://medium.com/@cpojer/effective-javascript-codemods-5a6686bb46fb) script that renames them automatically:

```bash
cd your_project
npx react-codemod rename-unsafe-lifecycles
```

Learn more about this codemod on the [16.9.0 release post.](https://reactjs.org/blog/2019/08/08/react-v16.9.0#renaming-unsafe-lifecycle-methods)

---

## Migrating from Legacy Lifecycles {/*migrating-from-legacy-lifecycles*/}

If you'd like to start using the new component APIs introduced in React 16.3 (or if you're a maintainer looking to update your library in advance) here are a few examples that we hope will help you to start thinking about components a bit differently. Over time, we plan to add additional "recipes" to our documentation that show how to perform common tasks in a way that avoids the problematic lifecycles.

Before we begin, here's a quick overview of the lifecycle changes planned for version 16.3:

- We are **adding the following lifecycle aliases**: `UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps`, and `UNSAFE_componentWillUpdate`. (Both the old lifecycle names and the new aliases will be supported.)
- We are **introducing two new lifecycles**, static `getDerivedStateFromProps` and `getSnapshotBeforeUpdate`.

### New lifecycle: `getDerivedStateFromProps` {/*new-lifecycle-getderivedstatefromprops*/}

```js
class Example extends React.Component {
  static getDerivedStateFromProps(props, state) {
    // ...
  }
}
```

The new static `getDerivedStateFromProps` lifecycle is invoked after a component is instantiated as well as before it is re-rendered. It can return an object to update `state`, or `null` to indicate that the new `props` do not require any `state` updates.

Together with `componentDidUpdate`, this new lifecycle should cover all use cases for the legacy `componentWillReceiveProps`.

> Note:
>
> Both the older `componentWillReceiveProps` and the new `getDerivedStateFromProps` methods add significant complexity to components. This often leads to [bugs](/blog/2018/06/07/you-probably-dont-need-derived-state#common-bugs-when-using-derived-state). Consider **[simpler alternatives to derived state](/blog/2018/06/07/you-probably-dont-need-derived-state)** to make components predictable and maintainable.

### New lifecycle: `getSnapshotBeforeUpdate` {/*new-lifecycle-getsnapshotbeforeupdate*/}

```js
class Example extends React.Component {
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // ...
  }
}
```

The new `getSnapshotBeforeUpdate` lifecycle is called right before mutations are made (e.g. before the DOM is updated). The return value for this lifecycle will be passed as the third parameter to `componentDidUpdate`. (This lifecycle isn't often needed, but can be useful in cases like manually preserving scroll position during rerenders.)

Together with `componentDidUpdate`, this new lifecycle should cover all use cases for the legacy `componentWillUpdate`.

You can find their type signatures [in this gist](https://gist.github.com/gaearon/88634d27abbc4feeb40a698f760f3264).

We'll look at examples of how both of these lifecycles can be used below.

## Examples {/*examples*/}

- [Initializing state](#initializing-state)
- [Fetching external data](#fetching-external-data)
- [Adding event listeners (or subscriptions)](#adding-event-listeners-or-subscriptions)
- [Updating `state` based on props](#updating-state-based-on-props)
- [Invoking external callbacks](#invoking-external-callbacks)
- [Side effects on props change](#side-effects-on-props-change)
- [Fetching external data when props change](#fetching-external-data-when-props-change)
- [Reading DOM properties before an update](#reading-dom-properties-before-an-update)

> Note
>
> For brevity, the examples below are written using the experimental class properties transform, but the same migration strategies apply without it.

### Initializing state {/*initializing-state*/}

This example shows a component with `setState` calls inside of `componentWillMount`:

```js {5-10}
// Before
class ExampleComponent extends React.Component {
  state = {};

  componentWillMount() {
    this.setState({
      currentColor: this.props.defaultColor,
      palette: 'rgb',
    });
  }
}
```

The simplest refactor for this type of component is to move state initialization to the constructor or to a property initializer, like so:

```js {3-6}
// After
class ExampleComponent extends React.Component {
  state = {
    currentColor: this.props.defaultColor,
    palette: 'rgb',
  };
}
```

### Fetching external data {/*fetching-external-data*/}

Here is an example of a component that uses `componentWillMount` to fetch external data:

```js {7-14}
// Before
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  componentWillMount() {
    this._asyncRequest = loadMyAsyncData().then(
      externalData => {
        this._asyncRequest = null;
        this.setState({externalData});
      }
    );
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    if (this.state.externalData === null) {
      // Render loading state ...
    } else {
      // Render real UI ...
    }
  }
}
```

The above code is problematic for both server rendering (where the external data won't be used) and the upcoming async rendering mode (where the request might be initiated multiple times).

The recommended upgrade path for most use cases is to move data-fetching into `componentDidMount`:

```js {7-14}
// After
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  componentDidMount() {
    this._asyncRequest = loadMyAsyncData().then(
      externalData => {
        this._asyncRequest = null;
        this.setState({externalData});
      }
    );
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    if (this.state.externalData === null) {
      // Render loading state ...
    } else {
      // Render real UI ...
    }
  }
}
```

There is a common misconception that fetching in `componentWillMount` lets you avoid the first empty rendering state. In practice this was never true because React has always executed `render` immediately after `componentWillMount`. If the data is not available by the time `componentWillMount` fires, the first `render` will still show a loading state regardless of where you initiate the fetch. This is why moving the fetch to `componentDidMount` has no perceptible effect in the vast majority of cases.

> Note
>
> Some advanced use-cases (e.g. libraries like Relay) may want to experiment with eagerly prefetching async data. An example of how this can be done is available [here](https://gist.github.com/bvaughn/89700e525ff423a75ffb63b1b1e30a8f).
>
> In the longer term, the canonical way to fetch data in React components will likely be based on the “suspense” API [introduced at JSConf Iceland](/blog/2018/03/01/sneak-peek-beyond-react-16). Both simple data fetching solutions and libraries like Apollo and Relay will be able to use it under the hood. It is significantly less verbose than either of the above solutions, but will not be finalized in time for the 16.3 release.
>
> When supporting server rendering, it's currently necessary to provide the data synchronously – `componentWillMount` was often used for this purpose but the constructor can be used as a replacement. The upcoming suspense APIs will make async data fetching cleanly possible for both client and server rendering.

### Adding event listeners (or subscriptions) {/*adding-event-listeners-or-subscriptions*/}

Here is an example of a component that subscribes to an external event dispatcher when mounting:

```js {3-12}
// Before
class ExampleComponent extends React.Component {
  componentWillMount() {
    this.setState({
      subscribedValue: this.props.dataSource.value,
    });

    // This is not safe; it can leak!
    this.props.dataSource.subscribe(
      this.handleSubscriptionChange
    );
  }

  componentWillUnmount() {
    this.props.dataSource.unsubscribe(
      this.handleSubscriptionChange
    );
  }

  handleSubscriptionChange = dataSource => {
    this.setState({
      subscribedValue: dataSource.value,
    });
  };
}
```

Unfortunately, this can cause memory leaks for server rendering (where `componentWillUnmount` will never be called) and async rendering (where rendering might be interrupted before it completes, causing `componentWillUnmount` not to be called).

People often assume that `componentWillMount` and `componentWillUnmount` are always paired, but that is not guaranteed. Only once `componentDidMount` has been called does React guarantee that `componentWillUnmount` will later be called for clean up.

For this reason, the recommended way to add listeners/subscriptions is to use the `componentDidMount` lifecycle:

```js {3-5,7-24}
// After
class ExampleComponent extends React.Component {
  state = {
    subscribedValue: this.props.dataSource.value,
  };

  componentDidMount() {
    // Event listeners are only safe to add after mount,
    // So they won't leak if mount is interrupted or errors.
    this.props.dataSource.subscribe(
      this.handleSubscriptionChange
    );

    // External values could change between render and mount,
    // In some cases it may be important to handle this case.
    if (
      this.state.subscribedValue !==
      this.props.dataSource.value
    ) {
      this.setState({
        subscribedValue: this.props.dataSource.value,
      });
    }
  }

  componentWillUnmount() {
    this.props.dataSource.unsubscribe(
      this.handleSubscriptionChange
    );
  }

  handleSubscriptionChange = dataSource => {
    this.setState({
      subscribedValue: dataSource.value,
    });
  };
}
```

Sometimes it is important to update subscriptions in response to property changes. If you're using a library like Redux or MobX, the library's container component should handle this for you. For application authors, we've created a small library, [`create-subscription`](https://github.com/facebook/react/tree/master/packages/create-subscription), to help with this. We'll publish it along with React 16.3.

Rather than passing a subscribable `dataSource` prop as we did in the example above, we could use `create-subscription` to pass in the subscribed value:

```js
import {createSubscription} from 'create-subscription';

const Subscription = createSubscription({
  getCurrentValue(sourceProp) {
    // Return the current value of the subscription (sourceProp).
    return sourceProp.value;
  },

  subscribe(sourceProp, callback) {
    function handleSubscriptionChange() {
      callback(sourceProp.value);
    }

    // Subscribe (e.g. add an event listener) to the subscription (sourceProp).
    // Call callback(newValue) whenever a subscription changes.
    sourceProp.subscribe(handleSubscriptionChange);

    // Return an unsubscribe method.
    return function unsubscribe() {
      sourceProp.unsubscribe(handleSubscriptionChange);
    };
  },
});

// Rather than passing the subscribable source to our ExampleComponent,
// We could just pass the subscribed value directly:
<Subscription source={dataSource}>
  {value => <ExampleComponent subscribedValue={value} />}
</Subscription>;
```

> Note
>
> Libraries like Relay/Apollo should manage subscriptions manually with the same techniques as `create-subscription` uses under the hood (as referenced [here](https://gist.github.com/bvaughn/d569177d70b50b58bff69c3c4a5353f3)) in a way that is most optimized for their library usage.

### Updating `state` based on `props` {/*updating-state-based-on-props*/}

> Note:
>
> Both the older `componentWillReceiveProps` and the new `getDerivedStateFromProps` methods add significant complexity to components. This often leads to [bugs](/blog/2018/06/07/you-probably-dont-need-derived-state#common-bugs-when-using-derived-state). Consider **[simpler alternatives to derived state](/blog/2018/06/07/you-probably-dont-need-derived-state)** to make components predictable and maintainable.

Here is an example of a component that uses the legacy `componentWillReceiveProps` lifecycle to update `state` based on new `props` values:

```js {7-14}
// Before
class ExampleComponent extends React.Component {
  state = {
    isScrollingDown: false,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.currentRow !== nextProps.currentRow) {
      this.setState({
        isScrollingDown:
          nextProps.currentRow > this.props.currentRow,
      });
    }
  }
}
```

Although the above code is not problematic in itself, the `componentWillReceiveProps` lifecycle is often mis-used in ways that _do_ present problems. Because of this, the method will be deprecated.

As of version 16.3, the recommended way to update `state` in response to `props` changes is with the new `static getDerivedStateFromProps` lifecycle. It is called when a component is created and each time it re-renders due to changes to props or state:

```js {5-8,10-20}
// After
class ExampleComponent extends React.Component {
  // Initialize state in constructor,
  // Or with a property initializer.
  state = {
    isScrollingDown: false,
    lastRow: null,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.currentRow !== state.lastRow) {
      return {
        isScrollingDown: props.currentRow > state.lastRow,
        lastRow: props.currentRow,
      };
    }

    // Return null to indicate no change to state.
    return null;
  }
}
```

You may notice in the example above that `props.currentRow` is mirrored in state (as `state.lastRow`). This enables `getDerivedStateFromProps` to access the previous props value in the same way as is done in `componentWillReceiveProps`.

You may wonder why we don't just pass previous props as a parameter to `getDerivedStateFromProps`. We considered this option when designing the API, but ultimately decided against it for two reasons:

- A `prevProps` parameter would be null the first time `getDerivedStateFromProps` was called (after instantiation), requiring an if-not-null check to be added any time `prevProps` was accessed.
- Not passing the previous props to this function is a step toward freeing up memory in future versions of React. (If React does not need to pass previous props to lifecycles, then it does not need to keep the previous `props` object in memory.)

> Note
>
> If you're writing a shared component, the [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat) polyfill enables the new `getDerivedStateFromProps` lifecycle to be used with older versions of React as well. [Learn more about how to use it below.](#open-source-project-maintainers)

### Invoking external callbacks {/*invoking-external-callbacks*/}

Here is an example of a component that calls an external function when its internal state changes:

```js {3-10}
// Before
class ExampleComponent extends React.Component {
  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.someStatefulValue !==
      nextState.someStatefulValue
    ) {
      nextProps.onChange(nextState.someStatefulValue);
    }
  }
}
```

Sometimes people use `componentWillUpdate` out of a misplaced fear that by the time `componentDidUpdate` fires, it is "too late" to update the state of other components. This is not the case. React ensures that any `setState` calls that happen during `componentDidMount` and `componentDidUpdate` are flushed before the user sees the updated UI. In general, it is better to avoid cascading updates like this, but in some cases they are necessary (for example, if you need to position a tooltip after measuring the rendered DOM element).

Either way, it is unsafe to use `componentWillUpdate` for this purpose in async mode, because the external callback might get called multiple times for a single update. Instead, the `componentDidUpdate` lifecycle should be used since it is guaranteed to be invoked only once per update:

```js {3-10}
// After
class ExampleComponent extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.someStatefulValue !==
      prevState.someStatefulValue
    ) {
      this.props.onChange(this.state.someStatefulValue);
    }
  }
}
```

### Side effects on props change {/*side-effects-on-props-change*/}

Similar to the [example above](#invoking-external-callbacks), sometimes components have side effects when `props` change.

```js {3-7}
// Before
class ExampleComponent extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.isVisible !== nextProps.isVisible) {
      logVisibleChange(nextProps.isVisible);
    }
  }
}
```

Like `componentWillUpdate`, `componentWillReceiveProps` might get called multiple times for a single update. For this reason it is important to avoid putting side effects in this method. Instead, `componentDidUpdate` should be used since it is guaranteed to be invoked only once per update:

```js {3-7}
// After
class ExampleComponent extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (this.props.isVisible !== prevProps.isVisible) {
      logVisibleChange(this.props.isVisible);
    }
  }
}
```

### Fetching external data when `props` change {/*fetching-external-data-when-props-change*/}

Here is an example of a component that fetches external data based on `props` values:

```js {11-16}
// Before
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  componentDidMount() {
    this._loadAsyncData(this.props.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.setState({externalData: null});
      this._loadAsyncData(nextProps.id);
    }
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    if (this.state.externalData === null) {
      // Render loading state ...
    } else {
      // Render real UI ...
    }
  }

  _loadAsyncData(id) {
    this._asyncRequest = loadMyAsyncData(id).then(
      externalData => {
        this._asyncRequest = null;
        this.setState({externalData});
      }
    );
  }
}
```

The recommended upgrade path for this component is to move data updates into `componentDidUpdate`. You can also use the new `getDerivedStateFromProps` lifecycle to clear stale data before rendering the new props:

```js {7-19}
// After
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  static getDerivedStateFromProps(props, state) {
    // Store prevId in state so we can compare when props change.
    // Clear out previously-loaded data (so we don't render stale stuff).
    if (props.id !== state.prevId) {
      return {
        externalData: null,
        prevId: props.id,
      };
    }

    // No state update necessary
    return null;
  }

  componentDidMount() {
    this._loadAsyncData(this.props.id);
  }

  // highlight-range{1-5}
  componentDidUpdate(prevProps, prevState) {
    if (this.state.externalData === null) {
      this._loadAsyncData(this.props.id);
    }
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    if (this.state.externalData === null) {
      // Render loading state ...
    } else {
      // Render real UI ...
    }
  }

  _loadAsyncData(id) {
    this._asyncRequest = loadMyAsyncData(id).then(
      externalData => {
        this._asyncRequest = null;
        this.setState({externalData});
      }
    );
  }
}
```

> Note
>
> If you're using an HTTP library that supports cancellation, like [axios](https://www.npmjs.com/package/axios), then it's simple to cancel an in-progress request when unmounting. For native Promises, you can use an approach like [the one shown here](https://gist.github.com/bvaughn/982ab689a41097237f6e9860db7ca8d6).

### Reading DOM properties before an update {/*reading-dom-properties-before-an-update*/}

Here is an example of a component that reads a property from the DOM before an update in order to maintain scroll position within a list:

```js {5-12,14-23}
class ScrollingList extends React.Component {
  listRef = null;
  previousScrollOffset = null;

  componentWillUpdate(nextProps, nextState) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (this.props.list.length < nextProps.list.length) {
      this.previousScrollOffset =
        this.listRef.scrollHeight - this.listRef.scrollTop;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // If previousScrollOffset is set, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    if (this.previousScrollOffset !== null) {
      this.listRef.scrollTop =
        this.listRef.scrollHeight -
        this.previousScrollOffset;
      this.previousScrollOffset = null;
    }
  }

  render() {
    return (
      <div ref={this.setListRef}>
        {/* ...contents... */}
      </div>
    );
  }

  setListRef = ref => {
    this.listRef = ref;
  };
}
```

In the above example, `componentWillUpdate` is used to read the DOM property. However with async rendering, there may be delays between "render" phase lifecycles (like `componentWillUpdate` and `render`) and "commit" phase lifecycles (like `componentDidUpdate`). If the user does something like resize the window during this time, the `scrollHeight` value read from `componentWillUpdate` will be stale.

The solution to this problem is to use the new "commit" phase lifecycle, `getSnapshotBeforeUpdate`. This method gets called _immediately before_ mutations are made (e.g. before the DOM is updated). It can return a value for React to pass as a parameter to `componentDidUpdate`, which gets called _immediately after_ mutations.

The two lifecycles can be used together like this:

```js {4-13,15-23}
class ScrollingList extends React.Component {
  listRef = null;

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (prevProps.list.length < this.props.list.length) {
      return (
        this.listRef.scrollHeight - this.listRef.scrollTop
      );
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      this.listRef.scrollTop =
        this.listRef.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.setListRef}>
        {/* ...contents... */}
      </div>
    );
  }

  setListRef = ref => {
    this.listRef = ref;
  };
}
```

> Note
>
> If you're writing a shared component, the [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat) polyfill enables the new `getSnapshotBeforeUpdate` lifecycle to be used with older versions of React as well. [Learn more about how to use it below.](#open-source-project-maintainers)

## Other scenarios {/*other-scenarios*/}

While we tried to cover the most common use cases in this post, we recognize that we might have missed some of them. If you are using `componentWillMount`, `componentWillUpdate`, or `componentWillReceiveProps` in ways that aren't covered by this blog post, and aren't sure how to migrate off these legacy lifecycles, please [file a new issue against our documentation](https://github.com/reactjs/reactjs.org/issues/new) with your code examples and as much background information as you can provide. We will update this document with new alternative patterns as they come up.

## Open source project maintainers {/*open-source-project-maintainers*/}

Open source maintainers might be wondering what these changes mean for shared components. If you implement the above suggestions, what happens with components that depend on the new static `getDerivedStateFromProps` lifecycle? Do you also have to release a new major version and drop compatibility for React 16.2 and older?

Fortunately, you do not!

When React 16.3 is published, we'll also publish a new npm package, [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat). This package polyfills components so that the new `getDerivedStateFromProps` and `getSnapshotBeforeUpdate` lifecycles will also work with older versions of React (0.14.9+).

To use this polyfill, first add it as a dependency to your library:

```bash
# Yarn
yarn add react-lifecycles-compat

# NPM
npm install react-lifecycles-compat --save
```

Next, update your components to use the new lifecycles (as described above).

Lastly, use the polyfill to make your component backwards compatible with older versions of React:

```js {2,5,11}
import React from 'react';
import {polyfill} from 'react-lifecycles-compat';

class ExampleComponent extends React.Component {
  static getDerivedStateFromProps(props, state) {
    // Your state update logic here ...
  }
}

// Polyfill your component to work with older versions of React:
polyfill(ExampleComponent);

export default ExampleComponent;
```