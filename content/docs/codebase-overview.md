---
id: codebase-overview
title: Codebase Overview
layout: contributing
permalink: docs/codebase-overview.html
prev: how-to-contribute.html
next: implementation-notes.html
redirect_from:
  - "contributing/codebase-overview.html"
---

This section will give you an overview of the React codebase organization, its conventions, and the implementation.

If you want to [contribute to React](/docs/how-to-contribute.html) we hope that this guide will help you feel more comfortable making changes.

We don't necessarily recommend any of these conventions in React apps. Many of them exist for historical reasons and might change with time.

### External Dependencies {#external-dependencies}

React has almost no external dependencies. Usually, a `require()` points to a file in React's own codebase. However, there are a few relatively rare exceptions.

The [fbjs repository](https://github.com/facebook/fbjs) exists because React shares some small utilities with libraries like [Relay](https://github.com/facebook/relay), and we keep them in sync. We don't depend on equivalent small modules in the Node ecosystem because we want Facebook engineers to be able to make changes to them whenever necessary. None of the utilities inside fbjs are considered to be public API, and they are only intended for use by Facebook projects such as React.

### Top-Level Folders {#top-level-folders}

After cloning the [React repository](https://github.com/facebook/react), you will see a few top-level folders in it:

* [`packages`](https://github.com/facebook/react/tree/master/packages) contains metadata (such as `package.json`) and the source code (`src` subdirectory) for all packages in the React repository. **If your change is related to the code, the `src` subdirectory of each package is where you'll spend most of your time.**
* [`fixtures`](https://github.com/facebook/react/tree/master/fixtures) contains a few small React test applications for contributors.
* `build` is the build output of React. It is not in the repository but it will appear in your React clone after you [build it](/docs/how-to-contribute.html#development-workflow) for the first time.

The documentation is hosted [in a separate repository from React](https://github.com/reactjs/reactjs.org).

There are a few other top-level folders but they are mostly used for the tooling and you likely won't ever encounter them when contributing.

### Colocated Tests {#colocated-tests}

We don't have a top-level directory for unit tests. Instead, we put them into a directory called `__tests__` relative to the files that they test.

For example, a test for [`setInnerHTML.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/setInnerHTML.js) is located in [`__tests__/setInnerHTML-test.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/__tests__/setInnerHTML-test.js) right next to it.

### Warnings and Invariants {#warnings-and-invariants}

The React codebase uses the `warning` module to display warnings:

```js
var warning = require('warning');

warning(
  2 + 2 === 4,
  'Math is not working today.'
);
```

**The warning is shown when the `warning` condition is `false`.**

One way to think about it is that the condition should reflect the normal situation rather than the exceptional one.

It is a good idea to avoid spamming the console with duplicate warnings:

```js
var warning = require('warning');

var didWarnAboutMath = false;
if (!didWarnAboutMath) {
  warning(
    2 + 2 === 4,
    'Math is not working today.'
  );
  didWarnAboutMath = true;
}
```

Warnings are only enabled in development. In production, they are completely stripped out. If you need to forbid some code path from executing, use `invariant` module instead:

```js
var invariant = require('invariant');

invariant(
  2 + 2 === 4,
  'You shall not pass!'
);
```

**The invariant is thrown when the `invariant` condition is `false`.**

"Invariant" is just a way of saying "this condition always holds true". You can think about it as making an assertion.

It is important to keep development and production behavior similar, so `invariant` throws both in development and in production. The error messages are automatically replaced with error codes in production to avoid negatively affecting the byte size.

### Development and Production {#development-and-production}

You can use `__DEV__` pseudo-global variable in the codebase to guard development-only blocks of code.

It is inlined during the compile step, and turns into `process.env.NODE_ENV !== 'production'` checks in the CommonJS builds.

For standalone builds, it becomes `true` in the unminified build, and gets completely stripped out with the `if` blocks it guards in the minified build.

```js
if (__DEV__) {
  // This code will only run in development.
}
```

### Flow {#flow}

We recently started introducing [Flow](https://flow.org/) checks to the codebase. Files marked with the `@flow` annotation in the license header comment are being typechecked.

We accept pull requests [adding Flow annotations to existing code](https://github.com/facebook/react/pull/7600/files). Flow annotations look like this:

```js
ReactRef.detachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  // ...
}
```

When possible, new code should use Flow annotations.
You can run `yarn flow` locally to check your code with Flow.

### Dynamic Injection {#dynamic-injection}

React uses dynamic injection in some modules. While it is always explicit, it is still unfortunate because it hinders understanding of the code. The main reason it exists is because React originally only supported DOM as a target. React Native started as a React fork. We had to add dynamic injection to let React Native override some behaviors.

You may see modules declaring their dynamic dependencies like this:

```js
// Dynamically injected
var textComponentClass = null;

// Relies on dynamically injected value
function createInstanceForText(text) {
  return new textComponentClass(text);
}

var ReactHostComponent = {
  createInstanceForText,

  // Provides an opportunity for dynamic injection
  injection: {
    injectTextComponentClass: function(componentClass) {
      textComponentClass = componentClass;
    },
  },
};

module.exports = ReactHostComponent;
```

The `injection` field is not handled specially in any way. But by convention, it means that this module wants to have some (presumably platform-specific) dependencies injected into it at runtime.

There are multiple injection points in the codebase. In the future, we intend to get rid of the dynamic injection mechanism and wire up all the pieces statically during the build.

### Multiple Packages {#multiple-packages}

React is a [monorepo](https://danluu.com/monorepo/). Its repository contains multiple separate packages so that their changes can be coordinated together, and issues live in one place.

### React Core {#react-core}

The "core" of React includes all the [top-level `React` APIs](/docs/top-level-api.html#react), for example:

* `React.createElement()`
* `React.Component`
* `React.Children`

**React core only includes the APIs necessary to define components.** It does not include the [reconciliation](/docs/reconciliation.html) algorithm or any platform-specific code. It is used both by React DOM and React Native components.

The code for React core is located in [`packages/react`](https://github.com/facebook/react/tree/master/packages/react) in the source tree. It is available on npm as the [`react`](https://www.npmjs.com/package/react) package. The corresponding standalone browser build is called `react.js`, and it exports a global called `React`.

### Renderers {#renderers}

React was originally created for the DOM but it was later adapted to also support native platforms with [React Native](https://facebook.github.io/react-native/). This introduced the concept of "renderers" to React internals.

**Renderers manage how a React tree turns into the underlying platform calls.**

Renderers are also located in [`packages/`](https://github.com/facebook/react/tree/master/packages/):

* [React DOM Renderer](https://github.com/facebook/react/tree/master/packages/react-dom) renders React components to the DOM. It implements [top-level `ReactDOM` APIs](/docs/react-dom.html) and is available as [`react-dom`](https://www.npmjs.com/package/react-dom) npm package. It can also be used as standalone browser bundle called `react-dom.js` that exports a `ReactDOM` global.
* [React Native Renderer](https://github.com/facebook/react/tree/master/packages/react-native-renderer) renders React components to native views. It is used internally by React Native.
* [React Test Renderer](https://github.com/facebook/react/tree/master/packages/react-test-renderer) renders React components to JSON trees. It is used by the [Snapshot Testing](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) feature of [Jest](https://facebook.github.io/jest) and is available as [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) npm package.

The only other officially supported renderer is [`react-art`](https://github.com/facebook/react/tree/master/packages/react-art). It used to be in a separate [GitHub repository](https://github.com/reactjs/react-art) but we moved it into the main source tree for now.

>**Note:**
>
>Technically the [`react-native-renderer`](https://github.com/facebook/react/tree/master/packages/react-native-renderer) is a very thin layer that teaches React to interact with React Native implementation. The real platform-specific code managing the native views lives in the [React Native repository](https://github.com/facebook/react-native) together with its components.

### Reconcilers {#reconcilers}

Even vastly different renderers like React DOM and React Native need to share a lot of logic. In particular, the [reconciliation](/docs/reconciliation.html) algorithm should be as similar as possible so that declarative rendering, custom components, state, lifecycle methods, and refs work consistently across platforms.

To solve this, different renderers share some code between them. We call this part of React a "reconciler". When an update such as `setState()` is scheduled, the reconciler calls `render()` on components in the tree and mounts, updates, or unmounts them.

Reconcilers are not packaged separately because they currently have no public API. Instead, they are exclusively used by renderers such as React DOM and React Native.

### Stack Reconciler {#stack-reconciler}

The "stack" reconciler is the implementation powering React 15 and earlier. We have since stopped using it, but it is documented in detail in the [next section](/docs/implementation-notes.html).

### Fiber Reconciler {#fiber-reconciler}

The "fiber" reconciler is a new effort aiming to resolve the problems inherent in the stack reconciler and fix a few long-standing issues. It has been the default reconciler since React 16.

Its main goals are:

* Ability to split interruptible work in chunks.
* Ability to prioritize, rebase and reuse work in progress.
* Ability to yield back and forth between parents and children to support layout in React.
* Ability to return multiple elements from `render()`.
* Better support for error boundaries.

You can read more about React Fiber Architecture [here](https://github.com/acdlite/react-fiber-architecture) and [here](https://blog.ag-grid.com/inside-fiber-an-in-depth-overview-of-the-new-reconciliation-algorithm-in-react). While it has shipped with React 16, the async features are not enabled by default yet.

Its source code is located in [`packages/react-reconciler`](https://github.com/facebook/react/tree/master/packages/react-reconciler).

### Event System {#event-system}

React implements a synthetic event system which is agnostic of the renderers and works both with React DOM and React Native. Its source code is located in [`packages/legacy-events`](https://github.com/facebook/react/tree/master/packages/legacy-events).

There is a [video with a deep code dive into it](https://www.youtube.com/watch?v=dRo_egw7tBc) (66 mins).

### What Next? {#what-next}

Read the [next section](/docs/implementation-notes.html) to learn about the pre-React 16 implementation of reconciler in more detail. We haven't documented the internals of the new reconciler yet.
