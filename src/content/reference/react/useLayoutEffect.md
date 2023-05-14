---
title: useLayoutEffect
translators: [최다인, 고석영, 이나령]
---

<Pitfall>

`useLayoutEffect` can hurt performance. Prefer [`useEffect`](/reference/react/useEffect) when possible.
<Trans>`useLayoutEffect`는 성능을 저하시킬 수 있습니다. 가급적이면 [`useEffect`](/reference/react/useEffect)를 사용하세요.</Trans>
</Pitfall>

<Intro>

`useLayoutEffect` is a version of [`useEffect`](/reference/react/useEffect) that fires before the browser repaints the screen.
<Trans>`useLayoutEffect`는 브라우저가 화면을 다시 채우기 전에 실행되는 버전의 [`useEffect`](/reference/react/useEffect)입니다.</Trans>
```js
useLayoutEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `useLayoutEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Call `useLayoutEffect` perform the layout measurements before the browser repaints the screen:
<Trans>브라우저가 화면을 다시 그리기 전에 `useLayoutEffect`를 호출하여 레이아웃을 측정합니다:</Trans>

```js
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  // ...
```


[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

* `setup`: The function with your Effect's logic. Your setup function may also optionally return a *cleanup* function. Before your component is added to the DOM, React will run your setup function. After every re-render with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values. Before your component is removed from the DOM, React will run your cleanup function.
<Trans>`setup`: Effect의 로직이 포함된 함수입니다. 셋업 함수는 선택적으로 *클린업* 함수를 반환할 수 있습니다. 컴포넌트가 DOM에 추가되기 전에 React는 셋업 함수를 실행합니다. 변경된 의존성으로 다시 렌더링할 때마다 React는 (클린업 함수를 정의한 경우) 먼저 이전 값으로 클린업 함수를 실행한 다음, 새 값으로 셋업 함수를 실행합니다. 컴포넌트가 DOM에서 제거되기 전에 React는 셋업 함수를 한 번 더 실행합니다.</Trans>
 
* **optional** `dependencies`: The list of all reactive values referenced inside of the `setup` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is [configured for React](/learn/editor-setup#linting), it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. If you omit this argument, your Effect will re-run after every re-render of the component.
<Trans>**optional** `dependencies`:  `setup` 코드 내에서 참조된 모든 반응형 값의 목록입니다. 반응형 값에는 props, state, 컴포넌트 본문 내부에서 직접 선언된 모든 변수와 함수가 포함됩니다. 린터가 [React용으로 설정된 경우](/learn/editor-setup#linting), 모든 반응형 값이 의존성으로 올바르게 지정되었는지 확인합니다. 의존성 목록은 일정한 수의 항목을 가져야 하며 `[dep1, dep2, dep3]`와 같이 인라인으로 작성해야 합니다. React는 [`Object.is`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교를 사용하여 각 의존성을 이전 값과 비교합니다. 이 인수를 생략하면 컴포넌트를 다시 렌더링할 때마다 Effect가 다시 실행됩니다.</Trans>
#### Returns<Trans>반환값</Trans> {/*returns*/}

`useLayoutEffect` returns `undefined`.
<Trans>`useLayoutEffect`는 `undefined`를 반환합니다.</Trans>
#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

* `useLayoutEffect` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a component and move the Effect there.
<Trans>`useLayoutEffect`는 훅이므로 **컴포넌트의 최상위 레벨** 또는 자체 훅에서만 호출할 수 있습니다. 반복문이나 조건문 내부에서는 호출할 수 없습니다. 필요하다면 컴포넌트를 추출하고 Effect를 그곳으로 이동하세요.</Trans>

* When Strict Mode is on, React will **run one extra development-only setup+cleanup cycle** before the first real setup. This is a stress-test that ensures that your cleanup logic "mirrors" your setup logic and that it stops or undoes whatever the setup is doing. If this causes a problem, [implement the cleanup function.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)
<Trans>Strict Mode가 켜져 있으면 React는 첫 번째 실제 셋업 전에 **개발 전용 셋업+클린업 사이클**을 한 번 더 실행합니다. 이는 클린업 로직이 셋업 로직을 "미러링"하고 설정이 수행 중인 모든 작업을 중지하거나 취소하는지 확인하는 스트레스 테스트입니다. 문제가 발생하면 [클린업 함수를 구현하세요.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)</Trans>

* If some of your dependencies are objects or functions defined inside the component, there is a risk that they will **cause the Effect to re-run more often than needed.** To fix this, remove unnecessary [object](/reference/react/useEffect#removing-unnecessary-object-dependencies) and [function](/reference/react/useEffect#removing-unnecessary-function-dependencies) dependencies. You can also [extract state updates](/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect) and [non-reactive logic](/reference/react/useEffect#reading-the-latest-props-and-state-from-an-effect) outside of your Effect.
<Trans>의존성 중 일부가 컴포넌트 내부에 정의된 객체 또는 함수인 경우, **Effect가 필요 이상으로 자주 다시 실행될 위험이 있습니다.** 이 문제를 해결하려면 불필요한 [객체](/reference/react/useEffect#removing-unnecessary-object-dependencies) 및 [함수](/reference/react/useEffect#removing-unnecessary-function-dependencies) 의존성을 제거하세요. 또한 Effect 외부에서 [state 업데이트](/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect)와 [비반응형 로직](/reference/react/useEffect#reading-the-latest-props-and-state-from-an-effect)을 추출할 수도 있습니다.</Trans>

* Effects **only run on the client.** They don't run during server rendering.
<Trans>LayoutEffect는 **클라이언트에서만 실행됩니다.** 서버 렌더링 중에는 실행되지 않습니다.</Trans>

* The code inside `useLayoutEffect` and all state updates scheduled from it **block the browser from repainting the screen.** When used excessively, this makes your app slow. When possible, prefer [`useEffect`.](/reference/react/useEffect)
<Trans>`useLayoutEffect` 내부의 코드와 여기에서 예약된 모든 state 업데이트는 **브라우저가 화면을 다시 그리는 것을 차단합니다.** 과도하게 사용하면 앱이 느려집니다. 가급적이면 [`useEffect`](/reference/react/useEffect)를 사용하세요.</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Measuring layout before the browser repaints the screen <Trans>브라우저에서 화면을 다시 그리기 전 레이아웃 측정하기</Trans> {/*measuring-layout-before-the-browser-repaints-the-screen*/}

Most components don't need to know their position and size on the screen to decide what to render. They only return some JSX. Then the browser calculates their *layout* (position and size) and repaints the screen.
<Trans>대부분의 컴포넌트는 무엇을 렌더링할지 결정하기 위해 화면에서의 위치와 크기를 알 필요가 없습니다. 일부 JSX만 반환하기 때문입니다. 그런 다음 브라우저는 해당 컴포넌트의 *레이아웃*(위치 및 크기)을 계산하고 화면을 다시 그립니다.</Trans>

Sometimes, that's not enough. Imagine a tooltip that appears next to some element on hover. If there's enough space, the tooltip should appear above the element, but if it doesn't fit, it should appear below. In order to render the tooltip at the right final position, you need to know its height (i.e. whether it fits at the top).
<Trans>때론 그것만으로는 충분하지 않을 수 있습니다. 마우스오버 시 요소 옆에 툴팁을 표시하는 것을 상상해 보세요. 공간이 충분하면 툴팁이 요소 위에 표시되어야 하지만, 공간이 충분하지 않으면 아래에 표시되어야 합니다. 툴팁을 올바른 최종 위치에 렌더링하려면 툴팁의 높이(즉 상단에 표시하기에 충분한지 여부)를 알아야 합니다.</Trans>

To do this, you need to render in two passes:
<Trans>이렇게 하려면 두 번의 패스로 렌더링해야 합니다:</Trans>

1. Render the tooltip anywhere (even with a wrong position).
2. Measure its height and decide where to place the tooltip.
3. Render the tooltip *again* in the correct place.
<TransBlock>
  1. 툴팁을 원하는 위치에 렌더링합니다(위치가 잘못된 경우에도).
  2. 높이를 측정하고 툴팁을 배치할 위치를 결정합니다.
  3. 올바른 위치에 툴팁을 *다시* 렌더링합니다.
</TransBlock>

**All of this needs to happen before the browser repaints the screen.** You don't want the user to see the tooltip moving. Call `useLayoutEffect` to perform the layout measurements before the browser repaints the screen:
<Trans>**이 모든 작업은 브라우저가 화면을 다시 그리기 전에 이루어져야 합니다.** 사용자가 툴팁이 움직이는 것을 보지 않기를 원합니다. 브라우저가 화면을 다시 그리기 전에 `useLayoutEffect`를 호출하여 레이아웃 측정을 수행합니다:</Trans>

```js {6-10}
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // You don't know real height yet
                                                         // 아직 실제 height 값을 모릅니다.

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // Re-render now that you know the real height
                              // 실제 높이를 알았으니 이제 리렌더링 합니다.
  }, []);

  // ...use tooltipHeight in the rendering logic below...
  // ...아래에 작성될 렌더링 로직에 tooltipHeight를 사용합니다...
}
```

Here's how this works step by step:
<Trans>단계별 작동 방식은 다음과 같습니다:</Trans>

1. `Tooltip` renders with the initial `tooltipHeight = 0`  (so the tooltip may be wrongly positioned).
2. React places it in the DOM and runs the code in `useLayoutEffect`.
3. Your `useLayoutEffect` [measures the height](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) of the tooltip content and triggers an immediate re-render.
4. `Tooltip` renders again with the real `tooltipHeight` (so the tooltip is correctly positioned).
5. React updates it in the DOM, and the browser finally displays the tooltip.
<TransBlock>
  1. `Tooltip`은 초기 `tooltipHeight = 0`으로 렌더링됩니다(따라서 툴팁의 위치가 잘못 지정될 수 있음).
  2. React는 이를 DOM에 배치하고 `useLayoutEffect`에서 코드를 실행합니다.
  3. `useLayoutEffect`는 툴팁 콘텐츠의 [높이를 측정하고](https://developer.mozilla.org/ko/docs/Web/API/Element/getBoundingClientRect) 즉시 다시 렌더링을 촉발합니다.
  4. `Tooltip`이 실제 `tooltipHeight`로 다시 렌더링됩니다(따라서 툴팁이 올바르게 배치됩니다).
  5. React가 DOM에서 이를 업데이트하면 브라우저에 툴팁이 최종적으로 표시됩니다.
</TransBlock>

Hover over the buttons below and see how the tooltip adjusts its position depending on whether it fits:
<Trans>아래 버튼 위로 마우스를 가져가면 툴팁이 맞는지 여부에 따라 툴팁의 위치가 어떻게 조정되는지 확인할 수 있습니다:</Trans>

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log('Measured tooltip height: ' + height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Notice that even though the `Tooltip` component has to render in two passes (first, with `tooltipHeight` initialized to `0` and then with the real measured height), you only see the final result. This is why you need `useLayoutEffect` instead of [`useEffect`](/reference/react/useEffect) for this example. Let's look at the difference in detail below.
<Trans>`Tooltip` 컴포넌트가 두 번의 패스로 렌더링되어야 하지만(먼저 `tooltipHeight`를 0으로 초기화한 다음 실제 측정된 높이로), 최종 결과만 볼 수 있다는 점에 유의하세요. 이 예제에서 [`useEffect`](/reference/react/useEffect) 대신 `useLayoutEffect`가 필요한 이유입니다. 아래에서 차이점을 자세히 살펴보겠습니다.</Trans>

<Recipes titleText="useLayoutEffect vs useEffect" titleId="examples" translatedTitle="">

#### `useLayoutEffect` blocks the browser from repainting <Trans>`useLayoutEffect`는 브라우저가 다시 그리는 것을 차단합니다</Trans> {/*uselayouteffect-blocks-the-browser-from-repainting*/}

React guarantees that the code inside `useLayoutEffect` and any state updates scheduled inside it will be processed **before the browser repaints the screen.** This lets you render the tooltip, measure it, and re-render the tooltip again without the user noticing the first extra render. In other words, `useLayoutEffect` blocks the browser from painting.
<Trans>React는 브라우저가 화면을 다시 그리기 전에 `useLayoutEffect` 내부의 코드와 그 안에서 예약된 모든 state 업데이트가 처리되도록 보장합니다. 이를 통해 사용자가 첫 번째 리렌더링을 눈치채지 못하게 한 상태에서 툴팁을 렌더링하고, 측정한 후, 다시 툴팁을 렌더링하게 해줍니다. 즉, `useLayoutEffect`는 브라우저의 페인팅을 차단합니다.</Trans>

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

<Solution />

#### `useEffect` does not block the browser <Trans>`useEffect`는 브라우저를 차단하지 않습니다</Trans> {/*useeffect-does-not-block-the-browser*/}

Here is the same example, but with [`useEffect`](/reference/react/useEffect) instead of `useLayoutEffect`. If you're on a slower device, you might notice that sometimes the tooltip "flickers" and you briefly see its initial position before the corrected position.
<Trans>다음은 동일한 예시이지만 `useLayoutEffect`대신 [`useEffect`](/reference/react/useEffect)를 사용했습니다. 속도가 느린 기기를 사용하는 경우 가끔 툴팁이 "깜박거리고" 수정된 위치 이전에 초기 위치가 잠깐 표시되는 것을 볼 수 있습니다.</Trans>

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

To make the bug easier to reproduce, this version adds an artificial delay during rendering. React will let the browser paint the screen before it processes the state update inside `useEffect`. As a result, the tooltip flickers:
버그를 더 쉽게 재현할 수 있도록 이 버전에서는 렌더링 중에 인위적인 딜레이를 추가했습니다. React는 브라우저가 `useEffect` 내부에서 state 업데이트를 처리하기 전에 화면을 그리도록 합니다. 그 결과 툴팁이 깜빡입니다:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // This artificially slows down rendering
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Do nothing for a bit...
  }

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Edit this example to `useLayoutEffect` and observe that it blocks the paint even if rendering is slowed down.
<Trans>이 예제를 `useLayoutEffect`를 사용해 수정해보세요. 그런 다음 렌더링 속도가 느려지더라도 화면을 그리는 것이 차단되는지 확인하세요.</Trans>

<Solution />

</Recipes>

<Note>

Rendering in two passes and blocking the browser hurts performance. Try to avoid this when you can.
<Trans>두 번의 패스로 렌더링하고 브라우저를 차단하면 성능이 저하됩니다. 가능하면 피하세요.</Trans>

</Note>

---

## Troubleshooting<Trans>문제 해결</Trans> {/*troubleshooting*/}

### I'm getting an error: “`useLayoutEffect` does nothing on the serverˮ <Trans>오류가 발생합니다: “`useLayoutEffect`가 서버에서 아무것도 수행하지 않습니다ˮ</Trans> {/*im-getting-an-error-uselayouteffect-does-nothing-on-the-server*/}

The purpose of `useLayoutEffect` is to let your component [use layout information for rendering:](#measuring-layout-before-the-browser-repaints-the-screen)
<Trans>`useLayoutEffect`의 목적은 컴포넌트가 [렌더링에 레이아웃 정보를 사용하도록 하는 것](#measuring-layout-before-the-browser-repaints-the-screen)입니다:</Trans>

1. Render the initial content.
2. Measure the layout *before the browser repaints the screen.*
3. Render the final content using the layout information you've read.
<TransBlock>
  1. 초기 콘텐츠를 렌더링합니다.
  2. *브라우저가 화면을 다시 칠하기 전에* 레이아웃을 측정합니다.
  3. 읽은 레이아웃 정보를 사용하여 최종 콘텐츠를 렌더링합니다.
</TransBlock>

When you or your framework uses [server rendering](/reference/react-dom/server), your React app renders to HTML on the server for the initial render. This lets you show the initial HTML before the JavaScript code loads.
<Trans>사용자 또는 프레임워크가 [서버 렌더링](reference/react-dom/server)을 사용하는 경우, React 앱은 초기 렌더링을 위해 서버의 HTML로 렌더링됩니다. 이를 통해 JavaScript 코드가 로드되기 전에 초기 HTML을 표시할 수 있습니다.</Trans>

The problem is that on the server, there is no layout information.
<Trans>문제는 서버에는 레이아웃 정보가 없다는 것입니다.</Trans>

In the [earlier example](#measuring-layout-before-the-browser-repaints-the-screen), the `useLayoutEffect` call in the `Tooltip` component lets it position itself correctly (either above or below content) depending on the content height. If you tried to render `Tooltip` as a part of the initial server HTML, this would be impossible to determine. On the server, there is no layout yet! So, even if you rendered it on the server, its position would "jump" on the client after the JavaScript loads and runs.
<Trans>[이전 예시](#measuring-layout-before-the-browser-repaints-the-screen)에서 `Tooltip` 컴포넌트의 `useLayoutEffect` 호출은 콘텐츠 높이에 따라 콘텐츠 위 또는 아래에 올바르게 배치되도록 합니다. 초기 서버 HTML의 일부로 `Tooltip`을 렌더링하려고 하면 이를 확인할 수 없습니다. 서버에는 아직 레이아웃이 없습니다! 따라서 서버에서 렌더링하더라도 JavaScript가 로드되고 실행된 후 클라이언트에서 그 위치가 "점프"됩니다.</Trans>

Usually, components that rely on layout information don't need to render on the server anyway. For example, it probably doesn't make sense to show a `Tooltip` during the initial render. It is triggered by a client interaction.
<Trans>일반적으로 레이아웃 정보에 의존하는 컴포넌트는 서버에서 렌더링할 필요가 없습니다. 예를 들어, 초기 렌더링 중에 `Tooltip`을 표시하는 것은 의미가 없을 수 있습니다. 이는 클라이언트 상호작용에 의해 촉발됩니다.</Trans>

However, if you're running into this problem, you have a few different options:
<Trans>하지만 이 문제가 발생하는 경우 몇 가지 다른 옵션이 있습니다:</Trans>

- Replace `useLayoutEffect` with [`useEffect`.](/reference/react/useEffect) This tells React that it's okay to display the initial render result without blocking the paint (because the original HTML will become visible before your Effect runs).
<Trans>`useLayoutEffect`를 [`useEffect`로 바꾸세요.](/reference/react/useEffect) 이렇게 하면 React가 페인트를 막지 않고 초기 렌더링 결과를 표시해도 괜찮다고 알려줍니다(Effect가 실행되기 전에 원래 HTML이 보이게 되므로).</Trans>

- Alternatively, [mark your component as client-only.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content) This tells React to replace its content up to the closest [`<Suspense>`](/reference/react/Suspense) boundary with a loading fallback (for example, a spinner or a glimmer) during server rendering.
<Trans>또는 [컴포넌트를 클라이언트 전용으로 표시하세요.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content) 이렇게 하면 서버 렌더링 중에 가장 가까운 [`<Suspense>`](/reference/react/Suspense) 경계까지의 콘텐츠를 로딩 폴백(예: spinner 나 glimmer)으로 대체하도록 React에 지시합니다.</Trans>

- Alternatively, you can render a component with `useLayoutEffect` only after hydration. Keep a boolean `isMounted` state that's initialized to `false`, and set it to `true` inside a `useEffect` call. Your rendering logic can then be like `return isMounted ? <RealContent /> : <FallbackContent />`. On the server and during the hydration, the user will see `FallbackContent` which should not call `useLayoutEffect`. Then React will replace it with `RealContent` which runs on the client only and can include `useLayoutEffect` calls.
<Trans>또는 hydration 후에만 `useLayoutEffect`를 사용하여 컴포넌트를 렌더링할 수 있습니다. `false`로 초기화된 불리언 `isMounted` state를 유지하고, `useEffect` 호출 내에서 이를 `true`로 설정합니다. 그러면 렌더링 로직은 다음과 같을 수 있습니다: `return isMounted ? <RealContent /> : <FallbackContent />` 서버에서 hydration이 진행되는 동안 사용자는 `useLayoutEffect`를 호출하지 않는 `FallbackContent`를 보게 됩니다. 그러면 React는 클라이언트에서만 실행되고 `useLayoutEffect` 호출하는 `RealContent`로 대체합니다.</Trans>

- If you synchronize your component with an external data store and rely on `useLayoutEffect` for different reasons than measuring layout, consider [`useSyncExternalStore`](/reference/react/useSyncExternalStore) instead which [supports server rendering.](/reference/react/useSyncExternalStore#adding-support-for-server-rendering)
<Trans>컴포넌트를 외부 데이터 저장소와 동기화하고 레이아웃 측정이 아닌 다른 이유로 `useLayoutEffect`에 의존하는 경우, 대신 [서버 렌더링을 지원하는](/reference/react/useSyncExternalStore#adding-support-for-server-rendering) [`useSyncExternalStore`](/reference/react/useSyncExternalStore)를 고려하세요.</Trans>
