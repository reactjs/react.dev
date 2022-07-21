---
title: 'Adjusting Effect Dependencies'
---

<Intro>

An Effect re-runs after any change to the values that it depends on. This is why writing Effects requires a different mindset than writing event handlers. You'll write the code inside your Effect first. Then you'll specify its dependencies according to the code you already wrote. Finally, if a dependency changes too often and causes your Effect to re-run more than needed, you'll have to adjust the code so that it *does not need* that dependency, and follow these steps again. It's not always obvious how to do this, so this page will help you learn common patterns and idioms.

</Intro>

<YouWillLearn>

- How writing Effects is different from writing event handlers
- What causes Effects to re-run
- How to choose the Effect dependencies
- How the fix the dependency linter errors
- How to prevent Effects from re-running too often

</YouWillLearn>

## Effects are reactive {/*effects-are-reactive*/}

Event handlers and Effects [serve different purposes.](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events) An event handler lets you respond to a specific interaction. An Effect lets your component stay synchronized with an external system. This is why they behave differently:

* An event handler runs exactly once per interaction. If you click a button once, its click handler will run once.
* **An Effect re-runs after any change to the values it depends on.** For example, say your Effect connects to the chat room specified by the `roomId` prop. Then you must include `roomId` [in your Effect's dependencies](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies). When your component is added to the screen, your Effect will *run*, connecting to the room with the initial `roomId`. When it receives a different `roomId`, your Effect will *[clean up](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)* (disconnecting from the previous room) and *run* again (connecting to the next room). When your component is removed, the Effect will *clean up* one last time.

**In other words, Effects are _reactive._** They "react" to the values from the component body (like props and state). This might remind you of how React always keeps the UI synchronized to the current props and state of your component. By writing Effects, you teach React to synchronize *other* systems to the current props and state.

**Writing reactive code like Effects requires a different mindset.** The most common problem you'll run into is that your Effect re-runs too often because a dependency you use inside of it changes too often. Your first instinct might be to omit that dependency from the list, but that's wrong. In these cases, you need to edit the *code itself* (rather than the list) to not *need* that dependency. On this page, you'll learn the most common ways to do that.

### Event handlers run on specific interactions {/*event-handlers-run-on-specific-interactions*/}

This `ChatRoom` component contains an event handler that sends a chat message:

```js
function ChatRoom() {
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
}
```

Imagine you want to find out what causes this event handler to run. You can't tell that by looking at the code *inside* the event handler. You would need to look for where this event handler *is being passed* to the JSX:

```js
<button onClick={handleSendClick}>
  Send
</button>
```

The snippet above tells you that the `handleSendClick` function runs when the user presses the "Send" button. This event handler is written for *this particular interaction.* If the `handleSendClick` function isn't passed or called anywhere else, you can be certain that it *only* runs when the user clicks this particular "Send" button.

What happens when you edit the event handler? Let's say you're adding a `roomId` prop to the `ChatRoom` component. Then you read the current value of `roomId` inside your event handler:

```js {1,4}
function ChatRoom({ roomId }) {
  // ...
  function handleSendClick() {
    sendMessage(roomId, message);
  }
  // ...
}
```

Although you edited the code *inside* the `handleSendClick` event handler, this doesn't change when it runs. It still runs only when the user clicks the "Send" button. **Editing the event handler does not make it run any less or more often.** In other words, the code inside event handlers isn't reactive--it doesn't re-run automatically.

### Effects run whenever synchronization is needed {/*effects-run-whenever-synchronization-is-needed*/}

In the same `ChatRoom` component, there is an Effect that sets up the chat server connection:

```js
function ChatRoom() {
  // ...
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
  // ...
}
```

Its dependencies are an empty `[]` array, so this Effect only runs "on mount," i.e. when the component is added to the screen. (Note there'll still be an extra `connect()` and `disconnect()` call pair in development, [here's why.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development))

Now let's see what happens when you add a `roomId` prop and start using it inside your Effect:

```js {1,4}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(roomId);
    // ...
}
```

If you only change these two lines, you will introduce a bug. The `ChatRoom` component will connect to the initial `roomId` correctly. However, when the user picks a different room, nothing will happen. Can you guess why?

