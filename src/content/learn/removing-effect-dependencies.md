---
title: 'Removing Effect Dependencies'
---

<Intro>

When you write an Effect, the linter will verify that you've included every reactive value (like props and state) that the Effect reads in the list of your Effect's dependencies. This ensures that your Effect remains synchronized with the latest props and state of your component. Unnecessary dependencies may cause your Effect to run too often, or even create an infinite loop. Follow this guide to review and remove unnecessary dependencies from your Effects.

</Intro>

<YouWillLearn>

- How to fix infinite Effect dependency loops
- What to do when you want to remove a dependency
- How to read a value from your Effect without "reacting" to it
- How and why to avoid object and function dependencies
- Why suppressing the dependency linter is dangerous, and what to do instead

</YouWillLearn>

## Dependencies should match the code {/*dependencies-should-match-the-code*/}

When you write an Effect, you first specify how to [start and stop](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) whatever you want your Effect to be doing:

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

Then, if you leave the Effect dependencies empty (`[]`), the linter will suggest the correct dependencies:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Fix the mistake here!
  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Fill them in according to what the linter says:

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

[Effects "react" to reactive values.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Since `roomId` is a reactive value (it can change due to a re-render), the linter verifies that you've specified it as a dependency. If `roomId` receives a different value, React will re-synchronize your Effect. This ensures that the chat stays connected to the selected room and "reacts" to the dropdown:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

### To remove a dependency, prove that it's not a dependency {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

Notice that you can't "choose" the dependencies of your Effect. Every <CodeStep step={2}>reactive value</CodeStep> used by your Effect's code must be declared in your dependency list. The dependency list is determined by the surrounding code:

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // This is a reactive value
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads that reactive value
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ So you must specify that reactive value as a dependency of your Effect
  // ...
}
```

[Reactive values](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) include props and all variables and functions declared directly inside of your component. Since `roomId` is a reactive value, you can't remove it from the dependency list. The linter wouldn't allow it:

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'roomId'
  // ...
}
```

And the linter would be right! Since `roomId` may change over time, this would introduce a bug in your code.

**To remove a dependency, "prove" to the linter that it *doesn't need* to be a dependency.** For example, you can move `roomId` out of your component to prove that it's not reactive and won't change on re-renders:

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // Not a reactive value anymore

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
}
```

Now that `roomId` is not a reactive value (and can't change on a re-render), it doesn't need to be a dependency:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

This is why you could now specify an [empty (`[]`) dependency list.](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) Your Effect *really doesn't* depend on any reactive value anymore, so it *really doesn't* need to re-run when any of the component's props or state change.

### To change the dependencies, change the code {/*to-change-the-dependencies-change-the-code*/}

You might have noticed a pattern in your workflow:

1. First, you **change the code** of your Effect or how your reactive values are declared.
2. Then, you follow the linter and adjust the dependencies to **match the code you have changed.**
3. If you're not happy with the list of dependencies, you **go back to the first step** (and change the code again).

The last part is important. **If you want to change the dependencies, change the surrounding code first.** You can think of the dependency list as [a list of all the reactive values used by your Effect's code.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) You don't *choose* what to put on that list. The list *describes* your code. To change the dependency list, change the code.

This might feel like solving an equation. You might start with a goal (for example, to remove a dependency), and you need to "find" the code matching that goal. Not everyone finds solving equations fun, and the same thing could be said about writing Effects! Luckily, there is a list of common recipes that you can try below.

<Pitfall>

If you have an existing codebase, you might have some Effects that suppress the linter like this:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**When dependencies don't match the code, there is a very high risk of introducing bugs.** By suppressing the linter, you "lie" to React about the values your Effect depends on.

Instead, use the techniques below.

</Pitfall>

<DeepDive>

#### Why is suppressing the dependency linter so dangerous? {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

Suppressing the linter leads to very unintuitive bugs that are hard to find and fix. Here's one example:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Let's say that you wanted to run the Effect "only on mount". You've read that [empty (`[]`) dependencies](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) do that, so you've decided to ignore the linter, and forcefully specified `[]` as the dependencies.

This counter was supposed to increment every second by the amount configurable with the two buttons. However, since you "lied" to React that this Effect doesn't depend on anything, React forever keeps using the `onTick` function from the initial render. [During that render,](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `count` was `0` and `increment` was `1`. This is why `onTick` from that render always calls `setCount(0 + 1)` every second, and you always see `1`. Bugs like this are harder to fix when they're spread across multiple components.

There's always a better solution than ignoring the linter! To fix this code, you need to add `onTick` to the dependency list. (To ensure the interval is only setup once, [make `onTick` an Effect Event.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events))

**We recommend treating the dependency lint error as a compilation error. If you don't suppress it, you will never see bugs like this.** The rest of this page documents the alternatives for this and other cases.

</DeepDive>

## Removing unnecessary dependencies {/*removing-unnecessary-dependencies*/}

Every time you adjust the Effect's dependencies to reflect the code, look at the dependency list. Does it make sense for the Effect to re-run when any of these dependencies change? Sometimes, the answer is "no":

* You might want to re-execute *different parts* of your Effect under different conditions.
* You might want to only read the *latest value* of some dependency instead of "reacting" to its changes.
* A dependency may change too often *unintentionally* because it's an object or a function.

To find the right solution, you'll need to answer a few questions about your Effect. Let's walk through them.

### Should this code move to an event handler? {/*should-this-code-move-to-an-event-handler*/}

The first thing you should think about is whether this code should be an Effect at all.

Imagine a form. On submit, you set the `submitted` state variable to `true`. You need to send a POST request and show a notification. You've put this logic inside an Effect that "reacts" to `submitted` being `true`:

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('Successfully registered!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Later, you want to style the notification message according to the current theme, so you read the current theme. Since `theme` is declared in the component body, it is a reactive value, so you add it as a dependency:

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ All dependencies declared

  function handleSubmit() {
    setSubmitted(true);
  }  

  // ...
}
```

