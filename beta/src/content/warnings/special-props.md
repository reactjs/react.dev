---
title: Special Props Warning
---

Most props on a JSX element are passed on to the component, however, there are two special props (`ref` and `key`) which are used by React, and are thus not forwarded to the component.

For instance, you can't read `props.key` from a component. If you need to access the same value within the child component, you should pass it as a different prop (ex: `<ListItemWrapper key={result.id} id={result.id} />` and read `props.id`). While this may seem redundant, it's important to separate app logic from hints to React.
