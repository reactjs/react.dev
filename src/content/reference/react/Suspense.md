---
title: <Suspense>
translators: [이승효]
---

<Intro>

`<Suspense>` lets you display a fallback until its children have finished loading.
<Trans>`<Suspense>`를 사용하면 자식이 로딩을 완료할 때까지 fallback을 표시할 수 있습니다.</Trans>


```js
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `<Suspense>` {/*suspense*/}

#### Props {/*props*/}
* `children`: The actual UI you intend to render. If `children` suspends while rendering, the Suspense boundary will switch to rendering `fallback`.
* `fallback`: An alternate UI to render in place of the actual UI if it has not finished loading. Any valid React node is accepted, though in practice, a fallback is a lightweight placeholder view, such as a loading spinner or skeleton. Suspense will automatically switch to `fallback` when `children` suspends, and back to `children` when the data is ready. If `fallback` suspends while rendering, it will activate the closest parent Suspense boundary.
<TransBlock>
* `children`: 렌더링하려는 실제 UI입니다. 렌더링하는 동안 `children`이 일시 중단되면 서스펜스 경계가 `fallback` 렌더링으로 전환됩니다.
* `fallback`: 로딩이 완료되지 않은 경우에 실제 UI 대신 렌더링할 대체 UI입니다. 유효한 모든 React 노드를 사용할 수 있지만, 실제로는 로딩 스피너나 스켈레톤과 같은 가벼운 플레이스홀더 뷰가 fallback으로 사용됩니다. 서스펜스는 `children`이 일시 중단되면 자동으로 `fallback`으로 전환되고, 데이터가 준비되면 다시 `children`으로 전환됩니다. 렌더링 중에 `fallback`이 일시 중단되면 가장 가까운 상위 서스펜스 경계가 활성화됩니다.
</TransBlock>

#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

- React does not preserve any state for renders that got suspended before they were able to mount for the first time. When the component has loaded, React will retry rendering the suspended tree from scratch.
- If Suspense was displaying content for the tree, but then it suspended again, the `fallback` will be shown again unless the update causing it was caused by [`startTransition`](/reference/react/startTransition) or [`useDeferredValue`](/reference/react/useDeferredValue).
- If React needs to hide the already visible content because it suspended again, it will clean up [layout Effects](/reference/react/useLayoutEffect) in the content tree. When the content is ready to be shown again, React will fire the layout Effects again. This ensures that Effects measuring the DOM layout don't try to do this while the content is hidden.
- React includes under-the-hood optimizations like *Streaming Server Rendering* and *Selective Hydration* that are integrated with Suspense. Read [an architectural overview](https://github.com/reactwg/react-18/discussions/37) and watch [a technical talk](https://www.youtube.com/watch?v=pj5N-Khihgc) to learn more.
<TransBlock>
- React는 처음 마운트하기 전에 일시 중단된 렌더링의 state를 보존하지 않습니다. 컴포넌트가 로드되면 React는 일시 중단된 트리의 렌더링을 처음부터 다시 시도합니다.
- 서스펜스가 트리에 대한 콘텐츠를 표시하고 있다가 다시 일시 중단된 경우, 그 원인이 된 업데이트가 [`startTransition`](/reference/react/startTransition)이나 [`useDeferredValue`](/reference/react/useDeferredValue)로 인한 것이 아니라면 `fallback`이 다시 표시됩니다.
- React에는 Suspense와 통합된 **스트리밍 서버 렌더링** 및 **선택적 이벤트 보충**과 같은 내부 최적화가 포함되어 있습니다. [아키텍처 개요](https://github.com/reactwg/react-18/discussions/37)를 읽고 [기술 강연](https://www.youtube.com/watch?v=pj5N-Khihgc)을 시청하여 자세히 알아보세요.
</TransBlock>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Displaying a fallback while content is loading <Trans>콘텐츠를 로딩하는 동안 대체 fallback 표시하기</Trans> {/*displaying-a-fallback-while-content-is-loading*/}

You can wrap any part of your application with a Suspense boundary:
<Trans>애플리케이션의 모든 부분을 서스펜스 경계로 감쌀 수 있습니다:</Trans>

```js [[1, 1, "<Loading />"], [2, 2, "<Albums />"]]
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

