---
title: 'Synchronizing with Effects'
translatedTitle: 'Effect와 동기화하기'
translators: [손한종, 정재남, 최다인, 이지수, 고석영]
---

<Intro>

Some components need to synchronize with external systems. For example, you might want to control a non-React component based on the React state, set up a server connection, or send an analytics log when a component appears on the screen. *Effects* let you run some code after rendering so that you can synchronize your component with some system outside of React.
<Trans>일부 컴포넌트는 외부 시스템과 동기화해야 합니다. 예를 들어, React state를 기반으로 React가 아닌 컴포넌트를 제어하거나 서버 연결을 설정하거나 컴포넌트가 화면에 나타날 때 분석 로그를 보낼 수 있습니다. *Effect*를 사용하면 렌더링 이후 일부 코드를 실행할 수 있으므로 컴포넌트를 React 외부의 시스템과 동기화할 수 있습니다.</Trans>

</Intro>

<YouWillLearn>

- What Effects are
- How Effects are different from events
- How to declare an Effect in your component
- How to skip re-running an Effect unnecessarily
- Why Effects run twice in development and how to fix them


<TransBlock>
- Effect가 무엇인지
- Effect와 이벤트의 차이점
- 컴포넌트에서 Effect를 선언하는 방법
- 불필요하게 Effect를 재실행하는 것을 건너뛰는 방법
- 개발시 Effect가 두번 실행되는 이유와 해결 방법
</TransBlock>

</YouWillLearn>

## What are Effects and how are they different from events?<Trans>Effect란 무엇이며 이벤트와는 어떤게 다른가요?</Trans> {/*what-are-effects-and-how-are-they-different-from-events*/}

Before getting to Effects, you need to be familiar with two types of logic inside React components:
<Trans>Effect에 도달하기 전에 React 컴포넌트 내부의 두가지 유형의 논리에 익숙해져야 합니다.</Trans>

- **Rendering code** (introduced in [Describing the UI](/learn/describing-the-ui)) lives at the top level of your component. This is where you take the props and state, transform them, and return the JSX you want to see on the screen. [Rendering code must be pure.](/learn/keeping-components-pure) Like a math formula, it should only _calculate_ the result, but not do anything else.
  <Trans>**렌더링 코드**([UI 구성하기](/learn/describing-the-ui)에서 소개됨)는 컴포넌트의 최상위 레벨에 있습니다. 여기서 props와 state를 가져와 변환하고 화면에 표시할 JSX를 반환합니다. [렌더링 코드는 순수해야합니다.](/learn/keeping-components-pure) 수학 공식처럼 결과만 계산할 뿐 다른 작업은 수행하지 않습니다.</Trans>

- **Event handlers**(introduced in [Adding Interactivity](/learn/adding-interactivity)) are nested functions inside your components that *do* things rather than just calculate them. An event handler might update an input field, submit an HTTP POST request to buy a product, or navigate the user to another screen. Event handlers contain ["side effects"](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) (they change the program's state) caused by a specific user action (for example, a button click or typing).
  <Trans>**이벤트 핸들러**([상호작용 추가하기](/learn/adding-interactivity)에서 소개됨)는 컴포넌트 내부에 있는 중첩된 함수로, 계산만 하는 것이 아니라 별도의 작업도 *수행*합니다. 이벤트 핸들러에서는 입력 필드를 업데이트하거나, HTTP POST요청을 제출하여 제품을 구매하거나, 사용자를 다른 화면으로 이동할 수 있습니다. 이벤트 핸들러에는 특정 사용자 작업(예:버튼 클릭 또는 입력)으로 인해 발생하는 ["사이드 이펙트"](https://en.wikipedia.org/wiki/Side_effect_(computer_science))(프로그램의 state를 변경함)가 포함되어 있습니다.</Trans>

Sometimes this isn't enough. Consider a `ChatRoom` component that must connect to the chat server whenever it's visible on the screen. Connecting to a server is not a pure calculation (it's a side effect) so it can't happen during rendering. However, there is no single particular event like a click that causes `ChatRoom` to be displayed.
<Trans>때로는 이것만으로는 충분하지 않을 수 있습니다. 화면에 표시될 때마다 채팅 서버에 연결해야 하는 `ChatRoom` 컴포넌트를 고려해 봅시다. 서버에 연결하는 것은 순수한 계산이 아니므로(사이드 이펙트) 렌더링 중에 발생할 수 없습니다. 그러나 `ChatRoom` 표시를 유발하는 클릭과 같은 특정한 단일 이벤트는 없습니다.</Trans>

***Effects* let you specify side effects that are caused by rendering itself, rather than by a particular event.** Sending a message in the chat is an *event* because it is directly caused by the user clicking a specific button. However, setting up a server connection is an *Effect* because it should happen no matter which interaction caused the component to appear. Effects run at the end of a [commit](/learn/render-and-commit) after the screen updates. This is a good time to synchronize the React components with some external system (like network or a third-party library).
<Trans>***Effect*를 사용하면 특정 이벤트가 아닌 렌더링 자체로 인해 발생하는 사이드 이펙트를 명시할 수 있습니다.** 채팅에서 메시지를 보내는 것은 사용자가 특정 버튼을 클릭함으로써 직접적으로 발생하기 때문에 이벤트입니다. 그러나 서버 연결을 설정하는 것은 컴포넌트를 표시하게 만든 상호작용에 관계없이 발생해야 하기 때문에 하나의 Effect입니다. Effect는 화면 업데이트 후 [커밋](/learn/render-and-commit)이 끝날 때 실행됩니다. 이 때가 React 컴포넌트를 일부 외부 시스템(네트워크 또는 타사 라이브러리와 같은)과 동기화하기에 좋은 시기입니다.</Trans>

<Note>

Here and later in this text, capitalized "Effect" refers to the React-specific definition above, i.e. a side effect caused by rendering. To refer to the broader programming concept, we'll say "side effect".
<Trans>이 글에서 대문자로 시작하는 “Effect”는 위의 React에 한정된 정의, 즉 렌더링으로 인해 발생하는 사이드 이펙트를 나타냅니다. 더 넓은 프로그래밍 개념을 언급할 때는 "사이드 이펙트"라고 하겠습니다.</Trans>

</Note>

## You might not need an Effect <Trans>Effect가 필요하지 않을 수 있습니다</Trans> {/*you-might-not-need-an-effect*/}

**Don't rush to add Effects to your components.** Keep in mind that Effects are typically used to "step out" of your React code and synchronize with some *external* system. This includes browser APIs, third-party widgets, network, and so on. If your Effect only adjusts some state based on other state, [you might not need an Effect.](/learn/you-might-not-need-an-effect)
<Trans>**컴포넌트에 Effect를 추가하고자 서두르지 마세요.** Effect는 일반적으로 React 코드에서 벗어나 일부 *외부* 시스템과 동기화하는 데에 사용된다는 점을 명심하세요. 여기에는 브라우저 API, 서드파티 위젯, 네트워크 등이 포함됩니다. Effect가 다른 state를 기반으로 일부 state만을 조정하는 경우, [Effect가 필요하지 않을 수 있습니다.](/learn/you-might-not-need-an-effect)</Trans>

## How to write an Effect <Trans>Effect 작성 방법</Trans> {/*how-to-write-an-effect*/}

To write an Effect, follow these three steps:
<Trans>Effect를 작성하려면 다음 세 단계를 따르십시오.</Trans>

1. **Declare an Effect.** By default, your Effect will run after every render.
  <Trans>**Effect를 선언합니다.** 기본적으로 Effect는 모든 렌더링 후에 실행됩니다.</Trans>
2. **Specify the Effect dependencies.** Most Effects should only re-run *when needed* rather than after every render. For example, a fade-in animation should only trigger when a component appears. Connecting and disconnecting to a chat room should only happen when the component appears and disappears, or when the chat room changes. You will learn how to control this by specifying *dependencies.*
  <Trans>**Effect의 의존성을 명시합니다.** 대부분의 Effect는 렌더링 할 때마다가 아니라 *필요할 때만* 다시 실행해야 합니다. 예를 들어 페이드 인 애니메이션은 컴포넌트가 나타날 때만 발동되어야 합니다. 대화방 연결 및 해제는 컴포넌트가 나타났다가 사라지거나 대화방이 변경될 때만 발생해야합니다. *의존성*을 지정하여 이를 제어하는 방법은 이 글 아래에서 다룹니다.</Trans>
3. **Add cleanup if needed.** Some Effects need to specify how to stop, undo, or clean up whatever they were doing. For example, "connect" needs "disconnect", "subscribe" needs "unsubscribe", and "fetch" needs either "cancel" or "ignore". You will learn how to do this by returning a *cleanup function*.
  <Trans>**필요한 경우 클린업을 추가합니다.** 일부 Effect는 수행중이던 작업을 중지, 취소 또는 정리하는 방법을 명시해야합니다. 예를 들어 “connect”에는 “disconnect”가 필요하고 “subscribe”에는 “unsubscribe”가 필요하며 “fetch”에는 “cancel”또는 “ignore”가 필요합니다. 뒤에서 *클린업 함수*를 반환하여 이를 수행하는 방법은 이 글 아래에서 다룹니다.</Trans>

Let's look at each of these steps in detail.
<Trans>각 단계를 자세히 살펴보겠습니다.</Trans>

### Step 1: Declare an Effect <Trans>Effect 선언하기</Trans> {/*step-1-declare-an-effect*/}

To declare an Effect in your component, import the [`useEffect` Hook](/reference/react/useEffect) from React:
<Trans>컴포넌트에 Effect를 선언하기 위해서 React에서 [`useEffect` 훅](/reference/react/useEffect)을 import합니다:</Trans>

```js
import { useEffect } from 'react';
```

Then, call it at the top level of your component and put some code inside your Effect:
<Trans>그런 다음, 컴포넌트의 최상위 레벨에서 호출하고 Effect 내부에 코드를 추가합니다:</Trans>

```js {2-5}
function MyComponent() {
  useEffect(() => {
    // Code here will run after *every* render
    // 여기의 코드는 매 랜더링 후에 실행됩니다.
  });
  return <div />;
}
```

Every time your component renders, React will update the screen *and then* run the code inside `useEffect`. In other words, **`useEffect` "delays" a piece of code from running until that render is reflected on the screen.**
<Trans>컴포넌트가 렌더링될 때마다 React는 화면을 업데이트하고 `useEffect` 내부의 코드를 실행합니다. 즉, **`useEffect`는 해당 렌더링이 화면에 반영이 될 때까지 코드 조각의 실행을 “지연”합니다**.</Trans>

Let's see how you can use an Effect to synchronize with an external system. Consider a `<VideoPlayer>` React component. It would be nice to control whether it's playing or paused by passing an `isPlaying` prop to it:
<Trans>Effect를 사용하여 외부 시스템과 동기화하는 방법을 살펴보겠습니다. `<VideoPlayer>` React 컴포넌트를 생각해보세요. `isPlaying` prop을 전달하여 재생 또는 일시 중지 여부를 제어하면 좋을 것 같습니다:</Trans>

```js
<VideoPlayer isPlaying={isPlaying} />;
```

Your custom `VideoPlayer` component renders the built-in browser [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) tag:
<Trans>커스텀 컴포넌트 `VideoPlayer`는 내장 브라우저 [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)태그를 렌더링합니다:</Trans>

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: do something with isPlaying
  return <video src={src} />;
}
```

However, the browser `<video>` tag does not have an `isPlaying` prop. The only way to control it is to manually call the [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) and [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) methods on the DOM element. **You need to synchronize the value of `isPlaying` prop, which tells whether the video _should_ currently be playing, with calls like `play()` and `pause()`.**
<Trans>그러나, 브라우저 `<video>`태그에는 `isPlaying` prop이 없습니다. 이를 제어하는 유일한 방법은 DOM요소에서 [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) 와 [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) 메서드를 수동으로 호출하는 것입니다. **비디오가 현재 재생되어야 하는지 여부를 알려주는 `isPlaying` prop값을 `play()` 및 `pause()`와 같은 함수를 호출과 동기화해야합니다.**</Trans>

We'll need to first [get a ref](/learn/manipulating-the-dom-with-refs) to the `<video>` DOM node.
<Trans>먼저 `<video>` DOM 노드에 대한 [ref를 가져와야합니다.](/learn/manipulating-the-dom-with-refs)</Trans>

You might be tempted to try to call `play()` or `pause()` during rendering, but that isn't correct:
<Trans>렌더링 중에 `play()` 또는 `pause()` 함수를 호출하고 싶을 수 있지만, 이는 올바르지 않습니다:</Trans>

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // Calling these while rendering isn't allowed.
  } else {
    ref.current.pause(); // Also, this crashes.
  }

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

The reason this code isn't correct is that it tries to do something with the DOM node during rendering. In React, [rendering should be a pure calculation](/learn/keeping-components-pure) of JSX and should not contain side effects like modifying the DOM.
<Trans>이 코드가 올바르지 않은 이유는 렌더링 중에 DOM 노드로 무언가를 시도하기 때문입니다. React에서 [렌더링은 JSX의 순수한 계산이어야](/learn/keeping-components-pure) 하며 DOM 수정과 같은 사이드 이펙트를 포함해서는 안됩니다.</Trans>

Moreover, when `VideoPlayer` is called for the first time, its DOM does not exist yet! There isn't a DOM node yet to call `play()` or `pause()` on, because React doesn't know what DOM to create until you return the JSX.
<Trans>더구나 `VideoPlayer`가 처음 호출될 때 DOM은 아직 존재하지 않습니다! React는 JSX를 반환하기 전까지는 어떤 DOM을 생성할지 모르기 때문입니다. `play()`나 `pause()`를 호출할 DOM 노드가 아직 없는 상태입니다.</Trans>

The solution here is to **wrap the side effect with `useEffect` to move it out of the rendering calculation:**
<Trans>해결책은 **사이드 이펙트를 `useEffect`로 감싸 렌더링 계산 밖으로 옮기는 것입니다.**</Trans>

```js {6,12}
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

By wrapping the DOM update in an Effect, you let React update the screen first. Then your Effect runs.
<Trans>DOM 업데이트를 Effect로 감싸면, React가 먼저 화면을 업데이트하도록 할 수 있습니다. 그런 다음 Effect가 실행됩니다.</Trans>

When your `VideoPlayer` component renders (either the first time or if it re-renders), a few things will happen. First, React will update the screen, ensuring the `<video>` tag is in the DOM with the right props. Then React will run your Effect. Finally, your Effect will call `play()` or `pause()` depending on the value of `isPlaying`.
<Trans>`VideoPlayer` 컴포넌트가 렌더링될 때 (처음 렌더링하거나 다시 렌더링하는 경우) 몇 가지 일이 발생합니다. 먼저 React는 화면을 업데이트하여 `<video>`태그가 올바른 props와 함께 DOM에 있는지 확인합니다. 그러면 React가 Effect를 실행할 것입니다. 마지막으로 Effect는 `isPlaying`의 값에 따라 `play()`나 `pause()`를 호출합니다.</Trans>

Press Play/Pause multiple times and see how the video player stays synchronized to the `isPlaying` value:
<Trans>재생/일시 중지 버튼을 여러 번 누르고, 비디오 플레이어가 어떻게 `isPlaying` 값과 동기화 상태를 유지하고 있는지 확인해 보세요:</Trans>

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
  });

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

