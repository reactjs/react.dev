---
title: useId
translators: [전시윤, 고석영]
---

<Intro>

`useId` is a React Hook for generating unique IDs that can be passed to accessibility attributes.
<Trans>`useId`는 접근성 속성에 전달할 수 있는 고유 ID를 생성하기 위한 React 훅입니다.</Trans>

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `useId()` {/*useid*/}

Call `useId` at the top level of your component to generate a unique ID:
<Trans>`useId`는 컴포넌트의 최상위 수준에서 호출하여 고유한 ID를 생성합니다.</Trans>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

`useId` does not take any parameters.
<Trans>`useId`는 매개변수를 사용하지 않습니다.</Trans>

#### Returns<Trans>반환값</Trans> {/*returns*/}

`useId` returns a unique ID string associated with this particular `useId` call in this particular component.
<Trans>`useId`는 특정 컴포넌트 내 특정 `useId` 와 관련된 고유 ID 문자열를 반환합니다.</Trans>

#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

* `useId` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a new component and move the state into it.
<Trans>`useId`는 훅이므로 **컴포넌트 최상단** 또는 훅에서만 호출할 수 있습니다. 반복문이나 조건문 내에서 호출할 수 없습니다. 필요한 경우, 새로운 컴포넌트를 추출하고 컴포넌트 state로 이동하세요.</Trans>


