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

- In `visible` mode, React renders the children and runs the setup functions for
  their `useEffect` and `useLayoutEffect` calls.
- In `hidden` mode, React hides the children and runs the cleanup functions for
  their `useEffect` and `useLayoutEffect` calls. React preserves their state and
  renders updates at a lower priority than updates to visible content.

When a hidden Activity boundary becomes visible, React reveals its children with
their previous state and runs their Effect setup functions again.

In React DOM, hiding an Activity boundary applies `display: none` to the nearest
DOM elements inside the boundary. React preserves those elements while the
boundary remains mounted.

#### Props {/*props*/}

* `children`: The UI rendered by the Activity boundary. `children` can be any
  [React node](/reference/react/isValidElement#react-elements-vs-react-nodes).
* **optional** `mode`: Either `'visible'` or `'hidden'`. Defaults to `'visible'`.
  See [Modes](#modes) for the behavior of each value.
* **optional** `name`: A string that identifies the Activity boundary in React
  Developer Tools.

#### Caveats {/*caveats*/}

- Hiding an Activity boundary retains its state and DOM nodes, so React does not
  reclaim all memory associated with the hidden subtree.
- Browser behavior associated with preserved DOM nodes can continue while the
  boundary is hidden. For example, audio and video can continue playing. Use an
  Effect cleanup function to stop this behavior.
  [See an example below.](#my-hidden-components-have-unwanted-side-effects)
- React runs cleanup functions for Effects created with `useEffect` and
  `useLayoutEffect` when an Activity boundary becomes hidden. Insertion Effects
  created with
  [`useInsertionEffect`](/reference/react/useInsertionEffect)
  remain connected because styles may still be needed by the preserved DOM.
- React detaches refs in a hidden Activity boundary and reattaches them when the
  boundary becomes visible.
- Content initially rendered inside `<Activity mode="hidden">` is not included in
  server-rendered HTML. React renders it on the client at a lower priority after
  hydrating visible content.
- React omits text-only output while an Activity boundary is hidden because a text
  node cannot receive `display: none`. The text appears when the boundary becomes
  visible.
- If an Activity boundary is inside
  [`<ViewTransition>`](/reference/react/ViewTransition),
  changing it from hidden to visible as part of an update started with
  [`startTransition`](/reference/react/startTransition) activates the `enter`
  animation. Changing it from visible to hidden as part of that update activates
  the `exit` animation.

---

## Usage {/*usage*/}

### Preserving state while content is hidden {/*restoring-the-state-of-hidden-components*/}

When this condition becomes false, React removes `<Sidebar>` from the tree and
discards its state:

```js
{isShowingSidebar && <Sidebar />}
```

Render the component inside an Activity boundary to preserve its state while it is
hidden:

```js
<Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
  <Sidebar />
</Activity>
```

In this example, expand the sidebar, hide it, and show it again. The expanded state
is preserved.

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
          onClick={() => setIsShowingSidebar(s => !s)}
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
    <nav
      aria-label='Documentation'
      id='documentation-sidebar'
    >
      <button
        aria-controls='overview-sections'
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(e => !e)}
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

Changing `mode` preserves the state of the children. Removing the boundary or
changing a child's type, key, or position can
[reset its state](/learn/preserving-and-resetting-state).

---

### Preserving DOM state while content is hidden {/*restoring-the-dom-of-hidden-components*/}

An Activity boundary also preserves state held by the browser in DOM nodes. This
includes an uncontrolled input's current value, scroll position, and media
playback position.

In this example, enter a draft in the Contact section, switch sections, and then
return to Contact. The `<textarea>` value remains because its DOM node was hidden
rather than removed.

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

Preserving DOM state also means that DOM behavior can continue while content is
hidden. See [Troubleshooting](#my-hidden-components-have-unwanted-side-effects)
for DOM behavior that requires explicit cleanup.

---

### Pre-rendering content that is likely to become visible {/*pre-rendering-content-thats-likely-to-become-visible*/}

Content inside a hidden Activity boundary renders at a lower priority without
running Effects created with `useEffect` or `useLayoutEffect`. This allows the
content to begin loading code and render-time data before it becomes visible:

```js
<Suspense fallback={<Loading />}>
  <Activity mode={activeTab === 'posts' ? 'visible' : 'hidden'}>
    <Posts />
  </Activity>
</Suspense>
```

If `Posts` suspends while reading code or data, React continues rendering the rest
of the page. If that hidden work completes, switching to the Posts tab can reveal
the content without waiting for the same work again.

<Note>

Only code and data read during rendering can load during pre-rendering. Activity
does not run Effects in hidden content, so data fetched inside an Effect does not
load until the boundary becomes visible.

The data source must integrate with Suspense. For example, the component can read a
cached Promise with [`use`](/reference/react/use). See
[what activates a Suspense boundary](/reference/react/Suspense#what-activates-a-suspense-boundary).

</Note>

<DeepDive>

#### How does `<Activity>` affect server rendering and hydration? {/*speeding-up-interactions-during-page-load*/}

React does not include initially hidden `<Activity>` content in server-rendered HTML.
On the client, React hydrates the visible content first and renders the hidden
content later at a lower priority.

For initially visible `<Activity>` boundaries, React includes the content in the
server-rendered HTML but can hydrate the boundary independently from surrounding
content. If the user interacts with the boundary before hydration reaches it,
React prioritizes hydrating that boundary.

An always-visible `<Activity>` boundary lets React hydrate that subtree
independently:

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

</DeepDive>

---

## Troubleshooting {/*troubleshooting*/}

### My hidden components have unwanted side effects {/*my-hidden-components-have-unwanted-side-effects*/}

`<Activity>` hides DOM nodes without removing them. Browser-managed behavior from
elements such as `<video>`, `<audio>`, and `<iframe>` can therefore continue while
the boundary is hidden.

<Pitfall>

##### Preserved media can continue playing {/*preserved-media-can-continue-playing*/}

Add the corresponding cleanup to an Effect. For behavior that must stop when React
hides the boundary, use [`useLayoutEffect`](/reference/react/useLayoutEffect):

```js
import { useLayoutEffect, useRef } from 'react';

function VideoPlayer({ src, captions }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const video = ref.current;

    return () => {
      video.pause();
    };
  }, []);

  return (
    <video ref={ref} controls src={src}>
      <track
        default
        kind='captions'
        src={captions}
        srcLang='en'
      />
    </video>
  );
}
```

React runs the cleanup when an enclosing Activity boundary becomes hidden. Because
the `<video>` node remains in the DOM, its playback position is preserved for when
the boundary becomes visible again.

The `useLayoutEffect` cleanup runs as part of hiding the UI. A cleanup from
`useEffect` can run later if, for example, a Suspense boundary suspends or a View
Transition is in progress.

</Pitfall>

---

### My hidden components have Effects that are not running {/*my-hidden-components-have-effects-that-arent-running*/}

React runs cleanup functions for Effects created with `useEffect` and
`useLayoutEffect` when an Activity boundary becomes hidden. It runs their setup
functions again when the boundary becomes visible.

An Effect inside a hidden Activity boundary cannot remain active. Move ongoing
work that must continue while the UI is hidden to a component outside the boundary,
or keep the boundary visible.

If an Effect controls an external system, return a cleanup function so hiding the
boundary disconnects from that system:

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();

  return () => {
    connection.disconnect();
  };
}, []);
```

Use [`<StrictMode>`](/reference/react/StrictMode) to find Effects that do not clean
up correctly. Strict Mode performs an additional setup and cleanup cycle in
development.
