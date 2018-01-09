---
id: add-react-to-an-existing-app
title: Add React to an Existing Application
permalink: docs/add-react-to-an-existing-app.html
prev: add-react-to-a-new-app.html
next: cdn-links.html
---

You don't need to rewrite your app to start using React.

We recommend adding React to a small part of your application, such as an individual widget, so you can see if it works well for your use case.

While React [can be used](/docs/react-without-es6.html) without a build pipeline, we recommend setting it up so you can be more productive. A modern build pipeline typically consists of:

* A **package manager**, such as [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/). It lets you take advantage of a vast ecosystem of third-party packages, and easily install or update them.
* A **bundler**, such as [webpack](https://webpack.js.org/) or [Browserify](http://browserify.org/). It lets you write modular code and bundle it together into small packages to optimize load time.
* A **compiler** such as [Babel](http://babeljs.io/). It lets you write modern JavaScript code that still works in older browsers.

### Installing React

>**Note:**
>
>Once installed, we strongly recommend setting up a [production build process](/docs/optimizing-performance.html#use-the-production-build) to ensure you're using the fast version of React in production.

We recommend using [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/) for managing front-end dependencies. If you're new to package managers, the [Yarn documentation](https://yarnpkg.com/en/docs/getting-started) is a good place to get started.

To install React with Yarn, run:

```bash
yarn init
yarn add react react-dom
```

To install React with npm, run:

```bash
npm init
npm install --save react react-dom
```

Both Yarn and npm download packages from the [npm registry](http://npmjs.com/).

>  Note:
>
>  To prevent potential incompatibilities, all react packages should use the same version. (This includes `react`, `react-dom`, `react-test-renderer`, etc.)

### Enabling ES6 and JSX

We recommend using React with [Babel](http://babeljs.io/) to let you use ES6 and JSX in your JavaScript code. ES6 is a set of modern JavaScript features that make development easier, and JSX is an extension to the JavaScript language that works nicely with React.

The [Babel setup instructions](https://babeljs.io/docs/setup/) explain how to configure Babel in many different build environments. Make sure you install [`babel-preset-react`](http://babeljs.io/docs/plugins/preset-react/#basic-setup-with-the-cli-) and [`babel-preset-env`](http://babeljs.io/docs/plugins/preset-env/) and enable them in your [`.babelrc` configuration](http://babeljs.io/docs/usage/babelrc/), and you're good to go.

### Hello World with ES6 and JSX

We recommend using a bundler like [webpack](https://webpack.js.org/) or [Browserify](http://browserify.org/), so you can write modular code and bundle it together into small packages to optimize load time.

The smallest React example looks like this:

```js
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

This code renders into a DOM element with the id of `root`, so you need `<div id="root"></div>` somewhere in your HTML file.

Similarly, you can render a React component inside a DOM element somewhere inside your existing app written with any other JavaScript UI library.

[Learn more about integrating React with existing code.](/docs/integrating-with-other-libraries.html#integrating-with-other-view-libraries)

### Development and Production Versions

By default, React includes many helpful warnings. These warnings are very useful in development.

**However, they make the development version of React larger and slower so you should use the production version when you deploy the app.**

Learn [how to tell if your website is serving the right version of React](/docs/optimizing-performance.html#use-the-production-build), and how to configure the production build process most efficiently:

* [Creating a Production Build with Create React App](/docs/optimizing-performance.html#create-react-app)
* [Creating a Production Build with Single-File Builds](/docs/optimizing-performance.html#single-file-builds)
* [Creating a Production Build with Brunch](/docs/optimizing-performance.html#brunch)
* [Creating a Production Build with Browserify](/docs/optimizing-performance.html#browserify)
* [Creating a Production Build with Rollup](/docs/optimizing-performance.html#rollup)
* [Creating a Production Build with webpack](/docs/optimizing-performance.html#webpack)

### Using a CDN

If you don't want to use npm to manage client packages, the `react` and `react-dom` npm packages also provide single-file distributions in `umd` folders. See the [CDN](/docs/cdn-links.html) page for links.
