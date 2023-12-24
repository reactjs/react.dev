---
title: React DOM APIs
---

<Intro>

The `react-dom` package contains methods that are only supported for the web applications (which run in the browser DOM environment). They are not supported for React Native.

</Intro>

---

## APIs {/*apis*/}

These APIs can be imported from your components. They are rarely used:

* [`createPortal`](/reference/react-dom/createPortal) lets you render child components in a different part of the DOM tree.
* [`flushSync`](/reference/react-dom/flushSync) lets you force React to flush a state update and update the DOM synchronously.

---

## Entry points {/*entry-points*/}

The `react-dom` package provides two additional entry points:

* [`react-dom/client`](/reference/react-dom/client) contains APIs to render React components on the client (in the browser).
* [`react-dom/server`](/reference/react-dom/server) contains APIs to render React components on the server.

---

## Deprecated APIs {/*deprecated-apis*/}

<Deprecated>

These APIs will be removed in a future major version of React.

</Deprecated>

* [`findDOMNode`](/reference/react-dom/findDOMNode) finds the closest DOM node corresponding to a class component instance.
* [`hydrate`](/reference/react-dom/hydrate) mounts a tree into the DOM created from server HTML. Deprecated in favor of [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
* [`render`](/reference/react-dom/render) mounts a tree into the DOM. Deprecated in favor of [`createRoot`](/reference/react-dom/client/createRoot).
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) unmounts a tree from the DOM. Deprecated in favor of [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount).

