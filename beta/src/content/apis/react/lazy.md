---
title: lazy
---

<Wip>

This section is incomplete, please see the old docs for [lazy](https://reactjs.org/docs/react-api.html#reactlazy).

</Wip>


<Intro>

`React.lazy()` lets you define a component that is loaded dynamically. This helps reduce the bundle size to delay loading components that aren’t used during the initial render.

```js
// This component is loaded dynamically
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

</Intro>

<InlineToc />
