---
title: 'Reusing Logic with Custom Hooks'
---

<Intro>

React comes with several built-in Hooks like `useState`, `useContext`, and `useEffect`. Sometimes, you'll wish that there was a Hook for some more specific purpose: for example, to fetch data, to keep track of whether the user is online, or to connect to a chat room. You might not find these Hooks in React, but you can create your own Hooks for your application's needs.

</Intro>

<YouWillLearn>

- What custom Hooks are, and how to write your own
- How to reuse logic between components
- How to name and structure your custom Hooks
- When and why to extract custom Hooks

</YouWillLearn>

## Custom Hooks: Sharing logic between components {/*custom-hooks-sharing-logic-between-components*/}

Imagine you're developing an app that heavily relies on the network (as most apps do). You want to warn the user if their network connection has accidentally gone off while they were using your app. How would you go about it?

It seems like you'll need two things in your component:

1. A piece of state that tracks whether the network is online.
2. An Effect that subscribes to the global [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) and [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) events, and updates that state.

This will keep your component [synchronized](/learn/synchronizing-with-effects) with the network status. You might start with something like this:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

</Sandpack>

Try turning your network on and off, and notice how this `StatusBar` updates in response to your actions.

Now imagine you *also* want to use the same logic in a different component. You want to implement a Save button that will become disabled and show "Reconnecting..." instead of "Save" while the network is off.

To start, you can copy and paste the `isOnline` state and the Effect into `SaveButton`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

</Sandpack>

Verify that, if you turn off the network, the button will change its appearance.

These two components work fine, but the duplication in logic between them is unfortunate. It seems like even though they have different *visual appearance,* you want to reuse the logic between them.

### Extracting your own custom Hook from a component {/*extracting-your-own-custom-hook-from-a-component*/}

Imagine for a moment that, similar to [`useState`](/apis/react/useState) and [`useEffect`](/apis/react/useEffect), there was a built-in `useOnlineStatus` Hook. Then both of these components could be simplified and you could remove the duplication between them:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

Although there is no such built-in Hook, you can write it yourself. Declare a function called `useOnlineStatus` and move all the duplicated code into it from the components you wrote earlier:

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

At the end of the function, return `isOnline`. This lets your components read that value:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

Verify that switching the network on and off updates both components.

Now your components don't have as much repetitive logic. **More importantly, the code inside them describes *what they want to do* (use the online status!) rather than *how to do it* (by subscribing to the browser events).**

When you extract logic into custom Hooks, you can hide the gnarly details of how you deal with some external system or a browser API. The code of your components expresses your intent, not the implementation.

### Hook names always start with `use` {/*hook-names-always-start-with-use*/}

React applications are built from components. Components are built from Hooks, whether built-in or custom. You'll likely often use custom Hooks created by others, but occasionally you might write one yourself!

You must follow these naming conventions:

1. **React component names must start with a capital letter,** like `StatusBar` and `SaveButton`. React components also need to return something that React knows how to display, like a piece of JSX.
2. **Hook names must start with `use` followed by a capital letter,** like [`useState`](/apis/react/useState) (built-in) or `useOnlineStatus` (custom, like earlier on the page). Hooks may return arbitrary values.

This convention guarantees that you can always look at a component and know where its state, Effects, and other React features might "hide". For example, if you see a `getColor()` function call inside your component, you can be sure that it can't possibly contain React state inside because its name doesn't start with `use`. However, a function call like `useOnlineStatus()` will most likely contain calls to other Hooks inside!

<Note>

