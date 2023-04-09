---
title: Removing Effect Dependencies
translatedTitle: Effect 의존성 제거하기
translators: [김아영, 최민정, 정재남]
---

<Intro>

When you write an Effect, the linter will verify that you've included every reactive value (like props and state) that the Effect reads in the list of your Effect's dependencies. This ensures that your Effect remains synchronized with the latest props and state of your component. Unnecessary dependencies may cause your Effect to run too often, or even create an infinite loop. Follow this guide to review and remove unnecessary dependencies from your Effects.
<Trans>Effect를 작성하면 린터는 Effect의 의존성 목록에 Effect가 읽는 모든 반응형 값(예: props 및 state)을 포함했는지 확인합니다. 이렇게 하면 Effect가 컴포넌트의 최신 props 및 state와 동기화 상태를 유지할 수 있습니다. 불필요한 의존성으로 인해 Effect가 너무 자주 실행되거나 무한 루프를 생성할 수도 있습니다. 이 가이드를 따라 Effect에서 불필요한 의존성을 검토하고 제거하세요.</Trans>

</Intro>

<YouWillLearn>

- How to fix infinite Effect dependency loops
- What to do when you want to remove a dependency
- How to read a value from your Effect without "reacting" to it
- How and why to avoid object and function dependencies
- Why suppressing the dependency linter is dangerous, and what to do instead

<TransBlock>
- 무한 Effect 의존성 루프를 수정하는 방법
- 의존성을 제거하고자 할 때 해야 할 일
- Effect에 "반응"하지 않고 Effect에서 값을 읽는 방법
- 객체와 함수 의존성을 피하는 방법과 이유
- 의존성 린터를 억제하는 것이 위험한 이유와 대신 할 수 있는 일
</TransBlock>

</YouWillLearn>

## Dependencies should match the code<Trans>의존성은 코드와 일치해야 합니다</Trans> {/*dependencies-should-match-the-code*/}

When you write an Effect, you first specify how to [start and stop](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) whatever you want your Effect to be doing:
<Trans>Effect를 작성할 때는 먼저 Effect가 수행하기를 원하는 작업을 [시작하고 중지](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)하는 방법을 지정합니다:</Trans>

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

Then, if you leave the Effect dependencies empty (`[]`), the linter will suggest the correct dependencies:
<Trans>그런 다음 Effect 의존성을 비워두면(`[]`) 린터가 올바른 의존성을 제안합니다:</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Fix the mistake here!
  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Fill them in according to what the linter says:
<Trans>린터에 표시된 내용에 따라 채우세요:</Trans>

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

[Effects "react" to reactive values.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Since `roomId` is a reactive value (it can change due to a re-render), the linter verifies that you've specified it as a dependency. If `roomId` receives a different value, React will re-synchronize your Effect. This ensures that the chat stays connected to the selected room and "reacts" to the dropdown:
<Trans>[Effect는 반응형 값에 "반응"합니다.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) `roomId`는 반응형 값이므로(리렌더링으로 인해 변경될 수 있음), 린터는 이를 의존성으로 지정했는지 확인합니다. `roomId`가 다른 값을 받으면 React는 Effect를 다시 동기화합니다. 이렇게 하면 채팅이 선택된 방에 연결된 상태를 유지하고 드롭다운에 '반응'합니다:</Trans>

<Sandpack>

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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

### To remove a dependency, prove that it's not a dependency<Trans>의존성을 제거하려면 의존성이 아님을 증명하세요</Trans> {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

Notice that you can't "choose" the dependencies of your Effect. Every <CodeStep step={2}>reactive value</CodeStep> used by your Effect's code must be declared in your dependency list. The dependency list is determined by the surrounding code:
<Trans>Effect의 의존성을 "선택"할 수 없다는 점에 유의하세요. Effect의 코드에서 사용되는 모든 <CodeStep step={2}>반응형 값</CodeStep>은 의존성 목록에 선언되어야 합니다. 의존성 목록은 주변 코드에 의해 결정됩니다:</Trans>

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // This is a reactive value
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads that reactive value
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ So you must specify that reactive value as a dependency of your Effect
  // ...
}
```

[Reactive values](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) include props and all variables and functions declared directly inside of your component. Since `roomId` is a reactive value, you can't remove it from the dependency list. The linter wouldn't allow it:
<Trans>[반응형 값](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive)에는 props와 컴포넌트 내부에서 직접 선언된 모든 변수 및 함수가 포함됩니다. `roomId`는 반응형 값이므로 의존성 목록에서 제거할 수 없습니다. 린터가 허용하지 않습니다:</Trans>

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'roomId'
  // ...
}
```

And the linter would be right! Since `roomId` may change over time, this would introduce a bug in your code.
<Trans>그리고 린터가 맞을 것입니다! `roomId`는 시간이 지남에 따라 변경될 수 있으므로 코드에 버그가 발생할 수 있습니다.</Trans>

