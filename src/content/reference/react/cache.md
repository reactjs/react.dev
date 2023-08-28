---
title: cache
canary: true
---

<Canary>
`cache` is currently only available in React’s [Canary](https://react.dev/community/versioning-policy#canary-channel) and [experimental](https://react.dev/community/versioning-policy#experimental-channel) channels. Please ensure you understand the limitations before using `cache` in production.

Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`cache` lets you cache the result of a data fetch or computation.

```js
const cachedFn = cache(fn);
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `cache(fn)` {/*cache*/}

Wrap a function with `cache` to receive a version of that function with caching.

```js {4,7}
import {cache} from 'react';
import fetchUser from 'lib/user';

const getUser = cache(fetchUser);

function UserProfile(id) {
  const user = getUser(id);
  //...
}
```

`getUser` will first check if there is a cached result for `id`, otherwise call `fetchUser(id)` and cache the returned result.

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

- `fn`: The function you want to cache results for. `fn` can take any arguments and return any value.

#### Returns {/*returns*/}

`cache` returns a cached version of `fn` with the same type signature.

When calling `cachedFn` with given arguments, it first checks if a cached result exists in the cache. If a cached result exists, it returns the result. If not, it calls `fn` with the arguments, stores the result in the cache, and returns the result.

<Note>

The optimization of caching return values based on inputs is known as [_memoization_](https://en.wikipedia.org/wiki/Memoization). We refer to `cachedFn` as a memoized function.

</Note>

#### Caveats {/*caveats*/}

[//]: # 'TODO: add links to Server/Client Component reference once https://github.com/reactjs/react.dev/pull/6177 is merged'

- `cache` is recommended for Server Components only. There are plans to introduce `cache` for Client Components, but it is not recommended today.
- React will invalidate the cache for a memoized function across server requests.
- Each call to `cache` creates a new function. This means that wrapping `cache` around the same function multiple times will return different memoized functions and they will not share the same cache.
- The benefit of `cache` is to skip duplicate work by sharing a cache. To promote cache sharing, `cachedFn`, should be defined in a scope that is accessible to multiple components. In most cases, this means calling `cache` and defining the memoized function in the global scope.
- Cache access only occurs during a component render. This means a call to `cachedFn` outside of a Server Component will not update or read the cache.
- `cachedFn` will also cache errors. If `fn` throws an error for certain arguments, it will be cached, and re-thrown when `cachedFn` is called with those arguments.

---

## Usage {/*usage*/}

### Share a snapshot of data {/*take-and-share-snapshot-of-data*/}

To share a snapshot of data between components, wrap `cache` around a data-fetching function like `fetch`. When multiple components make the same data fetch, only one request is made and the data returned is cached and shared across components. All components refer to the same snapshot of data across the server render. 

```js [[1, 4, "city"], [1, 5, "fetchTemperature(city)"], [2, 4, "getTemperature"], [2, 9, "getTemperature"], [1, 9, "city"], [2, 14, "getTemperature"], [1, 14, "city"]]
import {cache} from 'react';
import {fetchTemperature} from './api.js';

const getTemperature = cache(async (city) => {
	return await fetchTemperature(city);
});

async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}

