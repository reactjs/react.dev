---
title: How Suspense Works
---

<Intro>

Some components can't finish rendering right away because they need to wait for something, like data from the network. *Suspense* lets you decide what the user sees while they wait. You wrap part of your tree in a `<Suspense>` boundary and give it a fallback, and React shows that fallback until everything inside is ready.

</Intro>

<YouWillLearn>

* What it means for a component to *suspend*
* How React finds the closest Suspense boundary and shows its fallback
* How to reveal content all at once or in stages
* Why the data a component waits for must be cached outside of it
* How Transitions keep already-visible content on the screen

</YouWillLearn>

## Waiting for data while rendering {/*waiting-for-data-while-rendering*/}

Imagine a page that shows a list of albums for a band. Without Suspense, you might load the albums in an Effect and keep track of whether they're loading in state:

```js
function Albums({ artistId }) {
  const [albums, setAlbums] = useState(null);

  useEffect(() => {
    // ...fetch the albums, then call setAlbums...
  }, [artistId]);

  if (albums === null) {
    return <p>Loading...</p>;
  }
  // ...
}
```

This works, but every component that loads something has to manage its own loading state and draw its own spinner. If a page has a biography *and* a list of albums, each one pops in on its own schedule, and the parent component has no way to say "show these two together" or "show one loading message for the whole page."

Suspense moves that decision out of the component that loads the data. Instead of tracking a loading flag, `Albums` reads the data with [`use`](/reference/react/use), and a parent decides what to show while it waits by wrapping it in `<Suspense>`:

<Sandpack>

```js src/App.js active
import { Suspense, useState } from 'react';
import Albums from './Albums.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Hide' : 'Show'} albums
      </button>
      {show && (
        <Suspense fallback={<p>🌀 Loading...</p>}>
          <Albums artistId="the-beatles" />
        </Suspense>
      )}
    </>
  );
}
```

```js src/Albums.js
import { use } from 'react';
import { fetchData } from './data.js';

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
```

```js src/data.js hidden
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
  const [, artistId, kind] = url.split('/');
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, kind === 'bio' ? 500 : 1500);
  });
  return artists[artistId][kind];
}

const artists = {
  'the-beatles': {
    bio: `The Beatles were an English rock band, formed in
      Liverpool in 1960, that comprised John Lennon,
      Paul McCartney, George Harrison and Ringo Starr.`,
    albums: [
      { id: 4, title: 'Abbey Road', year: 1969 },
      { id: 3, title: 'Sgt. Pepper\'s Lonely Hearts Club Band', year: 1967 },
      { id: 2, title: 'Revolver', year: 1966 },
      { id: 1, title: 'Rubber Soul', year: 1965 },
    ],
  },
  'led-zeppelin': {
    bio: `Led Zeppelin were an English rock band, formed in
      London in 1968, that comprised Robert Plant, Jimmy Page,
      John Paul Jones and John Bonham.`,
    albums: [
      { id: 4, title: 'In Through the Out Door', year: 1979 },
      { id: 3, title: 'Physical Graffiti', year: 1975 },
      { id: 2, title: 'Houses of the Holy', year: 1973 },
      { id: 1, title: 'Led Zeppelin II', year: 1969 },
    ],
  },
};
```

</Sandpack>