**To remove a dependency, "prove" to the linter that it *doesn't need* to be a dependency.** For example, you can move `roomId` out of your component to prove that it's not reactive and won't change on re-renders:
<Trans>**의존성을 제거하려면 해당 컴포넌트가 의존성이 될 *필요가 없다는 것*을 린터에 "증명"하세요.** 예를 들어, `roomId`를 컴포넌트 밖으로 이동시켜도 반응하지 않고 리렌더링 시에도 변경되지 않음을 증명할 수 있습니다:</Trans>

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // Not a reactive value anymore

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
}
```

Now that `roomId` is not a reactive value (and can't change on a re-render), it doesn't need to be a dependency:
<Trans>이제 `roomId`는 반응형 값이 아니므로(리렌더링할 때 변경할 수 없으므로) 의존성이 될 필요가 없습니다:</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

This is why you could now specify an [empty (`[]`) dependency list.](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) Your Effect *really doesn't* depend on any reactive value anymore, so it *really doesn't* need to re-run when any of the component's props or state change.
<Trans>이것이 [빈(`[]`) 의존성 목록](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means)을 지정할 수 있는 이유입니다. Effect는 더 이상 반응형 값에 의존하지 않으므로 컴포넌트의 props나 state가 변경될 때 Effect를 다시 실행할 필요가 없습니다.</Trans>

### To change the dependencies, change the code<Trans>의존성을 변경하려면 코드를 변경하세요</Trans> {/*to-change-the-dependencies-change-the-code*/}

You might have noticed a pattern in your workflow:
<Trans>작업흐름에서 패턴을 발견했을 수도 있습니다:</Trans>

1. First, you **change the code** of your Effect or how your reactive values are declared.
2. Then, you follow the linter and adjust the dependencies to **match the code you have changed.**
3. If you're not happy with the list of dependencies, you **go back to the first step** (and change the code again).

<TransBlock>
1. 먼저 Effect의 코드 또는 반응형 값 선언 방식을 **변경**합니다.
2. 그런 다음, **변경한 코드에 맞게** 의존성을 조정합니다.
3. 의존성 목록이 마음에 들지 않으면 **첫 번째 단계로 돌아가서** 코드를 다시 변경합니다. (그리고 코드를 다시 변경하세요).
</TransBlock>

The last part is important. **If you want to change the dependencies, change the surrounding code first.** You can think of the dependency list as [a list of all the reactive values used by your Effect's code.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) You don't *choose* what to put on that list. The list *describes* your code. To change the dependency list, change the code.
<Trans>마지막 부분이 중요합니다. 의존성을 변경하려면 먼저 주변 코드를 변경하세요. 의존성 목록은 [Effect의 코드에서 사용하는 모든 반응형 값의 목록](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency)이라고 생각하면 됩니다. 이 목록에 무엇을 넣을지는 사용자가 선택하지 않습니다. 이 목록은 코드를 설명합니다. 의존성 목록을 변경하려면 코드를 변경하세요.</Trans>

This might feel like solving an equation. You might start with a goal (for example, to remove a dependency), and you need to "find" the code matching that goal. Not everyone finds solving equations fun, and the same thing could be said about writing Effects! Luckily, there is a list of common recipes that you can try below.
<Trans>이것은 방정식을 푸는 것처럼 느껴질 수 있습니다. 예를 들어 의존성 제거와 같은 목표를 설정하고 그 목표에 맞는 코드를 "찾아야" 합니다. 모든 사람이 방정식을 푸는 것을 재미있어하는 것은 아니며, Effect를 작성할 때도 마찬가지입니다! 다행히도 아래에 시도해 볼 수 있는 일반적인 레시피 목록이 있습니다.</Trans>

<Pitfall>

If you have an existing codebase, you might have some Effects that suppress the linter like this:
<Trans>기존 코드베이스가 있는 경우 이와 같이 린터를 억제하는 Effect가 있을 수 있습니다:</Trans>

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**When dependencies don't match the code, there is a very high risk of introducing bugs.** By suppressing the linter, you "lie" to React about the values your Effect depends on.
<Trans>**의존성이 코드와 일치하지 않으면 버그가 발생할 위험이 매우 높습니다.** 린터를 억제하면 Effect가 종속하는 값에 대해 React에 "거짓말"을 하게 됩니다.</Trans>

Instead, use the techniques below.
<Trans>대신 다음에 소개할 기술을 사용하세요.</Trans>

</Pitfall>

<DeepDive>

#### Why is suppressing the dependency linter so dangerous?<Trans>의존성 린터를 억제하는 것이 왜 위험한가요?</Trans> {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

Suppressing the linter leads to very unintuitive bugs that are hard to find and fix. Here's one example:
<Trans>린터를 억제하면 매우 직관적이지 않은 버그가 발생하여 찾아서 수정하기가 어렵습니다. 한 가지 예를 들어보겠습니다:</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Let's say that you wanted to run the Effect "only on mount". You've read that [empty (`[]`) dependencies](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) do that, so you've decided to ignore the linter, and forcefully specified `[]` as the dependencies.
<Trans>"마운트할 때만" Effect를 실행하고 싶다고 가정해 봅시다. [빈(`[]`) 의존성](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means)이 그렇게 한다는 것을 읽었으므로 린터를 무시하고 `[]` 의존성을 강제로 지정하기로 결정했습니다.</Trans>

This counter was supposed to increment every second by the amount configurable with the two buttons. However, since you "lied" to React that this Effect doesn't depend on anything, React forever keeps using the `onTick` function from the initial render. [During that render,](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `count` was `0` and `increment` was `1`. This is why `onTick` from that render always calls `setCount(0 + 1)` every second, and you always see `1`. Bugs like this are harder to fix when they're spread across multiple components.
<Trans>이 카운터는 두 개의 버튼으로 설정할 수 있는 양만큼 매초마다 증가해야 합니다. 하지만 이 Effect가 아무 것도 종속하지 않는다고 React에 "거짓말"을 했기 때문에, React는 초기 렌더링에서 계속 `onTick` 함수를 사용합니다. [이 렌더링에서](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) 카운트는 `0`이었고 증가분은 `1`이었습니다. 그래서 이 렌더링의 `onTick`은 항상 매초마다 `setCount(0 + 1)`을 호출하고 항상 `1`이 표시됩니다. 이와 같은 버그는 여러 컴포넌트에 분산되어 있을 때 수정하기가 더 어렵습니다.</Trans>

There's always a better solution than ignoring the linter! To fix this code, you need to add `onTick` to the dependency list. (To ensure the interval is only setup once, [make `onTick` an Effect Event.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events))
<Trans>린터를 무시하는 것보다 더 좋은 해결책은 항상 있습니다! 이 코드를 수정하려면 의존성 목록에 `onTick`을 추가해야 합니다. (interval을 한 번만 설정하려면 [onTick을 Effect 이벤트로 만드세요.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events))</Trans>

**We recommend treating the dependency lint error as a compilation error. If you don't suppress it, you will never see bugs like this.** The rest of this page documents the alternatives for this and other cases.
<Trans>**의존성 린트 오류는 컴파일 오류로 처리하는 것이 좋습니다. 이를 억제하지 않으면 이와 같은 버그가 발생하지 않습니다.** 이 페이지의 나머지 부분에서는 이 경우와 다른 경우에 대한 대안을 설명합니다.</Trans>

</DeepDive>

## Removing unnecessary dependencies<Trans>불필요한 의존성 제거하기</Trans> {/*removing-unnecessary-dependencies*/}

Every time you adjust the Effect's dependencies to reflect the code, look at the dependency list. Does it make sense for the Effect to re-run when any of these dependencies change? Sometimes, the answer is "no":
<Trans>코드를 반영하기 위해 Effect의 의존성을 조정할 때마다 의존성 목록을 살펴보십시오. 이러한 의존성 중 하나라도 변경되면 Effect가 다시 실행되는 것이 합리적일까요? 가끔 대답은 "아니오"입니다:</Trans>

* You might want to re-execute *different parts* of your Effect under different conditions.
* You might want to only read the *latest value* of some dependency instead of "reacting" to its changes.
* A dependency may change too often *unintentionally* because it's an object or a function.

<TransBlock>
- 다른 조건에서 Effect의 *다른 부분*을 다시 실행하고 싶을 수도 있습니다.
- 일부 의존성의 변경에 "반응"하지 않고 "최신 값"만 읽고 싶을 수도 있습니다.
- 의존성은 객체나 함수이기 때문에 *의도치 않게* 너무 자주 변경될 수 있습니다.
</TransBlock>

To find the right solution, you'll need to answer a few questions about your Effect. Let's walk through them.
<Trans>올바른 해결책을 찾으려면 Effect에 대한 몇 가지 질문에 답해야 합니다. 몇 가지 질문을 살펴봅시다.</Trans>

### Should this code move to an event handler?<Trans>이 코드를 이벤트 핸들러로 옮겨야 하나요?</Trans> {/*should-this-code-move-to-an-event-handler*/}

The first thing you should think about is whether this code should be an Effect at all.
<Trans>가장 먼저 고려해야 할 것은 이 코드가 Effect가 되어야 하는지 여부입니다.</Trans>

Imagine a form. On submit, you set the `submitted` state variable to `true`. You need to send a POST request and show a notification. You've put this logic inside an Effect that "reacts" to `submitted` being `true`:
<Trans>form을 상상해 봅시다. 제출할 때 `submitted` state 변수를 `true`로 설정합니다. POST 요청을 보내고 알림을 표시해야 합니다. 이 로직은 `submitted`가 `true`가 될 때 "반응"하는 Effect 안에 넣었습니다:</Trans>

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('Successfully registered!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Later, you want to style the notification message according to the current theme, so you read the current theme. Since `theme` is declared in the component body, it is a reactive value, so you add it as a dependency:
<Trans>나중에 현재 테마에 따라 알림 메시지의 스타일을 지정하고 싶으므로 현재 테마를 읽습니다. `theme`는 컴포넌트 본문에서 선언 되었기때문에 이는 반응형 값이므로 의존성으로 추가합니다:</Trans>

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ All dependencies declared

  function handleSubmit() {
    setSubmitted(true);
  }  

  // ...
}
```

By doing this, you've introduced a bug. Imagine you submit the form first and then switch between Dark and Light themes. The `theme` will change, the Effect will re-run, and so it will display the same notification again!
<Trans>이렇게 하면 버그가 발생하게 됩니다. 먼저 form을 제출한 다음 어두운 테마와 밝은 테마 간 전환한다고 가정해 보겠습니다. `theme`가 변경되고 Effect가 다시 실행되어 동일한 알림이 다시 표시됩니다!</Trans>

