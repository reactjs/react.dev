---
title: startTransition
translators: [김아영]
---

<Intro>

`startTransition` lets you update the state without blocking the UI.
<Trans>`startTransition`은 UI를 차단하지 않고 state를 업데이트할 수 있습니다.</Trans>

```js
startTransition(scope)
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `startTransition(scope)` {/*starttransitionscope*/}

The `startTransition` function lets you mark a state update as a transition.
<Trans>`startTransition` 함수를 사용하면 state 업데이트를 트랜지션으로 표시할 수 있습니다.</Trans>

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

* `scope`: A function that updates some state by calling one or more [`set` functions.](/reference/react/useState#setstate) React immediately calls `scope` with no parameters and marks all state updates scheduled synchronously during the `scope` function call as transitions. They will be [non-blocking](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators.](/reference/react/useTransition#preventing-unwanted-loading-indicators)
(#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators.](#preventing-unwanted-loading-indicators)
<Trans outdent>`scope`: 하나 이상의 [`set` 함수를 호출하여 일부 state를 업데이트하는 함수.](/reference/react/useState#setstate) React는 매개변수 없이 `scope`를 즉시 호출하고 `scope` 함수 호출 중에 동기적으로 예약된 모든 state 업데이트를 트랜지션으로 표시합니다. 이는 [논블로킹](#marking-a-state-update-as-non-blocking-transition)이고, [원치 않는 로딩을 표시하지 않을 것입니다.](#preventing-unwanted-loading-indicators)</Trans>

#### Returns<Trans>반환값</Trans> {/*returns*/}

`startTransition` does not return anything.
<Trans>`startTransition`은 아무것도 반환하지 않습니다.</Trans>

#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

* `startTransition` does not provide a way to track whether a transition is pending. To show a pending indicator while the transition is ongoing, you need [`useTransition`](/reference/react/useTransition) instead.
<Trans>`startTransition`은 트랜지션이 'pending'인지 추적하는 방법을 제공하지 않습니다. 트랜지션이 진행 중일 때 'pending' 표시기를 보여주고 싶다면, 대신 [`useTransition`](/reference/react/useTransition)이 필요합니다.</Trans>

* You can wrap an update into a transition only if you have access to the `set` function of that state. If you want to start a transition in response to some prop or a custom Hook return value, try [`useDeferredValue`](/reference/react/useDeferredValue) instead.
<Trans>해당 state의 `set` 함수에 접근할 수 있는 경우에만 업데이트를 트랜지션으로 감쌀 수 있습니다. 일부 prop이나 커스텀 훅 값에 대한 응답으로 트랜지션을 시작하려면, 대신 [`useDeferredValue`](/reference/react/useDeferredValue)를 사용해보세요.</Trans>

* The function you pass to `startTransition` must be synchronous. React immediately executes this function, marking all state updates that happen while it executes as transitions. If you try to perform more state updates later (for example, in a timeout), they won't be marked as transitions.
<Trans>`startTransition`에 전달하는 함수는 동기식이어야 합니다. React는 이 함수를 즉시 실행하여, 실행하는 동안 발생하는 모든 state 업데이트를 트랜지션으로 표시합니다. 나중에 더 많은 state 업데이트를 수행하려고 하면(예: 타임아웃), 트랜지션으로 표시되지 않습니다.</Trans>

* A state update marked as a transition will be interrupted by other state updates. For example, if you update a chart component inside a transition, but then start typing into an input while the chart is in the middle of a re-render, React will restart the rendering work on the chart component after handling the input state update.
<Trans>트랜지션으로 표시된 state 업데이트는 다른 state 업데이트에 의해 중단됩니다. 예를 들어, 트랜지션 내에서 차트 컴포넌트를 업데이트한 다음, 차트가 다시 렌더링되는 도중에 입력을 시작하면 React는 입력 업데이트를 처리한 후 차트 컴포넌트에서 렌더링 작업을 다시 시작합니다.</Trans>

* Transition updates can't be used to control text inputs.
<Trans>트랜지션 업데이트는 텍스트 입력을 제어하는 데 사용할 수 없습니다.</Trans>

* If there are multiple ongoing transitions, React currently batches them together. This is a limitation that will likely be removed in a future release.
<Trans>진행 중인 트랜지션이 여러 개 있는 경우, React는 현재 트랜지션을 함께 일괄 처리합니다. 이는 향후 릴리스에서 제거될 가능성이 높은 제한 사항입니다.</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Marking a state update as a non-blocking transition<Trans>state 업데이트를 논블로킹 트랜지션으로 표시하기</Trans> {/*marking-a-state-update-as-a-non-blocking-transition*/}

You can mark a state update as a *transition* by wrapping it in a `startTransition` call:
<Trans>state 업데이트는 `startTransition` 호출로 감싸 *트랜지션*으로 표시할 수 있습니다:</Trans>

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Transitions let you keep the user interface updates responsive even on slow devices.
<Trans>트랜지션을 사용하면 느린 기기에서도 사용자 인터페이스 업데이트를 반응성 있게 유지할 수 있습니다.</Trans>

With a transition, your UI stays responsive in the middle of a re-render. For example, if the user clicks a tab but then change their mind and click another tab, they can do that without waiting for the first re-render to finish.
<Trans>트랜지션을 사용하면 재렌더링 도중에도 UI가 반응성을 유지합니다. 예를들어, 사용자가 탭을 클릭했다가 마음이 바뀌어 다른 탭을 클릭하면 첫 번째 리렌더링이 완료될 때까지 기다릴 필요 없이 다른 탭을 클릭할 수 있습니다.</Trans>

<Note>
`startTransition` is very similar to [`useTransition`](/reference/react/useTransition), except that it does not provide the `isPending` flag to track whether a transition is ongoing. You can call `startTransition` when `useTransition` is not available. For example, `startTransition` works outside components, such as from a data library.
<Trans>`startTransition`은 트랜지션이 진행 중인지 여부를 추적하기 위한 `isPending` 플래그를 제공하지 않는다는 점을 제외하면 [`useTransition`](/reference/react/useTransition)과 매우 유사합니다. `useTransition`을 사용할 수 없을 때 `startTransition`을 호출할 수 있습니다. 예를들어, `startTransition`은 데이터 라이브러리와 같은 외부 컴포넌트에서 작동합니다.</Trans>

[Learn about transitions and see examples on the `useTransition` page.](/reference/react/useTransition)
<Trans>[`useTransition` 페이지에서 트랜지션에 대해 자세히 알아보고 예제를 확인하세요.](/reference/react/useTransition)</Trans>
</Note>
