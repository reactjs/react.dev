---
title: Queueing a Series of State Updates
translatedTitle: 여러 state 업데이트를 큐에 담기
translators: [전시윤, 정재남]
---

<Intro>

Setting a state variable will queue another render. But sometimes you might want to perform multiple operations on the value before queueing the next render. To do this, it helps to understand how React batches state updates.
<Trans>state 변수를 설정하면 다음 렌더링이 큐(대기열, queue)에 들어갑니다. 그러나 경우에 따라 다음 렌더링을 큐에 넣기 전에, 값에 대해 여러 작업을 수행하고 싶을 때도 있습니다. 이를 위해서는 React가 state 업데이트를 어떻게 배치하면 좋을지 이해하는 것이 도움이 됩니다.</Trans>

</Intro>

<YouWillLearn>

* What "batching" is and how React uses it to process multiple state updates
* How to apply several updates to the same state variable in a row

<TransBlock>
  - 일괄처리(배칭, batching)이란 무엇이며 React가 여러 state 업데이트를 처리하는 방법
  - 동일한 state 변수에서 여러 업데이트를 적용하는 방법
</TransBlock>

</YouWillLearn>

## React batches state updates<Trans>state 업데이트 일괄처리</Trans> {/*react-batches-state-updates*/}

You might expect that clicking the "+3" button will increment the counter three times because it calls `setNumber(number + 1)` three times:
<Trans>`setNumber(number + 1)` 를 세 번 호출하므로 “+3” 버튼을 클릭하면 세 번 증가할 것으로 예상할 수 있습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