**The problem here is that this shouldn't be an Effect in the first place.** You want to send this POST request and show the notification in response to *submitting the form,* which is a particular interaction. To run some code in response to particular interaction, put that logic directly into the corresponding event handler:
<Trans>**여기서 문제는 이것이 애초에 Effect가 아니어야 한다는 점입니다.** 이 POST 요청을 보내고 특정 상호작용인 form 제출에 대한 응답으로 알림을 표시하고 싶다는 것입니다. 특정 상호작용에 대한 응답으로 일부 코드를 실행하려면 해당 로직을 해당 이벤트 핸들러에 직접 넣어야 합니다:</Trans>

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Good: Event-specific logic is called from event handlers
    post('/api/register');
    showNotification('Successfully registered!', theme);
  }  

  // ...
}
```

Now that the code is in an event handler, it's not reactive--so it will only run when the user submits the form. Read more about [choosing between event handlers and Effects](/learn/separating-events-from-effects#reactive-values-and-reactive-logic) and [how to delete unnecessary Effects.](/learn/you-might-not-need-an-effect)
<Trans>이제 코드가 이벤트 핸들러에 있고, 이는 반응형 코드가 아니므로 사용자가 form을 제출할 때만 실행됩니다. [이벤트 핸들러와 Effect 중에서 선택하는 방법](/learn/separating-events-from-effects#reactive-values-and-reactive-logic)과 [불필요한 Effect를 삭제하는 방법](/learn/you-might-not-need-an-effect)에 대해 자세히 알아보세요.</Trans>

### Is your Effect doing several unrelated things?<Trans>Effect가 여러 관련 없는 일을 하고 있나요?</Trans> {/*is-your-effect-doing-several-unrelated-things*/}

The next question you should ask yourself is whether your Effect is doing several unrelated things.
<Trans>다음으로 스스로에게 물어봐야 할 질문은 Effect가 서로 관련이 없는 여러 가지 작업을 수행하고 있는지 여부입니다.</Trans>

Imagine you're creating a shipping form where the user needs to choose their city and area. You fetch the list of `cities` from the server according to the selected `country` to show them in a dropdown:
<Trans>사용자가 도시와 지역을 선택해야 하는 배송 form을 만든다고 가정해 보겠습니다. 선택한 `country`에 따라 서버에서 `cities` 목록을 페치해서 드롭다운에 표시합니다:</Trans>

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]); // ✅ All dependencies declared

  // ...
```