In this example, the "external system" you synchronized to React state was the browser media API. You can use a similar approach to wrap legacy non-React code (like jQuery plugins) into declarative React components.
<Trans>이 예제에서 React state에 동기화한 "외부 시스템"은 브라우저 미디어 API였습니다. 비슷한 접근 방식으로 React가 아닌 레거시 코드(예: jQuery 플러그인)를 선언적인 React 컴포넌트로 감쌀 수 있습니다.</Trans>

Note that controlling a video player is much more complex in practice. Calling `play()` may fail, the user might play or pause using the built-in browser controls, and so on. This example is very simplified and incomplete.
<Trans>동영상 플레이어 제어는 실제로는 훨씬 더 복잡하다는 점에 유의하세요. `play()` 호출이 실패할 수도 있고, 사용자가 내장된 브라우저 컨트롤을 사용하여 재생하거나 일시정지할 수도 있습니다. 이 예시는 매우 단순하고 불완전합니다.</Trans>
<Pitfall>

By default, Effects run after *every* render. This is why code like this will **produce an infinite loop:**
<Trans>기본적으로 Effect는 *매번* 렌더링 후에 실행됩니다. 그렇기 때문에 다음과 같은 코드는 **무한 루프를 생성합니다:**</Trans>

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

Effects run as a *result* of rendering. Setting state *triggers* rendering. Setting state immediately in an Effect is like plugging a power outlet into itself. The Effect runs, it sets the state, which causes a re-render, which causes the Effect to run, it sets the state again, this causes another re-render, and so on.
<Trans>Effect는 렌더링의 *결과*로 실행됩니다. state를 설정하면 렌더링이 *발동*됩니다. Effect에서 즉시 state를 설정하는 것은 전원 콘센트를 꽂는 것과 같습니다. Effect가 실행되고, state를 설정하면 다시 렌더링이 발생하고, 다시 렌더링이 발생하면 Effect가 실행되고, 다시 state를 설정하면 또 다시 렌더링이 발생하는 식입니다.</Trans>

Effects should usually synchronize your components with an *external* system. If there's no external system and you only want to adjust some state based on other state, [you might not need an Effect.](/learn/you-might-not-need-an-effect)
<Trans>Effect는 보통 컴포넌트를 외부 시스템과 동기화해야 합니다. 외부 시스템이 없고 다른 state를 기반으로 일부 state만 조정하려는 경우 [Effect가 필요하지 않을 수 있습니다.](/learn/you-might-not-need-an-effect)</Trans>
</Pitfall>

### Step 2: Specify the Effect dependencies<Trans>Effect 의존성 지정하기</Trans> {/*step-2-specify-the-effect-dependencies*/}

By default, Effects run after *every* render. Often, this is **not what you want:**
<Trans>기본적으로 Effect는 *매번* 렌더링 후에 실행됩니다. 하지만 이를 **원하지 않는** 경우가 있습니다.</Trans>

- Sometimes, it's slow. Synchronizing with an external system is not always instant, so you might want to skip doing it unless it's necessary. For example, you don't want to reconnect to the chat server on every keystroke.

- Sometimes, it's wrong. For example, you don't want to trigger a component fade-in animation on every keystroke. The animation should only play once when the component appears for the first time.

<TransBlock>
- 때로는 속도가 느릴 수 있습니다. 외부 시스템과의 동기화가 항상 즉각적인 것은 아니므로 꼭 필요한 경우가 아니라면 동기화를 건너뛰는 것이 좋습니다. 예를 들어, 키 입력 시마다 채팅 서버에 다시 연결하고 싶지 않을 수 있습니다.
- 때로는 잘못된 경우가 있습니다. 예를 들어 키 입력 시마다 컴포넌트 페이드인 애니메이션을 발동시키고 싶지 않을 수 있습니다. 애니메이션은 컴포넌트가 처음 나타날 때 한 번만 재생되어야 합니다.
</TransBlock>

To demonstrate the issue, here is the previous example with a few `console.log` calls and a text input that updates the parent component's state. Notice how typing causes the Effect to re-run:
<Trans>이 문제를 알아보기 위해 이전 예시를 살짝 바꿔봅시다. 몇 개의 `console.log` 호출과 부모 컴포넌트의 state를 업데이트하는 텍스트 입력창을 추가했습니다. 타이핑하면 Effect가 다시 실행되는 것을 확인할 수 있습니다:</Trans>

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

You can tell React to **skip unnecessarily re-running the Effect** by specifying an array of *dependencies* as the second argument to the `useEffect` call. Start by adding an empty `[]` array to the above example on line 14:
<Trans>`useEffect` 호출의 두 번째 인자로 *의존성* 배열을 지정하여 React가 **불필요하게 Effect를 다시 실행하지 않도록 지시할 수 있습니다.** 위의 예시 14번 줄에 빈 `[]` 배열을 추가하는 것으로 시작하세요:</Trans>

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

You should see an error saying `React Hook useEffect has a missing dependency: 'isPlaying'`:
<Trans>`React useEffect 훅에 누락된 의존성이 있습니다: 'isPlaying'` 라는 오류가 표시될 것입니다:</Trans>

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, []); // This causes an error

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