async function MinimalWeatherCard({city) {
	const temperature = await getTemperature(city);
	// ...
}
```

If `AnimatedWeatherCard` and `MinimalWeatherCard` both render for the same <CodeStep step={1}>city</CodeStep>, they will receive the same snapshot of data from the <CodeStep step={2}>memoized function</CodeStep>. The <CodeStep step={1}>city</CodeStep> acts as a cache key.

<Note>

[//]: # 'TODO: add links to Server Components when merged.'

<CodeStep step={3}>Asynchronous rendering</CodeStep> is only supported for Server Components.

```js [[3, 1, "async"], [3, 2, "await"]]
async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```
[//]: # 'TODO: add link and mention to use documentation when merged'
[//]: # 'To render components that use asynchronous data in Client Components, see `use` documentation.'

</Note>


<Pitfall>
Avoid calling cache in render.

```js {6}
import {cache} from 'react';
import {fetchTemperature} from './api/temperature';

export default async function WeatherCard({city}) {
  // 🚩 Wrong: cache should not be called in render.
  const getTemperature = cache(fetchTemperature);
  const temperature = await getTemperature(city);
  // ...
}
```
Each time `WeatherCard` is rendered, a new memoized function is created that will have it's own cache look-up. This means, across renders, `getTemperature` is referring to a new memoized function and there will be no cache-sharing, losing the benefit of memoiziation.

```js {5}
import {cache} from 'react';
import {fetchTemperature} from './api/temperature';

// ✅ Good: Define memoized function outside of component render
const getTemperature = cache(fetchTemperature);

export default async function WeatherCard({city}) {
  const temperature = await getTemperature(city);
  // ...
}
```

By defining the memoized function outside of a component render, we ensure each render of `WeatherCard` calls the same memoized function to leverage cache sharing. 

</Pitfall>
<Pitfall>

Components should call the same memoized function.

```js [[1, 6, "cache(fetchTemperature)"], [1, 18, "cache(fetchTemperature)"]]
// MinimalWeatherCard.js
import {cache} from 'react';
import {fetchTemperature} from '.api/temperature';

// 🚩 Wrong: Creating a local memoized function.
const getTemperature = cache(fetchTemperature);

export default async function MinimalWeatherCard({city}) {
	const temperature = await getTemperature(city);
  // ...
}

// AnimatedWeatherCard.js
import {cache} from 'react';
import {fetchTemperature} from '.api/temperature';

// 🚩 Wrong: Creating a local memoized function.
const getTemperature = cache(fetchTemperature);

export default async function AnimatedWeatherCard({city}) {
  const temperature = await getTemperature(city);
  // ...
}
```

If you want to optimize cache hits across components, you'll need to define the memoized function in a scope that is accessible across multiple components.

In the above example, each component <CodeStep step={1}>creates a new memoized version of `fetchTemperature`</CodeStep> that is only defined locally. This narrows the access to the memoized function to only the component in the module. 

If both `AnimatedWeatherCard` and `MinimalWeatherCard` render for the same city, they will call different memoized functions that have separate cache look-ups. This is a missed opportunity for sharing work.

Instead, define your memoized function in a scope that can be shared across components.

```js [[2, 3, "export default cache(fetchTemperature)"], [2, 8, "getTemperature", 0], [2, 18, "getTemperature", 0]]
// getTemperature.js
import {fetchTemperature} from './api/temperature';
export default cache(fetchTemperature);

// MinimalWeatherCard.js
import {cache} from 'react';
// ✅ Good: Import the memoized function
import getTemperature from './getTemperature';

export default async function MinimalWeatherCard({city}) {
  const temperature = await getTemperature(city);
  // ...
}

// AnimatedWeatherCard.js
import {cache} from 'react';
// ✅ Good: Import the memoized function
import getTemperature from './getTemperature';

export default async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
  // ...
}
```
Now `MinimalWeatherCard` and `AnimatedWeatherCard` call the <CodeStep step={2}>same memoized function</CodeStep> and will share the cache. If both render for the same city, only one call to `fetchTemperature` will be made. 

</Pitfall>

### Preload data {/*preload-data*/}

By wrapping a long-running data fetch in `cache`, you can kick off the asynchronous work prior to rendering the component.

```jsx [[2, 6, "await getUser(id)"], [1, 17, "getUser(id)"]]
const getUser = cache(async (id) => {
  return await db.user.query(id);
}

async function Profile({ id }) {
  const user = await getUser(id);
  return (
    <section>
      <img src={user.profilePic} />
      <h2>{user.name}</h2>
    </section>
  );
}

function Page({id}) {
  // ✅ Good: start fetching the user data
  getUser(id);
  // ... some computational work
  return (
    <>
      <Profile id={id} />
    </>
  );
}
```

When rendering `Page`, the component calls <CodeStep step={1}>`getUser`</CodeStep> but note that it doesn't use the returned data. This early <CodeStep step={1}>`getUser`</CodeStep> call kicks off the asynchronous database query that occurs while `Page` is doing other computational work and rendering children.

When rendering `Profile`, we call <CodeStep step={2}>`getUser`</CodeStep> again. In the ideal case, the initial <CodeStep step={1}>`getUser`</CodeStep> call has already returned and cached the user data. So when `Profile` <CodeStep step={2}>asks and waits for this data</CodeStep>, it can simply read from the cache without requiring another remote procedure call. Even if the data request hasn't been completed, preloading data in this pattern reduces delay in data-fetching..

<Pitfall>

Memoization only occurs in component renders.

```jsx
import {cache} from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);
});

// 🚩 Wrong: Calling memoized function outside of render will not memoize.
getUser('demo-id');

async function DemoProfile() {
  // ✅ Good: `getUser` will memoize.
  const user = await getUser('demo-id');
  return <Profile user={user} />;
}
```

Calling a memoized function outside of a component render will not update the cache. React only provides cache access to the memoized function in a component render. Cache access is provided through a Context which is only accessibile from a component render. 

</Pitfall>

<DeepDive>

#### What's the difference between `cache`, [`memo`](/reference/react/memo), and [`useMemo`](/reference/react/useMemo)? {/*cache-memo-usememo*/}

All mentioned APIs offer memoization but the difference is what they're intended to memoize, who can access the cache, and when their cache is invalidated.

[`useMemo`](/reference/react/useMemo) is a hook that is used in a Client Component or another hook. `useMemo` takes a function and a list of dependencies. During the component render, `useMemo` will only call the function when the dependencies have changed and will cache the result.

You can think of `useMemo`'s cache as a size of one, where it can only cache the last work it did based on the last value of its dependencies. Only the component instance can benefit from this cache to skip work across re-renders. If you rendered two instances of the same component, the `useMemo` of one wouldn't help the other to skip work. The cache is invalidated each time the dependencies change or the component is unmounted.

```jsx {4}
'use client';

