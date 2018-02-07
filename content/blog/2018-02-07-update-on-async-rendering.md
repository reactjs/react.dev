---
title: Update on Async Rendering
author: [bvaughn, gaearon]
---

For the past few months, the React team has been experimenting with [asynchronous rendering](/blog/2017/09/26/react-v16.0.html#new-core-architecture), and we are very excited about the new features it enables.

Along the way our research has shown that some of our legacy component lifecycles tend to encourage unsafe coding practices. They are:

* `componentWillMount`
* `componentWillReceiveProps`
* `componentWillUpdate`

Because of this, we are adding an "UNSAFE_" prefix to these lifecycles in a future release. React [follows semantic versioning](/blog/2016/02/19/new-versioning-scheme.html), so the migration path is gradual:

* **16.3**: Introduce aliases for the unsafe lifecycles, `UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps`, and `UNSAFE_componentWillUpdate`. (Both the old lifecycle names and the new aliases will work in this release.)
* **16.4**: Enable deprecation warning for `componentWillMount`, `componentWillReceiveProps`, and `componentWillUpdate`. (Both the old lifecycle names and the new aliases will work in this release.)
* **17.0**: Remove `componentWillMount`, `componentWillReceiveProps`, and `componentWillUpdate` . (Only the new "UNSAFE_" lifecycle names will work in this release.)

In this post, we will explore some of the potential capabilities of async rendering, and we'll outline a migration plan for components that rely on these legacy lifecycles.

## What can asynchronous rendering do?

#### With every new version, our goal is to improve the user experience of apps created with React.

We have been fine-tuning the performance of React with every new release. However, despite what synthetic benchmarks say, we've found that the real bottleneck is generally not React itself, but the application code using it. In order to unlock the next wave of performance optimizations and new features, we need React to be smarter about when to re-render components and flush updates to the screen.

We found that asynchronous rendering can help in several ways. For example:

1. As users navigate within an app, newly displayed components often have asynchronous dependencies (including data, images, and code splitting). This leads to a lot of boilerplate code managing data fetching and displaying the loading states. It can also lead to a "cascade of spinners" as the data loads, causing DOM reflows and janky user experience. We'd like to make it easier for product developers to express asynchronous dependencies of components. React could keep the old UI "alive" and interactive for a certain period while the updated UI is not ready yet, and provide a declarative way to show a loading indicator if it takes more than a second.
2. Fast updates within a short timeframe often cause jank because React processes each update individually. We'd like to automatically "combine" updates within a few hundred milliseconds when possible so that there is less re-rendering.
3. Some updates are inherently less important than others. For example, if you're writing a live-updating search filter input like [this](https://zeit.co/blog/domains-search-web#asynchronous-rendering), it is essential that the input is updated immediately (within a few milliseconds). Re-rendering the result list can be done later, and should not block the thread or cause stutter when typing. It would be nice if React had a way to mark the latter updates as having a lower priority. (Note that even debouncing the input doesn't help because if the rendering is synchronous—like in React today—a keystroke can't interrupt the rendering if it already started. Asynchronous rendering solves this by splitting rendering into small chunks that can be paused and later restarted.)
4. For UI elements like hidden popups and tabs, we'd like to be able to start pre-rendering their content when the browser isn't busy. This way, they can appear instantaneously in response to a later user interaction. However, we don't want to make the initial rendering slower, so it's essential to render such elements lazily ([when the browser is idle](https://developers.google.com/web/updates/2015/08/using-requestidlecallback)).
5. For many apps, React is not the only JavaScript on the page. It often has to coordinate with other JS libraries, server-rendered widgets, and so on. Asynchronous rendering lets React better coordinate with non-React code regarding when components are inserted into the DOM so that [the user experience is smooth](https://twitter.com/acdlite/status/909926793536094209).

Of course, it's possible to implement some of these features today, but it's difficult. We hope to make them effortless by building them into React itself. By replacing problematic lifecycles with safer alternatives, we also hope to make it simple to write async-safe React components.

In the next section, we'll look at how to update your existing components to prepare for the upcoming lifecycle changes.

## Updating class components

#### If you're an application developer, **you don't have to do anything about the deprecated methods yet**. The primary purpose of this update (v16.3) is to enable open source project maintainers to update their libraries in advance of any deprecation warnings. Those warnings will be enabled with the next minor release, v16.4.

However, if you'd like to start using the new component API (or if you're a maintainer looking to update your library in advance) here are a few examples that we hope will help you to start thinking about components a bit differently. Over time, we plan to add additional "recipes" to our documentation that show how to perform common tasks in a way that's async-safe.

### Initializing state

This example shows a component with `setState` calls inside of `componentWillMount`:
`embed:update-on-async-rendering/initializing-state-before.js`

The simplest refactor for this type of component is to move the state-updates to the constructor or to a property initializer, like so:
`embed:update-on-async-rendering/initializing-state-after.js`

### Fetching external data

Here is an example of a component that uses `componentWillMount` to fetch external data::
`embed:update-on-async-rendering/fetching-external-data-before.js`

The above code is problematic for both server rendering (where the external data won't be used) and the upcoming async rendering mode (where the request might be initiated multiple times, or executed unnecessarily).

The upgrade path for this is to move data-fetching into `componentDidMount`:
`embed:update-on-async-rendering/fetching-external-data-after.js`

> Note:
>
> Some advanced use-cases (e.g. libraries like Relay) may want to experiment with eagerly prefetching async data. An example of how this can be done is available [here](https://gist.github.com/bvaughn/89700e525ff423a75ffb63b1b1e30a8f).

### Adding event listeners (or subscriptions)

Here is an example of a component that subscribes to an external event dispatcher when mounting:
`embed:update-on-async-rendering/adding-event-listeners-before.js`

Unfortunately, this can cause memory leaks for server rendering (where `componentWillUnmount` will never be called) and async rendering (where rendering might be interrupted before it completes, causing `componentWillUnmount` not to be called).

People often assume that `componentWillMount` and `componentWillUnmount` are paired, but that is not guaranteed. Only once `componentDidMount` has been called does React guarantee that `componentWillUnmount` will later be called for clean up.

For this reason, the recommended way to add listeners/subscriptions is to use the `componentDidMount` lifecycle:
`embed:update-on-async-rendering/adding-event-listeners-after.js`

### Updating `state` based on `props`

Here is an example of a component that uses the legacy `componentWillReceiveProps` lifecycle to update `state` based on new `props` values:
`embed:update-on-async-rendering/updating-state-from-props-before.js`

Although the above code is not problematic in itself, the `componentWillReceiveProps` lifecycle is often mis-used in ways that _do_ present problems. Because of this, the method has been deprecated.

As of version 16.3, the recommended way to update `state` in response to `props` changes is using the new `static getDerivedStateFromProps` lifecycle:
`embed:update-on-async-rendering/updating-state-from-props-after.js`

> Note:
>
> The [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat) polyfill allows this new lifecycle to be used with older versions of React as well. This can be helpful if you're writing a shared component that is intended for use with multiple versions of React.

### Invoking external callbacks

Here is an example of a component that calls an external function when its internal state changes:
`embed:update-on-async-rendering/invoking-external-callbacks-before.js`

Sometimes people use `componentWillUpdate` out of a misplaced fear that by the time `componentDidUpdate` fires, it is "too late" to update the state of other components. This is not the case. React ensures that any `setState` calls that happen during `componentDidMount` and `componentDidUpdate` are flushed before the user sees the updated UI. In general, it is better to avoid cascading updates like this, but in some cases they are unavoidable (for example, if you need to position a tooltip after measuring the rendered DOM element).

Either way, it is unsafe to use `componentWillUpdate` for this purpose in async mode, because the external callback might get called multiple times for a single update. Instead, the `componentDidUpdate` lifecycle should be used since it is guaranteed to be invoked only once per update:
`embed:update-on-async-rendering/invoking-external-callbacks-after.js`

## Other scenarios

While we tried to cover the most common use cases in this post, we recognize that we might have missed some of them. If you are using `componentWillMount`, `componentWillUpdate`, or `componentWillReceiveProps` in ways that aren't covered by this blog post, and aren't sure how to migrate off these legacy lifecycles, please [file a new issue against our documentation](https://github.com/reactjs/reactjs.org/issues/new) with your code examples and as much background information as you can provide. We will update this document with new alternative patterns as they come up.

## Open source project maintainers

Open source maintainers might be wondering what these changes mean for shared components. If you implement the above suggestions, what happens with components that depend on the new static `getDerivedStateFromProps` lifecycle? Do you also have to release a new major version and drop compatibility for React 16.2 and older?

Fortunately, you do not!

Along with the release of 16.3, we've also released a new NPM package, [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat). This package polyfills components so that the new `getDerivedStateFromProps` lifecycle will also work with older versions of React (0.14.9+).

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