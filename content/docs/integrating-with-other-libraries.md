---
id: integrating-with-other-libraries
title: Integrating with Other Libraries
permalink: docs/integrating-with-other-libraries.html
---

React can be used in any web application. It can be embedded in other applications and, with a little care, other applications can be embedded in React. This guide will examine some of the more common use cases, focusing on integration with [jQuery](https://jquery.com/) and [Backbone](https://backbonejs.org/), but the same ideas can be applied to integrating components with any existing code.

## Integrating with DOM Manipulation Plugins {#integrating-with-dom-manipulation-plugins}

React is unaware of changes made to the DOM outside of React. It determines updates based on its own internal representation, and if the same DOM nodes are manipulated by another library, React gets confused and has no way to recover.

This does not mean it is impossible or even necessarily difficult to combine React with other ways of affecting the DOM, you just have to be mindful of what each is doing.

The easiest way to avoid conflicts is to prevent the React component from updating. You can do this by rendering elements that React has no reason to update, like an empty `<div />`.

### How to Approach the Problem {#how-to-approach-the-problem}

To demonstrate this, let's sketch out a wrapper for a generic jQuery plugin.

We will attach a [ref](/docs/refs-and-the-dom.html) to the root DOM element. Inside `useEffect`, we will get a reference to it so we can pass it to the jQuery plugin.

To prevent React from touching the DOM after mounting, we will return an empty `<div />`. The `<div />` element has no properties or children, so React has no reason to update it, leaving the jQuery plugin free to manage that part of the DOM:

```js{5-6,8,11}
function SomePlugin() {
  const el = useRef();

  useEffect(() => {
    const $el = $(el);
    $el.somePlugin();

    return () => $el.somePlugin('destroy');
  }, []);

  return <div ref={el} />;
}
```

Note that we defined both `useEffect`'s normal callback and its cleanup callback. Many jQuery plugins attach event listeners to the DOM so it's important to detach them in the cleanup callback. If the plugin does not provide a method for cleanup, you will probably have to provide your own, remembering to remove any event listeners the plugin registered to prevent memory leaks.

### Integrating with jQuery Chosen Plugin {#integrating-with-jquery-chosen-plugin}

For a more concrete example of these concepts, let's write a minimal wrapper for the plugin [Chosen](https://harvesthq.github.io/chosen/), which augments `<select>` inputs.

>**Note:**
>
>Just because it's possible, doesn't mean that it's the best approach for React apps. We encourage you to use React components when you can. React components are easier to reuse in React applications, and often provide more control over their behavior and appearance.

First, let's look at what Chosen does to the DOM.

If you call it on a `<select>` DOM node, it reads the attributes off of the original DOM node, hides it with an inline style, and then appends a separate DOM node with its own visual representation right after the `<select>`. Then it fires jQuery events to notify us about the changes.

Let's say that this is the API we're striving for with our `<Chosen>` wrapper React component:

```js
function Example() {
  return (
    <Chosen onChange={value => console.log(value)}>
      <option>vanilla</option>
      <option>chocolate</option>
      <option>strawberry</option>
    </Chosen>
  );
}
```

We will implement it as an [uncontrolled component](/docs/uncontrolled-components.html) for simplicity.

First, we will create an empty component where we return `<select>` wrapped in a `<div>`:

```js{5,6}
function Chosen extends(props) {
  const el = useRef();

  return (
    <div>
      <select className="Chosen-select" ref={el}>
        {props.children}
      </select>
    </div>
  );
}
```

Notice how we wrapped `<select>` in an extra `<div>`. This is necessary because Chosen will append another DOM element right after the `<select>` node we passed to it. However, as far as React is concerned, `<div>` always only has a single child. This is how we ensure that React updates won't conflict with the extra DOM node appended by Chosen. It is important that if you modify the DOM outside of React flow, you must ensure React doesn't have a reason to touch those DOM nodes.

Next, we will implement the `useEffect` hook. We need to initialize Chosen with the ref to the `<select>` node in the callback, and tear it down in the cleanup callback:

```js{2,3,5}
useEffect(() => {
  const $el = $(el);
  $el.chosen();

  return () => $el.chosen('destroy');
}, []);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/qmqeQx?editors=0010)

This is enough to get our component to render, but we also want to be notified about the value changes. To do this, we will subscribe to the jQuery `change` event on the `<select>` managed by Chosen.

We won't pass `props.onChange` directly to Chosen because component's props might change over time, and that includes event handlers. Instead, we will declare a `handleChange()` method that calls `props.onChange`, and subscribe it to the jQuery `change` event:

```js{4,7,12-14}
useEffect(() => {
  const $el = $(el);
  $el.chosen();
  $el.on('change', handleChange);

  return () => {
    $el.off('change', handleChange);
    $el.chosen('destroy');
  };
}, []);

function handleChange(e) {
  props.onChange(e.target.value);
}
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/bWgbeE?editors=0010)

