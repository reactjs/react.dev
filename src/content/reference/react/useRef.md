---
title: useRef
translators: [전시윤, 고석영]
---

<Intro>

`useRef` is a React Hook that lets you reference a value that's not needed for rendering.
<Trans>`useRef`는 렌더링에 필요하지 않은 값을 참조할 수 있는 React 훅입니다.</Trans>

```js
const ref = useRef(initialValue)
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `useRef(initialValue)` {/*useref*/}

Call `useRef` at the top level of your component to declare a [ref.](/learn/referencing-values-with-refs)
<Trans>컴포넌트의 최상위 레벨에서 `useRef`를 호출하여 [ref](/learn/referencing-values-with-refs)를 선언합니다.</Trans>

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

* `initialValue`: The value you want the ref object's `current` property to be initially. It can be a value of any type. This argument is ignored after the initial render.
<Trans>`initialValue`: ref 객체의 `current` 프로퍼티 초기 설정값입니다. 값으로는 모든 유형의 값이 들어갈 수 있습니다. 이 인자는 초기 렌더링이 지나면 무시됩니다.</Trans>

#### Returns<Trans>반환값</Trans> {/*returns*/}

`useRef` returns an object with a single property:
<Trans>`useRef`는 단일 프로퍼티를 가진 객체를 반환합니다:</Trans>

* `current`: Initially, it's set to the `initialValue` you have passed. You can later set it to something else. If you pass the ref object to React as a `ref` attribute to a JSX node, React will set its `current` property.
<Trans>`current`: 처음에는 전달한 `initialValue` 으로 설정됩니다. 나중에 다른 값으로 설정할 수 있습니다. ref 객체를 JSX 노드에 `ref` 속성으로 React에 전달하면 React는 `current` 프로퍼티를 설정합니다.</Trans>

On the next renders, `useRef` will return the same object.
<Trans>다음 렌더링에서 `useRef`는 동일한 객체를 반환합니다.</Trans>
#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

* You can mutate the `ref.current` property. Unlike state, it is mutable. However, if it holds an object that is used for rendering (for example, a piece of your state), then you shouldn't mutate that object.
<Trans>`ref.current` 프로퍼티는 state와 달리 변이할 수 있습니다. 그러나 렌더링에 사용되는 객체(예: stae의 일부)를 포함하는 경우 해당 객체를 변이해서는 안 됩니다.</Trans>
* When you change the `ref.current` property, React does not re-render your component. React is not aware of when you change it because a ref is a plain JavaScript object.
<Trans>`ref.current` 프로퍼티를 변경하면, React는 컴포넌트를 다시 렌더링하지 않습니다. ref는 일반 JavaScript 객체이기 때문에 React는 사용자가 언제 변경했는지 알지 못합니다.</Trans>
* Do not write _or read_ `ref.current` during rendering, except for [initialization.](#avoiding-recreating-the-ref-contents) This makes your component's behavior unpredictable.
<Trans>[초기화](#avoiding-recreating-the-ref-contents)를 제외하고는 렌더링 중에 `ref.current`를 쓰거나 *읽지* 마세요. 이렇게 하면 컴포넌트의 동작을 예측할 수 없게 됩니다.</Trans>
* In Strict Mode, React will **call your component function twice** in order to [help you find accidental impurities.](#my-initializer-or-updater-function-runs-twice) This is development-only behavior and does not affect production. Each ref object will be created twice, but one of the versions will be discarded. If your component function is pure (as it should be), this should not affect the behavior.
<Trans>Strict Mode에서 React는 [의도하지 않은 불순물을 찾기 위해](#my-initializer-or-updater-function-runs-twice) **컴포넌트 함수를 두 번 호출합니다.** 이는 개발 환경 전용 동작이며 상용 환경에는 영향을 미치지 않습니다. 즉, 각 ref 객체가 두 번 생성되고 그 중 하나는 버려집니다. 컴포넌트 함수가 순수하다면(그래야만 하는 것처럼) 컴포넌트의 로직에 영향을 미치지 않습니다.</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Referencing a value with a ref <Trans>ref로 값 참조하기</Trans> {/*referencing-a-value-with-a-ref*/}

Call `useRef` at the top level of your component to declare one or more [refs.](/learn/referencing-values-with-refs)
<Trans>컴포넌트의 최상위 레벨에서 `useRef`를 호출하여 하나 이상의 [ref](https://react.dev/learn/referencing-values-with-refs)를 선언합니다.</Trans>

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef` returns a <CodeStep step={1}>ref object</CodeStep> with a single <CodeStep step={2}>`current` property</CodeStep> initially set to the <CodeStep step={3}>initial value</CodeStep> you provided.
<Trans>`useRef`는 처음에 제공한 <CodeStep step={3}>초기값</CodeStep>으로 설정된 단일 <CodeStep step={2}>`current` 프로퍼티</CodeStep>가 있는 <CodeStep step={1}>ref 객체</CodeStep>를 반환합니다.</Trans>

