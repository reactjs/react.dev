---
title: <StrictMode>
translators: [유한나라, 이승효]
---


<Intro>

`<StrictMode>` lets you find common bugs in your components early during development.
<Trans>`<StrictMode>` 를 사용하면 개발 중에 컴포넌트에서 흔히 발생하는 버그를 조기에 발결할 수 있습니다.</Trans>


```js
<StrictMode>
  <App />
</StrictMode>
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `<StrictMode>` {/*strictmode*/}

Use `StrictMode` to enable additional development behaviors and warnings for the component tree inside:
<Trans>`StrictMode` 를 사용하면 내부의 전체 컴포넌트 트리에 대한 추가 개발 동작 및 경고를 활성화할 수 있습니다.</Trans>

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

Strict Mode enables the following development-only behaviors:

- Your components will [re-render an extra time](#fixing-bugs-found-by-double-rendering-in-development) to find bugs caused by impure rendering.
- Your components will [re-run Effects an extra time](#fixing-bugs-found-by-re-running-effects-in-development) to find bugs caused by missing Effect cleanup.
- Your components will [be checked for usage of deprecated APIs.](#fixing-deprecation-warnings-enabled-by-strict-mode)
<TransBlock>
Strict Mode 는 다음과 같은 개발 전용 동작을 활성화합니다:

- 컴포넌트는 불완전한 렌더링으로 인한 버그를 찾기 위해 [추가 시간을 들여 다시 렌더링합니다.](#fixing-bugs-found-by-double-rendering-in-development)
- 컴포넌트는 Effect 클린업이 누락되어 발생한 버그를 찾기위해 [한 번 더 Effect를 재실행합니다.](#fixing-bugs-found-by-re-running-effects-in-development)
- 컴포넌트에서 더 이상 [사용되지 않는 API의 사용 여부를 확인합니다.](#fixing-deprecation-warnings-enabled-by-strict-mode)
</TransBlock>

#### Props {/*props*/}

`StrictMode` accepts no props.
<Trans>`StrictMode` 는 props를 허용하지 않습니다.</Trans>

#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

* There is no way to opt out of Strict Mode inside a tree wrapped in `<StrictMode>`. This gives you confidence that all components inside `<StrictMode>` are checked. If two teams working on a product disagree whether they find the checks valuable, they need to either reach consensus or move `<StrictMode>` down in the tree.
<Trans>
* `<StrictMode>` 로 래핑된 트리 내부에서 Strict 모드를 해제할 수 있는 방법은 없습니다. 이렇게 하면 `<StrictMode>` 내의 모든 컴포넌트가 검사된다는 확신을 가질 수 있습니다. 제품을 작업하는 두 팀이 검사가 가치가 있다고 생각하는지에 대해 의견이 다를 경우, 합의에 도달하거나 `<StrictMode>` 를 트리에서 아래로 이동해야 합니다.
</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Enabling Strict Mode for entire app<Trans>전체 앱에 대한 Strict Mode 사용하기</Trans> {/*enabling-strict-mode-for-entire-app*/}

Strict Mode enables extra development-only checks for the entire component tree inside the `<StrictMode>` component. These checks help you find common bugs in your components early in the development process.
<Trans>Strict Mode를 사용하면 `<StrictMode>` 컴포넌트 내부의 전체 컴포넌트 트리에 대해 개발 전용 검사를 추가로 수행할 수 있습니다. 이런 검사를 통해 개발 프로세스 초기에 컴포넌트의 일반적인 버그를 발견할 수 있습니다.</Trans>


To enable Strict Mode for your entire app, wrap your root component with `<StrictMode>` when you render it:
<Trans>전체 앱에 Strict Mode를 사용하려면 렌더링할 때 루트 컴포넌트를 `<StrictMode>` 로 래핑하세요:</Trans>

```js {6,8}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