If your linter is [correctly configured for React,](/learn/editor-setup#linting) it will point you directly to the bug:

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'roomId'
  // ...
}
```

This looks like a React error, but really it's React pointing out a logical mistake in this code. As it's written now, this Effect is not "reacting" to the `roomId` prop. **Since your Effect now uses the `roomId` prop in its code, it no longer makes sense for it to run only "on mount."** The linter verifies that your dependencies match your code.

To fix this bug, follow the linter's suggestion and add the missing `roomId` dependency:

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

When your component mounts, your Effect will *run*, connecting to the room with the initial `roomId`. When it receives a different `roomId`, your Effect will *[clean up](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)* (disconnecting from the previous room) and *run* again (connecting to the next room). When your component unmounts, the Effect will *clean up* one last time.

Let's recap what has happened:

1. You edited the code, potentially introducing a bug.
2. The linter found the bug and suggested a change *to make the dependencies match the Effect code*.
3. You accepted the linter's suggestion, which (correctly) *made your Effect run more often than before*.

You'll go through a process like this every time you edit an Effect.

### Every reactive value becomes a dependency {/*every-reactive-value-becomes-a-dependency*/}

Imagine you're adding a way to choose the chat server, and read the server URL in your Effect:

```js {3,6}
function ChatRoom({ roomId, selectedServerUrl }) {
  const { defaultServerUrl } = useContext(SettingsContext);
  const serverUrl = selectedServerUrl ?? defaultServerUrl;

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // 🔴 React Hook useEffect has a missing dependency: 'serverUrl'
  // ...
}
```

As the linter points out, this code has a bug. If the user selects a different server, nothing will happen. Also, if the user hasn't selected any server yet, but they change the default server in your app's Settings, nothing will happen either. In other words, your Effect uses a value that can change over time, but it ignores all updates to that value.

**Since the `serverUrl` variable is declared inside your component, it is a _reactive value._ It is recalculated on every render--whenever the props or state change. This is why you have to specify it as a dependency of your Effect:**

```js {9}
function ChatRoom({ roomId, selectedServerUrl }) {
  const { defaultServerUrl } = useContext(SettingsContext);
  const serverUrl = selectedServerUrl ?? defaultServerUrl;

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
}
```

Now, your Effect will re-run more often. It will re-run not only when the user selects a different room, but also when they select a different server. And this is correct! This is what makes Effects reactive--**when you edit an Effect's code, you also change how often it runs.** This is how it stays synchronized to the latest props and state. (You can opt out of reactivity by [extracting some code into an *Event function*](#extracting-event-functions-from-effects) as you'll learn later on this page.)

<DeepDive title="What kind of values can be dependencies?">

Only values that participate in the rendering data flow--and therefore could change over time--are dependencies. This includes every value that's defined **directly inside the component**, such as [props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), [context](/learn/passing-data-deeply-with-context), and other variables that are directly inside the component and are used by the Effect:

```js
// 🔴 Variables outside the component can't be dependencies
const notADependency1 = // ...

function YourComponent({ dependency1 }) { // ✅ Props can be dependencies
  // ✅ Variables directly inside the component can be dependencies:
  const dependency2 = // ...
  const [dependency3, dependency4] = useSomething();

  useEffect(() => {
    // 🔴 Variables inside the Effect can't be dependencies.
    const notADependency2 = // ...
    // ...
  }, [dependency1, dependency2, dependency3, dependency4]);
  // ...
}
```

Global or mutable values can't be dependencies:

```js
function Chat() {
  const ref = useRef(null);
  useEffect(() => {
    // ...
  }, [
    window.location.query, // 🔴 Can't be a dependency: mutable and global
    ref.current.offsetTop  // 🔴 Can't be a dependency: mutable
  ]);
}
```

They're not valid dependencies because they don't participate in the React rendering flow. Changing a mutable value doesn't trigger a re-render, so React wouldn't know to re-run the Effect. However, if there is a way to subscribe to the changes of the mutable value you're interested in, you can [synchronize it with the React state](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store), and then use that React state variable as a dependency of your Effect.

Values that are guaranteed to be the same on every render can be omitted. For example, the `ref` wrapper object returned from [`useRef`](/apis/useref) the `set` function returned by [`useState`](/apis/usestate), and functions returned by [`useEvent`](/apis/useevent) are *stable,* i.e. guaranteed to never change between re-renders by React. However, the dependency linter may ask you to include them if it can't verify that they're directly coming from React (for example, if you pass them from a parent component). In that case you should specify them.

Objects and functions can be dependencies, but you need to be careful:

```js
function Page() {
  const obj = {}; // 🔴 Inline object will be different on every render
  function fn() { // 🔴 Inline function will be different on every render
    // ...
  }
  useEffect(() => {
    fn(obj);
  }, [obj, fn]);
  // ...
}
```

Inline objects and functions are always "new": [`{} !== {}`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality#comparing_objects) and `function(){} !== function(){}`. This makes the `fn` and `obj` dependencies above "always different," so the Effect will re-run after every render. To fix this, you can usually replace object and function dependencies with simpler primitive dependencies, or remove the need for them altogether. You'll learn how to do this [later on this page.](#how-to-fix-an-effect-that-re-runs-too-often)

</DeepDive>

## How to fix an Effect that re-runs too often? {/*how-to-fix-an-effect-that-re-runs-too-often*/}

When your Effect uses a reactive value, you must include it in the dependencies. This may cause problems:

* Sometimes, you want to re-execute *different parts* of your Effect under different conditions.
* Sometimes, you want to only read *the latest value* of some dependency instead of "reacting" to its changes.
* Sometimes, a dependency may change too often *unintentionally* because it's an object or a function.

After you adjust the Effect's dependencies to reflect the code, you should always look at the dependency list. Does it make sense for the Effect to re-run when these dependencies change? Sometimes, the answer is "no."

**When this happens, your first instinct might be to omit some dependencies from the list, but that leads to subtle bugs that are very hard to diagnose. Instead, edit the *rest* of the code to *not need* that dependency.** It's not always obvious how to do this, so the rest of this page will introduce you to the most common scenarios.

### Removing an Effect {/*removing-an-effect*/}

The first thing you should think about is whether this code should be an Effect at all. For example, suppose you have a form thats submits a POST request and shows a notification [toast](https://uxdesign.cc/toasts-or-snack-bars-design-organic-system-notifications-1236f2883023). You trigger the Effect by setting state:

```js {4-10}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showToast('Successfully registered!');
    }
  }, [submitted]); // ✅ All dependencies declared

  function handleSubmit() {
    setSubmitted(true);
  }  

  // ...
}
```

Later, you want to style the notification toast according to the current theme, so you read the current theme. Since `theme` is declared in the component body, it is a reactive value, and you must declare it as a depedency:

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showToast('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ All dependencies declared

  function handleSubmit() {
    setSubmitted(true);
  }  

  // ...
}
```

