---
title: ReactDOM Attributes
---

<Intro>

React implements a browser-independent DOM system for performance and cross-browser compatibility.

The ReactDOM attributes work diffrently from HTML DOM attributes. In React, all DOM properties and attributes (including event handlers) should be camelCased.

</Intro>

For example, the HTML attribute `tabindex` corresponds to the attribute `tabIndex` in React. The exception is `aria-*` and `data-*` attributes, which should be lowercased. For example, you can keep `aria-label` as `aria-label`.
