---
title: 'Thinking in Effects'
---

<Intro>

React components have a lifecycle: they *mount* when they are added to the screen, they *update* when props or state change, and they *unmount* when they are removed. Effects let you run some code at each stage of that lifecycle. However, when you write Effects, you won't directly "think in" this lifecycle. Instead, you'll think what the Effect should do, what values its code depends on, and how to clean it up. This different mindset is essential to writing Effects well.

</Intro>

<YouWillLearn>

- What the lifecycle of a component is
- How to think about writing Effects
- How "thinking in Effects" compares to "thinking in lifecycles"
- How to choose Effect dependencies
- How to fix Effects that run too often
- What to do when you don't want an Effect to re-run when something changes

</YouWillLearn>

## Thinking in lifecycles vs thinking in Effects {/*thinking-in-lifecycles-vs-thinking-in-effects*/}

React components have a lifecycle:

1. A component *mounts* when it's added to the screen.
2. A component *updates* when its props or state change.
3. A component *unmounts* when it's removed from the screen.

Let's say you're writing a `ChatRoom` component that needs to connect to a server on mount and disconnect on unmount. If you try to directly translate these requirements to code, you might want to write something like this:

```js
function ChatRoom() {
  // ...
  // 🔴 Not real code: React has no onMount/onUpdate/onUnmount events
  function onMount() {
    connection = createConnection();
    connection.connect();
  }
  function onUpdate() {
    // Nothing to do
  }
  function onUnmount() {
    connection.disconnect();
  }
  // ...
}
```

