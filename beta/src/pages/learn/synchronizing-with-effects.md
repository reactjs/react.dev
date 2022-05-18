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

**Don't rush to add effects to your components.** First, check whether the logic you want to add can be expressed as a [pure calculation](/learn/keeping-components-pure) during rendering. In that case, it's not an effect. Is this logic specific to a particular interaction, like a button click? Then it might be better placed in an [event handler](/learn/responding-to-events). Keep in mind that effects are typically used to "step out" of your React code and synchronize with some *external* system. This includes browser APIs, third-party widgets, network, and so on. To write an effect, follow these three steps:

1. **Declare an effect that runs after *every* render.** (This is the default behavior when you declare an effect.)
2. **Then, check whether your effect needs cleanup.** Some effects need to specify how to stop, undo, or clean up whatever they were doing. For example, "connect" needs "disconnect," "subscribe" needs "unsubscribe," and "fetch" needs either "cancel" or "ignore". You will learn how to do this by returning a *cleanup function*.
3. **Finally, check whether your effect needs dependencies.** Some effects should only re-run *when needed* rather than after every render. For example, a fade-in animation should only trigger when a component appears. Connecting and disconnecting to a chat room should only happen when the component appears and disappears, or when the chat room changes. You will learn how to control this by specifying *dependencies.*

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

### Example: Synchronizing `isPlaying` prop to `play()` and `pause()` calls {/*example-synchronizing-isplaying-prop-to-play-and-pause-calls*/}

Let's synchronize an external system with React props or state. Consider a `<VideoPlayer>` React component. It would be convenient to control whether it's playing or paused by passing an `isPlaying` value to it as a prop:

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

<DeepDive title="What happens if you call play() and pause() outside the effect?">

Try commenting out the 6th and 12th lines in the above example to see what happens when the `play()` and `pause()` calls run during rendering. The code will crash because the `<video>` tag does not yet exist in the DOM. **By using an effect, you tell React to put `<video>` in the DOM, and _then_ do something.**

There are other important practical reasons for wrapping side effects like DOM manipulation into an effect. If you use a server-rendering framework that runs React components to generate HTML, calling `play()` and `pause()` outside of an effect would crash. This is because the DOM does not exist on the server at all. Wrapping this code in an effect fixes this because effects are always ignored on the server.

In general you should always [treat rendering as a pure calculation](/learn/keeping-components-pure). During rendering, all you want to do is to calculate the returned JSX. If your component needs to *do* something because of a particular event, the logic should go into that event handler. And if your component needs to *do* something as a result of rendering, wrap that logic in an effect. React will run it [after committing changes to the screen.](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom)

</DeepDive>

In this example, the "external system" you synchronized to React state was the browser media API. You can use a similar approach to wrap legacy non-React code (like jQuery plugins) into declarative React components.

Note that `play()` and `pause()` methods above get called **after every render.** Whether `VideoPlayer` renders for the first time, or re-renders for any reason, the effect will run--even if the `isPlaying` prop did not change! This is not a problem because calling `play()` on an already playing video doesn't do anything (the video keeps playing.) But for many other effects, this re-firing can be a problem. Let's look at a case like this and how to solve it.

## Step 2: Check whether your effect needs cleanup {/*step-2-check-whether-your-effect-needs-cleanup*/}

TODO

## Step 3: Check whether your effect needs dependencies {/*step-3-check-whether-your-effect-needs-dependencies*/}

TODO

