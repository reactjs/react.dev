---
id: cdn-links
title: CDN Links
permalink: docs/cdn-links.html
prev: add-react-to-an-existing-app.html
next: hello-world.html
---

The UMD builds of React and ReactDOM are available over a CDN.

```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
```

To load a specific version of `react` and `react-dom`, replace `16` with the version number.

The versions above are only meant for development, and are not suitable for production. Minified and optimized production versions of React are available at:

```html
<script crossorigin src="https://unpkg.com/react@16.3.1/umd/react.production.min.js" integrity="sha384-4srYLE+UG0buQNlOqH1tQBudzBUlBoEZg/fAtDaPfAzqmDXgZh9eFTPzzogPHlJB"></script>
<script crossorigin src="https://unpkg.com/react-dom@16.3.1/umd/react-dom.production.min.js" integrity="sha384-Vq1+LEQ/83klHUsvPZ6Ne+bJ4T8yD7CI+mwRttTijmqepzny/G7sdNiX7HFzIdPp"></script>
```

### Why the `crossorigin` Attribute?

If you serve React from a CDN, we recommend to keep the [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) attribute set:

```html
<script crossorigin src="..."></script>
```

We also recommend to verify that the CDN you are using sets the `Access-Control-Allow-Origin: *` HTTP header:

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

This enables a better [error handling experience](/blog/2017/07/26/error-handling-in-react-16.html) in React 16 and later.

### Why the `integrity` Attribute and Specific Version in Production?

> SRI is a new W3C specification that allows web developers to ensure that resources hosted on third-party servers have not been tampered with. Use of SRI is recommended as a best-practice, whenever libraries are loaded from a third-party source.
> Learn more about [how to use subresource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) on MDN.

\- https://www.srihash.org/

If you change the version of React, you will need to recalculate the SRI hash. You [can do this easily here](https://www.srihash.org/).
