---
title: useState
translators: [최민정, 고석영, 정재남]
---

<Intro>

`useState` is a React Hook that lets you add a [state variable](/learn/state-a-components-memory) to your component.
<Trans>`useState`는 컴포넌트에 [state 변수](/learn/state-a-components-memory)를 추가할 수 있게 해주는 React 훅입니다.</Trans>


```js
const [state, setState] = useState(initialState);
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `useState(initialState)` {/*usestate*/}

Call `useState` at the top level of your component to declare a [state variable.](/learn/state-a-components-memory)
<Trans>컴포넌트의 최상위 레벨에서 `useState`를 호출하여 [state 변수](/learn/state-a-components-memory)를 선언하세요.</Trans>

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

The convention is to name state variables like `[something, setSomething]` using [array destructuring.](https://javascript.info/destructuring-assignment)
<Trans>[배열 구조 분해](https://javascript.info/destructuring-assignment)를 사용하여 `[something, setSomething]`과 같은 state 변수의 이름을 지정하는 것이 관례입니다.</Trans>

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

* `initialState`: The value you want the state to be initially. It can be a value of any type, but there is a special behavior for functions. This argument is ignored after the initial render.
<Trans>`initialState`: 초기에 state를 설정할 값입니다. 값은 모든 데이터 타입이 허용되지만, 함수에 대해서는 특별한 동작이 있습니다. 이 인자는 초기 렌더링 이후에는 무시됩니다.</Trans>
  * If you pass a function as `initialState`, it will be treated as an _initializer function_. It should be pure, should take no arguments, and should return a value of any type. React will call your initializer function when initializing the component, and store its return value as the initial state. [See an example below.](#avoiding-recreating-the-initial-state)
<Trans>함수를 `initialState`로 전달하면 이를 *초기화 함수*로 취급합니다. 이 함수는 순수해야 하고 인자를 받지 않아야 하며 반드시 어떤 값을 반환해야 합니다. React는 컴포넌트를 초기화할 때 초기화 함수를 호출하고, 그 반환값을 초기 state로 저장합니다. [아래 예시를 참고하세요.](#avoiding-recreating-the-initial-state)</Trans>

#### Returns<Trans>반환값</Trans> {/*returns*/}

`useState` returns an array with exactly two values:
<Trans>`useState`는 정확히 두 개의 값을 가진 배열을 반환합니다:</Trans>

1. The current state. During the first render, it will match the `initialState` you have passed.
2. The [`set` function](#setstate) that lets you update the state to a different value and trigger a re-render.
<TransBlock>
1. 현재 state입니다. 첫 번째 렌더링 중에는 전달한 `initialState`와 일치합니다.
2. state를 다른 값으로 업데이트하고 리렌더링을 촉발할 수 있는 [`set`(설정자) 함수](#setstate)입니다.
</TransBlock>
#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

* `useState` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a new component and move the state into it.
<Trans>`useState`는 훅이므로 **컴포넌트의 최상위 레벨이나** 직접 만든 훅에서만 호출할 수 있습니다. 반복문이나 조건문 안에서는 호출할 수 없습니다. 필요한 경우 새 컴포넌트를 추출하고 state를 그 안으로 옮기세요.</Trans>
* In Strict Mode, React will **call your initializer function twice** in order to [help you find accidental impurities.](#my-initializer-or-updater-function-runs-twice) This is development-only behavior and does not affect production. If your initializer function is pure (as it should be), this should not affect the behavior. The result from one of the calls will be ignored.
<Trans>Strict Mode에서 React는 [의도치 않은 불순물을 찾기 위해](#my-initializer-or-updater-function-runs-twice) **초기화 함수를 두 번 호출합니다.** 이는 개발 환경 전용 동작이며 상용 환경에는 영향을 미치지 않습니다. 초기화 함수가 순수하다면(그래야만 합니다) 동작에 영향을 미치지 않습니다. 호출 중 하나의 결과는 무시됩니다.</Trans>

---

### `set` functions, like `setSomething(nextState)`<Trans>`setSomething(nextState)`과 같은 `set` 함수</Trans> {/*setstate*/}

The `set` function returned by `useState` lets you update the state to a different value and trigger a re-render. You can pass the next state directly, or a function that calculates it from the previous state:
<Trans>`useState`가 반환하는 `set` 함수를 사용하면 state를 다른 값으로 업데이트하고 리렌더링을 촉발할 수 있습니다. 여기에는 다음 state를 직접 전달하거나, 이전 state로부터 계산하여 다음 state를 도출하는 함수를 전달할 수도 있습니다:</Trans>

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### Parameters<Trans>매개변수</Trans> {/*setstate-parameters*/}

* `nextState`: The value that you want the state to be. It can be a value of any type, but there is a special behavior for functions.
<Trans>`nextState`: state가 될 값입니다. 값은 모든 데이터 타입이 허용되지만, 함수에 대해서는 특별한 동작이 있습니다.</Trans>
  * If you pass a function as `nextState`, it will be treated as an _updater function_. It must be pure, should take the pending state as its only argument, and should return the next state. React will put your updater function in a queue and re-render your component. During the next render, React will calculate the next state by applying all of the queued updaters to the previous state. [See an example below.](#updating-state-based-on-the-previous-state)
  <Trans>함수를 `nextState`로 전달하면 업데이터 함수로 취급됩니다. 이 함수는 순수해야 하고, 대기 중인 state를 유일한 인수로 사용해야 하며, 다음 state를 반환해야 합니다. React는 업데이터 함수를 대기열에 넣고 컴포넌트를 리렌더링 합니다. 다음 렌더링 중에 React는 대기열에 있는 모든 업데이터를 이전 state에 적용하여 다음 state를 계산합니다. [아래 예제를 참조하세요.](#updating-state-based-on-the-previous-state)</Trans>


#### Returns<Trans>반환값</Trans> {/*setstate-returns*/}

`set` functions do not have a return value.
<Trans>`set` 함수는 반환값이 없습니다.</Trans>

#### Caveats<Trans>주의사항</Trans> {/*setstate-caveats*/}

* The `set` function **only updates the state variable for the *next* render**. If you read the state variable after calling the `set` function, [you will still get the old value](#ive-updated-the-state-but-logging-gives-me-the-old-value) that was on the screen before your call.
<Trans>`set` 함수는 **다음 렌더링에 대한 state 변수만 업데이트합니다.** `set` 함수를 호출한 후에도 state 변수에는 여전히 호출 전 화면에 있던 [이전 값이 담겨 있습니다.](#ive-updated-the-state-but-logging-gives-me-the-old-value)</Trans>

* If the new value you provide is identical to the current `state`, as determined by an [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison, React will **skip re-rendering the component and its children.** This is an optimization. Although in some cases React may still need to call your component before skipping the children, it shouldn't affect your code.
<Trans>사용자가 제공한 새로운 값이 [`Object.is`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is)에 의해 현재 `state`와 동일하다고 판정되면, React는 **컴포넌트와 그 자식들을 리렌더링하지 않습니다**. 이것이 최적화입니다. 경우에 따라 React가 자식을 건너뛰기 전에 컴포넌트를 호출해야 할 수도 있지만, 코드에 영향을 미치지는 않습니다.</Trans>

* React [batches state updates.](/learn/queueing-a-series-of-state-updates) It updates the screen **after all the event handlers have run** and have called their `set` functions. This prevents multiple re-renders during a single event. In the rare case that you need to force React to update the screen earlier, for example to access the DOM, you can use [`flushSync`.](/reference/react-dom/flushSync)
<Trans>React는 [state 업데이트를 일괄처리합니다.](/learn/queueing-a-series-of-state-updates) **모든 이벤트 핸들러가 실행되고** `set` 함수를 호출한 후에 화면을 업데이트합니다. 이렇게 하면 단일 이벤트 중에 여러 번 리렌더링 되는 것을 방지할 수 있습니다. 드물지만 DOM에 접근하기 위해 React가 화면을 더 일찍 업데이트하도록 강제해야 하는 경우, [`flushSync`](/reference/react-dom/flushSync)를 사용할 수 있습니다.</Trans>


* Calling the `set` function *during rendering* is only allowed from within the currently rendering component. React will discard its output and immediately attempt to render it again with the new state. This pattern is rarely needed, but you can use it to **store information from the previous renders**. [See an example below.](#storing-information-from-previous-renders)
<Trans>렌더링 도중 `set` 함수를 호출하는 것은 현재 렌더링 중인 컴포넌트 내에서만 허용됩니다. React는 해당 출력을 버리고 즉시 새로운 state로 다시 렌더링을 시도합니다. 이 패턴은 거의 필요하지 않지만 **이전 렌더링의 정보를 저장하는 데 사용할 수 있습니다.** [아래 예시를 참고하세요.](#storing-information-from-previous-renders)</Trans>


* In Strict Mode, React will **call your updater function twice** in order to [help you find accidental impurities.](#my-initializer-or-updater-function-runs-twice) This is development-only behavior and does not affect production. If your updater function is pure (as it should be), this should not affect the behavior. The result from one of the calls will be ignored.
<Trans>Strict Mode에서 React는 [의도치않은 불순물을 찾기 위해](#my-initializer-or-updater-function-runs-twice) **업데이터 함수를 두 번 호출합니다**. 이는 개발 환경 전용 동작이며 상용 환경에는 영향을 미치지 않습니다. 만약 업데이터 함수가 순수하다면(그래야만 합니다), 이것은 동작에 영향을 미치지 않습니다. 호출 중 하나의 결과는 무시됩니다.</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Adding state to a component <Trans>컴포넌트에 state 추가하기</Trans> {/*adding-state-to-a-component*/}

Call `useState` at the top level of your component to declare one or more [state variables.](/learn/state-a-components-memory)
<Trans>컴포넌트의 최상위 레벨에서 `useState`를 호출하여 하나 이상의 [state 변수](/learn/state-a-components-memory)를 선언하세요.</Trans>

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

The convention is to name state variables like `[something, setSomething]` using [array destructuring.](https://javascript.info/destructuring-assignment)
<Trans>[배열 구조 분해](https://javascript.info/destructuring-assignment)를 사용하여 `[something, setSomething]`과 같은 state 변수의 이름을 지정하는 것이 관례입니다.</Trans>

`useState` returns an array with exactly two items:
<Trans>`useState`는 정확히 두 개의 항목이 있는 배열을 반환합니다.</Trans>

1. The <CodeStep step={1}>current state</CodeStep> of this state variable, initially set to the <CodeStep step={3}>initial state</CodeStep> you provided.
2. The <CodeStep step={2}>`set` function</CodeStep> that lets you change it to any other value in response to interaction.
<TransBlock>
  1. 이 state 변수의 <CodeStep step={1}>현재 state</CodeStep>로, 처음에 제공한 <CodeStep step={3}>초기 state</CodeStep>로 설정됩니다.
  2. 상호작용에 반응하여 다른 값으로 변경할 수 있는 <CodeStep step={2}>`set` 함수</CodeStep>입니다.
</TransBlock>

To update what’s on the screen, call the `set` function with some next state:
<Trans>화면의 내용을 업데이트하려면 다음 state로 `set` 함수를 호출합니다:</Trans>

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

React will store the next state, render your component again with the new values, and update the UI.
<Trans>React는 다음 state를 저장하고 새로운 값으로 컴포넌트를 다시 렌더링한 후 UI를 업데이트합니다.</Trans>

<Pitfall>

Calling the `set` function [**does not** change the current state in the already executing code](#ive-updated-the-state-but-logging-gives-me-the-old-value):
`set` 함수를 호출해도 [이미 실행 중인 코드의 현재 state는 변경되지 **않습니다**](#ive-updated-the-state-but-logging-gives-me-the-old-value):

```js {3-4}
function handleClick() {
  setName('Robin');
  console.log(name); // Still "Taylor"!
                     // 아직 "Taylor"입니다!
}
```

It only affects what `useState` will return starting from the *next* render.
<Trans>`set`함수는 **다음** 렌더링에서 반환할 `useState`에만 영향을 줍니다.</Trans>

</Pitfall>

<Recipes titleText="Basic useState examples" titleId="examples-basic" translatedTitle="useState 기본 예시">

#### Counter (number) <Trans>카운터 (숫자)</Trans> {/*counter-number*/}

In this example, the `count` state variable holds a number. Clicking the button increments it.
<Trans>예제에서 `count` state 변수는 숫자를 받습니다. 버튼을 클릭하면 숫자가 증가합니다.</Trans>

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
      You pressed me {count} times
    </button>
  );
}
```

