---
title: useMemo
translators: [이나령, 방재정, 고석영]
---

<Intro>

`useMemo` is a React Hook that lets you cache the result of a calculation between re-renders.
<Trans>`useMemo`는 리렌더링 사이의 계산 결과를 캐시할 수 있는 React 훅입니다.</Trans>

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `useMemo(calculateValue, dependencies)` {/*usememo*/}

Call `useMemo` at the top level of your component to cache a calculation between re-renders:
<Trans>컴포넌트 최상단에 `useMemo`를 호출하여 리렌더링 사이의 계산 결과를 캐시합니다.</Trans>

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

* `calculateValue`: The function calculating the value that you want to cache. It should be pure, should take no arguments, and should return a value of any type. React will call your function during the initial render. On next renders, React will return the same value again if the `dependencies` have not changed since the last render. Otherwise, it will call `calculateValue`, return its result, and store it so it can be reused later.
<Trans>`calculateValue`: 캐시하려는 값을 계산하는 함수입니다. 이 함수는 순수 함수여야 하며, 인자를 받지 않고, 어떤 타입의 값을 반환해야 합니다. React는 초기 렌더링 중에 함수를 호출합니다. 이후 렌더링에서 `dependencies`가 이전 렌더링 이후 변경되지 않았다면, React는 동일한 값을 다시 반환합니다. 그렇지 않으면, `calculateValue`를 호출하고 그 결과를 반환하며, 나중에 재사용할 수 있도록 저장합니다.</Trans>

