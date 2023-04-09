---
title: You Might Not Need an Effect
translatedTitle: Effect가 필요하지 않을 수도 있습니다
translators: [안예지, 정재남]
---

<Intro>

Effects are an escape hatch from the React paradigm. They let you "step outside" of React and synchronize your components with some external system like a non-React widget, network, or the browser DOM. If there is no external system involved (for example, if you want to update a component's state when some props or state change), you shouldn't need an Effect. Removing unnecessary Effects will make your code easier to follow, faster to run, and less error-prone.
<Trans>Effect는 React 패러다임에서 벗어날 수 있는 탈출구입니다. Effect를 사용하면 React의 "외부로 나가서" 컴포넌트를 React가 아닌 위젯, 네트워크 또는 브라우저 DOM과 같은 외부 시스템과 동기화할 수 있습니다. 외부 시스템이 관여하지 않는 경우(예: 일부 props나 state가 변경될 때 컴포넌트의 state를 업데이트하려는 경우)에는 Effect가 필요하지 않습니다. 불필요한 Effect를 제거하면 코드를 더 쉽게 따라갈 수 있고, 실행 속도가 빨라지며, 오류 발생 가능성이 줄어듭니다.</Trans>

</Intro>

<YouWillLearn>

* Why and how to remove unnecessary Effects from your components
* How to cache expensive computations without Effects
* How to reset and adjust component state without Effects
* How to share logic between event handlers
* Which logic should be moved to event handlers
* How to notify parent components about changes

<TransBlock>
- 컴포넌트에서 불필요한 Effect를 제거하는 이유와 방법
- Effect 없이 값비싼 계산을 캐시하는 방법
- Effect 없이 컴포넌트 state를 리셋하고 조정하는 방법
- 이벤트 핸들러 간에 로직을 공유하는 방법
- 이벤트 핸들러로 이동되어야 하는 로직
- 부모 컴포넌트에 변경 사항을 알리는 방법
</TransBlock>
</YouWillLearn>

## How to remove unnecessary Effects<Trans>불필요한 Effect를 제거하는 방법</Trans> {/*how-to-remove-unnecessary-effects*/}

There are two common cases in which you don't need Effects:
<Trans>Effect가 필요하지 않은 흔한 경우는 두 가지가 있습니다:</Trans>

* **You don't need Effects to transform data for rendering.** For example, let's say you want to filter a list before displaying it. You might feel tempted to write an Effect that updates a state variable when the list changes. However, this is inefficient. When you update the state, React will first call your component functions to calculate what should be on the screen. Then React will ["commit"](/learn/render-and-commit) these changes to the DOM, updating the screen. Then React will run your Effects. If your Effect *also* immediately updates the state, this restarts the whole process from scratch! To avoid the unnecessary render passes, transform all the data at the top level of your components. That code will automatically re-run whenever your props or state change.
<Trans>**렌더링을 위해 데이터를 변환하는 경우 Effect는 필요하지 않습니다.** 예를 들어 목록을 표시하기 전에 필터링하고 싶다고 가정해 봅시다. 목록이 변경될 때 state 변수를 업데이트하는 Effect를 작성하고 싶을 수 있습니다. 하지만 이는 비효율적입니다. 컴포넌트의 state를 업데이트할 때 React는 먼저 컴포넌트 함수를 호출해 화면에 표시될 내용을 계산합니다. 다음으로 이러한 변경 사항을 DOM에 ["commit"](/learn/render-and-commit)하여 화면을 업데이트하고, 그 후에 Effect를 실행합니다. 만약 Effect "역시" state를 즉시 업데이트한다면, 이로 인해 전체 프로세스가 처음부터 다시 시작될 것입니다! 불필요한 렌더링을 피하려면 모든 데이터 변환을 컴포넌트의 최상위 레벨에서 하세요. 그러면 props나 state가 변경될 때마다 해당 코드가 자동으로 다시 실행될 것입니다.</Trans>

* **You don't need Effects to handle user events.** For example, let's say you want to send an `/api/buy` POST request and show a notification when the user buys a product. In the Buy button click event handler, you know exactly what happened. By the time an Effect runs, you don't know *what* the user did (for example, which button was clicked). This is why you'll usually handle user events in the corresponding event handlers.
<Trans>**사용자 이벤트를 처리하는 데에 Effect는 필요하지 않습니다.** 예를 들어 사용자가 제품을 구매할 때 `/api/buy` POST 요청을 전송하고 알림을 표시하고 싶다고 합시다. 구매 버튼 클릭 이벤트 핸들러에서는 정확히 어떤 일이 일어났는지 알 수 있습니다. 반면 Effect는 사용자가 무엇을 했는지(예: 어떤 버튼을 클릭했는지)를 알 수 없습니다. 그렇기 때문에 일반적으로 사용자 이벤트를 해당 이벤트 핸들러에서 처리합니다.</Trans>

You *do* need Effects to [synchronize](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events) with external systems. For example, you can write an Effect that keeps a jQuery widget synchronized with the React state. You can also fetch data with Effects: for example, you can synchronize the search results with the current search query. Keep in mind that modern [frameworks](/learn/start-a-new-react-project#production-grade-react-frameworks) provide more efficient built-in data fetching mechanisms than writing Effects directly in your components.
<Trans>한편 외부 시스템과 [동기화](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)하려면 Effect가 *필요*합니다. 예를 들어 jQuery 위젯을 React state와 동기화하는 Effect를 작성할 수 있습니다. 또한 검색 결과를 현재의 검색 쿼리와 동기화하기 위해 데이터 요청을 Effect로 처리할 수 있습니다. 최신 [프레임워크](/learn/start-a-new-react-project#building-with-a-full-featured-framework)는 컴포넌트에 직접 Effects를 작성하는 것보다 더 효율적인 내장 데이터 페칭 메커니즘을 제공한다는 점을 명심하세요.</Trans>

To help you gain the right intuition, let's look at some common concrete examples!
<Trans>올바른 직관을 얻기 위해 몇 가지 일반적인 구체적인 예를 살펴봅시다!</Trans>

### Updating state based on props or state<Trans>props 또는 state에 따라 state 업데이트하기</Trans> {/*updating-state-based-on-props-or-state*/}

Suppose you have a component with two state variables: `firstName` and `lastName`. You want to calculate a `fullName` from them by concatenating them. Moreover, you'd like `fullName` to update whenever `firstName` or `lastName` change. Your first instinct might be to add a `fullName` state variable and update it in an Effect:
<Trans>`firstName`과 `lastName`이라는 두 개의 state 변수가 있는 컴포넌트를 가정해 봅시다. 이 두 변수를 연결하여 `fullName`을 계산하고 싶습니다. 또한, `firstName` 또는 `lastName`이 변경될 때마다 `fullName`이 업데이트되기를 원합니다. 가장 먼저 생각나는 것은 `fullName` state 변수를 추가하고 Effect에서 업데이트하는 것일 수 있습니다:</Trans>

```js {5-10}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: redundant state and unnecessary Effect
  // 🔴 이러지 마세요: 중복 state 및 불필요한 Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

This is more complicated than necessary. It is inefficient too: it does an entire render pass with a stale value for `fullName`, then immediately re-renders with the updated value. Remove the state variable and the Effect:
<Trans>이는 필요 이상으로 복잡하고 비효율적입니다: 전체 렌더링 과정에서 `fullName`에 대한 오래된 값을 사용한 다음, 즉시 업데이트된 값으로 다시 렌더링합니다. state 변수와 Effect를 모두 제거하세요:</Trans>

```js {4-6}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  // ✅ 좋습니다: 렌더링 과정 중에 계산
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**When something can be calculated from the existing props or state, [don't put it in state.](/learn/choosing-the-state-structure#avoid-redundant-state) Instead, calculate it during rendering.** This makes your code faster (you avoid the extra "cascading" updates), simpler (you remove some code), and less error-prone (you avoid bugs caused by different state variables getting out of sync with each other). If this approach feels new to you, [Thinking in React](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state) explains what should go into state.
<Trans>**기존 props나 state에서 계산할 수 있는 것이 있으면 [state에 넣지 마세요.](/learn/choosing-the-state-structure#avoid-redundant-state) 대신 렌더링 중에 계산하세요.** 이렇게 하면 코드가 더 빨라지고(추가적인 "계단식" 업데이트를 피함), 더 간단해지고(일부 코드 제거), 오류가 덜 발생합니다(서로 다른 state 변수가 서로 동기화되지 않아 발생하는 버그를 피함). 이 접근 방식이 생소하게 느껴진다면, [React로 사고하기](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state)에서 state에 들어가야할 내용이 무엇인지 확인하세요.</Trans>

### Caching expensive calculations<Trans>고비용 계산 캐싱하기</Trans> {/*caching-expensive-calculations*/}

This component computes `visibleTodos` by taking the `todos` it receives by props and filtering them according to the `filter` prop. You might feel tempted to store the result in state and update it from an Effect:
<Trans>아래 컴포넌트는 props로 받은 `todos`를 `filter` prop에 따라 필터링하여 `visibleTodos`를 계산합니다. 이 결과를 state 변수에 저장하고 Effect에서 업데이트하고 싶을 수도 있을 것입니다:</Trans>

```js {4-9}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 Avoid: redundant state and unnecessary Effect
  // 🔴 이러지 마세요: 중복 state 및 불필요한 Effect
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

Like in the earlier example, this is both unnecessary and inefficient. First, remove the state and the Effect:
<Trans>앞의 예시에서와 마찬가지로 이것은 불필요하고 비효율적입니다. state와 Effect를 제거합시다:</Trans>

```js {3-5}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ This is fine if getFilteredTodos() is not slow.
  // ✅ getFilteredTodos()가 느리지 않다면 괜찮습니다.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

Usually, this code is fine! But maybe `getFilteredTodos()` is slow or you have a lot of `todos`. In that case you don't want to recalculate `getFilteredTodos()` if some unrelated state variable like `newTodo` has changed.
<Trans>일반적으로 위 코드는 괜찮습니다! 하지만 `getFilteredTodos()`가 느리거나 `todos`가 많을 경우, `newTodo`와 같이 관련 없는 state 변수가 변경되더라도 `getFilteredTodos()`를 다시 계산하고 싶지 않을 수 있습니다.</Trans>

You can cache (or ["memoize"](https://en.wikipedia.org/wiki/Memoization)) an expensive calculation by wrapping it in a [`useMemo`](/reference/react/useMemo) Hook:
<Trans>이럴 땐 값비싼 계산을 [`useMemo`](/reference/react/useMemo) 훅으로 감싸서 캐시(또는 ["메모화 (memoize)"](https://en.wikipedia.org/wiki/Memoization))할 수 있습니다:</Trans>

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ Does not re-run unless todos or filter change
    // ✅ todos나 filter가 변하지 않는 한 재실행되지 않음
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

Or, written as a single line:
<Trans>또는 한 줄로 작성할 수도 있습니다:</Trans>

```js {5-7}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Does not re-run getFilteredTodos() unless todos or filter change
  // ✅ todos나 filter가 변하지 않는 한 getFilteredTodos()가 재실행되지 않음
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**This tells React that you don't want the inner function to re-run unless either `todos` or `filter` have changed.** React will remember the return value of `getFilteredTodos()` during the initial render. During the next renders, it will check if `todos` or `filter` are different. If they're the same as last time, `useMemo` will return the last result it has stored. But if they are different, React will call the inner function again (and store its result).
<Trans>**이렇게 하면 `todos`나 `filter`가 변경되지 않는 한 내부 함수가 다시 실행되지 않기를 원한다는 것을 React에 알립니다.** 그러면 React는 초기 렌더링 중에 `getFilteredTodos()`의 반환값을 기억합니다. 그 다음부터는 렌더링 중에 할 일이나 필터가 다른지 확인합니다. 지난번과 동일하다면 `useMemo`는 마지막으로 저장한 결과를 반환합니다. 같지 않다면, React는 내부 함수를 다시 호출하고 그 결과를 저장합니다.</Trans>

The function you wrap in [`useMemo`](/reference/react/useMemo) runs during rendering, so this only works for [pure calculations.](/learn/keeping-components-pure)
<Trans>[`useMemo`](/reference/react/useMemo)로 래핑하는 함수는 렌더링 중에 실행되므로, [순수 계산](/learn/keeping-components-pure)에만 작동합니다.</Trans>

<DeepDive>

#### How to tell if a calculation is expensive?<Trans>계산이 비싼지는 어떻게 알 수 있나요?</Trans> {/*how-to-tell-if-a-calculation-is-expensive*/}

In general, unless you're creating or looping over thousands of objects, it's probably not expensive. If you want to get more confidence, you can add a console log to measure the time spent in a piece of code:
<Trans>일반적으로 수천 개의 객체를 만들거나 반복하는 경우가 아니라면 비용이 많이 든다고 보지 않을 것입니다. 좀 더 확신을 얻고 싶다면 콘솔 로그를 추가하여 코드에 소요된 시간을 측정할 수 있습니다:</Trans>

```js {1,3}
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

Perform the interaction you're measuring (for example, typing into the input). You will then see logs like `filter array: 0.15ms` in your console. If the overall logged time adds up to a significant amount (say, `1ms` or more), it might make sense to memoize that calculation. As an experiment, you can then wrap the calculation in `useMemo` to verify whether the total logged time has decreased for that interaction or not:
<Trans>측정하려는 상호작용을 수행하세요(예: input에 입력). 그러면 `filter array : 0.15ms` 라는 로그가 콘솔에 표시되는 것을 보게될 것 입니다. 기록된 전체 시간이 상당하다면(예: 1ms 이상) 해당 계산은 메모해 두는 것이 좋을 수 있습니다. 실험삼아 해당 계산을 `useMemo`로 감싸서 해당 상호작용에 대해 총 로그된 시간이 감소했는지 여부를 확인할 수 있습니다:</Trans>

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // Skipped if todos and filter haven't changed
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo` won't make the *first* render faster. It only helps you skip unnecessary work on updates.
<Trans>`useMemo`는 *첫 번째* 렌더링을 더 빠르게 만들지는 않습니다. 업데이트 시 불필요한 작업을 건너뛰는 데에만 도움이 될 뿐입니다.</Trans>

Keep in mind that your machine is probably faster than your users' so it's a good idea to test the performance with an artificial slowdown. For example, Chrome offers a [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) option for this.
<Trans>컴퓨터가 사용자보다 빠를 수 있으므로 인위적으로 속도 저하를 일으켜서 성능을 테스트하는 것도 좋은 생각입니다. 예를 들어 Chrome에서는 [CPU 스로틀링](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) 옵션을 제공합니다.</Trans>

Also note that measuring performance in development will not give you the most accurate results. (For example, when [Strict Mode](/reference/react/StrictMode) is on, you will see each component render twice rather than once.) To get the most accurate timings, build your app for production and test it on a device like your users have.
<Trans>또한 개발 중에 성능을 측정하는 것은 정확한 결과를 제공하지는 않는다는 점에 유의하세요. (예를 들어 [Strict Mode](/reference/react/StrictMode)를 켜면, 각 컴포넌트가 한 번이 아닌 두 번씩 렌더링되는 것을 볼 수 있습니다.) 가장 정확한 타이밍을 얻으려면 프로덕션용 앱을 빌드하고 사용자가 사용하는 것과 동일한 기기에서 테스트하세요.</Trans>

</DeepDive>

### Resetting all state when a prop changes<Trans>prop이 변경되면 모든 state 재설정하기</Trans> {/*resetting-all-state-when-a-prop-changes*/}

This `ProfilePage` component receives a `userId` prop. The page contains a comment input, and you use a `comment` state variable to hold its value. One day, you notice a problem: when you navigate from one profile to another, the `comment` state does not get reset. As a result, it's easy to accidentally post a comment on a wrong user's profile. To fix the issue, you want to clear out the `comment` state variable whenever the `userId` changes:
<Trans>다음 `ProfilePage` 컴포넌트는 `userId` prop을 받습니다. 이 페이지에는 코멘트 input이 포함되어 있으며, `comment` state 변수를 사용하여 그 값을 보관합니다. 어느 날, 한 프로필에서 다른 프로필로 이동할 때 `comment` state가 재설정되지 않는 문제를 발견했습니다. 그 결과 의도치 않게 잘못된 사용자의 프로필에 댓글을 게시하기가 쉬운 상황입니다. 이 문제를 해결하려면 `userId`가 변경될 때마다 `comment` state 변수를 지워줘야 합니다:</Trans>

```js {4-8}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Avoid: Resetting state on prop change in an Effect
  // 🔴 이러지 마세요: prop 변경시 Effect에서 state 재설정 수행
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

This is inefficient because `ProfilePage` and its children will first render with the stale value, and then render again. It is also complicated because you'd need to do this in *every* component that has some state inside `ProfilePage`. For example, if the comment UI is nested, you'd want to clear out nested comment state too.
<Trans>이것은 `ProfilePage`와 그 자식들이 먼저 오래된 값으로 렌더링한 다음 새로운 값으로 다시 렌더링하기 때문에 비효율적입니다. 또한 `ProfilePage` 내부에 어떤 state가 있는 *모든* 컴포넌트에서 이 작업을 수행해야 하므로 복잡합니다. 예를 들어 댓글 UI가 중첩되어 있는 경우 중첩된 하위 댓글 state들도 모두 지워야 할 것입니다.</Trans>

Instead, you can tell React that each user's profile is conceptually a _different_ profile by giving it an explicit key. Split your component in two and pass a `key` attribute from the outer component to the inner one:
<Trans>그 대신 명시적인 키를 전달해 각 사용자의 프로필이 개념적으로 *다른* 프로필이라는 것을 React에 알릴 수 있습니다. 컴포넌트를 둘로 나누고 바깥쪽 컴포넌트에서 안쪽 컴포넌트로 `key` 속성을 전달하세요:</Trans>

```js {5,11-13}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ This and any other state below will reset on key change automatically
  // ✅ key가 변하면 이 컴포넌트 및 모든 자식 컴포넌트의 state가 자동으로 재설정됨
  const [comment, setComment] = useState('');
  // ...
}
```

Normally, React preserves the state when the same component is rendered in the same spot. **By passing `userId` as a `key` to the `Profile` component, you're asking React to treat two `Profile` components with different `userId` as two different components that should not share any state.** Whenever the key (which you've set to `userId`) changes, React will recreate the DOM and [reset the state](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key) of the `Profile` component and all of its children. Now the `comment` field will clear out automatically when navigating between profiles.
<Trans>일반적으로 React는 같은 컴포넌트가 같은 위치에서 렌더링될 때 state를 유지합니다. **`userId`를 `key`로 `Profile` 컴포넌트에 전달하는 것은 곧, `userId`가 다른 두 `Profile` 컴포넌트를 state를 공유하지 않는 별개의 컴포넌트들로 취급하도록 React에게 요청하는 것입니다.** React는 (`userId`로 설정한) key가 변경될 때마다 DOM을 다시 생성하고 state를 재설정하며, `Profile` 컴포넌트 및 모든 자식들의 [state를 재설정](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key)할 것입니다. 그 결과 `comment` 필드는 프로필들을 탐색할 때마다 자동으로 지워집니다.</Trans>

Note that in this example, only the outer `ProfilePage` component is exported and visible to other files in the project. Components rendering `ProfilePage` don't need to pass the key to it: they pass `userId` as a regular prop. The fact `ProfilePage` passes it as a `key` to the inner `Profile` component is an implementation detail.
<Trans>위 예제에서는 외부의 `ProfilePage` 컴포넌트만 export하였으므로 프로젝트의 다른 파일에서는 오직 `ProfilePage` 컴포넌트에만 접근 가능합니다. `ProfilePage`를 렌더링하는 컴포넌트는 key를 전달할 필요 없이 일반적인 prop으로 `userId`만 전달하고 있습니다. `ProfilePage`가 내부의 `Profile` 컴포넌트에 `key`로 전달한다는 사실은 내부에서만 알고 있는 구현 세부 사항입니다.</Trans>

### Adjusting some state when a prop changes<Trans>props가 변경될 때 일부 state 조정하기</Trans> {/*adjusting-some-state-when-a-prop-changes*/}

Sometimes, you might want to reset or adjust a part of the state on a prop change, but not all of it.
<Trans>때론 prop이 변경될 때 state의 전체가 아닌 일부만 재설정하거나 조정하고 싶을 수 있습니다.</Trans>

This `List` component receives a list of `items` as a prop, and maintains the selected item in the `selection` state variable. You want to reset the `selection` to `null` whenever the `items` prop receives a different array:
<Trans>다음의 `List` 컴포넌트는 `items` 목록을 prop으로 받고, `selection` state 변수에 선택된 항목을 유지합니다. `items` prop이 다른 배열을 받을 때마다 `selection`을 `null`로 재설정하고 싶습니다:</Trans>

```js {5-10}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Avoid: Adjusting state on prop change in an Effect
  // 🔴 이러지 마세요: prop 변경시 Effect에서 state 조정
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

This, too, is not ideal. Every time the `items` change, the `List` and its child components will render with a stale `selection` value at first. Then React will update the DOM and run the Effects. Finally, the `setSelection(null)` call will cause another re-render of the `List` and its child components, restarting this whole process again.
<Trans>이것 역시 이상적이지 않습니다. items가 `변경될 때마다` List`와 그 하위 컴포넌트는 처음에는 오래된` selection`값으로 렌더링됩니다. 그런 다음 React는 DOM을 업데이트하고 Effects를 실행합니다. 마지막으로`setSelection(null)`호출은`List와 그 자식 컴포넌트를 다시 렌더링하여 이 전체 과정을 재시작하게 됩니다.</Trans>

Start by deleting the Effect. Instead, adjust the state directly during rendering:
<Trans>Effect를 삭제하는 것으로 시작하세요. 대신 렌더링 중에 직접 state를 조정합니다:</Trans>

```js {5-12}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Better: Adjust the state while rendering
  // 더 나음: 렌더링 중에 state 조정
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

[Storing information from previous renders](/reference/react/useState#storing-information-from-previous-renders) like this can be hard to understand, but it’s better than updating the same state in an Effect. In the above example, `setSelection` is called directly during a render. React will re-render the `List` *immediately* after it exits with a `return` statement. React has not rendered the `List` children or updated the DOM yet, so this lets the `List` children skip rendering the stale `selection` value.
<Trans>이렇게 [이전 렌더링의 정보를 저장하는 것](/reference/react/useState#storing-information-from-previous-renders)은 이해하기 어려울 수 있지만, Effect에서 동일한 state를 업데이트하는 것보다는 낫습니다. 위 예시에서는 렌더링 도중 `setSelection`이 직접 호출됩니다. React는 `return`문과 함께 종료된 _직후에_ `List`를 다시 렌더링합니다. 이 시점에서 React는 아직 `List`의 자식들을 렌더링하거나 DOM을 업데이트하지 않았기 때문에, `List`의 자식들은 기존의 `selection` 값에 대한 렌더링을 건너뛰게 됩니다.</Trans>

When you update a component during rendering, React throws away the returned JSX and immediately retries rendering. To avoid very slow cascading retries, React only lets you update the *same* component's state during a render. If you update another component's state during a render, you'll see an error. A condition like `items !== prevItems` is necessary to avoid loops. You may adjust state like this, but any other side effects (like changing the DOM or setting timeouts) should stay in event handlers or Effects to [keep components pure.](/learn/keeping-components-pure)
<Trans>렌더링 도중 컴포넌트를 업데이트하면, React는 반환된 JSX를 버리고 즉시 렌더링을 다시 시도합니다. React는 계단식으로 전파되는 매우 느린 재시도를 피하기 위해, 렌더링 중에 *동일한* 컴포넌트의 state만 업데이트할 수 있도록 허용합니다. 렌더링 도중 다른 컴포넌트의 state를 업데이트하면 오류가 발생합니다. 동일 컴포넌트가 무한으로 리렌더링을 반복 시도하는 상황을 피하기 위해 `items !== prevItems`와 같은 조건이 필요한 것입니다. 이런 식으로 state를 조정할 수 있긴 하지만, 다른 side effect(DOM 변경이나 timeout 설정 등)은 이벤트 핸들러나 Effect에서만 처리함으로써 [컴포넌트의 순수성을 유지](/learn/keeping-components-pure)해야 합니다.</Trans>

**Although this pattern is more efficient than an Effect, most components shouldn't need it either.** No matter how you do it, adjusting state based on props or other state makes your data flow more difficult to understand and debug. Always check whether you can [reset all state with a key](#resetting-all-state-when-a-prop-changes) or [calculate everything during rendering](#updating-state-based-on-props-or-state) instead. For example, instead of storing (and resetting) the selected *item*, you can store the selected *item ID:*
<Trans>**이 패턴은 Effect보다 효율적이지만, 대부분의 컴포넌트에는 필요하지 않습니다.** 어떻게 하든 props나 다른 state들을 바탕으로 state를 조정하면 데이터 흐름을 이해하고 디버깅하기 어려워질 것입니다. 항상 [key로 모든 state를 재설정](#resetting-all-state-when-a-prop-changes)하거나 [렌더링 중에 모두 계산](#updating-state-based-on-props-or-state)할 수 있는지를 확인하세요. 예를 들어 선택한 *item*을 저장(및 재설정)하는 대신, 선택한 item의 *ID*를 저장할 수 있습니다:</Trans>

```js {3-6}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Best: Calculate everything during rendering
  // ✅ 가장 좋음: 렌더링 중에 모든 값을 계산
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

Now there is no need to "adjust" the state at all. If the item with the selected ID is in the list, it remains selected. If it's not, the `selection` calculated during rendering will be `null` because no matching item was found. This behavior is different, but arguably better because most changes to `items` preserve the selection.
<Trans>이제 state를 "조정"할 필요가 전혀 없습니다. 선택한 ID를 가진 항목이 목록에 있으면 선택된 state로 유지됩니다. 그렇지 않은 경우 렌더링 중에 계산된 `selection` 항목은 일치하는 항목을 찾지 못하므로 `null`이 됩니다. 이 방식은 `items`에 대한 대부분의 변경과 무관하게 'selection' 항목은 그대로 유지되므로 대체로 더 나은 방법입니다.</Trans>
### Sharing logic between event handlers<Trans>이벤트 핸들러 간 로직 공유</Trans> {/*sharing-logic-between-event-handlers*/}

Let's say you have a product page with two buttons (Buy and Checkout) that both let you buy that product. You want to show a notification whenever the user puts the product in the cart. Calling `showNotification()` in both buttons' click handlers feels repetitive so you might be tempted to place this logic in an Effect:
<Trans>해당 제품을 구매할 수 있는 두 개의 버튼(구매 및 결제)이 있는 제품 페이지가 있다고 합시다. 사용자가 제품을 장바구니에 넣을 때마다 알림을 표시하고 싶습니다. 두 버튼의 클릭 핸들러에 모두 `showNotification()` 호출을 추가하는 것은 반복적으로 느껴지므로 이 로직을 효과에 배치하고 싶을 수 있습니다:</Trans>

```js {2-8}
function ProductPage({ product, addToCart }) {
  // 🔴 Avoid: Event-specific logic inside an Effect
  // 🔴 이러지 마세요: Effect 내부에 특정 이벤트에 대한 로직 존재
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

This Effect is unnecessary. It will also most likely cause bugs. For example, let's say that your app "remembers" the shopping cart between the page reloads. If you add a product to the cart once and refresh the page, the notification will appear again. It will keep appearing every time you refresh that product's page. This is because `product.isInCart` will already be `true` on the page load, so the Effect above will call `showNotification()`.
<Trans>이 효과는 불필요합니다. 또한 버그를 촉발할 가능성이 높습니다. 예를 들어 페이지가 새로고침 될 때마다 앱이 장바구니를 "기억"한다고 가정해 봅시다. 카트에 제품을 한 번 추가하고 페이지를 새로고침 하면 알림이 다시 표시됩니다. 또한 해당 제품 페이지를 새로고침할 때에도 여전히 알림이 계속 등장합니다. 이는 페이지를 불러올 때 `product.isInCart`가 이미 `true`이므로 위의 Effect가 `showNotification()`을 호출하기 때문입니다.</Trans>

**When you're not sure whether some code should be in an Effect or in an event handler, ask yourself *why* this code needs to run. Use Effects only for code that should run *because* the component was displayed to the user.** In this example, the notification should appear because the user *pressed the button*, not because the page was displayed! Delete the Effect and put the shared logic into a function called from both event handlers:
<Trans>**어떤 코드가 Effect에 있어야 하는지 이벤트 핸들러에 있어야 하는지 확실치 않은 경우, 이 코드가 실행되어야 하는 *이유*를 자문해 보세요. 컴포넌트가 사용자에게 표시되었기 *때문에* 실행되어야 하는 코드에만 Effect를 사용하세요.** 이 예제에서는 페이지가 표시되었기 때문이 아니라, 사용자가 버튼을 눌렀기 때문에 알림이 표시되어야 합니다! Effect를 삭제하고 공유 로직을 두 이벤트 핸들러에서 호출하는 함수에 넣으세요:</Trans>

```js {2-7,10,14}
function ProductPage({ product, addToCart }) {
  // ✅ Good: Event-specific logic is called from event handlers
  // ✅ 좋습니다: 이벤트 핸들러 안에서 각 이벤트별 로직 호출
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

This both removes the unnecessary Effect and fixes the bug.
<Trans>이렇게 하면 불필요한 효과가 제거되고 버그가 수정됩니다.</Trans>

### Sending a POST request<Trans>POST요청 보내기</Trans> {/*sending-a-post-request*/}

This `Form` component sends two kinds of POST requests. It sends an analytics event when it mounts. When you fill in the form and click the Submit button, it will send a POST request to the `/api/register` endpoint:
<Trans>이 `Form` 컴포넌트는 두 종류의 POST 요청을 전송합니다. 마운트될 때에는 분석 이벤트를 보냅니다. 양식을 작성하고 제출 버튼을 클릭하면 `/api/register` 엔드포인트로 POST 요청을 보냅니다:</Trans>

```js {5-9,11-18}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic should run because the component was displayed
  // ✅ 좋습니다: '컴포넌트가 표시되었기 때문에 로직이 실행되어야 하는 경우'에 해당
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 Avoid: Event-specific logic inside an Effect
  // 🔴 이러지 마세요: Effect 내부에 특정 이벤트에 대한 로직 존재
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

Let's apply the same criteria as in the example before.
<Trans>이전 예제와 동일한 기준을 적용해 봅시다.</Trans>

The analytics POST request should remain in an Effect. This is because the _reason_ to send the analytics event is that the form was displayed. (It would fire twice in development, but [see here](/learn/synchronizing-with-effects#sending-analytics) for how to deal with that.)
<Trans>분석 POST 요청은 Effect에 남아 있어야 합니다. 분석 이벤트를 전송하는 *이유*는 form이 표시되었기 때문입니다. (개발 모드에서는 두 번 발생하는데, 이를 처리하는 방법은 [여기](/learn/synchronizing-with-effects#sending-analytics)를 참조하세요).</Trans>

However, the `/api/register` POST request is not caused by the form being _displayed_. You only want to send the request at one specific moment in time: when the user presses the button. It should only ever happen _on that particular interaction_. Delete the second Effect and move that POST request into the event handler:
<Trans>그러나 `/api/register` POST 요청은 form이 *표시*되어서 발생하는 것이 아닙니다. 특정 시점, 즉 사용자가 버튼을 누를 때만 요청을 보내고 싶을 것입니다. 이 요청은 *해당 상호작용에서만 발생*해야 합니다. 두 번째 효과를 삭제하고 해당 POST 요청을 이벤트 핸들러로 이동합니다:</Trans>

```js {13-15}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic runs because the component was displayed
  // ✅ 좋습니다: '컴포넌트가 표시되었기 때문에 로직이 실행되어야 하는 경우'에 해당
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ Good: Event-specific logic is in the event handler
    // ✅ 좋습니다: 이벤트 핸들러 안에서 특정 이벤트 로직 호출
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

When you choose whether to put some logic into an event handler or an Effect, the main question you need to answer is _what kind of logic_ it is from the user's perspective. If this logic is caused by a particular interaction, keep it in the event handler. If it's caused by the user _seeing_ the component on the screen, keep it in the Effect.
<Trans>어떤 로직을 이벤트 핸들러에 넣을지 Effect에 넣을지 선택할 때, 사용자 관점에서 *어떤 종류의 로직*인지에 대한 답을 찾아야 합니다. 이 로직이 특정 상호작용으로 인해 발생하는 것이라면 이벤트 핸들러에 넣으세요. 사용자가 화면에서 컴포넌트를 *보는* 것이 원인이라면 Effect에 넣으세요.</Trans>

### Chains of computations<Trans>연쇄 계산</Trans> {/*chains-of-computations*/}

Sometimes you might feel tempted to chain Effects that each adjust a piece of state based on other state:
<Trans>때로는 다른 state를 바탕으로 또다른 state를 조정하는 Effect를 연쇄적으로 사용하고 싶을 수도 있습니다:</Trans>

```js {7-30}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 Avoid: Chains of Effects that adjust the state solely to trigger each other
  // 🔴 이러지 마세요: 오직 서로를 촉발하기 위해서만 state를 조정하는 Effect 체인
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

There are two problems with this code.
<Trans>이 코드에는 두 가지 문제가 있습니다.</Trans>

One problem is that it is very inefficient: the component (and its children) have to re-render between each `set` call in the chain. In the example above, in the worst case (`setCard` → render → `setGoldCardCount` → render → `setRound` → render → `setIsGameOver` → render) there are three unnecessary re-renders of the tree below.
<Trans>한 가지 문제는 매우 비효율적이라는 점입니다. 컴포넌트(및 그 자식들)은 체인의 각 `set` 호출 사이에 다시 렌더링해야 합니다. 위의 예시에서 최악의 경우(`setCard` → 렌더링 → `setGoldCardCount` → 렌더링 → `setRound` → 렌더링 → `setIsGameOver` → 렌더링)에는 하위 트리의 불필요한 리렌더링이 세 번이나 발생합니다.</Trans>

Even if it weren't slow, as your code evolves, you will run into cases where the "chain" you wrote doesn't fit the new requirements. Imagine you are adding a way to step through the history of the game moves. You'd do it by updating each state variable to a value from the past. However, setting the `card` state to a value from the past would trigger the Effect chain again and change the data you're showing. Such code is often rigid and fragile.
<Trans>속도가 느리지는 않더라도, 코드가 발전함에 따라 작성한 '체인'이 새로운 요구사항에 맞지 않는 경우가 발생할 수 있습니다. 게임 이동의 기록을 단계별로 살펴볼 수 있는 방법을 추가한다고 가정해 보겠습니다. 각 state 변수를 과거의 값으로 업데이트하여 이를 수행할 수 있습니다. 하지만 '카드' state를 과거의 값으로 설정하면 다시 Effect 체인이 촉발되고 표시되는 데이터가 변경됩니다. 이와 같은 코드는 종종 경직되고 취약합니다.</Trans>

In this case, it's better to calculate what you can during rendering, and adjust the state in the event handler:
<Trans>이 경우 렌더링 중에 가능한 것을 계산하고 이벤트 핸들러에서 state를 조정하는 것이 좋습니다:</Trans>

```js {6-8,15-28}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ Calculate what you can during rendering
  // ✅ 가능한 것을 렌더링 중에 계산
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ Calculate all the next state in the event handler
    // ✅ 이벤트 핸들러에서 다음 state를 모두 계산
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...
```

This is a lot more efficient. Also, if you implement a way to view game history, now you will be able to set each state variable to a move from the past without triggering the Effect chain that adjusts every other value. If you need to reuse logic between several event handlers, you can [extract a function](#sharing-logic-between-event-handlers) and call it from those handlers.
<Trans>훨씬 더 효율적입니다. 또한 게임 기록을 볼 수 있는 방법을 구현하면 이제 다른 모든 값을 조정하는 Effect 체인을 촉발시키지 않고도 각 state 변수를 과거의 움직임으로 설정할 수 있습니다. 여러 이벤트 핸들러 간에 로직을 재사용해야 하는 경우 [함수를 추출](#sharing-logic-between-event-handlers)하여 해당 핸들러에서 함수를 호출할 수 있습니다.</Trans>

Remember that inside event handlers, [state behaves like a snapshot.](/learn/state-as-a-snapshot) For example, even after you call `setRound(round + 1)`, the `round` variable will reflect the value at the time the user clicked the button. If you need to use the next value for calculations, define it manually like `const nextRound = round + 1`.
<Trans>이벤트 핸들러 내부에서 [state는 스냅샷처럼 동작](/learn/state-as-a-snapshot)함을 기억하세요. 예를 들어 `setRound(round + 1)`를 호출한 후에도 `round` 변수는 사용자가 버튼을 클릭한 시점의 값을 반영합니다. 계산에 다음 값을 사용해야 하는 경우 `const nextRound = round + 1`과 같이 수동으로 정의하세요.</Trans>

In some cases, you *can't* calculate the next state directly in the event handler. For example, imagine a form with multiple dropdowns where the options of the next dropdown depend on the selected value of the previous dropdown. Then, a chain of Effects is appropriate because you are synchronizing with network.
<Trans>이벤트 핸들러에서 직접 다음 state를 계산할 수 없는 경우도 있습니다. 예를 들어 이전 드롭다운의 선택 값에 따라 다음 드롭다운의 옵션이 달라지는 form을 상상해 봅시다. 이를 네트워크와 동기화해야 한다면 Effect 체인이 적절할 것입니다.</Trans>

### Initializing the application<Trans>애플리케이션 초기화하기</Trans> {/*initializing-the-application*/}

Some logic should only run once when the app loads.
<Trans>일부 로직은 앱이 로드될 때 한 번만 실행되어야 합니다.</Trans>

You might be tempted to place it in an Effect in the top-level component:
<Trans>최상위 컴포넌트의 Effect에 배치하고 싶을 수도 있습니다:</Trans>

```js {2-6}
function App() {
  // 🔴 Avoid: Effects with logic that should only ever run once
  // 🔴 이러지 마세요: 한 번만 실행되어야 하는 로직이 포함된 Effect
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

However, you'll quickly discover that it [runs twice in development.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) This can cause issues--for example, maybe it invalidates the authentication token because the function wasn't designed to be called twice. In general, your components should be resilient to being remounted. This includes your top-level `App` component.
<Trans>그러나 이 함수가 [개발 중에 두 번 실행된다는 것](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)을 금방 알게 될 것입니다. 이 함수는 두 번 호출되도록 설계되지 않았기 때문에 인증 토큰이 무효화되는 등의 문제가 발생할 수 있습니다. 일반적으로 컴포넌트는 다시 마운트할 때 복원력이 있어야 합니다. 여기에는 최상위 `App` 컴포넌트도 포함됩니다.</Trans>

Although it may not ever get remounted in practice in production, following the same constraints in all components makes it easier to move and reuse code. If some logic must run *once per app load* rather than *once per component mount*, add a top-level variable to track whether it has already executed:
<Trans>프로덕션 환경에서는 실제로 다시 마운트되지 않을 수 있지만, 모든 컴포넌트에서 동일한 제약 조건을 따르면 코드를 이동하고 재사용하기가 더 쉬워집니다. 일부 로직이 *컴포넌트 마운트당 한 번*이 아니라 *앱 로드당 한 번* 실행되어야 하는 경우, 최상위 변수를 추가하여 이미 실행되었는지 여부를 추적하세요:</Trans>

```js {1,5-6,11}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Only runs once per app load
      // ✅ 앱 로드당 한 번만 실행됨
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

You can also run it during module initialization and before the app renders:
<Trans>모듈 초기화 중이나 앱 렌더링 전에 실행할 수도 있습니다:</Trans>

```js {1-2,7}
if (typeof window !== 'undefined') { // Check if we're running in the browser.
                                     // 브라우저에서 실행중인지 확인
  // ✅ Only runs once per app load
  // ✅ 앱 로드당 한 번만 실행됨
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Code at the top level runs once when your component is imported--even if it doesn't end up being rendered. To avoid slowdown or surprising behavior when importing arbitrary components, don't overuse this pattern. Keep app-wide initialization logic to root component modules like `App.js` or in your application's entry point.
<Trans>컴포넌트를 import할 때 최상위 레벨의 코드는 렌더링되지 않더라도 일단 한 번 실행됩니다. 임의의 컴포넌트를 임포트할 때 속도 저하나 예상치 못한 동작을 방지하려면 이 패턴을 과도하게 사용하지 마세요. 앱 전체 초기화 로직은 `App.js`와 같은 루트 컴포넌트 모듈이나 애플리케이션의 엔트리 포인트에 유지하세요.</Trans>

### Notifying parent components about state changes<Trans>state변경을 부모 컴포넌트에 알리기</Trans> {/*notifying-parent-components-about-state-changes*/}

Let's say you're writing a `Toggle` component with an internal `isOn` state which can be either `true` or `false`. There are a few different ways to toggle it (by clicking or dragging). You want to notify the parent component whenever the `Toggle` internal state changes, so you expose an `onChange` event and call it from an Effect:
<Trans>`참` 또는 `거짓`일 수 있는 내부 `isOn` state를 가진 `Toggle` 컴포넌트를 작성하고 있다고 가정해 봅시다. 토글하는 방법에는 몇 가지가 있습니다(클릭 또는 드래그). `Toggle` 내부 state가 변경될 때마다 부모 컴포넌트에 알리고 싶어서 `onChange` 이벤트를 prop으로 받고 Effect에서 이를 호출하도록 했습니다:</Trans>

```js {4-8}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 Avoid: The onChange handler runs too late
  // 🔴 이러지 마세요: onChange 핸들러가 너무 늦게 실행됨
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

Like earlier, this is not ideal. The `Toggle` updates its state first, and React updates the screen. Then React runs the Effect, which calls the `onChange` function passed from a parent component. Now the parent component will update its own state, starting another render pass. It would be better to do everything in a single pass.
<Trans>앞서와 마찬가지로 이것은 이상적이지 않습니다. 먼저 `Toggle`이 state를 업데이트하고, React가 화면을 업데이트합니다. 그런 다음 React는 부모 컴포넌트로부터 전달받은 `onChange` 함수를 호출하는 Effect를 실행합니다. 이제 부모 컴포넌트가 자신의 state를 업데이트하고, 다른 렌더 패스를 실행합니다. 이보다는, 모든 것을 단일 명령 안에서 처리하는 것이 더 좋습니다.</Trans>

Delete the Effect and instead update the state of *both* components within the same event handler:
<Trans>Effect를 삭제하고, 대신 동일한 이벤트 핸들러 내에서 *두* 컴포넌트의 state를 업데이트 합시다:</Trans>

```js {5-8,12,17,19}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Good: Perform all updates during the event that caused them
    // ✅ 좋습니다: 이벤트 발생시 모든 업데이트를 수행
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

With this approach, both the `Toggle` component and its parent component update their state during the event. React [batches updates](/learn/queueing-a-series-of-state-updates) from different components together, so there will only be one render pass.
<Trans>이 접근에 따르면 `Toggle` 컴포넌트 및 부모 컴포넌트 모두 이벤트가 발생하는 동안 state를 업데이트합니다. React는 서로 다른 컴포넌트에서 [일괄 업데이트](/learn/queueing-a-series-of-state-updates)를 함께 처리하므로, 렌더링 과정은 한 번만 발생합니다.</Trans>

You might also be able to remove the state altogether, and instead receive `isOn` from the parent component:
<Trans>state를 완전히 제거하고 그 대신 부모 컴포넌트로부터 `isOn`을 받을 수도 있습니다:</Trans>

```js {1-3}
// ✅ Also good: the component is fully controlled by its parent
// ✅ 좋습니다: 부모 컴포넌트에 의해 완전히 제어됨
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

["Lifting state up"](/learn/sharing-state-between-components) lets the parent component fully control the `Toggle` by toggling the parent's own state. This means the parent component will have to contain more logic, but there will be less state overall to worry about. Whenever you try to keep two different state variables synchronized, try lifting state up instead!
<Trans>["state 끌어올리기"](/learn/sharing-state-between-components)는 부모 컴포넌트가 부모 자체의 state를 토글하여 `Toggle`을 완전히 제어할 수 있게 해줍니다. 이는 부모 컴포넌트가 더 많은 로직을 포함해야 하지만, 전체적으로 걱정해야 할 state가 줄어든다는 것을 의미합니다. 두 개의 서로 다른 state 변수를 동기화하려고 할 때마다, 대신 state를 끌어올려 보세요!</Trans>

### Passing data to the parent<Trans>부모에게 데이터 전달하기</Trans> {/*passing-data-to-the-parent*/}

This `Child` component fetches some data and then passes it to the `Parent` component in an Effect:
<Trans>다음 `Child` 컴포넌트는 일부 데이터를 페치한 다음 Effect의 `Parent` 컴포넌트에 전달합니다:</Trans>

```js {9-15}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 Avoid: Passing data to the parent in an Effect
  // 🔴 이러지 마세요: Effect에서 부모에게 데이터 전달
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

In React, data flows from the parent components to their children. When you see something wrong on the screen, you can trace where the information comes from by going up the component chain until you find which component passes the wrong prop or has the wrong state. When child components update the state of their parent components in Effects, the data flow becomes very difficult to trace. Since both the child and the parent need the same data, let the parent component fetch that data, and *pass it down* to the child instead:
<Trans>React에서 데이터는 부모 컴포넌트에서 자식 컴포넌트로 흐릅니다. 화면에 뭔가 잘못된 것이 보이면, 컴포넌트 체인을 따라 올라가서 어떤 컴포넌트가 잘못된 prop을 전달하거나 잘못된 state를 가지고 있는지 찾아냄으로써 정보의 출처를 추적할 수 있습니다. 자식 컴포넌트가 Effect에서 부모 컴포넌트의 state를 업데이트하면, 데이터 흐름을 추적하기가 매우 어려워집니다. 자식과 부모 컴포넌트 모두 동일한 데이터가 필요하므로, 대신 부모 컴포넌트가 해당 데이터를 페치해서 자식에게 *전달*하도록 하세요:</Trans>

```js {4-6}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ Good: Passing data down to the child
  // ✅ 좋습니다: 자식에게 데이터 전달
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

This is simpler and keeps the data flow predictable: the data flows down from the parent to the child.
<Trans>이렇게 하면 데이터가 부모에서 자식으로 내려오기 때문에 데이터 흐름이 더 간단하고 예측 가능하게 유지됩니다.</Trans>

### Subscribing to an external store<Trans>외부 스토어 구독하기</Trans> {/*subscribing-to-an-external-store*/}

Sometimes, your components may need to subscribe to some data outside of the React state. This data could be from a third-party library or a built-in browser API. Since this data can change without React's knowledge, you need to manually subscribe your components to it. This is often done with an Effect, for example:
<Trans>때로는 컴포넌트가 React state 외부의 일부 데이터를 구독해야 할 수도 있습니다. 서드파티 라이브러리나 내장 브라우저 API에서 데이터를 가져와야 할 수도 있습니다. 이 데이터는 React가 모르는 사이에 변경될 수도 있는데, 그럴 땐 수동으로 컴포넌트가 해당 데이터를 구독하도록 해야 합니다. 이 작업은 종종 Effect에서 수행합니다. 예를 들어:</Trans>

```js {2-18}
function useOnlineStatus() {
  // Not ideal: Manual store subscription in an Effect
  // 이상적이지 않음: Effect에서 수동으로 store 구독
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Here, the component subscribes to an external data store (in this case, the browser `navigator.onLine` API). Since this API does not exist on the server (so it can't be used for the initial HTML), initially the state is set to `true`. Whenever the value of that data store changes in the browser, the component updates its state.
<Trans>여기서 컴포넌트는 외부 데이터 저장소(이 경우 브라우저 `navigator.onLine` API)에 구독합니다. 이 API는 서버에 존재하지 않으므로(따라서 초기 HTML을 생성하는 데 사용할 수 없으므로) 처음에는 state가 `true`로 설정됩니다. 브라우저에서 해당 데이터 저장소의 값이 변경될 때마다 컴포넌트는 해당 state를 업데이트합니다.</Trans>

Although it's common to use Effects for this, React has a purpose-built Hook for subscribing to an external store that is preferred instead. Delete the Effect and replace it with a call to [`useSyncExternalStore`](/reference/react/useSyncExternalStore):
<Trans>이를 위해 Effect를 사용하는 것이 일반적이지만, React에는 외부 저장소를 구독하기 위해 특별히 제작된 훅이 있습니다. Effect를 삭제하고 [`useSyncExternalStore`](/reference/react/useSyncExternalStore)호출로 대체하세요:</Trans>

```js {11-20}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ Good: Subscribing to an external store with a built-in Hook
  // ✅ 좋습니다: 내장 훅에서 외부 store 구독
  return useSyncExternalStore(
    subscribe, // React won't resubscribe for as long as you pass the same function
               // React는 동일한 함수를 전달하는 한 다시 구독하지 않음
    () => navigator.onLine, // How to get the value on the client
                            // 클라이언트에서 값을 가져오는 방법
    () => true // How to get the value on the server
               // 서버에서 값을 가져오는 방법
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

This approach is less error-prone than manually syncing mutable data to React state with an Effect. Typically, you'll write a custom Hook like `useOnlineStatus()` above so that you don't need to repeat this code in the individual components. [Read more about subscribing to external stores from React components.](/reference/react/useSyncExternalStore)
<Trans>이 접근 방식은 변경 가능한 데이터를 Effect를 사용해 React state에 수동으로 동기화하는 것보다 오류 가능성이 적습니다. 일반적으로 위의 `useOnlineStatus()`와 같은 커스텀 훅을 작성하여 개별 컴포넌트에서 이 코드를 반복할 필요가 없도록 합니다. [React 컴포넌트에서 외부 store를 구독하는 방법에 대해 자세히 읽어보세요](/reference/react/useSyncExternalStore).</Trans>

### Fetching data<Trans>데이터 페칭하기</Trans> {/*fetching-data*/}

Many apps use Effects to kick off data fetching. It is quite common to write a data fetching Effect like this:
<Trans>많은 앱이 데이터 페칭을 시작하기 위해 Effect를 사용합니다. 이와 같은 데이터 페칭 Effect를 작성하는 것은 매우 일반적입니다:</Trans>

```js {5-11}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 Avoid: Fetching without cleanup logic
    // 🔴 이러지 마세요: 정리 로직 없이 fetch 수행
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

You *don't* need to move this fetch to an event handler.
<Trans>이 페치를 이벤트 핸들러로 옮길 필요는 *없습니다*.</Trans>

This might seem like a contradiction with the earlier examples where you needed to put the logic into the event handlers! However, consider that it's not *the typing event* that's the main reason to fetch. Search inputs are often prepopulated from the URL, and the user might navigate Back and Forward without touching the input.
<Trans>이벤트 핸들러에 로직을 넣어야 했던 앞선 예제와 모순되는 것처럼 보일 수 있습니다! 하지만 페치해야 하는 주된 이유가 *타이핑 이벤트*가 아니라는 점을 생각해 보세요. 검색 입력은 URL에 미리 채워져 있는 경우가 많으며, 사용자는 input을 건드리지 않고도 앞뒤로 탐색할 수 있습니다.</Trans>

It doesn't matter where `page` and `query` come from. While this component is visible, you want to keep `results` [synchronized](/learn/synchronizing-with-effects) with data from the network for the current `page` and `query`. This is why it's an Effect.
<Trans>`page`와 `query`가 어디에서 오는지는 중요하지 않습니다. 이 컴포넌트가 표시되는 동안 현재의 `page` 및 `query`에 대한 네트워크의 데이터와 `results`의 [동기화](/learn/synchronizing-with-effects)가 유지되면 됩니다. 이것이 Effect인 이유입니다.</Trans>

However, the code above has a bug. Imagine you type `"hello"` fast. Then the `query` will change from `"h"`, to `"he"`, `"hel"`, `"hell"`, and `"hello"`. This will kick off separate fetches, but there is no guarantee about which order the responses will arrive in. For example, the `"hell"` response may arrive *after* the `"hello"` response. Since it will call `setResults()` last, you will be displaying the wrong search results. This is called a ["race condition"](https://en.wikipedia.org/wiki/Race_condition): two different requests "raced" against each other and came in a different order than you expected.
<Trans>다만 위 코드에는 버그가 있습니다. `"hello"`를 빠르게 입력한다고 합시다. 그러면 `query`가 `"h"`에서 `"he"`, `"hel"`, `"hell"`, `"hello"`로 변경됩니다. 이렇게 하면 각각 페칭을 수행하지만, 어떤 순서로 응답이 도착할지는 보장할 수 없습니다. 예를 들어 `"hell"` 응답은 `"hello"` 응답 *이후*에 도착할 수 있습니다. 이에 따라 마지막에 호출된 `setResults()`로부터 잘못된 검색 결과가 표시될 수 있습니다. 이를 ["경쟁 조건"](https://en.wikipedia.org/wiki/Race_condition)이라고 합니다. 서로 다른 두 요청이 서로 "경쟁"하여 예상과 다른 순서로 도착한 경우입니다.</Trans>

**To fix the race condition, you need to [add a cleanup function](/learn/synchronizing-with-effects#fetching-data) to ignore stale responses:**
<Trans>**경쟁 조건을 수정하기 위해서는 오래된 응답을 무시하도록 [클린업 함수를 추가](/learn/synchronizing-with-effects#fetching-data)해야 합니다.**</Trans>

```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

This ensures that when your Effect fetches data, all responses except the last requested one will be ignored.
<Trans>이렇게 하면 Effect가 데이터를 페치할 때 마지막으로 요청된 응답을 제외한 모든 응답이 무시됩니다.</Trans>

Handling race conditions is not the only difficulty with implementing data fetching. You might also want to think about caching responses (so that the user can click Back and see the previous screen instantly), how to fetch data on the server (so that the initial server-rendered HTML contains the fetched content instead of a spinner), and how to avoid network waterfalls (so that a child can fetch data without waiting for every parent).
<Trans>데이터 페칭을 구현할 때 경합 조건을 처리하는 것만 어려운 것은 아닙니다. 응답을 캐시하는 방법(사용자가 Back을 클릭하고면 스피너 대신 이전 화면을 즉시 볼 수 있도록), 서버에서 페치하는 방법(초기 서버 렌더링 HTML에 스피너 대신 가져온 콘텐츠가 포함되도록), 네트워크 워터폴을 피하는 방법(데이터를 페치해야 하는 하위 컴포넌트가 시작하기 전에 위의 모든 부모가 데이터 페치를 완료할 때까지 기다릴 필요가 없도록) 등도 고려해볼 사항입니다. </Trans>

**These issues apply to any UI library, not just React. Solving them is not trivial, which is why modern [frameworks](/learn/start-a-new-react-project#production-grade-react-frameworks) provide more efficient built-in data fetching mechanisms than fetching data in Effects.**
<Trans>**이런 문제는 React뿐만 아니라 모든 UI 라이브러리에 적용됩니다. 이러한 문제를 해결하는 것은 간단하지 않기 때문에 최신 [프레임워크](/learn/start-a-new-react-project#building-with-a-full-featured-framework)들은 컴포넌트에서 직접 Effect를 작성하는 것보다 더 효율적인 내장 데이터 페칭 메커니즘을 제공합니다.**</Trans>

If you don't use a framework (and don't want to build your own) but would like to make data fetching from Effects more ergonomic, consider extracting your fetching logic into a custom Hook like in this example:
<Trans>프레임워크를 사용하지 않고(또한 직접 만들고 싶지 않고) Effect에서 데이터 페칭을 보다 인체공학적으로 만들고 싶다면, 다음 예시처럼 페칭 로직을 커스텀 훅으로 추출하는 것을 고려해 보세요:</Trans>

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
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
  }, [url]);
  return data;
}
```

You'll likely also want to add some logic for error handling and to track whether the content is loading. You can build a Hook like this yourself or use one of the many solutions already available in the React ecosystem. **Although this alone won't be as efficient as using a framework's built-in data fetching mechanism, moving the data fetching logic into a custom Hook will make it easier to adopt an efficient data fetching strategy later.**
<Trans>또한 오류 처리와 콘텐츠 로딩 여부를 추적하기 위한 로직을 추가하고 싶을 것입니다. 이와 같은 훅을 직접 빌드하거나 React 에코시스템에서 이미 사용 가능한 많은 솔루션 중 하나를 사용할 수 있습니다. **이 방법만으로는 프레임워크에 내장된 데이터 페칭 메커니즘을 사용하는 것만큼 효율적이지는 않겠지만, 데이터 페칭 로직을 커스텀 훅으로 옮기면 나중에 효율적인 데이터 페칭 전략을 채택하기가 더 쉬워집니다.**</Trans>

In general, whenever you have to resort to writing Effects, keep an eye out for when you can extract a piece of functionality into a custom Hook with a more declarative and purpose-built API like `useData` above. The fewer raw `useEffect` calls you have in your components, the easier you will find to maintain your application.
<Trans>일반적으로 Effects를 작성해야 할 때마다 위의 `useData`와 같이 좀 더 선언적이고 목적에 맞게 만들어진 API를 사용하여 기능을 커스텀 훅으로 추출할 수 있는지 잘 살펴보세요. 컴포넌트에서 원시 `useEffect` 호출이 적을수록 애플리케이션을 유지 관리하기가 더 쉬워집니다.</Trans>

<Recap>

- If you can calculate something during render, you don't need an Effect.
- To cache expensive calculations, add `useMemo` instead of `useEffect`.
- To reset the state of an entire component tree, pass a different `key` to it.
- To reset a particular bit of state in response to a prop change, set it during rendering.
- Code that runs because a component was *displayed* should be in Effects, the rest should be in events.
- If you need to update the state of several components, it's better to do it during a single event.
- Whenever you try to synchronize state variables in different components, consider lifting state up.
- You can fetch data with Effects, but you need to implement cleanup to avoid race conditions.

<TransBlock>
- 렌더링 중에 무언가를 계산할 수 있다면 Effect가 필요하지 않습니다.
- 비용이 많이 드는 계산을 캐시하려면 `useEffect` 대신 `useMemo`를 추가하세요.
- 전체 컴포넌트 트리의 state를 재설정하려면 다른 `key`를 전달하세요.
- prop 변경에 대한 응답으로 특정 state 일부를 조정하려면 렌더링 중에 설정하세요.
- 컴포넌트가 *표시*되었기 때문에 실행해야 하는 코드는 Effect에 있어야 하고, 나머지는 이벤트에 있어야 합니다.
- 여러 컴포넌트의 state를 업데이트해야 하는 경우 단일 이벤트에서 처리하는 것이 좋습니다.
- 여러 컴포넌트에서 state 변수를 동기화하려고 할 때마다 state 끌어올리기를 고려하세요.
- Effect로 데이터를 페치할 수 있지만, 경쟁 조건을 피하기 위해 정리 로직을 구현해야 합니다.
</TransBlock>
</Recap>

<Challenges>

#### Transform data without Effects<Trans>Effect 없이 데이터 변환하기</Trans> {/*transform-data-without-effects*/}

The `TodoList` below displays a list of todos. When the "Show only active todos" checkbox is ticked, completed todos are not displayed in the list. Regardless of which todos are visible, the footer displays the count of todos that are not yet completed.
<Trans>아래의 `TodoList`는 할일 목록을 표시합니다. "Show only active todos" 체크박스를 선택하면 완료된 할 일은 목록에 표시되지 않습니다. 표시되는 할 일과 관계없이 바닥글에는 아직 완료되지 않은 할 일의 수가 표시됩니다.</Trans>

Simplify this component by removing all the unnecessary state and Effects.
<Trans>불필요한 state와 Effect를 모두 제거하여 이 컴포넌트를 단순화하세요.</Trans>
<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} todos left
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

If you can calculate something during rendering, you don't need state or an Effect that updates it.
<Trans>렌더링 중에 무언가를 계산할 수 있다면 state나 이를 업데이트하는 Effect가 필요하지 않습니다.</Trans>

</Hint>

<Solution>

There are only two essential pieces of state in this example: the list of `todos` and the `showActive` state variable which represents whether the checkbox is ticked. All of the other state variables are [redundant](/learn/choosing-the-state-structure#avoid-redundant-state) and can be calculated during rendering instead. This includes the `footer` which you can move directly into the surrounding JSX.
<Trans>이 예제에서는 `todos` 목록과 체크박스의 체크 여부를 나타내는 `showActive`의 두 필수 state만 있습니다. 다른 모든 state 변수는 [중복](/learn/choosing-the-state-structure#avoid-redundant-state)이며 대신 렌더링 중에 계산할 수 있습니다. 여기에는 주변 JSX로 직접 이동할 수 있는 `footer`가 포함됩니다.</Trans>

Your result should end up looking like this:
<Trans>결과는 다음과 같이 표시되어야 합니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} todos left
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### Cache a calculation without Effects<Trans>Effect 없이 계산 캐시하기</Trans> {/*cache-a-calculation-without-effects*/}

In this example, filtering the todos was extracted into a separate function called `getVisibleTodos()`. This function contains a `console.log()` call inside of it which helps you notice when it's being called. Toggle "Show only active todos" and notice that it causes `getVisibleTodos()` to re-run. This is expected because visible todos change when you toggle which ones to display.
<Trans>이 예제에서는 할 일 필터링이 `getVisibleTodos()`라는 별도의 함수로 추출되었습니다. 이 함수 안에는 `console.log()` 호출이 포함되어 있어 언제 호출되는지 알 수 있습니다. "활성 할 일만 표시"를 토글하면 `getVisibleTodos()`가 다시 실행되는 것을 확인할 수 있습니다. 이는 표시할 할 일을 토글하면 표시되는 할 일이 변경되기 때문에 예상되는 현상입니다.</Trans>

Your task is to remove the Effect that recomputes the `visibleTodos` list in the `TodoList` component. However, you need to make sure that `getVisibleTodos()` does *not* re-run (and so does not print any logs) when you type into the input.
<Trans>여러분의 임무는 `TodoList` 컴포넌트에서 `visibleTodos` 목록을 다시 계산하는 Effect를 제거하는 것입니다. 하지만 입력을 입력할 때 `getVisibleTodos()`가 다시 실행되지 않도록(따라서 로그를 인쇄하지 않도록) 해야 합니다.</Trans>

<Hint>

One solution is to add a `useMemo` call to cache the visible todos. There is also another, less obvious solution.
<Trans>한 가지 해결책은 `useMemo` 호출을 추가하여 표시된 할일을 캐시하는 것입니다. 덜 분명한 또 다른 해결책도 있습니다.</Trans>

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

Remove the state variable and the Effect, and instead add a `useMemo` call to cache the result of calling `getVisibleTodos()`:
<Trans>state 변수와 Effect를 제거하고 대신 `getVisibleTodos()` 호출 결과를 캐시하는 `useMemo` 호출을 추가합니다:</Trans>

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

With this change, `getVisibleTodos()` will be called only if `todos` or `showActive` change. Typing into the input only changes the `text` state variable, so it does not trigger a call to `getVisibleTodos()`.
<Trans>이 변경으로 `todos` 또는 `showActive`가 변경된 경우에만 `getVisibleTodos()`가 호출됩니다. 입력을 입력하면 `text` state 변수만 변경되므로 `getVisibleTodos()` 호출을 촉발하지 않습니다.</Trans>

There is also another solution which does not need `useMemo`. Since the `text` state variable can't possibly affect the list of todos, you can extract the `NewTodo` form into a separate component, and move the `text` state variable inside of it:
<Trans>`useMemo`가 필요 없는 또 다른 해결책도 있습니다. `text` state 변수가 할 일 목록에 영향을 줄 수 없기 때문에 `NewTodo` form을 별도의 컴포넌트로 추출하고 그 안에 `text` state 변수를 옮길 수 있습니다:</Trans>

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

This approach satisfies the requirements too. When you type into the input, only the `text` state variable updates. Since the `text` state variable is in the child `NewTodo` component, the parent `TodoList` component won't get re-rendered. This is why `getVisibleTodos()` doesn't get called when you type. (It would still be called if the `TodoList` re-renders for another reason.)
<Trans>이 접근 방식도 요구 사항을 충족합니다. input에 타이핑하면 `text` state 변수만 업데이트됩니다. `text` state 변수가 자식인 `NewTodo` 컴포넌트에 있기 때문에 부모인 `TodoList` 컴포넌트는 다시 렌더링되지 않습니다. 그래서 사용자가 입력할 때 `getVisibleTodos()`가 호출되지 않습니다. (다른 이유로 `TodoList`가 다시 렌더링되는 경우에는 여전히 호출됩니다.)</Trans>

</Solution>

#### Reset state without Effects<Trans>Effect 없이 state 재설정하기</Trans> {/*reset-state-without-effects*/}

This `EditContact` component receives a contact object shaped like `{ id, name, email }` as the `savedContact` prop. Try editing the name and email input fields. When you press Save, the contact's button above the form updates to the edited name. When you press Reset, any pending changes in the form are discarded. Play around with this UI to get a feel for it.
<Trans>이 `EditContact` 컴포넌트는 `{ id, name, email }` 모양의 연락처 객체를 `savedContact` prop으로 받습니다. name과 email 입력 필드를 편집해 보세요. Save를 누르면 양식 위의 연락처 버튼이 편집된 이름으로 업데이트됩니다. Reset을 누르면 양식의 보류 중인 변경 사항이 모두 삭제됩니다. 이 UI를 사용해 보면서 사용법을 익혀 보세요.</Trans>

When you select a contact with the buttons at the top, the form resets to reflect that contact's details. This is done with an Effect inside `EditContact.js`. Remove this Effect. Find another way to reset the form when `savedContact.id` changes.
<Trans>상단의 버튼으로 연락처를 선택하면 해당 연락처의 세부 정보를 반영하도록 양식이 재설정됩니다. 이 작업은 `EditContact.js` 내의 Effect로 수행됩니다. 이 Effect를 제거하세요. `savedContact.id`가 변경될 때 양식을 재설정하는 다른 방법을 찾아보세요.</Trans>
<Sandpack>

```js App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Hint>

It would be nice if there was a way to tell React that when `savedContact.id` is different, the `EditContact` form is conceptually a _different contact's form_ and should not preserve state. Do you recall any such way?
<Trans>`savedContact.id`가 달라졌을 때, `EditContact` form은 개념적으로 *다른 연락처의 폼*이므로, React에게 state를 보존해서는 안 된다고 알리는 방법이 있다면 좋을 것 같습니다. 그런 방법을 기억하시나요?</Trans>
</Hint>

<Solution>

Split the `EditContact` component in two. Move all the form state into the inner `EditForm` component. Export the outer `EditContact` component, and make it pass `savedContact.id` as the `key` to the inner `EditContact` component. As a result, the inner `EditForm` component resets all of the form state and recreates the DOM whenever you select a different contact.
<Trans>`EditContact` 컴포넌트를 둘로 분할합니다. 모든 양식 state를 내부의 `EditForm` 컴포넌트로 이동합니다. 외부 `EditContact` 컴포넌트를 내보내고 `savedContact.id`를 `key`로 내부 `EditContact` 컴포넌트에 전달하도록 합니다. 그 결과, 내부 `EditForm` 컴포넌트는 다른 연락처를 선택할 때마다 모든 양식 state를 재설정하고 DOM을 다시 생성합니다.</Trans>

<Sandpack>

```js App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Submit a form without Effects<Trans>Effect 없이 양식 제출하기</Trans> {/*submit-a-form-without-effects*/}

This `Form` component lets you send a message to a friend. When you submit the form, the `showForm` state variable is set to `false`. This triggers an Effect calling `sendMessage(message)`, which sends the message (you can see it in the console). After the message is sent, you see a "Thank you" dialog with an "Open chat" button that lets you get back to the form.
<Trans>이 `Form` 컴포넌트를 사용하면 친구에게 메시지를 보낼 수 있습니다. 양식을 제출하면 `showForm` state 변수가 `false`로 설정됩니다. 그러면 메시지를 전송하는 `sendMessage(message)`라는 Effect가 촉발됩니다(콘솔에서 확인할 수 있음). 메시지가 전송되면 'Open Chat' 버튼이 있는 "Thank you" 대화 상자가 표시되어 양식으로 돌아갈 수 있습니다.</Trans>

Your app's users are sending way too many messages. To make chatting a little bit more difficult, you've decided to show the "Thank you" dialog *first* rather than the form. Change the `showForm` state variable to initialize to `false` instead of `true`. As soon as you make that change, the console will show that an empty message was sent. Something in this logic is wrong!
<Trans>앱 사용자가 너무 많은 메시지를 보내고 있습니다. 채팅을 조금 더 어렵게 만들기 위해 양식 대신 "감사합니다" 대화 상자를 *먼저* 표시하기로 결정했습니다. `showForm` state 변수를 `true` 대신 `false`로 초기화하도록 변경해 보세요. 이렇게 변경하자마자 콘솔에 빈 메시지가 전송된 것으로 표시됩니다. 이 로직에서 뭔가 잘못되었습니다!</Trans>

What's the root cause of this problem? And how can you fix it?
<Trans>이 문제의 근본 원인은 무엇일까요? 그리고 어떻게 해결할 수 있을까요?</Trans>

<Hint>

Should the message be sent _because_ the user saw the "Thank you" dialog? Or is it the other way around?
<Trans>사용자가 "감사합니다" 대화 상자를 보았기 *때문에* 메시지가 전송되어야 하나요? 아니면 그 반대인가요?</Trans>

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

The `showForm` state variable determines whether to show the form or the "Thank you" dialog. However, you aren't sending the message because the "Thank you" dialog was _displayed_. You want to send the message because the user has _submitted the form._ Delete the misleading Effect and move the `sendMessage` call inside the `handleSubmit` event handler:
<Trans>`showForm` state 변수는 양식을 표시할지, 아니면 "감사합니다" 대화 상자를 표시할지를 결정합니다. 그러나 "감사합니다" 대화 상자가 *표시되었기 때문에* 메시지를 보내지는 않습니다. 사용자가 *양식을 제출했기 때문에* 메시지를 보내려는 것입니다. 오해의 소지가 있는 Effect를 삭제하고 `handleSubmit` 이벤트 핸들러 내부로 `sendMessage` 호출을 이동합니다:</Trans>
<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Notice how in this version, only _submitting the form_ (which is an event) causes the message to be sent. It works equally well regardless of whether `showForm` is initially set to `true` or `false`. (Set it to `false` and notice no extra console messages.)
<Trans>이 버전에서는 *양식을 제출할 때만* (이벤트인) 메시지가 전송되는 것을 주목하세요. `showForm`이 처음에 `true`로 설정되었는지, `false`로 설정되었는지에 관계없이 동일하게 작동합니다. (`false`로 설정해도 추가 콘솔 메시지가 표시되지 않습니다.)</Trans>

</Solution>

</Challenges>
