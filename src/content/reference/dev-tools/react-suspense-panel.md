---
title: React Suspense panel
---

<Intro>

The Suspense panel in React Developer Tools lets you inspect [`<Suspense>`](/reference/react/Suspense) boundaries, find what caused them to suspend, and preview the order in which they reveal their content.

</Intro>

<Canary>

The Suspense panel is currently available in the React Developer Tools extension for Chrome when it connects to a development build of React 19.3 Canary. It is not available for production builds. Other browser integrations may not include it yet.

</Canary>

{/* TODO: Replace the screenshot placeholders before marking this PR ready. */}

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/suspense-panel/overview.png" alt="The Suspense panel showing a map of the page's boundaries, details for a selected boundary, and the reveal timeline." />
  <img className="w-full dark-image" src="/images/docs/suspense-panel/overview.dark.png" alt="The Suspense panel showing a map of the page's boundaries, details for a selected boundary, and the reveal timeline." />
</div>

<InlineToc />

---

## Usage {/*usage*/}

To open the Suspense panel:

1. [Install React Developer Tools for Chrome](/learn/react-developer-tools#browser-extension).
2. Open a page that uses a development build of React 19.3 Canary.
3. Open the browser developer tools and select **Suspense ⚛**.

If the panel does not appear, reload the page with the browser developer tools open.

The examples on this page run inside embedded frames. The screenshots show how each example appears in the Suspense panel. To inspect an example interactively, fork it and open its preview as a separate page.

---

## Panel features {/*panel-features*/}

### Inspecting Suspense boundaries {/*inspecting-suspense-boundaries*/}

The main view is a scaled map of the Suspense boundaries on the page. Each outlined region represents the content inside a boundary.

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
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start"
  }
}
```

</Sandpack>

Hover over a region in the map to highlight its content on the page. Select a region to inspect that boundary. For nested boundaries, use the breadcrumbs above the map to move through their hierarchy.

You can also select the inspect button in the panel, and then select content on the page.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/suspense-panel/boundary-map.png" alt="Nested Suspense boundaries in the panel map." />
  <img className="w-full dark-image" src="/images/docs/suspense-panel/boundary-map.dark.png" alt="Nested Suspense boundaries in the panel map." />
</div>

### Finding what caused a boundary to suspend {/*finding-what-caused-a-boundary-to-suspend*/}

After you select a boundary, the inspector shows whether it is suspended and which Components rendered it. The **Suspended by** section shows the work that caused it to suspend.

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
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start"
  }
}
```

</Sandpack>

Development builds can show causes such as `lazy`, Promises read with `use`, and resources including stylesheets, fonts, and images. Expand a cause to inspect the available details and timing.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/suspense-panel/suspended-by.png" alt="The Suspended by section for a selected Suspense boundary." />
  <img className="w-full dark-image" src="/images/docs/suspense-panel/suspended-by.dark.png" alt="The Suspended by section for a selected Suspense boundary." />
</div>

### Previewing a fallback {/*previewing-a-fallback*/}

After this profile finishes loading, select its boundary in the panel. Use the suspend control in the inspector to replace the profile with its fallback. Use the control again to reveal the content.

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
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start"
  }
}
```

</Sandpack>

The suspend control is not available while the boundary is already suspended. Forcing a boundary to suspend lets you check its loading state without changing the app's data or adding temporary code.

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
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start"
  }
}
```

</Sandpack>

Use the previous and next buttons or drag the timeline to move between steps. Select play to advance through the steps automatically. The panel updates the inspected page to show the fallbacks and content that were visible at each step.

The timeline previews the reveal sequence. It is not a performance recording and does not represent how long each boundary took to load.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/suspense-panel/reveal-timeline.png" alt="The Suspense panel timeline showing the initial paint and the order in which boundaries revealed their content." />
  <img className="w-full dark-image" src="/images/docs/suspense-panel/reveal-timeline.dark.png" alt="The Suspense panel timeline showing the initial paint and the order in which boundaries revealed their content." />
</div>

### Showing all boundaries {/*showing-all-boundaries*/}

By default, the panel hides boundaries that do not suspend independently. This includes a boundary that never suspends and one that always reveals with its parent boundary.

The boundary around the heading in this example never suspends. Turn off the boundary filter to include it in the map:

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
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
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

Check that you are using the React Developer Tools extension for Chrome and that the inspected page uses a development build of React 19.3 Canary. Reload the page after opening the browser developer tools so the extension can detect React.

Chrome keeps a custom developer tools panel after an extension creates it. This means the Suspense panel can remain visible if you navigate from a compatible app to a page that uses another version of React. Close and reopen the browser developer tools to check whether the current page supports the panel.

### The panel does not show any boundaries {/*the-panel-does-not-show-any-boundaries*/}

The panel only shows boundaries rendered with [`<Suspense>`](/reference/react/Suspense). If the panel says that the root contains no Suspense nodes, check that the inspected page has rendered a boundary.

If the page contains a boundary but it does not appear, turn off the boundary filter.