* `dependencies`: The list of all reactive values referenced inside of the `calculateValue` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is [configured for React](/learn/editor-setup#linting), it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison.
<Trans>`dependencies`:  `calculateValue` 코드 내에서 참조되는 모든 반응형 값들의 목록입니다. 반응형 값에는 props, state 및 컴포넌트 본문 내에서 직접 선언된 모든 변수와 함수가 포함됩니다. React용으로 구성된 린터를 사용하면, 모든 반응형 값이 의존성으로 올바르게 지정되어 있는지 확인합니다. 의존성 목록에는 항목 수가 일정하고 `[dep1, dep2, dep3]`와 같이 인라인으로 작성되어야 합니다. React는 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교 알고리즘을 사용하여 각 의존성을 이전 값과 비교합니다.</Trans>


#### Returns<Trans>반환값</Trans> {/*returns*/}

On the initial render, `useMemo` returns the result of calling `calculateValue` with no arguments.
<Trans>초기 렌더링에서는 `useMemo`가 인자 없이 `calculateValue`를 호출한 결과를 반환합니다.</Trans>

During next renders, it will either return an already stored value from the last render (if the dependencies haven't changed), or call `calculateValue` again, and return the result that `calculateValue` has returned.
<Trans>이후 렌더링에서 의존성이 변경되지 않은 경우에는 마지막 렌더링에서 저장된 값을 반환하거나, 또는 `calculateValue`를 다시 호출하여 `calculateValue`가 반환한 결과를 반환합니다.</Trans>

#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

* `useMemo` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a new component and move the state into it.
<Trans>`useMemo`는 Hook이므로 **컴포넌트의 최상위 레벨** 또는 사용자 정의 Hook에서만 호출할 수 있습니다. 루프나 조건문 안에서 호출할 수 없습니다. 만약 필요하다면, 새로운 컴포넌트를 생성하고 해당 컴포넌트로 state를 이동시키세요.</Trans>

* In Strict Mode, React will **call your calculation function twice** in order to [help you find accidental impurities.](#my-calculation-runs-twice-on-every-re-render) This is development-only behavior and does not affect production. If your calculation function is pure (as it should be), this should not affect your logic. The result from one of the calls will be ignored.
<Trans>Strict 모드에서는 React가 [의도하지 않은 불순한 요소를 찾기 위해](#my-calculation-runs-twice-on-every-re-render) 계산 함수를 두 번 호출합니다. 이것은 개발용 동작이며, 실제 제품에는 영향을 미치지 않습니다. 계산 함수가 순수하다면(그렇게 되어야 함), 이것은 컴포넌트의 로직에 영향을 미치지 않을 것입니다. 두 번의 호출 중 하나의 결과는 무시됩니다.</Trans>

* React **will not throw away the cached value unless there is a specific reason to do that.** For example, in development, React throws away the cache when you edit the file of your component. Both in development and in production, React will throw away the cache if your component suspends during the initial mount. In the future, React may add more features that take advantage of throwing away the cache--for example, if React adds built-in support for virtualized lists in the future, it would make sense to throw away the cache for items that scroll out of the virtualized table viewport. This should be fine if you rely on `useMemo` solely as a performance optimization. Otherwise, a [state variable](/reference/react/useState#avoiding-recreating-the-initial-state) or a [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) may be more appropriate.
<Trans>React는 **특정한 이유가 있지 않는 한, 캐시된 값을 유지하려고 합니다.** 예를 들어, React는 개발 중에 컴포넌트 파일을 수정하면 캐시된 값을 폐기한다. 발과 제품 환경 모두에서, 초기 마운트 중 컴포넌트가 일시 중단되면 React는 캐시를 폐기합니다. 미래에 React는 캐시를 폐기하는 것을 활용하는 더 많은 기능을 추가할 수 있습니다. 예를 들어, 미래에 React가 가상화된 목록에 대한 기본 지원을 추가한다면, 가상화된 테이블 뷰포트에서 벗어난 항목에 대한 캐시를 폐기하는 것이 타당할 것입니다. `useMemo`를 성능 최적화만을 위해 의존하는 경우 이것은 기대에 부합해야 합니다. 그렇지 않다면, [state variable](/reference/react/useState#avoiding-recreating-the-initial-state) 또는 [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents)가 더 적절할 수 있습니다.</Trans>

<Note>

Caching return values like this is also known as [*memoization*,](https://en.wikipedia.org/wiki/Memoization) which is why this Hook is called `useMemo`.
<Trans>반환 값을 캐싱하는 것을 [*메모이제이션*](https://en.wikipedia.org/wiki/Memoization)이라 하며 이 훅이 `useMemo`라고 불리는 이유입니다.</Trans>

</Note>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Skipping expensive recalculations {/*skipping-expensive-recalculations*/}
### Skipping expensive recalculations<Trans>| 비용이 많이 드는 재계산 생략하기</Trans> {/*skipping-expensive-recalculations*/}

To cache a calculation between re-renders, wrap it in a `useMemo` call at the top level of your component:
<Trans>리렌더링간의 계산값을 캐시하려면 컴포넌트의 최상단에서 `useMemo`를 호출하고 해당 값을 래핑하세요:</Trans>

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

You need to pass two things to `useMemo`:

1. A <CodeStep step={1}>calculation function</CodeStep> that takes no arguments, like `() =>`, and returns what you wanted to calculate.
2. A <CodeStep step={2}>list of dependencies</CodeStep> including every value within your component that's used inside your calculation.
<TransBlock>
`useMemo`에는 두 가지를 전달해야 합니다:
1. 인자(argument)를 받지 않는 <CodeStep step={1}>계산 함수</CodeStep>(예: `() =>`)로 원하는 값을 계산하여 반환해야 합니다.
2. 컴포넌트 내에서 계산에 사용되는 모든 값을 포함하는 <CodeStep step={2}>의존성 목록</CodeStep>입니다.</TransBlock>

On the initial render, the <CodeStep step={3}>value</CodeStep> you'll get from `useMemo` will be the result of calling your <CodeStep step={1}>calculation</CodeStep>.
<Trans>초기 렌더링 시에는, `useMemo`를 통해 얻는 <CodeStep step={3}>값</CodeStep>은 <CodeStep step={1}>계산 함수</CodeStep>를 호출한 결과값입니다.</Trans>

On every subsequent render, React will compare the <CodeStep step={2}>dependencies</CodeStep> with the dependencies you passed during the last render. If none of the dependencies have changed (compared with [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useMemo` will return the value you already calculated before. Otherwise, React will re-run your calculation and return the new value.
<Trans>그 이후 모든 렌더링에서, React는 이전 렌더링에서 전달한 의존성과 현재의 <CodeStep step={2}>의존성</CodeStep>을 비교합니다. 의존성이 변경되지 않았다면([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)와 비교), `useMemo`는 이전에 이미 계산한 값을 반환합니다. 그렇지 않다면, React는 계산을 다시 실행하고 새로운 값을 반환합니다.</Trans>

In other words, `useMemo` caches a calculation result between re-renders until its dependencies change.
<Trans>간단히 말해서, `useMemo`는 의존성이 변경될 때까지 렌더링 사이에서 계산 결과를 캐시합니다</Trans>

**Let's walk through an example to see when this is useful.**
<Trans>**언제 이것이 유용한지 예를 들어 살펴 봅시다.**</Trans>

By default, React will re-run the entire body of your component every time that it re-renders. For example, if this `TodoList` updates its state or receives new props from its parent, the `filterTodos` function will re-run:
<Trans>기본적으로, React는 컴포넌트가 다시 렌더링될 때마다 컴포넌트 전체 본문을 다시 실행합니다. 예를 들어, 이 `TodoList`가 상태를 업데이트하거나 부모로부터 새로운 props를 받는 경우, `filterTodos` 함수가 다시 실행됩니다:</Trans>

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

Usually, this isn't a problem because most calculations are very fast. However, if you're filtering or transforming a large array, or doing some expensive computation, you might want to skip doing it again if data hasn't changed. If both `todos` and `tab` are the same as they were during the last render, wrapping the calculation in `useMemo` like earlier lets you reuse `visibleTodos` you've already calculated before.
<Trans>대부분의 계산은 매우 빠르기 때문에 이것은 문제가 되지 않습니다.  그러나 큰 배열을 필터링하거나 변환하거나, 고비용의 계산을 수행할 때, 데이터가 변경되지 않았다면 다시 계산하는 것을 건너뛰고 싶을 수 있습니다. `todos`와 `tab`이 이전 렌더링 때와 동일하다면, 이전처럼 계산을 `useMemo`로 감싸서 이전에 이미 계산해놓은 `visibleTodos`를 재사용할 수 있습니다.</Trans>

This type of caching is called *[memoization.](https://en.wikipedia.org/wiki/Memoization)*
<Trans>이러한 종류의 캐싱을 *[메모이제이션](https://en.wikipedia.org/wiki/Memoization)* 이라고 합니다.</Trans>


<Note>

**You should only rely on `useMemo` as a performance optimization.** If your code doesn't work without it, find the underlying problem and fix it first. Then you may add `useMemo` to improve performance.
<Trans>`useMemo`는 **성능 최적화 목적으로 사용해야 합니다.** 이것 없이 코드가 작동하지 않는다면, 근본적인 문제를 찾아 해결한 후에 `useMemo` 를 추가하여 성능을 개선할 수 있습니다.</Trans>

</Note>

<DeepDive>

#### How to tell if a calculation is expensive?<Trans>비용이 많이 드는 계산인지 어떻게 알 수 있나요?</Trans> {/*how-to-tell-if-a-calculation-is-expensive*/}

In general, unless you're creating or looping over thousands of objects, it's probably not expensive. If you want to get more confidence, you can add a console log to measure the time spent in a piece of code:
<Trans>일반적으로 수천 개의 개체를 만들거나 반복하는 경우가 아니라면 비용이 많이 들지 않을 것입니다. 좀 더 확신을 얻고 싶다면 콘솔 로그를 추가하여 코드에 소요된 시간을 측정할 수 있습니다:</Trans>

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

Perform the interaction you're measuring (for example, typing into the input). You will then see logs like `filter array: 0.15ms` in your console. If the overall logged time adds up to a significant amount (say, `1ms` or more), it might make sense to memoize that calculation. As an experiment, you can then wrap the calculation in `useMemo` to verify whether the total logged time has decreased for that interaction or not:
<Trans>측정하려는 인터렉션을 수행합니다(예: input에 입력). 그러면 `filter array: 0.15ms`와 같은 로그가 콘솔에 표시됩니다. 전체적으로 기록된 시간이 상당한 양(예: 1ms 이상)으로 합산되면 해당 계산을 메모해 두는 것이 좋습니다. 그런 다음 실험으로 해당 계산을 `useMemo`로 감싸서 해당 상호작용에 대해 총 로깅 시간이 감소했는지 여부를 확인할 수 있습니다:</Trans>

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // Skipped if todos and tab haven't changed
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo` won't make the *first* render faster. It only helps you skip unnecessary work on updates.
<Trans>`useMemo`는 첫 번째 렌더링을 더 빠르게 만들지 않습니다. 업데이트 시 불필요한 작업을 건너뛰는 데만 도움이 됩니다.</Trans>

Keep in mind that your machine is probably faster than your users' so it's a good idea to test the performance with an artificial slowdown. For example, Chrome offers a [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) option for this.
<Trans>컴퓨터가 사용자 컴퓨터보다 빠를 수 있으므로 인위적으로 속도를 늦춰 성능을 테스트하는 것이 좋습니다. 예를 들어 Chrome은 이를 위한 [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) 옵션을 제공합니다.</Trans>

Also note that measuring performance in development will not give you the most accurate results. (For example, when [Strict Mode](/reference/react/StrictMode) is on, you will see each component render twice rather than once.) To get the most accurate timings, build your app for production and test it on a device like your users have.
<Trans>또한 개발 중에 성능을 측정하는 것은 가장 정확한 결과를 제공하지 않는다는 점에 유의하세요. (예를 들어, [Strict Mode](/reference/react/StrictMode)를 켜면 각 컴포넌트가 한 번이 아닌 두 번 렌더링되는 것을 볼 수 있습니다.) 가장 정확한 타이밍을 얻으려면 프로덕션용 앱을 빌드하고 사용자가 사용하는 것과 같은 기기에서 테스트하세요.</Trans>

</DeepDive>

<DeepDive>

#### Should you add useMemo everywhere?<Trans>모든 곳에 `useMemo`를 추가해야 하나요?</Trans>{*should-you-add-usememo-everywhere*/}

If your app is like this site, and most interactions are coarse (like replacing a page or an entire section), memoization is usually unnecessary. On the other hand, if your app is more like a drawing editor, and most interactions are granular (like moving shapes), then you might find memoization very helpful. 
<Trans>이 사이트와 같이 대부분의 인터렉션이 굵직하고(페이지 또는 전체 섹션 교체 등) 상호 작용이 대부분인 앱의 경우 일반적으로 메모화가 필요하지 않습니다. 반면에 앱이 그리기 편집기와 비슷하고 대부분의 상호 작용이 도형 이동과 같이 세분화되어 있다면 메모화가 매우 유용할 수 있습니다.

</Trans>

Optimizing with `useMemo`  is only valuable in a few cases:

- The calculation you're putting in `useMemo` is noticeably slow, and its dependencies rarely change.
- You pass it as a prop to a component wrapped in [`memo`.](/reference/react/memo) You want to skip re-rendering if the value hasn't changed. Memoization lets your component re-render only when dependencies aren't the same.
- The value you're passing is later used as a dependency of some Hook. For example, maybe another `useMemo` calculation value depends on it. Or maybe you are depending on this value from [`useEffect.`](/reference/react/useEffect)
<TransBlock>
`useMemo`를 통한 최적화는 몇 가지 경우에만 유용합니다:

- `useMemo`에 넣는 계산이 눈에 띄게 느리고 의존성이 거의 변하지 않는 경우.
- [`memo`.](/reference/react/memo)로 래핑된 컴포넌트에 소품으로 전달하는 경우. 값이 변경되지 않은 경우 렌더링을 건너뛰고 싶을 수 있습니다. 메모화를 사용하면 의존성이 동일하지 않은 경우에만 컴포넌트를 다시 렌더링할 수 있습니다.
- 전달한 값은 나중에 어떤 Hook의 의존성으로 사용됩니다. 예를 들어, 다른 `useMemo` 계산 값이 이 값에 의존할 수 있습니다. 또는 `useEffect`에서 이 값에 의존하고 있을 수도 있습니다.
</TransBlock>

There is no benefit to wrapping a calculation in `useMemo` in other cases. There is no significant harm to doing that either, so some teams choose to not think about individual cases, and memoize as much as possible. The downside of this approach is that code becomes less readable. Also, not all memoization is effective: a single value that's "always new" is enough to break memoization for an entire component.
<Trans>다른 경우에는 계산을 `useMemo`로 감싸는 것이 이득이 없습니다. 그렇다고 해서 크게 해가 되는 것도 아니기 때문에 일부 팀에서는 개별 사례에 대해 생각하지 않고 가능한 한 많이 메모하는 방식을 선택하기도 합니다. 이 접근 방식의 단점은 코드 가독성이 떨어진다는 것입니다. 또한 모든 메모화가 효과적인 것은 아닙니다. "항상 새로운" 단일 값만으로도 전체 컴포넌트에 대한 메모화가 깨질 수 있습니다.

</Trans>

**In practice, you can make a lot of memoization unnecessary by following a few principles:**
<Trans>**실제로 몇 가지 원칙을 따르면 많은 메모이제이션을 불필요하게 만들 수 있습니다:

**</Trans>

1. When a component visually wraps other components, let it [accept JSX as children.](/learn/passing-props-to-a-component#passing-jsx-as-children) This way, when the wrapper component updates its own state, React knows that its children don't need to re-render.
<Trans>컴포넌트가 다른 컴포넌트를 시각적으로 래핑할 때 JSX를 자식으로 받아들이도록 하세요. 이렇게 하면 wrapper 컴포넌트가 자체 상태를 업데이트할 때 React는 그 자식 컴포넌트가 다시 렌더링할 필요가 없다는 것을 알 수 있습니다.</Trans>

2. Prefer local state and don't [lift state up](/learn/sharing-state-between-components) any further than necessary. For example, don't keep transient state like forms and whether an item is hovered at the top of your tree or in a global state library.
<Trans>로컬 상태를 선호하고 필요 이상으로 [상태를 끌어올리지](/learn/sharing-state-between-components) 마세요. 예를 들어, 양식과 같이 일시적인 상태나 항목이 트리의 맨 위에 있는지 또는 전역 상태 라이브러리에 있는지 여부는 유지하지 마세요.</Trans>

3. Keep your [rendering logic pure.](/learn/keeping-components-pure) If re-rendering a component causes a problem or produces some noticeable visual artifact, it's a bug in your component! Fix the bug instead of adding memoization.
<Trans>[렌더링 로직을 순수하게](/learn/keeping-components-pure) 유지하세요. 컴포넌트를 다시 렌더링했을 때 문제가 발생하거나 눈에 띄는 시각적 아티팩트가 생성된다면 컴포넌트에 버그가 있는 것입니다! 메모화를 추가하는 대신 버그를 수정하세요.
</Trans>

4. Avoid [unnecessary Effects that update state.](/learn/you-might-not-need-an-effect) Most performance problems in React apps are caused by chains of updates originating from Effects that cause your components to render over and over.
<Trans>[상태를 업데이트하는 불필요한 Effect](/learn/you-might-not-need-an-effect)를 피하세요. React 앱의 대부분의 성능 문제는 컴포넌트를 반복해서 렌더링하게 만드는 효과에서 발생하는 업데이트 체인으로 인해 발생합니다.
</Trans>

5. Try to [remove unnecessary dependencies from your Effects.](/learn/removing-effect-dependencies) For example, instead of memoization, it's often simpler to move some object or a function inside an Effect or outside the component.
<Trans>Effect에서 불필요한 의존성을 제거하세요. 예를 들어, 메모화 대신 일부 오브젝트나 함수를 효과 내부나 컴포넌트 외부로 이동하는 것이 더 간단할 때가 많습니다.</Trans>

If a specific interaction still feels laggy, [use the React Developer Tools profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) to see which components would benefit the most from memoization, and add memoization where needed. These principles make your components easier to debug and understand, so it's good to follow them in any case. In the long term, we're researching [doing granular memoization automatically](https://www.youtube.com/watch?v=lGEMwh32soc) to solve this once and for all.
<Trans>특정 인터렉션이 여전히 느리게 느껴진다면 [React 개발자 도구 profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)를 사용해 어떤 컴포넌트가 메모화를 통해 가장 큰 이점을 얻을 수 있는지 확인하고 필요한 경우 메모화를 추가하세요. 이러한 원칙은 컴포넌트를 더 쉽게 디버깅하고 이해할 수 있게 해주므로 어떤 경우든 이 원칙을 따르는 것이 좋습니다. 장기적으로는 이 문제를 완전히 해결하기 위해 세분화된 메모화를 자동으로 수행하는 방법을 연구하고 있습니다.

</Trans>

</DeepDive>

<Recipes titleText="The difference between useMemo and calculating a value directly" titleId="examples-recalculation" translatedTitle="useMemo와 값을 직접 계산하는 것의 차이점">

#### Skipping recalculation with `useMemo`<Trans>`useMemo`를 사용하여 재계산 건너뛰기</Trans>{/*skipping-recalculation-with-usememo*/}

In this example, the `filterTodos` implementation is **artificially slowed down** so that you can see what happens when some JavaScript function you're calling during rendering is genuinely slow. Try switching the tabs and toggling the theme.
<Trans>이 예제에서는 `filterTodos` 구현이 **인위적으로 느려지도록** 조작되어 렌더링 중 호출하는 JavaScript 함수가 실제로 느릴 때 어떤 일이 발생하는지 확인할 수 있습니다. 탭 전환과 테마 전환을 시도해 보세요.</Trans>

Switching the tabs feels slow because it forces the slowed down `filterTodos` to re-execute. That's expected because the `tab` has changed, and so the entire calculation *needs* to re-run. (If you're curious why it runs twice, it's explained [here.](#my-calculation-runs-twice-on-every-re-render))
<Trans>탭 전환은 느린 `filterTodos`를 다시 실행하기 때문에 느려지게 느껴집니다. 이것은 `tab`이 변경되었기 때문에 전체 계산이 다시 실행되어야 하므로 예상되는 동작입니다. (왜 두 번 실행되는지 궁금하다면, [여기](#my-calculation-runs-twice-on-every-re-render)에 설명되어 있습니다.)</Trans>

Toggle the theme. **Thanks to `useMemo`, it's fast despite the artificial slowdown!** The slow `filterTodos` call was skipped because both `todos` and `tab` (which you pass as dependencies to `useMemo`) haven't changed since the last render.
<Trans>다음으로 테마 전환을 시도해 보세요. `useMemo` 덕분에 **인위적인 지연에도 불구하고 빠릅니다!**
 느린 `filterTodos` 호출이 건너뛰어졌습니다. 왜냐하면 `todos`와 `tab`(을 useMemo에 의존성으로 전달하는 것)이 이전 렌더링 이후 변경되지 않았기 때문입니다.</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
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

#### Always recalculating a value<Trans>항상 값을 재계산하기</Trans> {/*always-recalculating-a-value*/}

In this example, the `filterTodos` implementation is also **artificially slowed down** so that you can see what happens when some JavaScript function you're calling during rendering is genuinely slow. Try switching the tabs and toggling the theme.
<Trans>이 예제에서는 렌더링 중에 호출하는 일부 JavaScript 함수가 실제로 느릴 때 어떤 일이 발생하는지 확인할 수 있도록 `filterTodos` 구현도 **인위적으로 느려져 있습니다.** 탭을 전환하고 테마를 토글해 보세요.</Trans>

Unlike in the previous example, toggling the theme is also slow now! This is because **there is no `useMemo` call in this version,** so the artificially slowed down `filterTodos` gets called on every re-render. It is called even if only `theme` has changed.
<Trans>이전 예제와 달리 이제 테마 토글도 느려졌습니다! **이 버전에서는 useMemo 호출이 없기** 때문에 다시 렌더링할 때마다 인위적으로 느려진 `filterTodos`가 호출되기 때문입니다. 테마만 변경된 경우에도 호출됩니다.</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
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

However, here is the same code **with the artificial slowdown removed.** Does the lack of `useMemo` feel noticeable or not?
<Trans>하지만 다음은 **인위적인 속도 저하를 제거한** 동일한 코드입니다. `useMemo` 부족이 눈에 띄게 느껴지나요?

</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Filtering ' + todos.length + ' todos for "' + tab + '" tab.');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
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

Quite often, code without memoization works fine. If your interactions are fast enough, you might not need memoization.
<Trans>메모화 없이도 코드가 잘 작동하는 경우가 많습니다. 인터랙션이 충분히 빠르다면 메모화가 필요하지 않을 수도 있습니다.

</Trans>

You can try increasing the number of todo items in `utils.js` and see how the behavior changes. This particular calculation wasn't very expensive to begin with, but if the number of todos grows significantly, most of the overhead will be in re-rendering rather than in the filtering. Keep reading below to see how you can optimize re-rendering with `useMemo`.
<Trans>`utils.js`에서 할 일 항목의 수를 늘려보고 동작이 어떻게 바뀌는지 확인할 수 있습니다. 이 특정 계산은 처음에는 비용이 많이 들지 않았지만 할 일의 수가 크게 증가하면 대부분의 오버헤드가 필터링이 아닌 리렌더링에 발생합니다. 아래에서 `useMemo`로 리렌더링을 최적화하는 방법을 계속 읽어보세요.

</Trans>

<Solution />

</Recipes>

---

### Skipping re-rendering of components<Trans>컴포넌트의 리렌더링 건너뛰기</Trans> {/*skipping-re-rendering-of-components*/}

In some cases, `useMemo` can also help you optimize performance of re-rendering child components. To illustrate this, let's say this `TodoList` component passes the `visibleTodos` as a prop to the child `List` component:
<Trans>어떤 경우에는 `useMemo`를 사용하여 자식 컴포넌트의 리렌더링 성능을 최적화할 수도 있습니다. 이를 설명하기 위해, TodoL`ist 컴포넌트가 `visibleTodos`를 자식 `List` 컴포넌트에 prop으로 전달한다고 가정해 보겠습니다.</Trans>

```js {5}
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

You've noticed that toggling the `theme` prop freezes the app for a moment, but if you remove `<List />` from your JSX, it feels fast. This tells you that it's worth trying to optimize the `List` component.
<Trans>`theme` prop을 전환하면 앱이 잠시 동안 멈추지만, JSX에서 `<List />`를 제거하면 빠르게 동작하는 것을 확인했습니다. 이는 `List` 컴포넌트를 최적화해볼 만한 가치가 있다는 것을 알려줍니다.</Trans>

**By default, when a component re-renders, React re-renders all of its children recursively.** This is why, when `TodoList` re-renders with a different `theme`, the `List` component *also* re-renders. This is fine for components that don't require much calculation to re-render. But if you've verified that a re-render is slow, you can tell `List` to skip re-rendering when its props are the same as on last render by wrapping it in [`memo`:](/reference/react/memo)
<Trans>**기본적으로 컴포넌트가 리렌더링되면 React는 모든 자식 컴포넌트를 재귀적으로 리렌더링합니다.** 이 때문에, 다른 `theme`으로 `TodoList`가 리렌더링되면 `List` 컴포넌트도 리렌더링됩니다. 이는 리렌더링에 많은 계산이 필요하지 않은 컴포넌트의 경우에는 괜찮습니다. 그러나 리렌더링이 느리다는 것을 확인했다면, 이전 렌더링과 동일한 prop이 있는 경우 `List`가 리렌더링을 건너뛰도록 [`memo`](/reference/react/memo)로 감싸 줄 수 있습니다.</Trans>

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**With this change, `List` will skip re-rendering if all of its props are the *same* as on the last render.** This is where caching the calculation becomes important! Imagine that you calculated `visibleTodos` without `useMemo`:
<Trans>이 변경으로 인해, **`List`는 모든 prop이 이전 렌더링과 같은 경우에만 리렌더링을 건너뛸 것입니다.** 이러한 캐싱 계산이 중요해지는 부분입니다! `useMemo`를 사용하지 않고 `visibleTodos`를 계산했다고 상상해 보세요:</Trans>

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // Every time the theme changes, this will be a different array...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... so List's props will never be the same, and it will re-render every time */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**In the above example, the `filterTodos` function always creates a *different* array,** similar to how the `{}` object literal always creates a new object. Normally, this wouldn't be a problem, but it means that `List` props will never be the same, and your [`memo`](/reference/react/memo) optimization won't work. This is where `useMemo` comes in handy:
<Trans>**위 예제에서는 `filterTodos` 함수가 항상 다른 배열을 생성합니다.** 이는 `{}` 객체 리터럴이 항상 새로운 객체를 생성하는 것과 비슷합니다. 일반적으로 이것은 문제가 되지 않지만, 이것은 `List`의 prop이 동일하지 않고, [`memo`](/reference/react/memo) 최적화가 작동하지 않게 된다는 것을 의미합니다. 이 때문에 `useMemo`가 유용하게 사용됩니다:</Trans>

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // Tell React to cache your calculation between re-renders...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...so as long as these dependencies don't change...
  );
  return (
    <div className={theme}>
      {/* ...List will receive the same props and can skip re-rendering */}
      <List items={visibleTodos} />
    </div>
  );
}
```


**By wrapping the `visibleTodos` calculation in `useMemo`, you ensure that it has the *same* value between the re-renders** (until dependencies change). You don't *have to* wrap a calculation in `useMemo` unless you do it for some specific reason. In this example, the reason is that you pass it to a component wrapped in [`memo`,](/reference/react/memo) and this lets it skip re-rendering. There are a few other reasons to add `useMemo` which are described further on this page.
<Trans>**`visibleTodos` 계산을 `useMemo`로 감싸면, 리렌더링 사이에 동일한 값이 보장됩니다.** (의존성이 변경될 때까지). 특정한 이유가 없다면 계산을 `useMemo`로 감싸지 않아도 됩니다. 이 예제에서의 이유는 [`memo`](/reference/react/memo)로 감싼 컴포넌트에 전달하기 때문에 리렌더링을 건너뛰게 해주기 위함입니다. 이 페이지에서 추가로 설명하는 몇 가지 다른 이유로 인해 `useMemo`를 추가할 수 있습니다.</Trans>

<DeepDive>

#### Memoizing individual JSX nodes<Trans>개별 JSX 노드 메모화</Trans> {/*memoizing-individual-jsx-nodes*/}

Instead of wrapping `List` in [`memo`](/reference/react/memo), you could wrap the `<List />` JSX node itself in `useMemo`:
<Trans>`List`를 [`memo`](/reference/react/memo)로 감싸는 대신 `<List />` JSX 노드 자체를 `useMemo`로 감싸면 됩니다:

</Trans>

```js {3,6}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

The behavior would be the same. If the `visibleTodos` haven't changed, `List` won't be re-rendered.
<Trans>동작은 동일합니다. `visibleTodos`가 변경되지 않은 경우 `List`가 리렌더링되지 않습니다.</Trans>

A JSX node like `<List items={visibleTodos} />` is an object like `{ type: List, props: { items: visibleTodos } }`. Creating this object is very cheap, but React doesn't know whether its contents is the same as last time or not. This is why by default, React will re-render the `List` component.
<Trans>`<List items={visibleTodos} />`같은 JSX 노드는 `{ type: List, props: { items: visibleTodos } }`와 같은 객체입니다. 이 객체를 생성하는 것은 매우 비용이 적게 들지만, React는 그 내용이 지난번과 동일한지 아닌지 알지 못합니다. 그렇기 때문에 기본적으로 React는 `List` 컴포넌트를 다시 렌더링합니다.

</Trans>

However, if React sees the same exact JSX as during the previous render, it won't try to re-render your component. This is because JSX nodes are [immutable.](https://en.wikipedia.org/wiki/Immutable_object) A JSX node object could not have changed over time, so React knows it's safe to skip a re-render. However, for this to work, the node has to *actually be the same object*, not merely look the same in code. This is what `useMemo` does in this example.
<Trans>하지만 React가 이전 렌더링 때와 동일한 JSX를 발견하면 컴포넌트를 리렌더링하려고 시도하지 않습니다. JSX 노드는 [불변](https://en.wikipedia.org/wiki/Immutable_object)이기 때문입니다. JSX 노드 객체는 시간이 지나도 변경될 수 없으므로 React는 리렌더링을 건너뛰어도 안전하다는 것을 알고 있습니다. 하지만 이것이 작동하려면 노드가 단순히 코드에서 동일하게 보이는 것이 아니라 **실제로 동일한 객체**여야 합니다. 이 예시에서 `useMemo`는 바로 이런 역할을 합니다.

</Trans>

Manually wrapping JSX nodes into `useMemo` is not convenient. For example, you can't do this conditionally. This is usually why you would wrap components with [`memo`](/reference/react/memo) instead of wrapping JSX nodes.
<Trans>JSX 노드를 `useMemo`에 수동으로 래핑하는 것은 편리하지 않습니다. 예를 들어 조건부로 이 작업을 수행할 수 없습니다. 이것이 일반적으로 JSX 노드를 래핑하는 대신 [`memo`](/reference/react/memo)로 컴포넌트를 래핑하는 이유입니다.

</Trans>

</DeepDive>

<Recipes titleText="The difference between skipping re-renders and always re-rendering" titleId="examples-rerendering" translatedTitle="리렌더링을 건너뛰는 것과 항상 리렌더링하는 것의 차이점">

#### Skipping re-rendering with `useMemo` and `memo`<Trans>`useMemo` 와 `memo`로 리렌더링 건너뛰기</Trans>{/*skipping-re-rendering-with-usememo-and-memo*/}

In this example, the `List` component is **artificially slowed down** so that you can see what happens when a React component you're rendering is genuinely slow. Try switching the tabs and toggling the theme.
<Trans>이 예시에서는 렌더링 중인 React 컴포넌트가 실제로 느릴 때 어떤 일이 일어나는지 확인할 수 있도록 `List` 컴포넌트의 속도를 **인위적으로 느리게** 설정했습니다. 탭을 전환하고 테마를 토글해 보세요.</Trans>

Switching the tabs feels slow because it forces the slowed down `List` to re-render. That's expected because the `tab` has changed, and so you need to reflect the user's new choice on the screen.
<Trans>탭을 전환하면 느려진 `List`를 다시 렌더링해야 하므로 느리게 느껴집니다. 탭이 변경되었으므로 사용자의 새로운 선택 사항을 화면에 반영해야 하기 때문에 예상되는 현상입니다.</Trans>

Next, try toggling the theme. **Thanks to `useMemo` together with [`memo`](/reference/react/memo), it’s fast despite the artificial slowdown!** The `List` skipped re-rendering because the `visibleItems` array has not changed since the last render. The `visibleItems` array has not changed because both `todos` and `tab` (which you pass as dependencies to `useMemo`) haven't changed since the last render.
<Trans>다음으로 테마를 전환해 보세요. `memo`와 `useMemo` 가 함께한 덕분에 인위적인 느려짐에도 불구하고 빠릅니다! `List` 는 마지막 렌더링 이후 `visibleItems` 배열이 변경되지 않았기 때문에 리렌더링을 건너뛰었습니다. 지난 렌더링 이후 `todos` 와 `tab` (`useMemo`에 의존성으로 전달한)이 모두 변경되지 않았기 때문에 `visibleItems` 배열이 변경되지 않았습니다.</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js TodoList.js active
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
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

#### Always re-rendering a component<Trans>항상 컴포넌트를 리렌더링하기</Trans>{/*always-re-rendering-a-component*/}

In this example, the `List` implementation is also **artificially slowed down** so that you can see what happens when some React component you're rendering is genuinely slow. Try switching the tabs and toggling the theme.
<Trans>이 예시에서는 렌더링 중인 일부 React 컴포넌트가 실제로 느릴 때 어떤 일이 일어나는지 확인할 수 있도록 `List` 구현도 인위적으로 느리게 설정했습니다. 탭을 전환하고 테마를 토글해 보세요.

</Trans>

Unlike in the previous example, toggling the theme is also slow now! This is because **there is no `useMemo` call in this version,** so the `visibleTodos` is always a different array, and the slowed down `List` component can't skip re-rendering.
<Trans>이전 예제와 달리 이제 테마 전환도 느려졌습니다! **이 버전에서는 `useMemo` 호출이 없기 때문에** `visibleTodos`가 항상 다른 배열이고, 속도가 느려진 `List` 컴포넌트가 다시 렌더링하는 것을 건너뛸 수 없기 때문입니다.

</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
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

However, here is the same code **with the artificial slowdown removed.** Does the lack of `useMemo` feel noticeable or not?
<Trans>하지만 다음은 **인위적인 속도 저하를 제거한** 동일한 코드입니다. `useMemo` 부족이 눈에 띄게 느껴지나요?</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js List.js
import { memo } from 'react';

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
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
<Trans>메모화 없이도 코드가 잘 작동하는 경우가 많습니다. 인터랙션이 충분히 빠르다면 메모화가 필요하지 않습니다.</Trans>

Keep in mind that you need to run React in production mode, disable [React Developer Tools](/learn/react-developer-tools), and use devices similar to the ones your app's users have in order to get a realistic sense of what's actually slowing down your app.
<Trans>실제로 앱의 속도를 저하시키는 요인을 현실적으로 파악하려면 프로덕션 모드에서 React를 실행하고, [React 개발자 도구](/learn/react-developer-tools)를 비활성화하고, 앱 사용자가 사용하는 것과 유사한 기기를 사용해야 한다는 점을 기억하세요.

</Trans>

<Solution />

</Recipes>

---

### Memoizing a dependency of another Hook<Trans>다른 Hook의 의존성 메모화</Trans>{/*memoizing-a-dependency-of-another-hook*/}

Suppose you have a calculation that depends on an object created directly in the component body:
<Trans>컴포넌트 본문에서 직접 생성된 객체에 의존된 계산이 있다고 가정해 보겠습니다:</Trans>

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 Caution: Dependency on an object created in the component body
  // ...
```

Depending on an object like this defeats the point of memoization. When a component re-renders, all of the code directly inside the component body runs again. **The lines of code creating the `searchOptions` object will also run on every re-render.** Since `searchOptions` is a dependency of your `useMemo` call, and it's different every time, React knows the dependencies are different, and recalculate `searchItems` every time.
<Trans>이렇게 객체에 의존하는 것은 메모이제이션의 취지를 무색하게 합니다. 컴포넌트가 다시 렌더링되면 컴포넌트 본문 내부의 모든 코드가 다시 실행됩니다. `searchOptions` **객체를 생성하는 코드 라인도 다시 렌더링할 때마다 실행됩니다.** `searchOptions` 는 `useMemo` 호출의 의존성이고 매번 다르기 때문에, React는 의존성이 지난번과 다르다는 것을 알고 매번 `searchItems` 를 다시 계산합니다.</Trans>

To fix this, you could memoize the `searchOptions` object *itself* before passing it as a dependency:
<Trans>이 문제를 해결하려면 `searchOptions` 객체를 의존성으로 전달하기 전에 *객체 자체*를 메모화할 수 있습니다:</Trans>

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ Only changes when text changes

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ Only changes when allItems or searchOptions changes
  // ...
```

In the example above, if the `text` did not change, the `searchOptions` object also won't change. However, an even better fix is to move the `searchOptions` object declaration *inside* of the `useMemo` calculation function:
<Trans>위의 예에서 `text` 가 변경되지 않았다면 `searchOptions` 객체도 변경되지 않습니다. 그러나 이보다 더 나은 수정 방법은 `searchOptions` 객체 선언을 `useMemo` 계산 함수 *내부*로 이동하는 것입니다:</Trans>

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ Only changes when allItems or text changes
  // ...
```

Now your calculation depends on `text` directly (which is a string and can't "accidentally" become different).
<Trans>이제 계산은 `text` 에 직접적으로 의존합니다. (문자열이므로 객체처럼 "실수로" 새 객체가 될 수 없습니다.)</Trans>

---

### Memoizing a function<Trans>함수 메모화</Trans>{/*memoizing-a-function*/}

Suppose the `Form` component is wrapped in [`memo`.](/reference/react/memo) You want to pass a function to it as a prop:
<Trans>  컴포넌트가 [`memo`.](/reference/react/memo)로 감싸져 있다고 가정해봅시다. 여기에 함수를 prop으로 전달하려고 합니다:</Trans>

```js {2-7}
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

Just as `{}` creates a different object, function declarations like `function() {}` and expressions like `() => {}` produce a *different* function on every re-render. By itself, creating a new function is not a problem. This is not something to avoid! However, if the `Form` component is memoized, presumably you want to skip re-rendering it when no props have changed. A prop that is *always* different would defeat the point of memoization.
<Trans>`function() {}`가 다른 객체를 생성하는 것처럼 `function() {}`와 같은 함수 선언과 `() => {}`와 같은 표현식은 리렌더링할 때마다 다른 함수를 생성합니다. 새 함수를 만드는 것 자체는 문제가 되지 않습니다. 피해야 할 일이 아닙니다! 하지만 `Form` 컴포넌트가 메모화되어 있다면 props가 변경되지 않았을 때 리렌더링하는 것을 건너뛰고 싶을 것입니다. prop이 항상 달라지면 메모이제이션의 취지가 무색해집니다.</Trans>

To memoize a function with `useMemo`, your calculation function would have to return another function:
<Trans>`useMemo`로 함수를 메모화하려면 계산 함수가 다른 함수를 반환해야 합니다:</Trans>

```js {2-3,8-9}
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + product.id + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

This looks clunky! **Memoizing functions is common enough that React has a built-in Hook specifically for that. Wrap your functions into [`useCallback`](/reference/react/useCallback) instead of `useMemo`** to avoid having to write an extra nested function:
<Trans>투박해 보입니다! **함수를 메모화하는 것은 충분히 흔한 일이며, React에는 이를 위해 특별히 Hook이 내장되어 있습니다.** 중첩 함수를 추가로 작성할 필요가 없도록 함수를 `useMemo` 대신 [`useCallback`](/reference/react/useCallback)으로 래핑하세요:</Trans>

```js {2,7}
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + product.id + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

The two examples above are completely equivalent. The only benefit to `useCallback` is that it lets you avoid writing an extra nested function inside. It doesn't do anything else. [Read more about `useCallback`.](/reference/react/useCallback)
<Trans>위의 두 예제는 완전히 동일합니다. `useCallback`을 사용하면 내부에 중첩된 함수를 추가로 작성하지 않아도 된다는 장점이 있습니다. 그 외에는 다른 기능을 수행하지 않습니다. [`useCallback`에 대해 자세히 알아보세요.](/reference/react/useCallback)</Trans>

---

## Troubleshooting<Trans>문제 해결</Trans> {/*troubleshooting*/}

### My calculation runs twice on every re-render<Trans>리렌더링할 때마다 계산이 두 번 실행됩니다.</Trans>{/*my-calculation-runs-twice-on-every-re-render*/}

In [Strict Mode](/reference/react/StrictMode), React will call some of your functions twice instead of once:
<Trans>[Strict Mode](/reference/react/StrictMode)에서는 React가 일부 함수를 한 번이 아닌 두 번 호출합니다:</Trans>

```js {2,5,6}
function TodoList({ todos, tab }) {
  // This component function will run twice for every render.

  const visibleTodos = useMemo(() => {
    // This calculation will run twice if any of the dependencies change.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

This is expected and shouldn't break your code.
<Trans>이는 예상되는 현상이며 코드를 손상시키지 않아야 합니다.</Trans>

This **development-only** behavior helps you [keep components pure.](/learn/keeping-components-pure) React uses the result of one of the calls, and ignores the result of the other call. As long as your component and calculation functions are pure, this shouldn't affect your logic. However, if they are accidentally impure, this helps you notice and fix the mistake.
<Trans>이 **개발 환경 전용** 동작은 [컴포넌트를 순수하게 유지](/learn/keeping-components-pure)하는 데 도움이 됩니다. React는 호출 중 하나의 결과를 사용하고 다른 호출의 결과는 무시합니다. 컴포넌트와 계산 함수가 순수하다면 로직에 영향을 주지 않을 것입니다. 그러나 실수로 불순한 경우 실수를 알아차리고 수정하는 데 도움이 됩니다.</Trans>

For example, this impure calculation function mutates an array you received as a prop:
<Trans>예를 들어, 순수하지 않게 계산된 함수는 prop으로 받은 배열을 변경합니다:</Trans>

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 Mistake: mutating a prop
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

React calls your function twice, so you'd notice the todo is added twice. Your calculation shouldn't change any existing objects, but it's okay to change any *new* objects you created during the calculation. For example, if the `filterTodos` function always returns a *different* array, you can mutate *that* array instead:
<Trans>React는 함수를 두 번 호출하므로 할 일이 두 번 추가되는 것을 알 수 있습니다. 계산이 기존 객체를 변경해서는 안 되지만 계산 중에 생성한 새 객체를 변경해도 괜찮습니다. 예를 들어 `filterTodos` 함수가 항상 다른 배열을 반환하는 경우 해당 배열을 변경할 수 있습니다:</Trans>

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ Correct: mutating an object you created during the calculation
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

Read [keeping components pure](/learn/keeping-components-pure) to learn more about purity.
<Trans>순수성에 대해 자세히 알아보려면 [컴포넌트 순수성 유지](/learn/keeping-components-pure)를 읽어보세요.</Trans>

Also, check out the guides on [updating objects](/learn/updating-objects-in-state) and [updating arrays](/learn/updating-arrays-in-state) without mutation.
<Trans>또한, [객체 업데이트](/learn/updating-objects-in-state) 및 [배열 업데이트](/learn/updating-arrays-in-state) 가이드를 참조하여 변이 없이 업데이트하세요.</Trans>

---

### My `useMemo` call is supposed to return an object, but returns undefined<Trans>`useMemo` 호출이 객체를 반환해야 하지만 undefined 객체를 반환합니다.</Trans>{/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

This code doesn't work:
<Trans>이 코드는 작동하지 않습니다:</Trans>

```js {1-2,5}
  // 🔴 You can't return an object from an arrow function with () => {
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

In JavaScript, `() => {` starts the arrow function body, so the `{` brace is not a part of your object. This is why it doesn't return an object, and leads to mistakes. You could fix it by adding parentheses like `({` and `})`:
<Trans>자바스크립트에서 `() => {`는 화살표 함수 본문을 시작하므로 `{` 중괄호는 객체의 일부가 아닙니다. 이 때문에 객체를 반환하지 않고 실수가 발생합니다. `({` 및 `})`와 같은 괄호를 추가하면 이 문제를 해결할 수 있습니다:</Trans>

```js {1-2,5}
  // This works, but is easy for someone to break again
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

However, this is still confusing and too easy for someone to break by removing the parentheses.
<Trans>하지만 이 방식은 여전히 혼란스럽고 괄호를 제거하면 누군가 쉽게 위반할 수 있습니다.</Trans>

To avoid this mistake, write a `return` statement explicitly:
<Trans>이러한 실수를 방지하려면 `return` 문을 명시적으로 작성하세요:</Trans>

```js {1-3,6-7}
  // ✅ This works and is explicit
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

---

### Every time my component renders, the calculation in `useMemo` re-runs<Trans>컴포넌트가 렌더링될 때마다 `useMemo`의 계산이 다시 실행됩니다.</Trans>{/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

Make sure you've specified the dependency array as a second argument!
<Trans>두 번째 인자로 의존성 배열을 지정했는지 확인하세요!</Trans>

If you forget the dependency array, `useMemo` will re-run the calculation every time:
<Trans>의존성 배열을 잊어버렸을 경우, `useMemo` 는 매번 계산을 다시 실행합니다:</Trans>

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 Recalculates every time: no dependency array
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

This is the corrected version passing the dependency array as a second argument:
<Trans>이것은 의존성 배열을 두 번째 인수로 전달하는 수정된 버전입니다:</Trans>

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ Does not recalculate unnecessarily
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

If this doesn't help, then the problem is that at least one of your dependencies is different from the previous render. You can debug this problem by manually logging your dependencies to the console:
<Trans>그래도 도움이 되지 않는다면 의존성 중 하나 이상이 이전 렌더링과 다르다는 문제일 수 있습니다. 의존성을 콘솔에 수동으로 로깅하여 이 문제를 고칠 수 있습니다:</Trans>

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

You can then right-click on the arrays from different re-renders in the console and select "Store as a global variable" for both of them. Assuming the first one got saved as `temp1` and the second one got saved as `temp2`, you can then use the browser console to check whether each dependency in both arrays is the same:
<Trans>그런 다음 콘솔에서 서로 다른 리렌더링되는 배열을 마우스 오른쪽 버튼으로 클릭하고 두 배열 모두에 대해 "전역 변수로 저장"을 선택할 수 있습니다. 첫 번째 배열이 `temp1`로 저장되고 두 번째 배열이 `temp2`로 저장되었다고 가정하면 브라우저 콘솔을 사용하여 두 배열의 각 의존성이 동일한지 확인할 수 있습니다:</Trans>

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

When you find which dependency breaks memoization, either find a way to remove it, or [memoize it as well.](#memoizing-a-dependency-of-another-hook)
<Trans>어떤 의존성이 메모이제이션을 방해하는지 찾으면 그 의존성을 제거할 방법을 찾거나 [함께 메모화](#memoizing-a-dependency-of-another-hook)하세요.</Trans>

---

### I need to call `useMemo` for each list item in a loop, but it's not allowed <Trans>루프에서 각 목록 항목에 대해 `useMemo`를 호출해야 하지만 허용되지 않습니다.</Trans>{/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Suppose the `Chart` component is wrapped in [`memo`](/reference/react/memo). You want to skip re-rendering every `Chart` in the list when the `ReportList` component re-renders. However, you can't call `useMemo` in a loop:
<Trans>`Chart` 컴포넌트가 [`memo`](/reference/react/memo)로 감싸져 있다고 가정해 봅시다. `ReportList` 컴포넌트가 리렌더링할 때 목록의 모든 차트를 리렌더링하는 것을 건너뛰고 싶을 수 있습니다. 하지만 `useMemo` 를 루프에서 호출할 수는 없습니다:</Trans>

```js {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 You can't call useMemo in a loop like this:
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chart data={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

Instead, extract a component for each item and memoize data for individual items:
<Trans>대신, 각 항목에 대한 컴포넌트를 추출하고 개별 항목에 대한 데이터를 메모화하세요:</Trans>

```js {5,12-18}
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
  // ✅ Call useMemo at the top level:
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

Alternatively, you could remove `useMemo` and instead wrap `Report` itself in [`memo`.](/reference/react/memo) If the `item` prop does not change, `Report` will skip re-rendering, so `Chart` will skip re-rendering too:
<Trans>또는 `useMemo`를 제거하고 대신 `Report` 자체를 [`memo`.](/reference/react/memo)로 래핑할 수 있습니다. `item` prop이 변경되지 않으면 `Report`가 리렌더링을 건너뛰므로 차트도 리렌더링을 건너뜁니다:</Trans>

```js {5,6,12}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```
