---
title: Components and Hooks must be pure
---

<Intro>
Pure functions only perform a calculation and nothing more. It makes your code easier to understand, debug, and allows React to automatically optimize your components and hooks correctly.
</Intro>

<Note>
This reference page covers advanced topics and requires familiarity with the concepts covered in the [Keeping Components Pure](/learn/keeping-components-pure) page.
</Note>

<InlineToc />

### Why does purity matter? {/*why-does-purity-matter*/}

React is declarative: you tell React _what_ to render, and React will figure out _how_ best to display it to your user. To do this, React has a few phases where it runs your code. You don't need to know about all of these phases to use React well. But at a high level, you should know about what code runs in _render_, and what runs outside of it.

#### How does React run your code? {/*how-does-react-run-your-code*/}
_Rendering_ refers to calculating what the next version of your UI should look like. After rendering, [Effects](/reference/react/useEffect) are _flushed_ (meaning they are run until there are no more left) and may update the calculation if the Effects have impacts on layout. React takes this new calculation and compares it to the calulation used to create the previous version of your UI, then _commits_ just the minimum changes needed to the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) (what your user actually sees) to catch it up to the latest version.

#### What is purity? {/*what-is-purity*/}
One of the key concepts that makes React, _React_ is _purity_. A pure component or hook is one that is:

