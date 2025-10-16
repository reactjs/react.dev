---
title: useEffectEvent
---

<Intro>

`useEffectEvent` is a React Hook that lets you extract non-reactive logic from your Effects into a reusable function called an [Effect Event](/learn/separating-events-from-effects#declaring-an-effect-event).

```js
const onSomething = useEffectEvent(callback)
```

</Intro>

<InlineToc />

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

- `callback`: A function containing the logic for your Effect Event. When you define an Effect Event with `useEffectEvent`, the `callback` always accesses the latest values from props and state when it is invoked. This helps avoid issues with stale closures.

#### Returns {/*returns*/}

Returns an Effect Event function. You can call this function inside `useEffect`, `useLayoutEffect`, or `useInsertionEffect`.

#### Caveats {/*caveats*/}

- **Only call inside Effects:** Effect Events should only be called within Effects. Define them just before the Effect that uses them. Do not pass them to other components or hooks. The [`eslint-plugin-react-hooks`](/reference/eslint-plugin-react-hooks) linter (version 6.1.1 or higher) will enforce this restriction to prevent calling Effect Events in the wrong context.
- **Not a dependency shortcut:** Do not use `useEffectEvent` to avoid specifying dependencies in your Effect's dependency array. This can hide bugs and make your code harder to understand. Prefer explicit dependencies or use refs to compare previous values if needed.
- **Use for non-reactive logic:** Only use `useEffectEvent` to extract logic that does not depend on changing values.

___

## Usage {/*usage*/}

### Reading the latest props and state {/*reading-the-latest-props-and-state*/}

Typically, when you access a reactive value inside an Effect, you must include it in the dependency array. This makes sure your Effect runs again whenever that value changes, which is usually the desired behavior.

But in some cases, you may want to read the most recent props or state inside an Effect without causing the Effect to re-run when those values change.

To [read the latest props or state](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events) in your Effect, without making those values reactive, include them in an Effect Event.

```js {7-9,12}
import { useEffect, useContext, useEffectEvent } from 'react';

function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onNavigate = useEffectEvent((visitedUrl) => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onNavigate(url);
  }, [url]);

  // ...
}
```

In this example, the Effect should re-run after a render when `url` changes (to log the new page visit), but it should **not** re-run when `numberOfItems` changes. By wrapping the logging logic in an Effect Event, `numberOfItems` becomes non-reactive. It's always read from the latest value without triggering the Effect.

You can pass reactive values like `url` as arguments to the Effect Event to keep them reactive while accessing the latest non-reactive values inside the event.

