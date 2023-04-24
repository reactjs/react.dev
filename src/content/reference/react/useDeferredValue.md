---
title: useDeferredValue
translators: [안예지, 정재남]
---

<Intro>

`useDeferredValue` is a React Hook that lets you defer updating a part of the UI.
<Trans>`useDeferredValue`는 UI 일부의 업데이트를 지연시킬 수 있는 React 훅입니다.</Trans>

```js
const deferredValue = useDeferredValue(value)
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `useDeferredValue(value)` {/*usedeferredvalue*/}

Call `useDeferredValue` at the top level of your component to get a deferred version of that value.
<Trans>컴포넌트의 최상위 레벨에서 `useDeferredValue`를 호출하여 지연된 버전의 값을 가져옵니다.</Trans>

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

* `value`: The value you want to defer. It can have any type.
<Trans>`value`: 지연시키려는 값입니다. 어떤 타입이든 가질 수 있습니다.</Trans>

#### Returns<Trans>반환값</Trans> {/*returns*/}

During the initial render, the returned deferred value will be the same as the value you provided. During updates, React will first attempt a re-render with the old value (so it will return the old value), and then try another re-render in background with the new value (so it will return the updated value). 
<Trans>초기 렌더링 중에는, 반환된 '지연된 값'은 사용자가 제공한 값과 동일합니다. 업데이트가 발생하면 React는 먼저 이전 값으로 리렌더링을 시도(반환값이 이전 값과 일치하도록)하고, 그 다음 백그라운드에서 다시 새 값으로 리렌더링을 시도(반환값이 업데이트된 새 값과 일치하도록)합니다.</Trans>

#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

- The values you pass to `useDeferredValue` should either be primitive values (like strings and numbers) or objects created outside of rendering. If you create a new object during rendering and immediately pass it to `useDeferredValue`, it will be different on every render, causing unnecessary background re-renders.
<Trans>`useDeferredValue`에 전달하는 값은 문자열 및 숫자와 같은 원시값이거나, 컴포넌트의 외부에서 생성된 객체여야 합니다. 렌더링 중에 새 객체를 생성하고 즉시 `useDeferredValue`에 전달하면 렌더링할 때마다 값이 달라져 불필요한 백그라운드 리렌더링이 발생할 수 있습니다.</Trans>

- When `useDeferredValue` receives a different value (compared with [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), in addition to the current render (when it still uses the previous value), it schedules a re-render in the background with the new value. The background re-render is interruptible: if there's another update to the `value`, React will restart the background re-render from scratch. For example, if the user is typing into an input faster than a chart receiving its deferred value can re-render, the chart will only re-render after the user stops typing.
<Trans>`useDeferredValue`가 현재 렌더링(여전히 이전 값을 사용하는 경우) 외에 다른 값([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)와 비교)을 받으면 백그라운드에서 새 값으로 다시 렌더링하도록 예약합니다. 값에 대한 또 다른 업데이트가 있으면 백그라운드 리렌더링은 중단될 수 있습니다. React는 백그라운드 리렌더링을 처음부터 다시 시작할 것입니다. 예를 들어, 차트가 리렌더링 가능한 지연된 값을 받는 속도보다 사용자가 input에 값을 입력하는 속도가 더 빠른 경우, 차트는 사용자가 입력을 멈춘 후에만 다시 렌더링됩니다.</Trans>

- `useDeferredValue` is integrated with [`<Suspense>`.](/reference/react/Suspense) If the background update caused by a new value suspends the UI, the user will not see the fallback. They will see the old deferred value until the data loads.
<Trans>`useDeferredValue`는 `<Suspense>`와 통합됩니다. 새 값으로 인한 백그라운드 업데이트로 인해 UI가 일시 중단되면 사용자에게 폴백이 표시되지 않습니다. 데이터가 로드될 때까지 기존의 지연된 값이 계속 표시됩니다.</Trans>

- `useDeferredValue` does not by itself prevent extra network requests.
<Trans>`useDeferredValue`는 그 자체로 추가 네트워크 요청을 방지하지 않습니다.</Trans>

- There is no fixed delay caused by `useDeferredValue` itself. As soon as React finishes the original re-render, React will immediately start working on the background re-render with the new deferred value. Any updates caused by events (like typing) will interrupt the background re-render and get prioritized over it.
<Trans>`useDeferredValue` 자체로 인한 고정된 지연은 없습니다. React가 원래의 리렌더링을 완료하자마자 React는 즉시 새로운 지연된 값으로 백그라운드 리렌더링 작업을 시작합니다. 그러나 이벤트로 인한 업데이트(예: 타이핑)는 백그라운드 리렌더링을 중단하고 우선순위를 갖습니다.</Trans>

- The background re-render caused by `useDeferredValue` does not fire Effects until it's committed to the screen. If the background re-render suspends, its Effects will run after the data loads and the UI updates.
<Trans>`useDeferredValue`로 인한 백그라운드 리렌더링은 화면에 커밋될 때까지 Effect를 실행하지 않습니다. 백그라운드 리렌더링이 일시 중단되면 데이터가 로드되고 UI가 업데이트된 후에 해당 Effect가 실행됩니다.</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Showing stale content while fresh content is loading<Trans>새 콘텐츠가 로드되는 동안 오래된 콘텐츠 표시하기</Trans> {/*showing-stale-content-while-fresh-content-is-loading*/}

Call `useDeferredValue` at the top level of your component to defer updating some part of your UI.
<Trans>컴포넌트의 최상위 레벨에서 `useDeferredValue`를 호출하여 UI의 일부 업데이트를 연기할 수 있습니다.</Trans>

```js [[1, 5, "query"], [2, 5, "deferredQuery"]]
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

