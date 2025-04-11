---
title: "React Labs: What We've Been Working On – April 2025"
author: Ricky Hanlon,  Lauren Tan, Mofei Zhang, Jordan Eldredge, Jack Pope, Matt Carroll
date: 2025/04/01
description: TODO
---

April 1, 2025 by [Ricky Hanlon](https://twitter.com/rickhanlonii), Lauren Tan, Mofei Zhang, Jordan Eldredge, Jack Pope, Matt Carroll

---

<Intro>

In React Labs posts we write about projects in active research and development. We’ve made significant progress since [React Conf](/blog/2024/05/22/react-conf-2024-recap), including releasing [React 19](/blog/2024/12/05/react-19) and the [React Compiler beta](/blog/2024/10/21/react-compiler-beta-release), and we’d like to share what we’re working on now.

</Intro>

<Note>

React Conf 2025 is scheduled for October 7–8 in Henderson, Nevada! 

We're looking for speakers to work with us to create talks covering the features we're working on in this post. If you're interested in speaking at ReactConf, [please apply here](https://forms.reform.app/react-conf/call-for-speakers/piaae1?ga4_visitor_id=c3e8f3ce-2004-47a5-b801-f6b308280acd) (no talk proposal required).

For more info on tickets, free streaming, sponsoring, and more, see [the React Conf website](https://conf.react.dev).

</Note>

Today, we're excited to release docs for three new experimental features ready for testing:

- [View Transitions](#view-transitions)
- [Activity](#activity)
- [React Performance Tracks](#react-performance-tracks)

We're also sharing updates on new features currently in development:
- [Automatic Effect Dependencies](#automatic-effect-dependencies)
- [Fragment Refs](#fragment-refs)
- [React Compiler](#react-compiler)
- [IDE extension](#ide-extension)
- [Concurrent stores](#concurrent-stores)


---

# New Experimental Features {/*new-experimental-features*/}


## View Transitions {/*view-transitions*/}

[//]: # (TODO: waiting for content to load: https://developer.chrome.com/docs/web-platform/view-transitions/cross-document#render-blocking)


Today, we're publishing docs for new experimental APIs to support animations in React:

- [`<ViewTransition>`](/TODO): A component lets you activate an animation for a Transition.
- [`addTransitionType`](/TODO): A function that allows you to specify the cause of a Transition.

These new animation APIs integrate React with the new `startViewTransition` API available in modern browsers. In this post, we want to share how we are exploring the integration of View Transitions with React, and how you can use them build smooth animations in your app.

<Note>

**View Transitions are experimental and not available in a stable version of React yet.**

We're ready for users to start testing View Transitions as an experimental feature. It has been tested in production and we are confident it's stable, but the final API might change while we iterate on feedback.

View Transitions are currently only implemented in React DOM. In the future, we plan to support them in more renderers, including React Native.

</Note>

Creating smooth and visually appealing transitions between different views in application is a common challenge. Recently, [Chrome and Safari](https://caniuse.com/view-transitions) have shipped the [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) to address this need for the web.

There are two forms of the browser View Transition API:
- [Same-document view transitions using `document.startViewTransition()`.](https://developer.chrome.com/docs/web-platform/view-transitions/same-document)
- [Cross-document view transitions using `pageswap` and `pagereveal` events.](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document)

For React apps, cross-document View Transitions are already supported. The more interesting problem for client-rendered libraries like React, is supporting same-document View Transitions where JavaScript is used to update the DOM.

To understand the challenge, let's first look into how same-document View Transitions work.

### Same-document View Transitions {/*same-document-view-transitions*/}

To perform a same-document view transition, you can call `document.startViewTransition`:

```js [[1, 1, "document.startViewTransition"], [2, 2, "updateTheDOMSomehow();"]]
document.startViewTransition(() => {
  updateTheDOMSomehow();
});
```

The <CodeStep step={1}>`startViewTransition`</CodeStep> function takes a callback to update the DOM. Before running the callback, the browser takes a snapshot of the "old" DOM. Then, the callback <CodeStep step={2}>to update the DOM</CodeStep> in run to determine the "new" DOM state. After the callback finishes, the browser constructs a psuedo-element tree of the "old" and "new" state:

```
::view-transition
└─ ::view-transition-group(root)
   └─ ::view-transition-image-pair(root)
      ├─ ::view-transition-old(root)  <-- the old state 
      └─ ::view-transition-new(root)  <-- the new state
```

Finally, the browser performs an animation from the "old" DOM snapshot to the "new" DOM. By default, the browser uses a cross-fade animation, but you can customize the animation using the `::view-transition-old` and `::view-transition-new` pseudo-elements. For example, we can increase the duration of the default animation to 5 seconds:

```css
::view-transition-old(root),
::view-transition-new(root) {
    animation-duration: 5s;
}
```

To see it in action, here's a simple example of a View Transition that cross-fades between two cards:

<Sandpack>

```js src/App.js active
const card = document.getElementById("card");

function fade(reversed) {
  document.startViewTransition(() => {
    card.style.backgroundColor = reversed ? "" : "#23272f";
  });
}

let flipped = false;
document.getElementById("fade-button").addEventListener("click", () => {
  fade(flipped);
  flipped = !flipped;
});
```

```js src/index.js hidden
import './App.js'
import './animations.css'
```

```html public/index.html
<body>
<button id="fade-button">Fade</button>
<div class="card" id="card">
  <img
    id="card-image"
    height="100"
    width="100"
    src="https://react.dev/images/brand/logo_dark.svg"
  />
</div>
</body>

```

```css src/animations.css
.card {
    position: relative;
    width: 200px;
    height: 200px;
    border: 1px solid #ccc;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px;
}
```

</Sandpack>

When the button is clicked, the entire page cross-fades, with every element using the same animation. This is a sensible default that works for many transitions.

But let's say want to animate only part of the page, or to animate different parts of the page with different animations. For that, we can use the [`view-transition-name`](https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name) CSS property to specify the specific animation for each element.

For example, let's add a different 'Flip' button to animate the card flipping:

<Sandpack>

```js src/App.js active
const card = document.getElementById("card");

function flip(reversed) {
  card.style.viewTransitionName = "flip";
  document.startViewTransition(() => {
    card.style.backgroundColor = reversed ? "" : "#23272f";
    flipped = !flipped;
  });
}

function fade(reversed) {
  document.startViewTransition(() => {
    card.style.backgroundColor = reversed ? "" : "#23272f";
    flipped = !flipped;
  });
}

let flipped = false;
document.getElementById("flip-button").addEventListener("click", () => {
  flip(flipped);
  flipped = !flipped;
});
document.getElementById("fade-button").addEventListener("click", () => {
  fade(flipped);
  flipped = !flipped;
});
```

```js src/index.js hidden
import './App.js'
import './animations.css'
```

```html public/index.html
<body>
<button id="flip-button">Flip</button>
<button id="fade-button">Fade</button>
<div class="card" id="card">
  <img
    id="card-image"
    height="100"
    width="100"
    src="https://react.dev/images/brand/logo_dark.svg"
  />
</div>
</body>
```

```css src/animations.css
@keyframes flip-front {
    0% {
        transform: rotateY(0deg);
    }
    50% {
        transform: rotateY(-90deg);
    }
    100% {
        transform: rotateY(-90deg);
    }
}

@keyframes flip-back {
    0% {
        transform: rotateY(90deg);
    }
    50% {
        transform: rotateY(90deg);
    }
    100% {
        transform: rotateY(0deg);
    }
}

::view-transition-old(flip) {
    animation: 300ms ease-in-out flip-front;
}

::view-transition-new(flip) {
    animation: 300ms ease-in-out flip-back;
}

.card {
    position: relative;
    width: 200px;
    height: 200px;
    border: 1px solid #ccc;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px;
}
```

</Sandpack>


Now the `Flip` button works, but you may notice that the `Fade` button is broken. If you click "Flip" and then "Fade", the card still flips. This happens because we added a `view-transition-name` to the element, but didn't remove it. So when the next animation runs, it uses the same animation as before.

This is a common pitfall with View Transitions, which is why the `view-transition-name` should [only be added when elements are actively involved in a transition](https://x.com/jaffathecake/status/1697541871847748098). You can do that by adding the `view-transition-name` before calling `startViewTransition` and removing it after the transition is done:

```js [[1, 1, "element.style.viewTransitionName = 'some-name';"], [2, 7, "await transition.updateCallbackDone;"], [3, 9, "element.style.viewTransitionName = '';"]]
element.style.viewTransitionName = 'some-name';

const transition = document.startViewTransition(() => {
  updateTheDOMSomehow();
});

await transition.updateCallbackDone;

element.style.viewTransitionName = '';
```

We <CodeStep step={1}>add</CodeStep> the name before starting the transition, and <CodeStep step={3}>remove</CodeStep> the name after the transition completes. Since `startViewTransition` is async, we need to <CodeStep step={2}>wait</CodeStep> for the transition to finish before removing the `view-transition-name`.

Now the buttons to work independently:

<Sandpack>

```js src/App.js active
const card = document.getElementById("card");

async function flip(reversed) {
  card.style.viewTransitionName = "flip";
  const transition = document.startViewTransition(() => {
    card.style.backgroundColor = reversed ? "" : "#23272f";
  });
  
  await transition.updateCallbackDone;

  card.style.viewTransitionName = "";
}

function fade(reversed) {
  document.startViewTransition(() => {
    card.style.backgroundColor = reversed ? "" : "#23272f";
  });
}

let flipped = false;
document.getElementById("flip-button").addEventListener("click", () => {
  flip(flipped);
  flipped = !flipped;
});
document.getElementById("fade-button").addEventListener("click", () => {
  fade(flipped);
  flipped = !flipped;
});
```

```js src/index.js hidden
import './App.js'
import './animations.css'
```

```html public/index.html
<body>
<button id="flip-button">Flip</button>
<button id="fade-button">Fade</button>
<div class="card" id="card">
  <img
    id="card-image"
    height="100"
    width="100"
    src="https://react.dev/images/brand/logo_dark.svg"
  />
</div>
</body>

```

```css src/animations.css
@keyframes flip-front {
    0% {
        transform: rotateY(0deg);
    }
    50% {
        transform: rotateY(-90deg);
    }
    100% {
        transform: rotateY(-90deg);
    }
}

@keyframes flip-back {
    0% {
        transform: rotateY(90deg);
    }
    50% {
        transform: rotateY(90deg);
    }
    100% {
        transform: rotateY(0deg);
    }
}

::view-transition-old(flip) {
    animation: flip-front 0.5s ease-in-out;
}

::view-transition-new(flip) {
    animation: flip-back 0.5s ease-in-out;
}

.card {
    position: relative;
    width: 200px;
    height: 200px;
    border: 1px solid #ccc;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px; 
  }
```

</Sandpack>


This works well, but there's one more problem. Try clicking the buttons above quickly. You'll notice that while the transition is in progress, the buttons are non-interactive - clicking does nothing.

There are two reasons for this: first, the browser pauses rendering at the beginning of startTransition while you make your mutations. That means your mutations inside `startTransition` need to be as fast as possible to keep the app interactive while an animation is in progress. That's not a problem here, because the update is fast.

The second reason, which is what happens here, is that by default the root of the entire app is included in the transition. That means when you click, the thing you're clicking is not the button, but the _snapshot_ of the "old" state. That's why the button doesn't depress when you click it - you're not clicking the button, you're clicking an image of the button.

To fix, we can apply these styles:

```css
html { view-transition-name: none }

::view-transition {
  width: 0;
  height: 0;
}
```

And now you can click the button while the animation is in progress:

<Sandpack>

```js src/App.js active
const card = document.getElementById("card");

async function flip(reversed) {
  card.style.viewTransitionName = "flip";
  const transition = document.startViewTransition(() => {
    card.style.backgroundColor = reversed ? "" : "#23272f";
  });
  
  await transition.updateCallbackDone;

  card.style.viewTransitionName = "";
}

function fade(reversed) {
  document.startViewTransition(() => {
    card.style.backgroundColor = reversed ? "" : "#23272f";
  });
}

let flipped = false;
document.getElementById("flip-button").addEventListener("click", () => {
  flip(flipped);
  flipped = !flipped;
});
document.getElementById("fade-button").addEventListener("click", () => {
  fade(flipped);
  flipped = !flipped;
});
```

```js src/index.js hidden
import './App.js'
import './animations.css'
```

```html public/index.html
<body>
<button id="flip-button">Flip</button>
<button id="fade-button">Fade</button>
<div class="card" id="card">
  <img
    id="card-image"
    height="100"
    width="100"
    src="https://react.dev/images/brand/logo_dark.svg"
  />
</div>
</body>

```

```css src/animations.css
@keyframes flip-front {
    0% {
        transform: rotateY(0deg);
    }
    50% {
        transform: rotateY(-90deg);
    }
    100% {
        transform: rotateY(-90deg);
    }
}

@keyframes flip-back {
    0% {
        transform: rotateY(90deg);
    }
    50% {
        transform: rotateY(90deg);
    }
    100% {
        transform: rotateY(0deg);
    }
}

::view-transition-old(flip) {
    animation: flip-front 0.5s ease-in-out;
}

::view-transition-new(flip) {
    animation: flip-back 0.5s ease-in-out;
}

html { view-transition-name: none }

::view-transition {
    width: 0;
    height: 0;
}

.card {
    position: relative;
    width: 200px;
    height: 200px;
    border: 1px solid #ccc;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px; 
  }
```

</Sandpack>


These examples show three important considerations for integrating the View Transition API:
- The DOM must be mutated inside the async `startViewTransition` API.
- Elements must be carefully opt-ed in to participate in particular transitions.
- Elements outside the transition must be managed to avoid blocking user interactions.

With this context, we can now explore how to integrate it with React.

### Problem 1: triggering `startViewTransition` {/*problem-1-triggering-startviewtransition*/}

If we only needed an API to flush DOM mutations inside of `document.startViewTransition`, React provides an escape hatch called [`flushSync`](/reference/react-dom/flushSync) to force React to update the DOM.

You can already call `flushSync` to use View Transitions in React today:

<Sandpack>

```js src/App.js active
import { useState, useRef } from "react";
import { flushSync } from "react-dom";
import "./animations.css";

export default function App() {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef(null);

  const handleFlip = async () => {
    ref.current.style.viewTransitionName = "flip";
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setFlipped(!flipped);
      });
    });
    await transition.updateCallbackDone;

    ref.current.style.viewTransitionName = "";
  };
  const handleFade = () => {
    flushSync(() => {
      document.startViewTransition(() => setFlipped(!flipped));
    });
  };

  return (
    <div>
      <button onClick={handleFlip}>Flip</button>
      <button onClick={handleFade}>Fade</button>
      <div
        ref={ref}
        style={{ backgroundColor: flipped ? "#fff" : "#23272f" }}
        className="card"
        id="card"
      >
        <img
          id="card-image"
          height="100"
          width="100"
          src="https://react.dev/images/brand/logo_dark.svg"
        />
      </div>
    </div>
  );
}

```

```css src/animations.css
@keyframes flip-front {
    0% {
        transform: rotateY(0deg);
    }
    50% {
        transform: rotateY(-90deg);
    }
    100% {
        transform: rotateY(-90deg);
    }
}

@keyframes flip-back {
    0% {
        transform: rotateY(90deg);
    }
    50% {
        transform: rotateY(90deg);
    }
    100% {
        transform: rotateY(0deg);
    }
}

::view-transition-old(flip) {
    animation: flip-front 0.5s ease-in-out;
}

::view-transition-new(flip) {
    animation: flip-back 0.5s ease-in-out;
}

.card {
    position: relative;
    width: 200px;
    height: 200px;
    border: 1px solid #ccc;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px;
}

button:first-child {
    margin-right: 4px;
}
```

</Sandpack>

However, since `flushSync` forces React to immediately flush updates to the DOM, this approach can cause performance and user experience issues in your app.

For example, while the callback inside `startViewTransition` if running, the browser pauses rendering. That means running `flushSync` with large updates will block the page and users can't interact with it until finished. Even if you carefully ensure that updates inside `flushSync` are fast, if the update causes something to suspend, React needs to force existing content to show a fallback in order to synchronously complete the render.

The other limitation to `flushSync`, is that it doesn't compose well with other animations. For example, consider some code that animates in a child component, and in the parent callback:

```js
function handleClick() {
  document.startViewTransition(() => {
    flushSync(() => {
      // set some state
    });
  });

  onClick();
}
```

Can you spot the issue? If `onClick` also wants an animation, this will result in two animations running, instead of one. `flushSync` makes it difficult to coordinate animations across different components.

So it's clear that we need a different API to start View Transitions in React. But there's also another problem to solve.

### Problem 2: managing what animates {/*problem-2-managing-what-animates*/}

In the `flushSync` example, you may have noticed that we need to use refs to add and remove the `view-transition-name`.

We could use CSS to manage the `view-transition-name`, but like we mentioned earlier this goes against best practices because it makes it too easy to include the wrong elements in the animation. We can't use state to add and remove the `view-transition-name` because that would be added after the call to `startViewTransition` and not be included.

The core problem is, whether you're using refs or CSS, you need to imperatively manage the `view-transition-name` for each element. This is a lot of boilerplate and complexity to manage, especially in large applications with many components. There are also a lot of pitfalls, such as forgetting to remove the `view-transition-name` or adding it to the wrong element. This can lead to unexpected behavior and bugs in your app.


For example, consider if a component you want to animate suspends:

<Sandpack>

```js src/App.js active
import { useState, useRef, use, Suspense } from "react";
import { flushSync } from "react-dom";
import "./animations.css";

const cache = new Map();
function getPromise(key) {
  if (!cache.has(key)) {
    cache.set(key, new Promise((resolve) => {
      setTimeout(() => {
        resolve(key);
      }, 1000);
    }));
    
  }
  return cache.get(key);
} 

function Card({ref, flipped}) {
  use(getPromise(flipped));
  return (
    <div
      ref={ref}
      style={{ backgroundColor: flipped ? "#fff" : "#23272f" }}
      className="card"
      id="card"
    >
      <img
        id="card-image"
        height="100"
        width="100"
        src="https://react.dev/images/brand/logo_dark.svg"
      />
    </div>
  )
}

export default function App() {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef(null);

  const handleFlip = async () => {
    ref.current.style.viewTransitionName = "flip";
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setFlipped(!flipped);
      });
    });
    await transition.updateCallbackDone;

    // If the component suspends, we don't have a ref to switch the style too.
    if (ref.current) {
      ref.current.style.viewTransitionName = "";  
    }
    
  };
  const handleFade = () => {
    flushSync(() => {
      document.startViewTransition(() => setFlipped(!flipped));
    });
  };

  return (
    <div>
      <button onClick={handleFlip}>Flip</button>
      <button onClick={handleFade}>Fade</button>
      <Suspense fallback={<div>Loading...</div>}>
        <Card ref={ref} flipped={flipped}/>
      </Suspense>
      
    </div>
  );
}

```

```css src/animations.css
@keyframes flip-front {
    0% {
        transform: rotateY(0deg);
    }
    50% {
        transform: rotateY(-90deg);
    }
    100% {
        transform: rotateY(-90deg);
    }
}

@keyframes flip-back {
    0% {
        transform: rotateY(90deg);
    }
    50% {
        transform: rotateY(90deg);
    }
    100% {
        transform: rotateY(0deg);
    }
}

::view-transition-old(flip) {
    animation: flip-front 0.5s ease-in-out;
}

::view-transition-new(flip) {
    animation: flip-back 0.5s ease-in-out;
}

.card {
    position: relative;
    width: 200px;
    height: 200px;
    border: 1px solid #ccc;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px;
}

button:first-child {
    margin-right: 4px;
}
```

</Sandpack>

Here we have two issues. First, when you first click "flip" to trigger Suspense, the fallback is shown, but isn't animated. This is because the `view-transition-name` is added to the _content_, not the Suspense fallback. If you wanted to animate the fallback, you'd need to special case it. But you might not even have a ref to attach to, since the Suspense boundary would much higher in the tree. This would get complicated quickly, and weave imperative `ref` code throughout your components.

Second, if you click "fade" after "flip", we're now performing the wrong animation. The `view-transition-name` was set on the content, but never cleaned up, because we didn't have access to the ref. Managing the correct timing for cleaning up the name in this case is difficult, and could lead to bugs in your app.

### Problem 3: managing what shouldn't animate {/*problem-3-managing-what-shouldnt-animage*/}

Finally, as we saw earlier, we need to manage what elements are not included in the animation. This is important because if we don't, we can end up blocking user interactions because the user is interacting with the "old" snapshot instead of the "new" DOM. This is more compilated than just turning off the default styles for the root `::view-transition` pseudo-element, becuase if the animation causes the root layout to change, this trick won't work - the root needs to be included in the animation.

There also other cases you need to handle. For example, for Shared Element Transitions can result in items "flying in" and "flying out" of the screen if you're animating to/from some that isn't visibile on screen. Ideally, we would want to check if 'from' and 'to' elements are visible on screen, and only perform the Shared Element Transtion if they are. Otherwise, you may want to show a different animation.

These are just some of the concerns you'll need to think about when using View Transitions. If it sounds complicated, that's because it is!

What if something could handles all of these concerns for you, in a declarative way so you only need to specify _what_ you want to animate, and not _how_ to animate it?


### Introducing React View Transitions {/*introducing-react-view-transitions*/}

React View Transitions integrate into existing features like Transitions and Suspense to trigger animations, and introduce a new component called `<ViewTransition>` to declaratively specify what to animate.


```js [[1, 2, "<ViewTransition>"], [1, 4, "</ViewTransition>"], [2, 7, "startTransition"]]
// Specify "what" should animatie
<ViewTransition>
  <div>animate me</div>
</ViewTransition>

// Trigger the animation
startTransition(() => setState(...));
```

You can wrap an element with <CodeStep step={1}>ViewTransition</CodeStep> to opt-in to animations. When a animation trigger such as <CodeStep step={2}>startTransition</CodeStep> (or switching Suspense fallbacks to content) updates the DOM, React will use declarative heuristics to automatically add a unique `view-transition-name` to the element to activate it for an animation.

Using just `startTransition` and `<ViewTransiton>` you can add the fade animation from the previous example:

<Sandpack>

```js src/App.js active
import { useState, startTransition, unstable_ViewTransition as ViewTransition } from "react";
import Card from "./Card";
import "./styles.css";

export default function App() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div>
      <button onClick={() => {
        startTransition(() => setFlipped(f => !f))}
      }>
        Fade
      </button>
      <ViewTransition>
        <Card flipped={flipped}/>
      </ViewTransition>
    </div>
  );
}
```

```js src/Card.js
export default function Card({flipped}) {
  return (
    <div
      style={{ backgroundColor: flipped ? "#fff" : "#23272f" }}
      className="card"
      id="card"
    >
      <img
        id="card-image"
        height="100"
        width="100"
        src="https://react.dev/images/brand/logo_dark.svg"
      />
    </div>
  );
}
```

```css src/styles.css
.card {
    position: relative;
    width: 200px;
    height: 200px;
    border: 1px solid #ccc;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px;
}

button:first-child {
    margin-right: 4px;
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


Or you can use it with Suspense to animate between the fallback and content:

```js [[1, 1, "<ViewTransition>"], [1, 1, "</ViewTransition>"], [2, 2, "<ViewTransition>"], [2, 4, "</ViewTransition>"]]
<Suspense fallback={<ViewTransition><Fallback /></ViewTransition>}>
  <ViewTransition>
    <Content />
  </ViewTransition>
</Suspense>
```

When React switches from `<Fallback />` to `<Content />`, an "exit" will activate on the fallback's <CodeStep step={1}>ViewTransition</CodeStep> and an "enter" will activate on the content's <CodeStep step={2}>ViewTransition</CodeStep> to trigger an animation:

### How do View Transitions in React work? {/*how-do-view-transitions-in-react-work*/}

When an update is triggered inside `startTransition` or `Suspense`, React renders the update the same as before. When the render finishes, and is ready to commit, React decides if any `<ViewTransition>` components should activate based on [heuristics](/TODO) that classify updates as "enter", "exit", "update", "share", or "default".

Then, React automatically adds a unique `view-transition-name`, and the configured `view-transition-class` to the child DOM element of activated `<ViewTransition>` components. By adding a unique view transition name right before the animation, React ensures that only the elements that should animate for this transition will be animated.

Then, React calls `document.startViewTransition` with the callback to mutate the DOM with the React commit. At this point, the browser takes a snapshot of the DOM that looks like this:

```
::view-transition
└─ ::view-transition-group(root)
   └─ ::view-transition-image-pair(root)
      └─ ::view-transition-old(«t0»)     <-- !! root state.  
└─ ::view-transition-group(«t0») 
   └─ ::view-transition-image-pair(«t0»)
      ├─ ::view-transition-old(«t0»)     <-- the old state 
      └─ ::view-transition-new(«t0»)     <-- the new state
```

Next, the browser calls our callback to mutate the DOM. Since we've alreade rendered, we only need to apply the pending DOM mutations, which minimized the amount of time the browser needs to pause rendering.

After React mutates the DOM, before returning from `startViewTransition`, we fire any layout effects that were scheduled, to ensure all layout-based adjustments are included in the animation.

Right before returning, React checks to see if the animation caused the root layout to change. If it didn't, then it applies these styles to allow click events outside of the content that's animating:

```css
html {
  view-transition-name: none;
}

::view-transition {
  width: 0;
  height: 0;
}
```

Finally, React returns from `startViewTransiton`, and the browser animates only the elements involved in the transition. While the animation is in progress, all of the elements on the page (including the "new" DOM) are interactive.

As the last step, React removes all the `view-transition-name` properties added. This prevents unintended animations for future updates.

### Customizing animations {/*customizing-animations*/}

By default, `<ViewTransition>` includes the default cross-fade from the browser. 

To customize animations, you can provide props to the `<ViewTranstion>` component to specify which animations to use, based on how the `<ViewTransition>` activates (see [the docs](/TODO) for the heuristics React uses to activate different types of animations).

For example, you can specify a default animation for all elements inside the `<ViewTransition>`:

```js
<ViewTransition default="flip">
  <div>animate me</div>
</ViewTransition>
```

The animations are specified in CSS using view transition classes:

```css
::view-transition-old(.flip) {
  animation: fade-out;
}

::view-transition-new(.flip) {
  animation: fade-in;
}
```


<Note>

TODO: why we recommend using classes.

</Note>

### And more {/*and-more*/}

React View Transitions are available in the experimental version of React.

---



## Activity {/*activity*/}

Today, we're publishing docs for [`<Activity />`](/TODO), a new experimental API to hide and show parts of the UI.

In [past](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#offscreen) [updates](/blog/2024/02/15/react-labs-what-we-have-been-working-on-february-2024#offscreen-renamed-to-activity), we shared that we were researching an API to allow components to be visually hidden and deprioritized, preserving UI state with reduced performance costs relative to unmounting or hiding with CSS.

We're now ready to share the API and how it works, so you can start testing it in experimental React versions.

<Note>

**Activity is experimental and not available in a stable version of React yet.**

We're ready for users to start testing Activity as an experimental feature. It has been tested in production and we are confident it's stable, but the final API might change while we iterate on feedback.

</Note>

TODO: explain activity API



## React Performance Tracks {/*react-performance-tracks*/}

Today, we're publishing docs for [`React Performance Tracks`](/TODO), a new set of custom tracks in the Chrome Performance Profiler to provide more information about the performance of your React app.

<Note>

**React Performance Tracks are experimental and not available in a stable version of React yet.**

When using an experimental version of React, you will automatically see the performance tracks added to profiles. This is an experimental feature, so the tracks might change while we iterate on feedback.

</Note>

TODO: explain performance tracks


# Features in development {/*features-in-development*/}

## React Compiler {/*react-compiler*/}

TODO

## IDE Extension {/*ide-extension*/}

TODO

## Automatic Effect Dependencies {/*automatic-effect-dependencies*/}

TODO
## Fragment Refs {/*fragment-refs*/}

TODO


## Gesture Animations {/*gesture-animations*/}

TODO

## Concurrent stores {/*concurrent-stores*/}

TODO

---

_TODO: Thanks_