The problem is that the code inside of your Effect *depends on* the `isPlaying` prop to decide what to do, but this dependency was not explicitly declared. To fix this issue, add `isPlaying` to the dependency array:
<Trans>문제는 Effect 내부의 코드가 `isPlaying` prop에 *의존하여* 수행할 작업을 결정하는데, 이 의존성이 명시적으로 선언되지 않았다는 것입니다. 이 문제를 해결하려면 의존성 배열에 `isPlaying`을 추가하세요:</Trans>

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // It's used here...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...so it must be declared here!
```

Now all dependencies are declared, so there is no error. Specifying `[isPlaying]` as the dependency array tells React that it should skip re-running your Effect if `isPlaying` is the same as it was during the previous render. With this change, typing into the input doesn't cause the Effect to re-run, but pressing Play/Pause does:
<Trans>이제 모든 의존성이 선언되었으므로 오류가 없습니다. 의존성 배열로 `[isPlaying]`을 지정하면 `isPlaying`이 이전 렌더링 때와 같으면 Effect를 다시 실행하지 않아도 된다고 React에 알려줍니다. 이렇게 변경하면 input에 타이핑해도 Effect가 다시 실행되지 않고, 재생/일시정지를 누를 때만 실행됩니다:</Trans>

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

The dependency array can contain multiple dependencies. React will only skip re-running the Effect if *all* of the dependencies you specify have exactly the same values as they had during the previous render. React compares the dependency values using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. See the [`useEffect` reference](/reference/react/useEffect#reference) for details.
<Trans>의존성 배열은 여러 개의 의존성을 포함할 수 있습니다. React는 지정한 *모든* 의존성의 값이 이전 렌더링 때와 정확히 동일한 경우에만 Effect의 재실행을 건너뜁니다. React는 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교를 사용해 의존성 값을 비교합니다. 자세한 내용은 [`useEffect`](/reference/react/useEffect#reference)를 참고하세요.</Trans>

**Notice that you can't "choose" your dependencies.** You will get a lint error if the dependencies you specified don't match what React expects based on the code inside your Effect. This helps catch many bugs in your code. If you don't want some code to re-run, [*edit the Effect code itself* to not "need" that dependency.](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)
<Trans>**의존성을 "선택"할 수 없다는 점에 유의하세요.** 지정한 의존성들이 Effect 내부의 코드를 기반으로 React가 예상하는 것과 일치하지 않으면 lint 오류가 발생합니다. 이는 코드에서 많은 버그를 잡는 데 도움이 됩니다. 일부 코드가 다시 실행되는 것을 원하지 않는다면, [해당 의존성을 "필요"하지 않도록 *Effect 코드 자체*를 편집하세요.](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)</Trans>

<Pitfall>

The behaviors without the dependency array and with an *empty* `[]` dependency array are different:
<Trans>의존성 배열이 없는 경우와 *비어 있는* `[]` 의존성 배열이 있는 경우의 동작은 다릅니다:</Trans>

```js {4,9,14}
useEffect(() => {
  // This runs after every render
  // 렌더시마다 실행됩니다.
});

useEffect(() => {
  // This runs only on mount (when the component appears)
  // 오직 마운트시(컴포넌트가 나타날 때)에만 실행됩니다.
}, []);

useEffect(() => {
  // This runs on mount *and also* if either a or b have changed since the last render
  // 마운트시 뿐만 아니라 a 또는 b가 직전 렌더와 달라졌을 때에도 실행됩니다.
}, [a, b]);
```

We'll take a close look at what "mount" means in the next step.
<Trans>다음 단계에서는 “마운트”가 무엇을 의미하는지 자세히 살펴보겠습니다.</Trans>

</Pitfall>

<DeepDive>

#### Why was the ref omitted from the dependency array?<Trans>의존성 배열에서 ref가 생략된 이유는 무엇인가요?</Trans> {/*why-was-the-ref-omitted-from-the-dependency-array*/}

This Effect uses _both_ `ref` and `isPlaying`, but only `isPlaying` is declared as a dependency:
<Trans>이 Effect는 `ref`와 `isPlaying`을 *모두* 사용하지만, 의존성으로 선언된 것은 `isPlaying`뿐입니다:</Trans>

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

This is because the `ref` object has a *stable identity:* React guarantees [you'll always get the same object](/reference/react/useRef#returns) from the same `useRef` call on every render. It never changes, so it will never by itself cause the Effect to re-run. Therefore, it does not matter whether you include it or not. Including it is fine too:
<Trans>이는 `ref` 객체가 *안정적인 정체성*을 가지고 있기 때문입니다: React는 렌더링할 때마다 동일한 useRef 호출에서 [항상 동일한 객체를 얻을 수 있도록](/reference/react/useRef#returns) 보장합니다. 절대 변하지 않으므로 그 자체로 Effect가 다시 실행되지 않습니다. 따라서 포함 여부는 중요하지 않습니다. 포함해도 괜찮습니다:</Trans>

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

The [`set` functions](/reference/react/useState#setstate) returned by `useState` also have stable identity, so you will often see them omitted from the dependencies too. If the linter lets you omit a dependency without errors, it is safe to do.
<Trans>`useState`가 반환하는 [`설정자` 함수](/reference/react/useState#setstate)도 안정된 정체성을 가지므로 의존성에서 생략되는 경우가 많습니다. linter를 통해 오류 없이 의존성을 생략할 수 있다면 그렇게 해도 안전합니다.</Trans>

Omitting always-stable dependencies only works when the linter can "see" that the object is stable. For example, if `ref` was passed from a parent component, you would have to specify it in the dependency array. However, this is good because you can't know whether the parent component always passes the same ref, or passes one of several refs conditionally. So your Effect _would_ depend on which ref is passed.
<Trans>언제나 안정적인 의존성을 배제하는 것은 linter가 객체가 안정적이라는 것을 "확인할" 수 있을 때에만 잘 동작합니다. 예를 들어 부모 컴포넌트에서 `ref`가 전달된 경우 의존성 배열에 이를 지정해야 합니다. 부모 컴포넌트가 항상 동일한 ref를 전달하는지, 아니면 여러 ref 중 하나를 조건부로 전달하는지 알 수 없기 때문에 이 방법이 좋습니다. 이 경우 Effect는 어떤 ref가 전달되는지에 따라 달라지게 됩니다.</Trans>

</DeepDive>

### Step 3: Add cleanup if needed<Trans>필요한 경우 클린업 추가하기</Trans> {/*step-3-add-cleanup-if-needed*/}

Consider a different example. You're writing a `ChatRoom` component that needs to connect to the chat server when it appears. You are given a `createConnection()` API that returns an object with `connect()` and `disconnect()` methods. How do you keep the component connected while it is displayed to the user?
<Trans>다른 예시를 살펴봅시다. 채팅 서버가 나타날 때 채팅 서버에 연결해야 하는 `ChatRoom` 컴포넌트를 작성하고 있다고 가정해 보겠습니다. `connect()` 와 `disconnect()` 메서드가 있는 객체를 반환하는 `createConnection()` API가 주어집니다. 컴포넌트가 사용자에게 표시되는 동안 어떻게 연결 상태를 유지할 수 있을까요?</Trans>

Start by writing the Effect logic:
<Trans>Effect 로직 작성부터 시작해 봅시다:</Trans>

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

It would be slow to connect to the chat after every re-render, so you add the dependency array:
<Trans>다시 렌더링할 때마다 채팅에 연결하는 속도가 느려지므로, 의존성 배열을 추가하겠습니다:</Trans>

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**The code inside the Effect does not use any props or state, so your dependency array is `[]` (empty). This tells React to only run this code when the component "mounts", i.e. appears on the screen for the first time.**
<Trans>**Effect 내부의 코드는 props나 state를 사용하지 않으므로 의존성 배열은 `[]`(비어 있음)입니다. 이는 컴포넌트가 "마운트"될 때, 즉 화면에 처음 나타날 때만 이 코드를 실행하도록 React에 지시합니다.**</Trans>

Let's try running this code:
<Trans>다음 코드를 실행해보세요: </Trans>

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
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

This Effect only runs on mount, so you might expect `"✅ Connecting..."` to be printed once in the console. **However, if you check the console, `"✅ Connecting..."` gets printed twice. Why does it happen?**
<Trans>이 Effect는 마운트 시에만 실행되므로 콘솔에서 `"✅ Connecting..."`이 한 번 인쇄될 것으로 예상할 수 있습니다. **하지만 콘솔을 확인해보면 `"✅ Connecting..."`이 두 번 출력됩니다. 왜 그럴까요?**</Trans>

Imagine the `ChatRoom` component is a part of a larger app with many different screens. The user starts their journey on the `ChatRoom` page. The component mounts and calls `connection.connect()`. Then imagine the user navigates to another screen--for example, to the Settings page. The `ChatRoom` component unmounts. Finally, the user clicks Back and `ChatRoom` mounts again. This would set up a second connection--but the first connection was never destroyed! As the user navigates across the app, the connections would keep piling up.
<Trans>`ChatRoom` 컴포넌트가 다양한 화면으로 구성된 큰 앱의 일부라고 상상해 보세요. 사용자는 `ChatRoom` 페이지에서 여정을 시작합니다. 컴포넌트가 마운트되고 `connection.connect()`를 호출합니다. 그런 다음 사용자가 다른 화면(예: 설정 페이지)으로 이동한다고 합시다. `ChatRoom` 컴포넌트가 마운트 해제됩니다. 마지막으로 사용자가 뒤로 가기(Back)를 클릭하면 `ChatRoom`이 다시 마운트됩니다. 이렇게 하면 두 번째 연결이 설정되지만, 여전히 첫 번째 연결은 파괴되지 않았습니다! 사용자가 앱을 돌아다닐 때마다 연결은 계속 쌓이게 될 것입니다.</Trans>

Bugs like this are easy to miss without extensive manual testing. To help you spot them quickly, in development React remounts every component once immediately after its initial mount.
<Trans>이와 같은 버그는 광범위한 수동 테스트 없이는 놓치기 쉽습니다. 버그를 빠르게 발견할 수 있도록 개발 모드에서 React는 모든 컴포넌트를 최초 마운트 직후에 한 번씩 다시 마운트합니다.</Trans>

Seeing the `"✅ Connecting..."` log twice helps you notice the real issue: your code doesn't close the connection when the component unmounts.
<Trans>`"✅ Connecting..."` 로그가 두 번 보이면, 컴포넌트가 마운트 해제될 때 연결을 닫지 않고 있다는 실제 문제를 파악하는 데 도움이 됩니다.</Trans>

To fix the issue, return a *cleanup function* from your Effect:
<Trans>문제를 해결하려면 Effect에서 *클린업 함수*를 반환하세요:</Trans>

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

React will call your cleanup function each time before the Effect runs again, and one final time when the component unmounts (gets removed). Let's see what happens when the cleanup function is implemented:
<Trans>React는 Effect가 다시 실행되기 전에 매번 클린업 함수를 호출하고, 컴포넌트가 마운트 해제(제거)될 때 마지막으로 한 번 더 호출합니다. 클린업 함수가 구현되면 어떤 일이 일어나는지 살펴봅시다:</Trans>

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

Now you get three console logs in development:
<Trans>이제 3개의 콘솔 로그를 확인할 수 있습니다:</Trans>

1. `"✅ Connecting..."`
2. `"❌ Disconnected."`
3. `"✅ Connecting..."`

**This is the correct behavior in development.** By remounting your component, React verifies that navigating away and back would not break your code. Disconnecting and then connecting again is exactly what should happen! When you implement the cleanup well, there should be no user-visible difference between running the Effect once vs running it, cleaning it up, and running it again. There's an extra connect/disconnect call pair because React is probing your code for bugs in development. This is normal--don't try to make it go away!
<Trans>**이는 개발 단계에서 올바른 동작입니다.** 컴포넌트를 다시 마운트하면 React는 멀리 이동했다가 다시 돌아와도 코드가 깨지지 않는지 확인합니다. 연결을 끊었다가 다시 연결하는 것은 정확히 일어나야 하는 일입니다! 클린업을 잘 구현하면, Effect를 한 번 실행하는 것과 실행하고 클린업한 후 다시 실행하는 것 사이에 사용자가 체감할 수 있는 차이가 없어야 합니다. React가 개발 과정에서 코드에 버그가 있는지 검사하기 때문에 연결/해제 호출 쌍이 추가됩니다. 이것은 정상적인 현상이니 없애려고 하지 마세요!</Trans>

**In production, you would only see `"✅ Connecting..."` printed once.** Remounting components only happens in development to help you find Effects that need cleanup. You can turn off [Strict Mode](/reference/react/StrictMode) to opt out of the development behavior, but we recommend keeping it on. This lets you find many bugs like the one above.
<Trans>**상용 환경에서는 `"✅ Connecting..."`이 한 번만 인쇄됩니다.** 컴포넌트를 다시 마운트하는 동작은 클린업이 필요한 Effect를 찾는 것을 돕기 위해 오직 개발 환경에서만 수행됩니다. [Strict Mode](/reference/react/StrictMode)를 해제하면 이같은 개발 동작을 없앨 수 있지만, 가능한 계속 켜두는 것을 추천합니다. 이를 통해 위와 같은 많은 버그를 찾을 수 있기 때문입니다.</Trans>

## How to handle the Effect firing twice in development?<Trans>개발 환경에서 두 번씩 실행되는 Effect를 처리하는 방법은 무엇인가요?</Trans> {/*how-to-handle-the-effect-firing-twice-in-development*/}

React intentionally remounts your components in development to find bugs like in the last example. **The right question isn't "how to run an Effect once", but "how to fix my Effect so that it works after remounting".**
<Trans>지난 예제에서와 같이 React는 개발 환경에서 버그를 찾기 위해 컴포넌트를 의도적으로 다시 마운트합니다. **올바른 질문은 "어떻게 하면 Effect를 한 번만 실행할 수 있는가"가 아니라 "어떻게 다시 마운트한 후에도 Effect가 잘 작동하도록 수정하는가" 입니다.**</Trans>

Usually, the answer is to implement the cleanup function.  The cleanup function should stop or undo whatever the Effect was doing. The rule of thumb is that the user shouldn't be able to distinguish between the Effect running once (as in production) and a _setup → cleanup → setup_ sequence (as you'd see in development).
<Trans>일반적으로 정답은 클린업 함수를 구현하는 것입니다. 클린업 함수는 Effect가 수행 중이던 작업을 중지하거나 취소해야 합니다. 경험상 (상용 환경에서) 한 번만 실행되는 Effect와 (개발 환경에서의) _설정 → 정리 → 설정_ 시퀀스를 사용자가 구분할 수 없어야 합니다.</Trans>

Most of the Effects you'll write will fit into one of the common patterns below.
<Trans>작성하게 될 대부분의 Effect는 아래의 일반적인 패턴 중 하나에 해당합니다.</Trans>

### Controlling non-React widgets<Trans>React가 아닌 위젯 제어</Trans> {/*controlling-non-react-widgets*/}

Sometimes you need to add UI widgets that aren't written to React. For example, let's say you're adding a map component to your page. It has a `setZoomLevel()` method, and you'd like to keep the zoom level in sync with a `zoomLevel` state variable in your React code. Your Effect would look similar to this:
<Trans>때론 React에 작성되지 않은 UI 위젯을 추가해야 합니다. 예를 들어 페이지에 지도 컴포넌트를 추가한다고 가정해 보겠습니다. 여기에는 `setZoomLevel()` 메서드가 있으며, 확대/축소 수준을 React 코드의 `zoomLevel` state 변수와 동기화하고 싶습니다. Effect는 다음과 비슷할 것입니다:</Trans>


```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