Finally, there is one more thing left to do. In React, props can change over time. For example, the `<Chosen>` component can get different children if parent component's state changes. This means that at integration points it is important that we manually update the DOM in response to prop updates, since we no longer let React manage the DOM for us.

Chosen's documentation suggests that we can use jQuery `trigger()` API to notify it about changes to the original DOM element. We will let React take care of updating `props.children` inside `<select>`, but we will also add a `useEffect()` hook that notifies Chosen about changes in the children list:

```js{4,5}
const previousChildren = useRef();

useEffect(() => {
  if (previousChildren.current !== props.children) {
    $el.trigger("chosen:updated");
  }

  previousChildren.current = props.children;
});
```

This way, Chosen will know to update its DOM element when the `<select>` children managed by React change.

The complete implementation of the `Chosen` component looks like this:

```js
function Chosen() {
  const el = useRef();
  const previousChildren = useRef();

  useEffect(() => {
    const $el = $(el);
    $el.chosen();
    $el.on('change', handleChange);

    return () => {
      $el.off('change', handleChange);
      $el.chosen('destroy');
    };
  }, []);

  useEffect(() => {
    if (previousChildren.current !== props.children) {
      $el.trigger("chosen:updated");
    }

    previousChildren.current = props.children;
  });
    
  function handleChange(e) {
    props.onChange(e.target.value);
  }

  return (
    <div>
      <select className="Chosen-select" ref={el}>
        {props.children}
      </select>
    </div>
  );
}
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/xdgKOz?editors=0010)

## Integrating with Other View Libraries {#integrating-with-other-view-libraries}

React can be embedded into other applications thanks to the flexibility of [`ReactDOM.render()`](/docs/react-dom.html#render).

Although React is commonly used at startup to load a single root React component into the DOM, `ReactDOM.render()` can also be called multiple times for independent parts of the UI which can be as small as a button, or as large as an app.

In fact, this is exactly how React is used at Facebook. This lets us write applications in React piece by piece, and combine them with our existing server-generated templates and other client-side code.

### Replacing String-Based Rendering with React {#replacing-string-based-rendering-with-react}

A common pattern in older web applications is to describe chunks of the DOM as a string and insert it into the DOM like so: `$el.html(htmlString)`. These points in a codebase are perfect for introducing React. Just rewrite the string based rendering as a React component.

So the following jQuery implementation...

```js
$('#container').html('<button id="btn">Say Hello</button>');
$('#btn').click(function() {
  alert('Hello!');
});
```

...could be rewritten using a React component:

```js
function Button() {
  return <button id="btn">Say Hello</button>;
}

ReactDOM.render(
  <Button />,
  document.getElementById('container'),
  function() {
    $('#btn').click(function() {
      alert('Hello!');
    });
  }
);
```

From here you could start moving more logic into the component and begin adopting more common React practices. For example, in components it is best not to rely on IDs because the same component can be rendered multiple times. Instead, we will use the [React event system](/docs/handling-events.html) and register the click handler directly on the React `<button>` element:

```js{2,6,9}
function Button(props) {
  return <button onClick={props.onClick}>Say Hello</button>;
}

function HelloButton() {
  function handleClick() {
    alert('Hello!');
  }
  return <Button onClick={handleClick} />;
}

ReactDOM.render(
  <HelloButton />,
  document.getElementById('container')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/RVKbvW?editors=1010)

You can have as many such isolated components as you like, and use `ReactDOM.render()` to render them to different DOM containers. Gradually, as you convert more of your app to React, you will be able to combine them into larger components, and move some of the `ReactDOM.render()` calls up the hierarchy.

### Embedding React in a Backbone View {#embedding-react-in-a-backbone-view}

