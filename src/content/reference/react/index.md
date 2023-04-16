---
title: "Built-in React Hooks"
translators: [정재남, 유은미, 고석영]
---

<Intro>

*Hooks* let you use different React features from your components. You can either use the built-in Hooks or combine them to build your own. This page lists all built-in Hooks in React.
<Trans>*훅*을 사용하면 컴포넌트에서 다양한 React 기능을 사용할 수 있습니다. 내장 훅을 사용하거나 조합하여 자신만의 훅을 만들 수 있습니다. 이 페이지에는 React에 내장된 모든 훅이 나열되어 있습니다.</Trans>

</Intro>

---

## State Hooks {/*state-hooks*/}

*State* lets a component ["remember" information like user input.](/learn/state-a-components-memory) For example, a form component can use state to store the input value, while an image gallery component can use state to store the selected image index.
<Trans>*State*를 사용하면 컴포넌트가 사용자 입력과 같은 정보를 ["기억"할 수 있습니다.](/learn/state-a-components-memory) 예를 들어, form 컴포넌트는 state를 사용하여 입력 값을 저장하고, 이미지 갤러리 컴포넌트는 state를 사용하여 선택한 이미지의 인덱스를 저장할 수 있습니다.</Trans>

To add state to a component, use one of these Hooks:
<Trans>컴포넌트에 state를 추가하려면 다음 Hook 중 하나를 사용합니다:</Trans>

* [`useState`](/reference/react/useState) declares a state variable that you can update directly.
* [`useReducer`](/reference/react/useReducer) declares a state variable with the update logic inside a [reducer function.](/learn/extracting-state-logic-into-a-reducer)
<TransBlock>
- [`useState`](/reference/react/useState)는 직접 업데이트할 수 있는 state 변수를 선언합니다.
- [`useReducer`](/reference/react/useReducer)는 [reducer 함수](/learn/extracting-state-logic-into-a-reducer) 안에 업데이트 로직이 있는 state 변수를 선언합니다.
</TransBlock>

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## Context Hooks {/*context-hooks*/}

*Context* lets a component [receive information from distant parents without passing it as props.](/learn/passing-props-to-a-component) For example, your app's top-level component can pass the current UI theme to all components below, no matter how deep.
<Trans>*context*를 사용하면 컴포넌트가 [prop으로 전달하지 않고 멀리 떨어진 부모로부터 정보를 받을 수 있습니다.](/learn/passing-props-to-a-component) 예를 들어, 앱의 최상위 컴포넌트는 아무리 깊이 있더라도 현재 UI 테마를 아래의 모든 컴포넌트에 전달할 수 있습니다.</Trans>

* [`useContext`](/reference/react/useContext) reads and subscribes to a context.
<TransBlock>
- [`useContext`](/reference/react/useContext)는 context를 읽고 구독합니다.
</TransBlock>

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Ref Hooks {/*ref-hooks*/}

