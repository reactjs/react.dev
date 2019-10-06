---
id: render-props
title: Render Props
permalink: docs/render-props.html
---

The term ["render prop"](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) refers to a technique for sharing code between React components using a prop whose value is a function.

A component with a render prop takes a function that returns a React element and calls it instead of implementing its own render logic.

```jsx
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```

Libraries that use render props include [React Router](https://reacttraining.com/react-router/web/api/Route/render-func), [Downshift](https://github.com/paypal/downshift) and [Formik](https://github.com/jaredpalmer/formik).

In this document, we’ll discuss why render props are useful, and how to write your own.

## Use Render Props for Cross-Cutting Concerns {#use-render-props-for-cross-cutting-concerns}

Components and hooks are the primary units of code reuse in React, but it's not always obvious how to share the state or behavior that one component encapsulates to other components that need that same state.

For example, the following component tracks the mouse position in a web app:

```js
function MouseTracker() {
  const [state, setState] = useState({ x: 0, y: 0 });

  function handleMouseMove(event) {
    setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  return (
    <div style={{ height: '100%' }} onMouseMove={handleMouseMove}>
      <h1>Move the mouse around!</h1>
      <p>The current mouse position is ({state.x}, {state.y})</p>
    </div>
  );
}
```

As the cursor moves around the screen, the component displays its (x, y) coordinates in a `<p>`.

Now the question is: How can we reuse this behavior in another component? In other words, if another component needs to know about the cursor position, can we encapsulate that behavior so that we can easily share it with that component?

Since components are the basic unit of code reuse in React, let's try refactoring the code a bit to use a `<Mouse>` component that encapsulates the behavior we need to reuse elsewhere.

```js
// The <Mouse> component encapsulates the behavior we need...
function Mouse() {
  const [state, setState] = useState({ x: 0, y: 0 });

  function handleMouseMove(event) {
    setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  return (
    <div style={{ height: '100%' }} onMouseMove={handleMouseMove}>

      {/* ...but how do we render something other than a <p>? */}
      <p>The current mouse position is ({state.x}, {state.y})</p>
    </div>
  );
}

function MouseTracker() {
  return (
    <div>
      <h1>Move the mouse around!</h1>
      <Mouse />
    </div>
  );
}
```

Now the `<Mouse>` component encapsulates all behavior associated with listening for `mousemove` events and storing the (x, y) position of the cursor, but it's not yet truly reusable.

For example, let's say we have a `<Cat>` component that renders the image of a cat chasing the mouse around the screen. We might use a `<Cat mouse={{ x, y }}>` prop to tell the component the coordinates of the mouse so it knows where to position the image on the screen.

As a first pass, you might try rendering the `<Cat>` *inside `<Mouse>`'*, like this:

```js
function Cat(props) {
  const mouse = props.mouse;
  return (
    <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
  );
}

function MouseWithCat() {
  const [state, setState] = useState({ x: 0, y: 0 });

  function handleMouseMove(event) {
    setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  return (
    <div style={{ height: '100%' }} onMouseMove={handleMouseMove}>

      {/*
        We could just swap out the <p> for a <Cat> here ... but then
        we would need to create a separate <MouseWithSomethingElse>
        component every time we need to use it, so <MouseWithCat>
        isn't really reusable yet.
      */}
      <Cat mouse={state} />
    </div>
  );
}

function MouseTracker() {
  return (
    <div>
      <h1>Move the mouse around!</h1>
      <MouseWithCat />
    </div>
  );
}
```

This approach will work for our specific use case, but we haven't achieved the objective of truly encapsulating the behavior in a reusable way. Now, every time we want the mouse position for a different use case, we have to create a new component (i.e. essentially another `<MouseWithCat>`) that renders something specifically for that use case.

Here's where the render prop comes in: Instead of hard-coding a `<Cat>` inside a `<Mouse>` component, and effectively changing its rendered output, we can provide `<Mouse>` with a function prop that it uses to dynamically determine what to render–a render prop.

```js
function Cat(props) {
  const mouse = props.mouse;
  return (
    <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
  );
}

function Mouse(props) {
  const [state, setState] = useState({ x: 0, y: 0 });

  function handleMouseMove(event) {
    setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  return (
    <div style={{ height: '100%' }} onMouseMove={handleMouseMove}>

      {/*
        Instead of providing a static representation of what <Mouse> renders,
        use the `render` prop to dynamically determine what to render.
      */}
      {props.render(state)}
    </div>
  );
}

function MouseTracker() {
  return (
    <div>
      <h1>Move the mouse around!</h1>
      <Mouse render={mouse => (
        <Cat mouse={mouse} />
      )}/>
    </div>
  );
}
```

Now, instead of effectively cloning the `<Mouse>` component and hard-coding something else to render in its JSX to solve for a specific use case, we provide a `render` prop that `<Mouse>` can use to dynamically determine what it renders.

More concretely, **a render prop is a function prop that a component uses to know what to render.**

This technique makes the behavior that we need to share extremely portable. To get that behavior, render a `<Mouse>` with a `render` prop that tells it what to render with the current (x, y) of the cursor.

One interesting thing to note about render props is that you can implement most higher-order components (HOC) using a regular component with a render prop. For example, if you would prefer to have a `withMouse` HOC instead of a `<Mouse>` component, you could easily create one using a regular `<Mouse>` with a render prop:

```js
// If you really want a HOC for some reason, you can easily
// create one using a regular component with a render prop!
function withMouse(Component) {
  return props => {
    return (
      <Mouse render={mouse => (
        <Component {...props} mouse={mouse} />
      )}/>
    );
  }
}
```

So using a render prop makes it possible to use either pattern.

## Using Props Other Than `render` {#using-props-other-than-render}

It's important to remember that just because the pattern is called "render props" you don't *have to use a prop named `render` to use this pattern*. In fact, [*any* prop that is a function that a component uses to know what to render is technically a "render prop"](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce).

Although the examples above use `render`, we could just as easily use the `children` prop!

```js
<Mouse children={mouse => (
  <p>The mouse position is {mouse.x}, {mouse.y}</p>
)}/>
```

And remember, the `children` prop doesn't actually need to be named in the list of "attributes" in your JSX element. Instead, you can put it directly *inside* the element!

```js
<Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

You'll see this technique used in the [react-motion](https://github.com/chenglou/react-motion) API.

Since this technique is a little unusual, you'll probably want to explicitly state that `children` should be a function in your `propTypes` when designing an API like this.

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```

## Caveats {#caveats}

### Be careful when using Render Props with React.memo {#be-careful-when-using-render-props-with-reactmemo}

Using a render prop can negate the advantage that comes from using [`React.memo`](/react-api.html#reactmemo) if you create the function inline. This is because the shallow prop comparison will always be different for new props, and each render in this case will generate a new value for the render prop.

For example, continuing with our `<Mouse>` component from above, if `Mouse` were to use `React.memo`, our example would look like this:

```js
const Mouse = React.memo(function Mouse(props) {
  // Same implementation as above...
});

function MouseTracker() {
  return (
    <div>
      <h1>Move the mouse around!</h1>

      {/*
        This is bad! The value of the `render` prop will
        be different on each render.
      */}
      <Mouse render={mouse => (
        <Cat mouse={mouse} />
      )}/>
    </div>
  );
}
```

In this example, each time `<MouseTracker>` renders, it generates a new function as the value of the `<Mouse render>` prop, thus negating the effect of `<Mouse>` using `React.memo` in the first place!

To get around this problem, you can sometimes define the prop with the `useCallback` hook, like so:

```js
function MouseTracker() {
  // Defined with the `useCallback` hook, `renderTheCat` always
  // refers to *same* function when we use it in render
  const renderTheCat = useCallback((mouse) => {
    return <Cat mouse={mouse} />;
  }, []);

  return (
    <div>
      <h1>Move the mouse around!</h1>
      <Mouse render={renderTheCat} />
    </div>
  );
}
```
