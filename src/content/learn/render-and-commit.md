---

## title: Render and Commit

Before your components appear on screen, they must first be rendered by React. Understanding this process helps you predict your app’s behavior and debug more effectively.

This guide covers:

- What rendering means in React
- When and why components render
- How rendering leads to updates on the screen
- Why not every render results in a DOM update

---

Imagine your components as chefs preparing meals in a kitchen. React is the waiter who takes the customer’s order and ensures the correct dish reaches the table. The full process of serving UI includes three steps:

1. **Triggering** a render (the waiter takes the order to the kitchen)
2. **Rendering** the component (the chef prepares the dish)
3. **Committing** to the DOM (the waiter places the dish on the table)

---

## Step 1: Trigger a render {/*step-1-trigger-a-render*/}

React renders a component for two main reasons:

1. It's the component's **initial render**
2. The component or one of its ancestors **has updated its state**

### Initial render {/*initial-render*/}

When your app starts, you trigger the first render by calling [`createRoot`](/reference/react-dom/client/createRoot) with a DOM node and rendering your component:

```js
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<Image />);
js
Copy
Edit
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
🔍 Try commenting out root.render() to see that the component won’t appear at all.

Re-renders when state updates {/re-renders-when-state-updates/}
After the initial render, you can trigger more renders by updating component state using setState. When state changes, React automatically queues a re-render.

Think of it like a diner adding dessert to their order—the waiter (React) needs to bring something new based on the customer’s current appetite (component state).

Step 2: React renders your components {/step-2-react-renders-your-components/}
Once triggered, React calls your component functions to figure out what to display.

On the initial render, React calls the root component.

On subsequent renders, React re-calls the component whose state changed.

This is a recursive process: if a component returns other components, React will render those next, continuing until all nested components are processed and it knows what to display.

Here’s an example:

js
Copy
Edit
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
js
Copy
Edit
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<Gallery />);
css
Copy
Edit
img {
  margin: 0 10px 10px 0;
}
During initial render, React creates DOM nodes for <section>, <h1>, and three <img> tags.

During a re-render, it compares the output to the previous render to decide if the DOM needs to change.

Pure rendering functions
React rendering should be a pure calculation:

Same input → same output. A component should return the same JSX given the same props and state.

No side effects. Components shouldn’t modify external variables or state during render.

🧪 In Strict Mode, React may call your component functions twice (in dev mode only) to help you catch impure code early.

Step 3: React commits changes to the DOM {/step-3-react-commits-changes-to-the-dom/}
Once React finishes rendering, it moves on to updating the DOM.

During the first render, it uses appendChild() to insert the new DOM nodes.

On subsequent renders, React calculates the minimal set of changes and applies only what's necessary.

For example:

js
Copy
Edit
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
js
Copy
Edit
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time.toLocaleTimeString()} />
  );
}
You can type into the <input> and your text won’t disappear when the clock re-renders every second. That’s because React sees the input node hasn’t changed, so it doesn’t touch it.

Epilogue: Browser paint {/epilogue-browser-paint/}
After React commits changes to the DOM, the browser repaints the screen.

Although this process is sometimes called “browser rendering,” we use the term painting to avoid confusion with React rendering.

Summary
UI updates happen in three steps: Trigger → Render → Commit

React rendering is a pure function of props and state

React commits only the necessary DOM changes

Use Strict Mode to catch mistakes in render logic


