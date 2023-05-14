---
title: <Profiler>
translators: [안예지, 고석영]
---

<Intro>

`<Profiler>` lets you measure rendering performance of a React tree programmatically.
<Trans>`<Profiler>`를 사용하면 프로그램적으로 React 트리의 렌더링 성능을 측정할 수 있습니다.</Trans>

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `<Profiler>` {/*profiler*/}

Wrap a component tree in a `<Profiler>` to measure its rendering performance.
<Trans>컴포넌트 트리를 `<Profiler>`로 감싸서 렌더링 성능을 측정합니다.</Trans>

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### Props {/*props*/}

* `id`: A string identifying the part of the UI you are measuring.
* `onRender`: An [`onRender` callback](#onrender-callback) that React calls every time components within the profiled tree update. It receives information about what was rendered and how much time it took.
<TransBlock>
  - `id`: 측정 중인 UI 부분을 식별하는 문자열입니다.
  - `onRender`: 프로파일링된 트리 내의 컴포넌트가 업데이트될 때마다 React가 호출하는 [`onRender` 콜백](#onrender-callback)입니다. 이 콜백은 렌더링된 내용과 소요된 시간에 대한 정보를 받습니다.
</TransBlock>

#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

* Profiling adds some additional overhead, so **it is disabled in the production build by default.** To opt into production profiling, you need to enable a [special production build with profiling enabled.](https://fb.me/react-profiling)
<Trans>프로파일링은 약간의 오버헤드를 추가하므로 **상용 빌드에서는 기본적으로 비활성화되어 있습니다.** 상용 환경에서 프로파일링을 사용하려면 [프로파일링이 활성화된 특수 상용 빌드](https://fb.me/react-profiling)를 활성화해야 합니다.</Trans>

---

### `onRender` callback <Trans>`onRender` 콜백</Trans> {/*onrender-callback*/}

React will call your `onRender` callback with information about what was rendered.
<Trans>React는 렌더링된 내용에 대한 정보와 함께 `onRender` 콜백을 호출합니다.</Trans>

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Aggregate or log render timings...
  // 렌더링 타이밍을 집계하거나 로그를 남깁니다...
}
```

#### Parameters<Trans>매개변수</Trans> {/*onrender-parameters*/}

* `id`: The string `id` prop of the `<Profiler>` tree that has just committed. This lets you identify which part of the tree was committed if you are using multiple profilers.
<Trans>`id`: 방금 커밋한 `<Profiler>` 트리의 `id` 문자열 prop입니다. 여러 프로파일러를 사용하는 경우 트리의 어느 부분이 커밋되었는지 식별할 수 있습니다.</Trans>

* `phase`: `"mount"`, `"update"` or `"nested-update"`. This lets you know whether the tree has just been mounted for the first time or re-rendered due to a change in props, state, or hooks.
<Trans>`phase`: `"mount"`,`"update"` 혹은 `"nested-update"`. 이를 통해 트리가 처음 마운트되었거나, props, state 또는 훅의 변경으로 인해 다시 렌더링되었는지 알 수 있습니다.</Trans>

* `actualDuration`: The number of milliseconds spent rendering the `<Profiler>` and its descendants for the current update. This indicates how well the subtree makes use of memoization (e.g. [`memo`](/reference/react/memo) and [`useMemo`](/reference/react/useMemo)). Ideally this value should decrease significantly after the initial mount as many of the descendants will only need to re-render if their specific props change.
<Trans>`actualDuration`: 현재 업데이트에 대해 `<Profiler>` 및 하위 컴포넌트들을 렌더링하는 데 걸린 시간(밀리초)입니다. 이 값은 하위 트리가 메모화(예: [`memo`](/reference/react/memo), [`useMemo`](/reference/react/useMemo))를 얼마나 잘 사용하는지를 나타냅니다. 많은 자손들은 특정 props가 변경되는 경우에만 다시 렌더링하면 되므로, 이상적으로 이 값은 최초 마운트 이후에는 크게 감소해야 합니다.</Trans>

* `baseDuration`: The number of milliseconds estimating how much time it would take to re-render the entire `<Profiler>` subtree without any optimizations. It is calculated by summing up the most recent render durations of each component in the tree. This value estimates a worst-case cost of rendering (e.g. the initial mount or a tree with no memoization). Compare `actualDuration` against it to see if memoization is working.
<Trans>`baseDuration`: 최적화 없이 전체  `<Profiler>` 하위 트리를 다시 렌더링하는 데 걸리는 시간을 추정한 값(밀리초)입니다. 트리에 있는 각 컴포넌트의 가장 최근 렌더링 시간을 합산하여 계산합니다. 이 값은 최악의 렌더링 비용(예: 초기 마운트 또는 메모화가 없는 트리)을 추정합니다. `actualDuration`과 비교하여 메모화가 잘 작동하는지 확인하세요. </Trans>

* `startTime`: A numeric timestamp for when React began rendering the current update.
<Trans>`startTime`: React가 현재 업데이트 렌더링을 시작한 시점에 대한 숫자 타임스탬프입니다. </Trans>

* `endTime`: A numeric timestamp for when React committed the current update. This value is shared between all profilers in a commit, enabling them to be grouped if desirable.
<Trans>`endTime`: React가 현재 업데이트를 커밋한 시점의 타임스탬프입니다. 이 값은 커밋의 모든 프로파일러 간에 공유되므로 원하는 경우 그룹화할 수 있습니다.</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Measuring rendering performance programmatically <Trans>프로그램적으로 렌더링 성능 측정하기</Trans> {/*measuring-rendering-performance-programmatically*/}

Wrap the `<Profiler>` component around a React tree to measure its rendering performance.
<Trans>React 트리에 `<Profiler>` 컴포넌트를 감싸서 렌더링 성능을 측정합니다.</Trans>

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

It requires two props: an `id` (string) and an `onRender` callback (function) which React calls any time a component within the tree "commits" an update.
<Trans>트리 내의 컴포넌트가 업데이트를 '커밋'할 때마다 React가 호출하는 `id`(문자열)와 `onRender`콜백(함수)의 두 가지 prop이 필요합니다.</Trans>

<Pitfall>

Profiling adds some additional overhead, so **it is disabled in the production build by default.** To opt into production profiling, you need to enable a [special production build with profiling enabled.](https://fb.me/react-profiling)
<Trans>프로파일링은 약간의 오버헤드를 추가하므로 **상용 빌드에서는 기본적으로 비활성화되어 있습니다.** 상용 프로파일링을 사용하려면 [프로파일링이 활성화된 특수 상용 빌드](https://fb.me/react-profiling)를 사용하도록 설정해야 합니다.</Trans>

</Pitfall>

<Note>

`<Profiler>` lets you gather measurements programmatically. If you're looking for an interactive profiler, try the Profiler tab in [React Developer Tools](/learn/react-developer-tools). It exposes similar functionality as a browser extension.
<Trans>`<Profiler>`를 사용하면 프로그램적으로 측정값을 수집할 수 있습니다. 대화형 프로파일러를 찾고 있다면 [React 개발자 도구](/learn/react-developer-tools)의 프로파일러 탭을 사용해 보세요. 브라우저 확장 프로그램과 유사한 기능을 노출합니다.</Trans>

</Note>

---

### Measuring different parts of the application <Trans>애플리케이션의 다양한 부분 측정하기</Trans> {/*measuring-different-parts-of-the-application*/}

You can use multiple `<Profiler>` components to measure different parts of your application:
<Trans>여러 `<Profiler>` 컴포넌트를 사용하여 애플리케이션의 여러 부분을 측정할 수 있습니다:</Trans>

```js {5,7}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content />
  </Profiler>
</App>
```

You can also nest `<Profiler>` components:
<Trans>`<Profiler>` 컴포넌트를 중첩할 수도 있습니다:</Trans>

```js {5,7,9,12}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content>
      <Profiler id="Editor" onRender={onRender}>
        <Editor />
      </Profiler>
      <Preview />
    </Content>
  </Profiler>
</App>
```

Although `<Profiler>` is a lightweight component, it should be used only when necessary. Each use adds some CPU and memory overhead to an application.
<Trans>`<Profiler>`는 가벼운 컴포넌트지만 필요한 경우에만 사용해야 합니다. 사용할 때마다 애플리케이션에 약간의 CPU 및 메모리 오버헤드가 추가됩니다.</Trans>

---

