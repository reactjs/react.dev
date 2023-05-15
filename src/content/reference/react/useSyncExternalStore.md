---
title: useSyncExternalStore
translators: [정현수, 강민혜]
---

<Intro>

`useSyncExternalStore` is a React Hook that lets you subscribe to an external store.
<Trans>`useSyncExternalStore`는 외부 스토어를 구독할 수 있는 React 훅입니다.</Trans>

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` {/*usesyncexternalstore*/}

Call `useSyncExternalStore` at the top level of your component to read a value from an external data store.
<Trans>컴포넌트의 최상위 레벨에서 `useSyncExternalStore`를 호출하여 외부 데이터 저장소에서 값을 읽습니다.</Trans>

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

It returns the snapshot of the data in the store. You need to pass two functions as arguments:
<Trans>스토어에 있는 데이터의 스냅샷을 반환합니다. 두 개의 함수를 인수로 전달해야 합니다:</Trans>

1. The `subscribe` function should subscribe to the store and return a function that unsubscribes.
2. The `getSnapshot` function should read a snapshot of the data from the store.

<TransBlock>
1. `subscribe` 함수는 스토어를 구독해야 하고, 구독 취소 함수를 반환해야 합니다.
2. `getSnapshot` 함수는 스토어에서 데이터의 스냅샷을 읽어야 합니다.
</TransBlock>

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

* `subscribe`: A function that takes a single `callback` argument and subscribes it to the store. When the store changes, it should invoke the provided `callback`. This will cause the component to re-render. The `subscribe` function should return a function that cleans up the subscription.
<Trans>`subscribe`: 하나의 `callback` 인수를 받아 스토어를 구독하는 함수입니다. 스토어가 변경되면 제공된 `callback`을 호출해야 합니다. 이로부터 컴포넌트가 리렌더링 됩니다. `subscribe` 함수는 구독을 해제하는 함수를 반환해야 합니다.</Trans>

* `getSnapshot`: A function that returns a snapshot of the data in the store that's needed by the component. While the store has not changed, repeated calls to `getSnapshot` must return the same value. If the store changes and the returned value is different (as compared by [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), React re-renders the component.
<Trans>`getSnapshot`: 컴포넌트에 필요한 스토어 데이터의 스냅샷을 반환하는 함수입니다. 스토어가 변경되지 않은 상태에서 `getSnapshot`을 반복적으로 호출하면 동일한 값을 반환해야 합니다. 저장소가 변경되어 반환된 값이 ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교시) 달라지면, React는 컴포넌트를 리렌더링 합니다.</Trans>

* **optional** `getServerSnapshot`: A function that returns the initial snapshot of the data in the store. It will be used only during server rendering and during hydration of server-rendered content on the client. The server snapshot must be the same between the client and the server, and is usually serialized and passed from the server to the client. If you omit this argument, rendering the component on the server will throw an error.
<Trans>**선택적** `getServerSnapshot`: 스토어에 있는 데이터의 초기 스냅샷을 반환하는 함수입니다. 오직 서버에서 렌더링할 때와 이를 클라이언트에서 hydrate하는 동안에만 사용됩니다. 서버 스냅샷은 클라이언트와 서버 간에 동일해야 하며, 일반적으로 서버에서 직렬화하여 클라이언트로 전달합니다. 이 함수가 제공되지 않으면 서버에서 컴포넌트를 렌더링할 때 오류가 발생합니다.</Trans>

#### Returns<Trans>반환값</Trans> {/*returns*/}

The current snapshot of the store which you can use in your rendering logic.
<Trans>렌더링 로직에 사용할 수 있는 스토어의 현재 스냅샷입니다.</Trans>

#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

* The store snapshot returned by `getSnapshot` must be immutable. If the underlying store has mutable data, return a new immutable snapshot if the data has changed. Otherwise, return a cached last snapshot.
<Trans>`getSnapshot`이 반환하는 스토어 스냅샷은 불변이어야 합니다. 기본 스토어에 변이 가능한 데이터가 있는 경우에는, 데이터가 변이되면 새로운 불변 스냅샷을 반환하도록 하고, 변이 사항이 없으면 캐시된 마지막 스냅샷을 반환하도록 하세요.</Trans>

* If a different `subscribe` function is passed during a re-render, React will re-subscribe to the store using the newly passed `subscribe` function. You can prevent this by declaring `subscribe` outside the component.
<Trans>리렌더링시에 다른 `subscribe` 함수가 전달되면 React는 새로 전달된 `subscribe` 함수를 사용하여 저장소를 다시 구독합니다. 컴포넌트 외부에서 `subscribe`를 선언하면 이를 방지할 수 있습니다.</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Subscribing to an external store<Trans>외부 스토어 구독하기</Trans> {/*subscribing-to-an-external-store*/}

Most of your React components will only read data from their [props,](/learn/passing-props-to-a-component) [state,](/reference/react/useState) and [context.](/reference/react/useContext) However, sometimes a component needs to read some data from some store outside of React that changes over time. This includes:
<Trans>대부분의 React 컴포넌트는 [props](/learn/passing-props-to-a-component), [state](/reference/react/useState), [context](/reference/react/useContext)에서만 데이터를 읽습니다. 하지만 때로는 컴포넌트가 시간이 지남에 따라 변경되는 React 외부의 저장소에서 데이터를 읽어야 하는 경우도 있습니다. 여기에는 다음이 포함됩니다:</Trans>

* Third-party state management libraries that hold state outside of React.
* Browser APIs that expose a mutable value and events to subscribe to its changes.
<TransBlock>

* React 외부에 state를 보관하는 서드파티 상태 관리 라이브러리.
* 변이 가능한 값을 노출하는 브라우저 API와 그 변이 사항을 구독하는 이벤트.
</TransBlock>

Call `useSyncExternalStore` at the top level of your component to read a value from an external data store.
<Trans>외부 데이터 저장소에서 값을 읽으려면 컴포넌트의 최상위 레벨에서 `useSyncExternalStore`를 호출하세요.</Trans>

```js [[1, 5, "todosStore.subscribe"], [2, 5, "todosStore.getSnapshot"], [3, 5, "todos", 0]]
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

