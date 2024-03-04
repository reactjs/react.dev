---
title: Side effects must run outside of render
---

<Intro>
Side effects should not run in render, as React can render components multiple times to create the best possible user experience.
</Intro>

---

While render must be kept pure, side effects are necessary at some point in order for your app to do anything interesting, like showing something on the screen! The key point of this rule is that side effects should not run in render, as React can render components multiple times. In most cases, you'll use event handlers to handle side effects. For example, you might have an event handler that displays a confirmation dialog after the user clicks a button. Using an event handler explicitly tells React that this code doesn't need to run during render, keeping render pure. If you've exhausted all options – and only as a last resort – you can also handle side effects using `useEffect`.

<DeepDive>
#### Why does render need to be pure? {/*why-does-render-need-to-be-pure*/}
UI libraries like React take care of when your code runs for you so that your application has great user experience. React is declarative: you tell React what to render in your component's logic, and React will figure out how best to display it to your user!

When render is kept pure, React can understand how to prioritise which updates are most important for the user to see first. This is made possible because of render purity: since components don't have side effects in render, React can pause rendering components that aren't as important to update, and only come back to them later when it's needed.

Concretely, this means that rendering logic can be run multiple times in a way that allows React to give your user a pleasant user experience. However, if your component has an untracked side effect – like modifying the value of a global variable during render – when React runs your rendering code again, your side effects will be triggered in a way that won't match what you want. This often leads to unexpected bugs that can degrade how your users experience your app.
</DeepDive>

For example, values that aren't created inside of a component shouldn't be mutated:

```js
let items = []; // created outside of the component
function MyComponent({ seen }) {
  items.push(seen); // ❌ mutated inside the component
}
```


In general, mutation is not idiomatic in React. However, local mutation is absolutely fine:

```js
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

We created `items` while rendering and no other component "saw" it so we can mutate it as much as we like before handing it off as part of the render result. This component has no observable side effects, even though it mutates `items`. There is no need to contort your code to avoid local mutation.

Similarly, lazy initialization is fine despite not being fully "pure":

```js
function ExpenseForm() {
  // Fine if it doesn't affect other components:
  SuperCalculator.initializeIfNotReady();

  // Continue rendering...
}
```

As long as calling a component multiple times is safe and doesn’t affect the rendering of other components, React doesn’t care if it’s 100% pure in the strict functional programming sense of the word.

That said, side effects that are directly visible to the user are not allowed in the render logic of React components. In other words, merely calling a component function shouldn’t by itself produce a change on the screen.

```js
function ProductDetailPage({ product }) {
  document.window.title = product.title; // ❌
}
```