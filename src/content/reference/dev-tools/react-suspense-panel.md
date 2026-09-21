---
title: React Suspense panel
---

<Intro>

The Suspense panel in React Developer Tools lets you inspect [`<Suspense>`](/reference/react/Suspense) boundaries, find what caused them to suspend, and preview the order in which they reveal their content.

</Intro>

<InlineToc />

---

## Usage {/*usage*/}

To open the Suspense panel:

1. Install React Developer Tools 8.0 or later for Chrome, or update an existing installation. See the [browser extension installation instructions](/learn/react-developer-tools#browser-extension).
2. Open a page built with React.
3. Open the browser developer tools and select **Suspense**.

If the panel does not appear, reload the page with the browser developer tools open.

<Note>

The panel itself does not require React Canary. For complete information about what caused a boundary to suspend, use a development build of React 19.2 or later. The panel can also inspect older versions of React and production builds, but information about some causes may be unavailable. In these cases, the inspector explains why it cannot show the exact cause.

</Note>

The examples on this page run inside embedded frames. The screenshots show how each example appears in the Suspense panel. To inspect an example interactively, fork it and open its preview as a separate page.

The examples use small Promise caches to demonstrate suspension. In an app, use a [Suspense-enabled framework or data source](/reference/react/Suspense#suspense-enabled-frameworks).

---

## Panel features {/*panel-features*/}

### Navigating the panel {/*navigating-the-panel*/}

The panel has a minimap and reveal timeline on the left and an inspector on the right. Drag the divider to resize them. You can also hide the inspector from the toolbar. The panel remembers the layout between sessions.

The toolbar also includes controls for selecting a Suspense boundary from the page, navigating through nested boundaries, filtering the minimap, and opening the React Developer Tools settings.

{/* TODO: Replace the screenshot placeholders before marking this PR ready. */}

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/suspense-panel/overview.png" alt="The Suspense panel showing a minimap of the page's boundaries, details for a selected boundary, and the reveal timeline." />
  <img className="w-full dark-image" src="/images/docs/suspense-panel/overview.dark.png" alt="The Suspense panel showing a minimap of the page's boundaries, details for a selected boundary, and the reveal timeline." />
</div>

### Inspecting Suspense boundaries {/*inspecting-suspense-boundaries*/}

The main view is a minimap of the Suspense boundaries on the page. Each outlined region represents the content inside a boundary and matches its position on the page. Blue indicates client-rendered boundaries, green indicates server-rendered boundaries, and yellow indicates boundaries rendered in another named environment. The timeline label shows the environment's name.

This example contains an outer boundary for the artist details and a nested boundary for the albums:

<Sandpack>

```js src/App.js active
import { Suspense, use } from 'react';
import { fetchData } from './data.js';

export default function App() {
  return (
    <main>
      <h1>The Beatles</h1>
      <Suspense fallback={<h2>Loading artist...</h2>}>
        <Biography />
        <Suspense fallback={<AlbumsGlimmer />}>
          <Albums />
        </Suspense>
      </Suspense>
    </main>
  );
}

function Biography() {
  const biography = use(fetchData('/biography'));
  return <p className="bio">{biography}</p>;
}

function Albums() {
  const albums = use(fetchData('/albums'));
  return (
    <section className="panel">
      <h2>Albums</h2>
      <ul>
        {albums.map(album => (
          <li key={album.id}>{album.title}</li>
        ))}
      </ul>
    </section>
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

```js src/data.js hidden
const cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/biography') {
    await wait(800);
    return 'The Beatles were an English rock band formed in Liverpool.';
  }

  if (url === '/albums') {
    await wait(1800);
    return [
      { id: 1, title: 'Revolver' },
      { id: 2, title: 'Abbey Road' },
      { id: 3, title: 'Let It Be' },
    ];
  }

  throw Error('Not implemented');
}

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

