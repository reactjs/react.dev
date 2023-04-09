---
title: Referencing Values with Refs
translatedTitle: ref로 값 참조하기
translators: [조성민, 정재남]
---

<Intro>

When you want a component to "remember" some information, but you don't want that information to [trigger new renders](/learn/render-and-commit), you can use a *ref*.
<Trans>컴포넌트가 특정 정보를 '기억'하도록 하고 싶지만 해당 정보가 [새 렌더링을 촉발](/learn/render-and-commit)하지 않도록 하려는 경우 *ref*를 사용할 수 있습니다.</Trans>

</Intro>

<YouWillLearn>

- How to add a ref to your component
- How to update a ref's value
- How refs are different from state
- How to use refs safely

<TransBlock>
- 컴포넌트에 ref를 추가하는 방법
- ref 값을 업데이트하는 방법
- state와 ref의 차이점
- ref를 안전하게 사용하는 방법
</TransBlock>

</YouWillLearn>

## Adding a ref to your component<Trans>컴포넌트에 ref 추가하기</Trans> {/*adding-a-ref-to-your-component*/}

You can add a ref to your component by importing the `useRef` Hook from React:
<Trans>React에서 `useRef` 훅을 가져와서 컴포넌트에 ref를 추가할 수 있습니다:</Trans>

```js
import { useRef } from 'react';
```

Inside your component, call the `useRef` Hook and pass the initial value that you want to reference as the only argument. For example, here is a ref to the value `0`:
<Trans>컴포넌트 내부에서 `useRef` 훅을 호출하고 참조할 초기값을 인자로 전달하십시오. 예를 들어,값 `0`은 ref에 대한 초기값입니다:</Trans>

```js
const ref = useRef(0);
```

`useRef` returns an object like this:
<Trans>`useRef`는 다음과 같은 객체를 반환합니다:</Trans>

```js
{ 
  current: 0 // The value you passed to useRef
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="An arrow with 'current' written on it stuffed into a pocket with 'ref' written on it." />

You can access the current value of that ref through the `ref.current` property. This value is intentionally mutable, meaning you can both read and write to it. It's like a secret pocket of your component that React doesn't track. (This is what makes it an "escape hatch" from React's one-way data flow--more on that below!)
<Trans>`ref.current` 속성을 통해 해당 ref의 현재 값에 액세스할 수 있습니다. 이 값은 의도적으로 변경 가능하므로 읽기와 쓰기가 모두 가능합니다. React가 추적하지 않는 컴포넌트의 비밀 주머니와 같습니다. (이것이 바로 React의 단방향 데이터 흐름에서 "탈출구"가 되는 이유입니다. 아래에서 자세히 설명합니다!)</Trans>

Here, a button will increment `ref.current` on every click:
<Trans>여기서 버튼은 클릭할 때마다 `ref.current`를 증가시킵니다:</Trans>

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

The ref points to a number, but, like [state](/learn/state-a-components-memory), you could point to anything: a string, an object, or even a function. Unlike state, ref is a plain JavaScript object with the `current` property that you can read and modify.
<Trans>여기서의 ref는 숫자를 가리키고 있지만, [state](/learn/state-a-components-memory)와 마찬가지로 문자열, 객체, 함수 등 무엇이든 가리킬 수 있습니다. state와 달리 ref는 `current` 속성을 읽고 수정할 수 있는 일반 JavaScript 객체입니다.</Trans>

Note that **the component doesn't re-render with every increment.** Like state, refs are retained by React between re-renders. However, setting state re-renders a component. Changing a ref does not!
<Trans>**컴포넌트는 ref가 증가할 때마다 리렌더링되지 않는다**는 점에 유의하세요. state와 마찬가지로 ref는 리렌더링 사이에 React에 의해 유지됩니다. state를 설정하면 컴포넌트가 다시 렌더링됩니다. 반면 ref를 변경하면 그렇지 않습니다!</Trans>

## Example: building a stopwatch<Trans>예제: 스톱워치 만들기</Trans> {/*example-building-a-stopwatch*/}

You can combine refs and state in a single component. For example, let's make a stopwatch that the user can start or stop by pressing a button. In order to display how much time has passed since the user pressed "Start", you will need to keep track of when the Start button was pressed and what the current time is. **This information is used for rendering, so you'll keep it in state:**
<Trans>ref와 state를 단일 컴포넌트로 결합할 수 있습니다. 예를 들어 사용자가 버튼을 눌러 시작하거나 중지할 수 있는 스톱워치를 만들어 봅시다. 사용자가 'Start'를 누른 후 얼마나 시간이 지났는지 표시하려면 시작 버튼을 누른 시점과 현재 시간을 추적해야 합니다. **이 정보는 렌더링에 사용되므로 state를 유지해야 합니다:**</Trans>

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

When the user presses "Start", you'll use [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval) in order to update the time every 10 milliseconds:
<Trans>사용자가 'Start'를 누르면 10밀리초마다 시간을 업데이트하기 위해 [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval)을 사용하게 됩니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // Start counting.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Update the current time every 10ms.
      setNow(Date.now());
    }, 10);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
    </>
  );
}
```

