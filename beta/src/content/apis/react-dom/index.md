---
title: react-dom
---

<Intro>

The `react-dom` package contains methods that are only supported for the web applications (which run in the browser DOM environment). They are not supported for React Native.

</Intro>

<InlineToc />

---

## React DOM APIs {/*react-dom-apis*/}

These APIs can be imported from your components. They are rarely used:

* [`createPortal`](/apis/react-dom/createPortal) lets you render child components in a different part of the DOM tree.
* [`flushSync`](/apis/react-dom/flushSync) lets you force React to flush a state update and update the DOM synchronously.

---

## React DOM entry points {/*react-dom-entry-points*/}

The `react-dom` package provides two additional entry points:

* [`react-dom/client`](/apis/react-dom/client) contains APIs to render React components on the client (in the browser).
* [`react-dom/server`](/apis/react-dom/server) contains APIs to render React components on the server.

---

## Deprecated React DOM APIs {/*deprecated-react-dom-apis*/}

<Deprecated>

These APIs will be removed in a future major version of React.

</Deprecated>

* [`findDOMNode`](/apis/react-dom/findDOMNode) finds the closest DOM node corresponding to a class component instance.
* [`hydrate`](/apis/react-dom/hydrate) mounts a tree into the DOM created from server HTML. Deprecated in favor of [`hydrateRoot`](/apis/react-dom/client/hydrateRoot).
* [`render`](/apis/react-dom/render) mounts a tree into the DOM. Deprecated in favor of [`createRoot`](/apis/react-dom/client/createRoot).
* [`unmountComponentAtNode`](/apis/react-dom/unmountComponentAtNode) unmounts a tree from the DOM. Deprecated in favor of [`root.unmount()`.](/apis/react-dom/client/createRoot#root-unmount)

