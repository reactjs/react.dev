---
id: fragments
title: Fragments
permalink: docs/fragments.html
---

React fragments add improved support for returning multiple children from a component's render method.

Fragments look like empty JSX tags. They let you group a list of children without adding extra nodes to the DOM:

```js
render() {
  return (
    <>
      <ChildA />
      <ChildB />
      <ChildC />
    </>
  );
}
```

### Live Demo

You can try out JSX fragment syntax with this [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000).

## Motivation

A common pattern is for a component to return a list of children. Take this example HTML:

```html
Some text.
<h2>A heading</h2>
More text.
<h2>Another heading</h2>
Even more text.
```

Prior to version 16, the only way to achieve this in React was by wrapping the children in an extra element, usually a `div` or `span`:

```js
render() {
  return (
    // Extraneous div element :(
    <div>
      Some text.
      <h2>A heading</h2>
      More text.
      <h2>Another heading</h2>
      Even more text.
    </div>
  );
}
```

To address this limitation, React 16.0 added support for [returning an array of elements from a component's `render` method](https://reactjs.org/blog/2017/09/26/react-v16.0.html#new-render-return-types-fragments-and-strings). Instead of wrapping the children in a DOM element, you can put them into an array:

```jsx
render() {
 return [
  "Some text.",
  <h2 key="heading-1">A heading</h2>,
  "More text.",
  <h2 key="heading-2">Another heading</h2>,
  "Even more text."
 ];
}
```

However, this has some confusing differences from normal JSX:

- Children in an array must be separated by commas.
- Children in an array must have a key to prevent React's [key warning](https://reactjs.org/docs/lists-and-keys.html#keys).
- Strings must be wrapped in quotes.

## Usage


To provide a more consistent authoring experience for fragments, React now provides a first-class `Fragment` component that can be used in place of arrays.

```jsx{3,9}
render() {
  return (
    <Fragment>
      Some text.
      <h2>A heading</h2>
      More text.
      <h2>Another heading</h2>
      Even more text.
    </Fragment>
  );
}
```

You can use `<Fragment />` the same way you'd use any other element, without changing the way you write JSX. No commas, no keys, no quotes.

The Fragment component is available on the main React object:

```js
const Fragment = React.Fragment;

<Fragment>
  <ChildA />
  <ChildB />
  <ChildC />
</Fragment>

// This also works
<React.Fragment>
  <ChildA />
  <ChildB />
  <ChildC />
</React.Fragment>
```

### Shorthand

Fragments are a common pattern in our codebases at Facebook. We anticipate they'll be widely adopted by other teams, too. To make the authoring experience as convenient as possible, we're adding syntactical support for fragments to JSX:

```jsx{3,9}
render() {
  return (
    <>
      Some text.
      <h2>A heading</h2>
      More text.
      <h2>Another heading</h2>
      Even more text.
    </>
  );
}
```

In React, this desugars to a `<React.Fragment/>` element, as in the example from the previous section. (Non-React frameworks that use JSX may compile to something different.)

### Keyed Fragments

Note that the `<></>` syntax does not accept attributes, including keys.

If you need a keyed fragment, you can use `<Fragment />` directly. A use case for this is mapping a collection to an array of fragments -- for example, to create a description list:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Without the `key`, React will fire a key warning
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

`key` is the only attribute that can be passed to `Fragment`. In the future, we may add support for additional attributes, such as event handlers.