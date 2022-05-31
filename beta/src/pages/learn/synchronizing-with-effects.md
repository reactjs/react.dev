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

1. **Declare an effect that runs after *every* render.** (This is the default behavior when you declare an effect.)
2. **Then, check whether your effect needs dependencies.** Some effects should only re-run *when needed* rather than after every render. For example, a fade-in animation should only trigger when a component appears. Connecting and disconnecting to a chat room should only happen when the component appears and disappears, or when the chat room changes. You will learn how to control this by specifying *dependencies.*
3. **Finally, check whether your effect needs cleanup.** Some effects need to specify how to stop, undo, or clean up whatever they were doing. For example, "connect" needs "disconnect," "subscribe" needs "unsubscribe," and "fetch" needs either "cancel" or "ignore". You will learn how to do this by returning a *cleanup function*.

Let's look at each of these steps in detail.

### Step 1: Declare an effect that runs after every render {/*step-1-declare-an-effect-that-runs-after-every-render*/}

To declare an effect in your component, import the [`useEffect` Hook](/api/useeffect) from React:

```js
import { useEffect } from 'react';
```

Then, call it at the top level of your component and put some code inside your effect:

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // Code here will run after *every* render
  });
  return <div />;
}
```

Every time your component renders, React will update the screen *and then* run the code inside `useEffect`. In other words, **`useEffect` "delays" a piece of code from running until that render is reflected on the screen.**

#### Example: Synchronizing `isPlaying` prop with `play()` and `pause()` calls {/*example-synchronizing-isplaying-prop-with-play-and-pause-calls*/}

Let's see how you can use an effect to synchronize with an external system. Consider a `<VideoPlayer>` React component. It would be nice to control whether it's playing or paused by passing an `isPlaying` prop to it:

```js
<VideoPlayer isPlaying={isPlaying} />;
```

Your custom `VideoPlayer` component renders the built-in browser [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) tag:

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: do something with isPlaying
  return <video src={src} />;
}
```

However, the browser `<video>` tag does not have an `isPlaying` prop. The only way to control it is to manually call the [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) and [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) methods on the DOM element. **You need to synchronize the value of `isPlaying` prop, which tells whether the video _should_ currently be playing, with imperative calls like `play()` and `pause()`.**

[Get a ref](/learn/manipulating-the-dom-with-refs) to the `<video>` DOM node, and put the synchronization logic into the effect:

```js {6-12}
import { useEffect, useRef } from 'react';

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
```

When your `VideoPlayer` component renders (either the first time or if it re-renders), a few things will happen. First, React will update the screen, ensuring the `<video>` tag is in the DOM with the right props. Then React will run your effect. Finally, your effect will call `play()` or `pause()` depending on the value of `isPlaying` prop.

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

In this example, the "external system" you synchronized to React state was the browser media API. You can use a similar approach to wrap legacy non-React code (like jQuery plugins) into declarative React components.

(Keep in mind that this example is simplified. Controlling video playback has many edge cases not shown here.)

<DeepDive title="What happens if you call play() and pause() outside the effect?">

Try commenting out the 6th and 12th lines in the above example to see what happens when the `play()` and `pause()` calls run during rendering. The code will crash because the `<video>` tag does not yet exist in the DOM. **By using an effect, you tell React to put `<video>` in the DOM, and _then_ do something.**

There are other important practical reasons for wrapping side effects like DOM manipulation into an effect. If you use a server-rendering framework that runs React components to generate HTML, calling `play()` and `pause()` outside of an effect would crash. This is because the DOM does not exist on the server at all. Wrapping this code in an effect fixes this because effects are always ignored on the server.

In general you should always [treat rendering as a pure calculation](/learn/keeping-components-pure). During rendering, all you want to do is to calculate the returned JSX. If your component needs to *do* something because of a particular event, the logic should go into that event handler. And if your component needs to *do* something as a result of rendering, wrap that logic in an effect. React will run it [after committing changes to the screen.](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom)

</DeepDive>

<Gotcha>

By default, effects run after *every* render. This is why code like this will **produce an infinite loop:**

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

Effects run as a *result* of rendering. Setting state *triggers* rendering. Setting state immediately in an effect is like plugging a power outlet into itself. The effect runs, it sets the state, which causes a re-render, which causes the effect to run, it sets the state again, this causes another re-render, and so on.

Effects should usually synchronize your components with an *external* system. If there's no external system and you only want to adjust some state based on other state, [you might not need an effect.](/learn/you-might-not-need-an-effect)

</Gotcha>

### Step 2: Check whether your effect needs dependencies {/*step-2-check-whether-your-effect-needs-dependencies*/}

By default, effects run after *every* render. Often, this is **not what you want:**

