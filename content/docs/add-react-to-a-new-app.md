---
id: add-react-to-a-new-app
title: Add React to a New Application
permalink: docs/add-react-to-a-new-app.html
prev: try-react.html
next: add-react-to-an-existing-app.html
---

The easiest way to get started on a new React project is by using a starter kit.

> Note:
> 
> This page describes setting up a single-page application with everything you need for a comfortable development workflow, including linting, testing, production optimizations, and more. Full-featured tools like these require some time and disk space to install.
>
>If you are looking for a lightweight environment to experiment with React, check out the [Try React](/docs/try-react.html) page instead. **A [single HTML file](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html) is enough to get you started!**
>
> Finally, if you're not building a single-page application, you can either [add React to your existing build pipeline](/docs/add-react-to-an-existing-app.html) or [use it from CDN](/docs/cdn-links.html) and [without a build step](/docs/react-without-jsx.html).

## Create React App

[Create React App](http://github.com/facebookincubator/create-react-app) is the best way to start building a new React single page application. It sets up your development environment so that you can use the latest JavaScript features, provides a nice developer experience, and optimizes your app for production. You’ll need to have Node >= 6 on your machine.

```bash
npm install -g create-react-app
create-react-app my-app

cd my-app
npm start
```

If you have npm 5.2.0+ installed, you may use [npx](https://www.npmjs.com/package/npx) instead.

```bash
npx create-react-app my-app

cd my-app
npm start
```

Create React App doesn't handle backend logic or databases; it just creates a frontend build pipeline, so you can use it with any backend you want. It uses build tools like [Babel](http://babeljs.io/) and [webpack](https://webpack.js.org/) under the hood, but works with zero configuration.

When you're ready to deploy to production, running `npm run build` will create an optimized build of your app in the `build` folder. You can learn more about Create React App [from its README](https://github.com/facebookincubator/create-react-app#create-react-app-) and the [User Guide](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#table-of-contents).

## Other Starter Kits

We have created [a curated list of third-party starter kits that we officially recommend](/community/starter-kits.html).

They slightly differ in their focus but are all production-ready, well-maintained, and don't require configuration to get started.

You can also check out a list of [other kits](/community/starter-kits.html#other-starter-kits) contributed by the community.

## Advanced

If you prefer to configure a project manually, see [Installing React](/docs/add-react-to-an-existing-app.html#installing-react) in the next section.
