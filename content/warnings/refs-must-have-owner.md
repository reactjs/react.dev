---
title: Refs Must Have Owner Warning
layout: single
permalink: warnings/refs-must-have-owner.html
---

You are probably here because you got one of the following error messages:

*React 16.0.0+*
> Warning:
>
> Element ref was specified as a string (myRefName) but no owner was set. You may have multiple copies of React loaded. (details: https://fb.me/react-refs-must-have-owner).

*earlier versions of React*
> Warning:
>
> addComponentAsRefTo(...): Only a ReactOwner can have refs. You might be adding a ref to a component that was not created inside a component's `render` method, or you have multiple copies of React loaded.

This usually means one of three things:

- You are trying to add a `ref` to a function component.
- You are trying to add a `ref` to an element that is being created outside of a component's render() function.
- You have multiple (conflicting) copies of React loaded (eg. due to a misconfigured npm dependency)

## Refs on Function Components {#refs-on-function-components}

If `<Foo>` is a function component, you can't add a ref to it:

```js
// Doesn't work if Foo is a function!
<Foo ref={foo} />
```

If you need to add a ref to a component, convert it to a class first, or consider not using refs as they are [rarely necessary](/docs/refs-and-the-dom.html#when-to-use-refs).

## Strings Refs Outside the Render Method {#strings-refs-outside-the-render-method}

This usually means that you're trying to add a ref to a component that doesn't have an owner (that is, was not created inside of another component's `render` method). For example, this won't work:

```js
// Doesn't work!
ReactDOM.render(<App ref="app" />, el);
```

Try rendering this component inside of a new top-level component which will hold the ref. Alternatively, you may use a callback ref:

```js
let app;
ReactDOM.render(
  <App ref={inst => {
    app = inst;
  }} />,
  el
);
```

Consider if you [really need a ref](/docs/refs-and-the-dom.html#when-to-use-refs) before using this approach.

## Multiple copies of React {#multiple-copies-of-react}

Bower does a good job of deduplicating dependencies, but npm does not. If you aren't doing anything (fancy) with refs, there is a good chance that the problem is not with your refs, but rather an issue with having multiple copies of React loaded into your project. Sometimes, when you pull in a third-party module via npm, you will get a duplicate copy of the dependency library, and this can create problems.

If you are using npm... `npm ls` or `npm ls react` might help illuminate.