</Sandpack>

When the "Stop" button is pressed, you need to cancel the existing interval so that it stops updating the `now` state variable. You can do this by calling [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval), but you need to give it the interval ID that was previously returned by the `setInterval` call when the user pressed Start. You need to keep the interval ID somewhere. **Since the interval ID is not used for rendering, you can keep it in a ref:**
<Trans>"Stop" 버튼을 누르면 `now` state 변수의 업데이트를 중지하도록 기존 interval을 취소해야 합니다. 이 작업은 [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)을 호출하여 수행할 수 있지만, 사용자가 시작을 눌렀을 때 이전에 `setInterval` 호출에서 반환한 interval ID를 제공해야 합니다. interval ID를 어딘가에 보관해야 합니다. **interval ID는 렌더링에 사용되지 않으므로 ref에 보관할 수 있습니다.**</Trans>

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

</Sandpack>

When a piece of information is used for rendering, keep it in state. When a piece of information is only needed by event handlers and changing it doesn't require a re-render, using a ref may be more efficient.
<Trans>렌더링에 정보가 사용되는 경우 해당 정보를 state로 유지하세요. 이벤트 핸들러만 정보를 필요로 하고 변경해도 다시 렌더링할 필요가 없는 경우, ref를 사용하는 것이 더 효율적일 수 있습니다.</Trans>

## Differences between refs and state<Trans>ref와 state의 차이점</Trans> {/*differences-between-refs-and-state*/}

Perhaps you're thinking refs seem less "strict" than state—you can mutate them instead of always having to use a state setting function, for instance. But in most cases, you'll want to use state. Refs are an "escape hatch" you won't need often. Here's how state and refs compare:
<Trans>어쩌면 ref가 state보다 덜 "엄격"해 보인다고 생각할 수도 있습니다. 항상 state 설정자 함수를 사용하지 않고도 변이할 수 있기 때문입니다. 하지만 대부분의 경우 state를 사용하고 싶을 것입니다. ref는 자주 사용하지 않는 "탈출구"입니다. state와 ref를 비교하면 다음과 같습니다:</Trans>

| refs                                                                                  | state                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)` returns `{ current: initialValue }`                            | `useState(initialValue)` returns the current value of a state variable and a state setter function ( `[value, setValue]`) |
| Doesn't trigger re-render when you change it.                                         | Triggers re-render when you change it.                                                                                    |
| Mutable—you can modify and update `current`'s value outside of the rendering process. | "Immutable"—you must use the state setting function to modify state variables to queue a re-render.                       |
| You shouldn't read (or write) the `current` value during rendering. | You can read state at any time. However, each render has its own [snapshot](/learn/state-as-a-snapshot) of state which does not change.     |

<TransBlock>
| refs                                                             | state                                                                                                     |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)`는 `{ current: initialValue }`을 반환        | `useState(initialValue)`는 state 변수의 현재값과 state 설정자함수(`[value, setValue]`)를 반환                  |
| 변경 시 리렌더링을 촉발하지 않음                                     | 변경 시 리렌더링을 촉발함                                                                                   |
| Mutable— 렌더링 프로세스 외부에서 current 값을 수정하고 업데이트할 수 있음 | "Immutable"— state setting 함수를 사용하여 state 변수를 수정해 리렌더링을 대기열에 추가해야함                      |
| 렌더링 중에는 `current` 값을 읽거나 쓰지 않아야 함                      | 언제든지 state를 읽을 수 있음. 각 렌더링에는 변경되지 않는 자체 state [snapshot](/learn/state-as-a-snapshot)이 있음 |
</TransBlock>

