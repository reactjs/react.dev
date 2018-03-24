---
title: Update on Async Rendering
author: [bvaughn]
---

For over a year, the React team has been working to implement asynchronous rendering. Last month during his talk at JSConf Iceland, [Dan unveiled some of the exciting new possibilities async rendering unlocks](/blog/2018/03/01/sneak-peek-beyond-react-16.html). Now we'd like to share with you some of the lessons we've learned while working on this feature, and some suggestions we have for preparing your components to be ready for async rendering when it launches.

One of the biggest lessons we've learned is that some of our legacy component lifecycles tend to encourage unsafe coding practices. They are:

* `componentWillMount`
* `componentWillReceiveProps`
* `componentWillUpdate`

These lifecycle methods have often been misunderstood and subtly misused; furthermore, we anticipate that their potential misuse may be more problematic with async rendering. Because of this, we will be adding an "UNSAFE_" prefix to these lifecycles in an upcoming release.

[React follows semantic versioning](/blog/2016/02/19/new-versioning-scheme.html), so this change will be gradual. Our current plan is:

* **16.3**: Introduce aliases for the unsafe lifecycles, `UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps`, and `UNSAFE_componentWillUpdate`. (Both the old lifecycle names and the new aliases will work in this release.)
* **16.x**: Enable deprecation warning for `componentWillMount`, `componentWillReceiveProps`, and `componentWillUpdate`. (Both the old lifecycle names and the new aliases will work in this release, but the old names will log a DEV-mode warning.)
* **17.0**: Remove `componentWillMount`, `componentWillReceiveProps`, and `componentWillUpdate` . (Only the new "UNSAFE_" lifecycle names will work from this point forward.)

Below, we will outline a migration plan for components that rely on these legacy lifecycles.

## Updating class components

#### If you're an application developer, **you don't have to do anything about the legacy methods yet**. The primary purpose of the upcoming version 16.3 release is to enable open source project maintainers to update their libraries in advance of any deprecation warnings. Those warnings will not be enabled until a future 16.x release.

However, if you'd like to start using the new component API (or if you're a maintainer looking to update your library in advance) here are a few examples that we hope will help you to start thinking about components a bit differently. Over time, we plan to add additional "recipes" to our documentation that show how to perform common tasks in a way that avoids the problematic lifecycles.

---

Before we begin, here's a quick overview of the lifecycle changes planned for version 16.3:
* We are adding the following lifecycle aliases: `UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps`, and `UNSAFE_componentWillUpdate`. (Both the old lifecycle names and the new aliases will be supported.)
* We are introducing two new lifecycles, static `getDerivedStateFromProps` and `getSnapshotBeforeUpdate`:

`embed:update-on-async-rendering/new-lifecycles-overview.js`

The new static `getSnapshotBeforeUpdate` lifecycle is invoked after a component is instantiated as well as when it receives new props. It can return an object to update `state`, or `null` to indicate that the new `props` do not require any `state` updates.

The new `getSnapshotBeforeUpdate` lifecycle is called right before mutations are made (e.g. before the DOM is updated). The return value for this lifecycle will be passed as the third parameter to `componentDidUpdate`.

We'll look at examples of how both of these lifecycles can be used below.

> Note
>
> For brevity, the examples below are written using the experimental class properties transform, but the same migration strategies apply without it.

---

### Initializing state

This example shows a component with `setState` calls inside of `componentWillMount`:
`embed:update-on-async-rendering/initializing-state-before.js`

The simplest refactor for this type of component is to move state initialization to the constructor or to a property initializer, like so:
`embed:update-on-async-rendering/initializing-state-after.js`

### Fetching external data

Here is an example of a component that uses `componentWillMount` to fetch external data:
`embed:update-on-async-rendering/fetching-external-data-before.js`

