---
title: Render and Commit
translatedTitle: 렌더링하고 커밋하기
translators: [박문하, 정재남]
---

<Intro>

Before your components are displayed on screen, they must be rendered by React. Understanding the steps in this process will help you think about how your code executes and explain its behavior.
<Trans>컴포넌트를 화면에 표시하기 이전에 React에서 렌더링을 해야 합니다. 해당 과정의 단계를 이해하면 코드가 어떻게 실행되는지 이해할 수 있고 React 렌더링 동작에 관해 설명하는데 도움이 됩니다.</Trans>

</Intro>

<YouWillLearn>

* What rendering means in React
* When and why React renders a component
* The steps involved in displaying a component on screen
* Why rendering does not always produce a DOM update

<TransBlock>
  - React에서 렌더링의 의미
  - React가 컴포넌트를 언제, 왜 렌더링 하는지
  - 화면에 컴포넌트를 표시하는 단계
  - 렌더링이 항상 DOM 업데이트를 하지 않는 이유
</TransBlock>

</YouWillLearn>

Imagine that your components are cooks in the kitchen, assembling tasty dishes from ingredients. In this scenario, React is the waiter who puts in requests from customers and brings them their orders. This process of requesting and serving UI has three steps:
<Trans>주방에서 요리사가 컴포넌트를 재료로 맛있는 요리를 한다고 상상해보세요. 이 시나리오에서 React는 고객들의 요청을 받고 주문을 가져오는 웨이터입니다. 이 과정에는 UI를 요청하고 제공하는 세 가지 단계가 있습니다.</Trans>

1. **Triggering** a render (delivering the guest's order to the kitchen)
2. **Rendering** the component (preparing the order in the kitchen)
3. **Committing** to the DOM (placing the order on the table)

<TransBlock>
1. 렌더링 **촉발** (손님의 주문을 주방으로 전달)
2. 컴포넌트 **렌더링** (주방에서 주문 받기)
3. DOM에 **커밋** (테이블에 주문한 요리 내놓기)
</TransBlock>

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="React as a server in a restaurant, fetching orders from the users and delivering them to the Component Kitchen." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="The Card Chef gives React a fresh Card component." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React delivers the Card to the user at their table." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

## Step 1: Trigger a render<Trans>렌더링을 촉발시킵니다</Trans> {/*step-1-trigger-a-render*/}

There are two reasons for a component to render:
<Trans>컴포넌트 렌더링이 일어나는 데에는 두 가지 이유가 있습니다:</Trans>

1. It's the component's **initial render.**
2. The component's (or one of its ancestors') **state has been updated.**

<TransBlock>
1. 컴포넌트의 **첫 렌더링인 경우**
2. 컴포넌트의 **state**(또는 상위 요소 중 하나)가 업데이트된 경우
</TransBlock>

### Initial render<Trans>첫 렌더링</Trans> {/*initial-render*/}

When your app starts, you need to trigger the initial render. Frameworks and sandboxes sometimes hide this code, but it's done by calling [`createRoot`](/reference/react-dom/client/createRoot) with the target DOM node, and then calling its `render` method with your component:
<Trans>앱을 시작하기 위해서는 첫 렌더링을 촉발시켜야 합니다. 프레임워크와 샌드박스가 때때로 코드를 숨기지만, 대상 DOM 노드로 [`createRoot`](/reference/react-dom/client/createRoot)를 호출한 다음 컴포넌트로 `render` 메서드를 호출하면 됩니다.</Trans>

<Sandpack>

```js index.js active
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

```js Image.js
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

</Sandpack>

Try commenting out the `root.render()` call and see the component disappear!
<Trans>`root.render()` 호출을 주석 처리하고 컴포넌트가 사라지는 것을 확인하세요!</Trans>

### Re-renders when state updates<Trans>state가 업데이트되면 리렌더링합니다</Trans> {/*re-renders-when-state-updates*/}

