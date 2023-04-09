---
title: Reusing Logic with Custom Hooks
translatedTitle: 커스텀 훅으로 로직 재사용하기
translators: [고석영, 최다인, 이지수, 정재남]
---

<Intro>

React comes with several built-in Hooks like `useState`, `useContext`, and `useEffect`. Sometimes, you'll wish that there was a Hook for some more specific purpose: for example, to fetch data, to keep track of whether the user is online, or to connect to a chat room. You might not find these Hooks in React, but you can create your own Hooks for your application's needs.
<Trans>React에는 `useState`, `useContext`, `useEffect`와 같은 몇 가지 내장 훅이 있습니다. 때로는 데이터를 페치하거나, 사용자가 온라인 상태인지 추적하거나, 채팅방에 연결하는 등 좀 더 구체적인 목적을 위한 훅이 있었으면 좋겠다는 생각을 할 수 있습니다. React에서 이러한 훅을 찾지 못할 수도 있지만 애플리케이션의 필요에 따라 자신만의 훅을 만들 수 있습니다.</Trans>

</Intro>

<YouWillLearn>

- What custom Hooks are, and how to write your own
- How to reuse logic between components
- How to name and structure your custom Hooks
- When and why to extract custom Hooks
<TransBlock>
- 커스텀 훅이란 무엇이며, 직접 작성하는 방법
- 컴포넌트 간에 로직을 재사용하는 방법
- 커스텀 훅의 이름을 만들고 구조화하는 방법
- 커스텀 훅을 추출해야 하는 시기와 이유
</TransBlock>

</YouWillLearn>

## Custom Hooks: Sharing logic between components<Trans>커스텀 훅: 컴포넌트간의 로직 공유</Trans> {/*custom-hooks-sharing-logic-between-components*/}

Imagine you're developing an app that heavily relies on the network (as most apps do). You want to warn the user if their network connection has accidentally gone off while they were using your app. How would you go about it? It seems like you'll need two things in your component:
<Trans>대부분의 앱이 그렇듯이 네트워크에 크게 의존하는 앱을 개발한다고 가정해 보겠습니다. 사용자가 앱을 사용하는 동안 실수로 네트워크 연결이 끊어진 경우 사용자에게 주의를 줄 경우 어떻게 하면 좋을까요? 이럴 경우에 컴포넌트에는 두 가지가 필요합니다.</Trans>

1. A piece of state that tracks whether the network is online.
2. An Effect that subscribes to the global [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) and [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) events, and updates that state.
<TransBlock>
1. 네트워크가 온라인 상태인지 여부를 추적하는 state
2. 전역 [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) 및 [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) 이벤트를 구독하고, state를 업데이트하는 Effect
</TransBlock>

This will keep your component [synchronized](/learn/synchronizing-with-effects) with the network status. You might start with something like this:
<Trans>이렇게 하면 컴포넌트가 네트워크 state와 [동기화된 상태](/learn/synchronizing-with-effects)로 유지됩니다. 다음과 같이 시작할 수 있습니다:</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

</Sandpack>

Try turning your network on and off, and notice how this `StatusBar` updates in response to your actions.
<Trans>네트워크를 켜고 끄고, 동작에 따라 이 `StatusBar(상태 표시줄)`이 어떻게 업데이트되는지 확인해 보세요.</Trans>

Now imagine you *also* want to use the same logic in a different component. You want to implement a Save button that will become disabled and show "Reconnecting..." instead of "Save" while the network is off.
<Trans>이제 *다른 컴포넌트에서도* 동일한 로직을 사용하고 싶다고 가정해 봅시다. 네트워크가 꺼져 있을 때 비활성화되고 "저장" 대신 "다시 연결 중..."이 표시되는 저장 버튼을 구현하고 싶다고 가정해 보겠습니다.</Trans>

To start, you can copy and paste the `isOnline` state and the Effect into `SaveButton`:
<Trans>시작하려면 `isOnline` state와 Effect를 복사하여 `SaveButton`에 붙여넣으면 됩니다:</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

</Sandpack>

Verify that, if you turn off the network, the button will change its appearance.
<Trans>네트워크를 끄면 버튼의 모양이 변경되는지 확인합니다.</Trans>

These two components work fine, but the duplication in logic between them is unfortunate. It seems like even though they have different *visual appearance,* you want to reuse the logic between them.
<Trans>이 두 컴포넌트는 잘 작동하지만 두 컴포넌트 간의 로직이 중복되는 것은 안타까운 일입니다. 두 컴포넌트의 *시각적 모양*은 다르지만 당신은 두 컴포넌트 사이의 로직을 재사용하고 싶을 것입니다.</Trans>

### Extracting your own custom Hook from a component<Trans>컴포넌트에서 커스텀 훅 추출하기</Trans> {/*extracting-your-own-custom-hook-from-a-component*/}

Imagine for a moment that, similar to [`useState`](/reference/react/useState) and [`useEffect`](/reference/react/useEffect), there was a built-in `useOnlineStatus` Hook. Then both of these components could be simplified and you could remove the duplication between them:
<Trans>[`useState`](/reference/react/useState) 와 [`useEffect`](/reference/react/useEffect)와 같은, 만들어진 `useOnlineStatus` 훅이 있다고 잠깐만 가정해봅시다. 이 두 컴포넌트들은 단순화 될 수 있고 두 컴포넌트 간의 중복을 제거할 수 있습니다</Trans>

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

Although there is no such built-in Hook, you can write it yourself. Declare a function called `useOnlineStatus` and move all the duplicated code into it from the components you wrote earlier:
<Trans>이러한 내장 훅은 없지만, 직접 만들 수 있습니다.`useOnlineStatus` 이라는 함수를 선언하고 앞서 작성한 컴포넌트에서 중복된 코드를 모두 이 함수로 옮깁니다.</Trans>

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

At the end of the function, return `isOnline`. This lets your components read that value:
<Trans>이 함수의 마지막에 `isOnline`의 값을 return하고, 컴포넌트들이 이 값을 읽을 수 있게 합니다.</Trans>

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

Verify that switching the network on and off updates both components.
<Trans>네트워크를 켜고 끄면서 두 컴포넌트가 모두 업데이트되는지 확인합니다.</Trans>

Now your components don't have as much repetitive logic. **More importantly, the code inside them describes *what they want to do* (use the online status!) rather than *how to do it* (by subscribing to the browser events).**
<Trans>이제 컴포넌트에는 반복적인 로직이 많지 않습니다. **더 중요한 것은, 컴포넌트 내부의 코드가 (브라우저 이벤트에 가입하여) *어떻게 할 것인가*가 아니라 *무엇을 할 것인가*(온라인 상태 사용!)를 설명한다는 점입니다.**</Trans>

When you extract logic into custom Hooks, you can hide the gnarly details of how you deal with some external system or a browser API. The code of your components expresses your intent, not the implementation.
<Trans>로직을 커스텀 훅으로 추출하면 외부 시스템이나 브라우저 API를 처리하는 방법에 대한 지저분한 세부 사항을 숨길 수 있습니다. 컴포넌트의 코드는 구현이 아니라 의도를 표현합니다.</Trans>

### Hook names always start with `use`<Trans>훅의 이름은 언제나 `use`로 시작됩니다.</Trans> {/*hook-names-always-start-with-use*/}