React will display your <CodeStep step={1}>loading fallback</CodeStep> until all the code and data needed by <CodeStep step={2}>the children</CodeStep> has been loaded.
<Trans>React는 <CodeStep step={2}>자식</CodeStep>에게 필요한 모든 코드와 데이터가 로드될 때까지 <CodeStep step={1}>로딩 fallback</CodeStep>을 표시합니다.</Trans>

In the example below, the `Albums` component *suspends* while fetching the list of albums. Until it's ready to render, React switches the closest Suspense boundary above to show the fallback--your `Loading` component. Then, when the data loads, React hides the `Loading` fallback and renders the `Albums` component with data.
<Trans>
아래 예시에서는 앨범 목록을 가져오는 동안 `Albums` 컴포넌트가 *일시 중단*됩니다. 렌더링할 준비가 될 때까지 React는 위의 가장 가까운 서스펜스 경계를 전환하여 fallback, 즉 `Loading` 컴포넌트를 표시합니다. 그런 다음 데이터가 로드되면 React는 `Loading` fallback을 숨기고 데이터와 함께 `Albums` 컴포넌트를 렌더링합니다.
</Trans>

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

```js App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Albums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
```

```js Albums.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

</Sandpack>

<Note>
s
**Only Suspense-enabled data sources will activate the Suspense component.** They include:
<Trans>**서스펜스-활성화 데이터 원본만 서스펜스 컴포넌트를 활성화합니다.** 여기에는 다음이 포함됩니다:</Trans>

- Data fetching with Suspense-enabled frameworks like [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) and [Next.js](https://nextjs.org/docs/advanced-features/react-18)
- Lazy-loading component code with [`lazy`](/reference/react/lazy)
<TransBlock>
- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) 및 [Next.js](https://nextjs.org/docs/advanced-features/react-18)와 같은 서스펜스 지원 프레임워크를 사용한 데이터 불러오기
- [`lazy`](/reference/react/lazy) 를 사용한 지연 로딩 컴포넌트 코드
</TransBlock>

Suspense **does not** detect when data is fetched inside an Effect or event handler.
<Trans>서스펜스는 Effect 또는 이벤트 핸들러 내부에서 데이터를 가져올 때를 감지하지 **않습니다.**</Trans>

The exact way you would load data in the `Albums` component above depends on your framework. If you use a Suspense-enabled framework, you'll find the details in its data fetching documentation.
<Trans>위의 `Albums` 컴포넌트에서 데이터를 로드하는 정확한 방법은 프레임워크에 따라 다릅니다. 서스펜스-활성화 프레임워크를 사용하는 경우 해당 프레임워크의 데이터 가져오기 문서에서 자세한 내용을 확인할 수 있습니다.</Trans>

Suspense-enabled data fetching without the use of an opinionated framework is not yet supported. The requirements for implementing a Suspense-enabled data source are unstable and undocumented. An official API for integrating data sources with Suspense will be released in a future version of React. 
<Trans>독단적인 프레임워크를 사용하지 않는 서스펜스-활성화 데이터 가져오기는 아직 지원되지 않습니다. 서스펜스-활성화 데이터 소스를 구현하기 위한 요구 사항은 불안정하고 문서화되지 않았습니다. 데이터 소스를 서스펜스와 통합하기 위한 공식 API는 향후 React 버전에서 출시될 예정입니다.</Trans>

</Note>

---

### Revealing content together at once<Trans>한번에 콘텐츠를 함께 공개하기</Trans> {/*revealing-content-together-at-once*/}

By default, the whole tree inside Suspense is treated as a single unit. For example, even if *only one* of these components suspends waiting for some data, *all* of them together will be replaced by the loading indicator:
<Trans>기본적으로 서스펜스 내부의 전체 트리는 단일 단위로 취급됩니다. 예를 들어, 이러한 컴포넌트 중 *하나만* 데이터 대기를 위해 일시 중단하더라도 *모든* 컴포넌트가 함께 로딩 표시기로 대체됩니다:</Trans>

```js {2-5}
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

Then, after all of them are ready to be displayed, they will all appear together at once.
<Trans>그런 다음 모든 항목이 표시될 준비가 되면 한 번에 모두 함께 표시됩니다.</Trans>

