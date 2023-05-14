---
title: useEffect
translators: [손한종]
---

<Intro>

`useEffect` is a React Hook that lets you [synchronize a component with an external system.](/learn/synchronizing-with-effects)
<Trans>`useEffect`는 [컴포넌트를 외부 시스템과 동기화](/learn/synchronizing-with-effects)할 수 있는 React 훅입니다.</Trans>

```js
useEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `useEffect(setup, dependencies?)` {/*useeffect*/}

Call `useEffect` at the top level of your component to declare an Effect:
<Trans>컴포넌트의 최상위 레벨에서 `useEffect`를 호출하여 Effect를 선언합니다:</Trans>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

* `setup`: The function with your Effect's logic. Your setup function may also optionally return a *cleanup* function. When your component is added to the DOM, React will run your setup function. After every re-render with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values. After your component is removed from the DOM, React will run your cleanup function one last time.
<Trans>`setup`: Effect의 로직이 포함된 함수입니다. 셋업 함수는 선택적으로 *클린업 함수*를 반환할 수도 있습니다. React는 컴포넌트가 DOM에 추가되면 셋업 함수를 실행합니다. 의존성이 변경되어 다시 렌더링할 때마다 React는 (클린업 함수가 있는 경우) 먼저 이전 값으로 클린업 함수를 실행한 다음, 새 값으로 셋업 함수를 실행합니다. 컴포넌트가 DOM에서 제거되면, React는 마지막으로 클린업 함수를 실행합니다.</Trans>
 
* **optional** `dependencies`: The list of all reactive values referenced inside of the `setup` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is [configured for React](/learn/editor-setup#linting), it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. If you omit this argument, your Effect will re-run after every re-render of the component. [See the difference between passing an array of dependencies, an empty array, and no dependencies at all.](#examples-dependencies)
<Trans>**선택적** `의존성`: setup 코드 내에서 참조된 모든 반응형 값의 목록입니다. 반응형 값은 props, state, 컴포넌트 본문 내부에서 직접 선언한 모든 변수와 함수를 포함합니다. [React용으로 구성된](/learn/editor-setup#linting) 린터는 모든 반응형 값이 의존성에 잘 지정되었는지 확인합니다. 의존성 목록에는 고정된 수의 항목이 있어야 하며 `[dep1, dep2, dep3]`과 같이 인라인으로 작성해야 합니다. React는 각 의존성에 대해 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)로 이전 값과 비교합니다. 의존성을 전혀 지정하지 않으면 컴포넌트를 다시 렌더링할 때마다 Effect가 다시 실행됩니다. [의존성 배열을 전달할 때, 빈 배열을 전달할 때, 그리고 의존성을 전혀 전달하지 않을 때의 차이를 확인해 보세요.](#examples-dependencies)</Trans>

#### Returns<Trans>반환값</Trans> {/*returns*/}

`useEffect` returns `undefined`.
<Trans>`useEffect`는 `undefined`를 반환합니다.</Trans>

#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

* `useEffect` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a new component and move the state into it.
<Trans>`useEffect`는 훅이므로 **컴포넌트의 최상위 레벨 또는 자체 훅**에서만 호출할 수 있습니다.반복문이나 조건문 내부에서는 호출할 수 없습니다. 필요한 경우 새 컴포넌트를 추출하고 state를 그 안으로 옮기세요.</Trans>

* If you're **not trying to synchronize with some external system,** [you probably don't need an Effect.](/learn/you-might-not-need-an-effect)
<Trans>**외부 시스템과 동기화하려는 목적이 아니라면** [Effect가 필요하지 않을지도 모릅니다.](/learn/you-might-not-need-an-effect)</Trans>

* When Strict Mode is on, React will **run one extra development-only setup+cleanup cycle** before the first real setup. This is a stress-test that ensures that your cleanup logic "mirrors" your setup logic and that it stops or undoes whatever the setup is doing. If this causes a problem, [implement the cleanup function.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)
<Trans>Strict 모드가 켜져 있으면 React는 첫 번째 실제 셋업 전에 **개발 전용의 셋업+클린업 사이클**을 한 번 더 실행합니다. 이는 클린업 로직이 셋업 로직을 "미러링"하고 셋업이 수행 중인 모든 작업을 중지하거나 취소하는지를 확인하는 스트레스 테스트입니다. 문제가 발생하면 [클린업 기능을 구현해야 합니다.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)</Trans>

* If some of your dependencies are objects or functions defined inside the component, there is a risk that they will **cause the Effect to re-run more often than needed.** To fix this, remove unnecessary [object](#removing-unnecessary-object-dependencies) and [function](#removing-unnecessary-function-dependencies) dependencies. You can also [extract state updates](#updating-state-based-on-previous-state-from-an-effect) and [non-reactive logic](#reading-the-latest-props-and-state-from-an-effect) outside of your Effect.
<Trans>의존성 중 일부가 컴포넌트 내부에 정의된 객체 또는 함수인 경우 **Effect가 필요 이상으로 자주 다시 실행될 위험이 있습니다.** 이 문제를 해결하려면 불필요한 [객체](#removing-unnecessary-object-dependencies) 및 [함수](#removing-unnecessary-function-dependencies) 의존성을 제거하세요. 혹은 Effect 외부에서 [state 업데이트 추출](#updating-state-based-on-previous-state-from-an-effect) 및 [비반응형 로직](#reading-the-latest-props-and-state-from-an-effect)을 제거할 수도 있습니다.</Trans>

* If your Effect wasn't caused by an interaction (like a click), React will let the browser **paint the updated screen first before running your Effect.** If your Effect is doing something visual (for example, positioning a tooltip), and the delay is noticeable (for example, it flickers), replace `useEffect` with [`useLayoutEffect`.](/reference/react/useLayoutEffect)
<Trans>Effect가 상호작용(예: 클릭)으로 인한 것이 아니라면, **React는 브라우저가 Effect를 실행하기 전에 업데이트된 화면을 먼저 그리도록 합니다.** Effect가 시각적인 작업(예: 툴팁 위치 지정)을 하고 있고, 지연이 눈에 띄는 경우(예: 깜박임), `useEffect`를 [`useLayoutEffect`](/reference/react/useLayoutEffect)로 대체해야 합니다.</Trans>

* Even if your Effect was caused by an interaction (like a click), **the browser may repaint the screen before processing the state updates inside your Effect.** Usually, that's what you want. However, if you must block the browser from repainting the screen, you need to replace `useEffect` with [`useLayoutEffect`.](/reference/react/useLayoutEffect)
<Trans>상호작용(예:클릭)으로 인해 Effect가 발생한 경우에도, **브라우저는 Effect 내부의 state 업데이트를 처리하기 전에 화면을 다시 그릴 수 있습니다.** 보통 이게 기대하는 동작일 것입니다. 만약 브라우저가 화면을 다시 칠하지 못하도록 차단해야 하는 경우라면 `useEffect`를 [`useLayoutEffect`](/reference/react/useLayoutEffect)로 바꿔야 합니다.</Trans>

* Effects **only run on the client.** They don't run during server rendering.
<Trans>Effects는 **클라이언트에서만 실행됩니다.** 서버 렌더링 중에는 실행되지 않습니다.</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Connecting to an external system<Trans>외부 시스템에 연결하기</Trans> {/*connecting-to-an-external-system*/}

Some components need to stay connected to the network, some browser API, or a third-party library, while they are displayed on the page. These systems aren't controlled by React, so they are called *external.*
<Trans>때로는 컴포넌트가 페이지에 표시되는 동안 네트워크, 일부 브라우저 API 또는 타사 라이브러리에 연결 상태를 유지해야 할 수도 있습니다. 이러한 시스템은 React에서 제어되지 않으므로 *외부(external)* 라고 합니다.</Trans>

To [connect your component to some external system,](/learn/synchronizing-with-effects) call `useEffect` at the top level of your component:
<Trans>[컴포넌트를 외부 시스템에 연결하려면](/learn/synchronizing-with-effects) 컴포넌트의 최상위 레벨에서 `useEffect`를 호출하세요:</Trans>

```js [[1, 8, "const connection = createConnection(serverUrl, roomId);"], [1, 9, "connection.connect();"], [2, 11, "connection.disconnect();"], [3, 13, "[serverUrl, roomId]"]]
import { useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
  	const connection = createConnection(serverUrl, roomId);
    connection.connect();
  	return () => {
      connection.disconnect();
  	};
  }, [serverUrl, roomId]);
  // ...
}
```

You need to pass two arguments to `useEffect`:
<Trans>`useEffect`에는 두 개의 인자를 전달해야 합니다:</Trans>

1. A *setup function* with <CodeStep step={1}>setup code</CodeStep> that connects to that system.
   - It should return a *cleanup function* with <CodeStep step={2}>cleanup code</CodeStep> that disconnects from that system.
2. A <CodeStep step={3}>list of dependencies</CodeStep> including every value from your component used inside of those functions.

<TransBlock>
1. 해당 시스템에 연결하는 <CodeStep step={1}>셋업 코드</CodeStep>가 포함된 *셋업 함수*.
    * 해당 시스템과의 연결을 끊는 <CodeStep step={2}>클린업 코드</CodeStep>가 포함된 *클린업 함수*를 반환해야 합니다.
2. 해당 함수 내부에서 사용되는 컴포넌트의 모든 값을 포함한 <CodeStep step={3}>의존성 목록</CodeStep>.
</TransBlock>

**React calls your setup and cleanup functions whenever it's necessary, which may happen multiple times:**
<Trans>**React는 필요할 때마다 셋업 및 클린업 함수를 호출하는데, 이는 여러 번 발생할 수 있습니다.**</Trans>

1. Your <CodeStep step={1}>setup code</CodeStep> runs when your component is added to the page *(mounts)*.
2. After every re-render of your component where the <CodeStep step={3}>dependencies</CodeStep> have changed:
   - First, your <CodeStep step={2}>cleanup code</CodeStep> runs with the old props and state.
   - Then, your <CodeStep step={1}>setup code</CodeStep> runs with the new props and state.
3. Your <CodeStep step={2}>cleanup code</CodeStep> runs one final time after your component is removed from the page *(unmounts).*

<TransBlock>
1. 컴포넌트가 페이지에 추가될 때 *(마운트)* 마다 <CodeStep step={1}>셋업 코드</CodeStep>를 실행합니다.
2. <CodeStep step={3}>의존성</CodeStep>이 변경된 컴포넌트를 다시 렌더링할 때마다:
    * 먼저 이전 props와 state로 <CodeStep step={2}>클린업 코드</CodeStep>를 실행합니다.
    * 그런 다음 새 props와 state로 <CodeStep step={1}>셋업 코드</CodeStep>를 실행합니다.
3. 컴포넌트가 페이지에서 제거되면 *(마운트 해제)* 마지막으로 한 번 <CodeStep step={2}>클린업 코드</CodeStep>를 실행합니다.
</TransBlock>

**Let's illustrate this sequence for the example above.**
<Trans>**위의 예에서 이 시퀀스를 설명해 보겠습니다.**</Trans>

When the `ChatRoom` component above gets added to the page, it will connect to the chat room with the initial `serverUrl` and `roomId`. If either `serverUrl` or `roomId` change as a result of a re-render (say, if the user picks a different chat room in a dropdown), your Effect will *disconnect from the previous room, and connect to the next one.* When the `ChatRoom` component is removed from the page, your Effect will disconnect one last time.
<Trans>위의 `ChatRoom` 컴포넌트가 페이지에 추가되면 초기 `serverUrl` 및 `roomId`로 채팅방에 연결됩니다. 다시 렌더링한 결과 `serverUrl` 또는 `roomId`가 변경되면(예: 사용자가 드롭다운에서 다른 채팅방을 선택하는 경우) Effect는 이전 채팅방과의 *연결을 끊고* 다음 채팅방에 연결합니다. `ChatRoom` 컴포넌트가 페이지에서 제거되면 Effect는 마지막으로 연결을 끊습니다.</Trans>

**To [help you find bugs,](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) in development React runs <CodeStep step={1}>setup</CodeStep> and <CodeStep step={2}>cleanup</CodeStep> one extra time before the <CodeStep step={1}>setup</CodeStep>.** This is a stress-test that verifies your Effect's logic is implemented correctly. If this causes visible issues, your cleanup function is missing some logic. The cleanup function should stop or undo whatever the setup function was doing. The rule of thumb is that the user shouldn't be able to distinguish between the setup being called once (as in production) and a *setup* → *cleanup* → *setup* sequence (as in development). [See common solutions.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)
<Trans>[버그를 찾는 데 도움](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)을 주기 위해 **개발 환경에서 React는 <CodeStep step={1}>실제 셋업</CodeStep> 전에 <CodeStep step={1}>셋업</CodeStep> 및 <CodeStep step={2}>클린업</CodeStep>을 한 번 더 실행합니다.** 이는 Effect의 로직이 올바르게 구현되었는지 확인하는 스트레스 테스트입니다. 이로 인해 눈에 보이는 문제가 발생하면 클린업 함수에 일부 로직이 누락된 것입니다. 클린업 함수는 셋업 함수가 수행하던 작업을 중지하거나 취소해야 합니다. 사용자 경험상 상용에서 셋업이 한 번 호출되는 것과, 개발 환경에서 셋업 → 클린업 → 셋업 순서로 호출되는 것을 구분할 수 없어야 합니다. [일반적인 해결 방법](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)을 참고하세요.</Trans>

**Try to [write every Effect as an independent process](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) and [think about a single setup/cleanup cycle at a time.](/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective)** It shouldn't matter whether your component is mounting, updating, or unmounting. When your cleanup logic correctly "mirrors" the setup logic, your Effect is resilient to running setup and cleanup as often as needed.
<Trans>**[모든 Effect를 독립적인 프로세스로 작성하고](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) [한 번에 하나의 셋업/클린업 주기만 생각하세요.](/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective)** 컴포넌트가 마운트, 업데이트, 마운트 해제 중 어느 단계에 있는지는 중요하지 않습니다. 클린업 로직이 셋업 로직을 올바르게 '미러링'하고 있다면, 필요한 만큼 자주 셋업과 클린업을 실행하더라도 Effect는 탄력적으로 작동합니다.</Trans>

<Note>
An Effect lets you [keep your component synchronized](/learn/synchronizing-with-effects) with some external system (like a chat service). Here, *external system* means any piece of code that's not controlled by React, such as:
<Trans>Effect를 사용하면 컴포넌트를 외부 시스템(예: 채팅 서비스)과 [동기화를 유지](/learn/synchronizing-with-effects)할 수 있습니다. 여기서 *외부 시스템*이란 React로 제어되지 않는 코드 조각을 의미합니다:</Trans>

* A timer managed with <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)</CodeStep> and <CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)</CodeStep>.
* An event subscription using <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)</CodeStep> and <CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)</CodeStep>.
* A third-party animation library with an API like <CodeStep step={1}>`animation.start()`</CodeStep> and <CodeStep step={2}>`animation.reset()`</CodeStep>.

<TransBlock>
* <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)</CodeStep> 및 <CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)</CodeStep>로 관리되는 타이머.
* <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)</CodeStep> 및 <CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)</CodeStep>를 사용하는 이벤트 구독.
* <CodeStep step={1}>`animation.start()`</CodeStep> 및 <CodeStep step={2}>`animation.reset()`</CodeStep>과 같은 API가 있는 타사 애니메이션 라이브러리.
</TransBlock>

**If you're not connecting to any external system, [you probably don't need an Effect.](/learn/you-might-not-need-an-effect)**
**외부 시스템에 연결하지 않는다면 [Effect가 필요하지 않을 수도 있습니다](/learn/you-might-not-need-an-effect).**
</Note>

<Recipes titleText="Examples of connecting to an external system" titleId="examples-connecting" translatedTitle="외부시스템에 연결하는 예시">

#### Connecting to a chat server<Trans>채팅 서버에 연결하기</Trans> {/*connecting-to-a-chat-server*/}

In this example, the `ChatRoom` component uses an Effect to stay connected to an external system defined in `chat.js`. Press "Open chat" to make the `ChatRoom` component appear. This sandbox runs in development mode, so there is an extra connect-and-disconnect cycle, as [explained here.](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) Try changing the `roomId` and `serverUrl` using the dropdown and the input, and see how the Effect re-connects to the chat. Press "Close chat" to see the Effect disconnect one last time.
<Trans>이 예제에서 `ChatRoom` 컴포넌트는 Effect를 사용하여 chat.js에 정의된 외부 시스템에 연결 상태를 유지합니다. "채팅 열기"를 누르면 `ChatRoom` 컴포넌트가 나타납니다. 이 샌드박스는 개발 모드에서 실행되므로 [여기에 설명된 대로](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) 추가 연결 및 연결 해제 주기가 있습니다. 드롭다운과 인풋을 사용하여 `roomId` 및 `serverUrl`을 변경하고 Effect가 채팅에 어떻게 다시 연결되는지 확인합니다. "채팅 닫기"를 누르면 Effect가 마지막으로 연결이 끊어지는 것을 확인할 수 있습니다.</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
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

<Solution />

#### Listening to a global browser event<Trans>전역 브라우저 이벤트 수신하기</Trans> {/*listening-to-a-global-browser-event*/}

In this example, the external system is the browser DOM itself. Normally, you'd specify event listeners with JSX, but you can't listen to the global [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) object this way. An Effect lets you connect to the `window` object and listen to its events. Listening to the `pointermove` event lets you track the cursor (or finger) position and update the red dot to move with it.
<Trans>이 예제에서 외부 시스템은 브라우저 DOM 자체입니다. 일반적으로 JSX로 이벤트 리스너를 지정하지만, 이런 방식으로는 전역 [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) 객체를 수신할 수 없습니다. Effect를 사용하면 `window` 객체에 연결하여 해당 이벤트를 수신할 수 있습니다. `pointermove`  이벤트를 수신하면 커서(또는 손가락) 위치를 추적하고 빨간색 점이 함께 이동하도록 업데이트할 수 있습니다.</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
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
  );
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Triggering an animation<Trans>애니메이션 촉발하기</Trans> {/*triggering-an-animation*/}

In this example, the external system is the animation library in `animation.js`. It provides a JavaScript class called `FadeInAnimation` that takes a DOM node as an argument and exposes `start()` and `stop()` methods to control the animation. This component [uses a ref](/learn/manipulating-the-dom-with-refs) to access the underlying DOM node. The Effect reads the DOM node from the ref and automatically starts the animation for that node when the component appears.
<Trans>이 예시에서 외부 시스템은 `animation.js`의 애니메이션 라이브러리입니다. 이 라이브러리는 DOM 노드를 인자로 받고 애니메이션을 제어하는 `start()` 및 `stop()` 메서드를 노출하는 `FadeInAnimation`이라는 JavaScript 클래스를 제공합니다. 이 컴포넌트는 [ref를 사용하여](/learn/manipulating-the-dom-with-refs) 기본 DOM 노드에 액세스합니다. Effect는 ref에서 DOM 노드를 읽고 컴포넌트가 나타나면 해당 노드에 대한 애니메이션을 자동으로 시작합니다.</Trans>

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(1000);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Jump to end immediately
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Start animating
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // We still have more frames to paint
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

<Solution />

#### Controlling a modal dialog<Trans>모달 제어하기</Trans> {/*controlling-a-modal-dialog*/}

In this example, the external system is the browser DOM. The `ModalDialog` component renders a [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) element. It uses an Effect to synchronize the `isOpen` prop to the [`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) and [`close()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close) method calls.
<Trans>이 예시에서 외부 시스템은 브라우저 DOM입니다. `ModalDialog` 컴포넌트는 [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) 엘리먼트를 렌더링합니다. 이 컴포넌트는 Effect를 사용해 `isOpen` prop를 [`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) 및 [`close()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close) 메서드 호출에 동기화합니다.</Trans>
<Sandpack>

```js
import { useState } from 'react';
import ModalDialog from './ModalDialog.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Open dialog
      </button>
      <ModalDialog isOpen={show}>
        Hello there!
        <br />
        <button onClick={() => {
          setShow(false);
        }}>Close</button>
      </ModalDialog>
    </>
  );
}
```

```js ModalDialog.js active
import { useEffect, useRef } from 'react';