Note that there is no cleanup needed in this case. In development, React will call the Effect twice, but this is not a problem because calling `setZoomLevel` twice with the same value does not do anything. It may be slightly slower, but this doesn't matter because it won't remount needlessly in production.
<Trans>이 경우 클린업이 필요하지 않습니다. 개발 환경에서 React는 Effect를 두 번 호출하지만 동일한 값으로 `setZoomLevel`을 두 번 호출해도 아무 작업도 수행하지 않기 때문에 문제가 되지 않습니다. 약간 느릴 수는 있지만 상용 환경에서는 불필요하게 다시 마운트되지 않으므로 문제가 되지 않습니다.</Trans>

Some APIs may not allow you to call them twice in a row. For example, the [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) method of the built-in [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) element throws if you call it twice. Implement the cleanup function and make it close the dialog:
<Trans>일부 API는 연속으로 두 번 호출하는 것을 허용하지 않을 수 있습니다. 예를 들어 브라우저의 내장 요소인 [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement)의 [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) 메서드는 두 번 호출하면 에러를 던집니다. 클린업 함수를 구현하고 대화 상자를 닫도록 합시다.</Trans>

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

In development, your Effect will call `showModal()`, then immediately `close()`, and then `showModal()` again. This has the same user-visible behavior as calling `showModal()` once, as you would see in production.
<Trans>개발 중에 Effect는 `showModal()`을 호출한 다음 즉시 `close()`를 호출하고, 다시 `showModal()`을 호출합니다. 이는 상용 환경에서 볼 수 있는 것처럼 `showModal()`을 한 번 호출하는 것과 체감상 동일합니다.</Trans>

### Subscribing to events<Trans>이벤트 구독하기</Trans> {/*subscribing-to-events*/}

If your Effect subscribes to something, the cleanup function should unsubscribe:
<Trans>Effect가 무언가를 구독하는 경우, 클린업 함수는 구독을 취소해야 합니다.</Trans>

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

In development, your Effect will call `addEventListener()`, then immediately `removeEventListener()`, and then `addEventListener()` again with the same handler. So there would be only one active subscription at a time. This has the same user-visible behavior as calling `addEventListener()` once, as in production.
<Trans>개발 중에 Effect는 `addEventListener()`를 호출한 다음 즉시 `removeEventListener()`를 호출합니다. 그런 다음 동일한 핸들러를 사용하여 다시 `addEventListener()`를 사용함으로써, 한 번에 하나의 구독만 활성화 되도록 합니다. 이는 상용 환경에서 `addEventListener()`를 한 번만 호출하는 것과 체감상 동일합니다.</Trans>

### Triggering animations<Trans>애니메이션 발동시키기</Trans> {/*triggering-animations*/}

If your Effect animates something in, the cleanup function should reset the animation to the initial values:
<Trans>Effect가 무언가를 애니메이션하는 경우 클린업 함수는 애니메이션을 초기값으로 재설정해야 합니다.</Trans>

```js {5-8}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Trigger the animation
                          // 애니메이션 발동
  return () => {
    node.style.opacity = 0; // Reset to the initial value
                            // 초기값으로 재설정
  };
}, []);
```

In development, opacity will be set to `1`, then to `0`, and then to `1` again. This should have the same user-visible behavior as setting it to `1` directly, which is what would happen in production. If you use a third-party animation library with support for tweening, your cleanup function should reset the timeline to its initial state.
<Trans>개발 과정에서 불투명도는 `1`이었다가, `0`이었다가, 다시 `1`로 설정됩니다. 이것은 상용 환경에서 `1`을 한 번만 설정하는 것과 체감상 동일합니다. 만약 트위닝을 지원하는 써드파티 애니메이션 라이브러리를 사용하는 경우라면, 클린업 함수에서 타임라인을 초기 state로 재설정해줘야 합니다.</Trans>

### Fetching data<Trans>데이터 페칭하기</Trans> {/*fetching-data*/}

If your Effect fetches something, the cleanup function should either [abort the fetch](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) or ignore its result:
<Trans>Effect가 무언가를 페치하면 클린업 함수는 [페치를 중단](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)하거나 그 결과를 무시해야 합니다:</Trans>

