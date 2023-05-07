---
title: Built-in React APIs
translators: [이나령]
---

<Intro>

In addition to [Hooks](/reference/react) and [Components](/reference/react/components), the `react` package exports a few other APIs that are useful for defining components. This page lists all the remaining modern React APIs.
<Trans>`react` 패키지는 [훅](/reference/react)과 [컴포넌트](/reference/react/components) 외에도 컴포넌트를 정의하는 데 유용한 몇 가지 다른 API를 제공합니다. 이 페이지에는 나머지 모든 최신 React API를 나열하였습니다.</Trans>
</Intro>

---

* [`createContext`](/reference/react/createContext) lets you define and provide context to the child components. Used with [`useContext`.](/reference/react/useContext)
<Trans>[`createContext`](/reference/react/createContext)를 사용하면 하위 컴포넌트에 컨텍스트를 정의하고 제공할 수 있습니다. [`useContext`](/reference/react/useContext)와 함께 사용됩니다.</Trans>

* [`forwardRef`](/reference/react/forwardRef) lets your component expose a DOM node as a ref to the parent. Used with [`useRef`.](/reference/react/useRef)
<Trans>[`forwardRef`](/reference/react/forwardRef)를 사용하면 컴포넌트가 부모에 대한 참조로 DOM 노드를 노출할 수 있습니다. [`useRef`](/reference/react/useRef)와 함께 사용됩니다.</Trans>

* [`lazy`](/reference/react/lazy) lets you defer loading a component's code until it's rendered for the first time.
<Trans>[`lazy`](/reference/react/lazy)를 사용하면 컴포넌트가 처음 렌더링될 때까지 코드 로드를 지연시킬 수 있습니다.</Trans>

* [`memo`](/reference/react/memo) lets your component skip re-renders with same props. Used with [`useMemo`](/reference/react/useMemo) and [`useCallback`.](/reference/react/useCallback)
<Trans>[`memo`](/reference/react/memo)를 사용하면 컴포넌트가 동일한 props로 리렌더링하는 것을 건너뛸 수 있습니다. [`useMemo`](/reference/react/useMemo) 및 [`useCallback`](/reference/react/useCallback)과 함께 사용됩니다.</Trans>

* [`startTransition`](/reference/react/startTransition) lets you mark a state update as non-urgent. Similar to [`useTransition`.](/reference/react/useTransition)
<Trans>[`startTransition`](/reference/react/startTransition)을 사용하면 state 업데이트를 긴급하지 않은 것으로 표시할 수 있습니다. [`useTransition`](/reference/react/useTransition)과 유사합니다.</Trans>
