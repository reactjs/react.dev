---
title: createPortal
---

<Intro>

Portals allow a component to render its children in a different part of the DOM.


```js
return createPortal(children, container)
```

</Intro>

<InlineToc />

---

## Usage {/*usage*/}

### Rendering to a different part of the DOM {/*rendering-to-a-different-part-of-the-dom*/}

Portals let you render part of your React tree into a different place in the DOM from where the rest of the tree is located. This lets a component escape from whatever containers it may be in — for example, a component can display a modal dialog or tooltip that appears above and outside of the rest of the page.

To create a portal, you return the result of `createPortal` from your component when it renders. You pass in the <CodeStep step={1}>elements you want to render as children</CodeStep> as well as a <CodeStep step={2}>DOM node where you want them to go</CodeStep>.

```js [[1, 5, "<>Some child elements</>"], [2, 6, "someExistingDOMNode"]]
import { createPortal } from 'react-dom';

function MyComponent({}) {
  return createPortal(
    <>Some child elements</>,
    someExistingDOMNode,
  );
}
```

React will put the rendered DOM nodes corresponding to the component's children into the DOM node that you specified instead of the part of the DOM where the component's parents are rendered. The DOM node can be anywhere in the DOM, including outside of where the React root is rendered.

All of the components' behavior is the same as if there were no portal: for example, context providers from the parent are still available in the child, and events still bubble up from children to parents.

<Pitfall>
It's important to make sure that your app is accessible when using portals. For instance, you may need to manage keyboard focus so that the user can move the focus in and out of the portal in a natural way. Follow the [WAI-ARIA Modal Authoring Practices](https://www.w3.org/WAI/ARIA/apg/#dialog_modal) when creating modals.
</Pitfall>

---

### Creating a modal {/*creating-a-modal*/}

You can use a portal to create a modal dialog that floats above the rest of the page, even if the component that summons the dialog is inside a container with `overflow: hidden` or other styles that would interfere with the dialog.

In this example, the two containers have styles that disrupt the modal dialog, but the one rendered into a portal is unaffected because, in the DOM, the modal is not contained within the elements rendered by its parents.

<Sandpack>

```js App.js active
import { ModalDemoWithoutPortals } from './ModalDemoWithoutPortals';
import { ModalDemoWithPortals } from './ModalDemoWithPortals';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <ModalDemoWithoutPortals  />
      </div>
      <div className="clipping-container">
        <ModalDemoWithPortals />
      </div>
    </>
  );
}

function ModalToggle({children}) {

}

```

```js ModalDemoWithoutPortals.js
import { useState } from 'react';
import { Modal } from './Modal';

export function ModalDemoWithoutPortals() {
  const [modalIsVisible, setModalIsVisible] = useState(false);

  return (
    <>
      <button onClick={() => setModalIsVisible(true)}>
        Show Modal Without Portal
      </button>
      {modalIsVisible && (
        <Modal onClose={() => setModalIsVisible(false)} />
      )}
    </>
  );
}
```

```js ModalDemoWithPortals.js
import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Modal } from './Modal';

export function ModalDemoWithPortals() {
  const [modalIsVisible, setModalIsVisible] = useState(false);

  return (
    <>
      <button onClick={() => setModalIsVisible(true)}>
        Show Modal With Portal
      </button>
      {modalIsVisible && (
        <ModalWithPortal onClose={() => setModalIsVisible(false)} />
      )}
    </>
  );
}

function ModalWithPortal({onClose}) {
  const [destination, setDestination] = useState(null);

  useLayoutEffect(() => {
    if (destination === null) {
      const domElement = document.createElement('div');
      document.body.insertBefore(
        domElement,
        document.body.lastElementChild.nextElementSibling,
      );
      setDestination(domElement);
    } else  {
      return () => {
        destination.remove();
      }
    }
  }, [destination])

  if (destination) {
    return createPortal(<Modal onClose={onClose} />, destination);
  } else {
    return null;
  }
}
```

```js Modal.js
export  function Modal({onClose}) {
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

In this example, the dialog contents are rendered into a DOM element that is appended to the document body whenever the modal appears and removed when the modal is dismissed.

---

### Rendering into server-rendered areas {/*rendering-into-server-rendered-areas*/}

Portals can be useful if your React root is only part of a static or server-rendered page. You can create areas of interactivity within static areas such as sidebars. Compared with having multiple separate React roots, this maintains one-way data flow and allows React to synchronize, batch, and prioritize updates across the whole page.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <h1>Welcome to my server-rendered app</h1>
    <div class="parent">
      <div class="sidebar">
        This part is static
        <div id="sidebar-portal"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```js
import { useRef } from 'react';
import { createPortal } from 'react-dom';

export default function App() {
  return (
    <>
      This part is the React root
      <SidebarPortal>
        This part is also rendered by React
      </SidebarPortal>
    </>
  );
}

function SidebarPortal({children}) {
  const destinationElement = useRef(null);
  function getDestinationElement() {
    if (destinationElement.current !== null) {
      return destinationElement.current;
    }
    const element = document.getElementById('sidebar-portal');
    destinationElement.current = element;
    return element;
  }
  return createPortal(children, getDestinationElement());
}
```

```js index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root'));
root1.render(<App />);
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
  height: 500px;
  margin-right: 12px;
}

#sidebar-portal {
  margin-top: 18px;
  display: block;
  background-color: white;
}
```

</Sandpack>

---

## Reference {/*reference*/}

### `createPortal(children, domNode)` {/*create-portal*/}

Return `createPortal` from a React component to cause its contents to be rendered into another part of the DOM. The shape of the React tree is unaffected: events will still bubble from the children to their parents, context providers are still passed from parents to children, and so on.

```js
return createPortal(
  <SomeElement />,
  someExistingDOMNode,
);
```

#### Parameters {/*parameters*/}

* `children`: Anything that can be rendered with React, such as a component element (e.g. `<SomeComponent/>`), host element (e.g. `<div/>`), fragment (`<></>`), string, or array of these.

* `domNode`: Some DOM node, such as those returned by `document.getElementById()`. The node must already exist.

#### Returns {/*returns*/}

`createPortal` returns a special element that can be returned from a React component. That component's children will be the children passed to `createPortal`, and they will be placed within the `domNode` passed to `createPortal` instead of inside the parent component.
