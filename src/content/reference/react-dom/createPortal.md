---
title: createPortal
---

<Intro>

`createPortal` lets you render some children into a different part of the DOM.


```js
<div>
  <SomeComponent />
  {createPortal(children, domNode)}
</div>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `createPortal(children, domNode)` {/*createportal*/}

To create a portal, call `createPortal`, passing some JSX, and the DOM node where it should be rendered:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>This child is placed in the parent div.</p>
  {createPortal(
    <p>This child is placed in the document body.</p>,
    document.body
  )}
</div>
```

[See more examples below.](#usage)

A portal only changes the physical placement of the DOM node. In every other way, the JSX you render into a portal acts as a child node of the React component that renders it. For example, the child can access the context provided by the parent tree, and events bubble up from children to parents according to the React tree.

#### Parameters {/*parameters*/}

* `children`: Anything that can be rendered with React, such as a piece of JSX (e.g. `<div />` or `<SomeComponent />`), a [Fragment](/reference/react/Fragment) (`<>...</>`), a string or a number, or an array of these.

* `domNode`: Some DOM node, such as those returned by `document.getElementById()`. The node must already exist. Passing a different DOM node during an update will cause the portal content to be recreated.

#### Returns {/*returns*/}

`createPortal` returns a React node that can be included into JSX or returned from a React component. If React encounters it in the render output, it will place the provided `children` inside the provided `domNode`.

#### Caveats {/*caveats*/}

* Events from portals propagate according to the React tree rather than the DOM tree. For example, if you click inside a portal, and the portal is wrapped in `<div onClick>`, that `onClick` handler will fire. If this causes issues, either stop the event propagation from inside the portal, or move the portal itself up in the React tree.

---

## Usage {/*usage*/}

### Rendering to a different part of the DOM {/*rendering-to-a-different-part-of-the-dom*/}

*Portals* let your components render some of their children into a different place in the DOM. This lets a part of your component "escape" from whatever containers it may be in. For example, a component can display a modal dialog or a tooltip that appears above and outside of the rest of the page.

To create a portal, render the result of `createPortal` with <CodeStep step={1}>some JSX</CodeStep> and the <CodeStep step={2}>DOM node where it should go</CodeStep>:

```js [[1, 8, "<p>This child is placed in the document body.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

React will put the DOM nodes for <CodeStep step={1}>the JSX you passed</CodeStep> inside of the <CodeStep step={2}>DOM node you provided</CodeStep>.

Without a portal, the second `<p>` would be placed inside the parent `<div>`, but the portal "teleported" it into the [`document.body`:](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

Notice how the second paragraph visually appears outside the parent `<div>` with the border. If you inspect the DOM structure with developer tools, you'll see that the second `<p>` got placed directly into the `<body>`:

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>This child is placed inside the parent div.</p>
      </div>
    ...
  </div>
  <p>This child is placed in the document body.</p>
</body>
```

A portal only changes the physical placement of the DOM node. In every other way, the JSX you render into a portal acts as a child node of the React component that renders it. For example, the child can access the context provided by the parent tree, and events still bubble up from children to parents according to the React tree.

---

### Rendering a modal dialog with a portal {/*rendering-a-modal-dialog-with-a-portal*/}

You can use a portal to create a modal dialog that floats above the rest of the page, even if the component that summons the dialog is inside a container with `overflow: hidden` or other styles that interfere with the dialog.

In this example, the two containers have styles that disrupt the modal dialog, but the one rendered into a portal is unaffected because, in the DOM, the modal is not contained within the parent JSX elements.

<Sandpack>

```js App.js active
import NoPortalExample from './NoPortalExample';
import PortalExample from './PortalExample';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <NoPortalExample  />
      </div>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}
```

```js NoPortalExample.js
import { useState } from 'react';
import ModalContent from './ModalContent.js';

export default function NoPortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal without a portal
      </button>
      {showModal && (
        <ModalContent onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

```js PortalExample.js active
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal using a portal
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

```js ModalContent.js
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>I'm a modal dialog</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```


```css styles.css
.clipping-container {
  position: relative;
  border: 1px solid #aaa;
  margin-bottom: 12px;
  padding: 12px;
  width: 250px;
  height: 80px;
  overflow: hidden;
}

.modal {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
  background-color: white;
  border: 2px solid rgb(240, 240, 240);
  border-radius: 12px;
  position:  absolute;
  width: 250px;
  top: 70px;
  left: calc(50% - 125px);
  bottom: 70px;
}
```

</Sandpack>

<Pitfall>

It's important to make sure that your app is accessible when using portals. For instance, you may need to manage keyboard focus so that the user can move the focus in and out of the portal in a natural way.

Follow the [WAI-ARIA Modal Authoring Practices](https://www.w3.org/WAI/ARIA/apg/#dialog_modal) when creating modals. If you use a community package, ensure that it is accessible and follows these guidelines.

</Pitfall>

---

### Rendering React components into non-React server markup {/*rendering-react-components-into-non-react-server-markup*/}

Portals can be useful if your React root is only part of a static or server-rendered page that isn't built with React. For example, if your page is built with a server framework like Rails, you can create areas of interactivity within static areas such as sidebars. Compared with having [multiple separate React roots,](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) portals let you treat the app as a single React tree with shared state even though its parts render to different parts of the DOM.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <h1>Welcome to my hybrid app</h1>
    <div class="parent">
      <div class="sidebar">
        This is server non-React markup
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js App.js active
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>This part is rendered by React</p>;
}

function SidebarContent() {
  return <p>This part is also rendered by React!</p>;
}
```

```css
.parent {
  display: flex;
  flex-direction: row;
}

#root {
  margin-top: 12px;
}

.sidebar {
  padding:  12px;
  background-color: #eee;
  width: 200px;
  height: 200px;
  margin-right: 12px;
}

#sidebar-content {
  margin-top: 18px;
  display: block;
  background-color: white;
}

p {
  margin: 0;
}
```

</Sandpack>

---

### Rendering React components into non-React DOM nodes {/*rendering-react-components-into-non-react-dom-nodes*/}

You can also use a portal to manage the content of a DOM node that's managed outside of React. For example, suppose you're integrating with a non-React map widget and you want to render React content inside a popup. To do this, declare a `popupContainer` state variable to store the DOM node you're going to render into:

```js
const [popupContainer, setPopupContainer] = useState(null);
```

When you create the third-party widget, store the DOM node returned by the widget so you can render into it:

```js {5-6}
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

This lets you use `createPortal` to render React content into `popupContainer` once it becomes available:

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>Hello from React!</p>,
      popupContainer
    )}
  </div>
);
```

Here is a complete example you can play with:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
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
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>Hello from React!</p>,
        popupContainer
      )}
    </div>
  );
}
```

```js map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export function createMapWidget(containerDomNode) {
  const map = L.map(containerDomNode);
  map.setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  return map;
}

export function addPopupToMapWidget(map) {
  const popupDiv = document.createElement('div');
  L.popup()
    .setLatLng([0, 0])
    .setContent(popupDiv)
    .openOn(map);
  return popupDiv;
}
```

```css
button { margin: 5px; }
```

</Sandpack>
