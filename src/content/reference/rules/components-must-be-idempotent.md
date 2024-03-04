---
title: Components must be idempotent
---

<Intro>
React components are assumed to always return the same output with respect to their props. This is known as [idempotency](https://stackoverflow.com/questions/1077412/what-is-an-idempotent-operation).
</Intro>

---

Put simply, idempotence means that you [always get the same result everytime](learn/keeping-components-pure) you run that piece of code.

```js
function NewsFeed({ items }) {
  const filteredItems = items.filter(item => item.isDisplayed === true);
  return (
    <ul>
      {filteredItems.map(item => <li>{item.text}</li>}
    </ul>
  );
}
```

This means that _all_ code that runs during render must also be idempotent in order for this rule to hold. For example, this line of code is not idempotent (and therefore, neither is the component) and breaks this rule:

```js {2}
function Clock() {
  return <div>{new Date()}</div> // ❌ always returns a different result!
}
```

`new Date()` is not idempotent as it always returns the current date and changes its result every time it's called. When you render the above component, the time displayed on the screen will stay stuck on the time that the component was rendered. Similarly, functions like `Math.random()` also aren't idempotent, because they return different results every time they're called, even when the inputs are the same.

Try building a component that displays the time in real-time in our [challenge](learn/keeping-components-pure#challenges) to see if you follow this rule!