This is a good example of [fetching data in an Effect.](/learn/you-might-not-need-an-effect#fetching-data) You are synchronizing the `cities` state with the network according to the `country` prop. You can't do this in an event handler because you need to fetch as soon as `ShippingForm` is displayed and whenever the `country` changes (no matter which interaction causes it).
<Trans>[Effect에서 데이터를 페칭하는](/learn/you-might-not-need-an-effect#fetching-data) 좋은 예시입니다. `country` props에 따라 `cities` state를 네트워크와 동기화하고 있습니다. `ShippingForm`이 표시되는 즉시 그리고 `country`가 변경될 때마다 (어떤 상호작용이 원인이든 상관없이) 데이터를 가져와야 하므로 이벤트 핸들러에서는 이 작업을 수행할 수 없습니다.</Trans>

Now let's say you're adding a second select box for city areas, which should fetch the `areas` for the currently selected `city`. You might start by adding a second `fetch` call for the list of areas inside the same Effect:
<Trans>이제 도시 지역에 대한 두 번째 선택 상자를 추가하여 현재 선택된 `city`의 `areas`을 페치한다고 가정해 보겠습니다. 동일한 Effect 내에 지역 목록에 대한 두 번째 `fetch` 호출을 추가하는 것으로 시작할 수 있습니다:</Trans>

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 Avoid: A single Effect synchronizes two independent processes
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ All dependencies declared

  // ...
```

However, since the Effect now uses the `city` state variable, you've had to add `city` to the list of dependencies. That, in turn, introduced a problem: when the user selects a different city, the Effect will re-run and call `fetchCities(country)`. As a result, you will be unnecessarily refetching the list of cities many times.
<Trans>하지만 이제 Effect가 `city` state 변수를 사용하므로 의존성 목록에 `city`를 추가해야 했습니다. 이로 인해 사용자가 다른 도시를 선택하면 Effect가 다시 실행되어 `fetchCities(country)`를 호출하는 문제가 발생했습니다. 결과적으로 불필요하게 도시 목록을 여러 번 다시 페치하게 됩니다.</Trans>

**The problem with this code is that you're synchronizing two different unrelated things:**
<Trans>**이 코드의 문제점은 서로 관련이 없는 두 가지를 동기화하고 있다는 것입니다.**</Trans>

1. You want to synchronize the `cities` state to the network based on the `country` prop.
1. You want to synchronize the `areas` state to the network based on the `city` state.

<TransBlock> 
1. `country` props를 기반으로 `cities` state를 네트워크에 동기화하려고 합니다.
2. `city` state를 기반으로 `areas` state를 네트워크에 동기화하려고 합니다.
</TransBlock>

Split the logic into two Effects, each of which reacts to the prop that it needs to synchronize with:
<Trans>로직을 두 개의 Effect로 분할하고, 각 Effect는 동기화해야 하는 props에 반응합니다:</Trans>

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]); // ✅ All dependencies declared

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]); // ✅ All dependencies declared

  // ...
```

Now the first Effect only re-runs if the `country` changes, while the second Effect re-runs when the `city` changes. You've separated them by purpose: two different things are synchronized by two separate Effects. Two separate Effects have two separate dependency lists, so they won't trigger each other unintentionally.
<Trans>이제 첫 번째 Effect는 `country`가 변경될 때만 다시 실행되고, 두 번째 Effect는 `city`가 변경될 때 다시 실행됩니다. 목적에 따라 분리했으니, 서로 다른 두 가지가 두 개의 개별 Effect에 의해 동기화됩니다. 두 개의 개별 Effect에는 두 개의 개별 의존성 목록이 있으므로 의도치 않게 서로를 촉발하지 않습니다.</Trans>

The final code is longer than the original, but splitting these Effects is still correct. [Each Effect should represent an independent synchronization process.](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) In this example, deleting one Effect doesn't break the other Effect's logic. This means they *synchronize different things,* and it's good to split them up. If you're concerned about duplication, you can improve this code by [extracting repetitive logic into a custom Hook.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)
<Trans>최종 코드는 원본보다 길지만 Effect를 분할하는 것이 여전히 정확합니다. [각 Effect는 독립적인 동기화 프로세스를 나타내야 합니다.](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) 이 예제에서는 한 Effect를 삭제해도 다른 Effect의 로직이 깨지지 않습니다. 즉, *서로 다른 것을 동기화*하므로 분할하는 것이 좋습니다. [중복이 걱정된다면 반복되는 로직을 커스텀 Hook으로 추출](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)하여 이 코드를 개선할 수 있습니다.</Trans>

### Are you reading some state to calculate the next state?<Trans>다음 state를 계산하기 위해 어떤 state를 읽고 있나요?</Trans> {/*are-you-reading-some-state-to-calculate-the-next-state*/}

This Effect updates the `messages` state variable with a newly created array every time a new message arrives:
<Trans>이 Effect는 새 메시지가 도착할 때마다 새로 생성된 배열로 `messages` state 변수를 업데이트합니다:</Trans>

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

It uses the `messages` variable to [create a new array](/learn/updating-arrays-in-state) starting with all the existing messages and adds the new message at the end. However, since `messages` is a reactive value read by an Effect, it must be a dependency:
<Trans>`messages` 변수를 사용하여 모든 기존 메시지로 시작하는 [새 배열을 생성](/learn/updating-arrays-in-state)하고 마지막에 새 메시지를 추가합니다. 하지만 `messages`는 Effect에서 읽는 반응형 값이므로 의존성이어야 합니다:</Trans>

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ All dependencies declared
  // ...
```

And making `messages` a dependency introduces a problem.
<Trans>그리고 `messages`를 의존성으로 만들면 문제가 발생합니다.</Trans>

Every time you receive a message, `setMessages()` causes the component to re-render with a new `messages` array that includes the received message. However, since this Effect now depends on `messages`, this will *also* re-synchronize the Effect. So every new message will make the chat re-connect. The user would not like that!
<Trans>메시지를 수신할 때마다 `setMessages()`는 컴포넌트가 수신된 메시지를 포함하는 새 `messages` 배열로 리렌더링하도록 합니다. 하지만 이 Effect는 이제 `messages`에 따라 달라지므로 Effect도 다시 동기화됩니다. 따라서 새 메시지가 올 때마다 채팅이 다시 연결됩니다. 사용자가 원하지 않을 것입니다!</Trans>

To fix the issue, don't read `messages` inside the Effect. Instead, pass an [updater function](/reference/react/useState#updating-state-based-on-the-previous-state) to `setMessages`:
<Trans>이 문제를 해결하려면 Effect 내에서 `messages`를 읽지 마세요. 대신 [업데이터 함수](/reference/react/useState#updating-state-based-on-the-previous-state)를 `setMessages`에 전달하세요:</Trans>

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

**Notice how your Effect does not read the `messages` variable at all now.** You only need to pass an updater function like `msgs => [...msgs, receivedMessage]`. React [puts your updater function in a queue](/learn/queueing-a-series-of-state-updates) and will provide the `msgs` argument to it during the next render. This is why the Effect itself doesn't need to depend on `messages` anymore. As a result of this fix, receiving a chat message will no longer make the chat re-connect.
<Trans>**이제 Effect가 `messages` 변수를 전혀 읽지 않는 것을 알 수 있습니다.** `msgs => [...msgs, receivedMessage]`와 같은 업데이터 함수만 전달하면 됩니다. React는 [업데이터 함수를 대기열에 넣고](/learn/queueing-a-series-of-state-updates) 다음 렌더링 중에 `msgs` 인수를 제공합니다. 이 때문에 Effect 자체는 더 이상 `messages`에 종속할 필요가 없습니다. 이 수정으로 인해 채팅 메시지를 수신해도 더 이상 채팅이 다시 연결되지 않습니다.</Trans>

### Do you want to read a value without "reacting" to its changes?<Trans>값의 변경에 '반응'하지 않고 값을 읽고 싶으신가요?</Trans> {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

<Wip>

This section describes an **experimental API that has not yet been released** in a stable version of React.
<Trans>이 섹션에서는 **아직 안정된 버전의 React로 출시되지 않은 실험적인 API**에 대해 설명합니다.</Trans>

</Wip>

Suppose that you want to play a sound when the user receives a new message unless `isMuted` is `true`:
<Trans>사용자가 새 메시지를 수신할 때 `isMuted`가 `true`가 아닌 경우 사운드를 재생하고 싶다고 가정해 보겠습니다:</Trans>

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

Since your Effect now uses `isMuted` in its code, you have to add it to the dependencies:
<Trans>이제 Effect의 코드에서 `isMuted`를 사용하므로 의존성에 추가해야 합니다:</Trans>

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ All dependencies declared
  // ...
```

The problem is that every time `isMuted` changes (for example, when the user presses the "Muted" toggle), the Effect will re-synchronize, and reconnect to the chat. This is not the desired user experience! (In this example, even disabling the linter would not work--if you do that, `isMuted` would get "stuck" with its old value.)
<Trans>문제는 (사용자가 'Muted' 토글을 누르는 등) `isMuted`가 변경될 때마다 Effect가 다시 동기화되고 채팅에 다시 연결된다는 점입니다. 이는 바람직한 사용자 경험이 아닙니다! (이 예에서는 린터를 비활성화해도 작동하지 않습니다. 그렇게 하면 `isMuted`가 이전 값으로 '고착'됩니다.)</Trans>

To solve this problem, you need to extract the logic that shouldn't be reactive out of the Effect. You don't want this Effect to "react" to the changes in `isMuted`. [Move this non-reactive piece of logic into an Effect Event:](/learn/separating-events-from-effects#declaring-an-effect-event)
<Trans>이 문제를 해결하려면 Effect에서 반응해서는 안 되는 로직을 추출해야 합니다. 이 Effect가 `isMuted`의 변경에 "반응"하지 않기를 원합니다. [이 비반응 로직을 Effect 이벤트로 옮기면 됩니다](/learn/separating-events-from-effects#declaring-an-effect-event):</Trans>

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Effect Events let you split an Effect into reactive parts (which should "react" to reactive values like `roomId` and their changes) and non-reactive parts (which only read their latest values, like `onMessage` reads `isMuted`). **Now that you read `isMuted` inside an Effect Event, it doesn't need to be a dependency of your Effect.** As a result, the chat won't re-connect when you toggle the "Muted" setting on and off, solving the original issue!
<Trans>Effect 이벤트를 사용하면 Effect를 반응형 부분(`roomId`와 같은 반응형 값과 그 변경에 "반응"해야 하는)과 비반응형 부분(`onMessage`가 `isMuted`를 읽는 것처럼 최신 값만 읽는)으로 나눌 수 있습니다. **이제 Effect 이벤트 내에서 `isMuted`를 읽었으므로 Effect의 의존성이 될 필요가 없습니다.** 그 결과, "Muted" 설정을 켜고 끌 때 채팅이 다시 연결되지 않아 원래 문제가 해결되었습니다!</Trans>

#### Wrapping an event handler from the props<Trans>props를 이벤트 핸들러로 감싸기</Trans> {/*wrapping-an-event-handler-from-the-props*/}

You might run into a similar problem when your component receives an event handler as a prop:
<Trans>컴포넌트가 이벤트 핸들러를 props로 받을 때 비슷한 문제가 발생할 수 있습니다:</Trans>

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ All dependencies declared
  // ...
```

Suppose that the parent component passes a *different* `onReceiveMessage` function on every render:
<Trans>부모 컴포넌트가 렌더링할 때마다 *다른* `onReceiveMessage` 함수를 전달한다고 가정해 보겠습니다:</Trans>

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

Since `onReceiveMessage` is a dependency, it would cause the Effect to re-synchronize after every parent re-render. This would make it re-connect to the chat. To solve this, wrap the call in an Effect Event:
<Trans>`onReceiveMessage`는 의존성이므로 부모가 리렌더링할 때마다 Effect가 다시 동기화됩니다. 그러면 채팅에 다시 연결됩니다. 이 문제를 해결하려면 호출을 Effect 이벤트로 감싸세요:</Trans>

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Effect Events aren't reactive, so you don't need to specify them as dependencies. As a result, the chat will no longer re-connect even if the parent component passes a function that's different on every re-render.
<Trans>Effect 이벤트는 반응하지 않으므로 의존성으로 지정할 필요가 없습니다. 그 결과, 부모 컴포넌트가 리렌더링할 때마다 다른 함수를 전달하더라도 채팅이 더 이상 다시 연결되지 않습니다.</Trans>

#### Separating reactive and non-reactive code<Trans>반응형 코드와 비반응형 코드 분리</Trans> {/*separating-reactive-and-non-reactive-code*/}

In this example, you want to log a visit every time `roomId` changes. You want to include the current `notificationCount` with every log, but you *don't* want a change to `notificationCount` to trigger a log event.
<Trans>이 예제에서는 `roomId`가 변경될 때마다 방문을 기록하려고 합니다. 모든 로그에 현재 `notificationCount`를 포함하고 싶지만 `notificationCount` 변경으로 로그 이벤트가 촉발하는 것은 원하지 않습니다.</Trans>

The solution is again to split out the non-reactive code into an Effect Event:
<Trans>해결책은 다시 비반응형 코드를 Effect 이벤트로 분리하는 것입니다:</Trans>

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

You want your logic to be reactive with regards to `roomId`, so you read `roomId` inside of your Effect. However, you don't want a change to `notificationCount` to log an extra visit, so you read `notificationCount` inside of the Effect Event. [Learn more about reading the latest props and state from Effects using Effect Events.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)
<Trans>로직이 `roomId`와 관련하여 반응하기를 원하므로 Effect 내부에서 `roomId`를 읽습니다. 그러나 `notificationCount`를 변경하여 추가 방문을 기록하는 것은 원하지 않으므로 Effect 이벤트 내부에서 `notificationCount`를 읽습니다. [Effect 이벤트를 사용하여 효과에서 최신 props과 state를 읽는 방법에 대해 자세히 알아보세요.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)</Trans>

### Does some reactive value change unintentionally?<Trans>일부 반응형 값이 의도치 않게 변경되나요?</Trans> {/*does-some-reactive-value-change-unintentionally*/}

Sometimes, you *do* want your Effect to "react" to a certain value, but that value changes more often than you'd like--and might not reflect any actual change from the user's perspective. For example, let's say that you create an `options` object in the body of your component, and then read that object from inside of your Effect:
<Trans>Effect가 특정 값에 '반응'하기를 원하지만, 그 값이 원하는 것보다 더 자주 변경되어 사용자의 관점에서 실제 변경 사항을 반영하지 못할 수도 있습니다. 예를 들어 컴포넌트 본문에 `options` 객체를 생성한 다음 Effect 내부에서 해당 객체를 읽는다고 가정해 보겠습니다:</Trans>

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

This object is declared in the component body, so it's a [reactive value.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) When you read a reactive value like this inside an Effect, you declare it as a dependency. This ensures your Effect "reacts" to its changes:
<Trans>이 객체는 컴포넌트 본문에서 선언되므로 [반응형 값](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)입니다. Effect 내에서 이와 같은 반응형 값을 읽으면 의존성으로 선언합니다. 이렇게 하면 Effect가 변경 사항에 "반응"하게 됩니다:</Trans>

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ All dependencies declared
  // ...
```

It is important to declare it as a dependency! This ensures, for example, that if the `roomId` changes, your Effect will re-connect to the chat with the new `options`. However, there is also a problem with the code above. To see it, try typing into the input in the sandbox below, and watch what happens in the console:
<Trans>의존성으로 선언하는 것이 중요합니다! 이렇게 하면 예를 들어 `roomId`가 변경되면 Effect가 새 `options`으로 채팅에 다시 연결됩니다. 하지만 위 코드에도 문제가 있습니다. 이를 확인하려면 아래 샌드박스에 입력을 입력하고 콘솔에서 어떤 일이 발생하는지 살펴보세요:</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Temporarily disable the linter to demonstrate the problem
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

In the sandbox above, the input only updates the `message` state variable. From the user's perspective, this should not affect the chat connection. However, every time you update the `message`, your component re-renders. When your component re-renders, the code inside of it runs again from scratch.
<Trans>위의 샌드박스에서 입력은 `message` state 변수만 업데이트합니다. 사용자 입장에서는 이것이 채팅 연결에 영향을 미치지 않아야 합니다. 하지만 `message`를 업데이트할 때마다 컴포넌트가 리렌더링됩니다. 컴포넌트가 리렌더링되면 그 안에 있는 코드가 처음부터 다시 실행됩니다.</Trans>

A new `options` object is created from scratch on every re-render of the `ChatRoom` component. React sees that the `options` object is a *different object* from the `options` object created during the last render. This is why it re-synchronizes your Effect (which depends on `options`), and the chat re-connects as you type.
<Trans>`ChatRoom` 컴포넌트를 리렌더링할 때마다 새로운 `options` 객체가 처음부터 새로 생성됩니다. React는 `options` 객체가 마지막 렌더링 중에 생성된 `options` 객체와 *다른 객체*임을 인식합니다. 그렇기 때문에 (`options`에 따라 달라지는) Effect를 다시 동기화하고 사용자가 입력할 때 채팅이 다시 연결됩니다.</Trans>

**This problem only affects objects and functions. In JavaScript, each newly created object and function is considered distinct from all the others. It doesn't matter that the contents inside of them may be the same!**
<Trans>**이 문제는 객체와 함수에만 영향을 줍니다. JavaScript에서는 새로 생성된 객체와 함수가 다른 모든 객체와 구별되는 것으로 간주됩니다. 그 안의 내용이 동일할 수 있다는 것은 중요하지 않습니다!**</Trans>

```js {7-8}
// During the first render
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// During the next render
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// These are two different objects!
console.log(Object.is(options1, options2)); // false
```

**Object and function dependencies can make your Effect re-synchronize more often than you need.** 
<Trans>**객체 및 함수 의존성으로 인해 Effect가 필요 이상으로 자주 재동기화될 수 있습니다.**</Trans>

This is why, whenever possible, you should try to avoid objects and functions as your Effect's dependencies. Instead, try moving them outside the component, inside the Effect, or extracting primitive values out of them.
<Trans>그렇기 때문에 가능하면 객체와 함수를 Effect의 의존성으로 사용하지 않는 것이 좋습니다. 대신 컴포넌트 외부나 Effect 내부로 이동하거나 원시 값을 추출해 보세요.</Trans>

#### Move static objects and functions outside your component<Trans>정적 객체와 함수를 컴포넌트 외부로 이동</Trans> {/*move-static-objects-and-functions-outside-your-component*/}

If the object does not depend on any props and state, you can move that object outside your component:
<Trans>객체가 props 및 state에 종속하지 않는 경우 해당 객체를 컴포넌트 외부로 이동할 수 있습니다:</Trans>

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

This way, you *prove* to the linter that it's not reactive. It can't change as a result of a re-render, so it doesn't need to be a dependency. Now re-rendering `ChatRoom` won't cause your Effect to re-synchronize.
<Trans>이렇게 하면 린터가 반응하지 않는다는 것을 증명할 수 있습니다. 리렌더링의 결과로 변경될 수 없으므로 의존성이 될 필요가 없습니다. 이제 `ChatRoom`을 리렌더링해도 Effect가 다시 동기화되지 않습니다.</Trans>

This works for functions too:
<Trans>이는 함수에도 적용됩니다:</Trans>

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

Since `createOptions` is declared outside your component, it's not a reactive value. This is why it doesn't need to be specified in your Effect's dependencies, and why it won't ever cause your Effect to re-synchronize.
<Trans>`createOptions`는 컴포넌트 외부에서 선언되므로 반응형 값이 아닙니다. 그렇기 때문에 Effect의 의존성에 지정할 필요가 없으며, Effect가 다시 동기화되지 않는 이유이기도 합니다.</Trans>

#### Move dynamic objects and functions inside your Effect<Trans>Effect 내에서 동적 객체 및 함수 이동</Trans> {/*move-dynamic-objects-and-functions-inside-your-effect*/}

If your object depends on some reactive value that may change as a result of a re-render, like a `roomId` prop, you can't pull it *outside* your component. You can, however, move its creation *inside* of your Effect's code:
<Trans>객체가 `roomId` 프로퍼티처럼 리렌더링의 결과로 변경될 수 있는 반응형 값에 의존하는 경우, 컴포넌트 외부로 끌어낼 수 없습니다. 하지만 Effect의 코드 *내부*로 이동시킬 수는 있습니다:</Trans>

```js {7-10,11,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Now that `options` is declared inside of your Effect, it is no longer a dependency of your Effect. Instead, the only reactive value used by your Effect is `roomId`. Since `roomId` is not an object or function, you can be sure that it won't be *unintentionally* different. In JavaScript, numbers and strings are compared by their content:
<Trans>이제 `options`이 Effect 내부에서 선언되었으므로 더 이상 Effect의 의존성이 아닙니다. 대신 Effect에서 사용하는 유일한 반응형 값은 `roomId`입니다. `roomId`는 객체나 함수가 아니기 때문에 의도치 않게 달라지지 않을 것이라고 확신할 수 있습니다. JavaScript에서 숫자와 문자열은 그 내용에 따라 비교됩니다:</Trans>

```js {7-8}
// During the first render
const roomId1 = 'music';

// During the next render
const roomId2 = 'music';

// These two strings are the same!
console.log(Object.is(roomId1, roomId2)); // true
```

Thanks to this fix, the chat no longer re-connects if you edit the input:
<Trans>이 수정 덕분에 입력을 수정해도 더 이상 채팅이 다시 연결되지 않습니다:</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

However, it *does* re-connect when you change the `roomId` dropdown, as you would expect.
<Trans>그러나 예상대로 `roomId` 드롭다운을 변경하면 다시 연결됩니다.</Trans>

This works for functions, too:
<Trans>이는 함수에서도 마찬가지입니다:</Trans>

```js {7-12,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

You can write your own functions to group pieces of logic inside your Effect. As long as you also declare them *inside* your Effect, they're not reactive values, and so they don't need to be dependencies of your Effect.
<Trans>Effect 내에서 로직을 그룹화하기 위해 자신만의 함수를 작성할 수 있습니다. Effect 내부에서 선언하는 한, 반응형 값이 아니므로 Effect의 의존성이 될 필요가 없습니다.</Trans>

#### Read primitive values from objects<Trans>객체에서 원시 값 읽기</Trans> {/*read-primitive-values-from-objects*/}

Sometimes, you may receive an object from props:
<Trans>가끔 props에서 객체를 받을 수도 있습니다:</Trans>

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ All dependencies declared
  // ...
```

The risk here is that the parent component will create the object during rendering:
<Trans>렌더링 중에 부모 컴포넌트가 객체를 생성한다는 점이 위험합니다:</Trans>

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

This would cause your Effect to re-connect every time the parent component re-renders. To fix this, read information from the object *outside* the Effect, and avoid having object and function dependencies:
<Trans>이렇게 하면 부모 컴포넌트가 리렌더링할 때마다 Effect가 다시 연결됩니다. 이 문제를 해결하려면 Effect 외부의 객체에서 정보를 읽고 객체 및 함수 의존성을 피하십시오:</Trans>

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
```

The logic gets a little repetitive (you read some values from an object outside an Effect, and then create an object with the same values inside the Effect). But it makes it very explicit what information your Effect *actually* depends on. If an object is re-created unintentionally by the parent component, the chat would not re-connect. However, if `options.roomId` or `options.serverUrl` really are different, the chat would re-connect.
<Trans>로직은 약간 반복적입니다 (Effect 외부의 객체에서 일부 값을 읽은 다음 Effect 내부에 동일한 값을 가진 객체를 만듭니다). 하지만 Effect가 실제로 어떤 정보에 종속하는지 매우 명확하게 알 수 있습니다. 부모 컴포넌트에 의해 의도치 않게 객체가 다시 생성된 경우 채팅이 다시 연결되지 않습니다. 하지만 `options.roomId` 또는 `options.serverUrl`이 실제로 다른 경우 채팅이 다시 연결됩니다.</Trans>

#### Calculate primitive values from functions<Trans>함수에서 원시값 계산</Trans> {/*calculate-primitive-values-from-functions*/}

The same approach can work for functions. For example, suppose the parent component passes a function:
<Trans>함수에 대해서도 동일한 접근 방식을 사용할 수 있습니다. 예를 들어 부모 컴포넌트가 함수를 전달한다고 가정해 보겠습니다:</Trans>

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

To avoid making it a dependency (and causing it to re-connect on re-renders), call it outside the Effect. This gives you the `roomId` and `serverUrl` values that aren't objects, and that you can read from inside your Effect:
<Trans>의존성을 만들지 않으려면 (그리고 리렌더링할 때 다시 연결되는 것을 방지하려면) Effect 외부에서 호출하세요. 이렇게 하면 객체가 아니며 Effect 내부에서 읽을 수 있는 `roomId` 및 `serverUrl` 값을 얻을 수 있습니다:</Trans>

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
```

This only works for [pure](/learn/keeping-components-pure) functions because they are safe to call during rendering. If your function is an event handler, but you don't want its changes to re-synchronize your Effect, [wrap it into an Effect Event instead.](#do-you-want-to-read-a-value-without-reacting-to-its-changes)
<Trans>이는 렌더링 중에 호출해도 안전하므로 [순수](/learn/keeping-components-pure) 함수에서만 작동합니다. 함수가 이벤트 핸들러이지만 변경 사항으로 인해 Effect가 다시 동기화되는 것을 원하지 않는 경우, [대신 Effect 이벤트로 함수를 감싸세요.](#do-you-want-to-read-a-value-without-reacting-to-its-changes)</Trans>

<Recap>

- Dependencies should always match the code.
- When you're not happy with your dependencies, what you need to edit is the code.
- Suppressing the linter leads to very confusing bugs, and you should always avoid it.
- To remove a dependency, you need to "prove" to the linter that it's not necessary.
- If some code should run in response to a specific interaction, move that code to an event handler.
- If different parts of your Effect should re-run for different reasons, split it into several Effects.
- If you want to update some state based on the previous state, pass an updater function.
- If you want to read the latest value without "reacting" it, extract an Effect Event from your Effect.
- In JavaScript, objects and functions are considered different if they were created at different times.
- Try to avoid object and function dependencies. Move them outside the component or inside the Effect.
<TransBlock>
- 의존성은 항상 코드와 일치해야 합니다.
- 의존성이 마음에 들지 않으면 코드를 수정해야 합니다.
- 린터를 억제하면 매우 혼란스러운 버그가 발생하므로 항상 피해야 합니다.
- 의존성을 제거하려면 해당 의존성이 필요하지 않다는 것을 린터에게 "증명"해야 합니다.
- 특정 상호작용에 대한 응답으로 일부 코드가 실행되어야 하는 경우 해당 코드를 이벤트 핸들러로 이동하세요.
- Effect의 다른 부분이 다른 이유로 다시 실행되어야 하는 경우 여러 개의 Effect로 분할하세요.
- 이전 state를 기반으로 일부 state를 업데이트하려면 업데이터 함수를 전달하세요.
- "반응"하지 않고 최신 값을 읽으려면 Effect에서 Effect 이벤트를 추출하세요.
- JavaScript에서 객체와 함수는 서로 다른 시간에 생성된 경우 서로 다른 것으로 간주됩니다.
- 객체와 함수의 의존성을 피하세요. 컴포넌트 외부나 Effect 내부로 이동하세요.
</TransBlock>

</Recap>

<Challenges>

#### Fix a resetting interval<Trans>interval 초기화 수정하기</Trans> {/*fix-a-resetting-interval*/}

This Effect sets up an interval that ticks every second. You've noticed something strange happening: it seems like the interval gets destroyed and re-created every time it ticks. Fix the code so that the interval doesn't get constantly re-created.
<Trans>이 Effect는 매초마다 증가되는 interval을 설정합니다. 이상한 일이 발생하는 것을 발견했습니다: interval이 증가될 때마다 interval이 파괴되고 다시 생성되는 것 같습니다. interval이 계속 다시 생성되지 않도록 코드를 수정하세요.</Trans>

<Hint>

It seems like this Effect's code depends on `count`. Is there some way to not need this dependency? There should be a way to update the `count` state based on its previous value without adding a dependency on that value.
<Trans>이 Effect 코드가 `count`에 의존하는 것 같습니다. 이 의존성이 필요하지 않은 방법이 있을까요? 해당 값에 의존성을 추가하지 않고 이전 값을 기반으로 `count` state를 업데이트하는 방법이 있을 것입니다.</Trans>

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

<Solution>

You want to update the `count` state to be `count + 1` from inside the Effect. However, this makes your Effect depend on `count`, which changes with every tick, and that's why your interval gets re-created on every tick.
<Trans>Effect 내부에서 'count' state를 'count + 1'로 업데이트하고 싶습니다. 그러나 이렇게 하면 Effect가 매 tick마다 변경되는 `count`에 의존하게되므로 매 tick마다 interval이 다시 만들어집니다.</Trans>

To solve this, use the [updater function](/reference/react/useState#updating-state-based-on-the-previous-state) and write `setCount(c => c + 1)` instead of `setCount(count + 1)`:
<Trans>이 문제를 해결하려면 [업데이터 함수](/reference/react/useState#updating-state-based-on-the-previous-state)를 사용하여 `setCount(count + 1)` 대신 `setCount(c => c + 1)`를 작성합니다:</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, []);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

Instead of reading `count` inside the Effect, you pass a `c => c + 1` instruction ("increment this number!") to React. React will apply it on the next render. And since you don't need to read the value of `count` inside your Effect anymore, so you can keep your Effect's dependencies empty (`[]`). This prevents your Effect from re-creating the interval on every tick.
<Trans>Effect 내부에서 `count`를 읽는 대신 `c => c + 1` 명령어("이 숫자를 증가시켜라!")를 React에 전달합니다. React는 다음 렌더링에 이를 적용합니다. 그리고 Effect 내부에서 `count` 값을 더 이상 읽을 필요가 없으므로 Effect의 의존성을 비워둘 수 있습니다(`[]`). 이렇게 하면 매 tick마다 Effect가 interval을 다시 생성하지 않아도 됩니다.</Trans>

</Solution>

#### Fix a retriggering animation<Trans>애니메이션을 다시 촉발하는 현상 고치기</Trans> {/*fix-a-retriggering-animation*/}

In this example, when you press "Show", a welcome message fades in. The animation takes a second. When you press "Remove", the welcome message immediately disappears. The logic for the fade-in animation is implemented in the `animation.js` file as plain JavaScript [animation loop.](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) You don't need to change that logic. You can treat it as a third-party library. Your Effect creates an instance of `FadeInAnimation` for the DOM node, and then calls `start(duration)` or `stop()` to control the animation. The `duration` is controlled by a slider. Adjust the slider and see how the animation changes.
<Trans>이 예에서는 'Show'를 누르면 환영 메시지가 페이드인 합니다. 애니메이션은 1초 정도 걸립니다. "Remove"를 누르면 환영 메시지가 즉시 사라집니다. 페이드인 애니메이션의 로직은 animation.js 파일에서 일반 JavaScript 애니메이션 루프로 구현됩니다. 이 로직을 변경할 필요는 없습니다. 서드파티 라이브러리로 처리하면 됩니다. Effect는 DOM 노드에 대한 FadeInAnimation 인스턴스를 생성한 다음 start(duration) 또는 stop()을 호출하여 애니메이션을 제어합니다. duration은 슬라이더로 제어합니다. 슬라이더를 조정하여 애니메이션이 어떻게 변하는지 확인하세요.</Trans>

This code already works, but there is something you want to change. Currently, when you move the slider that controls the `duration` state variable, it retriggers the animation. Change the behavior so that the Effect does not "react" to the `duration` variable. When you press "Show", the Effect should use the current `duration` on the slider. However, moving the slider itself should not by itself retrigger the animation.
<Trans>이 코드는 이미 작동하지만 변경하고 싶은 부분이 있습니다. 현재 duration state 변수를 제어하는 슬라이더를 움직이면 애니메이션이 다시 촉발됩니다. Effect가 duration 변수에 "반응"하지 않도록 동작을 변경하세요. "Show"를 누르면 Effect는 슬라이더의 현재 duration을 사용해야 합니다. 그러나 슬라이더를 움직이는 것만으로 애니메이션이 다시 촉발되어서는 안 됩니다.</Trans>

<Hint>

Is there a line of code inside the Effect that should not be reactive? How can you move non-reactive code out of the Effect?
<Trans>Effect 안에 반응성이 없어야 하는 코드가 있나요? 비반응형 코드를 Effect 밖으로 옮기려면 어떻게 해야 하나요?</Trans>

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect, useRef } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Jump to end immediately
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Start animating
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // We still have more frames to paint
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

<Solution>

Your Effect needs to read the latest value of `duration`, but you don't want it to "react" to changes in `duration`. You use `duration` to start the animation, but starting animation isn't reactive. Extract the non-reactive line of code into an Effect Event, and call that function from your Effect.
<Trans>Effect는 `duration`의 최신 값을 읽어야 하지만, `duration`의 변화에 "반응"하지 않기를 원합니다. 애니메이션을 시작하기 위해 `duration`을 사용하지만 애니메이션이 시작해도 반응하지 않습니다. 반응하지 않는 코드를 추출하고 Effect에서 해당 함수를 호출합니다.</Trans>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // We still have more frames to paint
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

Effect Events like `onAppear` are not reactive, so you can read `duration` inside without retriggering the animation.
<Trans>`onAppear`와 같은 Effect 이벤트는 반응형 이벤트가 아니므로 애니메이션을 다시 촉발시키지 않고도 내부의 `duration`을 읽을 수 있습니다.</Trans>

</Solution>

#### Fix a reconnecting chat<Trans>채팅 재연결 문제 해결하기</Trans> {/*fix-a-reconnecting-chat*/}

In this example, every time you press "Toggle theme", the chat re-connects. Why does this happen? Fix the mistake so that the chat re-connects only when you edit the Server URL or choose a different chat room.
<Trans>이 예에서는 'Toggle theme'을 누를 때마다 채팅이 다시 연결됩니다. 왜 이런 일이 발생하나요? 서버 URL을 편집하거나 다른 채팅방을 선택할 때만 채팅이 다시 연결되도록 실수를 수정하세요.</Trans>

Treat `chat.js` as an external third-party library: you can consult it to check its API, but don't edit it.
<Trans>`chat.js`를 외부 서드파티 라이브러리로 취급: API를 확인하기 위해 참조할 수는 있지만 편집해서는 안됩니다.</Trans>

<Hint>

There's more than one way to fix this, but ultimately you want to avoid having an object as your dependency.
<Trans>이 문제를 해결하는 방법은 여러 가지가 있지만 궁극적으로 객체를 의존성으로 사용하지 않으려는 것입니다.</Trans>

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <hr />
      <ChatRoom options={options} />
    </div>
  );
}
```

```js ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

Your Effect is re-running because it depends on the `options` object. Objects can be re-created unintentionally, you should try to avoid them as dependencies of your Effects whenever possible.
<Trans>Effect가 `options` 객체에 의존하기 때문에 다시 실행되고 있습니다. 객체는 의도치 않게 다시 생성될 수 있으므로 가능하면 Effect의 종속 요소로 지정하지 않도록 해야 합니다.</Trans>

The least invasive fix is to read `roomId` and `serverUrl` right outside the Effect, and then make the Effect depend on those primitive values (which can't change unintentionally). Inside the Effect, create an object and it pass to `createConnection`:
<Trans>가장 덜 공격적인 수정 방법은 Effect 외부에서 `roomId`와 `serverUrl`을 읽은 다음 Effect가 이러한 기본 값에 의존하도록 만드는 것입니다(의도치 않게 변경할 수 없음). Effect 내부에서 객체를 생성하면 `createConnection`으로 전달됩니다:</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <hr />
      <ChatRoom options={options} />
    </div>
  );
}
```

```js ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

It would be even better to replace the object `options` prop with the more specific `roomId` and `serverUrl` props:
<Trans>객체의 `options` 프로퍼티를 보다 구체적인 `roomId` 및 `serverUrl` 프로퍼티로 대체하는 것이 더 좋을 것입니다:</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <hr />
      <ChatRoom
        roomId={roomId}
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Sticking to primitive props where possible makes it easier to optimize your components later.
<Trans>가능하면 primitive props를 사용하면 나중에 컴포넌트를 더 쉽게 최적화할 수 있습니다.</Trans>

</Solution>

#### Fix a reconnecting chat, again<Trans>다시, 채팅 재연결 문제 수정하기</Trans> {/*fix-a-reconnecting-chat-again*/}

This example connects to the chat either with or without encryption. Toggle the checkbox and notice the different messages in the console when the encryption is on and off. Try changing the room. Then, try toggling the theme. When you're connected to a chat room, you will receive new messages every few seconds. Verify that their color matches the theme you've picked.
<Trans>이 예는 encryption를 사용하거나 사용하지 않고 채팅에 연결합니다. checkbox를 토글하면 암호화가 켜져 있을 때와 꺼져 있을 때 콘솔에 표시되는 메시지가 달라지는 것을 확인할 수 있습니다. 채팅방을 변경해 보세요. 그런 다음 theme를 토글해 보세요. 채팅방에 연결되면 몇 초마다 새 메시지를 받게 됩니다. 메시지의 색상이 선택한 테마와 일치하는지 확인합니다.</Trans>

In this example, the chat re-connects every time you try to change the theme. Fix this. After the fix, changing the theme should not re-connect the chat, but toggling encryption settings or changing the room should re-connect.
<Trans>이 예에서는 theme를 변경하려고 할 때마다 채팅이 다시 연결됩니다. 이 문제를 수정합니다. 수정 후 theme를 변경해도 채팅이 다시 연결되지 않지만, encryption설정을 토글하거나 채팅방을 변경하면 다시 연결됩니다.</Trans>

Don't change any code in `chat.js`. Other than that, you can change any code as long as it results in the same behavior. For example, you may find it helpful to change which props are being passed down.
<Trans>`chat.js`의 코드를 변경하지 마세요. 그 외에는 동일한 동작을 초래하는 한 어떤 코드든 변경할 수 있습니다. 예를 들어 어떤 props이 전달되는지를 확인하고 변경하는 것이 도움이 될 수 있습니다.</Trans>

<Hint>

You're passing down two functions: `onMessage` and `createConnection`. Both of them are created from scratch every time `App` re-renders. They are considered to be new values every time, which is why they re-trigger your Effect.
<Trans>두 개의 함수를 전달하고 있습니다: `onMessage`와 `createConnection`입니다. 이 두 함수는 `App`이 다시 렌더링할 때마다 처음부터 새로 생성됩니다. 매번 새로운 값으로 간주되기 때문에 Effect를 다시 촉발시킵니다.</Trans>

One of these functions is an event handler. Do you know some way to call an event handler an Effect without "reacting" to the new values of the event handler function? That would come in handy!
<Trans>이러한 함수 중 하나가 이벤트 핸들러입니다. 이벤트 핸들러 함수의 새 값에 '반응'하지 않고 이벤트 핸들러를 Effect로 호출하는 방법을 알고 계신가요? 유용할 것 같습니다!</Trans>

Another of these functions only exists to pass some state to an imported API method. Is this function really necessary? What is the essential information that's being passed down? You might need to move some imports from `App.js` to `ChatRoom.js`.
<Trans>이러한 함수 중 다른 함수는 가져온 API 메서드에 일부 state를 전달하기 위해서만 존재합니다. 이 함수가 정말 필요한가요? 전달되는 필수 정보는 무엇인가요? 일부 imports를 `App.js`에서 `ChatRoom.js`로 옮겨야 할 수도 있습니다.</Trans>

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
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
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
      <hr />
      <ChatRoom
        roomId={roomId}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

There's more than one correct way to solve this, but here is one possible solution.
<Trans>이 문제를 해결하는 올바른 방법은 여러 가지가 있지만, 여기 한 가지 가능한 해결책이 있습니다.</Trans>

In the original example, toggling the theme caused different `onMessage` and `createConnection` functions to be created and passed down. Since the Effect depended on these functions, the chat would re-connect every time you toggle the theme.
<Trans>원래 예제에서는 테마를 변경하면 다른 `onMessage` 및 `createConnection` 함수가 생성되어 전달되었습니다. Effect가 이러한 함수에 의존했기 때문에 테마를 전환할 때마다 채팅이 다시 연결되었습니다.</Trans>

To fix the problem with `onMessage`, you needed to wrap it into an Effect Event:
<Trans>`message`의 문제를 해결하려면 `onMessage`를 Effect 이벤트로 래핑해야 했습니다:</Trans>

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

Unlike the `onMessage` prop, the `onReceiveMessage` Effect Event is not reactive. This is why it doesn't need to be a dependency of your Effect. As a result, changes to `onMessage` won't cause the chat to re-connect.
<Trans>`onMessage` 프로퍼티와 달리 `onReceiveMessage` Effect 이벤트는 반응하지 않습니다. 그렇기 때문에 Effect의 의존성이 될 필요가 없습니다. 따라서 `onMessage`를 변경해도 채팅이 다시 연결되지 않습니다.</Trans>

You can't do the same with `createConnection` because it *should* be reactive. You *want* the Effect to re-trigger if the user switches between an encrypted and an unencryption connection, or if the user switches the current room. However, because `createConnection` is a function, you can't check whether the information it reads has *actually* changed or not. To solve this, instead of passing `createConnection` down from the `App` component, pass the raw `roomId` and `isEncrypted` values:
<Trans>반응형이어야 하기 때문에 'createConnection'으로는 동일한 작업을 수행할 수 없습니다. 사용자가 암호화 연결과 비암호화 연결 사이를 전환하거나 사용자가 현재 방을 전환하면 Effect가 다시 촉발되기를 원합니다. 하지만 `createConnection`은 함수이기 때문에 이 함수가 읽는 정보가 실제로 변경되었는지 여부를 확인할 수 없습니다. 이 문제를 해결하려면 `App` 컴포넌트에서 `createConnection`을 전달하는 대신 primitive 값인 `roomId` 및 `isEncrypted`를 전달하세요:</Trans>

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

Now you can move the `createConnection` function *inside* the Effect instead of passing it down from the `App`:
<Trans>이제 `App`에서 전달하지 않고 Effect 내부로 `createConnection` 함수를 옮길 수 있습니다:</Trans>

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

After these two changes, your Effect no longer depends on any function values:
<Trans>이 두 가지 변경 사항 이후에는 Effect가 더 이상 함수 값에 의존하지 않습니다:</Trans>

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Reactive values
  const onReceiveMessage = useEffectEvent(onMessage); // Not reactive

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Reading a reactive value
      };
      if (isEncrypted) { // Reading a reactive value
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ All dependencies declared
```

As a result, the chat re-connects only when something meaningful (`roomId` or `isEncrypted`) changes:
<Trans>그 결과, 의미 있는 정보(`roomId` 또는 `isEncrypted`)가 변경될 때만 채팅이 다시 연결됩니다:</Trans>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
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
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>
