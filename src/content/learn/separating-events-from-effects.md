---
title: Separating Events from Effects
translatedTitle: 이벤트와 Effect 분리하기
translators: [유은미, 전시윤, 김아영, 정재남]
---

<Intro>

Event handlers only re-run when you perform the same interaction again. Unlike event handlers, Effects re-synchronize if some value they read, like a prop or a state variable, is different from what it was during the last render. Sometimes, you also want a mix of both behaviors: an Effect that re-runs in response to some values but not others. This page will teach you how to do that.
<Trans>이벤트 핸들러 같은 상호 작용을 다시 수행할 때만 다시 실행됩니다. 이벤트 핸들러와 달리, Effect는 prop 또는 state 변수와 같은 일부 값을 마지막 렌더링 때와 다른 값으로 읽게 되면 다시 동기화됩니다. 때로는 일부 값에 대한 응답으로 다시 실행되는 Effect와 그렇지 않은 Effect의 혼합이 필요할 때도 있습니다. 이 페이지에서는 이를 어떻게 수행할 수 있는지 알려드립니다.</Trans>

</Intro>

<YouWillLearn>

- How to choose between an event handler and an Effect
- Why Effects are reactive, and event handlers are not
- What to do when you want a part of your Effect's code to not be reactive
- What Effect Events are, and how to extract them from your Effects
- How to read the latest props and state from Effects using Effect Events
<TransBlock>
* 이벤트 핸들러와 Effect 중에서 선택하는 방법
* Effect는 반응형이고 이벤트 핸들러는 반응형이 아닌 이유
* Effect 코드의 일부가 반응하지 않기를 원할 때 해야 할 일
* Effect 이벤트란 무엇이며 Effect에서 추출하는 방법
* Effect 이벤트를 사용하여 Effect에서 최신 props 및 state를 읽는 방법
</TransBlock>

</YouWillLearn>

## Choosing between event handlers and Effects <Trans>이벤트 핸들러와 Effect 중 선택하기</Trans> {/*choosing-between-event-handlers-and-effects*/}

First, let's recap the difference between event handlers and Effects.
<Trans>먼저, 이벤트 핸들러와 Effect의 차이점에 대해 다시 한번 살펴보겠습니다.</Trans>

Imagine you're implementing a chat room component. Your requirements look like this:
<Trans>채팅방 컴포넌트를 구현한다고 상상해보세요. 요구 사항을 다음과 같습니다:</Trans>

1. Your component should automatically connect to the selected chat room.
1. When you click the "Send" button, it should send a message to the chat.

<TransBlock>
1. 컴포넌트는 선택한 채팅방에 자동으로 연결되어야 합니다.
2. “전송” 버튼을 클릭하면, 채팅에 메시지를 전송해야 합니다. 
</TransBlock>

Let's say you've already implemented the code for them, but you're not sure where to put it. Should you use event handlers or Effects? Every time you need to answer this question, consider [*why* the code needs to run.](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)
<Trans>이미 코드를 구현했지만, 이 코드를 어디에 놓아야 할지 확실하지 않습니다. 이벤트 핸들러와 Effects 중 어떤 것을 사용해야 할까요? 이 질문에 대답할 때마다, [코드가 실행되어야하는 *이유*](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)를 생각해야합니다.</Trans>

### Event handlers run in response to specific interactions <Trans>이벤트 핸들러는 특정 상호 작용에 대한 응답으로 실행됩니다.</Trans> {/*event-handlers-run-in-response-to-specific-interactions*/}

From the user's perspective, sending a message should happen *because* the particular "Send" button was clicked. The user will get rather upset if you send their message at any other time or for any other reason. This is why sending a message should be an event handler. Event handlers let you handle specific interactions:
<Trans>사용자 관점에서 메시지를 보내는 것은 특정 “전송” 버튼을 클릭했기 때문에 발생되어야 합니다. 메시지가 다른 시간이나 다른 이유로 보내지면 사용자들은 화를 낼 것입니다. 이것이 메시지를 보내는 것이 이벤트 핸들러여야하는 이유입니다. 이벤트 핸들러를 사용하면 특정 상호 작용에 대한 처리를 할 수 있습니다:</Trans>

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>;
    </>
  );
}
```

With an event handler, you can be sure that `sendMessage(message)` will *only* run if the user presses the button.
<Trans>이벤트 핸들러를 사용하면 사용자가 버튼을 누를 때만 `sendMessage(message)` 가 실행된다는 것을 확신할 수 있습니다.</Trans>

### Effects run whenever synchronization is needed <Trans>Effect는 동기화가 필요할 때마다 실행됩니다</Trans> {/*effects-run-whenever-synchronization-is-needed*/}
s
Recall that you also need to keep the component connected to the chat room. Where does that code go?
<Trans>컴포넌트를 채팅방에 연결한 상태로 유지해야 합니다. 이 코드는 어디에 넣어야 할까요?</Trans>

The *reason* to run this code is not some particular interaction. It doesn't matter why or how the user navigated to the chat room screen. Now that they're looking at it and could interact with it, the component needs to stay connected to the selected chat server. Even if the chat room component was the initial screen of your app, and the user has not performed any interactions at all, you would *still* need to connect. This is why it's an Effect:
<Trans> 코드를 실행해야 하는 *이유*는 특정 상호 작용이 아닙니다. 사용자가 채팅방 화면으로 이동한 이유나 방법은 중요하지 않습니다. 사용자들이 채팅방 화면을 보고 상호작용 할 수 있어야하기 때문에, 컴포넌트는 선택한 채팅 서버에 계속 연결되어 있어야 합니다. 앱의 초기 화면이 채팅방 컴포넌트이고, 사용자가 어떤 상호작용도 수행하지 않았더라도 *여전히* 채팅 서버에 연결되어야 합니다. 이것이 바로 Effect인 이유입니다:</Trans>

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

With this code, you can be sure that there is always an active connection to the currently selected chat server, *regardless* of the specific interactions performed by the user. Whether the user has only opened your app, selected a different room, or navigated to another screen and back, your Effect ensures that the component will *remain synchronized* with the currently selected room, and will [re-connect whenever it's necessary.](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)
<Trans>이 코드를 사용하면, 사용자가 수행한 특정 상호작용과는 무관하게, 항상 현재 선택된 채팅 서버에 대한 활성화된 연결이 있음을 확신할 수 있습니다. 사용자가 앱을 열었을 때 뿐만 아니라, 다른 채팅방을 선택하거나 다른 화면으로 이동했다가 다시 돌아와도 Effect가 현재 선택된 방과 동기화되어 컴포넌트에 항상 현재 선택된 채팅서버가 연결된 상태가 유지됩니다. 또한, 필요할 때마다 [다시 연결됩니다.](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js chat.js
export function sendMessage(message) {
  console.log('🔵 You sent: ' + message);
}

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input, select { margin-right: 20px; }
```

