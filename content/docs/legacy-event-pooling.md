---
id: legacy-event-pooling
title: Event Pooling
permalink: docs/legacy-event-pooling.html
---

>Note
>
>This page is only relevant for React 16 and earlier, and for React Native.
>
>React 17 on the web **does not** use event pooling.
>
>[Read more](/blog/2020/08/10/react-v17-rc.html#no-event-pooling) about this change in React 17.

The [`SyntheticEvent`](/docs/events.html) objects are pooled. This means that the `SyntheticEvent` object will be reused and all properties will be nullified after the event handler has been called. For example, this won't work:

```javascript
function handleChange(e) {
  // This won't work because the event object gets reused.
  setTimeout(() => {
    console.log(e.target.value); // Too late!
  }, 100);
}
```

If you need to access event object's properties after the event handler has run, you need to call `e.persist()`:

```javascript
function handleChange(e) {
  // Prevents React from resetting its properties:
  e.persist();

  setTimeout(() => {
    console.log(e.target.value); // Works
  }, 100);
}
```