function WeatherReport({record}) {
	const avgTemp = useMemo(() => calculateAvg(record)), record);
  // ...
}

function App() {
  const record = getRecord();
  return (
    <>
      <WeatherReport record={record} />
      <WeatherReport record={record} />
    </>
  );
}
```

In this example, `App` renders two `WeatherReport`s with the same record. Even though both components do the same work, they cannot share work. `useMemo` is only a local cache to the component instance. However `useMemo` does ensure that if `App` re-renders and the `record` object doesn't change, each component instance would skip work and use the memoized value of `avgTemp`.

`cache` is a utility that creates a memoized version of a function. The memoized function, `cachedFn`, is like `useMemo` in that it skips duplicate work. Unlike `useMemo`, it will cache results for multiple inputs and can be shared across component instances to leverage the same cache. At this time, `cache` should only be used in Server Components and the cache will be invalidated across server requests.

```js {1,4}
const cachedCalculateAvg = cache(calculateAvg);

function WeatherReport({record}) {
  const avgTmp = cachedCalculateAvg(record);
  // ...
}

function App() {
  const record = getRecord();
  return (
    <>
      <WeatherReport record={record} />
      <WeatherReport record={record} />
    </>
  );
}
```

Re-writing the previous example to use `cache`, in this case the second instance of `WeatherReport` will be able to skip duplicate work and read from the cache.

[`memo`](reference/react/memo) is similar to `cache` in that is also a utility function for memoization but instead of memoizing functions, it memoizes components. When you wrap a component with `memo`, you create a new version of that component that only re-renders when the passed props of the component have changed. Similar to `useMemo`, the memoized component only caches the last render with certain props so you can also think of the cache size as one. Once the props change, the cache invalidates and the component re-renders.

</DeepDive>

<DeepDive>

#### When should I not use cache? {/*not-use-cache*/}

`cache` is not recommended for use in Client Components today.

The motivation for `cache` is to provide a complete data fetching and invalidation strategy between client and server. However, only server usage is ready for use today.

In a React Server Component environment, `cache` is most useful for providing data snapshots or memoizing expensive computations across the render tree.

[Deterministic](https://en.wikipedia.org/wiki/Deterministic_algorithm) functions are good candidates for `cache`. However, if there are side-effects that you want to run for each invocation, then it is not a good option for `cache`.

Although data-fetching is often not deterministic, as there may be mutations between fetches, the assumption is that fetched data should be consistent across a render. This makes data-fetching logic well-suited to `cache`. As the cache is invalidated across server requests, your app will still fetch fresh data in the next request. However, this may not fit for your app's data-fetching use-case and `cache` may not useful.

</DeepDive>

---

## Troubleshooting {/*troubleshooting*/}

### My memoized function still runs even though I've called it with the same arguments {/*memoized-function-still-runs*/}

When calling a memoized function, React will look up the input arguments to see if a result is already cached. React will use shallow equality of the arguments to determine if there is a cache hit.

This means that if your arguments are not [primatives](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) (ex. objects, functions, arrays), ensure you're passing the same object reference.

```js
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // 🚩 Wrong: props is an object that changes every render.
  const length = calculateNorm(props);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

In this case the two `MapMarker`s look like they're doing the same work and calling `calculateNorm` with the same value of `{x: 10, y: 10, z:10}`. Even though the objects contain the same values, they are not the same object reference as each component creates its own `props` object.

React will call [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) on the input to verify if there is a cache hit.

```js {3,9}
import {cache} from 'react';

const calculateNorm = cache((x, y, z) => {
  // ...
});

function MapMarker(props) {
  // ✅ Good: Pass primitives to memoized function
  const length = calculateNorm(props.x, props.y, props.z);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

One way to address this could be to pass the vector dimensions to `calculateNorm`. This works because the dimensions themselves are primitives.

Another solution may be to pass the vector object itself as a prop to the component. We'll need to pass the same object to both component instances.

```js {3,9,14}
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // ✅ Good: Pass the same `vector` object
  const length = calculateNorm(props.vector);
  // ...
}

function App() {
  const vector = [10, 10, 10];
  return (
    <>
      <MapMarker vector={vector} />
      <MapMarker vector={vector} />
    </>
  );
}
```