* **Idempotent** – You [always get the same result everytime](/learn/keeping-components-pure#purity-components-as-formulas) you run it with the same inputs – props, state, context for component inputs; and arguments for hook inputs.
* **Has no side effects in render** – Code with side effects should run [**separately from rendering**](#how-does-react-run-your-code): for example as an [event handler](/learn/responding-to-events) – where the user interacts with the UI and causes it to update – or as an [Effect](/reference/react/useEffect) – which runs after render.
* **Does not mutate non-local values**: Components and hooks should never modify values that aren't created locally. Local mutations are covered [below](#mutation).

When render is kept pure, React can understand how to prioritize which updates are most important for the user to see first. This is made possible because of render purity: since components don't have side effects in render, React can pause rendering components that aren't as important to update, and only come back to them later when it's needed.

Concretely, this means that rendering logic can be run multiple times in a way that allows React to give your user a pleasant user experience. However, if your component has an untracked side effect – like modifying the value of a global variable during render – when React runs your rendering code again, your side effects will be triggered in a way that won't match what you want. This often leads to unexpected bugs that can degrade how your users experience your app. You can see an [example of this in the Keeping Components Pure page](/learn/keeping-components-pure#side-effects-unintended-consequences).

---

## Components must be idempotent {/*components-must-be-idempotent*/}

Components must always return the same output with respect to their inputs – props, state, and context. This is known as _idempotency_.

[Idempotency](https://en.wikipedia.org/wiki/Idempotence) is a term popularized in functional programming. It refers to the idea that you [always get the same result everytime](learn/keeping-components-pure) you run that piece of code with the same inputs.

```js {3}
function NewsFeed({ items }) {
  // ✅ Array.filter is idempotent: it doesn't mutate `items`
  const filteredItems = items.filter(item => item.isDisplayed === true);
  return (
    <ul>
      {filteredItems.map(item => <li key={item.id}>{item.text}</li>)}
    </ul>
  );
}
```

This means that _all_ code that runs during render must also be idempotent in order for this rule to hold. For example, this line of code is not idempotent (and therefore, neither is the component):

```js {2}
function Clock() {
  const date = new Date(); // ❌ always returns a different result!
  return <div>{date}</div>
}
```

`new Date()` is not idempotent as it always returns the current date and changes its result every time it's called. When you render the above component, the time displayed on the screen will stay stuck on the time that the component was rendered. Similarly, functions like `Math.random()` also aren't idempotent, because they return different results every time they're called, even when the inputs are the same.

This doesn't mean you shouldn't use non-idempotent functions like `new Date()` _at all_ – you should just avoid using them during render. One quick heuristic to tell if code runs during render is to examine where it is: if it's written at the top level like in the example above, there's a good chance it runs during render.

Try building a component that displays the time in real-time in our [challenge](learn/keeping-components-pure#challenges) to see if you follow this rule!

## Side effects must run outside of render {/*side-effects-must-run-outside-of-render*/}

[Side effects](/learn/keeping-components-pure#side-effects-unintended-consequences) should not run in render, as React can render components multiple times to create the best possible user experience.

<Note>
Side effects are a broader term than Effects. Effects specifically refer to code that's wrapped in `useEffect`, while a side effect is a general term for code that has any observable effect other than its primary result of returning a value to the caller.
</Note>

While render must be kept pure, side effects are necessary at some point in order for your app to do anything interesting, like showing something on the screen! The key point of this rule is that side effects should not run in render, as React can render components multiple times. In most cases, you'll use [event handlers](learn/responding-to-events) to handle side effects.

For example, you might have an event handler that displays a confirmation dialog after the user clicks a button. Using an event handler explicitly tells React that this code doesn't need to run during render, keeping render pure. If you've exhausted all options – and only as a last resort – you can also handle side effects using `useEffect`.

### When is it okay to have mutation? {/*mutation*/}
One common example of a side effect is mutation, which in JavaScript refers to changing the value of a non-[primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) value. In general, while mutation is not idiomatic in React, _local_ mutation is absolutely fine:

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

There is no need to contort your code to avoid local mutation. [`Array.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) could also be used here for brevity, but there is nothing wrong with creating a local array and then pushing items into it during render.

Even though it looks like we are mutating `items`, the key point to note is that this code only does so locally – the mutation isn't "remembered" when the component is rendered again. In other words, `items` only stays around as long as the component does. Because `items` is always recreated every time `<FriendList />` is rendered, the component will always return the same result.

On the other hand, if `items` was created outside of the component, it holds on to its previous values and remembers changes:

```js {1}
let items = []; // ❌ created outside of the component
function FriendList({ friends }) {
  for (let i = 0; i < friends.length; i++) {
    let friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // ❌ mutates a value created outside of render
  }
  return <section>{items}</section>;
}
```

When `<FriendList />` runs again, we will continue appending `friends` to `items` every time that component is run, leading to multiple duplicated results. This version of `<FriendList />` has observable side effects during render and **breaks the rule**.

Lazy initialization is also fine despite not being fully "pure":

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

One way to achieve the desired result of updating `window.title` outside of render is to [synchronize the component with `window`](http://localhost:3000/learn/synchronizing-with-effects).

As long as calling a component multiple times is safe and doesn’t affect the rendering of other components, React doesn’t care if it’s 100% pure in the strict functional programming sense of the word. It is more important that [components must be idempotent](/reference/rules/components-and-hooks-must-be-pure).

## Props and state are immutable {/*props-and-state-are-immutable*/}

A component's props and state are immutable [snapshots](learn/state-as-a-snapshot). Never mutate them directly. Instead, pass new props down, and use the setter function from `useState`.

You can think of the props and state values as snapshots that are updated after rendering. For this reason, you don't modify the props or state variables directly: instead you pass new props, or use the setter function provided to you to tell React that state needs to update the next time the component is rendered.

### Don't mutate Props {/*props*/}
Props are immutable because if you mutate them, the application will produce inconsistent output, which can be hard to debug since it may or may not work depending on the circumstance.

```js {2}
function Post({ item }) {
  item.url = new Url(item.url, base); // ❌ never mutate props directly
  return <Link url={item.url}>{item.title}</Link>;
}
```

```js {2}
function Post({ item }) {
  const url = new Url(item.url, base); // ✅ make a copy instead
  return <Link url={url}>{item.title}</Link>;
}
```

### Don't mutate State {/*state*/}
`useState` returns the state variable and a setter to update that state.

```js
const [stateVariable, setter] = useState(0);
```

Rather than updating the state variable in-place, we need to update it using the setter function that is returned by `useState`. Changing values on the state variable doesn't cause the component to update, leaving your users with an outdated UI. Using the setter function informs React that the state has changed, and that we need to queue a re-render to update the UI.

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    count = count + 1; // ❌ never mutate state directly
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1); // ✅ use the setter function returned by useState
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

## Return values and arguments to Hooks are immutable {/*return-values-and-arguments-to-hooks-are-immutable*/}

Once values are passed to a Hook, you should not modify them. Like props in JSX, values become immutable when passed to a Hook.

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  if (icon.enabled) {
    icon.className = computeStyle(icon, theme); // ❌ never mutate hook arguments directly
  }
  return icon;
}
```

```js {3}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  const newIcon = { ...icon }; // ✅ make a copy instead
  if (icon.enabled) {
    newIcon.className = computeStyle(icon, theme);
  }
  return newIcon;
}
```

One important principle in React is _local reasoning_: the ability to understand what a component or hook does by looking at its code in isolation. Hooks should be treated like "black boxes" when they are called. For example, a custom hook might have used its arguments as dependencies to memoize values inside it:

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);

  return useMemo(() => {
    const newIcon = { ...icon };
    if (icon.enabled) {
      newIcon.className = computeStyle(icon, theme);
    }
    return newIcon;
  }, [icon, theme]);
}
```

If you were to mutate the hooks arguments, the custom hook's memoization will become incorrect,  so it's important to avoid doing that.

```js {4}
style = useIconStyle(icon);         // `style` is memoized based on `icon`
icon.enabled = false;               // ❌ never mutate hook arguments directly
style = useIconStyle(icon);         // previously memoized result is returned
```

```js {4}
style = useIconStyle(icon);         // `style` is memoized based on `icon`
icon = { ...icon, enabled: false }; // ✅ make a copy instead
style = useIconStyle(icon);         // new value of `style` is calculated
```

Similarly, it's important to not modify the return values of hooks, as they may have been memoized.

## Values are immutable after being passed to JSX {/*values-are-immutable-after-being-passed-to-jsx*/}

Don't mutate values after they've been used in JSX. Move the mutation before the JSX is created.

When you use JSX in an expression, React may eagerly evaluate the JSX before the component finishes rendering. This means that mutating values after they've been passed to JSX can lead to outdated UIs, as React won't know to update the component's output.

```js {4}
function Page({ colour }) {
  const styles = { colour, size: "large" };
  const header = <Header styles={styles} />;
  styles.size = "small"; // ❌ styles was already used in the JSX above!
  const footer = <Footer styles={styles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```

```js {4}
function Page({ colour }) {
  const headerStyles = { colour, size: "large" };
  const header = <Header styles={headerStyles} />;
  const footerStyles = { colour, size: "small" }; // ✅ we created a new value
  const footer = <Footer styles={footerStyles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```