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
> Check out the [Try React](/docs/try-react.html) page if you are looking for lightweight environments to experiment with React.
> The options on this page are designed to help bootstrap single-page applications with linting, testing, bundling, production optimizations, and more.

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

See the Community section for a list of [starter kits](/community/starter-kits.html).

## Advanced

If you prefer to configure a project manually, see [Installing React](/docs/add-react-to-an-existing-app.html#installing-react) in the next section.
