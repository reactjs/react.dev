---
id: refs-and-the-dom
title: Refs and the DOM
redirect_from:
  - "docs/working-with-the-browser.html"
  - "docs/more-about-refs.html"
  - "docs/more-about-refs-ko-KR.html"
  - "docs/more-about-refs-zh-CN.html"
  - "tips/expose-component-functions.html"
  - "tips/children-undefined.html"
permalink: docs/refs-and-the-dom.html
---

Refs provide a way to access DOM nodes or React elements created in the render method.

In the typical React dataflow, [props](/docs/components-and-props.html) are the only way that parent components interact with their children. To modify a child, you re-render it with new props. However, there are a few cases where you need to imperatively modify a child outside of the typical dataflow. The child to be modified could be an instance of a React component, or it could be a DOM element. For both of these cases, React provides an escape hatch.

### When to Use Refs {#when-to-use-refs}

There are a few good use cases for refs:

* Managing focus, text selection, or media playback.
* Triggering imperative animations.
* Integrating with third-party DOM libraries.

Avoid using refs for anything that can be done declaratively.

For example, instead of exposing `open()` and `close()` methods on a `Dialog` component, pass an `isOpen` prop to it.

### Don't Overuse Refs {#dont-overuse-refs}

Your first inclination may be to use refs to "make things happen" in your app. If this is the case, take a moment and think more critically about where state should be owned in the component hierarchy. Often, it becomes clear that the proper place to "own" that state is at a higher level in the hierarchy. See the [Lifting State Up](/docs/lifting-state-up.html) guide for examples of this.

### Creating Refs {#creating-refs}

Refs are created using `React.useRef()` and attached to React elements via the `ref` attribute. Refs are commonly assigned to a variable when a component is constructed so they can be referenced throughout the component.

```javascript{2,4}
function MyComponent() {
  const myRef = React.useRef();

  return <div ref={myRef} />;
}
```

### Accessing Refs {#accessing-refs}

When a ref is passed to an element in `render`, a reference to the node becomes accessible at the `current` attribute of the ref.

```javascript
const node = myRef.current;
```

When the `ref` attribute is used on an HTML element or custom component, the `ref` created in the constructor with `React.useRef()` receives the underlying DOM element as its `current` property.

#### Adding a Ref to a DOM Element {#adding-a-ref-to-a-dom-element}

This code uses a `ref` to store a reference to a DOM node:

```javascript{3,8,17}
function CustomTextInput {
    // create a ref to store the textInput DOM element
    const textInput = React.useRef();

  function focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    textInput.current.focus();
  }

  // tell React that we want to associate the <input> ref
  // with the `textInput` that we created in the constructor
  return (
    <div>
      <input
        type="text"
        ref={textInput} />
      <input
        type="button"
        value="Focus the text input"
        onClick={focusTextInput}
      />
    </div>
  );
}
```

React will assign the `current` property with the DOM element when the component mounts, and assign it back to `null` when it unmounts. `ref` updates happen before the `useEffect` hook.

#### Refs and Function Components {#refs-and-function-components}

**You may not use the `ref` attribute on function components** because they don't have instances:

```javascript{1,6,10}
function MyFunctionComponent() {
  return <input />;
}

function Parent() {
  const textInput = React.useRef();

  // This will *not* work!
  return (
    <MyFunctionComponent ref={textInput} />
  );
}
```

You should [forward a ref](https://reactjs.org/docs/forwarding-refs.html) to the component if you need a ref to it.

```javascript{1,4,7}
const MyFunctionComponent = React.forwardRef((props, ref) => <input ref={ref} />)

function Parent() {
  const textInput = React.useRef();

  return (
    <MyFunctionComponent ref={textInput} />
  );
}
```

You can also use use the `ref` attribute inside a component as long as you refer to a DOM element or forwarded component.

```javascript{2,3,6,13}
function CustomTextInput(props) {
  // textInput must be declared here so the ref can refer to it
  let textInput = React.useRef();

  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} />
      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );
}
```

### Exposing DOM Refs to Parent Components {#exposing-dom-refs-to-parent-components}

In rare cases, you might want to have access to a child's DOM node from a parent component. This is generally not recommended because it breaks component encapsulation, but it can occasionally be useful for triggering focus or measuring the size or position of a child DOM node.

We recommend to use [ref forwarding](/docs/forwarding-refs.html) for these cases. **Ref forwarding lets components opt into exposing any child component's ref as their own**. You can find a detailed example of how to expose a child's DOM node to a parent component [in the ref forwarding documentation](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

When possible, we advise against exposing DOM nodes, but it can be a useful escape hatch. Note that this approach requires you to add some code to the child component.

### Callback Refs {#callback-refs}

React also supports another way to set refs called "callback refs", which gives more fine-grain control over when refs are set and unset.

Instead of passing a `ref` attribute created by `useRef()`, you pass a function. The function receives the HTML DOM element as its argument, which can be stored and accessed elsewhere. 

The example below implements a common pattern: using the `ref` callback to store a reference to a DOM node in an instance property.

```javascript{2,4-6,8-10,15,19,24,29}
function CustomTextInput() {
  let textInput = null;

  function setTextInputRef(element) {
    textInput = element;
  }

  function focusTextInput() {
    // Focus the text input using the raw DOM API
    if (textInput) textInput.focus();
  }

  useEffect(() => {
    // autofocus the input on mount
    focusTextInput();
  }, []);

  // Use the `ref` callback to store a reference to the text input DOM
  // element in an instance field (for example, textInput).
  return (
    <div>
      <input
        type="text"
        ref={setTextInputRef}
      />
      <input
        type="button"
        value="Focus the text input"
        onClick={focusTextInput}
      />
    </div>
  );
}
```

React will call the `ref` callback with the DOM element when the component mounts, and call it with `null` when it unmounts. Refs are guaranteed to be up-to-date before the `useEffect` hook fires.

You can pass callback refs between components like you can with object refs that were created with `React.useRef()`.

```javascript{4,12}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

function Parent extends React.Component {
  return (
    <CustomTextInput
      inputRef={el => inputElement = el}
    />
  );
}
```

In the example above, `Parent` passes its ref callback as an `inputRef` prop to the `CustomTextInput`, and the `CustomTextInput` passes the same function as a special `ref` variable to the `<input>`. As a result, `inputElement` in `Parent` will be set to the DOM node corresponding to the `<input>` element in the `CustomTextInput`.

### Caveats with callback refs {#caveats-with-callback-refs}

If the `ref` callback is defined as an inline function, it will get called twice during updates, first with `null` and then again with the DOM element. This is because a new instance of the function is created with each render, so React needs to clear the old ref and set up the new one.