</Sandpack>

<Solution />

#### Text field (string) <Trans>텍스트 필드 (문자열)</Trans> {/*text-field-string*/}

In this example, the `text` state variable holds a string. When you type, `handleChange` reads the latest input value from the browser input DOM element, and calls `setText` to update the state. This allows you to display the current `text` below.
<Trans> 예제에서 `text` state 변수는 문자열을 받습니다. input에 타이핑하면 `handleChange`는 input DOM 요소에서 최신 input 값을 읽고 `setText`를 호출하여 state를 업데이트합니다. 이렇게 하면 아래에 현재 `text`를 표시할 수 있습니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText('hello')}>
        Reset
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Checkbox (boolean) <Trans>체크박스 (불리언)</Trans> {/*checkbox-boolean*/}

In this example, the `liked` state variable holds a boolean. When you click the input, `setLiked` updates the `liked` state variable with whether the browser checkbox input is checked. The `liked` variable is used to render the text below the checkbox.
<Trans>예제에서 `liked` state 변수는 불리언을 받습니다. input을 클릭하면 `setLiked`는 체크박스가 선택되어 있는지 여부에 따라 `liked` state 변수를 업데이트합니다. `liked` 변수는 체크박스 아래의 텍스트를 렌더링하는 데 사용됩니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        I liked this
      </label>
      <p>You {liked ? 'liked' : 'did not like'} this.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Form (two variables) <Trans>폼 (두 개의 변수)</Trans> {/*form-two-variables*/}

