---
title: "Fragments in React v16.2"
author: [clemmy]
---

Today, we're excited to bring the new `Fragment` export to React, which allows users to render **static** fragments without the unnecessary keying of each element in the fragment!

```jsx
render() {
  return (
    <>
      <li>Look ma</li>
      <li>no keys!</li>
    </>
  );
}
```

### Why Fragments?

When React released version 16, the ability to render an array of elements from a component's `render` method was added. This allowed developers to prevent extraneous markup with `div`s that pollute the HTML. However, it was inconvenient because every element in the array had to be explicitly keyed. Previously, in order to render an array of elements, the following code would be necessary:

```jsx
render() {
  return [
    <span key="first-span">I am</span>,
    <span key="second-span">static</span>
  ];
}
```

However, the keys are only necessary for React's reconciliation algorithm when child elements are re-arranged and React needs to figure out which item in one render corresponds to in a subsequent render. If the array is static, then keys aren't necessary and only add extra noise to the code. So, let's omit them:

```jsx
render() {
  return [
    <span>I am</span>,
    <span>static</span>
  ];
}
```

But React gives a key warning with the above code! This is because React doesn't know whether the array items can ever rearrange. With fragment syntax, it is clear that the code's intent is to render a static list of children, and not a developer mistake:

```jsx
render() {
  return (
    <>
      <span>I am</span>
      <span>static</span>
    </>
  );
}
```

#### The Syntax

Inspired by some prior art such as the `XMLList() <></>` constructor in [E4X](https://developer.mozilla.org/en-US/docs/Archive/Web/E4X/E4X_for_templating) and the existing `<></>` syntax in [Reason React](https://reasonml.github.io/reason-react/), the React team concluded on having a convenient syntax for JSX fragments that looks like `<>...</>`. This captures the idea of a fragment: It is a pair of empty tags which enforces the notion that it won't render to an actual element in the DOM.

The `<></>` syntax also makes it easier to refactor since it looks just like a JSX element. For example, consider swapping the parents in the following code snippets:

```jsx
// with a parent wrapper
<div>
  <span>foo</span>
  bar
  <span>baz</span>
</div>

// with arrays (where commas are necessary and text needs to be surrounded by quotes)
[
  <span>foo</span>,
  'bar',
  <span>baz</span>
]

// with jsx fragment syntax
<>
  <span>foo</span>
  bar
  <span>baz</span>
</>
```

#### The Export

After the release of React 16, people in the React community have created solutions in order to address the problem of static lists, such as [react-aux](https://github.com/gajus/react-aux). For `Fragment`s however, the React team has decided to take ownership of the export, since there are some semantics specific to Fragments that aren't possible without core library changes. These changes have some performance wins and make reconciliation a bit more intuitive.

[For the curious, you can read more about that here.](https://github.com/facebook/react/pull/10783)

Still, we are very thankful to the open source contributors who worked on solving this in the ecosystem.

Additionally, there is a [pragma option available in babel-plugin-transform-react-jsx](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx#pragmafrag) that allows the Babel compiler to de-sugar the `<>...</>` syntax to a custom identifier.

### Example Usages

As mentioned above, the most common way to use fragments in React is to simply use `<></>` tags. Generally, in the Javascript compiler phase of your build pipeline, the `<>...</>` will be de-sugared into a `createElement` call with `React.Fragment` as the type.

Take a look at the section on [How to Use it](#how-to-use-it) to see how to update your tooling to support JSX fragments.

#### With Attributes and Keys

Note that with the `<></>` syntax, attributes are not allowed to be passed. We made the decision to disallow attributes with fragments since they're semantically different from React elements. However, a fragment can be keyed by using the explicit fragment syntax:

```jsx
import { Fragment } from 'react';

<Fragment key="my-key">
  <span>Happy</span>
  <span>Thanksgiving!</span>
</Fragment>
```

In the future, `Fragment` may also support more attributes, such as event handlers.

### Live Demo

You can experiment with JSX fragment syntax on this [CodePen](#) using [React v16.2.0](https://github.com/facebook/react/releases/tag/v16.2.0) and [Babel v7](https://github.com/babel/babel).

### How to Use it

JSX fragments are still very new and some tools in the ecosystem may not be ready for it yet, so please be patient! However, we've tried our best to make it as simple as possible to upgrade from several popular toolchains:

#### Create React App

There will be an beta release for `create-react-app` users at [v1.1-beta](https://github.com/facebookincubator/create-react-app/releases/tag/v1.1.0-beta), where adventurous users can experiment with JSX fragment syntax.

#### Babel

Support for JSX fragments are available in [Babel v7.0.0-beta.31](https://github.com/babel/babel/releases/tag/v7.0.0-beta.31)! If you are already on Babel 7, then simply update to the latest Babel and plugin transform with

```
yarn upgrade @babel/core @babel/plugin-transform-react-jsx # for yarn users
npm update @babel/core @babel/plugin-transform-react-jsx # for npm users
```

or if you are using the [react preset](https://www.npmjs.com/package/@babel/preset-react):

```
yarn upgrade @babel/core @babel/preset-react # for yarn users
npm update @babel/core @babel/preset-react # for npm users
```

If you are using Babel with [Webpack](https://webpack.js.org/), then no additional steps need to be done because [babel-loader](https://github.com/babel/babel-loader) will be using your peer-installed version of Babel.

Unfortunately, support for Babel 6.x is not available, and there are currently no plans to back-port.

#### Typescript

For Typescript users, please upgrade to [version 2.6.2](https://github.com/Microsoft/TypeScript/releases/tag/v2.6.2). Note that this is important even if you are already on version 2.6.1, since support was added in 2.6.2.

Upgrade to the latest with the command

```
yarn upgrade typescript # for yarn users
npm update typescript # for npm users
```

Also, editors may complain about errors in `.tsx` and `.js/.jsx` files using the new syntax. These errors can be safely ignored, or configured for [VS Code](https://code.visualstudio.com/Docs/languages/typescript#_using-newer-typescript-versions) and [Sublime Text](https://github.com/Microsoft/TypeScript-Sublime-Plugin/#note-using-different-versions-of-typescript).

#### Flow

[Flow](https://flow.org/) support for JSX fragments is available starting in [version 0.59](https://github.com/facebook/flow/releases/tag/v0.59.0). Simply run

```
yarn upgrade flow-bin # for yarn users
npm update flow-bin # for npm users
```

to update Flow to the latest version.

#### Others

For other tools, please check with the corresponding documentation to check if there is support available. However, it's not a problem at all if you want the functionality of `<></>` without your linters and tooling complaining! You can always start with `<Fragment></Fragment>` and do a code-mod later to replace it with `<></>` when the appropriate support is available.

### Acknowledgments

This release was made possible thanks to the core team and our open source contributors. A big thanks to everyone who filed issues, contributed to syntax discussions, reviewed pull requests, added support for JSX fragments in third party libraries, and more!

Also, special thanks to the [Typescript](https://www.typescriptlang.org/) and [Flow](https://flow.org/) teams, as well as the [Babel](https://babeljs.io/) maintainers, who helped make tooling support for the new syntax go seamlessly.