However, as you might recall from the previous section, [each render's state values are fixed](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time), so the value of `number` inside the first render's event handler is always `0`, no matter how many times you call `setNumber(1)`:
<Trans>그러나 이전 세션에서 기억할 수 있듯이, [각 렌더링의 state 값은 고정](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)되어 있으므로, 첫번째 렌더링의 이벤트 핸들러의 `number` 값은 `setNumber(1)`을 몇 번 호출하든 항상 `0`입니다.</Trans>

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

But there is one other factor at play here. **React waits until *all* code in the event handlers has run before processing your state updates.** This is why the re-render only happens *after* all these `setNumber()` calls.
<Trans>여기에는 논의 되어야 할 또 다른 요인이 있습니다. **React는 state 업데이트를 하기 전에 이벤트 핸들러의 모든 코드가 실행될 때까지 기다립니다.** 이 때문에 리렌더링은 모든 `setNumber()` 호출이 완료된 이후에만 일어납니다.</Trans>

This might remind you of a waiter taking an order at the restaurant. A waiter doesn't run to the kitchen at the mention of your first dish! Instead, they let you finish your order, let you make changes to it, and even take orders from other people at the table.
<Trans>이는 음식점에서 주문을 받는 웨이터를 생각해 볼 수 있습니다. 웨이터는 첫번째 요리를 말하자마자 주방으로 달려가지 않습니다! 대신 주문이 끝날 때까지 기다렸다가 주문을 변경하고, 심지어 테이블에 있는 다른 사람의 주문도 받습니다.</Trans>

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="An elegant cursor at a restaurant places and order multiple times with React, playing the part of the waiter. After she calls setState() multiple times, the waiter writes down the last one she requested as her final order." />

This lets you update multiple state variables--even from multiple components--without triggering too many [re-renders.](/learn/render-and-commit#re-renders-when-state-updates) But this also means that the UI won't be updated until _after_ your event handler, and any code in it, completes. This behavior, also known as **batching,** makes your React app run much faster. It also avoids dealing with confusing "half-finished" renders where only some of the variables have been updated.
<Trans>이렇게 하면 너무 많은 [리렌더링](/learn/render-and-commit#re-renders-when-state-updates)을 촉발하지 않고도 여러 컴포넌트에서 나온 다수의 state 변수를 업데이트할 수 있습니다. 하지만 이는 이벤트 핸들러와 그 안에 있는 코드가 완료될 때까지 UI가 업데이트되지 않는다는 의미이기도 합니다. 일괄처리(배칭, batching)라고도 하는 이 동작은 React 앱을 훨씬 빠르게 실행할 수 있게 해줍니다. 또한 일부 변수만 업데이트된 "반쯤 완성된" 혼란스러운 렌더링을 처리하지 않아도 됩니다.</Trans>

**React does not batch across *multiple* intentional events like clicks**--each click is handled separately. Rest assured that React only does batching when it's generally safe to do. This ensures that, for example, if the first button click disables a form, the second click would not submit it again.
<Trans>**React는 클릭과 같은 *여러* 의도적인 이벤트에 대해 일괄 처리하지 않으며,** 각 클릭은 개별적으로 처리됩니다. React는 일반적으로 안전한 경우에만 일괄 처리를 수행하니 안심하세요. 예를 들어 첫 번째 버튼 클릭으로 양식이 비활성화되면 두 번째 클릭으로 양식이 다시 제출되지 않도록 보장합니다.</Trans>

## Updating the same state multiple times before the next render<Trans>다음 렌더링 전에 동일한 state 변수를 여러 번 업데이트하기</Trans> {/*updating-the-same-state-multiple-times-before-the-next-render*/}

It is an uncommon use case, but if you would like to update the same state variable multiple times before the next render, instead of passing the *next state value* like `setNumber(number + 1)`, you can pass a *function* that calculates the next state based on the previous one in the queue, like `setNumber(n => n + 1)`. It is a way to tell React to "do something with the state value" instead of just replacing it.
<Trans>흔한 사례는 아니지만, 다음 렌더링 전에 동일한 state 변수를 여러 번 업데이트 하고 싶다면 `setNumber(number + 1)` 와 같은 *다음 state 값*을 전달하는 대신, `setNumber(n => n + 1)` 와 같이 큐의 이전 state를 기반으로 다음 state를 계산하는 *함수*를 전달할 수 있습니다. 이는 단순히 state 값을 대체하는 것이 아니라 React에게 “state 값으로 무언가를 하라”고 지시하는 방법입니다.</Trans>

Try incrementing the counter now:
<Trans>카운터를 증가시켜보세요:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Here, `n => n + 1` is called an **updater function.** When you pass it to a state setter:
<Trans>여기서 `n => n + 1` 는 **업데이터 함수(updater function)**라고 부릅니다. 이를 state 설정자 함수에 전달 할 때:</Trans>

1. React queues this function to be processed after all the other code in the event handler has run.
2. During the next render, React goes through the queue and gives you the final updated state.

<TransBlock>
  1. React는 이벤트 핸들러의 다른 코드가 모두 실행된 후에 이 함수가 처리되도록 큐에 넣습니다.
  2. 다음 렌더링 중에 React는 큐를 순회하여 최종 업데이트된 state를 제공합니다.
</TransBlock>

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

Here's how React works through these lines of code while executing the event handler:
<Trans>React가 이벤트 핸들러를 수행하는 동안 여러 코드를 통해 작동하는 방식은 다음과 같습니다</Trans>

1. `setNumber(n => n + 1)`: `n => n + 1` is a function. React adds it to a queue.
1. `setNumber(n => n + 1)`: `n => n + 1` is a function. React adds it to a queue.
1. `setNumber(n => n + 1)`: `n => n + 1` is a function. React adds it to a queue.

<TransBlock>
  1. `setNumber(n => n + 1)`: `n => n + 1` 함수를 큐에 추가합니다.
  2. `setNumber(n => n + 1)`: `n => n + 1` 함수를 큐에 추가합니다.
  3. `setNumber(n => n + 1)`: `n => n + 1` 함수를 큐에 추가합니다.
</TransBlock>

When you call `useState` during the next render, React goes through the queue. The previous `number` state was `0`, so that's what React passes to the first updater function as the `n` argument. Then React takes the return value of your previous updater function and passes it to the next updater as `n`, and so on:
<Trans>다음 렌더링 중에 `useState` 를 호출하면 React는 큐를 순회합니다. 이전 `number` state는 `0`이었으므로 React는 이를 첫 번째 업데이터 함수에 `n` 인수로 전달합니다. 그런 다음 React는 이전 업데이터 함수의 반환값을 가져와서 다음 업데이터 함수에 `n` 으로 전달하는 식으로 반복합니다.</Trans>

|  queued update | `n` | returns |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

React stores `3` as the final result and returns it from `useState`.
<Trans>React는 `3`을 최종 결과로 저장하고 `useState`에서 반환합니다.</Trans>

This is why clicking "+3" in the above example correctly increments the value by 3.
<Trans>이것이 위 예제 “+3”을 클릭하면 값이 3씩 올바르게 증가하는 이유입니다.</Trans>

### What happens if you update state after replacing it<Trans>state를 교체한 후 업데이트하면 어떻게 될까요</Trans> {/*what-happens-if-you-update-state-after-replacing-it*/}

What about this event handler? What do you think `number` will be in the next render?
<Trans>이 이벤트 핸들러는 어떨까요? 다음 렌더링에서 `number`가 어떻게 될까요?</Trans>

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Here's what this event handler tells React to do:
<Trans>이 이벤트 핸들러가 React에게 지시하는 작업은 다음과 같습니다:</Trans>

1. `setNumber(number + 5)`: `number` is `0`, so `setNumber(0 + 5)`. React adds *"replace with `5`"* to its queue.
2. `setNumber(n => n + 1)`: `n => n + 1` is an updater function. React adds *that function* to its queue.

<TransBlock>
  1. `setNumber(number + 5)` : `number`는 `0`이므로 `setNumber(0 + 5)`입니다. React는 큐에 “*`5`*로 바꾸기”를 추가합니다.
  2. `setNumber(n => n + 1)` : `n => n + 1` 는 업데이터 함수입니다. React는 해당 함수를 큐에 추가합니다.
</TransBlock>

During the next render, React goes through the state queue:
<Trans>다음 렌더링 동안 React는 state 큐를 순회합니다:</Trans>

|   queued update       | `n` | returns |
|--------------|---------|-----|
| "replace with `5`" | `0` (unused) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

React stores `6` as the final result and returns it from `useState`. 
<Trans>React는 `6`을 최종 결과로 저장하고 `useState`에서 반환합니다.</Trans>

<Note>

You may have noticed that `setState(5)` actually works like `setState(n => 5)`, but `n` is unused!
<Trans>`setState(x)`가 실제로는 `setState(n => x)` 처럼 동작되지만 `n`이 사용되지 않는다는 것을 눈치채셨을 것입니다!</Trans>

</Note>

### What happens if you replace state after updating it<Trans>업데이트 후 state를 바꾸면 어떻게 될까요</Trans> {/*what-happens-if-you-replace-state-after-updating-it*/}

Let's try one more example. What do you think `number` will be in the next render?
<Trans>한 가지 예를 더 들어보겠습니다. 다음 렌더링에서 `number`가 어떻게 될까요?</Trans>

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
        setNumber(42);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Here's how React works through these lines of code while executing this event handler:
<Trans>이 이벤트 핸들러를 실행하는 동안 React가 이 코드를 통해 작동하는 방식은 다음과 같습니다:</Trans>

1. `setNumber(number + 5)`: `number` is `0`, so `setNumber(0 + 5)`. React adds *"replace with `5`"* to its queue.
2. `setNumber(n => n + 1)`: `n => n + 1` is an updater function. React adds *that function* to its queue.
3. `setNumber(42)`: React adds *"replace with `42`"* to its queue.

<TransBlock>
1. `setNumber(number + 5)`: `number` 는 `0` 이므로 `setNumber(0 + 5)`입니다. React는 *“`5`로 바꾸기”*를 큐에 추가합니다.
2. `setNumber(n => n + 1)`: `n => n + 1` 는 업데이터 함수입니다. React는 *이 함수*를 큐에 추가합니다.
3. `setNumber(42)`:  React는 *“`42`로 바꾸기”*를 큐에 추가합니다.
</TransBlock>

During the next render, React goes through the state queue:
<Trans>다음 렌더링 동안, React는 state 큐를 순회합니다:</Trans>

|   queued update       | `n` | returns |
|--------------|---------|-----|
| "replace with `5`" | `0` (unused) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| "replace with `42`" | `6` (unused) | `42` |

Then React stores `42` as the final result and returns it from `useState`.
<Trans>그런 다음 React는 `42`를 최종 결과로 저장하고 `useState`에서 반환합니다.</Trans>

To summarize, here's how you can think of what you're passing to the `setNumber` state setter:
<Trans>요약하자면, `setNumber` state 설정자 함수에 전달할 내용은 다음과 같이 생각할 수 있습니다:</Trans>

* **An updater function** (e.g. `n => n + 1`) gets added to the queue.
* **Any other value** (e.g. number `5`) adds "replace with `5`" to the queue, ignoring what's already queued.
<TransBlock>
- **업데이터 함수** (예: **`n => n + 1`**)가 큐에 추가됩니다.
- **다른 값** (예: 숫자 **`5`**)은 큐에 “`5`로 바꾸기”를 추가하며, 이미 큐에 대기중인 항목은 무시합니다.
</TransBlock>

After the event handler completes, React will trigger a re-render. During the re-render, React will process the queue. Updater functions run during rendering, so **updater functions must be [pure](/learn/keeping-components-pure)** and only *return* the result. Don't try to set state from inside of them or run other side effects. In Strict Mode, React will run each updater function twice (but discard the second result) to help you find mistakes.
<Trans>이벤트 핸들러가 완료되면 React는 리렌더링을 실행합니다. 리렌더링하는 동안 React는 큐를 처리합니다. 업데이터 함수는 렌더링 중에 실행되므로, **업데이터 함수는 [순수](/learn/keeping-components-pure)해야 하며** 결과만 *반환*해야 합니다. 업데이터 함수 내부에서 state를 변경하거나 다른 사이드 이팩트를 실행하려고 하지 마세요. Strict 모드에서 React는 각 업데이터 함수를 두 번 실행(두 번째 결과는 버림)하여 실수를 찾을 수 있도록 도와줍니다.</Trans>

### Naming conventions<Trans>명명 규칙</Trans> {/*naming-conventions*/}

It's common to name the updater function argument by the first letters of the corresponding state variable:
<Trans>업데이터 함수 인수의 이름은 해당 state 변수의 첫 글자로 지정하는 것이 일반적입니다:</Trans>

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

If you prefer more verbose code, another common convention is to repeat the full state variable name, like `setEnabled(enabled => !enabled)`, or to use a prefix like `setEnabled(prevEnabled => !prevEnabled)`.
<Trans>좀 더 자세한 코드를 선호하는 경우 `setEnabled(enabled => !enabled)`와 같이 전체 state 변수 이름을 반복하거나, `setEnabled(prevEnabled => !prevEnabled)`와 같은 접두사(prefix *“prev”*)를 사용하는 것이 일반적인 규칙입니다.</Trans>

<Recap>

* Setting state does not change the variable in the existing render, but it requests a new render.
* React processes state updates after event handlers have finished running. This is called batching.
* To update some state multiple times in one event, you can use `setNumber(n => n + 1)` updater function.

<TransBlock>
- state를 설정하더라도 기존 렌더링의 변수는 변경되지 않으며, 대신 새로운 렌더링을 요청합니다.
- React는 이벤트 핸들러가 실행을 마친 후 state 업데이트를 처리합니다. 이를 일괄처리(배칭, batching)라고 합니다.
- 하나의 이벤트에서 일부 state를 여러 번 업데이트하려면 `setNumber(n => n + 1)` 업데이터 함수를 사용할 수 있습니다.
</TransBlock>
</Recap>

<Challenges>

#### Fix a request counter<Trans>요청 카운터를 고쳐보세요</Trans> {/*fix-a-request-counter*/}

You're working on an art marketplace app that lets the user submit multiple orders for an art item at the same time. Each time the user presses the "Buy" button, the "Pending" counter should increase by one. After three seconds, the "Pending" counter should decrease, and the "Completed" counter should increase.
<Trans>사용자가 동시에 여러 개의 미술품을 주문할 수 있는 예술 쇼핑몰 앱에서 작업하고 있습니다. 사용자가 "구매" 버튼을 누를 때마다 "진행중" 카운터가 1씩 증가해야 합니다. 3초 후에는 "진행중" 카운터가 감소하고 "완료됨" 카운터가 증가해야 합니다.</Trans>

However, the "Pending" counter does not behave as intended. When you press "Buy", it decreases to `-1` (which should not be possible!). And if you click fast twice, both counters seem to behave unpredictably.
<Trans>그런데 "보류 중" 카운터가 의도대로 작동하지 않고 있습니다. "구매"를 누르면 `-1`로 감소합니다(그럴 수 없습니다!). 그리고 빠르게 두 번 클릭하면 두 카운터가 모두 예측할 수 없게 작동하는 것 같습니다.</Trans>

Why does this happen? Fix both counters.
<Trans>왜 이런 일이 발생할까요? 두 카운터를 모두 수정하세요.</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

Inside the `handleClick` event handler, the values of `pending` and `completed` correspond to what they were at the time of the click event. For the first render, `pending` was `0`, so `setPending(pending - 1)` becomes `setPending(-1)`, which is wrong. Since you want to *increment* or *decrement* the counters, rather than set them to a concrete value determined during the click, you can instead pass the updater functions:
<Trans>`handleClick` 이벤트 핸들러 내부에서 `pending`과 `completed`의 값은 클릭 이벤트 당시의 값과 일치합니다. 첫 번째 렌더링의 경우 `pending`이 `0`이었으므로 `setPending(pending - 1)`은 `setPending(-1)`이 되는데, 이는 잘못된 것입니다. 클릭 중에 결정된 구체적인 값으로 카운터를 설정하는 것이 아니라 카운터를 *증가* 또는 *감소*하고 싶으므로, 대신 업데이터 함수를 전달할 수 있습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

This ensures that when you increment or decrement a counter, you do it in relation to its *latest* state rather than what the state was at the time of the click.
<Trans>이렇게 하면 카운터를 늘리거나 줄일 때, 클릭 당시의 state가 아니라 카운터의 *최신* state를 기준으로 카운터를 늘리거나 줄일 수 있습니다.</Trans>

</Solution>

#### Implement the state queue yourself<Trans>state 큐를 직접 구현해 보세요</Trans> {/*implement-the-state-queue-yourself*/}

In this challenge, you will reimplement a tiny part of React from scratch! It's not as hard as it sounds.
<Trans>이번 도전과제에서는 React의 작은 부분을 처음부터 다시 구현하게 됩니다! 생각보다 어렵지 않습니다.</Trans>

Scroll through the sandbox preview. Notice that it shows **four test cases.** They correspond to the examples you've seen earlier on this page. Your task is to implement the `getFinalState` function so that it returns the correct result for each of those cases. If you implement it correctly, all four tests should pass.
<Trans>샌드박스 미리보기를 스크롤하세요. **네 개의 테스트 케이스**가 표시되는 것을 확인하세요. 이 페이지의 앞부분에서 보았던 예제와 일치합니다. 여러분의 임무는 각 케이스에 대해 올바른 결과를 반환하도록 `getFinalState` 함수를 구현하는 것입니다. 올바르게 구현하면 네 가지 테스트를 모두 통과할 것입니다.</Trans>

You will receive two arguments: `baseState` is the initial state (like `0`), and the `queue` is an array which contains a mix of numbers (like `5`) and updater functions (like `n => n + 1`) in the order they were added.
<Trans>두 개의 인수를 받게 됩니다: `baseState`는 초기 state(예: `0`)이고, `queue`는 숫자(예: `5`)와 업데이터 함수(예: `n => n + 1`)가 추가된, 순서대로 섞여 있는 배열입니다.</Trans>

Your task is to return the final state, just like the tables on this page show!
<Trans>여러분의 임무는 이 페이지의 표에 표시된 것처럼 최종 state를 반환하는 것입니다!</Trans>

<Hint>

If you're feeling stuck, start with this code structure:
<Trans>막막한 느낌이 든다면 이 코드 구조부터 시작해 보세요:</Trans>

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: apply the updater function
    } else {
      // TODO: replace the state
    }
  }

  return finalState;
}
```

Fill out the missing lines!
<Trans>누락된 줄을 채워주세요!</Trans>

</Hint>

<Sandpack>

```js processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: do something with the queue...

  return finalState;
}
```

```js App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

This is the exact algorithm described on this page that React uses to calculate the final state:
<Trans>이 페이지에 설명된 바로 그 알고리즘이 React가 최종 state를 계산하는 데 사용하는 알고리즘입니다:</Trans>

<Sandpack>

```js processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Apply the updater function.
      finalState = update(finalState);
    } else {
      // Replace the next state.
      finalState = update;
    }
  }

  return finalState;
}
```

```js App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

Now you know how this part of React works!
<Trans>이제 React의 이 부분이 어떻게 작동하는지 알았습니다!</Trans>

</Solution>

</Challenges>