---
title: memo
translators: [강승훈, 고석영]
---

<Intro>

`memo` lets you skip re-rendering a component when its props are unchanged.
<Trans>`memo`를 사용하면 컴포넌트의 props가 변경되지 않은 경우 리렌더링을 건너뛸 수 있습니다.</Trans>

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `memo(Component, arePropsEqual?)` {/*memo*/}

Wrap a component in `memo` to get a *memoized* version of that component. This memoized version of your component will usually not be re-rendered when its parent component is re-rendered as long as its props have not changed. But React may still re-render it: memoization is a performance optimization, not a guarantee.
<Trans>`memo`로 컴포넌트를 감싸 *메모화된* 버전의 컴포넌트를 얻을 수 있습니다. 메모화된 버전의 컴포넌트는 일반적으로 props가 변경되지 않는 한 부모 컴포넌트가 리렌더링할 때 같이 리렌더링하지 않습니다. 그러나 메모화는 성능을 최적화하지만 보장되는 것은 아니어서, React는 여전히 리렌더링 할 수도 있습니다.</Trans>

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

* `Component`: The component that you want to memoize. The `memo` does not modify this component, but returns a new, memoized component instead. Any valid React component, including functions and [`forwardRef`](/reference/react/forwardRef) components, is accepted.
<Trans>`Component`: 메모화 하려는 컴포넌트입니다. `memo`는 이 컴포넌트를 수정하지 않고 새롭게 메모화된 컴포넌트를 반환합니다. 함수와 [`forwardRef`](/reference/react/forwardRef) 컴포넌트를 포함한 모든 유효한 React 컴포넌트가 허용됩니다.</Trans>

* **optional** `arePropsEqual`: A function that accepts two arguments: the component's previous props, and its new props. It should return `true` if the old and new props are equal: that is, if the component will render the same output and behave in the same way with the new props as with the old. Otherwise it should return `false`. Usually, you will not specify this function. By default, React will compare each prop with [`Object.is`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
<Trans>**선택적** `arePropsEqual`: 컴포넌트의 이전 prop 및 새로운 prop의 두 인자를 받는 함수입니다. 새로운 prop이 이전 prop과 같으면 `true`를 반환해야 합니다. 다시 말해, 새로운 prop으로도 컴포넌트가 동일한 출력을 만들고 동일한 방식으로 작동하는 경우입니다. 그렇지 않으면 `false`를 반환해야 합니다. 일반적으로 이 함수를 지정하지 않습니다. React는 기본적으로 [`Object.is`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is)로 각 prop을 비교합니다.</Trans>

#### Returns<Trans>반환값</Trans> {/*returns*/}

`memo` returns a new React component. It behaves the same as the component provided to `memo` except that React will not always re-render it when its parent is being re-rendered unless its props have changed.
<Trans>`memo`는 새로운 React 컴포넌트를 반환합니다. `memo`에 제공한 원본 컴포넌트와 동일하게 동작하지만, 부모가 리렌더링 하더라도 prop이 변경되지 않는 한 React는 이를 리렌더링하지 않습니다.</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Skipping re-rendering when props are unchanged <Trans>prop이 변경되지 않았을 때 리렌더링 건너뛰기</Trans> {/*skipping-re-rendering-when-props-are-unchanged*/}

React normally re-renders a component whenever its parent re-renders. With `memo`, you can create a component that React will not re-render when its parent re-renders so long as its new props are the same as the old props. Such a component is said to be *memoized*.
<Trans>React는 일반적으로 부모가 리렌더링될 때마다 컴포넌트를 리렌더링 합니다. `memo`를 사용하면 부모 컴포넌트가 리렌더링될 때 새로운 props가 이전 props와 동일하면 리렌더링하지 않는 컴포넌트를 만들 수 있습니다. 이러한 컴포넌트를 *메모화되었다*고 합니다.</Trans>