In the example below, both `Biography` and `Albums` fetch some data. However, because they are grouped under a single Suspense boundary, these components always "pop in" together at the same time.
<Trans>아래 예제에서는 `Biography`와 `Albums` 모두 데이터를 가져옵니다. 그러나 이 두 컴포넌트는 단일 서스펜스 경계 아래에 그룹화되어 있기 때문에 항상 동시에 함께 '표시'됩니다.</Trans>

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

```js App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Biography artistId={artist.id} />
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
```

```js Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js Biography.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
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

```js Albums.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
```

</Sandpack>

Components that load data don't have to be direct children of the Suspense boundary. For example, you can move `Biography` and `Albums` into a new `Details` component. This doesn't change the behavior. `Biography` and `Albums` share the same closest parent Suspense boundary, so their reveal is coordinated together.
<Trans>
데이터를 로드하는 컴포넌트가 서스펜스 경계의 직접적인 자식일 필요는 없습니다. 예를 들어 `Biography`와 `Albums`을 새 `Details` 컴포넌트로 이동할 수 있습니다. 이렇게 해도 동작은 변경되지 않습니다. `Biography`와 `Albums`은 가장 가까운 상위 서스펜스 경계를 공유하므로 표시 여부가 함께 조정됩니다.
</Trans>

```js {2,8-11}
<Suspense fallback={<Loading />}>
  <Details artistId={artist.id} />
</Suspense>

function Details({ artistId }) {
  return (
    <>
      <Biography artistId={artistId} />
      <Panel>
        <Albums artistId={artistId} />
      </Panel>
    </>
  );
}
```

---

### Revealing nested content as it loads<Trans>중첩된 콘텐츠가 로드될 때 표시하기</Trans> {/*revealing-nested-content-as-it-loads*/}

When a component suspends, the closest parent Suspense component shows the fallback. This lets you nest multiple Suspense components to create a loading sequence. Each Suspense boundary's fallback will be filled in as the next level of content becomes available. For example, you can give the album list its own fallback:
<Trans>
컴포넌트가 일시 중단되면 가장 가까운 상위 서스펜스 컴포넌트가 fallback을 표시합니다. 이를 통해 여러 서스펜스 컴포넌트를 중첩하여 로딩 시퀀스를 만들 수 있습니다. 각 서스펜스 경계의 fallback은 다음 레벨의 콘텐츠를 사용할 수 있게 되면 채워집니다. 예를 들어 앨범 목록에 자체 fallback을 지정할 수 있습니다:
</Trans>

```js {3,7}
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

With this change, displaying the `Biography` doesn't need to "wait" for the `Albums` to load.
<Trans>이 변경 사항으로 인해 `Biography`를 표시할 때 `Albums`가 로드될 때까지 "기다릴" 필요가 없습니다.</Trans>

The sequence will be:

1. If `Biography` hasn't loaded yet, `BigSpinner` is shown in place of the entire content area.
1. Once `Biography` finishes loading, `BigSpinner` is replaced by the content.
1. If `Albums` hasn't loaded yet, `AlbumsGlimmer` is shown in place of `Albums` and its parent `Panel`.
1. Finally, once `Albums` finishes loading, it replaces `AlbumsGlimmer`.
<TransBlock>
순서는 다음과 같습니다:

1. `Biography`가 아직 로드되지 않은 경우 전체 콘텐츠 영역 대신 `BigSpinner`가 표시됩니다.
1. `Biography`로드가 완료되면 `BigSpinner`가 콘텐츠로 대체됩니다.
1. `Albums`가 아직 로드되지 않은 경우 `Albums`과 그 부모 `Panel` 대신 `AlbumsGlimmer`가 표시됩니다.
1. 마지막으로 `Albums` 로딩이 완료되면 `Albums`가 `AlbumsGlimmer`를 대체합니다.
</TransBlock>

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

```js App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<BigSpinner />}>
        <Biography artistId={artist.id} />
        <Suspense fallback={<AlbumsGlimmer />}>
          <Panel>
            <Albums artistId={artist.id} />
          </Panel>
        </Suspense>
      </Suspense>
    </>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js Biography.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
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

```js Albums.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Suspense boundaries let you coordinate which parts of your UI should always "pop in" together at the same time, and which parts should progressively reveal more content in a sequence of loading states. You can add, move, or delete Suspense boundaries in any place in the tree without affecting the rest of your app's behavior.
<Trans>서스펜스 경계를 사용하면 UI의 어떤 부분이 항상 동시에 "표시"되어야 하는지, 어떤 부분이 로딩 상태의 시퀀스에서 점진적으로 더 많은 콘텐츠를 표시해야 하는지 조정할 수 있습니다. 앱의 나머지 동작에 영향을 주지 않고 트리의 어느 위치에서나 서스펜스 경계를 추가, 이동 또는 삭제할 수 있습니다.</Trans>