You can declare more than one state variable in the same component. Each state variable is completely independent.
<Trans>동일한 컴포넌트에 두개 이상의 state 변수를 선언할 수 있습니다. 각 state 변수는 완전히 독립적입니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Updating state based on the previous state <Trans>이전 state를 기반으로 state 업데이트하기</Trans> {/*updating-state-based-on-the-previous-state*/}

Suppose the `age` is `42`. This handler calls `setAge(age + 1)` three times:
<Trans>`age`가 `42`라고 가정합니다. 이 핸들러는 `setAge(age + 1)`를 세 번 호출합니다:</Trans>

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

However, after one click, `age` will only be `43` rather than `45`! This is because calling the `set` function [does not update](/learn/state-as-a-snapshot) the `age` state variable in the already running code. So each `setAge(age + 1)` call becomes `setAge(43)`.
<Trans>그러나 클릭해보면 `age`는 `45`가 아니라 `43`이 됩니다! 이는 `set` 함수를 호출해도 이미 실행 중인 코드에서 `age` state 변수가 [업데이트되지 않기](/learn/state-as-a-snapshot) 때문입니다. 따라서 각 `setAge(age + 1)` 호출은 `setAge(43)`이 됩니다.</Trans>

To solve this problem, **you may pass an *updater function*** to `setAge` instead of the next state:
<Trans>이 문제를 해결하려면 다음 state 대신 `setAge`에 ***업데이터 함수*를 전달할 수 있습니다**:</Trans>

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

Here, `a => a + 1` is your updater function. It takes the <CodeStep step={1}>pending state</CodeStep> and calculates the <CodeStep step={2}>next state</CodeStep> from it.
<Trans>여기서 `a => a + 1`은 업데이터 함수입니다. 이 함수는 <CodeStep step={1}>대기 중인 state</CodeStep>를 가져와서 <CodeStep step={2}>다음 state</CodeStep>를 계산합니다.</Trans>


React puts your updater functions in a [queue.](/learn/queueing-a-series-of-state-updates) Then, during the next render, it will call them in the same order:
<Trans>React는 업데이터 함수를 [큐](/learn/queueing-a-series-of-state-updates)에 넣습니다. 그러면 다음 렌더링 중에 동일한 순서로 호출합니다:</Trans>

1. `a => a + 1` will receive `42` as the pending state and return `43` as the next state.
1. `a => a + 1` will receive `43` as the pending state and return `44` as the next state.
1. `a => a + 1` will receive `44` as the pending state and return `45` as the next state.
<TransBlock>
  1. `a => a + 1`은 대기 중인 state로 `42`를 받고 다음 state로 `43`을 반환합니다. 
  2. `a => a + 1`은 대기 중인 state로 `43`을 받고 다음 state로 `44`를 반환합니다.
  3. `a => a + 1`은 대기 중인 state로 `44`를 받고 다음 state로 `45`를 반환합니다.
</TransBlock>

There are no other queued updates, so React will store `45` as the current state in the end.
<Trans>대기 중인 다른 업데이트가 없으므로, React는 결국 `45`를 현재 state로 저장합니다.</Trans>