React applications are built from components. Components are built from Hooks, whether built-in or custom. You'll likely often use custom Hooks created by others, but occasionally you might write one yourself!
<Trans>React 애플리케이션은 컴포넌트로 빌드됩니다. 컴포넌트는 내장된 것이든 커스텀이든 상관없이 훅으로 빌드됩니다. 다른 사람이 만든 커스텀 훅을 사용하는 경우가 많지만, 가끔은 직접 작성할 수도 있습니다!</Trans>

You must follow these naming conventions:
<Trans>이때는 다음 명명 규칙을 따라야 합니다:</Trans>

1. **React component names must start with a capital letter,** like `StatusBar` and `SaveButton`. React components also need to return something that React knows how to display, like a piece of JSX.
2. **Hook names must start with `use` followed by a capital letter,** like [`useState`](/reference/react/useState) (built-in) or `useOnlineStatus` (custom, like earlier on the page). Hooks may return arbitrary values.

<TransBlock>
1. **React 컴포넌트 이름은** `StatusBar`나 `SaveButton`과 같이 **대문자로 시작해야 합니다.** 또한 React 컴포넌트는 JSX와 같이 React가 표시하는 방법을 알고 있는 것을 반환해야 합니다.
2. **훅의 이름은** [`useState`](/reference/react/useState)(내장)이나 `useOnlineStatus`(커스텀)처럼 **`use`로 시작**해야 하고, 그 다음의 첫글자는 대문자여야 합니다. 훅은 임의의 값을 반환할 수 있습니다.
</TransBlock>

This convention guarantees that you can always look at a component and know where its state, Effects, and other React features might "hide". For example, if you see a `getColor()` function call inside your component, you can be sure that it can't possibly contain React state inside because its name doesn't start with `use`. However, a function call like `useOnlineStatus()` will most likely contain calls to other Hooks inside!
<Trans>이 규칙은 컴포넌트를 보고 state, Effect 및 기타 React 기능이 어디에 "숨어 있는지" 항상 알 수 있도록 보장합니다. 예를 들어 컴포넌트 내부에 `getColor()` 함수 호출이 있다면, 그 이름이 `use`로 시작하지 않기 때문에 내부에 React state를 포함할 수 없다는 것을 확신할 수 있습니다. 하지만 `useOnlineStatus()`와 같은 함수 호출은 내부에 다른 훅에 대한 호출을 포함할 가능성이 높습니다!</Trans>

<Note>

