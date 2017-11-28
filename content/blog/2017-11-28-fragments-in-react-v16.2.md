---
title: "Fragments in React v16.2"
author: [clemmy]
---

Today, we're excited to improved support for fragments in React! We are introducing a new `Fragment` export, which allows
which allows users to render *static* fragments using familiar JSX element syntax.

```jsx
import React, { Fragment } from 'react';

render() {
  return (
    <Fragment>
      <li>Look ma</li>
      <li>a list!</li>
    </Fragment>
  );
}
```

We've also included a new short syntax that is already supported by [some tools](#tooling-support):

```jsx
render() {
  return (
    <>
      <li>Look ma</li>
      <li>a list!</li>
    </>
  );
}
```

### Why Fragments?

React 16 added the [ability to return an array of elements from a component's `render` method](https://reactjs.org/blog/2017/09/26/react-v16.0.html#new-render-return-types-fragments-and-strings). This allowed developers to prevent extraneous markup with `div`s that pollute the DOM. However, it was inconvenient for users who were writing static JSX because the syntax is completely different from how they would usually write JSX:

```jsx
render() {
  // keys and commas are needed when returning an array in a render
  return [
    <span key="first-span">I am</span>,
    <span key="second-span">static</span>
  ];
}
```

So, we added the `Fragment` component to React! `Fragment`s let developers return multiple elements from `render` methods using a familiar syntax that resembles normal JSX elements:

```jsx
import React, { Fragment } from 'react';

render() {
  // keys and commas are no longer needed
  return <Fragment>
    <span>I am</span>
    <span>static</span>
  </Fragment>;
}
```

We anticipate that the above will be a common use case, so we added a shorthand syntax for it:

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

We are very thankful to [Gajus Kuizinas](https://github.com/gajus/) and other contributors who prototyped this in open source.

Additionally, there is a [pragma option available in babel-plugin-transform-react-jsx](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx#pragmafrag) that allows the Babel compiler to de-sugar the `<>...</>` syntax to a custom identifier.

### Usage

As mentioned above, the most common way to use fragments in React is to simply use `<></>` tags. Generally, in the Javascript compiler phase of your build pipeline, the `<>...</>` will be de-sugared into a `createElement` call with `React.Fragment` as the type.

Take a look at the section on [tooling support](#tooling-support) to see how to update your tooling to support JSX fragments.

#### With Attributes and Keys

Note that the `<></>` syntax does not allow attributes on fragments. We made the decision to disallow attributes with fragments since they're semantically different from React elements. However, a fragment can be keyed by using the explicit fragment syntax. A common use case for this is grouping an item list into pairs:

```jsx
import React, { Fragment } from 'react';

items.map(item => (
  <Fragment key="item.key">
    <li>{item.title}</li>
    <li>{item.description}</li>
  </Fragment>
))
```

In the future, `Fragment` may also support more attributes, such as event handlers.

### Live Demo

You can experiment with JSX fragment syntax on this [CodePen](#) using [React v16.2.0](https://github.com/facebook/react/releases/tag/v16.2.0) and [Babel v7](https://github.com/babel/babel).

### Tooling Support

JSX fragments are still very new and many tools in the ecosystem may not be ready for it yet, so please be patient! We've tried our best to make it as simple as possible to upgrade from several popular toolchains:

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

Unfortunately, support for Babel 6.x is not available, and there are currently no plans to backport.

#### TypeScript

For TypeScript users, please upgrade to [version 2.6.2](https://github.com/Microsoft/TypeScript/releases/tag/v2.6.2). Note that this is important even if you are already on version 2.6.1, since support was added in 2.6.2.

Upgrade to the latest with the command

```
yarn upgrade typescript # for yarn users
npm update typescript # for npm users
```

Also, editors may complain about errors in `.tsx` and `.js/.jsx` files using the new syntax. These errors can be safely ignored, but editor support for JSX fragments are already available with updates for [Visual Studio 2015](https://www.microsoft.com/en-us/download/details.aspx?id=48593), [Visual Studio 2017](https://www.microsoft.com/en-us/download/details.aspx?id=55258), and [Sublime Text via Package Control](https://packagecontrol.io/packages/TypeScript).
Visual Studio Code will be updated soon, but [can be configured to use TypeScript 2.6.2 and later](https://code.visualstudio.com/Docs/languages/typescript#_using-newer-typescript-versions).

#### Flow

[Flow](https://flow.org/) support for JSX fragments is available starting in [version 0.59](https://github.com/facebook/flow/releases/tag/v0.59.0). Simply run

```
yarn upgrade flow-bin # for yarn users
npm update flow-bin # for npm users
```

to update Flow to the latest version.

#### Others

For other tools, please check with the corresponding documentation to check if there is support available. However, it's not a problem at all if you want the functionality of `<></>` without your linters and tooling complaining! You can always start with `<Fragment></Fragment>` and do a codemod later to replace it with `<></>` when the appropriate support is available.

### Acknowledgments

This release was made possible thanks to the core team and our open source contributors. A big thanks to everyone who filed issues, contributed to syntax discussions, reviewed pull requests, added support for JSX fragments in third party libraries, and more!

Also, special thanks to the [TypeScript](https://www.typescriptlang.org/) and [Flow](https://flow.org/) teams, as well as the [Babel](https://babeljs.io/) maintainers, who helped make tooling support for the new syntax go seamlessly.