*Refs* let a component [hold some information that isn't used for rendering,](/learn/referencing-values-with-refs) like a DOM node or a timeout ID. Unlike with state, updating a ref does not re-render your component. Refs are an "escape hatch" from the React paradigm. They are useful when you need to work with non-React systems, such as the built-in browser APIs.
<Trans>*ref*는 컴포넌트가 DOM 노드나 timeout ID와 같이 [렌더링에 사용되지 않는 일부 정보를 보유할 수 있게](/learn/referencing-values-with-refs) 해줍니다. state와 달리 ref를 업데이트해도 컴포넌트가 다시 렌더링되지는 않습니다. ref는 React 패러다임에서 "탈출구"입니다. 내장된 브라우저 API와 같이 React가 아닌 시스템에서 작업해야 할 때 유용합니다.</Trans>

* [`useRef`](/reference/react/useRef) declares a ref. You can hold any value in it, but most often it's used to hold a DOM node.
* [`useImperativeHandle`](/reference/react/useImperativeHandle) lets you customize the ref exposed by your component. This is rarely used.
<TransBlock>
- [`useRef`](/reference/react/useRef)는 ref를 선언합니다. 어떤 값을 담을 수 있지만, 대부분 DOM 노드를 담는 데 사용됩니다.
- [`useImperativeHandle`](/reference/react/useImperativeHandle)을 사용하면 컴포넌트가 노출하는 ref를 사용자가 직접 정의할 수 있습니다. 이 함수는 거의 사용되지 않습니다.
</TransBlock>

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Effect Hooks {/*effect-hooks*/}

*Effects* let a component [connect to and synchronize with external systems.](/learn/synchronizing-with-effects) This includes dealing with network, browser DOM, animations, widgets written using a different UI library, and other non-React code.
<Trans>*Effect*는 컴포넌트가 [외부 시스템에 연결하고 동기화할 수 있도록](/learn/synchronizing-with-effects) 합니다. 여기에는 네트워크, 브라우저 DOM, 애니메이션, 다른 UI 라이브러리를 사용하여 작성된 위젯 및 기타 비-React 코드를 처리하는 것이 포함됩니다.</Trans>

* [`useEffect`](/reference/react/useEffect) connects a component to an external system.
<TransBlock>
- [`useEffect`](/reference/react/useEffect)는 컴포넌트를 외부 시스템에 연결합니다.
</TransBlock>

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

Effects are an "escape hatch" from the React paradigm. Don't use Effects to orchestrate the data flow of your application. If you're not interacting with an external system, [you might not need an Effect.](/learn/you-might-not-need-an-effect)
<Trans>Effect는 React 패러다임에서 "탈출구"입니다. 애플리케이션의 데이터 흐름을 조율하기 위해 Effect를 사용하지 마세요. 외부 시스템과 상호작용하지 않는다면, [Effect가 필요하지 않을 수도 있습니다.](/learn/you-might-not-need-an-effect)</Trans>

There are two rarely used variations of `useEffect` with differences in timing:
<Trans>사용 타이밍에 차이가 있지만 특수한 경우에 사용되는 두 가지 `useEffect` 변형이 있습니다:</Trans>

* [`useLayoutEffect`](/reference/react/useLayoutEffect) fires before the browser repaints the screen. You can measure layout here.
* [`useInsertionEffect`](/reference/react/useInsertionEffect) fires before React makes changes to the DOM. Libraries can insert dynamic CSS here.
<TransBlock>
- 브라우저가 화면을 다시 그리기 전에 [`useLayoutEffect`](/reference/react/useLayoutEffect)가 실행됩니다. 여기에서 레이아웃을 측정할 수 있습니다.
- React가 DOM을 변경하기 전에 [`useInsertionEffect`](/reference/react/useInsertionEffect)가 실행됩니다. 라이브러리는 여기에 동적 CSS를 삽입할 수 있습니다.
</TransBlock>

---

## Performance Hooks {/*performance-hooks*/}

A common way to optimize re-rendering performance is to skip unnecessary work. For example, you can tell React to reuse a cached calculation or to skip a re-render if the data has not changed since the previous render.
<Trans>재렌더링 성능을 최적화하는 일반적인 방법은 불필요한 작업을 건너뛰는 것입니다. 예를 들어, 캐시된 계산을 재사용하거나 이전 렌더링 이후 데이터가 변경되지 않은 경우 재렌더링을 건너뛰도록 React에 지시할 수 있습니다.</Trans>

To skip calculations and unnecessary re-rendering, use one of these Hooks:
<Trans>계산과 불필요한 재렌더링을 건너뛰려면 다음 Hook 중 하나를 사용하세요:</Trans>

- [`useMemo`](/reference/react/useMemo) lets you cache the result of an expensive calculation.
- [`useCallback`](/reference/react/useCallback) lets you cache a function definition before passing it down to an optimized component.
<TransBlock>
- [`useMemo`](/reference/react/useMemo)를 사용하면 비용이 많이 드는 계산 결과를 캐시할 수 있습니다.
- [`useCallback`](/reference/react/useCallback)을 사용하면 함수 정의를 캐시한 후 최적화된 컴포넌트로 전달할 수 있습니다.
</TransBlock>

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Sometimes, you can't skip re-rendering because the screen actually needs to update. In that case, you can improve performance by separating blocking updates that must be synchronous (like typing into an input) from non-blocking updates which don't need to block the user interface (like updating a chart).
<Trans>화면이 실제로 업데이트되어야 하기 때문에 렌더링을 건너뛸 수 없는 경우도 있습니다. 이 경우 입력 입력과 같이 동기화되어야 하는 차단 업데이트와 차트 업데이트와 같이 사용자 인터페이스를 차단할 필요가 없는 비차단 업데이트를 분리하여 성능을 향상시킬 수 있습니다.</Trans>

To prioritize rendering, use one of these Hooks:
<Trans>렌더링 우선순위를 지정하려면 다음 Hook 중 하나를 사용합니다:</Trans>

- [`useTransition`](/reference/react/useTransition) lets you mark a state transition as non-blocking and allow other updates to interrupt it.
- [`useDeferredValue`](/reference/react/useDeferredValue) lets you defer updating a non-critical part of the UI and let other parts update first.
<TransBlock>
- [`useTransition`](/reference/react/useTransition)을 사용하면 state 전환을 비차단 state로 표시하고 다른 업데이트가 이를 중단하도록 허용할 수 있습니다.
- [`useDeferredValue`](/reference/react/useDeferredValue)를 사용하면 UI의 중요하지 않은 부분의 업데이트를 연기하고 다른 부분이 먼저 업데이트되도록 할 수 있습니다.
</TransBlock>

---

## Other Hooks {/*other-hooks*/}

These Hooks are mostly useful to library authors and aren't commonly used in the application code.
<Trans>이 훅들은 대부분 라이브러리 작성자에게 유용하며 애플리케이션 코드에서는 일반적으로 사용되지 않습니다.</Trans>

- [`useDebugValue`](/reference/react/useDebugValue) lets you customize the label React DevTools displays for your custom Hook.
- [`useId`](/reference/react/useId) lets a component associate a unique ID with itself. Typically used with accessibility APIs.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) lets a component subscribe to an external store.
<TransBlock>
- [`useDebugValue`](/reference/react/useDebugValue)를 사용하면 커스텀 훅에 대해 React 개발자 도구가 표시하는 레이블을 사용자가 직접 정의할 수 있습니다.
- [`useId`](/reference/react/useId)는 컴포넌트가 자신과 고유 ID를 연결할 수 있게 해줍니다. 일반적으로 접근성 API와 함께 사용됩니다.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore)는 컴포넌트가 외부 스토어에 구독하도록 합니다.
</TransBlock>

---

## Your own Hooks {/*your-own-hooks*/}

You can also [define your own custom Hooks](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) as JavaScript functions.
<Trans>[커스텀 훅](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component)을 JavaScript 함수로 정의할 수도 있습니다.</Trans>
