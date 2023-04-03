---
title: Lifecycle of Reactive Effects
translatedTitle: 반응형 Effect의 생명주기
---

<Intro>

Effects have a different lifecycle from components. Components may mount, update, or unmount. An Effect can only do two things: to start synchronizing something, and later to stop synchronizing it. This cycle can happen multiple times if your Effect depends on props and state that change over time. React provides a linter rule to check that you've specified your Effect's dependencies correctly. This keeps your Effect synchronized to the latest props and state.
<Trans>Effect는 컴포넌트와 다른 라이프사이클을 가집니다. 컴포넌트는 마운트, 업데이트 또는 마운트 해제할 수 있습니다. Effect는 동기화를 시작하고 나중에 동기화를 중지하는 두 가지 작업만 할 수 있습니다. 이 사이클은 시간이 지남에 따라 변하는 props와 state에 의존하는 Effect의 경우 여러 번 발생할 수 있습니다. React는 Effect의 의존성을 올바르게 지정했는지 확인하는 린터 규칙을 제공합니다. 이렇게 하면 Effect가 최신 props와 state에 동기화됩니다.</Trans>

</Intro>

<YouWillLearn>

- How an Effect's lifecycle is different from a component's lifecycle
- How to think about each individual Effect in isolation
- When your Effect needs to re-synchronize, and why
- How your Effect's dependencies are determined
- What it means for a value to be reactive
- What an empty dependency array means
- How React verifies your dependencies are correct with a linter
- What to do when you disagree with the linter

<TransBlock>
- Effect의 라이프사이클이 컴포넌트의 라이프사이클과 다른 점
- 각 개별 Effect를 분리해서 생각하는 방법
- Effect를 다시 동기화해야 하는 시기와 그 이유
- Effect의 의존성이 결정되는 방법
- 값이 반응형이라는 것의 의미
- 빈 의존성 배열이 의미하는 것
- React가 린터로 의존성이 올바른지 확인하는 방법
- 린터에 동의하지 않을 때 해야 할 일
</TransBlock>

</YouWillLearn>


## The lifecycle of an Effect<Trans>Effect의 생명주기</Trans> {/*the-lifecycle-of-an-effect*/}

Every React component goes through the same lifecycle:
<Trans>모든 React 컴포넌트는 동일한 라이프사이클을 거칩니다:</Trans>

- A component _mounts_ when it's added to the screen.
- A component _updates_ when it receives new props or state, usually in response to an interaction.
- A component _unmounts_ when it's removed from the screen.
<TransBlock>
- 컴포넌트는 화면에 추가될 때 *마운트*됩니다.
- 컴포넌트는 새로운 props나 state를 받으면 *업데이트*됩니다. 이는 보통 상호작용에 대한 응답으로 발생합니다.
- 화면에서 제거되면 컴포넌트가 *마운트 해제*됩니다.
</TransBlock>

**It's a good way to think about components, but _not_ about Effects.** Instead, try to think about each Effect independently from your component's lifecycle. An Effect describes how to [synchronize an external system](/learn/synchronizing-with-effects) to the current props and state. As your code changes, synchronization will need to happen more or less often.
<Trans>컴포넌트에 대해 생각하는 좋은 방법이지만 Effect에 대해서는 생각하지 않는 것이 좋습니다. 대신 각 Effect를 컴포넌트의 라이프사이클과 독립적으로 생각해보세요. Effect는 [외부 시스템을 현재 props 및 state에 동기화](/learn/synchronizing-with-effects)하는 방법을 설명합니다. 코드가 변경되면 이 동기화를 더 자주 또는 덜 자주 수행해야 합니다.</Trans>

To illustrate this point, consider this Effect connecting your component to a chat server:
<Trans>이 점을 설명하기 위해 컴포넌트를 채팅 서버에 연결하는 Effect를 예로 들어보겠습니다:</Trans>

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

Your Effect's body specifies how to **start synchronizing:**
<Trans>Effect의 본문에는 **동기화 시작** 방법이 명시되어 있습니다:</Trans>

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

The cleanup function returned by your Effect specifies how to **stop synchronizing:**
<Trans>Effect에서 반환되는 클린업 함수는 **동기화를 중지**하는 방법을 지정합니다:</Trans>

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Intuitively, you might think that React would **start synchronizing** when your component mounts and **stop synchronizing** when your component unmounts. However, this is not the end of the story! Sometimes, it may also be necessary to **start and stop synchronizing multiple times** while the component remains mounted.
<Trans>직관적으로 React는 컴포넌트가 마운트될 때 **동기화를 시작**하고 컴포넌트가 마운트 해제될 때 **동기화를 중지**할 것이라고 생각할 수 있습니다. 하지만 이것이 이야기의 끝이 아닙니다! 때로는 컴포넌트가 마운트된 상태에서 동기화를 여러 번 시작하고 중지해야 할 수도 있습니다.</Trans>

Let's look at _why_ this is necessary, _when_ it happens, and _how_ you can control this behavior.
<Trans>이러한 동작이 필요한 이유와 발생 시기, 그리고 이러한 동작을 제어할 수 있는 방법을 살펴보겠습니다.</Trans>

<Note>

Some Effects don't return a cleanup function at all. [More often than not,](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) you'll want to return one--but if you don't, React will behave as if you returned an empty cleanup function.
<Trans>일부 Effect는 클린업 함수를 전혀 반환하지 않습니다. [대부분의 경우](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) 함수를 반환하고 싶겠지만, 그렇지 않은 경우 React는 아무 작업도 하지 않는 빈 클린업 함수를 반환한 것처럼 동작합니다.</Trans>

</Note>

### Why synchronization may need to happen more than once<Trans>동기화가 두 번 이상 수행되어야 하는 이유</Trans> {/*why-synchronization-may-need-to-happen-more-than-once*/}

Imagine this `ChatRoom` component receives a `roomId` prop that the user picks in a dropdown. Let's say that initially the user picks the `"general"` room as the `roomId`. Your app displays the `"general"` chat room:
<Trans>이 `ChatRoom` 컴포넌트가 사용자가 드롭다운에서 선택한 `roomId` prop을 받는다고 가정해 보세요. 처음에 사용자가 `"general"` 채팅방을 `roomId`로 선택했다고 가정해 봅시다. 앱에 `"general"` 채팅방이 표시됩니다:</Trans>

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

After the UI is displayed, React will run your Effect to **start synchronizing.** It connects to the `"general"` room:
<Trans>UI가 표시되면 React가 Effect를 실행하여 **동기화를 시작**합니다. `"general"` 방에 연결됩니다:</Trans>

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "general" room
    connection.connect();
    return () => {
      connection.disconnect(); // Disconnects from the "general" room
    };
  }, [roomId]);
  // ...
```

So far, so good.
<Trans>지금까지는 괜찮습니다.</Trans>

Later, the user picks a different room in the dropdown (for example, `"travel"`). First, React will update the UI:
<Trans>이후, 사용자가 드롭다운에서 다른 방을 선택합니다(예: `"travel"`). 먼저 React가 UI를 업데이트합니다:</Trans>

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

Think about what should happen next. The user sees that `"travel"` is the selected chat room in the UI. However, the Effect that ran the last time is still connected to the `"general"` room. **The `roomId` prop has changed, so what your Effect did back then (connecting to the `"general"` room) no longer matches the UI.**
<Trans>다음에 어떤 일이 일어날지 생각해 보세요. 사용자는 UI에서 `"travel"`이 선택된 대화방임을 알 수 있습니다. 하지만 지난번에 실행된 Effect는 여전히  `"general"`대화방에 연결되어 있습니다. **`roomId` prop이 변경되었기 때문에 이전에 Effect(`"general"` 방에 연결)가 수행한 작업이 더 이상 UI와 일치하지 않습니다.**</Trans>

At this point, you want React to do two things:
<Trans>이 시점에서 React가 두 가지 작업을 수행하기를 원합니다:</Trans>

1. Stop synchronizing with the old `roomId` (disconnect from the `"general"` room)
2. Start synchronizing with the new `roomId` (connect to the `"travel"` room)

<TransBlock>
1. 이전 `roomId`와의 동기화 중지 (`"general"` 룸에서 연결 해제)
2. 새 `roomId`와 동기화 시작 (`"travel"` 객실과 연결)
</TransBlock>

**Luckily, you've already taught React how to do both of these things!** Your Effect's body specifies how to start synchronizing, and your cleanup function specifies how to stop synchronizing. All that React needs to do now is to call them in the correct order and with the correct props and state. Let's see how exactly that happens.
<Trans>**다행히 여러분은 이미 이 두 가지를 수행하는 방법을 React에 가르쳤습니다!** Effect의 본문은 동기화를 시작하는 방법을 지정하고, 클린업 함수는 동기화를 중지하는 방법을 지정합니다. 이제 React가 해야 할 일은 올바른 순서로 올바른 props와 state로 호출하기만 하면 됩니다. 정확히 어떻게 일어나는지 살펴보겠습니다.</Trans>

### How React re-synchronizes your Effect<Trans>React가 Effect를 재동기화 하는 방법</Trans> {/*how-react-re-synchronizes-your-effect*/}

Recall that your `ChatRoom` component has received a new value for its `roomId` prop. It used to be `"general"`, and now it is `"travel"`. React needs to re-synchronize your Effect to re-connect you to a different room.
<Trans> `ChatRoom`컴포넌트의 `roomId` prop이 새로운 값을 받았다는 것을 기억하세요. 이전에는 `"general"`이었지만 이제는 `"travel"`입니다. 다른 방에 다시 연결하려면 React가 Effect를 다시 동기화해야 합니다.</Trans>

To **stop synchronizing,** React will call the cleanup function that your Effect returned after connecting to the `"general"` room. Since `roomId` was `"general"`, the cleanup function disconnects from the `"general"` room:
<Trans>**동기화를 중지**하기 위해, React는 `"general"`  방에 연결한 후 Effect가 반환한 클린업 함수를 호출합니다. `roomId`가 `"general"`이므로, 클린업 함수는 `"general"` 방에서 연결을 끊습니다:</Trans>

```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "general" room
    connection.connect();
    return () => {
      connection.disconnect(); // Disconnects from the "general" room
    };
    // ...
