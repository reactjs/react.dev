---
title: useInsertionEffect
translators: [고석영]
---

<Pitfall>

`useInsertionEffect` is for CSS-in-JS library authors. Unless you are working on a CSS-in-JS library and need a place to inject the styles, you probably want [`useEffect`](/reference/react/useEffect) or [`useLayoutEffect`](/reference/react/useLayoutEffect) instead.
<Trans>`useInsertionEffect`는 CSS-in-JS 라이브러리 작성자를 위한 훅입니다. CSS-in-JS 라이브러리에서 작업 중에 스타일을 주입하고자 하는 경우가 아니라면, [`useEffect`](/reference/react/useEffect)나 [`useLayoutEffect`](/reference/react/useLayoutEffect)가 더 나을 수 있습니다. </Trans>

</Pitfall>

<Intro>

`useInsertionEffect` is a version of [`useEffect`](/reference/react/useEffect) that fires before any DOM mutations.
<Trans>`useInsertionEffect`는 [`useEffect`](/reference/react/useEffect)의 버전 중 하나로, DOM 변이 전에 실행됩니다.</Trans>

```js
useInsertionEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `useInsertionEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Call `useInsertionEffect` to insert the styles before any DOM mutations:
<Trans>`useInsertionEffect`를 호출하여 DOM 변이 전에 스타일을 주입합니다.</Trans>

```js
import { useInsertionEffect } from 'react';

// Inside your CSS-in-JS library
// CSS-in-JS 라이브러리 내부에서
function useCSS(rule) {
  useInsertionEffect(() => {
    // ... inject <style> tags here ...
    // ... <style> 태그를 여기에 주입합니다.
  });
  return rule;
}
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>
<Trans>[더 많은 예시는 여기에서 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

* `setup`: The function with your Effect's logic. Your setup function may also optionally return a *cleanup* function. Before your component is added to the DOM, React will run your setup function. After every re-render with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values. Before your component is removed from the DOM, React will run your cleanup function.
<Trans>`setup`: Effect의 로직이 포함된 함수입니다. 셋업 함수는 *클린업* 함수를 선택적으로 반환할 수도 있습니다. 컴포넌트가 DOM에 추가되기 전에 React는 셋업 함수를 실행합니다. 변경된 의존성으로 다시 렌더링할 때마다 React는 먼저 이전 값으로 셋업 함수를 실행한 다음(제공한 경우) 새 값으로 셋업 함수를 실행합니다. 컴포넌트가 DOM에서 제거되기 전에 React는 클린업 함수를 한 번 더 실행합니다.</Trans>
 
* **optional** `dependencies`: The list of all reactive values referenced inside of the `setup` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is [configured for React](/learn/editor-setup#linting), it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison algorithm. If you don't specify the dependencies at all, your Effect will re-run after every re-render of the component.
<Trans>**optional** `dependencies`: `setup` 코드 내에서 참조된 모든 반응형 값의 목록입니다. 반응형 값에는 props, state, 컴포넌트 본문 내부에서 직접 선언된 모든 변수와 함수가 포함됩니다. linter가 [React용으로 구성](/learn/editor-setup#linting)된 경우, 모든 반응형 값이 의존성으로 올바르게 지정되었는지 확인합니다. 의존성 목록은 일정한 수의 항목을 가져야 하며 [`dep1, dep2, dep3`]와 같이 인라인으로 작성해야 합니다. React는 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교 알고리즘을 사용하여 각 의존성을 이전 값과 비교합니다. 의존성을 전혀 지정하지 않으면 컴포넌트를 다시 렌더링할 때마다 Effect가 다시 실행됩니다.</Trans>

#### Returns<Trans>반환값</Trans> {/*returns*/}

`useInsertionEffect` returns `undefined`.
<Trans>`useInsertionEffect`는 `undefined`를 반환합니다.</Trans>

#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

* Effects only run on the client. They don't run during server rendering.
* You can't update state from inside `useInsertionEffect`.
* By the time `useInsertionEffect` runs, refs are not attached yet, and DOM is not yet updated.

<TransBlock>
- Effect는 클라이언트에서만 실행됩니다. 서버 렌더링 중에는 실행되지 않습니다.
- `useInsertionEffect` 내부에서는 state를 업데이트할 수 없습니다.
- `useInsertionEffect`가 실행될 때까지는 refs가 아직 첨부되지 않았고, DOM이 아직 업데이트되지 않았습니다.
</TransBlock>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Injecting dynamic styles from CSS-in-JS libraries <Trans>CSS-in-JS 라이브러리에서 동적 스타일 삽입하기</Trans> {/*injecting-dynamic-styles-from-css-in-js-libraries*/}

Traditionally, you would style React components using plain CSS.
<Trans>기존에는 일반 CSS를 사용해 React 컴포넌트의 스타일을 지정했습니다.</Trans>

```js
// In your JS file:
// JS 파일 작성 코드:
<button className="success" />