If your linter is [configured for React,](/learn/editor-setup#linting) it will enforce this naming convention. Scroll up to the sandbox above and rename `useOnlineStatus` to `getOnlineStatus`. Notice that the linter won't allow you to call `useState` or `useEffect` inside of it anymore. Only Hooks and components can call other Hooks!

</Note>

<DeepDive>

#### Should all functions called during rendering start with the use prefix? {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

No. Functions that don't *call* Hooks don't need to *be* Hooks.

If your function doesn't call any Hooks, avoid the `use` prefix. Instead, write it as a regular function *without* the `use` prefix. For example, `useSorted` below doesn't call Hooks, so call it `getSorted` instead:

```js
// 🔴 Avoid: A Hook that doesn't use Hooks
function useSorted(items) {
  return items.slice().sort();
}

// ✅ Good: A regular function that doesn't use Hooks
function getSorted(items) {
  return items.slice().sort();
}
```

This ensures that your code can call this regular function anywhere, including conditions:

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ It's ok to call getSorted() conditionally because it's not a Hook
    displayedItems = getSorted(items);
  }
  // ...
}
```

You should give `use` prefix to a function (and thus make it a Hook) if it uses at least one Hook inside of it:

```js
// ✅ Good: A Hook that uses other Hooks
function useAuth() {
  return useContext(Auth);
}
```

Technically, this isn't enforced by React. In principle, you could make a Hook that doesn't call other Hooks. This is often confusing and limiting so it's best to avoid that pattern. However, there may be rare cases where it is helpful. For example, maybe your function doesn't use any Hooks right now, but you plan to add some Hook calls to it in the future. Then it makes sense to name it with the `use` prefix:

```js {3-4}
// ✅ Good: A Hook that will likely use some other Hooks later
function useAuth() {
  // TODO: Replace with this line when authentication is implemented:
  // return useContext(Auth);
  return TEST_USER;
}
```

Then components won't be able to call it conditionally. This will become important when you actually add Hook calls inside. If you don't plan to use Hooks inside it (now or later), don't make it a Hook.

</DeepDive>

### Custom Hooks let you share stateful logic, not state itself {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

In the earlier example, when you turned the network on and off, both components updated together. However, it's wrong to think that a single `isOnline` state variable is shared between them. Look at this code:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

It works the same way as before you extracted the duplication:

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

These are two completely independent state variables and Effects! They only happened to have the same value at the same time because you synchronized them with the same external value (whether the network is on).

To better illustrate this, we'll need a different example. Consider this `Form` component:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

There's some repetitive logic for each form field:

1. There's a piece of state (`firstName` and `lastName`).
1. There's a change handler (`handleFirstNameChange` and `handleLastNameChange`).
1. There's a piece of JSX that specifies the `value` and `onChange` attributes for that input.

You can extract the repetitive logic into this `useFormInput` custom Hook:

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Notice that it only declares *one* state variable called `value`.

However, the `Form` component calls `useFormInput` *two times:*

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

This is why it works like declaring two separate state variables!

**Custom Hooks let you share *stateful logic* but not *state itself.* Each call to a Hook is completely independent from every other call to the same Hook.** This is why the two sandboxes above are completely equivalent. If you'd like, scroll back up and compare them. The behavior before and after extracting a custom Hook is identical.

When you need to share the state itself between multiple components, [lift it up and pass it down](/learn/sharing-state-between-components) instead.

## Passing reactive values between Hooks {/*passing-reactive-values-between-hooks*/}

The code inside your custom Hooks will re-run during every re-render of your component. This is why, like components, custom Hooks [need to be pure.](/learn/keeping-components-pure) Think of custom Hooks' code as part of your component's body!

Because custom Hooks re-render together with your component, they always receive the latest props and state. To see what this means, consider this chat room example. Change the server URL or the selected chat room:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
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
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
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
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
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

export function showNotification(message, theme = 'dark') {
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

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

When you change `serverUrl` or `roomId`, the Effect ["reacts" to your changes](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) and re-synchronizes. You can tell by the console messages that the chat re-connects every time that you change your Effect's dependencies.

Now move the Effect's code into a custom Hook:

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

This lets your `ChatRoom` component call your custom Hook without worrying about how it works inside:

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

This looks much simpler! (But it does the same thing.)

Notice that the logic *still responds* to prop and state changes. Try editing the server URL or the selected room:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
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
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
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
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
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

export function showNotification(message, theme = 'dark') {
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

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Notice how you're taking the return value of one Hook:

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

and pass it as an input to another Hook:

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

Every time your `ChatRoom` component re-renders, it passes the latest `roomId` and `serverUrl` to your Hook. This is why your Effect re-connects to the chat whenever their values are different after a re-render. (If you ever worked with music processing software, chaining Hooks like this might remind you of chaining multiple audio effects, like adding reverb or chorus. It's as if the output of `useState` "feeds into" the input of the `useChatRoom`.)

### Passing event handlers to custom Hooks {/*passing-event-handlers-to-custom-hooks*/}

<Wip>

This section describes an **experimental API that has not yet been added to React,** so you can't use it yet.

</Wip>

As you start using `useChatRoom` in more components, you might want to let different components customize its behavior. For example, currently, the logic for what to do when a message arrives is hardcoded inside the Hook:

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Let's say you want to move this logic back to your component:

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
```