Don't put a Suspense boundary around every component. Suspense boundaries should not be more granular than the loading sequence that you want the user to experience. If you work with a designer, ask them where the loading states should be placed--it's likely that they've already included them in their design wireframes.
<Trans>모든 컴포넌트에 서스펜스 경계를 설정하지 마세요. 서스펜스 경계는 사용자가 경험하게 될 로딩 시퀀스보다 더 세분화되어서는 안 됩니다. 디자이너와 함께 작업하는 경우 로딩 상태를 어디에 배치해야 하는지 디자이너에게 물어보세요. 디자이너가 이미 디자인 와이어프레임에 포함시켰을 가능성이 높습니다.</Trans>

---

### Showing stale content while fresh content is loading<Trans>새 콘텐츠가 로드되는 동안 오래된 콘텐츠 표시하기</Trans> {/*showing-stale-content-while-fresh-content-is-loading*/}

In this example, the `SearchResults` component suspends while fetching the search results. Type `"a"`, wait for the results, and then edit it to `"ab"`. The results for `"a"` will get replaced by the loading fallback.
<Trans>아래 예제에서는 검색 결과를 가져오는 동안 `SearchResults` 컴포넌트가 일시 중단됩니다. `"a"`를 입력하고 결과를 기다린 다음 `"ab"`를 다시 입력하면 `"a"`에 대한 결과는 로딩 fallback으로 대체됩니다.</Trans>

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

A common alternative UI pattern is to *defer* updating the list and to keep showing the previous results until the new results are ready. The [`useDeferredValue`](/reference/react/useDeferredValue) Hook lets you pass a deferred version of the query down: 
<Trans>일반적인 대체 UI 패턴은 목록 업데이트를 *연기*하고 새 결과가 준비될 때까지 이전 결과를 계속 표시하는 것입니다. [`useDeferredValue`](/reference/react/useDeferredValue) Hook을 사용하면 쿼리의 지연된 버전을 전달할 수 있습니다:</Trans>

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
<Trans>`query`가 즉시 업데이트되므로 입력에 새 값이 표시됩니다. 그러나 `deferredQuery`는 데이터가 로드될 때까지 이전 값을 유지하므로 `SearchResults`는 잠시 동안 이전 결과를 표시합니다.</Trans>

To make it more obvious to the user, you can add a visual indication when the stale result list is displayed:
<Trans>사용자에게 더 명확하게 알리기 위해 이전 결과 목록이 표시될 때 시각적 표시를 추가할 수 있습니다:</Trans>

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1 
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Enter `"a"` in the example below, wait for the results to load, and then edit the input to `"ab"`. Notice how instead of the Suspense fallback, you now see the dimmed stale result list until the new results have loaded:
<Trans>아래 예제에서 `"a"`를 입력하고 결과가 로드될 때까지 기다린 다음 입력을 `"ab"`로 변경해 보세요. 이제 새 결과가 로드될 때까지 일시 중단 fallback 대신 희미한 이전 결과 목록이 표시되는 것을 확인할 수 있습니다:</Trans>


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
        <div style={{ opacity: isStale ? 0.5 : 1 }}>
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

<Note>