</Sandpack>

## Reactive values and reactive logic <Trans>반응형 값 및 반응형 로직</Trans> {/*reactive-values-and-reactive-logic*/}

Intuitively, you could say that event handlers are always triggered "manually", for example by clicking a button. Effects, on the other hand, are "automatic": they run and re-run as often as it's needed to stay synchronized.
<Trans>직관적으로, 이벤트 핸들러는 버튼을 클릭하는 등 항상 “수동”으로 촉발시킨다고 말할 수 있습니다. 반면에 Effect는 "자동"으로 동기화 상태를 유지하는 데 필요한 만큼 자주 다시 실행됩니다.</Trans>

There is a more precise way to think about this.
<Trans>이에 대해 더 정확하게 생각할 수 있는 방법이 있습니다.</Trans>

Props, state, and variables declared inside your component's body are called <CodeStep step={2}>reactive values</CodeStep>. In this example, `serverUrl` is not a reactive value, but `roomId` and `message` are. They participate in the rendering data flow:
<Trans>컴포넌트 본문 내부에 선언된 props, state, 변수를 <CodeStep step={2}>반응형 값</CodeStep>이라고 합니다. 이 예제에서 `serverUrl`은 반응형 값이 아니지만 `roomId`와 `message`는 반응형 값입니다. 이들은 렌더링 데이터 흐름에 참여합니다:</Trans>

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

Reactive values like these can change due to a re-render. For example, the user may edit the `message` or choose a different `roomId` in a dropdown. Event handlers and Effects respond to changes differently:
<Trans>이와 같은 반응형 값은 리렌더링으로 인해 변경될 수 있습니다. 예를 들어, 사용자가 `message`를 수정하거나 드롭다운에서 다른 `roomId`를 선택할 수 있습니다. 이벤트 핸들러와 Effect는 변경 사항에 다르게 반응합니다:</Trans>