* `useId` **should not be used to generate keys** in a list. [Keys should be generated from your data.](/learn/rendering-lists#where-to-get-your-key)
<Trans>`useId`를 목록에서 **키를 생성하기 위해 사용하지 마세요.** [키는 데이터에서 생성되어야 합니다.](/learn/rendering-lists#where-to-get-your-key)</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

<Pitfall>

**Do not call `useId` to generate keys in a list.** [Keys should be generated from your data.](/learn/rendering-lists#where-to-get-your-key)
<Trans>**`useId`를 목록에서 키를 생성하기 위해 호출하지 마세요.** [키는 데이터에서 생성되어야 합니다.](/learn/rendering-lists#where-to-get-your-key)</Trans>

</Pitfall>

### Generating unique IDs for accessibility attributes <Trans>접근성 속성에 대한 고유 ID 생성</Trans> {/*generating-unique-ids-for-accessibility-attributes*/}

Call `useId` at the top level of your component to generate a unique ID:
<Trans>컴포넌트 최상단에서 `useId`를 호출하여 고유 ID값을 생성합니다.</Trans>

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

You can then pass the <CodeStep step={1}>generated ID</CodeStep> to different attributes:
<Trans><CodeStep step={1}>생성된 ID</CodeStep>를 다른 속성에 전달할 수 있습니다:</Trans>

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**Let's walk through an example to see when this is useful.**
<Trans>**유용한 경우를 알아보기 위해 예제를 살펴보겠습니다.**</Trans>

[HTML accessibility attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) like [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) let you specify that two tags are related to each other. For example, you can specify that an element (like an input) is described by another element (like a paragraph).
<Trans>[`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby)와 같은 [HTML 접근성 속성](https://developer.mozilla.org/ko/docs/Web/Accessibility/ARIA) 은 두 태그가 서로 연관되어 있음을 알 수 있습니다. 예를 들어, input과 같은 요소를 문단과 같은 요소에 의해 설명되도록 지정할 수 있습니다.</Trans>

In regular HTML, you would write it like this:
<Trans>일반 HTML에서는 다음과 같이 작성합니다.</Trans>

```html {5,8}
<label>
  Password:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  The password should contain at least 18 characters
</p>
```

However, hardcoding IDs like this is not a good practice in React. A component may be rendered more than once on the page--but IDs have to be unique! Instead of hardcoding an ID, generate a unique ID with `useId`:
<Trans>그러나, ID를 하드 코딩하는 것은 React에서 좋은 방법은 아닙니다. 컴포넌트는 페이지에서 두 번 이상 렌더링될 수 있지만 ID는 고유해야합니다! ID를 하드 코딩하는 대신, `useId`를 생성합니다.</Trans>

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}
```

Now, even if `PasswordField` appears multiple times on the screen, the generated IDs won't clash.
<Trans>이제, `PasswordField`가 화면에 여러번 나타나도, 생성된 ID가 충돌되지 않습니다.</Trans>

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
      <h2>Confirm password</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

[Watch this video](https://www.youtube.com/watch?v=0dNzNcuEuOo) to see the difference in the user experience with assistive technologies.
<Trans>[이 비디오를 시청하여](https://www.youtube.com/watch?v=0dNzNcuEuOo) 보조과학기술을 통한 사용자 경험의 차이를 확인하십시오.</Trans>

<Pitfall>

With [server rendering](/reference/react-dom/server), **`useId` requires an identical component tree on the server and the client**. If the trees you render on the server and the client don't match exactly, the generated IDs won't match.
<Trans>[서버 렌더링](/reference/react-dom/server)을 사용하면, **`useId`와 클라이언트에서 동일한 컴포넌트 트리가 필요합니다.** 서버와 클라이언트에서 렌더링한 트리가 정확히 일치하지 않으면 생성된 ID가 일치하지 않습니다.</Trans>

</Pitfall>

<DeepDive>

#### Why is useId better than an incrementing counter? <Trans>중복 카운터보다 useId가 더 나은 이유는 무엇일까?</Trans> {/*why-is-useid-better-than-an-incrementing-counter*/}

You might be wondering why `useId` is better than incrementing a global variable like `nextId++`.
<Trans>`useId` 가 `nextId++` 와 같은 전역 변수를 증가시키는 것보다 왜 더 나은지 궁금할 것입니다.</Trans>

The primary benefit of `useId` is that React ensures that it works with [server rendering.](/reference/react-dom/server) During server rendering, your components generate HTML output. Later, on the client, [hydration](/reference/react-dom/client/hydrateRoot) attaches your event handlers to the generated HTML. For hydration to work, the client output must match the server HTML.
<Trans>`useId` 의 주요 이점은 React가 서버 렌더링과 함께 작동하도록 보장한다는 것입니다. [서버 렌더링](/reference/react-dom/server) 중에 컴포넌트는 HTML 출력을 생성합니다. 나중에 클라이언트에서 [hydration](/reference/react-dom/client/hydrateRoot)가 붙여진 이벤트 핸들러를 생성된 HTML에 연결합니다. hydration이 작동하려면, 클라이언트 출력이 서버 HTML과 일치해야 합니다.</Trans>


This is very difficult to guarantee with an incrementing counter because the order in which the client components are hydrated may not match the order in which the server HTML was emitted. By calling `useId`, you ensure that hydration will work, and the output will match between the server and the client.
<Trans>클라이언트 컴포넌트가 hydration이 되는 순서가 서버 HTML이 생성된 순서와 일치하지 않을 수 있기 때문에 증가 카운터로는 이를 보장하기가 매우 어렵습니다. `useId`를 호출하여  hydration이 작동하고 출력이 서버와 클라이언트 간에 일치하는지 확인합니다.</Trans>


Inside React, `useId` is generated from the "parent path" of the calling component. This is why, if the client and the server tree are the same, the "parent path" will match up regardless of rendering order.
<Trans>내부 React는 `useId` 호출 컴포넌트의 "부모 경로"에서 생성됩니다. 이것이 클라이언트와 서버 트리가 같으면 렌더링 순서에 관계없이 "부모 경로"가 일치하는 이유입니다.</Trans>


</DeepDive>

---

### Generating IDs for several related elements <Trans>여러 관련 요소에 대한 ID 생성</Trans> {/*generating-ids-for-several-related-elements*/}

If you need to give IDs to multiple related elements, you can call `useId` to generate a shared prefix for them: 
<Trans>여러 관련 요소에 ID를 제공해야 하는 경우, `useId`를 호출하여 해당 요소들이 공유하는 접두사를 생성할 수 있습니다.</Trans>

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>First Name:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Last Name:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

This lets you avoid calling `useId` for every single element that needs a unique ID.
<Trans>`useId`를 통해 고유 ID가 필요한 모든 단일 요소를 호출하지 않아도 됩니다 .</Trans>

---

### Specifying a shared prefix for all generated IDs <Trans>생성된 모든 ID에 공유 접두사 지정하기</Trans> {/*specifying-a-shared-prefix-for-all-generated-ids*/}

If you render multiple independent React applications on a single page, pass `identifierPrefix` as an option to your [`createRoot`](/reference/react-dom/client/createRoot#parameters) or [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) calls. This ensures that the IDs generated by the two different apps never clash because every identifier generated with `useId` will start with the distinct prefix you've specified.
<Trans>단일 페이지에서 여러 개의 독립적인 React 애플리케이션을 렌더링하는 경우,  [`createRoot`](/reference/react-dom/client/createRoot#parameters) 또는 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 호출하여 `identifierPrefix`에 옵션으로 전달하세요. 이렇게 하면 생성된 모든 식별자가 지정한 고유한 접두사로 시작하기 때문에 서로 다른 두 앱에서 생성된 ID가 충돌하지 않습니다.</Trans>

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('Generated identifier:', passwordHintId)
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
    </>
  );
}
```

```js index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>