Here is a counter button that's implemented with state:
<Trans>다음은 state와 함께 구현된 카운터 버튼입니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You clicked {count} times
    </button>
  );
}
```

</Sandpack>

Because the `count` value is displayed, it makes sense to use a state value for it. When the counter's value is set with `setCount()`, React re-renders the component and the screen updates to reflect the new count.
<Trans>`count` 값이 표시되므로 state 값을 사용하는 것이 합리적입니다. 카운터 값이 `setCount()`로 설정되면 React는 컴포넌트를 다시 렌더링하고 화면이 새로운 카운트를 반영하도록 업데이트합니다.</Trans>

If you tried to implement this with a ref, React would never re-render the component, so you'd never see the count change! See how clicking this button **does not update its text**:
<Trans>만약 이것을 ref로 구현하려고 한다면, React는 컴포넌트를 다시 렌더링하지 않으므로 카운트가 변경되는 것을 볼 수 없을 것입니다! 이 버튼을 클릭해도 **텍스트가 업데이트되지 않는 방법**을 확인하세요:</Trans>

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // This doesn't re-render the component!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      You clicked {countRef.current} times
    </button>
  );
}
```

</Sandpack>

This is why reading `ref.current` during render leads to unreliable code. If you need that, use state instead.
<Trans>이것이 렌더링 중에 `ref.current`를 읽으면 코드가 불안정해지는 이유입니다. 필요하다면 state를 대신 사용하세요.</Trans>

<DeepDive>

#### How does useRef work inside?<Trans>ref는 내부에서 어떻게 작동하나요?</Trans> {/*how-does-use-ref-work-inside*/}

Although both `useState` and `useRef` are provided by React, in principle `useRef` could be implemented _on top of_ `useState`. You can imagine that inside of React, `useRef` is implemented like this:
<Trans>useState와 useRef는 모두 React에서 제공하지만, 원칙적으로 useRef는 useState 위에 구현될 수 있습니다. React 내부에서 useRef는 다음과 같이 구현된다고 상상할 수 있습니다:</Trans>

