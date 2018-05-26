---
id: composition-vs-inheritance
title: Composition vs Inheritance
permalink: docs/composition-vs-inheritance.html
redirect_from: "docs/multiple-components.html"
prev: lifting-state-up.html
next: thinking-in-react.html
---

React has a powerful composition model, and we recommend using composition instead of inheritance to reuse code between components.

In this section, we will consider a few problems where developers new to React often reach for inheritance, and show how we can solve them with composition.

## Containment

Some components don't know their children ahead of time. This is especially common for components like `Sidebar` or `Dialog` that represent generic "boxes".

We recommend that such components use the special `children` prop to pass children elements directly into their output:

`embed:composition-vs-inheritance/fancy-border-example.js`

This lets other components pass arbitrary children to them by nesting the JSX:

`embed:composition-vs-inheritance/welcome-dialog-example.js`

[Try it on CodeSandbox.](codesandbox://composition-vs-inheritance/fancyborder-welcome-dialog-example)

Anything inside the `<FancyBorder>` JSX tag gets passed into the `FancyBorder` component as a `children` prop. Since `FancyBorder` renders `{props.children}` inside a `<div>`, the passed elements appear in the final output.

While this is less common, sometimes you might need multiple "holes" in a component. In such cases you may come up with your own convention instead of using `children`:

`embed:composition-vs-inheritance/split-pane-example.js`

[Try it on CodeSandbox.](codesandbox://composition-vs-inheritance/split-pane-codesandbox-example.js,composition-vs-inheritance/split-pane-codesandbox-example.css)

React elements like `<Contacts />` and `<Chat />` are just objects, so you can pass them as props like any other data. This approach may remind you of "slots" in other libraries but there are no limitations on what you can pass as props in React.

## Specialization

Sometimes we think about components as being "special cases" of other components. For example, we might say that a `WelcomeDialog` is a special case of `Dialog`.

In React, this is also achieved by composition, where a more "specific" component renders a more "generic" one and configures it with props:

`embed:composition-vs-inheritance/specific-dialog-example.js`

[Try it on CodePen.](https://codepen.io/gaearon/pen/kkEaOZ?editors=0010)

Composition works equally well for components defined as classes:

`embed:composition-vs-inheritance/signup-dialog-example.js`

[Try it on CodePen.](https://codepen.io/gaearon/pen/gwZbYa?editors=0010)

## So What About Inheritance?

At Facebook, we use React in thousands of components, and we haven't found any use cases where we would recommend creating component inheritance hierarchies.

Props and composition give you all the flexibility you need to customize a component's look and behavior in an explicit and safe way. Remember that components may accept arbitrary props, including primitive values, React elements, or functions.

If you want to reuse non-UI functionality between components, we suggest extracting it into a separate JavaScript module. The components may import it and use that function, object, or a class, without extending it.