```css
.bio {
  font-style: italic;
}

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  background: linear-gradient(90deg, #ddd 0%, #fff 100%);
  border: 1px dashed #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  background: #f0f0f0;
  border-radius: 4px;
  height: 20px;
  margin: 10px;
  width: 60%;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start"
  }
}
```

</Sandpack>

Use the minimap to find and inspect boundaries:

- Hover over a region to highlight its content on the page.
- Select a region to inspect that boundary.
- Double-click a region to alternate between the timeline steps immediately before and after React revealed its content.
- Select the minimap background to inspect the root, or double-click it to return to the initial paint.

For nested boundaries, use the breadcrumbs above the minimap to move through their hierarchy.

You can also select **Inspect Suspense Nodes** in the toolbar, then select content on the page. The panel selects the nearest Suspense boundary.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/suspense-panel/boundary-map.png" alt="Nested Suspense boundaries in the panel minimap." />
  <img className="w-full dark-image" src="/images/docs/suspense-panel/boundary-map.dark.png" alt="Nested Suspense boundaries in the panel minimap." />
</div>

### Finding what caused a boundary to suspend {/*finding-what-caused-a-boundary-to-suspend*/}

After you select a boundary, the inspector shows whether it is suspended and which Components rendered the boundary. The **Suspended by** section lists the work that caused it to suspend.

In this example, one boundary waits for a Promise read with [`use`](/reference/react/use), while another waits for a Component loaded with [`lazy`](/reference/react/lazy):

<Sandpack>

```js src/App.js active
import { lazy, Suspense, use } from 'react';
import { fetchBiography } from './data.js';

const Albums = lazy(async () => {
  await new Promise(resolve => {
    setTimeout(resolve, 1800);
  });
  return import('./Albums.js');
});

export default function App() {
  return (
    <main>
      <h1>The Beatles</h1>
      <Suspense fallback={<p>Loading biography...</p>}>
        <Biography />
      </Suspense>
      <Suspense fallback={<p>Loading albums...</p>}>
        <Albums />
      </Suspense>
    </main>
  );
}

function Biography() {
  const biography = use(fetchBiography());
  return <p>{biography}</p>;
}
```

```js src/Albums.js hidden
export default function Albums() {
  return (
    <section>
      <h2>Albums</h2>
      <ul>
        <li>Revolver</li>
        <li>Abbey Road</li>
      </ul>
    </section>
  );
}
```

```js src/data.js hidden
let biographyPromise;

export function fetchBiography() {
  if (!biographyPromise) {
    biographyPromise = getBiography();
  }
  return biographyPromise;
}

async function getBiography() {
  await new Promise(resolve => {
    setTimeout(resolve, 900);
  });
  return 'The Beatles were an English rock band formed in Liverpool.';
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start"
  }
}
```

</Sandpack>

The **Suspended by** section can show causes such as Components loaded with `lazy`, Promises read with `use`, and resources including stylesheets, fonts, and images.

Each cause includes a time bar. Hover over it to see how long the work took and, for a resource, its size. Expand a cause to inspect where the work started and where React awaited it, the Components involved, and the resolved or rejected value. Consecutive causes with the same name are grouped together.

Select the clipboard button in the **Suspended by** heading to copy all suspension data.

While a boundary is still waiting, the inspector displays **suspended...** until the work completes. If React could not retain the information needed to identify a cause, the inspector explains whether this is because of the React version, a production build, or a Promise thrown without `use`.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/suspense-panel/suspended-by.png" alt="The Suspended by section for a selected Suspense boundary." />
  <img className="w-full dark-image" src="/images/docs/suspense-panel/suspended-by.dark.png" alt="The Suspended by section for a selected Suspense boundary." />
</div>

### Previewing a fallback {/*previewing-a-fallback*/}

You can force a resolved Suspense boundary to display its fallback. This lets you inspect a loading state without changing the app's data or adding temporary code.