By doing this, you've introduced a bug. Imagine you submit the form first and then switch between Dark and Light themes. The `theme` will change, the Effect will re-run, and so it will display the same notification again!

**The problem here is that this shouldn't be an Effect in the first place.** You want to send this POST request and show the notification in response to *submitting the form,* which is a particular interaction. To run some code in response to particular interaction, put that logic directly into the corresponding event handler:

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Good: Event-specific logic is called from event handlers
    post('/api/register');
    showNotification('Successfully registered!', theme);
  }  

  // ...
}
```

Now that the code is in an event handler, it's not reactive--so it will only run when the user submits the form. Read more about [choosing between event handlers and Effects](/learn/separating-events-from-effects#reactive-values-and-reactive-logic) and [how to delete unnecessary Effects.](/learn/you-might-not-need-an-effect)

### Is your Effect doing several unrelated things? {/*is-your-effect-doing-several-unrelated-things*/}

The next question you should ask yourself is whether your Effect is doing several unrelated things.

Imagine you're creating a shipping form where the user needs to choose their city and area. You fetch the list of `cities` from the server according to the selected `country` to show them in a dropdown:

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]); // ✅ All dependencies declared

  // ...
```

This is a good example of [fetching data in an Effect.](/learn/you-might-not-need-an-effect#fetching-data) You are synchronizing the `cities` state with the network according to the `country` prop. You can't do this in an event handler because you need to fetch as soon as `ShippingForm` is displayed and whenever the `country` changes (no matter which interaction causes it).

Now let's say you're adding a second select box for city areas, which should fetch the `areas` for the currently selected `city`. You might start by adding a second `fetch` call for the list of areas inside the same Effect:

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 Avoid: A single Effect synchronizes two independent processes
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ All dependencies declared

  // ...
```

However, since the Effect now uses the `city` state variable, you've had to add `city` to the list of dependencies. That, in turn, introduced a problem: when the user selects a different city, the Effect will re-run and call `fetchCities(country)`. As a result, you will be unnecessarily refetching the list of cities many times.

**The problem with this code is that you're synchronizing two different unrelated things:**

1. You want to synchronize the `cities` state to the network based on the `country` prop.
1. You want to synchronize the `areas` state to the network based on the `city` state.

Split the logic into two Effects, each of which reacts to the prop that it needs to synchronize with:

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]); // ✅ All dependencies declared

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]); // ✅ All dependencies declared

  // ...
```

Now the first Effect only re-runs if the `country` changes, while the second Effect re-runs when the `city` changes. You've separated them by purpose: two different things are synchronized by two separate Effects. Two separate Effects have two separate dependency lists, so they won't trigger each other unintentionally.

The final code is longer than the original, but splitting these Effects is still correct. [Each Effect should represent an independent synchronization process.](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) In this example, deleting one Effect doesn't break the other Effect's logic. This means they *synchronize different things,* and it's good to split them up. If you're concerned about duplication, you can improve this code by [extracting repetitive logic into a custom Hook.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

### Are you reading some state to calculate the next state? {/*are-you-reading-some-state-to-calculate-the-next-state*/}

This Effect updates the `messages` state variable with a newly created array every time a new message arrives:

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

It uses the `messages` variable to [create a new array](/learn/updating-arrays-in-state) starting with all the existing messages and adds the new message at the end. However, since `messages` is a reactive value read by an Effect, it must be a dependency:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ All dependencies declared
  // ...
```

And making `messages` a dependency introduces a problem.

Every time you receive a message, `setMessages()` causes the component to re-render with a new `messages` array that includes the received message. However, since this Effect now depends on `messages`, this will *also* re-synchronize the Effect. So every new message will make the chat re-connect. The user would not like that!

To fix the issue, don't read `messages` inside the Effect. Instead, pass an [updater function](/reference/react/useState#updating-state-based-on-the-previous-state) to `setMessages`:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

**Notice how your Effect does not read the `messages` variable at all now.** You only need to pass an updater function like `msgs => [...msgs, receivedMessage]`. React [puts your updater function in a queue](/learn/queueing-a-series-of-state-updates) and will provide the `msgs` argument to it during the next render. This is why the Effect itself doesn't need to depend on `messages` anymore. As a result of this fix, receiving a chat message will no longer make the chat re-connect.

### Do you want to read a value without "reacting" to its changes? {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

<Wip>

This section describes an **experimental API that has not yet been released** in a stable vesion of React.

</Wip>

Suppose that you want to play a sound when the user receives a new message unless `isMuted` is `true`:

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

Since your Effect now uses `isMuted` in its code, you have to add it to the dependencies:

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ All dependencies declared
  // ...
```

The problem is that every time `isMuted` changes (for example, when the user presses the "Muted" toggle), the Effect will re-synchronize, and reconnect to the chat. This is not the desired user experience! (In this example, even disabling the linter would not work--if you do that, `isMuted` would get "stuck" with its old value.)

To solve this problem, you need to extract the logic that shouldn't be reactive out of the Effect. You don't want this Effect to "react" to the changes in `isMuted`. [Move this non-reactive piece of logic into an Effect Event:](/learn/separating-events-from-effects#declaring-an-effect-event)

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Effect Events let you split an Effect into reactive parts (which should "react" to reactive values like `roomId` and their changes) and non-reactive parts (which only read their latest values, like `onMessage` reads `isMuted`). **Now that you read `isMuted` inside an Effect Event, it doesn't need to be a dependency of your Effect.** As a result, the chat won't re-connect when you toggle the "Muted" setting on and off, solving the original issue!

#### Wrapping an event handler from the props {/*wrapping-an-event-handler-from-the-props*/}

You might run into a similar problem when your component receives an event handler as a prop:

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ All dependencies declared
  // ...
```

Suppose that the parent component passes a *different* `onReceiveMessage` function on every render:

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

Since `onReceiveMessage` is a dependency, it would cause the Effect to re-synchronize after every parent re-render. This would make it re-connect to the chat. To solve this, wrap the call in an Effect Event:

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Effect Events aren't reactive, so you don't need to specify them as dependencies. As a result, the chat will no longer re-connect even if the parent component passes a function that's different on every re-render.

#### Separating reactive and non-reactive code {/*separating-reactive-and-non-reactive-code*/}

In this example, you want to log a visit every time `roomId` changes. You want to include the current `notificationCount` with every log, but you *don't* want a change to `notificationCount` to trigger a log event.

The solution is again to split out the non-reactive code into an Effect Event:

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

You want your logic to be reactive with regards to `roomId`, so you read `roomId` inside of your Effect. However, you don't want a change to `notificationCount` to log an extra visit, so you read `notificationCount` inside of the Effect Event. [Learn more about reading the latest props and state from Effects using Effect Events.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

### Does some reactive value change unintentionally? {/*does-some-reactive-value-change-unintentionally*/}

Sometimes, you *do* want your Effect to "react" to a certain value, but that value changes more often than you'd like--and might not reflect any actual change from the user's perspective. For example, let's say that you create an `options` object in the body of your component, and then read that object from inside of your Effect:

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

This object is declared in the component body, so it's a [reactive value.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) When you read a reactive value like this inside an Effect, you declare it as a dependency. This ensures your Effect "reacts" to its changes:

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ All dependencies declared
  // ...
```

It is important to declare it as a dependency! This ensures, for example, that if the `roomId` changes, your Effect will re-connect to the chat with the new `options`. However, there is also a problem with the code above. To see it, try typing into the input in the sandbox below, and watch what happens in the console:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

In the sandbox above, the input only updates the `message` state variable. From the user's perspective, this should not affect the chat connection. However, every time you update the `message`, your component re-renders. When your component re-renders, the code inside of it runs again from scratch.

A new `options` object is created from scratch on every re-render of the `ChatRoom` component. React sees that the `options` object is a *different object* from the `options` object created during the last render. This is why it re-synchronizes your Effect (which depends on `options`), and the chat re-connects as you type.

**This problem only affects objects and functions. In JavaScript, each newly created object and function is considered distinct from all the others. It doesn't matter that the contents inside of them may be the same!**

```js {7-8}
// During the first render
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// During the next render
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// These are two different objects!
console.log(Object.is(options1, options2)); // false
````

**Object and function dependencies can make your Effect re-synchronize more often than you need.** 

This is why, whenever possible, you should try to avoid objects and functions as your Effect's dependencies. Instead, try moving them outside the component, inside the Effect, or extracting primitive values out of them.

#### Move static objects and functions outside your component {/*move-static-objects-and-functions-outside-your-component*/}

If the object does not depend on any props and state, you can move that object outside your component:

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

This way, you *prove* to the linter that it's not reactive. It can't change as a result of a re-render, so it doesn't need to be a dependency. Now re-rendering `ChatRoom` won't cause your Effect to re-synchronize.

This works for functions too:

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

Since `createOptions` is declared outside your component, it's not a reactive value. This is why it doesn't need to be specified in your Effect's dependencies, and why it won't ever cause your Effect to re-synchronize.

#### Move dynamic objects and functions inside your Effect {/*move-dynamic-objects-and-functions-inside-your-effect*/}

If your object depends on some reactive value that may change as a result of a re-render, like a `roomId` prop, you can't pull it *outside* your component. You can, however, move its creation *inside* of your Effect's code:

```js {7-10,11,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Now that `options` is declared inside of your Effect, it is no longer a dependency of your Effect. Instead, the only reactive value used by your Effect is `roomId`. Since `roomId` is not an object or function, you can be sure that it won't be *unintentionally* different. In JavaScript, numbers and strings are compared by their content:

```js {7-8}
// During the first render
const roomId1 = 'music';

// During the next render
const roomId2 = 'music';

// These two strings are the same!
console.log(Object.is(roomId1, roomId2)); // true
````

Thanks to this fix, the chat no longer re-connects if you edit the input:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

However, it *does* re-connect when you change the `roomId` dropdown, as you would expect.

This works for functions, too:

```js {7-12,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

You can write your own functions to group pieces of logic inside your Effect. As long as you also declare them *inside* your Effect, they're not reactive values, and so they don't need to be dependencies of your Effect.

#### Read primitive values from objects {/*read-primitive-values-from-objects*/}

Sometimes, you may receive an object from props:

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ All dependencies declared
  // ...
```

The risk here is that the parent component will create the object during rendering:

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

This would cause your Effect to re-connect every time the parent component re-renders. To fix this, read information from the object *outside* the Effect, and avoid having object and function dependencies:

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
```

The logic gets a little repetitive (you read some values from an object outside an Effect, and then create an object with the same values inside the Effect). But it makes it very explicit what information your Effect *actually* depends on. If an object is re-created unintentionally by the parent component, the chat would not re-connect. However, if `options.roomId` or `options.serverUrl` really are different, the chat would re-connect.

#### Calculate primitive values from functions {/*calculate-primitive-values-from-functions*/}

The same approach can work for functions. For example, suppose the parent component passes a function:

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

To avoid making it a dependency (and causing it to re-connect on re-renders), call it outside the Effect. This gives you the `roomId` and `serverUrl` values that aren't objects, and that you can read from inside your Effect:

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
```

This only works for [pure](/learn/keeping-components-pure) functions because they are safe to call during rendering. If your function is an event handler, but you don't want its changes to re-synchronize your Effect, [wrap it into an Effect Event instead.](#do-you-want-to-read-a-value-without-reacting-to-its-changes)

<Recap>

- Dependencies should always match the code.
- When you're not happy with your dependencies, what you need to edit is the code.
- Suppressing the linter leads to very confusing bugs, and you should always avoid it.
- To remove a dependency, you need to "prove" to the linter that it's not necessary.
- If some code should run in response to a specific interaction, move that code to an event handler.
- If different parts of your Effect should re-run for different reasons, split it into several Effects.
- If you want to update some state based on the previous state, pass an updater function.
- If you want to read the latest value without "reacting" it, extract an Effect Event from your Effect.
- In JavaScript, objects and functions are considered different if they were created at different times.
- Try to avoid object and function dependencies. Move them outside the component or inside the Effect.

</Recap>

<Challenges>

#### Fix a resetting interval {/*fix-a-resetting-interval*/}

This Effect sets up an interval that ticks every second. You've noticed something strange happening: it seems like the interval gets destroyed and re-created every time it ticks. Fix the code so that the interval doesn't get constantly re-created.

<Hint>

It seems like this Effect's code depends on `count`. Is there some way to not need this dependency? There should be a way to update the `count` state based on its previous value without adding a dependency on that value.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

<Solution>

You want to update the `count` state to be `count + 1` from inside the Effect. However, this makes your Effect depend on `count`, which changes with every tick, and that's why your interval gets re-created on every tick.

To solve this, use the [updater function](/reference/react/useState#updating-state-based-on-the-previous-state) and write `setCount(c => c + 1)` instead of `setCount(count + 1)`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, []);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

Instead of reading `count` inside the Effect, you pass a `c => c + 1` instruction ("increment this number!") to React. React will apply it on the next render. And since you don't need to read the value of `count` inside your Effect anymore, so you can keep your Effect's dependencies empty (`[]`). This prevents your Effect from re-creating the interval on every tick.

</Solution>

#### Fix a retriggering animation {/*fix-a-retriggering-animation*/}

In this example, when you press "Show", a welcome message fades in. The animation takes a second. When you press "Remove", the welcome message immediately disappears. The logic for the fade-in animation is implemented in the `animation.js` file as plain JavaScript [animation loop.](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) You don't need to change that logic. You can treat it as a third-party library. Your Effect creates an instance of `FadeInAnimation` for the DOM node, and then calls `start(duration)` or `stop()` to control the animation. The `duration` is controlled by a slider. Adjust the slider and see how the animation changes.

This code already works, but there is something you want to change. Currently, when you move the slider that controls the `duration` state variable, it retriggers the animation. Change the behavior so that the Effect does not "react" to the `duration` variable. When you press "Show", the Effect should use the current `duration` on the slider. However, moving the slider itself should not by itself retrigger the animation.

<Hint>

Is there a line of code inside the Effect that should not be reactive? How can you move non-reactive code out of the Effect?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect, useRef } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Jump to end immediately
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Start animating
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // We still have more frames to paint
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

<Solution>

Your Effect needs to read the latest value of `duration`, but you don't want it to "react" to changes in `duration`. You use `duration` to start the animation, but starting animation isn't reactive. Extract the non-reactive line of code into an Effect Event, and call that function from your Effect.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // We still have more frames to paint
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

Effect Events like `onAppear` are not reactive, so you can read `duration` inside without retriggering the animation.

</Solution>

#### Fix a reconnecting chat {/*fix-a-reconnecting-chat*/}

In this example, every time you press "Toggle theme", the chat re-connects. Why does this happen? Fix the mistake so that the chat re-connects only when you edit the Server URL or choose a different chat room.

Treat `chat.js` as an external third-party library: you can consult it to check its API, but don't edit it.

<Hint>

There's more than one way to fix this, but ultimately you want to avoid having an object as your dependency.

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom options={options} />
    </div>
  );
}
```

```js ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

Your Effect is re-running because it depends on the `options` object. Objects can be re-created unintentionally, you should try to avoid them as dependencies of your Effects whenever possible.

The least invasive fix is to read `roomId` and `serverUrl` right outside the Effect, and then make the Effect depend on those primitive values (which can't change unintentionally). Inside the Effect, create an object and it pass to `createConnnection`:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom options={options} />
    </div>
  );
}
```

```js ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

It would be even better to replace the object `options` prop with the more specific `roomId` and `serverUrl` props:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Sticking to primitive props where possible makes it easier to optimize your components later.

</Solution>

#### Fix a reconnecting chat, again {/*fix-a-reconnecting-chat-again*/}

This example connects to the chat either with or without encryption. Toggle the checkbox and notice the different messages in the console when the encryption is on and off. Try changing the room. Then, try toggling the theme. When you're connected to a chat room, you will receive new messages every few seconds. Verify that their color matches the theme you've picked.

In this example, the chat re-connects every time you try to change the theme. Fix this. After the fix, changing the theme should not re-connect the chat, but toggling encryption settings or changing the room should re-connect.

Don't change any code in `chat.js`. Other than that, you can change any code as long as it results in the same behavior. For example, you may find it helpful to change which props are being passed down.

<Hint>

You're passing down two functions: `onMessage` and `createConnection`. Both of them are created from scratch every time `App` re-renders. They are considered to be new values every time, which is why they re-trigger your Effect.

One of these functions is an event handler. Do you know some way to call an event handler an Effect without "reacting" to the new values of the event handler function? That would come in handy!

Another of these functions only exists to pass some state to an imported API method. Is this function really necessary? What is the essential information that's being passed down? You might need to move some imports from `App.js` to `ChatRoom.js`.

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

There's more than one correct way to solve this, but here is one possible solution.

In the original example, toggling the theme caused different `onMessage` and `createConnection` functions to be created and passed down. Since the Effect depended on these functions, the chat would re-connect every time you toggle the theme.

To fix the problem with `onMessage`, you needed to wrap it into an Effect Event:

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

Unlike the `onMessage` prop, the `onReceiveMessage` Effect Event is not reactive. This is why it doesn't need to be a dependency of your Effect. As a result, changes to `onMessage` won't cause the chat to re-connect.

You can't do the same with `createConnection` because it *should* be reactive. You *want* the Effect to re-trigger if the user switches between an encrypted and an unencryption connection, or if the user switches the current room. However, because `createConnection` is a function, you can't check whether the information it reads has *actually* changed or not. To solve this, instead of passing `createConnection` down from the `App` component, pass the raw `roomId` and `isEncrypted` values:

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

Now you can move the `createConnection` function *inside* the Effect instead of passing it down from the `App`:

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

After these two changes, your Effect no longer depends on any function values:

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Reactive values
  const onReceiveMessage = useEffectEvent(onMessage); // Not reactive

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Reading a reactive value
      };
      if (isEncrypted) { // Reading a reactive value
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ All dependencies declared
```

As a result, the chat re-connects only when something meaningful (`roomId` or `isEncrypted`) changes:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>
