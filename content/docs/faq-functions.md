---
id: faq-functions
title: Passing Functions to Components
permalink: docs/faq-functions.html
layout: docs
category: FAQ
---

### How do I pass an event handler (like onClick) to a component? {#how-do-i-pass-an-event-handler-like-onclick-to-a-component}

Pass event handlers and other functions as props to child components:

```jsx
<button onClick={this.handleClick}>
```

If you need to have access to the parent component in the handler, you also need to bind the function to the component instance (see below).

### How do I bind a function to a component instance? {#how-do-i-bind-a-function-to-a-component-instance}

There are several ways to make sure functions have access to component attributes like `this.props` and `this.state`, depending on which syntax and build steps you are using.

#### Bind in Constructor (ES2015) {#bind-in-constructor-es2015}

```jsx
class Foo extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
```

#### Class Properties (Stage 3 Proposal) {#class-properties-stage-3-proposal}

```jsx
class Foo extends Component {
  // Note: this syntax is experimental and not standardized yet.
  handleClick = () => {
    console.log('Click happened');
  }
  render() {
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
```

#### Bind in Render {#bind-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>Click Me</button>;
  }
}
```

>**Note:**
>
>Using `Function.prototype.bind` in render creates a new function each time the component renders, which may have performance implications (see below).

#### Arrow Function in Render {#arrow-function-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={() => this.handleClick()}>Click Me</button>;
  }
}
```

>**Note:**
>
>Using an arrow function in render creates a new function each time the component renders, which may break optimizations based on strict identity comparison.

### Is it OK to use arrow functions in render methods? {#is-it-ok-to-use-arrow-functions-in-render-methods}

Generally speaking, yes, it is OK, and it is often the easiest way to pass parameters to callback functions.

If you do have performance issues, by all means, optimize!

### Why is binding necessary at all? {#why-is-binding-necessary-at-all}

In JavaScript, these two code snippets are **not** equivalent:

```js
obj.method();
```

```js
var method = obj.method;
method();
```

Binding methods helps ensure that the second snippet works the same way as the first one.

With React, typically you only need to bind the methods you *pass* to other components. For example, `<button onClick={this.handleClick}>` passes `this.handleClick` so you want to bind it. However, it is unnecessary to bind the `render` method or the lifecycle methods: we don't pass them to other components.

[This post by Yehuda Katz](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/) explains what binding is, and how functions work in JavaScript, in detail.

### Why is my function being called every time the component renders? {#why-is-my-function-being-called-every-time-the-component-renders}

Make sure you aren't _calling the function_ when you pass it to the component:

```jsx
render() {
  // Wrong: handleClick is called instead of passed as a reference!
  return <button onClick={this.handleClick()}>Click Me</button>
}
```

Instead, *pass the function itself* (without parens):

```jsx
render() {
  // Correct: handleClick is passed as a reference!
  return <button onClick={this.handleClick}>Click Me</button>
}
```

### How do I pass a parameter to an event handler or callback? {#how-do-i-pass-a-parameter-to-an-event-handler-or-callback}

You can use an arrow function to wrap around an event handler and pass parameters:

```jsx
<button onClick={() => this.handleClick(id)} />
```

This is equivalent to calling `.bind`:

```jsx
<button onClick={this.handleClick.bind(this, id)} />
```

#### Example: Passing params using arrow functions {#example-passing-params-using-arrow-functions}

```jsx
const A = 65 // ASCII character code

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }
  handleClick(letter) {
    this.setState({ justClicked: letter });
  }
  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} onClick={() => this.handleClick(letter)}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

#### Example: Passing params using data-attributes {#example-passing-params-using-data-attributes}

Alternately, you can use DOM APIs to store data needed for event handlers. Consider this approach if you need to optimize a large number of elements or have a render tree that relies on React.PureComponent equality checks.

```jsx
const A = 65 // ASCII character code

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }

  handleClick(e) {
    this.setState({
      justClicked: e.target.dataset.letter
    });
  }

  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} data-letter={letter} onClick={this.handleClick}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

### How can I prevent a function from being called too quickly or too many times in a row? {#how-can-i-prevent-a-function-from-being-called-too-quickly-or-too-many-times-in-a-row}

If you have an event handler such as `onClick` or `onScroll` and want to prevent the callback from being fired too quickly, then you can limit the rate at which callback is executed. This can be done by using:

- **throttling**: sample changes based on a time based frequency (eg [`_.throttle`](https://lodash.com/docs#throttle))
- **debouncing**: publish changes after a period of inactivity (eg [`_.debounce`](https://lodash.com/docs#debounce))
- **`requestAnimationFrame` throttling**: sample changes based on [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) (eg [`raf-schd`](https://github.com/alexreardon/raf-schd))

See [this visualization](http://demo.nimius.net/debounce_throttle/) for a comparison of `throttle` and `debounce` functions.

> Note:
>
> `_.debounce`, `_.throttle` and `raf-schd` provide a `cancel` method to cancel delayed callbacks. You should either call this method from `componentWillUnmount` _or_ check to ensure that the component is still mounted within the delayed function.

#### Throttle {#throttle}

Throttling prevents a function from being called more than once in a given window of time. The example below throttles a "click" handler to prevent calling it more than once per second.

```jsx
import throttle from 'lodash.throttle';

class LoadMoreButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickThrottled = throttle(this.handleClick, 1000);
  }

  componentWillUnmount() {
    this.handleClickThrottled.cancel();
  }

  render() {
    return <button onClick={this.handleClickThrottled}>Load More</button>;
  }

  handleClick() {
    this.props.loadMore();
  }
}
```

#### Debounce {#debounce}

Debouncing ensures that a function will not be executed until after a certain amount of time has passed since it was last called. This can be useful when you have to perform some expensive calculation in response to an event that might dispatch rapidly (eg scroll or keyboard events). The example below debounces text input with a 250ms delay.

```jsx
import debounce from 'lodash.debounce';

class Searchbox extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.emitChangeDebounced = debounce(this.emitChange, 250);
  }

  componentWillUnmount() {
    this.emitChangeDebounced.cancel();
  }

  render() {
    return (
      <input
        type="text"
        onChange={this.handleChange}
        placeholder="Search..."
        defaultValue={this.props.value}
      />
    );
  }

  handleChange(e) {
    this.emitChangeDebounced(e.target.value);
  }

  emitChange(value) {
    this.props.onChange(value);
  }
}
```

#### `requestAnimationFrame` throttling {#requestanimationframe-throttling}

[`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) is a way of queuing a function to be executed in the browser at the optimal time for rendering performance. A function that is queued with `requestAnimationFrame` will fire in the next frame. The browser will work hard to ensure that there are 60 frames per second (60 fps). However, if the browser is unable to it will naturally *limit* the amount of frames in a second. For example, a device might only be able to handle 30 fps and so you will only get 30 frames in that second. Using `requestAnimationFrame` for throttling is a useful technique in that it prevents you from doing more than 60 updates in a second. If you are doing 100 updates in a second this creates additional work for the browser that the user will not see anyway.

>**Note:**
>
>Using this technique will only capture the last published value in a frame. You can see an example of how this optimization works on [`MDN`](https://developer.mozilla.org/en-US/docs/Web/Events/scroll)

```jsx
import rafSchedule from 'raf-schd';

class ScrollListener extends React.Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);

    // Create a new function to schedule updates.
    this.scheduleUpdate = rafSchedule(
      point => this.props.onScroll(point)
    );
  }

  handleScroll(e) {
    // When we receive a scroll event, schedule an update.
    // If we receive many updates within a frame, we'll only publish the latest value.
    this.scheduleUpdate({ x: e.clientX, y: e.clientY });
  }

  componentWillUnmount() {
    // Cancel any pending updates since we're unmounting.
    this.scheduleUpdate.cancel();
  }

  render() {
    return (
      <div
        style={{ overflow: 'scroll' }}
        onScroll={this.handleScroll}
      >
        <img src="/my-huge-image.jpg" />
      </div>
    );
  }
}
```

#### Testing your rate limiting {#testing-your-rate-limiting}

When testing your rate limiting code works correctly it is helpful to have the ability to fast forward time. If you are using [`jest`](https://facebook.github.io/jest/) then you can use [`mock timers`](https://facebook.github.io/jest/docs/en/timer-mocks.html) to fast forward time. If you are using `requestAnimationFrame` throttling then you may find [`raf-stub`](https://github.com/alexreardon/raf-stub) to be a useful tool to control the ticking of animation frames.