To memoize a component, wrap it in `memo` and use the value that it returns in place of your original component:
<Trans>컴포넌트를 메모화하려면 `memo`로 감싸고, 반환된 값을 원래 컴포넌트의 자리에 사용하십시오.</Trans>

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default Greeting;
```

A React component should always have [pure rendering logic.](/learn/keeping-components-pure) This means that it must return the same output if its props, state, and context haven't changed. By using `memo`, you are telling React that your component complies with this requirement, so React doesn't need to re-render as long as its props haven't changed. Even with `memo`, your component will re-render if its own state changes or if a context that it's using changes.
<Trans>React 컴포넌트는 항상 [순수한 렌더링 로직](/learn/keeping-components-pure)을 가져야합니다. 이는 props, state 및 context가 변경되지 않으면 항상 동일한 출력을 반환해야 함을 의미합니다. `memo`를 사용하면 React에게 컴포넌트가 이같은 요구 사항을 준수한다고 알리므로, prop이 변경되지 않는 한 React는 리렌더링할 필요가 없습니다. 그러나 `memo`를 적용하더라도 컴포넌트의 state가 변경되거나 사용중인 context가 변경되면 리렌더링 합니다.</Trans>

In this example, notice that the `Greeting` component re-renders whenever `name` is changed (because that's one of its props), but not when `address` is changed (because it's not passed to `Greeting` as a prop):
<Trans>아래 예제에서 `Greeting` 컴포넌트는 `name`이 변경될 때마다 리렌더링 됩니다. `name`이 props 중 하나이기 때문입니다. 하지만 `address`는 `Greeting`의 prop이 아니기 때문에 `address`가 변경될 때는 리렌더링되지 않습니다.</Trans>

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

**You should only rely on `memo` as a performance optimization.** If your code doesn't work without it, find the underlying problem and fix it first. Then you may add `memo` to improve performance.
<Trans>**`memo`는 성능 최적화를 위해서만 사용해야 합니다.** `memo` 없이 코드가 작동하지 않으면 먼저 근본적인 문제를 찾아 해결하세요. 이후에 `memo`를 추가하여 성능을 개선할 수 있습니다.</Trans>

</Note>

<DeepDive>

#### Should you add memo everywhere? <Trans>모든 곳에 memo를 추가해야할까요?</Trans> {/*should-you-add-memo-everywhere*/}

If your app is like this site, and most interactions are coarse (like replacing a page or an entire section), memoization is usually unnecessary. On the other hand, if your app is more like a drawing editor, and most interactions are granular (like moving shapes), then you might find memoization very helpful. 
<Trans>이 사이트와 같이 대부분의 인터랙션이 투박한 앱의 경우(페이지 또는 전체 섹션 교체 등) 일반적으로 메모화는 불필요합니다. 반면 앱이 그림 편집기이고 (도형 이동과 같이) 대부분의 인터랙션이 세분화되어 있다면, 메모화가 매우 유용할 수 있습니다.</Trans>

Optimizing with `memo`  is only valuable when your component re-renders often with the same exact props, and its re-rendering logic is expensive. If there is no perceptible lag when your component re-renders, `memo` is unnecessary. Keep in mind that `memo` is completely useless if the props passed to your component are *always different,* such as if you pass an object or a plain function defined during rendering. This is why you will often need [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) and [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) together with `memo`.
<Trans>`memo`로 최적화하는 것은 컴포넌트가 정확히 동일한 props로 자주 리렌더링되고, 리렌더링 로직이 비용이 많이 들 때만 가치가 있습니다. 컴포넌트가 리렌더링되어도 인지할 수 있을 만큼의 지연이 없다면 `memo`가 필요하지 않습니다. `memo`는 컴포넌트에 전달되는 prop이 *항상 다른 경우* (객체 또는 렌더링 중 정의된 일반 함수와 같은 경우) 완전히 무용지물입니다. 따라서 `memo`와 함께 [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) 및 [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components)을 종종 필요로 합니다.</Trans>

There is no benefit to wrapping a component in `memo` in other cases. There is no significant harm to doing that either, so some teams choose to not think about individual cases, and memoize as much as possible. The downside of this approach is that code becomes less readable. Also, not all memoization is effective: a single value that's "always new" is enough to break memoization for an entire component.
<Trans>그 외의 경우에는 컴포넌트를 `memo`로 감싸는 것에 이점이 없습니다. 그렇다고 해서 크게 해가 되는 것도 아니기 때문에 일부 팀에서는 개별 사례에 대해 생각하지 않고 가능한 한 많이 메모하는 방식을 선택하기도 합니다. 이 접근 방식의 단점은 코드 가독성이 떨어진다는 것입니다. 또한 모든 메모화가 효과적이지는 않습니다: "항상 새로운" 값이 단 하나만 있어도 컴포넌트 전체의 메모화를 깨뜨리기엔 충분합니다.</Trans>

**In practice, you can make a lot of memoization unnecessary by following a few principles:**
<Trans>**실제로 몇 가지 원칙을 따르면 많은 메모화가 불필요해질 수 있습니다:**</Trans>

1. When a component visually wraps other components, let it [accept JSX as children.](/learn/passing-props-to-a-component#passing-jsx-as-children) This way, when the wrapper component updates its own state, React knows that its children don't need to re-render.
<Trans>컴포넌트가 다른 컴포넌트를 시각적으로 감쌀 때 [JSX를 자식으로 받아들이도록 하세요](/learn/passing-props-to-a-component#passing-jsx-as-children). 이렇게 하면 wrapper 컴포넌트가 자체 state를 업데이트할 때 React는 그 자식 컴포넌트가 다시 렌더링할 필요가 없다는 것을 알 수 있습니다.</Trans>

2. Prefer local state and don't [lift state up](/learn/sharing-state-between-components) any further than necessary. For example, don't keep transient state like forms and whether an item is hovered at the top of your tree or in a global state library.
<Trans>로컬 state를 선호하고 필요 이상으로 [state를 끌어올리지](/learn/sharing-state-between-components) 마세요. 예를 들어, 최상위 트리나 전역 state 라이브러리에 폼이나 아이템이 호버되었는지와 같은 일시적 state를 두지 마세요.</Trans>

3. Keep your [rendering logic pure.](/learn/keeping-components-pure) If re-rendering a component causes a problem or produces some noticeable visual artifact, it's a bug in your component! Fix the bug instead of adding memoization.
<Trans>[렌더링 로직을 순수하게](/learn/keeping-components-pure) 유지하세요. 컴포넌트를 다시 렌더링했을 때 문제가 발생하거나 눈에 띄는 시각적 아티팩트가 생성된다면 컴포넌트에 버그가 있는 것입니다! 메모화하는 대신 버그를 수정하세요.</Trans>

4. Avoid [unnecessary Effects that update state.](/learn/you-might-not-need-an-effect) Most performance problems in React apps are caused by chains of updates originating from Effects that cause your components to render over and over.
<Trans>[state를 업데이트하는 불필요한 Effect](/learn/you-might-not-need-an-effect)를 피하세요. React 앱의 대부분의 성능 문제는 컴포넌트를 반복해서 렌더링하게 만드는 Effect에서 발생하는 업데이트 체인으로 인해 발생합니다.</Trans>

5. Try to [remove unnecessary dependencies from your Effects.](/learn/removing-effect-dependencies) For example, instead of memoization, it's often simpler to move some object or a function inside an Effect or outside the component.
<Trans>[Effect에서 불필요한 의존성을 제거](/learn/removing-effect-dependencies)하세요. 예를 들어, 메모화 대신 일부 오브젝트나 함수를 Effect 내부나 컴포넌트 외부로 이동하는 것이 더 간단할 때가 많습니다.</Trans>

If a specific interaction still feels laggy, [use the React Developer Tools profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) to see which components would benefit the most from memoization, and add memoization where needed. These principles make your components easier to debug and understand, so it's good to follow them in any case. In the long term, we're researching [doing granular memoization automatically](https://www.youtube.com/watch?v=lGEMwh32soc) to solve this once and for all.
<Trans>특정 인터렉션이 여전히 느리게 느껴진다면 [React 개발자 도구 profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)를 사용해 어떤 컴포넌트가 메모화를 통해 가장 큰 이점을 얻을 수 있는지 확인하고 필요한 경우 메모화 하세요. 이러한 원칙은 컴포넌트를 더 쉽게 디버깅하고 이해할 수 있게 해주므로 어떤 경우든 이 원칙을 따르는 것이 좋습니다. 장기적으로는 이 문제를 완전히 해결하기 위해 [세분화된 메모화를 자동으로 수행하는 방법](https://www.youtube.com/watch?v=lGEMwh32soc)을 연구하고 있습니다.</Trans>


</DeepDive>

---

### Updating a memoized component using state <Trans>state를 사용하여 메모화된 컴포넌트 업데이트</Trans> {/*updating-a-memoized-component-using-state*/}

Even when a component is memoized, it will still re-render when its own state changes. Memoization only has to do with props that are passed to the component from its parent.
<Trans>컴포넌트가 메모화된 경우에도 자체 state가 변경되면 리렌더링됩니다. 메모화는 부모에서 컴포넌트로 전달되는 props에만 연관이 있습니다.</Trans>
<Sandpack>


```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting was rendered at', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Hello');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({ value, onChange }) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'Hello'}
          onChange={e => onChange('Hello')}
        />
        Regular greeting
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Hello and welcome'}
          onChange={e => onChange('Hello and welcome')}
        />
        Enthusiastic greeting
      </label>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

