---
title: Side effects must run outside of render
---

<Intro>
Side effects should not run in render, as React can render components multiple times to create the best possible user experience.
</Intro>

---

While render must be kept pure, side effects are necessary at some point in order for your app to do anything interesting, like showing something on the screen! The key point of this rule is that side effects should not run in render, as React can render components multiple times. In most cases, you'll use [event handlers](learn/responding-to-events) to handle side effects.

For example, you might have an event handler that displays a confirmation dialog after the user clicks a button. Using an event handler explicitly tells React that this code doesn't need to run during render, keeping render pure. If you've exhausted all options – and only as a last resort – you can also handle side effects using `useEffect`.

<DeepDive>
#### Why does render need to be pure? {/*why-does-render-need-to-be-pure*/}
UI libraries like React take care of when your code runs for you so that your application has a great user experience. React is declarative: you tell React what to render in your component's logic, and React will figure out how best to display it to your user!

When render is kept pure, React can understand how to prioritize which updates are most important for the user to see first. This is made possible because of render purity: since components don't have side effects in render, React can pause rendering components that aren't as important to update, and only come back to them later when it's needed.

Concretely, this means that rendering logic can be run multiple times in a way that allows React to give your user a pleasant user experience. However, if your component has an untracked side effect – like modifying the value of a global variable during render – when React runs your rendering code again, your side effects will be triggered in a way that won't match what you want. This often leads to unexpected bugs that can degrade how your users experience your app.
</DeepDive>

## When is it okay to have mutation? {/*mutation*/}
One common example of a side effect is mutation, which refers to changing the value of a non-[primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) value. In general, while mutation is not idiomatic in React, _local_ mutation is absolutely fine:

```js {2}
function FriendList({ friends }) {
  let items = []; // ✅ locally created and mutated
  for (let i = 0; i < friends.length; i++) {
    let friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    );
  }
  return <section>{items}</section>;
}
```

There is no need to contort your code to avoid local mutation. In particular, [`Array.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) could also be used here for brevity, but there is nothing wrong with creating a local array and then pushing items into it during render.

Even though it looks like we are mutating `items`, the key point to note is that this code only does so locally – the mutation isn't "remembered" when the component is rendered again. In other words, `items` only stays around as long as the component does. Because `items` is always recreated every time `<FriendList />` is rendered, the component will always returns the same result.

On the other hand, if `items` was created outside of the component, it holds on to its previous values and remembers changes:

```js {1}
let items = []; // ❌ created outside of the component
function FriendList({ friends }) {
  // Push `friends` into `items`...
  return <section>{items}</section>;
}
```

When `<FriendList />` runs again, we will continue appending `friends` to `items` every time that component is run, leading to multiple duplicated results. This version of `<FriendList />` has observable side effects during render and **breaks the rule**.

Similarly, lazy initialization is fine despite not being fully "pure":

```js {2}
function ExpenseForm() {
  SuperCalculator.initializeIfNotReady(); // ✅ Fine if it doesn't affect other components
  // Continue rendering...
}
```

Side effects that are directly visible to the user are not allowed in the render logic of React components. In other words, merely calling a component function shouldn’t by itself produce a change on the screen.

```js {2}
function ProductDetailPage({ product }) {
  document.window.title = product.title; // ❌
}
```

As long as calling a component multiple times is safe and doesn’t affect the rendering of other components, React doesn’t care if it’s 100% pure in the strict functional programming sense of the word. It is more important that [components must be idempotent](/reference/rules/components-must-be-idempotent).
