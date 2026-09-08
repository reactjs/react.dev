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

- Browser behavior associated with preserved DOM nodes can continue while the boundary is hidden. For example, audio and video can continue playing. Use an Effect cleanup function to stop this behavior. [See an example below.](#my-hidden-component-keeps-playing-audio-or-video)
- React omits text-only output while an Activity boundary is hidden because a text node cannot receive `display: none`. The text appears when the boundary becomes visible.
- If an Activity boundary is inside [`<ViewTransition>`](/reference/react/ViewTransition), changing it from hidden to visible as part of an update started with [`startTransition`](/reference/react/startTransition) activates the `enter` animation. Changing it from visible to hidden as part of that update activates the `exit` animation.

---

## Usage {/*usage*/}

Activity is useful when part of the UI may become hidden and visible again. Unlike conditional rendering, hiding an Activity boundary preserves both React state and the DOM state of its children. Unlike hiding content only with CSS, Activity also cleans up the children's Effects and deprioritizes their updates while they are hidden.

Use an Activity boundary when hidden content is likely to become visible again, such as a tab the user may revisit or a panel that can prepare data in the background. A hidden boundary retains its state and DOM nodes, so it continues using memory. If the content is unlikely to become visible again, conditionally rendering it may be preferable because unmounting allows React and the browser to release its resources.

### Preserving component state while content is hidden {/*restoring-the-state-of-hidden-components*/}

With conditional rendering, React removes `<Sidebar>` from the tree when `isShowingSidebar` becomes `false` and discards its state:

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

```js src/App.js active
import { Activity, useState } from 'react';
import Sidebar from './Sidebar.js';

export default function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

  return (
    <div className="layout">
      <Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
        <Sidebar />
      </Activity>

      <main>
        <button
          aria-controls="documentation-sidebar"
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
```

```js src/Sidebar.js hidden
import { useState } from 'react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav aria-label="Documentation" id="documentation-sidebar">
      <button
        aria-controls="overview-sections"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(expanded => !expanded)}
      >
        Overview
        <span aria-hidden="true" className="indicator">
          {isExpanded ? '−' : '+'}
        </span>
      </button>

      {isExpanded && (
        <ul id="overview-sections">
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
main h1 {
  margin-top: 12px;
}
.indicator {
  margin-left: 6px;
}
```

</Sandpack>

Changing `mode` preserves the state of the children. Removing the boundary or changing a child's type, key, or position can [reset its state](/learn/preserving-and-resetting-state).

---

### Preserving DOM state while content is hidden {/*restoring-the-dom-of-hidden-components*/}

An Activity boundary also preserves state held by the browser in DOM nodes.

For example, enter a draft in the contact form, hide it, and then show it again. The `<textarea>` value remains because its DOM node was hidden rather than removed.

<Sandpack>

```js
import { Activity, useState } from 'react';

export default function App() {
  const [isShowingContact, setIsShowingContact] = useState(true);

  return (
    <>
      <button onClick={() => setIsShowingContact(showing => !showing)}>
        {isShowingContact ? 'Hide' : 'Show'} contact form
      </button>
      <Activity mode={isShowingContact ? 'visible' : 'hidden'}>
        <p>
          <label htmlFor="message">Message</label>
          <textarea id="message" />
        </p>
      </Activity>
    </>
  );
}
```

```css
label,
textarea {
  display: block;
}
textarea {
  margin-top: 4px;
}
```

</Sandpack>

The current value of an uncontrolled field belongs to its DOM node rather than React state. Activity preserves the node, so the value remains available when the boundary becomes visible again.

Activity also preserves other browser-managed state, such as scroll position and media playback position. In this example, play the video, hide it, and then show it again. When you play it again, the video continues from the same position.

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';
import VideoPlayer from './VideoPlayer.js';

export default function App() {
  const [isShowingVideo, setIsShowingVideo] = useState(true);

  return (
    <>
      <button onClick={() => setIsShowingVideo(showing => !showing)}>
        {isShowingVideo ? 'Hide' : 'Show'} video
      </button>
      <Activity mode={isShowingVideo ? 'visible' : 'hidden'}>
        <VideoPlayer />
      </Activity>
    </>
  );
}
```

```js src/VideoPlayer.js hidden
import { useLayoutEffect, useRef } from 'react';

export default function VideoPlayer() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const video = ref.current;
    return () => video.pause();
  }, []);

  return (
    <div className="video-player">
      <button onClick={() => ref.current.play()}>Play</button>
      <button onClick={() => ref.current.pause()}>Pause</button>
      <video ref={ref} width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}
```

```css
.video-player {
  margin-top: 10px;
}
.video-player button {
  margin-right: 10px;
}
.video-player video {
  display: block;
  margin-top: 10px;
}
```

</Sandpack>

The ref provides access to the `<video>` DOM node; it does not store the playback position. The `useLayoutEffect` cleanup pauses the video when the boundary becomes hidden. Activity preserves the DOM node and its playback position, but React detaches the ref while the boundary is hidden and reconnects it when the boundary becomes visible. See [Troubleshooting](#my-hidden-component-keeps-playing-audio-or-video) for more about cleaning up browser-managed behavior.

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

If `Posts` suspends while reading code or data, React continues rendering the rest of the page. If the hidden work finishes before the user selects Posts, React can reveal it without showing the Suspense fallback. Otherwise, the nearest fallback appears until the code or data is ready.

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

### My hidden component keeps playing audio or video {/*my-hidden-component-keeps-playing-audio-or-video*/}

`<Activity>` hides DOM nodes without removing them. Browser-managed behavior from elements such as `<video>`, `<audio>`, and `<iframe>` can therefore continue while the boundary is hidden.

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

The video example above includes this cleanup while demonstrating that Activity preserves the `<video>` element's playback position.

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
