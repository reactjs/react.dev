---
title: State as a Snapshot
translatedTitle: 스냅샷으로서의 state
translators: [안예지, 서민택, 유은미, 정재남]
---

<Intro>

State variables might look like regular JavaScript variables that you can read and write to. However, state behaves more like a snapshot. Setting it does not change the state variable you already have, but instead triggers a re-render.
<Trans>state 변수는 읽고 쓸 수 있는 일반 JavaScript 변수처럼 보일 수 있습니다. 하지만 state는 스냅샷처럼 동작합니다. state 변수를 설정해도 이미 가지고 있는 state 변수는 변경되지 않고, 대신 리렌더링이 실행됩니다.</Trans>

</Intro>

<YouWillLearn>

* How setting state triggers re-renders
* When and how state updates
* Why state does not update immediately after you set it
* How event handlers access a "snapshot" of the state

<TransBlock>
- state 설정으로 리렌더링이 촉발되는 방식
- state 업데이트 시기 및 방법
- state를 설정한 직후에 state가 업데이트되지 않는 이유
- 이벤트 핸들러가 state의 '스냅샷'에 액세스하는 방법
</TransBlock>
</YouWillLearn>

## Setting state triggers renders<Trans>state를 설정하면 렌더링이 촉발됩니다</Trans> {/*setting-state-triggers-renders*/}

