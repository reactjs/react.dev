---
title: Start a New React Project
---

<Intro>

If you're learning React or considering adding it to an existing project, you can get started quickly by [adding React to any HTML page with script tags](/learn/add-react-to-a-website). If your project will need many components and many files, it might be time to consider the options below!

</Intro>

## Choose your own adventure {/*choose-your-own-adventure*/}

React is a library that lets you organize UI code by breaking it apart into pieces called components. React doesn't take care of routing or data management. For these features, you'll want to use third-party libraries or write your own solutions. This means there are several ways to start a new React project:

* Start with a **minimal set up with just a toolchain,** adding features to your project as necessary.
* Start with an **opinionated framework** with common functionality already built in.

Whether you're just getting started, looking to build something big, or want to set up your own toolchain, this guide will set you on the right path.

## Getting started with a React toolchain {/*getting-started-with-a-react-toolchain*/}

If you're just getting started with React, we recommend [Create React App](https://create-react-app.dev/), the most popular way to try out React's features and a great way to build a new single-page, client-side application. Create React App is an unopinionated toolchain configured just for React. Toolchains help with things like:

* Scaling to many files and components
* Using third-party libraries from npm
* Detecting common mistakes early
* Live-editing CSS and JS in development
* Optimizing the output for production

You can get started building with Create React App with one line of code in your terminal! (**Be sure you have [Node.js](https://nodejs.org/) installed!**)

<TerminalBlock>

npx create-react-app my-app

</TerminalBlock>

Now you can run your app with:

<TerminalBlock>

cd my-app
npm start

</TerminalBlock>

For more information, [check out the official guide](https://create-react-app.dev/docs/getting-started).

> Create React App doesn't handle backend logic or databases; it just creates a frontend build pipeline. This means you can use it with any backend you want. But if you're looking for more features like routing and server-side logic, read on!

### Other options {/*other-options*/}

Create React App is great to get started working with React, but if you'd like an even lighter toolchain, you might try one of these other popular toolchains:

* [Vite](https://vitejs.dev/guide/)
* [Parcel](https://parceljs.org/)
* [Snowpack](https://www.snowpack.dev/tutorials/react)

## Building with React and a framework {/*building-with-react-and-a-framework*/}

If you're looking to start a bigger, production-ready project, [Next.js](https://nextjs.org/) is a great place to start. Next.js is a popular, lightweight framework for static and server‑rendered applications built with React. It comes pre-packaged with features like routing, styling, and server-side rendering, getting your project up and running quickly. 

[Get started building with Next.js](https://nextjs.org/docs/getting-started) with the official guide.

### Other options {/*other-options-1*/}

* [Gatsby](https://www.gatsbyjs.org/) lets you generate static websites with React with GraphQL.
* [Razzle](https://razzlejs.org/) is a server-rendering framework that doesn't require any configuration, but offers more flexibility than Next.js.

## Custom toolchains {/*custom-toolchains*/}

You may prefer to create and configure your own toolchain. A JavaScript build toolchain typically consists of:

* A **package manager**—lets you install, updated and manage third-party packages. [Yarn](https://yarnpkg.com/) and [npm](https://www.npmjs.com/) are two popular package managers.
* A **bundler**—lets you write modular code and bundle it together into small packages to optimize load time. [Webpack](https://webpack.js.org/), [Snowpack](https://www.snowpack.dev/), [Parcel](https://parceljs.org/) are several popular bundlers.
* A **compiler**—lets you write modern JavaScript code that still works in older browsers. [Babel](https://babeljs.io/) is one such example.

In a larger project, you might also want to have a tool to manage multiple packages in a single repository. [Nx](https://nx.dev/react) is an example of such a tool.

If you prefer to set up your own JavaScript toolchain from scratch, [check out this guide](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) that re-creates some of the Create React App functionality.
