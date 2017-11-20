---
id: static-type-checking
title: Static Type Checking
permalink: docs/static-type-checking.html
prev: typechecking-with-prototypes.html
next: refs-and-the-dom.html
---

Static type checkers like [Flow](https://flowtype.org/) and [TypeScript](https://www.typescriptlang.org/) identify certain types of problems before you even run your code. They can also improve developer workflow by adding features like auto-completion. For this reason, we recommend using Flow or TypeScript instead of `PropTypes` for larger code bases.

## Flow

[Flow](https://flow.org/) is a static type checker for your JavaScript code. It is developed at Facebook and is often used with React. It lets you annotate the variables, functions, and React components with a special type syntax, and catch mistakes early. You can read an [introduction to Flow](https://flow.org/en/docs/getting-started/) to learn its basics.

To use Flow, you need to:

* Add Flow to your project as a dependency.
* Ensure that Flow syntax is stripped from the compiled code.
* Add type annotations and run Flow to check them.

We will explain these steps below in detail.

### Adding Flow to a Project

First, navigate to your project directory in the terminal. You will need to run two commands.

If you use [Yarn](https://yarnpkg.com/), run:

```bash
yarn add --dev flow-bin
yarn run flow init
```

If you use [npm](https://www.npmjs.com/), run:

```bash
npm install --save-dev flow-bin
npm run flow init
```

The first command installs the latest version of Flow into your project. The second command creates a Flow configuration file that you will need to commit.

Finally, add `flow` to the `"scripts"` section of your `package.json`:

```js{4}
{
  // ...
  "scripts": {
    "flow": "flow",
    // ...
  },
  // ...
}
```

### Stripping Flow Syntax from the Compiled Code

Flow extends the JavaScript language with a special syntax for type annotations. However, browsers aren't aware of this syntax, so we need to make sure it doesn't end up in the compiled JavaScript bundle that is sent to the browser.

The exact way to do this depends on the tools you use to compile JavaScript.

#### Create React App

If your project was set up using [Create React App](https://github.com/facebookincubator/create-react-app), congratulations! The Flow annotations are already being stripped by default so you don't need to do anything else in this step.

#### Babel

>Note:
>
>These instructions are *not* for Create React App users. Even though Create React App uses Babel under the hood, it is already configured to understand Flow. Only follow this step if you *don't* use Create React App.

If you manually configured Babel for your project, you will need to install a special preset for Flow.

If you use Yarn, run:

```bash
yarn add --dev babel-preset-flow
```

If you use npm, run:

```bash
npm install --save-dev babel-preset-flow
```

Then add the `flow` preset to your [Babel configuration](http://babeljs.io/docs/usage/babelrc/). For example, if you configure Babel through `.babelrc` file, it could look like this:

```js{3}
{
  "presets": [
    "flow",
    "react"
  ]
}
```

This will let you use the Flow syntax in your code.

>Note:
>
>Flow does not require the `react` preset, but they are often used together. Flow itself understands JSX syntax out of the box.

#### Other Build Setups

If you don't use either Create React App or Babel, you can use [flow-remove-types](https://github.com/flowtype/flow-remove-types) to strip the type annotations.

### Running Flow

If you followed the instructions above, you should be able to run Flow for the first time.

```bash
yarn flow
```

If you use npm, run:

```bash
npm run flow
```

You should see a message like:

```
No errors!
✨  Done in 0.17s.
```

### Adding Flow Type Annotations

By default, Flow only checks the files that include this annotation:

```js
// @flow
```

Typically it is placed at the top of a file. Try adding it to some files in your project and run `yarn flow` or `npm run flow` to see if Flow already found any issues.

There is also [an option](https://flow.org/en/docs/config/options/#toc-all-boolean) to force Flow to check *all* files regardless of the annotation. This can be too noisy for existing projects, but is reasonable for a new project if you want to fully type it with Flow.

Now you're all set! We recommend to check out the following resources to learn more about Flow:

* [Flow Documentation: Type Annotations](https://flow.org/en/docs/types/)
* [Flow Documentation: Editors](https://flow.org/en/docs/editors/)
* [Flow Documentation: React](https://flow.org/en/docs/react/)
* [Linting in Flow](https://medium.com/flow-type/linting-in-flow-7709d7a7e969)

## TypeScript

[TypeScript](https://www.typescriptlang.org/) is a programming language developed by Microsoft. It is a typed superset of JavaScript, and includes its own compiler.

You can learn more about using TypeScript with React [here](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).

### Using TypeScript with Create React App

[react-scripts-ts](https://www.npmjs.com/package/react-scripts-ts) automatically configures a `create-react-app` project to support TypeScript. You can use it like this:

```bash
create-react-app my-app --scripts-version=react-scripts-ts
```

Note that it is a **third party** project, and is not a part of Create React App.

You can also try [typescript-react-starter](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).

## Reason

[Reason](https://reasonml.github.io/) is not a new language; it's a new syntax and toolchain powered by the battle-tested language, [OCaml](http://ocaml.org/). Reason gives OCaml a familiar syntax geared toward JavaScript programmers, and caters to the existing NPM/Yarn workflow folks already know.

Reason is developed at Facebook, and is used in some of its products like Messenger. It is still somewhat experimental but it has [dedicated React bindings](https://reasonml.github.io/reason-react/) maintained by Facebook and a [vibrant community](https://reasonml.github.io/community/).

## Other Languages

Note there are other statically typed languages that compile to JavaScript and are thus React compatible. For example, [F#/Fable](http://fable.io) with [elmish-react](https://fable-elmish.github.io/react). Check out their respective sites for more information, and feel free to add more statically typed languages that work with React to this page!