You might think of your user interface as changing directly in response to the user event like a click. In React, it works a little differently from this mental model. On the previous page, you saw that [setting state requests a re-render](/learn/render-and-commit#step-1-trigger-a-render) from React. This means that for an interface to react to the event, you need to *update the state*.
<Trans>클릭과 같은 사용자 이벤트에 반응하여 사용자 인터페이스가 직접 변경된다고 생각할 수 있습니다. React에서는 이 멘탈 모델과는 조금 다르게 작동합니다. 이전 페이지에서 [state를 설정하면 React에 리렌더링을 요청](/learn/render-and-commit#step-1-trigger-a-render)하는 것을 보았습니다. 즉, 인터페이스가 이벤트에 반응하려면 state를 업데이트해야 합니다.</Trans>

In this example, when you press "send", `setIsSent(true)` tells React to re-render the UI:
<Trans>이 예시에서는 "send"를 누르면 `setIsSent(true)`가 React에 UI를 다시 렌더링하도록 지시합니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Here's what happens when you click the button:
<Trans>버튼을 클릭하면 다음과 같은 일이 발생합니다:</Trans>

1. The `onSubmit` event handler executes.
2. `setIsSent(true)` sets `isSent` to `true` and queues a new render.
3. React re-renders the component according to the new `isSent` value.

<TransBlock>
1. `onSubmit` 이벤트 핸들러가 실행됩니다.
2. `setIsSent(true)`가 `isSent`를 `true`로 설정하고 새 렌더링을 큐에 대기시킵니다.
3. React는 새로운 `isSent` 값에 따라 컴포넌트를 다시 렌더링합니다.
</TransBlock>

Let's take a closer look at the relationship between state and rendering.
<Trans>state와 렌더링의 관계를 자세히 살펴보겠습니다.</Trans>

## Rendering takes a snapshot in time<Trans>렌더링은 그 시점의 스냅샷을 찍습니다</Trans> {/*rendering-takes-a-snapshot-in-time*/}

["Rendering"](/learn/render-and-commit#step-2-react-renders-your-components) means that React is calling your component, which is a function. The JSX you return from that function is like a snapshot of the UI in time. Its props, event handlers, and local variables were all calculated **using its state at the time of the render.**
<Trans>["렌더링"](/learn/render-and-commit#step-2-react-renders-your-components)이란 React가 컴포넌트, 즉 함수를 호출한다는 뜻입니다. 해당 함수에서 반환하는 JSX는 시간상 UI의 스냅샷과 같습니다. prop, 이벤트 핸들러, 로컬 변수는 모두 **렌더링 당시의 state를 사용해** 계산됩니다.</Trans>

Unlike a photograph or a movie frame, the UI "snapshot" you return is interactive. It includes logic like event handlers that specify what happens in response to inputs. React updates the screen to match this snapshot and connects the event handlers. As a result, pressing a button will trigger the click handler from your JSX.
<Trans>사진이나 동영상 프레임과 달리 반환하는 UI '스냅샷'은 대화형입니다. 여기에는 입력에 대한 응답으로 어떤 일이 일어날지 지정하는 이벤트 핸들러와 같은 로직이 포함됩니다. 그러면 React는 이 스냅샷과 일치하도록 화면을 업데이트하고 이벤트 핸들러를 연결합니다. 결과적으로 버튼을 누르면 JSX에서 클릭 핸들러가 발동됩니다.</Trans>

When React re-renders a component:
<Trans>React가 컴포넌트를 다시 렌더링할 때:</Trans>

1. React calls your function again.
2. Your function returns a new JSX snapshot.
3. React then updates the screen to match the snapshot you've returned.

<TransBlock>
  1. React가 함수를 다시 호출합니다.
  2. 함수가 새로운 JSX 스냅샷을 반환합니다.
  3. 그러면 React가 반환한 스냅샷과 일치하도록 화면을 업데이트합니다.
</TransBlock>

<IllustrationBlock sequential>
    <Illustration caption="React executing the function" 
      translated="React가 함수 호출"
      src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="Calculating the snapshot" 
      translated="스냅샷 계산"
      src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="Updating the DOM tree" 
      translated="DOM 트리 업데이트"
      src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

As a component's memory, state is not like a regular variable that disappears after your function returns. State actually "lives" in React itself--as if on a shelf!--outside of your function. When React calls your component, it gives you a snapshot of the state for that particular render. Your component returns a snapshot of the UI with a fresh set of props and event handlers in its JSX, all calculated **using the state values from that render!**
<Trans>컴포넌트의 메모리로서 state는 함수가 반환된 후 사라지는 일반 변수와 다릅니다. state는 실제로 함수 외부에 마치 선반에 있는 것처럼 React 자체에 "존재"합니다. React가 컴포넌트를 호출하면 특정 렌더링에 대한 state의 스냅샷을 제공합니다. 컴포넌트는 **해당 렌더링의 state 값을 사용해** 계산된 새로운 props 세트와 이벤트 핸들러가 포함된 UI의 스냅샷을 JSX에 반환합니다!</Trans>

<IllustrationBlock sequential>
  <Illustration
    caption="You tell React to update the state" 
    translated="React에게 state를 업데이트 하도록 명령"
    src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration
    caption="React updates the state value" 
    translated="React가 state값을 업데이트"
    src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration
    caption="React passes a snapshot of the state value into the component" 
    translated="React가 state 값의 스냅샷을 컴포넌트에 보냄"
    src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

Here's a little experiment to show you how this works. In this example, you might expect that clicking the "+3" button would increment the counter three times because it calls `setNumber(number + 1)` three times.
<Trans>다음은 이것이 어떻게 작동하는지 보여주는 간단한 실험입니다. 이 예제에서는 '+3' 버튼을 클릭하면 `setNumber(number + 1)`를 세 번 호출하므로 카운터가 세 번 증가할 것으로 예상할 수 있습니다.</Trans>

See what happens when you click the "+3" button:
<Trans>"+3" 버튼을 클릭하면 어떤 일이 발생하는지 확인하세요:</Trans>

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

Notice that `number` only increments once per click!
<Trans>이 `number`는 클릭당 한 번만 증가한다는 점에 유의하세요!</Trans>

**Setting state only changes it for the *next* render.** During the first render, `number` was `0`. This is why, in *that render's* `onClick` handler, the value of `number` is still `0` even after `setNumber(number + 1)` was called:
<Trans>**state를 설정하면 다음 렌더링에 대해서만 변경됩니다.** 첫 번째 렌더링에서 `number`는 `0`이었습니다. 따라서 해당 렌더링의 `onClick` 핸들러에서 `setNumber(number + 1)`가 호출된 후에도 `number`의 값은 여전히 `0`입니다:</Trans>

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

Here is what this button's click handler tells React to do:
<Trans>이 버튼의 클릭 핸들러가 React에게 지시하는 작업은 다음과 같습니다:</Trans>

1. `setNumber(number + 1)`: `number` is `0` so `setNumber(0 + 1)`.
    - React prepares to change `number` to `1` on the next render.
2. `setNumber(number + 1)`: `number` is `0` so `setNumber(0 + 1)`.
    - React prepares to change `number` to `1` on the next render.
3. `setNumber(number + 1)`: `number` is `0` so `setNumber(0 + 1)`.
    - React prepares to change `number` to `1` on the next render.

<TransBlock>
1. `setNumber(number + 1)`: `number`는 `0`이므로 `setNumber(0 + 1)`입니다.
    - React는 다음 렌더링에서 `number`를 `1`로 변경할 준비를 합니다.
2. `setNumber(number + 1)`: `number`는 `0`이므로 `setNumber(0 + 1)`입니다.
    - React는 다음 렌더링에서 `number`를 `1`로 변경할 준비를 합니다.
3. `setNumber(number + 1)`: `number`는 `0`이므로 `setNumber(0 + 1)`입니다.
    - React는 다음 렌더링에서 `number`를 `1`로 변경할 준비를 합니다.
</TransBlock>

Even though you called `setNumber(number + 1)` three times, in *this render's* event handler `number` is always `0`, so you set the state to `1` three times. This is why, after your event handler finishes, React re-renders the component with `number` equal to `1` rather than `3`.
<Trans>`setNumber(number + 1)`를 세 번 호출했지만, 이 렌더링에서 이벤트 핸들러의 `number`는 항상 `0`이므로 state를 `1`로 세 번 설정했습니다. 이것이 이벤트 핸들러가 완료된 후 React가 컴포넌트안의 `number` 를  `3`이 아닌 `1`로  다시 렌더링하는 이유입니다.</Trans>

You can also visualize this by mentally substituting state variables with their values in your code. Since the `number` state variable is `0` for *this render*, its event handler looks like this:
<Trans>코드에서 state 변수를 해당 값으로 대입하여 이를 시각화할 수도 있습니다. 이 렌더링에서 `number` state 변수는 `0`이므로 이벤트 핸들러는 다음과 같습니다:</Trans>

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

For the next render, `number` is `1`, so *that render's* click handler looks like this:
<Trans>다음 렌더링에서는 `number`가 `1`이므로 렌더링의 클릭 핸들러는 다음과 같이 표시됩니다:</Trans>

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

This is why clicking the button again will set the counter to `2`, then to `3` on the next click, and so on.
<Trans>그렇기 때문에 버튼을 다시 클릭하면 카운터가 `2`로 설정되고, 다음 클릭 시에는 `3`으로 설정되는 방식입니다.</Trans>

## State over time<Trans>시간 경과에 따른 state</Trans> {/*state-over-time*/}

Well, that was fun. Try to guess what clicking this button will alert:
<Trans>재미있네요. 이 버튼을 클릭하면 어떤 알림이 표시되는지 맞춰보세요:</Trans>

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
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

If you use the substitution method from before, you can guess that the alert shows "0":
<Trans>이전부터 치환 방법을 사용하면 알림에 "0"이 표시된다는 것을 짐작할 수 있습니다:</Trans>

```js
setNumber(0 + 5);
alert(0);
```

But what if you put a timer on the alert, so it only fires _after_ the component re-rendered? Would it say "0" or "5"? Have a guess!
<Trans>하지만 경고에 타이머를 설정하여 컴포넌트가 다시 렌더링된 후에만 발동하도록 하면 어떨까요? "0" 또는 "5"라고 표시될까요? 맞춰보세요!</Trans>

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
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Surprised? If you use the substitution method, you can see the "snapshot" of the state passed to the alert.
<Trans>놀랐나요? 대체 방법을 사용하면 알림에 전달된 state의 '스냅샷'을 볼 수 있습니다.</Trans>

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

The state stored in React may have changed by the time the alert runs, but it was scheduled using a snapshot of the state at the time the user interacted with it!
<Trans>React에 저장된 state는 알림이 실행될 때 변경되었을 수 있지만, 사용자가 상호작용한 시점에 state 스냅샷을 사용하는 건 이미 예약되어 있던 것입니다!</Trans>

**A state variable's value never changes within a render,** even if its event handler's code is asynchronous. Inside *that render's* `onClick`, the value of `number` continues to be `0` even after `setNumber(number + 5)` was called. Its value was "fixed" when React "took the snapshot" of the UI by calling your component.
<Trans>**state 변수의 값은** 이벤트 핸들러의 코드가 비동기적이더라도 **렌더링 내에서 절대 변경되지 않습니다.** 해당 렌더링의 `onClick` 내에서, `setNumber(number + 5)`가 호출된 후에도 `number`의 값은 계속 `0`입니다. 이 값은 컴포넌트를 호출해 React가 UI의 “스냅샷을 찍을" 때 "고정"된 값입니다.</Trans>

Here is an example of how that makes your event handlers less prone to timing mistakes. Below is a form that sends a message with a five-second delay. Imagine this scenario:
<Trans>다음은 이벤트 핸들러가 타이밍 실수를 줄이는 방법을 보여주는 예입니다. 아래는 5초 지연된 메시지를 보내는 양식입니다. 이 시나리오를 상상해 보세요:</Trans>

1. You press the "Send" button, sending "Hello" to Alice.
2. Before the five-second delay ends, you change the value of the "To" field to "Bob".

<TransBlock>
  1. "보내기" 버튼을 눌러 앨리스에게 "안녕하세요"를 보냅니다.
  2. 5초 지연이 끝나기 전에 "받는 사람" 필드의 값을 "Bob"으로 변경합니다.
</TransBlock>

What do you expect the `alert` to display? Would it display, "You said Hello to Alice"? Or would it display, "You said Hello to Bob"? Make a guess based on what you know, and then try it:
<Trans>`alert`에 어떤 내용이 표시되기를 기대하나요? "앨리스에게 인사했습니다"라고 표시될까요, 아니면 "당신은 밥에게 인사했습니다"라고 표시될까요? 알고 있는 내용을 바탕으로 추측해보고, 다음을 코드를 실행해 보세요:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**React keeps the state values "fixed" within one render's event handlers.** You don't need to worry whether the state has changed while the code is running.
<Trans>**React는 하나의 렌더링 이벤트 핸들러 내에서 state 값을 "고정"으로 유지합니다.** 코드가 실행되는 동안 state가 변경되었는지 걱정할 필요가 없습니다.</Trans>

But what if you wanted to read the latest state before a re-render? You'll want to use a [state updater function](/learn/queueing-a-series-of-state-updates), covered on the next page!
<Trans>하지만 다시 렌더링하기 전에 최신 state를 읽고 싶다면 어떻게 해야 할까요? 다음 페이지에서 설명하는 [state 업데이터 함수](/learn/queueing-a-series-of-state-updates)를 사용하면 됩니다!</Trans>

<Recap>

* Setting state requests a new render.
* React stores state outside of your component, as if on a shelf.
* When you call `useState`, React gives you a snapshot of the state *for that render*.
* Variables and event handlers don't "survive" re-renders. Every render has its own event handlers.
* Every render (and functions inside it) will always "see" the snapshot of the state that React gave to *that* render.
* You can mentally substitute state in event handlers, similarly to how you think about the rendered JSX.
* Event handlers created in the past have the state values from the render in which they were created.

<TransBlock>
- state를 설정하면 새 렌더링을 요청합니다.
- React는 컴포넌트 외부에 마치 선반에 보관하듯 state를 저장합니다.
- 'useState'를 호출하면 React는 해당 렌더링에 대한 state의 스냅샷을 제공합니다.
- 변수와 이벤트 핸들러는 다시 렌더링해도 "살아남지" 않습니다. 모든 렌더링에는 자체 이벤트 핸들러가 있습니다.
- 모든 렌더링(과 그 안에 있는 함수)은 항상 React가 *그 렌더링*에 제공한 state의 스냅샷을 "보게" 됩니다.
- 렌더링된 JSX에 대해 생각하는 것처럼 이벤트 핸들러에서 state를 정신적으로 대체할 수 있습니다.
- 과거에 생성된 이벤트 핸들러는 그것이 생성된 렌더링 시점의 state 값을 갖습니다.
</TransBlock>
</Recap>



<Challenges>

#### Implement a traffic light<Trans>신호등 구현하기</Trans> {/*implement-a-traffic-light*/}

Here is a crosswalk light component that toggles on when the button is pressed:
<Trans>다음은 버튼을 누르면 켜지는 횡단보도 조명 컴포넌트입니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Add an `alert` to the click handler. When the light is green and says "Walk", clicking the button should say "Stop is next". When the light is red and says "Stop", clicking the button should say "Walk is next".
<Trans>클릭 핸들러에 `alert`을 추가하세요. 표시등이 녹색이고 "걷기"라고 표시되면 버튼을 클릭하면 "다음은 정지입니다."라고 표시되어야 합니다. 표시등이 빨간색이고 "중지"라고 표시되면 버튼을 클릭하면 "다음은 걷기입니다"라고 표시되어야 합니다.</Trans>

Does it make a difference whether you put the `alert` before or after the `setWalk` call?
<Trans>`alert`를 `setWalk`호출 전이나 후에 넣는 것이 차이가 있나요?</Trans>

<Solution>

Your `alert` should look like this:
<Trans>`alert`은 다음과 같이 작성해야 합니다:</Trans>
<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Stop is next' : 'Walk is next');
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Whether you put it before or after the `setWalk` call makes no difference. That render's value of `walk` is fixed. Calling `setWalk` will only change it for the *next* render, but will not affect the event handler from the previous render.
<Trans>`setWalk` 호출 앞에 넣든 뒤에 넣든 아무런 차이가 없습니다. 해당 렌더링의 `walk` 값은 고정되어 있습니다. `setWalk`를 호출하면 *다음* 렌더링에 대해서만 변경되고, 이전 렌더링의 이벤트 핸들러에는 영향을 미치지 않습니다.</Trans>

This line might seem counter-intuitive at first:
<Trans>이 줄은 처음에는 직관적이지 않게 보일 수 있습니다:</Trans>

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

But it makes sense if you read it as: "If the traffic light shows 'Walk now', the message should say 'Stop is next.'" The `walk` variable inside your event handler matches that render's value of `walk` and does not change.
<Trans>하지만 이렇게 읽으면 이해가 될 것입니다: "신호등에 'Walk now'가 표시되면, 메시지에 'Stop is next.'라고 표시되어야 합니다." 이벤트 핸들러 내부의 `walk` 변수는 해당 렌더링의 값인 `walk`와 일치하며 변경되지 않습니다.</Trans>

You can verify that this is correct by applying the substitution method. When `walk` is `true`, you get:
<Trans>치환 메서드를 적용하여 이것이 올바른지 확인할 수 있습니다. `walk`가 `true`이면 다음과 같은 결과가 나타납니다:</Trans>

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop is next');
}}>
  Change to Stop
</button>
<h1 style={{color: 'darkgreen'}}>
  Walk
</h1>
```

So clicking "Change to Stop" queues a render with `walk` set to `false`, and alerts "Stop is next".
<Trans>따라서 "Change to Stop"을 클릭하면 `walk`가 `false`로 설정된 렌더링이 대기열에 추가되고, "Stop is next."라는 알림이 표시됩니다.</Trans>

</Solution>

</Challenges>
