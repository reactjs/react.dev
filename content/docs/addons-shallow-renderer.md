---
id: shallow-renderer
title: Shallow Renderer
permalink: docs/shallow-renderer.html
layout: docs
category: Reference
---

**Importing**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // ES5 with npm
```

## Overview

When writing unit tests for React, shallow rendering can be helpful. Shallow rendering lets you render a component "one level deep" and assert facts about what its render method returns, without worrying about the behavior of child components, which are not instantiated or rendered. This does not require a DOM.

For example, if you have the following component:

```javascript
function MyComponent() {
  return (
    <div>
      <span className="heading">Title</span>
      <Subcomponent foo="bar" />
    </div>
  );
}
```

Then you can assert:

```javascript
import ShallowRenderer from 'react-test-renderer/shallow';

// in your test:
const renderer = new ShallowRenderer();
renderer.render(<MyComponent />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="heading">Title</span>,
  <Subcomponent foo="bar" />
]);
```

Shallow testing currently has some limitations, namely not supporting refs.

> Note:
>
> We also recommend checking out Enzyme's [Shallow Rendering API](http://airbnb.io/enzyme/docs/api/shallow.html). It provides a nicer higher-level API over the same functionality.

## Reference

### `shallowRenderer.render()`

You can think of the shallowRenderer as a "place" to render the component you're testing, and from which you can extract the component's output.

`shallowRenderer.render()` is similar to [`ReactDOM.render()`](/docs/react-dom.html#render) but it doesn't require DOM and only renders a single level deep. This means you can test components isolated from how their children are implemented.

### `shallowRenderer.getRenderOutput()`

After `shallowRenderer.render()` has been called, you can use `shallowRenderer.getRenderOutput()` to get the shallowly rendered output.

You can then begin to assert facts about the output.

## Shallow Renderer Testing Example

In this example, let's test the code using shallow renderer when creating a new react app. 

Follow the guide lines on creating a new react app ['(create-react-app) here.'](https://reactjs.org/docs/create-a-new-react-app.html)

On creating the app, code has already been provided in the files like App.js and App.test.js. We can test this code using Jest and Enzyme. ['Jest'](https://jestjs.io/docs/en/tutorial-react) is a JavaScript unit testing framework, used by Facebook to test services and React applications. ['Enzyme'](https://airbnb.io/enzyme/) is a JavaScript Testing utility for React that makes it easier to assert, manipulate, and traverse your React Components’ output. 

Let's rewrite the code in App.test.js using shallow renderer. 

```javascript

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { shallow } from 'enzyme';


it('shallow render without crashing', () => {
  const wrapper = shallow(<App />);
  const learn = <a
  className="App-link"
  href="https://reactjs.org"
  target="_blank"
  rel="noopener noreferrer"
>
  Learn React
</a>;

  expect(wrapper.contains(learn)).toEqual(true);
});

```

Run 'npm test' after, to get check if testing was successful. 

If successful, it should look like this:

```java
 PASS  src/App.test.js
  √ shallow render without crashing (14ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        5.552s
Ran all test suites.

```

This is a simple testing of Shallow Renderer that shows, if you change something in a child component it won’t change shallow output of your component or if a bug was introduced to a child component, it won’t break your component under test.