But by doing this, you've introduced a bug. Imagine you submit the form first and then switch between Dark and Light themes. The `theme` will change, the Effect will re-run, and so it will display the same notification again!

**The problem here is that this shouldn't be an Effect in the first place.** You want to send this POST request and show the notification in response to *submitting the form,* which is a particular interaction. When you want to run some code in response to particular interaction, put that logic directly into the corresponding event handler:

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Good: Event-specific logic is called from event handlers
    post('/api/register');
    showToast('Successfully registered!', theme);
  }  

  // ...
}
```

Now the code is inside the event handler, it's not reactive--so it will only run when the user submits the form.

Don't try to remove all Effects. It makes sense to write an Effect when you want to run some logic *because the component is displayed* rather than in response to a particular interaction. Read [Synchronizing with Effects](/learn/synchronizing-with-effects) to learn when to use Effects. Then, check out [You Might Not Need an Effect](/learn/you-might-not-need-an-effect) to learn when and how to avoid them.

### Splitting an Effect in two {/*splitting-an-effect-in-two*/}

Imagine you're creating a shipping form where the user needs to choose their city and area. You fetch the list of `cities` from the server according to the selected `country` so that you can show them as dropdown options:

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

However, since the Effect now uses the `city` state variable, you've had to add `city` to the list of dependencies. That, in turn, has introduced a problem. Now, whenever the user selects a different city, the Effect will re-run and call `fetchCities(country)`. As a result, you will be unnecessarily refetching the list of cities many times.

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

Now the first Effect only re-runs if the `country` changes, while the second Effect re-runs when the `city` changes. You've separated them by purpose: two separate Effects synchronize two different things.

The final code is longer than the original, but splitting these Effects is still correct. **Each Effect should represent an independent synchronization process.** If there is one thing being synchronized, there should be one Effect. If there are two different things being synchronized independently from each other, then there should be two Effects. You should split Effects according to their purpose, not whether the code is shorter or "feels cleaner."

In the above example, deleting one Effect wouldn't break the other Effect's logic. This is a good indication that they synchronize different things, and so it made sense to split them up. On the other hand, if you split up a cohesive piece of logic into separate Effects, the code may look "cleaner" but will be [more difficult to maintain.](/learn/you-might-not-need-an-effect#chains-of-computations)

#### Optional: Wrapping an Effect into a custom Hook {/*optional-wrapping-an-effect-into-a-custom-hook*/}

In the above example, the two Effects are independent from each other but share a lot of repetitive code. This makes the component itself difficult to read. You have to pause to figure out what exactly each Effect does, and how the data flows into and out of each Effect. This is especially difficult when asynchronous logic is involved.

You can simplify the `ShippingForm` component above by extracting the Effect into your own `useData` Hook:

```js {1}
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
  }, [url]); // ✅ All dependencies declared
  return data;
}
```

Now you can replace both Effects in the `ShippingForm` components with calls to your custom `useData` Hook:

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

When your Effect was doing multiple unrelated things, it was hard to tell at a glance how the data flowed in and out. After you've split it, the data flow became easier to follow. Extracting a custom Hook makes the data flow even more explicit: you feed the `url` in and you get the `data` out. **Custom Hooks let your components stay focused on the *intent* of your code rather than the implementation.** For example, if you later want to switch to a more efficient data fetching solution, it's easier to migrate from a Hook like `useData` than from raw `useEffect` calls across many different components. [Read more about data fetching with Effects and the alternatives.](/learn/you-might-not-need-an-effect#fetching-data)

<DeepDive title="When is extracting a custom Hook a good idea?">

Start by choosing your custom Hook's name. If you struggle to pick a clear name, it might mean that your Effect is too coupled to the rest of your component's logic, and is not yet ready to be extracted.

Ideally, your custom Hook's name should be clear enough that even a person who doesn't write code often could have a good guess about what your custom Hook does, what it takes, and what it returns:

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatConnection(roomId)`

When you synchronize with an external system, your custom Hook name may be more technical and use jargon specific to that system. It's good as long as it would be clear to a person familiar with that system:

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**Keep custom Hooks focused on concrete high-level use cases.** Avoid creating and using custom "lifecycle" Hooks that act as alternatives and convenience wrappers for the `useEffect` API itself:

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

For example, this `useMount` Hook tries to ensure some code only runs "on mount":

```js {2-3,12-13}
function ChatRoom() {
  // 🔴 Avoid: using custom "lifecycle" Hooks
  useMount(() => {
    const connection = createConnection();
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

**Custom "lifecycle" Hooks like `useMount` don't fit well into the React paradigm.** For example, if you used this `useMount` Hook instead of a raw `useEffect` in the earlier [chat room example](#effects-run-whenever-synchronization-is-needed), the linter wouldn't find the mistake in your code when you forgot to "react" to `roomId` changes. (And if you *don't* want some prop or state to cause the Effect to re-run, [there is a different recommended way to do that.](#reading-the-current-props-and-state-without-reacting-to-their-changes))

Similarly, if you alias the `useEffect(fn, [])` pattern with a "nicer" name like `useEffectOnce`, React's [remounting components in development](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) would make its name misleading. In general, if you find yourself trying to "work around" React's behavior in a custom Hook, it's time to pause and rethink the approach.

If you're writing an Effect, start by using the React API directly:

```js
// ✅ Good: raw Effects separated by purpose
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