```js
// Inside of React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

During the first render, `useRef` returns `{ current: initialValue }`. This object is stored by React, so during the next render the same object will be returned. Note how the state setter is unused in this example. It is unnecessary because `useRef` always needs to return the same object!
<Trans>첫 번째 렌더링 중에 `useRef` 는  `{ current: initialValue }`를 반환합니다. 이 객체는 React에 의해 저장되므로 다음 렌더링 중에 동일한 객체가 반환됩니다. 이 예제에서 state setter가 어떻게 사용되지 않는지 주목하세요. `useRef`는 항상 동일한 객체를 반환해야 하기 때문에 불필요합니다!</Trans>

React provides a built-in version of `useRef` because it is common enough in practice. But you can think of it as a regular state variable without a setter. If you're familiar with object-oriented programming, refs might remind you of instance fields--but instead of `this.something` you write `somethingRef.current`.
<Trans>React는 충분히 일반적인 상황이라 판단하고 내장된 버전의 `useRef`를 제공합니다. ref를 설정자가 없는 일반 state 변수라고 생각하면 됩니다. 객체지향 프로그래밍에 익숙하다면 인스턴스 필드를 떠올릴 수 있는데, `this.something` 대신 `somethingRef.current`를 사용하면 됩니다.</Trans>

</DeepDive>

## When to use refs<Trans>ref를 사용해야 하는 경우</Trans> {/*when-to-use-refs*/}

Typically, you will use a ref when your component needs to "step outside" React and communicate with external APIs—often a browser API that won't impact the appearance of the component. Here are a few of these rare situations:
<Trans>일반적으로 ref는 컴포넌트가 React로부터 "외부로 나가서" 외부 API, 즉 컴포넌트의 형상에 영향을 주지 않는 브라우저 API 등과 통신해야 할 때 사용합니다. 다음은 이러한 드문 상황 중 몇가지입니다:</Trans>

- Storing [timeout IDs](https://developer.mozilla.org/docs/Web/API/setTimeout)
- Storing and manipulating [DOM elements](https://developer.mozilla.org/docs/Web/API/Element), which we cover on [the next page](/learn/manipulating-the-dom-with-refs)
- Storing other objects that aren't necessary to calculate the JSX.

<TransBlock>
- [timeout ID](https://developer.mozilla.org/docs/Web/API/setTimeout) 저장
- [다음 페이지](/learn/manipulating-the-dom-with-refs)에서 다룰 [DOM elements](https://developer.mozilla.org/docs/Web/API/Element) 저장 및 조작
- JSX를 계산하는 데 필요하지 않은 다른 객체 저장
</TransBlock>

If your component needs to store some value, but it doesn't impact the rendering logic, choose refs.
<Trans>컴포넌트에 일부 값을 저장해야 하지만 렌더링 로직에는 영향을 미치지 않는 경우 ref를 선택하세요.</Trans>

## Best practices for refs<Trans>ref 모범 사례</Trans> {/*best-practices-for-refs*/}

Following these principles will make your components more predictable:
<Trans>다음 원칙을 따르면 컴포넌트의 예측 가능성을 높일 수 있습니다:</Trans>

- **Treat refs as an escape hatch.** Refs are useful when you work with external systems or browser APIs. If much of your application logic and data flow relies on refs, you might want to rethink your approach.
- **Don't read or write `ref.current` during rendering.** If some information is needed during rendering, use [state](/learn/state-a-components-memory) instead. Since React doesn't know when `ref.current` changes, even reading it while rendering makes your component's behavior difficult to predict. (The only exception to this is code like `if (!ref.current) ref.current = new Thing()` which only sets the ref once during the first render.)
 
<TransBlock>
- **ref를 탈출구로 취급하세요**. ref는 외부 시스템이나 브라우저 API로 작업할 때 유용합니다. 애플리케이션 로직과 데이터 흐름의 대부분이 ref에 의존하는 경우 접근 방식을 재고해봐야 할 수도 있습니다.
- **렌더링 중에는 `ref.current`를 읽거나 쓰지 마세요.** 렌더링 중에 일부 정보가 필요한 경우, 대신 [state](/learn/state-a-components-memory)를 사용하세요. React는 `ref.current`가 언제 변경되는지 알지 못하기 때문에, 렌더링 중에 읽어도 컴포넌트의 동작을 예측하기 어렵습니다. (유일한 예외는 첫 번째 렌더링 중에 ref를 한 번만 설정하는 `if (!ref.current) ref.current = new Thing()`과 같은 코드입니다).
</TransBlock>

Limitations of React state don't apply to refs. For example, state acts like a [snapshot for every render](/learn/state-as-a-snapshot) and [doesn't update synchronously.](/learn/queueing-a-series-of-state-updates) But when you mutate the current value of a ref, it changes immediately:
<Trans>React state의 제한은 ref에는 적용되지 않습니다. 예를 들어 state는 [모든 렌더링에 대해 스냅샷](/learn/state-as-a-snapshot)처럼 작동하며 [동기적으로 업데이트](/learn/queueing-a-series-of-state-updates)되지 않습니다. 하지만 ref의 현재 값을 변이하면 즉시 변경됩니다:</Trans>

```js
ref.current = 5;
console.log(ref.current); // 5
```

This is because **the ref itself is a regular JavaScript object,** and so it behaves like one.
<Trans>이는 **ref 자체가 일반 JavaScript 객체이므로** JavaScript 객체처럼 동작하기 때문입니다.</Trans>

You also don't need to worry about [avoiding mutation](/learn/updating-objects-in-state) when you work with a ref. As long as the object you're mutating isn't used for rendering, React doesn't care what you do with the ref or its contents.
<Trans>또한 ref로 작업할 때 [변이를 피하고자](/learn/updating-objects-in-state) 조심할 필요가 없습니다. 변이하는 객체가 렌더링에 사용되지 않는 한, React는 ref나 그 콘텐츠로 무엇을 하든 상관하지 않습니다.</Trans>

## Refs and the DOM<Trans>Ref와 DOM</Trans> {/*refs-and-the-dom*/}

You can point a ref to any value. However, the most common use case for a ref is to access a DOM element. For example, this is handy if you want to focus an input programmatically. When you pass a ref to a `ref` attribute in JSX, like `<div ref={myRef}>`, React will put the corresponding DOM element into `myRef.current`. You can read more about this in [Manipulating the DOM with Refs.](/learn/manipulating-the-dom-with-refs)
<Trans>ref는 모든 값을 가리킬 수 있습니다. 그러나 ref의 가장 일반적인 사용 사례는 DOM 요소에 액세스하는 것입니다. 예를 들어 프로그래밍 방식으로 input에 focus를 맞추고자 할 때 유용합니다. `<div ref={myRef}>`와 같이 JSX의 `ref` 어트리뷰트에 ref를 전달하면 React는 해당 DOM 엘리먼트를 `myRef.current`에 넣습니다. 이에 대한 자세한 내용은 [ref로 DOM 조작하기](/learn/manipulating-the-dom-with-refs)에서 확인할 수 있습니다.</Trans>

<Recap>

- Refs are an escape hatch to hold onto values that aren't used for rendering. You won't need them often.
- A ref is a plain JavaScript object with a single property called `current`, which you can read or set.
- You can ask React to give you a ref by calling the `useRef` Hook.
- Like state, refs let you retain information between re-renders of a component.
- Unlike state, setting the ref's `current` value does not trigger a re-render.
- Don't read or write `ref.current` during rendering. This makes your component hard to predict.

<TransBlock>
  - ref는 렌더링에 사용되지 않는 값을 유지하기 위한 탈출구입니다. 자주 필요하지 않습니다.
  - ref는 `current`라는 단일 프로퍼티를 가진 일반 JavaScript 객체로, 읽거나 설정할 수 있습니다.
  - `useRef` 훅을 호출하여 React에 ref를 제공하도록 요청할 수 있습니다.
  - state와 마찬가지로 ref를 사용하면 컴포넌트의 리렌더링 사이에 정보를 유지할 수 있습니다.
  - state와 달리 ref의 `current` 값을 설정해도 리렌더링이 촉발되지 않습니다.
  - 렌더링 중에는 `ref.current`를 읽거나 쓰지 마세요. 이렇게 하면 컴포넌트를 예측하기 어렵습니다.
</TransBlock>

</Recap>

<Challenges>

#### Fix a broken chat input<Trans>잘못된 chat input 고치기</Trans> {/*fix-a-broken-chat-input*/}

Type a message and click "Send". You will notice there is a three second delay before you see the "Sent!" alert. During this delay, you can see an "Undo" button. Click it. This "Undo" button is supposed to stop the "Sent!" message from appearing. It does this by calling [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) for the timeout ID saved during `handleSend`. However, even after "Undo" is clicked, the "Sent!" message still appears. Find why it doesn't work, and fix it.
<Trans>메시지를 입력하고 "Send"를 클릭하세요. "Sent!"라는 알림이 표시되기까지 3초 정도 지연되는 것을 확인할 수 있습니다. 이 지연 시간 동안 "Undo" 버튼이 표시됩니다. 이 버튼을 클릭하세요. 이 "Undo" 버튼은 "Sent!" 메시지가 표시되지 않도록 하기 위한 것입니다. 이 버튼은 `handleSend` 중에 저장된 timeout ID에 대해 [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout)을 호출하여 이를 수행합니다. 그러나 "Undo"를 클릭한 후에도 "Sent!" 메시지가 계속 표시됩니다. 작동하지 않는 이유를 찾아서 수정하세요.</Trans>

<Hint>

Regular variables like `let timeoutID` don't "survive" between re-renders because every render runs your component (and initializes its variables) from scratch. Should you keep the timeout ID somewhere else?
<Trans>`let timeoutID`와 같은 일반 변수는 렌더링할 때마다 컴포넌트를 처음부터 실행하고 변수를 초기화하기 때문에 리렌더링 사이에 "살아남지" 못합니다. 타임아웃 ID를 다른 곳에 보관해야 할까요?</Trans>

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

Whenever your component re-renders (such as when you set state), all local variables get initialized from scratch. This is why you can't save the timeout ID in a local variable like `timeoutID` and then expect another event handler to "see" it in the future. Instead, store it in a ref, which React will preserve between renders.
<Trans>컴포넌트가 다시 렌더링할 때마다(예: state를 설정할 때) 모든 로컬 변수가 처음부터 초기화됩니다. 그렇기 때문에 `timeoutID`와 같은 로컬 변수에 timeout ID를 저장한 다음 다른 이벤트 핸들러가 나중에 이를 "볼" 것으로 기대할 수 없습니다. 대신, React가 렌더링 사이에 보존하는 ref에 저장하세요.</Trans>

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>


#### Fix a component failing to re-render<Trans>리렌더링되지 않는 문제 해결하기</Trans> {/*fix-a-component-failing-to-re-render*/}

This button is supposed to toggle between showing "On" and "Off". However, it always shows "Off". What is wrong with this code? Fix it.
<Trans>이 버튼은 "On와 "Off" 표시 사이를 전환해야 합니다. 그러나 항상 "꺼짐"으로 표시됩니다. 이 코드에 어떤 문제가 있나요? 수정하세요.</Trans>

<Sandpack>

```js
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