```

Then React will run the Effect that you've provided during this render. This time, `roomId` is `"travel"` so it will **start synchronizing** to the `"travel"` chat room (until its cleanup function is eventually called too):
<Trans>그러면 React는 이 렌더링 중에 여러분이 제공한 Effect를 실행합니다. 이번에는 `roomId`가 `"travel"`이므로 (클린업 함수가 호출되기 전까지) `"travel"`채팅방과 **동기화되기 시작**합니다:</Trans>

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "travel" room
    connection.connect();
    // ...
```

Thanks to this, you're now connected to the same room that the user chose in the UI. Disaster averted!
<Trans>덕분에 이제 사용자가 UI에서 선택한 방과 동일한 방에 연결됩니다. 재앙을 피했습니다!</Trans>

Every time after your component re-renders with a different `roomId`, your Effect will re-synchronize. For example, let's say the user changes `roomId` from `"travel"` to `"music"`. React will again **stop synchronizing** your Effect by calling its cleanup function (disconnecting you from the `"travel"` room). Then it will **start synchronizing** again by running its body with the new `roomId` prop (connecting you to the `"music"` room).
<Trans>컴포넌트가 다른 `roomId`로 다시 렌더링할 때마다 Effect가 다시 동기화됩니다. 예를 들어 사용자가 `roomId`를 `"travel"`에서 `"music"`으로 변경한다고 가정해 봅시다. React는 다시 클린업 함수를 호출하여 Effect **동기화를 중지**합니다(`"travel"` 방에서 연결을 끊습니다). 그런 다음 새 `roomId` prop으로 본문을 실행하여 다시 **동기화를 시작**합니다(`"music"` 방에 연결).</Trans>

Finally, when the user goes to a different screen, `ChatRoom` unmounts. Now there is no need to stay connected at all. React will **stop synchronizing** your Effect one last time and disconnect you from the `"music"` chat room.
<Trans>마지막으로 사용자가 다른 화면으로 이동하면 `ChatRoom`이 마운트 해제됩니다. 이제 연결 상태를 유지할 필요가 전혀 없습니다. React는 마지막으로 Effect의 **동기화를 중지**하고 `"music"` 채팅방에서 연결을 끊습니다.</Trans>

### Thinking from the Effect's perspective <Trans>Effect의 관점에서 생각하기</Trans> {/*thinking-from-the-effects-perspective*/}

Let's recap everything that's happened from the `ChatRoom` component's perspective:
<Trans>`ChatRoom` 컴포넌트의 관점에서 일어난 모든 일을 요약해 보겠습니다:</Trans>

1. `ChatRoom` mounted with `roomId` set to `"general"`
1. `ChatRoom` updated with `roomId` set to `"travel"`
1. `ChatRoom` updated with `roomId` set to `"music"`
1. `ChatRoom` unmounted

<TransBlock>
1. `roomId`가 `"general"`로 설정된 상태로 `ChatRoom`이 마운트됨
2. `roomId`가 `"travel"`로 설정된 상태로 `ChatRoom`이 업데이트됨
3. `roomId`가 `"music"`로 설정된 상태로 `ChatRoom`이 업데이트됨
4. `ChatRoom` 마운트 해제됨
</TransBlock>

During each of these points in the component's lifecycle, your Effect did different things:
<Trans>컴포넌트 라이프사이클의 각 시점에서 Effect는 서로 다른 작업을 수행했습니다:</Trans>

1. Your Effect connected to the `"general"` room
1. Your Effect disconnected from the `"general"` room and connected to the `"travel"` room
1. Your Effect disconnected from the `"travel"` room and connected to the `"music"` room
1. Your Effect disconnected from the `"music"` room

<TransBlock>
  1. Effect가 `"general"` 방에 연결됨
  2. Effect가 `"general"` 방과의 연결이 끊어지고 `"travel"` 방에 연결됨
  3. Effect가 `"travel"` 방과의 연결이 끊어지고 `"music"` 방에 연결됨
  4. Effect가 `"music"` 방과의 연결이 끊어짐
</TransBlock>

Now let's think about what happened from the perspective of the Effect itself:
<Trans>이제 Effect 자체의 관점에서 무슨 일이 일어났는지 생각해 봅시다:</Trans>

```js
  useEffect(() => {
    // Your Effect connected to the room specified with roomId...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...until it disconnected
      connection.disconnect();
    };
  }, [roomId]);
```

This code's structure might inspire you to see what happened as a sequence of non-overlapping time periods:
<Trans>이 코드의 구조는 어떤 일이 일어났는지 겹치지 않는 기간의 연속으로 보는 데 영감을 줄 수 있습니다:</Trans>

1. Your Effect connected to the `"general"` room (until it disconnected)
1. Your Effect connected to the `"travel"` room (until it disconnected)
1. Your Effect connected to the `"music"` room (until it disconnected)

<TransBlock>
1. Effect가 `"general"` 방에 연결됨 (연결이 끊어질 때까지)
2. Effect가 `"travel"` 방에 연결됨 (연결이 끊어질 때까지)
3. Effect가 ``"music"` 방에 연결됨 (연결이 끊어질 때까지)
</TransBlock>

Previously, you were thinking from the component's perspective. When you looked from the component's perspective, it was tempting to think of Effects as "callbacks" or "lifecycle events" that fire at a specific time like "after a render" or "before unmount". This way of thinking gets complicated very fast, so it's best to avoid.
<Trans>이전에는 컴포넌트의 관점에서 생각했습니다. 컴포넌트의 관점에서 보면 Effect를 "렌더링 후" 또는 "마운트 해제 전"과 같은 특정 시점에 실행되는 "콜백" 또는 "라이프사이클 이벤트"로 생각하기 쉬웠습니다. 이러한 사고 방식은 매우 빠르게 복잡해지므로 피하는 것이 가장 좋습니다.</Trans>

**Instead, always focus on a single start/stop cycle at a time. It shouldn't matter whether a component is mounting, updating, or unmounting. All you need to do is to describe how to start synchronization and how to stop it. If you do it well, your Effect will be resilient to being started and stopped as many times as it's needed.**
<Trans>**대신 항상 한 번에 하나의 시작/중지 사이클에만 집중하세요. 컴포넌트를 마운트, 업데이트 또는 마운트 해제하는 것은 중요하지 않습니다. 동기화를 시작하는 방법과 중지하는 방법만 설명하면 됩니다. 이 작업을 잘 수행하면 필요한 횟수만큼 Effect를 시작하고 중지할 수 있는 탄력성을 확보할 수 있습니다.**</Trans>

This might remind you how you don't think whether a component is mounting or updating when you write the rendering logic that creates JSX. You describe what should be on the screen, and React [figures out the rest.](/learn/reacting-to-input-with-state)
<Trans>JSX를 생성하는 렌더링 로직을 작성할 때 컴포넌트가 마운트되는지 업데이트되는지 생각하지 않는 것을 떠올리면 이해가 쉬울 것입니다. 화면에 무엇이 표시되어야 하는지 설명하면 [나머지는 React가 알아서 처리합니다](/learn/reacting-to-input-with-state).</Trans>

### How React verifies that your Effect can re-synchronize<Trans>React가 Effect의 재동기화 가능 여부를 확인하는 방법</Trans> {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

Here is a live example that you can play with. Press "Open chat" to mount the `ChatRoom` component:
<Trans>다음은 실제 사용 가능한 예제입니다. "Open chat"을 눌러 `ChatRoom` 컴포넌트를 마운트 해보세요:</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  return <h1>Welcome to the {roomId} room!</h1>;
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Notice that when the component mounts for the first time, you see three logs:
<Trans>컴포넌트가 처음 마운트될 때 3개의 로그가 표시됩니다:</Trans>

1. `✅ Connecting to "general" room at https://localhost:1234...` *(development-only)*
2. `❌ Disconnected from "general" room at https://localhost:1234.` *(development-only)*
3. `✅ Connecting to "general" room at https://localhost:1234...`