Then, you can (but don't have to) extract custom Hooks for different high-level use cases:

```js
// ✅ Great: custom Hooks named after their purpose
function ChatRoom({ roomId }) {
  useChatConnection(roomId);
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**A good custom Hook makes the calling code more declarative by constraining what it does.** For example, `useChatConnection(roomId)` can only connect to the chat room, while `useImpressionLog(eventName, extraData)` can only send an impression log to the analytics. If your custom Hook API doesn't constrain the use cases and is very abstract, in the long run it's likely to introduce more problems than it solves.

</DeepDive>

### Updating state from an Effect {/*updating-state-from-an-effect*/}

This `handleMessage` function updates the `messages` state to a new array with the received message at the end:

```js {6-7,17}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    function handleMessage(receivedMessage) {
      // 🔴 Problem: makes the Effect re-run
      setMessages([...messages, receivedMessage]);
    }

    const connection = createConnection(roomId);
    connection.addListener('message', handleMessage);
    connection.connect();
    return () => {
      connection.removeListener('message', handleMessage);
      connection.disconnect();
    };
  }, [roomId, messages]); // ✅ All dependencies declared

  // ...
}
```

When you receive a chat message and call `setMessages` from your Effect, you trigger a re-render. During the next re-render, `messages` is different (you've just changed it), which makes the Effect re-run (because `messages` is now a dependency of your Effect). As a result, every newly received message makes you reconnect to the chat.

**You want to use the previous state value to calculate the next state, but you don't want to re-run the Effect.** [Pass an updater function](/apis/usestate#updating-state-based-on-the-previous-state) like `msgs => [...msgs, receivedMessage]` instead of reading the `messages` directly:

```js {6,16}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    function handleMessage(receivedMessage) {
      setMessages(msgs => [...msgs, receivedMessage]); // ✅ Does not use `messages`
    }

    const connection = createConnection(roomId);
    connection.addListener('message', handleMessage);
    connection.connect();
    return () => {
      connection.removeListener('message', handleMessage);
      connection.disconnect();
    };
  }, [roomId]); // ✅ All dependencies declared

  // ...
}
```

**You're not using the `messages` variable within your Effect anymore, so you don't need to declare it as a dependency.** Remember that the updater function you pass to `setMessages` will run during rendering, so it should be a [pure calculation](/learn/keeping-components-pure). It should *not* perform any side effects like calling other `set` functions. If you need to update state based on other state, combine it into a single object and, optionally, [manage it with a reducer.](/learn/extracting-state-logic-into-a-reducer)

### Extracting Event functions from Effects {/*extracting-event-functions-from-effects*/}

> **Code examples in this section don't work yet!** They rely on a [proposed `useEvent` API](https://github.com/reactjs/rfcs/pull/220).

In this example, you want to play a sound when the user receives a new message unless the Muted setting is on:

```js {6-11}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    function handleMessage(receivedMessage) {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    }

    const connection = createConnection(roomId);
    connection.addListener('message', handleMessage);
    connection.connect();
    return () => {
      connection.removeListener('message', handleMessage);
      connection.disconnect();
    };
  }, [roomId]); // 🔴 React Hook useEffect has a missing dependency: 'isMuted'

  function handleMuteClick() {
    setIsMuted(!isMuted);
  }

  // ...
```

There is a linter error in the above example. Since you read `isMuted` inside your Effect, you must add `isMuted` as a dependency. However, if you add `isMuted` to the dependency array, every Mute button press will re-run the Effect (because its dependency `isMuted` has changed) and reconnect to the chat server. It's bad that pressing the Mute button reconnects to the server. **You want the `handleMessage` function to read the latest value of the `isMuted` state variable, but you don't want to your Effect to re-run when the `isMuted` state variable changes.**

Effects re-run every time a value you read inside has changed. This makes sense for most code inside Effects: for example, [when you started using `roomId` inside the Effect,](#every-reactive-value-becomes-a-dependency) it made sense to reconnect if the `roomId` has changed. However, code inside `handleMessage` should behave like an event handler: [editing it shouldn't affect when the code runs.](#event-handlers-run-on-specific-interactions) **Extract `handleMessage` into an *Event function* out of your Effect with the [`useEvent`](/api/useevent) Hook:**

```js {1,7-12}
import { useState, useEffect, useEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const handleMessage = useEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.addListener('message', handleMessage);
    connection.connect();
    return () => {
      connection.removeListener('message', handleMessage);
      connection.disconnect();
    };
  }, [roomId]); // ✅ All dependencies declared

  function handleMuteClick() {
    setIsMuted(!isMuted);
  }

  // ...
