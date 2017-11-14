---
id: static-type-checking
title: Static Type Checking
permalink: docs/static-type-checking.html
prev: typechecking-with-prototypes.html
next: refs-and-the-dom.html
---

Static type checkers like [Flow](https://flowtype.org/) and [TypeScript](https://www.typescriptlang.org/) identify certain types of problems before you even run your code. They can also improve developer workflow by adding features like auto-completion. For this reason, we recommend using Flow or TypeScript instead of `PropTypes` for larger code bases.

## Flow

Below are instructions to add Flow to your React application. (You can learn more about using Flow with React [here](https://flow.org/en/docs/react/).)

### Using Flow with Babel

First install Babel. If you have not already done this, here is a [helpful setup guide](http://babeljs.io/docs/setup/).

Next install `babel-preset-flow` with either [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/).

```bash
yarn add --dev babel-preset-flow
# or
npm install --save-dev babel-preset-flow
```

Then add `flow` to your Babel presets config in`.babelrc`.

```json
{
  "presets": ["flow"]
}
```

### Using Flow with Create React App

[Create React App](https://github.com/facebookincubator/create-react-app) supports Flow by default. Just [install Flow](https://flow.org/en/docs/install/) and create a `.flowconfig` file by running `flow init`.

```bash
create-react-app my-app
cd my-app
yarn add --dev flow-bin
yarn run flow init
```

Flow will now be run as part of `create-react-app`'s scripts.

## TypeScript

You can learn more about using TypeScript with React [here](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).

### Using TypeScript with Create React App

[react-scripts-ts](https://www.npmjs.com/package/react-scripts-ts) automatically configures a `create-react-app` project to support TypeScript. You can use it like this:

```bash
create-react-app my-app --scripts-version=react-scripts-ts
```

You can also try [typescript-react-starter](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).
