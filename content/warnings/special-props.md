---
title: Special Props Warning
layout: single
permalink: warnings/special-props.html
---

Most props on a JSX element are passed on to the component, however, there are two special props (`ref` and `key`) which are used by React, and are thus not forwarded to the component.

For instance, attempting to access `this.props.key` from a component (eg. the render function) is not defined. If you need to access the same value within the child component, you should pass it as a different prop (ex: `<ListItemWrapper key={result.id} id={result.id} />`). While this may seem redundant, it's important to separate app logic from reconciling hints.

> Note:
>
> There is no need to validate special props using [PropTypes typechecking](https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes).
>
> By defining `key` or `ref` PropTypes, React will try to access them during props validation phase in the development build.
> 
> ```js
> ListItemWrapper.propTypes = {
>   id: PropTypes.string,
>   key: PropTypes.string // WARNING
> }
> ```
