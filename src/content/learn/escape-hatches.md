---
title: Escape Hatches
translatedTitle: 탈출구
translators: [정재남]
---

<Intro>

Some of your components may need to control and synchronize with systems outside of React. For example, you might need to focus an input using the browser API, play and pause a video player implemented without React, or connect and listen to messages from a remote server. In this chapter, you'll learn the escape hatches that let you "step outside" React and connect to external systems. Most of your application logic and data flow should not rely on these features.
<Trans>컴포넌트 중 일부는 React 외부의 시스템을 제어하고 동기화해야 할 수 있습니다. 예를 들어 브라우저 API를 사용해 input에 포커스를 맞추거나, React 없이 구현된 비디오 플레이어를 재생 및 일시정지하거나, 원격 서버에 연결해서 메시지를 수신해야 할 수 있습니다. 이 장에서는 React의 "외부"로 나가서 외부 시스템에 연결할 수 있는 탈출구를 배우게 됩니다. 대부분의 애플리케이션 로직과 데이터 흐름은 이러한 기능에 의존해서는 안 됩니다.</Trans>

</Intro>

<YouWillLearn isChapter={true}>

* [How to "remember" information without re-rendering](/learn/referencing-values-with-refs)
* [How to access DOM elements managed by React](/learn/manipulating-the-dom-with-refs)
* [How to synchronize components with external systems](/learn/synchronizing-with-effects)
* [How to remove unnecessary Effects from your components](/learn/you-might-not-need-an-effect)
* [How an Effect's lifecycle is different from a component's](/learn/lifecycle-of-reactive-effects)
* [How to prevent some values from re-triggering Effects](/learn/separating-events-from-effects)
* [How to make your Effect re-run less often](/learn/removing-effect-dependencies)
* [How to share logic between components](/learn/reusing-logic-with-custom-hooks)

<TransBlock>
* [리렌더링하지 않고 정보를 "기억"하는 방법](/learn/referencing-values-with-refs)
* [React가 관리하는 DOM 엘리먼트에 접근하는 방법](/learn/manipulating-the-dom-with-refs)
* [컴포넌트를 외부 시스템과 동기화하는 방법](/learn/synchronizing-with-effects)
* [컴포넌트에서 불필요한 Effect를 제거하는 방법](/learn/you-might-not-need-an-effect)
* [effect의 생명주기가 컴포넌트와 어떻게 다른지](/learn/lifecycle-of-reactive-effects)
* [일부 값이 Effect를 다시 트리거하는 것을 방지하는 방법](/learn/separating-events-from-effects)
* [Effect 재실행 빈도를 줄이는 방법](/learn/removing-effect-dependencies)
* [컴포넌트 간 로직을 공유하는 방법](/learn/reusing-logic-with-custom-hooks)
</TransBlock>

</YouWillLearn>

## Referencing values with Refs<Trans>ref로 값 참조하기</Trans> {/*referencing-values-with-refs*/}

When you want a component to "remember" some information, but you don't want that information to [trigger new renders](/learn/render-and-commit), you can use a *ref*:
<Trans>컴포넌트가 특정 정보를 '기억'하도록 하고 싶지만 해당 정보가 [새 렌더링을 트리거](/learn/render-and-commit)하지 않도록 하려는 경우 ref를 사용할 수 있습니다:</Trans>

```js
const ref = useRef(0);
```

Like state, refs are retained by React between re-renders. However, setting state re-renders a component. Changing a ref does not! You can access the current value of that ref through the `ref.current` property.
<Trans>state와 마찬가지로 ref는 리렌더링 사이에 React에 의해 유지됩니다. 다만 state를 설정하면 컴포넌트가 다시 렌더링되는 반면, ref를 변경하면 그렇지 않습니다! `ref.current` 프로퍼티를 통해 해당 ref의 현재 값에 접근할 수 있습니다.</Trans>

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