```js {2,6,13-15}
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

You can't "undo" a network request that already happened, but your cleanup function should ensure that the fetch that's _not relevant anymore_ does not keep affecting your application. If the `userId` changes from `'Alice'` to `'Bob'`, cleanup ensures that the `'Alice'` response is ignored even if it arrives after `'Bob'`.
<Trans>이미 발생한 네트워크 요청을 "실행 취소"할 수는 없으므로, 대신 클린업 함수에서 _더 이상 관련이 없는_ 페치가 애플리케이션에 계속 영향을 미치지 않도록 해야 합니다. 만약 `userId`가 `'Alice'`에서 `'Bob'`으로 변경되면 클린업은 `'Alice'` 응답이 `'Bob'` 이후에 도착하더라도 이를 무시하도록 합니다.</Trans>

**In development, you will see two fetches in the Network tab.** There is nothing wrong with that. With the approach above, the first Effect will immediately get cleaned up so its copy of the `ignore` variable will be set to `true`. So even though there is an extra request, it won't affect the state thanks to the `if (!ignore)` check.
<Trans>**개발 환경에서는 네트워크 탭에 두 개의 페치가 표시됩니다.** 이는 아무 문제가 없습니다. 위의 접근 방식을 사용하면 첫 번째 Effect가 즉시 정리되므로, `ignore` 변수의 복사본이 `true`로 설정됩니다. 따라서 추가 요청이 있더라도 `if (!ignore)` 검사 덕분에 state에 영향을 미치지 않습니다.</Trans>

**In production, there will only be one request.** If the second request in development is bothering you, the best approach is to use a solution that deduplicates requests and caches their responses between components:
<Trans>**상용 환경에서는 요청이 하나만 있습니다.** 개발 중인 두 번째 요청이 귀찮은 경우 가장 좋은 방법은 요청을 중복 제거하고 컴포넌트 간에 응답을 캐시하는 솔루션을 사용하는 것입니다.</Trans>

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

This will not only improve the development experience, but also make your application feel faster. For example, the user pressing the Back button won't have to wait for some data to load again because it will be cached. You can either build such a cache yourself or use one of the many alternatives to manual fetching in Effects.
<Trans>이렇게 하면 개발 경험이 향상될 뿐만 아니라 애플리케이션이 더 빠르게 느껴집니다. 예를 들어 Back 버튼을 누르는 사용자는 일부 데이터가 캐시되기 때문에 다시 로드될 때까지 기다릴 필요가 없습니다. 이러한 캐시는 직접 구축할 수도 있고, Effect에서 수동으로 페칭하는 기능을 대체하는 많은 대안 중 하나를 사용할 수도 있습니다.</Trans>

<DeepDive>

#### What are good alternatives to data fetching in Effects?<Trans>Effect에서 데이터를 페칭하는 것의 대안은 무엇입니까?</Trans> {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Writing `fetch` calls inside Effects is a [popular way to fetch data](https://www.robinwieruch.de/react-hooks-fetch-data/), especially in fully client-side apps. This is, however, a very manual approach and it has significant downsides:
<Trans>Effect 내에 `fetch` 호출을 작성하는 것은 특히 완전한 클라이언트 앱에서 [데이터를 페치하는 인기 있는 방법입니다.](https://www.robinwieruch.de/react-hooks-fetch-data/) 그러나 이것은 매우 수동적인 접근 방식이며 상당한 단점이 있습니다.</Trans>

- **Effects don't run on the server.** This means that the initial server-rendered HTML will only include a loading state with no data. The client computer will have to download all JavaScript and render your app only to discover that now it needs to load the data. This is not very efficient.
<Trans>**Effects는 서버에서 실행되지 않습니다.** 즉 초기 서버에서 렌더링되는 HTML에는 데이터가 없는 로딩 state만 포함됩니다. 클라이언트 컴퓨터는 모든 JavaScript를 다운로드하고 앱을 렌더링하고 나서야 비로소 데이터를 로드해야 한다는 사실을 발견해 냅니다. 이것은 그다지 효율적이지 않습니다.</Trans>
- **Fetching directly in Effects makes it easy to create "network waterfalls".** You render the parent component, it fetches some data, renders the child components, and then they start fetching their data. If the network is not very fast, this is significantly slower than fetching all data in parallel.
<Trans>**Effect에서 직접 페치하면 "네트워크 워터폴"이 만들어지기 쉽습니다.** 상위 컴포넌트를 렌더링하면, 상위 컴포넌트가 일부 데이터를 페치하고, 하위 컴포넌트를 렌더링한 다음, 다시 하위 컴포넌트의 데이터를 페치하기 시작합니다. 네트워크가 매우 빠르지 않다면, 모든 데이터를 병렬로 페치하는 것보다 훨씬 느립니다.</Trans>
- **Fetching directly in Effects usually means you don't preload or cache data.** For example, if the component unmounts and then mounts again, it would have to fetch the data again.
<Trans>**Effect에서 직접 페치하는 것은 일반적으로 데이터를 미리 로드하거나 캐시하지 않음을 의미합니다.** 예를 들어 컴포넌트가 마운트 해제되었다가 다시 마운트되면, 데이터를 다시 페치할 것입니다.</Trans>
- **It's not very ergonomic.** There's quite a bit of boilerplate code involved when writing `fetch` calls in a way that doesn't suffer from bugs like [race conditions.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)
<Trans>이것은 전혀 인체공학적이지 않습니다. [조건 경합](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)과 같은 버그가 발생하지 않는 방식으로 `fetch`를 작성하기 위해서는 꽤 많은 상용구 코드가 필요합니다.</Trans>

This list of downsides is not specific to React. It applies to fetching data on mount with any library. Like with routing, data fetching is not trivial to do well, so we recommend the following approaches:
<Trans>이러한 단점들은 React에만 국한된 것이 아닙니다. 어떤 라이브러리를 사용하든 마운트시 데이터를 페치하는 경우 동일하게 적용됩니다. 라우팅과 마찬가지로 데이터 페칭 역시 제대로 수행하기는 쉽지 않으므로, 다음과 같은 접근 방식을 권장합니다:</Trans>

- **If you use a [framework](/learn/start-a-new-react-project#production-grade-react-frameworks), use its built-in data fetching mechanism.** Modern React frameworks have integrated data fetching mechanisms that are efficient and don't suffer from the above pitfalls.
<Trans>**[프레임워크](/learn/start-a-new-react-project#production-grade-react-frameworks)를 사용하는 경우 내장된 데이터 페칭 메커니즘을 사용하세요.** 최신 React 프레임워크에는 위와 같은 함정이 발생하지 않으면서 효율적인 데이터 페칭 메커니즘이 통합되어 있습니다.</Trans>
- **Otherwise, consider using or building a client-side cache.** Popular open source solutions include [React Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/), and [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) You can build your own solution too, in which case you would use Effects under the hood, but add logic for deduplicating requests, caching responses, and avoiding network waterfalls (by preloading data or hoisting data requirements to routes).
<Trans>그렇지 않으면 클라이언트측 캐시를 사용하거나 직접 구축하는 것을 고려하세요. 인기 있는 오픈소스 솔루션으로는 [React Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/), [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) 등이 있습니다. 자체 솔루션을 구축할 수도 있는데, 이 경우 내부적으로는 Effect를 사용하되, 요청 중복 제거, 응답 캐싱, 네트워크 워터폴 방지(데이터를 미리 로드하거나 라우트에 데이터 요구 사항을 호이스팅해서) 논리를 추가하는게 좋습니다.</Trans>

You can continue fetching data directly in Effects if neither of these approaches suit you.
<Trans>이러한 접근 방식 중 어느 것도 적합하지 않은 경우 계속해서 Effect에서 직접 데이터를 페칭할 수도 있습니다.</Trans>

</DeepDive>

### Sending analytics<Trans>분석 보내기</Trans> {/*sending-analytics*/}

Consider this code that sends an analytics event on the page visit:
<Trans>페이지 방문 시 분석 이벤트를 보내는 다음 코드를 살펴봅시다:</Trans>

```js
useEffect(() => {
  logVisit(url); // Sends a POST request
}, [url]);
```

In development, `logVisit` will be called twice for every URL, so you might be tempted to try to fix that. **We recommend keeping this code as is.** Like with earlier examples, there is no *user-visible* behavior difference between running it once and running it twice. From a practical point of view, `logVisit` should not do anything in development because you don't want the logs from the development machines to skew the production metrics. Your component remounts every time you save its file, so it logs extra visits in development anyway.
<Trans>개발 환경에서는 모든 URL에 대해 `logVisit`이 두 번 호출되므로 이를 수정하고 싶을 수 있습니다. **이 코드를 그대로 유지하는 것이 좋습니다.** 이전 예제와 마찬가지로 한 번 실행하는 것과 두 번 실행하는 것 사이에 사용자가 볼 수 있는 동작 차이는 없습니다. 개발 머신의 로그가 상용 메트릭을 왜곡하는 것을 원하지는 않을 것이니, 실용적인 관점에서 개발 환경에서는 `logVisit`가 아무 것도 하지 않도록 합시다. 어차피 개발 환경에서는 파일을 저장할 때마다 컴포넌트가 다시 마운트될 것이고, 따라서 추가 방문이 기록될 테니까요.</Trans>

**In production, there will be no duplicate visit logs.**
<Trans>**상용 환경에서는 중복 방문 로그가 없습니다.**</Trans>

To debug the analytics events you're sending, you can deploy your app to a staging environment (which runs in production mode) or temporarily opt out of [Strict Mode](/reference/react/StrictMode) and its development-only remounting checks. You may also send analytics from the route change event handlers instead of Effects. For more precise analytics, [intersection observers](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) can help track which components are in the viewport and how long they remain visible.
<Trans>전송하는 분석 이벤트를 디버깅하려면 앱을 스테이징 환경(상용 모드에서 실행됨)에 배포하거나, [Strict Mode](/reference/react/StrictMode) 및 개발 전용의 중복 마운트 검사를 일시적으로 해제할 수 있습니다. Effect 대신 경로 변경 이벤트 핸들러에서 분석을 전송할 수도 있습니다. 보다 정확한 분석을 위해서는 [intersection observers](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)를 활용하면 뷰포트에 어떤 컴포넌트가 있고 얼마나 오래 표시되는지를 추적하는 데 도움이 될 수 있습니다.</Trans>

### Not an Effect: Initializing the application<Trans>Effect가 아님: 애플리케이션 초기화</Trans> {/*not-an-effect-initializing-the-application*/}

Some logic should only run once when the application starts. You can put it outside your components:
<Trans>일부 로직은 애플리케이션이 시작될 때 한 번만 실행되어야 합니다. 이런 로직은 컴포넌트 외부에 넣을 수 있습니다:</Trans>

```js {3-4}
if (typeof window !== 'undefined') { // Check if we're running in the browser.
                                     // 실행환경이 브라우저인지 여부 확인
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

This guarantees that such logic only runs once after the browser loads the page.
<Trans>이렇게 하면 위 로직은 브라우저가 페이지를 로드한 후 한 번만 실행됩니다.</Trans>

### Not an Effect: Buying a product<Trans>Effect가 아님: 제품 구매</Trans> {/*not-an-effect-buying-a-product*/}

Sometimes, even if you write a cleanup function, there's no way to prevent user-visible consequences of running the Effect twice. For example, maybe your Effect sends a POST request like buying a product:
<Trans>클린업 함수를 작성하더라도 Effect를 두 번 실행함으로써 체감상 결과가 달라지는 것을 막을 방법이 없는 경우도 있습니다. 예를 들어 Effect가 제품 구매와 같은 POST 요청을 보낸다고 합시다.</Trans>

```js {2-4}
useEffect(() => {
  // 🔴 Wrong: This Effect fires twice in development, exposing a problem in the code.
  // 🔴 틀렸습니다: 이 Effect는 개발모드에서 두 번 실행되며, 문제를 일으킵니다.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

You wouldn't want to buy the product twice. However, this is also why you shouldn't put this logic in an Effect. What if the user goes to another page and then presses Back? Your Effect would run again. You don't want to buy the product when the user *visits* a page; you want to buy it when the user *clicks* the Buy button.
<Trans>제품을 두 번 사고 싶지는 않을 것입니다. 이 로직을 Effect에 넣지 말아야 하는 이유이기도 합니다. 사용자가 다른 페이지로 이동한 다음 Back(뒤로가기)를 누르면, Effect가 다시 실행될 것입니다. 사용자는 페이지를 *방문*할 때 제품을 구매하고 싶지는 않을 것입니다. 구매 버튼을 *클릭*할 때 구매하길 원할 것입니다.</Trans>

Buying is not caused by rendering; it's caused by a specific interaction. It should run only when the user presses the button. **Delete the Effect and move your `/api/buy` request into the Buy button event handler:**
<Trans>구매는 렌더링으로 인한 것이 아닙니다. 특정 상호 작용으로 인해 발생합니다. 사용자가 버튼을 누를 때만 실행되어야 합니다. **Effect를 삭제하고 `/api/buy` 요청을 구매 버튼 이벤트 핸들러로 이동합시다.**</Trans>

```js {2-3}
  function handleClick() {
    // ✅ Buying is an event because it is caused by a particular interaction.
    fetch('/api/buy', { method: 'POST' });
  }
```

**This illustrates that if remounting breaks the logic of your application, this usually uncovers existing bugs.** From the user's perspective, visiting a page shouldn't be different from visiting it, clicking a link, and pressing Back. React verifies that your components abide by this principle by remounting them once in development.
<Trans>**다시 마운트하면 애플리케이션의 로직이 깨지는 경우, 일반적으로 기존 버그를 발견할 수 있습니다.** 사용자 관점에서 페이지를 방문하는 것은 페이지를 방문하여 링크를 클릭하고 뒤로가기 버튼을 누르는 것과 다르지 않아야 합니다. React는 개발 단계에서 컴포넌트를 다시 한 번 마운트하여 이 원칙을 준수하는지 확인합니다.</Trans>

## Putting it all together<Trans>한데 모으기</Trans> {/*putting-it-all-together*/}

This playground can help you "get a feel" for how Effects work in practice.
<Trans>이 플레이그라운드를 통해 실제로 Effect가 어떻게 작동하는지 "느껴볼" 수 있습니다.</Trans>

This example uses [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) to schedule a console log with the input text to appear three seconds after the Effect runs. The cleanup function cancels the pending timeout. Start by pressing "Mount the component":
<Trans>이 예에서는 [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)을 사용하여 Effect가 실행되고 3초 뒤에 input 텍스트가 포함된 콘솔 로그를 표시하도록 예약합니다. 클린업 함수는 보류 중인 타임아웃을 취소합니다. "Mount the component"를 눌러보세요.</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Schedule "' + text + '" log');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 Cancel "' + text + '" log');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        What to log:{' '}
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Unmount' : 'Mount'} the component
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

You will see three logs at first: `Schedule "a" log`, `Cancel "a" log`, and `Schedule "a" log` again. Three second later there will also be a log saying `a`. As you learned earlier, the extra schedule/cancel pair is because React remounts the component once in development to verify that you've implemented cleanup well.
<Trans>처음에는 `Schedule "a" log`, `Cancel "a" log`, `Schedule "a" log`의 세 가지 로그가 표시됩니다. 3초 후에 `a`라는 로그도 표시됩니다. 앞서 배운 것처럼 schedule/cancel 쌍이 한 번 더 출력되는 이유는 개발 환경에서 React가 클린업을 잘 구현했는지 확인하기 위해 컴포넌트를 다시 마운트하기 때문입니다.</Trans>

Now edit the input to say `abc`. If you do it fast enough, you'll see `Schedule "ab" log` immediately followed by `Cancel "ab" log` and `Schedule "abc" log`. **React always cleans up the previous render's Effect before the next render's Effect.** This is why even if you type into the input fast, there is at most one timeout scheduled at a time. Edit the input a few times and watch the console to get a feel for how Effects get cleaned up.
<Trans>이제 input을 편집하여 `abc`라고 입력하세요. 충분히 빨리 입력하면 `Schedule "ab" log`와 `Cancel "ab" log`, `Schedule "abc" log`가 바로 표시될 것입니다. **React는 항상 다음 렌더링의 Effect 전에 이전 렌더링의 Effect를 클린업 합니다.** 따라서 입력을 빠르게 입력하더라도 한 번에 최대 한 번만 타임아웃이 예약됩니다. 입력을 몇 번 편집하고 콘솔을 보면서 Effect가 어떻게 클린업 되는지 느껴보세요.</Trans>

Type something into the input and then immediately press "Unmount the component". Notice how unmounting cleans up the last render's Effect. Here, it clears the last timeout before it has a chance to fire.
<Trans>입력에 무언가를 입력한 다음 즉시 "Unmount the component"를 눌러보세요. 마운트를 해제하면 마지막 렌더링의 Effect가 어떻게 클린업되는지 확인하세요. 여기서는 Effect가 실행 기회를 갖기 전에 마지막 타임아웃을 지웁니다.</Trans>

Finally, edit the component above and comment out the cleanup function so that the timeouts don't get cancelled. Try typing `abcde` fast. What do you expect to happen in three seconds? Will `console.log(text)` inside the timeout print the *latest* `text` and produce five `abcde` logs? Give it a try to check your intuition!
<Trans>마지막으로 위의 컴포넌트를 편집하고 타임아웃이 취소되지 않도록 클린업 함수를 주석 처리 해봅시다. `abcde`를 빠르게 입력해 보세요. 3초 후에 어떤 일이 일어날까요? 타임아웃 내의 `console.log(text)`가 *최신* `text`를 인쇄하고 5개의 `abcde` 로그를 생성할까요? 여러분의 직감을 확인해 보세요!</Trans>

Three seconds later, you should see a sequence of logs (`a`, `ab`, `abc`, `abcd`, and `abcde`) rather than five `abcde` logs. **Each Effect "captures" the `text` value from its corresponding render.**  It doesn't matter that the `text` state changed: an Effect from the render with `text = 'ab'` will always see `'ab'`. In other words, Effects from each render are isolated from each other. If you're curious how this works, you can read about [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures).
<Trans>3초 후, 5개의 `abcde`가 아닌 일련의 (`a`, `ab`, `abc`, `abcd`, `abcde`)가 표시되어야 합니다. **각 Effect는 해당 렌더링에서 `text` 값을 "캡처"합니다.** `text` state가 변경되더라도, `text = 'ab'`인 렌더링의 Effect는 항상 `'ab'`를 표시합니다. 즉 각 렌더링의 Effect는 서로 분리되어 있습니다. 이것이 어떻게 작동하는지 궁금하다면 [클로저](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)를 읽어 보세요.</Trans>

<DeepDive>

#### Each render has its own Effects<Trans>각 렌더링에는 고유한 Effect가 있습니다</Trans> {/*each-render-has-its-own-effects*/}

You can think of `useEffect` as "attaching" a piece of behavior to the render output. Consider this Effect:
<Trans>`useEffect`는 렌더링 출력물에 동작의 일부를 "첨부"하는 것으로 생각할 수 있습니다. 다음 Effect를 봅시다.</Trans>

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to {roomId}!</h1>;
}
```

Let's see what exactly happens as the user navigates around the app.
<Trans>사용자가 앱을 탐색할 때 정확히 어떤 일이 발생하는지 살펴보겠습니다.</Trans>

#### Initial render<Trans>초기 렌더링</Trans> {/*initial-render*/}

The user visits `<ChatRoom roomId="general" />`. Let's [mentally substitute](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `roomId` with `'general'`:
<Trans>사용자가 `<ChatRoom roomId="general" />`을 방문합니다. `roomId`를 `'general'`로 [임의로 대체](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)해 보겠습니다.</Trans>

```js
  // JSX for the first render (roomId = "general")
  // 첫번째 렌더링시의 JSX (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

**The Effect is *also* a part of the rendering output.** The first render's Effect becomes:
<Trans>**Effect는 렌더링 출력의 일부*이기도* 합니다.** 첫 번째 렌더링의 Effect는 다음과 같습니다:</Trans>

```js
  // Effect for the first render (roomId = "general")
  // 첫번째 렌더링시의 JSX (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the first render (roomId = "general")
  // 첫번째 렌더링시의 의존성 (roomId = "general")
  ['general']
```

React runs this Effect, which connects to the `'general'` chat room.
<Trans>React는 `'general'` 대화방으로 연결되는 이 Effect를 실행합니다.</Trans>

#### Re-render with same dependencies<Trans>동일한 의존성을 사용하여 다시 렌더링</Trans> {/*re-render-with-same-dependencies*/}

Let's say `<ChatRoom roomId="general" />` re-renders. The JSX output is the same:
<Trans>`<ChatRoom roomId="general" />`이 다시 렌더링된다고 가정해 보겠습니다. JSX 출력은 동일합니다:</Trans>

```js
  // JSX for the second render (roomId = "general")
  // 두번째 렌더링시의 JSX (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

React sees that the rendering output has not changed, so it doesn't update the DOM.
<Trans>React는 렌더링 출력이 변경되지 않았다고 판단하여 DOM을 업데이트하지 않습니다.</Trans>

The Effect from the second render looks like this:
<Trans>두 번째 렌더링의 Effect는 다음과 같습니다:</Trans>

```js
  // Effect for the second render (roomId = "general")
  // 두번째 렌더링시의 JSX (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the second render (roomId = "general")
  // 두번째 렌더링시의 의존성 (roomId = "general")
  ['general']
```

React compares `['general']` from the second render with `['general']` from the first render. **Because all dependencies are the same, React *ignores* the Effect from the second render.** It never gets called.
<Trans>React는 두 번째 렌더링의 `['general']`을 첫 번째 렌더링의 `['general']`과 비교합니다. **모든 의존성이 동일하기 때문에 React는 두 번째 렌더링의 Effect를 *무시*합니다.** 절대 호출되지 않습니다.</Trans>

#### Re-render with different dependencies<Trans>다른 의존성으로 다시 렌더링</Trans> {/*re-render-with-different-dependencies*/}

Then, the user visits `<ChatRoom roomId="travel" />`. This time, the component returns different JSX:
<Trans>그런 다음 사용자는 `<ChatRoom roomId="travel" />`을 방문합니다. 이번에는 컴포넌트가 다른 JSX를 반환합니다:</Trans>

```js
  // JSX for the third render (roomId = "travel")
  // 세번째 렌더링시의 JSX (roomId = "travel")
  return <h1>Welcome to travel!</h1>;
```

React updates the DOM to change `"Welcome to general"` into `"Welcome to travel"`.
<Trans>React는 DOM을 업데이트하여 `"Welcome to general"`을 `"Welcome to travel"`로 변경합니다.</Trans>

The Effect from the third render looks like this:
<Trans>세 번째 렌더링의 Effect는 다음과 같습니다:</Trans>

```js
  // Effect for the third render (roomId = "travel")
  // 세번째 렌더링시의 JSX (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the third render (roomId = "travel")
  // 세번째 렌더링시의 의존성 (roomId = "travel")
  ['travel']
```

React compares `['travel']` from the third render with `['general']` from the second render. One dependency is different: `Object.is('travel', 'general')` is `false`. The Effect can't be skipped.
<Trans>React는 세 번째 렌더링의 `['travel']`을 두 번째 렌더링의 `['general']`과 비교합니다. 하나의 의존성이 다릅니다. `Object.is('travel', 'general')`는 `false`입니다. Effect는 건너뛸 수 없습니다.</Trans>

**Before React can apply the Effect from the third render, it needs to clean up the last Effect that _did_ run.** The second render's Effect was skipped, so React needs to clean up the first render's Effect. If you scroll up to the first render, you'll see that its cleanup calls `disconnect()` on the connection that was created with `createConnection('general')`. This disconnects the app from the `'general'` chat room.
<Trans>**React가 세 번째 렌더링에서 Effect를 적용하려면 _먼저_ 실행된 마지막 Effect를 클린업해야 합니다.** 두 번째 렌더링의 Effect를 건너뛰었으므로 React는 첫 번째 렌더링의 Effect를 클린업 합니다. 첫 번째 렌더링까지 스크롤하면 `createConnection('general')`으로 생성된 연결에서 클린업이 `disconnect()`를 호출하는 것을 볼 수 있습니다. 이렇게 하면 `'general'` 대화방에서 앱의 연결이 끊어집니다.</Trans>

After that, React runs the third render's Effect. It connects to the `'travel'` chat room.
<Trans>그 후 React는 세 번째 렌더링의 Effect를 실행합니다. `'travel'` 대화방으로 연결됩니다.</Trans>

#### Unmount<Trans>마운트 해제</Trans> {/*unmount*/}

Finally, let's say the user navigates away, and the `ChatRoom` component unmounts. React runs the last Effect's cleanup function. The last Effect was from the third render. The third render's cleanup destroys the `createConnection('travel')` connection. So the app disconnects from the `'travel'` room.
<Trans>마지막으로 사용자가 다른 곳으로 이동하여 `ChatRoom` 컴포넌트가 마운트 해제되었다고 가정해 보겠습니다. React는 마지막 Effect의 클린업 함수를 실행합니다. 마지막 Effect는 세 번째 렌더링에서 가져온 것입니다. 세 번째 렌더링의 클린업은 `createConnection('travel')` 연결을 파괴합니다. 따라서 `'travel'` 방에서 앱의 연결이 끊어집니다.</Trans>

#### Development-only behaviors<Trans>개발 전용 동작</Trans> {/*development-only-behaviors*/}

When [Strict Mode](/reference/react/StrictMode) is on, React remounts every component once after mount (state and DOM are preserved). This [helps you find Effects that need cleanup](#step-3-add-cleanup-if-needed) and exposes bugs like race conditions early. Additionally, React will remount the Effects whenever you save a file in development. Both of these behaviors are development-only.
<Trans>[Strict Mode](/reference/react/StrictMode)가 켜져 있으면 React는 마운트 후 모든 컴포넌트를 한 번 다시 마운트합니다(state 및 DOM이 보존됨). 이를 통해 [클린업이 필요한 Effect를 찾고](#step-3-add-cleanup-if-needed) 조건 경합과 같은 버그를 조기에 발견할 수 있습니다. 또한 React는 개발 중에 파일을 저장할 때마다 Effect를 다시 마운트합니다. 이러한 동작은 모두 개발 전용입니다.</Trans>

</DeepDive>

<Recap>

- Unlike events, Effects are caused by rendering itself rather than a particular interaction.
- Effects let you synchronize a component with some external system (third-party API, network, etc).
- By default, Effects run after every render (including the initial one).
- React will skip the Effect if all of its dependencies have the same values as during the last render.
- You can't "choose" your dependencies. They are determined by the code inside the Effect.
- Empty dependency array (`[]`) corresponds to the component "mounting", i.e. being added to the screen.
- In Strict Mode, React mounts components twice (in development only!) to stress-test your Effects.
- If your Effect breaks because of remounting, you need to implement a cleanup function.
- React will call your cleanup function before the Effect runs next time, and during the unmount.

<TransBlock>

- 이벤트와 달리 Effect는 특정 상호 작용이 아닌 렌더링 자체에 의해 발생합니다.
- Effect를 사용하면 일부 외부 시스템(타사 API, 네트워크 등)과 컴포넌트를 동기화할 수 있습니다.
- 기본적으로 Effect는 모든 렌더링 후에 실행됩니다(초기 렌더링 포함).
- React는 모든 의존성이 마지막 렌더링 시점과 동일한 값을 갖는 경우 Effect를 건너뜁니다.
- 의존성을 "선택"할 수는 없습니다. 그들은 Effect 내부의 코드에 의해 결정됩니다.
- 빈 의존성 배열(`[]`)은 컴포넌트 "마운팅", 즉 화면에 추가되는 시점에 대응합니다.
- Strict 모드에서 React는 컴포넌트를 두 번 마운트하여(개발 중인 경우에만!) Effect를 스트레스 테스트합니다.
- 다시 마운트를 수행함으로 인해 Effect가 깨지는 경우, 클린업 함수를 구현해야 합니다.
- React는 다음 Effect가 실행되기 전 및 마운트 해제 시점에 클린업 함수를 호출합니다.

</TransBlock>

</Recap>

<Challenges>

#### Focus a field on mount<Trans>마운트시 필드에 초점 맞추기</Trans> {/*focus-a-field-on-mount*/}

In this example, the form renders a `<MyInput />` component.
<Trans>이 예제에서 form은 `<MyInput />` 컴포넌트를 렌더링합니다.</Trans>

Use the input's [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) method to make `MyInput` automatically focus when it appears on the screen. There is already a commented out implementation, but it doesn't quite work. Figure out why it doesn't work, and fix it. (If you're familiar with the `autoFocus` attribute, pretend that it does not exist: we are reimplementing the same functionality from scratch.)
<Trans>input의 [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) 메서드를 사용하여 `MyInput`이 화면에 나타날 때 자동으로 초점이 맞춰지도록 하세요. 주석을 해제해도 제대로 작동하지 않을 것입니다. 작동하지 않는 이유를 파악하고 수정하십시오. (`autoFocus` 속성에 익숙하다면 존재하지 않는 것으로 가정하십시오. 동일한 기능을 처음부터 다시 구현하고 있습니다.)</Trans>

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: This doesn't quite work. Fix it.
  // ref.current.focus()    

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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


To verify that your solution works, press "Show form" and verify that the input receives focus (becomes highlighted and the cursor is placed inside). Press "Hide form" and "Show form" again. Verify the input is highlighted again.
<Trans>솔루션이 작동하는지 확인하려면 "Show form"을 누르고 입력이 포커스를 받는지를 확인하세요(강조 표시되고 커서가 내부에 위치함). "Hide form"를 누르고, 다시 "Show form"를 누르세요. 입력이 다시 강조 표시되는지 확인하세요.</Trans>

`MyInput` should only focus _on mount_ rather than after every render. To verify that the behavior is right, press "Show form" and then repeatedly press the "Make it uppercase" checkbox. Clicking the checkbox should _not_ focus the input above it.
<Trans>`MyInput`은 모든 렌더링 이후가 아니라 _마운트에만_ 집중해야 합니다. 동작이 올바른지 확인하려면 "Show form"을 누른 다음 "Make it uppercase" 확인란을 반복해서 누릅니다. 확인란을 클릭해도 위의 입력에 초점이 맞춰지지 _않아야_ 합니다.</Trans>

<Solution>

Calling `ref.current.focus()` during render is wrong because it is a *side effect*. Side effects should either be placed inside an event handler or be declared with `useEffect`. In this case, the side effect is _caused_ by the component appearing rather than by any specific interaction, so it makes sense to put it in an Effect.
<Trans>렌더링 중에 `ref.current.focus()`를 호출하는 것은 *사이드 이펙트*이므로 잘못되었습니다. 사이드 이펙트는 이벤트 핸들러 안에 배치하거나 `useEffect`로 선언해야 합니다. 이 경우 사이드 이펙트는 특정 상호작용이 아니라 컴포넌트가 나타나기 때문에 _발생하는_ 것이므로 Effect에 넣는 것이 좋습니다.</Trans>

To fix the mistake, wrap the `ref.current.focus()` call into an Effect declaration. Then, to ensure that this Effect runs only on mount rather than after every render, add the empty `[]` dependencies to it.
<Trans>이 실수를 수정하려면 `ref.current.focus()` 호출을 Effect 선언으로 감싸세요. 그런 다음 이 Effect가 렌더링될 때마다 실행되는 것이 아니라 마운트할 때만 실행되도록 빈 `[]` 의존성을 추가합니다.</Trans>

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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

</Solution>

#### Focus a field conditionally<Trans>조건부로 필드에 초점 맞추기</Trans> {/*focus-a-field-conditionally*/}

This form renders two `<MyInput />` components.
<Trans>이 form은 두 개의 `<MyInput />` 컴포넌트를 렌더링합니다.</Trans>

Press "Show form" and notice that the second field automatically gets focused. This is because both of the `<MyInput />` components try to focus the field inside. When you call `focus()` for two input fields in a row, the last one always "wins".
<Trans>"Show form"을 누르고 자동으로 두 번째 필드에 초점이 맞춰지는 것을 확인하세요. 이는 두 `<MyInput />` 컴포넌트가 모두 자신의 필드에 초점을 맞추려고 하기 때문입니다. 한 행에 있는 두 개의 입력 필드에 대해 `focus()`를 호출하면 항상 마지막 항목이 "승리"합니다.</Trans>

Let's say you want to focus the first field. The first `MyInput` component now receives a boolean `shouldFocus` prop set to `true`. Change the logic so that `focus()` is only called if the `shouldFocus` prop received by `MyInput` is `true`.
<Trans>첫 번째 필드에 초점을 맞추고 싶다고 합시다. 첫 번째 `MyInput` 컴포넌트는 이제 `true`로 설정된 부울 `shouldFocus` prop을 받습니다. MyInput에서 받은 `shouldFocus` prop이 `true`인 경우에만 `focus()`가 호출되도록 논리를 변경해 보세요.</Trans>

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: call focus() only if shouldFocus is true.
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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

To verify your solution, press "Show form" and "Hide form" repeatedly. When the form appears, only the *first* input should get focused. This is because the parent component renders the first input with `shouldFocus={true}` and the second input with `shouldFocus={false}`. Also check that both inputs still work and you can type into both of them.
<Trans>솔루션을 확인하려면 "Show form" 및 "hide Form"을 반복해서 누르십시오. 양식이 나타나면 *첫 번째* input에만 초점이 맞춰져야 합니다. 이는 부모 컴포넌트가 `shouldFocus={true}`로 첫 번째 입력을 렌더링하고 `shouldFocus={false}`로 두 번째 입력을 렌더링하기 때문입니다. 또한 두 input이 여전히 잘 작동하는지 확인하세요.</Trans>

<Hint>

You can't declare an Effect conditionally, but your Effect can include conditional logic.
<Trans>조건부로 Effect를 선언할 수는 없지만, Effect는 조건부 논리를 포함할 수 있습니다.</Trans>

</Hint>

<Solution>

Put the conditional logic inside the Effect. You will need to specify `shouldFocus` as a dependency because you are using it inside the Effect. (This means that if some input's `shouldFocus` changes from `false` to `true`, it will focus after mount.)
<Trans>Effect 안에 조건부 로직을 넣습니다. Effect 내부에서 `shouldFocus`를 사용하기 때문에 `shouldFocus`를 의존성으로 지정해야 합니다. (즉, 일부 입력의 `shouldFocus`가 `false`에서 `true`로 변경되면 마운트 후 포커스를 맞춥니다.)</Trans>

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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

</Solution>

#### Fix an interval that fires twice<Trans>두 번 발생하는 interval 수정</Trans> {/*fix-an-interval-that-fires-twice*/}

This `Counter` component displays a counter that should increment every second. On mount, it calls [`setInterval`.](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) This causes `onTick` to run every second. The `onTick` function increments the counter.
<Trans>이 `Counter` 컴포넌트는 매초 증가해야 하는 카운터를 표시합니다. 마운트 시 [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)을 호출합니다. 이로 인해 `onTick`이 1초마다 실행됩니다. `onTick` 함수는 카운터를 증가시킵니다.</Trans>

However, instead of incrementing once per second, it increments twice. Why is that? Find the cause of the bug and fix it.
<Trans>그러나 초당 한 번씩 증가하는 대신 두 번씩 증가합니다. 왜 그럴까요? 버그의 원인을 찾아서 수정하세요.</Trans>


<Hint>

Keep in mind that `setInterval` returns an interval ID, which you can pass to [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) to stop the interval.
<Trans>`setInterval`은 interval ID를 반환하며, 이를 [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)에 전달하여 interval을 중지할 수 있음을 유의하세요.</Trans>

</Hint>

<Sandpack>

```js Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
```

```js App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
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

<Solution>

When [Strict Mode](/reference/react/StrictMode) is on (like in the sandboxes on this site), React remounts each component once in development. This causes the interval to be set up twice, and this is why each second the counter increments twice.
<Trans>이 사이트의 샌드박스에서와 같이 [Strict Mode](/reference/react/StrictMode)가 켜져 있으면 React는 개발 환경에서 각 컴포넌트를 한 번씩 다시 마운트합니다. 이로 인해 interval이 두 번 설정되고, 매 초마다 카운터가 두 번 증가하는 것입니다.</Trans>

However, React's behavior is not the *cause* of the bug: the bug already exists in the code. React's behavior makes the bug more noticeable. The real cause is that this Effect starts a process but doesn't provide a way to clean it up.
<Trans>그러나 React의 동작은 버그의 *원인*이 아닙니다. 버그는 이미 코드에 존재합니다. React의 동작은 버그를 더 눈에 띄게 만듭니다. 진짜 원인은 이 Effect가 프로세스를 시작하지만 이를 클린업할 방법을 제공하지 않기 때문입니다.</Trans>

To fix this code, save the interval ID returned by `setInterval`, and implement a cleanup function with [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):
<Trans>이 코드를 수정하려면 `setInterval`이 반환한 interval ID를 저장하고 [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)로 클린업 함수를 구현하세요:</Trans>

<Sandpack>

```js Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```

```js App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
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

In development, React will still remount your component once to verify that you've implemented cleanup well. So there will be a `setInterval` call, immediately followed by `clearInterval`, and `setInterval` again. In production, there will be only one `setInterval` call. The user-visible behavior in both cases is the same: the counter increments once per second.
<Trans>개발 모드에서 React는 클린업을 잘 구현했는지 확인하기 위해 컴포넌트를 한 번 다시 마운트합니다. 따라서 `setInterval` 호출이 있고, 바로 뒤에 `clearInterval`이 있고, 다시 `setInterval`이 호출됩니다. 프로덕션 환경에서는 `setInterval` 호출이 하나만 있을 것입니다. 두 경우 모두 사용자가 볼 수 있는 동작은 동일합니다. 카운터가 초당 한 번씩 증가합니다.</Trans>

</Solution>

#### Fix fetching inside an Effect<Trans>Effect 내부의 페칭 수정하기</Trans> {/*fix-fetching-inside-an-effect*/}

This component shows the biography for the selected person. It loads the biography by calling an asynchronous function `fetchBio(person)` on mount and whenever `person` changes. That asynchronous function returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which eventually resolves to a string. When fetching is done, it calls `setBio` to display that string under the select box.
<Trans>이 컴포넌트는 선택한 인물의 약력을 표시합니다. 이 컴포넌트는 마운트 시 비동기 함수 `fetchBio(person)`를 호출하여 `person`이 변경될 때마다 약력을 로드합니다. 이 비동기 함수는 문자열을 resolve하는 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)를 반환합니다. 페칭이 완료되면 `setBio`를 호출하여 선택 상자 아래에 해당 문자열을 표시합니다.</Trans>

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then(result => {
      setBio(result);
    });
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


There is a bug in this code. Start by selecting "Alice". Then select "Bob" and then immediately after that select "Taylor". If you do this fast enough, you will notice that bug: Taylor is selected, but the paragraph below says "This is Bob's bio."
<Trans>이 코드에 버그가 있습니다. 먼저 "앨리스"를 선택하세요. 그런 다음 "Bob"을 선택한 다음 바로 뒤에 "Taylor"를 선택하세요. 이 작업을 충분히 빠르게 수행하면 해당 버그를 발견할 수 있습니다: 테일러가 선택되었지만 아래 단락에 "This is Bob's bio."라고 표시됩니다.</Trans>

Why does this happen? Fix the bug inside this Effect.
<Trans>왜 이런 일이 발생하나요? 이 Effect 내부의 버그를 수정하세요.</Trans>

<Hint>

If an Effect fetches something asynchronously, it usually needs cleanup.
<Trans>Effect가 비동기적으로 무언가를 페치하는 경우 일반적으로 클린업이 필요합니다.</Trans>

</Hint>

<Solution>

To trigger the bug, things need to happen in this order:
<Trans>버그를 발동시키려면 다음 순서로 일이 발생해야 합니다:</Trans>

- Selecting `'Bob'` triggers `fetchBio('Bob')`
- Selecting `'Taylor'` triggers `fetchBio('Taylor')`
- **Fetching `'Taylor'` completes *before* fetching `'Bob'`**
- The Effect from the `'Taylor'` render calls `setBio('This is Taylor’s bio')`
- Fetching `'Bob'` completes
- The Effect from the `'Bob'` render calls `setBio('This is Bob’s bio')`

<TransBlock>
- `'Bob'`을 선택하면 `fetchBio('Bob')`가 발동됩니다.
- `'Taylor'`를 선택하면 `fetchBio('Taylor')`가 발동됩니다.
- **`'Taylor'의 페칭이 `'Bob'을 페치하기 *전에* 완료됩니다.**
- `'Taylor'` 렌더링의 Effect는 `setBio('this is Taylor’s bio')`를 호출합니다.
- `'Bob'`의 페칭이 완료됩니다.
- `'Bob'` 렌더링의 Effect는 `setBio('This is Bob's bio')`를 호출합니다.
</TransBlock>

This is why you see Bob's bio even though Taylor is selected. Bugs like this are called [race conditions](https://en.wikipedia.org/wiki/Race_condition) because two asynchronous operations are "racing" with each other, and they might arrive in an unexpected order.
<Trans>테일러가 선택되었음에도 불구하고 밥의 약력이 표시되는 이유는 이때문입니다. 두 개의 비동기 연산이 서로 '경쟁'해서 예기치 않은 순서로 도착할 수 있는 이와 같은 버그를 [조건 경합](https://en.wikipedia.org/wiki/Race_condition)이라고 합니다.</Trans>

To fix this race condition, add a cleanup function:
<Trans>이 조건 경합을 수정하려면 클린업 함수를 추가하세요:</Trans>

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

Each render's Effect has its own `ignore` variable. Initially, the `ignore` variable is set to `false`. However, if an Effect gets cleaned up (such as when you select a different person), its `ignore` variable becomes `true`. So now it doesn't matter in which order the requests complete. Only the last person's Effect will have `ignore` set to `false`, so it will call `setBio(result)`. Past Effects have been cleaned up, so the `if (!ignore)` check will prevent them from calling `setBio`:
<Trans>각 렌더링의 Effect에는 자체 `ignore` 변수가 있습니다. 처음에 `ignore` 변수는 `false`로 설정됩니다. 그러나 다른 인물을 선택하는 등 Effect가 클린업 되면 `ignore` 변수는 `true`가 됩니다. 따라서 이제 요청이 완료되는 순서는 중요하지 않습니다. 마지막 사람의 Effect만 `ignore`가 `false`로 설정되어 `setBio(result)`를 호출합니다. 과거의 Effect는 클린업 되었으므로 `if (!ignore)` 검사는 `setBio`를 호출하지 못하도록 합니다:</Trans>

- Selecting `'Bob'` triggers `fetchBio('Bob')`
- Selecting `'Taylor'` triggers `fetchBio('Taylor')` **and cleans up the previous (Bob's) Effect**
- Fetching `'Taylor'` completes *before* fetching `'Bob'`
- The Effect from the `'Taylor'` render calls `setBio('This is Taylor’s bio')`
- Fetching `'Bob'` completes
- The Effect from the `'Bob'` render **does not do anything because its `ignore` flag was set to `true`**

<TransBlock>

- `'Bob'`을 선택하면 `fetchBio('Bob')`가 발동됩니다.
- `'Taylor'` 를 선택하면 `fetchBio('Taylor')` 가 발동되고 **이전 (Bob의) Effect가 정리됩니다**.
- `'Taylor'`의 페칭이 '밥'을 페치하기 *전에* 완료됩니다.
- `'Taylor'` 렌더링의 Effect는 `setBio('This is Taylor’s bio')`를 호출합니다.
- `'Bob'`의 페칭이 완료됩니다.
- `'Bob'` 렌더링의 Effect는 `ignore` 플래그가 **`true`로 설정되었기 때문에 아무 작업도 수행하지 않습니다.**

</TransBlock>

In addition to ignoring the result of an outdated API call, you can also use [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) to cancel the requests that are no longer needed. However, by itself this is not enough to protect against race conditions. More asynchronous steps could be chained after the fetch, so using an explicit flag like `ignore` is the most reliable way to fix this type of problems.
<Trans>오래된 API 호출의 결과를 무시하는 것 외에도 [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)를 사용하여 더 이상 필요하지 않은 요청을 취소할 수도 있습니다. 그러나 조건 경합을 방지하기에는 이것만으로는 충분하지 않습니다. 페칭 이후에 더 많은 비동기 단계가 연쇄적으로 발생할 수 있으므로 `ignore`와 같은 명시적 플래그를 사용하는 것이 이러한 유형의 문제를 해결하는 가장 신뢰할 수 있는 방법입니다.</Trans>

</Solution>

</Challenges>