- Sometimes, it's slow. Synchronizing with an external system is not always instant, so you might want to skip doing it unless it's necessary. For example, you don't want to reconnect to the chat server on every keystroke.
- Sometimes, it's wrong. For example, you don't want to trigger a component fade-in animation on every keystroke. The animation should only play once when the component appears for the first time.

Here is how you can instruct React to skip re-running effects.

#### Example: skipping unnecessary `play`/`pause` calls {/*example-skipping-unnecessary-playpause-calls*/}

This example is similar to the one before, but it logs when `play` and `pause` are called. It also has a text input that updates the parent component's state. Open the console and notice that typing into the input re-runs the effect:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

You can tell React to **skip unnecessarily re-running the effect** by specifying an array of *dependencies* as the second argument to the `useEffect` call. Start by adding an empty `[]` array to the above example on line 14:

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

You should see an error saying `React Hook useEffect has a missing dependency: 'isPlaying'`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, []); // This causes an error

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

The problem is that the code inside of your effect *depends on* the `isPlaying` prop to decide what to do, but this dependency was not explicitly declared. To fix this issue, add `isPlaying` to the dependency array:

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // It's used here...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...so it must be declared here!
```

Now all dependencies are declared, so there is no error. Specifying `[isPlaying]` as the dependency array tells React that it should skip re-running your effect if `isPlaying` is the same as it was during the previous render. With this change, typing into the input doesn't cause the effect to re-run, but pressing Play/Pause does:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

You can specify more than a single dependency. React only skips re-running the effect if *all* of the dependencies have the same values as they had during the previous render. See the [`useEffect` API reference](/apis/useeffect#reference) for more details.

**Notice that you can't "choose" your dependencies.** You will get a lint error if the dependencies you specified don't match what React expects based on the code inside your effect. This helps catch many bugs in your code. If your effect uses some value but you *don't* want to re-run the effect when it changes, you'll need to *edit the effect code itself* to not "need" that dependency. Learn more about this in [Specifying the Effect Dependencies](/learn/specifying-effect-dependencies).

#### Running effects only on mount {/*running-effects-only-on-mount*/}

Consider a different example. You're writing a `ChatRoom` component that needs to connect to the chat server when it appears. You are given a `createConnection()` API that returns an object with `connect()` and `disconnect()` methods. How do you keep the component connected while it is displayed to the user?

Start by writing the effect logic:

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

If you type into the input and look at the console, you'll notice the same problem as in the previous example:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  });

  return (
    <>
      <h1>Welcome to the chat!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
    </>
  );
}
```

```js chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('Connecting...');
    },
    disconnect() {
      console.log('Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

Typing updates the state, which causes a re-render and re-runs the effect. This is why `"Connecting..."` is printed on every keystroke. To avoid reconnecting on every keystroke, add the dependency array:

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**An empty dependency array like `[]` tells React to only run this code when the component "mounts," i.e. appears on the screen for the first time.** Now, when you type into the input, the chat won't reconnect:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);

  return (
    <>
      <h1>Welcome to the chat!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
    </>
  );
}
```

```js chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('Connecting...');
    },
    disconnect() {
      console.log('Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

In the video player example, `[]` caused a lint error because the effect code depended on the `isPlaying` prop. But in this example, `[]` is valid because the effect code does not depend on *any* value outside the effect--it has *empty* dependencies. It does not depend on anything, so there's no reason to re-run this effect again and again.

However, if the effect called `createConnection(serverUrl, roomId)`, where `serverUrl` and `roomId` are props to `ChatRoom`, the linter would force you to declare `[serverUrl, roomId]` as dependencies instead of `[]`. This is because connecting to the chat *depends on* the server URL and the room ID. If they change, you need to reconnect. The linter rule enforces this and catches bugs from running such code only "on mount."

<Gotcha>

The behaviors *without* the dependency array and with an *empty* `[]` dependency array are very different:

```js {3,7}
useEffect(() => {
  // ...
}); // Runs after every render

useEffect(() => {
  // ...
}, []); // Runs only on mount (when the component appears)
```

</Gotcha>

### Step 3: Check whether your effect needs cleanup {/*step-3-check-whether-your-effect-needs-cleanup*/}

However, there is still a second issue you need to fix. If you press "Reset" on the sandbox and look at the console while it loads, you will notice that `"Connecting..."` is printed twice instead of once as you might expect.

**Why does the effect run twice even with `[]` dependencies?**

The problem with this effect is that it's missing *cleanup*. Often, effects need to specify how to stop, undo, or clean up whatever they were doing. For example, "connect" needs "disconnect," "subscribe" needs "unsubscribe," and "fetch" needs either "cancel" or "ignore".


## Why does React run  {/*why-does-react-run*/}

- changing deps
- navigation
