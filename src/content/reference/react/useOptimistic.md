---
title: useOptimistic
canary: true
---

<Canary>

The `useOptimistic` Hook is currently only available in React's canary and experimental channels. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`useOptimistic` is a React Hook that lets you optimistically update the UI.

```js
  const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useOptimistic(state, updateFn)` {/*use*/}

`useOptimistic` is a React hook that lets you show a different state while an async action is underway. It accepts some state as an argument and returns a copy of that state that can be different during the duration of an async action such as a network request. You provide a function that takes the current state and the input to the action, and returns the optimistic state to be used while the action is pending.

This state is called the "optimistic" state because it is usually used to immediately present the user with the result of performing an action, even though the action actually takes time to complete.

```js
import { useOptimistic } from 'react';

function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState, optimisticValue) => {
      // merge and return new state
      // with optimistic value
    }
  );
}
```

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `state`: the value to be returned initially and whenever no action is pending.
* `updateFn(currentState, optimisticValue)`: a function that takes the current state and the optimistic value passed to `addOptimistic` and returns the resulting optimistic state. It must be a pure function. `updateFn` takes in two parameters. The `currentState` and the `optimisticValue`. The return value will be the merged value of the `currentState` and `optimisticValue`.


#### Returns {/*returns*/}

* `optimisticState`: The resulting optimistic state. It is equal to `state` unless an action is pending, in which case it is equal to the value returned by `updateFn`.
* `addOptimistic`: `addOptimistic` is the dispatching function to call when you have an optimistic update. It takes one argument, `optimisticValue`, of any type and will call the `updateFn` with `state` and `optimisticValue`.

---

## Usage {/*usage*/}

### Optimistically updating forms {/*optimistically-updating-with-forms*/}

The `useOptimistic` Hook provides a way to optimistically update the user interface before a background operation, like a network request, completes. In the context of forms, this technique helps to make apps feel more responsive. When a user submits a form, instead of waiting for the server's response to reflect the changes, the interface is immediately updated with the expected outcome.

For example, when a user types a message into the form and hits the "Send" button, the `useOptimistic` Hook allows the message to immediately appear in the list with a "Sending..." label, even before the message is actually sent to a server. This "optimistic" approach gives the impression of speed and responsiveness. The form then attempts to truly send the message in the background. Once the server confirms the message has been received, the "Sending..." label is removed.

<Sandpack>


```js App.js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages([...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>
