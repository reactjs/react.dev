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

Portals let you render part of your React tree into a different place in the DOM from where the rest of the tree is located. This lets a component escape from whatever containers it may be in — for example, a component can display a modal dialog that appears above and outside of the rest of the page.

To create a portal, you return the result of `createPortal` from your component when it renders. You pass in the elements you want to render as children as well as a DOM node where you want them to go.

```js
import { createPortal } from 'react-dom';

function MyComponent({}) {
  return createPortal(
    <>
      Some children elements
    </>,
    someExistingDOMNode,
  );
}
```

React will now put the rendered DOM nodes corresponding to the component's children into the DOM node that you specified instead of the part of the DOM where the component's parents are rendered. The DOM node can be anywhere in the DOM, including outside of where the React root is rendered.

All of the components' behavior is the same as if there were no portal: for example, context providers from the parent are still available in the child, and events still bubble up from children to the parent.

<Pitfall>
It's important to make sure that your app is accessible when using portals. For instance, you may need to manage keyboard focus so that the user can move the focus in and out of the portal in a natural way. Follow the [WAI-ARIA Modal Authoring Practices](https://www.w3.org/WAI/ARIA/apg/#dialog_modal) when creating modals.
</Pitfall>

### Creating a modal {/*creating-a-modal*/}

You can use a portal to create a modal dialog that floats above the rest of the page, even if the component that summons the dialog is inside a container with `overflow: hidden` or other styles that would interfere with the dialog.

In this example, the two containers have styles that disrupt the modal dialog, but the one rendered into a portal is unaffected because, in the DOM, the modal is not contained within the elements rendered by its parents.

<Sandpack>

```js App.js active
import { DialogDemoWithoutPortals } from './DialogDemoWithoutPortals';
import { DialogDemoWithPortals } from './DialogDemoWithPortals';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <DialogDemoWithoutPortals  />
      </div>
      <div className="clipping-container">
        <DialogDemoWithPortals />
      </div>
    </>
  );
}

function DialogToggle({children}) {

}

```

```js DialogDemoWithoutPortals.js
import { useState } from 'react';
import { Dialog } from './Dialog';

export function DialogDemoWithoutPortals() {
  const [dialogIsVisible, setDialogIsVisible] = useState(false);

  return (
    <>
      <button onClick={() => setDialogIsVisible(true)}>
        Show Dialog Without Portal
      </button>
      {dialogIsVisible && (
        <Dialog onClose={() => setDialogIsVisible(false)} />
      )}
    </>
  );
}
```

```js DialogDemoWithPortals.js
import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Dialog } from './Dialog';

export function DialogDemoWithPortals() {
  const [dialogIsVisible, setDialogIsVisible] = useState(false);

  return (
    <>
      <button onClick={() => setDialogIsVisible(true)}>
        Show Dialog With Portal
      </button>
      {dialogIsVisible && (
        <DialogWithPortal onClose={() => setDialogIsVisible(false)} />
      )}
    </>
  );
}

function DialogWithPortal({onClose}) {
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
    return createPortal(<Dialog onClose={onClose} />, destination);
  } else {
    return null;
  }
}
```

```js Dialog.js
export  function Dialog({onClose}) {
  return (
    <div className="modal">
      <div>I'm a modal dialog</div>
      <button onClick={onClose} className="close">Close</button>
    </div>
  );
}
```

```css styles.css
.parent {
  /* position: relative; */
  /* width: 300px; */
  /* height: 300px; */
}

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

.close {
  /* margin: 12px; */
}
```

</Sandpack>

### Creating a tooltip {/*creating-a-tooltip*/}

You can use a portal to create a tooltip that hovers above the rest of the page, even if the anchor for the tooltip is inside a container with `overflow: hidden` or the like.

<Sandpack>

```js App.js active
import { useState, useEffect } from 'react';
import {createPortal} from 'react-dom';

export default function TooltipApp() {
  return (
    <div className="parent">
      <div className="clipping-container">
        <TooltipWithoutPortal>
          Hover for tooltip (without portal)
        </TooltipWithoutPortal>
      </div>

{/*      <div className="clipping-container">
        <TooltipWithPortal>
          Hover for tooltip (without portal)
        </TooltipWithPortal>
      </div>*/}
    </div>
  );
}

function TooltipWithoutPortal({children}) {
  const [tooltipIsVisible, setTooltipIsVisible] = useState(false);

  function showTooltip() {
    setTooltipIsVisible(true);
  }

  return (
    <>
      <div onClick={showTooltip}>
        {children}
      </div>
      {tooltipIsVisible && (
        <div>
          Tooltip contents
        </div>
      )}
    </>
  );
}

function TooltipWithPortal({children}) {

}
```

</Sandpack>


---

## Reference {/*reference*/}

### `flushSync(callback)` {/*create-root*/}

Call `flushSync` to force React to flush any pending work and update the DOM synchronously.

```js
flushSync(() => {
  setState(true);
});
```

Most of the time, `flushSync` can be avoided. Use `flushSync` as last resort.

[See examples above.](#usage)

#### Parameters {/*parameters*/}


* `callback`: A function. React will immediately call this callback and flush any updates it contains synchronously. It may also flush any pending updates, or Effects, or updates inside of Effects. If an update suspends as a result of this `flushSync` call, the fallbacks may be re-shown.

#### Returns {/*returns*/}

`flushSync` returns `undefined`.

#### Caveats {/*caveats*/}

* `flushSync` can significantly hurt performance. Use sparingly.
* `flushSync` may force pending Suspense boundaries to show their `fallback` state.
* `flushSync` may run pending effects and synchronously apply any updates they contain before returning.
* `flushSync` may flush updates outside the callback when necessary to flush the updates inside the callback. For example, if there are pending updates from a click, React may flush those before flushing the updates inside the callback.
