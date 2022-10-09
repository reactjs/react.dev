---
title: findDOMNode
---

<Wip>

This section is incomplete, please see the old docs for [findDOMNode.](https://reactjs.org/docs/react-dom.html#finddomnode)

</Wip>


<Intro>

If this component has been mounted into the DOM, this returns the corresponding native browser DOM element. This method is useful for reading values out of the DOM, such as form field values and performing DOM measurements. **In most cases, you can attach a ref to the DOM node and avoid using findDOMNode at all.**

```js
findDOMNode(component)
```

</Intro>

<InlineToc />

<Pitfall>

`findDOMNode` is an escape hatch used to access the underlying DOM node. In most cases, use of this escape hatch is discouraged because it pierces the component abstraction. [It has been deprecated in StrictMode.](https://reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

</Pitfall>
