---
title: React orchestrates Components and Hooks
---

<Intro>
TODO
</Intro>

<InlineToc />

---

## Never call component functions directly {/*never-call-component-functions-directly*/}
Components should only be used in JSX. Don't call them as regular functions.

React takes care of _when_ your code runs for you so that your application has a great user experience. It is declarative: you tell React what to render in your component's logic, and React will figure out how best to display it to your user.

In order to do this, React must decide when your component function is called during rendering. In React, you do this using JSX.

```js {2}
function BlogPost() {
  return <Layout><Article /></Layout>; // ✅ Only use components in JSX
}
```

```js {3}
function BlogPost() {
  return <Layout>{Article()}</Layout> // ❌ Never call them directly
}
```

If a component contains hooks, it's easy to violate the Rules of Hooks when components are called directly in a loop or conditionally.

Letting React orchestrate rendering also allows a number of benefits:

* **Components become more than functions.** React can augment them with features like _local state_ through Hooks that are tied to the component's identity in the tree.
* **Component types participate in reconcilation.** By letting React call your components, you also tell it more about the conceptual structure of your tree. For example, when you move from rendering `<Feed>` to the `<Profile>` page, React won’t attempt to re-use them.
* **React can enhance your user experience.** For example, it can let the browser do some work between component calls so that re-rendering a large component tree doesn’t block the main thread.
* **A better debugging story.** If components are first-class citizens that the library is aware of, we can build rich developer tools for introspection in development.
* **More efficient reconcilation.** React can decide exactly which components in the tree need re-rendering and skip over the ones that don't. That makes your app faster and more snappy.

## Never pass around hooks as regular values {/*never-pass-around-hooks-as-regular-values*/}

Hooks should only be called inside of components. Never pass it around as a regular value.

Hooks allow you to augment a component with React features. They should always be called as a function, and never passed around as a regular value. This enables _local reasoning_, or the ability for developers to understand everything a component can do by looking at that component in isolation.

Passing around hooks as regular values also inhibits the compiler at performing optimizations. Breaking this rule will de-optimize your component.

```js {2}
function ChatInput() {
  const useDataWithLogging = withLogging(useData); // ❌
  const data = useDataWithLogging();
}
```

```js {2}
function ChatInput() {
  const data = useDataWithLogging(); // ✅
}
```

Hooks should be immutable and not be mutated. Instead of mutating a hook dynamically, create a static version of the hook with the desired functionality.

```js
function useDataWithLogging() {
  // ... Logic should go in here
}
```

Hooks should also not be dynamically used: for example, instead of doing dependency injection in a component:

```js {2}
function ChatInput() {
  return <Button useData={useDataWithLogging} /> // ❌
}
```

You should always inline the call of the hook into that component and handle any logic in there.

```js {6}
function ChatInput() {
  return <Button />
}

function Button() {
  const data = useDataWithLogging();
}

function useDataWithLogging() {
  // conditional logic can live here
}
```

This way, `<Button />` is much easier to understand and debug. When Hooks are used in dynamic ways, it increases the complexity of your app greatly and inhibits local reasoning, making your team less productive in the long term. If you find yourself needing to mock components for tests, it's better to mock the server instead to respond with canned data. If possible, it's also usually more effective to test your app with end-to-end tests.

