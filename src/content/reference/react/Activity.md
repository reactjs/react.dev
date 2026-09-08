---
title: <Activity>
---

<Intro>

`<Activity>` lets you hide and reveal part of the UI while preserving its state.

```js
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Sidebar />
</Activity>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<Activity>` {/*activity*/}

Wrap part of the component tree in `<Activity>` to control whether it is visible:

```js
import { Activity } from 'react';

<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Sidebar />
</Activity>
```

[See more examples below.](#usage)

#### Modes {/*modes*/}

An Activity boundary supports two modes:

- In `visible` mode, React renders the children, attaches their refs, and runs the setup functions for their `useEffect` and `useLayoutEffect` calls.
- In `hidden` mode, React hides the children, detaches their refs, and runs the cleanup functions for their `useEffect` and `useLayoutEffect` calls. React preserves their state and renders updates at a lower priority than updates to visible content.

When a hidden Activity boundary becomes visible, React reveals its children with their previous state and runs their Effect setup functions again.

In React DOM, hiding an Activity boundary applies `display: none` to the nearest DOM elements inside the boundary. React preserves those elements while the boundary remains mounted.

Insertion Effects created with [`useInsertionEffect`](/reference/react/useInsertionEffect) remain connected while an Activity boundary is hidden because styles may still be needed by the preserved DOM.

#### Props {/*props*/}

* `children`: The UI rendered by the Activity boundary. `children` can be any [React node](/reference/react/isValidElement#react-elements-vs-react-nodes).
* **optional** `mode`: Either `'visible'` or `'hidden'`. Defaults to `'visible'`. See [Modes](#modes) for the behavior of each value.
* **optional** `name`: A string that identifies the Activity boundary in React Developer Tools.

#### Caveats {/*caveats*/}

- Browser behavior associated with preserved DOM nodes can continue while the boundary is hidden. For example, audio and video can continue playing. Use an Effect cleanup function to stop this behavior. [See an example below.](#my-hidden-components-have-unwanted-side-effects)
- React omits text-only output while an Activity boundary is hidden because a text node cannot receive `display: none`. The text appears when the boundary becomes visible.
- If an Activity boundary is inside [`<ViewTransition>`](/reference/react/ViewTransition), changing it from hidden to visible as part of an update started with [`startTransition`](/reference/react/startTransition) activates the `enter` animation. Changing it from visible to hidden as part of that update activates the `exit` animation.

---

## Usage {/*usage*/}

Activity is useful when part of the UI may become hidden and visible again. Unlike conditional rendering, hiding an Activity boundary preserves both React state and the DOM state of its children. Unlike hiding content only with CSS, Activity also cleans up the children's Effects and deprioritizes their updates while they are hidden.

Use an Activity boundary when preserving that work is valuable—for example, for a tab the user is likely to revisit or a panel that can prepare data in the background. A hidden boundary retains its state and DOM nodes, so it continues using memory. If the content is unlikely to become visible again, conditionally rendering it may be preferable because unmounting allows React and the browser to release its resources.

### Preserving component state while content is hidden {/*restoring-the-state-of-hidden-components*/}

When this condition becomes false, React removes `<Sidebar>` from the tree and discards its state:

```js
{isShowingSidebar && <Sidebar />}
```

Render the component inside an Activity boundary to preserve its state while it is hidden:

```js
<Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
  <Sidebar />
</Activity>
```

In this example, expand the sidebar, hide it, and show it again. The expanded state is preserved.

<Sandpack>

```js
import { Activity, useState } from 'react';

export default function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

  return (
    <div className='layout'>
      <Activity
        mode={isShowingSidebar ? 'visible' : 'hidden'}
      >
        <Sidebar />
      </Activity>

      <main>
        <button
          aria-controls='documentation-sidebar'
          aria-expanded={isShowingSidebar}
          onClick={() => setIsShowingSidebar(showing => !showing)}
        >
          {isShowingSidebar ? 'Hide' : 'Show'} sidebar
        </button>
        <h1>Main content</h1>
      </main>
    </div>
  );
}

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav aria-label='Documentation' id='documentation-sidebar'>
      <button
        aria-controls='overview-sections'
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(expanded => !expanded)}
      >
        Overview
        <span aria-hidden='true' className='indicator'>
          {isExpanded ? '−' : '+'}
        </span>
      </button>

      {isExpanded && (
        <ul id='overview-sections'>
          <li>Section 1</li>
          <li>Section 2</li>
          <li>Section 3</li>
        </ul>
      )}
    </nav>
  );
}
```

```css
body {
  margin: 0;
}
.layout {
  display: flex;
  min-height: 275px;
}
nav {
  padding: 12px;
  background: #eee;
}
main {
  padding: 12px;
}
.indicator {
  margin-left: 6px;
}
```

</Sandpack>

Changing `mode` preserves the state of the children. Removing the boundary or changing a child's type, key, or position can [reset its state](/learn/preserving-and-resetting-state).

---

### Preserving state while navigating {/*preserving-state-while-navigating*/}

When this condition becomes false, React removes `<VideoList>` from the tree and discards its state:

```js
{selectedVideo === null && <VideoList />}
```

Render the component inside an Activity boundary to preserve its state while it is hidden:

```js
<Activity mode={selectedVideo === null ? 'visible' : 'hidden'}>
  <VideoList />
</Activity>
```

In this example, filter the video list, open a result, and then go back. The search text and filtered results are preserved because the list remains mounted inside the hidden Activity boundary.

<Sandpack>

```js
import { Activity, useState } from 'react';

const videos = [
  {
    id: 1,
    title: 'React Keynote',
    description: 'The latest news from the React team.',
  },
  {
    id: 2,
    title: 'Building with Actions',
    description: 'Handle mutations and pending states with Actions.',
  },
  {
    id: 3,
    title: 'Animating View Transitions',
    description: 'Create polished transitions between screens.',
  },
  {
    id: 4,
    title: 'Understanding Server Components',
    description: 'Render components ahead of time on the server.',
  },
];

export default function App() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <main>
      <Activity
        mode={selectedVideo === null ? 'visible' : 'hidden'}
      >
        <VideoList onSelect={setSelectedVideo} />
      </Activity>

      {selectedVideo !== null && (
        <VideoDetails
          onBack={() => setSelectedVideo(null)}
          video={selectedVideo}
        />
      )}
    </main>
  );
}

function VideoList({ onSelect }) {
  const [searchText, setSearchText] = useState('');
  const visibleVideos = videos.filter(video => {
    const text = `${video.title} ${video.description}`;
    return text.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <section>
      <h1>Videos</h1>
      <label htmlFor='search'>Search videos</label>
      <input
        id='search'
        onChange={event => setSearchText(event.target.value)}
        placeholder='Try "React"'
        type='search'
        value={searchText}
      />

      <ul className='videos'>
        {visibleVideos.map(video => (
          <li key={video.id}>
            <button onClick={() => onSelect(video)}>
              <strong>{video.title}</strong>
              <span>{video.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function VideoDetails({ video, onBack }) {
  return (
    <section>
      <button className='back' onClick={onBack}>
        Back
      </button>
      <div className='thumbnail' aria-hidden='true'>
        ▶
      </div>
      <h1>{video.title}</h1>
      <p>{video.description}</p>
    </section>
  );
}
```

```css
body {
  margin: 0;
  padding: 16px;
  font-family: system-ui;
}
main {
  max-width: 520px;
}
label,
input {
  display: block;
}
input {
  box-sizing: border-box;
  margin: 8px 0 16px;
  padding: 8px;
  width: 100%;
}
.videos {
  display: grid;
  gap: 8px;
  list-style: none;
  padding: 0;
}
.videos button {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  padding: 12px;
  text-align: left;
  width: 100%;
}
.videos strong,
.videos span {
  display: block;
}
.videos span {
  color: #555;
  margin-top: 4px;
}
.back {
  margin-bottom: 12px;
}
.thumbnail {
  align-items: center;
  aspect-ratio: 16 / 9;
  background: #282c34;
  border-radius: 8px;
  color: white;
  display: flex;
  font-size: 48px;
  justify-content: center;
}
```

</Sandpack>

The search field is controlled by `VideoList` state. Hiding the list preserves that React state when the user opens a video. The next example shows a different case: state stored by the browser in an uncontrolled field.

---

### Preserving DOM state while content is hidden {/*restoring-the-dom-of-hidden-components*/}

An Activity boundary also preserves state held by the browser in DOM nodes. This includes an uncontrolled input's current value, scroll position, and media playback position.

In this example, enter a draft in the Contact section, switch sections, and then return to Contact. The `<textarea>` value remains because its DOM node was hidden rather than removed.

<Sandpack>

```js
import { Activity, useState } from 'react';

export default function App() {
  const [activeSection, setActiveSection] = useState('contact');

  return (
    <>
      <div
        aria-label='Profile sections'
        className='section-buttons'
        role='group'
      >
        <SectionButton
          isActive={activeSection === 'home'}
          onClick={() => setActiveSection('home')}
        >
          Home
        </SectionButton>
        <SectionButton
          isActive={activeSection === 'contact'}
          onClick={() => setActiveSection('contact')}
        >
          Contact
        </SectionButton>
      </div>

      <Activity
        mode={activeSection === 'home' ? 'visible' : 'hidden'}
      >
        <Home />
      </Activity>
      <Activity
        mode={activeSection === 'contact' ? 'visible' : 'hidden'}
      >
        <Contact />
      </Activity>
    </>
  );
}

function SectionButton({ isActive, onClick, children }) {
  return (
    <button aria-pressed={isActive} onClick={onClick}>
      {children}
    </button>
  );
}

function Home() {
  return <p>Welcome to my profile!</p>;
}

function Contact() {
  return (
    <p>
      <label htmlFor='message'>Message</label>
      <textarea id='message' />
    </p>
  );
}
```

```css
.section-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
label,
textarea {
  display: block;
}
textarea {
  margin-top: 4px;
}
```

</Sandpack>

Preserving DOM state also means that DOM behavior can continue while content is hidden. See [Troubleshooting](#my-hidden-components-have-unwanted-side-effects) for DOM behavior that requires explicit cleanup.

---

### Pre-rendering content that is likely to become visible {/*pre-rendering-content-thats-likely-to-become-visible*/}

An Activity boundary can also prepare content before the user sees it. Content inside a hidden boundary renders at a lower priority without running Effects created with `useEffect` or `useLayoutEffect`. This lets the content load code and render-time data without delaying updates to visible content:

```js
<Suspense fallback={<Loading />}>
  <Activity mode={activeTab === 'posts' ? 'visible' : 'hidden'}>
    <Posts />
  </Activity>
</Suspense>
```

If `Posts` suspends while reading code or data, React continues rendering the rest of the page. If that hidden work completes, switching to the Posts tab can reveal the content without waiting for the same work again.

The following example renders the Posts tab in a hidden Activity boundary when the page first loads. Wait briefly before selecting **Posts**. The list is available immediately because the hidden render started loading it in the background.

<Sandpack>

```js src/App.js active
import { Activity, Suspense, use, useState } from 'react';
import { getPosts } from './data.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <div aria-label='Profile sections' role='group'>
        <button
          aria-pressed={activeTab === 'home'}
          onClick={() => setActiveTab('home')}
        >
          Home
        </button>
        <button
          aria-pressed={activeTab === 'posts'}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
      </div>

      <Suspense fallback={<h1>Loading posts...</h1>}>
        <Activity
          mode={activeTab === 'home' ? 'visible' : 'hidden'}
        >
          <Home />
        </Activity>
        <Activity
          mode={activeTab === 'posts' ? 'visible' : 'hidden'}
        >
          <Posts />
        </Activity>
      </Suspense>
    </>
  );
}

function Home() {
  return <p>Welcome to my profile!</p>;
}

function Posts() {
  const posts = use(getPosts());

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
let postsPromise;

export function getPosts() {
  if (!postsPromise) {
    postsPromise = loadPosts();
  }
  return postsPromise;
}

async function loadPosts() {
  // Add a delay so that pre-rendering is easier to observe.
  await new Promise(resolve => setTimeout(resolve, 1500));

  return Array.from({ length: 5 }, (_, index) => ({
    id: index,
    title: 'Post #' + (index + 1),
  }));
}
```

```css
button {
  margin-right: 8px;
}
```

</Sandpack>

If the user selects Posts before the hidden render finishes, the nearest Suspense fallback appears until the data is ready. Activity improves the likely case where the background work finishes first; it does not guarantee that the content will always be ready.

<Note>

Only code and data read during rendering can load during pre-rendering. Activity does not run Effects in hidden content, so data fetched inside an Effect does not load until the boundary becomes visible.

The data source must integrate with Suspense. For example, the component can read a cached Promise with [`use`](/reference/react/use). See [what activates a Suspense boundary](/reference/react/Suspense#what-activates-a-suspense-boundary).

</Note>

---

### Improving hydration performance {/*speeding-up-interactions-during-page-load*/}

Activity boundaries also divide server-rendered pages into units that React can hydrate independently. This is related to the selective hydration behavior of [`<Suspense>`](/reference/react/Suspense), but it does not require displaying a fallback in the initial UI.

For example, without a boundary React hydrates this page as one unit:

```js
function Page() {
  return (
    <>
      <Post />
      <Comments />
    </>
  );
}
```

Wrapping `Comments` in an always-visible Activity boundary creates a separate hydration unit:

```js
function Page() {
  return (
    <>
      <Post />
      <Activity>
        <Comments />
      </Activity>
    </>
  );
}
```

The boundary is visible because the `mode` prop defaults to `'visible'`. Its server-rendered HTML remains visible, but React can hydrate it independently from the surrounding page. If the user interacts with that content before React reaches it, React prioritizes hydrating the boundary.

You can also use visible and hidden Activity boundaries for tabbed content:

```js
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <button onClick={() => setActiveTab('home')}>
        Home
      </button>
      <button onClick={() => setActiveTab('video')}>
        Video
      </button>

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'video' ? 'visible' : 'hidden'}>
        <Video />
      </Activity>
    </>
  );
}
```

React does not include initially hidden `<Activity>` content in server-rendered HTML. On the client, React hydrates the visible content first and renders the hidden content later at a lower priority. Initially visible boundaries are included in the server-rendered HTML and can be hydrated independently. This allows the visible tab and the controls around it to become interactive without waiting for React to render the initially hidden tab.

---

## Troubleshooting {/*troubleshooting*/}

### My hidden components have unwanted side effects {/*my-hidden-components-have-unwanted-side-effects*/}

`<Activity>` hides DOM nodes without removing them. Browser-managed behavior from elements such as `<video>`, `<audio>`, and `<iframe>` can therefore continue while the boundary is hidden.

<Pitfall>

##### Preserved media can continue playing {/*preserved-media-can-continue-playing*/}

Unmounting a `<video>` element stops playback because the browser removes the DOM node. Hiding it with Activity preserves the node, so playback continues unless the component pauses it explicitly.

Add the corresponding cleanup to an Effect. For behavior that must stop at the same time React hides the boundary, use [`useLayoutEffect`](/reference/react/useLayoutEffect):

```js
import { useLayoutEffect, useRef } from 'react';

function VideoPlayer({ src }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const video = ref.current;

    return () => {
      video.pause();
    };
  }, []);

  return <video ref={ref} controls src={src} />;
}
```

React runs the cleanup when an enclosing Activity boundary becomes hidden. Because the `<video>` node remains in the DOM, its playback position is preserved for when the boundary becomes visible again.

The `useLayoutEffect` cleanup runs as part of hiding the UI. A cleanup from `useEffect` can run later if, for example, a Suspense boundary suspends or a View Transition is in progress.

This complete example pauses the video when you switch to Home while preserving its playback position. When you return to Video, playback can continue from the same position without recreating the element or downloading it again.

<Sandpack>

```js src/App.js active
import {
  Activity,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <div aria-label='Media sections' role='group'>
        <button
          aria-pressed={activeTab === 'home'}
          onClick={() => setActiveTab('home')}
        >
          Home
        </button>
        <button
          aria-pressed={activeTab === 'video'}
          onClick={() => setActiveTab('video')}
        >
          Video
        </button>
      </div>

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <p>Welcome home!</p>
      </Activity>
      <Activity mode={activeTab === 'video' ? 'visible' : 'hidden'}>
        <VideoPlayer />
      </Activity>
    </>
  );
}

function VideoPlayer() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const video = ref.current;

    return () => {
      video.pause();
    };
  }, []);

  return (
    <video
      aria-label='Big Buck Bunny video'
      controls
      playsInline
      ref={ref}
      src='https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4'
    />
  );
}
```

```css
button {
  margin-right: 8px;
}
video {
  aspect-ratio: 16 / 9;
  margin-top: 12px;
  max-width: 100%;
  width: 400px;
}
```

</Sandpack>

</Pitfall>

---

### My hidden components have Effects that are not running {/*my-hidden-components-have-effects-that-arent-running*/}

React runs cleanup functions for Effects created with `useEffect` and `useLayoutEffect` when an Activity boundary becomes hidden. It runs their setup functions again when the boundary becomes visible.

An Effect inside a hidden Activity boundary cannot remain active. Move ongoing work that must continue while the UI is hidden to a component outside the boundary, or keep the boundary visible.

If an Effect controls an external system, return a cleanup function so hiding the boundary disconnects from that system:

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();

  return () => {
    connection.disconnect();
  };
}, []);
```

Use [`<StrictMode>`](/reference/react/StrictMode) to find Effects that do not clean up correctly. Strict Mode performs an additional setup and cleanup cycle in development.
