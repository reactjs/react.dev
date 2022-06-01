---
title: 'Synchronizing with Effects'
---

<Intro>

Some components need to synchronize with external systems. For example, you might want to control a non-React component based on the React state, set up a server connection, or send an analytics log when a component appears on the screen. *Effects* let you run some code after rendering so that you can synchronize your component with some system outside of React.

</Intro>

<YouWillLearn>

- What effects are
- How effects are different from events
- How to declare an effect in your component
- Why effects run twice in development mode
- How to optimize effects with dependencies

</YouWillLearn>

## What are effects and how are they different from events? {/*what-are-effects-and-how-are-they-different-from-events*/}

Before getting to effects, you need to be familiar with two types of logic inside React components:

- **Rendering code** (introduced in [Describing the UI](/learn/describing-the-ui)) lives at the top level of your component. This is where you take the props and state, transform them, and return the JSX you want to see on the screen. [Rendering code must be pure.](/learn/keeping-components-pure) Like a math formula, it should only _calculate_ the result, but not do anything else.

- **Event handlers** (introduced in [Adding Interactivity](/learn/adding-interactivity)) are nested functions inside your components that *do* things rather than just calculate them. An event handler might update an input field, submit an HTTP POST request to buy a product, or navigate the user to another screen. Event handlers contain ["side effects"](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) (they change the program's state) and are caused by a specific user action (for example, a button click or typing).

Sometimes this isn't enough. Consider a `ChatRoom` component that must connect to the chat server whenever it's visible on the screen. Connecting to a server is not a pure calculation (it's a side effect) so it can't happen during rendering. However, there is no single particular event like a click that causes `ChatRoom` to be displayed.

***Effects* let you specify side effects that are caused by rendering itself, rather than by a particular event.** Sending a message in the chat is an *event* because it is directly caused by the user clicking a specific button. However, setting up a server connection is an *effect* because it needs to happen regardless of which interaction caused the component to appear. Effects run at the end of the [rendering process](/learn/render-and-commit) after the screen updates. This is a good time to synchronize the React components with some external system (like network or a third-party library).

## How to write an effect {/*how-to-write-an-effect*/}

**Don't rush to add effects to your components.** Keep in mind that effects are typically used to "step out" of your React code and synchronize with some *external* system. This includes browser APIs, third-party widgets, network, and so on. If your effect only adjusts some state based on other state, [you might not need an effect.](/learn/you-might-not-need-an-effect)

To write an effect, follow these three steps:

1. **Declare an effect.** By default, your effect will run after _every_ render.
2. **Specify the dependencies.** Most effects should only re-run *when needed* rather than after every render. For example, connecting and disconnecting to a chat room should only happen when the component appears and disappears, or when the chat room changes. You will learn how to control this by specifying *dependencies.*
3. **Add cleanup if needed.** Some effects need to specify how to stop, undo, or clean up whatever they were doing. For example, "connect" needs "disconnect," "subscribe" needs "unsubscribe," and "fetch" needs either "cancel" or "ignore". You will learn how to do this by returning a *cleanup function*.

Before we dive into concrete examples, let's look at the syntax.

### Step 1: Declare an effect {/*step-1-declare-an-effect*/}

Import the [`useEffect`](/apis/useeffect) Hook from React:

```js
import { useEffect } from 'react';
```

Declare your effect by calling `useEffect` at the top level of your component. Pass an inline function to it:

```js {2-5}
function MyComponent() {
  useEffect(() => {
    // Runs after every render
    doSomething();
  });
  // ...
}
```

Every time your component renders, React will update the screen, *and then* run the code inside `useEffect`. In other words, **useEffect "delays" a piece of code from running until all rendering is done and the screen updates.**

If your effect does several unrelated things, you can split it into multiple independent effects.

### Step 2: Specify the dependencies {/*step-2-specify-the-dependencies*/}

If you don't want your effect to run after every render, you need to specify the array of *dependencies*. To start, you can pass an empty `[]` array as the second argument to your effect:

```js {4}
function MyComponent() {
  useEffect(() => {
    doSomething();
  }, []); // Runs on mount
```

**With empty `[]` dependencies, your effect will only run _on mount,_** i.e. when the component is added to the screen. It will no longer run when the component re-renders due to a change in props or state. (During development, you'll see your effect firing twice even with `[]`, but we'll see what this means later.)

**You can't leave the dependencies empty if your effect uses information from rendering.** The effect code below uses the `color` prop and the `text` state variable. If your linter is [configured correctly](/learn/editor-setup#linting), you will see a lint error:

```js {5}
function MyComponent({ color }) {
  const [text, setText] = useState('');
  useEffect(() => {
    doSomething(color, text);
  }, []); // 🔴 Lint error. React Hook useEffect has missing dependencies: color, text.
```

This effect _depends on_ the values of `color` and `text`, so you must include them in dependencies:

```js {5}
function MyComponent({ color }) {
  const [text, setText] = useState('');
  useEffect(() => {
    doSomething(color, text);
  }, [color, text]); // ✅ All dependencies are declared
```

Now the effect will run on mount _and also_ when either `color` or `text` changes. Unlike events, effects are "reactive": if the code in your effect uses some information, it must re-run when that information changes. This ensures that when you synchronize state and props with an external system, no updates are missed or ignored.

**Notice that you can't "choose" your dependencies.** You will get a lint error if the dependencies you specified don't match what React expects based on the code inside your effect. This helps catch many bugs in your code. If your effect uses some value but you *don't* want to re-run the effect when it changes, you'll need to *edit the effect code itself* to not "need" that dependency. Learn more about this in [Specifying the Effect Dependencies](/learn/specifying-effect-dependencies).

<DeepDive title="How does React keep track of changes in the dependencies?">

When you see `[color, text]` dependencies in the effect declaration, it might be tempting to read it as if React "subscribes" to the `color` and `text` values and fires your effect when they change.

However, that mental model is misleading and more complex than how it works. When your component renders for the first time, React "remembers" the values of your dependencies. For example, they might be `['red', '']`. Then let's say that the user calls `setText('hello')`. This triggers a re-render. React renders your component again. This time, your effect's dependency values are `['red', 'hello']`. React compares `['red', '']` from the previous render with `['red', 'hello']` from this render. Since `'red'` is different from `''` (compared with [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), React knows it needs to re-run your effect.

Let's say your component re-renders again for some unrelated reason without changing `color` or `text`. This means that for this render, your effect's dependency values are again `['red', 'hello']`. React compares `['red', 'hello']` from the previous render with `['red', 'hello']` from this render. Since all dependencies have the same values, React knows it can skip re-running your effect.

So React does not really "subscribe" to anything. It only remembers the values of your dependencies on each render, and skips re-running the effect if the dependencies are the same during the next render. This is why you can't use a global variable or a mutable value like `window.location.pathname` as a dependency. React can't know when it changes, so it wouldn't re-run your effect. Instead, your dependencies should be computed from props, state, context, or values you created during rendering.

</DeepDive>

### Step 3: Add cleanup if needed {/*step-3-add-cleanup-if-needed*/}

**Some effects need to specify how to stop, undo, or clean up whatever they were doing.** For example, "connect" needs "disconnect," "subscribe" needs "unsubscribe," and "fetch" needs either "cancel" or "ignore".

You can add cleanup to your effect by returning a function _from_ your effect:

```js {3-5}
  useEffect(() => {
    subscribeToSomething(id);
    return () => {
      unsubscribeFromSomething(id);
    };
  }, [id]);
```

When React runs your effect, it will remember the cleanup function that you have provided. React will call that cleanup function before applying the same effect again when some dependency (like `id` in this example) changes. React will *also* always call cleanup when the component unmounts, i.e. gets removed from the screen.

**The cleanup function should "cancel out" whatever the effect was doing.** The application user shouldn't be able to notice the difference between calling your effect once and doing an _effect → cleanup → effect_ sequence. For example, from the user's perspective, calling `subscribeToSomething()` once produces the same behavior as a sequence of `subscribeToSomething()`, `unsubscribeFromSomething()`, and `subscribeToSomething()`.

**During development, React will stress-test your effects by remounting them once right after mounting.** This lets you find effects that need cleanup. If your effect does a fetch without cancellation, you'll see the fetch callback run twice. If your effect subscribes to a data source but never unsubscribes from it, you will notice two subscriptions. This behavior is development-only and helps find many bugs, as you will see later on this page.

## Writing effects in practice {/*writing-effects-in-practice*/}

Writing effects is the hardest part of writing React apps. It's okay to feel intimidated! When you write JSX, React takes care of [translating declarative code into imperative commands](/learn/reacting-to-input-with-state#how-declarative-ui-compares-to-imperative). But when you write effects, you are doing this translation yourself. It takes some practice to get comfortable. Let's walk through some common examples.

### Example: sending an analytics log {/*example-sending-an-analytics-log*/}

### Example: controlling a video player {/*example-controlling-a-video-player*/}

### Example: connecting to a chat {/*example-connecting-to-a-chat*/}

### Example: fade-in animation {/*example-fade-in-animation*/}

### Example: fetching data {/*example-fetching-data*/}