It returns the <CodeStep step={3}>snapshot</CodeStep> of the data in the store. You need to pass two functions as arguments:
<Trans>스토어에 있는 데이터의 <CodeStep step={3}>snapshot</CodeStep>을 반환합니다. 두 개의 함수를 인수로 전달해야 합니다:</Trans>

1. The <CodeStep step={1}>`subscribe` function</CodeStep> should subscribe to the store and return a function that unsubscribes.
2. The <CodeStep step={2}>`getSnapshot` function</CodeStep> should read a snapshot of the data from the store.

<TransBlock>

1. <CodeStep step={1}>`subscribe` 함수</CodeStep>는 스토어를 구독해야 하고, 구독 취소 함수를 반환해야 합니다.
2. <CodeStep step={2}>`getSnapshot` 함수</CodeStep>는 스토어에서 데이터의 스냅샷을 읽어야 합니다.
</TransBlock>

React will use these functions to keep your component subscribed to the store and re-render it on changes.
<Trans>React는 이 함수를 사용해 컴포넌트가 스토어를 구독한 상태로 유지하고 변경 사항이 있을 때 다시 렌더링합니다.</Trans>

For example, in the sandbox below, `todosStore` is implemented as an external store that stores data outside of React. The `TodosApp` component connects to that external store with the `useSyncExternalStore` Hook. 
<Trans>예를 들어, 아래 샌드박스에서 `todosStore`는 React 외부에 데이터를 저장하는 외부 store로 구현되어 있습니다. `TodosApp`컴포넌트는 `useSyncExternalStore` 훅으로 해당 외부 스토어에 연결합니다.</Trans>

<Sandpack>

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}
```

```js todoStore.js
// This is an example of a third-party store
// that you might need to integrate with React.

// If your app is fully built with React,
// we recommend using React state instead.

let nextId = 0;
let todos = [{ id: nextId++, text: 'Todo #1' }];
let listeners = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Todo #' + nextId }]
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

</Sandpack>

<Note>