On the next renders, `useRef` will return the same object. You can change its `current` property to store information and read it later. This might remind you of [state](/reference/react/useState), but there is an important difference.
<Trans>다음 렌더링에서 `useRef`는 동일한 객체를 반환합니다. 정보를 저장하고 나중에 읽도록 `current` 속성을 변경할 수 있습니다. [state](/reference/react/useState)를 떠올리실 수도 있지만, 중요한 차이점이 있습니다.</Trans>


**Changing a ref does not trigger a re-render.** This means refs are perfect for storing information that doesn't affect the visual output of your component. For example, if you need to store an [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) and retrieve it later, you can put it in a ref. To update the value inside the ref, you need to manually change its <CodeStep step={2}>`current` property</CodeStep>:
<Trans>**ref를 변경해도 재렌더링을 촉발하지 않습니다.** 즉, ref는 컴포넌트의 시각적 출력에 영향을 미치지 않는 정보를 저장하는 데 적합합니다. 예를 들어 [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)를 저장했다가 나중에 불러와야 하는 경우 ref에 넣을 수 있습니다. ref 내부의 값을 업데이트하려면 <CodeStep step={2}>`current` 프로퍼티</CodeStep>를 수동으로 변경해야 합니다:</Trans>

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

Later, you can read that interval ID from the ref so that you can call [clear that interval](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):
<Trans>나중에 ref에서 해당 interval ID를 읽어 [interval 지우기](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)를 호출할 수 있습니다:</Trans>

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

By using a ref, you ensure that:
<Trans>ref를 사용하면 다음을 보장할 수 있습니다:</Trans>

- You can **store information** between re-renders (unlike regular variables, which reset on every render).
- Changing it **does not trigger a re-render** (unlike state variables, which trigger a re-render).
- The **information is local** to each copy of your component (unlike the variables outside, which are shared).
<TransBlock>
  - 렌더링할 때마다 재설정되는 일반 변수와 달리 리렌더링 사이에 정보를 **저장**할 수 있습니다.
  - 리렌더링을 촉발하는 state 변수와 달리 변경해도 리렌더링을 촉발하지 않습니다.
  - 정보가 공유되는 외부 변수와 달리 각각의 컴포넌트에 **로컬**로 저장됩니다.
</TransBlock>