```

Code inside Effects is reactive. It re-runs when the values inside change. If you don't want a part of your Effect's code to be reactive, extract it to an Event function like `handleMessage` above, and call that Event function from your Effect. **Event functions are omitted from dependencies. Editing them won't make any code run more often.**

#### Wrapping callbacks into Event functions {/*wrapping-callbacks-into-event-functions*/}

> **Code examples in this section don't work yet!** They rely on a [proposed `useEvent` API](https://github.com/reactjs/rfcs/pull/220).

Sometimes, the function you want to call may be passed from a parent component. If you don't want your Effect to "react" to changes to that function, wrap it into an Event function next to where you declare your Effect:

```js {2,6,9}
function ChatRoom({ roomId, onMessage }) {
  const handleMessage = useEvent(onMessage);

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.addListener('message', handleMessage);
    connection.connect();
    return () => {
      connection.removeListener('message', handleMessage);
      connection.disconnect();
    };
  }, [roomId]); // ✅ All dependencies declared

  // ...
```

If you tried to call `onMessage` directly from your Effect, you would have to include `onMessage` into your dependencies. This would cause your Effect to re-run whenever the parent component re-renders. However, `handleMessage` that you got from the `useEvent(onMessage)` declaration is an Event function. This means that you don't need to specify it in the Effect dependencies. Now it can never make your Effect re-run accidentally.

#### Reading the current props and state without reacting to their changes {/*reading-the-current-props-and-state-without-reacting-to-their-changes*/}

> **Code examples in this section don't work yet!** They rely on a [proposed `useEvent` API](https://github.com/reactjs/rfcs/pull/220).

In this example, the `ChatRoom` component sends an analytics log when the component is added to the screen:

```js {3-5}
function ChatRoom() {
  useEffect(() => {
    post('/analytics/event', {
      eventName: 'visit_chat',
    });
  }, []); // ✅ All dependencies declared
  // ...
}
```

Let's say you add a `roomId` prop and want to include it in the analytics log. You'll have to include it in the Effect dependencies. This ensures that you'll send an extra analytics log every time the user opens a *different* room:

```js {1,5,7}
function ChatRoom({ roomId }) {
  useEffect(() => {
    post('/analytics/event', {
      eventName: 'visit_chat',
      roomId: roomId
    });
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

Now let's say that you want to include some additional information about the application's state into your analytics. For example, you may want to include the user's current notification count into the analytics event:

```js {1,6}
function ChatRoom({ roomId, notificationCount }) {
  useEffect(() => {
    post('/analytics/event', {
      eventName: 'visit_chat',
      roomId: roomId,
      notificationCount: notificationCount
    });
  }, [roomId]); // 🔴 React Hook useEffect has a missing dependency: 'notificationCount'
  // ...
}
```

You're using `notificationCount` inside your Effect, so you must add it to the dependency list. However, if you do that, your Effect will re-run whenever the `notificationCount` changes. This doesn't make sense: a change to the number of notification doesn't mean that the user visited the chat again.

**From the user's perspective, "visiting the chat" is similar to an event: it happens at a particular moment in time, and the user can distinguish when it happened. To express this in code, declare it as an *Event function:***

```js {2,8,11}
function ChatRoom({ roomId, notificationCount }) {
  const handleVisit = useEvent((visitedRoomId) => {
    post('/analytics/event', {
      eventName: 'visit_chat',
      roomId: visitedRoomId,
      notificationCount: notificationCount
    });
  });

  useEffect(() => {
    handleVisit(roomId);
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

With this code, the first analytics log will include the initial `roomId` and the initial `notificationCount`. Then, if the `roomId` changes, your Effect will call `handleVisit` again and send a new analytics log with that `roomId` and the current `notificationCount`. However, if the `notificationCount` count changes alone, nothing will happen. **Code inside Event functions is not reactive, so editing `handleVisit` won't make your Effect run more often.**

### Removing object dependencies {/*removing-object-dependencies*/}

Suppose you have a `ChatRoom` component. It contains the `message` state variable that you use to track the currently typed message in the chat input. There's also an Effect that connects you to the chat server:

```js
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared

  // ...
}
```

Now you want to pass some extra options to the `createConnection()` call inside the Effect:

```js {4-6,9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🔴 Problem: makes the Effect re-run every time
    port: 12345,
  };

  useEffect(() => {
    const connection = createConnection(roomId, options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, options]); // ✅ All dependencies declared
  // ...
}
```

You've had to declare `options` as a dependency because it's used inside the Effect. However, this code doesn't work quite as you intended. With this code, whenever you type into the input (and the `message` state variable updates), the `ChatRoom` unnecessarily reconnects on every keystroke. Can you guess why this happens?

**The problem with this code is that your Effect depends on an object which is different for every render.**

Let's say that during the initial render, `roomId` is `"travel"`. The dependency array for the first render is:

```js
const options1 = { port: 12345 };
const deps1 = ["travel", options1]; // Dependencies from the initial render
```

Then, you start typing into the input. This changes the `message` state variable and [triggers a re-render.](/learn/render-and-commit) On every re-render of the `ChatRoom` component, its component function re-runs. This time, the dependency array is:

```js
const options2 = { port: 12345 };
const deps2 = ["travel", options2] // Dependencies from the re-render
```

Note that `options` is *not* a [state variable](/learn/state-a-components-memory) which get preserved between renders. It's a regular JavaScript variable. This is why it's created from scratch and set to a *completely new* `{ port: 12345 }` object every single time that it runs. React then compares each element in the `deps1` and `deps2` arrays using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison:

* `Object.is("travel", "travel")` is `true`. It is exactly the same string.
* `Object.is(options1, options2)` is **`false`. They are different objects created during different renders.**

Although the two `{ port: 12345 }` objects look the same in the code, [they are not the same object.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#comparing_objects) This is why, if you use `options` as a dependency, React thinks this dependency has changed and always re-runs your Effect.

#### Solution 1: Move the object outside the component {/*solution-1-move-the-object-outside-the-component*/}

If your object doesn't depend on any data from the component, move it *outside* your component:

```js {1-3,12}
const options = { // ✅ Not a dependency
  port: 12345,
};

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(roomId, options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

Notice that `options` is not in the list of dependencies anymore. By moving it outside your component, you have "proven" to React that the `options` object doesn't depend on props, state, or context. In other words, it isn't [reactive](#every-reactive-value-becomes-a-dependency), and so there is no need for your Effect to "react" to it. It doesn't participate in the data flow.

#### Solution 2: Move the object inside the Effect {/*solution-2-move-the-object-inside-the-effect*/}

You can't place the object outside if depends on some information from props, state, or context. For example, suppose that the `options` object contains information from the context which could change over time:

```js {6-11,17}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  const { port } = useContext(SettingsContext);
  const { token } = useContext(AuthContext);

  const options = { // 🔴 Problem: makes the Effect re-run every time
    port: port,
    auth: {
      token: token
    }
  };

  useEffect(() => {
    const connection = createConnection(roomId, options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, options]); // ✅ All dependencies declared
  // ...
}
```

This code has the same issue as [the first example.](#removing-object-dependencies) When the `message` changes, the `options` object gets re-created. Since it's different on every render, the Effect will re-run and reconnect to the server on every keystroke.

**In this example, the correct solution is to move the object *inside* the Effect itself:**

```js {7-12,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  const { port } = useContext(SettingsContext);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const options = { // ✅ Not a dependency
      port: port,
      auth: {
        token: token
      }
    };
    const connection = createConnection(roomId, options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, port, token]); // ✅ All dependencies declared
  // ...
}
```

Previously, `options` needed to be a dependency because it was declared directly in the component body. Now, your Effect *creates* the `options` object based on the `port` and `token` from the component body. This is why `port` and `token` must be dependencies now. Both `port` and `token` are [reactive values](#every-reactive-value-becomes-a-dependency). They could change over time, and then you would *want* the Effect to re-run. This is why declaring them as dependencies makes sense.

Since the `options` object is no longer a dependency, it doesn't make the Effect re-run unnecessarily.

#### Solution 3: Recreate the object from primitives {/*solution-3-recreate-the-object-from-primitives*/}

In the above example, both `port` and `token` are [primitive data types](https://developer.mozilla.org/en-US/docs/Glossary/Primitive). With primitive data types likes strings, numbers, and booleans, you don't need to worry about whether the value is *actually* different or accidentally different (like with objects). **Working with Effects is easier when you try to keep their dependencies primitive.**

Let's say you receive the whole `options` object as a prop:

```js {1,8}
function ChatRoom({ roomId, options }) { // Unclear: Could be a new object every time
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(roomId, options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, options]); // ✅ All dependencies declared
  // ...
}
```

You can't know whether the parent component will pass an `options` object that's "stable" (i.e. does not change between re-renders) or if it's going to create a completely different object every time that it re-renders.

Instead of accepting `options` as a prop, change your component to accept primitive props like `port` and `token`. Then, if you still need to create an `options` object to pass it to `createConnection()`, do this *inside* your Effect:

```js {1,5-10,14}
function ChatRoom({ roomId, port, token }) { // Primitive props
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = { // ✅ Not a dependency
      port: port,
      auth: {
        token: token
      }
    };
    const connection = createConnection(roomId, options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, port, token]); // ✅ All dependencies declared
  // ...
}
```

Now `options` is created inside the Effect, so it's not a dependency. Both `port` and `token` are dependencies, but they're primitive so you can be confident that if they change, the Effect *definitely* needs to re-run.

In the above example, the `ChatRoom` component accepts the `port` and `token` props directly. If you prefer a single `options` prop, you can read the primitives out of it so that the Effect can depend on the `port` and `token`:

```js {1,4,5}
function ChatRoom({ roomId, options }) {
  const [message, setMessage] = useState('');

  const port = options.port;
  const token = options.auth.token;

  // ...
```

However, primitive props are often easier to work with, so you should consider that first.

#### Solution 4: Calculate primitives from an object {/*solution-4-calculate-primitives-from-an-object*/}

This `ProductList` component fetches a list of products according to an object from state. It creates a [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) object to format the query string based on the search options that the user has picked:

```js {8-9,12,22}
function ProductList() {
  const [products, setProducts] = useState(null);
  const [searchOptions, setSearchOptions] = useState({
    categories: ['phones', 'laptops'],
    color: 'green'
  });

  // 🔴 Problem: makes the Effect re-run every time
  const urlParams = new URLSearchParams(searchOptions);

  useEffect(() => {
    fetch(`/api/search?${urlParams}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setProducts(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [urlParams]); // ✅ All dependencies declared

  // ...
}
```

When the JSON is fetched, the Effect calls `setProducts(json)`, which causes the `ProductList` component to re-render. However, this causes the `urlParams` object to be created *again,* which means the Effect dependencies have *changed,* and the Effect re-runs. This causes an infinite loop of fetching and refetching.

**To fix this infinite refetching Effect loop, replace the object dependency with a primitive dependency.**

Calculating the URL is a [pure calculation](/learn/keeping-components-pure) so you can do it during rendering instead of doing it inside the Effect. Then your Effect can depend on the `url` string (which is a primitive value) instead of the `urlParams` object:

```js {9,12,22}
function ProductList() {
  const [products, setProducts] = useState(null);
  const [searchOptions, setSearchOptions] = useState({
    categories: ['phones', 'laptops'],
    color: 'green'
  });

  const urlParams = new URLSearchParams(searchOptions);
  const url = `/api/search?${urlParams}`; // ✅ Primitive dependency

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setProducts(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]); // ✅ All dependencies declared

  // ...
}
```

When your Effect calls `setProducts(json)`, the component still needs to re-render. It creates a new `urlParams` object every time. Then you calculate a `url` string from it, which is a primitive value. Since the `url` is the same string as the last time, it doesn't re-run the Effect. This fixes the infinite refetching loop in the original example.

#### Other ways to remove object dependencies {/*other-ways-to-remove-object-dependencies*/}

If you can't move the object outside your component or inside your Effect, there may be other ways to make a dependency unnecessary. Check if it makes sense to [remove this Effect](#removing-an-effect), [split it in two](#splitting-an-effect-in-two), [update state with an updater function](#updating-state-from-an-effect), [extract an Event function](#extracting-event-functions-from-effects), or [read the latest props and state without re-triggering the Effect.](#reading-the-current-props-and-state-without-reacting-to-their-changes)

### Removing function dependencies {/*removing-function-dependencies*/}

Like [object dependencies](#removing-object-dependencies), function dependencies may cause your Effect to re-run more often than necessary. When a `function() {}` or an arrow `() => {}` function declaration executes, it creates a *different* function. If your Effect calls a function you've declared inside the component body, your Effect must specify that function as a dependency--but this makes your Effect re-run after every render! The way you'll solve this depends on the case. Usually, you will want to change your code so that it *doesn't depend* on a function. Here's a few examples.

#### Solution 1: Move the function outside the component {/*solution-1-move-the-function-outside-the-component*/}

In this example, the `createConnection` function is declared directly in the component body:

```js {2,11,14}
function ChatRoom({ roomId, port }) {
  function createConnection() { // 🔴 Problem: makes the Effect re-run every time
    return new ChatConnection({
      host: 'mychatserver.com',
      port: port,
      endpoint: `/rooms/${roomId}`
    });
  }

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection]); // ✅ All dependencies declared

  // ...
```

The code inside your Effect uses `createConnection`, so you must specify it as a dependency. However, that would make your Effect re-run on every re-render of the `ChatRoom` component, always reconnecting to the chat.

**This function doesn't contain any component-specific logic, so move it outside the component:**

```js {1-6,11,14}
function createConnection(port, roomId) {
  return new ChatConnection({
    host: 'mychatserver.com',
    port: port,
    endpoint: `/rooms/${roomId}`
  });
}

function ChatRoom({ roomId, port }) {
  useEffect(() => {
    const connection = createConnection(port, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [port, roomId]); // ✅ All dependencies declared

  // ...
```

This might remind you of [moving an object outside the component](#solution-1-move-the-object-outside-the-component). By moving your `createConnection` function outside the component, you've "proven" to React that it doesn't depend on any props or state which change over time. This function doesn't participate in the rendering data flow, so it doesn't need to cause your Effect to re-run. However, your Effect re-runs and reconnects to the chat (as it should) if either `port` and `roomId` change.

#### Solution 2: Move the function inside the Effect {/*solution-2-move-the-function-inside-the-effect*/}

If the function is not called from anywhere else, you can also move it *inside* your Effect instead:

```js {3-9,11,14}
function ChatRoom({ roomId, port }) {
  useEffect(() => {
    function createConnection() {
      return new ChatConnection({
        host: 'mychatserver.com',
        port: port,
        endpoint: `/rooms/${roomId}`
      });
    }

    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, port]); // ✅ All dependencies declared

  // ...
```

This might remind you of [moving an object inside your Effect](#solution-2-move-the-object-inside-the-effect). Now that `createConnection` does not exist outside of your Effect, it's not a dependency and can't trigger a re-render. Declaring functions inside Effects lets you keep the Effect's code organized without exposing these functions to the rest of your component's code.

#### Solution 3: Calculate primitives during rendering {/*solution-3-calculate-primitives-during-rendering*/}

In this example, the `getEndpointUrl` function is called from within the Effect:

```js {8,14,24}
function ProductList() {
  const [products, setProducts] = useState(null);
  const [searchOptions, setSearchOptions] = useState({
    categories: ['phones', 'laptops'],
    color: 'green'
  });

  function getEndpointUrl() { // 🔴 Problem: makes the Effect re-run every time
    const urlParams = new URLSearchParams(searchOptions);
    return `/api/search?${urlParams}`;
  }

  useEffect(() => {
    fetch(getEndpointUrl())
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setProducts(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [getEndpointUrl]); // ✅ All dependencies declared

  // ...
}
```

Here, you're using `getEndpointUrl` inside the Effect so you must specify it as a dependency. However, this causes the Effect to run in an infinite asynchronous loop. First, this Effect fetches the JSON and updates the state. Updating the state triggers a re-render. This time, the `getEndpointUrl` function is different (it's new on every render). Since a dependency of the Effect has changed, the Effect runs again, and so it will keep on going.

**Because `getEndpointUrl()` is a [pure calculation](/learn/keeping-components-pure) that returns a primitive value, do it during rendering instead:**

```js {13,16,26}
function ProductList() {
  const [products, setProducts] = useState(null);
  const [searchOptions, setSearchOptions] = useState({
    categories: ['phones', 'laptops'],
    color: 'green'
  });

  function getEndpointUrl() {
    const urlParams = new URLSearchParams(searchOptions);
    return `/api/search?${urlParams}`;
  }

  const url = getEndpointUrl(); // ✅ Primitive dependency

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setProducts(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]); // ✅ All dependencies declared

  // ...
}
```

This might remind you of [calculating primitives from an object](#solution-4-calculate-primitives-from-an-object). This Effect doesn't need to depend on the `getEndpointUrl` *function* because all it needs to know is the `url` to fetch. Figuring out the `url` is a [pure calculation](/learn/keeping-components-pure) so it is safe to do during rendering. Since the `url` is a string (and two strings are only considered "the same" in JavaScript when their contents match), it would never cause the Effect to re-run without a need.

#### Solution 4: Extract an Event function {/*solution-4-extract-an-event-function*/}

> **Code examples in this section don't work yet!** They rely on a [proposed `useEvent` API](https://github.com/reactjs/rfcs/pull/220).

In this example, the Effect uses a `handleMessage` function declared in the component body:

```js {5,14,17,20}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  function handleMessage(receivedMessage) { // 🔴 Problem: makes the Effect re-run every time
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  }

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.addListener('message', handleMessage);
    connection.connect();
    return () => {
      connection.removeListener('message', handleMessage);
      connection.disconnect();
    };
  }, [roomId, handleMessage]); // ✅ All dependencies declared

  // ...
}
```

You have to specify `handleMessage` as a dependency, but it's a different function on every render so it causes the Effect to re-run after every render. As a result, the chat reconnects every time the user receives a message.

The first thing you can try is to move the `handleMessage` function [inside the Effect](#solution-2-move-the-function-inside-the-effect). However, then you'll notice that the code inside it uses the `isMuted` state variable, so you'd have to specify `isMuted` in dependencies instead. This would make the Effect reconnect to the chat whenever the user mutes or unmutes the chat.

**From the user's perspective, "receiving a message" is similar to an event: it happens at a particular moment in time, and the user can distinguish when it happened. To express this in code, declare it as an *Event function:***

```js {1,7,12,22}
import { useState, useEffect, useEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const handleMessage = useEvent((receivedMessage) => { // ✅ Not a dependency
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.addListener('message', handleMessage);
    connection.connect();
    return () => {
      connection.removeListener('message', handleMessage);
      connection.disconnect();
    };
  }, [roomId]); // ✅ All dependencies declared

  // ...
}
```

Event functions read the current props and state (like `isMuted`) without causing the Effect to re-run. They don't participate in the rendering data flow, so they aren't dependencies. [Read more about declaring Event functions.](#extracting-event-functions-from-effects)

<Gotcha>

Don't use Event functions for [logic that needs to "react" to prop and state changes.](#effects-run-whenever-synchronization-is-needed)

For example, this `createConnection` function should **not** be an Event function:

```js {2}
function ChatRoom() {
  const createConnection = useEvent(() => { // 🔴 Avoid: Synchronization logic in an Event function
    return new ChatConnection({
      host: 'mychatserver.com'
    });
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared

  // ...
}
```

To see why this code is buggy, imagine you're adding a `roomId` prop and read it in `createConnection`:

```js {1,5}
function ChatRoom({ roomId }) {
  const createConnection = useEvent(() => { // 🔴 Avoid: Synchronization logic in an Event function
    return new ChatConnection({
      host: 'mychatserver.com',
      endpoint: `/rooms/${roomId}`
    });
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared

  // ...
}
```

Since `roomId` is not used *inside* your Effect, it won't reconnect to the chat when `roomId` changes. Normally, [the linter would catch a bug like this,](#every-reactive-value-becomes-a-dependency) but **by incorrectly declaring `createConnection` as an Event function,** you've opted out of "reacting" to the changes to the values used inside of it.

To fix the bug, ensure that all synchronization code remains *inside* the Effect:

```js {3-9,14}
function ChatRoom({ roomId }) {
  useEffect(() => {
    function createConnection() {
      // ✅ Reactive synchronization logic remains inside the Effect
      return new ChatConnection({
        host: 'mychatserver.com',
        endpoint: `/rooms/${roomId}`
      });
    }

    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared

  // ...
}
```


Code in Effects [re-runs when synchronization is needed](#effects-run-whenever-synchronization-is-needed). You *want* the code using `roomId` to re-run whenever the `roomId` changes. This is why `new ChatConnection()` call which relies on the `roomId` **should not** be inside an Event function. This code should be *synchronized* with the current `roomId` value.

</Gotcha>  

## Recap {/*recap*/}

TODO

## Challenges {/*challenges*/}

TODO