The above code is problematic for both server rendering (where the external data won't be used) and the upcoming async rendering mode (where the request might be initiated multiple times).

The recommended upgrade path for most use cases is to move data-fetching into `componentDidMount`:
`embed:update-on-async-rendering/fetching-external-data-after.js`

There is a common misconception that fetching in `componentWillMount` lets you avoid the first empty rendering state. In practice this was never true because React has always executed `render` immediately after `componentWillMount`. If the data is not available by the time `componentWillMount` fires, the first `render` will still show a loading state regardless of where you initiate the fetch. This is why moving the fetch to `componentDidMount` has no perceptible effect in the vast majority of cases.

> Note
>
> Some advanced use-cases (e.g. libraries like Relay) may want to experiment with eagerly prefetching async data. An example of how this can be done is available [here](https://gist.github.com/bvaughn/89700e525ff423a75ffb63b1b1e30a8f).

### Adding event listeners (or subscriptions)

Here is an example of a component that subscribes to an external event dispatcher when mounting:
`embed:update-on-async-rendering/adding-event-listeners-before.js`

Unfortunately, this can cause memory leaks for server rendering (where `componentWillUnmount` will never be called) and async rendering (where rendering might be interrupted before it completes, causing `componentWillUnmount` not to be called).

People often assume that `componentWillMount` and `componentWillUnmount` are always paired, but that is not guaranteed. Only once `componentDidMount` has been called does React guarantee that `componentWillUnmount` will later be called for clean up.

For this reason, the recommended way to add listeners/subscriptions is to use the `componentDidMount` lifecycle:
`embed:update-on-async-rendering/adding-event-listeners-after.js`

> Note
>
> Although the pattern above is slightly more verbose, it has an added benefit of deferring the subscription creation until after the component has rendered, reducing the amount of time in the critical render path. In the near future, React may include more tools to reduce code complexity for data fetching cases like this.

> Note
>
> Sometimes it is important to update subscriptions in response to property changes. If you're using a library like Redux or MobX, the library's container component should handle this for you. If you're authoring such a library, we suggest using a technique like [the one shown here](https://gist.github.com/bvaughn/d569177d70b50b58bff69c3c4a5353f3).

### Updating `state` based on `props`

Here is an example of a component that uses the legacy `componentWillReceiveProps` lifecycle to update `state` based on new `props` values:
`embed:update-on-async-rendering/updating-state-from-props-before.js`

Although the above code is not problematic in itself, the `componentWillReceiveProps` lifecycle is often mis-used in ways that _do_ present problems. Because of this, the method has been deprecated.

As of version 16.3, the recommended way to update `state` in response to `props` changes is with the new `static getDerivedStateFromProps` lifecycle. (That lifecycle is called when a component is created and each time it receives new props.):
`embed:update-on-async-rendering/updating-state-from-props-after.js`

> Note
>
> The [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat) polyfill enables this new lifecycle to be used with older versions of React as well. [Learn more about how to use it below.](http://localhost:8000/blog/2018/02/07/update-on-async-rendering.html#open-source-project-maintainers)

### Invoking external callbacks

Here is an example of a component that calls an external function when its internal state changes:
`embed:update-on-async-rendering/invoking-external-callbacks-before.js`

Sometimes people use `componentWillUpdate` out of a misplaced fear that by the time `componentDidUpdate` fires, it is "too late" to update the state of other components. This is not the case. React ensures that any `setState` calls that happen during `componentDidMount` and `componentDidUpdate` are flushed before the user sees the updated UI. In general, it is better to avoid cascading updates like this, but in some cases they are necessary (for example, if you need to position a tooltip after measuring the rendered DOM element).

Either way, it is unsafe to use `componentWillUpdate` for this purpose in async mode, because the external callback might get called multiple times for a single update. Instead, the `componentDidUpdate` lifecycle should be used since it is guaranteed to be invoked only once per update:
`embed:update-on-async-rendering/invoking-external-callbacks-after.js`

### Updating external data when `props` change

Here is an example of a component that fetches external data based on `props` values:
`embed:update-on-async-rendering/updating-external-data-when-props-change-before.js`

The recommended upgrade path for this component is to move data-updates into `componentDidUpdate`. You can also use the new `getDerivedStateFromProps` lifecycle to clear stale data before rendering the new props:
`embed:update-on-async-rendering/updating-external-data-when-props-change-after.js`

> Note
>
> If you're using an HTTP library that supports cancellation, like [axios](https://www.npmjs.com/package/axios), then it's simple to cancel an in-progress request when unmounting. For native Promises, you can use an approach like [the one shown here](https://gist.github.com/bvaughn/982ab689a41097237f6e9860db7ca8d6).

### Reading DOM properties before an update

Here is an example of a component that reads a property from the DOM before an update in order to maintain scroll position within a list:
`embed:update-on-async-rendering/react-dom-properties-before-update-before.js`

In the above example, `componentWillUpdate` is used to read the DOM property. However with async rendering, there may be delays between "render" phase lifecycles (like `componentWillUpdate` and `render`) and "commit" phase lifecycles (like `componentDidUpdate`). If the user does something like resize the window during this time, the `scrollHeight` value read from `componentWillUpdate` will be stale.

The solution to this problem is to use the new "commit" phase lifecycle, `getSnapshotBeforeUpdate`. This method gets called _immediately before_ mutations are made (e.g. before the DOM is updated). It can return a value for React to pass as a parameter to `componentDidUpdate`, which gets called _immediately after_ mutations.

The two lifecycles can be used together like this:

`embed:update-on-async-rendering/react-dom-properties-before-update-after.js`

## Other scenarios

While we tried to cover the most common use cases in this post, we recognize that we might have missed some of them. If you are using `componentWillMount`, `componentWillUpdate`, or `componentWillReceiveProps` in ways that aren't covered by this blog post, and aren't sure how to migrate off these legacy lifecycles, please [file a new issue against our documentation](https://github.com/reactjs/reactjs.org/issues/new) with your code examples and as much background information as you can provide. We will update this document with new alternative patterns as they come up.

## Open source project maintainers

Open source maintainers might be wondering what these changes mean for shared components. If you implement the above suggestions, what happens with components that depend on the new static `getDerivedStateFromProps` lifecycle? Do you also have to release a new major version and drop compatibility for React 16.2 and older?

Fortunately, you do not!

In support of version 16.3, we've also created a new NPM package, [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat). This package polyfills components so that the new `getDerivedStateFromProps` lifecycle will also work with older versions of React (0.14.9+).

To use this polyfill, first add it as a dependency to your library:

```bash
# Yarn
yarn add react-lifecycles-compat

# NPM
npm install react-lifecycles-compat --save
```

Next, update your components to use the new static lifecycle, `getDerivedStateFromProps`, as described above.

Lastly, use the polyfill to make your component backwards compatible with older versions of React:
`embed:update-on-async-rendering/using-react-lifecycles-compat.js`