To make this work, change your custom Hook to take `onReceiveMessage` as one of its named options:

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ All dependencies declared
}
```

This will work, but there's one more improvement you can do when your custom Hook accepts event handlers.

Adding a dependency on `onReceiveMessage` is not ideal because it will cause the chat to re-connect every time the component re-renders. [Wrap this event handler into an Effect Event to remove it from the dependencies:](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
}
```

Now the chat won't re-connect every time that the `ChatRoom` component re-renders. Here is a fully working demo of passing an event handler to a custom Hook that you can play with:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js useChatRoom.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
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
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
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
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
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

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Notice how you no longer need to know *how* `useChatRoom` works in order to use it. You could add it to any other component, pass any other options, and it would work the same way. That's the power of custom Hooks.

## When to use custom Hooks {/*when-to-use-custom-hooks*/}

You don't need to extract a custom Hook for every little duplicated bit of code. Some duplication is fine. For example, extracting a `useFormInput` Hook to wrap a single `useState` call like earlier is probably unnecessary.

However, whenever you write an Effect, consider whether it would be clearer to also wrap it in a custom Hook. [You shouldn't need Effects very often,](/learn/you-might-not-need-an-effect) so if you're writing one, it means that you need to "step outside React" to synchronize with some external system or to do something that React doesn't have a built-in API for. Wrapping your Effect into a custom Hook lets you precisely communicate your intent and how the data flows through it.

For example, consider a `ShippingForm` component that displays two dropdowns: one shows the list of cities, and another shows the list of areas in the selected city. You might start with some code that looks like this:

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // This Effect fetches cities for a country
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
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // This Effect fetches areas for the selected city
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
  }, [city]);

  // ...
```

Although this code is quite repetitive, [it's correct to keep these Effects separate from each other.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) They synchronize two different things, so you shouldn't merge them into one Effect. Instead, you can simplify the `ShippingForm` component above by extracting the common logic between them into your own `useData` Hook:

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

Now you can replace both Effects in the `ShippingForm` components with calls to `useData`:

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

Extracting a custom Hook makes the data flow explicit. You feed the `url` in and you get the `data` out. By "hiding" your Effect inside `useData`, you also prevent someone working on the `ShippingForm` component from adding [unnecessary dependencies](/learn/removing-effect-dependencies) to it. Ideally, with time, most of your app's Effects will be in custom Hooks.

<DeepDive>

#### Keep your custom Hooks focused on concrete high-level use cases {/*keep-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

Start by choosing your custom Hook's name. If you struggle to pick a clear name, it might mean that your Effect is too coupled to the rest of your component's logic, and is not yet ready to be extracted.

Ideally, your custom Hook's name should be clear enough that even a person who doesn't write code often could have a good guess about what your custom Hook does, what it takes, and what it returns:

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

When you synchronize with an external system, your custom Hook name may be more technical and use jargon specific to that system. It's good as long as it would be clear to a person familiar with that system:

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**Keep custom Hooks focused on concrete high-level use cases.** Avoid creating and using custom "lifecycle" Hooks that act as alternatives and convenience wrappers for the `useEffect` API itself:

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

For example, this `useMount` Hook tries to ensure some code only runs "on mount":

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 Avoid: using custom "lifecycle" Hooks
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 Avoid: creating custom "lifecycle" Hooks
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'fn'
}
```

**Custom "lifecycle" Hooks like `useMount` don't fit well into the React paradigm.** For example, this code example has a mistake (it doesn't "react" to `roomId` or `serverUrl` changes), but the linter won't warn you about it because the linter only checks direct `useEffect` calls. It won't know about your Hook.

If you're writing an Effect, start by using the React API directly:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Good: two raw Effects separated by purpose

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

Then, you can (but don't have to) extract custom Hooks for different high-level use cases:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Great: custom Hooks named after their purpose
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**A good custom Hook makes the calling code more declarative by constraining what it does.** For example, `useChatRoom(options)` can only connect to the chat room, while `useImpressionLog(eventName, extraData)` can only send an impression log to the analytics. If your custom Hook API doesn't constrain the use cases and is very abstract, in the long run it's likely to introduce more problems than it solves.

</DeepDive>

### Custom Hooks help you migrate to better patterns {/*custom-hooks-help-you-migrate-to-better-patterns*/}

Effects are an ["escape hatch"](/learn/escape-hatches): you use them when you need to "step outside React" and when there is no better built-in solution for your use case. With time, the React team's goal is to reduce the number of the Effects in your app to the minimum by providing more specific solutions to more specific problems. Wrapping Effects in custom Hooks makes it easier to upgrade your code when these solutions become available. Let's return to this example:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

In the above example, `useOnlineStatus` is implemented with a pair of [`useState`](/apis/react/useState) and [`useEffect`.](/apis/react/useEffect) However, this isn't the best possible solution. There is a number of edge cases it doesn't consider. For example, it assumes that when the component mounts, `isOnline` is already `true`, but this may be wrong if the network already went offline. You can use the browser [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) API to check for that, but using it directly would break if you run your React app on the server to generate the initial HTML. In short, this code could be improved.

Luckily, React 18 includes a dedicated API called [`useSyncExternalStore`](/apis/react/useSyncExternalStore) which takes care of all of these problems for you. Here is how your `useOnlineStatus` Hook, rewritten to take advantage of this new API:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // How to get the value on the client
    () => true // How to get the value on the server
  );
}

