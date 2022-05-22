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

## Step 1: Declare an effect that runs after every render {/*step-1-declare-an-effect-that-runs-after-every-render*/}

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

  return <video ref={ref} src={src} loop />;
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

  return <video ref={ref} src={src} loop />;
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

<DeepDive title="What happens if you call play() and pause() outside the effect?">

Try commenting out the 6th and 12th lines in the above example to see what happens when the `play()` and `pause()` calls run during rendering. The code will crash because the `<video>` tag does not yet exist in the DOM. **By using an effect, you tell React to put `<video>` in the DOM, and _then_ do something.**

There are other important practical reasons for wrapping side effects like DOM manipulation into an effect. If you use a server-rendering framework that runs React components to generate HTML, calling `play()` and `pause()` outside of an effect would crash. This is because the DOM does not exist on the server at all. Wrapping this code in an effect fixes this because effects are always ignored on the server.

In general you should always [treat rendering as a pure calculation](/learn/keeping-components-pure). During rendering, all you want to do is to calculate the returned JSX. If your component needs to *do* something because of a particular event, the logic should go into that event handler. And if your component needs to *do* something as a result of rendering, wrap that logic in an effect. React will run it [after committing changes to the screen.](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom)

</DeepDive>

<Gotcha>

By default, effects run after *every* render. This is why code like this will **produce an infinite loop:**

```js
useEffect(() => {
  setCounter(counter + 1);
});
```

Effects run as a *result* of rendering. Setting state *triggers* rendering. Setting state immediately in an effect is like plugging a power outlet into itself. The effect runs, it sets the state, which causes a re-render, which causes the effect to run, it sets the state again, this causes another re-render, and so on.

Effects should usually synchronize your components with an *external* system. If there's no external system and you only want to adjust some state based on other state, [you might not need an effect.](/learn/you-might-not-need-an-effect)

</Gotcha>

## Step 2: Check whether your effect needs dependencies {/*step-2-check-whether-your-effect-needs-dependencies*/}

By default, effects run after *every* render. Often, this is **not what you want:**

- Sometimes, it's slow. Synchronizing with an external system is not always instant, so you might want to skip doing it unless it's necessary. For example, you don't want to reconnect to the chat server on every keystroke.
- Sometimes, it's wrong. For example, you don't want to trigger a component fade-in animation on every keystroke. The animation should only play once when the component appears for the first time.

To demonstrate the issue, here is the previous example with a few `console.log` calls and a text input that updates the parent component's state. Open the console and notice how typing causes the effect to re-run:

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

  return <video ref={ref} src={src} loop />;
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

  return <video ref={ref} src={src} loop />;
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

  return <video ref={ref} src={src} loop />;
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

