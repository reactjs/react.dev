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

## Resource Preloading APIs {/*resource-preloading-apis*/}

These APIs can be used to make apps faster by pre-loading resources such as scripts, stylesheets, and fonts as soon as you know you need them, for example before navigating to another page where the resources will be used.

[React-based frameworks](/learn/start-a-new-react-project) frequently handle resource loading for you, so you might not have to call these APIs yourself. Consult your framework's documentation for details.

* [`prefetchDNS`](/reference/react-dom/prefetchDNS) lets you prefetch the IP address of a DNS domain name that you expect to connect to.
* [`preconnect`](/reference/react-dom/preconnect) lets you connect to a server you expect to request resources from, even if you don't know what resources you'll need yet.
* [`preload`](/reference/react-dom/preload) lets you fetch a stylesheet, font, image, or external script that you expect to use.
* [`preloadModule`](/reference/react-dom/preloadModule) lets you fetch an ESM module that you expect to use.
* [`preinit`](/reference/react-dom/preinit) lets you fetch and evaluate an external script or fetch and insert a stylesheet.
* [`preinitModule`](/reference/react-dom/preinitModule) lets you fetch and evaluate an ESM module.

---

## Entry points {/*entry-points*/}

The `react-dom` package provides two additional entry points:

* [`react-dom/client`](/reference/react-dom/client) contains APIs to render React components on the client (in the browser).
* [`react-dom/server`](/reference/react-dom/server) contains APIs to render React components on the server.

---

## Removed APIs {/*removed-apis*/}

These APIs were removed in React 19:

* [`findDOMNode`](https://18.react.dev/reference/react-dom/findDOMNode): see [alternatives](https://18.react.dev/reference/react-dom/findDOMNode#alternatives).
* [`hydrate`](https://18.react.dev/reference/react-dom/hydrate): use [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) instead.
* [`render`](https://18.react.dev/reference/react-dom/render): use [`createRoot`](/reference/react-dom/client/createRoot) instead.
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode): use [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount) instead.
* [`renderToNodeStream`](https://18.react.dev/reference/react-dom/server/renderToNodeStream): use [`react-dom/server`](/reference/react-dom/server) APIs instead.
* [`renderToStaticNodeStream`](https://18.react.dev/reference/react-dom/server/renderToStaticNodeStream): use [`react-dom/server`](/reference/react-dom/server) APIs instead.