If your linter is [configured for React,](/learn/editor-setup#linting) it will enforce this naming convention. Scroll up to the sandbox above and rename `useOnlineStatus` to `getOnlineStatus`. Notice that the linter won't allow you to call `useState` or `useEffect` inside of it anymore. Only Hooks and components can call other Hooks!
<Trans>Linter가 [React용으로 구성된 경우,](/learn/editor-setup#linting) 이 명명 규칙을 적용합니다. 위의 샌드박스로 스크롤하여 `useOnlineStatus` 를 `getOnlineStatus`로 변경합니다. 이제 더는 내부에서 `useState` 나 `useEffect` 를 호출할 수 없다는 것을 알 수 있습니다. 오직 훅과 컴포넌트만이 다른 훅을 호출할 수 있습니다!</Trans>

</Note>

<DeepDive>

#### Should all functions called during rendering start with the use prefix?<Trans>렌더링 시에 호출되는 모든 함수에 use 접두사를 써야 하나요?</Trans> {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

No. Functions that don't *call* Hooks don't need to *be* Hooks.
<Trans>아니요. 훅을 *호출*하지 않는 함수는 훅이 될 필요가 없습니다.</Trans>

If your function doesn't call any Hooks, avoid the `use` prefix. Instead, write it as a regular function *without* the `use` prefix. For example, `useSorted` below doesn't call Hooks, so call it `getSorted` instead:
<Trans>함수가 훅을 호출하지 않는다면 `use` 접두사를 사용하지 마세요. 대신 `use` 접두사가 없는 일반 함수로 작성하세요. 예를 들어, 아래의 `useSorted`는 Hook을 호출하지 않으므로 대신 `getSorted`로 호출하세요: </Trans>

```js
// 🔴 Avoid: A Hook that doesn't use Hooks
// 🔴 이러지 마세요: 훅을 사용하지 않는 훅
function useSorted(items) {
  return items.slice().sort();
}

// ✅ Good: A regular function that doesn't use Hooks
// ✅ 좋습니다: 훅을 사용하지 않는 일반 함수
function getSorted(items) {
  return items.slice().sort();
}
```

This ensures that your code can call this regular function anywhere, including conditions:
<Trans>이렇게 하면 코드가 조건을 포함하여 어디서나 이 일반 함수를 호출할 수 있습니다:</Trans>

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ It's ok to call getSorted() conditionally because it's not a Hook
    // ✅ getSorted()는 훅이 아니므로 조건부로 호출해도 괜찮음
    displayedItems = getSorted(items);
  }
  // ...
}
```

You should give `use` prefix to a function (and thus make it a Hook) if it uses at least one Hook inside of it:
<Trans>함수가 내부에 하나 이상의 훅을 사용하는 경우 함수에 `use` 접두사를 지정해야 합니다(따라서 훅으로 만들어야 합니다):</Trans>

```js
// ✅ Good: A Hook that uses other Hooks
// ✅ 좋습니다: 다른 훅을 사용하는 훅
function useAuth() {
  return useContext(Auth);
}
```

Technically, this isn't enforced by React. In principle, you could make a Hook that doesn't call other Hooks. This is often confusing and limiting so it's best to avoid that pattern. However, there may be rare cases where it is helpful. For example, maybe your function doesn't use any Hooks right now, but you plan to add some Hook calls to it in the future. Then it makes sense to name it with the `use` prefix:
<Trans>엄밀히 말하자면 이것은 React에 의해 강제되지 않습니다. 원칙적으로 다른 훅을 호출하지 않는 훅을 만들 수 있습니다. 이는 종종 혼란스럽고 제한적이므로 이 패턴은 피하는 것이 가장 좋습니다. 하지만 드물게 도움이 되는 경우가 있을 수 있습니다. 예를 들어, 함수에 지금은 훅을 사용하지 않지만 나중에 훅 호출을 추가할 계획이 있을 수 있습니다. 이 경우 `use`접두사를 사용하여 이름을 지정하는 것이 좋습니다:</Trans>

```js {4-5}
// ✅ Good: A Hook that will likely use some other Hooks later
// ✅ 좋습니다: 나중에 다른 훅을 사용할 가능성이 있는 훅
function useAuth() {
  // TODO: Replace with this line when authentication is implemented:
  // TODO: 인증 기능이 구현되면 다음 줄로 바꿀 것:
  // return useContext(Auth);
  return TEST_USER;
}
```

Then components won't be able to call it conditionally. This will become important when you actually add Hook calls inside. If you don't plan to use Hooks inside it (now or later), don't make it a Hook.
<Trans>그러면 컴포넌트가 조건부로 호출할 수 없게 됩니다. 이것은 실제로 내부에 Hook 호출을 추가할 때 중요해질 것입니다. 내부에서 Hook을 사용할 계획이 없다면(지금 또는 나중에) Hook으로 만들지 마세요.</Trans>

</DeepDive>

### Custom Hooks let you share stateful logic, not state itself<Trans>커스텀 훅은 state 자체가 아닌 상태적인 로직(stateful logic)을 공유합니다.</Trans> {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

In the earlier example, when you turned the network on and off, both components updated together. However, it's wrong to think that a single `isOnline` state variable is shared between them. Look at this code:
<Trans>앞의 예제에서는 네트워크를 켜고 끌 때 두 컴포넌트가 함께 업데이트되었습니다. 그러나 하나의 `isOnline` state 변수가 두 컴포넌트 간에 공유된다고 생각하는 것은 잘못된 생각입니다. 이 코드를 보세요:</Trans>

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

It works the same way as before you extracted the duplication:
<Trans>중복을 제거하기 전과 같은 방식으로 동작하고 있습니다:</Trans>

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

These are two completely independent state variables and Effects! They happened to have the same value at the same time because you synchronized them with the same external value (whether the network is on).
<Trans>이들은 두 완전히 독립적인 state 변수 및 Effect입니다! 단지 네트워크가 켜져 있는지 여부에 관계없이 동일한 외부 값과 동기화했기 때문에 동시에 동일한 값을 갖게 된 것입니다.</Trans>

To better illustrate this, we'll need a different example. Consider this `Form` component:
<Trans>이를 더 잘 설명하기 위해 다른 예시가 필요합니다. 이 `Form` 컴포넌트를 생각해 봅시다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

There's some repetitive logic for each form field:
<Trans>각 양식 필드에는 몇 가지 반복되는 로직이 있습니다:</Trans>

1. There's a piece of state (`firstName` and `lastName`).
1. There's a change handler (`handleFirstNameChange` and `handleLastNameChange`).
1. There's a piece of JSX that specifies the `value` and `onChange` attributes for that input.
<TransBlock>
1. state(`firstName` 및 `lastName`)가 있습니다.
2. 변경 핸들러(`handleFirstNameChange` 및 `handleLastNameChange`)가 있습니다.
3. 해당 입력에 대한 `value` 및 `onChange` 속성을 지정하는 JSX 조각이 있습니다.
</TransBlock>

You can extract the repetitive logic into this `useFormInput` custom Hook:
<Trans>반복 로직을 이 useFormInput 커스텀 훅으로 추출할 수 있습니다:</Trans>

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Notice that it only declares *one* state variable called `value`.
<Trans>`value`라는 state variable(state 변수)를 하나만 선언하는 것을 주목하세요.</Trans>

However, the `Form` component calls `useFormInput` *two times:*
<Trans>하지만 `Form` 컴포넌트는 `useFormInput`을 두 번 호출합니다:</Trans>

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

This is why it works like declaring two separate state variables!
<Trans>이것이 바로 두 개의 state 변수를 선언하는 것처럼 작동하는 이유입니다!</Trans>

**Custom Hooks let you share *stateful logic* but not *state itself.* Each call to a Hook is completely independent from every other call to the same Hook.** This is why the two sandboxes above are completely equivalent. If you'd like, scroll back up and compare them. The behavior before and after extracting a custom Hook is identical.
<Trans>**커스텀 훅을 사용하면 *상태 로직(stateful logic)*은 공유할 수 있지만 *state 자체*는 공유할 수 없습니다.** 각 훅 호출은 동일한 훅에 대한 다른 모든 호출과 완전히 독립적입니다.** 이것이 바로 위의 두 샌드박스가 완전히 동일한 이유입니다. 원하신다면 스크롤을 위로 올려서 비교해 보세요. 커스텀 훅을 추출하기 전과 후의 동작은 동일합니다.</Trans>

When you need to share the state itself between multiple components, [lift it up and pass it down](/learn/sharing-state-between-components) instead.
<Trans>여러 컴포넌트 간에 state 자체를 공유해야 하는 경우, 대신 [끌어올려 전달하기](/learn/sharing-state-between-components)를 사용하세요.</Trans>

## Passing reactive values between Hooks<Trans>훅 사이에 반응형 값 전달하기</Trans> {/*passing-reactive-values-between-hooks*/}

The code inside your custom Hooks will re-run during every re-render of your component. This is why, like components, custom Hooks [need to be pure.](/learn/keeping-components-pure) Think of custom Hooks' code as part of your component's body!
<Trans>컴포넌트를 다시 렌더링할 때마다 커스텀 훅 내부의 코드가 다시 실행됩니다. 이것이 컴포넌트와 마찬가지로 커스텀 훅도 [순수해야 하는](/learn/keeping-components-pure) 이유입니다. 커스텀 Hook의 코드를 컴포넌트 본문의 일부로 생각하세요!</Trans>

Because custom Hooks re-render together with your component, they always receive the latest props and state. To see what this means, consider this chat room example. Change the server URL or the chat room:
<Trans>커스텀 훅은 컴포넌트와 함께 다시 렌더링되기 때문에 항상 최신 props와 state를 받습니다. 이것이 무엇을 의미하는지 이 채팅방 예시를 통해 알아보세요. 서버 URL 또는 선택한 채팅방을 변경합니다:</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  // 실제 구현은 진짜 서버로 연결됩니다
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
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
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
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
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

export function showNotification(message, theme = 'dark') {
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

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

When you change `serverUrl` or `roomId`, the Effect ["reacts" to your changes](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) and re-synchronizes. You can tell by the console messages that the chat re-connects every time that you change your Effect's dependencies.
<Trans>`serverUrl` 혹은 `roomId` 를 변경할 때마다 Effect는 [변화에 “반응"](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)하고 재동기화 됩니다. Effect의 종속성을 변경할 때마다 채팅이 다시 연결된다는 것은 콘솔 메시지를 통해 알 수 있습니다.</Trans>

Now move the Effect's code into a custom Hook:
<Trans>이제 Effect 코드를 커스텀 훅으로 옮깁니다:</Trans>

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

This lets your `ChatRoom` component call your custom Hook without worrying about how it works inside:
<Trans>이것은 `ChatRoom` 컴포넌트가 내부에서 어떻게 작동하는지 걱정할 필요 없이 사용자 지정 훅을 호출할 수 있습니다:</Trans>

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

This looks much simpler! (But it does the same thing.)
<Trans>이렇게 하면 더 간단해 보입니다! (하지만 기능상 동일합니다.)</Trans>

Notice that the logic *still responds* to prop and state changes. Try editing the server URL or the selected room:
<Trans>이 로직이 *여전히 prop과 state 변화에 반응*한다는 것을 주목하세요. 서버 URL과 선택한 room을 편집해보세요:</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  // 실제 구현은 진짜 서버로 연결됩니다
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
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
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
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
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

export function showNotification(message, theme = 'dark') {
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

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Notice how you're taking the return value of one Hook:
<Trans>하나의 훅의 값을 어떻게 리턴했는지 주목하세요:</Trans>

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

and pass it as an input to another Hook:
<Trans>그리고 다른 훅에 인풋으로 전달합니다:</Trans>

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

Every time your `ChatRoom` component re-renders, it passes the latest `roomId` and `serverUrl` to your Hook. This is why your Effect re-connects to the chat whenever their values are different after a re-render. (If you ever worked with audio or video processing software, chaining Hooks like this might remind you of chaining visual or audio effects. It's as if the output of `useState` "feeds into" the input of the `useChatRoom`.)
<Trans>`ChatRoom` 컴포넌트가 다시 렌더링할 때마다 최신 `roomId`와`serverUrl`을 Hook에 전달합니다. 이것이 바로 리렌더링 후 값이 달라질 때마다 Effect가 채팅에 다시 연결되는 이유입니다. (음악 처리 소프트웨어로 작업해 본 적이 있다면 이런 식으로 Hook을 연결하면 리버브나 코러스 추가와 같이 여러 오디오 효과를 연결하는 것을 떠올릴 수 있습니다. 마치 `useState`의 출력이 `useChatRoom`의 입력에 '피드' 되는 것과 같습니다.)</Trans>

### Passing event handlers to custom Hooks<Trans>커스텀훅에게 이벤트 핸들러 전달하기</Trans> {/*passing-event-handlers-to-custom-hooks*/}

<Wip>

This section describes an **experimental API that has not yet been released** in a stable version of React.
<Trans>이 섹션에서는 **아직 React에 추가되지 않은 실험적인 API**에 대해 설명하며, 아직 사용할 수 없습니다.</Trans>

</Wip>

As you start using `useChatRoom` in more components, you might want to let components customize its behavior. For example, currently, the logic for what to do when a message arrives is hardcoded inside the Hook:
<Trans>더 많은 컴포넌트에서 `useChatRoom`을 사용하기 시작하면 다른 컴포넌트에서 그 동작을 사용자 정의할 수 있을 것입니다. 예를 들어, 현재 메시지가 도착했을 때 무엇을 해야 하는지에 대한 로직은 Hook 내부에 하드코딩되어 있습니다:</Trans>

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Let's say you want to move this logic back to your component:
<Trans>만약에 이 로직을 다시 컴포넌트 안으로 이동하고 싶다고 가정해 봅시다.</Trans>

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
```