```

</Sandpack>

Notice how **you didn't need to change any of the components** to make this migration:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

This is another reason for why wrapping Effects in custom Hooks is often beneficial:

1. You make the data flow to and from your Effects very explicit.
2. You let your components focus on the intent rather than on the exact implementation of your Effects.
3. When React adds new features, you can remove those Effects without changing any of your components.

Similar to a [design system,](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969) you might find it helpful to start extracting common idioms from your app's components into custom Hooks. This will keep your components' code focused on the intent, and let you avoid writing raw Effects very often. There are also many excellent custom Hooks maintained by the React community.

<DeepDive>

#### Will React provide any built-in solution for data fetching? {/*will-react-provide-any-built-in-solution-for-data-fetching*/}

We're still working out the details, but we expect that in the future, you'll write data fetching like this:

```js {1,4,6}
import { use } from 'react'; // Not available yet!

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

If you use custom Hooks like `useData` above in your app, it will require fewer changes to migrate to the eventually recommended approach than if you write raw Effects in every component manually. However, the old approach will still work fine, so if you feel happy writing raw Effects, you can continue to do that.

</DeepDive>

### There is more than one way to do it {/*there-is-more-than-one-way-to-do-it*/}

Let's say you want to implement a fade-in animation *from scratch* using the browser [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) API. You might start with an Effect that sets up an animation loop. During each frame of the animation, you could change the opacity of the DOM node you [hold in a ref](/learn/manipulating-the-dom-with-refs) until it reaches `1`. Your code might start like this:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // We still have more frames to paint
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

To make the component more readable, you might extract the logic into a `useFadeIn` custom Hook:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // We still have more frames to paint
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

You could keep the `useFadeIn` code as is, but you could also refactor it more. For example, you could extract the logic for setting up the animation loop out of `useFadeIn` into a new custom Hook called `useAnimationLoop`:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js useFadeIn.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

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

</Sandpack>