When possible, we recommend using built-in React state with [`useState`](/reference/react/useState) and [`useReducer`](/reference/react/useReducer) instead. The `useSyncExternalStore` API is mostly useful if you need to integrate with existing non-React code.
<Trans>가능하면 React 빌트인 state를 [`useState`](/reference/react/useState) 및 [`useReducer`](/reference/react/useReducer)와 함께 사용하는 것이 좋습니다. `useSyncExternalStore` API는 주로 기존의 비 React 코드와 통합해야 할 때 유용합니다.</Trans>

</Note>

---

### Subscribing to a browser API<Trans>브라우저 API 구독하기</Trans> {/*subscribing-to-a-browser-api*/}

Another reason to add `useSyncExternalStore` is when you want to subscribe to some value exposed by the browser that changes over time. For example, suppose that you want your component to display whether the network connection is active. The browser exposes this information via a property called [`navigator.onLine`.](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) This value can change without React's knowledge, so you should read it with `useSyncExternalStore`.
<Trans>`useSyncExternalStore`를 추가하는 또 다른 이유는 브라우저상의 시간이 지남에 따라 변경되는 일부 값을 구독하려는 경우입니다. 예를 들어 컴포넌트에 네트워크 연결이 활성화되어 있는지 여부를 표시하고 싶다고 가정해 보겠습니다. 브라우저는 [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)이라는 속성을 통해 이 정보를 노출합니다. 이 값은 시간이 지남에 따라 React가 알지 못하는 사이에 변경될 수 있으므로 `useSyncExternalStore`로 값을 읽어야 합니다.</Trans>

```js
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

To implement the `getSnapshot` function, read the current value from the browser API:
<Trans>`getSnapshot` 함수를 구현하려면 브라우저 API에서 현재 값을 읽습니다:</Trans>

```js
function getSnapshot() {
  return navigator.onLine;
}
```

Next, you need to implement the `subscribe` function. For example, when `navigator.onLine` changes, the browser fires the [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) and [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) events on the `window` object. You need to subscribe the `callback` argument to the corresponding events, and then return a function that cleans up the subscriptions:
<Trans>다음으로 `subscribe` 함수를 구현해야 합니다. 예를 들어 `navigator.onLine`이 변경되면 브라우저는 `window` 객체에서 [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) 및 [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) 이벤트를 실행합니다. `callback` 인수를 해당 이벤트에 구독한 다음 구독을 해제하는 함수를 반환해야 합니다:</Trans>

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

Now React knows how to read the value from the external `navigator.onLine` API and how to subscribe to its changes. Disconnect your device from the network and notice that the component re-renders in response:
<Trans>이제 React는 외부 `navigator.onLine` API에서 값을 읽는 방법과 그 변경 사항을 구독하는 방법을 알고 있습니다. 네트워크에서 디바이스의 연결을 끊어보면 컴포넌트가 다시 렌더링되는 것을 확인할 수 있습니다:</Trans>

<Sandpack>

```js
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Extracting the logic to a custom Hook<Trans>사용자 정의 훅으로 로직 추출하기</Trans> {/*extracting-the-logic-to-a-custom-hook*/}

Usually you won't write `useSyncExternalStore` directly in your components. Instead, you'll typically call it from your own custom Hook. This lets you use the same external store from different components.
<Trans>일반적으로 컴포넌트에서 직접 `useSyncExternalStore`를 작성하지는 않습니다. 대신 일반적으로 사용자 정의 훅에서 호출합니다. 이렇게 하면 서로 다른 컴포넌트에서 동일한 외부 저장소를 사용할 수 있습니다.</Trans>

For example, this custom `useOnlineStatus` Hook tracks whether the network is online:
<Trans>예를 들어, 이 사용자 정의 `useOnlineStatus` 훅은 네트워크가 온라인 상태인지 여부를 추적합니다:</Trans>

```js {3,6}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  // ...
}

function subscribe(callback) {
  // ...
}
```

Now different components can call `useOnlineStatus` without repeating the underlying implementation:
<Trans>이제 다른 컴포넌트에서 기본 구현을 반복하지 않고도 `useOnlineStatus`를 호출할 수 있습니다:</Trans>

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Adding support for server rendering<Trans>서버 렌더링의 지원 추가하기</Trans> {/*adding-support-for-server-rendering*/}