[Backbone](https://backbonejs.org/) views typically use HTML strings, or string-producing template functions, to create the content for their DOM elements. This process, too, can be replaced with rendering a React component.

Below, we will create a Backbone view called `ParagraphView`. It will override Backbone's `render()` function to render a React `<Paragraph>` component into the DOM element provided by Backbone (`this.el`). Here, too, we are using [`ReactDOM.render()`](/docs/react-dom.html#render):

```js{1,5,8,12}
function Paragraph(props) {
  return <p>{props.text}</p>;
}

const ParagraphView = Backbone.View.extend({
  render() {
    const text = this.model.get('text');
    ReactDOM.render(<Paragraph text={text} />, this.el);
    return this;
  },
  remove() {
    ReactDOM.unmountComponentAtNode(this.el);
    Backbone.View.prototype.remove.call(this);
  }
});
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/gWgOYL?editors=0010)

It is important that we also call `ReactDOM.unmountComponentAtNode()` in the `remove` method so that React unregisters event handlers and other resources associated with the component tree when it is detached.

When a component is removed *from within* a React tree, the cleanup is performed automatically, but because we are removing the entire tree by hand, we must call this method.

## Integrating with Model Layers {#integrating-with-model-layers}

While it is generally recommended to use unidirectional data flow such as [React state](/docs/lifting-state-up.html), [Flux](https://facebook.github.io/flux/), or [Redux](https://redux.js.org/), React components can use a model layer from other frameworks and libraries.

### Using Backbone Models in React Components {#using-backbone-models-in-react-components}

The simplest way to consume [Backbone](https://backbonejs.org/) models and collections from a React component is to listen to the various change events and manually force an update.

Components responsible for rendering models would listen to `'change'` events, while components responsible for rendering collections would listen for `'add'` and `'remove'` events. In both cases, use an incrementing state counter to rerender the component with the new data.

In the example below, the `List` component renders a Backbone collection, using the `Item` component to render individual items.

```js{1,2,5-6,12,13,16-17,23}
function Item(props) {
  const [, handleChange] = useReducer(x => x + 1, 0);

  useEffect(() => {
    props.model.on('change', handleChange);
    return () => props.model.off('change', handleChange);
  });

  return <li>{props.model.get('text')}</li>;
}

function List(props) {
  const [, handleChange] = useReducer(x => x + 1, 0);

  useEffect(() => {
    props.collection.on('add', 'remove', handleChange);
    return () => props.collection.off('add', 'remove', handleChange);
  })

  return (
    <ul>
      {props.collection.map(model => (
        <Item key={model.cid} model={model} />
      ))}
    </ul>
  );
}
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/GmrREm?editors=0010)

### Extracting Data from Backbone Models {#extracting-data-from-backbone-models}

The approach above requires your React components to be aware of the Backbone models and collections. If you later plan to migrate to another data management solution, you might want to concentrate the knowledge about Backbone in as few parts of the code as possible.

One solution to this is to extract the model's attributes as plain data whenever it changes, and keep this logic in a single place. The following is a custom hook that extracts all attributes of a Backbone model into state.

This way, only the hook needs to know about Backbone model internals, and most components in the app can stay agnostic of Backbone.

In the example below, we will make a copy of the model's attributes to form the initial state. We subscribe to the `change` event (and unsubscribe on unmounting), and when it happens, we update the state with the model's current attributes. Finally, we make sure that if the `model` prop itself changes, we don't forget to unsubscribe from the old model, and subscribe to the new one.

Note that this example is not meant to be exhaustive with regards to working with Backbone, but it should give you an idea for how to approach this in a generic way:

```js{1,3,6-7,12-13,18,21}
function useBackboneModel(model) {
  const previousModel = useRef(model);
  const [state, setState] = useState(model.attributes);

  useEffect(() => {
    model.on('change', handleChange);
    return () => model.off('change', handleChange);
  }, []);

  useEffect(() => {
    if (previousModel.current !== model) {
      previousModel.current.off('change', handleChange);
      model.on('change', handleChange);
    }
  }, [model]);

  handleChange(model) {
    setState(attributes => Object.assign({}, attributes, model.changedAttributes()));
  }

  return state;
}
```

To demonstrate how to use it, we will connect a `NameInput` React component to a Backbone model, and update its `firstName` attribute every time the input changes:

```js{4,6,15,19-21}
function NameInput(props) {
  return (
    <p>
      <input value={props.firstName} onChange={props.handleChange} />
      <br />
      My name is {props.firstName}.
    </p>
  );
}

function Example(props) {
  const attributes = useBackboneModel(props.model);

  function handleChange(e) {
    props.model.set('firstName', e.target.value);
  }

  return (
    <NameInput
      {...attributes}
      handleChange={handleChange}
    />
  );
}

const model = new Backbone.Model({ firstName: 'Frodo' });
ReactDOM.render(
  <Example model={model} />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/PmWwwa?editors=0010)

This technique is not limited to Backbone. You can use React with any model library by subscribing to its changes in the `useEffect` hook and, optionally, copying the data into the local React state.
