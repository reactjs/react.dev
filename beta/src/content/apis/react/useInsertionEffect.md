---
title: useInsertionEffect
---

<Wip>

This section is incomplete, please see the old docs for [useInsertionEffect.](https://reactjs.org/docs/hooks-reference.html#useinsertioneffect)

</Wip>


<Intro>

The signateure is identical to `useEffect`, but it fires synchronously before all DOM mutations. Use this to inject styles into the DOM before reading layout in `useLayoutEffect`. Since this hook is limited in scope, this hook does not have access to refs and cannot schedule updates.

```js
useInsertionEffect(didUpdate);
```

</Intro>

<InlineToc />

<Gotcha>

`useInsertionEffect` should be limited to css-in-js library authors. Prefer [`useEffect`](/apis/react/useEffect) or [`useLayoutEffect`](/apis/react/useLayoutEffect) instead.

</Gotcha>