// In your CSS file:
// CSS 파일 작성 코드:
.success { color: green; }
```

Some teams prefer to author styles directly in JavaScript code instead of writing CSS files. This usually requires using a CSS-in-JS library or a tool. There are three common approaches to CSS-in-JS:
<Trans>일부 팀은 CSS 파일을 작성하는 대신 JavsScript 코드에서 직접 스타일을 작성하는 것을 선호합니다. 이 경우 일반적으로 CSS-in-JS 라이브러리 또는 도구를 사용해야 합니다. CSS-in-JS에는 세 가지 일반적인 접근 방식이 있습니다:</Trans>

1. Static extraction to CSS files with a compiler
2. Inline styles, e.g. `<div style={{ opacity: 1 }}>`
3. Runtime injection of `<style>` tags

<TransBlock>
1. 컴파일러를 사용하여 CSS 파일로 정적 추출
2. 인라인 스타일, 예: `<div style={{ opacity: 1 }}>`
3. 런타임에 `<style>` 태그 삽입
</TransBlock>

If you use CSS-in-JS, we recommend a combination of the first two approaches (CSS files for static styles, inline styles for dynamic styles). **We don't recommend runtime `<style>` tag injection for two reasons:**
<Trans>CSS-in-JS를 사용하는 경우 처음 두 가지 접근 방식(정적 스타일의 경우 CSS 파일, 동적 스타일의 경우 인라인 스타일)을 조합하여 사용하는 것이 좋습니다. **런타임 환경에서 `<style>` 태그 주입은 다음 두 가지 이유로 권장하지 않습니다.**</Trans>

1. Runtime injection forces the browser to recalculate the styles a lot more often.
2. Runtime injection can be very slow if it happens at the wrong time in the React lifecycle.
<TransBlock>
  1. 런타임 주입은 브라우저에서 스타일을 훨씬 더 자주 다시 계산하도록 합니다.
  2. 런타임 주입이 React 라이프사이클에서 잘못된 시점에 발생하면 속도가 매우 느려질 수 있습니다.
</TransBlock>

The first problem is not solvable, but `useInsertionEffect` helps you solve the second problem.
<Trans>첫 번째 문제는 해결할 수 없지만 `useInsertionEffect`를 사용하면 두 번째 문제를 해결할 수 있습니다.</Trans>

Call `useInsertionEffect` to insert the styles before any DOM mutations:
<Trans>`useInsertionEffect`를 호출하여 DOM 변경 전에 스타일을 주입합니다:</Trans>

```js {4-11}
// Inside your CSS-in-JS library
// CSS-in-JS 라이브러리 코드 내부에
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // As explained earlier, we don't recommend runtime injection of <style> tags.
    // 앞서 설명한 것처럼 <style> 태그의 런타임 주입은 권장하지 않습니다.
    // But if you have to do it, then it's important to do in useInsertionEffect.
    // 하지만 런타임 주입을 해야한다면, useInsertionEffect에서 수행하는 것이 중요합니다.
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

Similarly to `useEffect`, `useInsertionEffect` does not run on the server. If you need to collect which CSS rules have been used on the server, you can do it during rendering:
<Trans>`useEffect`와 마찬가지로 `useInsertionEffect`는 서버에서 실행되지 않습니다. 서버에서 어떤 CSS 규칙이 사용되었는지 수집해야 하는 경우 렌더링 중에 수집할 수 있습니다:</Trans>

```js {1,4-6}
let collectedRulesSet = new Set();

function useCSS(rule) {
  if (typeof window === 'undefined') {
    collectedRulesSet.add(rule);
  }
  useInsertionEffect(() => {
    // ...
  });
  return rule;
}
```

[Read more about upgrading CSS-in-JS libraries with runtime injection to `useInsertionEffect`.](https://github.com/reactwg/react-18/discussions/110)
<Trans>[런타임 주입이 있는 CSS-in-JS 라이브러리를 `useInsertionEffect`로 업그레이드 하는 방법에 대해 자세히 알아보세요.](https://github.com/reactwg/react-18/discussions/110)</Trans>

<DeepDive>

#### How is this better than injecting styles during rendering or useLayoutEffect? <Trans>useInsertionEffect가 렌더링 중에 스타일을 주입하거나 useLayoutEffect를 사용하는 것보다 어떤 점이 더 나은가요?</Trans> {/*how-is-this-better-than-injecting-styles-during-rendering-or-uselayouteffect*/}

If you insert styles during rendering and React is processing a [non-blocking update,](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) the browser will recalculate the styles every single frame while rendering a component tree, which can be **extremely slow.**
<Trans>렌더링 중에 스타일을 주입하고 React가 [비차단 업데이트](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition)를 처리하는 경우 브라우저는 컴포넌트 트리를 렌더링하는 동안 매 프레임마다 스타일을 다시 계산하므로 **매우 느릴 수 있습니다.**</Trans>

`useInsertionEffect` is better than inserting styles during [`useLayoutEffect`](/reference/react/useLayoutEffect) or [`useEffect`](/reference/react/useEffect) because it ensures that by the time other Effects run in your components, the `<style>` tags have already been inserted. Otherwise, layout calculations in regular Effects would be wrong due to outdated styles.
<Trans>`useInsertionEffect`는 다른 Effect 컴포넌트에서 실행될 때 `<style>` 태그가 이미 주입되어 있기 때문에 [`useLayoutEffect`](/reference/react/useLayoutEffect) 또는 [`useEffect`](/reference/react/useEffect) 중에 스타일을 주입하는 것보다 낫습니다. 그렇지 않으면 오래된 스타일로 인해 일반적인 Effect의 레이아웃 계산이 잘못될 수 있습니다.</Trans>

</DeepDive>
