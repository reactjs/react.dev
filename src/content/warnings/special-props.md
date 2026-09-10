---
title: Special Props Warning
---

Most props on a JSX element are passed on to the component. In earlier versions of React, `key` and `ref` were two special props used internally by React that were not forwarded to components.

Starting in React 19, `ref` is available as a prop for function components, making `key` the only prop that React does not forward to the component.

For instance, you cannot read `props.key` from a component. If you need to access the same value within the child component, you should pass it as a different prop (e.g. `<ListItemWrapper key={result.id} id={result.id} />` and read `props.id`). While this may seem redundant, it's important to separate app logic from hints to React.
