---
title: <Activity>
canary: true
---

<Wip>

**This API is experimental and is not available in a stable version of React yet.**

You can try it by upgrading React packages to the most recent experimental version:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Experimental versions of React may contain bugs. Don't use them in production.

</Wip>

<Intro>

`<Activity>` lets you hide and show part of the UI.


```js
<Activity mode={mode}>
  <Page />
</Activity>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<Activity>` {/*activity*/}

Wrap a part of the UI in `<Activity>` to manage its visibility state:

```js
import {unstableActivity as Activity} from 'react';

<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Page />
</Activity>
```

When "hidden", the `children` of `<Activity />` are not visible on the page. If a new `<Activity>` mounts as "hidden" then it pre-renders the content at lower priority without blocking the visible content on the page, but does not mount by creating effects. When a "visible" Activity switches to "hidden" it conceptually unmounts by destroying all the effects, but saves it's state. This allows fast switching between "visible" and "hidden" states without re-creating the state for a "hidden" Activity.

In the future, "hidden" Activities may automatically destroy state based on resources like memory.


<DeepDive>

#### How does `<Acivity>` work? {/*how-does-activity-work*/}

Under the hood...

</DeepDive>

#### Props {/*props*/}

* `children`: The actual UI you intend to render.
* **optional** `mode`: Either "visible" or "hidden". Defaults to "visible". When "hidden", updates to the children are deferred to lower priority. The component will not create effects until the Activity is switched to "visible". If a "visible" Activity switches to "hidden", the effects will be destroyed. 

#### Caveats {/*caveats*/}

- While hidden, the `children` of `<Activity>` are hidden on the page. 
- `<Activity>` will unmount all effects when switching from "visible" to "hidden" without destroying React or DOM state. This means effects that expect to only run "once" on "mount" will run again when switching from "hidden" to "visible". Conceptually, "hidden" Activities are unmounted, but they are not destroyed either. We recommend using [`<StrictMode>`](/reference/react/StrictMode) to catch any unexpected side-effects from this behavior.
- Parts of the UI wrapped in `<Activity mode="hidden">` are not included in the SSR response.
- When used with `<ViewTransition>`, hidden activities that reveal in a transition will activate an "enter" animation. Visible Activities hidden in a transition will activate an "exit" animation.

---

## Usage {/*usage*/}

### Pre-render part of the UI {/*pre-render-part-of-the-ui*/}

You can pre-render part of the UI using `<Activity mode="hidden">`:

```js [[1, 1, "Activity"], [1, 3, "Activity"], [2, 1, "mode"], [3, 1, "visible"], [4, 1, "hidden"]]
<Activity mode={tab === "posts" ? "visible" : "hidden"}>
  <PostsTab />
</Activity>
```

When an <CodeStep step={1}>Activity</CodeStep> is rendered with <CodeStep step={2}>mode</CodeStep> "hidden", the `children` are not visible on the page, but are rendered at lower prioirty than the visible content on the page. 

When the <CodeStep step={2}>mode</CodeStep> later switches to <CodeStep step={4}>visible</CodeStep>, the pre-rendered children will mount and become visible. This can be used to prepare parts of the UI the user is likely to interact with next to reduce loading times.

In the follow example from [`useTransition`](/reference/react/useTransition#preventing-unwanted-loading-indicators), the `PostsTab` component fetches some data using `use`. When you click the “Posts” tab, the `PostsTab` component suspends, causing the button loading state to appear:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```


```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function AboutTab() {
  return (
    <ViewTransition>
      <p>Welcome to my profile!</p>
    </ViewTransition>
  );
}
```

```js src/PostsTab.js hidden
import {use, unstable_ViewTransition as ViewTransition} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ViewTransition>
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
      </ViewTransition>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function ContactTab() {
  return (
    <ViewTransition>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </ViewTransition>
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
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

In this example, the user needs to wait for the posts to load when clicking on the "Posts" tab.

We can reduce the delay for the "Posts" tab by pre-rendering the inactive Tabs with a hidden `<Activity>`: 

<Sandpack>

```js
import { Suspense, useState, unstable_Activity as Activity } from "react";
import TabButton from "./TabButton.js";
import AboutTab from "./AboutTab.js";
import PostsTab from "./PostsTab.js";
import ContactTab from "./ContactTab.js";

export default function TabContainer() {
  const [tab, setTab] = useState("about");
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton isActive={tab === "about"} action={() => setTab("about")}>
        About
      </TabButton>
      <TabButton isActive={tab === "posts"} action={() => setTab("posts")}>
        Posts
      </TabButton>
      <TabButton isActive={tab === "contact"} action={() => setTab("contact")}>
        Contact
      </TabButton>
      <hr />
      <Activity mode={tab === "about" ? "visible" : "hidden"}>
        <AboutTab />
      </Activity>
      <Activity mode={tab === "posts" ? "visible" : "hidden"}>
        <PostsTab />
      </Activity>
      <Activity mode={tab === "contact" ? "visible" : "hidden"}>
        <ContactTab />
      </Activity>
    </Suspense>
  );
}
```


```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function AboutTab() {
  return (
    <ViewTransition>
      <p>Welcome to my profile!</p>
    </ViewTransition>
  );
}
```

```js src/PostsTab.js hidden
import {use, unstable_ViewTransition as ViewTransition} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ViewTransition>
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
      </ViewTransition>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function ContactTab() {
  return (
    <ViewTransition>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </ViewTransition>
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
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

---

## Troubleshooting {/*troubleshooting*/}

### TODO {/*troubleshooting-todo*/}
