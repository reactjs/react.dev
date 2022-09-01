---
title: Escape Hatches
---

<Intro>

Sometimes you may need to “step outside” React to communicate with external APIs or state. In this chapter, you'll learn how to use escape hatches, and when they're appropriate. If much of your application logic and data flow relies on escape hatches, you might want to rethink your approach.

</Intro>

<YouWillLearn isChapter={true}>

* [How to "remember" information without re-rendering](/learn/referencing-values-with-refs)
* [How to access DOM elements managed by React](/learn/manipulating-the-dom-with-refs)
* [How to synchronize components with external systems](/learn/synchronizing-with-effects)
* [How to remove unnecessary Effects from your components](/learn/you-might-not-need-an-effect)
* [How an Effect’s lifecycle is different from a component’s](/learn/lifecycle-of-reactive-effects)
* [How to extract Event functions from your Effects](/learn/separating-events-from-effects)
* [How to remove unnecessary dependencies from your Effects](/learn/removing-effect-dependencies)

</YouWillLearn>

## Referencing values with refs {/*referencing-values-with-refs*/}

When you want a component to "remember" some information, but you don't want that information to [trigger new renders](/learn/render-and-commit), you can use a *ref*:

```js
const ref = useRef(0);
```

You can access the current value of that ref through the `ref.current` property. This value is intentionally mutable, meaning you can both read and write to it. It's like a secret pocket of your component that React doesn't track.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

<LearnMore path="/learn/referencing-values-with-refs">

Read **[Referencing Values with Refs](/learn/referencing-values-with-refs)** to learn how to use refs to remember information.

</LearnMore>

## Manipulating the DOM with refs {/*manipulating-the-dom-with-refs*/}

React automatically updates the DOM to match your render output, so your components won’t often need to manipulate it. However, sometimes you might need access to the DOM elements managed by React—for example, to focus a node, scroll to it, or measure its size and position. There is no built-in way to do those things in React, so you will need a ref to the DOM node.

In this example, clicking the button will focus the input using a ref:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/manipulating-the-dom-with-refs">

Read **[Manipulating the DOM with Refs](/learn/manipulating-the-dom-with-refs)** to learn how to access DOM elements managed by React.

</LearnMore>

## Synchronizing with Effects {/*synchronizing-with-effects*/}

Some components need to synchronize with external systems. For example, you might want to control a non-React component based on the React state, set up a server connection, or send an analytics log when a component appears on the screen. Effects let you run some code after rendering so that you can synchronize your component with some system outside of React.

```js
import { useEffect } from 'react';
```

Press Play/Pause multiple times and see how the video player stays synchronized to the `isPlaying` value:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

<LearnMore path="/learn/synchronizing-with-effects">

Read **[Synchronizing with Effects](/learn/synchronizing-with-effects)** to learn how to synchronize components with external systems.

</LearnMore>

## You Might Not Need An Effect {/*you-might-not-need-an-effect*/}

Effects are an escape hatch from the React paradigm. They let you “step outside” of React and synchronize your components with some external system like a non-React widget, network, or the browser DOM. If there is no external system involved (for example, if you want to update a component’s state when some props or state change), you shouldn’t need an Effect. Removing unnecessary Effects will make your code easier to follow, faster to run, and less error-prone.

There are two common cases in which you don’t need Effects:
- **You don’t need Effects to transform data for rendering.**
- **You don’t need Effects to handle user events.**

You do need Effects to synchronize with external systems. 

<LearnMore path="/learn/synchronizing-with-effects">

Read **[You Might Not Need an Effect](/learn/you-might-not-need-an-effect)** to review some common concrete examples.

</LearnMore>

## Lifecycle of reactive effects {/*lifecycle-of-reactive-effects*/}

Effects have a different lifecycle from components. Components may mount, update, or unmount. An Effect can only do two things: to start synchronizing something, and later to stop synchronizing it. This cycle can happen multiple times if your Effect depends on props and state that change over time. React provides a linter rule to check that you’ve specified your Effect’s dependencies correctly. This keeps your Effect synchronized to the latest props and state.

Try to think about each Effect independently from your component’s lifecycle. An Effect describes how to synchronize an external system to the current props and state. As your code changes, this synchronization will need to happen more or less often.

<LearnMore path="/learn/synchronizing-with-effects">

Read **[Lifecycle of Reactive Events](/learn/lifecycle-of-reactive-effects)** to learn how an Effect’s lifecycle is different from a component’s.

</LearnMore>

## Separating events from effects {/*separating-events-from-effects*/}

Event handlers only re-run when you perform the same interaction again. Unlike event handlers, Effects re-synchronize if some value they read, like a prop or a state variable, is different from what it was during the last render. Sometimes, you also want a mix of both behaviors: an Effect that re-runs in response to some values but not others. For that, you can use Event functions.

You can think of Event functions as being very similar to event handlers. The main difference is that event handlers run in response to a user interactions, whereas Event functions are triggered by you from Effects.

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { useEvent } from './useEvent.js';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, onConnected]); // TODO: Linter will allow [roomId] in the future

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'} 
      />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js notifications.js hidden
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

```js useEvent.js
import { useRef, useInsertionEffect, useCallback } from 'react';

// The useEvent API has not yet been added to React,
// so this is a temporary shim to make this sandbox work.
// You're not expected to write code like this yourself.

export function useEvent(fn) {
  const ref = useRef(null);
  useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);
  return useCallback((...args) => {
    const f = ref.current;
    return f(...args);
  }, []);
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>


<LearnMore path="/learn/synchronizing-with-effects">

Read **[Separating Events from Effects](/learn/separating-events-from-effects)** to learn how to extract Event functions from your Effects.

</LearnMore>

## Removing effect dependencies {/*removing-effect-dependencies*/}

When you write an Effect, the linter will verify that you’ve included every reactive value (like props and state) that the Effect reads in the list of your Effect’s dependencies. This ensures that your Effect remains synchronized with the latest props and state of your component. Unnecessary dependencies may cause your Effect to run too often, or even create an infinite loop.

If you want to change the dependencies, change the surrounding code first. You can think of the dependency list as a list of all the reactive values used by your Effect’s code. You don’t intentionally choose what to put on that list. The list describes your code. To change the dependency list, change the code.

<LearnMore path="/learn/synchronizing-with-effects">

Read **[Removing Effect Dependencies](/learn/removing-effect-dependencies)** to learn how to remove unnecessary dependencies from your Effects.

</LearnMore>

## What's next? {/*whats-next*/}

Head over to [Referencing Values with Refs](/learn/referencing-values-with-refs) to start reading this chapter page by page!