export default function ModalDialog({ isOpen, children }) {
  const ref = useRef();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, [isOpen]);

  return <dialog ref={ref}>{children}</dialog>;
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Tracking element visibility<Trans>엘리먼트의 가시성 추적하기</Trans> {/*tracking-element-visibility*/}

In this example, the external system is again the browser DOM. The `App` component displays a long list, then a `Box` component, and then another long list. Scroll the list down. Notice that when the `Box` component appears in the viewport, the background color changes to black. To implement this, the `Box` component uses an Effect to manage an [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). This browser API notifies you when the DOM element is visible in the viewport.
<Trans>이 예시에서 외부 시스템은 다시 브라우저 DOM입니다. `App` 컴포넌트는 긴 목록을 표시한 다음 `Box` 컴포넌트를 표시하고, 그 다음에는 또 다른 긴 목록을 표시합니다. 목록을 아래로 스크롤 해보세요. `Box` 컴포넌트가 뷰포트에 나타나면 배경색이 검은색으로 변경되는 것을 알 수 있습니다. 이를 구현하기 위해 `Box` 컴포넌트는 Effect를 사용해 [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)를 관리합니다. 이 브라우저 API는 DOM 요소가 뷰포트에 표시되면 사용자에게 알려줍니다.</Trans>

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js Box.js active
import { useRef, useEffect } from 'react';