- **Logic inside event handlers is *not reactive.*** It will not run again unless the user performs the same interaction (e.g. a click) again. Event handlers can read reactive values without "reacting" to their changes.
- **Logic inside Effects is *reactive.*** If your Effect reads a reactive value, [you have to specify it as a dependency.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Then, if a re-render causes that value to change, React will re-run your Effect's logic with the new value.

<TransBlock>
- **이벤트 핸들러 내부의 로직은 *반응형이 아닙니다*.** 사용자가 동일한 상호작용(예: 클릭)을 다시 수행하지 않는 한 다시 실행되지 않습니다. 이벤트 핸들러는 변경에 "반응"하지 않고 반응형 값을 읽을 수 있습니다.
- **Effects 내부의 로직은 *반응형입니다*.** Effect에서 반응형 값을 읽는 경우 [의존성으로 지정해야 합니다.](https://react.dev/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) 그런 다음 리렌더링으로 인해 해당 값이 변경되면 React는 새 값으로 Effect의 로직을 다시 실행합니다.
</TransBlock>

Let's revisit the previous example to illustrate this difference.
<Trans>이 차이점을 설명하기 위해 이전 예제를 다시 살펴보겠습니다.</Trans>

### Logic inside event handlers is not reactive <Trans>이벤트 핸들러 내부의 로직은 반응형이 아닙니다</Trans> {/*logic-inside-event-handlers-is-not-reactive*/}

Take a look at this line of code. Should this logic be reactive or not?
<Trans>이 코드 라인를 살펴보세요. 이 로직이 반응형이어야 할까요, 아닐까요?</Trans>

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

From the user's perspective, **a change to the `message` does _not_ mean that they want to send a message.** It only means that the user is typing. In other words, the logic that sends a message should not be reactive. It should not run again only because the <CodeStep step={2}>reactive value</CodeStep> has changed. That's why it belongs in the event handler:
<Trans>사용자의 관점에서 볼 때 **`message`가 변경되었다고 해서 메시지를 보내겠다는 뜻은 아닙니다.** 사용자가 입력 중이라는 의미일 뿐입니다. 즉, 메시지를 전송하는 로직은 반응적이어서는 안 됩니다. <CodeStep step={2}>반응형 값</CodeStep>이 변경되었다는 이유만으로 다시 실행되어서는 안 됩니다. 이것이 바로 이벤트 핸들러에 속하는 이유입니다:</Trans>

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

Event handlers aren't reactive, so `sendMessage(message)` will only run when the user clicks the Send button.
<Trans>이벤트 핸들러는 반응형이 아니므로 사용자가 보내기 버튼을 클릭할 때만 `sendMessage(message)`가 실행됩니다.</Trans>

### Logic inside Effects is reactive <Trans>Effect 내부의 로직은 반응형입니다</Trans> {/*logic-inside-effects-is-reactive*/}

Now let's return to these lines:
<Trans>이제 이 라인으로 돌아가 보겠습니다:</Trans>

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

From the user's perspective, **a change to the `roomId` *does* mean that they want to connect to a different room.** In other words, the logic for connecting to the room should be reactive. You *want* these lines of code to "keep up" with the <CodeStep step={2}>reactive value</CodeStep>, and to run again if that value is different. That's why it belongs in an Effect:
<Trans>사용자 입장에서 보면, **`roomId`가 변경되었다는 것은 다른 룸에 연결하고 싶다는 의미입니다.** 즉, 방에 연결하기 위한 로직은 반응형이어야 합니다. 이러한 코드 라인은 <CodeStep step={2}>반응형 값</CodeStep>을 “따라잡고”, 값이 달라지면 다시 실행되기를 원합니다. 이것이 바로 Effect에 속하는 이유입니다:</Trans>

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Effects are reactive, so `createConnection(serverUrl, roomId)` and `connection.connect()` will run for every distinct value of `roomId`. Your Effect keeps the chat connection synchronized to the currently selected room.
<Trans>Effect는 반응형이므로 `createConnection(serverUrl, roomId)` 및 `connection.connect()` 코드는 `roomId`의 모든 고유값에 대해 실행됩니다. Effect는 현재 선택된 방에 따라 채팅 연결을 동기화합니다.</Trans>

## Extracting non-reactive logic out of Effects <Trans>Effect에서 비반응성 로직 추출하기</Trans> {/*extracting-non-reactive-logic-out-of-effects*/}

Things get more tricky when you want to mix reactive logic with non-reactive logic.
<Trans>반응형 로직과 비반응형 로직을 함께 사용하려는 경우 상황이 더 까다로워집니다.</Trans>

For example, imagine that you want to show a notification when the user connects to the chat. You read the current theme (dark or light) from the props so that you can show the notification in the correct color:
<Trans>예를 들어, 사용자가 채팅에 연결할 때 알림을 표시하고 싶다고 가정해 봅시다. props에서 현재 테마(dark or light)를 읽어 올바른 색상으로 알림을 표시합니다:</Trans>

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    // ...
```

However, `theme` is a reactive value (it can change as a result of re-rendering), and [every reactive value read by an Effect must be declared as its dependency.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Now you have to specify `theme` as a dependency of your Effect:
<Trans>그러나, `theme`는 반응형 값이며(리렌더링의 결과로 변경될 수 있음), [Effect에서 읽는 모든 반응형 값은 의존성으로 선언해야 합니다](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency). 이제 `theme`를 Effect의 의존성으로 지정해야 합니다:</Trans>

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ All dependencies declared
  // ...
```

Play with this example and see if you can spot the problem with this user experience:
<Trans>이 예제를 실행하면서 이 사용자 경험의 문제점을 발견할 수 있는지 확인해 보세요:</Trans>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

When the `roomId` changes, the chat re-connects as you would expect. But since `theme` is also a dependency, the chat *also* re-connects every time you switch between the dark and the light theme. That's not great!
<Trans>`roomId` 가 변경되면, 예상한대로 채팅이 다시 연결됩니다. 하지만 `theme`도 의존성이기 때문에 dark 테마와 light 테마 사이를 전환할 때마다 채팅이 *또다시*  다시 연결됩니다. 좋지 않죠!</Trans>

In other words, you *don't* want this line to be reactive, even though it is inside an Effect (which is reactive):
<Trans>다시 말해, 이 라인이 반응형 Effect안에 있더라도 이 라인이 반응형 Effect가 되는 것을 원하지 않는다는 뜻입니다:</Trans>

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

You need a way to separate this non-reactive logic from the reactive Effect around it.
<Trans>이 비반응형 로직을 주변의 반응형 Effect로부터 분리할 수 있는 방법이 필요합니다.</Trans>

### Declaring an Effect Event<Trans>Effect 이벤트 선언하기</Trans> {/*declaring-an-effect-event*/}

<Wip>

This section describes an **experimental API that has not yet been released** in a stable version of React.
<Trans>이 섹션에서는 **아직 안정된 버전의 React로 출시되지 않은 실험적인 API**에 대해 설명합니다.</Trans>

</Wip>

Use a special Hook called [`useEffectEvent`](/reference/react/experimental_useEffectEvent) to extract this non-reactive logic out of your Effect:
<Trans>이 비반응형 로직을 Effect에서 추출하려면 [`useEffectEvent`](/reference/react/experimental_useEffectEvent)라는 특수 Hook을 사용합니다:</Trans>

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
```

Here, `onConnected` is called an *Effect Event.* It's a part of your Effect logic, but it behaves a lot more like an event handler. The logic inside it is not reactive, and it always "sees" the latest values of your props and state.
<Trans>여기서 `onConnected`는 *Effect Event*라고 불리며, Effect 로직의 일부이지만 이벤트 핸들러처럼 동작합니다. 그 내부의 로직은 반응형으로 동작하지 않으며, 항상 props와 state의 최신 값을 "확인"합니다.</Trans>

Now you can call the `onConnected` Effect Event from inside your Effect:
<Trans>이제 Effect 내부에서 `onConnected` *Effect Event*를 호출할 수 있습니다:</Trans>

```js {2-4,9,13}
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
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

This solves the problem. Note that you had to *remove* `onConnected` from the list of your Effect's dependencies. **Effect Events are not reactive and must be omitted from dependencies.**
<Trans>이렇게 하면 문제가 해결됩니다. Effect의 의존성 목록에서 `onConnected` 를 *제거*해야 한다는 점에 유의하세요. **Effect Event는 반응형 이벤트가 아니므로 의존성에서 생략해야 합니다.**</Trans>

Verify that the new behavior works as you would expect:
<Trans>새 동작이 예상대로 작동하는지 확인합니다:</Trans>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

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

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

You can think of Effect Events as being very similar to event handlers. The main difference is that event handlers run in response to a user interactions, whereas Effect Events are triggered by you from Effects. Effect Events let you "break the chain" between the reactivity of Effects and code that should not be reactive.
<Trans>Effect Event는 이벤트 핸들러와 매우 유사하다고 생각할 수 있습니다. 가장 큰 차이점은 이벤트 핸들러는 사용자 상호작용에 대한 응답으로 실행되는 반면, Effect Event는 Effect에서 사용자가 촉발한다는 점입니다. Effect Event를 사용하면 Effect의 반응성과 반응형으로 동작해서는 안 되는 코드 사이의 "사슬을 끊을 수 있습니다".</Trans>

### Reading latest props and state with Effect Events <Trans>Effect 이벤트로 최신 props 및 state 읽기</Trans> {/*reading-latest-props-and-state-with-effect-events*/}

<Wip>

This section describes an **experimental API that has not yet been released** in a stable version of React.
<Trans>이 섹션에서는 **아직 안정된 버전의 React로 출시되지 않은 실험적인 API**에 대해 설명합니다.</Trans>

</Wip>

Effect Events let you fix many patterns where you might be tempted to suppress the dependency linter.
<Trans>Effect Event를 사용하면 억제하고 싶을 수 있는 많은 의존성 linter 패턴을 수정할 수 있습니다.</Trans>

For example, say you have an Effect to log the page visits:
<Trans>예를 들어, 페이지 방문을 기록하는 Effect가 있다고 가정해 보겠습니다:</Trans>

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

Later, you add multiple routes to your site. Now your `Page` component receives a `url` prop with the current path. You want to pass the `url` as a part of your `logVisit` call, but the dependency linter complains:
<Trans>나중에 사이트에 여러 경로를 추가합니다. 이제 `Page`컴포넌트는 현재 경로가 포함된 `url` prop을 받습니다. `logVisit` 호출 시 `url`을 전달하고 싶지만 의존성 linter가 불평합니다:</Trans>

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'url'
  // ...
}
```

Think about what you want the code to do. You *want* to log a separate visit for different URLs since each URL represents a different page. In other words, this `logVisit` call *should* be reactive with respect to the `url`. This is why, in this case, it makes sense to follow the dependency linter, and add `url` as a dependency:
<Trans>코드로 무엇을 하고 싶은지 생각해 보세요. 각 URL이 서로 다른 페이지를 나타내므로 서로 다른 URL에 대해 별도로 방문을 기록하려고 합니다. 다시 말해, 이 `logVisit` 호출은 `url`에 *반드시* 반응해야 합니다. 그렇기 때문에 이 경우 의존성 linter를 따르고 `url`을 의존성으로 추가하는 것이 합리적입니다:</Trans>

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

Now let's say you want to include the number of items in the shopping cart together with every page visit:
<Trans>이제 모든 페이지 방문 기록 시 장바구니에 있는 품목의 수를 포함하려고 한다고 가정해 보겠습니다:</Trans>

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 React Hook useEffect has a missing dependency: 'numberOfItems'
  // ...
}
```

You used `numberOfItems` inside the Effect, so the linter asks you to add it as a dependency. However, you *don't* want the `logVisit` call to be reactive with respect to `numberOfItems`. If the user puts something into the shopping cart, and the `numberOfItems` changes, this *does not mean* that the user visited the page again. In other words, *visiting the page* is, in some sense, an "event". It happens at a precise moment in time.
<Trans> Effect 내부에서 `numberOfItems`를 사용했기 때문에, Linter는 이를 의존성으로 추가하라고 요청합니다. 그러나 `logVisit` 호출이 `numberOfItems`에 대해 반응하는 것을 원하지 않습니다. 사용자가 장바구니에 무언가를 넣고 `numberOfItems`가 변경되는 것이 사용자가 페이지를 다시 방문했다는 것을 의미하지는 않습니다. 즉, *페이지 방문*은 어떤 의미에서 “이벤트”입니다. 이는 정확한 순간에 발생합니다.</Trans>

Split the code in two parts:
<Trans>코드를 두 부분으로 나눠봅시다:</Trans>

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

Here, `onVisit` is an Effect Event. The code inside it isn't reactive. This is why you can use `numberOfItems` (or any other reactive value!) without worrying that it will cause the surrounding code to re-execute on changes.
<Trans>여기서 `onVisit`는 Effect 이벤트입니다. 그 안의 코드는 반응형이 아닙니다. 그렇기 때문에 변경 시 주변 코드가 다시 실행될 것을 걱정할 필요 없이 `numberOfItems`(또는 다른 반응형 값!)를 사용할 수 있습니다.</Trans>

On the other hand, the Effect itself remains reactive. Code inside the Effect uses the `url` prop, so the Effect will re-run after every re-render with a different `url`. This, in turn, will call the `onVisit` Effect Event.
<Trans>반면에 Effect 자체는 반응형으로 유지됩니다. Effect 내부의 코드는 `url` prop을 사용하므로, Effect는 다른 `url`로 다시 렌더링할 때마다 다시 실행됩니다. 그러면 `onVisit` Effect 이벤트가 호출됩니다.</Trans>

As a result, you will call `logVisit` for every change to the `url`, and always read the latest `numberOfItems`. However, if `numberOfItems` changes on its own, this will not cause any of the code to re-run.
<Trans>결과적으로 `url`이 변경될 때마다 `logVisit`을 호출하고 항상 최신`numberOfItems`를 읽게 됩니다. 그러나 `numberOfItems`가 자체적으로 변경되면 코드가 다시 실행되지 않습니다.</Trans>

<Note>
You might be wondering if you could call `onVisit()` with no arguments, and read the `url` inside it:
<Trans>매개변수 없이 `onVisit()`을 호출하고 그 안에 있는 `url`을 읽을 수 있는지 궁금할 수 있습니다:</Trans>

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

This would work, but it's better to pass this `url` to the Effect Event explicitly. **By passing `url` as an argument to your Effect Event, you are saying that visiting a page with a different `url` constitutes a separate "event" from the user's perspective.** The `visitedUrl` is a *part* of the "event" that happened:
<Trans>이 방법도 작동하지만 이 `url`을 Effect 이벤트에 명시적으로 전달하는 것이 좋습니다. Effect 이벤트에 인자로 `url`을 전달하면 다른 `url`을 가진 페이지를 방문하는 것이 사용자 관점에서 별도의 "이벤트"를 구성한다는 의미입니다. `visitedUrl` 은 발생한 “이벤트”의 일부입니다:</Trans>

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

Since your Effect Event explicitly "asks" for the `visitedUrl`, now you can't accidentally remove `url` from the Effect's dependencies. If you remove the `url` dependency (causing distinct page visits to be counted as one), the linter will warn you about it. You want `onVisit` to be reactive with regards to the `url`, so instead of reading the `url` inside (where it wouldn't be reactive), you pass it *from* your Effect.
<Trans>Effect 이벤트가 명시적으로 `visitedUrl`을 "요청"하기 때문에 이제 Effect의 의존성에서 실수로 `url`을 제거할 수 없습니다. `url` 의존성을 제거하면(별개의 페이지 방문이 하나로 계산되게 함) linter에서 이에 대해 경고합니다. `onVisit`이 `url`에 대해 반응하기를 원한다면, (반응하지 않는) Effect 이벤트 내부에서 `url`을 읽는 대신 Effect에서 `url`을 *전달*합니다.</Trans>

This becomes especially important if there is some asynchronous logic inside the Effect:
<Trans>이는 Effect 내부에 비동기 로직이 있는 경우 특히 중요합니다:</Trans>

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Delay logging visits
  }, [url]);