The first two logs are development-only. In development, React always remounts each component once.
<Trans>처음 두 개의 로그는 개발 모드 전용입니다. 개발 모드에서 React는 항상 각 컴포넌트를 한 번씩 다시 마운트합니다.</Trans>

**React verifies that your Effect can re-synchronize by forcing it to do that immediately in development.** This might remind you of opening a door and closing it an extra time to check if the door lock works. React starts and stops your Effect one extra time in development to check [you've implemented its cleanup well.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

<Trans>**개발 모드에서 React는 즉시 강제로 동기화를 수행하여 Effect가 다시 동기화될 수 있는지 확인합니다. 도어락이 작동하는지 확인하기 위해 문을 열었다가 한 번 더 닫는 것과 비슷합니다. React는 개발 중에 Effect를 한 번 더 시작하고 중지하여 [정리를 잘 구현했는지](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) 확인합니다.</Trans>

The main reason your Effect will re-synchronize in practice is if some data it uses has changed. In the sandbox above, change the selected chat room. Notice how, when the `roomId` changes, your Effect re-synchronizes.
<Trans>실제로 Effect가 다시 동기화되는 주된 이유는 Effect가 사용하는 일부 데이터가 변경된 경우입니다. 위의 샌드박스에서 선택한 채팅방을 변경해 보세요. `roomId`가 변경되면 Effect가 다시 동기화되는 것을 확인할 수 있습니다.</Trans>

However, there are also more unusual cases in which re-synchronization is necessary. For example, try editing the `serverUrl` in the sandbox above while the chat is open. Notice how the Effect re-synchronizes in response to your edits to the code. In the future, React may add more features that rely on re-synchronization.
<Trans>그러나 재동기화가 필요한 더 특이한 경우도 있습니다. 예를 들어 채팅이 열려 있는 상태에서 위의 샌드박스에서 `serverUrl`을 편집해 보세요. 코드 편집에 대한 응답으로 Effect가 어떻게 다시 동기화되는지 주목하세요. 앞으로 React는 재동기화에 의존하는 더 많은 기능을 추가할 수 있습니다.</Trans>

### How React knows that it needs to re-synchronize the Effect<Trans>React가 Effect의 재동기화 필요성을 인식하는 방법</Trans> {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

You might be wondering how React knew that your Effect needed to re-synchronize after `roomId` changes. It's because *you told React* that its code depends on `roomId` by including it in the [list of dependencies:](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)
<Trans>`roomId`가 변경되었을 때 React가 Effect를 다시 동기화해야 한다는 것을 어떻게 알았는지 궁금할 것입니다. 그 이유는 [의존성 목록](https://react.dev/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)에 `roomId`를 포함시킴으로써 코드가 `roomId`에 의존하고 있음을 React에 알렸기 때문입니다:</Trans>

```js {1-2,4-5,10-11}
function ChatRoom({ roomId }) { // The roomId prop may change over time
                                // roomId prop은 시간에 따라 바뀔 수 있음
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads roomId 
                                                            // 이 Effect는 roomId를 읽음
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // So you tell React that this Effect "depends on" roomId
                // 이 Effect가 roomId에 의존함을 React에 알림.
  // ...
```

Here's how this works:
<Trans>작동 방식은 다음과 같습니다:</Trans>

1. You knew `roomId` is a prop, which means it can change over time.
2. You knew that your Effect reads `roomId` (so its logic depends on a value that may change later).
3. This is why you specified it as your Effect's dependency (so that it re-synchronizes when `roomId` changes).
<TransBlock>
1. `roomId`는 prop이므로 시간이 지남에 따라 변경될 수 있다는 것을 알고 있습니다.
2. Effect가 `roomId`를 읽는다는 것을 알았습니다 (따라서 해당 로직은 나중에 변경될 수 있는 값에 따라 달라집니다).
3. 이 때문에 Effect의 의존성으로 지정했습니다(`roomId`가 변경될 때 다시 동기화되도록).
</TransBlock>

Every time after your component re-renders, React will look at the array of dependencies that you have passed. If any of the values in the array is different from the value at the same spot that you passed during the previous render, React will re-synchronize your Effect.
<Trans>컴포넌트가 다시 렌더링될 때마다 React는 사용자가 전달한 의존성 배열을 살펴봅니다. 배열의 값 중 하나라도 이전 렌더링 중에 전달한 동일한 지점의 값과 다르면 React는 Effect를 다시 동기화합니다.</Trans>

For example, if you passed `["general"]` during the initial render, and later you passed `["travel"]` during the next render, React will compare `"general"` and `"travel"`. These are different values (compared with [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), so React will re-synchronize your Effect. On the other hand, if your component re-renders but `roomId` has not changed, your Effect will remain connected to the same room.
<Trans>예를 들어, 초기 렌더링 중에 `["general"]`을 전달했고 나중에 다음 렌더링 중에 `["travel"]`을 전달한 경우, React는 `"general"`과 `"travel"`을 비교합니다. 이 값은 ([Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)와 비교했을 때) 다른 값이기 때문에 React는 Effect를 다시 동기화할 것입니다. 반면 컴포넌트가 다시 렌더링될 때 `roomId`가 변경되어있지 않은 경우 Effect는 동일한 방에 연결된 상태로 유지됩니다.</Trans>

### Each Effect represents a separate synchronization process<Trans>각각의 Effect는 별도의 동기화 프로세스를 나타냅니다.</Trans> {/*each-effect-represents-a-separate-synchronization-process*/}

Resist adding unrelated logic to your Effect only because this logic needs to run at the same time as an Effect you already wrote. For example, let's say you want to send an analytics event when the user visits the room. You already have an Effect that depends on `roomId`, so you might feel tempted to add the analytics call there:
<Trans>이 로직은 이미 작성한 Effect와 동시에 실행되어야 하므로 관련 없는 로직을 Effect에 추가하지 마세요. 예를 들어 사용자가 방을 방문할 때 분석 이벤트를 전송하고 싶다고 가정해 봅시다. 이미 `roomId`에 의존하는 Effect가 있으므로 바로 그 Effect에서 분석 이벤트 호출을 추가하고 싶을 수 있습니다:</Trans>

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

But imagine you later add another dependency to this Effect that needs to re-establish the connection. If this Effect re-synchronizes, it will also call `logVisit(roomId)` for the same room, which you did not intend. Logging the visit **is a separate process** from connecting. Write them as two separate Effects:
<Trans>하지만 나중에 이 Effect에 연결을 다시 설정해야 하는 다른 의존성을 추가한다고 가정해 보겠습니다. 이 Effect가 다시 동기화되면 의도하지 않은 동일한 방에 대해 `logVisit(roomId)`도 호출하게 됩니다. 방문을 기록하는 것은 연결과는 **별개의 프로세스**입니다. 그렇기 때문에 두 개의 개별 Effect로 작성해야 합니다:</Trans>

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**Each Effect in your code should represent a separate and independent synchronization process.**
<Trans>**코드의 각 Effect는 별도의 독립적인 동기화 프로세스를 나타내야 합니다.**</Trans>

In the above example, deleting one Effect wouldn’t break the other Effect's logic. This is a good indication that they synchronize different things, and so it made sense to split them up. On the other hand, if you split up a cohesive piece of logic into separate Effects, the code may look "cleaner" but will be [more difficult to maintain.](/learn/you-might-not-need-an-effect#chains-of-computations) This is why you should think whether the processes are same or separate, not whether the code looks cleaner.
<Trans>위의 예시에서는 한 Effect를 삭제해도 다른 Effect의 로직이 깨지지 않습니다. 이는 서로 다른 것을 동기화하므로 분리하는 것이 합리적이라는 것을 나타냅니다. 반면 일관된 로직을 별도의 Effect로 분리하면 코드가 "더 깔끔해" 보일 수 있지만 [유지 관리가 더 어려워집니다.](/learn/you-might-not-need-an-effect#chains-of-computations) 따라서 코드가 더 깔끔해 보이는지 여부가 아니라 프로세스가 동일한지 또는 분리되어 있는지를 고려해야 합니다.</Trans>

## Effects "react" to reactive values<Trans>Effect는 '반응형 값'에 반응합니다</Trans> {/*effects-react-to-reactive-values*/}

Your Effect reads two variables (`serverUrl` and `roomId`), but you only specified `roomId` as a dependency:
<Trans>다음 코드에서 Effect는 두 개의 변수(`serverUrl` 및 `roomId`)를 읽지만, 의존성에는 오직 `roomId`만 지정했습니다:</Trans>

```js {5,10}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

Why doesn't `serverUrl` need to be a dependency?
<Trans>`serverUrl`을 의존성에 지정할 필요가 없는 이유가 무엇일까요?</Trans>

This is because the `serverUrl` never changes due to a re-render. It's always the same no matter how many times the component re-renders and why. Since `serverUrl` never changes, it wouldn't make sense to specify it as a dependency. After all, dependencies only do something when they change over time!
<Trans>이는 재렌더링으로 인해 `serverUrl` 이 변경되지 않기 때문입니다. 컴포넌트가 어떤 이유로 몇 번이나 다시 렌더링하든 항상 동일합니다. `serverUrl` 은 절대 변하지 않으므로 의존성으로 지정하는 것은 의미가 없습니다. 결국, 의존성은 시간이 지남에 따라 변경될 때만 무언가를 수행합니다!</Trans>

On the other hand, `roomId` may be different on a re-render. **Props, state, and other values declared inside the component are _reactive_ because they're calculated during rendering and participate in the React data flow.**
<Trans>반면 `roomId`는 다시 렌더링할 때 달라질 수 있습니다. **컴포넌트 내부에서 선언된 props, state 및 기타 값은 렌더링 중에 계산되고 React 데이터 흐름에 참여하기 때문에 *반응형*입니다.**</Trans>

If `serverUrl` was a state variable, it would be reactive. Reactive values must be included in dependencies:
<Trans>만약 `serverUrl`이 state 변수라면, 반응형일 것입니다. 반응형 값은 의존성에 포함되어야 합니다:</Trans>

```js {3-4,7-8,13-14}
function ChatRoom({ roomId }) { // Props change over time
                                // props는 시간에 따라 바뀜
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // State may change over time
                                                                        // state는 바뀔 수 있음

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Your Effect reads props and state
                                                            // Effect는 props와 state를 읽음
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // So you tell React that this Effect "depends on" on props and state
                           // 이 Effect가 props 및 state에 의존함을 React에 알림
  // ...
}
```

By including `serverUrl` as a dependency, you ensure that the Effect re-synchronizes after it changes.
<Trans>`serverUrl`을 의존성으로 포함하면 Effect가 변경된 후 다시 동기화되도록 할 수 있습니다.</Trans>

Try changing the selected chat room or edit the server URL in this sandbox:
<Trans>이 샌드박스에서 선택한 대화방을 변경하거나 서버 URL을 수정해 보세요:</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Whenever you change a reactive value like `roomId` or `serverUrl`, the Effect re-connects to the chat server.
<Trans>`roomId` 또는 `serverUrl`과 같은 반응형 값을 변경할 때마다 Effect가 채팅 서버에 다시 연결됩니다.</Trans>

### What an Effect with empty dependencies means <Trans>빈 의존성을 가지고 있는 Effect의 의미</Trans> {/*what-an-effect-with-empty-dependencies-means*/}

What happens if you move both `serverUrl` and `roomId` outside the component?
<Trans>`serverUrl`과 `roomId`를 모두 컴포넌트 외부로 이동하면 어떻게 되나요?</Trans>

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

Now your Effect's code does not use *any* reactive values, so its dependencies can be empty (`[]`).
<Trans>이제 Effect의 코드는 반응형 값을 사용하지 않으므로 의존성이 비어 있을 수 있습니다(`[]`).</Trans>

Thinking from the component's perspective, the empty `[]` dependency array means this Effect connects to the chat room only when the component mounts, and disconnects only when the component unmounts. (Keep in mind that React would still [re-synchronize it an extra time](#how-react-verifies-that-your-effect-can-re-synchronize) in development to stress-test your logic.)
<Trans>컴포넌트의 관점에서 생각해보면, 빈 `[]` 의존성 배열은 이 Effect가 컴포넌트가 마운트될 때만 채팅방에 연결되고 컴포넌트가 마운트 해제될 때만 연결이 끊어진다는 것을 의미합니다. (React는 개발 모드에서 로직을 테스트하기 위해 [한 번 더 동기화](#how-react-verifies-that-your-effect-can-re-synchronize)한다는 점을 기억하세요).</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```js chat.js
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

However, if you [think from the Effect's perspective,](#thinking-from-the-effects-perspective) you don't need to think about mounting and unmounting at all. What's important is you've specified what your Effect does to start and stop synchronizing. Today, it has no reactive dependencies. But if you ever want the user to change `roomId` or `serverUrl` over time (and they would become reactive), your Effect's code won't change. You will only need to add them to the dependencies.
<Trans>하지만 [Effect의 관점에서 생각하면](#thinking-from-the-effects-perspective) 마운트 및 마운트 해제에 대해 전혀 생각할 필요가 없습니다. 중요한 것은 Effect가 동기화를 시작하고 중지하는 작업을 지정한 것입니다. 현재는 반응형 의존성이 없습니다. 하지만 사용자가 시간이 지남에 따라 `roomId` 또는 `serverUrl`을 변경하기를 원한다면(그래서 반응형이어야 한다면) Effect의 코드는 변경되지 않습니다. 의존성에 추가하기만 하면 됩니다.</Trans>

### All variables declared in the component body are reactive<Trans>컴포넌트 본문에서 선언된 모든 변수는 반응형입니다</Trans> {/*all-variables-declared-in-the-component-body-are-reactive*/}

Props and state aren't the only reactive values. Values that you calculate from them are also reactive. If the props or state change, your component will re-render, and the values calculated from them will also change. This is why all variables from the component body used by the Effect should be in the Effect dependency list.
<Trans>props와 state만 반응형 값인 것은 아닙니다. 이들로부터 계산하는 값들 역시 반응형입니다. props나 state가 변경되면 컴포넌트가 다시 렌더링되고 그로부터 계산된 값도 변경됩니다. 그렇기 때문에 Effect가 사용하는 컴포넌트 본문의 모든 변수는 Effect 의존성 목록에 있어야 합니다.</Trans>

Let's say that the user can pick a chat server in the dropdown, but they can also configure a default server in settings. Suppose you've already put the settings state in a [context](/learn/scaling-up-with-reducer-and-context) so you read the `settings` from that context. Now you calculate the `serverUrl` based on the selected server from props and the default server:
<Trans>사용자가 드롭다운에서 채팅 서버를 선택할 수도 있고, 설정에서 기본 서버를 구성할 수도 있다고 가정해 봅시다. 이미 `settings` state를 [컨텍스트](/learn/scaling-up-with-reducer-and-context)에 넣어서 해당 컨텍스트에서 읽었다고 가정해 보겠습니다. 이제 props에서 선택한 서버와 컨텍스트에서 기본 서버를 기준으로 `serverUrl`을 계산합니다:</Trans>

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId is reactive
  const settings = useContext(SettingsContext); // settings is reactive
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl is reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Your Effect reads roomId and serverUrl
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // So it needs to re-synchronize when either of them changes!
  // ...
}
```

In this example, `serverUrl` is not a prop or a state variable. It's a regular variable that you calculate during rendering. But it's calculated during rendering, so it can change due to a re-render. This is why it's reactive.
<Trans>이 예제에서 `serverUrl`은 prop이나 state 변수가 아닙니다. 렌더링 중에 계산하는 일반 변수입니다. 하지만 렌더링 중에 계산되므로 재렌더링으로 인해 변경될 수 있습니다. 따라서 `serverUrl`은 반응형 변수입니다.</Trans>

**All values inside the component (including props, state, and variables in your component's body) are reactive. Any reactive value can change on a re-render, so you need to include reactive values as Effect's dependencies.**
<Trans>**컴포넌트 내부의 모든 값(컴포넌트 본문의 props, state, 변수 포함)은 반응형입니다. 모든 반응형 값은 다시 렌더링할 때 변경될 수 있으므로 반응형 값을 Effect의 의존성으로 포함시켜야 합니다.**</Trans>

In other words, Effects "react" to all values from the component body.
<Trans>즉, Effect는 컴포넌트 본문의 모든 값에 "반응"합니다.</Trans>

<DeepDive>

#### Can global or mutable values be dependencies? <Trans>전역 또는 변이 가능한 값이 의존성이 될 수 있나요?</Trans> {/*can-global-or-mutable-values-be-dependencies*/}

Mutable values (including global variables) aren't reactive.
<Trans>변이 가능한 값(전역 변수 포함)은 반응하지 않습니다.</Trans>

**A mutable value like [`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) can't be a dependency.** It's mutable, so it can change at any time completely outside of the React rendering data flow. Changing it wouldn't trigger a re-render of your component. Therefore, even if you specified it in the dependencies, React *wouldn't know* to re-synchronize the Effect when it changes. This also breaks the rules of React because reading mutable data during rendering (which is when you calculate the dependencies) breaks [purity of rendering.](/learn/keeping-components-pure) Instead, you should read and subscribe to an external mutable value with [`useSyncExternalStore`.](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)
<Trans>**[`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname)과 같은 변이 가능한 값은 의존성이 될 수 없습니다.** 이 값은 변이 가능하므로 React 렌더링 데이터 흐름 외부에서 언제든지 바뀔 수 있습니다. 이 값을 변경해도 컴포넌트가 다시 렌더링되지 않습니다. 따라서 이를 의존성에 지정하더라도 React는 이 값이 변경될 때 Effect를 다시 동기화해야 하는지 알 수 없습니다. 또한 렌더링 도중(의존성을 계산할 때) 변경 가능한 데이터를 읽는 것은 [렌더링의 순수성](https://react.dev/learn/keeping-components-pure)을 깨뜨리기 때문에 React의 규칙을 위반합니다. 대신, [`useSyncExternalStore`](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)를 사용하여 외부 변경 가능한 값을 읽고 구독해야 합니다.</Trans>

**A mutable value like [`ref.current`](/reference/react/useRef#reference) or things you read from it also can't be a dependency.** The ref object returned by `useRef` itself can be a dependency, but its `current` property is intentionally mutable. It lets you [keep track of something without triggering a re-render.](/learn/referencing-values-with-refs) But since changing it doesn't trigger a re-render, it's not a reactive value, and React won't know to re-run your Effect when it changes.
<Trans>[`ref.current`](/reference/react/useRef#reference)와 같이 변이 가능한 값 또는 이 값으로부터 읽은 것 역시 의존성이 될 수 없습니다. `useRef`가 반환하는 ref 객체 자체는 의존성이 될 수 있지만, `current` 프로퍼티는 의도적으로 변이 가능합니다. 이를 통해 [재렌더링을 트리거하지 않고도 무언가를 추적](/learn/referencing-values-with-refs)할 수 있습니다. 하지만 이를 변경하더라도 재렌더링을 트리거하지는 않기 때문에, 이는 반응형 값이 아니며, React는 이 값이 변경될 때 Effect를 다시 실행해야 할지 알 수 없습니다.</Trans>

As you'll learn below on this page, a linter will check for these issues automatically.
<Trans>이 페이지 아래에서 배우게 되겠지만, 린터는 이러한 문제를 자동으로 확인해 줍니다.</Trans>

</DeepDive>

### React verifies that you specified every reactive value as a dependency<Trans>React는 모든 반응형 값을 의존성으로 지정했는지 검토합니다</Trans> {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

If your linter is [configured for React,](/learn/editor-setup#linting) it will check that every reactive value used by your Effect's code is declared as its dependency. For example, this is a lint error because both `roomId` and `serverUrl` are reactive:
<Trans>린터가 [React에 맞게 구성](/learn/editor-setup#linting)된 경우, Effect 코드에서 사용되는 모든 반응형 값이 해당 의존성으로 선언되었는지 확인합니다. 예를 들어 다음 코드는 `roomId` 나 `serverUrl`가 모두 반응형이므로 린트 오류입니다:</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId is reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl is reactive

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Something's wrong here!

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

This may look like a React error, but really React is pointing out a bug in your code. Both `roomId` and `serverUrl` may change over time, but you're forgetting to re-synchronize your Effect when they change. You will remain connected to the initial `roomId` and `serverUrl` even after the user picks different values in the UI.
<Trans>이것은 React 오류처럼 보일 수 있지만 실제로는 코드의 버그를 지적하는 것입니다. `roomId`와  `serverUrl`은 시간이 지남에 따라 변경될 수 있지만, 변경 시 Effect를 다시 동기화하는 것을 잊어버리고 있습니다. 결과적으로 사용자가 UI에서 다른 값을 선택한 후에도 초기 `roomId` 와  `serverUrl`에 연결된 상태로 유지됩니다.</Trans>

To fix the bug, follow the linter's suggestion to specify `roomId` and `serverUrl` as dependencies of your Effect:
<Trans>버그를 수정하려면 린터의 제안에 따라 Effect의 종속 요소로 `roomId` 및 `serverUrl`을 지정하세요:</Trans>

```js {9}
function ChatRoom({ roomId }) { // roomId is reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl is reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ All dependencies declared
  // ...
}
```

Try this fix in the sandbox above. Verify that the linter error is gone, and the chat re-connects when needed.
<Trans>버그를 수정하려면 린터의 제안에 따라 Effect의 종속 요소로 roomId 및 serverUrl을 지정하세요:</Trans>

<Note>

In some cases, React *knows* that a value never changes even though it's declared inside the component. For example, the [`set` function](/reference/react/useState#setstate) returned from `useState` and the ref object returned by [`useRef`](/reference/react/useRef) are *stable*--they are guaranteed to not change on a re-render. Stable values aren't reactive, so you may omit them from the list. Including them is allowed: they won't change, so it doesn't matter.
<Trans>어떤 경우에는 컴포넌트 내부에서 값이 선언되더라도 절대 변하지 않는다는 것을 React가 알고 있습니다. 예를 들어, useState에서 반환된 [`설정자 함수`](/reference/react/useState#setstate)와 [`useRef`](/reference/react/useRef)에서 반환된 ref 객체는 재렌더링 시 변경되지 않도록 보장되는 *안정적인* 값입니다. 안정적인 값은 반응하지 않으므로 린터를 사용하면 목록에서 생략할 수 있습니다. 그러나 이러한 값을 포함하는 것은 허용됩니다. 변경되지 않으므로 상관없습니다.</Trans>

</Note>

### What to do when you don't want to re-synchronize <Trans>재동기화를 원치 않는 경우엔 어떻게 해야 하나요?</Trans> {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

In the previous example, you've fixed the lint error by listing `roomId` and `serverUrl` as dependencies.
<Trans>이전 예제에서는 `roomId`와  `serverUrl` 를 의존성으로 나열하여 린트 오류를 수정했습니다.</Trans>

**However, you could instead "prove" to the linter that these values aren't reactive values,** i.e. that they *can't* change as a result of a re-render. For example, if `serverUrl` and `roomId` don't depend on rendering and always have the same values, you can move them outside the component. Now they don't need to be dependencies:
<Trans>**그러나 대신 이러한 값이 반응형 값이 아니라는 것, 즉 재렌더링의 결과로 변경될 수 없다는 것을 린터에 "증명"할 수 있습니다.** 예를 들어 `serverUrl`과 `roomId`가 렌더링에 의존하지 않고 항상 같은 값을 갖는다면 컴포넌트 외부로 옮길 수 있습니다. 이제 의존성이 될 필요가 없습니다:</Trans>

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
const roomId = 'general'; // roomId is not reactive

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

You can also move them *inside the Effect.* They aren't calculated during rendering, so they're not reactive:
<Trans>또한 *Effect 내부*로 이동할 수도 있습니다. 렌더링 중에 계산되지 않으므로 반응하지 않습니다:</Trans>

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
    const roomId = 'general'; // roomId is not reactive
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

**Effects are reactive blocks of code.** They re-synchronize when the values you read inside of them change. Unlike event handlers, which only run once per interaction, Effects run whenever synchronization is necessary.
<Trans>**Effect는 반응형 코드 블록입니다.** 내부에서 읽은 값이 변경되면 다시 동기화됩니다. 상호작용당 한 번만 실행되는 이벤트 핸들러와 달리 Effect는 동기화가 필요할 때마다 실행됩니다.</Trans>

**You can't "choose" your dependencies.** Your dependencies must include every [reactive value](#all-variables-declared-in-the-component-body-are-reactive) you read in the Effect. The linter enforces this. Sometimes this may lead to problems like infinite loops and to your Effect re-synchronizing too often. Don't fix these problems by suppressing the linter! Here's what to try instead:
<Trans>**의존성을 "선택"할 수는 없습니다.** 의존성에는 Effect에서 읽은 모든 [반응형 값](#all-variables-declared-in-the-component-body-are-reactive)이 포함되어야 합니다. 린터가 이를 강제합니다. 때때로 이로 인해 무한 루프와 같은 문제가 발생하거나 Effect가 너무 자주 다시 동기화될 수 있습니다. 린터를 억제하여 이러한 문제를 해결하지 마세요! 대신 시도할 수 있는 방법은 다음과 같습니다:</Trans>

* **Check that your Effect represents an independent synchronization process.** If your Effect doesn't synchronize anything, [it might be unnecessary.](/learn/you-might-not-need-an-effect) If it synchronizes several independent things, [split it up.](#each-effect-represents-a-separate-synchronization-process)
<Trans>**Effect가 독립적인 동기화 프로세스를 나타내는지 확인하세요.** Effect가 아무것도 동기화하지 않는다면 [불필요한 것일 수 있습니다.](/learn/you-might-not-need-an-effect) 여러 개의 독립적인 것을 동기화하는 경우 [분할하세요.](#each-effect-represents-a-separate-synchronization-process)</Trans>

* **If you want to read the latest value of props or state without "reacting" to it and re-synchronizing the Effect,** you can split your Effect into a reactive part (which you'll keep in the Effect) and a non-reactive part (which you'll extract into something called an _Effect Event_). [Read about separating Events from Effects.](/learn/separating-events-from-effects)
<Trans>**'반응'하지 않고 Effect를 재동기화하지 않으면서** props나 state의 최신 값을 읽으려면, Effect를 반응하는 부분(Effect에 유지)과 반응하지 않는 부분(*Effect 이벤트*라는 것으로 추출)으로 분리할 수 있습니다. [이벤트와 Effect를 분리하는 방법에 대해 읽어보세요.](/learn/separating-events-from-effects)</Trans>

* **Avoid relying on objects and functions as dependencies.** If you create objects and functions during rendering and then read them from an Effect, they will be different on every render. This will cause your Effect to re-synchronize every time. [Read more about removing unnecessary dependencies from Effects.](/learn/removing-effect-dependencies)
<Trans>**객체와 함수를 의존성으로 사용하지 마세요.** 렌더링 중에 오브젝트와 함수를 생성한 다음 Effect에서 읽으면 렌더링할 때마다 오브젝트와 함수가 달라집니다. 그러면 매번 Effect를 다시 동기화해야 합니다. [Effect에서 불필요한 의존성을 제거하는 방법에 대해 읽어보세요.](/learn/removing-effect-dependencies)</Trans>

<Pitfall>

The linter is your friend, but its powers are limited. The linter only knows when the dependencies are *wrong*. It doesn't know *the best* way to solve each case. If the linter suggests a dependency, but adding it causes a loop, it doesn't mean the linter should be ignored. You need to change the code inside (or outside) the Effect so that that value isn't reactive and doesn't *need* to be a dependency.
<Trans>린터는 여러분의 친구이지만 그 힘은 제한되어 있습니다. 린터는 의존성이 잘못되었을 때만 알 수 있습니다. 각 사례를 해결하는 최선의 방법은 알지 못합니다. 만약 린터가 의존성을 제안하지만 이를 추가하면 루프가 발생한다고 해서 링터를 무시해야 한다는 의미는 아닙니다. 해당 값이 반응적이지 않고 의존성이 될 필요가 없도록 Effect 내부(또는 외부)의 코드를 변경해야 한다는 뜻입니다.</Trans>

If you have an existing codebase, you might have some Effects that suppress the linter like this:
<Trans>기존 코드베이스가 있는 경우 이와 같이 린터를 억제하는 Effect가 있을 수 있습니다:</Trans>

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

On the [next](/learn/separating-events-from-effects) [pages](/learn/removing-effect-dependencies), you'll learn how to fix this code without breaking the rules. It's always worth fixing!
<Trans>[다음](/learn/separating-events-from-effects) [페이지들](/learn/removing-effect-dependencies)에서는 규칙을 위반하지 않고 이 코드를 수정하는 방법을 알아보세요. 언제나 고칠 가치가 있습니다!</Trans>

</Pitfall>

<Recap>

- Components can mount, update, and unmount.
- Each Effect has a separate lifecycle from the surrounding component.
- Each Effect describes a separate synchronization process that can *start* and *stop*.
- When you write and read Effects, think from each individual Effect's perspective (how to start and stop synchronization) rather than from the component's perspective (how it mounts, updates, or unmounts).
- Values declared inside the component body are "reactive".
- Reactive values should re-synchronize the Effect because they can change over time.
- The linter verifies that all reactive values used inside the Effect are specified as dependencies.
- All errors flagged by the linter are legitimate. There's always a way to fix the code to not break the rules.

<TransBlock>
- 컴포넌트는 마운트, 업데이트, 마운트 해제할 수 있습니다.
- 각 Effect는 주변 컴포넌트와 별도의 라이프사이클을 가집니다.
- 각 Effect는 *시작* 및 *중지* 할 수 있는 별도의 동기화 프로세스를 설명합니다.
- Effect를 작성하고 읽을 때는 컴포넌트의 관점(마운트, 업데이트 또는 마운트 해제 방법)이 아니라 각 개별 Effect의 관점(동기화 시작 및 중지 방법)에서 생각해야 합니다.
- 컴포넌트 본문 내부에 선언된 값은 "반응형"입니다.
- 반응형 값은 시간이 지남에 따라 변경될 수 있으므로 Effect를 다시 동기화해야 합니다.
- 린터는 Effect 내부에서 사용된 모든 반응형 값이 의존성으로 지정되었는지 확인합니다.
- 린터에 의해 플래그가 지정된 모든 오류는 합법적인 오류입니다. 규칙을 위반하지 않도록 코드를 수정할 수 있는 방법은 항상 있습니다.
</TransBlock>

</Recap>

<Challenges>

#### Fix reconnecting on every keystroke<Trans>키 입력시마다 재연결되는 문제 해결</Trans> {/*fix-reconnecting-on-every-keystroke*/}

In this example, the `ChatRoom` component connects to the chat room when the component mounts, disconnects when it unmounts, and reconnects when you select a different chat room. This behavior is correct, so you need to keep it working.
<Trans>이 예제에서 `ChatRoom` 컴포넌트는 컴포넌트가 마운트될 때 채팅방에 연결되고, 마운트가 해제되면 연결이 끊어지며, 다른 채팅방을 선택하면 다시 연결됩니다. 이 동작은 올바른 것이므로 계속 작동하도록 해야 합니다.</Trans>

However, there is a problem. Whenever you type into the message box input at the bottom, `ChatRoom` *also* reconnects to the chat. (You can notice this by clearing the console and typing into the input.) Fix the issue so that this doesn't happen.
<Trans>하지만 문제가 있습니다. 하단의 메시지 상자 입력란에 입력할 때마다 `ChatRoom`도 채팅에 다시 연결됩니다. (콘솔을 지우고 입력란에 입력하면 이 문제를 확인할 수 있습니다.) 이런 일이 발생하지 않도록 문제를 수정하세요.</Trans>
<Hint>

You might need to add a dependency array for this Effect. What dependencies should be there?
<Trans>이 Effect에 대한 의존성 배열을 추가해야 할 수도 있습니다. 어떤 의존성이 있어야 할까요?</Trans>
</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  });

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution>

This Effect didn't have a dependency array at all, so it re-synchronized after every re-render. First, add a dependency array. Then, make sure that every reactive value used by the Effect is specified in the array. For example, `roomId` is reactive (because it's a prop), so it should be included in the array. This ensures that when the user selects a different room, the chat reconnects. On the other hand, `serverUrl` is defined outside the component. This is why it doesn't need to be in the array.
<Trans>이 Effect에는 의존성 배열이 전혀 없었기 때문에 렌더링할 때마다 다시 동기화되었습니다. 먼저 의존성 배열을 추가합니다. 그런 다음 Effect에서 사용하는 모든 반응형 값이 배열에 지정되어 있는지 확인합니다. 예를 들어 `roomId`는 prop이기 때문에 반응형이므로 배열에 포함되어야 합니다. 이렇게 하면 사용자가 다른 방을 선택해도 채팅이 다시 연결됩니다. 반면에 `serverUrl`은 컴포넌트 외부에 정의되어 있습니다. 그렇기 때문에 배열에 포함될 필요가 없습니다.</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

</Solution>

#### Switch synchronization on and off <Trans>동기화를 껐다 켜보세요.</Trans> {/*switch-synchronization-on-and-off*/}

In this example, an Effect subscribes to the window [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) event to move a pink dot on the screen. Try hovering over the preview area (or touching the screen if you're on a mobile device), and see how the pink dot follows your movement.
<Trans>이번 예제에서는 Effect가 윈도우의 [`poinermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) 이벤트를 구독하여 화면에서 분홍색 점을 이동합니다. 미리 보기 영역 위로 마우스를 가져가서(또는 모바일 장치에서 화면을 터치하여) 분홍색 점이 어떻게 움직이는지 확인해 보세요.</Trans>

There is also a checkbox. Ticking the checkbox toggles the `canMove` state variable, but this state variable is not used anywhere in the code. Your task is to change the code so that when `canMove` is `false` (the checkbox is ticked off), the dot should stop moving. After you toggle the checkbox back on (and set `canMove` to `true`), the box should follow the movement again. In other words, whether the dot can move or not should stay synchronized to whether the checkbox is checked.
<Trans>체크박스도 있습니다. 확인란을 선택하면 `canMove` state 변수가 토글되지만, 이 state 변수는 코드의 어느 곳에서도 사용되지 않습니다. 여러분의 임무는 `canMove`가 거짓일 때(체크박스가 체크된 상태) 점의 이동이 중지되도록 코드를 변경하는 것입니다. 확인란을 다시 켜고 `canMove`를 true로 설정하면 상자가 다시 움직여야 합니다. 즉, 도트가 움직일 수 있는지 여부는 확인란의 체크 여부와 동기화를 유지해야 합니다.</Trans>

<Hint>

You can't declare an Effect conditionally. However, the code inside the Effect can use conditions!
<Trans>Effect는 조건부로 선언할 수 없습니다. 하지만 Effect 내부의 코드는 조건을 사용할 수 있습니다!</Trans>

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
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

<Solution>

One solution is to wrap the `setPosition` call into an `if (canMove) { ... }` condition:
<Trans>한 가지 해결책은 `setPosition` 호출을 `if (canMove) { ... }`</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

Alternatively, you could wrap the *event subscription* logic into an `if (canMove) { ... }` condition:
<Trans>또는 *이벤트 구독* 로직을 `if (canMove) { ... }` 조건으로 감쌀 수도 있습니다:</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    if (canMove) {
      window.addEventListener('pointermove', handleMove);
      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [canMove]);

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

In both of these cases, `canMove` is a reactive variable that you read inside the Effect. This is why it must be specified in the list of Effect dependencies. This ensures that the Effect re-synchronizes after every change to its value.
<Trans>이 두 경우 모두 `canMove`는 Effect 내부에서 읽는 반응형 변수입니다. 그렇기 때문에 이 변수를 Effect 종속성 목록에 지정해야 합니다. 이렇게 하면 값이 변경될 때마다 Effect가 다시 동기화됩니다.</Trans>

</Solution>

#### Investigate a stale value bug <Trans>오래된 value 버그 조사하기</Trans> {/*investigate-a-stale-value-bug*/}

In this example, the pink dot should move when the checkbox is on, and should stop moving when the checkbox is off. The logic for this has already been implemented: the `handleMove` event handler checks the `canMove` state variable.
<Trans>이 예제에서는 체크박스가 켜져 있으면 분홍색 점이 움직여야 하고 체크박스가 꺼져 있으면 움직임을 멈춰야 합니다. 이를 위한 로직은 이미 구현되어 있습니다. `handleMove` 이벤트 핸들러는 `canMove` state 변수를 확인합니다.</Trans>

However, for some reason, the `canMove` state variable inside `handleMove` appears to be "stale": it's always `true`, even after you tick off the checkbox. How is this possible? Find the mistake in the code and fix it.
<Trans>그러나 어떤 이유에서인지 `handleMove` 내부의 `canMove` 상태 변수가 체크박스를 체크한 후에도 항상 `true`인 "오래된" 상태인 것처럼 보입니다. 어떻게 이런 일이 가능할까요? 코드에서 실수를 찾아서 수정하세요.</Trans>

<Hint>

If you see a linter rule being suppressed, remove the suppression! That's where the mistakes usually are.
<Trans>린터 규칙을 제한하는 줄이 보이면 제한을 제거하세요! 보통 이 부분에서 실수가 발생합니다.</Trans>

</Hint>

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

<Solution>

The problem with the original code was suppressing the dependency linter. If you remove the suppression, you'll see that this Effect depends on the `handleMove` function. This makes sense: `handleMove` is declared inside the component body, which makes it a reactive value. Every reactive value must be specified as a dependency, or it can potentially get stale over time!
<Trans>원래 코드의 문제는 의존성 린터를 제한하는 것이었습니다. 제한사항을 제거하면 이 Effect가 `handleMove` 함수에 의존한다는 것을 알 수 있습니다. 이는 당연한 결과입니다. `handleMove`는 컴포넌트 본문 내부에서 선언되어 반응형 값이 되기 때문입니다. 모든 반응형 값은 의존성으로 지정해야 하며, 그렇지 않으면 시간이 지나면 낡아질 수 있습니다!</Trans>

The author of the original code has "lied" to React by saying that the Effect does not depend (`[]`) on any reactive values. This is why React did not re-synchronize the Effect after `canMove` has changed (and `handleMove` with it). Because React did not re-synchronize the Effect, the `handleMove` attached as a listener is the `handleMove` function created during the initial render. During the initial render, `canMove` was `true`, which is why `handleMove` from the initial render will forever see that value.
<Trans>원래 코드의 작성자는 Effect가 어떤 반응형 값에도 의존하지(`[]`) 않는다고 말함으로써 React에 "거짓말"을 했습니다. 이것이 바로 `canMove`가 변경된 후 React가 Effect를(`handleMove`도 함께) 다시 동기화하지 않은 이유입니다. React가 Effect를 다시 동기화하지 않았기 때문에 리스너로 첨부된 `handleMove`는 초기 렌더링 중에 생성된 `handleMove` 함수입니다. 초기 렌더링 동안 `canMove`는 `true`였기 때문에 초기 렌더링의 `handleMove`는 영원히 그 값을 보게 됩니다.</Trans>

**If you never suppress the linter, you will never see problems with stale values.** There are a few different ways to solve this bug, but you should always start by removing the linter suppression. Then change the code to fix the lint error.
<Trans>**린터를 제한하지 않으면 오래된 값으로 인한 문제가 발생하지 않습니다.** 이 버그를 해결하는 방법에는 몇 가지가 있지만 항상 린터 제한을 제거하는 것부터 시작해야 합니다. 그런 다음 코드를 변경하여 린트 오류를 수정합니다.</Trans>

You can change the Effect dependencies to `[handleMove]`, but since it's going to be a newly defined function for every render, you might as well remove dependencies array altogether. Then the Effect *will* re-synchronize after every re-render:
<Trans>Effect 의존성을 `[handleMove]`로 변경할 수 있지만 렌더링할 때마다 새로 정의되는 함수가 될 것이므로 의존성 배열을 모두 제거하는 것이 좋습니다. 그러면 Effect가 다시 렌더링할 때마다 다시 동기화됩니다:</Trans>

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
  });

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

This solution works, but it's not ideal. If you put `console.log('Resubscribing')` inside the Effect, you'll notice that it resubscribes after every re-render. Resubscribing is fast, but it would still be nice to avoid doing it so often.
<Trans>이 해결책은 Effect가 있지만 이상적이지는 않습니다. Effect 안에 `console.log('재구독')`을 넣으면 렌더링할 때마다 재구독하는 것을 확인할 수 있습니다. 재구독은 빠르지만, 너무 자주 재구독하는 것은 피하는 것이 좋습니다.</Trans>

A better fix would be to move the `handleMove` function *inside* the Effect. Then `handleMove` won't be a reactive value, and so your Effect won't depend on a function. Instead, it will need to depend on `canMove` which your code now reads from inside the Effect. This matches the behavior you wanted, since your Effect will now stay synchronized with the value of `canMove`:
<Trans>더 나은 수정 방법은 `handleMove` 함수를 Effect 내부로 이동하는 것입니다. 그러면 `handleMove`가 반응형 값이 아니므로 Effect가 함수에 의존하지 않습니다. 대신, 이제 코드가 Effect 내부에서 읽는 `canMove`에 의존해야 합니다. 이제 Effect가 `canMove` 값과 동기화를 유지하므로 원하는 동작과 일치합니다:</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

Try adding `console.log('Resubscribing')` inside the Effect body and notice that now it only resubscribes when you toggle the checkbox (`canMove` changes) or edit the code. This makes it better than the previous approach that always resubscribed.
<Trans>Effect 본문 안에 `console.log('재구독')`을 추가하면 이제 체크박스를 토글하거나(`canMove` 변경) 코드를 편집할 때만 재구독되는 것을 확인할 수 있습니다. 이는 항상 다시 구독하던 이전 접근 방식보다 더 나은 방법입니다.</Trans>

You'll learn a more general approach to this type of problem in [Separating Events from Effects.](/learn/separating-events-from-effects)
<Trans>이러한 유형의 문제에 대한 보다 일반적인 접근 방식은 [이벤트와 Effect 분리하기](/learn/separating-events-from-effects)에서 배울 수 있습니다.</Trans>
</Solution>

#### Fix a connection switch <Trans>연결 스위치 조정</Trans> {/*fix-a-connection-switch*/}

In this example, the chat service in `chat.js` exposes two different APIs: `createEncryptedConnection` and `createUnencryptedConnection`. The root `App` component lets the user choose whether to use encryption or not, and then passes down the corresponding API method to the child `ChatRoom` component as the `createConnection` prop.
<Trans>이 예제에서 `chat.js`의 채팅 서비스는 `createEncryptedConnection`과 `createUnencryptedConnection`이라는 두 개의 서로 다른 API를 노출합니다. 루트 `App` 컴포넌트는 사용자가 암호화 사용 여부를 선택할 수 있도록 한 다음, 해당 API 메서드를 하위 `ChatRoom` 컴포넌트에 `createConnection` prop으로 전달합니다.</Trans>

Notice that initially, the console logs say the connection is not encrypted. Try toggling the checkbox on: nothing will happen. However, if you change the selected room after that, then the chat will reconnect *and* enable encryption (as you'll see from the console messages). This is a bug. Fix the bug so that toggling the checkbox *also* causes the chat to reconnect.
<Trans>처음에는 콘솔 로그에 연결이 암호화되지 않았다고 표시됩니다. 확인란을 켜도 아무 일도 일어나지 않습니다. 하지만 그 후에 선택한 대화방을 변경하면 채팅이 다시 연결되고 콘솔 메시지에서 볼 수 있듯이 암호화가 활성화됩니다. 이것은 버그입니다. 확인란을 토글해도 채팅이 다시 연결되도록 버그를 수정했습니다.</Trans>

<Hint>

Suppressing the linter is always suspicious. Could this be a bug?
<Trans>린터 규칙을 제한하는 것은 언제나 의심스럽습니다. 이것도 버그 일까요?</Trans>

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

If you remove the linter suppression, you will see a lint error. The problem is that `createConnection` is a prop, so it's a reactive value. It can change over time! (And indeed, it should--when the user ticks the checkbox, the parent component passes a different value of the `createConnection` prop.) This is why it should be a dependency. Include it in the list to fix the bug:
<Trans>린터 제한을 제거하면 린트 오류가 발생합니다. 문제는 `createConnection`이 prop이기 때문에 반응형 값이라는 것입니다. 시간이 지남에 따라 변경될 수 있습니다! (실제로 사용자가 체크박스를 선택하면 부모 컴포넌트가 다른 값의 `createConnection` prop을 전달합니다.) 실제로 그래야 합니다. 이것이 바로 의존성이어야 하는 이유입니다. 목록에 포함시켜 버그를 수정하세요:</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

It is correct that `createConnection` is a dependency. However, this code is a bit fragile because someone could edit the `App` component to pass an inline function as the value of this prop. In that case, its value would be different every time the `App` component re-renders, so the Effect might re-synchronize too often. To avoid this, you can pass `isEncrypted` down instead:
<Trans>`createConnection`이 의존성이라는 것은 맞습니다. 하지만 누군가 `App` 컴포넌트를 편집하여 인라인 함수를 이 prop의 값으로 전달할 수 있기 때문에 이 코드는 약간 취약합니다. 이 경우 `App` 컴포넌트가 다시 렌더링할 때마다 값이 달라지므로 Effect가 너무 자주 재동기화될 수 있습니다. 이를 방지하려면 대신 `isEncrypted`를 전달할 수 있습니다:</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted }) {
  useEffect(() => {
    const createConnection = isEncrypted ?
      createEncryptedConnection :
      createUnencryptedConnection;
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

In this version, the `App` component passes a boolean prop instead of a function. Inside the Effect, you decide which function to use. Since both `createEncryptedConnection` and `createUnencryptedConnection` are declared outside the component, they aren't reactive, and don't need to be dependencies. You'll learn more about this in [Removing Effect Dependencies.](/learn/removing-effect-dependencies)
<Trans>이 버전에서는 `App` 컴포넌트가 함수 대신 부울 prop을 전달합니다. Effect 내에서 어떤 함수를 사용할지 결정합니다. `createEncryptedConnection`과 `createUnencryptedConnection`은 모두 컴포넌트 외부에서 선언되므로 반응형이 아니므로 의존성이 될 필요가 없습니다. 이에 대한 자세한 내용은 [Effect 의존성 제거하기](/learn/removing-effect-dependencies)에서 확인할 수 있습니다.</Trans>

</Solution>

#### Populate a chain of select boxes <Trans>선택 상자 체인 채우기</Trans> {/*populate-a-chain-of-select-boxes*/}

In this example, there are two select boxes. One select box lets the user pick a planet. Another select box lets the user pick a place *on that planet.* The second box doesn't work yet. Your task is to make it show the places on the chosen planet.
<Trans>이 예제에는 두 개의 선택 상자가 있습니다. 하나의 선택 상자에서 사용자는 행성을 선택할 수 있습니다. 다른 선택 상자는 사용자가 해당 행성의 장소를 선택할 수 있도록 합니다. 두 번째 상자는 아직 작동하지 않습니다. 여러분의 임무는 선택한 행성의 장소를 표시하도록 만드는 것입니다.</Trans>

Look at how the first select box works. It populates the `planetList` state with the result from the `"/planets"` API call. The currently selected planet's ID is kept in the `planetId` state variable. You need to find where to add some additional code so that the `placeList` state variable is populated with the result of the `"/planets/" + planetId + "/places"` API call.
<Trans>첫 번째 선택 상자의 작동 방식을 살펴보세요. 이 선택 상자는 "/planets" API 호출의 결과로 `planetList` state를 채웁니다. 현재 선택된 행성의 ID는 `planetId` state 변수에 보관됩니다. `placeList` state 변수가 "/planets/" + planetId + "/places" API 호출의 결과로 채워지도록 몇 가지 추가 코드를 추가할 위치를 찾아야 합니다.</Trans>

If you implement this right, selecting a planet should populate the place list. Changing a planet should change the place list.
<Trans>이 기능을 구현하면 행성을 선택하면 장소 목록이 채워집니다. 행성을 변경하면 장소 목록이 변경되어야 합니다.</Trans>

<Hint>

If you have two independent synchronization processes, you need to write two separate Effects.
<Trans>두 개의 독립적인 동기화 프로세스가 있는 경우 두 개의 개별 Effect를 작성해야 합니다.</Trans>

</Hint>

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

There are two independent synchronization processes:
<Trans>두 가지 독립적인 동기화 프로세스가 있습니다:</Trans>

- The first select box is synchronized to the remote list of planets.
- The second select box is synchronized to the remote list of places for the current `planetId`.

<TransBlock>
- 첫 번째 선택 상자는 원격 행성 목록에 동기화됩니다.
- 두 번째 선택 상자는 현재 `planetId`에 대한 원격 장소 목록과 동기화됩니다.
</TransBlock>

This is why it makes sense to describe them as two separate Effects. Here's an example of how you could do this:
<Trans>그렇기 때문에 두 개의 개별 Effect로 설명하는 것이 합리적입니다. 다음은 이를 수행하는 방법에 대한 예입니다:</Trans>

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (planetId === '') {
      // Nothing is selected in the first box yet
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('Fetched a list of places on "' + planetId + '".');
        setPlaceList(result);
        setPlaceId(result[0].id); // Select the first place
      }
    });
    return () => {
      ignore = true;
    }
  }, [planetId]);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

