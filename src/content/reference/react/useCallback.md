---
title: useCallback
---

<Intro>

`useCallback` is a React Hook that lets you cache a function definition between re-renders.
<Trans>`useCallback`은 리렌더링 사이에 함수 정의를 캐시할 수 있게 해주는 React Hook입니다.</Trans>

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

Call `useCallback` at the top level of your component to cache a function definition between re-renders:
<Trans>최상위 컴포넌트에서 `useCallback`을 호출하여 리렌더링 사이에 함수 정의를 캐시합니다:</Trans>

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Parameters <Trans>매개변수</Trans> {/*parameters*/}

* `fn`: The function value that you want to cache. It can take any arguments and return any values. React will return (not call!) your function back to you during the initial render. On next renders, React will give you the same function again if the `dependencies` have not changed since the last render. Otherwise, it will give you the function that you have passed during the current render, and store it in case it can be reused later. React will not call your function. The function is returned to you so you can decide when and whether to call it.

* `dependencies`: The list of all reactive values referenced inside of the `fn` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is [configured for React](/learn/editor-setup#linting), it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison algorithm.

<TransBlock>
* `fn`: 캐시하려는 함수 값입니다. 어떤 인자도 받을 수 있고 어떤 값이라도 반환할 수 있습니다. React는 초기 렌더링을 하는 동안 함수를 반환합니다(호출하지 않습니다!). 다음 렌더링에서 React는 마지막 렌더링 이후 `dependencies`가 변경되지 않았다면 동일한 함수를 다시 제공합니다. 그렇지 않으면 현재 렌더링 중에 전달한 함수를 제공하고 나중에 재사용할 수 있도록 저장합니다. React는 함수를 호출하지 않습니다. 함수는 반환되므로 호출 시기와 여부를 결정할 수 있습니다.

* `dependencies`: `fn` 코드 내에서 참조된 모든 반응형 값의 배열입니다. 반응형 값에는 props, state, 컴포넌트 본문 내부에서 직접 선언된 모든 변수와 함수가 포함됩니다. linter가 [React용으로 구성된 경우](/learn/editor-setup#linting), 모든 반응형 값이 종속성으로 올바르게 지정되었는지 확인합니다. 의존성 배열에는 일정한 수의 항목이 있어야 하며 `[dep1, dep2, dep3]`과 같이 인라인으로 작성해야 합니다. React는 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교 알고리즘을 사용하여 각 의존성을 이전 값과 비교합니다.
</TransBlock>

#### Returns<Trans>반환 값</Trans> {/*returns*/}

On the initial render, `useCallback` returns the `fn` function you have passed.
<Trans>초기 렌더링에서 `useCallback`은 전달한 `fn` 함수를 반환합니다.</Trans>

During subsequent renders, it will either return an already stored `fn`  function from the last render (if the dependencies haven't changed), or return the `fn` function you have passed during this render.
<Trans>렌더링 중에는 마지막 렌더링에서 이미 저장된 `fn` 함수를 반환하거나(의존성이 변경되지 않은 경우), 렌더링 중에 전달했던 `fn` 함수를 반환합니다.</Trans>

#### Caveats<Trans>주의 사항</Trans> {/*caveats*/}

* `useCallback` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a new component and move the state into it.
* React **will not throw away the cached function unless there is a specific reason to do that.** For example, in development, React throws away the cache when you edit the file of your component. Both in development and in production, React will throw away the cache if your component suspends during the initial mount. In the future, React may add more features that take advantage of throwing away the cache--for example, if React adds built-in support for virtualized lists in the future, it would make sense to throw away the cache for items that scroll out of the virtualized table viewport. This should match your expectations if you rely on `useCallback` as a performance optimization. Otherwise, a [state variable](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) or a [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) may be more appropriate.

<TransBlock>
* `useCallback`은 Hook이므로 컴포넌트의 **최상위 레벨이나 자체 Hook에서만 호출할 수 있습니다.** 반복문이나 조건문 내부에서는 호출할 수 없습니다. 필요한 경우 새로운 컴포넌트로 추출하고 state를 그 안으로 옮기세요.
* React는 **특별한 이유가 없는 한 캐시된 함수를 버리지 않습니다.** 예를 들어, 개발 단계에서 컴포넌트의 파일을 수정할 때 React는 캐시를 버립니다. React는 개발 중이든 생산 중이든 초기 마운트 중에 컴포넌트가 일시 중단되면 캐시를 버립니다. 향후 React는 캐시를 버리는 것의 이점을 취하는 더 많은 기능을 추가할 수 있습니다. 예를 들어, 향후 React에 가상화된 목록에 대한 내장된 지원이 추가되면 가상화된 테이블 뷰포트에서 스크롤되는 항목에 대한 캐시도 버리는 것도 이해가 될 것입니다. 성능 최적화를 위해 `useCallback`에 의존하는 경우 기대에 부합할 것입니다. 그렇지 않은 경우 [state](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) 변수나 [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents)가 더 적합할 수 있습니다.
</TransBlock>

---

## Usage <Trans>사용법</Trans>{/*usage*/}

### Skipping re-rendering of components <Trans>컴포넌트 재렌더링 건너뛰기
</Trans>{/*skipping-re-rendering-of-components*/}

When you optimize rendering performance, you will sometimes need to cache the functions that you pass to child components. Let's first look at the syntax for how to do this, and then see in which cases it's useful.
<Trans>렌더링 성능을 최적화할 때 자식 컴포넌트에 전달하는 함수를 캐시해야 할 때가 있습니다. 먼저 이를 수행하는 방법에 대한 구문을 살펴본 다음 어떤 경우에 유용한지 알아보겠습니다.</Trans>

To cache a function between re-renders of your component, wrap its definition into the `useCallback` Hook:
<Trans>컴포넌트의 리렌더링 사이에 함수를 캐시하려면, 해당 함수의 정의를 `useCallback`훅으로 감싸세요:</Trans>

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

You need to pass two things to `useCallback`:
<Trans>`useCallback`을 사용하려면 두 가지를 전달해야 합니다:</Trans>

1. A function definition that you want to cache between re-renders.
2. A <CodeStep step={2}>list of dependencies</CodeStep> including every value within your component that's used inside your function.
<TransBlock>
1. 리렌더링 사이에 캐시할 함수
2. 함수 내에서 사용되는 컴포넌트 내부의 모든 값을 포함하는 <CodeStep stpe={2}>의존성 배열</CodeStep>
</TransBlock>

On the initial render, the <CodeStep step={3}>returned function</CodeStep> you'll get from `useCallback` will be the function you passed.
<Trans>초기 렌더링 시에, `useCallback`에서 <CodeStep step={3}>반환되는 함수</CodeStep>는 당신이 전달한 함수일 것이다.</Trans>

On the following renders, React will compare the <CodeStep step={2}>dependencies</CodeStep> with the dependencies you passed during the previous render. If none of the dependencies have changed (compared with [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useCallback` will return the same function as before. Otherwise, `useCallback` will return the function you passed on *this* render.
<Trans>다음 렌더링에서 리액트는 이전 렌더링에서 전달된 <CodeStep step={3}>의존성</CodeStep>과 비교할 것이다. 만약 의존성 중 변경된 것이 없다면(Object.is로 비교), `useCallback`은 이전과 같은 함수를 반환할 것이다. 그렇지 않으면 `useCallback`은 *이* 렌더링에서 전달한 함수를 반환할 것이다.</Trans>

In other words, `useCallback` caches a function between re-renders until its dependencies change.
<Trans>즉, `useCallback`은 의존성이 변경될 때까지 리렌더링 사이에 함수를 캐시합니다.</Trans>

**Let's walk through an example to see when this is useful.**
<Trans>**useCallback이 언제 유용한지 예시를 통해 살펴보겠습니다.**</Trans>

Say you're passing a `handleSubmit` function down from the `ProductPage` to the `ShippingForm` component:
<Trans>`ProductPage`에서 `ShippingForm` 컴포넌트로 `handleSubmit` 함수를 전달한다고 가정해 보겠습니다:</Trans>

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

You've noticed that toggling the `theme` prop freezes the app for a moment, but if you remove `<ShippingForm />` from your JSX, it feels fast. This tells you that it's worth trying to optimize the `ShippingForm` component.
<Trans>`theme` prop을 토글하면 앱이 잠시 멈추는 것을 알아차렸겠지만 JSX에서 `<ShippingForm />`을 제거하면 빠르게 느껴집니다. 이는 `ShippingForm` 컴포넌트를 최적화할 가치가 있다는 것을 알려줍니다.</Trans>

**By default, when a component re-renders, React re-renders all of its children recursively.** This is why, when `ProductPage` re-renders with a different `theme`, the `ShippingForm` component *also* re-renders. This is fine for components that don't require much calculation to re-render. But if you verified a re-render is slow, you can tell `ShippingForm` to skip re-rendering when its props are the same as on last render by wrapping it in [`memo`:](/reference/react/memo)
<Trans>**기본적으로 컴포넌트가 리렌더링되면 React는 모든 자식들을 재귀적으로 리렌더링합니다.** 이는 ProductPage가 다른 `theme`로 리렌더링될 때 `ShippingForm` 컴포넌트도 리렌더링되기 때문입니다. 이는 리렌더링하는 데 많은 계산이 필요하지 않은 컴포넌트에는 괜찮습니다. 그러나 재렌더링이 느리다는 것을 확인했다면, props가 지난 렌더링과 동일한 경우 [`memo`:](/reference/react/memo)로 감싸 재렌더링을 건너뛰도록 `ShippingForm`에게 지시할 수 있습니다:</Trans>

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**With this change, `ShippingForm` will skip re-rendering if all of its props are the *same* as on the last render.** This is when caching a function becomes important! Let's say you defined `handleSubmit` without `useCallback`:
<Trans>**이 변경 사항으로 `ShippingForm`은 모든 props가 마지막 렌더링과 동일한 경우 재렌더링을 건너뜁니다.** 이때 함수 캐싱이 중요해집니다! `useCallback` 없이 `handleSubmit`을 정의했다고 가정해 봅시다:</Trans>

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Every time the theme changes, this will be a different function...
  // 테마가 변경될 때마다, 이 함수는 달라집니다...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }
  
  return (
    <div className={theme}>
      {/* ... so ShippingForm's props will never be the same, and it will re-render every time */}
      {/*따라서 ShippingForm의 props는 절대 같지 않으며, 매번 리렌더링 됩니다.*/}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**In JavaScript, a `function () {}` or `() => {}` always creates a _different_ function,** similar to how the `{}` object literal always creates a new object. Normally, this wouldn't be a problem, but it means that `ShippingForm` props will never be the same, and your [`memo`](/reference/react/memo) optimization won't work. This is where `useCallback` comes in handy:
<Trans>**JavaScript에서 `function () {}` 또는 `() => {}`는** `{}` 객체 리터럴이 항상 새 객체를 생성하는 것과 유사하게 **항상 다른 함수를 생성합니다.** 일반적으로는 문제가 되지 않지만 `ShippingForm`의 props는 결코 동일하지 않으며 [`memo`](/reference/react/memo) 최적화가 작동하지 않는다는 의미입니다. 바로 이 지점에서 `useCallback`이 유용합니다:</Trans>

```js {2,3,4,9,10,14-16}
function ProductPage({ productId, referrer, theme }) {
  // Tell React to cache your function between re-renders...
  // 리렌더링 사이에 함수를 캐시하도록 React에 지시하세요...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...so as long as these dependencies don't change...
  // ...이 의존성이 변경되지 않는 한...

  return (
    <div className={theme}>
      {/* ...ShippingForm will receive the same props and can skip re-rendering */}
      {/* ...ShippingForm은 동일한 props를 받으며 리렌더링을 건너뛸 수 있습니다.*/}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**By wrapping `handleSubmit` in `useCallback`, you ensure that it's the *same* function between the re-renders** (until dependencies change). You don't *have to* wrap a function in `useCallback` unless you do it for some specific reason. In this example, the reason is that you pass it to a component wrapped in [`memo`,](/reference/react/memo) and this lets it skip re-rendering. There other reasons you might need `useCallback` which are described further on this page.
<Trans>**`handleSubmit`을 `useCallback`으로 감싸면, 리렌더링 사이에 *동일한* 함수가 되도록 할 수 있습니다**(의존성이 변경될때까지). 특별한 이유가 없는 한 함수를 `useCallback`으로 래핑할 필요는 없습니다. 이 예제에서, 그 이유는 `[`memo`](/reference/react/memo)`로 래핑된 컴포넌트에 함수를 전달하고 이는 리렌더링을 건너뛸 수 있게 하기 때문입니다. `useCallback`이 필요한 다른 이유들은 이 페이지에서 더 자세히 설명되어 있습니다.</Trans>

<Note>

**You should only rely on `useCallback` as a performance optimization.** If your code doesn't work without it, find the underlying problem and fix it first. Then you may add `useCallback` back.
<Trans>**`useCallback`은 성능 최적화를 위해 사용해야 합니다.** 만약 `useCallback` 없이 코드가 동작하지 않는다면, 먼저 근본적인 문제를 찾아 수정해야 합니다. 그 후에야 `useCallback`을 다시 추가할 수 있습니다.</Trans>

</Note>

<DeepDive>

#### How is useCallback related to useMemo?<Trans>useCallback과 useMemo는 무슨 관련이 있을까요?</Trans> {/*how-is-usecallback-related-to-usememo*/}

You will often see [`useMemo`](/reference/react/useMemo) alongside `useCallback`. They are both useful when you're trying to optimize a child component. They let you [memoize](https://en.wikipedia.org/wiki/Memoization) (or, in other words, cache) something you're passing down:
<Trans>[`useMemo`](/reference/react/useMemo)와 함께 `useCallback` 이 자주 사용되는 것을 볼 수 있습니다. 자식 컴포넌트를 최적화하려고 할 때, 두 가지 모두 유용합니다. 전달하는 값을 [memoize](https://en.wikipedia.org/wiki/Memoization)(캐시)할 수 있게 해줍니다.</Trans>

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // Calls your function and caches its result 함수를 호출하고 그 결과를 캐시합니다.
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // Caches your function itself 함수 자체를 캐시합니다.
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

The difference is in *what* they're letting you cache:
<Trans>차이점은 캐시할 수 있는 항목에 있습니다:</Trans>

* **[`useMemo`](/reference/react/useMemo) caches the *result* of calling your function.** In this example, it caches the result of calling `computeRequirements(product)` so that it doesn't change unless `product` has changed. This lets you pass the `requirements` object down without unnecessarily re-rendering `ShippingForm`. When necessary, React will call the function you've passed during rendering to calculate the result.
<Trans>* **[`useMemo`](/reference/react/useMemo)는 호출한 함수의 결과를 캐시합니다.** 이 예제에서는 `product`가 변경되지 않는 한 변경되지 않도록 `computeRequirements(product)`를 호출한 결과를 캐시합니다.  이렇게 하면 불필요하게 `ShippingForm`을 리렌더링하지 않고도 `requirements` 객체를 전달할 수 있습니다. 필요한 경우, React는 렌더링 중에 전달된 함수를 호출하여 결과를 계산합니다.</Trans>
* **`useCallback` caches *the function itself.*** Unlike `useMemo`, it does not call the function you provide. Instead, it caches the function you provided so that `handleSubmit` *itself* doesn't change unless `productId` or `referrer` has changed. This lets you pass the `handleSubmit` function down without unnecessarily re-rendering `ShippingForm`. Your code won't run until the user submits the form.
<Trans>**`useCallback`은 *함수 자체*를 캐시합니다.** `useMemo`와 달리, 제공한 함수를 호출하지 않습니다. 대신 제공한 함수를 캐시하여 `productId` 또는 `referrer`가 변경되지 않는 한 `handleSubmit` 자체가 변경되지 않도록 합니다. 이렇게 하면 불필요하게 `ShippingForm`을 리렌더링하지 않고도 `handleSubmit` 함수를 전달할 수 있습니다. 사용자가 폼을 제출할 때까지 코드가 실행되지 않습니다.</Trans>

If you're already familiar with [`useMemo`,](/reference/react/useMemo) you might find it helpful to think of `useCallback` as this:
<Trans>[`useMemo`,](/reference/react/useMemo)에 이미 익숙하다면 `useCallback`을 이렇게 생각하면 도움이 될 수 있습니다:</Trans>

```js
// Simplified implementation (inside React) 간소화된 구현체(리액트에서) 
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[Read more about the difference between `useMemo` and `useCallback`.](/reference/react/useMemo#memoizing-a-function)
<Trans>[`useMemo`와 `useCallback`의 차이점에 대해 자세히 알아보세요.](/reference/react/useMemo#memoizing-a-function)</Trans>

</DeepDive>

<DeepDive>

#### Should you add useCallback everywhere? {/*should-you-add-usecallback-everywhere*/} <Trans>useCallback을 모든 곳에 추가해야 하나요?</Trans>

If your app is like this site, and most interactions are coarse (like replacing a page or an entire section), memoization is usually unnecessary. On the other hand, if your app is more like a drawing editor, and most interactions are granular (like moving shapes), then you might find memoization very helpful.
<Trans>만약 당신의 앱이 이 사이트처럼 대부분의 인터랙션이 거칠고(페이지 또는 전체 섹션 교체 등) 인터랙션이 대부분인 앱의 경우 일반적으로 메모이제이션이 필요하지 않습니다. 반면에 앱이 그림 편집기와 비슷하고 대부분의 인터랙션이 도형 이동과 같이 세분화되어 있다면 메모이제이션은 매우 유용할 수 있습니다.</Trans> 

Caching a function with `useCallback`  is only valuable in a few cases:
<Trans>`useCallback`으로 함수를 캐싱하는 것은 몇 가지 경우에만 유용합니다:</Trans>

- You pass it as a prop to a component wrapped in [`memo`.](/reference/react/memo) You want to skip re-rendering if the value hasn't changed. Memoization lets your component re-render only if dependencies changed.
- The function you're passing is later used as a dependency of some Hook. For example, another function wrapped in `useCallback` depends on it, or you depend on this function from [`useEffect.`](/reference/react/useEffect)
<TransBlock>
- [`memo`](/reference/react/memo)로 래핑된 컴포넌트에 prop으로 전달합니다. 값이 변경되지 않았다면 렌더링을 건너뛰고 싶을 것입니다. 메모이제이션을 사용하면 의존성이 변경된 경우에만 컴포넌트를 리렌더링할 수 있습니다.
- 전달한 함수는 나중에 일부 Hook의 종속성으로 사용됩니다. 예를 들어, `useCallback`으로 래핑된 다른 함수가 이 함수에 종속되거나, `useEffect`에서 이 함수에 종속될 수 있습니다.
</TransBlock>

There is no benefit to wrapping a function in `useCallback` in other cases. There is no significant harm to doing that either, so some teams choose to not think about individual cases, and memoize as much as possible. The downside is that code becomes less readable. Also, not all memoization is effective: a single value that's "always new" is enough to break memoization for an entire component.
<Trans>다른 경우에는 함수를 `useCallback`으로 감싸는 것이 이득이 없습니다. 그렇게 한다고 해서 크게 해가 되는 것도 아니기 때문에 일부 팀에서는 개별 사례에 대해 생각하지 않고 가능한 한 많이 메모하는 방식을 선택하기도 합니다. 단점은 코드 가독성이 떨어진다는 것입니다. 또한 모든 메모이제이션이 효과적인 것은 아닙니다. "항상 새로운" 단일 값만으로도 전체 컴포넌트에 대한 메모이제이션이 깨질 수 있습니다.</Trans>

Note that `useCallback` does not prevent *creating* the function. You're always creating a function (and that's fine!), but React ignores it and gives you back a cached function if nothing changed.
<Trans>`useCallback`이 함수 생성을 막지 않는다는 것을 기억하세요. 여러분은 항상 함수를 생성하지만(그리고 그것은 괜찮습니다!), React는 이를 무시하고 변경된 것이 없다면 캐시된 함수를 반환합니다.</Trans>

**In practice, you can make a lot of memoization unnecessary by following a few principles:**
<Trans>실제로, 당신이 몇 가지 원칙을 따름으로써 많은 메모이제이션을 불필요하게 만들 수 있습니다:</Trans>

1. When a component visually wraps other components, let it [accept JSX as children.](/learn/passing-props-to-a-component#passing-jsx-as-children) Then, if the wrapper component updates its own state, React knows that its children don't need to re-render. <Trans>1. 컴포넌트가 다른 컴포넌트를 시각적으로 감쌀 때 [JSX를 자식으로 받아들이도록 합니다.](/learn/passing-props-to-a-component#passing-jsx-as-children) 그리고 래퍼 컴포넌트가 자신의 state를 업데이트하면 React는 그 자식 컴포넌트가 리렌더링할 필요가 없다는 것을 알 수 있습니다.</Trans>
1. Prefer local state and don't [lift state up](/learn/sharing-state-between-components) any further than necessary. Don't keep transient state like forms and whether an item is hovered at the top of your tree or in a global state library. <Trans>2. 로컬 state를 선호하고 필요 이상으로 state를 끌어올리지 마세요. 전역 상태 라이브러리나 트리 상단에 있는 폼(form)이나 아이템(item)의 호버(hover) 상태와 같은 일시적인(transient) 상태를 유지하지 마세요.</Trans>
1. Keep your [rendering logic pure.](/learn/keeping-components-pure) If re-rendering a component causes a problem or produces some noticeable visual artifact, it's a bug in your component! Fix the bug instead of adding memoization.<Trans>3. [렌더링 로직을 순수하게](/learn/keeping-components-pure) 유지하세요. 만약 컴포넌트를 리렌더링했을 때 문제가 발생하거나 눈에 띄는 시각적 아티팩트가 생성된다면 컴포넌트에 버그가 있는 것입니다! 메모이제이션을를 추가하는 대신 버그를 수정하세요.</Trans>
1. Avoid [unnecessary Effects that update state.](/learn/you-might-not-need-an-effect) Most performance problems in React apps are caused by chains of updates originating from Effects that cause your components to render over and over. <Trans>4. [state를 업데이트하는 불필요한 Effect](/learn/you-might-not-need-an-effect)를 피하세요. React 앱의 대부분의 성능 문제는 컴포넌트를 반복해서 렌더링하게 만드는 Effects에서 발생하는 업데이트 체인으로 인해 발생합니다.</Trans>
1. Try to [remove unnecessary dependencies from your Effects.](/learn/removing-effect-dependencies) For example, instead of memoization, it's often simpler to move some object or a function inside an Effect or outside the component.
<Trans>5. Effects에서 불필요한 종속성을 제거하세요. 예를 들어, 메모이제이션 대신 일부 겍체나 함수를 Effect 내부나 컴포넌트 외부로 이동하는 것이 더 간단할 때가 많습니다.</Trans>

If a specific interaction still feels laggy, [use the React Developer Tools profiler](/blog/2018/09/10/introducing-the-react-profiler.html) to see which components benefit the most from memoization, and add memoization where needed. These principles make your components easier to debug and understand, so it's good to follow them in any case. In long term, we're researching [doing memoization automatically](https://www.youtube.com/watch?v=lGEMwh32soc) to solve this once and for all.
<Trans>특정 인터랙션이 여전히 느리게 느껴진다면 [React 개발자 도구 프로파일러](/blog/2018/09/10/introducing-the-react-profiler.html)를 사용해 어떤 컴포넌트가 메모이제이션의 이점을 가장 많이 누리는지 확인하고 필요한 경우 메모이제이션을 추가하세요. 이러한 원칙은 컴포넌트를 더 쉽게 디버깅하고 이해할 수 있게 해주므로 어떤 경우든 이 원칙을 따르는 것이 좋습니다. 장기적으로는 이 문제를 완전히 해결하기 위해 [메모이제이션을 자동으로 수행](https://www.youtube.com/watch?v=lGEMwh32soc)하는 방법을 연구하고 있습니다.</Trans>

</DeepDive>

<Recipes titleText="The difference between useCallback and declaring a function directly" titleId="examples-rerendering">

#### Skipping re-rendering with `useCallback` and `memo`<Trans>`useCallback`과 `memo`로 리렌더링 건너뛰기</Trans> {/*skipping-re-rendering-with-usecallback-and-memo*/} 

In this example, the `ShippingForm` component is **artificially slowed down** so that you can see what happens when a React component you're rendering is genuinely slow. Try incrementing the counter and toggling the theme.
<Trans>이 예시에서는 렌더링 중인 React 컴포넌트가 실제로 느릴 때 어떤 일이 일어나는지 확인할 수 있도록 ShippingForm 컴포넌트의 속도를 인위적으로 느리게 설정했습니다. 카운터를 증가시키고 테마를 토글해 보세요.</Trans>

Incrementing the counter feels slow because it forces the slowed down `ShippingForm` to re-render. That's expected because the counter has changed, and so you need to reflect the user's new choice on the screen.
<Trans>카운터를 증가시키면 느려진 `ShippingForm`을 리렌더링해야 하므로 느리게 느껴집니다. 카운터가 변경되었으므로 사용자의 새로운 선택 사항을 화면에 반영해야 하기 때문에 예상되는 현상입니다.</Trans>

Next, try toggling the theme. **Thanks to `useCallback` together with [`memo`](/reference/react/memo), it’s fast despite the artificial slowdown!** `ShippingForm` skipped re-rendering because the `handleSubmit` function has not changed. The `handleSubmit` function has not changed because both `productId` and `referrer` (your `useCallback` dependencies) haven't changed since last render.
<Trans>다음으로 테마를 전환해 보세요. **[`memo`](/reference/react/memo)와 함께 `useCallback` 덕분에 인위적인 속도 저하에도 불구하고 빠릅니다!** `handleSumbmit` 함수가 변경되지 않았기 때문에 `ShippingForm`이 리렌더링을 건너뛰었습니다. 지난 렌더링 이후 `productId`와 `referrer`(`useCallback` 종속성)가 모두 변경되지 않았기 때문에 `handleSubmit` 함수가 변경되지 않았습니다.<Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Always re-rendering a component<Trans>항상 리렌더링되는 컴포넌트</Trans> {/*always-re-rendering-a-component*/} 

In this example, the `ShippingForm` implementation is also **artificially slowed down** so that you can see what happens when some React component you're rendering is genuinely slow. Try incrementing the counter and toggling the theme.
<Trans>이 예시에서는 렌더링 중인 일부 React 컴포넌트가 실제로 느릴 때 어떤 일이 발생하는지 확인할 수 있도록 `ShippingForm` 구현도 인위적으로 느리게 설정했습니다. 카운터를 증가시키고 테마를 토글해 보세요.</Trans>

Unlike in the previous example, toggling the theme is also slow now! This is because **there is no `useCallback` call in this version,** so `handleSubmit` is always a new function, and the slowed down `ShippingForm` component can't skip re-rendering.
<Trans>이전 예제와 달리 이제 테마 전환도 느려졌습니다! 이 버전에서는 `useCallback` 호출이 없기 때문에 `handleSubmit`은 항상 새로운 함수이며, 속도가 느려진 `ShippingForm` 컴포넌트가 리렌더링을 건너뛸 수 없기 때문입니다.</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


However, here is the same code **with the artificial slowdown removed.** Does the lack of `useCallback` feel noticeable or not?
<Trans>하지만 다음은 **인위적인 속도 저하를 제거**한 동일한 코드입니다. `useCallback`의 결핍이 눈에 띄게 느껴지나요?</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('Rendering <ShippingForm />');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


Quite often, code without memoization works fine. If your interactions are fast enough, you don't need memoization.
<Trans>메모이제이션 없이도 코드가 잘 작동하는 경우가 꽤 많습니다. 인터랙션이 충분히 빠르다면 메모이제이션이 필요하지 않습니다.</Trans>

Keep in mind that you need to run React in production mode, disable [React Developer Tools](/learn/react-developer-tools), and use devices similar to the ones your app's users have in order to get a realistic sense of what's actually slowing down your app.
<Trans>실제로 앱의 속도를 저하시키는 요인을 현실적으로 파악하려면 프로덕션 모드에서 React를 실행하고, [React 개발자 도구](/learn/react-developer-tools)를 비활성화하여 앱 사용자가 사용하는 것과 유사한 기기를 사용해야 한다는 점을 기억하세요.</Trans>

<Solution />

</Recipes>

---

### Updating state from a memoized callback<Trans>메모된 콜백에서 state 업데이트하기</Trans> {/*updating-state-from-a-memoized-callback*/}

Sometimes, you might need to update state based on previous state from a memoized callback.
<Trans>때로는 메모된 콜백의 이전 state를 기반으로 state를 업데이트해야 할 수도 있습니다.</Trans>

This `handleAddTodo` function specifies `todos` as a dependency because it computes the next todos from it:
<Trans>이 `handleAddTodo` 함수는 `todos`를 종속성으로 지정하여 다음 할일을 계산하기 때문입니다:</Trans>

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

You'll usually want memoized functions to have as few dependencies as possible. When you read some state only to calculate the next state, you can remove that dependency by passing an [updater function](/reference/react/useState#updating-state-based-on-the-previous-state) instead:
<Trans>일반적으로 메모화된 함수는 가능한 한 적은 종속성을 갖기를 원할 것입니다. 다음 state를 계산하기 위해 일부 state만 읽어야 하는 경우, 대신 [업데이터 함수](/reference/react/useState#updating-state-based-on-the-previous-state)를 전달하여 해당 종속성을 제거할 수 있습니다:</Trans>

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ No need for the todos dependency 
  // ...
```

Here, instead of making `todos` a dependency and reading it inside, you pass an instruction about *how* to update the state (`todos => [...todos, newTodo]`) to React. [Read more about updater functions.](/reference/react/useState#updating-state-based-on-the-previous-state)
<Trans>여기서는 `todos`들을 종속성으로 만들고 내부에서 읽는 대신, state를 업데이트하는 *방법*에 대한 명령어(`todos => [...todos, newTodo]`)를 React에 전달합니다. [업데이터 함수에 대해 자세히 읽어보세요.](/reference/react/useState#updating-state-based-on-the-previous-state)</Trans>

---

### Preventing an Effect from firing too often<Trans>이펙트가 너무 자주 발동되지 않도록 하기</Trans> {/*preventing-an-effect-from-firing-too-often*/}

Sometimes, you might want to call a function from inside an [Effect:](/learn/synchronizing-with-effects)
<Trans>가끔 [Effect](/learn/synchronizing-with-effects) 내부에서 함수를 호출하고 싶을 때가 있습니다:</Trans>

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    // ...
```

This creates a problem. [Every reactive value must be declared as a dependency of your Effect.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) However, if you declare `createOptions` as a dependency, it will cause your Effect to constantly reconnect to the chat room:
<Trans>이로 인해 문제가 발생합니다. [모든 반응형 값은 Effect의 종속성으로 선언해야 합니다.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) 그러나 `createOptions`를 종속성으로 선언하면 Effect가 채팅방에 계속 재연결하게 됩니다:</Trans>


```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 Problem: This dependency changes on every render
  // ...
```

To solve this, you can wrap the function you need to call from an Effect into `useCallback`:
<Trans>이 문제를 해결하려면 Effect에서 호출해야 하는 함수를 `useCallback`으로 래핑하면 됩니다:</Trans>

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState(''); 

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Only changes when roomId changes

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ Only changes when createOptions changes
  // ...
```

This ensures that the `createOptions` function is the same between re-renders if the `roomId` is the same. **However, it's even better to remove the need for a function dependency.** Move your function *inside* the Effect:
<Trans>이렇게 하면 `roomId`가 동일한 경우 리렌더링 사이에 `createOptions` 함수가 동일하게 적용됩니다. **하지만 함수 종속성을 없애는 편이 더 좋습니다.** 함수를 Effect *내부*로 이동하세요:</Trans>

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ No need for useCallback or function dependencies!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Only changes when roomId changes
  // ...
```

Now your code is simpler and doesn't need `useCallback`. [Learn more about removing Effect dependencies.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)
<Trans>이제 코드가 더 간단해졌으며 `useCallback`이 필요하지 않습니다. [Effect 종속성 제거에 대해 자세히 알아보세요.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)</Trans>

---

### Optimizing a custom Hook<Trans>커스텀 훅 최적화하기</Trans> {/*optimizing-a-custom-hook*/}

If you're writing a [custom Hook,](/learn/reusing-logic-with-custom-hooks) it's recommended to wrap any functions that it returns into `useCallback`:
<Trans>[커스텀 훅](/learn/reusing-logic-with-custom-hooks)을 작성하는 경우 반환하는 모든 함수를 `useCallback`으로 감싸는 것이 좋습니다:</Trans>

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

This ensures that the consumers of your Hook can optimize their own code when needed.
<Trans>이렇게 하면 Hook의 소비자가 필요할 때 자신의 코드를 최적화할 수 있습니다.
</Trans>

---

## Troubleshooting {/*troubleshooting*/}

### Every time my component renders, `useCallback` returns a different function<Trans>컴포넌트가 렌더링될 때마다 `useCallback`은 다른 함수를 반환합니다.</Trans> {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

Make sure you've specified the dependency array as a second argument!
<Trans>두 번째 인자로 종속성 배열을 지정했는지 확인하세요!</Trans>

If you forget the dependency array, `useCallback` will return a new function every time:
<Trans>종속성 배열을 까먹은 경우, `useCallback`은 매번 새로운 함수를 반환합니다:</Trans>

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 Returns a new function every time: no dependency array
  // ...
```

This is the corrected version passing the dependency array as a second argument:
<Trans>이것은 종속성 배열을 두 번째 인수로 전달하는 수정된 버전입니다:</Trans>

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ Does not return a new function unnecessarily
  // ...
```

If this doesn't help, then the problem is that at least one of your dependencies is different from the previous render. You can debug this problem by manually logging your dependencies to the console:
<Trans>그래도 도움이 되지 않는다면 종속성 중 하나 이상이 이전 렌더링과 다르다는 문제일 수 있습니다. 종속성을 콘솔에 수동으로 로깅하여 이 문제를 디버그할 수 있습니다:</Trans>

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

You can then right-click on the arrays from different re-renders in the console and select "Store as a global variable" for both of them. Assuming the first one got saved as `temp1` and the second one got saved as `temp2`, you can then use the browser console to check whether each dependency in both arrays is the same:
<Trans>그런 다음 콘솔에서 서로 다른 리렌더의 배열을 마우스 오른쪽 버튼으로 클릭하고 두 배열 모두에 대해 "전역 변수로 저장"을 선택할 수 있습니다. 첫 번째 배열이 `temp1`로 저장되고 두 번째 배열이 `temp2`로 저장되었다고 가정하면 브라우저 콘솔을 사용하여 두 배열의 각 종속성이 동일한지 확인할 수 있습니다:</Trans>

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

When you find which dependency is breaking memoization, either find a way to remove it, or [memoize it as well.](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)
<Trans>어떤 종속성이 메모이제이션을 방해하는지 찾았다면 그 종속성을 제거할 방법을 찾거나 해당 종속성도 메모이제이션을 하면된다.</Trans>

---

### I need to call `useCallback` for each list item in a loop, but it's not allowed<Trans>루프에서 각 목록의 항목에 대해 `useCallback`으로 호출해야 하지만 허용되지 않습니다.</Trans> {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Suppose the `Chart` component is wrapped in [`memo`](/reference/react/memo). You want to skip re-rendering every `Chart` in the list when the `ReportList` component re-renders. However, you can't call `useCallback` in a loop:
<Trans>`Chart` 컴포넌트가 [`memo`](/reference/react/memo)로 감싸져 있다고 가정해 봅시다. `ReportList` 컴포넌트가 리렌더링할 때 목록의 모든 `Chart`를 리렌더링하는 것을 건너뛰고 싶을 수 있습니다. 하지만 반복문에서 `useCallback`을 호출할 수는 없습니다:</Trans>

```js {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 You can't call useCallback in a loop like this:
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

Instead, extract a component for an individual item, and put `useCallback` there:
<Trans>대신 개별 항목에 대한 컴포넌트를 추출하고 거기에 `useCallback`을 넣습니다:</Trans>

```js {5,12-21}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Call useCallback at the top level:
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

Alternatively, you could remove `useCallback` in the last snippet and instead wrap `Report` itself in [`memo`.](/reference/react/memo) If the `item` prop does not change, `Report` will skip re-rendering, so `Chart` will skip re-rendering too:
<Trans>또는 마지막 스니펫에서 `useCallback`을 제거하고 대신 `report` 자체를 [`memo`](/reference/react/memo)로 감싸는 방법도 있습니다. `item`의 prop이 변경되지 않으면 `report`가 리렌더링을 건너뛰므로 `Chart`도 리렌더링을 건너뜁니다:</Trans>

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```
