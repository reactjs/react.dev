---
title: useEffectEvent
---

<Intro>

`useEffectEvent` is a React Hook that lets you extract non-reactive logic from your Effects into a reusable function called an [*Effect Event*](/learn/separating-events-from-effects#declaring-an-effect-event).

```js
const onSomething = useEffectEvent(callback)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useEffectEvent(callback)` {/*useeffectevent*/}

Call `useEffectEvent` at the top level of your component to declare an Effect Event. Effect Events are functions you can call inside Effects, such as `useEffect`:

```js {4-6,11}
import { useEffectEvent, useEffect } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  // ...
}
```

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `callback`: A function containing the logic for your Effect Event. The function can accept any number of arguments and return any value. When you call the returned Effect Event function, the `callback` always accesses the latest values from props and state at the time of the call. This helps avoid issues with stale closures.

#### Returns {/*returns*/}

`useEffectEvent` returns an Effect Event function with the same type signature as your `callback`. You can call this function inside `useEffect`, `useLayoutEffect`, `useInsertionEffect`, or from within other Effect Events in the same component.

#### Caveats {/*caveats*/}

* `useEffectEvent` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a new component and move the Effect Event into it.
* Effect Events can only be called from inside Effects or other Effect Events. Do not call them during rendering or pass them to other components or Hooks. The [`eslint-plugin-react-hooks`](/reference/eslint-plugin-react-hooks) linter (version 6.1.1 or higher) enforces this restriction.
* Calling an Effect Event during rendering will throw an error: `"A function wrapped in useEffectEvent can't be called during rendering."`
* Do not include Effect Events in your Effect's dependency array. The function identity is intentionally non-stable, and including it would cause unnecessary Effect re-runs. The linter will warn if you try to do this.
* React does not preserve the `this` binding when you pass object methods to `useEffectEvent`. If you need to preserve `this`, bind the method first or use an arrow function wrapper.
* Do not use `useEffectEvent` to avoid specifying dependencies in your Effect's dependency array. This hides bugs and makes your code harder to understand. Only use it for logic that genuinely should not re-trigger your Effect.

<DeepDive>

#### Why is the function identity intentionally non-stable? {/*why-non-stable-identity*/}

Unlike `set` functions from `useState` or refs, Effect Event functions do not have a stable identity. Their identity intentionally changes on every render:

```js
// 🔴 Wrong: including Effect Event in dependencies
useEffect(() => {
  onSomething();
}, [onSomething]); // ESLint will warn about this
```

Never include an Effect Event in your dependency array. The linter will warn you if you try.

This is a deliberate design choice. Effect Events are meant to be called only from within Effects in the same component. Since you can only call them locally and cannot pass them to other components or include them in dependency arrays, a stable identity would serve no purpose—and could actually mask bugs.

If the identity were stable, you might accidentally include an Effect Event in a dependency array without the linter catching it. The non-stable identity acts as a runtime assertion: if your code incorrectly depends on the function identity, you'll see the Effect re-running on every render, making the bug obvious.

This design reinforces the rule that Effect Events are "escape hatches" for reading the latest values, not general-purpose callbacks to be passed around.

</DeepDive>

---

## Usage {/*usage*/}

### Reading the latest props and state {/*reading-the-latest-props-and-state*/}

Typically, when you access a reactive value inside an Effect, you must include it in the dependency array. This makes sure your Effect runs again whenever that value changes, which is usually the desired behavior.

But in some cases, you may want to read the most recent props or state inside an Effect without causing the Effect to re-run when those values change.

To [read the latest props or state](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events) in your Effect, without making those values reactive, include them in an Effect Event.

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

function Page({ url }) {
  const [items, setItems] = useState([
    { id: 1, name: 'Apples' },
    { id: 2, name: 'Oranges' }
  ]);

  const onNavigate = useEffectEvent((visitedUrl) => {
    console.log('Visited:', visitedUrl, 'with', items.length, 'items in cart');
  });

  useEffect(() => {
    onNavigate(url);
  }, [url]);

  return (
    <>
      <h2>Page: {url}</h2>
      <p>Items in cart: {items.length}</p>
      <button onClick={() => {
        setItems([...items, { id: items.length + 1, name: 'New item' }]);
      }}>
        Add item
      </button>
    </>
  );
}

export default function App() {
  const [url, setUrl] = useState('/home');

  return (
    <>
      <nav>
        <button onClick={() => setUrl('/home')}>Home</button>
        <button onClick={() => setUrl('/products')}>Products</button>
        <button onClick={() => setUrl('/about')}>About</button>
      </nav>
      <hr />
      <Page url={url} />
    </>
  );
}
```

```css
nav button { margin-right: 8px; }
```

</Sandpack>

In this example, the Effect should re-run after a render when `url` changes (to log the new page visit), but it should **not** re-run when `items` changes. By wrapping the logging logic in an Effect Event, `items.length` becomes non-reactive. The Effect Event always reads the latest value without triggering the Effect.

Try clicking "Add item" and notice that no log appears. Then click a navigation button—the log appears and shows the current number of items.

You can pass reactive values like `url` as arguments to the Effect Event to keep them reactive while accessing the latest non-reactive values inside the event.

<Pitfall>

##### Don't use Effect Events to skip dependencies {/*pitfall-skip-dependencies*/}

It might be tempting to use `useEffectEvent` to avoid listing dependencies that you think are "unnecessary." However, this hides bugs and makes your code harder to understand.

```js
// 🔴 Wrong: Using Effect Events to hide dependencies
const onFetch = useEffectEvent(() => {
  fetchData(userId); // userId should trigger refetch!
});

useEffect(() => {
  onFetch();
}, []); // Missing userId means stale data
```

If a value should cause your Effect to re-run, keep it as a dependency. Only use Effect Events for logic that genuinely should not re-trigger your Effect—like showing a notification in the current theme while connecting to a server.

</Pitfall>

---

### Connecting to a chat room {/*connecting-to-a-chat-room*/}

This example shows the primary use case for `useEffectEvent`: connecting to an external system where you want to react to some changes but not others.

In this chat room example, the Effect connects to a chat server based on `roomId`. When the user changes the theme, you want to show a notification in the current theme color—but you don't want to reconnect to the server because the theme changed.

<Recipes titleText="Chat room examples" titleId="examples-chat-room">

#### Reading latest theme without reconnecting {/*reading-latest-theme*/}

Change the room and notice the console logs showing connection and disconnection. Then change the theme—the notification uses the current theme, but no reconnection happens.

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    console.log('✅ Connected to ' + roomId + ' (theme: ' + theme + ')');
  });

  useEffect(() => {
    console.log('⏳ Connecting to ' + roomId + '...');
    const id = setTimeout(() => {
      onConnected();
    }, 1000);
    return () => {
      console.log('❌ Disconnected from ' + roomId);
      clearTimeout(id);
    };
  }, [roomId]);

  return <h2>Welcome to the {roomId} room!</h2>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [theme, setTheme] = useState('light');

  return (
    <>
      <label>
        Room:{' '}
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="general">General</option>
          <option value="travel">Travel</option>
          <option value="music">Music</option>
        </select>
      </label>
      <label>
        Theme:{' '}
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} theme={theme} />
    </>
  );
}
```

```css
label { display: block; margin-bottom: 8px; }
```

</Sandpack>

<Solution />

#### With muted notifications {/*with-muted-notifications*/}

This example adds a `muted` state that controls whether the Effect Event shows notifications. The Effect Event reads the latest `muted` value without re-triggering the connection.

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme, muted }) {
  const onConnected = useEffectEvent(() => {
    if (!muted) {
      console.log('✅ Connected to ' + roomId + ' (theme: ' + theme + ')');
    } else {
      console.log('✅ Connected to ' + roomId + ' (muted)');
    }
  });

  useEffect(() => {
    console.log('⏳ Connecting to ' + roomId + '...');
    const id = setTimeout(() => {
      onConnected();
    }, 1000);
    return () => {
      console.log('❌ Disconnected from ' + roomId);
      clearTimeout(id);
    };
  }, [roomId]);

  return <h2>Welcome to the {roomId} room!</h2>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [theme, setTheme] = useState('light');
  const [muted, setMuted] = useState(false);

  return (
    <>
      <label>
        Room:{' '}
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="general">General</option>
          <option value="travel">Travel</option>
          <option value="music">Music</option>
        </select>
      </label>
      <label>
        Theme:{' '}
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={muted}
          onChange={(e) => setMuted(e.target.checked)}
        />
        Mute notifications
      </label>
      <hr />
      <ChatRoom roomId={roomId} theme={theme} muted={muted} />
    </>
  );
}
```

```css
label { display: block; margin-bottom: 8px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Passing reactive values to Effect Events {/*passing-reactive-values-to-effect-events*/}

You can pass arguments to your Effect Event function. This is useful when you have a reactive value that should trigger your Effect, but you also want to use that value inside the Effect Event along with other non-reactive values.

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

function Analytics({ url, userId }) {
  const [sessionDuration, setSessionDuration] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSessionDuration(d => d + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const onPageView = useEffectEvent((visitedUrl) => {
    // visitedUrl is passed as argument - reactive
    // userId and sessionDuration are read from closure - non-reactive
    console.log('Page view:', visitedUrl);
    console.log('  User:', userId);
    console.log('  Session duration:', sessionDuration, 'seconds');
  });

  useEffect(() => {
    onPageView(url);
  }, [url]);

  return (
    <div>
      <h2>Analytics for: {url}</h2>
      <p>User: {userId}</p>
      <p>Session: {sessionDuration}s</p>
    </div>
  );
}

export default function App() {
  const [url, setUrl] = useState('/home');
  const [userId, setUserId] = useState('user-123');

  return (
    <>
      <div>
        <button onClick={() => setUrl('/home')}>Home</button>
        <button onClick={() => setUrl('/products')}>Products</button>
        <button onClick={() => setUrl('/about')}>About</button>
      </div>
      <div>
        <button onClick={() => {
          const id = Math.random().toString(36).slice(2, 7);
          setUserId('user-' + id);
        }}>
          Change user
        </button>
      </div>
      <hr />
      <Analytics url={url} userId={userId} />
    </>
  );
}
```

```css
button { margin-right: 8px; margin-bottom: 8px; }
```

</Sandpack>

In this example:
- `url` is passed as an argument to `onPageView`. This keeps it reactive—when `url` changes, the Effect runs again and calls `onPageView` with the new URL.
- `userId` and `sessionDuration` are read from closure inside the Effect Event. They're non-reactive—changing them doesn't re-run the Effect, but `onPageView` always sees their latest values when called.

Try clicking "Change user" or waiting for the session timer—no log appears. Then click a navigation button—the log shows the current user and session duration.

---

### Using Effect Events in custom Hooks {/*using-effect-events-in-custom-hooks*/}

You can use `useEffectEvent` inside your own custom Hooks. This lets you create reusable Hooks that encapsulate Effects while keeping some values non-reactive.

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);

  useEffect(() => {
    if (delay === null) {
      return;
    }
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

function Counter({ incrementBy }) {
  const [count, setCount] = useState(0);

  useInterval(() => {
    setCount(c => c + incrementBy);
  }, 1000);

  return (
    <div>
      <h2>Count: {count}</h2>
      <p>Incrementing by {incrementBy} every second</p>
    </div>
  );
}

export default function App() {
  const [incrementBy, setIncrementBy] = useState(1);

  return (
    <>
      <label>
        Increment by:{' '}
        <select
          value={incrementBy}
          onChange={(e) => setIncrementBy(Number(e.target.value))}
        >
          <option value={1}>1</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </label>
      <hr />
      <Counter incrementBy={incrementBy} />
    </>
  );
}
```

```css
label { display: block; margin-bottom: 8px; }
```

</Sandpack>

In this example, `useInterval` is a custom Hook that sets up an interval. The `callback` passed to it is wrapped in an Effect Event, so:

- The interval is set up once when the component mounts (or when `delay` changes).
- Changing `incrementBy` doesn't restart the interval, but the callback always uses the latest value.

<Note>

Effect Events are designed to be called locally within the same component or Hook. Do not pass Effect Event functions to other components or Hooks—the linter will warn if you try. If you need to share event logic across components, consider lifting the Effect up or using a different pattern.

</Note>

---

## Troubleshooting {/*troubleshooting*/}

### I'm getting an error: "A function wrapped in useEffectEvent can't be called during rendering" {/*cant-call-during-rendering*/}

This error means you're calling an Effect Event function during the render phase of your component. Effect Events can only be called from inside Effects or other Effect Events.

```js
function MyComponent({ data }) {
  const onLog = useEffectEvent(() => {
    console.log(data);
  });

  // 🔴 Wrong: calling during render
  onLog();

  // ✅ Correct: call from an Effect
  useEffect(() => {
    onLog();
  }, []);

  return <div>{data}</div>;
}
```

If you need to run logic during render, don't wrap it in `useEffectEvent`. Call the logic directly or move it into an Effect.

---

### I'm getting a lint error: "Functions returned from useEffectEvent must not be included in the dependency array" {/*effect-event-in-deps*/}

If you see a warning like "Functions returned from `useEffectEvent` must not be included in the dependency array", remove the Effect Event from your dependencies:

```js
const onSomething = useEffectEvent(() => {
  // ...
});

// 🔴 Wrong: Effect Event in dependencies
useEffect(() => {
  onSomething();
}, [onSomething]);

// ✅ Correct: no Effect Event in dependencies
useEffect(() => {
  onSomething();
}, []);
```

Effect Events are designed to be called from Effects without being listed as dependencies. The linter enforces this because the function identity is intentionally non-stable—including it would cause your Effect to re-run on every render.

---

### I'm getting a lint error: "onSomething is a function created with useEffectEvent, and can only be called from Effects" {/*effect-event-called-outside-effect*/}

If you see a warning like "`onSomething` is a function created with React Hook `useEffectEvent`, and can only be called from Effects and Effect Events", you're calling the function from the wrong place:

```js
const onSomething = useEffectEvent(() => {
  console.log(value);
});

// 🔴 Wrong: calling from event handler
function handleClick() {
  onSomething();
}

// 🔴 Wrong: passing to child component
return <Child onSomething={onSomething} />;

// ✅ Correct: calling from Effect
useEffect(() => {
  onSomething();
}, []);
```

Effect Events are specifically designed to read the latest values inside Effects. If you need a callback for event handlers or to pass to children, use a regular function or `useCallback` instead.

---

### I'm seeing stale values when using Effect Events with `memo()` {/*stale-values-with-memo*/}

There was a known bug in React where `useEffectEvent` could see stale closure values when used inside components wrapped with `memo()` or `forwardRef()`. This bug affected some React 19 versions.

**Status:** React fixed this bug in [PR #34831](https://github.com/facebook/react/pull/34831).

**Solution:** Update to the latest React version. If you can't update immediately, you can work around this by removing `memo()` temporarily or by restructuring your component to avoid the problematic pattern.