```

Here, `url` inside `onVisit` corresponds to the *latest* `url` (which could have already changed), but `visitedUrl` corresponds to the `url` that originally caused this Effect (and this `onVisit` call) to run.
<Trans>여기서 `onVisit` 내부의 `url`은 (이미 변경되었을 수 있는) 최신 `url`에 해당하지만 `visitedUrl`은 원래 이 Effect(및 `onVisit` 호출)를 실행하게 만든 `url`에 해당합니다.</Trans>
</Note>

<DeepDive>

#### Is it okay to suppress the dependency linter instead? <Trans>대신 의존성 린터를 억제해도 괜찮나요?</Trans> {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

In the existing codebases, you may sometimes see the lint rule suppressed like this:
<Trans>기존 코드베이스에서는 때때로 다음과 같이 Lint 규칙이 억제된 것을 볼 수 있습니다:</Trans>

```js {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Avoid suppressing the linter like this:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

After `useEffectEvent` becomes a stable part of React, we recommend **never suppressing the linter**.
<Trans>`useEffectEvent`가 React의 안정적인 API가 된 후에는 **Linter를 억제하지 않는 것이 좋습니다**.</Trans>

The first downside of suppressing the rule is that React will no longer warn you when your Effect needs to "react" to a new reactive dependency you've introduced to your code. In the earlier example, you added `url` to the dependencies *because* React reminded you to do it. You will no longer get such reminders for any future edits to that Effect if you disable the linter. This leads to bugs.
<Trans>이 규칙을 억제하는 첫 번째 단점은 코드에 도입한 새로운 반응형 의존성에 Efect가 "반응"해야 할 때 React가 더 이상 경고하지 않는다는 것입니다. 의 예제에서 `url`을 의존성에 추가한 이유는 React가 이를 상기시켜줬기 문입니다. Linter를 비활성화하면 해당 Effect를 이후에 수정할 때, 더 이상 이러한 경고를 받지 않게 됩니다. 이것은 버그로 이어집니다.</Trans>

Here is an example of a confusing bug caused by suppressing the linter. In this example, the `handleMove` function is supposed to read the current `canMove` state variable value in order to decide whether the dot should follow the cursor. However, `canMove` is always `true` inside `handleMove`.
<Trans> 다음은 Linter를 억제하여 발생하는 혼란스러운 버그의 예입니다. 이 예제에서 `handleMove` 함수는 커서를 따라갈지 여부를 결정하기 위해 현재 `canMove` state 변수 값을 읽어야 합니다. 그러나 `canMove`는 `handleMove` 내부에서 항상 `true`입니다.</Trans>

Can you see why?
<Trans>그 이유를 알 수 있을까요?</Trans>
<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>


The problem with this code is in suppressing the dependency linter. If you remove the suppression, you'll see that this Effect should depend on the `handleMove` function. This makes sense: `handleMove` is declared inside the component body, which makes it a reactive value. Every reactive value must be specified as a dependency, or it can potentially get stale over time!
<Trans>이 코드의 문제는 의존성 Linter를 억제하는 데 있습니다. 억제를 제거하면 이 Effect가 `handleMove` 함수에 종속되어야 한다는 것을 알 수 있습니다. `handleMove` 는 컴포넌트 본문 내부에서 선언되어 반응형 값이 되기 때문입니다. 모든 반응형 값은 의존성으로 지정해야 하며, 그렇지 않으면 시간이 지나 낡을 수 있습니다!</Trans>

The author of the original code has "lied" to React by saying that the Effect does not depend (`[]`) on any reactive values. This is why React did not re-synchronize the Effect after `canMove` has changed (and `handleMove` with it). Because React did not re-synchronize the Effect, the `handleMove` attached as a listener is the `handleMove` function created during the initial render. During the initial render, `canMove` was `true`, which is why `handleMove` from the initial render will forever see that value.
<Trans>원래 코드의 작성자는 Effect가 어떤 반응형 값에도 의존하지(`[]`) 않는다고 말함으로써 React에 "거짓말"을 했습니다. 이것이 바로 `canMove`가 변경된 후 React가 Effect를 다시 동기화하지 않은 이유입니다(그리고 `handleMove`도 함께). React가 Effect를 다시 동기화하지 않았기 때문에 리스너로 첨부된 `handleMove`는 초기 렌더링 중에 생성된 `handleMove` 함수입니다. 초기 렌더링 중에 `canMove`는 `true`였기 때문에 초기 렌더링의 `handleMove`는 영원히 그 값을 보게 됩니다.</Trans>

**If you never suppress the linter, you will never see problems with stale values.**
<Trans>**Linter를 억제하지 않으면 오래된 값으로 인한 문제가 발생하지 않습니다.**</Trans>

With `useEffectEvent`, there is no need to "lie" to the linter, and the code works as you would expect:
<Trans>`useEffectEvent`를 사용하면 Linter에 "거짓말"을 할 필요가 없으며 코드가 예상대로 작동합니다:</Trans>

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

This doesn't mean that `useEffectEvent` is *always* the correct solution. You should only apply it to the lines of code that you don't want to be reactive. In the above sandbox, you didn't want the Effect's code to be reactive with regards to `canMove`. That's why it made sense to extract an Effect Event.
<Trans>그렇다고 해서 `useEffectEvent`가 항상 올바른 해결책이라는 의미는 아닙니다. 반응하지 않으려는 코드 줄에만 적용해야 합니다. 위의 샌드박스에서는 `canMove`와 관련하여 Effect의 코드가 반응하는 것을 원하지 않았습니다. 그렇기 때문에 Effect 이벤트를 추출하는 것이 합리적입니다.</Trans>

Read [Removing Effect Dependencies](/learn/removing-effect-dependencies) for other correct alternatives to suppressing the linter.
<Trans>Linter를 억제하는 다른 올바른 대안에 대해서는 [Effect 의존성 제거하기](https://react.dev/learn/removing-effect-dependencies)를 읽어보세요.</Trans>

</DeepDive>

### Limitations of Effect Events<Trans>Effect 이벤트의 제한사항</Trans> {/*limitations-of-effect-events*/}

<Wip>
This section describes an **experimental API that has not yet been released** in a stable version of React.
<Trans>이 섹션에서는 **아직 안정된 버전의 React로 출시되지 않은 실험적인 API**에 대해 설명합니다.</Trans>
</Wip>

Effect Events are very limited in how you can use them:
<Trans>Effect 이벤트는 사용할 수 있는 방법이 매우 제한적입니다:</Trans>

* **Only call them from inside Effects.**
* **Never pass them to other components or Hooks.**
<TransBlock>
- **Effect 내부에서만 호출할 수 있습니다.**
- **다른 컴포넌트나 Hook에 전달하지 마세요.**
</TransBlock>

For example, don't declare and pass an Effect Event like this:
<Trans>예를 들어, 다음과 같이 Effect 이벤트를 선언하고 전달하지 마세요:</Trans>


```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 Avoid: Passing Effect Events

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // Need to specify "callback" in dependencies
}
```

Instead, always declare Effect Events directly next to the Effects that use them:
<Trans>대신 항상 Effect 이벤트를 사용하는 Effect 바로 옆에 Effect 이벤트를 선언하세요:</Trans>

```js {10-12,16,21}
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ Good: Only called locally inside an Effect
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // No need to specify "onTick" (an Effect Event) as a dependency
}
```

Effect Events are non-reactive "pieces" of your Effect code. They should be next to the Effect using them.
<Trans>Effect 이벤트는 Effect 코드의 비반응성 "조각"입니다. Effect 이벤트는 이를 사용하는 Effect 옆에 있어야 합니다.</Trans>

<Recap>

- Event handlers run in response to specific interactions.
- Effects run whenever synchronization is needed.
- Logic inside event handlers is not reactive.
- Logic inside Effects is reactive.
- You can move non-reactive logic from Effects into Effect Events.
- Only call Effect Events from inside Effects.
- Don't pass Effect Events to other components or Hooks.
<TransBlock>
- 이벤트 핸들러는 특정 상호 작용에 대한 응답으로 실행됩니다.
- Effect는 동기화가 필요할 때마다 실행됩니다.
- 이벤트 핸들러 내부의 로직은 반응형이 아닙니다.
- Effect 내부의 로직은 반응적입니다.
- 비반응적 로직을 Effect에서 Effect 이벤트로 이동할 수 있습니다.
- Effect 내부에서만 Effect 이벤트를 호출하세요.
- Effect 이벤트를 다른 컴포넌트나 Hook에 전달하지 마세요.
</TransBlock>
</Recap>

<Challenges>

#### Fix a variable that doesn't update <Trans>업데이트되지 않는 변수 수정</Trans> {/*fix-a-variable-that-doesnt-update*/}

This `Timer` component keeps a `count` state variable which increases every second. The value by which it's increasing is stored in the `increment` state variable. You can control the `increment` variable with the plus and minus buttons.
<Trans>이 `Timer` 컴포넌트는 매초마다 증가하는 `count` state 변수를 유지합니다. 카운트가 증가하는 값은 `increment` state 변수에 저장됩니다. 더하기 및 빼기 버튼으로 `increment` 변수를 제어할 수 있습니다.</Trans>

However, no matter how many times you click the plus button, the counter is still incremented by one every second. What's wrong with this code? Why is `increment` always equal to `1` inside the Effect's code? Find the mistake and fix it.
<Trans>그러나 더하기 버튼을 몇 번 클릭해도 카운터는 여전히 매초마다 1씩 증가합니다. 이 코드에 어떤 문제가 있을까요? Effect 코드에서 `increment` 가 항상 `1`과 같은 이유는 무엇인가요? 실수를 찾아서 수정하세요.</Trans>
<Hint>

To fix this code, it's enough to follow the rules.
<Trans>이 코드를 수정하려면 규칙을 따르는 것으로 충분합니다.</Trans>

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

As usual, when you're looking for bugs in Effects, start by searching for linter suppressions.
<Trans>평소와 같이 Effect에서 버그를 찾을 때는 먼저 린터 억제를 검색합니다.</Trans>

If you remove the suppression comment, React will tell you that this Effect's code depends on `increment`, but you "lied" to React by claiming that this Effect does not depend on any reactive values (`[]`). Add `increment` to the dependency array:
<Trans>억제 주석을 제거하면 React는 이 Effect의 코드가 `increment`에 의존한다고 알려주지만, 이 Effect는 어떤 반응 값(`[]`)에도 의존하지 않는다고 주장함으로써 React에게 "거짓말"을 한 것입니다. 의존성 배열에 `increment`를 추가합니다:</Trans>
<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Now, when `increment` changes, React will re-synchronize your Effect, which will restart the interval.
<Trans>이제 'increment'가 변경되면 React가 Effect를 다시 동기화하여 interval을 재시작합니다.</Trans>

</Solution>

#### Fix a freezing counter <Trans>정지된 카운터 수정</Trans> {/*fix-a-freezing-counter*/}

This `Timer` component keeps a `count` state variable which increases every second. The value by which it's increasing is stored in the `increment` state variable, which you can control it with the plus and minus buttons. For example, try pressing the plus button nine times, and notice that the `count` now increases each second by ten rather than by one.
<Trans>이 `Timer` 컴포넌트는 매초마다 증가하는 `count` state 변수를 유지합니다. 증가하는 값은 `increment` state 변수에 저장되며, 더하기 및 빼기 버튼으로 제어할 수 있습니다. 예를 들어 더하기 버튼을 아홉 번 누르면 이제 `count`가 매초마다 1이 아닌 10씩 증가하는 것을 확인할 수 있습니다.</Trans>

There is a small issue with this user interface. You might notice that if you keep pressing the plus or minus buttons faster than once per second, the timer itself seems to pause. It only resumes after a second passes since the last time you've pressed either button. Find why this is happening, and fix the issue so that the timer ticks on *every* second without interruptions.
<Trans>이 사용자 인터페이스에는 작은 문제가 있습니다. 더하기 또는 빼기 버튼을 초당 한 번보다 빠르게 계속 누르면 타이머 자체가 일시 중지되는 것처럼 보일 수 있습니다. 마지막으로 버튼을 누른 후 1초가 지나야만 타이머가 다시 시작됩니다. 이 문제가 발생하는 이유를 찾아서 타이머가 중단 없이 매초마다 실행되도록 문제를 해결하세요.</Trans>

<Hint>

It seems like the Effect which sets up the timer "reacts" to the `increment` value. Does the line that uses the current `increment` value in order to call `setCount` really need to be reactive?
<Trans>타이머를 설정하는 Effect가 `increment` 값에 "반응"하는 것 같습니다. `setCount`를 호출하기 위해 현재 `increment` 값을 사용하는 줄이 실제로 반응해야 할까요?</Trans>

</Hint>

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

The issue is that the code inside the Effect uses the `increment` state variable. Since it's a dependency of your Effect, every change to `increment` causes the Effect to re-synchronize, which causes the interval to clear. If you keep clearing the interval every time before it has a chance to fire, it will appear as if the timer has stalled.
<Trans>문제는 Effect 내부의 코드가 `increment` state 변수를 사용한다는 것입니다. 이 변수는 Effect의 종속 변수이기 때문에 '증가'를 변경할 때마다 Effect가 다시 동기화되고 이로 인해 interval이 지워집니다. Effect가 발사될 기회를 갖기 전에 매번 interval을 지우면 타이머가 멈춘 것처럼 보일 것입니다.</Trans>

To solve the issue, extract an `onTick` Effect Event from the Effect:
<Trans>이 문제를 해결하려면 Effect에서 `onTick` Effect 이벤트를 추출하세요:</Trans>
<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

Since `onTick` is an Effect Event, the code inside it isn't reactive. The change to `increment` does not trigger any Effects.
<Trans>`onTick`은 Effect 이벤트이므로 그 안의 코드는 반응하지 않습니다. `increment`로 변경해도 어떤 Effect도 촉발되지 않습니다.</Trans>

</Solution>

#### Fix a non-adjustable delay <Trans>조정할 수 없는 딜레이 수정</Trans> {/*fix-a-non-adjustable-delay*/}

In this example, you can customize the interval delay. It's stored in a `delay` state variable which is updated by two buttons. However, even if you press the "plus 100 ms" button until the `delay` is 1000 milliseconds (that is, a second), you'll notice that the timer still increments very fast (every 100 ms). It's as if your changes to the `delay` are ignored. Find and fix the bug.
<Trans>이 예제에서는 interval delay를 사용자가 지정할 수 있습니다. 이는 두 개의 버튼으로 업데이트되는 `delay` state 변수에 저장됩니다. 그러나 `delay` 가 1000밀리초(즉, 1초)가 될 때까지 'plus 100 ms' 버튼을 눌러도 타이머가 여전히 매우 빠르게(100밀리초마다) 증가하는 것을 알 수 있습니다. `delay`에 대한 변경사항이 무시되는 것 같습니다. 버그를 찾아서 수정하세요</Trans>

<Hint>

Code inside Effect Events is not reactive. Are there cases in which you would _want_ the `setInterval` call to re-run?
<Trans>Effect 이벤트 내부의 코드는 반응하지 않습니다. `setInterval` 호출이 다시 실행되기를 _원하는_ 경우가 있나요?</Trans>

</Hint>

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

The problem with the above example is that it extracted an Effect Event called `onMount` without considering what the code should actually be doing. You should only extract Effect Events for a specific reason: when you want to make a part of your code non-reactive. However, the `setInterval` call *should* be reactive with respect to the `delay` state variable. If the `delay` changes, you want to set up the interval from scratch! To fix this code, pull all the reactive code back inside the Effect:
<Trans>위 예제의 문제점은 코드가 실제로 수행해야 할 작업을 고려하지 않고 `onMount`라는 Effect 이벤트를 추출했다는 것입니다. Effect 이벤트는 특정 이유, 즉 코드의 일부를 비반응적으로 만들고자 할 때만 추출해야 합니다. 하지만 `setInterval` 호출은 `delay` state 변수에 대해 반응형이어야 합니다. `delay`가 변경되면 간격을 처음부터 다시 설정하고 싶을 것입니다! 이 코드를 수정하려면 모든 반응형 코드를 Effect 내부로 다시 가져와야 합니다:</Trans>

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

In general, you should be suspicious of functions like `onMount` that focus on the *timing* rather than the *purpose* of a piece of code. It may feel "more descriptive" at first but it obscures your intent. As a rule of thumb, Effect Events should correspond to something that happens from the *user's* perspective. For example, `onMessage`, `onTick`, `onVisit`, or `onConnected` are good Effect Event names. Code inside them would likely not need to be reactive. On the other hand, `onMount`, `onUpdate`, `onUnmount`, or `onAfterRender` are so generic that it's easy to accidentally put code that *should* be reactive into them. This is why you should name your Effect Events after *what the user thinks has happened,* not when some code happened to run.
<Trans>일반적으로 코드의 '목적'이 아닌 '타이밍'에 초점을 맞추는 'onMount'와 같은 함수는 의심해봐야 합니다. 처음에는 "더 설명적"이라고 느껴질 수 있지만 의도를 모호하게 만들 수 있습니다. 경험상 Effect 이벤트는 *사용자* 관점에서 일어나는 일과 일치해야 합니다. 예를 들어 `onMessage`, `onTick`, `onVisit`, `onConnected` 등이 좋은 Effect 이벤트 이름입니다. 그 안에 있는 코드는 반응형일 필요가 없을 가능성이 높습니다. 반면에 `onMount`, `onUpdate`, `onUnmount`, `onAfterRender`는 너무 일반적이어서 반응형이어야 하는 코드를 실수로 넣기 쉽습니다. 그렇기 때문에 Effect 이벤트의 이름을 코드가 실행된 시점이 아니라 *사용자가 생각하기에 어떤 일이 일어났다고 생각하는 시점*의 이름을 따서 지어야 합니다.</Trans>
</Solution>

#### Fix a delayed notification <Trans>delay된 알림 수정</Trans> {/*fix-a-delayed-notification*/}

When you join a chat room, this component shows a notification. However, it doesn't show the notification immediately. Instead, the notification is artificially delayed by two seconds so that the user has a chance to look around the UI.
<Trans>채팅방에 참여하면 이 컴포넌트는 알림을 표시합니다. 하지만 알림이 즉시 표시되지는 않습니다. 대신 알림을 인위적으로 2초 지연하여 사용자가 UI를 둘러볼 수 있도록 합니다.</Trans>

This almost works, but there is a bug. Try changing the dropdown from "general" to "travel" and then to "music" very quickly. If you do it fast enough, you will see two notifications (as expected!) but they will *both* say "Welcome to music".
<Trans>이는 거의 작동하지만 버그가 있습니다. 드롭다운을 'general'에서 'travel'로 변경한 다음 다시 'music'으로 매우 빠르게 변경해 보세요. 충분히 빠르게 변경하면 (예상대로!) 두 개의 알림이 표시되지만 둘 다 "**Welcome to music**"으로 표시됩니다.</Trans>

Fix it so that when you switch from "general" to "travel" and then to "music" very quickly, you see two notifications, the first one being "Welcome to travel" and the second one being "Welcome to music". (For an additional challenge, assuming you've *already* made the notifications show the correct rooms, change the code so that only the latter notification is displayed.)
<Trans>"general"에서 “travel"으로 전환한 다음 "music"으로 매우 빠르게 전환할 때 첫 번째 알림은 "Welcome to travel"이고 두 번째 알림은 "Welcome to music"으로 표시되도록 수정하세요. (추가로, 알림에 올바른 객실이 표시되도록 *이미* 설정했다면 후자의 알림만 표시되도록 코드를 변경하세요.)</Trans>

<Hint>

Your Effect knows which room it connected to. Is there any information that you might want to pass to your Effect Event?
<Trans>Effect는 어느 방에 연결했는지 알고 있습니다. Effect 이벤트에 전달하고 싶은 정보가 있나요?</Trans>

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Welcome to ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution>

Inside your Effect Event, `roomId` is the value *at the time Effect Event was called.*
<Trans>Effect 이벤트 내에서 `roomId`는 *Effect 이벤트가 호출된 시점*의 값입니다.</Trans>

Your Effect Event is called with a two second delay. If you're quickly switching from the travel to the music room, by the time the travel room's notification shows, `roomId` is already `"music"`. This is why both notifications say "Welcome to music".
<Trans>Effect 이벤트는 2초의 지연을 두고 호출됩니다. 여행 방에서 음악 방으로 빠르게 전환하는 경우 여행 방의 알림이 표시될 때쯤이면 `roomId`는 이미 `music`입니다. 이것이 두 알림 모두 "Welcome to music"라고 표시되는 이유입니다.</Trans>

To fix the issue, instead of reading the *latest* `roomId` inside the Effect Event, make it a parameter of your Effect Event, like `connectedRoomId` below. Then pass `roomId` from your Effect by calling `onConnected(roomId)`:
<Trans>이 문제를 해결하려면 Effect 이벤트 내부의 *최신* `roomId`를 읽는 대신 아래의 `connectedRoomId`와 같이 Effect 이벤트의 매개 변수로 만드세요. 그런 다음 `onConnected(roomId)`를 호출하여 Effect에서 `roomId`를 전달하세요:</Trans>
<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

The Effect that had `roomId` set to `"travel"` (so it connected to the `"travel"` room) will show the notification for `"travel"`. The Effect that had `roomId` set to `"music"` (so it connected to the `"music"` room) will show the notification for `"music"`. In other words, `connectedRoomId` comes from your Effect (which is reactive), while `theme` always uses the latest value.
<Trans>`roomId`가 `"travel"`으로 설정된 Effect(`"travel"` 방에 연결됨)는 `"travel"`에 대한 알림을 표시합니다. `roomId`가 `"music"`으로 설정된 Effect(`"music"` 방에 연결됨)는 `music`에 대한 알림을 표시합니다. 다시 말해 `connectedRoomId`는 반응형 Effect에서 가져오는 반면, `theme`는 항상 최신 값을 사용합니다.</Trans>

To solve the additional challenge, save the notification timeout ID and clear it in the cleanup function of your Effect:
<Trans>추가 문제를 해결하려면 알림 timeout ID를 저장하고 Effect의 클린업 기능에서 지우면 됩니다:</Trans>
<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

This ensures that already scheduled (but not yet displayed) notifications get cancelled when you change rooms.
<Trans>이렇게 하면 방을 변경할 때 이미 예약되었지만 아직 표시되지 않은 알림이 취소됩니다.</Trans>

</Solution>

</Challenges>