**However, React intentionally does not expose lifecycle events like these to your components. There are no events like `onMount`, `onUpdate`, or `onUnmount`.** Instead, here is how you would [write this code as an Effect:](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

```js
function ChatRoom() {
  // ...
  useEffect(() => {
    const connection = createConnection();
    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, []);
  // ...
}
```

At first, you might feel that the first snippet is easier to understand because it matches the original requirements closer ("connect on mount", "disconnect on unmount"). The second snippet might feel more dense and abstract.

**However, these two snippets are different in a more fundamental way than naming or syntax. They represent two different ways of thinking: "thinking in lifecycles" vs "thinking in Effects".** To understand the benefits of thinking in Effects, let's compare how these two snippets evolve over time when you implement a new feature.

### Why "thinking in lifecycles" leads to bugs {/*why-thinking-in-lifecycles-leads-to-bugs*/}

To illustrate the issues with the lifecycle mindset, let's spend more time with the first hypothetical snippet.

Imagine you're adding a new feature that lets the user pick the chat room. The `createConnection()` API now takes a `roomId` argument, which your `ChatRoom` component receives as a prop. Let's update the first snippet:

```js {1,5}
function ChatRoom({ roomId }) {
  // ...
  // 🔴 Not real code: React has no onMount/onUpdate/onUnmount events
  function onMount() {
    connection = createConnection(roomId);
    connection.connect();
  }
  function onUpdate() {
    // Nothing to do
  }
  function onUnmount() {
    connection.disconnect();
  }
  // ...
}
```

There are no other `createConnection()` calls, so it looks like your job is done! However, if you let the user switch the current room while the `ChatRoom` component is already visible, you would notice that nothing happens. **The snippet above doesn't consider that `roomId` can change over time.** To handle this, you'd need to add more code:

```js {9-16}
function ChatRoom({ roomId }) {
  // ...
  // 🔴 Not real code: React has no onMount/onUpdate/onUnmount events
  function onMount() {
    connection = createConnection(roomId);
    connection.connect();
  }
  function onUpdate(prevProps) {
    if (roomId !== prevProps.roomId) {
      // Disconnect from the previous room
      connection.disconnect();

      // Connect to the next room
      connection = createConnection(roomId);
      connection.connect();
    }
  }
  function onUnmount() {
    connection.disconnect();
  }
  // ...
}
```

Now the `ChatRoom` component stays connected to the room with the current `roomId`, even if it changes. Let's retrace the story of how this code evolved. In the beginning, your logic directly mapped to the lifecycle:

1. On mount, connect to the room.
3. On unmount, disconnect from the room.

Then, you've added a `roomId` argument where it was needed:

1. On mount, connect to the room *with `roomId`*.
3. On unmount, disconnect from the room.

But you've forgotten to *also* add logic to handle the fact that `roomId` could change:

1. On mount, connect to the room with `roomId`.
2. On update, *disconnect from the room with the old `roomId`, and connect to the room with the new `roomId`.*
3. On unmount, disconnect from the room.

**When you "think in lifecycles," you split the code according to *when* you think it should run. But as the code evolves and you add features, it's difficult to know whether the way you split it up at first is still correct.** For example, when you used `roomId` during the mount, it was easy to miss that the `connect()` and `disconnect()` calls that were previously only needed during `onMount` and `onUnmount` now also need to run during `onUpdate`.

### How "thinking in Effects" is different {/*how-thinking-in-effects-is-different*/}

When you write an Effect, you won't think about it in terms of handling "mount," "update," or "unmount" events. Instead, you will focus on what the Effect *does,* what props or state it *depends on,* and how to *clean it up:*

1. First, you [write the Effect code.](/learn/synchronizing-with-effects#step-1-declare-an-effect)
2. Then, you [specify its dependencies.](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies) Crucially, you don't *choose* the dependencies. **The dependency array should include all the variables from the components body that are used in the Effect's code.** If you're not happy with the list of dependencies you ended up with (e.g. if your Effect runs too often), go back to step 1 and change the Effect code to *not need them* instead. You'll learn common ways to do this later on this page.
3. Finally, you [add a cleanup function if needed](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed).

Think about how you would describe this Effect. What does it do?

```js
function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, []);
  // ...
```

When you "think in lifecycles," you might say that this Effect connects to the server *on mount* and disconnects *on unmount.* This is an entirely correct way to describe it! But there is also another way to think about it.

When you "think in Effects," you might say that this Effect connects to the server, *does not depend* on any values, and *cleans up* by disconnecting. This is also an entirely correct--but different--way to describe it.

Why does this matter? Let's compare what happens to these descriptions when the requirements change and you add a new feature. Suppose you want to add the ability to connect to different chat rooms, like in the earlier example. Try passing the `roomId` to the `createConnection()` call and you will immediately get a lint error:

```js {1,3,9}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'roomId'
  // ...
```

React "sees" that you use the `roomId` dependency inside the Effect. **Therefore, running it only on mount is now a mistake because the `roomId` prop may change over time, and you need to handle that.** Let's fix the mistake:

```js {9}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
```

This one-line change fixes the bug: now `ChatRoom` will reconnect whenever the `roomId` changes. (It is equivalent to the fix you did in the earlier version where you had to write a whole `onUpdate` method with duplicate logic.)

How would you describe what this Effect does?

When you "think in lifecycles," you might say that this Effect connects to the room with `roomId` *on mount*. **Then, *on update*, if the `roomId` changes, it disconnects from the old `roomId` and connects to the new `roomId`.** Finally, *on unmount,* it disconnects from the room. (Note how this description has gotten significantly more complex.)

When you "think in Effects," you might say that this Effect connects to the room, **depends on the `roomId` prop**, and *cleans up* by disconnecting. When you added the new dependency, the rest happened automatically:

1. **The bug you introduced was caught right away.** You didn't need to "remember" `roomId` can change.
2. **There was no need duplication of code between "mounting" and "updating."** The existing logic was reused.
3. **Describing the Effect did not become more complex** when you added a feature, unlike with lifecycles.

This is why in React, you will write Effects instead of splitting code into phases like mount, update, and unmount.

### Lifecycle as a consequence {/*lifecycle-as-a-consequence*/}

It's still helpful to think in lifecycles when you *analyze* what the component does over time. However, when you write or edit your Effects, try to embrace thinking in Effects. Describe what the Effect does, what it depends on, and how it cleans up. You don't *start* with the lifecycle: the lifecycle is a *consequence* of the code in your Effect.

For example, it's correct to say that **if dependencies are empty, the Effect code runs on mount. But you don't *start* by saying "I want it to run on mount."** You start by writing the Effect code which *did not depend* on any values. And *that* is why it made sense for it to run only on mount. It's a difference in the mindset, not in code.

When you specify `[roomId]` as the dependencies, the Effect runs on mount and when `roomId` changes. **But you don't *start* by thinking "I want to run it on mount and on update." You start by changing the code inside to use `roomId`.** Then the linter reminded you to update the dependencies. This is why it started running on updates too.

To "think in Effects," you should start by writing (or updating) the code inside the Effect. Then you adjust the dependencies to match the code. Then you can switch to "thinking in lifecycles" and verify that the behavior matches what you'd expect. In the above example, it makes perfect sense to connect to the chat room on mount and reconnect whenever the `roomId` changes. But in some cases, you'll want to make some adjustments!

### How to omit a dependency? {/*how-to-omit-a-dependency*/}

**Sometimes, the lifecycle you get by following the rules may not match the lifecycle that you want.** For example, maybe some Effect runs too often because one of its dependencies changes on every render. This may cause wrong behavior (for example, if you log page visits), infinite loops (if you update state from an Effect), or be slow.

You may feel tempted to omit some dependencies from the list. However, if you try to do this, you'll see a linter error. The linter is right: you can't "choose" your dependencies. If your Effect uses a variable from the component body, it must be in the dependencies. **If this causes the Effect to run too often, edit the Effect itself to either *not need* or to *simplify* that dependency.** There are a few common ways to do that. Let's have a look at those!

## Removing Effect dependencies {/*removing-effect-dependencies*/}

TODO

## Recap {/*recap*/}

TODO

## Challenges {/*challenges*/}

TODO