After the profile in this example finishes loading, select its boundary in the minimap. Select **Suspend the selected component** in the inspector to replace the profile with its fallback. Select **Unsuspend the selected component** to reveal the content again.

<Sandpack>

```js src/App.js active
import { Suspense, use } from 'react';
import { getProfile } from './data.js';

export default function App() {
  return (
    <Suspense fallback={<ProfileGlimmer />}>
      <Profile />
    </Suspense>
  );
}

function Profile() {
  const profile = use(getProfile());
  return (
    <section className="profile">
      <img src={profile.avatar} alt="" />
      <div>
        <h2>{profile.name}</h2>
        <p>{profile.bio}</p>
      </div>
    </section>
  );
}

function ProfileGlimmer() {
  return (
    <section className="profile glimmer">
      <div className="avatar" />
      <div>
        <div className="line title" />
        <div className="line" />
        <div className="line short" />
      </div>
    </section>
  );
}
```

```js src/data.js hidden
let profilePromise;

export function getProfile() {
  if (!profilePromise) {
    profilePromise = loadProfile();
  }
  return profilePromise;
}

async function loadProfile() {
  await new Promise(resolve => {
    setTimeout(resolve, 1200);
  });
  return {
    name: 'Rachel Bloom',
    bio: 'Singer, actor, and comedian.',
    avatar: 'https://i.imgur.com/yXOvdOSs.jpg',
  };
}
```

```css
.profile {
  align-items: center;
  border: 1px solid #aaa;
  border-radius: 6px;
  display: flex;
  gap: 14px;
  padding: 14px;
}

.profile img,
.avatar {
  border-radius: 50%;
  height: 70px;
  width: 70px;
}

.glimmer {
  border-style: dashed;
}

.avatar,
.line {
  background: #e5e5e5;
}

.line {
  border-radius: 4px;
  height: 14px;
  margin: 8px 0;
  width: 220px;
}

.title {
  height: 22px;
  width: 140px;
}

.short {
  width: 170px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start"
  }
}
```

</Sandpack>

**Suspend the selected component** is disabled while the boundary is waiting for its content to load.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/suspense-panel/forced-fallback.png" alt="A selected Suspense boundary displaying its fallback after it was suspended from the panel." />
  <img className="w-full dark-image" src="/images/docs/suspense-panel/forced-fallback.dark.png" alt="A selected Suspense boundary displaying its fallback after it was suspended from the panel." />
</div>

### Replaying the reveal sequence {/*replaying-the-reveal-sequence*/}

The timeline starts with the initial paint and adds a step when a Suspense boundary reveals its content. This example reveals the biography first, followed by the albums and related artists:

<Sandpack>

```js src/App.js active
import { Suspense, use } from 'react';
import { fetchData } from './data.js';

export default function App() {
  return (
    <main>
      <h1>The Beatles</h1>
      <Suspense fallback={<p>Loading biography...</p>}>
        <Biography />
      </Suspense>
      <Suspense fallback={<ListGlimmer />}>
        <Albums />
      </Suspense>
      <Suspense fallback={<ListGlimmer />}>
        <RelatedArtists />
      </Suspense>
    </main>
  );
}

function Biography() {
  const biography = use(fetchData('/biography'));
  return <p className="bio">{biography}</p>;
}

function Albums() {
  const albums = use(fetchData('/albums'));
  return <ItemList title="Albums" items={albums} />;
}

function RelatedArtists() {
  const artists = use(fetchData('/related-artists'));
  return <ItemList title="Related artists" items={artists} />;
}

function ItemList({ title, items }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <ul>
        {items.map(item => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

function ListGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/data.js hidden
const cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  const values = {
    '/biography': {
      delay: 700,
      value: 'The Beatles were an English rock band formed in Liverpool.',
    },
    '/albums': {
      delay: 1500,
      value: ['Revolver', 'Abbey Road'],
    },
    '/related-artists': {
      delay: 2300,
      value: ['The Beach Boys', 'The Kinks'],
    },
  };
  const result = values[url];
  if (!result) {
    throw Error('Not implemented');
  }
  await new Promise(resolve => {
    setTimeout(resolve, result.delay);
  });
  return result.value;
}
```

