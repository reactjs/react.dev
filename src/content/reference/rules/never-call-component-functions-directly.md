---
title: Never call component functions directly
---

<Intro>
Components should only be used in JSX. Don't call them as regular functions.
</Intro>

---

React takes care of _when_ your code runs for you so that your application has a great user experience. It is declarative: you tell React what to render in your component's logic, and React will figure out how best to display it to your user.

In order to do this, React must decide when your component function is called during rendering. In React, you do this using JSX.

```js {2}
function BlogPost() {
  return <Layout><Article /></Layout>; // ✅ Only use components in JSX
}
```

```js {3}
function BlogPost() {
  ReactDOM.render(
    Layout({ children: Article() }), // ❌ Never call them directly
    /* ... */
  );
}
```

Letting React orchestrate rendering allows a number of benefits:

* **Components become more than functions.** React can augment them with features like _local state_ through Hooks that are tied to the component's identity in the tree.
* **Component types participate in reconcilation.** By letting React call your components, you also tell it more about the conceptual structure of your tree. For example, when you move from rendering `<Feed>` to the `<Profile>` page, React won’t attempt to re-use them.
* **React can enhance your user experience.** For example, it can let the browser do some work between component calls so that re-rendering a large component tree doesn’t block the main thread.
* **A better debugging story.** If components are first-class citizens that the library is aware of, we can build rich developer tools for introspection in development.
* **More efficient reconcilation.** React can decide exactly which components in the tree need re-rendering and skip over the ones that don't. That makes your app faster and more snappy.
