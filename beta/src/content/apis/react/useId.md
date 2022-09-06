---
title: useId
---

<Wip>

This section is incomplete, please see the old docs for [useId](https://reactjs.org/docs/hooks-reference.html#useid).

</Wip>


<Intro>

`useId` is a hook for generating unique IDs that are stable across the server and client, while avoiding hydration mismatches.

```js
const id = useId();
```

</Intro>

<InlineToc />

<Gotcha>

`useId` is not for generating keys in a list. Keys should be generated from your data.

</Gotcha>