This code is a bit repetitive. However, that's not a good reason to combine it into a single Effect! If you did this, you'd have to combine both Effect's dependencies into one list, and then changing the planet would refetch the list of all planets. Effects are not a tool for code reuse.
<Trans> 이 코드는 약간 반복적입니다. 하지만 그렇다고 해서 이를 하나의 Effect로 결합해야 하는 이유는 없습니다! 이렇게 하면 두 Effect의 의존성을 하나의 목록으로 결합한 다음 행성을 변경하면 모든 행성 목록을 다시 가져와야 합니다. Effect는 코드 재사용을 위한 도구가 아닙니다.</Trans>

Instead, to reduce repetition, you can extract some logic into a custom Hook like `useSelectOptions` below:
<Trans>대신, 반복을 줄이기 위해 아래의 `useSelectOptions`와 같은 커스텀 훅에 일부 로직을 추출할 수 있습니다:</Trans>
<Sandpack>

```js App.js
import { useState } from 'react';
import { useSelectOptions } from './useSelectOptions.js';

export default function Page() {
  const [
    planetList,
    planetId,
    setPlanetId
  ] = useSelectOptions('/planets');

  const [
    placeList,
    placeId,
    setPlaceId
  ] = useSelectOptions(planetId ? `/planets/${planetId}/places` : null);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '...'} on {planetId || '...'} </p>
    </>
  );
}
```