export default function Box() {
  const ref = useRef(null);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
      } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
      }
    });
    observer.observe(div, {
      threshold: 1.0
    });
    return () => {
      observer.disconnect();
    }
  }, []);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Wrapping Effects in custom Hooks<Trans>커스텀 훅으로 Effect 감싸기</Trans> {/*wrapping-effects-in-custom-hooks*/}

Effects are an ["escape hatch":](/learn/escape-hatches) you use them when you need to "step outside React" and when there is no better built-in solution for your use case. If you find yourself often needing to manually write Effects, it's usually a sign that you need to extract some [custom Hooks](/learn/reusing-logic-with-custom-hooks) for common behaviors your components rely on.
<Trans>Effect는 ["탈출구"](/learn/escape-hatches)입니다: "React를 벗어나야 할 때", 또는 더 나은 빌트인 솔루션이 없을 때 사용합니다. Effect를 수동으로 작성해야 하는 경우가 자주 발생한다면 이는 컴포넌트가 의존하는 일반적인 동작에 대한 [커스텀 훅](/learn/reusing-logic-with-custom-hooks)을 추출해야 한다는 신호일 수 있습니다.</Trans>

For example, this `useChatRoom` custom Hook "hides" the logic of your Effect behind a more declarative API:
<Trans>예를 들어, 이 `useChatRoom` 커스텀 훅은 Effect의 로직을 보다 선언적인 API 뒤에 "숨깁니다":</Trans>

```js {1,11}
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Then you can use it from any component like this:
<Trans>그러면 모든 컴포넌트에서 이와 같이 사용할 수 있습니다:</Trans>

```js {4-7}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

There are also many excellent custom Hooks for every purpose available in the React ecosystem.
<Trans>이밖에도 React 생태계에는 다양한 목적에 맞는 훌륭한 커스텀 훅이 많이 있습니다.</Trans>

[Learn more about wrapping Effects in custom Hooks.](/learn/reusing-logic-with-custom-hooks)
<Trans>[커스텀 훅으로 Effect 감싸기에 대해 자세히 알아보기](/learn/reusing-logic-with-custom-hooks)</Trans>

<Recipes titleText="Examples of wrapping Effects in custom Hooks" titleId="examples-custom-hooks" translatedTitle=" Effect를 커스텀 훅으로 감싸는 예시">

#### Custom `useChatRoom` Hook<Trans>커스텀 `useChatRoom` 훅</Trans> {/*custom-usechatroom-hook*/}

This example is identical to one of the [earlier examples,](#examples-connecting) but the logic is extracted to a custom Hook.
<Trans>이 예제는 [이전 예제](#examples-connecting) 중 하나와 동일하지만 로직을 커스텀 훅으로 추출했습니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

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

```js useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);
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

<Solution />

#### Custom `useWindowListener` Hook<Trans>커스텀 `useWindowListener` 훅</Trans> {/*custom-usewindowlistener-hook*/}

This example is identical to one of the [earlier examples,](#examples-connecting) but the logic is extracted to a custom Hook.
<Trans>이 예제는 [이전 예제](#examples-connecting) 중 하나와 동일하지만 로직을 커스텀 훅으로 추출했습니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';
import { useWindowListener } from './useWindowListener.js';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useWindowListener('pointermove', (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return (
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
  );
}
```

```js useWindowListener.js
import { useState, useEffect } from 'react';

export function useWindowListener(eventType, listener) {
  useEffect(() => {
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Custom `useIntersectionObserver` Hook<Trans>커스텀 `useIntersectionObserver` 훅</Trans> {/*custom-useintersectionobserver-hook*/}

This example is identical to one of the [earlier examples,](#examples-connecting) but the logic is partially extracted to a custom Hook.
<Trans>이 예제는 [이전 예제](#examples-connecting) 중 하나와 동일하지만 로직 일부를 커스텀 훅으로 추출했습니다.</Trans>

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js Box.js active
import { useRef, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver.js';

export default function Box() {
  const ref = useRef(null);
  const isIntersecting = useIntersectionObserver(ref);

  useEffect(() => {
   if (isIntersecting) {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

```js useIntersectionObserver.js
import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);
    });
    observer.observe(div, {
      threshold: 1.0
    });
    return () => {
      observer.disconnect();
    }
  }, [ref]);

  return isIntersecting;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Controlling a non-React widget<Trans>리액트가 아닌 위젯 제어하기</Trans> {/*controlling-a-non-react-widget*/}

