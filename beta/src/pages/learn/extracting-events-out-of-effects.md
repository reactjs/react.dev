---
title: 'Extracting Events out of Effects'
---

<Intro>

When your Effect's code reads a prop or another reactive value, you must add it to the Effect's dependencies. This ensures that if the component re-renders with a changed value, your Effect will re-synchronize. For example, if your Effect connects to a chat server, it makes sense for it to re-connect every time the user picks a different server. However, sometimes you'll need to read a value from your Effect's code without "reacting" to its changes. You can't do it from inside the Effect, but you can extract an *Event function* out of your Effect's code, and read the value there.

</Intro>

<YouWillLearn>

- How to choose between an event handler and an Effect
- Why Effects are reactive, and event handlers are not
- What to do when you want a part of your Effect's code to not be reactive
- What Event functions are, and how to extract them from your Effects
- How to read the latest props and state from Effects using Event functions

</YouWillLearn>

## Choosing between event handlers and Effects {/*choosing-between-event-handlers-and-effects*/}

Imagine you're implementing a chat room component. Your requirements look like this:

1. Your component should automatically connect to the selected chat room.
1. When you click the "Send" button, it should send a message to the chat.

Let's say you've already implemented the code for them, but you're not sure where to put it. Should you use event handlers or Effects? Every time you need to answer this question, consider [*why* the code needs to run.](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)

### Event handlers run in response to specific interactions {/*event-handlers-run-in-response-to-specific-interactions*/}

From the user's perspective, sending a message should happen *because* the particular "Send" button was clicked. The user will get rather upset if you send their message at any other time or for any other reason. This is why sending a message should be an event handler. Event handlers let you handle specific interactions like clicks:

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>;
    </>
  );
}
```

With an event handler, you can be sure that `sendMessage(message)` will *only* run if the user presses the button.

### Effects run whenever synchronization is needed {/*effects-run-whenever-synchronization-is-needed*/}

Recall that you also need to keep the component connected to the chat room. Where does that code go?

The *reason* to run this code is not some particular interaction. It doesn't matter why or how the user navigated to the chat room screen. Now that they're looking at it and could interact with it, the component needs to stay connected to the selected chat server. Even if the chat room component was the initial screen of your app, and the user has not performed any interactions at all, you would *still* need to connect. This is why it's an Effect:

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

With this code, you can be sure that the active connection will *stay synchronized* with your component. As long as your component is on the page, the user could interact with it--so your Effect ensures they stay connected to the chat. And if the user selects another room, [your Effect will re-synchronize,](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once) re-connecting to the new room.

### More precisely, Effects are reactive, and event handlers are not {/*more-precisely-effects-are-reactive-and-event-handlers-are-not*/}

Intuitively, you could say that event handlers are always triggered "manually," for example by clicking a button. Effects, on the other hand, are "automatic": they run and re-run as often as it's needed to stay synchronized.

Still, this intuition might feel too fuzzy. Often, the logic for a single interaction will be split between an event handler (like selecting a different chat room) and an Effect (like connecting to the selected chat room). You need a way to turn this intuition into something more precise so that it's always clear how to correctly split the logic.



```js
sendMessage(message);
```