```js useSelectOptions.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export function useSelectOptions(url) {
  const [list, setList] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    if (url === null) {
      return;
    }

    let ignore = false;
    fetchData(url).then(result => {
      if (!ignore) {
        setList(result);
        setSelectedId(result[0].id);
      }
    });
    return () => {
      ignore = true;
    }
  }, [url]);
  return [list, selectedId, setSelectedId];
}
```

```js api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Check the `useSelectOptions.js` tab in the sandbox to see how it works. Ideally, most Effects in your application should eventually be replaced by custom Hooks, whether written by you or by the community. Custom Hooks hide the synchronization logic, so the calling component doesn't know about the Effect. As you keep working on your app, you'll develop a palette of Hooks to choose from, and eventually you won't need to write Effects in your components very often.
<Trans>샌드박스에서 `useSelectOptions.js` 탭을 확인하여 작동 방식을 확인하세요. 이상적으로는 애플리케이션에 있는 대부분의 Effect는 사용자가 직접 작성했든 커뮤니티에서 작성했든 결국 커스텀 훅으로 대체되어야 합니다. 커스텀 훅은 동기화 로직을 숨기므로 호출하는 컴포넌트는 Effect에 대해 알지 못합니다. 앱을 계속 개발하다 보면 선택할 수 있는 훅 팔레트를 개발하게 될 것이고, 결국에는 컴포넌트에 Effect를 자주 작성할 필요가 없게 될 것입니다.</Trans>

</Solution>

</Challenges>
