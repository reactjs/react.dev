---
title: useDebugValue
---

<Intro>

`useDebugValue` is a React Hook that lets you add a label to a custom Hook in [React DevTools.](/learn/react-developer-tools)
<Trans>`useDebugValue` 는 [리액트 개발자 도구](/learn/react-developer-tools)에서 커스텀 훅에 레이블을 추가할 수 있는 리액트 훅입니다.</Trans>

```js
useDebugValue(value, format?)
```

</Intro>

<InlineToc />

---

## Reference <Trans>참조</Trans> {/*reference*/}

### `useDebugValue(value, format?)` {/*usedebugvalue*/}

Call `useDebugValue` at the top level of your [custom Hook](/learn/reusing-logic-with-custom-hooks) to display a readable debug value:
<Trans>읽을 수 있는 디버그 값을 표시하려면 [커스텀 훅](/learn/reusing-logic-with-custom-hooks)의 최상위 레벨에서 `useDebugValue`을 호출합니다.</Trans>

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

[See more examples below.](#usage)
[아래에서 더 많은 예를 참조하십시오.](#usage)

#### Parameters <Trans>매개변수</Trans> {/*parameters*/}

* `value`: The value you want to display in React DevTools. It can have any type.
<Trans>`value`: 리액트 개발자 도구에서 표시하려는 값입니다. 모든 유형을 가질 수 있습니다.</Trans>
* **optional** `format`: A formatting function. When the component is inspected, React DevTools will call the formatting function with the `value` as the argument, and then display the returned formatted value (which may have any type). If you don't specify the formatting function, the original `value` itself will be displayed.
<Trans>optional `format`: 포매팅 함수. 컴포넌트가 검사할 때, 리액트 개발자 도구는 인수로 포매팅 함수를 호출한 다음 반환된 포매팅된 값(모든 유형을 가질 수 있음)을 표시합니다. 포매팅 함수를 지정하지 않으면, 원본 `value` 자체가 표시됩니다.</Trans>

#### Returns <Trans>반환값</Trans> {/*returns*/}

`useDebugValue` does not return anything.
<Trans>`useDebugValue`는 아무것도 반환하지 않습니다.</Trans>

## Usage <Trans>사용법</Trans> {/*usage*/}

### Adding a label to a custom Hook <Trans>커스텀 훅에 레이블 추가</Trans> {/*adding-a-label-to-a-custom-hook*/}

Call `useDebugValue` at the top level of your [custom Hook](/learn/reusing-logic-with-custom-hooks) to display a readable <CodeStep step={1}>debug value</CodeStep> for [React DevTools.](/learn/react-developer-tools)
<Trans>[커스텀 훅](/learn/reusing-logic-with-custom-hooks)의 최상위 레벨에서 `useDebugValue`를 호출하여 리액트 개발자 도구가 읽을 수 있는 <CodeStep step={1}>디버그 값</CodeStep>을 표시합니다.</Trans>

```js [[1, 5, "isOnline ? 'Online' : 'Offline'"]]
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

This gives components calling `useOnlineStatus` a label like `OnlineStatus: "Online"` when you inspect them:
<Trans>이렇게 하면 검사할 때 컴포넌트는 `useOnlineStatus`를 `OnlineStatus: "Online"` 같은 레이블을 호출합니다.</Trans>

![A screenshot of React DevTools showing the debug value](/images/docs/react-devtools-usedebugvalue.png)

Without the `useDebugValue` call, only the underlying data (in this example, `true`) would be displayed.
<Trans>`useDebugValue` 호출이 없으면 기본 데이터(예시에서는 `true`)만 표시됩니다.</Trans>

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

export default function App() {
  return <StatusBar />;
}
```

```js useOnlineStatus.js active
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
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

<Note>

Don't add debug values to every custom Hook. It's most valuable for custom Hooks that are part of shared libraries and that have a complex internal data structure that's difficult to inspect.
<Trans>모든 커스텀 훅에 디버그 값을 추가하지 마십시오. 공유 라이브러리의 일부이고 검사하기 어려운 복잡한 내부 데이터를 가진 커스텀 훅에 가장 유용합니다.</Trans>

</Note>

---

### Deferring formatting of a debug value <Trans>디버그 값의 형식 지정 연기</Trans> {/*deferring-formatting-of-a-debug-value*/}

You can also pass a formatting function as the second argument to `useDebugValue`:
<Trans>포매팅 함수의 두번째 인수로 useDebugValue 를 전달할 수 있습니다.</Trans>

```js [[1, 1, "date", 18], [2, 1, "date.toDateString()"]]
useDebugValue(date, date => date.toDateString());
```

Your formatting function will receive the <CodeStep step={1}>debug value</CodeStep> as a parameter and should return a <CodeStep step={2}>formatted display value</CodeStep>. When your component is inspected, React DevTools will call this function and display its result.
<Trans>포매팅 함수는 <CodeStep step={1}>디버그 값</CodeStep>을 매개변수로 받고 <CodeStep step={2}>포매팅 된 표시 값</CodeStep>을 반환해야 합니다. 컴포넌트가 검사할 때, 리액트 개발자 도구가 이 함수를 호출하고 그 결과를 표시합니다.</Trans>

This lets you avoid running potentially expensive formatting logic unless the component is actually inspected. For example, if `date` is a Date value, this avoids calling `toDateString()` on it for every render.
<Trans>이렇게 하면 컴포넌트가 실제로 검사되지 않는 한 잠재적으로 비용이 많이 드는 포매팅 로직을 실행하지 않아도 됩니다. 예를 들어 `date`가 날짜 값인 경우, 컴포넌트를 렌더링 할 때마다 `toDateString()`을 호출하지 않습니다.</Trans>
