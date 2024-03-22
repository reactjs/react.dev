---
title: Getting Started
---

<Intro>
TODO
</Intro>

<YouWillLearn>

* General philosophy of the alpha (no node_modules, focus on apps first, libraries later)
* Running the healthcheck script
* Expectations
* Tradeoffs (bundle size, memory)

</YouWillLearn>

## Understanding the React Compiler {/*understanding-the-react-compiler*/}

React Compiler is an optimizing compiler that optimizes your components and hooks. It is a single-file compiler, meaning that it only looks at the contents of a single file in order to perform its optimization.

The compiler was designed to understand JavaScript as it was originally written – meaning before the code has been through any other transform or compile step. It can also understand TypeScript and Flow syntax, but it won't preserve those types after it outputs the compiled code.

TODO explain why we don't compile node_modules

## How does the compiler make my app faster? {/*how-does-the-compiler-make-my-app-faster*/}

It works by bounding re-renders.

TODO Explain what a cascading render is and why it's bad for perf.

TODO diagrams
* Diagram of an component tree
* Show rerendering a tree with compiler on and off

The compiler builds up an understanding of which values need to be memoized in order to prevent cascading renders. Not every value used inside of a component or hook will be memoized.

When thinking about where the compiler can have the most impact, we tend to see the biggest differences in components higher up in the tree that have large children trees. If you prevent a parent component high up in the tree from re-rendering, it'll stop that cascading render.

For that reason, ...

* focus on product code first
* can also try on your internal component libraries

## Using the compiler effectively {/*using-the-compiler-effectively*/}
The compiler is designed to compile functional components and hooks that follows the [Rules of React](/reference/rules). It can also handle code that breaks those rules by bailing out (skipping over) those components or hooks.

To adopt the compiler successfully, we recommend running it on a small directory in your product code first. You can do by configuring the compiler to only run on a list of glob patterns:

```js
// .babel.config.js

module.exports = function () {
  const ReactCompilerConfig = {
    includes: ['src/app/**/*.tsx'],
  };
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig,
      // ...
    ],
  };
};
```
