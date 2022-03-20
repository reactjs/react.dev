---
id: javascript-environment-requirements
title: JavaScript Environment Requirements
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 18 depends on modern browser features including [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set).

If you support older browsers and devices which do not provide a native microtask-based Promise implementation such as Internet Explorer, we recommend you stay with React 17, because microtasks cannot be polyfilled without impacting performance in React 18.  

To support older browsers which do not include `Map` or `Set`, consider using [core-js](https://github.com/zloirock/core-js):

```js
import 'core-js/es/map';
import 'core-js/es/set';

import React from 'react';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<h1>Hello, world!</h1>);
```

React also depends on `requestAnimationFrame` (even in test environments).  
You can use the [raf](https://www.npmjs.com/package/raf) package to shim `requestAnimationFrame`:

```js
import 'raf/polyfill';
```
