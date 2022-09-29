---
title: Start a New React Project
---

<Intro>

If you're starting a new project, we recommend to use a toolchain or a framework. These tools provide a comfortable development environment but require a local Node.js installation.

</Intro>

<YouWillLearn>

* How toolchains are different from frameworks
* How to start a project with a minimal toolchain
* How to start a project with a fully-featured framework
* What's inside popular toolchains and frameworks

</YouWillLearn>

## Choose your own adventure {/*choose-your-own-adventure*/}

React is a library that lets you organize UI code by breaking it apart into pieces called components. React doesn't take care of routing or data management. This means there are several ways to start a new React project:

* [Start with an **HTML file and a script tag.**](/learn/add-react-to-a-website) This doesn't require Node.js setup but offers limited features.
* Start with a **minimal toolchain,** adding more features to your project as you go. (Great for learning!)
* Start with an **opinionated framework** that has common features like data fetching and routing built-in.

## Getting started with a minimal toolchain {/*getting-started-with-a-minimal-toolchain*/}

If you're **learning React,** we recommend [Create React App.](https://create-react-app.dev/) It is the most popular way to try out React and build a new single-page, client-side application. It's made for React but isn't opinionated about routing or data fetching.

First, install [Node.js.](https://nodejs.org/en/) Then open your terminal and run this line to create a project:

<TerminalBlock>

npx create-react-app my-app

</TerminalBlock>

Now you can run your app with:

<TerminalBlock>

cd my-app
npm start

</TerminalBlock>

For more information, [check out the official guide.](https://create-react-app.dev/docs/getting-started)

> Create React App doesn't handle backend logic or databases. You can use it with any backend. When you build a project, you'll get a folder with static HTML, CSS and JS. Because Create React App can't take advantage of the server, it doesn't provide the best performance. If you're looking for faster loading times and built-in features like routing and server-side logic, we recommend using a framework instead.

### Popular alternatives {/*toolkit-popular-alternatives*/}

* [Vite](https://vitejs.dev/guide/)
* [Parcel](https://parceljs.org/getting-started/webapp/)

## Building with a full-featured framework {/*building-with-a-full-featured-framework*/}

If you're looking to **start a production-ready project,** [Next.js](https://nextjs.org/) is a great place to start. Next.js is a popular, lightweight framework for static and server‑rendered applications built with React. It comes pre-packaged with features like routing, styling, and server-side rendering, getting your project up and running quickly. 

The [Next.js Foundations](https://nextjs.org/learn/foundations/about-nextjs) tutorial is a great introduction to building with React and Next.js.

### Popular alternatives {/*framework-popular-alternatives*/}

* [Gatsby](https://www.gatsbyjs.org/)
* [Remix](https://remix.run/)
* [Razzle](https://razzlejs.org/)

## Custom toolchains {/*custom-toolchains*/}

You may prefer to create and configure your own toolchain. A toolchain typically consists of:

* A **package manager** lets you install, update, and manage third-party packages. Popular package managers: [npm](https://www.npmjs.com/) (built into Node.js), [Yarn](https://yarnpkg.com/), [pnpm.](https://pnpm.io/)
* A **compiler** lets you compile modern language features and additional syntax like JSX or type annotations for the browsers. Popular compilers: [Babel](https://babeljs.io/), [TypeScript](https://www.typescriptlang.org/), [swc.](https://swc.rs/)
* A **bundler** lets you write modular code and bundle it together into small packages to optimize load time. Popular bundlers: [webpack](https://webpack.js.org/), [Parcel](https://parceljs.org/), [esbuild](https://esbuild.github.io/), [swc.](https://swc.rs/)
* A **minifier** makes your code more compact so that it loads faster. Popular minifiers: [Terser](https://terser.org/), [swc.](https://swc.rs/)
* A **server** handles server requests so that you can render components to HTML. Popular servers: [Express.](https://expressjs.com/)
* A **linter** checks your code for common mistakes. Popular linters: [ESLint.](https://eslint.org/)
* A **test runner** lets you run tests against your code. Popular test runners: [Jest.](https://jestjs.io/)

If you prefer to set up your own JavaScript toolchain from scratch, [check out this guide](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) that re-creates some of the Create React App functionality. A framework will usually also provide a routing and a data fetching solution. In a larger project, you might also want to manage multiple packages in a single repository with a tool like [Nx](https://nx.dev/react) or [Turborepo.](https://turborepo.org/)

