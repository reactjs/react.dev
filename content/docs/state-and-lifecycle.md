---
id: state
title: State
permalink: docs/state.html
redirect_from:
  - "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

This page introduces the concept of state in a React component. You can find a [detailed component API reference here](/docs/react-component.html).

Consider the ticking clock example from [one of the previous sections](/docs/rendering-elements.html#updating-the-rendered-element). In [Rendering Elements](/docs/rendering-elements.html#rendering-an-element-into-the-dom), we have only learned one way to update the UI. We call `ReactDOM.render()` to change the rendered output:

```js{8-11}
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/gwoJZk?editors=0010)

In this section, we will learn how to make the `Clock` component truly reusable and encapsulated. It will set up its own timer and update itself every second.

We can start by encapsulating how the clock looks:

```js{3-6,12}
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/dpdoYR?editors=0010)

However, it misses a crucial requirement: the fact that the `Clock` sets up a timer and updates the UI every second should be an implementation detail of the `Clock`.

Ideally we want to write this once and have the `Clock` update itself:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

To implement this, we need to add "state" to the `Clock` component.

State is similar to props, but it is private and fully controlled by the component.

## Adding Local State to a Component {#adding-local-state-to-a-component}

We will move the `date` from props to state in three steps:

1) Replace `props.date` with `date`:

```js{5}
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {date.toLocaleTimeString()}.</h2>
    </div>
  );
}
```

2) Add a `useState` hook that assigns the initial `date`:

```js{2}
function Clock(props) {
  const [date, setDate] = useState(new Date())

  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {date.toLocaleTimeString()}.</h2>
    </div>
  );
}
```

3) Remove the `date` prop from the `<Clock />` element:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

We will later add the timer code back to the component itself.

The result looks like this:

```js{2,7,13}
function Clock(props) {
  const [date, setDate] = useState(new Date())

  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {date.toLocaleTimeString()}.</h2>
    </div>
  );
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/KgQpJd?editors=0010)

Next, we'll make the `Clock` set up its own timer and update itself every second.

## Adding `useEffect` Hook to a Class {#adding-useeffect-hook-to-a-class}

In applications with many components, it's very important to free up resources taken by the components when they are destroyed.

We want to [set up a timer](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) whenever the `Clock` is rendered to the DOM for the first time. This is called "mounting" in React.

We also want to [clear that timer](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval) whenever the DOM produced by the `Clock` is removed. This is called "unmounting" in React.

We can declare a `useEffect` hook on the component to run some code when a component mounts and unmounts:

```js{4}
function Clock(props) {
  const [date, setDate] = useState(new Date())

  useEffect();

  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {date.toLocaleTimeString()}.</h2>
    </div>
  );
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

The `useEffect` hook runs after the component output has been rendered to the DOM. This is a good place to set up a timer:

```js{3-6}
  useEffect(() => {
    const timerID = useRef()
    timerID.current = setInterval(
      tick,
      1000
    );
  });
```

We will tear down the timer in the `useEffect` hook's return value:

```js{9}
  useEffect(() => {
    const timerID = useRef()
    timerID.current = setInterval(
      tick,
      1000
    );

    return () => {
      clearInterval(timerID);
    }
  });
```

Finally, we will implement a function called `tick()` that the `Clock` component will run every second.

It will use `setDate` to schedule updates to the component local state:

```js{16-18}
function Clock(props) {
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const timerID = useRef()
    timerID.current = setInterval(
      tick,
      1000
    );

    return () => {
      clearInterval(timerID);
    }
  });

  function tick() {
    setDate(new Date());
  }

  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {date.toLocaleTimeString()}.</h2>
    </div>
  );
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/amqdNA?editors=0010)

Now the clock ticks every second.

Let's quickly recap what's going on and the order in which the code is called:

1) When `<Clock />` is passed to `ReactDOM.render()`, React calls the `Clock` component. Since `Clock` needs to display the current time, it initializes `date` with with a `useState` hook including the current time. We will later update this state.

2) React then uses the component's returned JSX. This is how React learns what should be displayed on the screen. React then updates the DOM to match the `Clock`'s render output.

3) When the `Clock` output is inserted in the DOM, React calls the `useEffect()` hook. Inside it, the `Clock` component asks the browser to set up a timer to call the component's `tick()` function once a second.

4) Every second the browser calls the `tick()` function. Inside it, the `Clock` component schedules a UI update by calling `setDate()` with an object containing the current time. Thanks to the `setDate()` hook call, React knows the state has changed, and calls the component again to learn what should be on the screen. This time, `date` in the component will be different, and so the render output will include the updated time. React updates the DOM accordingly.

5) If the `Clock` component is ever removed from the DOM, React calls the function returned by the`useEffect()` hook so the timer is stopped.

## Using State Correctly {#using-state-correctly}

There are two things you should know about state.

### Do Not Modify State Directly {#do-not-modify-state-directly}

For example, this will not re-render a component:

```js
// Wrong
state = 'Hello';
```

Instead, use `setState()` from the `useState()` hook:

```js
// Correct
setState('Hello');
```

### State Updates May Be Asynchronous {#state-updates-may-be-asynchronous}

React may batch multiple `setState()` calls into a single update for performance.

Because props and state may be updated asynchronously, you should not rely on their values for calculating the next state.

For example, this code may fail to update the counter:

```js
// Wrong
setCounter(counter + props.increment);
```

To fix it, use a second form of `setCounter()` that accepts a function rather than an object. That function will receive the previous state as the first argument, and the props at the time the update is applied as the second argument:

```js
// Correct
setState((state, props) => state.counter + props.increment);
```

We used an [arrow function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) above, but it also works with regular functions:

```js
// Correct
setState(function(state, props) {
  return state.counter + props.increment
});
```

## The Data Flows Down {#the-data-flows-down}

Neither parent nor child components can know if a certain component is stateful or stateless, and they shouldn't care whether it is defined with `useState`.

This is why state is often called local or encapsulated. It is not accessible to any component other than the one that owns and sets it.

A component may choose to pass its state down as props to its child components:

```js
<h2>It is {date.toLocaleTimeString()}.</h2>
```

This also works for user-defined components:

```js
<FormattedDate date={date} />
```

The `FormattedDate` component would receive the `date` in its props and wouldn't know whether it came from the `Clock`'s state, from the `Clock`'s props, or was typed by hand:

```js
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/zKRqNB?editors=0010)

This is commonly called a "top-down" or "unidirectional" data flow. Any state is always owned by some specific component, and any data or UI derived from that state can only affect components "below" them in the tree.

If you imagine a component tree as a waterfall of props, each component's state is like an additional water source that joins it at an arbitrary point but also flows down.

To show that all components are truly isolated, we can create an `App` component that renders three `<Clock>`s:

```js{4-6}
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/vXdGmd?editors=0010)

Each `Clock` sets up its own timer and updates independently.

In React apps, whether a component is stateful or stateless is considered an implementation detail of the component that may change over time. You can use stateless components inside stateful components, and vice versa.
