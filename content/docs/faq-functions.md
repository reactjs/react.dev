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
<button onClick={handleClick}>
```

### Is it OK to use functions in render methods? {#is-it-ok-to-use-functions-in-render-methods}

Generally speaking, yes, it is OK, and it is often the easiest way to pass parameters to callback functions.

If you do have performance issues, by all means, optimize!

### Why is my function being called every time the component renders? {#why-is-my-function-being-called-every-time-the-component-renders}

Make sure you aren't _calling the function_ when you pass it to the component:

```jsx
// Wrong: handleClick is called instead of passed as a reference!
return <button onClick={handleClick()}>Click Me</button>
```

Instead, *pass the function itself* (without parens):

```jsx
// Correct: handleClick is passed as a reference!
return <button onClick={handleClick}>Click Me</button>
```

### How do I pass a parameter to an event handler or callback? {#how-do-i-pass-a-parameter-to-an-event-handler-or-callback}

You can use a function to wrap around an event handler and pass parameters:

```jsx
<button onClick={() => handleClick(id)} />
```

This is equivalent to calling `.bind`:

```jsx
<button onClick={handleClick.bind(this, id)} />
```

#### Example: Passing params using functions {#example-passing-params-using-functions}

```jsx
const A = 65 // ASCII character code

function Alphabet() {
  const [justClicked, setJustClicked] = useState(null);
  const [letters, setLetters] = useState(Array.from({length: 26}, (_, i) => String.fromCharCode(A + i)));

  return (
    <div>
      Just clicked: {justClicked}
      <ul>
        {letters.map(letter =>
          <li key={letter} onClick={() => setJustClicked(letter)}>
            {letter}
          </li>
        )}
      </ul>
    </div>
  );
}
```

#### Example: Passing params using data-attributes {#example-passing-params-using-data-attributes}

Alternately, you can use DOM APIs to store data needed for event handlers. Consider this approach if you need to optimize a large number of elements or have a render tree that relies on React.memo equality checks.

```jsx
const A = 65 // ASCII character code

function Alphabet() {
  const [justClicked, setJustClicked] = useState(null);
  const [letters, setLetters] = useState(Array.from({length: 26}, (_, i) => String.fromCharCode(A + i)));

  return (
    <div>
      Just clicked: {justClicked}
      <ul>
        {letters.map(letter =>
          <li key={letter} data-letter={letter} onClick={e => setJustClicked(e.target.dataset.letter)}>
            {letter}
          </li>
        )}
      </ul>
    </div>
  );
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

function LoadMoreButton(props) {
  const handleClickThrottled = useCallback(throttle(handleClick, 1000), []);

  useEffect(() => {
    return () => handleClickThrottled.cancel();
  });

  return <button onClick={handleClickThrottled}>Load More</button>;

  function handleClick() {
    props.loadMore();
  }
}
```

#### Debounce {#debounce}

Debouncing ensures that a function will not be executed until after a certain amount of time has passed since it was last called. This can be useful when you have to perform some expensive calculation in response to an event that might dispatch rapidly (eg scroll or keyboard events). The example below debounces text input with a 250ms delay.

```jsx
import debounce from 'lodash.debounce';

function Searchbox(props) {
  const emitChangeDebounced = useCallback(debounce(emitChange, 250), []);

  useEffect(() => {
    return () => emitChangeDebounced.cancel();
  });

  return (
    <input
      type="text"
      onChange={handleChange}
      placeholder="Search..."
      defaultValue={props.value}
    />
  );

  function handleChange(e) {
    // React pools events, so we read the value before debounce.
    // Alternately we could call `event.persist()` and pass the entire event.
    // For more info see reactjs.org/docs/events.html#event-pooling
    emitChangeDebounced(e.target.value);
  }

  function emitChange(value) {
    props.onChange(value);
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

function ScrollListener(props) {
  // Create a new function to schedule updates.
  const scheduleUpdate = useCallback(rafSchedule(
    point => props.onScroll(point)
  ), []);

  function handleScroll(e) {
    // When we receive a scroll event, schedule an update.
    // If we receive many updates within a frame, we'll only publish the latest value.
    scheduleUpdate({ x: e.clientX, y: e.clientY });
  }

  function componentWillUnmount() {
    // Cancel any pending updates since we're unmounting.
    scheduleUpdate.cancel();
  }

  return (
    <div
      style={{ overflow: 'scroll' }}
      onScroll={handleScroll}
    >
      <img src="/my-huge-image.jpg" />
    </div>
  );
}
```

#### Testing your rate limiting {#testing-your-rate-limiting}

When testing your rate limiting code works correctly it is helpful to have the ability to fast forward time. If you are using [`jest`](https://facebook.github.io/jest/) then you can use [`mock timers`](https://facebook.github.io/jest/docs/en/timer-mocks.html) to fast forward time. If you are using `requestAnimationFrame` throttling then you may find [`raf-stub`](https://github.com/alexreardon/raf-stub) to be a useful tool to control the ticking of animation frames.
