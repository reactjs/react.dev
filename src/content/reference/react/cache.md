---
title: cache
canary: true
---

<Canary>
`cache` is currently only available in React’s [canary](https://react.dev/community/versioning-policy#canary-channel) and [experimental](https://react.dev/community/versioning-policy#experimental-channel) channels. Please ensure you understand the limitations before using `cache` in production. 

Learn more about [React's release channels here](/community/versioning-policy#all-release-channels). 
</Canary>

<Intro>

`cache` lets you cache the result of a data fetch or computation.

```js
const cachingFn = cache(fn);
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `cache(fn)` {/*cache*/}

Wrap a function with `cache` to receive a caching version of that function.
```jsx
import { cache } from 'react';
import fetchUser from 'lib/user';

const getUser = cache(fetchUser);

function UserProfile(id) {
  const user = getUser(id);
  //...
}
```
`getUser` will first see if there is a cached result for `id`, otherwise call `fetchUser(id)` and cache the returned result.

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `fn`: The function you want to cache results for. `fn` can take any arguments and return any value.

#### Returns {/*returns*/}

`cache` returns a caching version of `fn` with the same type signature.

When calling `cachingFn` with given arguments, it first checks if a cached result exists in the cache. If a cached result exists, it returns the result. If not, it calls `fn` with the arguments, stores the result in the cache, and returns the result.

<Note>

Caching return values based on inputs is also known as [*memoization*](https://en.wikipedia.org/wiki/Memoization). We refer to `cachingFn` as a memoizing function.

</Note>

#### Caveats {/*caveats*/}

[//]: # (TODO: add links to Server/Client Component reference once https://github.com/reactjs/react.dev/pull/6177 is merged)
* `cache` is recommended for React Server Component environments only. There are plans to introduce `cache` for Client Components but it is not recommended today.
* React will invalidate the cache for a memoizing function across server requests.
* The benefit of `cache` is to skip duplicate work across components. To leverage this benefit, `cachingFn`, should be defined in a scope that is accessible to components. In most cases, this means calling `cache` and defining the memoizing function in the global scope.
* Each call to `cache` creates a new memoizing version of `fn`. This means that wrapping `cache` around the same function multiple times will return different memoizing functions and they will not share the same cache.
* Cache access only occurs during a component render. This means a call to `cachingFn` outside of a Server Component will not update or use the cache.
* `cachingFn` will also cache errors. If `fn` throws an error for certain arguments, it will be cached, and rethrown when `cachingFn` is called with those arguments. 

---

## Usage {/*usage*/}

### Share a snapshot of data {/*take-and-share-snapshot-of-data*/}

To share a snapshot of data between multiple components, wrap `cache` around a data-fetching function like `fetch`. When multiple components make the same data fetch, only one request is made and the data returned is cached and shared across components. In a sense, all components refer to the same snapshot of data across each render. 

```jsx
import {cache} from 'react';

const getTemperature = cache(async (city) => {
	return await fetch(`https://...`);
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

If `AnimatedWeatherCard` and `MinimalWeatherCard` both render for the same city, they can share the same snapshot of data returned.

<Pitfall>

To leverage the cache, components should use the same memoizing function instance.

```js
// temperature.js
export async function fetchTemperature(city) {
  return await fetch(`https://...`);
}

// minimalWeatherCard.js
import {cache} from 'react';
import {fetchTemperature} from './temperature';

const getTemperature = cache(fetchTemperature);

export default async function MinimalWeatherCard({city}) {
	const temperature = await getTemperature(city);
  // ...
}

// animatedWeatherCard.js
import {cache} from 'react';
import {fetchTemperature} from './temperature';

export default async function AnimatedWeatherCard({city}) {
	const getTemperature = cache(fetchTemperature);
	const temperature = await getTemperature(city);
  // ...
}

// app.js
import AnimatedWeatherCard from './animatedWeatherCard';
import AnimatedWeatherCard from './animatedWeatherCard';

function App() {
	return (<>
      <AnimatedWeatherCard city="Los Angeles" />
      <MinimalWeatherCard city="Los Angeles" />
	</>);
}
```

In this example, `MinimalWeatherCard` and `AnimatedWeatherCard` are not leveraging the same cache and so `fetchTemperature` is double invoked with the same argument `"Los Angeles"`.

This is because each call to `cache` creates a new memoizing function that uses a different cache for look-up. For `AnimatedWeatherCard` and `MinimalWeatherCard` to use the same cache, `getTemperature` should be defined in a mutually accessible scope, like moving the definition to `temperature.js`.

In addition, `AnimatedWeatherCard` is calling `cache` in its component render. This means that each time `AnimatedWeatherCard` is rendered, a new memoizing function is created so there will never be an opportunity for cache-sharing.

</Pitfall>

### Preload data {/*preload-data*/}

By wrapping a long-running data fetch in `cache`, you can kick off the asynchronous work prior to rendering the component.

```jsx
const getUser = cache(async (id) => {
  return await db.user.query(id);
}

async function Profile({id}) {
  const user = await getUser(id);
  // ...
}

function Page({id}) {
  getUser(id);
  // ... some computational work
  return (
    <>
	    ...
      <Profile id={id} />
    </>
  );
}
```

When rendering `Page`, the component calls `getUser` but note that it doesn't use the returned data. This early `getUser` call kicks off the asynchronous database query that occurs while `Page` is doing other computational work and rendering children. 

When rendering `Profile`, we call `getUser` again. In the ideal case, the initial `getUser` call has already returned and cached the user data. So when `Profile` asks and waits for this data, it can simply read from the cache without requiring another remote procedure call. Even if the data request hasn't been completed, preloading data in this pattern reduces delay in data-fetching..

<Pitfall>

Cache is only saved during component renders.

```jsx
import {cache} from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);    
});

// This call to `getUser` will not update the cache.
getUser('demo-id');

async function DemoProfile() {
  // This `getUser` will have a cache miss
  const user = await getUser('demo-id');
  return (<Profile user={user} />);
}
```

You may attempt to preload some work outside of a component. React only provides cache access to the memoizing function in a component render. 
</Pitfall>

<DeepDive>

#### What's the difference between `cache`, [`memo`](/reference/react/memo), and [`useMemo`](/reference/react/useMemo)? {/*cache-memo-usememo*/}
All mentioned APIs offer memoization but the difference is what they're intended to memoize, who can access the cache, and when their cache is invalidated.

[`useMemo`](/reference/react/useMemo) is a hook that is used in a client component or another hook. `useMemo` takes a function and a list of dependencies. During the component render, `useMemo` will only call the function when the dependencies have changed and will cache the result. 

You can think of `useMemo`'s cache as a size of one, where it can only cache the last work it did based on the last value of its dependencies. Only the component instance can benefit from this cache to skip work across re-renders. If you rendered two instances of the same component, the `useMemo` of one wouldn't help the other to skip work. The cache is invalidated each time the dependencies change or the component is unmounted.

```jsx
'use client';

function Weather(city) {
    // assume `getTemp` is an expensive computation
	const temp = useMemo(() => getTemp(city)), city); 
	return (<p>Temperature is {temp} in {city}<p>);
} 

