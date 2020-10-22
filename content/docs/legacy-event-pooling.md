---
id: legacy-event-pooling
title: Legacy Event Pooling
permalink: docs/legacy-event-pooling.html
---

In React 16 and earlier, the [`SyntheticEvent`](/docs/events.html) was pooled. This means that the `SyntheticEvent` object will be reused and all properties will be nullified after the event callback has been invoked.
This is for performance reasons.
As such, you cannot access the event in an asynchronous way.

```javascript
function onClick(event) {
  console.log(event); // => nullified object.
  console.log(event.type); // => "click"
  const eventType = event.type; // => "click"
  setTimeout(function() {
    console.log(event.type); // => null
    console.log(eventType); // => "click"
  }, 0);
  // Won't work. this.state.clickEvent will only contain null values.
  this.setState({clickEvent: event});
  // You can still export event properties.
  this.setState({eventType: event.type});
}
```

> Note:
>
> If you want to access the event properties in an asynchronous way, you should call `event.persist()` on the event, which will remove the synthetic event from the pool and allow references to the event to be retained by user code.