If you set a state variable to its current value, React will skip re-rendering your component even without `memo`. You may still see your component function being called an extra time, but the result will be discarded.
<Trans>state 변수를 현재 값으로 설정하면 React는 `memo` 없이도 컴포넌트 리렌더링을 건너뜁니다. 컴포넌트가 한 번 더 호출될 수도 있지만, 결과는 무시됩니다.</Trans>

---

### Updating a memoized component using a context <Trans>context를 사용하여 메모화된 컴포넌트 업데이트하기</Trans> {/*updating-a-memoized-component-using-a-context*/}

Even when a component is memoized, it will still re-render when a context that it's using changes. Memoization only has to do with props that are passed to the component from its parent.
<Trans>컴포넌트가 메모화 되었더라도 사용 중인 context가 변경될 때 이 컴포넌트는 리렌더링됩니다. 메모화는 부모로부터 전달되는 props에만 연관이 있습니다.</Trans>

<Sandpack>

```js
import { createContext, memo, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');

  function handleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark'); 
  }

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={handleClick}>
        Switch theme
      </button>
      <Greeting name="Taylor" />
    </ThemeContext.Provider>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Hello, {name}!</h3>
  );
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}

.light {
  color: black;
  background-color: white;
}

.dark {
  color: white;
  background-color: black;
}
```

