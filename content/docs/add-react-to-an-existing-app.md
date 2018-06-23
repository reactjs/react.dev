---
id: add-react-to-an-existing-app
title: Add React to an Existing Application
permalink: docs/add-react-to-an-existing-app.html
prev: add-react-to-a-new-app.html
next: cdn-links.html
---

Use as little, or as much of React as you need.

While you could [create a single-page app](/docs/add-react-to-a-new-app.html) with React, **the vast majority of the websites aren't, and don't need to be single-page apps**.

React has always been designed for progressive adoption, and **you can use as little or as much of React as you need**. Quite often, people only want to add some "sprinkles of interactivity" to an existing page, and React components are a great tool for that.

In some cases, [more parts of the page become driven by React over time](https://www.youtube.com/watch?v=BF58ZJ1ZQxY), but in others React stays as a flexible and unopinionated tool alongside the existing markup and code.

### 1. Add React [CDN links](/docs/cdn-links.html) to your HTML

```html
<script
  crossorigin
  src="https://unpkg.com/react@16/umd/react.development.js">
</script>
<script
  crossorigin
  src="https://unpkg.com/react-dom@16/umd/react-dom.development.js">
</script>
```

### 2. Write your components

```js
// src/button.js

class Button extends React.Component {
  render() {
    return (
      <button className="btn">{this.props.label}</button>
    );
  }
}
```

```js
// Render in several places

ReactDOM.render(
  <Button label="Sign Out" />,
  document.querySelector('.sign-out')
);

ReactDOM.render(
  <Button label="Sign In" />,
  document.querySelector('.sign-in')
);

ReactDOM.render(
  <Button label="Edit" />,
  document.querySelector('.edit')
);
```

### 3. Compile with Babel

[Babel](https://babeljs.io) is a tool that converts [JSX](/docs/introducing-jsx.html) and future JavaScript syntax into ES5 JavaScript compatible with older browsers.

_Install `babel` with [`yarn`](https://yarnpkg.com) or [`npm`](https://npmjs.com)_

```shell
npm init # if you don't already have a package.json
npm install --global babel-cli
npm install babel-preset-react-app
```

_Example: compile files in `src` folder to `build`_

```shell
NODE_ENV=development
babel --presets=react-app src -d build
```

### 4. Add components to page

```html
<script src="build/button.js"></script>
```

### 5. Production

You probably already have a minification step for your JavaScript - don't forget to minify your component files too!

_Change React scripts to production mode_

```
https://unpkg.com/react@16/umd/react.<strong>production.min.js</strong>
https://unpkg.com/react-dom@16/umd/react-dom.<strong>production.min.js</strong>
```