Sometimes, you want to keep an external system synchronized to some prop or state of your component.
<Trans>외부 시스템을 컴포넌트의 특정 prop이나 state와 동기화하고 싶을 때가 있습니다.</Trans>

For example, if you have a third-party map widget or a video player component written without React, you can use an Effect to call methods on it that make its state match the current state of your React component. This Effect creates an instance of a `MapWidget` class defined in `map-widget.js`. When you change the `zoomLevel` prop of the `Map` component, the Effect calls the `setZoom()` on the class instance to keep it synchronized:
<Trans>예를 들어, React 없이 작성된 타사 맵 위젯이나 비디오 플레이어 컴포넌트가 있는 경우, Effect를 사용하여 해당 state를 React 컴포넌트의 현재 state와 일치시키는 메서드를 호출할 수 있습니다. 이 Effect는 `map-widget.js`에 정의된 `MapWidget` 클래스의 인스턴스를 생성합니다. `Map` 컴포넌트의 `zoomLevel` prop을 변경하면 Effect는 클래스 인스턴스에서 `setZoom()`을 호출하여 동기화 상태를 유지합니다:</Trans>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { useState } from 'react';
import Map from './Map.js';

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(0);
  return (
    <>
      Zoom level: {zoomLevel}x
      <button onClick={() => setZoomLevel(zoomLevel + 1)}>+</button>
      <button onClick={() => setZoomLevel(zoomLevel - 1)}>-</button>
      <hr />
      <Map zoomLevel={zoomLevel} />
    </>
  );
}
```

```js Map.js active
import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.js';

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: 200, height: 200 }}
      ref={containerRef}
    />
  );
}
```

```js map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export class MapWidget {
  constructor(domNode) {
    this.map = L.map(domNode, {
      zoomControl: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      zoomAnimation: false,
      touchZoom: false,
      zoomSnap: 0.1
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.map.setView([0, 0], 0);
  }
  setZoom(level) {
    this.map.setZoom(level);
  }
}
```

```css
button { margin: 5px; }
```

</Sandpack>

In this example, a cleanup function is not needed because the `MapWidget` class manages only the DOM node that was passed to it. After the `Map` React component is removed from the tree, both the DOM node and the `MapWidget` class instance will be automatically garbage-collected by the browser JavaScript engine.
<Trans>이 예제에서는 `MapWidget` 클래스가 자신에게 전달된 DOM 노드만 관리하기 때문에 클린업 함수가 필요하지 않습니다. `Map` React 컴포넌트가 트리에서 제거된 후, DOM 노드와 `MapWidget` 클래스 인스턴스는 브라우저 자바스크립트 엔진에 의해 자동으로 가비지컬렉팅 됩니다.</Trans>

---

### Fetching data with Effects<Trans>Effect로 데이터 페칭하기</Trans> {/*fetching-data-with-effects*/}

You can use an Effect to fetch data for your component. Note that [if you use a framework,](/learn/start-a-new-react-project#production-grade-react-frameworks) using your framework's data fetching mechanism will be a lot more efficient than writing Effects manually.
<Trans>Effect를 사용하여 컴포넌트에 대한 데이터를 페치할 수 있습니다. [프레임워크를 사용하는 경우](/learn/start-a-new-react-project#production-grade-react-frameworks), 프레임워크의 데이터 페칭 메커니즘을 사용하는 것이 Effects를 수동으로 작성하는 것보다 훨씬 효율적이라는 점에 유의하세요.</Trans>

If you want to fetch data from an Effect manually, your code might look like this:
<Trans>Effect에서 데이터를 수동으로 페치하려는 경우 코드는 다음과 같을 수 있습니다:</Trans>

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [person]);

  // ...
```

Note the `ignore` variable which is initialized to `false`, and is set to `true` during cleanup. This ensures [your code doesn't suffer from "race conditions":](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) network responses may arrive in a different order than you sent them.
<Trans>`ignore` 변수는 `false`로 초기화되고 클린업 중에 `true`로 설정됩니다. 이렇게 하면 네트워크 응답이 보낸 순서와 다른 순서로 도착하더라도 [’조건 경합'이 발생하지 않습니다](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)</Trans>

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

You can also rewrite using the [`async` / `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) syntax, but you still need to provide a cleanup function:
<Trans>[`async` / `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) 구문을 사용하여 다시 작성할 수도 있지만, 그렇더라도 여전히 클린업 함수는 제공해야 합니다:</Trans>

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    async function startFetching() {
      setBio(null);
      const result = await fetchBio(person);
      if (!ignore) {
        setBio(result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

Writing data fetching directly in Effects gets repetitive and makes it difficult to add optimizations like caching and server rendering later. [It's easier to use a custom Hook--either your own or maintained by the community.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)
<Trans>Effects에서 직접 데이터를 페칭하는 작업을 반복적으로 작성하면 나중에 캐싱 및 서버 렌더링과 같은 최적화를 추가하기가 어려워집니다. [직접 만들거나 커뮤니티에서 유지 관리하는 커스텀 훅을 사용하는 것이 더 쉽습니다.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)</Trans>

<DeepDive>

#### What are good alternatives to data fetching in Effects?<Trans>Effect에서 데이터 페칭하는 것을 대체할 좋은 대안은 무엇인가요?</Trans> {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Writing `fetch` calls inside Effects is a [popular way to fetch data](https://www.robinwieruch.de/react-hooks-fetch-data/), especially in fully client-side apps. This is, however, a very manual approach and it has significant downsides:
<Trans>Effect 내부에 `fetch`를 작성하는것은 [데이터를 페치](https://www.robinwieruch.de/react-hooks-fetch-data/)하는 인기있는 방법으로, 완전한 client-side 앱에서 특히 그렇습니다. 하지만 이는 매우 수동적인 접근 방식이며 상당한 단점이 있습니다:</Trans>

- **Effects don't run on the server.** This means that the initial server-rendered HTML will only include a loading state with no data. The client computer will have to download all JavaScript and render your app only to discover that now it needs to load the data. This is not very efficient.
<Trans>**이펙트는 서버에서 실행되지 않습니다.** 즉, 서버에서 렌더링되는 초기 HTML에는 데이터가 없는 로딩 state만 포함됩니다. 클라이언트 컴퓨터는 모든 JavaScript를 다운로드하고 앱을 렌더링해야만 이제 데이터를 로드해야 한다는 것을 알 수 있습니다. 이는 매우 효율적이지 않습니다.</Trans>

- **Fetching directly in Effects makes it easy to create "network waterfalls".** You render the parent component, it fetches some data, renders the child components, and then they start fetching their data. If the network is not very fast, this is significantly slower than fetching all data in parallel.
<Trans>**Effect에서 직접 페칭하면 "네트워크 워터폴"을 만들기 쉽습니다.** 부모 컴포넌트를 렌더링하면 일부 데이터를 페치하고, 자식 컴포넌트를 렌더링하면 자식 컴포넌트가 데이터를 페칭하기 시작합니다. 네트워크가 매우 빠르지 않는 한 모든 데이터를 병렬로 페칭하는 것보다 훨씬 느립니다.</Trans>

- **Fetching directly in Effects usually means you don't preload or cache data.** For example, if the component unmounts and then mounts again, it would have to fetch the data again.
<Trans>**Effects에서 직접 페칭한다는 것은 일반적으로 데이터를 데이터를 미리 로드하거나 캐시하지 않는다는 의미입니다.** 예를 들어, 컴포넌트가 마운트를 해제했다가 다시 마운트하면 데이터를 다시 가져와야 합니다.</Trans>

- **It's not very ergonomic.** There's quite a bit of boilerplate code involved when writing `fetch` calls in a way that doesn't suffer from bugs like [race conditions.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)
<Trans>**인체 공학적으로 좋지 않습니다.** [조건 경합](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)과 같은 버그가 발생하지 않는 방식으로 `fetch` 호출을 작성하려면 상용구 코드가 상당히 많이 필요합니다.</Trans>

This list of downsides is not specific to React. It applies to fetching data on mount with any library. Like with routing, data fetching is not trivial to do well, so we recommend the following approaches:
<Trans>이러한 단점들은 React에만 국한된 것은 아닙니다. 마운트 시점의 데이터 페칭에 대해서는 어떤 라이브러리에서나 마찬가지입니다. 라우팅과 마찬가지로 데이터 페칭도 제대로 수행하기가 쉽지 않으므로 다음과 같은 접근 방식을 권장합니다:</Trans>

- **If you use a [framework](/learn/start-a-new-react-project#production-grade-react-frameworks), use its built-in data fetching mechanism.** Modern React frameworks have integrated data fetching mechanisms that are efficient and don't suffer from the above pitfalls.
<Trans>**[framework](/learn/start-a-new-react-project#production-grade-react-frameworks)를 사용하는 경우, 프레임워크 빌트인 데이터 페칭 메커니즘을 사용하세요.** 최신 React 프레임워크는 효율적이고 위의 함정이 발생하지 않는 통합 데이터 페칭 메커니즘을 갖추고 있습니다.</Trans>

- **Otherwise, consider using or building a client-side cache.** Popular open source solutions include [React Query](https://react-query.tanstack.com/), [useSWR](https://swr.vercel.app/), and [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) You can build your own solution too, in which case you would use Effects under the hood but also add logic for deduplicating requests, caching responses, and avoiding network waterfalls (by preloading data or hoisting data requirements to routes).
<Trans>**그게 아니라면 clinet-side 캐시를 사용하거나 구축하는 것을 고려하세요.** 인기있는 오픈 소스 솔루션으로는 [React Query](https://react-query.tanstack.com/), [useSWR](https://swr.vercel.app/), [React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview) 등이 있습니다. 자체 솔루션을 구축할 수도 있는데, 이 경우 내부적으로는 Effect를 사용하되 요청 중복 제거, 응답 캐시, 네트워크 워터폴 방지(데이터를 미리 로드하거나 라우트에 데이터 요구 사항을 올려서) 논리를 추가할 수 있습니다.</Trans>

You can continue fetching data directly in Effects if neither of these approaches suit you.
<Trans>위의 접근방법들이 만족스럽지 않다면 원래대로 Effect에서 직접 데이터를 페칭해도 괜찮습니다.</Trans>

</DeepDive>

---

### Specifying reactive dependencies<Trans>반응형 의존성 지정</Trans> {/*specifying-reactive-dependencies*/}

**Notice that you can't "choose" the dependencies of your Effect.** Every <CodeStep step={2}>reactive value</CodeStep> used by your Effect's code must be declared as a dependency. Your Effect's dependency list is determined by the surrounding code:
<Trans>**Effect의 의존성을 "선택"할 수 없다는 점에 유의하세요.** Effect의 코드에서 사용되는 모든 <CodeStep step={2}>반응형 값</CodeStep>은 의존성으로 선언해야 합니다. Effect의 의존성 목록은 주변 코드에 의해 결정됩니다:</Trans>

```js [[2, 1, "roomId"], [2, 2, "serverUrl"], [2, 5, "serverUrl"], [2, 5, "roomId"], [2, 8, "serverUrl"], [2, 8, "roomId"]]
function ChatRoom({ roomId }) { // This is a reactive value
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // This is a reactive value too

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads these reactive values
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ So you must specify them as dependencies of your Effect
  // ...
}
```

If either `serverUrl` or `roomId` change, your Effect will reconnect to the chat using the new values.
<Trans>`serverUrl` 또는 `roomId`가 변경되면 Effect는 새 값을 사용하여 채팅에 다시 연결합니다.</Trans>

**[Reactive values](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) include props and all variables and functions declared directly inside of your component.** Since `roomId` and `serverUrl` are reactive values, you can't remove them from the dependencies. If you try to omit them and [your linter is correctly configured for React,](/learn/editor-setup#linting) the linter will flag this as a mistake you need to fix:
<Trans>**[반응형 값](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)에는 props와 컴포넌트 내부에서 직접 선언된 모든 변수, 함수가 포함됩니다.** `roomId`와 `serverUrl`은 반응형 값이기 때문에 의존성 목록에서 제거할 수 없습니다. 만약 이 값을 생략하려고 할 때 [린터가 React 용으로 올바르게 구성되어 있다면,](/learn/editor-setup#linting) 린터는 이를 수정해야 하는 실수로 표시해 줍니다:</Trans>

```js {8}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has missing dependencies: 'roomId' and 'serverUrl'
  // ...
}
```

**To remove a dependency, you need to ["prove" to the linter *doesn't need* to be a dependency.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)** For example, you can move `serverUrl` out of your component to prove that it's not reactive and won't change on re-renders:
<Trans>**의존성을 제거하려면, [의존성이어야 할 필요가 없음을 린터에게 "증명"해야 합니다.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)** 예를 들어 `serverUrl`을 컴포넌트 밖으로 이동시킴으로써 반응형이 아니며 리렌더링시에도 변경되지 않음을 증명할 수 있습니다:</Trans>

```js {1,8}
const serverUrl = 'https://localhost:1234'; // Not a reactive value anymore

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

Now that `serverUrl` is not a reactive value (and can't change on a re-render), it doesn't need to be a dependency. **If your Effect's code doesn't use any reactive values, its dependency list should be empty (`[]`):**
<Trans>이제 `serverUrl`은 반응형 값이 아니므로(그리고 다시 렌더링할 때 변경할 수 없으므로) 의존성이 될 필요가 없습니다. **Effect의 코드가 반응형 값을 사용하지 않는다면 의존성 목록은 비어 있어야 합니다(`[]`):**</Trans>

```js {1,2,9}
const serverUrl = 'https://localhost:1234'; // Not a reactive value anymore
const roomId = 'music'; // Not a reactive value anymore

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
}
```

[An Effect with empty dependencies](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) doesn't re-run when any of your component's props or state change.
<Trans>[빈 의존성이 있는 Effect](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means)는 컴포넌트의 props나 state가 변경되어도 다시 실행되지 않습니다.</Trans>

<Pitfall>

If you have an existing codebase, you might have some Effects that suppress the linter like this:
<Trans>기존 코드베이스가 있는 경우 이와 같이 린터를 억제하는 Effect가 있을 수 있습니다:</Trans>

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**When dependencies don't match the code, there is a high risk of introducing bugs.** By suppressing the linter, you "lie" to React about the values your Effect depends on. [Instead, prove they're unnecessary.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)
<Trans>**의존성이 코드와 일치하지 않으면 버그가 발생할 위험이 높습니다.** 린터를 억제하는 것은 곧 Effect가 의존하는 값에 대해 React에 "거짓말"을 하는 것입니다. [대신 의존성들이 불필요하다는 것을 증명하세요.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)</Trans>

</Pitfall>

<Recipes titleText="Examples of passing reactive dependencies" titleId="examples-dependencies" translatedTitle="반응형 의존성 전달 예시">

#### Passing a dependency array<Trans>의존성 배열 전달하기</Trans> {/*passing-a-dependency-array*/}

If you specify the dependencies, your Effect runs **after the initial render _and_ after re-renders with changed dependencies.**
<Trans>의존성을 지정하면 Effect는 **초기 렌더링 후 _및_ 변경된 의존성으로 다시 렌더링한 후에** 실행됩니다.</Trans>

```js {3}
useEffect(() => {
  // ...
}, [a, b]); // Runs again if a or b are different
```

In the below example, `serverUrl` and `roomId` are [reactive values,](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) so they both must be specified as dependencies. As a result, selecting a different room in the dropdown or editing the server URL input causes the chat to re-connect. However, since `message` isn't used in the Effect (and so it isn't a dependency), editing the message doesn't re-connect to the chat.
<Trans>아래 예시에서 `serverUrl`과 `roomId`는 [반응형 값](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)이므로 둘 다 의존성으로 지정해야 합니다. 따라서 드롭다운에서 다른 방을 선택하거나 서버 URL 입력을 수정하면 채팅이 다시 연결됩니다. 하지만 `message`는 Effect에서 사용되지 않으므로(따라서 의존성이 아니므로) 메시지를 편집해도 채팅에 다시 연결되지 않습니다.</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

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
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
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
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
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
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Passing an empty dependency array<Trans>빈 의존성 배열 전달하기</Trans> {/*passing-an-empty-dependency-array*/}

If your Effect truly doesn't use any reactive values, it will only run **after the initial render.**
<Trans>Effect가 실제로 반응형 값을 사용하지 않는 경우, **초기 렌더링 이후**에만 실행됩니다.</Trans>

```js {3}
useEffect(() => {
  // ...
}, []); // Does not run again (except once in development)
```

**Even with empty dependencies, setup and cleanup will [run one extra time in development](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) to help you find bugs.**
<Trans>**의존성이 비어 있더라도 개발환경에서는 버그를 찾는 데 도움이 되기 위해 셋업 및 클린업이 [한 번 더 실행](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)됩니다.**</Trans>


In this example, both `serverUrl` and `roomId` are hardcoded. Since they're declared outside the component, they are not reactive values, and so they aren't dependencies. The dependency list is empty, so the Effect doesn't re-run on re-renders.
<Trans>이 예시에서는 `serverUrl` 과 `roomId`가 모두 하드코딩되어 있습니다. 두 값 모두 컴포넌트 외부에서 선언되었으므로 반응형 값이 아니며 따라서 의존성이 아닙니다. 의존성 목록이 비어 있으므로 리렌더링시에 Effect는 다시 실행되지 않습니다.</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
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

</Sandpack>

<Solution />


#### Passing no dependency array at all<Trans>아예 의존성 배열을 전달하지 않기</Trans> {/*passing-no-dependency-array-at-all*/}

If you pass no dependency array at all, your Effect runs **after every single render (and re-render)** of your component.
<Trans>의존성 배열 자체를 전달하지 않으면, 컴포넌트의 **모든 렌더링(및 리렌더링) 후**마다 Effect가 실행됩니다.</Trans>

```js {3}
useEffect(() => {
  // ...
}); // Always runs again
```

In this example, the Effect re-runs when you change `serverUrl` and `roomId`, which is sensible. However, it *also* re-runs when you change the `message`, which is probably undesirable. This is why usually you'll specify the dependency array.
<Trans>이 예제에서는 `serverUrl` 및 `roomId`를 변경할 때 Effect가 다시 실행된다는 면에서는 바람직합니다. 그러나 `message`를 변경할 때*에도* 매 번 다시 실행된다는건 좋지 않을 수 있습니다. 이것이 일반적으로 의존성 배열을 지정하는 이유입니다.</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }); // No dependency array at all

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
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
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
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
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
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Updating state based on previous state from an Effect<Trans>Effect의 이전 state를 기반으로 state 업데이트하기</Trans> {/*updating-state-based-on-previous-state-from-an-effect*/}

When you want to update state based on previous state from an Effect, you might run into a problem:
<Trans>Effect의 이전 state를 기반으로 state를 업데이트하려는 경우 문제가 발생할 수 있습니다:</Trans>

```js {6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // You want to increment the counter every second...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... but specifying `count` as a dependency always resets the interval.
  // ...
}
```

Since `count` is a reactive value, it must be specified in the list of dependencies. However, that causes the Effect to cleanup and setup again every time the `count` changes. This is not ideal. 
<Trans>`count`는 반응형 값이므로 의존성 목록에 지정되어야 합니다. 다만 이로 인해 `count`가 변경될 때마다 Effect를 다시 클린업하고 셋업해줘야 합니다. 이는 이상적이지 않습니다.</Trans>

To fix this, [pass the `c => c + 1` state updater](/reference/react/useState#updating-state-based-on-the-previous-state) to `setCount`:
<Trans>이 문제를 해결하려면 `setCount`에 [`c => c + 1` state 업데이터를 전달하세요](/reference/react/useState#updating-state-based-on-the-previous-state):</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ Pass a state updater
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ Now count is not a dependency

  return <h1>{count}</h1>;
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

Now that you're passing `c => c + 1` instead of `count + 1`, [your Effect no longer needs to depend on `count`.](/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state) As a result of this fix, it won't need to cleanup and setup the interval again every time the `count` changes.
<Trans>이제 `count + 1`대신 `c => c + 1`을 전달하므로 [Effect는 더 이상 `count`에 의존할 필요가 없습니다.](/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state) 이 수정으로 `count`가 변경될 때마다 interval을 다시 클린업하고 셋업할 필요가 없습니다.</Trans>

---


### Removing unnecessary object dependencies<Trans>불필요한 객체 의존성 제거하기</Trans> {/*removing-unnecessary-object-dependencies*/}

If your Effect depends on an object or a function created during rendering, it might run too often. For example, this Effect re-connects after every render because the `options` object is [different for every render:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)
<Trans>Effect가 렌더링 중에 생성된 객체 또는 함수에 의존하는 경우 필요 이상으로 자주 실행될 수 있습니다. 예를 들어 `options` 객체는 [각 렌더링마다 다른 값이므로](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally), 이 Effect는 매 렌더링시에 다시 연결하게 됩니다:</Trans>

```js {6-9,12,15}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 This object is created from scratch on every re-render
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // It's used inside the Effect
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🚩 As a result, these dependencies are always different on a re-render
  // ...
```

Avoid using an object created during rendering as a dependency. Instead, create the object inside the Effect:
<Trans>렌더링 중에 생성된 객체를 의존성으로 사용하지 마세요. 대신 Effect 내에서 객체를 생성하세요:</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
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
export function createConnection({ serverUrl, roomId }) {
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

Now that you create the `options` object inside the Effect, the Effect itself only depends on the `roomId` string.
<Trans>이제 Effect 내부에 `options` 객체를 만들었으므로 Effect는 오직 `roomId` 문자열에만 의존하게 되었습니다.</Trans>

With this fix, typing into the input doesn't reconnect the chat. Unlike an object which gets re-created, a string like `roomId` doesn't change unless you set it to another value. [Read more about removing dependencies.](/learn/removing-effect-dependencies)
<Trans>이 수정 덕에 input에 타이핑해도 채팅이 다시 연결되지 않습니다. 다시 만들어지는 객체와 달리 `roomId` 와 같은 문자열은 다른 값으로 설정하지 않는 한 변경되지 않습니다. [의존성 제거에 대해 자세히 알아보세요.](/learn/removing-effect-dependencies)</Trans>

---

### Removing unnecessary function dependencies<Trans>불필요한 함수 의존성 제거하기</Trans> {/*removing-unnecessary-function-dependencies*/}

If your Effect depends on an object or a function created during rendering, it might run too often. For example, this Effect re-connects after every render because the `createOptions` function is [different for every render:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)
<Trans>Effect가 렌더링 중에 생성된 객체 또는 함수에 의존하는 경우 필요 이상으로 자주 실행될 수 있습니다. 예를 들어, `createOptions` 함수가 [렌더링할 때마다 다르기 때문에](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally) 이 Effect는 렌더링할 때마다 다시 연결됩니다:</Trans>

```js {4-9,12,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 This function is created from scratch on every re-render
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // It's used inside the Effect
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🚩 As a result, these dependencies are always different on a re-render
  // ...
```

By itself, creating a function from scratch on every re-render is not a problem. You don't need to optimize that. However, if you use it as a dependency of your Effect, it will cause your Effect to re-run after every re-render.
<Trans>렌더링할 때마다 함수를 처음부터 새로 만드는 것 자체는 문제가 되지 않습니다. 최적화할 필요도 없습니다. 그러나 이 함수를 Effect의 의존성으로 사용하면 Effect가 다시 렌더링할 때마다 다시 실행됩니다.</Trans>

Avoid using a function created during rendering as a dependency. Instead, declare it inside the Effect:
<Trans>렌더링 중에 생성된 함수를 의존성으로 사용하지 마세요. 대신 Effect 내에서 선언하세요:</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
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
export function createConnection({ serverUrl, roomId }) {
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

Now that you define the `createOptions` function inside the Effect, the Effect itself only depends on the `roomId` string. With this fix, typing into the input doesn't reconnect the chat. Unlike a function which gets re-created, a string like `roomId` doesn't change unless you set it to another value. [Read more about removing dependencies.](/learn/removing-effect-dependencies)
<Trans>이제 Effect 내에서 `createOptions` 함수를 정의하면 Effect 자체는 `roomId` 문자열에만 의존합니다. 이 수정으로 input에 타이핑해도 채팅이 다시 연결되지 않습니다. 새로 생성되는 함수와 달리 `roomId`와 같은 문자열은 다른 값으로 설정하지 않는 한 변경되지 않습니다. [의존성 제거에 대해 더 자세히 알아보세요.](/learn/removing-effect-dependencies)</Trans>

---

### Reading the latest props and state from an Effect<Trans>Effect에서 최신 props 및 state 읽기</Trans> {/*reading-the-latest-props-and-state-from-an-effect*/}

<Wip>

This section describes an **experimental API that has not yet been released** in a stable version of React.
<Trans>이 섹션에서는 아직 안정된 버전의 React로 **출시되지 않은 실험적인 API**에 대해 설명합니다.</Trans>

</Wip>

By default, when you read a reactive value from an Effect, you have to add it as a dependency. This ensures that your Effect "reacts" to every change of that value. For most dependencies, that's the behavior you want.
<Trans>기본적으로 Effect에서 반응형 값을 읽을 때엔 이를 의존성으로 추가해야 합니다. 이렇게 하면 Effect가 해당 값의 모든 변경에 "반응"하도록 할 수 있습니다. 대부분의 의존성에서 원하는 동작입니다.</Trans>

**However, sometimes you'll want to read the *latest* props and state from an Effect without "reacting" to them.** For example, imagine you want to log the number of the items in the shopping cart for every page visit:
<Trans>**그러나 때로는 Effect에 "반응"하지 않고도 Effect에서 *최신* props와 state를 읽고 싶을 때가 있습니다.** 예를 들어 페이지 방문 시마다 장바구니에 있는 품목의 수를 기록한다고 가정해 보겠습니다:</Trans>

```js {3}
function Page({ url, shoppingCart }) {
  useEffect(() => {
    logVisit(url, shoppingCart.length);
  }, [url, shoppingCart]); // ✅ All dependencies declared
  // ...
}
```

**What if you want to log a new page visit after every `url` change, but *not* if only the `shoppingCart` changes?** You can't exclude `shoppingCart` from dependencies without breaking the [reactivity rules.](#specifying-reactive-dependencies) However, you can express that you *don't want* a piece of code to "react" to changes even though it is called from inside an Effect. [Declare an *Effect Event*](/learn/separating-events-from-effects#declaring-an-effect-event) with the [`useEffectEvent`](/reference/react/experimental_useEffectEvent) Hook, and move the code reading `shoppingCart` inside of it:
<Trans>**`url` 이 변경될 때마다 새 페이지 방문을 기록하되 `shoppingCart` 만 변경되는 경우는 기록하지 *않으려면* 어떻게 해야 하나요?** [반응성 규칙](#specifying-reactive-dependencies)을 위반하지 않으면서 `shoppingCart`를 의존성에서 제외할 수는 없습니다. 그러나 코드가 Effect 내부에서 호출되더라도 변경 사항에 "반응"하지 *않도록* 표현할 수 있습니다.[`useEffectEvent`](/reference/react/experimental_useEffectEvent) 훅을 사용하여 [*Effect Event*를 선언](/learn/separating-events-from-effects#declaring-an-effect-event)하고 `shoppingCart`를 읽는 코드를 그 안으로 이동시킵니다:</Trans>

```js {2-4,7,8}
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

**Effect Events are not reactive and must always be omitted from dependencies of your Effect.** This is what lets you put non-reactive code (where you can read the latest value of some props and state) inside of them. By reading `shoppingCart` inside of `onVisit`, you ensure that `shoppingCart` won't re-run your Effect.
<Trans>**Effect Event는 반응형이 아니므로 항상 Effect의 의존성에서 제외해야 합니다.** 이를 통해 반응형이 아닌 코드(일부 props 및 state의 최신 값을 읽을 수 있는 코드)를 그 안에 넣을 수 있습니다. 예를 들어, `onVisit`내부에서 `shoppingCart`를 읽으면 `shoppingCart`가 Effect를 다시 실행하지 않도록 할 수 있습니다. 향후에는 린터가 useEffectEvent 를 지원하여 의존성에서 Effect Event를 생략하는지 확인할 것입니다.</Trans>

[Read more about how Effect Events let you separate reactive and non-reactive code.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)
<Trans>[Effect Event로 반응형 코드와 비반응형 코드를 분리하는 방법에 대해 자세히 알아보세요.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)</Trans>


---

### Displaying different content on the server and the client<Trans>서버와 클라이언트에 서로 다른 콘텐츠 표시하기</Trans> {/*displaying-different-content-on-the-server-and-the-client*/}

If your app uses server rendering (either [directly](/reference/react-dom/server) or via a [framework](/learn/start-a-new-react-project#production-grade-react-frameworks)), your component will render in two different environments. On the server, it will render to produce the initial HTML. On the client, React will run the rendering code again so that it can attach your event handlers to that HTML. This is why, for [hydration](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) to work, your initial render output must be identical on the client and the server.
<Trans>서버 렌더링([직접](/reference/react-dom/server)이든 [프레임워크](/learn/start-a-new-react-project#production-grade-react-frameworks)를 통해서든)을 사용하는 앱의 경우, 컴포넌트는 두 가지 다른 환경에서 렌더링됩니다. 서버에서는 초기 HTML을 생성하기 위해 렌더링됩니다. 클라이언트에서 React는 렌더링 코드를 다시 실행하여 이벤트 핸들러를 해당 HTML에 첨부할 수 있도록 합니다. 그렇기 때문에 [hydration](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html)이 작동하려면 클라이언트와 서버의 첫 렌더링 결과가 동일해야 합니다.</Trans>

In rare cases, you might need to display different content on the client. For example, if your app reads some data from [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), it can't possibly do that on the server. Here is how you could implement this:
<Trans>드물지만 클라이언트에 다른 콘텐츠를 표시해야 하는 경우가 있을 수 있습니다. 예를 들어 앱이 [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)에서 일부 데이터를 읽는 경우 서버에서는 이를 수행할 수 없습니다. 일반적으로 이를 구현하는 방법은 다음과 같습니다:</Trans>

```js
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... return client-only JSX ...
  }  else {
    // ... return initial JSX ...
  }
}
```

While the app is loading, the user will see the initial render output. Then, when it's loaded and hydrated, your Effect will run and set `didMount` to `true`, triggering a re-render. This will switch to the client-only render output. Effects don't run on the server, so this is why `didMount` was `false` during the initial server render.
<Trans>앱이 로드되는 동안 사용자는 초기 렌더링 결과물을 봅니다. 그런 다음 앱이 로드 및 hydrated 되면 이제 Effect가 실행되면서 `didMount`를 `true`로 설정하여 리렌더링을 촉발합니다. 이로 인해 클라이언트 전용 렌더링 결과물로 전환됩니다. Effect는 서버에서 실행되지 않기 때문에, 서버 렌더링 중에는 `didMount`는 `false`입니다.</Trans>

Use this pattern sparingly. Keep in mind that users with a slow connection will see the initial content for quite a bit of time--potentially, many seconds--so you don't want to make jarring changes to your component's appearance. In many cases, you can avoid the need for this by conditionally showing different things with CSS.
<Trans>이 패턴은 되도록 사용을 아끼세요. 연결 속도가 느린 사용자는 초기 콘텐츠를 꽤 오랜 시간(수 초) 동안 보게 되므로, 컴포넌트의 모양이 갑작스럽게 변경되는걸 원하지 않을 것이라는 점에 유의하세요. 대부분의 경우 CSS를 사용하여 조건부로 다른 것을 표시함으로써 이러한 필요성을 피할 수 있습니다.</Trans>

---

## Troubleshooting<Trans>문제 해결</Trans> {/*troubleshooting*/}

### My Effect runs twice when the component mounts<Trans>컴포넌트가 마운트될 때 내 Effect가 두 번 실행됩니다</Trans> {/*my-effect-runs-twice-when-the-component-mounts*/}

When Strict Mode is on, in development, React runs setup and cleanup one extra time before the actual setup.
<Trans>StrictMode가 켜져 있으면, 개발환경에서 React는 실제 셋업 전에 셋업 및 클린업을 한 번 더 실행합니다.</Trans>

This is a stress-test that verifies your Effect’s logic is implemented correctly. If this causes visible issues, your cleanup function is missing some logic. The cleanup function should stop or undo whatever the setup function was doing. The rule of thumb is that the user shouldn’t be able to distinguish between the setup being called once (as in production) and a setup → cleanup → setup sequence (as in development).
<Trans>이 테스트는 Effect의 로직이 올바르게 구현되었는지 확인하는 스트레스 테스트입니다. 이로 인해 눈에 보이는 문제가 발생하면 클린업 함수에 일부 로직이 누락된 것입니다. 클린업 함수는 셋업 함수가 수행하던 작업을 중지하거나 취소해야 합니다. 사용자 경험상 상용에서 셋업이 한 번 호출되는 것과, 개발 환경에서 셋업 → 클린업 → 셋업 순서로 호출되는 것을 구분할 수 없어야 합니다.</Trans>

Read more about [how this helps find bugs](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) and [how to fix your logic.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)
<Trans>[버그를 찾는 데 도움이 되는 방법](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)과 [로직을 수정하는 방법](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)에 대해 자세히 알아보세요.</Trans>

---

### My Effect runs after every re-render<Trans>내 Effect는 리렌더링할 때마다 실행됩니다.</Trans> {/*my-effect-runs-after-every-re-render*/}

First, check that you haven't forgotten to specify the dependency array:
<Trans>먼저 의존성 배열을 지정하는 것을 잊어버린 건 아닌지 확인하세요:</Trans>

```js {3}
useEffect(() => {
  // ...
}); // 🚩 No dependency array: re-runs after every render!
```

If you've specified the dependency array but your Effect still re-runs in a loop, it's because one of your dependencies is different on every re-render.
<Trans>의존성 배열을 지정했는데도 Effect가 여전히 루프에서 다시 실행된다면, 리렌더링할 때마다 의존성 중 하나가 달라지기 때문일 것입니다.</Trans>

You can debug this problem by manually logging your dependencies to the console:
<Trans>의존성을 콘솔에 수동으로 로깅하여 이 문제를 디버그할 수 있습니다:</Trans>

```js {5}
  useEffect(() => {
    // ..
  }, [serverUrl, roomId]);

  console.log([serverUrl, roomId]);
```

You can then right-click on the arrays from different re-renders in the console and select "Store as a global variable" for both of them. Assuming the first one got saved as `temp1` and the second one got saved as `temp2`, you can then use the browser console to check whether each dependency in both arrays is the same:
<Trans>그런 다음 콘솔에서 서로 다른 리렌더의 배열을 마우스 오른쪽 버튼으로 클릭하고, 두 배열 모두에 대해 "전역 변수로 저장"을 선택할 수 있습니다. 첫 번째 배열이 `temp1` 로 저장되고 두 번째 배열이 `temp2`로 저장되었다고 가정하면, 브라우저 콘솔을 사용하여 두 배열의 각 의존성이 동일한지 확인할 수 있습니다:</Trans>

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

When you find the dependency that is different on every re-render, you can usually fix it in one of these ways:
<Trans>다시 렌더링할 때마다 다른 의존성을 발견하면 일반적으로 다음 방법 중 하나로 해결할 수 있습니다:</Trans>

- [Updating state based on previous state from an Effect](#updating-state-based-on-previous-state-from-an-effect)
- [Removing unnecessary object dependencies](#removing-unnecessary-object-dependencies)
- [Removing unnecessary function dependencies](#removing-unnecessary-function-dependencies)
- [Reading the latest props and state from an Effect](#reading-the-latest-props-and-state-from-an-effect)

<TransBlock>
* [Effect의 이전 state를 기반으로 state 업데이트하기](#updating-state-based-on-previous-state-from-an-effect)
* [불필요한 객체 의존성 제거하기](#removing-unnecessary-object-dependencies)
* [불필요한 함수 의존성 제거하기](#removing-unnecessary-function-dependencies)
* [Effect에서 최신 props 및 state 읽기](#reading-the-latest-props-and-state-from-an-effect)
</TransBlock>

As a last resort (if these methods didn't help), wrap its creation with [`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook) or [`useCallback`](/reference/react/useCallback#preventing-an-effect-from-firing-too-often) (for functions).
<Trans>위 방법들로도 해결되지 않는 경우, 최후의 수단으로 [`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook) 혹은 함수의 경우 [`useCallback`](/reference/react/useCallback#preventing-an-effect-from-firing-too-often)으로 감싸세요.</Trans>

---

### My Effect keeps re-running in an infinite cycle<Trans>내 Effect가 무한히 재실행됩니다</Trans> {/*my-effect-keeps-re-running-in-an-infinite-cycle*/}

If your Effect runs in an infinite cycle, these two things must be true:
<Trans>Effect가 무한히 재실행되는 경우는 다음 두 가지가 모두 참임을 의미합니다:</Trans>

- Your Effect is updating some state.
- That state leads to a re-render, which causes the Effect's dependencies to change.

<TransBlock>
* Effect가 일부 state를 업데이트하고 있습니다.
* 이 state는 리렌더링을 일으키며, 이로부터 Effect의 의존성이 변경됩니다.
</TransBlock>

Before you start fixing the problem, ask yourself whether your Effect is connecting to some external system (like DOM, network, a third-party widget, and so on). Why does your Effect need to set state? Does it synchronize with that external system? Or are you trying to manage your application's data flow with it?
<Trans>문제 해결을 시작하기 전에 Effect가 외부 시스템(예: DOM, 네트워크, 타사 위젯 등)에 연결되어 있는지 확인해 보세요. Effect에 state를 설정해야 하는 이유는 무엇인가요? 특정 state를 외부 시스템과 동기화하나요? 아니면 애플리케이션의 데이터 흐름을 관리하려고 하나요?</Trans>

If there is no external system, consider whether [removing the Effect altogether](/learn/you-might-not-need-an-effect) would simplify your logic.
<Trans>외부 시스템이 없는 경우 [Effect를 완전히 제거하면](/learn/you-might-not-need-an-effect) 로직이 단순화되는지 고려하세요.</Trans>

If you're genuinely synchronizing with some external system, think about why and under what conditions your Effect should update the state. Has something changed that affects your component's visual output? If you need to keep track of some data that isn't used by rendering, a [ref](/reference/react/useRef#referencing-a-value-with-a-ref) (which doesn't trigger re-renders) might be more appropriate. Verify your Effect doesn't update the state (and trigger re-renders) more than needed.
<Trans>외부 시스템과 실제로 동기화하는 경우 Effect가 state를 업데이트해야 하는 이유와 조건에 대해 생각해 보세요. 컴포넌트의 시각적 결과물에 영향을 미치는 변경 사항이 있나요? 렌더링에 사용되지 않는 일부 데이터를 추적해야 하는 경우, 리렌더링을 촉발하지 않는 [ref](/reference/react/useRef#referencing-a-value-with-a-ref)가 더 적합할 수 있습니다. Effect가 필요 이상으로 state를 업데이트하지 않는지(그리고 리렌더링을 촉발하지 않는지) 확인하세요.</Trans>

Finally, if your Effect is updating the state at the right time, but there is still a loop, it's because that state update leads to one of the Effect's dependencies changing. [Read how to debug dependency changes.](/reference/react/useEffect#my-effect-runs-after-every-re-render)
<Trans>마지막으로, Effect가 적시에 state를 업데이트하고 있지만 여전히 루프가 발생한다면, 해당 state 업데이트로 인해 Effect의 의존성 중 하나가 변경되기 때문일 것입니다. [의존성 변경을 디버깅하고 해결하는 방법을 읽어보세요.](/reference/react/useEffect#my-effect-runs-after-every-re-render)</Trans>

---

### My cleanup logic runs even though my component didn't unmount<Trans>컴포넌트가 마운트 해제되지 않았는데도 클린업 로직이 실행됩니다.</Trans> {/*my-cleanup-logic-runs-even-though-my-component-didnt-unmount*/}

The cleanup function runs not only during unmount, but before every re-render with changed dependencies. Additionally, in development, React [runs setup+cleanup one extra time immediately after component mounts.](#my-effect-runs-twice-when-the-component-mounts)
<Trans>클린업 기능은 마운트 해제시 뿐만 아니라 변경된 의존성과 함께 다시 렌더링하기 전에 매번 실행됩니다. 또한 개발환경에서는 React는 [컴포넌트 마운트 직후에 셋업+클린업을 한 번 더 실행합니다.](#my-effect-runs-twice-when-the-component-mounts)</Trans>

If you have cleanup code without corresponding setup code, it's usually a code smell:
<Trans>클린업 코드는 있는데 그에 대응하는 셋업 코드는 없다면, 일반적으로 문제가 있는 코드입니다:</Trans>

```js {2-5}
useEffect(() => {
  // 🔴 Avoid: Cleanup logic without corresponding setup logic
  return () => {
    doSomething();
  };
}, []);
```

Your cleanup logic should be "symmetrical" to the setup logic, and should stop or undo whatever setup did:
<Trans>클린업 로직은 셋업 로직과 "대칭"이어야 하며, 셋업이 수행한 모든 작업을 중지하거나 취소해야 합니다:</Trans>

```js {2-3,5}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

[Learn how the Effect lifecycle is different from the component's lifecycle.](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)
<Trans>[Effect 생명 주기가 컴포넌트의 생명 주기와 어떻게 다른지 알아보세요.](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)</Trans>

---

### My Effect does something visual, and I see a flicker before it runs<Trans>내 Effect가 시각적인 작업을 수행하는데, 실행되기 전에 깜박거립니다</Trans> {/*my-effect-does-something-visual-and-i-see-a-flicker-before-it-runs*/}

If your Effect must block the browser from [painting the screen,](/learn/render-and-commit#epilogue-browser-paint) replace `useEffect` with [`useLayoutEffect`](/reference/react/useLayoutEffect). Note that **this shouldn't be needed for the vast majority of Effects.** You'll only need this if it's crucial to run your Effect before the browser paint: for example, to measure and position a tooltip before the user sees it.
<Trans>Effect로 인해 브라우저가 [화면을 그리는 것](/learn/render-and-commit#epilogue-browser-paint)을 차단해야 하는 경우, `useEffect`를 [`useLayoutEffect`](/reference/react/useLayoutEffect)로 바꾸세요. **대부분의 Effect에는 이 기능이 필요하지 않다**는 점에 유의하세요. 오직 브라우저 페인팅 전에 Effect를 실행하는 것이 중요한 경우에만 필요할 것입니다. (예: 사용자가 보기 전에 툴팁의 위치를 미리 측정하고 배치하고자 할 때)</Trans>
