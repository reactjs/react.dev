---
title: Built-in React Components
translators: [고석영]
---

<Intro>

React exposes a few built-in components that you can use in your JSX.
<Trans>React는 JSX에서 사용할 수 있는 몇 가지 내장 컴포넌트를 제공합니다.</Trans>

</Intro>

---

## Built-in components <Trans>내장 컴포넌트</Trans> {/*built-in-components*/}

* [`<Fragment>`](/reference/react/Fragment), alternatively written as `<>...</>`, lets you group multiple JSX nodes together.
* [`<Profiler>`](/reference/react/Profiler) lets you measure rendering performance of a React tree programmatically.
* [`<Suspense>`](/reference/react/Suspense) lets you display a fallback while the child components are loading.
* [`<StrictMode>`](/reference/react/StrictMode) enables extra development-only checks that help you find bugs early.
<TransBlock>
  - [`<Fragment>`](/reference/react/Fragment), 또는 `<>...</>`로 작성하면 여러 JSX 노드를 그룹화할 수 있습니다.
  - [`<Profiler>`](/reference/react/Profiler)는 프로그래밍 방식으로 React 트리의 렌더링 성능을 측정합니다.
  - [`<Suspense>`](/reference/react/Suspense)는 자식 컴포넌트가 로딩되는 동안 폴백을 표시합니다.
  - [`<StrictMode>`](/reference/react/StrictMode)는 버그를 조기에 발견하는 데 도움이 되는 추가 개발 환경 전용 검사를 활성화합니다.
</TransBlock>

---

## Your own components <Trans>커스텀 컴포넌트</Trans> {/*your-own-components*/}

You can also [define your own components](/learn/your-first-component) as JavaScript functions.
<Trans>JavaScript 함수로 [자신만의 컴포넌트를 정의](/learn/your-first-component)할 수도 있습니다.</Trans>