To make this work, change your custom Hook to take `onReceiveMessage` as one of its named options:
<Trans>이 기능을 사용하려면 커스텀 훅을 변경하여 `onReceiveMessage` 를 이름 옵션 중 하나로 사용하세요.</Trans>

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ All dependencies declared
                                             // ✅ 모든 의존성이 선언됨
}
```

This will work, but there's one more improvement you can do when your custom Hook accepts event handlers.
<Trans>이 방법은 작동하지만 커스텀 Hook이 이벤트 핸들러를 수락할 때 한 가지 더 개선할 수 있습니다.</Trans>

Adding a dependency on `onReceiveMessage` is not ideal because it will cause the chat to re-connect every time the component re-renders. [Wrap this event handler into an Effect Event to remove it from the dependencies:](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)
<Trans>`onReceiveMessage`에 종속성을 추가하면 컴포넌트가 다시 렌더링될 때마다 채팅이 다시 연결되므로 이상적이지 않습니다. [이 이벤트 핸들러를 Effect Event로 래핑하여 종속성에서 제거하세요:](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)</Trans>

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
                           // ✅ 모든 의존성이 선언됨
}
```

Now the chat won't re-connect every time that the `ChatRoom` component re-renders. Here is a fully working demo of passing an event handler to a custom Hook that you can play with:
<Trans>이제 `ChatRoom` 컴포넌트가 다시 렌더링할 때마다 채팅이 다시 연결되지 않습니다. 다음은 이벤트 핸들러를 커스텀 Hook에 전달하는 데모입니다:</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js useChatRoom.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  // 실제 구현은 진짜 서버로 연결됩니다
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
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
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
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
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

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Notice how you no longer need to know *how* `useChatRoom` works in order to use it. You could add it to any other component, pass any other options, and it would work the same way. That's the power of custom Hooks.
<Trans>이제 더 이상 `useChatRoom`이 *어떻게* 작동하는지 알 필요 없이 사용할 수 있습니다. 다른 컴포넌트에 추가하고 다른 옵션을 전달해도 동일한 방식으로 작동합니다. 이것이 바로 커스텀 Hook의 힘입니다.</Trans>

## When to use custom Hooks<Trans>언제 커스텀 훅을 사용할 것인가</Trans> {/*when-to-use-custom-hooks*/}

You don't need to extract a custom Hook for every little duplicated bit of code. Some duplication is fine. For example, extracting a `useFormInput` Hook to wrap a single `useState` call like earlier is probably unnecessary.
<Trans>중복되는 모든 코드에 대해 커스텀 훅을 추출할 필요는 없습니다. 약간의 중복은 괜찮습니다. 예를 들어, 앞서처럼 단일 `useState` 호출을 감싸기 위해 `useFormInput` 훅을 추출하는 것은 불필요할 수 있습니다.</Trans>

However, whenever you write an Effect, consider whether it would be clearer to also wrap it in a custom Hook. [You shouldn't need Effects very often,](/learn/you-might-not-need-an-effect) so if you're writing one, it means that you need to "step outside React" to synchronize with some external system or to do something that React doesn't have a built-in API for. Wrapping it into a custom Hook lets you precisely communicate your intent and how the data flows through it.
<Trans>하지만 Effect를 작성할 때마다 커스텀 훅으로 감싸는 것이 더 명확할지 고려하세요. [Effect는 자주 필요하지 않으므로,](/learn/you-might-not-need-an-effect) 만약 Effect를 작성한다면 외부 시스템과 동기화하거나 React에 내장된 API가 없는 작업을 수행하기 위해 "React 외부로 나가야 한다"는 뜻입니다. Effect를 커스텀 훅으로 감싸면 의도와 데이터 흐름 방식을 정확하게 전달할 수 있습니다.</Trans>

For example, consider a `ShippingForm` component that displays two dropdowns: one shows the list of cities, and another shows the list of areas in the selected city. You might start with some code that looks like this:
<Trans>예를 들어, 도시 목록을 표시하는 드롭다운과 선택한 도시의 지역 목록을 표시하는 드롭다운 두 개를 표시하는 `ShippingForm` 컴포넌트를 생각해 봅시다. 다음과 같은 코드로 시작할 수 있습니다:</Trans>

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // This Effect fetches cities for a country
  // 이 Effect는 국가의 도시들을 페치합니다
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
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // This Effect fetches areas for the selected city
  // 이 Effect는 선택된 도시의 장소들을 페치합니다
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
  }, [city]);

  // ...
