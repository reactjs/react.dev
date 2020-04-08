---
id: create-a-new-react-app
title: Create a New React App
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

Use an integrated toolchain for the best user and developer experience.

This page describes a few popular React toolchains which help with tasks like:

* Scaling to many files and components.
* Using third-party libraries from npm.
* Detecting common mistakes early.
* Live-editing CSS and JS in development.
* Optimizing the output for production.

The toolchains recommended on this page **don't require configuration to get started**.

## You Might Not Need a Toolchain {#you-might-not-need-a-toolchain}

If you don't experience the problems described above or don't feel comfortable using JavaScript tools yet, consider [adding React as a plain `<script>` tag on an HTML page](/docs/add-react-to-a-website.html), optionally [with JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx).

This is also **the easiest way to integrate React into an existing website.** You can always add a larger toolchain if you find it helpful!

## Recommended Toolchains {#recommended-toolchains}

The React team primarily recommends these solutions:

- If you're **learning React** or **creating a new [single-page](/docs/glossary.html#single-page-application) app,** use [Create React App](#create-react-app).
- If you're building a **server-rendered website with Node.js,** try [Next.js](#nextjs).
- If you're building a **static content-oriented website,** try [Gatsby](#gatsby).
- If you're building a **component library** or **integrating with an existing codebase**, try [More Flexible Toolchains](#more-flexible-toolchains).

### Create React App {#create-react-app}

[Create React App](https://github.com/facebookincubator/create-react-app) is a comfortable environment for **learning React**, and is the best way to start building **a new [single-page](/docs/glossary.html#single-page-application) application** in React.

It sets up your development environment so that you can use the latest JavaScript features, provides a nice developer experience, and optimizes your app for production. You’ll need to have [Node >= 8.10 and npm >= 5.6](https://nodejs.org/en/) on your machine. To create a project, run:

```bash
npx create-react-app my-app
cd my-app
npm start
```

>Note
>
>`npx` on the first line is not a typo -- it's a [package runner tool that comes with npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

Create React App doesn't handle backend logic or databases; it just creates a frontend build pipeline, so you can use it with any backend you want. Under the hood, it uses [Babel](https://babeljs.io/) and [webpack](https://webpack.js.org/), but you don't need to know anything about them.

When you're ready to deploy to production, running `npm run build` will create an optimized build of your app in the `build` folder. You can learn more about Create React App [from its README](https://github.com/facebookincubator/create-react-app#create-react-app--) and the [User Guide](https://facebook.github.io/create-react-app/).

### Next.js {#nextjs}

[Next.js](https://nextjs.org/) is a popular and lightweight framework for **static and server‑rendered applications** built with React. It includes **styling and routing solutions** out of the box, and assumes that you're using [Node.js](https://nodejs.org/) as the server environment.

Learn Next.js from [its official guide](https://nextjs.org/learn/).

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) is the best way to create **static websites** with React. It lets you use React components, but outputs pre-rendered HTML and CSS to guarantee the fastest load time.

Learn Gatsby from [its official guide](https://www.gatsbyjs.org/docs/) and a [gallery of starter kits](https://www.gatsbyjs.org/docs/gatsby-starters/).

### More Flexible Toolchains {#more-flexible-toolchains}

The following toolchains offer more flexibility and choice. We recommend them to more experienced users:

- **[Neutrino](https://neutrinojs.org/)** combines the power of [webpack](https://webpack.js.org/) with the simplicity of presets, and includes a preset for [React apps](https://neutrinojs.org/packages/react/) and [React components](https://neutrinojs.org/packages/react-components/).

- **[Parcel](https://parceljs.org/)** is a fast, zero configuration web application bundler that [works with React](https://parceljs.org/recipes.html#react).

- **[Razzle](https://github.com/jaredpalmer/razzle)** is a server-rendering framework that doesn't require any configuration, but offers more flexibility than Next.js.

## Creating a Toolchain from Scratch {#creating-a-toolchain-from-scratch}

A JavaScript build toolchain typically consists of:

* A **package manager**, such as [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/). It lets you take advantage of a vast ecosystem of third-party packages, and easily install or update them.

* A **bundler**, such as [webpack](https://webpack.js.org/) or [Parcel](https://parceljs.org/). It lets you write modular code and bundle it together into small packages to optimize load time.

* A **compiler** such as [Babel](https://babeljs.io/). It lets you write modern JavaScript code that still works in older browsers.

If you prefer to set up your own JavaScript toolchain from scratch, [check out this guide](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) that re-creates some of the Create React App functionality.

Don't forget to ensure your custom toolchain [is correctly set up for production](/docs/optimizing-performance.html#use-the-production-build).
