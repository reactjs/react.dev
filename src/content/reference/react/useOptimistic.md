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
  const [optimistic, addOptimistic] = useOptimistic(initialState, updateFn);
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useOptimistic(initialState, updateFn)` {/*use*/}

`useOptimistic` is a React Hook that lets you optimistically update the UI.

🚧

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `initialState`: 🚧
* `updateFn`: 🚧

#### Returns {/*returns*/}

* `optimistic`: 🚧
* `addOptimistic`: 🚧

#### Caveats {/*caveats*/}

* 🚧

---

## Usage {/*usage*/}

### Optimistically update the UI while waiting for a network request {/*optimistically-update-while-waiting-for-network*/}

<Sandpack>

```js like-button.js active
import { experimental_useOptimistic as useOptimistic } from "react";

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
import { experimental_useOptimistic as useOptimistic, useState } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        message: newMessage,
        sending: true
      }
    ]
  );

  return (
    <div>
      {optimisticMessages.map((m, i) => (
        <div key={i}>
          {m.message}
          <small>{m.sending ? " (Sending...)" : ""}</small>
        </div>
      ))}
      <form
        action={sendMessage}
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          addOptimisticMessage(formData.get("message"));
          form.reset();
          await sendMessage(formData);
        }}
      >
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { message: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages([...messages, { message: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js actions.js hidden
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
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

---

## Troubleshooting {/*troubleshooting*/}

🚧