</Sandpack>

To make your component re-render only when a _part_ of some context changes, split your component in two. Read what you need from the context in the outer component, and pass it down to a memoized child as a prop.
<Trans>일부 context의 *일부*가 변경될 때만 컴포넌트를 리렌더링 하려면, 컴포넌트를 두 개로 분할하세요. 외부 컴포넌트의 context에서 필요한 내용을 읽고, 메모화된 자식에게 prop으로 전달하세요.</Trans>

---

### Minimizing props changes <Trans>props 변경 최소화하기</Trans> {/*minimizing-props-changes*/}

When you use `memo`, your component re-renders whenever any prop is not *shallowly equal* to what it was previously. This means that React compares every prop in your component with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. Note that `Object.is(3, 3)` is `true`, but `Object.is({}, {})` is `false`.
<Trans>`memo`를 사용할 때 어떤 prop든 이전의 prop과 *얕은 비교 결과 같지* 않을 때마다 컴포넌트가 다시 작동합니다. 즉, React는 [`Object.is`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교를 사용하여 컴포넌트의 모든 prop을 이전 값과 비교합니다. `Object.is (3, 3)`은 `true`이지만 `Object.is({}, {})`는 `false`입니다.</Trans>

To get the most out of `memo`, minimize the times that the props change. For example, if the prop is an object, prevent the parent component from re-creating that object every time by using [`useMemo`:](/reference/react/useMemo)
<Trans>`memo`를 최대한 활용하려면, props가 변경되는 시간을 최소화해야 합니다. 예를 들어 prop이 객체인 경우, [`useMemo`](/reference/react/useMemo)를 사용하여 부모 컴포넌트가 해당 객체를 매번 다시 만드는 것을 방지하세요:</Trans>

```js {5-8}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

A better way to minimize props changes is to make sure the component accepts the minimum necessary information in its props. For example, it could accept individual values instead of a whole object:
<Trans>props 변경을 최소화하는 더 나은 방법은 props가 해당 요소에 필요한 최소한의 정보만을 받고 있는지 확인하는 것입니다. 예를 들어 전체 객체 대신 개별 값을 사용할 수 있습니다:</Trans>

```js {4,7}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

Even individual values can sometimes be projected to ones that change less frequently. For example, here a component accepts a boolean indicating the presence of a value rather than the value itself:
<Trans>때론 개별 값에 대해서도 더욱 가끔 바뀌는 값으로 투영할 수 있습니다. 예를 들어 다음 컴포넌트는 값 자체가 아닌 값의 존재를 나타내는 불리언을 받습니다:</Trans>

```js {3}
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```

When you need to pass a function to memoized component, either declare it outside your component so that it never changes, or [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) to cache its definition between re-renders.
<Trans>메모화된 컴포넌트에 함수를 전달해야 하는 경우, 아예 변경되지 않도록 컴포넌트 외부에서 선언하거나, [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components)을 사용하여 정의를 캐시하십시오.</Trans>

---

### Specifying a custom comparison function <Trans>사용자 정의 비교 함수 지정하기</Trans> {/*specifying-a-custom-comparison-function*/}

In rare cases it may be infeasible to minimize the props changes of a memoized component. In that case, you can provide a custom comparison function, which React will use to compare the old and new props instead of using shallow equality. This function is passed as a second argument to `memo`. It should return `true` only if the new props would result in the same output as the old props; otherwise it should return `false`.
<Trans>드물게 메모화된 컴포넌트의 props 변경을 최소화하는 것이 불가능할 수 있습니다. 이 경우 React가 이전 props와 새 props를 비교할 때 얕은 동등성 대신 사용하도록 커스텀 비교 함수를 제공할 수 있습니다. 이 함수는 `memo`의 두 번째 인자로 전달됩니다. 새로운 props가 이전 props와 동일한 출력을 생성하는 경우에만 `true`를 반환해야 합니다. 그렇지 않으면 `false`를 반환해야 합니다.</Trans>

```js {3}
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

If you do this, use the Performance panel in your browser developer tools to make sure that your comparison function is actually faster than re-rendering the component. You might be surprised.
<Trans>이 경우 브라우저 개발자 도구의 성능 패널을 사용하여 비교 기능이 컴포넌트를 다시 렌더링하는 것보다 실제로 더 빠른지 확인하십시오. 어쩌면 놀랄 수도 있습니다.</Trans>

When you do performance measurements, make sure that React is running in the production mode.
<Trans>성능 측정을 할 때 React가 상용 환경에서 실행되고 있는지 확인하십시오.</Trans>

<Pitfall>

If you provide a custom `arePropsEqual` implementation, **you must compare every prop, including functions.** Functions often [close over](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) the props and state of parent components. If you return `true` when `oldProps.onClick !== newProps.onClick`, your component will keep "seeing" the props and state from a previous render inside its `onClick` handler, leading to very confusing bugs.
<Trans>커스텀 `arePropsEqual` 구현을 제공하는 경우 **함수를 포함하여 모든 props를 비교해야 합니다.** 함수는 종종 부모 컴포넌트의 prop과 state를 [클로저로 다룹니다](https://developer.mozilla.org/ko/docs/Web/JavaScript/Closures). `oldProps.onClick !== newProps.onClick`일 때 `true`를 반환하면 컴포넌트가 `onClick` 핸들러 내에서 이전 렌더링의 prop과 state를 계속 "인식"하여 매우 혼란스러운 버그가 발생합니다.</Trans>

Avoid doing deep equality checks inside `arePropsEqual` unless you are 100% sure that the data structure you're working with has a known limited depth. **Deep equality checks can become incredibly slow** and can freeze your app for many seconds if someone changes the data structure later.
<Trans>작업 중인 데이터 구조가 알려진 제한된 깊이를 가지고 있다고 100% 확신하지 않는 한 `arePropsEqual` 내에서 깊은 비교를 수행하지 마십시오. **깊은 비교는 엄청나게 느려질 수 있으며** 나중에 누군가가 데이터 구조를 변경하면 몇 초 동안 앱이 정지될 수 있습니다.</Trans>

</Pitfall>

---

## Troubleshooting<Trans>문제 해결</Trans> {/*troubleshooting*/}
### My component re-renders when a prop is an object, array, or function <Trans>prop이 객체, 배열 또는 함수일 때 컴포넌트가 리렌더링됩니다</Trans> {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

React compares old and new props by shallow equality: that is, it considers whether each new prop is reference-equal to the old prop. If you create a new object or array each time the parent is re-rendered, even if the individual elements are each the same, React will still consider it to be changed. Similarly, if you create a new function when rendering the parent component, React will consider it to have changed even if the function has the same definition. To avoid this, [simplify props or memoize props in the parent component](#minimizing-props-changes).
<Trans>React는 이전 prop과 새 prop을 얕은 비교로 동등성을 파악합니다: 즉, 각각의 새 prop이 이전 prop과 참조가 동일한지 여부를 고려합니다. 부모가 다시 렌더링될 때마다 새 객체나 배열을 생성하면 설령 개별 요소들이 모두 동일하더라도 여전히 React는 변경된 것으로 간주합니다. 마찬가지로 부모 컴포넌트를 렌더링할 때 새 함수를 만들면 React는 함수의 정의가 동일하더라도 변경된 것으로 간주합니다. 이를 방지하려면 [부모 컴포넌트에서 prop을 단순화하거나 메모화 하십시오.](#minimizing-props-changes)</Trans>