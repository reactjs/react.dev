---
title: lazy
translators: [박문하, 이승효]
---

<Intro>

`lazy` lets you defer loading component's code until it is rendered for the first time.
<Trans>`lazy` 를 사용하면 처음 렌더링될 때까지 컴포넌트 코드의 로딩을 지연시킬 수 있습니다.</Trans>

```js
const SomeComponent = lazy(load)
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `lazy(load)` {/*lazy*/}

Call `lazy` outside your components to declare a lazy-loaded React component:
<Trans>컴포넌트 외부에서 `lazy`를 호출하여 지연 로드된 React 컴포넌트를 선언합니다:</Trans>

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

* `load`: A function that returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or another *thenable* (a Promise-like object with a `then` method). React will not call `load` until the first time you attempt to render the returned component. After React first calls `load`, it will wait for it to resolve, and then render the resolved value as a React component. Both the returned Promise and the Promise's resolved value will be cached, so React will not call `load` more than once. If the Promise rejects, React will `throw` the rejection reason for the nearest Error Boundary to handle.
<Trans>`load`: [Promise](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise) 또는 다른 *thenable(*`then` 메서드를 가진 Promise와 유사한 객체)을 반환하는 함수. React는 반환된 컴포넌트를 처음 렌더링하려고 시도할 때까지 `load`를 호출하지 않습니다. React가 `load`를 처음 호출한 후에는 resolve될 때까지 기다린 다음 resolve된 값을 React 컴포넌트로 렌더링합니다. 반환된 Promise 및 Promise의 resolve된 값은 모두 캐시되므로, React는 `load`를 두 번 이상 호출하지 않습니다. Promise가 reject되면 React는 가장 가까운 Error Boundary에 reject된 이유를 `throw` 합니다.</Trans>

#### Returns<Trans>반환값</Trans> {/*returns*/}

`lazy` returns a React component you can render in your tree. While the code for the lazy component is still loading, attempting to render it will *suspend.* Use [`<Suspense>`](/reference/react/Suspense) to display a loading indicator while it's loading.
<Trans>`lazy` 는 트리에 렌더링할 수 있는 React 컴포넌트를 반환합니다. 지연 컴포넌트의 코드가 로딩되는 동안 렌더링을 시도하면 *일시 중단*됩니다. 로딩하는 동안 로딩 표시기를 보여주려면 [`<Suspense>`](/reference/react/Suspense) 를 사용하세요.</Trans>

---

### `load` function<Trans>`load` 함수</Trans> {/*load*/}

#### Parameters<Trans>매개변수</Trans> {/*load-parameters*/}

`load` receives no parameters.
<Trans>`load` 는 매개변수를 받지 않습니다.</Trans>

#### Returns<Trans>반환값</Trans> {/*load-returns*/}

You need to return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or some other *thenable* (a Promise-like object with a `then` method). It needs to eventually resolve to a valid React component type, such as a function, [`memo`](/reference/react/memo), or a [`forwardRef`](/reference/react/forwardRef) component.
<Trans>[Promise](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise) 또는 다른 *thenable*(`then` 메서드를 가진 Promise와 유사한 객체)을 반환해야 합니다. 그 결과 최종적으로 함수, [`memo`](/reference/react/memo) 또는 [`forwardRef`](/reference/react/forwardRef) 컴포넌트와 같은 유효한 React 컴포넌트 유형으로 해석되어야 합니다.</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Lazy-loading components with Suspense<Trans>Suspense가 있는 지연 로딩 컴포넌트</Trans> {/*suspense-for-code-splitting*/}

Usually, you import components with the static [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) declaration:
<Trans>일반적으로는 정적 [`import`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/import) 선언을 사용하여 컴포넌트를 import 합니다:</Trans>

```js
import MarkdownPreview from './MarkdownPreview.js';
```

To defer loading this component's code until it's rendered for the first time, replace this import with:
<Trans>이 컴포넌트가 처음 렌더링될 때까지 로딩을 지연시키려면 import를 다음과 같이 대체하세요:</Trans>

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

This code relies on [dynamic `import()`,](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) which might require support from your bundler or framework.
<Trans>이 코드는 번들러나 프레임워크의 지원이 필요할 수 있는 [dynamic `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 에 의존합니다.</Trans>

Now that your component's code loads on demand, you also need to specify what should be displayed while it is loading. You can do this by wrapping the lazy component or any of its parents into a [`<Suspense>`](/reference/react/Suspense) boundary:
<Trans>이제 컴포넌트의 코드가 필요에 의해서만 로드되므로, 로드되는 동안 표시할 내용도 지정해야 합니다. 지연 컴포넌트나 그 부모 컴포넌트를 [`<Suspense>`](/reference/react/Suspense) 로 감싸면 됩니다.</Trans>

```js {1,4}
<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
 </Suspense>
```

In this example, the code for `MarkdownPreview` won't be loaded until you attempt to render it. If `MarkdownPreview` hasn't loaded yet, `Loading` will be shown in its place. Try ticking the checkbox:
<Trans>다음 예제에서는 렌더링을 시도할 때까지 `MarkdownPreview` 에 대한 코드가 로드되지 않습니다. `MarkdownPreview` 가 아직 로드되지 않은 경우 `Loading` 이 대신 표시됩니다. 체크박스를 선택해 보세요.</Trans>

<Sandpack>

```js App.js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Hello, **world**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Show preview
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Preview</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// Add a fixed delay so you can see the loading state
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

```js Loading.js
export default function Loading() {
  return <p><i>Loading...</i></p>;
}
```

```js MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label {
  display: block;
}

input, textarea {
  margin-bottom: 10px;
}

body {
  min-height: 200px;
}
```

</Sandpack>

This demo loads with an artificial delay. The next time you untick and tick the checkbox, `Preview` will be cached, so there will be no loading state. To see the loading state again, click "Reset" on the sandbox.
<Trans>이 데모는 인위적인 지연으로 로드됩니다. 다음에 체크박스를 선택 해제하고 다시 선택하면 `Preview` 가 캐시되므로 로딩 상태가 표시되지 않습니다. 로딩 상태를 다시 보려면 샌드박스에서 “재설정”을 클릭하세요.</Trans>

[Learn more about managing loading states with Suspense.](/reference/react/Suspense)
<Trans>[Suspense로 로딩 상태를 관리하는 방법에 대해 자세히 알아보세요.](/reference/react/Suspense)</Trans>

---

## Troubleshooting<Trans>문제 해결</Trans> {/*troubleshooting*/}

### My `lazy` component's state gets reset unexpectedly<Trans>`lazy` 컴포넌트의 상태가 예기치 않게 초기화 됩니다</Trans> {/*my-lazy-components-state-gets-reset-unexpectedly*/}

Do not declare `lazy` components *inside* other components:
<Trans>다른 컴포넌트 *안에서* `lazy` 컴포넌트를 선언하지 마세요.</Trans>

```js {4-6}
import { lazy } from 'react';

function Editor() {
  // 🔴 Bad: This will cause all state to be reset on re-renders
  // 🔴 나쁨: 이렇게 하면 리렌더링시마다 모든 state가 초기화됩니다
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

Instead, always declare them at the top level of your module:
<Trans>대신 항상 모듈의 최상위 레벨에서 선언하세요.</Trans>

```js {3-5}
import { lazy } from 'react';

// ✅ Good: Declare lazy components outside of your components
// ✅ 좋음: lazy 컴포넌트를 컴포넌트들의 밖에서 선언하세요
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```
