---
title: React Element Factories and JSX Warning
layout: single
permalink: warnings/legacy-factories.html
---

You probably came here because your code is calling your component as a plain function call. This is now deprecated:

```javascript
var MyComponent = require('MyComponent');

function render() {
  return MyComponent({ foo: 'bar' });  // WARNING
}
```

## JSX {#jsx}

React components can no longer be called directly like this. Instead [you can use JSX](/docs/jsx-in-depth.html).

```javascript
var React = require('react');
var MyComponent = require('MyComponent');

function render() {
  return <MyComponent foo="bar" />;
}
```

## Dynamic components without JSX {#dynamic-components-without-jsx}

If you get a component class from a dynamic source, you can also create your element inline:

```javascript
var React = require('react');

function render(MyComponent) {
  return React.createElement(MyComponent, { foo: 'bar' });
}
```

## In Depth {#in-depth}

[Read more about WHY we're making this change.](https://gist.github.com/sebmarkbage/d7bce729f38730399d28)