By convention, it's common to name the pending state argument for the first letter of the state variable name, like `a` for `age`. However, you may also call it like `prevAge` or something else that you find clearer.
<Trans>관례상 대기 중인 state 인수의 이름을 `age`의 `a`와 같이 state 변수 이름의 첫 글자로 지정하는 것이 일반적입니다. 그러나 `prevAge` 또는 더 명확하다고 생각하는 다른 이름으로 지정해도 됩니다.</Trans>

React may [call your updaters twice](#my-initializer-or-updater-function-runs-twice) in development to verify that they are [pure.](/learn/keeping-components-pure)
<Trans>React는 개발 환경에서 [순수](/learn/keeping-components-pure)한지 확인하기 위해 [업데이터를 두 번 호출](#my-initializer-or-updater-function-runs-twice)할 수 있습니다.</Trans>

<DeepDive>

#### Is using an updater always preferred? <Trans>항상 업데이터를 사용하는 것이 더 좋은가요?</Trans> {/*is-using-an-updater-always-preferred*/}

You might hear a recommendation to always write code like `setAge(a => a + 1)` if the state you're setting is calculated from the previous state. There is no harm in it, but it is also not always necessary.
<Trans>설정하려는 state가 이전 state에서 계산되는 경우 항상 `setAge(a => a + 1)`처럼 업데이터를 사용하는걸 추천한다는 말을 들어보았을 것입니다. 나쁠 건 없지만 항상 그래야만 하는 것은 아닙니다.</Trans>

In most cases, there is no difference between these two approaches. React always makes sure that for intentional user actions, like clicks, the `age` state variable would be updated before the next click. This means there is no risk of a click handler seeing a "stale" `age` at the beginning of the event handler.
<Trans>대부분의 경우, 이 두 가지 접근 방식 사이에는 차이가 없습니다. React는 클릭과 같은 의도적인 사용자 액션에 대해 항상 다음 클릭 전에 `age` state 변수가 업데이트 되도록 합니다. 즉, 클릭 핸들러가 이벤트 핸들러를 시작할 때 "오래된" `age`를 볼 위험은 없습니다.</Trans>

However, if you do multiple updates within the same event, updaters can be helpful. They're also helpful if accessing the state variable itself is inconvenient (you might run into this when optimizing re-renders).
<Trans>다만 동일한 이벤트 내에서 여러 업데이트를 수행하는 경우에는 업데이터가 도움이 될 수 있습니다. state 변수 자체에 접근하는 것이 어려운 경우에도 유용합니다. (리렌더링을 최적화할 때 이 문제가 발생할 수 있습니다).</Trans>

If you prefer consistency over slightly more verbose syntax, it's reasonable to always write an updater if the state you're setting is calculated from the previous state. If it's calculated from the previous state of some *other* state variable, you might want to combine them into one object and [use a reducer.](/learn/extracting-state-logic-into-a-reducer)
<Trans>친절한 문법보다 일관성을 더 선호한다면 설정하려는 state가 이전 state에서 계산되는 경우 항상 업데이터를 작성하는 것이 합리적일 것입니다. 만약 어떤 state가 *다른* state 변수의 이전 state로부터 계산되는 경우라면, 이를 하나의 객체로 결합하고 [reducer를 사용](/learn/extracting-state-logic-into-a-reducer)하는 것이 좋습니다.</Trans>

</DeepDive>

<Recipes titleText="The difference between passing an updater and passing the next state directly" titleId="examples-updater" translatedTitle="업데이터를 전달하는 것과 다음 state를 직접 전달하는 것의 차이점">

#### Passing the updater function <Trans>업데이터 함수 전달하기</Trans> {/*passing-the-updater-function*/}

This example passes the updater function, so the "+3" button works.
<Trans>이 예제는 업데이터 함수를 전달하므로 "+3" 버튼이 작동합니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(a => a + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

#### Passing the next state directly <Trans>다음 state 바로 전달하기</Trans> {/*passing-the-next-state-directly*/}

This example **does not** pass the updater function, so the "+3" button **doesn't work as intended**.
<Trans>이 예제에서는 업데이터 함수를 전달하지 않으므로 "+3" 버튼이 의도한 대로 작동하지 않습니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(age + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Updating objects and arrays in state <Trans>객체 및 배열 state 업데이트</Trans> {/*updating-objects-and-arrays-in-state*/}

You can put objects and arrays into state. In React, state is considered read-only, so **you should *replace* it rather than *mutate* your existing objects**. For example, if you have a `form` object in state, don't mutate it:
<Trans>state에는 객체와 배열도 넣을 수 있습니다. React에서 state는 읽기 전용으로 간주되므로 **기존 객체를 *변이*하지 않고, *교체*를 해야 합니다**. 예를 들어 state에 `form` 객체가 있는 경우 변이하지 마세요:</Trans>

```js
// 🚩 Don't mutate an object in state like this:
// 🚩 state 안에 있는 객체를 다음과 같이 변이하지 마세요: 
form.firstName = 'Taylor';
```

Instead, replace the whole object by creating a new one:
<Trans>대신 새로운 객체를 생성하여 전체 객체를 교체하세요:</Trans>

```js
// ✅ Replace state with a new object
// ✅ 새로운 객체로 state 교체합니다
setForm({
  ...form,
  firstName: 'Taylor'
});
```

Read [updating objects in state](/learn/updating-objects-in-state) and [updating arrays in state](/learn/updating-arrays-in-state) to learn more.
<Trans>자세한 내용은 [객체 state 업데이트](/learn/updating-objects-in-state) 및 [배열 state 업데이트](/learn/updating-arrays-in-state)에서 확인하세요.</Trans>

<Recipes titleText="Examples of objects and arrays in state" titleId="examples-objects" translatedTitle="객체 및 배열 state 예시">

#### Form (object) <Trans>Form (객체)</Trans> {/*form-object*/}

In this example, the `form` state variable holds an object. Each input has a change handler that calls `setForm` with the next state of the entire form. The `{ ...form }` spread syntax ensures that the state object is replaced rather than mutated.
<Trans>이 예제에서 `form` state 변수는 객체를 받습니다. 각 input에는 전체 form의 다음 state로 `setForm`을 호출하는 change 핸들러가 있습니다. 전개 구문 `{ ...form }`은 state 객체를 변이하지 않고 교체합니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        First name:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Last name:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Email:
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Form (nested object) <Trans>Form (중첩 객체)</Trans> {/*form-nested-object*/}

In this example, the state is more nested. When you update nested state, you need to create a copy of the object you're updating, as well as any objects "containing" it on the way upwards. Read [updating a nested object](/learn/updating-objects-in-state#updating-a-nested-object) to learn more.
<Trans>이 예제에서는 state가 더 중첩되어 있습니다. 중첩된 state를 업데이트할 때는 업데이트하려는 객체의 복사본을 만들어야 하며, 위쪽으로 올라갈 때마다 해당 객체를 "포함하는" 모든 객체에 대한 복사본을 만들어야 합니다. 자세히 알아보려면 [중첩된 객체 업데이트하기](/learn/updating-objects-in-state#updating-a-nested-object)를 읽어보세요.</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<Solution />

#### List (array) <Trans>List (배열)</Trans> {/*list-array*/}

In this example, the `todos` state variable holds an array. Each button handler calls `setTodos` with the next version of that array. The `[...todos]` spread syntax, `todos.map()` and `todos.filter()` ensure the state array is replaced rather than mutated.
<Trans>이 예제에서 `todos` state 변수는 배열을 받습니다. 각 버튼 핸들러는 해당 배열의 다음 버전으로 `setTodos`를 호출합니다. `[...todos]` 전개 구문, `todos.map()` 및 `todos.filter()`는 state 배열이 변이하지 않고 교체합니다.</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

#### Writing concise update logic with Immer <Trans>Immer로 간결한 업데이트 로직 작성</Trans> {/*writing-concise-update-logic-with-immer*/}

If updating arrays and objects without mutation feels tedious, you can use a library like [Immer](https://github.com/immerjs/use-immer) to reduce repetitive code. Immer lets you write concise code as if you were mutating objects, but under the hood it performs immutable updates:
<Trans>변이 없이 배열과 객체를 업데이트하는 것이 귀찮게 느껴진다면 [Immer](https://github.com/immerjs/use-immer)와 같은 라이브러리를 사용하여 반복적인 코드를 줄일 수 있습니다. Immer를 사용하면 객체를 변이하는 것처럼 코드를 간결하게 작성하더라도 내부적으로는 불변성을 유지한 업데이트를 수행합니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Avoiding recreating the initial state <Trans>초기 state 다시 생성하지 않기</Trans> {/*avoiding-recreating-the-initial-state*/}

React saves the initial state once and ignores it on the next renders.
<Trans>React는 초기 state를 한 번 저장하고 다음 렌더링부터는 이를 무시합니다.</Trans>

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

Although the result of `createInitialTodos()` is only used for the initial render, you're still calling this function on every render. This can be wasteful if it's creating large arrays or performing expensive calculations.
<Trans>`createInitialTodos()`의 결과는 초기 렌더링에만 사용되지만, 여전히 모든 렌더링에서 이 함수를 호출하게 됩니다. 이는 큰 배열을 생성하거나 값비싼 계산을 수행하는 경우 낭비가 될 수 있습니다.</Trans>

To solve this, you may **pass it as an _initializer_ function** to `useState` instead:
<Trans>이 문제를 해결하려면, 대신 이를 `useState`에 **초기화 함수로 전달하세요**:</Trans>

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

Notice that you’re passing `createInitialTodos`, which is the *function itself*, and not `createInitialTodos()`, which is the result of calling it. If you pass a function to `useState`, React will only call it during initialization.
<Trans>함수를 호출한 결과인 `createInitialTodos()`가 아니라 함수 자체인 `createInitialTodos`를 전달하고 있다는 것에 주목하세요. 함수를 `useState`에 전달하면 React는 초기화 중에만 함수를 호출합니다.</Trans>

React may [call your initializers twice](#my-initializer-or-updater-function-runs-twice) in development to verify that they are [pure.](/learn/keeping-components-pure)
<Trans>개발 환경에서는 React가 초기화 함수가 [순수](#my-initializer-or-updater-function-runs-twice)한지 확인하기 위해 [초기화 함수를 두 번 호출](/learn/keeping-components-pure)할 수 있습니다.</Trans>

<Recipes titleText="The difference between passing an initializer and passing the initial state directly" titleId="examples-initializer" translatedTitle="초기화 함수를 전달하는 것과 초기 상태를 직접 전달하는 것의 차이점">

#### Passing the initializer function <Trans>초기화 함수 전달하기</Trans> {/*passing-the-initializer-function*/}

This example passes the initializer function, so the `createInitialTodos` function only runs during initialization. It does not run when component re-renders, such as when you type into the input.
<Trans>이 예제에서는 초기화 함수를 전달하므로, `createInitialTodos` 함수는 초기화 중에만 실행됩니다. 컴포넌트가 리렌더링될 때(input에 타이핑할 때 등)에는 실행되지 않습니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Passing the initial state directly <Trans>초기 state 직접 전달하기</Trans> {/*passing-the-initial-state-directly*/}

This example **does not** pass the initializer function, so the `createInitialTodos` function runs on every render, such as when you type into the input. There is no observable difference in behavior, but this code is less efficient.
<Trans>이 예제에서는 초기화 함수를 전달하지 **않으므로,** input을 입력할 때와 같이 모든 렌더링에서 `createInitialTodos` 함수가 실행됩니다. 동작에 눈에 띄는 차이는 없지만 이 코드는 효율성이 떨어집니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Resetting state with a key <Trans>key로 state 재설정하기</Trans> {/*resetting-state-with-a-key*/}

You'll often encounter the `key` attribute when [rendering lists.](/learn/rendering-lists) However, it also serves another purpose.
<Trans>[목록을 렌더링](/learn/rendering-lists)할 때 `key` 속성을 자주 접하게 됩니다. 하지만 `key` 속성은 다른 용도로도 사용됩니다.</Trans>

You can **reset a component's state by passing a different `key` to a component.** In this example, the Reset button changes the `version` state variable, which we pass as a `key` to the `Form`. When the `key` changes, React re-creates the `Form` component (and all of its children) from scratch, so its state gets reset.
<Trans>**컴포넌트에 다른 `key`를 전달하여 컴포넌트의 state를 재설정**할 수 있습니다. 이 예제에서는 Reset 버튼이 `version` state 변수를 변경하고, 이를 `Form`에 `key`로 전달합니다. `key`가 변경되면 React는 `Form` 컴포넌트(및 그 모든 자식)를 처음부터 다시 생성하므로 state가 초기화됩니다.</Trans>

Read [preserving and resetting state](/learn/preserving-and-resetting-state) to learn more.
<Trans>자세히 알아보려면 [state 보존 및 재설정](/learn/preserving-and-resetting-state)을 읽어보세요.</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Hello, {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### Storing information from previous renders <Trans>이전 렌더링에서 얻은 정보 저장하기</Trans> {/*storing-information-from-previous-renders*/}

Usually, you will update state in event handlers. However, in rare cases you might want to adjust state in response to rendering -- for example, you might want to change a state variable when a prop changes.
<Trans>보통은 이벤트 핸들러에서 state를 업데이트합니다. 하지만 드물게 렌더링에 대한 응답으로 state를 조정해야 하는 경우도 있습니다. 예를 들어 props가 변경될 때 state 변수를 변경하고 싶을 수 있습니다.</Trans>

In most cases, you don't need this:
<Trans>대부분의 경우 이 기능은 필요하지 않습니다:</Trans>

* **If the value you need can be computed entirely from the current props or other state, [remove that redundant state altogether.](/learn/choosing-the-state-structure#avoid-redundant-state)** If you're worried about recomputing too often, the [`useMemo` Hook](/reference/react/useMemo) can help.
<Trans>**필요한 값을 현재 props나 다른 state에서 모두 계산할 수 있는 경우, [중복되는 state를 모두 제거하세요](#resetting-state-with-a-key)**. 너무 자주 재계산하는 것이 걱정된다면, [`useMemo` 훅](#resetting-state-with-a-key)을 사용하면 도움이 될 수 있습니다.</Trans>

* If you want to reset the entire component tree's state, [pass a different `key` to your component.](#resetting-state-with-a-key)
<Trans>전체 컴포넌트 트리의 state를 재설정하려면 [컴포넌트에 다른 `key`를 전달하세요](#resetting-state-with-a-key).</Trans>

* If you can, update all the relevant state in the event handlers.
<Trans>가능하다면 이벤트 핸들러의 모든 관련 state를 업데이트하세요.</Trans>

In the rare case that none of these apply, there is a pattern you can use to update state based on the values that have been rendered so far, by calling a `set` function while your component is rendering.
<Trans>이 중 어느 것에도 해당하지 않는 희귀한 경우에는, 컴포넌트가 렌더링되는 동안 `set` 함수를 호출하여 지금까지 렌더링된 값을 기반으로 state를 업데이트하는 데 사용할 수 있는 패턴이 있습니다.</Trans>

Here's an example. This `CountLabel` component displays the `count` prop passed to it:
<Trans>다음은 그 예시입니다. `CountLabel` 컴포넌트는 전달된 `count` props를 표시합니다:</Trans>

```js CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

Say you want to show whether the counter has *increased or decreased* since the last change. The `count` prop doesn't tell you this -- you need to keep track of its previous value. Add the `prevCount` state variable to track it. Add another state variable called `trend` to hold whether the count has increased or decreased. Compare `prevCount` with `count`, and if they're not equal, update both `prevCount` and `trend`. Now you can show both the current count prop and *how it has changed since the last render*.
<Trans>카운터가 마지막 변경 이후 *증가 또는 감소했는지*를 표시하고 싶다고 가정해 보겠습니다. `count` prop은 이를 알려주지 않으므로 이전 값을 추적해야 합니다. 이를 추적하기 위해 `prevCount` state 변수를 추가합니다. `trend`라는 또 다른 state 변수를 추가하여 count의 증가 또는 감소 여부를 추적합시다. `prevCount`와 `count`를 비교해서, 같지 않은 경우 `prevCount`와 `trend`를 모두 업데이트합니다. 이제 현재 count props와 마지막 렌더링 이후 count가 *어떻게* 변경되었는지 모두 표시할 수 있습니다.</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```js CountLabel.js active
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

Note that if you call a `set` function while rendering, it must be inside a condition like `prevCount !== count`, and there must be a call like `setPrevCount(count)` inside of the condition. Otherwise, your component would re-render in a loop until it crashes. Also, you can only update the state of the *currently rendering* component like this. Calling the `set` function of *another* component during rendering is an error. Finally, your `set` call should still [update state without mutation](#updating-objects-and-arrays-in-state) -- this doesn't mean you can break other rules of [pure functions.](/learn/keeping-components-pure)
<Trans>렌더링하는 동안 `set` 함수를 호출하는 경우, 그 `set` 함수는 `prevCount !== count`와 같은 조건 안에 있어야 하며, 조건 내부에 `setPrevCount(count)`와 같은 호출이 있어야 한다는 점에 유의하세요. 그렇지 않으면 리렌더링을 반복하다가 결국 깨질 것입니다. 또한 이 방식은 오직 *현재* 렌더링 중인 컴포넌트의 state만을 업데이트할 수 있습니다. 렌더링 중에 다른 컴포넌트의 `set` 함수를 호출하는 것은 에러입니다. 마지막으로, 이 경우에도 `set` 함수 호출은 여전히 [변이가 아닌 state 업데이트](#updating-objects-and-arrays-in-state)여야만 합니다. [순수 함수](/learn/keeping-components-pure)의 다른 규칙을 어겨도 된다는 의미가 아닙니다.</Trans>

This pattern can be hard to understand and is usually best avoided. However, it's better than updating state in an effect. When you call the `set` function during render, React will re-render that component immediately after your component exits with a `return` statement, and before rendering the children. This way, children don't need to render twice. The rest of your component function will still execute (and the result will be thrown away). If your condition is below all the Hook calls, you may add an early `return;` to restart rendering earlier.
<Trans>이 패턴은 이해하기 어려울 수 있으며 일반적으로 피하는 것이 가장 좋습니다. 하지만 Effect에서 state를 업데이트하는 것보다는 낫습니다. 렌더링 도중 `set` 함수를 호출하면 React는 컴포넌트가 `return`문으로 종료된 직후, 자식을 렌더링하기 전에, 해당 컴포넌트를 리렌더링 합니다. 이렇게 하면 자식 컴포넌트를 두 번 렌더링할 필요가 없습니다. 나머지 컴포넌트 함수는 계속 실행되고 결과는 버려집니다. 조건이 모든 훅 호출보다 아래에 있으면 이른(early) `return;`을 통해 렌더링을 더 일찍 다시 시작할 수 있습니다.</Trans>

---

## Troubleshooting<Trans>문제 해결</Trans> {/*troubleshooting*/}

### I've updated the state, but logging gives me the old value <Trans>state를 업데이트했지만 로그에는 계속 이전 값이 표시됩니다</Trans> {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

Calling the `set` function **does not change state in the running code**:
<Trans>`set` 함수를 호출해도 **실행 중인 코드의 state는 변경되지 않습니다**:</Trans>

```js {4,5,6,7,10,11}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Request a re-render with 1
                       // 1로 리렌더링 요청
  console.log(count);  // Still 0!
                       // 아직 0입니다! 

  setTimeout(() => {
    console.log(count); // Also 0!
                        // 여기도 0이고요!
  }, 5000);
}
```

This is because [states behaves like a snapshot.](/learn/state-as-a-snapshot) Updating state requests another render with the new state value, but does not affect the `count` JavaScript variable in your already-running event handler.
<Trans>그 이유는 [state가 스냅샷처럼 동작](/learn/state-as-a-snapshot)하기 때문입니다. state를 업데이트하면 새로운 state 값으로 다른 렌더링을 요청하지만 이미 실행 중인 이벤트 핸들러의 `count` 변수에는 영향을 미치지 않습니다.</Trans>

If you need to use the next state, you can save it in a variable before passing it to the `set` function:
<Trans>다음 state를 사용해야 하는 경우에는, `set` 함수에 전달하기 전에 변수에 저장할 수 있습니다:</Trans>

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### I've updated the state, but the screen doesn't update <Trans>state를 업데이트해도 화면이 바뀌지 않습니다</Trans> {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

React will **ignore your update if the next state is equal to the previous state,** as determined by an [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. This usually happens when you change an object or an array in state directly:
<Trans>React는 [Object.is](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is)비교 결과 **다음 state가 이전 state와 같으면 업데이트를 무시**합니다. 이는 보통 객체나 배열의 state를 직접 변경(변이)할 때 발생합니다:</Trans>

```js
obj.x = 10;  // 🚩 Wrong: mutating existing object
             // 🚩 잘못된 방법: 기존 객체를 변이
setObj(obj); // 🚩 Doesn't do anything
             // 🚩 아무것도 하지 않습니다.
```

You mutated an existing `obj` object and passed it back to `setObj`, so React ignored the update. To fix this, you need to ensure that you're always [_replacing_ objects and arrays in state instead of _mutating_ them](#updating-objects-and-arrays-in-state):
<Trans>기존 `obj` 객체를 변이한 후 다시 `setObj`로 전달했기 때문에 React가 업데이트를 무시했습니다. 이 문제를 해결하려면 [객체나 배열 state를 변이하는 대신 항상 교체](#updating-objects-and-arrays-in-state)해야 합니다:</Trans>

```js
// ✅ Correct: creating a new object
// ✅ 올바른 방법: 새로운 객체 생성
setObj({
  ...obj,
  x: 10
});
```

---

### I'm getting an error: "Too many re-renders" <Trans>에러가 발생했습니다: "리렌더링 횟수가 너무 많습니다”</Trans> {/*im-getting-an-error-too-many-re-renders*/}

You might get an error that says: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` Typically, this means that you're unconditionally setting state *during render*, so your component enters a loop: render, set state (which causes a render), render, set state (which causes a render), and so on. Very often, this is caused by a mistake in specifying an event handler:
<Trans>다음과 같은 에러가 발생할 수 있습니다: `리렌더링 횟수가 너무 많습니다. React는 무한 루프를 방지하기 위해 렌더링 횟수를 제한합니다.` 전형적으로 이는 *렌더링 중*에 state를 무조건적으로 설정하고 있음을 의미 하기 때문에, 컴포넌트가 렌더링, state 설정(렌더링 유발), 렌더링, state 설정(렌더링 유발) 등의 루프에 들어가는 것입니다. 이 문제는 이벤트 핸들러를 지정하는 과정에서 실수로 발생하는 경우가 많습니다:</Trans>

```js {1-3}
// 🚩 Wrong: calls the handler during render 
// 🚩 잘못된 방법: 렌더링 동안 핸들러 요청
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
// ✅ 올바른 방법: 이벤트 핸들러로 전달
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
// ✅ 올바른 방법: 인라인 함수로 전달
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

If you can't find the cause of this error, click on the arrow next to the error in the console and look through the JavaScript stack to find the specific `set` function call responsible for the error.
<Trans>이 에러의 원인을 찾을 수 없는 경우, 콘솔에서 에러 옆에 있는 화살표를 클릭한 뒤 JavaScript 스택에서 에러의 원인이 되는 특정 `set` 함수 호출을 찾아보세요.</Trans>

---

### My initializer or updater function runs twice <Trans>초기화 함수 또는 업데이터 함수가 두 번 실행됩니다</Trans> {/*my-initializer-or-updater-function-runs-twice*/}

In [Strict Mode](/reference/react/StrictMode), React will call some of your functions twice instead of once:
<Trans>[Strict Mode](/reference/react/StrictMode)에서 React는 일부 함수를 한 번이 아닌 두 번 호출합니다:</Trans>

```js {2-3,6-8,13-15}
function TodoList() {
  // This component function will run twice for every render.
  // 해당 함수형 컴포넌트는 렌더링 될 때마다 두 번 호출됩니다. 

  const [todos, setTodos] = useState(() => {
    // This initializer function will run twice during initialization.
    // 해당 초기화 함수는 초기화 동안 두 번 호출됩니다. 
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // This updater function will run twice for every click.
      // 해당 업데이터 함수는 클릭할 때마다 두 번 호출됩니다. 
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

This is expected and shouldn't break your code.
<Trans>이는 정상적인 현상이며, 이로 인해 코드가 손상되지 않아야 합니다.</Trans>

This **development-only** behavior helps you [keep components pure.](/learn/keeping-components-pure) React uses the result of one of the calls, and ignores the result of the other call. As long as your component, initializer, and updater functions are pure, this shouldn't affect your logic. However, if they are accidentally impure, this helps you notice the mistakes.
<Trans>이 **개발 환경 전용** 동작은 [컴포넌트를 순수하게 유지](/learn/keeping-components-pure)하는 데 도움이 됩니다. React는 호출 중 하나의 결과를 사용하고 다른 호출의 결과는 무시합니다. 컴포넌트, 초기화 함수, 업데이터 함수가 순수하다면 이 동작이 로직에 영향을 미치지 않습니다. 반면 의도치 않게 순수하지 않을 경우에는 실수를 알아차리는 데 도움이 됩니다.</Trans>

For example, this impure updater function mutates an array in state:
<Trans>예를 들어 순수하지 않은 업데이터 함수는 state의 배열을 다음과 같이 변이합니다:</Trans>


```js {2-4}
setTodos(prevTodos => {
  // 🚩 Mistake: mutating state
  // 🚩 실수: state 변이
  prevTodos.push(createTodo());
});
```

Because React calls your updater function twice, you'll see the todo was added twice, so you'll know that there is a mistake. In this example, you can fix the mistake by [replacing the array instead of mutating it](#updating-objects-and-arrays-in-state):
<Trans>React는 업데이터 함수를 두 번 호출하기 때문에 할 일이 두 번 추가되었음을 알 수 있으므로, 실수가 있음을 파악할 수 있습니다. 이 예제에서는 [배열을 변이하는 대신 교체](#updating-objects-and-arrays-in-state)하여 실수를 수정할 수 있습니다:</Trans>

```js {2-4}
setTodos(prevTodos => {
  // ✅ Correct: replacing with new state
  // ✅ 올바른 방법: 새로운 state로 교체
  return [...prevTodos, createTodo()];
});
```

Now that this updater function is pure, calling it an extra time doesn't make a difference in behavior. This is why React calling it twice helps you find mistakes. **Only component, initializer, and updater functions need to be pure.** Event handlers don't need to be pure, so React will never call your event handlers twice.
<Trans>이제 이 업데이터 함수는 순수하므로 한 번 더 호출해도 동작에 차이가 없습니다. 그렇기 때문에 React가 두 번 호출하는 것이 실수를 찾는 데 도움이 된다는 것입니다. **컴포넌트, 초기화 함수, 업데이터 함수는 순수해야 합니다**. 이벤트 핸들러는 순수할 필요가 없으므로 React는 이벤트 핸들러를 두 번 호출하지 않습니다.</Trans>

Read [keeping components pure](/learn/keeping-components-pure) to learn more.
<Trans>자세히 알아보려면 [컴포넌트 순수성 유지](/learn/keeping-components-pure)를 읽어보세요.</Trans>

---

### I'm trying to set state to a function, but it gets called instead <Trans>state의 값으로 함수를 설정하려고 하면 설정은 안되고 대신 호출됩니다</Trans> {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

You can't put a function into state like this:
<Trans>state에 함수를 넣을 수는 없습니다:</Trans>

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

Because you're passing a function, React assumes that `someFunction` is an [initializer function](#avoiding-recreating-the-initial-state), and that `someOtherFunction` is an [updater function](#updating-state-based-on-the-previous-state), so it tries to call them and store the result. To actually *store* a function, you have to put `() =>` before them in both cases. Then React will store the functions you pass.
<Trans>함수를 값으로 전달하면 React는 `someFunction`을 [초기화 함수](#avoiding-recreating-the-initial-state)로 여기고, `someOtherFunction`은 [업데이터 함수](#updating-state-based-on-the-previous-state)라고 받아들이며, 따라서 이들을 호출해서 그 결과를 저장하려고 시도합니다. 정말로 함수를 저장하길 원한다면, 두 경우 모두 함수 앞에 `() =>`를 넣어야 합니다. 그러면 React는 전달한 함수를 값으로써 저장합니다.</Trans>

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