We recommend wrapping your entire app in Strict Mode, especially for newly created apps. If you use a framework that calls [`createRoot`](/reference/react-dom/client/createRoot) for you, check its documentation for how to enable Strict Mode.
<Trans>특히 새로 만든 앱의 경우 전체 앱을 Strict Mode로 래핑하는 것이 좋습니다. [`createRoot`](/reference/react/createRoot)를 대신호출하는 프레임워크를 사용하는 경우 해당 프레임워크의 설명서를 참조하여 Strict Mode를 활성화 하는 방법을 확인해보세요.</Trans>

Although the Strict Mode checks **only run in development,** they help you find bugs that already exist in your code but can be tricky to reliably reproduce in production. Strict Mode lets you fix bugs before your users report them.
<Trans>Strict Mode는 **개발단계에서만** 실행되고, 이미 코드에 존재하지만 프로덕션 환경에서 안정적으로 재현하기 까다로운 버그를 찾는 데 도움됩니다. Strict Mode를 사용하면 사용자가 버그를 신고하기 전에 수정할 수 있습니다.</Trans>

<Note>

Strict Mode enables the following checks in development:

- Your components will [re-render an extra time](#fixing-bugs-found-by-double-rendering-in-development) to find bugs caused by impure rendering.
- Your components will [re-run Effects an extra time](#fixing-bugs-found-by-re-running-effects-in-development) to find bugs caused by missing Effect cleanup.
- Your components will [be checked for usage of deprecated APIs.](#fixing-deprecation-warnings-enabled-by-strict-mode)
<TransBlock>
Strict Mode에서 개발 시 다음과 같은 점검이 가능합니다.
- 컴포넌트는 불완전한 렌더링으로 인한 버그를 찾기 위해 추가 시간을 들여 [한번 더 렌더링합니다.](#fixing-bugs-found-by-double-rendering-in-development) 
- 컴포넌트는 Effect 클린업이 누락되어 발생한 버그를 찾기위해 [한번 더 Effect를 실행합니다.](#fixing-bugs-found-by-re-running-effects-in-development)
- 컴포넌트에서 [더 이상 사용되지 않는 API의 사용 여부를 확인합니다.](#fixing-deprecation-warnings-enabled-by-strict-mode)
</TransBlock>

**All of these checks are development-only and do not impact the production build.**
<Trans>**이러한 모든 검사는 개발 단계 전용이며 프로덕션 빌드에는 영향을 미치지 않습니다.**</Trans>

</Note>

---

### Enabling strict mode for a part of the app<Trans>앱의 일부에 Strict Mode 사용 설정하기</Trans> {/*enabling-strict-mode-for-a-part-of-the-app*/}

You can also enable Strict Mode for any part of your application:
<Trans>애플리케이션의 모든 부분에 대해 Strict Mode를 활성화 할 수 있습니다:</Trans>

```js {7,12}
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

In this example, Strict Mode checks will not run against the `Header` and `Footer` components. However, they will run on `Sidebar` and `Content`, as well as all of the components inside them, no matter how deep.
<Trans>이 예제에서는 Strict Mode 검사가 `Header` 및 `Footer` 구성요소에 대해 실행되지 않습니다. 하지만 `Sidebar` 와 `Content`와 같은 안에 있는 모든 컴포넌트는 아무리 깊어도 실행됩니다.</Trans>

---

### Fixing bugs found by double rendering in development<Trans>개발 중 이중 렌더링으로 발견된 버그 수정하기</Trans> {/*fixing-bugs-found-by-double-rendering-in-development*/}

[React assumes that every component you write is a pure function.](/learn/keeping-components-pure) This means that React components you write must always return the same JSX given the same inputs (props, state, and context).
<Trans>[React는 작성하는 모든 컴포넌트가 순수한 함수라고 가정합니다.](/learn/keeping-components-pure) 즉, 작성하는 React 컴포넌트는 동일한 입력(props, state, context)가 주어졌을 때 항상 동일한 JSX를 반환해야 합니다.</Trans>

Components breaking this rule behave unpredictably and cause bugs. To help you find accidentally impure code, Strict Mode calls some of your functions (only the ones that should be pure) **twice in development.** This includes:
<Trans>이 규칙을 위반하는 컴포넌트는 예측할 수 없는 동작을 하고 버그를 유발합니다. Strict Mode는 실수로 불순한 코드를 찾을 수 있도록 개발 과정에서 일부 함수(순수 함수만)을 **두 번** 호출합니다:</Trans>

- Your component function body (only top-level logic, so this doesn't include code inside event handlers)
- Functions that you pass to [`useState`](/reference/react/useState), [`set` functions](/reference/react/useState#setstate), [`useMemo`](/reference/react/useMemo), or [`useReducer`](/reference/react/useReducer)
- Some class component methods like [`constructor`](/reference/react/Component#constructor), [`render`](/reference/react/Component#render), [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) ([see the whole list](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects))
<TransBlock>
- 컴포넌트 함수 본문(최상위의 로직만 있으므로 이벤트 핸들러 내부의 코드는 포함되지 않습니다.)
- [`useState`](/reference/react/useState), [`set` 함수](/reference/react/useState#setstate), [`useMemo`](/reference/react/useMemo), [`useReducer`](/reference/react/useReducer)에 전달한 함수
- [`constructor`](/reference/react/Component#constructor), [`render`](/reference/react/Component#render), [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate)와 같은 일부 클래스 컴포넌트 메서드 ([전체 목록 보기](https://ko.reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects))
</TransBlock>

If a function is pure, running it twice does not change its behavior because a pure function produces the same result every time. However, if a function is impure (for example, it mutates the data it receives), running it twice tends to be noticeable (that's what makes it impure!) This helps you spot and fix the bug early.
<Trans>순수 함수는 매번 동일한 결과를 생성하므로 함수를 두 번 실행해도 동작이 변경되지 않습니다. 그러나 함수가 순수하지 않는 경우 (예를 들어 수신하는 데이터를 변조하는 경우) 순수하지 않은 코드를 두 번 실행하면 눈에 띄는 경향이 있습니다 (그래서 순수하지 않는 것 입니다!) 이렇게 하면 버그를 조기에 발견하고 수정하는데 도움이 됩니다.</Trans>

**Here is an example to illustrate how double rendering in Strict Mode helps you find bugs early.**
<Trans>**다음은 Strict Mode에서 이중 렌더링이 버그를 조기에 발견하는 데 어떻게 도움이 되는지 설명하는 예시입니다.**</Trans>

This `StoryTray` component takes an array of `stories` and adds one last "Create Story" item at the end:
<Trans>`StoryTray` 컴포넌트는 `stories` 배열을 가져와 마지막에 "Create Story" 항목을 하나 더 추가합니다.</Trans>

<Sandpack>

```js index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

There is a mistake in the code above. However, it is easy to miss because the initial output appears correct.
<Trans>위의 코드에는 실수가 있습니다. 그러나 초기 출력은 올바르게 나타나기 때문에 놓치기 쉽습니다.</Trans>

This mistake will become more noticeable if the `StoryTray` component re-renders multiple times. For example, let's make the `StoryTray` re-render with a different background color whenever you hover over it: 
<Trans>`StoryTray` 컴포넌트가 여러 번 다시 렌더링하는 경우 이 실수는 더욱 두드러집니다. 예를 들어 `StoryTray` 에 포인터를 가져다 놓을 때마다 다른 배경색으로 다시 렌더링되도록 해보겠습니다:</Trans>

<Sandpack>

```js index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Notice how every time you hover over the `StoryTray` component, "Create Story" gets added to the list again. The intention of the code was to add it once at the end. But `StoryTray` directly modifies the `stories` array from the props. Every time `StoryTray` renders, it adds "Create Story" again at the end of the same array. In other words, `StoryTray` is not a pure function--running it multiple times produces different results.
<Trans>`StoryTray` 컴포넌트 위로 마우스를 가져갈 때마다 `Create Story`가 목록에 다시 추가되는 것을 확인할 수 있습니다. 코드의 의도는 마지막에 한 번 추가하는 것이었습니다. 하지만 `StoryTray` 는 `stories` 배열을 직접 수정합니다. `StoryTray` 는 렌더링할 때마다 동일한 배열의 끝에 `Create Story` 를 다시 추가합니다. 즉, `StoryTray` 는 여러 번 실행하면 다른 결과가 나오는 단순한 기능이 아닙니다.</Trans>

To fix this problem, you can make a copy of the array, and modify that copy instead of the original one:
<Trans>이 문제를 해결하려면 배열의 복사본을 만든 다음 원본 대신 해당 복사본을 수정하면 됩니다:</Trans>

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // Clone the array
  // ✅ Good: Pushing into a new array
  items.push({ id: 'create', label: 'Create Story' });
```

This would [make the `StoryTray` function pure.](/learn/keeping-components-pure) Each time it is called, it would only modify a new copy of the array, and would not affect any external objects or variables. This solves the bug, but you had to make the component re-render more often before it became obvious that something is wrong with its behavior.
<Trans>이렇게하면 [`StoryTray` 함수가 순수해집니다.](/learn/keeping-components-pure) 이 함수를 호출할 때마다 배열의 새 복사복만 수정하고 외부 객체나 변수에 영향을 미치지 않습니다. 이렇게 하면 버그가 해결되지만 컴포넌트의 동작에 문제가 있다는 것이 분명해지기 전에 컴포넌트를 더 자주 재 렌더링해야 한다는 점에 유의하세요.</Trans>

**In the original example, the bug wasn't obvious. Now let's wrap the original (buggy) code in `<StrictMode>`:**
<Trans>**원래 예제에서는 버그가 명확하지 않았습니다. 이제 원래의 (버그가 존재하는) 코드를 `<StrictMode>` 로 래핑해 보겠습니다.**</Trans>

<Sandpack>

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

**Strict Mode *always* calls your rendering function twice, so you can see the mistake right away** ("Create Story" appears twice). This lets you notice such mistakes early in the process. When you fix your component to render in Strict Mode, you *also* fix many possible future production bugs like the hover functionality from before:
<Trans>**Strict Mode는 *항상* 렌더링 함수를 두 번 호출 하므로 실수를 바로 확인할 수 있습니다.** (예제에서는 "Create Story"가 두 번 표시 됨) Strict Mode를 사용하면 이런 실수를 프로세스 초기단계에서 발견할 수 있습니다. 컴포넌트가 Strict Mode에서 렌더링되도록 수정하면 이전의 hover기능과 같이 향후 발생할 수 있는 많은 프로덕션 버그도 수정됩니다.</Trans>

<Sandpack>

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // Clone the array
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Without Strict Mode, it was easy to miss the bug until you added more re-renders. Strict Mode made the same bug appear right away. Strict Mode helps you find bugs before you push them to your team and to your users.
<Trans>Strict Mode가 없으면 리렌더링이 되기 전까지 버그를 놓치기 쉬웠습니다. Strict Mode를 사용하면 동일한 버그가 즉시 나타납니다. Strict Mode를 사용하면 버그를 팀과 사용자에게 push 전에 버그를 찾을 수 있습니다.</Trans>

[Read more about keeping components pure.](/learn/keeping-components-pure)
[컴포넌트를 순수하게 유지하는 방법에 대해서 자세히 알아보세요](/learn/keeping-components-pure)

<Note>

If you have [React DevTools](/learn/react-developer-tools) installed, any `console.log` calls during the second render call will appear slightly dimmed. React DevTools also offers a setting (off by default) to suppress them completely.
<Trans>[React DevTools](/learn/react-developer-tools)를 설치한 경우 두 번째 렌더링 호출중 `console.log` 호출이 불분명하게 표시됩니다. React DevTools는 이를 완전히 억제하는 설정도 제공합니다. (기본적으로 꺼져있습니다.)</Trans>

</Note>

---

### Fixing bugs found by re-running Effects in development<Trans>개발 단계에서 Effect를 재실행하여 발견된 버그 수정하기</Trans> {/*fixing-bugs-found-by-re-running-effects-in-development*/}

Strict Mode can also help find bugs in [Effects.](/learn/synchronizing-with-effects)
<Trans>Strict Mode는 [Effect](/learn/synchronizing-with-effects)의 버그를 찾는 데 도움이 될 수 있습니다.</Trans>

Every Effect has some setup code and may have some cleanup code. Normally, React calls setup when the component *mounts* (is added to the screen) and calls cleanup when the component *unmounts* (is removed from the screen). React then calls cleanup and setup again if its dependencies changed since the last render.
<Trans>모든 Effect에는 몇 가지 setup 코드가 있으며 cleanup 코드가 있을 수 있습니다. 일반적으로 React는 컴포넌트가 *마운트*될 때 (화면에 추가될 때) setup을 호출하고 컴포넌트가 *마운트 해제*될 때 (화면에서 제거될 때) cleanup을 호출합니다.</Trans>

When Strict Mode is on, React will also run **one extra setup+cleanup cycle in development for every Effect.** This may feel surprising, but it helps reveal subtle bugs that are hard to catch manually.
<Trans>Strict Mode가 켜져있으면 React는 모든 Effect에 대해 개발 과정에서 **setup + cleanup사이클을 한 번 더 실행합니다.** 이것은 의외로 느껴질 수도 있지만, 수동으로 잡기 어려운 미묘한 버그를 발견하는 데 도움이 됩니다.</Trans>

**Here is an example to illustrate how re-running Effects in Strict Mode helps you find bugs early.**
<Trans>**다음은 Strict Mode에서 Effect를 다시 실행하면 버그를 조기에 발견하는 데 어떤 도움이 되는지 보여주는 예시입니다.**</Trans>

Consider this example that connects a component to a chat:
<Trans>컴포넌트를 채팅에 연결하는 예시를 살펴보겠습니다:</Trans>

<Sandpack>

```js index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

There is an issue with this code, but it might not be immediately clear.
<Trans>이 코드에 문제가 있지만 지금 당장 명확하지 않을 수 있습니다.</Trans>

To make the issue more obvious, let's implement a feature. In the example below, `roomId` is not hardcoded. Instead, the user can select the `roomId` that they want to connect to from a dropdown. Click "Open chat" and then select different chat rooms one by one. Keep track of the number of active connections in the console:
<Trans>문제를 더 명확히 하기 위해 기능을 구현해 보겠습니다. 아래 예제에서는 `roomId` 가 하드코딩되어 있지 않습니다. 대신 사용자는 드롭다운에서 연결하려는 `roomId` 를 선택할 수 있습니다. "Open chat"을 클릭한 다음 다른 대화방을 하나씩 선택합니다. console에서 활성화 된 연결 수를 추적합니다:</Trans>

<Sandpack>

```js index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

You'll notice that the number of open connections always keeps growing. In a real app, this would cause performance and network problems. The issue is that [your Effect is missing a cleanup function:](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)
<Trans>열려 있는 연결 수가 항상 계속 증가하는 것을 알 수 있습니다. 실제 앱에서는 성능 및 네트워크 문제가 발생할 수 있습니다. [원인은 Effect에 클린업 함수가 없다는 것입니다:](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)</Trans>

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

Now that your Effect "cleans up" after itself and destroys the outdated connections, the leak is solved. However, notice that the problem did not become visible until you've added more features (the select box).
<Trans>이제 Effect가 자체적으로 "cleans up"되어 오래된 연결을 해제하므로 누수가 해결되었습니다. 그러나 더 많은 기능(선택 상자)를 추가할 때 까지 문제가 즉시 표시되지 않는다는 점에 유의하세요.</Trans>

**In the original example, the bug wasn't obvious. Now let's wrap the original (buggy) code in `<StrictMode>`:**
<Trans>**원래 예제에서는 버그가 분명하지 않았습니다. 이제 원래의 (버그가 있는)코드를 `<StrictMode>` 로 래핑해 보겠습니다.**</Trans>

<Sandpack>

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

**With Strict Mode, you immediately see that there is a problem** (the number of active connections jumps to 2). Strict Mode runs an extra setup+cleanup cycle for every Effect. This Effect has no cleanup logic, so it creates an extra connection but doesn't destroy it. This is a hint that you're missing a cleanup function.
<Trans>**Strict Mode를 사용하면 문제가 있음을 즉시 알 수 있습니다.**(활성 연결 수가 2로 점프합니다). 이는 Strict Mode가 모든 Effect에 대해 setup + cleanup 사이클을 실행하기 때문입니다. 이 Effect에는 cleanup 로직이 없으므로 추가 연결을 생성하지만 해제하지는 않습니다. 이것은 cleanup 함수가 누락되었다는 힌트입니다.</Trans>

Strict Mode lets you notice such mistakes early in the process. When you fix your Effect by adding a cleanup function in Strict Mode, you *also* fix many possible future production bugs like the select box from before:
<Trans>Strict Mode를 사용하면 이런 실수를 프로세스 초기에 발견할 수 있습니다. Strict Mode에서 cleanup 함수를 추가하여 Effect를 수정하면 이전의 선택 상자와 같이 향후 발생할 수 있는 많은 프로덕션 버그도 *함께* 수정할 수 있습니다:</Trans>

<Sandpack>

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Notice how the active connection count in the console doesn't keep growing anymore.
<Trans>console의 활성 연결 수가 더 이상 증가하지 않는 것을 확인할 수 있습니다.</Trans>

Without Strict Mode, it was easy to miss that your Effect needed cleanup. By running *setup → cleanup → setup* instead of *setup* for your Effect in development, Strict Mode made the missing cleanup logic more noticeable.
<Trans>Strict Mode가 없으면, Effect에 클린업이 필요한 사실을 놓치기 쉬웠습니다. Strict Mode는 개발 단계에서 Effect에 대해 *setup* 대신 *setup → cleanup → setup* 실행함으로써 누락된 클린업 로직을 더 눈에 띄게 만들었습니다.</Trans>

[Read more about implementing Effect cleanup.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)
<Trans>[Effect cleanup을 구현하는 방법에 대해 자세히 알아보세요.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)</Trans>

---

### Fixing deprecation warnings enabled by Strict Mode<Trans>Strict Mode에서 활성화된 사용 중단 경고 수정하기</Trans> {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}

React warns if some component anywhere inside a `<StrictMode>` tree uses one of these deprecated APIs:

* [`findDOMNode`](/reference/react-dom/findDOMNode). [See alternatives.](https://reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)
* `UNSAFE_` class lifecycle methods like [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount). [See alternatives.](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles) 
* Legacy context ([`childContextTypes`](/reference/react/Component#static-childcontexttypes), [`contextTypes`](/reference/react/Component#static-contexttypes), and [`getChildContext`](/reference/react/Component#getchildcontext)). [See alternatives.](/reference/react/createContext)
* Legacy string refs ([`this.refs`](/reference/react/Component#refs)). [See alternatives.](https://reactjs.org/docs/strict-mode.html#warning-about-legacy-string-ref-api-usage)
<TransBlock>
React는 `<StrictMode>` 트리 내의 컴포넌트가 더 이상 사용되지 않는 API중 하나를 사용하는 경우 경고를 표시합니다:

- [`findDOMNode`](/reference/react-dom/findDOMNode) [의 대안을 살펴보세요.](https://reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)
- [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount)와 같은 `UNSAFE_` 클래스 라이프사이클 메서드. [대안을 살펴보세요.](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles) 
- Legacy context ([`childContextTypes`](/reference/react/Component#static-childcontexttypes), [`contextTypes`](/reference/react/Component#static-contexttypes), [`getChildContext`](/reference/react/Component#getchildcontext)) [대안을 살펴보세요.](/reference/react/createContext)
- Legacy 문자열 refs([this.refs](/reference/react/Component#refs)) [대안을 참조하세요.](https://ko.reactjs.org/docs/strict-mode.html#warning-about-legacy-string-ref-api-usage)
</TransBlock>

These APIs are primarily used in older [class components](/reference/react/Component) so they rarely appear in modern apps.
<Trans>이러한 API는 주로 오래된 [클래스 컴포넌트](/reference/react/Component)에서 사용되므로 최신 앱에는 거의 나타나지 않습니다.</Trans>
