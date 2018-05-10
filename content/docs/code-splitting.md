---
id: code-splitting
title: Code-Splitting
permalink: docs/code-splitting.html
---

## Bundling

Most React apps will have their files "bundled" using tools like
[Webpack](https://webpack.js.org/) or [Browserify](http://browserify.org/).
Bundling is the process of following imported files and merging them into a
single file: a "bundle". This bundle can then be included on a webpage to load
an entire app at once.

#### Example

**App:**

```js
// app.js
import { add } from './math.js';

console.log(add(16, 26)); // 42
```

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

**Bundle:**

```js
function add(a, b) {
  return a + b;
}

console.log(add(16, 26)); // 42
```

> Note:
>
> Your bundles will end up looking a lot different than this.

If you're using [Create React App](https://github.com/facebookincubator/create-react-app), [Next.js](https://github.com/zeit/next.js/), [Gatsby](https://www.gatsbyjs.org/), or a similar tool, you will have a Webpack setup out of the box to bundle your
app.

If you aren't, you'll need to setup bundling yourself. For example, see the
[Installation](https://webpack.js.org/guides/installation/) and
[Getting Started](https://webpack.js.org/guides/getting-started/) guides on the
Webpack docs.

## Code Splitting

Bundling is great, but as your app grows, your bundle will grow too. Especially
if you are including large third-party libraries. You need to keep an eye on
the code you are including in your bundle so that you don't accidentally make
it so large that your app takes a long time to load.

To avoid winding up with a large bundle, it's good to get ahead of the problem
and start "splitting" your bundle.
 [Code-Splitting](https://webpack.js.org/guides/code-splitting/) is a feature
supported by bundlers like Webpack and Browserify (via
[factor-bundle](https://github.com/browserify/factor-bundle)) which can create
multiple bundles that can be dynamically loaded at runtime.

Code-splitting your app can help you "lazy-load" just the things that are
currently needed by the user, which can dramatically improve the performance of
your app. While you haven't reduced the overall amount of code in your app,
you've avoided loading code that the user may never need, and reduced the amount
of code needed during the initial load.

## `import()`

The best way to introduce code-splitting into your app is through the dynamic
`import()` syntax.

**Before:**

```js
import { add } from './math';

console.log(add(16, 26));
```

**After:**

```js
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

> Note:
>
> The dynamic `import()` syntax is a ECMAScript (JavaScript)
> [proposal](https://github.com/tc39/proposal-dynamic-import) not currently
> part of the language standard. It is expected to be accepted within the
> near future.

When Webpack comes across this syntax, it automatically starts code-splitting
your app. If you're using Create React App, this is already configured for you
and you can [start using it](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#code-splitting) immediately. It's also supported
out of the box in [Next.js](https://github.com/zeit/next.js/#dynamic-import).

If you're setting up Webpack yourself, you'll probably want to read Webpack's
[guide on code splitting](https://webpack.js.org/guides/code-splitting/). Your Webpack config should look vaguely [like this](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

When using [Babel](http://babeljs.io/), you'll need to make sure that Babel can
parse the dynamic import syntax but is not transforming it. For that you will need [babel-plugin-syntax-dynamic-import](https://yarnpkg.com/en/package/babel-plugin-syntax-dynamic-import).

## Libraries

### React Loadable

[React Loadable](https://github.com/thejameskyle/react-loadable) wraps
dynamic imports in a nice, React-friendly API for introducing code
splitting into your app at a given component.

**Before:**

```js
import OtherComponent from './OtherComponent';

const MyComponent = () => (
  <OtherComponent/>
);
```

**After:**

```js
import Loadable from 'react-loadable';

const LoadableOtherComponent = Loadable({
  loader: () => import('./OtherComponent'),
  loading: () => <div>Loading...</div>,
});

const MyComponent = () => (
  <LoadableOtherComponent/>
);
```

React Loadable helps you create
[loading states](https://github.com/thejameskyle/react-loadable#creating-a-great-loading-component),
[error states](https://github.com/thejameskyle/react-loadable#loading-error-states),
[timeouts](https://github.com/thejameskyle/react-loadable#timing-out-when-the-loader-is-taking-too-long),
[preloading](https://github.com/thejameskyle/react-loadable#preloading), and
more. It can even help you [server-side render](https://github.com/thejameskyle/react-loadable#------------server-side-rendering) an app with lots of code-splitting.

## Route-based code splitting

Deciding where in your app to introduce code splitting can be a bit tricky. You
want to make sure you choose places that will split bundles evenly, but won't
disrupt the user experience.

A good place to start is with routes. Most people on the web are used to
page transitions taking some amount of time to load. You also tend to be
re-rendering the entire page at once so your users are unlikely to be
interacting with other elements on the page at the same time.

Here's an example of how to setup route-based code splitting into your app using
libraries like [React Router](https://reacttraining.com/react-router/) and
[React Loadable](https://github.com/thejameskyle/react-loadable).

```js
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';

const Loading = () => <div>Loading...</div>;

const Home = Loadable({
  loader: () => import('./routes/Home'),
  loading: Loading,
});

const About = Loadable({
  loader: () => import('./routes/About'),
  loading: Loading,
});

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
    </Switch>
  </Router>
);
```
