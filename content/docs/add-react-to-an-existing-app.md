---
id: add-react-to-an-existing-app
title: Add React to an Existing Application
permalink: docs/add-react-to-an-existing-app.html
prev: add-react-to-a-new-app.html
next: cdn-links.html
---

You don't need to rewrite your app to start using React.

We recommend adding React to a small part of your application, such as an individual widget, so you can see if it works well for your use case.

### 1. Add React [CDN links][cdn] to your HTML

```html
<script
  crossorigin
  src="https://unpkg.com/react@16/umd/react.production.min.js">
</script>
<script
  crossorigin
  src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js">
</script>
```

### 2. Write your components

```js
// src/widget.js
class Widget extends React.Component() {
  render() {
    return <div>Hello, world!</div>;
  }
}

ReactDOM.render(
  <Widget />,
  document.querySelector('.widget')
);
```

### 3. Compile with Babel

[Babel][babel] is a tool that converts [JSX][jsx] and future JavaScript syntax into ES5 JavaScript compatible with older browsers.

_Install `babel` with `yarn` or `npm`_

```shell
npm install --global babel-cli babel-preset-react-app
```

_Example: compile files in `src` folder to `build`_

```shell
babel --presets=react-app src -d build
```

### 4. Add components to page

```html
<script src="build/widget.js"></script>
```

<!-- Links: -->

[babel]: https://babeljs.io
[cdn]: /docs/cdn-links.html
[jsx]: /docs/introducing-jsx.html
