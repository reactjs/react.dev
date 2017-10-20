---
id: static-type-checking
title: Static Type Checking
permalink: docs/static-type-checking.html
prev: typechecking-with-prototypes.html
next: refs-and-the-dom.html
---

As your app grows, you can catch and eliminate an entire category of bugs with static typechecking. You can use JavaScript extensions like [Flow](https://flowtype.org/) or [TypeScript](https://www.typescriptlang.org/) to statically typecheck your whole application. In complex applications, we recommend to use Flow or TypeScript for typechecking instead of typechecking with PropTypes.

## Using Flow with React

For trying out Flow, use this [playground](https://flow.org/try/).

Flow and [Babel](http://babeljs.io/) work well together, so it doesn’t take much to adopt Flow as a React user who already uses Babel.

### With babel

Flow and Babel are designed to work great together. It takes just a few steps to set them up together.

If you don’t have Babel setup already, you can do that by following [this guide](http://babeljs.io/docs/setup/).

Once you have Babel setup, install `babel-preset-flow` with either [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/).

```bash
yarn add --dev babel-preset-flow
# or
npm install --save-dev bebel-preset-flow
```

Then add `flow` to your Babel presets config.

```
{
  "presets": ["flow"]
}
```

### With Create React App

[Create React App](https://github.com/facebookincubator/create-react-app) already supports Flow by default. Just [install Flow](https://flow.org/en/docs/install/) and create a `.flowconfig` file by running `flow init`.

```bash
create-react-app my-app && cd my-app
yarn add --dev flow-bin
yarn run flow init
```

Flow will be run as part of create-react-app’s scripts.

## Using TypeScript with React

For a fast dive into TypeScript, go [here](https://www.typescriptlang.org/play/).

### With Create React App

All you need to do is:

```
create-react-app my-app --scripts-version=react-scripts-ts
```

[react-scripts-ts](https://www.npmjs.com/package/react-scripts-ts) is a set of adjustments to take the standard create-react-app project pipeline and bring TypeScript into the mix.

You can also try [typescript-react-starter](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).