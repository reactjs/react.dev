---
title: forwardRef
---

<Wip>

This section is incomplete, please see the old docs for [forwardRef](https://reactjs.org/docs/react-api.html#reactforwardref).

</Wip>


<Intro>

`React.forwardRef` creates a React component that forwards the `ref` attribute it receives to another component below in the tree.

```js
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));
```

</Intro>

<InlineToc />