```

Although this code is quite repetitive, [it's correct to keep these Effects separate from each other.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) They synchronize two different things, so you shouldn't merge them into one Effect. Instead, you can simplify the `ShippingForm` component above by extracting the common logic between them into your own `useData` Hook:
<Trans>이 코드는 상당히 반복적이지만 이러한 효과는 [서로 분리하여 유지하는 것이 맞습니다.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) 서로 다른 두 가지를 동기화하므로 하나의 Effect로 병합해서는 안 됩니다. 대신, 위의 `ShippingForm` 컴포넌트 사이의 공통 로직을 자체 `useData` 훅으로 추출하여 단순화할 수 있습니다:</Trans>

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

Now you can replace both Effects in the `ShippingForm` components with calls to `useData`:
<Trans>이제 `ShippingForm` 컴포넌트의 두 효과를 모두 `useData` 호출로 바꿀 수 있습니다:</Trans>

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

Extracting a custom Hook makes the data flow explicit. You feed the `url` in and you get the `data` out. By "hiding" your Effect inside `useData`, you also prevent someone working on the `ShippingForm` component from adding [unnecessary dependencies](/learn/removing-effect-dependencies) to it. With time, most of your app's Effects will be in custom Hooks.
<Trans>커스텀 훅을 추출하면 데이터 흐름을 명시적으로 만들 수 있습니다. `url`을 입력하면 `data`를 가져올 수 있습니다. `useData` 안에 효과를 "숨기면" `ShippingForm` 컴포넌트에서 작업하는 사람이 [불필요한 종속성](/learn/removing-effect-dependencies)을 추가하는 것을 방지할 수 있습니다. 이상적으로는 시간이 지나면 앱의 효과 대부분이 커스텀 훅에 포함될 것입니다.</Trans>

<DeepDive>

#### Keep your custom Hooks focused on concrete high-level use cases<Trans>커스텀 훅은 구체적인 고수준 사용 사례에 집중하세요</Trans> {/*keep-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

Start by choosing your custom Hook's name. If you struggle to pick a clear name, it might mean that your Effect is too coupled to the rest of your component's logic, and is not yet ready to be extracted.
<Trans>먼저 커스텀 훅의 이름을 선택하세요. 명확한 이름을 고르는 데 어려움을 겪는다면 Effect가 컴포넌트의 나머지 로직과 너무 결합되어 있어 아직 추출할 준비가 되지 않았다는 의미일 수 있습니다.</Trans>

Ideally, your custom Hook's name should be clear enough that even a person who doesn't write code often could have a good guess about what your custom Hook does, what it takes, and what it returns:
<Trans>커스텀 훅의 이름은 코드를 자주 작성하지 않는 사람이라도 커스텀 훅이 무엇을 하고, 무엇을 취하고, 무엇을 반환하는지 짐작할 수 있을 정도로 명확해야 합니다:</Trans>

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

When you synchronize with an external system, your custom Hook name may be more technical and use jargon specific to that system. It's good as long as it would be clear to a person familiar with that system:
<Trans>외부 시스템과 동기화할 때 커스텀 훅의 이름은 좀 더 기술적이고 해당 시스템과 관련된 전문 용어를 사용할 수 있습니다. 해당 시스템에 익숙한 사람이 이해할 수 있는 이름이라면 괜찮습니다:</Trans>

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**Keep custom Hooks focused on concrete high-level use cases.** Avoid creating and using custom "lifecycle" Hooks that act as alternatives and convenience wrappers for the `useEffect` API itself:
<Trans>**커스텀 훅은 구체적인 고수준 사용 사례에 집중하세요.** `useEffect` API 자체에 대한 대안 및 편의 래퍼 역할을 하는 커스텀 "생명주기" 훅을 생성하거나 사용하지 마세요:</Trans>

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

For example, this `useMount` Hook tries to ensure some code only runs "on mount":
<Trans>예를 들어`useMount` 훅은 일부코드가 “마운트 할 때”에만 실행됩니다.</Trans>

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 Avoid: using custom "lifecycle" Hooks
  // 🔴 이러지 마세요: 커스텀 "생명주기" 훅 사용
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 Avoid: creating custom "lifecycle" Hooks
// 🔴 이러지 마세요: 커스텀 "라이브사이클" 훅 생성
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'fn'
          // 🔴 React 훅 useEffect에 의존성 누락: 'fn'
}
```

**Custom "lifecycle" Hooks like `useMount` don't fit well into the React paradigm.** For example, this code example has a mistake (it doesn't "react" to `roomId` or `serverUrl` changes), but the linter won't warn you about it because the linter only checks direct `useEffect` calls. It won't know about your Hook.
<Trans>**`useMount`와 같은 커스텀 "생명주기" 훅은 React 패러다임에 잘 맞지 않습니다.** 예를 들어, 이 코드 예시에는 실수가 있지만(`roomId` 및 `serverUrl`변경에 "반응"하지 않음), linter는 직접적인 `useEffect` 호출만 확인하기 때문에 경고하지 않습니다. 당신의 훅에 대해서 알지 못합니다.</Trans>

If you're writing an Effect, start by using the React API directly:
<Trans>Effect를 사용할 것이라면 React API를 직접 사용하세요:</Trans>

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Good: two raw Effects separated by purpose
  // ✅ 좋습니다: 목적별로 분리된 두 원시 Effect

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

Then, you can (but don't have to) extract custom Hooks for different high-level use cases:
<Trans>그러면 다른 고수준 사용 사례에 대한 커스텀 훅을 추출할 수 있습니다(반드시 그럴 필요는 없습니다):</Trans>

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Great: custom Hooks named after their purpose
  // ✅ 매우 좋습니다: 용도에 따라 이름을 지정한 커스텀 훅
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**A good custom Hook makes the calling code more declarative by constraining what it does.** For example, `useChatRoom(options)` can only connect to the chat room, while `useImpressionLog(eventName, extraData)` can only send an impression log to the analytics. If your custom Hook API doesn't constrain the use cases and is very abstract, in the long run it's likely to introduce more problems than it solves.
<Trans>**좋은 커스텀 훅은 호출 코드가 수행하는 작업을 제한하여 보다 선언적으로 만듭니다**. 예를 들어, `useChatRoom(options)`은 채팅방에만 연결할 수 있고, `useImpressionLog(eventName, extraData)`는 애널리틱스에 노출 로그만 전송할 수 있습니다. 커스텀 훅 API가 사용 사례를 제한하지 않고 매우 추상적일 경우, 장기적으로는 해결하는 것보다 더 많은 문제를 야기할 가능성이 높습니다.</Trans>

</DeepDive>

### Custom Hooks help you migrate to better patterns<Trans>커스텀 훅은 더 나은 패턴으로 마이그레이션하는데 도움을 줍니다.</Trans> {/*custom-hooks-help-you-migrate-to-better-patterns*/}

Effects are an ["escape hatch"](/learn/escape-hatches): you use them when you need to "step outside React" and when there is no better built-in solution for your use case. With time, the React team's goal is to reduce the number of the Effects in your app to the minimum by providing more specific solutions to more specific problems. Wrapping your Effects in custom Hooks makes it easier to upgrade your code when these solutions become available.
<Trans>Effect는 ["탈출구"](/learn/escape-hatches):입니다. "React를 벗어나야 할 때", 그리고 사용 사례에 더 나은 내장 솔루션이 없을 때 사용합니다. 시간이 지남에 따라 React 팀의 목표는 더 구체적인 문제에 대한 더 구체적인 솔루션을 제공함으로써 앱에서 Effect의 수를 최소한으로 줄이는 것입니다. 효과를 커스텀 훅으로 감싸면 이러한 솔루션이 제공될 때 코드를 더 쉽게 업그레이드할 수 있습니다.</Trans>

Let's return to this example:
<Trans>이 예제로 돌아가 보겠습니다:</Trans>

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

In the above example, `useOnlineStatus` is implemented with a pair of [`useState`](/reference/react/useState) and [`useEffect`.](/reference/react/useEffect) However, this isn't the best possible solution. There is a number of edge cases it doesn't consider. For example, it assumes that when the component mounts, `isOnline` is already `true`, but this may be wrong if the network already went offline. You can use the browser [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) API to check for that, but using it directly would not work on the server for generating the initial HTML. In short, this code could be improved.
<Trans>위의 예제에서는,  [`useState`](/reference/react/useState)와 [`useEffect`](/reference/react/useEffect)의 페어로 `useOnlineStatus`를 구성했습니다. 하지만 이것은 최적의 방법은 아닙니다. 고려하지 않은 여러 케이스들이 있습니다.예를 들어, 컴포넌트가 마운트될 때 `isOnline`이 이미 `true`라고 가정하지만, 네트워크가 이미 오프라인 상태였다면 이는 틀릴 수 있습니다. 브라우저 [`navigator.onLine`](https://developer.mozilla.org/ko/docs/Web/API/Navigator/onLine) API를 사용하여 이를 확인할 수 있지만, 서버에서 React 앱을 실행하여 초기 HTML을 생성하는 경우 이를 직접 사용하면 코드가 깨질 수 있습니다. 요컨대, 이 코드는 개선될 수 있습니다.</Trans>

Luckily, React 18 includes a dedicated API called [`useSyncExternalStore`](/reference/react/useSyncExternalStore) which takes care of all of these problems for you. Here is how your `useOnlineStatus` Hook, rewritten to take advantage of this new API:
<Trans>다행히 React 18에는 이 모든 문제를 해결해 주는 [`useSyncExternalStore`](/reference/react/useSyncExternalStore)라는 전용 API가 포함되어 있습니다. 이 새로운 API를 활용하기 위해 재작성된 `useOnlineStatus` 훅은 다음과 같습니다:</Trans>

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // How to get the value on the client
                            // 클라이언트에서 값을 가져오는 방법
    () => true // How to get the value on the server
               // 서버에서 값을 가져오는 방법
  );
}
```

</Sandpack>

Notice how **you didn't need to change any of the components** to make this migration:
<Trans>이 마이그레이션을 위해 **컴포넌트를 변경할 필요가 없다는 점**을 주목하세요:</Trans>

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

This is another reason for why wrapping Effects in custom Hooks is often beneficial:
<Trans>이것이 커스텀 훅으로 효과를 래핑하는 것이 종종 유익한 또 다른 이유입니다:</Trans>

1. You make the data flow to and from your Effects very explicit.
2. You let your components focus on the intent rather than on the exact implementation of your Effects.
3. When React adds new features, you can remove those Effects without changing any of your components.
<TransBlock>
1. Effect와의 데이터 흐름을 매우 명확하게 만들 수 있습니다.
2. 컴포넌트가 효과의 정확한 구현보다는 의도에 집중할 수 있습니다.
3. React가 새로운 기능을 추가할 때 컴포넌트를 변경하지 않고도 해당 효과를 제거할 수 있습니다.
</TransBlock>

Similar to a [design system,](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969) you might find it helpful to start extracting common idioms from your app's components into custom Hooks. This will keep your components' code focused on the intent, and let you avoid writing raw Effects very often. Many excellent custom Hooks are maintained by the React community.
<Trans>[디자인 시스템](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)과 유사하게 앱의 컴포넌트에서 공통된 관용구를 추출하여 커스텀 훅으로 만드는 것이 도움이 될 수 있습니다. 이렇게 하면 컴포넌트의 코드가 의도에 집중할 수 있고, 원시 효과를 자주 작성하는 것을 피할 수 있습니다. React 커뮤니티에서 관리하고 있는 훌륭한 커스텀 훅도 많이 있습니다.</Trans>

<DeepDive>

#### Will React provide any built-in solution for data fetching?<Trans>React는 데이터 페칭을 위해 내장 솔루션을 제공할건가요?</Trans> {/*will-react-provide-any-built-in-solution-for-data-fetching*/}

We're still working out the details, but we expect that in the future, you'll write data fetching like this:
<Trans>아직 세부 사항을 작업 중이지만, 앞으로는 다음과 같이 데이터 페칭을 할 수 있을 것으로 예상합니다:</Trans>

```js {1,4,6}
import { use } from 'react'; // Not available yet! 
                             // 아직 동작하지 않습니다!
