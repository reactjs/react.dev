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

`useOptimistic` is a React Hook that lets you optimistically update the UI.

```js
import { useOptimistic } from 'react';

function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState, newState) => {
      // merge and return new state
    }
  );
}
```

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `state`: `state` is the source of truth so if the `state` is ever changed and we get a new value in from the server, the return value `optimisticState` will be set the that too since it will always treat `state` as the final source of truth.
* `updateFn`: `updateFn` is the mutation that will occur to `optimisticState` when `addOptimistic` is called. `updateFn` takes in two parameters. The `currentState` and the `newState`. The return value will be the merged value of the `currentState` and `newState`.


#### Returns {/*returns*/}

* `optimisticState`: `optimisticState` is the optimistic state, it will default to what `state` is.
* `addOptimistic`: `addOptimistic` is the dispatching function to call that will run what we define in `updateFn`.

---

## Usage {/*usage*/}

### Optimistically update the UI while waiting for a network request {/*optimistically-update-while-waiting-for-network*/}

<Sandpack>

```js like-button.js active
import { useOptimistic } from "react";

export function LikeButton({ likes, updateLikes, disabled }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (likes) => likes + 1
  );

  async function addLike() {
    addOptimisticLike();
    await updateLikes(likes);
  }

  return (
    <button disabled={disabled} onClick={addLike}>
      Like {optimisticLikes}
    </button>
  );
}
```


```js App.js
import { useState } from "react";
import { LikeButton } from "./like-button.js";

export default function App() {
  const [likes, setLikes] = useState(0);
  const [updating, setUpdating] = useState(false);
  async function updateLikes(num) {
    setUpdating(true);
    await new Promise((res) => setTimeout(res, 1000));
    setLikes(num + 1);
    setUpdating(false);
  }
  return (
    <LikeButton likes={likes} updateLikes={updateLikes} disabled={updating} />
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>


### Optimistically updating forms {/*optimistically-updating-with-forms*/}

The `useOptimistic` Hook provides a way to optimistically update the user interface before a background operation, like a network request, completes. In the context of forms, this technique helps to make apps feel more responsive. When a user submits a form, instead of waiting for the server's response to reflect the changes, the interface is immediately updated with the expected outcome.

For example, when a user types a message into the form and hits the "Send" button, the `useOptimistic` Hook allows the message to immediately appear in the list with a "Sending..." label, even before the message is actually sent to a server. This "optimistic" approach gives the impression of speed and responsiveness. The form then attempts to truly send the message in the background. Once the server confirms the message has been received, the "Sending..." label is removed.

<Sandpack>


```js App.js
import { useOptimistic, useState } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    document.getElementById("message-form").reset();
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
      <form action={formAction} id="message-form">
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
