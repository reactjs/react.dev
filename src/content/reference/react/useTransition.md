---
title: useTransition
translators: [김아영]
---

<Intro>

`useTransition` is a React Hook that lets you update the state without blocking the UI.
<Trans>`useTransition`은 UI를 차단하지 않고 state를 업데이트할 수 있는 React 훅입니다.</Trans>

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `useTransition()` {/*usetransition*/}

Call `useTransition` at the top level of your component to mark some state updates as transitions.
<Trans>컴포넌트의 최상위 레벨에서 `useTransition`을 호출하여 일부 state 업데이트를 트랜지션으로 표시합니다.</Trans>

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

`useTransition` does not take any parameters.
<Trans>`useTransition`은 매개변수를 받지 않습니다.</Trans>

#### Returns<Trans>반환값</Trans> {/*returns*/}

`useTransition` returns an array with exactly two items:
<Trans>`useTransition`은 정확히 두 개의 항목이 있는 배열을 반환합니다:</Trans>

1. The `isPending` flag that tells you whether there is a pending transition.
2. The [`startTransition` function](#starttransition) that lets you mark a state update as a transition.

<TransBlock>
1. 보류 중인 트랜지션이 있는지 여부를 알려주는 `isPending` 플래그
2. state 업데이트를 트랜지션으로 표시할 수 있는 [`startTransition` 함수](#starttransition)
</TransBlock>

---

### `startTransition` function {/*starttransition*/}

The `startTransition` function returned by `useTransition` lets you mark a state update as a transition.
<Trans>`useTransition`이 반환하는 `startTransition` 함수를 사용하면 state 업데이트를 트랜지션으로 표시할 수 있습니다.</Trans>

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

#### Parameters<Trans>매개변수</Trans> {/*starttransition-parameters*/}

* `scope`: A function that updates some state by calling one or more [`set` functions.](/reference/react/useState#setstate) React immediately calls `scope` with no parameters and marks all state updates scheduled synchronously during the `scope` function call as transitions. They will be [non-blocking](#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators.](#preventing-unwanted-loading-indicators)
<Trans>`scope`: 하나 이상의 [`set` 함수를 호출하여 일부 state를 업데이트하는 함수.](/reference/react/useState#setstate) React는 매개변수 없이 `scope`를 즉시 호출하고 `scope` 함수 호출 중에 동기적으로 예약된 모든 state 업데이트를 트랜지션으로 표시합니다. 이는 [논블로킹](#marking-a-state-update-as-non-blocking-transition)이고, [원치 않는 로딩을 표시하지 않을 것입니다.](#preventing-unwanted-loading-indicators)</Trans>

#### Returns<Trans>반환값</Trans> {/*starttransition-returns*/}

`startTransition` does not return anything.
<Trans>`startTransition`은 아무것도 반환하지 않습니다.</Trans>

#### Caveats<Trans>주의사항</Trans> {/*starttransition-caveats*/}

* `useTransition` is a Hook, so it can only be called inside components or custom Hooks. If you need to start a transition somewhere else (for example, from a data library), call the standalone [`startTransition`](/reference/react/startTransition) instead.
<Trans>`useTransition`은 훅이므로 컴포넌트나 커스텀 훅 내부에서만 호출할 수 있습니다. 다른 곳(예: 데이터 라이브러리)에서 트랜지션을 시작해야 하는 경우, 대신 독립형 [`startTransition`](/reference/react/startTransition)을 호출하세요.</Trans>

* You can wrap an update into a transition only if you have access to the `set` function of that state. If you want to start a transition in response to some prop or a custom Hook value, try [`useDeferredValue`](/reference/react/useDeferredValue) instead.
<Trans>해당 state의 `set` 함수에 접근할 수 있는 경우에만 업데이트를 트랜지션으로 감쌀 수 있습니다. 일부 prop이나 커스텀 훅 값에 대한 응답으로 트랜지션을 시작하려면, 대신 [`useDeferredValue`](/reference/react/useDeferredValue)를 사용해보세요.</Trans>

* The function you pass to `startTransition` must be synchronous. React immediately executes this function, marking all state updates that happen while it executes as transitions. If you try to perform more state updates later (for example, in a timeout), they won't be marked as transitions.
<Trans>`startTransition`에 전달하는 함수는 동기식이어야 합니다. React는 이 함수를 즉시 실행하여, 실행하는 동안 발생하는 모든 state 업데이트를 트랜지션으로 표시합니다. 나중에 더 많은 state 업데이트를 수행하려고 하면(예: 타임아웃), 트랜지션으로 표시되지 않습니다.</Trans>

* A state update marked as a transition will be interrupted by other state updates. For example, if you update a chart component inside a transition, but then start typing into an input while the chart is in the middle of a re-render, React will restart the rendering work on the chart component after handling the input update.
<Trans>트랜지션으로 표시된 state 업데이트는 다른 state 업데이트에 의해 중단됩니다. 예를 들어, 트랜지션 내에서 차트 컴포넌트를 업데이트한 다음, 차트가 다시 렌더링되는 도중에 입력을 시작하면 React는 입력 업데이트를 처리한 후 차트 컴포넌트에서 렌더링 작업을 다시 시작합니다.</Trans>

* Transition updates can't be used to control text inputs.
<Trans>트랜지션 업데이트는 텍스트 입력을 제어하는 데 사용할 수 없습니다.</Trans>

* If there are multiple ongoing transitions, React currently batches them together. This is a limitation that will likely be removed in a future release.
<Trans>진행 중인 트랜지션이 여러 개 있는 경우, React는 현재 트랜지션을 함께 일괄 처리합니다. 이는 향후 릴리스에서 제거될 가능성이 높은 제한 사항입니다.</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Marking a state update as a non-blocking transition<Trans>state 업데이트를 논블로킹 트랜지션으로 표시하기</Trans> {/*marking-a-state-update-as-a-non-blocking-transition*/}

Call `useTransition` at the top level of your component to mark state updates as non-blocking *transitions*.
<Trans>컴포넌트의 최상위 레벨에서 `useTransition`을 호출하여 state 업데이트를 논블로킹 *트랜지션*으로 표시하세요.</Trans>

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import { useState, useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` returns an array with exactly two items:
<Trans>`useTransition`은 정확히 두 개의 항목이 있는 배열을 반환합니다:</Trans>

1. The <CodeStep step={1}>`isPending` flag</CodeStep> that tells you whether there is a pending transition.
2. The <CodeStep step={2}>`startTransition` function</CodeStep> that lets you mark a state update as a transition.

<TransBlock>
1. 보류 중인 트랜지션 이 있는지 여부를 알려주는 <CodeStep step={1}>`isPending` 플래그</CodeStep>를 선택합니다.
2. state 업데이트를 트랜지션으로 표시할 수 있는 <CodeStep step={2}>`startTransition` 함수</CodeStep>입니다.
</TransBlock>

You can then mark a state update as a transition like this:
<Trans>그런 다음, 다음과 같이 state 업데이트를 트랜지션으로 표시할 수 있습니다:</Trans>

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
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
<Trans>트랜지션을 사용하면 느린 디바이스에서도 사용자 인터페이스 업데이트의 반응성을 유지할 수 있습니다.</Trans>

With a transition, your UI stays responsive in the middle of a re-render. For example, if the user clicks a tab but then change their mind and click another tab, they can do that without waiting for the first re-render to finish.
<Trans>트랜지션을 사용하면 리렌더링 도중에도 UI가 반응성을 유지합니다. 예를 들어 사용자가 탭을 클릭했다가 마음이 바뀌어 다른 탭을 클릭하면 첫 번째 리렌더링이 완료될 때까지 기다릴 필요 없이 다른 탭을 클릭할 수 있습니다.</Trans>

<Recipes titleText="The difference between useTransition and regular state updates" titleId="examples" translatedTitle="useTransition과 일반 state 업데이트의 차이점">

#### Updating the current tab in a transition<Trans>트랜지션에서 현재 탭 업데이트하기</Trans> {/*updating-the-current-tab-in-a-transition*/}

In this example, the "Posts" tab is **artificially slowed down** so that it takes at least a second to render.
<Trans>이 예제에서는 "Posts" 탭이 **인위적으로 느려지도록** 하여 렌더링하는 데 최소 1초가 걸리도록 했습니다.</Trans>

Click "Posts" and then immediately click "Contact". Notice that this interrupts the slow render of "Posts". The "Contact" tab shows immediately. Because this state update is marked as a transition, a slow re-render did not freeze the user interface.
<Trans>"Posts"를 클릭한 다음 바로 "Contact"를 클릭합니다. 이렇게 하면 "Posts"의 느린 렌더링이 중단됩니다. "Contact" 탭이 즉시 표시됩니다. 이 state 업데이트는 트랜지션으로 표시되므로 느리게 다시 렌더링해도 사용자 인터페이스가 멈추지 않습니다.</Trans>

<Sandpack>

```js
import { useState, useTransition } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);      
    });
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

#### Updating the current tab without a transition<Trans>트랜지션 없이 현재 탭 업데이트하기</Trans> {/*updating-the-current-tab-without-a-transition*/}

In this example, the "Posts" tab is also **artificially slowed down** so that it takes at least a second to render. Unlike in the previous example, this state update is **not a transition.**
<Trans>이 예제에서도 "Posts" 탭을 렌더링하는 데 최소 1초가 걸리도록 **인위적으로 느려지게** 했습니다. 다만 이전 예시와 달리 이 state 업데이트는 **트랜지션이 아닙니다**.</Trans>

Click "Posts" and then immediately click "Contact". Notice that the app freezes while rendering the slowed down tab, and the UI becomes unresponsive. This state update is not a transition, so a slow re-render freezed the user interface.
<Trans>"Posts"를 클릭한 다음 바로 "Contact"를 클릭합니다. 속도가 느려진 탭을 렌더링하는 동안 앱이 멈추고 UI가 응답하지 않는 것을 확인할 수 있습니다. 이 state 업데이트는 트랜지션이 아니므로 느리게 다시 렌더링하면 사용자 인터페이스가 정지됩니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    setTab(nextTab);
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Updating the parent component in a transition<Trans>트랜지션에서 상위 컴포넌트 업데이트하기</Trans> {/*updating-the-parent-component-in-a-transition*/}

You can update a parent component's state from the `useTransition` call, too. For example, this `TabButton` component wraps its `onClick` logic in a transition:
<Trans>`useTransition` 호출에서도 부모 컴포넌트의 state를 업데이트할 수 있습니다. 예를 들어, 이 `TabButton` 컴포넌트는 `onClick` 로직을 트랜지션으로 감쌉니다:</Trans>

```js {8-10}
export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

Because the parent component updates its state inside the `onClick` event handler, that state update gets marked as a transition. This is why, like in the earlier example, you can click on "Posts" and then immediately click "Contact". Updating the selected tab is marked as a transition, so it does not block user interactions.
<Trans>부모 컴포넌트가 `onClick` 이벤트 핸들러 내에서 state를 업데이트하기 때문에 해당 state 업데이트는 트랜지션으로 표시됩니다. 그렇기 때문에 앞의 예시처럼 'Posts'을 클릭한 다음 바로 'Contact'를 클릭할 수 있습니다. 선택한 탭을 업데이트하는 것은 트랜지션으로 표시되므로 사용자 상호작용을 차단하지 않습니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

---

### Displaying a pending visual state during the transition<Trans>트랜지션 중에 '보류중' state 표시하기</Trans> {/*displaying-a-pending-visual-state-during-the-transition*/}

You can use the `isPending` boolean value returned by `useTransition` to indicate to the user that a transition is in progress. For example, the tab button can have a special "pending" visual state:
<Trans>`useTransition`이 반환하는 `isPending` boolean 값을 사용하여 트랜지션이 진행 중임을 사용자에게 표시할 수 있습니다. 예를 들어 탭 버튼은 특별한 'pending' state를 가질 수 있습니다:</Trans>

```js {4-6}
function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

Notice how clicking "Posts" now feels more responsive because the tab button itself updates right away:
<Trans>이제 탭 버튼 자체가 바로 업데이트되므로 'Posts'를 클릭하는 반응이 더 빨라진 것을 확인할 수 있습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

---

### Preventing unwanted loading indicators<Trans>원치 않는 로딩 표시 방지하기</Trans> {/*preventing-unwanted-loading-indicators*/}

In this example, the `PostsTab` component fetches some data using a [Suspense-enabled](/reference/react/Suspense) data source. When you click the "Posts" tab, the `PostsTab` component *suspends*, causing the closest loading fallback to appear:
<Trans>이 예제에서 `PostsTab` 컴포넌트는 [Suspense-enabled](/reference/react/Suspense) 데이터 소스를 사용하여 일부 데이터를 가져옵니다. "Posts" 탭을 클릭하면 `PostsTab` 컴포넌트가 *중단*되어 가장 가까운 로딩 fallback이 나타납니다:</Trans>

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js TabButton.js
export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

Hiding the entire tab container to show a loading indicator leads to a jarring user experience. If you add `useTransition` to `TabButton`, you can instead indicate display the pending state in the tab button instead.
<Trans>로딩 표시를 위해 전체 탭 컨테이너를 숨기면 UX가 어색해집니다. `TabButton`에 `useTransition`을 추가하면 대신 탭 버튼에 '보류중' state를 표시할 수 있습니다.</Trans>

Notice that clicking "Posts" no longer replaces the entire tab container with a spinner:
<Trans>'Posts'를 클릭하면 더 이상 전체 탭 컨테이너가 스피너로 바뀌지 않습니다:</Trans>

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

[Read more about using transitions with Suspense.](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)
<Trans>[Suspense와 함께 트랜지션을 사용하는 방법에 대해 자세히 알아보세요.](/reference/react/Suspense#prevent-already-revealed-content-from-hiding)</Trans>

<Note>

Transitions will only "wait" long enough to avoid hiding *already revealed* content (like the tab container). If the Posts tab had a [nested `<Suspense>` boundary,](/reference/react/Suspense#revealing-nested-content-as-it-loads) the transition would not "wait" for it.
<Trans>트랜지션은 탭 컨테이너와 같이 *이미 노출된* 콘텐츠를 숨기지 않을 수 있을 만큼만 "대기"합니다. Posts 탭에 [중첩된 `<Suspense>` 바운더리](/reference/react/Suspense#revealing-nested-content-as-it-loads)가 있는 경우 트랜지션은 이를 "대기"하지 않습니다.</Trans>

</Note>

---

### Building a Suspense-enabled router<Trans>Suspense-enabled 라우터 구축하기</Trans> {/*building-a-suspense-enabled-router*/}

If you're building a React framework or a router, we recommend marking page navigations as transitions.
<Trans>React 프레임워크나 라우터를 구축하는 경우 페이지 네비게이션을 트랜지션으로 표시하는 것이 좋습니다.</Trans>

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

This is recommended for two reasons:
<Trans>두 가지 이유로 이 방법을 권장합니다:</Trans>

- [Transitions are interruptible,](#marking-a-state-update-as-a-non-blocking-transition) which lets the user click away without waiting for the re-render to complete.
- [Transitions prevent unwanted loading indicators,](#preventing-unwanted-loading-indicators) which lets the user avoid jarring jumps on navigation.

<TransBlock>
- [트랜지션은 중단 가능](#marking-a-state-update-as-a-non-blocking-transition)하므로, 사용자는 다시 렌더링이 완료될 때까지 기다리지 않고 바로 클릭할 수 있습니다.
- [트랜지션은 원치 않는 로딩 표시를 방지](#preventing-unwanted-loading-indicators)하여, 사용자가 네비게이션 시 갑작스럽게 이동 하는 것을 방지할 수 있습니다.
</TransBlock>

Here is a tiny simplified router example using transitions for navigations.
<Trans>다음은 네비게이션을 위해 트랜지션을 사용하는 아주 간단한 라우터 예제입니다.</Trans>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js Albums.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js Biography.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js Panel.js hidden
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

<Note>

[Suspense-enabled](/reference/react/Suspense) routers are expected to wrap the navigation updates into transitions by default.
<Trans>[Suspense-enabled](/reference/react/Suspense) 라우터는 기본적으로 네비게이션 업데이트를 트랜지션으로 감쌀 것으로 예상됩니다.</Trans>

</Note>

---

## Troubleshooting<Trans>문제 해결</Trans> {/*troubleshooting*/}

### Updating an input in a transition doesn't work<Trans>트랜지션에서 input 업데이트가 작동하지 않습니다</Trans> {/*updating-an-input-in-a-transition-doesnt-work*/}

You can't use a transition for a state variable that controls an input:
<Trans>input을 제어하는 state 변수에는 트랜지션을 사용할 수 없습니다:</Trans>

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ Can't use transitions for controlled input state
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

This is because transitions are non-blocking, but updating an input in response to the change event should happen synchronously. If you want to run a transition in response to typing, you have two options:
<Trans>이는 트랜지션은 논블로킹이지만 변경 이벤트에 대한 응답으로 input을 업데이트하는 것은 동기적으로 이루어져야 하기 때문입니다. 입력에 대한 응답으로 트랜지션을 실행하려면 두 가지 옵션이 있습니다:</Trans>

1. You can declare two separate state variables: one for the input state (which always updates synchronously), and one that you will update in a transition. This lets you control the input using the synchronous state, and pass the transition state variable (which will "lag behind" the input) to the rest of your rendering logic.
2. Alternatively, you can have one state variable, and add [`useDeferredValue`](/reference/react/useDeferredValue) which will "lag behind" the real value. It will trigger non-blocking re-renders to "catch up" with the new value automatically.

<TransBlock>
1. input의 (항상 동기적으로 업데이트되는) state와 트랜지션 실행시 업데이트할 state 변수를 각각 선언할 수 있습니다. 이를 통해 동기 state를 사용하여 input을 제어하고, (input보다 "지연"되는) 트랜지션 state 변수를 나머지 렌더링 로직에 전달할 수 있습니다.
2. 또는 하나의 state 변수를 가지고, 실제 값보다 "지연"되는 [`useDeferredValue`](/reference/react/useDeferredValue)를 추가할 수 있습니다. 그러면 새로운 값을 자동으로 "따라잡기" 위해 논블로킹 리렌더를 촉발합니다.
</TransBlock>

---

### React doesn't treat my state update as a transition<Trans>React가 state 업데이트를 트랜지션으로 처리하지 않습니다.</Trans> {/*react-doesnt-treat-my-state-update-as-a-transition*/}

When you wrap a state update in a transition, make sure that it happens *during* the `startTransition` call:
<Trans>state 업데이트를 트랜지션으로 감쌀 때는 `startTransition` 호출 중 state 업데이트가 발생해야 합니다:</Trans>

```js
startTransition(() => {
  // ✅ Setting state *during* startTransition call
  setPage('/about');
});
```

The function you pass to `startTransition` must be synchronous.
<Trans>`startTransition`에 전달하는 함수는 동기식이어야 합니다.</Trans>

You can't mark an update as a transition like this:
<Trans>이와 같은 업데이트는 트랜지션으로 표시할 수 없습니다:</Trans>

```js
startTransition(() => {
  // ❌ Setting state *after* startTransition call
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

Instead, you could do this:
<Trans>대신 이렇게 할 수 있습니다:</Trans>

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ Setting state *during* startTransition call
    setPage('/about');
  });
}, 1000);
```

Similarly, you can't mark an update as a transition like this:
<Trans>마찬가지로 업데이트를 이와 같은 트랜지션으로 표시할 수 없습니다:</Trans>

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ Setting state *after* startTransition call
  setPage('/about');
});
```

However, this works instead:
<Trans>대신 이 방법은 작동합니다:</Trans>

```js
await someAsyncFunction();
startTransition(() => {
  // ✅ Setting state *during* startTransition call
  setPage('/about');
});
```

---

### I want to call `useTransition` from outside a component<Trans>컴포넌트 외부에서 `useTransition`을 호출하고 싶습니다</Trans> {/*i-want-to-call-usetransition-from-outside-a-component*/}

You can't call `useTransition` outside a component because it's a Hook. In this case, use the standalone [`startTransition`](/reference/react/startTransition) method instead. It works the same way, but it doesn't provide the `isPending` indicator.
<Trans>훅이기 때문에 컴포넌트 외부에서 `useTransition`을 호출할 수 없습니다. 이 경우 대신 독립형 [`startTransition`](/reference/react/startTransition) 메서드를 사용하세요. 동일한 방식으로 작동하지만 `isPending` 표시기를 제공하지 않습니다.</Trans>

---

### The function I pass to `startTransition` executes immediately<Trans>`startTransition`에 전달한 함수는 즉시 실행됩니다</Trans> {/*the-function-i-pass-to-starttransition-executes-immediately*/}

If you run this code, it will print 1, 2, 3:
<Trans>이 코드를 실행하면 1, 2, 3이 인쇄됩니다:</Trans>

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**It is expected to print 1, 2, 3.** The function you pass to `startTransition` does not get delayed. Unlike with the browser `setTimeout`, it does not run the callback later. React executes your function immediately, but any state updates scheduled *while it is running* are marked as transitions. You can imagine that it works like this:
<Trans>**1, 2, 3을 출력할 것으로 예상됩니다.** `startTransition`에 전달한 함수는 지연되지 않습니다. 브라우저의 `setTimeout`과 달리 나중에 콜백을 실행하지 않습니다. React는 함수를 즉시 실행하지만, 함수가 실행되는 동안 예약된 모든 state 업데이트는 트랜지션으로 표시됩니다. 이렇게 작동한다고 상상하면 됩니다:</Trans>

```js
// A simplified version of how React works

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... schedule a transition state update ...
  } else {
    // ... schedule an urgent state update ...
  }
}
```