During the initial render, the <CodeStep step={2}>deferred value</CodeStep> will be the same as the <CodeStep step={1}>value</CodeStep> you provided.
<Trans>초기 렌더링 시점에 <CodeStep step={2}>지연된 값</CodeStep>은 사용자가 제공한 <CodeStep step={1}>값(value)</CodeStep>과 동일합니다.</Trans>

During updates, the <CodeStep step={2}>deferred value</CodeStep> will "lag behind" the latest <CodeStep step={1}>value</CodeStep>. In particular, React will first re-render *without* updating the deferred value, and then try to re-render with the newly received value in background.
<Trans>업데이트가 발생하면, <CodeStep step={2}>지연된 값</CodeStep>은 최신 <CodeStep step={1}>값</CodeStep>보다 "뒤쳐지게" 됩니다. React는 먼저 지연된 값을 업데이트하지 *않은 채로* 렌더링한 다음, 백그라운드에서 새로 받은 값으로 다시 렌더링을 시도합니다.</Trans>

**Let's walk through an example to see when this is useful.**
<Trans>**이것이 언제 유용한지 예시를 통해 살펴보겠습니다.**</Trans>

<Note>

This example assumes you use one of Suspense-enabled data sources:
<Trans>이 예제에서는 Suspense 지원 데이터 소스 중 하나를 사용한다고 가정합니다:</Trans>

