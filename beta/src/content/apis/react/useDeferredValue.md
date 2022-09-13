---
title: useDeferredValue
---

<Wip>

This section is incomplete, please see the old docs for [useDeferredValue.](https://reactjs.org/docs/hooks-reference.html#usedeferredvalue)

</Wip>


<Intro>

`useDeferredValue` accepts a value and returns a new copy of the value that will defer to more urgent updates. If the current render is the result of an urgent update, like user input, React will return the previous value and then render the new value after the urgent render has completed.

```js
const deferredValue = useDeferredValue(value);
```

</Intro>

<InlineToc />