Once the component has been initially rendered, you can trigger further renders by updating its state with the [`set` function.](/reference/react/useState#setstate) Updating your component's state automatically queues a render. (You can imagine these as a restaurant guest ordering tea, dessert, and all sorts of things after putting in their first order, depending on the state of their thirst or hunger.)
<Trans>컴포넌트가 처음 렌더링되면 [`set` (설정자) 함수](/reference/react/useState#setstate)로 state를 업데이트하여 추가 렌더링을 촉발시킬 수 있습니다. 컴포넌트의 state를 업데이트하면 자동으로 렌더링이 대기열에 추가됩니다. (이것은 식당에서 손님이 첫 주문 이후에 갈증이 나거나 배고파져서 차, 디저트 등을 추가로 주문하는 모습으로 상상해 볼 수 있습니다.)</Trans>

<IllustrationBlock sequential>
  <Illustration caption="State update..." alt="React as a server in a restaurant, serving a Card UI to the user, represented as a patron with a cursor for their head. They patron expresses they want a pink card, not a black one!" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...triggers..." alt="React returns to the Component Kitchen and tells the Card Chef they need a pink Card." src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...render!" alt="The Card Chef gives React the pink Card." src="/images/docs/illustrations/i_rerender3.png" />
</IllustrationBlock>

## Step 2: React renders your components<Trans>React가 컴포넌트를 렌더링합니다</Trans> {/*step-2-react-renders-your-components*/}

After you trigger a render, React calls your components to figure out what to display on screen. **"Rendering" is React calling your components.**
<Trans>렌더링을 촉발시키면, React는 컴포넌트를 호출하여 화면에 표시할 내용을 파악합니다. **"렌더링"은 React에서 컴포넌트를 호출하는 것입니다.**</Trans>

* **On initial render,** React will call the root component.
* **For subsequent renders,** React will call the function component whose state update triggered the render.

<TransBlock>
- **첫 렌더링에서** React는 루트 컴포넌트를 호출합니다.
- **이후 렌더링에서** React는 state 업데이트에 의해 렌더링이 발동된 함수 컴포넌트를 호출합니다.
</TransBlock>

This process is recursive: if the updated component returns some other component, React will render _that_ component next, and if that component also returns something, it will render _that_ component next, and so on. The process will continue until there are no more nested components and React knows exactly what should be displayed on screen.
<Trans>이 과정은 재귀적입니다: 업데이트된 컴포넌트가 다른 컴포넌트를 반환하면 React는 다음으로 *해당* 컴포넌트를 렌더링하고 해당 컴포넌트도 컴포넌트를 반환하면 *반환된* 컴포넌트를 다음에 렌더링하는 방식입니다. 중첩된 컴포넌트가 더 이상 없고 React가 화면에 표시되어야 하는 내용을 정확히 알 때까지 이 단계는 계속됩니다.</Trans>

In the following example, React will call `Gallery()` and  `Image()` several times:
<Trans>다음 예제에서 React는 `Gallery()`와 `Image()`를 여러 번 호출합니다:</Trans>

<Sandpack>

```js Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

```js index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

* **During the initial render,** React will [create the DOM nodes](https://developer.mozilla.org/docs/Web/API/Document/createElement) for `<section>`, `<h1>`, and three `<img>` tags. 
* **During a re-render,** React will calculate which of their properties, if any, have changed since the previous render. It won't do anything with that information until the next step, the commit phase.

<TransBlock>
  - **첫 렌더링을 하는 동안** React는 `<section>`, `<h1>` 그리고 3개의 `<img>` 태그에 대한 [DOM 노드를 생성](https://developer.mozilla.org/docs/Web/API/Document/createElement)합니다.
  - **리렌더링하는 동안** React는 이전 렌더링 이후 변경된 속성을 계산합니다. 다음 단계인 커밋 단계까지는 해당 정보로 아무런 작업도 수행하지 않습니다.
</TransBlock>

<Pitfall>

Rendering must always be a [pure calculation](/learn/keeping-components-pure):
<Trans>렌더링은 항상 [순수한 계산](/learn/keeping-components-pure)이어야 합니다:</Trans>

* **Same inputs, same output.** Given the same inputs, a component should always return the same JSX. (When someone orders a salad with tomatoes, they should not receive a salad with onions!)
* **It minds its own business.** It should not change any objects or variables that existed before rendering. (One order should not change anyone else's order.)

<TransBlock>
- **동일한 입력에는 동일한 출력을 해야합니다.** 동일한 입력이 주어지면 컴포넌트는 항상 동일한 JSX를 반환해야 합니다. (누군가 토마토 샐러드를 주문하면 그들은 양파가 있는 샐러드를 받으면 안 됩니다!)
- **이전의 state를 변경해서는 안됩니다.** 렌더링 전에 존재했던 객체나 변수를 변경해서는 안 됩니다. (누군가의 주문이 다른 사람의 주문을 변경해서는 안 됩니다.)
</TransBlock>

Otherwise, you can encounter confusing bugs and unpredictable behavior as your codebase grows in complexity. When developing in "Strict Mode", React calls each component's function twice, which can help surface mistakes caused by impure functions.
<Trans>그렇지 않으면 코드베이스가 복잡해짐에 따라 혼란스러운 버그와 예측할 수 없는 동작이 발생할 수 있습니다. "Strict Mode"에서 개발할 때 React는 각 컴포넌트의 함수를 두 번 호출하여 순수하지 않은 함수로 인한 실수를 표면화하는데 도움을 받을 수 있습니다.</Trans>

</Pitfall>

<DeepDive>

#### Optimizing performance<Trans>성능 최적화</Trans> {/*optimizing-performance*/}

The default behavior of rendering all components nested within the updated component is not optimal for performance if the updated component is very high in the tree. If you run into a performance issue, there are several opt-in ways to solve it described in the [Performance](https://reactjs.org/docs/optimizing-performance.html) section. **Don't optimize prematurely!**
<Trans>업데이트된 컴포넌트 내에 중첩된 모든 컴포넌트를 렌더링하는 기본 동작은 업데이트된 컴포넌트가 트리에서 매우 높은 곳에 있는 경우 성능 최적화되지 않습니다. 성능 문제가 발생하는 경우 [성능](https://reactjs.org/docs/optimizing-performance.html) 섹션에 설명된 몇 가지 옵트인 방식으로 문제를 해결 할 수 있습니다. **성급하게 최적화하지 마세요!**</Trans>

</DeepDive>

## Step 3: React commits changes to the DOM<Trans>React가 DOM에 변경사항을 커밋</Trans> {/*step-3-react-commits-changes-to-the-dom*/}

After rendering (calling) your components, React will modify the DOM. 
<Trans>컴포넌트를 렌더링(호출)한 후 React는 DOM을 수정합니다. </Trans>

* **For the initial render,** React will use the [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API to put all the DOM nodes it has created on screen. 
* **For re-renders,** React will apply the minimal necessary operations (calculated while rendering!) to make the DOM match the latest rendering output.
<TransBlock>
- **초기 렌더링의 경우** React는 [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API를 사용하여 생성한 모든 DOM 노드를 화면에 표시합니다.
- **리렌더링의 경우** React는 필요한 최소한의 작업(렌더링하는 동안 계산된 것!)을 적용하여 DOM이 최신 렌더링 출력과 일치하도록 합니다.
</TransBlock>

**React only changes the DOM nodes if there's a difference between renders.** For example, here is a component that re-renders with different props passed from its parent every second. Notice how you can add some text into the `<input>`, updating its `value`, but the text doesn't disappear when the component re-renders:
<Trans>**React는 렌더링 간에 차이가 있는 경우에만 DOM 노드를 변경합니다.** 예를 들어 매초 부모로부터 전달된 다른 props로 다시 렌더링하는 컴포넌트가 있습니다. `<input>`에 텍스트를 입력하여 `value`를 업데이트 하지만 컴포넌트가 리렌더링될 때 텍스트가 사라지지 않습니다.</Trans>

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time.toLocaleTimeString()} />
  );
}
```

</Sandpack>

This works because during this last step, React only updates the content of `<h1>` with the new `time`. It sees that the `<input>` appears in the JSX in the same place as last time, so React doesn't touch the `<input>`—or its `value`!
<Trans>마지막 단계에서 React가 `<h1>`의 내용만 새로운 `time`으로 업데이트하기 때문입니다. `<input>`이 JSX에서 이전과 같은 위치로 확인되므로 React는 `<input>` 또는 `value`를 건드리지 않습니다!</Trans>

## Epilogue: Browser paint<Trans>에필로그: 브라우저 페인트</Trans> {/*epilogue-browser-paint*/}

After rendering is done and React updated the DOM, the browser will repaint the screen. Although this process is known as "browser rendering", we'll refer to it as "painting" to avoid confusion throughout the docs.
<Trans>렌더링이 완료되고 React가 DOM을 업데이트한 후 브라우저는 화면을 다시 그립니다. 이 단계를 "브라우저 렌더링"이라고 하지만 이 문서의 나머지 부분에서 혼동을 피하고자 "페인팅"이라고 부를 것입니다.</Trans>

<Illustration alt="A browser painting 'still life with card element'." src="/images/docs/illustrations/i_browser-paint.png" />

<Recap>

* Any screen update in a React app happens in three steps:
  1. Trigger
  2. Render
  3. Commit
* You can use Strict Mode to find mistakes in your components
* React does not touch the DOM if the rendering result is the same as last time

<TransBlock>
- React 앱의 모든 화면 업데이트는 세 단계로 이루어집니다.
    1. 촉발
    2. 렌더링
    3. 커밋
- Strict Mode를 사용하여 컴포넌트에서 실수를 찾을 수 있습니다.
- 렌더링 결과가 이전과 같으면 React는 DOM을 건드리지 않습니다.
</TransBlock>
</Recap>

