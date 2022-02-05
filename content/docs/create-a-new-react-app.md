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

- If you're building a **static or server-rendered application,** use [Next.js](#nextjs).
- If you're building a **static content-oriented website,** use [Gatsby](#gatsby).
- If you're building a **[single-page app](/docs/glossary.html#single-page-application)**, use [Create React App](#create-react-app).
- If you're building a **component library** or **integrating with an existing codebase**, try [More Flexible Toolchains](#more-flexible-toolchains).

### Next.js {#nextjs}

[Next.js](https://nextjs.org/) is a framework for **static and server‑rendered applications** built with React. It includes **styling and routing solutions** out of the box and uses [Node.js](https://nodejs.org/) as the server environment.

Learn Next.js from [its official guide](https://nextjs.org/learn/).

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) is a framework for creating **static websites** with React. It lets you use React components, but outputs pre-rendered HTML and CSS to guarantee the fastest load time.

Learn Gatsby from [its official guide](https://www.gatsbyjs.org/docs/) and a [gallery of starter kits](https://www.gatsbyjs.org/docs/gatsby-starters/).

### Create React App {#create-react-app}

[Create React App](https://github.com/facebookincubator/create-react-app) is framework for **small, [single-page](/docs/glossary.html#single-page-application) applications** in React.

Learn Create React App from [its official guide](https://create-react-app.dev/).

### More Flexible Toolchains {#more-flexible-toolchains}

The following toolchains offer more flexibility and choice. We recommend them to more experienced users:

- **[Neutrino](https://neutrinojs.org/)** combines the power of [webpack](https://webpack.js.org/) with the simplicity of presets, and includes a preset for [React apps](https://neutrinojs.org/packages/react/) and [React components](https://neutrinojs.org/packages/react-components/).

- **[Nx](https://nx.dev/react)** is a toolkit for full-stack monorepo development, with built-in support for React, Next.js, [Express](https://expressjs.com/), and more.

- **[Parcel](https://parceljs.org/)** is a fast, zero configuration web application bundler that [works with React](https://parceljs.org/recipes/react/).

- **[Razzle](https://github.com/jaredpalmer/razzle)** is a server-rendering framework that doesn't require any configuration, but offers more flexibility than Next.js.

- **[Vite](https://vitejs.dev/)** is a build tool that aims to provide a faster and leaner development experience for modern web projects.

## Creating a Toolchain from Scratch {#creating-a-toolchain-from-scratch}

A JavaScript build toolchain typically consists of:

* A **package manager**, such as [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/). It lets you take advantage of a vast ecosystem of third-party packages, and easily install or update them.

* A **bundler**, such as [webpack](https://webpack.js.org/) or [Parcel](https://parceljs.org/). It lets you write modular code and bundle it together into small packages to optimize load time.

* A **compiler** such as [Babel](https://babeljs.io/). It lets you write modern JavaScript code that still works in older browsers.

If you prefer to set up your own JavaScript toolchain from scratch, [check out this guide](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) that re-creates some of the Create React App functionality.

Don't forget to ensure your custom toolchain [is correctly set up for production](/docs/optimizing-performance.html#use-the-production-build).