- Data fetching with Suspense-enabled frameworks like [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) and [Next.js](https://nextjs.org/docs/advanced-features/react-18)
<Trans>[Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) 및 [Next.js](https://nextjs.org/docs/advanced-features/react-18)와 같은 Suspense 지원 프레임워크를 사용한 데이터 가져오기</Trans>

- Lazy-loading component code with [`lazy`](/reference/react/lazy)
<Trans>[`lazy`](/reference/react/lazy)를 사용한 지연 로딩 컴포넌트 코드</Trans>

[Learn more about Suspense and its limitations.](/reference/react/Suspense)
<Trans>[Suspense와 그 한계에 대해 자세히 알아보기](/reference/react/Suspense)</Trans>

</Note>

In this example, the `SearchResults` component [suspends](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading) while fetching the search results. Try typing `"a"`, waiting for the results, and then editing it to `"ab"`. The results for `"a"` get replaced by the loading fallback.
<Trans>이 예제에서는 검색 결과를 가져오는 동안 `SearchResults` 컴포넌트가 [일시 중단](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)됩니다. `"a"`를 입력하고 결과를 기다린 다음 `"ab"`로 수정해 보세요. `"a"`에 대한 결과가 로딩 폴백으로 대체될 것입니다.</Trans>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js SearchResults.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

A common alternative UI pattern is to *defer* updating the list of results and to keep showing the previous results until the new results are ready. Call `useDeferredValue` to pass a deferred version of the query down: 
<Trans>일반적인 대체 UI 패턴은 결과 목록 업데이트를 지연하고 새 결과가 준비될 때까지 이전 결과를 계속 표시하는 것입니다. `useDeferredValue` 훅을 사용하면 쿼리의 지연된 버전을 전달할 수 있습니다:</Trans>

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

The `query` will update immediately, so the input will display the new value. However, the `deferredQuery` will keep its previous value until the data has loaded, so `SearchResults` will show the stale results for a bit.
<Trans>`query`가 즉시 업데이트되므로 input에 새 값이 표시됩니다. 그러나 `deferredQuery`는 데이터가 로드될 때까지 이전 값을 유지하므로 `SearchResults`는 잠시 동안 오래된 결과를 표시합니다.</Trans>

Enter `"a"` in the example below, wait for the results to load, and then edit the input to `"ab"`. Notice how instead of the Suspense fallback, you now see the stale result list until the new results have loaded:
<Trans>아래 예제에서 `"a"`를 입력하고 결과가 로드될 때까지 기다린 다음 입력을 `"ab"`로 편집해 보세요. 이제 새 결과가 로드될 때까지 일시 중단 폴백 대신 오래된 결과 목록이 표시되는 것을 확인할 수 있습니다:</Trans>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

```js SearchResults.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

<DeepDive>

#### How does deferring a value work under the hood?<Trans>값을 지연시키는 것은 어떻게 작동하나요?</Trans> {/*how-does-deferring-a-value-work-under-the-hood*/}

You can think of it as happening in two steps:
<Trans>두 단계로 진행된다고 생각하면 됩니다:</Trans>

1. **First, React re-renders with the new `query` (`"ab"`) but with the old `deferredQuery` (still `"a")`.** The `deferredQuery` value, which you pass to the result list, is *deferred:* it "lags behind" the `query` value.
<Trans>**먼저, React는 새로운 `query`(`"ab"`)가 아닌 이전 `deferredQuery`(여전히 `"a"`)로 다시 렌더링합니다.** 결과 목록에 전달하는 `deferredQuery` 값은 `query` 값보다 "지연"된 상태입니다.</Trans>

2. **In background, React tries to re-render with *both* `query` and `deferredQuery` updated to `"ab"`.** If this re-render completes, React will show it on the screen. However, if it suspends (the results for `"ab"` have not loaded yet), React will abandon this rendering attempt, and retry this re-render again after the data has loaded. The user will keep seeing the stale deferred value until the data is ready.
<Trans>**백그라운드에서 React는 `query`와 `deferredQuery`를 모두 `"ab"`로 업데이트한 상태로 리렌더링을 시도합니다.** 이 리렌더링이 완료되면 React는 이를 화면에 표시합니다. 그러나 일시 중단되면(`"ab"`에 대한 결과가 아직 로드되지 않은 경우) React는 이 렌더링 시도를 포기하고 데이터가 로드된 후 이 리렌더링을 다시 시도합니다. 사용자는 데이터가 준비될 때까지 오래된 '지연된 값'을 계속 보게 됩니다.</Trans>

The deferred "background" rendering is interruptible. For example, if you type into the input again, React will abandon it and restart with the new value. React will always use the latest provided value.
<Trans>지연된 “background” 렌더링은 중단할 수 있습니다. 예를 들어, 사용자가 입력을 다시 입력하면 React는 해당 입력을 버리고 새 값으로 다시 시작합니다. React는 항상 가장 최근에 제공받은 값을 사용합니다.</Trans>

Note that there is still a network request per each keystroke. What's being deferred here is displaying results (until they're ready), not the network requests themselves. Even if the user continues typing, responses for each keystroke get cached, so pressing Backspace is instant and doesn't fetch again.
<Trans>각 키 입력마다 네트워크 요청이 여전히 존재한다는 점에 유의하세요. 여기서 지연되는 것은 네트워크 요청 자체가 아니라 결과가 준비될 때까지 결과를 표시하는 것입니다. 사용자가 계속 입력하더라도 각 키 입력에 대한 응답은 캐시되므로 백스페이스를 누르면 즉시 다시 가져오지 않습니다.</Trans>

</DeepDive>

---

### Indicating that the content is stale<Trans>콘텐츠가 오래되었음을 표시하기</Trans> {/*indicating-that-the-content-is-stale*/}

In the example above, there is no indication that the result list for the latest query is still loading. This can be confusing to the user if the new results take a while to load. To make it more obvious to the user that the result list does not match the latest query, you can add a visual indication when the stale result list is displayed:
<Trans>위의 예에서는 최신 쿼리에 대한 결과 목록이 아직 로드 중이라는 표시가 없습니다. 새 결과를 로드하는 데 시간이 오래 걸리는 경우 사용자에게 혼란을 줄 수 있습니다. 결과 목록이 최신 쿼리와 일치하지 않는다는 것을 사용자에게 더 명확하게 알리기 위해 오래된 결과 목록이 표시될 때 시각적 표시를 추가할 수 있습니다:</Trans>

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

With this change, as soon as you start typing, the stale result list gets slightly dimmed until the new result list loads. You can also add a CSS transition to delay dimming so that it feels gradual, like in the example below:
<Trans>이렇게 변경하면 입력을 시작하자마자 새 결과 목록이 로드될 때까지 오래된 결과 목록이 약간 어두워집니다. 아래 예시처럼 CSS 전환을 추가하여 점진적인 느낌을 주도록 흐리게 표시되는 시간을 지연시킬 수도 있습니다:</Trans>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js SearchResults.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

---

### Deferring re-rendering for a part of the UI<Trans>UI의 일부에 대해 리렌더링 연기하기</Trans> {/*deferring-re-rendering-for-a-part-of-the-ui*/}

You can also apply `useDeferredValue` as a performance optimization. It is useful when a part of your UI is slow to re-render, there's no easy way to optimize it, and you want to prevent it from blocking the rest of the UI.
<Trans>`useDeferredValue`를 성능 최적화로 적용할 수도 있습니다. UI의 일부가 리렌더링 속도가 느리고, 이를 최적화할 쉬운 방법이 없으며, 나머지 UI를 차단하지 않도록 하려는 경우에 유용합니다.</Trans>

Imagine you have a text field and a component (like a chart or a long list) that re-renders on every keystroke:
<Trans>키 입력 시마다 다시 렌더링되는 텍스트 필드와 컴포넌트(예: 차트 또는 긴 목록)가 있다고 가정해 보겠습니다:</Trans>

```js
function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

First, optimize `SlowList` to skip re-rendering when its props are the same. To do this, [wrap it in `memo`:](/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)
<Trans>먼저, props가 동일한 경우 리렌더링을 건너뛰도록 SlowList를 최적화합니다. 이렇게 하려면 [`memo`로 감싸주세요:](/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)</Trans>

```js {1,3}
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

However, this only helps if the `SlowList` props are *the same* as during the previous render. The problem you're facing now is that it's slow when they're *different,* and when you actually need to show different visual output.
<Trans>하지만 이는 `SlowList` props가 이전 렌더링 때와 동일한 경우에만 도움이 됩니다. 지금 직면하고 있는 문제는 props가 다를 때, 그리고 실제로 다른 시각적 출력을 표시해야 할 때 속도가 느리다는 것입니다.</Trans>

Concretely, the main performance problem is that whenever you type into the input, the `SlowList` receives new props, and re-rendering its entire tree makes the typing feel janky. In this case, `useDeferredValue` lets you prioritize updating the input (which must be fast) over updating the result list (which is allowed to be slower):
<Trans>구체적으로, 주요 성능 문제는 input에 타이핑할 때마다 `SlowList`가 새로운 props을 수신하고 전체 트리를 다시 렌더링하면 타이핑이 끊기는 느낌이 든다는 것입니다. 이 경우 `useDeferredValue`를 사용하면 결과 목록 업데이트(느려도 됨)보다 입력 업데이트(빨라야 함)의 우선순위를 지정할 수 있습니다:</Trans>

```js {3,7}
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

This does not make re-rendering of the `SlowList` faster. However, it tells React that re-rendering the list can be deprioritized so that it doesn't block the keystrokes. The list will "lag behind" the input and then "catch up". Like before, React will attempt to update the list as soon as possible, but will not block the user from typing.
<Trans>이렇게 한다고 해서`SlowList`의 리렌더링 속도가 빨라지지는 않습니다. 하지만 키 입력을 차단하지 않도록 목록 리렌더링의 우선순위를 낮출 수 있다는 것을 React에 알려줍니다. 목록은 입력보다 "지연"되었다가 "따라잡"습니다. 이전과 마찬가지로 React는 가능한 한 빨리 목록을 업데이트하려고 시도하지만, 사용자가 다시 입력하는 것을 차단하지는 않습니다.</Trans>

<Recipes titleText="The difference between useDeferredValue and unoptimized re-rendering" translatedTitle="useDeferredValue와 최적화되지 않은 리렌더링의 차이점" titleId="examples">

#### Deferred re-rendering of the list<Trans>목록 리렌더링 지연</Trans> {/*deferred-re-rendering-of-the-list*/}

In this example, each item in the `SlowList` component is **artificially slowed down** so that you can see how `useDeferredValue` lets you keep the input responsive. Type into the input and notice that typing feels snappy while the list "lags behind" it.
<Trans>이 예시에서는 `SlowList` 컴포넌트의 각 항목이 **인위적으로 느려지도록 하여** `useDeferredValue`를 통해 입력 반응성을 유지하는 방법을 확인할 수 있습니다. input에 타이핑하면 타이핑은 빠르게 느껴지는 반면 목록은 "지연"되는 것을 확인할 수 있습니다.</Trans>

<Sandpack>

```js
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

```js SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log once. The actual slowdown is inside SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

#### Unoptimized re-rendering of the list<Trans>목록의 최적화되지 않은 리렌더링</Trans> {/*unoptimized-re-rendering-of-the-list*/}

In this example, each item in the `SlowList` component is **artificially slowed down**, but there is no `useDeferredValue`.
<Trans>이 예시에서는 `SlowList` 컴포넌트의 각 항목이 **인위적으로 느려졌지만** `useDeferredValue`는 없습니다.</Trans>

Notice how typing into the input feels very janky. This is because without `useDeferredValue`, each keystroke forces the entire list to re-render immediately in a non-interruptible way.
<Trans>input에 타이핑할 때 매우 뻑뻑한 느낌이 드는 것을 알 수 있습니다. 이는 `useDeferredValue`가 없으면 키 입력 시마다 전체 목록이 중단되지 않는 방식으로 즉시 다시 렌더링되기 때문입니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

```js SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log once. The actual slowdown is inside SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

This optimization requires `SlowList` to be wrapped in [`memo`.](/reference/react/memo) This is because whenever the `text` changes, React needs to be able to re-render the parent component quickly. During that re-render, `deferredText` still has its previous value, so `SlowList` is able to skip re-rendering (its props have not changed). Without [`memo`,](/reference/react/memo) it would have to re-render anyway, defeating the point of the optimization.
<Trans>이 최적화를 위해서는 `SlowList` 를 [`memo`](/reference/react/memo)로 감싸야 합니다. 텍스트가 변경될 때마다 React가 부모 컴포넌트를 빠르게 다시 렌더링할 수 있어야 하기 때문입니다. 다시 렌더링하는 동안  `deferredText`는 여전히 이전 값을 가지므로 `SlowList`는 리렌더링을 건너뛸 수 있습니다(props는 변경되지 않았습니다). [`memo`](/reference/react/memo)가 없다면 어쨌든 다시 렌더링해야 하므로 최적화의 취지가 무색해집니다.</Trans>

</Pitfall>

<DeepDive>

#### How is deferring a value different from debouncing and throttling?<Trans>값을 연기하는 것은 debounce 및 throttling과 어떻게 다른가요?</Trans> {/*how-is-deferring-a-value-different-from-debouncing-and-throttling*/}

There are two common optimization techniques you might have used before in this scenario:
<Trans>이 시나리오에서 이전에 사용했을 수 있는 두 가지 일반적인 최적화 기법이 있습니다:</Trans>

- *Debouncing* means you'd wait for the user to stop typing (e.g. for a second) before updating the list.
- *Throttling* means you'd update the list every once in a while (e.g. at most once a second).

<TransBlock>
- *Debouncing*은 사용자가 타이핑을 멈출 때까지(예: 1초 동안) 기다렸다가 목록을 업데이트하는 것을 의미합니다.
- *Throttling*은 가끔씩(예: 최대 1초에 한 번) 목록을 업데이트하는 것을 의미합니다.
</TransBlock>

While these techniques are helpful in some cases, `useDeferredValue` is better suited to optimizing rendering because it is deeply integrated with React itself and adapts to the user's device.
<Trans>이 기법들은 경우에 따라 유용하지만, `useDeferredValue`는 React 자체와 깊게 통합되어 있고 사용자의 기기에 맞게 조정되기 때문에 렌더링을 최적화하는 데 더 적합합니다.</Trans>

Unlike debouncing or throttling, it doesn't require choosing any fixed delay. If the user's device is fast (e.g. powerful laptop), the deferred re-render would happen almost immediately and wouldn't be noticeable. If the user's device is slow, the list would "lag behind" the input proportionally to how slow the device is.
<Trans>debouncing이나 throttling과 달리 고정된 지연을 선택할 필요가 없습니다. 사용자의 기기가 빠른 경우(예: 고성능 노트북) 지연된 리렌더링은 거의 즉시 발생하며 눈에 띄지 않을 것입니다. 사용자의 기기가 느린 경우, 기기 속도에 비례하여 목록이 입력에 '지연'됩니다.</Trans>

Also, unlike with debouncing or throttling, deferred re-renders done by `useDeferredValue` are interruptible by default. This means that if React is in the middle of re-rendering a large list, but the user makes another keystroke, React will abandon that re-render, handle the keystroke, and then start rendering in background again. By contrast, debouncing and throttling still produce a janky experience because they're *blocking:* they merely postpone the moment when rendering blocks the keystroke.
<Trans>또한 debouncing이나 throttling과 달리 `useDeferredValue`에 의해 수행되는 지연된 리렌더링은 기본적으로 중단 가능합니다. 즉, React가 큰 목록을 다시 렌더링하는 도중에 사용자가 다른 키 입력을 하면 React는 해당 리렌더링을 중단하고 키 입력을 처리한 다음 백그라운드에서 다시 렌더링을 시작합니다. 반면 debouncing과 throttling은 렌더링이 키 입력을 차단하는 순간을 연기할 뿐이므로 여전히 불안정한 경험을 만들어냅니다.</Trans>

If the work you're optimizing doesn't happen during rendering, debouncing and throttling are still useful. For example, they can let you fire fewer network requests. You can also use these techniques together.
<Trans>최적화하려는 작업이 렌더링 중에 발생하지 않는 경우에도 debouncing과 throttling은 여전히 유용합니다. 예를 들어 debouncing과 throttling을 사용하면 네트워크 요청을 더 적게 실행할 수 있습니다. 이러한 기술을 함께 사용할 수도 있습니다.</Trans>
</DeepDive>