Both deferred values and [transitions](#preventing-already-revealed-content-from-hiding) let you avoid showing Suspense fallback in favor of inline indicators. Transitions mark the whole update as non-urgent so they are typically used by frameworks and router libraries for navigation. Deferred values, on the other hand, are mostly useful in application code where you want to mark a part of UI as non-urgent and let it "lag behind" the rest of the UI.
<Trans>
지연된 값과 [트랜지션](#preventing-already-revealed-content-from-hiding)을 모두 사용하면 인라인 표시기를 위해 서스펜스 fallback을 표시하지 않을 수 있습니다. 트랜지션은 전체 업데이트를 긴급하지 않은 것으로 표시하므로 일반적으로 프레임워크 및 라우터 라이브러리에서 탐색을 위해 사용됩니다. 반면에 지연 값은 UI의 일부를 긴급하지 않은 것으로 표시하고 나머지 UI보다 "지연"시키려는 애플리케이션 코드에서 주로 유용합니다.
</Trans>

</Note>

---

### Preventing already revealed content from hiding<Trans>이미 표시된 콘텐츠가 숨겨지지 않도록 방지하기</Trans> {/*preventing-already-revealed-content-from-hiding*/}

When a component suspends, the closest parent Suspense boundary switches to showing the fallback. This can lead to a jarring user experience if it was already displaying some content. Try pressing this button:
<Trans>컴포넌트가 일시 중단되면 가장 가까운 상위 서스펜스 경계가 fallback을 표시하도록 전환됩니다. 이미 일부 콘텐츠가 표시되고 있는 경우 사용자 경험이 끊길 수 있습니다. 아래 예제의 버튼을 눌러 보세요:</Trans>

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
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    setPage(url);
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js Albums.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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

```js Biography.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
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

```js Panel.js hidden
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

When you pressed the button, the `Router` component rendered `ArtistPage` instead of `IndexPage`. A component inside `ArtistPage` suspended, so the closest Suspense boundary started showing the fallback. The closest Suspense boundary was near the root, so the whole site layout got replaced by `BigSpinner`.
<Trans>버튼을 누르자 `Router` 컴포넌트가 `IndexPage` 대신 `ArtistPage`를 렌더링했습니다. `ArtistPage` 내부의 컴포넌트가 일시 중단되었기 때문에 가장 가까운 서스펜스 경계가 fallback을 표시하기 시작했습니다. 가장 가까운 서스펜스 경계는 루트 근처에 있었기 때문에 전체 사이트 레이아웃이 `BigSpinner`로 대체되었습니다.</Trans>

To prevent this, you can mark the navigation state update as a *transition* with [`startTransition`:](/reference/react/startTransition)
<Trans>이를 방지하려면 [`startTransition`](/reference/react/startTransition)을 사용하여 탐색 state 업데이트를 트랜지션으로 표시할 수 있습니다:</Trans>

```js {5,7}
function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);      
    });
  }
  // ...
```

This tells React that the state transition is not urgent, and it's better to keep showing the previous page instead of hiding any already revealed content. Now clicking the button "waits" for the `Biography` to load:
<Trans>이 방법은 state 전환이 긴급하지 않으며 이미 표시된 콘텐츠를 숨기는 대신 이전 페이지를 계속 표시하는 것이 낫다는 것을 React에 알려줍니다. 이제 버튼을 클릭하면 `Biography`가 로드될 때까지 "대기" 상태가 됩니다:</Trans>

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
import { Suspense, startTransition, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js Albums.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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

```js Biography.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
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

```js Panel.js hidden
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

A transition doesn't wait for *all* content to load. It only waits long enough to avoid hiding already revealed content. For example, the website `Layout` was already revealed, so it would be bad to hide it behind a loading spinner. However, the nested `Suspense` boundary around `Albums` is new, so the transition doesn't wait for it.
<Trans>트랜지션은 *모든* 콘텐츠가 로드될 때까지 기다리지 않습니다. 이미 표시된 콘텐츠가 숨겨지지 않도록 충분히 오래 기다립니다. 예를 들어 웹사이트 `Layout`이 이미 표시되었으므로 로딩 스피너 뒤에 숨기는 것은 좋지 않습니다. 그러나 `Albums` 주위의 중첩된 `Suspense` 경계는 새로운 것이므로 트랜지션이 기다리지 않습니다.</Trans>

<Note>

Suspense-enabled routers are expected to wrap the navigation updates into transitions by default.
<Trans>서스펜스 지원 라우터는 기본적으로 탐색 업데이트를 트랜지션으로 래핑할 것으로 예상됩니다.</Trans>

</Note>

---

### Indicating that a transition is happening<Trans>트랜지션이 발생하고 있음을 나타내기</Trans> {/*indicating-that-a-transition-is-happening*/}

In the above example, once you click the button, there is no visual indication that a navigation is in progress. To add an indicator, you can replace [`startTransition`](/reference/react/startTransition) with [`useTransition`](/reference/react/useTransition) which gives you a boolean `isPending` value. In the example below, it's used to change the website header styling while a transition is happening:
<Trans>위의 예제에서는 버튼을 클릭해도 탐색이 진행 중이라는 시각적 표시가 없습니다. 표시기를 추가하려면 [`startTransition`](/reference/react/startTransition)을 `isPending` 이라는 부울 값을 제공하는 [`useTransition`](/reference/react/useTransition)으로 대체하면 됩니다. 아래 예제에서는 트랜지션이 진행되는 동안 웹사이트 헤더 스타일을 변경하는 데 사용됩니다:</Trans>

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
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js Albums.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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

```js Biography.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
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

```js Panel.js hidden
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

---

### Resetting Suspense boundaries on navigation<Trans>탐색시 서스펜스 경계 재설정하기</Trans> {/*resetting-suspense-boundaries-on-navigation*/}

During a transition, React will avoid hiding already revealed content. However, if you navigate to a route with different parameters, you might want to tell React it is *different* content. You can express this with a `key`:
<Trans>트랜지션 동안 React는 이미 표시된 콘텐츠를 숨기지 않습니다. 하지만 다른 매개변수가 있는 경로로 이동하는 경우 React에게 *다른* 콘텐츠라고 알려줄 필요가 있습니다. `Key`를 사용하여 표현할 수 있습니다:</Trans>

```js
<ProfilePage key={queryParams.id} />
```

Imagine you're navigating within a user's profile page, and something suspends. If that update is wrapped in a transition, it will not trigger the fallback for already visible content. That's the expected behavior.
<Trans>사용자의 프로필 페이지 내에서 탐색 중인데 무언가가 일시 중단되었다고 가정해 보겠습니다. 해당 업데이트가 트랜지션으로 래핑되어 있으면 이미 표시된 콘텐츠에 대한 fallback이 트리거되지 않습니다. 이것이 예상되는 동작입니다.</Trans>

However, now imagine you're navigating between two different user profiles. In that case, it makes sense to show the fallback. For example, one user's timeline is *different content* from another user's timeline. By specifying a `key`, you ensure that React treats different users' profiles as different components, and resets the Suspense boundaries during navigation. Suspense-integrated routers should do this automatically.
<Trans>하지만 이제 두 개의 서로 다른 사용자 프로필 사이를 탐색하고 있다고 가정해 보겠습니다. 이 경우 fallback을 표시하는 것이 좋습니다. 예를 들어 한 사용자의 타임라인은 다른 사용자의 타임라인과 *다른 콘텐츠*입니다. `Key`를 지정하면 React가 서로 다른 사용자의 프로필을 서로 다른 컴포넌트로 취급하고 탐색 중에 서스펜스 경계를 재설정하도록 할 수 있습니다. 서스펜스 통합 라우터는 이 작업을 자동으로 수행해야 합니다.</Trans>

---

### Providing a fallback for server errors and server-only content<Trans>서버 오류 및 서버 전용 콘텐츠에 대한 fallback 제공하기</Trans> {/*providing-a-fallback-for-server-errors-and-server-only-content*/}

If you use one of the [streaming server rendering APIs](/reference/react-dom/server) (or a framework that relies on them), React will also use your `<Suspense>` boundaries to handle errors on the server. If a component throws an error on the server, React will not abort the server render. Instead, it will find the closest `<Suspense>` component above it and include its fallback (such as a spinner) into the generated server HTML. The user will see a spinner at first.
<Trans>[스트리밍 서버 렌더링 API 중 하나](/reference/react-dom/server) (또는 이에 의존하는 프레임워크)를 사용하는 경우, React는 서버에서 발생하는 오류를 처리하기 위해 `<Suspense> `바운더리도 사용합니다. 컴포넌트가 서버에서 에러를 발생시키더라도 React는 서버 렌더링을 중단하지 않습니다. 대신, 그 위에 있는 가장 가까운 `<Suspense>` 컴포넌트를 찾아서 생성된 서버 HTML에 그 fallback(예: 스피너)을 포함시킵니다. 사용자는 처음에 스피너를 보게 됩니다.</Trans>

On the client, React will attempt to render the same component again. If it errors on the client too, React will throw the error and display the closest [error boundary.](/reference/react/Component#static-getderivedstatefromerror) However, if it does not error on the client, React will not display the error to the user since the content was eventually displayed successfully.
<Trans>클라이언트에서 React가 동일한 컴포넌트를 다시 렌더링하려고 시도합니다. 클라이언트에서도 에러가 발생하면 React는 에러를 던지고 가장 가까운 [에러 경계](/reference/react/Component#static-getderivedstatefromerror)를 표시합니다. 그러나 클라이언트에서 에러가 발생하지 않는다면, 결국 콘텐츠가 성공적으로 표시되었기 때문에 React는 사용자에게 에러를 표시하지 않습니다.</Trans>

You can use this to opt out some components from rendering on the server. To do this, throw an error in the server environment and then wrap them in a `<Suspense>` boundary to replace their HTML with fallbacks:
<Trans>이를 사용하여 일부 컴포넌트를 서버에서 렌더링하지 않도록 선택할 수 있습니다. 이렇게 하려면 서버 환경에서 오류를 발생시킨 다음 해당 컴포넌트를 `<Suspense>` 경계로 감싸서 해당 HTML을 fallback으로 대체하면 됩니다:</Trans>

```js
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>

function Chat() {
  if (typeof window === 'undefined') {
    throw Error('Chat should only render on the client.');
  }
  // ...
}
```

The server HTML will include the loading indicator. It will be replaced by the `Chat` component on the client.
<Trans>서버 HTML에 로딩 표시기가 포함됩니다. 이 표시기는 클라이언트의 `Chat` 컴포넌트로 대체됩니다.</Trans>

---

## Troubleshooting<Trans>문제 해결</Trans> {/*troubleshooting*/}

### How do I prevent the UI from being replaced by a fallback during an update?<Trans>업데이트 중에 UI가 fallback으로 대체되는 것을 방지하려면 어떻게 해야 할까요?</Trans> {/*preventing-unwanted-fallbacks*/}

Replacing visible UI with a fallback creates a jarring user experience. This can happen when an update causes a component to suspend, and the nearest Suspense boundary is already showing content to the user.
<Trans>표시되는 UI를 fallback으로 대체하면 사용자 환경이 불안정해집니다. 이는 업데이트로 인해 컴포넌트가 일시 중단되고 가장 가까운 서스펜스 경계에 이미 사용자에게 콘텐츠가 표시되고 있을 때 발생할 수 있습니다.</Trans>

To prevent this from happening, [mark the update as non-urgent using `startTransition`](#preventing-already-revealed-content-from-hiding). During a transition, React will wait until enough data has loaded to prevent an unwanted fallback from appearing:
<Trans>이런 일이 발생하지 않도록 하려면 [`startTransition`을 사용하여 업데이트를 긴급하지 않은 것으로 표시](#preventing-already-revealed-content-from-hiding)하세요. 트랜지션이 진행되는 동안 React는 원치 않는 fallback이 나타나지 않도록 충분한 데이터가 로드될 때까지 기다립니다:</Trans>

```js {2-3,5}
function handleNextPageClick() {
  // If this update suspends, don't hide the already displayed content
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```

This will avoid hiding existing content. However, any newly rendered `Suspense` boundaries will still immediately display fallbacks to avoid blocking the UI and let the user see the content as it becomes available.
<Trans>이렇게 하면 기존 콘텐츠가 숨겨지지 않습니다. 그러나 새로 렌더링된 `Suspense` 경계는 여전히 즉시 fallback을 표시하여 UI를 가리지 않고 사용자가 콘텐츠를 사용할 수 있게 되는 즉시 볼 수 있도록 합니다.</Trans>

**React will only prevent unwanted fallbacks during non-urgent updates**. It will not delay a render if it's the result of an urgent update. You must opt in with an API like [`startTransition`](/reference/react/startTransition) or [`useDeferredValue`](/reference/react/useDeferredValue).
<Trans>**React는 긴급하지 않은 업데이트 중에만 원치 않는 fallback을 방지합니다.** 긴급한 업데이트의 결과인 경우 렌더링을 지연시키지 않습니다. [`startTransition`](/reference/react/startTransition) 또는 [`useDeferredValue`](/reference/react/useDeferredValue)와 같은 API를 사용해야 합니다.</Trans>

If your router is integrated with Suspense, it should wrap its updates into [`startTransition`](/reference/react/startTransition) automatically.
<Trans>라우터가 서스펜스와 통합되어 있는 경우, 라우터는 업데이트를 [`startTransition`](/reference/react/startTransition)으로 자동으로 래핑해야 합니다.</Trans>
