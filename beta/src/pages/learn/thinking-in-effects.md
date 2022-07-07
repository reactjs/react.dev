---
title: 'Thinking in Effects'
---

<Intro>

When you pass an event handler to JSX, you explicitly specify which event it runs in response to. But when you write an Effect, it's the code *inside* the Effect that determines when it runs. Writing Effects requires you to think in a different mindset. This page will help you grasp it.

</Intro>

<YouWillLearn>

- When Effects fire
- How to think about writing and editing Effects
- How to choose Effect dependencies
- What an empty dependency array means
- What's a dependency lint error and how to fix it
- How to fix an Effect that fires too often

</YouWillLearn>

## Events vs Effects {/*events-vs-effects*/}

To understand Effects, it helps to compare and contrast them with event handlers.

Event handlers let you handle particular interactions. For example, clicking an "Open chat" button needs to make the chat appear on the screen. After you write that event handler, you always explicitly specify *which* interaction it handles. To do this, you pass your handler to an element in your JSX, like `<button onClick={handleClick}`:

```js
function handleClick() {
  setActiveTab('chat');
  post('/analytics', { name: 'chat_button_clicked' });
}

// ... somewhere in the JSX ...
<button onClick={handleClick}>
  Open chat
</button>
```

With Effects, it's the other way around. It's the code *inside* the Effect that determines when your Effect will run. This page will help you grasp this way of thinking. This shift in perspective is crucial to understanding Effects.

## Effects "react" to values like props and state {/*effects-react-to-values-like-props-and-state*/}

This Effect keeps the `ChatRoom` component connected to a chat server:

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
}
```

*(If this syntax looks unfamiliar, you might want to read [Synchronizing with Effects](/learn/synchronizing-with-effects) before reading this page.)*

Let's ask a similar question: when does this Effect run?

The `[roomId]` dependency array specifies that this Effect *depends* on the `roomId`. In other words, it "reacts" to every value of the `roomId` prop. It runs when the component is added to the screen. Later, whenever the `roomId` prop changes, the previous Effect cleans up (and disconnects from the previous room), while the next Effect connects to the next room. This keeps the active connection synchronized with the value of the `roomId` prop.

It would be technically correct to say that the dependency array determines when the Effect runs. However, it misses a very important nuance. **Conceptually, it's the code *inside* the Effect that determines when the Effect runs.** You don't write the code and then "choose" your dependencies. Instead, dependencies "follow the code:"

1. You write or edit the code inside your Effect.
2. You specify or edit the dependencies *according to the code inside your Effect*.
3. The Effect runs *according to the dependencies you specified*.

This means that when you edit your Effect's code, you'll usually need to update its dependencies. Conversely, when you're not happy with the *dependencies,* what you need to edit is the *code.* When you get familiar with both of these workflows, you will feel a lot more comfortable with writing Effects. Let's look at both of them.

## Dependencies "follow the code" {/*dependencies-follow-the-code*/}

First, you'll see how (and why) updating the code leads to updating the dependencies.

Let's say you're adding a feature that the user pick a chat server. You're passing the selected server as a `serverUrl` prop to the `ChatRoom` component, so all that's left to do is to pass it along to `createConnection`:

```js {1,3}
function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

If you only change these two lines, you will introduce a bug. The `ChatRoom` component will connect to the initial `serverUrl` correctly. Alas, when the user picks a different server in the dropdown, nothing will happen. However, as soon as they also pick a *different room,* the `ChatRoom` will reconnect. Can you guess why that happens?

If your linter is [correctly configured for React,](/learn/editor-setup#linting) it will point you directly to the bug:

```js {6}
function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // 🔴 React Hook useEffect has a missing dependency: 'serverUrl'
  // ...
}
```

This looks like a React error, but really it's React pointing out a logical mistake in this code. As it's written now, this Effect is only "reacting" to the `roomId` prop. Since only `roomId` is in the dependency array, React will skip re-running the Effect for renders with the same `roomId` as before. However, from the user's perspective, that is wrong. If you pick a different *server*, you'd *also* want to reconnect--even if the selected room hasn't changed!

To fix this bug, follow the linter's suggestion and add the missing `serverUrl` dependency:

```js {6}
function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
}
```

This Effect will first run when the `ChatRoom` is added to the screen. It will connect to the initial `serverUrl` and `roomId`. (In development, this will [happen twice](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) to help you find bugs.) After the `ChatRoom` component receives a different value of either `serverUrl` or `roomId`, **the Effect for the previous `roomId` and `serverUrl` will "clean up", disconnecting from that room, and the Effect for the next `roomId` and `serverUrl` will connect to the next room.** When the `ChatRoom` component is removed from the screen, it will disconnect from the last chat room.

More concisely, you could say that this Effect depends on `roomId` and `serverUrl`, so it "reacts" to their values (including the initial ones). Every time there's a different pair of `roomId` and `serverUrl`, it connects to the room. When it's time to clean up, it disconnects. That cycle repeats whenever either of the dependencies changes.

Let's recap what has happened:

1. You edited the code, potentially introducing a bug.
2. The linter found the bug and suggested a change *to make the dependencies match the Effect code*.
3. You accepted the linter's suggestion, which (correctly) *made your Effect run more often than before*.

Dependencies should always "follow the code". This ensures that your Effect's behavior doesn't fall out of sync with the props and state displayed in the user interface. Note that unlike with an event handler, it's hard for you to tell which interaction *caused* the Effect: it could be an "Open chat" button click, a "Choose server" dropdown select event, or a "Join room" button click. This should not be a problem because that's what Effects are for: they let you write synchronization logic that "reacts" to the props and state regardless of the exact user action.

<DeepDive title="Should every variable referenced inside the Effect be a dependency?">

Only values that participate in the rendering data flow--and therefore could change over time--are dependencies. This includes every value that's defined **directly inside the component**, such as props props, state, and any other variable that's directly inside the component and is used by the Effect:

```js {6,9,13}
import { useContext, useEffect } from 'react';
import { createConnection } from './api.js';

function ChatRoom({ roomId, serverUrl }) {
  const authData = useContext(AuthContext);
  const authToken = authData.token; // This variable is declared directly inside a component
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId, {
      authToken // It's used inside the Effect...
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl, authToken]); // ...so it's one of the dependencies.
  // ...
}
```

This *also* includes functions, which you'll read about below on this page.

</DeepDive>

## To change the dependencies, change the code {/*to-change-the-dependencies-change-the-code*/}

TODO

## Separating independent Effects {/*separating-independent-effects*/}

TODO

## Removing unnecessary dependencies {/*removing-unnecessary-dependencies*/}

TODO

## Recap {/*recap*/}

TODO

## Challenges {/*challenges*/}

TODO