The dependency array can contain multiple dependencies. React will only skip re-running the effect if *all* of the dependencies you specify have exactly the same values as they had during the previous render. React compares the dependency values using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. See the [`useEffect` API reference](/apis/useeffect#reference) for more details.

**Notice that you can't "choose" your dependencies.** When you specify the dependencies, you will get a lint error if they don't match what React expects based on the code inside your effect. This helps catch many bugs in your code. However, this can be a problem if your effect uses some value but you *don't* want to re-run the effect when that value changes. When you're faced with this problem, the correct fix is to *change the effect code itself* to not "need" that dependency. You will learn common strategies to do that in [Specifying the Effect Dependencies](/learn/specifying-effect-dependencies).

<Gotcha>

The behaviors *without* the dependency array and with an *empty* `[]` dependency array are very different:

```js {3,7}
useEffect(() => {
  // This runs after every render
});

useEffect(() => {
  // This runs only on mount (when the component appears)
}, []);
```

We'll take a close look at what "mount" means in the next step.

</Gotcha>

## Step 3: Check whether your effect needs cleanup {/*step-3-check-whether-your-effect-needs-cleanup*/}

Consider a different example. You're writing a `ChatRoom` component that needs to connect to the chat server when it appears. You are given a `createConnection()` API that returns an object with `connect()` and `disconnect()` methods. How do you keep the component connected while it is displayed to the user?

Start by writing the effect logic:

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

It would be slow to connect to the chat after every re-render, so you add the dependency array:

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

The code inside the effect does not use any props or state, so your dependency array is `[]` (empty). This tells React to only run this code when the component "mounts," i.e. appears on the screen for the first time.

Let's try running this code:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
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

This effect only runs on mount, so you might expect `Connecting...` to be printed once in the console. However, it gets printed twice! During development, React stress-tests your components by mounting them twice.

**You might be wondering: "How to I run an effect once?" However, that's not the right question. The right question is: "Why does remounting break my effect?"** You need to fix the problem at its source. By mounting your component twice, React simulates what happens when you navigate to another page and then back to this component. Then, even without this stress-test, you'd also see two `Connecting...` logs (and two connections being set up). By mounting your component twice in development, React exposes a bug in your code sooner.

To fix the actual issue, you need to return a *cleanup function* from your effect:

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

React will call your cleanup function each time before the effect runs again, and one final time when the component unmounts (gets removed). Let's see what happens when the cleanup function is implemented:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
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

Now you get three console logs in development:

1. `Connecting...`
2. `Disconnected.`
3. `Connecting...`

This means that your cleanup function is working! In development, React simulates what happens when the user navigates away from your component and then comes back to it. Previously, your component incorrectly set up two connections. Thanks to React immediately remounting your component in development, you noticed this issue, and fixed it by implementing the cleanup function. Now only one connection is active at a time.

**Don't worry about the extra request in development. In production, the component would only mount once.** The development-only remounting behavior is opt-in and only enabled when your app is wrapped in [Strict Mode](/apis/strictmode). We strongly recommend to keep it on. Strict Mode makes existing issues in your code show up earlier. While it can be frustrating to fix them so early, this makes your code more resilient to future changes in your app's requirements.

<DeepDive title="What are some common cleanup patterns?">

If your effect subscribes to something, the cleanup function should unsubscribe:

```js {3}
useEffect(() => {
  window.addEventListener('resize', handleScroll);
  return () => window.removeEventListener('resize', handleScroll);
}, []);
```

If your effect fetches something, the cleanup function should abort the fetch:

```js {10}
useEffect(() => {
  const controller = new AbortController();
  const signal = controller.signal;

  fetchUser(userId, { signal }).then(result => {
    signal.throwIfAborted();
    setResult(result);
  });

  return () => controller.abort();
}, [userId]);
```

Alternatively, you can set a local variable to tell the effect to ignore the fetch result:

```js {2,10-12}
useEffect(() => {
  let ignore = false;

  fetchUser(userId).then(result => {
    if (!ignore) {
      setResult(result);
    }
  });

  return () => {
    ignore = true;
  };
}, [userId]);
```

Cleaning up your effect ensures that your component works well if it gets removed from the page and then added again. It also ensures that if a dependency (like `userId` above) changes, the "outdated" effect (which may already be fetching something) does not conflict with fetching the next `userId`. 

</DeepDive>

## Recap {/*recap*/}

- Unlike events, effects are caused by rendering itself rather than a particular interaction.
- Effects let you synchronize a component with some external system (third-party API, network, etc).
- By default, effects run after every render (including the initial one).
- React will skip an effect you specify dependencies, and all of them are the same as during the last render.
- You can't "choose" your dependencies. They are determined by the code inside the effect.
- An empty dependency array (`[]`) corresponds to the component "mounting", i.e. being added to the screen.
- When Strict Mode us in, React mounts components twice (in development only!) to stress-test your effects.
- If your effect breaks because of remounting, you need to implement a cleanup function.
- React will call your cleanup function before the effect runs next time, and during the unmount.

## Challenges {/*challenges*/}

TODO