Changing a ref does not trigger a re-render, so refs are not appropriate for storing information you want to display on the screen. Use state for that instead. Read more about [choosing between `useRef` and `useState`.](/learn/referencing-values-with-refs#differences-between-refs-and-state)
<Trans>ref를 변경해도 다시 렌더링되지 않으므로 화면에 표시되는 정보를 저장하는 데는 ref가 적합하지 않습니다. 대신 state를 사용하세요. [`useRef`와 `useState` 중 선택하기](/learn/referencing-values-with-refs#differences-between-refs-and-state)에 대해 자세히 알아보세요.</Trans>

<Recipes titleText="Examples of referencing a value with useRef" titleId="examples-value">

#### Click counter <Trans>counter 클릭하기</Trans> {/*click-counter*/}

This component uses a ref to keep track of how many times the button was clicked. Note that it's okay to use a ref instead of state here because the click count is only read and written in an event handler.
<Trans>이 컴포넌트는 ref를 사용하여 버튼이 클릭된 횟수를 추적합니다. 클릭 횟수는 이벤트 핸들러에서만 읽고 쓰기 때문에 여기서는 state 대신 ref를 사용해도 괜찮습니다.</Trans>

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

If you show `{ref.current}` in the JSX, the number won't update on click. This is because setting `ref.current` does not trigger a re-render. Information that's used for rendering should be state instead.
<Trans>JSX에 `{ref.current}`를 표시하면 클릭 시 번호가 업데이트되지 않습니다. `ref.current`를 설정해도 재렌더링이 촉발하지 않기 때문입니다. 대신 렌더링에 사용되는 정보는 state여야 합니다.</Trans>

<Solution />

#### A stopwatch <Trans>스탑워치</Trans> {/*a-stopwatch*/}

This example uses a combination of state and refs. Both `startTime` and `now` are state variables because they are used for rendering. But we also need to hold an [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) so that we can stop the interval on button press. Since the interval ID is not used for rendering, it's appropriate to keep it in a ref, and manually update it.
<Trans>예제에서는 state와 ref의 조합을 사용합니다. `startTime`과 `now`는 모두 렌더링에 사용되기 때문에 state 변수입니다. 하지만 버튼을 누를 때 간격을 멈출 수 있도록 [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)도 보유해야 합니다. interval ID는 렌더링에 사용되지 않으므로 ref에 보관하고 수동으로 업데이트하는 것이 적절합니다.</Trans>

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

<Solution />

</Recipes>

<Pitfall>

**Do not write _or read_ `ref.current` during rendering.**
<Trans>렌더링 중에는 `ref.current`를 쓰거나 _읽지_ 마세요.</Trans>

React expects that the body of your component [behaves like a pure function](/learn/keeping-components-pure):
<Trans>React는 컴포넌트의 본문이 [순수 함수처럼 동작하기](/learn/keeping-components-pure)를 기대합니다:</Trans>

- If the inputs ([props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), and [context](/learn/passing-data-deeply-with-context)) are the same, it should return exactly the same JSX.
- Calling it in a different order or with different arguments should not affect the results of other calls.
<TransBlock>
  - 입력([props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), [context](/learn/passing-data-deeply-with-context))이 동일하면 정확히 동일한 JSX를 반환해야 합니다.
  - 다른 순서나 다른 인수를 사용하여 호출해도 다른 호출의 결과에 영향을 미치지 않아야 합니다.
</TransBlock>

Reading or writing a ref **during rendering** breaks these expectations.
<Trans>**렌더링 중에** ref를 읽거나 쓰면 이러한 기대가 깨집니다.</Trans>

```js {3-5,7-9}
function MyComponent() {
  // ...
  // 🚩 Don't write a ref during rendering
  // 🚩 렌더링 중에 ref를 작성하지 마세요.
  myRef.current = 123;
  // ...
  // 🚩 Don't read a ref during rendering
  // 🚩 렌더링 중에 ref를 읽지 마세요.
  return <h1>{myOtherRef.current}</h1>;
}
```

You can read or write refs **from event handlers or effects instead**.
<Trans>**대신 이벤트 핸들러나 Effect에서** ref를 읽거나 쓸 수 있습니다.</Trans>

```js {4-6,10-12}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ You can read or write refs in effects
    // ✅ Effect에서 ref를 읽거나 쓸 수 있습니다.
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ You can read or write refs in event handlers
    // ✅ 이벤트 핸들러에서 ref를 읽거나 쓸 수 있습니다.
    doSomething(myOtherRef.current);
  }
  // ...
}
```

If you *have to* read [or write](/reference/react/useState#storing-information-from-previous-renders) something during rendering, [use state](/reference/react/useState) instead.
<Trans>렌더링 중에 무언가를 [읽거나](/reference/react/useState#storing-information-from-previous-renders) 써야 하는 경우, [state](/reference/react/useState)를 대신 사용하세요.</Trans>

When you break these rules, your component might still work, but most of the newer features we're adding to React will rely on these expectations. Read more about [keeping your components pure.](/learn/keeping-components-pure#where-you-can-cause-side-effects)
<Trans>이러한 규칙을 어겨도 컴포넌트는 여전히 작동할 수 있지만, React에 추가되는 대부분의 새로운 기능은 이러한 기대치에 의존합니다. 자세한 내용은 [컴포넌트를 순수하게 유지하기](/learn/keeping-components-pure#where-you-can-cause-side-effects)에서 확인하세요.</Trans>

</Pitfall>

---

### Manipulating the DOM with a ref <Trans>ref로 DOM 조작하기</Trans> {/*manipulating-the-dom-with-a-ref*/}

It's particularly common to use a ref to manipulate the [DOM.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API) React has built-in support for this.
<Trans>ref를 사용하여 [DOM](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API)을 조작하는 것은 특히 일반적입니다. React에는 이를 위한 기본 지원이 있습니다.</Trans>

First, declare a <CodeStep step={1}>ref object</CodeStep> with an <CodeStep step={3}>initial value</CodeStep> of `null`:
<Trans>먼저 <CodeStep step={3}>초기값</CodeStep>이 `null`인 <CodeStep step={1}>ref 객체</CodeStep>를 선언합니다:</Trans>

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

Then pass your ref object as the `ref` attribute to the JSX of the DOM node you want to manipulate:
<Trans>그런 다음 ref 객체를 `ref` 속성로 조작하려는 DOM 노드의 JSX에 전달합니다:</Trans>

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

After React creates the DOM node and puts it on the screen, React will set the <CodeStep step={2}>`current` property</CodeStep> of your ref object to that DOM node. Now you can access the `<input>`'s DOM node and call methods like [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus):
<Trans>React가 DOM 노드를 생성하고 화면에 그린 후, React는 ref 객체의 <CodeStep step={2}>`current`프로퍼티</CodeStep>를 DOM 노드로 설정합니다. 이제 DOM 노드 `<input>` 접근해 [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)와 같은 메서드를 호출할 수 있습니다.</Trans>

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

React will set the `current` property back to `null` when the node is removed from the screen.
<Trans>React는 노드가 화면에서 제거되면 `current` 프로퍼티를 `null`로 다시 설정합니다.</Trans>

Read more about [manipulating the DOM with Refs.](/learn/manipulating-the-dom-with-refs)
<Trans>[ref로 DOM 조작하기](/learn/manipulating-the-dom-with-refs)에 대해 자세히 알아보세요.</Trans>

<Recipes titleText="Examples of manipulating the DOM with useRef" titleId="examples-dom">

#### Focusing a text input <Trans>텍스트 input에 초점 맞추기</Trans> {/*focusing-a-text-input*/}

In this example, clicking the button will focus the input:
<Trans>예제에서는 버튼을 클릭하면 입력에 초점이 맞춰집니다:</Trans>

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

<Solution />

#### Scrolling an image into view <Trans>이미지 스크롤하기</Trans> {/*scrolling-an-image-into-view*/}

In this example, clicking the button will scroll an image into view. It uses a ref to the list DOM node, and then calls DOM [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) API to find the image we want to scroll to.
<Trans>예제에서는 버튼을 클릭하면 이미지가 스크롤됩니다. 목록 DOM 노드에 대한 ref를 사용한 다음 DOM [`querySelectorAll`](https://developer.mozilla.org/ko/docs/Web/API/Document/querySelectorAll) API를 호출하여 스크롤하려는 이미지를 찾습니다</Trans>

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const listRef = useRef(null);

  function scrollToIndex(index) {
    const listNode = listRef.current;
    // This line assumes a particular DOM structure:
    // 다음 코드는 특정 DOM 구조를 가정합니다.
    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>
          Tom
        </button>
        <button onClick={() => scrollToIndex(1)}>
          Maru
        </button>
        <button onClick={() => scrollToIndex(2)}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<Solution />

#### Playing and pausing a video <Trans>비디오 재생 및 정지하기</Trans> {/*playing-and-pausing-a-video*/}

This example uses a ref to call [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) and [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) on a `<video>` DOM node.
<Trans>예시에서는 ref를 사용하여 `<video>` DOM 노드에서 [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) 및 [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause)를 호출합니다.</Trans>

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution />

#### Exposing a ref to your own component <Trans>컴포넌트에 ref 노출하기</Trans> {/*exposing-a-ref-to-your-own-component*/}

Sometimes, you may want to let the parent component manipulate the DOM inside of your component. For example, maybe you're writing a `MyInput` component, but you want the parent to be able to focus the input (which the parent has no access to). You can use a combination of `useRef` to hold the input and [`forwardRef`](/reference/react/forwardRef) to expose it to the parent component. Read a [detailed walkthrough](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) here.
<Trans>때로는 부모 컴포넌트가 컴포넌트 내부의 DOM을 조작할 수 있도록 하고 싶을 때가 있습니다. 예를 들어, `MyInput` 컴포넌트를 작성하고 있지만 부모 컴포넌트가 (부모가 접근할 수 없는) 입력에 포커스를 맞출 수 있게 하고 싶을 수 있습니다. `useRef`를 조합하여 입력을 유지하고 [`forwardRef`](/reference/react/forwardRef)를 사용하여 부모 컴포넌트에 노출할 수 있습니다. [자세한 내용은 여기에서 확인하세요.](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)</Trans>

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Avoiding recreating the ref contents <Trans>ref 콘텐츠 재생성 피하기</Trans> {/*avoiding-recreating-the-ref-contents*/}

React saves the initial ref value once and ignores it on the next renders.
React는 초기 ref 값을 한 번 저장하고 다음 렌더링에서 이를 무시합니다.

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

Although the result of `new VideoPlayer()` is only used for the initial render, you're still calling this function on every render. This can be wasteful if it's creating expensive objects.
<Trans>`new VideoPlayer()`의 결과는 초기 렌더링에만 사용되지만, 여전히 모든 렌더링에서 이 함수를 호출하게 됩니다. 이는 값비싼 객체를 생성하는 경우 낭비일 수 있습니다.</Trans>

To solve it, you may initialize the ref like this instead:
<Trans>이 문제를 해결하려면 대신 다음과 같이 ref를 초기화할 수 있습니다:</Trans>

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

Normally, writing or reading `ref.current` during render is not allowed. However, it's fine in this case because the result is always the same, and the condition only executes during initialization so it's fully predictable.
<Trans>일반적으로 렌더링 중에 `ref.current`를 쓰거나 읽는 것은 허용되지 않습니다. 하지만 이 경우에는 결과가 항상 동일하고 초기화 중에만 조건이 실행되므로 충분히 예측할 수 있으므로 괜찮습니다.</Trans>

<DeepDive>

#### How to avoid null checks when initializing useRef later <Trans>useRef를 초기화할 때 null 검사를 피하는 방법</Trans> {/*how-to-avoid-null-checks-when-initializing-use-ref-later*/}

If you use a type checker and don't want to always check for `null`, you can try a pattern like this instead:
<Trans>타입 검사기를 사용하면서 항상 `null`을 검사하고 싶지 않다면 다음과 같은 패턴을 대신 사용해 볼 수 있습니다:</Trans>

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

Here, the `playerRef` itself is nullable. However, you should be able to convince your type checker that there is no case in which `getPlayer()` returns `null`. Then use `getPlayer()` in your event handlers.
<Trans>여기서 `playerRef` 자체는 nullable합니다. 하지만 타입 검사기에 `getPlayer()`가 `null`을 반환하는 경우가 없다는 것을 확신시킬 수 있어야 합니다. 그런 다음 이벤트 핸들러에서 `getPlayer()`를 사용하십시오.</Trans>

</DeepDive>

---

## Troubleshooting<Trans>문제 해결</Trans> {/*troubleshooting*/}

### I can't get a ref to a custom component <Trans>커스텀 컴포넌트에 대한 ref를 얻을 수 없습니다.</Trans> {/*i-cant-get-a-ref-to-a-custom-component*/}

If you try to pass a `ref` to your own component like this:
<Trans>컴포넌트에 `ref`를 전달하려고 하면:</Trans>

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

You might get an error in the console:
<Trans>콘솔에서 오류가 발생할 수 있습니다:</Trans>

<ConsoleBlock level="error">

Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
<Trans>경고: 함수 컴포넌트에는 ref를 지정할 수 없습니다. 이 ref에 접근하려는 시도는 실패합니다. React.forwardRef()를 사용하려고 하셨나요?</Trans>

</ConsoleBlock>

By default, your own components don't expose refs to the DOM nodes inside them.
<Trans>기본적으로 자체 컴포넌트는 내부의 DOM 노드에 ref를 노출하지 않습니다.</Trans>

To fix this, find the component that you want to get a ref to:
<Trans>이 문제를 해결하려면 ref를 가져오고자 하는 컴포넌트를 찾습니다:</Trans>

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

And then wrap it in [`forwardRef`](/reference/react/forwardRef) like this:
<Trans>그런 다음 다음과 같이 [`forwardRef`](/reference/react/forwardRef)로 묶습니다:</Trans>

```js {3,8}
import { forwardRef } from 'react';

const MyInput = forwardRef(({ value, onChange }, ref) => {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
});

export default MyInput;
```

Then the parent component can get a ref to it.
<Trans>그러면 부모 컴포넌트가 ref를 가져올 수 있습니다.</Trans>

Read more about [accessing another component's DOM nodes.](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)
<Trans>자세한 내용은 [다른 컴포넌트의 DOM 노드에 접근하기](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)에서 확인하세요.</Trans>