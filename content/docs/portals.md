---
id: portals
title: Portals
permalink: docs/portals.html
---

Portals provide a way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.

Normally, when you return an element from a component's `render()` method, it's mounted into the DOM as a child of the nearest parent node:

```js{4,6}
render() {
  // React mounts a new div and renders the children into it
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

However, it's sometimes useful to insert a child into a different location in the DOM. A typical use case is when a parent element has an `overflow: hidden` or `z-index` style, but you need the child to visually "break out" of its container. Dialogs, hovercards, and tooltips are some examples of elements that may need to be rendered outside their parent component's DOM to display correctly.

Portals allow you to place these children outside their parent's DOM hierarchy, into any DOM node you have a reference to:

```js
ReactDOM.createPortal(child, container)
```

The first argument (`child`) is any [renderable React child](/docs/react-component.html#render), such as an element, string, or fragment. The second argument (`container`) is a reference to a DOM element.

You place the Portal into your component's `render()` method, much like you would with normal React elements:

```js{6}
render() {
  // React does *not* create a new div. It renders the children into `domNode`.
  // `domNode` is any valid DOM node, regardless of its location in the DOM.
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/yzMaBd)

> Note:
>
> When working with portals, make sure to follow the proper [accessibility guidelines](/docs/accessibility.html).

## Event Bubbling Through Portals

Even though a portal can be anywhere in the DOM tree, it behaves like a normal React child in every other way. Features like context work exactly the same regardless of whether the child is a portal, as the portal still exists in the *React tree* regardless of position in the *DOM tree*.

This includes event bubbling. An event fired from inside a portal will propagate to ancestors in the containing *React tree*, even if those elements are not ancestors in the *DOM tree*. Assuming the following HTML structure:

```html
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

A `Parent` component in `#app-root` would be able to catch an uncaught, bubbling event from the sibling node `#modal-root`.

```js{28-31,42-49,53,61-63,70-71,74}
// These two containers are siblings in the DOM
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // This will fire when the button in Child is clicked,
    // updating Parent's state, even though button
    // is not direct descendant in the DOM.
    this.setState(prevState => ({
      clicks: prevState.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Number of clicks: {this.state.clicks}</p>
        <p>
          Open up the browser DevTools
          to observe that the button
          is not a child of the div
          with the onClick handler.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // The click event on this button will bubble up to parent,
  // because there is no 'onClick' attribute defined
  return (
    <div className="modal">
      <button>Click</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/jGBWpE)

Catching an event bubbling up from a portal in a parent component allows the development of more flexible abstractions that are not inherently reliant on portals. For example, if you render a `<Modal />` component, the parent can capture its events regardless of whether it's implemented using portals or not.

> Note:
>
> When elements are placed, via portals, outside the parent component's DOM hierarchy, they will not inherit its CSS styles. They will instead inherit them from the DOM container they're placed into.