<Solution>

In this example, the current value of a ref is used to calculate the rendering output: `{isOnRef.current ? 'On' : 'Off'}`. This is a sign that this information should not be in a ref, and should have instead been put in state. To fix it, remove the ref and use state instead:
<Trans>이 예제에서는 ref의 현재 값이 렌더링 출력을 계산하는 데 사용됩니다: `{isOnRef.current ? 'On' : 'Off'}`입니다. 이는 이 정보가 ref에 있어서는 안 되며 대신 state에 넣어야 한다는 신호입니다. 이 문제를 해결하려면 ref를 제거하고 대신 state를 사용하세요:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Fix debouncing<Trans>디바운싱 수정하기</Trans> {/*fix-debouncing*/}

In this example, all button click handlers are ["debounced".](https://redd.one/blog/debounce-vs-throttle) To see what this means, press one of the buttons. Notice how the message appears a second later. If you press the button while waiting for the message, the timer will reset. So if you keep clicking the same button fast many times, the message won't appear until a second *after* you stop clicking. Debouncing lets you delay some action until the user "stops doing things".
<Trans>이 예제에서는 모든 버튼 클릭 핸들러가 ["디바운스"](https://redd.one/blog/debounce-vs-throttle)되어 있습니다. 이것이 무엇을 의미하는지 확인하려면 버튼 중 하나를 누르세요. 1초 후에 메시지가 어떻게 표시되는지 확인하세요. 메시지를 기다리는 동안 버튼을 누르면 타이머가 재설정됩니다. 따라서 같은 버튼을 계속 빠르게 여러 번 클릭하면 클릭을 멈춘 후 1초가 지나야 메시지가 표시됩니다. 디바운싱을 사용하면 사용자가 "작업을 중단"할 때까지 일부 작업을 지연시킬 수 있습니다.</Trans>

This example works, but not quite as intended. The buttons are not independent. To see the problem, click one of the buttons, and then immediately click another button. You'd expect that after a delay, you would see both button's messages. But only the last button's message shows up. The first button's message gets lost.
<Trans>이 예제는 작동하지만 의도한 대로 작동하지는 않습니다. 버튼은 독립적이지 않습니다. 문제를 확인하려면 버튼 중 하나를 클릭한 다음 즉시 다른 버튼을 클릭하세요. 잠시 후 두 버튼의 메시지가 모두 표시될 것으로 예상할 수 있습니다. 하지만 마지막 버튼의 메시지만 표시됩니다. 첫 번째 버튼의 메시지는 사라집니다.</Trans>

Why are the buttons interfering with each other? Find and fix the issue.
<Trans>버튼이 서로 간섭하는 이유는 무엇인가요? 문제를 찾아서 해결하세요.</Trans>

<Hint>

The last timeout ID variable is shared between all `DebouncedButton` components. This is why clicking one button resets another button's timeout. Can you store a separate timeout ID for each button?
<Trans>마지막 타임아웃 ID 변수는 모든 `DebouncedButton` 컴포넌트 간에 공유됩니다. 그렇기 때문에 한 버튼을 클릭하면 다른 버튼의 시간 초과가 재설정됩니다. 각 버튼에 대해 별도의 timeout ID를 저장할 수 있나요?</Trans>

</Hint>

<Sandpack>

```js
import { useState } from 'react';

let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

A variable like `timeoutID` is shared between all components. This is why clicking on the second button resets the first button's pending timeout. To fix this, you can keep timeout in a ref. Each button will get its own ref, so they won't conflict with each other. Notice how clicking two buttons fast will show both messages.
<Trans>`timeoutID`와 같은 변수는 모든 컴포넌트 간에 공유됩니다. 그렇기 때문에 두 번째 버튼을 클릭하면 첫 번째 버튼의 보류 중인 타임아웃이 재설정됩니다. 이 문제를 해결하려면 타임아웃을 ref에 보관하면 됩니다. 각 버튼은 고유한 ref를 가지므로 서로 충돌하지 않습니다. 두 버튼을 빠르게 클릭하면 두 메시지가 모두 표시되는 것을 확인할 수 있습니다.</Trans>

<Sandpack>

```js
import { useState, useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### Read the latest state<Trans>최신 state 읽기</Trans> {/*read-the-latest-state*/}

In this example, after you press "Send", there is a small delay before the message is shown. Type "hello", press Send, and then quickly edit the input again. Despite your edits, the alert would still show "hello" (which was the value of state [at the time](/learn/state-as-a-snapshot#state-over-time) the button was clicked).
<Trans>이 예에서는 "Send"를 누른 후 메시지가 표시되기까지 약간의 지연 시간이 있습니다. "hello"를 입력하고 보내기를 누른 다음 입력을 다시 빠르게 편집합니다. 편집한 내용에도 불구하고 알림에는 여전히 (버튼을 클릭할 [당시의](/learn/state-as-a-snapshot#state-over-time) state 값인) "hello"가 표시됩니다.</Trans>

Usually, this behavior is what you want in an app. However, there may be occasional cases where you want some asynchronous code to read the *latest* version of some state. Can you think of a way to make the alert show the *current* input text rather than what it was at the time of the click?
<Trans>일반적으로 이 동작은 앱에서 원하는 것입니다. 그러나 일부 비동기 코드가 특정 state의 *최신* 버전을 읽기를 원하는 경우가 있을 수 있습니다. 알림에 클릭 당시의 텍스트가 아닌 *현재* 입력 텍스트를 표시하는 방법을 생각해낼 수 있나요?</Trans>

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

State works [like a snapshot](/learn/state-as-a-snapshot), so you can't read the latest state from an asynchronous operation like a timeout. However, you can keep the latest input text in a ref. A ref is mutable, so you can read the `current` property at any time. Since the current text is also used for rendering, in this example, you will need *both* a state variable (for rendering), *and* a ref (to read it in the timeout). You will need to update the current ref value manually.
<Trans>state는 [스냅샷처럼](/learn/state-as-a-snapshot) 작동하므로, 타임아웃과 같은 비동기 작업에서 최신 state를 읽을 수 없습니다. 그러나 최신 입력 텍스트는 ref에 보관할 수 있습니다. ref는 변경 가능하므로 언제든지 `current` 속성을 읽을 수 있습니다. 현재 텍스트는 렌더링에도 사용되므로 이 예제에서는 state 변수(렌더링용)*와* ref(타임아웃 읽기용)가 모두 필요합니다. 현재 ref 값을 수동으로 업데이트해야 합니다.</Trans>

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