function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

If you use custom Hooks like `useData` above in your app, it will require fewer changes to migrate to the eventually recommended approach than if you write raw Effects in every component manually. However, the old approach will still work fine, so if you feel happy writing raw Effects, you can continue to do that.
<Trans>앱에서 위의 `useData`와 같은 커스텀 훅을 사용하면 모든 컴포넌트에 원시 Effect를 수동으로 작성하는 것보다 최종적으로 권장되는 접근 방식으로 마이그레이션하는 데 더 적은 변경이 필요할 것입니다. 다만 이전 접근 방식도 여전히 잘 작동하므로 원시 Effect를 작성하는 것이 만족스럽다면 계속 사용할 수 있습니다.</Trans>

</DeepDive>

### There is more than one way to do it<Trans>여러가지 방법이 있습니다</Trans> {/*there-is-more-than-one-way-to-do-it*/}

Let's say you want to implement a fade-in animation *from scratch* using the browser [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) API. You might start with an Effect that sets up an animation loop. During each frame of the animation, you could change the opacity of the DOM node you [hold in a ref](/learn/manipulating-the-dom-with-refs) until it reaches `1`. Your code might start like this:
<Trans>브라우저 요청 [`requestAnimationFrame`](https://developer.mozilla.org/ko/docs/Web/API/window/requestAnimationFrame) API를 사용하여 페이드인 애니메이션을 *처음부터* 구현한다고 가정해 보겠습니다. 애니메이션 루프를 설정하는 효과로 시작할 수 있습니다. 애니메이션의 각 프레임 동안 [ref로 유지하는](/learn/manipulating-the-dom-with-refs) DOM 노드의 불투명도를 `1`에 도달할 때까지 변경할 수 있습니다. 코드는 다음과 같이 시작할 수 있습니다:</Trans>

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // We still have more frames to paint
        // 아직 칠해야 할 프레임이 남아있습니다
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

To make the component more readable, you might extract the logic into a `useFadeIn` custom Hook:
<Trans>컴포넌트의 가독성을 높이기 위해 로직을 `useFadeIn` 커스텀 훅으로 추출할 수 있습니다:</Trans>

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // We still have more frames to paint
        // 아직 칠해야 할 프레임이 남아있습니다
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

You could keep the `useFadeIn` code as is, but you could also refactor it more. For example, you could extract the logic for setting up the animation loop out of `useFadeIn` into a custom `useAnimationLoop` Hook:
<Trans>`useFadeIn` 코드를 그대로 유지할 수도 있지만 더 리팩토링할 수도 있습니다. 예를 들어, 애니메이션 루프를 설정하는 로직을 `useFadeIn`에서 추출하여 `useAnimationLoop`라는 새로운 커스텀 훅으로 만들 수 있습니다:</Trans>

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js useFadeIn.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

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

</Sandpack>

However, you didn't *have to* do that. As with regular functions, ultimately you decide where to draw the boundaries between different parts of your code. You could also take a very different approach. Instead of keeping the logic in the Effect, you could move most of the imperative logic inside a JavaScript [class:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
<Trans>하지만 꼭 그렇게 할 필요는 없습니다. 일반 함수와 마찬가지로 궁극적으로 코드의 여러 부분 사이의 경계를 어디에 그릴지는 사용자가 결정합니다. 예를 들어 매우 다른 접근 방식을 취할 수도 있습니다. Effect에 로직을 유지하는 대신 대부분의 명령형 로직을 JavaScript [클래스](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes) 내부로 옮길 수 있습니다:</Trans>

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
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
    if (progress === 1) {
      this.stop();
    } else {
      // We still have more frames to paint
      // 아직 칠해야 할 프레임이 남아있습니다
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
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Effects let you connect React to external systems. The more coordination between Effects is needed (for example, to chain multiple animations), the more it makes sense to extract that logic out of Effects and Hooks *completely* like in the sandbox above. Then, the code you extracted *becomes* the "external system". This lets your Effects stay simple because they only need to send messages to the system you've moved outside React.
<Trans>Effects를 사용하면 React를 외부 시스템에 연결할 수 있습니다. 예를 들어 여러 애니메이션을 체인으로 연결하기 위해 효과 간의 조정이 더 많이 필요할수록 위의 샌드박스에서처럼 효과와 훅에서 해당 로직을 완전히 추출하는 것이 더 합리적입니다. 그러면 추출한 코드가 "외부 시스템"이 됩니다. 이렇게 하면 React 외부로 이동한 시스템으로 메시지를 보내기만 하면 되기 때문에 Effects를 단순하게 유지할 수 있습니다.</Trans>

The examples above assume that the fade-in logic needs to be written in JavaScript. However, this particular fade-in animation is both simpler and much more efficient to implement with a plain [CSS Animation:](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)
<Trans>위의 예시에서는 페이드인 로직이 JavaScript로 작성되어야 한다고 가정했습니다. 하지만 이 특정 페이드인 애니메이션은 일반 [CSS 애니메이션](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Animations/Using_CSS_animations)으로 구현하는 것이 더 간단하고 훨씬 더 효율적입니다:</Trans>

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

Sometimes, you don't even need a Hook!
<Trans>때로는 훅이 전혀 필요 없을 때도 있습니다!</Trans>

<Recap>

- Custom Hooks let you share logic between components.
- Custom Hooks must be named starting with `use` followed by a capital letter.
- Custom Hooks only share stateful logic, not state itself.
- You can pass reactive values from one Hook to another, and they stay up-to-date.
- All Hooks re-run every time your component re-renders.
- The code of your custom Hooks should be pure, like your component's code.
- Wrap event handlers received by custom Hooks into Effect Events.
- Don't create custom Hooks like `useMount`. Keep their purpose specific.
- It's up to you how and where to choose the boundaries of your code.
<TransBlock>
- 커스텀 훅을 사용하면 컴포넌트 간에 로직을 공유할 수 있습니다.
- 커스텀 훅의 이름은 `use`로 시작하고 대문자로 끝나야 합니다.
- 커스텀 훅은 상태적 로직만 공유하며 state 자체는 공유하지 않습니다.
- 반응형 값을 한 훅에서 다른 훅으로 전달할 수 있으며 최신 state로 유지됩니다.
- 컴포넌트가 다시 렌더링될 때마다 모든 훅이 다시 실행됩니다.
- 커스텀 훅의 코드는 컴포넌트의 코드와 같이 순수해야 합니다.
- 커스텀 훅이 수신한 이벤트 핸들러를 Effect Event로 래핑하세요.
- `useMount`와 같은 커스텀 훅을 만들지 마세요. 용도를 명확히 하세요.
- 코드의 경계를 어디에서 어떻게 선택할지는 여러분이 결정할 수 있습니다.
</TransBlock>

</Recap>

<Challenges>

#### Extract a `useCounter` Hook<Trans>`useCounter` 훅 추출하기</Trans> {/*extract-a-usecounter-hook*/}

This component uses a state variable and an Effect to display a number that increments every second. Extract this logic into a custom Hook called `useCounter`. Your goal is to make the `Counter` component implementation look exactly like this:
<Trans>이 컴포넌트는 state 변수와 Effect를 사용해 매초마다 증가하는 숫자를 표시합니다. 이 로직을 `useCounter`라는 커스텀 훅으로 추출합니다. 목표는 `Counter` 컴포넌트 구현을 다음과 같이 만드는 것입니다:</Trans>

```js
export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

You'll need to write your custom Hook in `useCounter.js` and import it into the `Counter.js` file.
<Trans>`useCounter.js`에 커스텀 훅을 작성하고 이를 `Counter.js` 파일로 가져와야 합니다.</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
// Write your custom Hook in this file!
```

</Sandpack>

<Solution>

Your code should look like this:
<Trans>아래의 코드처럼 작성되어야 합니다:</Trans>

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

Notice that `App.js` doesn't need to import `useState` or `useEffect` anymore.
<Trans>`App.js`는 더 이상 `useState`나 `useEffect`를 import 할 필요가 없습니다.</Trans>

</Solution>

#### Make the counter delay configurable<Trans>카운터 지연을 구성 가능하게 만들기</Trans> {/*make-the-counter-delay-configurable*/}

In this example, there is a `delay` state variable controlled by a slider, but its value is not used. Pass the `delay` value to your custom `useCounter` Hook, and change the `useCounter` Hook to use the passed `delay` instead of hardcoding `1000` ms.
<Trans>이 예시에서는 슬라이더로 제어되는 `delay` 되는 state 변수가 있지만 그 값은 사용되지 않습니다. `delay`값을 커스텀 훅인 `useCounter`에 전달하고, 1000ms를 하드코딩하는 대신 전달된 `delay`을 사용하도록 `useCounter` 훅을 변경하세요.</Trans>

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

Pass the `delay` to your Hook with `useCounter(delay)`. Then, inside the Hook, use `delay` instead of the hardcoded `1000` value. You'll need to add `delay` to your Effect's dependencies. This ensures that a change in `delay` will reset the interval.
<Trans>`useCounter(delay)`로 `delay`를 훅에 전달합니다. 그런 다음 훅 내부에서 하드코딩된 `1000` 값 대신 `delay`를 사용합니다. Effect의 종속성에 `delay`를 추가해야 합니다. 이렇게 하면 `delay`가 변경되면 interval이 재설정됩니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### Extract `useInterval` out of `useCounter`<Trans>`useCounter`에서 `useInterval` 추출하기</Trans> {/*extract-useinterval-out-of-usecounter*/}

Currently, your `useCounter` Hook does two things. It sets up an interval, and it also increments a state variable on every interval tick. Split out the logic that sets up the interval into a separate Hook called `useInterval`. It should take two arguments: the `onTick` callback, and the `delay`. After this change, your `useCounter` implementation should look like this:
<Trans>현재 사용 중인 `useCounter` 훅은 두 가지 작업을 수행합니다. interval을 설정하고 간격이 tick 될 때마다 state 변수를 증가시킵니다. interval을 설정하는 로직을 `useInterval`이라는 별도의 훅으로 분리하세요. 이 훅은 `onTick` 과`delay` 라는 두 개의 인수를 받아야 합니다. 이렇게 변경하면 `useCounter`구현은 다음과 같이 보일 것입니다:</Trans>

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

Write `useInterval` in the `useInterval.js` file and import it into the `useCounter.js` file.
<Trans>`useInterval`와 `useInterval.js`의 파일을 작성하고 `useCounter.js` 파일에 import 하세요.</Trans>

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js useInterval.js
// Write your Hook here!
```

</Sandpack>

<Solution>

The logic inside `useInterval` should set up and clear the interval. It doesn't need to do anything else.
<Trans>`useInterval` 내부의 로직에서 간격을 설정하고 지워야 합니다. 다른 작업은 할 필요가 없습니다.</Trans>

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

Note that there is a bit of a problem with this solution, which you'll solve in the next challenge.
<Trans>이 정답에는 약간의 문제가 있는데, 다음 도전 과제에서 해결할 것입니다.</Trans>

</Solution>

#### Fix a resetting interval<Trans>인터벌 리셋 고치기</Trans> {/*fix-a-resetting-interval*/}

In this example, there are *two* separate intervals.
<Trans>이 예시에서는 두 개의 별도의 인터벌이 있습니다.</Trans>

The `App` component calls `useCounter`, which calls `useInterval` to update the counter every second. But the `App` component *also* calls `useInterval` to randomly update the page background color every two seconds.
<Trans>`App`컴포넌트는`useCounter`를 호출하고, 이 컴포넌트는 `useInterval`을 호출하여 매 초마다 카운터를 업데이트합니다. 그러나 `App`컴포넌트는 2초마다 페이지 배경색을 임의로 업데이트하기 위해 `useInterval`도 호출합니다.</Trans>

For some reason, the callback that updates the page background never runs. Add some logs inside `useInterval`:
<Trans>어떤 이유에서인지 페이지 배경을 업데이트하는 콜백이 실행되지 않습니다. `useInterval`안에 몇 가지 로그를 추가하세요.</Trans>

```js {2,5}
  useEffect(() => {
    console.log('✅ Setting up an interval with delay ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Clearing an interval with delay ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

Do the logs match what you expect to happen? If some of your Effects seem to re-synchronize unnecessarily, can you guess which dependency is causing that to happen? Is there some way to [remove that dependency](/learn/removing-effect-dependencies) from your Effect?
<Trans>로그가 예상한 것과 일치하나요? 일부 Effect가 불필요하게 재동기화되는 것 같다면 어떤 종속성 때문에 그런 일이 발생하는지 짐작할 수 있나요? Effect에서 해당 [종속성을 제거](/learn/removing-effect-dependencies)할 수 있는 방법이 있나요?</Trans>

After you fix the issue, you should expect the page background to update every two seconds.
<Trans>문제를 해결한 후에는 페이지 배경이 2초마다 업데이트되어야 합니다.</Trans>

<Hint>

It looks like your `useInterval` Hook accepts an event listener as an argument. Can you think of some way to wrap that event listener so that it doesn't need to be a dependency of your Effect?
<Trans>`useInterval` 훅이 이벤트 리스너를 인수로 받아들이는 것 같습니다. 이벤트 리스너가 Effect의 종속성이 될 필요가 없도록 이벤트 리스너를 감싸는 방법을 생각해낼 수 있을까요?</Trans>

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

Inside `useInterval`, wrap the tick callback into an Effect Event, as you did [earlier on this page.](/learn/reusing-logic-with-custom-hooks#passing-event-handlers-to-custom-hooks)
<Trans>`useInterval` 내에서 [이 페이지의 앞부분에서 한 것처럼](/learn/reusing-logic-with-custom-hook#passing-event-handlers-to-custom-hook) tick 콜백을 효과 이벤트에 래핑합니다.</Trans>

This will allow you to omit `onTick` from dependencies of your Effect. The Effect won't re-synchronize on every re-render of the component, so the page background color change interval won't get reset every second before it has a chance to fire.
<Trans>이렇게 하면 Effect의 종속성에서 `onTick`을 생략할 수 있습니다. 컴포넌트를 다시 렌더링할 때마다 Effect가 다시 동기화되지 않으므로 페이지 배경색 변경 간격이 매초마다 재설정되지 않고 실행될 수 있습니다.</Trans>

With this change, both intervals work as expected and don't interfere with each other:
<Trans>해당 변경으로 두 간격이 모두 예상대로 작동하며 서로 간섭하지 않습니다:</Trans>

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js active
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### Implement a staggering movement<Trans>비틀거리는 움직임 구현하기</Trans> {/*implement-a-staggering-movement*/}

In this example, the `usePointerPosition()` Hook tracks the current pointer position. Try moving your cursor or your finger over the preview area and see the red dot follow your movement. Its position is saved in the `pos1` variable.
<Trans>이 예시에서는 `usePointerPosition()`훅이 현재 포인터 위치를 추적합니다. 미리보기 영역 위로 커서나 손가락을 움직이면 빨간색 점이 움직임을 따라가는 것을 확인하세요. 그 위치는 `pos1` 변수에 저장됩니다.</Trans>

In fact, there are five (!) different red dots being rendered. You don't see them because currently they all appear at the same position. This is what you need to fix. What you want to implement instead is a "staggered" movement: each dot should "follow" the previous dot's path. For example, if you quickly move your cursor, the first dot should follow it immediately, the second dot should follow the first dot with a small delay, the third dot should follow the second dot, and so on.
<Trans>실제로는 다섯 개(!)의 다른 빨간색 점이 렌더링되고 있습니다. 현재는 모두 같은 위치에 나타나기 때문에 보이지 않습니다. 이 부분을 수정해야 합니다. 대신 구현하려는 것은 "엇갈린" 움직임입니다. 각 점이 이전 점의 경로를 "따라야" 합니다. 예를 들어 커서를 빠르게 이동하면 첫 번째 점은 즉시 따라가고, 두 번째 점은 약간의 지연을 두고 첫 번째 점을 따라가고, 세 번째 점은 두 번째 점을 따라가는 등의 방식으로 커서를 이동해야 합니다.</Trans>

You need to implement the `useDelayedValue` custom Hook. Its current implementation returns the `value` provided to it. Instead, you want to return the value back from `delay` milliseconds ago. You might need some state and an Effect to do this.
<Trans>`useDelayedValue` 커스텀 훅을 구현해야 합니다. 현재 구현은 제공된 값을 반환합니다. 대신 밀리초 전 `delay`에서 값을 다시 반환하고 싶습니다. 이를 위해서는 state와 Effect가 필요할 수 있습니다.</Trans>

After you implement `useDelayedValue`, you should see the dots move following one another.
<Trans>`useDelayedValue`을 구현하고 나면 점들이 서로 따라 움직이는 것을 볼 수 있어야합니다</Trans>

<Hint>

You'll need to store the `delayedValue` as a state variable inside your custom Hook. When the `value` changes, you'll want to run an Effect. This Effect should update `delayedValue` after the `delay`. You might find it helpful to call `setTimeout`.
<Trans>`delayedValue`을 커스텀 훅 안에 state 변수로 저장해야 합니다. `value`가 변경되면 Effect를 실행하고 싶을 것입니다. 이 Effect는 `delay` 이후에 `delayedValue`를 업데이트해야 합니다. `setTimeout`을 호출하는 것이 도움이 될 수 있습니다.</Trans>

Does this Effect need cleanup? Why or why not?
<Trans>Effect를 정리해야 하나요? 왜 또는 왜 하지 말아야 하나요?</Trans>

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: Implement this Hook
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

Here is a working version. You keep the `delayedValue` as a state variable. When `value` updates, your Effect schedules a timeout to update the `delayedValue`. This is why the `delayedValue` always "lags behind" the actual `value`.
<Trans>다음은 작동하는 버전입니다. `delayedValue`을 state 변수로 유지합니다. `value`가 업데이트될 때 Effect는 timeout을 예약하여 `delayedValue`를 업데이트합니다. 이것이 바로 `delayedValue`가 항상 실제 `value`보다 "뒤처지는" 이유입니다.</Trans>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

Note that this Effect *does not* need cleanup. If you called `clearTimeout` in the cleanup function, then each time the `value` changes, it would reset the already scheduled timeout. To keep the movement continuous, you want all the timeouts to fire.
<Trans>Effect는 정리가 *필요하지 않다*는 점에 유의하세요. cleanup 함수에서 `clearTimeout`을 호출하면 `value`가 변경될 때마다 이미 예약된 timeout이 재설정됩니다. 동작을 계속 유지하려면 모든 timeout이 실행되기를 원합니다.</Trans>

</Solution>

</Challenges>