However, you didn't *have to* do that. As with regular functions, ultimately you decide where to draw the boundaries between different parts of your code. For example, you could also take a very different approach. Instead of keeping the logic in the Effect, you could move most of the imperative logic inside a JavaScript [class:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
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
    if (progress === 1) {
      this.stop();
    } else {
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
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Effects let you connect React to external systems. The more coordination between Effects is needed (for example, to chain multiple animations), the more it makes sense to extract that logic out of Effects and Hooks *completely* like in the sandbox above. Then, the code you extracted *becomes* the "external system". This lets your Effects stay simple because they only need to send messages to the system you've moved outside React.

The examples above assume that the fade-in logic needs to be written in JavaScript. However, this particular fade-in animation is both simpler and much more efficient to implement with a plain [CSS Animation:](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

Sometimes, you don't even need a Hook!

<Recap>

- Custom Hooks let you share logic between components.
- Custom Hooks must be named starting with `use` followed by a capital letter.
- Custom Hooks only share stateful logic, not state itself.
- You can pass reactive values from one Hook to another, and they stay up-to-date.
- All Hooks re-run every time your component re-renders.
- The code of your custom Hooks should be pure, like your component's code.
- Wrap event handlers received by custom Hooks into Effect Events.
- Don't create custom Hooks like `useMount`. Keep their purpose specific.
- It's up to you how and where to choose the boundaries of your code.

</Recap>

<Challenges>

#### Extract a `useCounter` Hook {/*extract-a-usecounter-hook*/}

This component uses a state variable and an Effect to display a number that increments every second. Extract this logic into a custom Hook called `useCounter`. Your goal is to make the `Counter` component implementation look exactly like this:

```js
export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

You'll need to write your custom Hook in `useCounter.js` and import it into the `Counter.js` file.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
// Write your custom Hook in this file!
```

</Sandpack>

<Solution>

Your code should look like this:

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

Notice that `App.js` doesn't need to import `useState` or `useEffect` anymore.

</Solution>

#### Make the counter delay configurable {/*make-the-counter-delay-configurable*/}

In this example, there is a `delay` state variable controlled by a slider, but its value is not used. Pass the `delay` value to your custom `useCounter` Hook, and change the `useCounter` Hook to use the passed `delay` instead of hardcoding `1000` ms.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

Pass the `delay` to your Hook with `useCounter(delay)`. Then, inside the Hook, use `delay` instead of the hardcoded `1000` value. You'll need to add `delay` to your Effect's dependencies. This ensures that a change in `delay` will reset the interval.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### Extract `useInterval` out of `useCounter` {/*extract-useinterval-out-of-usecounter*/}

Currently, your `useCounter` Hook does two things. It sets up an interval, and it also increments a state variable on every interval tick. Split out the logic that sets up the interval into a separate Hook called `useInterval`. It should take two arguments: the `onTick` callback, and the `delay`. After this change, your `useCounter` implementation should look like this:

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

Write `useInterval` in the `useInterval.js` file and import it into the `useCounter.js` file.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js useInterval.js
// Write your Hook here!
```

</Sandpack>

<Solution>

The logic inside `useInterval` should set up and clear the interval. It doesn't need to do anything else.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

Note that there is a bit of a problem with this solution, which you'll solve in the next challenge.

</Solution>

#### Fix a resetting interval {/*fix-a-resetting-interval*/}

In this example, there are *two* separate intervals.

The `App` component calls `useCounter`, which calls `useInterval` to update the counter every second. But the `App` component *also* calls `useInterval` to randomly update the page background color every two seconds.

For some reason, the callback that updates the page background never runs. Add some logs inside `useInterval`:

```js {2,5}
  useEffect(() => {
    console.log('✅ Setting up an interval with delay ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Clearing an interval with delay ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

Do the logs match what you expect to happen? If some of your Effects seem to re-synchronize unnecessarily, can you guess which dependency is causing that to happen? Is there some way to [remove that dependency](/learn/removing-effect-dependencies) from your Effect?

After you fix the issue, you should expect the page background to update every two seconds.

<Hint>

It looks like your `useInterval` Hook accepts an event listener as an argument. Can you think of some way to wrap that event listener so that it doesn't need to be a dependency of your Effect?

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

Inside `useInterval`, wrap the tick callback into an Effect Event, as you did [earlier on this page.](/learn/reusing-logic-with-custom-hooks#passing-event-handlers-to-custom-hooks)

This will allow you to omit `onTick` from dependencies of your Effect. The Effect won't re-synchronize on every re-render of the component, so the page background color change interval won't get reset every second before it has a chance to fire.

With this change, both intervals work as expected and don't interfere with each other:

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js active
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### Implement a staggering movement {/*implement-a-staggering-movement*/}

In this example, the `usePointerPosition()` Hook tracks the current pointer position. Try moving your cursor or your finger over the preview area and see the red dot follow your movement. Its position is saved in the `pos1` variable.

In fact, there are five (!) different red dots being rendered. You don't see them because currently they all appear at the same position. This is what you need to fix. What you want to implement instead is a "staggered" movement: each dot should "follow" the previous dot's path. For example, if you quickly move your cursor, the first dot should follow it immediately, the second dot should follow the first dot with a small delay, the third dot should follow the second dot, and so on.

You need to implement the `useDelayedValue` custom Hook. Its current implementation returns the `value` provided to it. Instead, you want to return the value back from `delay` milliseconds ago. You might need some state and an Effect to do this.

After you implement `useDelayedValue`, you should see the dots move following one another.

<Hint>

You'll need to store the `delayedValue` as a state variable inside your custom Hook. When the `value` changes, you'll want to run an Effect. This Effect should update `delayedValue` after the `delay`. You might find it helpful to call `setTimeout`.

Does this Effect need cleanup? Why or why not?

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: Implement this Hook
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

Here is a working version. You keep the `delayedValue` as a state variable. When `value` updates, your Effect schedules a timeout to update the `delayedValue`. This is why the `delayedValue` always "lags behind" the actual `value`.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

Note that this Effect *does not* need cleanup. If you called `clearTimeout` in the cleanup function, then each time the `value` changes, it would reset the already scheduled timeout. To keep the movement continuous, you want all the timeouts to fire.

</Solution>

</Challenges>
