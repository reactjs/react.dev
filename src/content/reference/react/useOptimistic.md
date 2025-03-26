---
title: useOptimistic
---

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

`useOptimistic` is a React Hook that lets you show a different state while an async action is underway. It accepts some state as an argument and returns a copy of that state that can be different during the duration of an async action such as a network request. You provide a function that takes the current state and the input to the action, and returns the optimistic state to be used while the action is pending.

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
* `updateFn(currentState, optimisticValue)`  (optional but recommended): A pure function that accepts the current state and an `optimisticValue`, returning the resulting optimistic state to be used during the pending action. This function is crucial for merging the current state with the optimistic update. While optional, omitting this function may result in the state remaining unchanged during the async action, as the hook will fall back to returning the initial. 

**Note**: Although you can omit `updateFn`, doing so will cause `useOptimistic` to keep the state static during async actions, which might not align with the desired behavior in most scenarios. By providing `updateFn`, you ensure that the state properly reflects optimistic updates while the action is pending.

#### Returns {/*returns*/}

* `optimisticState`: The resulting optimistic state. It is equal to `state` unless an action is pending, in which case it is equal to the value returned by `updateFn`.
* `addOptimistic`: `addOptimistic` is the dispatching function to call when you have an optimistic update. It takes one argument, `optimisticValue`, of any type and will call the `updateFn` with `state` and `optimisticValue`.

---

## Usage {/*usage*/}

### Optimistically updating forms {/*optimistically-updating-with-forms*/}

The `useOptimistic` Hook provides a way to optimistically update the user interface before a background operation, like a network request, completes. In the context of forms, this technique helps to make apps feel more responsive. When a user submits a form, instead of waiting for the server's response to reflect the changes, the interface is immediately updated with the expected outcome, giving the impression of a faster interaction.

For example, when a user types a message into the form and hits the "Send" button, the `useOptimistic` Hook allows the message to immediately appear in the list with a "Sending..." label, even before the message is actually sent to a server. This "optimistic" approach gives the impression of speed and responsiveness. The form then attempts to truly send the message in the background. Once the server confirms the message has been received, the "Sending..." label is removed.

<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
    const formRef = useRef(); // Ref to reset the form after submission

  // Function to handle form submission
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message")); // Add the new message optimistically
    formRef.current.reset(); // Reset the form after submission
    await sendMessage(formData); // Send the actual message asynchronously
  }

    // Define the optimistic state and the function to add optimistic messages
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,    // The update function merges the new optimistic message into the current state
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true // Mark the message as sending until the async action completes

      }
    ]
  );

  return (
    <>
          {/* Render the list of messages, including the optimistic ones */}
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      {/* Form to send a new message */}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }// Initial message state
  ]);
    // Function to send the message and update the state when it successfully sends
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message")); // Simulate sending the message
    setMessages((messages) => [...messages, { text: sentMessage }]); // Add the sent message to the state
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));// Simulate network delay
  return message; // Return the message after the delay
}
```


</Sandpack>