function App() {
	return (
    <>
      <Weather city="Los Angeles" /> 
      <Weather city="Los Angeles" /> 
    </>
  );
}
```
In this example, both instances of the `Weather` component are doing the same work in calling `getTemp("Los Angeles")`. Unfortunately, the second `Weather` component instance can't use the result from the first component. `useMemo` is only a local cache to the component instance. However `useMemo` does ensure that if `App` re-renders, each component instance would not call `getTemp("Los Angeles")` again because the city hasn't changed.

`cache` is a utility that creates a memoizing version of a function. The memoizing function, `cachingFn`, is like `useMemo` in that it skips duplicate work. Unlike `useMemo`, it will cache results for multiple inputs and can be shared across component instances to leverage the same cache. At this time, `cache` should only be used in server components and the cache will be invalidated across server requests. 

```jsx
// assume `getTemp` is an expensive computation
const cachedGetTemp = cache(getTemp);

function Weather(city) {
	const temp = await cachedGetTemp(city); 
	return <p>Temperature is {temp} in {city}<p>
} 

function App() {
	return (
      <>
        <Weather city="Los Angeles" /> 
        <Weather city="Los Angeles" /> 
      </>
    );
}
```
Re-writing the previous example to use `cache`, in this case the second instance of `Weather` will be able to skip duplicate work and read from the cache for the temperature. 

[`memo`](eference/react/memo) is similar to `cache` in that is also a utility function for memoization but instead of memoizing functions, it memoizes components. When you wrap a component with `memo`, you create a new version of that component that only re-renders when the passed props of the component have changed. Similar to `useMemo`, the memoized component only caches the last render with certain props so you can also think of the cache size as one. Once the props change, the cache invalidates and the component re-renders. 

</DeepDive>

<DeepDive>

#### When should I not use cache? {/*not-use-cache*/}
`cache` is not recommended for use in client components today.

The motivation for `cache` is to provide a complete data fetching and invalidation strategy between client and server. However, only server usage is ready for use today.

In a React Server Component environment, `cache` is most useful for providing data snapshots or memoizing expensive computations across the render tree. 

[Deterministic](https://en.wikipedia.org/wiki/Deterministic_algorithm) functions are good candidates for `cache`. However, if there are side-effects that you want to run for each invocation, then it is not a good option for `cache`.

Although data-fetching is often not deterministic, as there may be mutations between fetches, the assumption is that fetched data should be consistent across a render. This makes data-fetching logic well-suited to `cache`. As the cache is invalidated across server requests, your app will still fetch fresh data in the next request. However, this may not fit for your app's data-fetching use-case and `cache` may not useful.

</DeepDive>

---

## Troubleshooting {/*troubleshooting*/}

### My memoizing function still runs even though I've called it with the same arguments {/*memoizing-function-stil-runs*/}

When calling a memoizing function, React will look up the input arguments to see if a result is already cached. React will use shallow equality of the arguments to determine if there is a cache hit.

This means that if your arguments are not [primatives](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) (ex. objects, functions, arrays), ensure you're passing the same object reference.

```jsx
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  const length = calculateNorm(props);
  // ...
}

function App() {
  return (<>
    <MapMarker x={10} y={10} z={10} />
    <MapMarker x={10} y={10} z={10} />
  </>)
}
```
In this case the two `MapMarker`s look like they're doing the same work and calling `calculateNorm` with the same value of `{x: 10, y: 10, z:10}`. Even though the objects contain the same values, they are not the same object reference as each component creates its own `props` object. 

React will call [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) on the input to verify if there is a cache hit.