If your React app uses [server rendering,](/reference/react-dom/server) your React components will also run outside the browser environment to generate the initial HTML. This creates a few challenges when connecting to an external store:
<Trans>React 앱이 [서버 렌더링](/reference/react-dom/server)을 사용하는 경우, React 컴포넌트는 브라우저 환경 외부에서도 실행되어 초기 HTML을 생성합니다. 이로 인해 외부 스토어에 연결할 때 몇 가지 문제가 발생합니다:</Trans>

- If you're connecting to a browser-only API, it won't work because it does not exist on the server.
- If you're connecting to a third-party data store, you'll need its data to match between the server and client.
<TransBlock> 

- 브라우저 전용 API에 연결하는 경우 서버에 해당 API가 존재하지 않으므로 작동하지 않습니다.
- 타사 데이터 저장소에 연결하는 경우 서버와 클라이언트 간에 일치하는 데이터가 필요합니다.
</TransBlock>

To solve these issues, pass a `getServerSnapshot` function as the third argument to `useSyncExternalStore`:
<Trans>이러한 문제를 해결하려면 `getServerSnapshot` 함수를 `useSyncExternalStore`의 세 번째 인수로 전달하세요:</Trans>

```js {4,12-14}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Always show "Online" for server-generated HTML
}

function subscribe(callback) {
  // ...
}
```

The `getServerSnapshot` function is similar to `getSnapshot`, but it runs only in two situations:
<Trans>`getServerSnapshot` 함수는 `getSnapshot`과 유사하지만 오직 두 가지 상황에서만 실행됩니다:</Trans>

- It runs on the server when generating the HTML.
- It runs on the client during [hydration](/reference/react-dom/client/hydrateRoot), i.e. when React takes the server HTML and makes it interactive.

<TransBlock>
- HTML을 생성할 때 서버에서 실행됩니다.
- [hydration](/reference/react-dom/client/hydrateRoot)중, 즉 React가 서버 HTML을 가져와서 인터랙티브하게 만들 때 클라이언트에서 실행됩니다.
</TransBlock>

This lets you provide the initial snapshot value which will be used before the app becomes interactive. If there is no meaningful initial value for the server rendering, omit this argument to [force rendering on the client.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content)
<Trans>이를 통해 앱이 상호작용하기 전에 사용될 초기 스냅샷 값을 제공할 수 있습니다. 서버 렌더링에 의미 있는 초기값이 없다면 [컴포넌트가 클라이언트에서만 렌더링되도록 강제 설정](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content)할 수 있습니다.</Trans>

<Note>

Make sure that `getServerSnapshot` returns the same exact data on the initial client render as it returned on the server. For example, if `getServerSnapshot` returned some prepopulated store content on the server, you need to transfer this content to the client. One way to do this is to emit a `<script>` tag during server rendering that sets a global like `window.MY_STORE_DATA`, and read from that global on the client in `getServerSnapshot`. Your external store should provide instructions on how to do that.
<Trans>`getServerSnapshot`이 초기 클라이언트 렌더링에서 서버에서 반환한 것과 정확히 동일한 데이터를 반환하는지 확인하세요. 예를 들어 `getServerSnapshot`이 서버에 미리 채워진 스토어 콘텐츠를 반환한 경우 이 콘텐츠를 클라이언트로 전송해야 합니다. 이를 수행하는 일반적인 방법 중 하나는 서버 렌더링 중에 `window.MY_STORE_DATA`와 같은 글로벌을 설정하는 `<script>` 태그를 생성한 다음, 클라이언트에서 `getServerSnapshot`로부터 해당 글로벌을 읽어오는 것입니다. 외부 스토어에서 이를 수행하는 방법에 대한 지침을 제공해야 합니다.</Trans>

</Note>

---

## Troubleshooting<Trans>문제 해결</Trans> {/*troubleshooting*/}

### I'm getting an error: "The result of `getSnapshot` should be cached"<Trans>오류가 발생했습니다: "`getSnapshot`의 결과를 캐시해야 합니다."</Trans> {/*im-getting-an-error-the-result-of-getsnapshot-should-be-cached*/}