```css
.bio {
  font-style: italic;
}

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  background: linear-gradient(90deg, #ddd 0%, #fff 100%);
  border: 1px dashed #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  background: #f0f0f0;
  border-radius: 4px;
  height: 20px;
  margin: 10px;
  width: 60%;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start"
  }
}
```

</Sandpack>

Use the previous and next buttons, select a timeline marker, or drag the timeline to move between steps. Select **Play** to advance through the steps automatically. The panel updates the inspected page to show the fallbacks and content that were visible at each step. Boundary reveals also replay their View Transitions.

The distance between steps represents their reveal order, not elapsed time. To inspect how long work took, select a boundary and inspect the time bars in **Suspended by**.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/suspense-panel/reveal-timeline.png" alt="The Suspense panel timeline showing the initial paint and the order in which boundaries revealed their content." />
  <img className="w-full dark-image" src="/images/docs/suspense-panel/reveal-timeline.dark.png" alt="The Suspense panel timeline showing the initial paint and the order in which boundaries revealed their content." />
</div>

### Showing all boundaries {/*showing-all-boundaries*/}

By default, the **Unique Suspenders** filter shows only boundaries with their own suspension causes. It hides boundaries that never suspended and boundaries that waited for exactly the same work as their parent.

The boundary around the heading in this example never suspends. Turn off **Unique Suspenders** to include it in the minimap:

<Sandpack>

```js src/App.js active
import { Suspense, use } from 'react';
import { getAlbums } from './data.js';

export default function App() {
  return (
    <main>
      <Suspense fallback={<h1>Loading title...</h1>}>
        <h1>The Beatles</h1>
      </Suspense>
      <Suspense fallback={<p>Loading albums...</p>}>
        <Albums />
      </Suspense>
    </main>
  );
}

function Albums() {
  const albums = use(getAlbums());
  return (
    <ul>
      {albums.map(album => <li key={album}>{album}</li>)}
    </ul>
  );
}
```

```js src/data.js hidden
let albumsPromise;

export function getAlbums() {
  if (!albumsPromise) {
    albumsPromise = loadAlbums();
  }
  return albumsPromise;
}

async function loadAlbums() {
  await new Promise(resolve => {
    setTimeout(resolve, 1200);
  });
  return ['Revolver', 'Abbey Road', 'Let It Be'];
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start"
  }
}
```

</Sandpack>

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/suspense-panel/boundary-filter.png" alt="The boundary filter control in the Suspense panel." />
  <img className="w-full dark-image" src="/images/docs/suspense-panel/boundary-filter.dark.png" alt="The boundary filter control in the Suspense panel." />
</div>

---

## Troubleshooting {/*troubleshooting*/}

### I don't see the Suspense panel {/*i-dont-see-the-suspense-panel*/}

Update the React Developer Tools extension for Chrome to version 8.0 or later. In the React Developer Tools settings, check that **Hide Suspense tab** is turned off.

After updating the extension or changing this setting, close and reopen the browser developer tools.

### I don't see any Suspense boundaries {/*i-dont-see-any-suspense-boundaries*/}

The panel only shows boundaries rendered with [`<Suspense>`](/reference/react/Suspense). If the panel says that the root contains no Suspense nodes, check that the inspected page has rendered a boundary.

If the page contains a boundary but it does not appear, turn off **Unique Suspenders**.

### I can't see what caused a boundary to suspend {/*i-cant-see-what-caused-a-boundary-to-suspend*/}

If some cause information is missing, inspect a development build of React 19.2 or later.

If the inspector says that something threw a Promise, it cannot show exactly which work suspended the boundary. If you control the data source, provide the Promise to [`use`](/reference/react/use) instead of throwing it directly.