A ref is like a secret pocket of your component that React doesn't track. For example, you can use refs to store [timeout IDs](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value), [DOM elements](https://developer.mozilla.org/en-US/docs/Web/API/Element), and other objects that don't impact the component's rendering output.
<Trans>ref는 React가 추적하지 않는 컴포넌트의 비밀 주머니와 같습니다. 예를 들어, ref를 사용하여 컴포넌트의 렌더링 출력에 영향을 주지 않는 [timeout ID](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value), [DOM 엘리먼트](https://developer.mozilla.org/en-US/docs/Web/API/Element) 및 기타 객체를 저장할 수 있습니다.</Trans>


<LearnMore path="/learn/referencing-values-with-refs">

Read [**Referencing Values with Refs**](/learn/referencing-values-with-refs) to learn how to use refs to remember information.
<Trans>ref를 사용하여 정보를 기억하는 방법을 알아보려면 [**ref로 값 참조하기**](/learn/referencing-values-with-refs)를 읽어보세요.</Trans>

</LearnMore>

## Manipulating the DOM with Refs<Trans>ref로 DOM 조작하기</Trans> {/*manipulating-the-dom-with-refs*/}

React automatically updates the DOM to match your render output, so your components won't often need to manipulate it. However, sometimes you might need access to the DOM elements managed by React—for example, to focus a node, scroll to it, or measure its size and position. There is no built-in way to do those things in React, so you will need a ref to the DOM node. For example, clicking the button will focus the input using a ref:
<Trans>React는 렌더링 출력과 일치하도록 DOM을 자동으로 업데이트하므로 컴포넌트에서 자주 조작할 필요가 없습니다. 하지만 때로는 노드에 포커스를 맞추거나 스크롤하거나 크기와 위치를 측정하기 위해 React가 관리하는 DOM 요소에 접근해야 할 수도 있습니다. React에는 이러한 작업을 수행할 수 있는 내장된 방법이 없으므로 DOM 노드에 대한 ref(참조)가 필요합니다. 예를 들어 버튼을 클릭하면 ref를 사용해 입력에 포커스를 맞춥니다:</Trans>

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/manipulating-the-dom-with-refs">

Read [**Manipulating the DOM with Refs**](/learn/manipulating-the-dom-with-refs) to learn how to access DOM elements managed by React.
<Trans>React에서 관리하는 DOM 엘리먼트에 접근하는 방법을 알아보려면 [**ref로 DOM 조작하기**](/learn/manipulating-the-dom-with-refs)를 읽어보세요.</Trans>

</LearnMore>

## Synchronizing with Effects<Trans>Effect와 동기화하기</Trans> {/*synchronizing-with-effects*/}

Some components need to synchronize with external systems. For example, you might want to control a non-React component based on the React state, set up a server connection, or send an analytics log when a component appears on the screen. Unlike event handlers, which let you handle particular events, *Effects* let you run some code after rendering. Use them to synchronize your component with a system outside of React.
<Trans>일부 컴포넌트는 외부 시스템과 동기화해야 합니다. 예를 들어 React state에 따라 비 React 컴포넌트를 제어하거나, 서버 연결을 설정하거나, 컴포넌트가 화면에 표시될 때 분석 로그를 보내야 할 수 있습니다. 특정 이벤트를 처리할 수 있는 이벤트 핸들러와 달리 *Effect*를 사용하면 렌더링 후 일부 코드를 실행할 수 있습니다. 이를 사용해 컴포넌트를 React 외부 시스템과 동기화할 수 있습니다.</Trans>

Press Play/Pause a few times and see how the video player stays synchronized to the `isPlaying` prop value:
<Trans>재생/일시정지를 몇 번 누르고 비디오 플레이어가 `isPlaying` prop 값에 어떻게 동기화되는지 확인해 보세요:</Trans>

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Many Effects also "clean up" after themselves. For example, an Effect that sets up a connection to a chat server should return a *cleanup function* that tells React how to disconnect your component from that server:
<Trans>많은 Effect는 스스로 "정리"하기도 합니다. 예를 들어, 채팅 서버에 대한 연결을 설정하는 Effect는 해당 서버에서 컴포넌트의 연결을 끊는 방법을 React에 알려주는 *클린업 함수*를 반환해야 합니다:</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

In development, React will immediately run and clean up your Effect one extra time. This is why you see `"✅ Connecting..."` printed twice. This ensures that you don't forget to implement the cleanup function.
<Trans>개발 모드에서 React는 즉시 실행되고 Effect를 한 번 더 정리합니다. 그래서 `"✅ Connecting..."`이 두 번 인쇄되는 것입니다. 이렇게 하면 클린업 함수를 구현하는 것을 잊지 않도록 할 수 있습니다.</Trans>

<LearnMore path="/learn/synchronizing-with-effects">

Read [**Synchronizing with Effects**](/learn/synchronizing-with-effects) to learn how to synchronize components with external systems.
<Trans>외부 시스템과 컴포넌트를 동기화하는 방법을 알아보려면 [**Effect와 동기화하기**](/learn/synchronizing-with-effects)를 읽어보세요.</Trans>

</LearnMore>

## You Might Not Need An Effect<Trans>Effect가 필요하지 않을 수도 있습니다</Trans> {/*you-might-not-need-an-effect*/}

Effects are an escape hatch from the React paradigm. They let you "step outside" of React and synchronize your components with some external system. If there is no external system involved (for example, if you want to update a component's state when some props or state change), you shouldn't need an Effect. Removing unnecessary Effects will make your code easier to follow, faster to run, and less error-prone.
<Trans>Effect는 React 패러다임에서 벗어날 수 있는 탈출구입니다. 이를 통해 React의 "외부"로 나가서 컴포넌트를 외부 시스템과 동기화할 수 있습니다. 외부 시스템이 관여하지 않는 경우(예: 일부 prop이나 state가 변경될 때 컴포넌트의 state를 업데이트하려는 경우)에는 Effect가 필요하지 않습니다. 불필요한 Effect를 제거하면 코드를 더 쉽게 따라갈 수 있고, 실행 속도가 빨라지며, 오류 발생 가능성이 줄어듭니다.</Trans>

There are two common cases in which you don't need Effects:
<Trans>이펙트가 필요하지 않은 일반적인 경우는 두 가지가 있습니다:</Trans>

- **You don't need Effects to transform data for rendering.**
- **You don't need Effects to handle user events.**

<TransBlock>
- **렌더링을 위해 데이터를 변환할 때 Effect는 필요하지 않습니다.**
- **사용자 이벤트를 처리할 때 Effect는 필요하지 않습니다.**
</TransBlock>

For example, you don't need an Effect to adjust some state based on other state:
<Trans>예를 들어, 다른 state에 따라 일부 state를 조정하는 데는 Effect가 필요하지 않습니다:</Trans>

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Instead, calculate as much as you can while rendering:
<Trans>대신 렌더링하는 동안 가능한 한 많이 계산하세요:</Trans>

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

However, you *do* need Effects to synchronize with external systems. 
<Trans>반대로 외부 시스템과 동기화하려면 Effects가 필요할 것입니다.</Trans>

<LearnMore path="/learn/you-might-not-need-an-effect">

Read [**You Might Not Need an Effect**](/learn/you-might-not-need-an-effect) to learn how to remove unnecessary Effects.
<Trans>불필요한 Effect를 제거하는 방법을 알아보려면 [**Effect가 필요하지 않을 수도 있습니다**](/learn/you-might-not-need-an-effect)를 읽어보세요.</Trans>

</LearnMore>

## Lifecycle of reactive Effects<Trans>반응형 Effect의 생명주기</Trans> {/*lifecycle-of-reactive-effects*/}

Effects have a different lifecycle from components. Components may mount, update, or unmount. An Effect can only do two things: to start synchronizing something, and later to stop synchronizing it. This cycle can happen multiple times if your Effect depends on props and state that change over time.
<Trans>Effect는 컴포넌트와 다른 생명주기를 가집니다. 컴포넌트는 마운트, 업데이트 또는 언마운트할 수 있습니다. 반면 Effect는 동기화를 시작하거나 동기화를 중지하는 두 가지 작업만 할 수 있습니다. Effect가 시간에 따라 변하는 prop 및 state에 의존하는 경우 이 주기는 여러 번 발생할 수 있습니다.</Trans>

This Effect depends on the value of the `roomId` prop. Props are *reactive values,* which means they can change on a re-render. Notice that the Effect *re-synchronizes* (and re-connects to the server) if `roomId` changes:
<Trans>아래 예시의 Effect는 `roomId` prop의 값에 따라 달라집니다. Prop은 *반응형 값*이므로 다시 렌더링할 때 변경될 수 있습니다. `roomId`가 변경되면 이펙트가 *재동기화*(및 서버 재연결)됩니다:</Trans>

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

React provides a linter rule to check that you've specified your Effect's dependencies correctly. If you forget to specify `roomId` in the list of dependencies in the above example, the linter will find that bug automatically.
<Trans>React는 이펙트의 종속성을 올바르게 지정했는지 확인하는 린터 규칙을 제공합니다. 위의 예시에서 종속성 목록에 `roomId`를 지정하는 것을 잊어버렸다면, 린터가 해당 버그를 자동으로 찾아낼 것입니다.</Trans>

<LearnMore path="/learn/lifecycle-of-reactive-effects">

Read [**Lifecycle of Reactive Events**](/learn/lifecycle-of-reactive-effects) to learn how an Effect's lifecycle is different from a component's.
<Trans>이펙트의 생명주기가 컴포넌트와 어떻게 다른지 알아보려면 [**반응형 Effect의 생명주기**](/learn/lifecycle-of-reactive-effects)를 읽어보세요.</Trans>

</LearnMore>

## Separating events from Effects<Trans>이벤트와 Effect 분리하기</Trans> {/*separating-events-from-effects*/}

<Wip>

This section describes an **experimental API that has not yet been released** in a stable version of React.
<Trans>이 섹션에서는 **아직 React에 추가되지 않은 실험적 API**에 대해 설명하며, 아직 사용할 수 없습니다.</Trans>

</Wip>

Event handlers only re-run when you perform the same interaction again. Unlike event handlers, Effects re-synchronize if any of the values they read, like props or state, are different than during last render. Sometimes, you want a mix of both behaviors: an Effect that re-runs in response to some values but not others.
<Trans>이벤트 핸들러는 동일한 상호작용을 다시 수행할 때만 다시 실행됩니다. 이벤트 핸들러와 달리 Effect는 prop이나 state 변수처럼 읽은 값이 마지막 렌더링에서와 다른 경우 다시 동기화합니다. 때로는 두 가지 동작을 혼합하여 일부 값에는 반응하지만 다른 값에는 반응하지 않는 효과를 원할 수 있습니다.</Trans>

All code inside Effects is *reactive.* It will run again if some reactive value it reads has changed due to a re-render. For example, this Effect will re-connect to the chat if either `roomId` or `theme` have changed:
<Trans>Effect 내의 모든 코드는 *반응형*이며, 읽은 반응형 값이 리렌더링으로 인해 변경된 경우 다시 실행됩니다. 예를 들어, 다음의 Effect는 상호작용 후 `roomId` 또는 `theme`이 변경된 경우 채팅에 다시 연결됩니다:</Trans>

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

This is not ideal. You want to re-connect to the chat only if the `roomId` has changed. Switching the `theme` shouldn't re-connect to the chat! Move the code reading `theme` out of your Effect into an *Effect Event*:
<Trans>이것은 이상적이지 않습니다. `roomId`가 변경된 경우에만 채팅에 다시 연결하고 싶습니다. `theme`를 전환해도 채팅에 다시 연결되지 않아야 합니다! `theme`를 읽는 코드를 효과에서 *Effect Event*로 옮기세요:</Trans>

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

Code inside Effect Events isn't reactive, so changing the `theme` no longer makes your Effect re-connect.
<Trans>이벤트 함수 내부의 코드는 반응형 코드가 아니므로 `theme`를 변경해도 더 이상 이펙트가 다시 연결되지 않습니다.</Trans>

<LearnMore path="/learn/separating-events-from-effects">

Read [**Separating Events from Effects**](/learn/separating-events-from-effects) to learn how to prevent some values from re-triggering Effects.
<Trans>[**이벤트와 Effect 분리하기**](/learn/separating-events-from-effects)를 읽고 일부 값이 Effect를 다시 트리거하는 것을 방지하는 방법을 알아보세요.</Trans>

</LearnMore>

## Removing Effect dependencies<Trans>Effect 종속성 제거하기</Trans> {/*removing-effect-dependencies*/}

When you write an Effect, the linter will verify that you've included every reactive value (like props and state) that the Effect reads in the list of your Effect's dependencies. This ensures that your Effect remains synchronized with the latest props and state of your component. Unnecessary dependencies may cause your Effect to run too often, or even create an infinite loop. The way you remove them depends on the case.
<Trans>Effect를 작성할 때, Effect의 종속성 목록에서 Effect가 읽는 모든 반응형 값(예: prop 및 state)을 포함했는지 확인합니다. 이렇게 하면 Effect가 컴포넌트의 최신 prop 및 state와 동기화된 상태를 유지할 수 있습니다. 불필요한 종속성으로 인해 Effect가 너무 자주 실행되거나 무한 루프를 생성할 수도 있습니다. 종속성을 제거하는 방법은 경우에 따라 다릅니다.</Trans>

For example, this Effect depends on the `options` object which gets re-created every time you edit the input:
<Trans>예를 들어, 이 Effect는 사용자가 input을 편집할 때마다 다시 생성되는 `options` 객체에 의존합니다:</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

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

You don't want the chat to re-connect every time you start typing a message in that chat. To fix this problem, move creation of the `options` object inside the Effect so that the Effect only depends on the `roomId` string:
<Trans>해당 채팅에 메시지를 입력할 때마다 채팅이 다시 연결되는 것을 원치 않으실 것입니다. 이 문제를 해결하려면 Effect 내에서 `옵션` 객체를 생성하여 Effect가 `roomId` 문자열에만 의존하도록 하세요:</Trans>

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

Notice that you didn't start by editing the dependency list to remove the `options` dependency. That would be wrong. Instead, you changed the surrounding code so that the dependency became *unnecessary.* Think of the dependency list as a list of all the reactive values used by your Effect's code. You don't intentionally choose what to put on that list. The list describes your code. To change the dependency list, change the code.
<Trans>종속성 목록을 편집하여 `options` 종속성을 제거하는 것으로 시작하지 않았음을 알 수 있습니다. 이는 잘못된 방법일 수 있습니다. 대신 주변 코드를 변경함으로써 종속성을 *불필요하게* 만들었습니다. 종속성 목록을 Effect의 코드에서 사용하는 모든 반응형 값의 목록으로 생각하세요. 이 목록에 무엇을 넣을지는 의도적으로 선택하지 않습니다. 이 목록은 당신의 코드를 기술합니다. 종속성 목록을 변경하려면, 코드를 변경하세요.</Trans>

<LearnMore path="/learn/removing-effect-dependencies">

Read [**Removing Effect Dependencies**](/learn/removing-effect-dependencies) to learn how to make your Effect re-run less often.
<Trans>[**Effect 종속성 제거하기**](/learn/removing-effect-dependencies)를 읽고 Effect의 재실행 빈도를 낮추는 방법을 알아보세요.</Trans>

</LearnMore>

## Reusing logic with custom Hooks<Trans>커스텀 훅으로 로직 재사용하기</Trans> {/*reusing-logic-with-custom-hooks*/}

React comes with built-in Hooks like `useState`, `useContext`, and `useEffect`. Sometimes, you’ll wish that there was a Hook for some more specific purpose: for example, to fetch data, to keep track of whether the user is online, or to connect to a chat room. To do this, you can create your own Hooks for your application's needs.
<Trans>React에는 `useState`, `useContext`, `useEffect`와 같은 훅이 내장되어 있습니다. 때로는 데이터를 페치하거나, 사용자가 온라인 상태인지 추적하거나, 채팅방에 연결하는 것과 같이 좀 더 구체적인 목적을 위한 훅이 있었으면 좋겠습니다. 이를 위해 애플리케이션의 필요에 맞는 고유한 훅을 만들 수 있습니다.</Trans>

In this example, the `usePointerPosition` custom Hook tracks the cursor position, while `useDelayedValue` custom Hook returns a value that's "lagging behind" the value you passed by a certain number of milliseconds. Move the cursor over the sandbox preview area to see a moving trail of dots following the cursor:
<Trans>이번 예제에서는 `usePointerPosition` 커스텀 훅은 커서 위치를 추적하고, `useDelayedValue` 커스텀 훅은 전달한 값보다 특정 밀리초만큼 '지연'된 값을 반환합니다. 샌드박스 미리보기 영역 위로 커서를 이동하면 커서를 따라 움직이는 점의 흔적을 확인할 수 있습니다:</Trans>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
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

```js usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```js useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

You can create custom Hooks, compose them together, pass data between them, and reuse them between components. As your app grows, you will write fewer Effects by hand because you'll be able to reuse custom Hooks you already wrote. There are also many excellent custom Hooks maintained by the React community.
<Trans>커스텀 훅을 생성하고, 함께 구성하고, 컴포넌트 간에 데이터를 전달하고, 컴포넌트 간에 재사용할 수 있습니다. 앱이 성장함에 따라 이미 작성한 커스텀 훅을 재사용할 수 있기 때문에 직접 작성하는 Effect의 수가 줄어들게 됩니다. 또한 React 커뮤니티에서 관리하고 있는 훌륭한 커스텀 훅이 많이 있습니다.</Trans>

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

Read [**Reusing Logic with Custom Hooks**](/learn/reusing-logic-with-custom-hooks) to learn how to share logic between components.
<Trans>컴포넌트 간에 로직을 공유하는 방법을 알아보려면 [**커스텀 훅으로 로직 재사용하기**](/learn/reusing-logic-with-custom-hooks)를 읽어보세요.</Trans>

</LearnMore>

## What's next? {/*whats-next*/}

Head over to [Referencing Values with Refs](/learn/referencing-values-with-refs) to start reading this chapter page by page!
<Trans>[ref로 값 참조하기](/learn/referencing-values-with-refs)로 이동하여 이 챕터를 한 페이지씩 읽어보세요!</Trans>