This error means your `getSnapshot` function returns a new object every time it's called, for example:
<Trans>이 오류는 `getSnapshot` 함수가 호출될 때마다 새 객체를 반환한다는 의미입니다, 예컨대:</Trans>

```js {2-5}
function getSnapshot() {
  // 🔴 Do not return always different objects from getSnapshot
  // 🔴 getSnapshot에서 항상 다른 객체를 반환하지 마세요
  return {
    todos: myStore.todos
  };
}
```

React will re-render the component if `getSnapshot` return value is different from the last time. This is why, if you always return a different value, you will enter an infinite loop and get this error.
<Trans>React는 `getSnapshot` 반환값이 지난번과 다르면 컴포넌트를 다시 렌더링합니다. 때문에 항상 다른 값을 반환하면 무한 루프에 빠지게 되어 이 오류가 발생합니다.</Trans>

Your `getSnapshot` object should only return a different object if something has actually changed. If your store contains immutable data, you can return that data directly:
<Trans>`getSnapshot`은 실제로 변경된 사항이 있는 경우에만 다른 객체를 반환해야 합니다. 스토어에 불변 데이터가 포함된 경우 해당 데이터를 직접 반환할 수 있습니다:</Trans>

```js {2-3}
function getSnapshot() {
  // ✅ You can return immutable data
  // ✅ 불변데이터는 반환할 수 있습니다
  return myStore.todos;
}
```

If your store data is mutable, your `getSnapshot` function should return an immutable snapshot of it. This means it *does* need to create new objects, but it shouldn't do this for every single call. Instead, it should store the last calculated snapshot, and return the same snapshot as the last time if the data in the store has not changed. How you determine whether mutable data has changed depends on your mutable store.
<Trans>스토어 데이터가 변이 가능한 경우 `getSnapshot` 함수는 해당 데이터의 불변 스냅샷을 반환해야 합니다. 즉 새 객체를 생성*해야* 하지만, 이 작업을 매 호출시마다 수행해서는 안 됩니다. 대신 마지막으로 계산된 스냅샷을 저장하고, 저장소의 데이터가 변경되지 않은 경우 지난번과 동일한 스냅샷을 반환해야 합니다. 변이 가능한 데이터가 변이되었는지를 확인하는 방법은 저장소가 구현된 방식에 따라 다릅니다.</Trans>

---

### My `subscribe` function gets called after every re-render<Trans>다시 렌더링할 때마다 `subscribe` 함수가 호출됩니다.</Trans> {/*my-subscribe-function-gets-called-after-every-re-render*/}

This `subscribe` function is defined *inside* a component so it is different on every re-render:
<Trans>이 `subscribe` 함수는 컴포넌트 내부에 정의되므로 다시 렌더링할 때마다 달라집니다:</Trans>

```js {4-7}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // 🚩 Always a different function, so React will resubscribe on every re-render
  // 🚩 항상 다른 함수이므로 React는 매 렌더링시마다 다시 구독합니다
  function subscribe() {
    // ...
  }

  // ...
}
```
  
React will resubscribe to your store if you pass a different `subscribe` function between re-renders. If this causes performance issues and you'd like to avoid resubscribing, move the `subscribe` function outside:
<Trans>재렌더링 사이에 다른 `subscribe` 함수를 전달하면 React가 스토어를 다시 구독합니다. 이로 인해 성능 문제가 발생하거나 스토어 재구독을 피하고 싶다면 `subscribe` 함수를 외부로 이동하세요:</Trans>

```js {6-9}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}

// ✅ Always the same function, so React won't need to resubscribe
// ✅ 항상 동일한 함수이므로 React는 이를 재구독할 필요가 없습니다
function subscribe() {
  // ...
}
```

Alternatively, wrap `subscribe` into [`useCallback`](/reference/react/useCallback) to only resubscribe when some argument changes:
<Trans>또는 일부 인수가 변경될 때만 다시 구독하도록 `subscribe`을 [`useCallback`](/reference/react/useCallback)으로 감싸세요:</Trans>

```js {4-8}
function ChatIndicator({ userId }) {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // ✅ Same function as long as userId doesn't change
  const subscribe = useCallback(() => {
    // ...
  }, [userId]);

  // ...
}
```
