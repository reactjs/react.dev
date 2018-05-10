---
id: hello-world
title: Hello World
permalink: docs/hello-world.html
prev: cdn-links.html
next: introducing-jsx.html
redirect_from:
  - "docs/"
  - "docs/index.html"
  - "docs/getting-started.html"
  - "docs/getting-started-ko-KR.html"
  - "docs/getting-started-zh-CN.html"
---

The easiest way to get started with React is to use [this Hello World example code on CodePen](codepen://hello-world). You don't need to install anything; you can just open it in another tab and follow along as we go through examples. If you'd rather use a local development environment, check out the [Installation](/docs/try-react.html) section.

The smallest React example looks like this:

```js
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

It renders a heading saying "Hello, world!" on the page.

The next few sections will gradually introduce you to using React. We will examine the building blocks of React apps: elements and components. Once you master them, you can create complex apps from small reusable pieces.

## A Note on JavaScript

React is a JavaScript library, and so we'll assume you have a basic understanding of the JavaScript language. If you don't feel very confident, we recommend [refreshing your JavaScript knowledge](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) so you can follow along more easily.

We also use some of the ES6 syntax in the examples. We try to use it sparingly because it's still relatively new, but we encourage you to get familiar with [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals), [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), and [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) statements. You can use the [Babel REPL](babel://es5-syntax-example) to check what ES6 code compiles to.