Click "Show albums." You'll see "🌀 Loading..." until the albums arrive. Now hide the albums and show them again. This time they appear right away. You'll find out why in [Caching the data you wait for](#caching-the-data-you-wait-for).

Notice that `Albums` doesn't mention loading at all. It reads the albums as if they were already there. The loading state lives in `App`, in the `fallback` prop.

<Note>

Suspense only knows about data read during rendering, through `use` or a [Suspense-enabled framework](/reference/react/Suspense#suspense-enabled-frameworks). It does *not* detect data fetched inside an Effect or an event handler. Code loaded with [`lazy`](/reference/react/lazy) also works with Suspense. [See the full list of what activates a Suspense boundary.](/reference/react/Suspense#what-activates-a-suspense-boundary)

</Note>

## What happens when a component suspends {/*what-happens-when-a-component-suspends*/}

Let's slow down and follow what React does when you click "Show albums":

1. React calls `Albums` to render it.
2. `Albums` calls `use` with a Promise that hasn't resolved yet. `Albums` can't finish rendering without the albums, so it stops. This is called *suspending*.
3. React throws away the unfinished output of `Albums` and walks up the tree to the closest `<Suspense>` boundary.
4. React renders that boundary's `fallback` in place of its children and shows it on the screen.
5. When the Promise resolves, React tries to render the boundary's children again. This time, `use` returns the albums, and React replaces the fallback with the content.

In step 5, React calls `Albums` again *from the top*. It doesn't pick up where it left off. That's one more reason your components need to [stay pure](/learn/keeping-components-pure): React may call them several times before their output ever reaches the screen.

<DeepDive>

#### How does `use` stop a component in the middle of rendering? {/*how-does-use-stop-a-component*/}

When the Promise you pass to `use` is still pending, `use` throws a special internal exception. That exception is not a real error. It exits your component immediately, and React catches it to find the closest Suspense boundary.

This is why you shouldn't call `use` inside a `try`/`catch` block. If your `catch` swallows that internal exception, React can't tell that the component suspended. In development, React logs an error when this happens.

```js
function Albums({ artistId }) {
  try {
    // 🔴 Avoid: the catch block intercepts the suspension
    const albums = use(fetchData(`/${artistId}/albums`));
    // ...
  } catch (error) {
    // ...
  }
}
```

To handle a Promise that rejects, wrap the component in an [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) instead.

Some older libraries suspend by throwing the Promise themselves. React still supports that, but `use` is the way going forward.

</DeepDive>

## Everything inside a boundary appears together {/*everything-inside-a-boundary-appears-together*/}

A Suspense boundary treats all of its children as one unit. If *any* component inside it suspends, the whole boundary shows its fallback. It reveals the content only when *every* component inside it is ready.

Here, `Biography` and `Albums` sit in the same boundary. The biography loads faster than the albums, but you won't see it early:

<Sandpack>

```js src/App.js
import ArtistPage from './ArtistPage.js';

export default function App() {
  return <ArtistPage artistId="the-beatles" />;
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Biography from './Biography.js';
import Albums from './Albums.js';

export default function ArtistPage({ artistId }) {
  return (
    <>
      <h1>The Beatles</h1>
      <Suspense fallback={<p>🌀 Loading...</p>}>
        <Biography artistId={artistId} />
        <Albums artistId={artistId} />
      </Suspense>
    </>
  );
}
```

```js src/Biography.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return <p className="bio">{bio}</p>;
}
```

```js src/Albums.js
import { use } from 'react';
import { fetchData } from './data.js';

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
```

```js src/data.js hidden
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
  const [, artistId, kind] = url.split('/');
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, kind === 'bio' ? 500 : 1500);
  });
  return artists[artistId][kind];
}

const artists = {
  'the-beatles': {
    bio: `The Beatles were an English rock band, formed in
      Liverpool in 1960, that comprised John Lennon,
      Paul McCartney, George Harrison and Ringo Starr.`,
    albums: [
      { id: 4, title: 'Abbey Road', year: 1969 },
      { id: 3, title: 'Sgt. Pepper\'s Lonely Hearts Club Band', year: 1967 },
      { id: 2, title: 'Revolver', year: 1966 },
      { id: 1, title: 'Rubber Soul', year: 1965 },
    ],
  },
  'led-zeppelin': {
    bio: `Led Zeppelin were an English rock band, formed in
      London in 1968, that comprised Robert Plant, Jimmy Page,
      John Paul Jones and John Bonham.`,
    albums: [
      { id: 4, title: 'In Through the Out Door', year: 1979 },
      { id: 3, title: 'Physical Graffiti', year: 1975 },
      { id: 2, title: 'Houses of the Holy', year: 1973 },
      { id: 1, title: 'Led Zeppelin II', year: 1969 },
    ],
  },
};
```

```css
.bio { font-style: italic; }
```

</Sandpack>

To watch it load again, press the refresh button in the sandbox. The heading appears immediately because it's *outside* the boundary. The biography and the albums appear at the same moment.

You don't need to write any code to coordinate the two components. After the fallback is on the screen, React keeps rendering the other components inside the boundary in the background, so `Albums` starts loading its data even though `Biography` suspended first.

## Revealing content in stages {/*revealing-content-in-stages*/}

Waiting for everything isn't always what you want. The biography is short and loads fast, so it would be nice to show it as soon as it's ready and keep the user waiting only for the albums.

You can do that by nesting another boundary around `Albums`, with its own fallback:

<Sandpack>

```js src/App.js
import ArtistPage from './ArtistPage.js';

export default function App() {
  return <ArtistPage artistId="the-beatles" />;
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Biography from './Biography.js';
import Albums from './Albums.js';

export default function ArtistPage({ artistId }) {
  return (
    <>
      <h1>The Beatles</h1>
      <Suspense fallback={<p>🌀 Loading...</p>}>
        <Biography artistId={artistId} />
        <Suspense fallback={<p>🎵 Loading albums...</p>}>
          <Albums artistId={artistId} />
        </Suspense>
      </Suspense>
    </>
  );
}
```

```js src/Biography.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return <p className="bio">{bio}</p>;
}
```

```js src/Albums.js
import { use } from 'react';
import { fetchData } from './data.js';

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
```

```js src/data.js hidden
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
  const [, artistId, kind] = url.split('/');
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, kind === 'bio' ? 500 : 1500);
  });
  return artists[artistId][kind];
}

const artists = {
  'the-beatles': {
    bio: `The Beatles were an English rock band, formed in
      Liverpool in 1960, that comprised John Lennon,
      Paul McCartney, George Harrison and Ringo Starr.`,
    albums: [
      { id: 4, title: 'Abbey Road', year: 1969 },
      { id: 3, title: 'Sgt. Pepper\'s Lonely Hearts Club Band', year: 1967 },
      { id: 2, title: 'Revolver', year: 1966 },
      { id: 1, title: 'Rubber Soul', year: 1965 },
    ],
  },
  'led-zeppelin': {
    bio: `Led Zeppelin were an English rock band, formed in
      London in 1968, that comprised Robert Plant, Jimmy Page,
      John Paul Jones and John Bonham.`,
    albums: [
      { id: 4, title: 'In Through the Out Door', year: 1979 },
      { id: 3, title: 'Physical Graffiti', year: 1975 },
      { id: 2, title: 'Houses of the Holy', year: 1973 },
      { id: 1, title: 'Led Zeppelin II', year: 1969 },
    ],
  },
};
```

```css
.bio { font-style: italic; }
```

</Sandpack>

Refresh the sandbox and watch the order:

1. "🌀 Loading..." while the biography loads.
2. The biography, with "🎵 Loading albums..." below it.
3. The biography and the albums.

When `Albums` suspends now, React only needs to go up to the inner boundary, so only the inner fallback shows. The outer boundary waits for `Biography` alone. Boundaries always reveal from the outside in: the inner fallback can't appear before the outer content it sits in.

So where should the boundaries go? Ask yourself *which pieces make sense to show without the others*. A heading and its biography can appear together. A long list that takes longer to load is a good candidate for its own boundary. You don't need a boundary around every component that loads data. Too many fallbacks popping in one after another feels busier than a single loading state.

<Note>

React sometimes waits a little before revealing content, even when the data is ready. If several boundaries finish loading close together, React reveals them at the same time instead of one after another, so the page doesn't flicker as pieces snap in. This delay is at most about 300ms.

</Note>

## Caching the data you wait for {/*caching-the-data-you-wait-for*/}

In every example so far, `Albums` got its Promise from `fetchData`, which keeps a cache of Promises by URL. It might be tempting to skip the cache and create the Promise right in the component:

```js
function Albums({ artistId }) {
  // 🔴 Avoid: creates a new Promise on every render
  const albums = use(fetch(`/api/${artistId}/albums`).then(r => r.json()));
  // ...
}
```

Walk through the steps from earlier and see what goes wrong:

1. React renders `Albums`. It creates a Promise and suspends on it.
2. The Promise resolves, so React renders `Albums` again.
3. `Albums` creates a *brand new* Promise, which is pending. It suspends again.
4. Repeat forever. The fallback never goes away.

`use` returns a value only when it gets a Promise that has *already* resolved. To get that, every render needs to receive the *same* Promise object.

You might think of keeping the Promise in state or in `useMemo`:

```js
function Albums({ artistId }) {
  // 🔴 Avoid: this state is thrown away when Albums suspends
  const [albumsPromise] = useState(() => fetchAlbums(artistId));
  const albums = use(albumsPromise);
  // ...
}
```

This doesn't work either. When `Albums` suspends during its very first render, it never makes it onto the screen. React has nowhere to keep its state, so it throws that state away. On the next try, `useState` runs its initializer again and creates a new Promise.

The Promise needs to live somewhere that *outlasts* the component. Here are some options:

```js
function Albums({ artistId }) {
  // ✅ Good: the cache returns the same Promise every time
  const albums = use(fetchData(`/${artistId}/albums`));
  // ...
}
```

* **A framework or data library with Suspense support.** This is the most common option. It handles caching for you, along with things like refetching and invalidation.
* **A cache outside your components**, like `fetchData` in the examples on this page. A component that asks for the same URL again gets the same Promise back. That's why the albums in the first sandbox appeared instantly the second time.
* **A component that's already on the screen.** A parent that's already mounted can create the Promise, for example in an event handler, keep it in state, and pass it down to the component that calls `use`.

<Pitfall>

The `fetchData` cache on this page is a module-level `Map` kept to make the examples work. If you copy it into code that runs on a server, every request shares the same cache, so data from one user can leak to another. In a real app, prefer the caching your framework or data library provides.

</Pitfall>

## When already-visible content suspends {/*when-already-visible-content-suspends*/}

So far, each boundary suspended while its content was showing for the first time. What happens when content that's *already on the screen* suspends again?

Click "Led Zeppelin" in this example:

<Sandpack>

```js src/App.js active
import { Suspense, useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [artistId, setArtistId] = useState('the-beatles');
  return (
    <>
      <nav>
        <button onClick={() => setArtistId('the-beatles')}>
          The Beatles
        </button>
        <button onClick={() => setArtistId('led-zeppelin')}>
          Led Zeppelin
        </button>
      </nav>
      <Suspense fallback={<p>🌀 Loading...</p>}>
        <ArtistPage artistId={artistId} />
      </Suspense>
    </>
  );
}
```

```js src/ArtistPage.js
import Biography from './Biography.js';
import Albums from './Albums.js';

export default function ArtistPage({ artistId }) {
  return (
    <>
      <Biography artistId={artistId} />
      <Albums artistId={artistId} />
    </>
  );
}
```

```js src/Biography.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return <p className="bio">{bio}</p>;
}
```

```js src/Albums.js
import { use } from 'react';
import { fetchData } from './data.js';

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
```

```js src/data.js hidden
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
  const [, artistId, kind] = url.split('/');
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, kind === 'bio' ? 500 : 1500);
  });
  return artists[artistId][kind];
}

const artists = {
  'the-beatles': {
    bio: `The Beatles were an English rock band, formed in
      Liverpool in 1960, that comprised John Lennon,
      Paul McCartney, George Harrison and Ringo Starr.`,
    albums: [
      { id: 4, title: 'Abbey Road', year: 1969 },
      { id: 3, title: 'Sgt. Pepper\'s Lonely Hearts Club Band', year: 1967 },
      { id: 2, title: 'Revolver', year: 1966 },
      { id: 1, title: 'Rubber Soul', year: 1965 },
    ],
  },
  'led-zeppelin': {
    bio: `Led Zeppelin were an English rock band, formed in
      London in 1968, that comprised Robert Plant, Jimmy Page,
      John Paul Jones and John Bonham.`,
    albums: [
      { id: 4, title: 'In Through the Out Door', year: 1979 },
      { id: 3, title: 'Physical Graffiti', year: 1975 },
      { id: 2, title: 'Houses of the Holy', year: 1973 },
      { id: 1, title: 'Led Zeppelin II', year: 1969 },
    ],
  },
};
```

```css
nav { display: flex; gap: 8px; }
.bio { font-style: italic; }
```

</Sandpack>

The Beatles page disappears and "🌀 Loading..." takes its place. When you clicked the button, `ArtistPage` rendered with a new `artistId`, `Biography` suspended, and React did exactly what it did before: it found the closest boundary and showed its fallback.

That makes sense for a first load, but here it's jarring. The user was looking at a perfectly good page, and you replaced it with a loading message. It would be better to keep the old page on the screen until the new one is ready.

You can tell React that by marking the update as a [Transition](/reference/react/useTransition):

```js
const [isPending, startTransition] = useTransition();

function handleClick(nextArtistId) {
  startTransition(() => {
    setArtistId(nextArtistId);
  });
}
```

A Transition tells React that this update isn't urgent. If rendering it suspends, React doesn't hide the content that's already visible. It keeps showing the old UI and switches to the new one only when it's ready. Meanwhile, `isPending` is `true`, so you can show the user that something is happening:

<Sandpack>

```js src/App.js active
import { Suspense, useState, useTransition } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [artistId, setArtistId] = useState('the-beatles');
  const [isPending, startTransition] = useTransition();

  function handleClick(nextArtistId) {
    startTransition(() => {
      setArtistId(nextArtistId);
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => handleClick('the-beatles')}>
          The Beatles
        </button>
        <button onClick={() => handleClick('led-zeppelin')}>
          Led Zeppelin
        </button>
      </nav>
      <div className={isPending ? 'pending' : ''}>
        <Suspense fallback={<p>🌀 Loading...</p>}>
          <ArtistPage artistId={artistId} />
        </Suspense>
      </div>
    </>
  );
}
```

```js src/ArtistPage.js
import Biography from './Biography.js';
import Albums from './Albums.js';

export default function ArtistPage({ artistId }) {
  return (
    <>
      <Biography artistId={artistId} />
      <Albums artistId={artistId} />
    </>
  );
}
```

```js src/Biography.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return <p className="bio">{bio}</p>;
}
```

```js src/Albums.js
import { use } from 'react';
import { fetchData } from './data.js';

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
```

```js src/data.js hidden
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
  const [, artistId, kind] = url.split('/');
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, kind === 'bio' ? 500 : 1500);
  });
  return artists[artistId][kind];
}

const artists = {
  'the-beatles': {
    bio: `The Beatles were an English rock band, formed in
      Liverpool in 1960, that comprised John Lennon,
      Paul McCartney, George Harrison and Ringo Starr.`,
    albums: [
      { id: 4, title: 'Abbey Road', year: 1969 },
      { id: 3, title: 'Sgt. Pepper\'s Lonely Hearts Club Band', year: 1967 },
      { id: 2, title: 'Revolver', year: 1966 },
      { id: 1, title: 'Rubber Soul', year: 1965 },
    ],
  },
  'led-zeppelin': {
    bio: `Led Zeppelin were an English rock band, formed in
      London in 1968, that comprised Robert Plant, Jimmy Page,
      John Paul Jones and John Bonham.`,
    albums: [
      { id: 4, title: 'In Through the Out Door', year: 1979 },
      { id: 3, title: 'Physical Graffiti', year: 1975 },
      { id: 2, title: 'Houses of the Holy', year: 1973 },
      { id: 1, title: 'Led Zeppelin II', year: 1969 },
    ],
  },
};
```

```css
nav { display: flex; gap: 8px; }
.bio { font-style: italic; }
.pending { opacity: 0.5; }
```

</Sandpack>

Now clicking "Led Zeppelin" dims the Beatles page instead of hiding it, and the new page replaces it when it's ready. You still see "🌀 Loading..." on the very first load, though. A Transition only prevents React from hiding content that's *already visible*. A boundary that's showing for the first time has nothing to keep on the screen, so it shows its fallback even inside a Transition.

You can use that to your advantage. If you *want* to show the fallback when the user goes to a different artist, give the boundary a [`key`](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key):

```js
<Suspense key={artistId} fallback={<p>🌀 Loading...</p>}>
  <ArtistPage artistId={artistId} />
</Suspense>
```

With a different `key`, React treats it as a new boundary that's showing for the first time, so it shows the fallback. Put the `key` on the `<Suspense>` itself. Giving a `key` to a component *inside* the boundary doesn't make the boundary new.

<DeepDive>

#### What happens to content that's hidden behind a fallback? {/*what-happens-to-hidden-content*/}

In the first version of the artist switcher, the Beatles page was hidden while the Led Zeppelin page loaded. You might expect React to unmount it, but it doesn't.

When content that's already on the screen suspends again, React *hides* it with `display: none` and shows the fallback next to it. The hidden components stay mounted:

* Their state is kept, so typed input or a scroll position inside them survives.
* Their DOM nodes are kept, so React doesn't need to recreate them.
* Their [layout Effects](/reference/react/useLayoutEffect) are cleaned up while they're hidden and run again when they reappear. Refs to their DOM nodes are also detached and reattached, because the layout of hidden content isn't meaningful.
* Their regular Effects keep running.

When the data is ready, React shows the content again in place of the fallback.

This is different from content that suspends *before* it was ever shown. That content never mounted, so it has no state to keep, which is why you need to [cache the data outside of it](#caching-the-data-you-wait-for).

</DeepDive>

<Recap>

* A component *suspends* when it can't finish rendering because it's waiting for something, like a Promise passed to `use`.
* When a component suspends, React shows the `fallback` of the closest `<Suspense>` boundary above it, then tries rendering the content again when the data is ready.
* React renders a component that suspended again from the top, so components must stay pure.
* Everything inside one boundary appears together. Nest boundaries to reveal content in stages, from the outside in.
* Suspense only detects data read during rendering. It doesn't detect data fetched in Effects or event handlers.
* The Promise you pass to `use` must come from a cache that outlives the component. State and `useMemo` don't work, because a component that suspends before it mounts loses its state.
* Wrapping an update in a Transition keeps already-visible content on the screen instead of replacing it with a fallback.
* To show a fallback when navigating, give the `<Suspense>` boundary a `key`.

</Recap>

<Challenges>

#### Show the heading right away {/*show-the-heading-right-away*/}

This page shows "🌀 Loading..." until the albums are ready, and the heading only appears along with them. The heading doesn't depend on any data. Change the code so that the heading appears immediately, and only the album list shows a fallback.

<Sandpack>

```js src/App.js active
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function App() {
  return (
    <Suspense fallback={<p>🌀 Loading...</p>}>
      <h1>The Beatles</h1>
      <Albums artistId="the-beatles" />
    </Suspense>
  );
}
```

```js src/Albums.js
import { use } from 'react';
import { fetchData } from './data.js';

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
```

```js src/data.js hidden
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
  const [, artistId, kind] = url.split('/');
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, kind === 'bio' ? 500 : 1500);
  });
  return artists[artistId][kind];
}

const artists = {
  'the-beatles': {
    bio: `The Beatles were an English rock band, formed in
      Liverpool in 1960, that comprised John Lennon,
      Paul McCartney, George Harrison and Ringo Starr.`,
    albums: [
      { id: 4, title: 'Abbey Road', year: 1969 },
      { id: 3, title: 'Sgt. Pepper\'s Lonely Hearts Club Band', year: 1967 },
      { id: 2, title: 'Revolver', year: 1966 },
      { id: 1, title: 'Rubber Soul', year: 1965 },
    ],
  },
  'led-zeppelin': {
    bio: `Led Zeppelin were an English rock band, formed in
      London in 1968, that comprised Robert Plant, Jimmy Page,
      John Paul Jones and John Bonham.`,
    albums: [
      { id: 4, title: 'In Through the Out Door', year: 1979 },
      { id: 3, title: 'Physical Graffiti', year: 1975 },
      { id: 2, title: 'Houses of the Holy', year: 1973 },
      { id: 1, title: 'Led Zeppelin II', year: 1969 },
    ],
  },
};
```

</Sandpack>

<Solution>

The heading is inside the boundary, so the boundary hides it along with everything else while `Albums` is loading. Move the heading outside the boundary so that the boundary only wraps the content that needs to wait:

<Sandpack>

```js src/App.js active
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function App() {
  return (
    <>
      <h1>The Beatles</h1>
      <Suspense fallback={<p>🌀 Loading...</p>}>
        <Albums artistId="the-beatles" />
      </Suspense>
    </>
  );
}
```

```js src/Albums.js
import { use } from 'react';
import { fetchData } from './data.js';

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
```

```js src/data.js hidden
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
  const [, artistId, kind] = url.split('/');
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, kind === 'bio' ? 500 : 1500);
  });
  return artists[artistId][kind];
}

const artists = {
  'the-beatles': {
    bio: `The Beatles were an English rock band, formed in
      Liverpool in 1960, that comprised John Lennon,
      Paul McCartney, George Harrison and Ringo Starr.`,
    albums: [
      { id: 4, title: 'Abbey Road', year: 1969 },
      { id: 3, title: 'Sgt. Pepper\'s Lonely Hearts Club Band', year: 1967 },
      { id: 2, title: 'Revolver', year: 1966 },
      { id: 1, title: 'Rubber Soul', year: 1965 },
    ],
  },
  'led-zeppelin': {
    bio: `Led Zeppelin were an English rock band, formed in
      London in 1968, that comprised Robert Plant, Jimmy Page,
      John Paul Jones and John Bonham.`,
    albums: [
      { id: 4, title: 'In Through the Out Door', year: 1979 },
      { id: 3, title: 'Physical Graffiti', year: 1975 },
      { id: 2, title: 'Houses of the Holy', year: 1973 },
      { id: 1, title: 'Led Zeppelin II', year: 1969 },
    ],
  },
};
```

</Sandpack>

</Solution>

#### Keep the current tab visible {/*keep-the-current-tab-visible*/}

This page has two tabs. When you switch to the "Albums" tab for the first time, the biography disappears and "🌀 Loading..." takes its place. Change the code so that the biography stays on the screen, dimmed, until the albums are ready.

<Sandpack>

```js src/App.js active
import { Suspense, useState } from 'react';
import Biography from './Biography.js';
import Albums from './Albums.js';

export default function App() {
  const [tab, setTab] = useState('bio');
  return (
    <>
      <nav>
        <button onClick={() => setTab('bio')}>
          Biography
        </button>
        <button onClick={() => setTab('albums')}>
          Albums
        </button>
      </nav>
      <Suspense fallback={<p>🌀 Loading...</p>}>
        {tab === 'bio' ? (
          <Biography artistId="the-beatles" />
        ) : (
          <Albums artistId="the-beatles" />
        )}
      </Suspense>
    </>
  );
}
```

```js src/Biography.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return <p className="bio">{bio}</p>;
}
```

```js src/Albums.js
import { use } from 'react';
import { fetchData } from './data.js';

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
```

```js src/data.js hidden
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
  const [, artistId, kind] = url.split('/');
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, kind === 'bio' ? 500 : 1500);
  });
  return artists[artistId][kind];
}

const artists = {
  'the-beatles': {
    bio: `The Beatles were an English rock band, formed in
      Liverpool in 1960, that comprised John Lennon,
      Paul McCartney, George Harrison and Ringo Starr.`,
    albums: [
      { id: 4, title: 'Abbey Road', year: 1969 },
      { id: 3, title: 'Sgt. Pepper\'s Lonely Hearts Club Band', year: 1967 },
      { id: 2, title: 'Revolver', year: 1966 },
      { id: 1, title: 'Rubber Soul', year: 1965 },
    ],
  },
  'led-zeppelin': {
    bio: `Led Zeppelin were an English rock band, formed in
      London in 1968, that comprised Robert Plant, Jimmy Page,
      John Paul Jones and John Bonham.`,
    albums: [
      { id: 4, title: 'In Through the Out Door', year: 1979 },
      { id: 3, title: 'Physical Graffiti', year: 1975 },
      { id: 2, title: 'Houses of the Holy', year: 1973 },
      { id: 1, title: 'Led Zeppelin II', year: 1969 },
    ],
  },
};
```

```css
nav { display: flex; gap: 8px; }
.bio { font-style: italic; }
.pending { opacity: 0.5; }
```

</Sandpack>

<Solution>

Switching tabs replaces content that's already visible, so this is a job for a Transition. Call `useTransition`, wrap `setTab` in `startTransition`, and use `isPending` to dim the current tab while the next one loads:

<Sandpack>

```js src/App.js active
import { Suspense, useState, useTransition } from 'react';
import Biography from './Biography.js';
import Albums from './Albums.js';

export default function App() {
  const [tab, setTab] = useState('bio');
  const [isPending, startTransition] = useTransition();

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => selectTab('bio')}>
          Biography
        </button>
        <button onClick={() => selectTab('albums')}>
          Albums
        </button>
      </nav>
      <div className={isPending ? 'pending' : ''}>
        <Suspense fallback={<p>🌀 Loading...</p>}>
          {tab === 'bio' ? (
            <Biography artistId="the-beatles" />
          ) : (
            <Albums artistId="the-beatles" />
          )}
        </Suspense>
      </div>
    </>
  );
}
```

```js src/Biography.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return <p className="bio">{bio}</p>;
}
```

```js src/Albums.js
import { use } from 'react';
import { fetchData } from './data.js';

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
```

```js src/data.js hidden
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
  const [, artistId, kind] = url.split('/');
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, kind === 'bio' ? 500 : 1500);
  });
  return artists[artistId][kind];
}

const artists = {
  'the-beatles': {
    bio: `The Beatles were an English rock band, formed in
      Liverpool in 1960, that comprised John Lennon,
      Paul McCartney, George Harrison and Ringo Starr.`,
    albums: [
      { id: 4, title: 'Abbey Road', year: 1969 },
      { id: 3, title: 'Sgt. Pepper\'s Lonely Hearts Club Band', year: 1967 },
      { id: 2, title: 'Revolver', year: 1966 },
      { id: 1, title: 'Rubber Soul', year: 1965 },
    ],
  },
  'led-zeppelin': {
    bio: `Led Zeppelin were an English rock band, formed in
      London in 1968, that comprised Robert Plant, Jimmy Page,
      John Paul Jones and John Bonham.`,
    albums: [
      { id: 4, title: 'In Through the Out Door', year: 1979 },
      { id: 3, title: 'Physical Graffiti', year: 1975 },
      { id: 2, title: 'Houses of the Holy', year: 1973 },
      { id: 1, title: 'Led Zeppelin II', year: 1969 },
    ],
  },
};
```

```css
nav { display: flex; gap: 8px; }
.bio { font-style: italic; }
.pending { opacity: 0.5; }
```

</Sandpack>

The first load still shows "🌀 Loading..." because there's nothing on the screen yet to keep.

</Solution>

#### Fix the fallback that never goes away {/*fix-the-fallback-that-never-goes-away*/}

This page should show a list of albums, but it shows "🌀 Loading..." forever. Find out why and fix it.

<Hint>

Open the console. How many times does `fetchAlbums` start loading?

</Hint>

<Sandpack>

```js src/App.js
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function App() {
  return (
    <>
      <h1>The Beatles</h1>
      <Suspense fallback={<p>🌀 Loading...</p>}>
        <Albums artistId="the-beatles" />
      </Suspense>
    </>
  );
}
```

```js src/Albums.js
import { use } from 'react';
import { fetchAlbums } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchAlbums(artistId));
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
```

```js src/data.js active
export async function fetchAlbums(artistId) {
  console.log('Fetching albums for:', artistId);
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  return albums;
}

const albums = [
  { id: 4, title: 'Abbey Road', year: 1969 },
  { id: 3, title: 'Sgt. Pepper\'s Lonely Hearts Club Band', year: 1967 },
  { id: 2, title: 'Revolver', year: 1966 },
  { id: 1, title: 'Rubber Soul', year: 1965 },
];
```

</Sandpack>

<Solution>

`fetchAlbums` is an `async` function, so every call returns a new Promise. Each time React renders `Albums`, it gets a new pending Promise, suspends, waits for it, and tries again, only to get another new pending Promise. The console keeps logging new fetches.

Keeping the Promise in `useState` or `useMemo` inside `Albums` wouldn't fix it, because `Albums` suspends before it ever mounts, so React throws its state away. Instead, cache the Promise in `data.js` so that every call for the same artist returns the same Promise:

<Sandpack>

```js src/App.js
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function App() {
  return (
    <>
      <h1>The Beatles</h1>
      <Suspense fallback={<p>🌀 Loading...</p>}>
        <Albums artistId="the-beatles" />
      </Suspense>
    </>
  );
}
```

```js src/Albums.js
import { use } from 'react';
import { fetchAlbums } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchAlbums(artistId));
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
```

```js src/data.js active
let cache = new Map();

export function fetchAlbums(artistId) {
  if (!cache.has(artistId)) {
    cache.set(artistId, getAlbums(artistId));
  }
  return cache.get(artistId);
}

async function getAlbums(artistId) {
  console.log('Fetching albums for:', artistId);
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  return albums;
}

const albums = [
  { id: 4, title: 'Abbey Road', year: 1969 },
  { id: 3, title: 'Sgt. Pepper\'s Lonely Hearts Club Band', year: 1967 },
  { id: 2, title: 'Revolver', year: 1966 },
  { id: 1, title: 'Rubber Soul', year: 1965 },
];
```

</Sandpack>

Now the console logs one fetch, and the albums appear after a second.

</Solution>

</Challenges>
