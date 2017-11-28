---
title: "Fragments in React v16.2"
author: [clemmy]
---

React 16.2 is now available! The biggest addition is improved support for returning multiple children from a component's render method. We call this feature *fragments*:

Fragments look like empty JSX tags. They let you group a list of children without adding extra nodes to the DOM:

```js
render() {
  return (
    <>
      <ChildA />
      <ChildB />
      <ChildC />
    </>
  );
}
```

## What Are Fragments?

A common pattern is for a component to return a list of children. An example is rendering some text with a link inside. Take this example HTML:

```html
Text with
<a href="/foo">multiple</a>
<a href="/bar">links</a>
inside it.
```

Prior to version 16, the only way to acheive this in React was by wrapping the children in an extra element, usually a `div` or `span`:

```js
render() {
  return (
    // Extraneous span element :(
    <span>
      Text with
      <a href="/foo">multiple</a>
      <a href="/bar">links</a>
      inside it.
    </span>
  );
}
```

To address this limitation, React 16.0 added support for [returning an array of elements from a component's `render` method](https://reactjs.org/blog/2017/09/26/react-v16.0.html#new-render-return-types-fragments-and-strings). Instead of wrapping the children in a DOM element, you can put them into an array:

```jsx
render() {
 return [
    "Text with",
    <a key="link1" href="/foo">multiple</a>,
    <a key="link2" href="/bar">links</a>,
    "inside it."
 ];
}
```

However, this has some confusing differences from normal JSX:

- Children in an array must be separated by commas.
- Children in an array must have a key to prevent React's [key warning](https://reactjs.org/docs/lists-and-keys.html#keys).
- Strings must be wrapped in quotes.

To provide a more consistent authoring experience for fragments, React now provides a first-class `Fragment` component that can be used in place of arrays.

```jsx{3,8}
render() {
  return (
    <Fragment>
      Text with
      <a href="/foo">multiple</a>
      <a href="/bar">links</a>
      inside it.
    </Fragment>
  );
}
```

You can use `<Fragment />` the same way you'd use any other element, without changing the way you write JSX. No commas, no keys, no quotes.

The Fragment component is available on the main React object:

```js
const Fragment = React.Fragment;

<Fragment>
  <ChildA />
  <ChildB />
  <ChildC />
</Fragment>

// This also works
<React.Fragment>
  <ChildA />
  <ChildB />
  <ChildC />
</React.Fragment>
```

## JSX Fragment Syntax

Fragments are a common pattern in our codebases at Facebook. We anticipate they'll be widely adopted by other teams, too. To make the authoring experience as convenient as possible, we're adding syntactical support for fragments to JSX:

```jsx{3,8}
render() {
  return (
    <>
      Text with
      <a href="/foo">multiple</a>
      <a href="/bar">links</a>
      inside it.
    </>
  );
}
```

In React, this desugars to a `<React.Fragment/>` element, as in the example from the previous section. (Non-React frameworks that use JSX may compile to something different.)

Fragment syntax in JSX was inspired by prior art such as the `XMLList() <></>` constructor in [E4X](https://developer.mozilla.org/en-US/docs/Archive/Web/E4X/E4X_for_templating). Using a pair of empty tags is meant to represent the idea it won't add an actual element to the DOM.

### Keyed Fragments

Note that the `<></>` syntax does not accept attributes, including keys. 

If you need a keyed fragment, you can use `<React.Fragment />` directly. An use case for this is mapping a collection to an array of fragments -- for example, to create a description list:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Without the `key`, React will fire a key warning
        <Fragment key={item.id}>
          <dt>{item.term}</li>
          <dd>{item.description}</li>
        </Fragment>
      )}
    </dl>
  );
}
```

`key` is the only attribute that can be passed to `Fragment`. In the future, we may add support for additional attributes, such as event handlers.

### Live Demo

You can experiment with JSX fragment syntax with this [CodePen](#).

## Support for Fragment Syntax

These additions Support for fragment syntax in JSX will vary depending on the tools you use to build your app. Please be patient as the JSX community works to adopt the new syntax. We've been working closely with maintainers of the most popular projects:

### Create React App

Experimental support for fragment syntax will be added to Create React App within the next few days. A stable release may take a bit longer as we await adoption by upstream projects.

### Babel

Support for JSX fragments is available in [Babel v7.0.0-beta.31](https://github.com/babel/babel/releases/tag/v7.0.0-beta.31) and above! If you are already on Babel 7, simply update to the latest Babel and plugin transform:

```bash
# for yarn users
yarn upgrade @babel/core @babel/plugin-transform-react-jsx
# for npm users
npm update @babel/core @babel/plugin-transform-react-jsx
```

Or if you are using the [react preset](https://www.npmjs.com/package/@babel/preset-react):

```bash
# for yarn users
yarn upgrade @babel/core @babel/preset-react
# for npm users
npm update @babel/core @babel/preset-react
```

Note that Babel 7 is technically still in beta, but a [stable release is coming soon](https://babeljs.io/blog/2017/09/12/planning-for-7.0).

Unfortunately, support for Babel 6.x is not available, and there are currently no plans to backport.

#### Babel with Webpack (babel-loader)

If you are using Babel with [Webpack](https://webpack.js.org/), no additional steps are needed because [babel-loader](https://github.com/babel/babel-loader) will use your peer-installed version of Babel.

#### Babel with Other Frameworks

If you use JSX with a non-React framework like Inferno or Preact, there is a [pragma option available in babel-plugin-transform-react-jsx](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx#pragmafrag) that configures the Babel compiler to de-sugar the `<></>` syntax to a custom identifier.

### TypeScript

TypeScript has full support for fragment syntax! Please upgrade to [version 2.6.2](https://github.com/Microsoft/TypeScript/releases/tag/v2.6.2). (Note that this is important even if you are already on version 2.6.1, since support was added as patch release in 2.6.2.)

Upgrade to the latest TypeScript with the command:

```bash
# for yarn users
yarn upgrade typescript
# for npm users
npm update typescript
```

### Flow

[Flow](https://flow.org/) support for JSX fragments is available starting in [version 0.59](https://github.com/facebook/flow/releases/tag/v0.59.0)! Simply run

```bash
# for yarn users
yarn upgrade flow-bin
# for npm users
npm update flow-bin
```

to update Flow to the latest version.

### Prettier

[Prettier](https://github.com/prettier/prettier) will have support for fragments in their upcoming [1.9 release](https://github.com/prettier/prettier/pull/3237).

### ESLint

JSX Fragments are supported by [ESLint](https://eslint.org/) via [babel-eslint](https://github.com/babel/babel-eslint)! If you are not currently using it, then install it:

```bash
# for yarn users
yarn add eslint@3.x babel-eslint@7
# for npm users
npm install eslint@3.x babel-eslint@7
```

or if you already have it, then upgrade:

```bash
# for yarn users
yarn upgrade eslint@3.x babel-eslint@7
# for npm users
npm update eslint@3.x babel-eslint@7
```

Ensure you have the following line inside your `.babelrc`:

```json
"parser": "babel-eslint"
```

That's it!

### Editor Support

It may take a while for fragment syntax to be supported in your text editor. Please be patient as the community works to adopt the latest changes. In the meantime, you may see errors or inconsistent highlighting if your editor does not yet support fragment syntax. Generally, these errors can be safely ignored.

#### TypeScript Editor Support

If you're a TypeScript user -- great news! Editor support for JSX fragments is already available in [Visual Studio 2015](https://www.microsoft.com/en-us/download/details.aspx?id=48593), [Visual Studio 2017](https://www.microsoft.com/en-us/download/details.aspx?id=55258), and [Sublime Text via Package Control](https://packagecontrol.io/packages/TypeScript). Visual Studio Code will be updated soon, but [can be configured to use TypeScript 2.6.2 and later](https://code.visualstudio.com/Docs/languages/typescript#_using-newer-typescript-versions).

### Other Tools

For other tools, please check with the corresponding documentation to check if there is support available. However, if you're blocked by your tooling, you can always start with using the `<Fragment>` component and perform a codemod later to replace it with the shorthand syntax when the appropriate support is available.

## Installation

React v16.0.0 is available on the npm registry.

To install React 16 with Yarn, run:

```bash
yarn add react@^16.0.0 react-dom@^16.0.0
```

To install React 16 with npm, run:

```bash
npm install --save react@^16.0.0 react-dom@^16.0.0
```

We also provide UMD builds of React via a CDN:

```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
```

Refer to the documentation for [detailed installation instructions](/docs/installation.html).

## Changelog

#### React

* Add Fragment as a named export to React. ([@clemmy](https://github.com/clemmy) in [#10783](https://github.com/facebook/react/pull/10783))

#### React DOM

* Fix regression where radio button onChange events are not fired as expected. ([@landvibe](https://github.com/landvibe) in [#11227](https://github.com/facebook/react/pull/11227))

* Fix incorrectly checked radio buttons when using multiple lists of radio buttons. ([@darth-cheney](https://github.com/darth-cheney) in [#10739](https://github.com/facebook/react/pull/10739))

#### React Test Renderer

* Fix setState callback getting called before component state is updated ([@accordeiro](https://github.com/accordeiro) in [#11507](https://github.com/facebook/react/pull/11507))

## Acknowledgments

This release was made possible by our open source contributors. A big thanks to everyone who filed issues, contributed to syntax discussions, reviewed pull requests, added support for JSX fragments in third party libraries, and more!

Special thanks to the [TypeScript](https://www.typescriptlang.org/) and [Flow](https://flow.org/) teams, as well as the [Babel](https://babeljs.io/) maintainers, who helped make tooling support for the new syntax go seamlessly.

Thanks to [Gajus Kuizinas](https://github.com/gajus/) and other contributors who prototyped the `Fragment` component in open source.
