---
id: addons
title: Add-Ons
permalink: docs/addons.html
---

> Note:
>
> `React.addons` entry point is deprecated as of React v15.5. The add-ons have moved to separate modules, and some of them have been deprecated.

The React add-ons are a collection of useful utility modules for building React apps. **These should be considered experimental** and tend to change more often than the core.

- [`createFragment`](/docs/create-fragment.html), to create a set of externally-keyed children.

The add-ons below are in the development (unminified) version of React only:

- [`Perf`](/docs/perf.html), a performance profiling tool for finding optimization opportunities.
- [`ReactTestUtils`](/docs/test-utils.html), simple helpers for writing test cases.

### Legacy Add-ons {#legacy-add-ons}

The add-ons below are considered legacy and their use is discouraged. They will keep working in observable future, but there is no further development.

- [`PureRenderMixin`](/docs/pure-render-mixin.html). Use [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) instead.
- [`shallowCompare`](/docs/shallow-compare.html), a helper function that performs a shallow comparison for props and state in a component to decide if a component should update. We recommend using [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) instead.
- [`update`](/docs/update.html). Use [`kolodny/immutability-helper`](https://github.com/kolodny/immutability-helper) instead.
- [`ReactDOMFactories`](https://www.npmjs.com/package/react-dom-factories), pre-configured DOM factories to make React easier to use without JSX.

### Deprecated Add-ons {#deprecated-add-ons}

- [`LinkedStateMixin`](/docs/two-way-binding-helpers.html) has been deprecated.
- [`TransitionGroup` and `CSSTransitionGroup`](/docs/animation.html) have been deprecated in favor of [their drop-in replacements](https://github.com/reactjs/react-transition-group/tree/v1-stable).

## Using React with Add-ons {#using-react-with-add-ons}

You can install the add-ons individually from npm (e.g. `npm install react-addons-create-fragment`) and import them:

```javascript
import createFragment from 'react-addons-create-fragment'; // ES6
var createFragment = require('react-addons-create-fragment'); // ES5 with npm
```

When using React 15 or earlier from a CDN, you can use `react-with-addons.js` instead of `react.js`:

```html
<script src="https://unpkg.com/react@15/dist/react-with-addons.js"></script>
```

The add-ons will be available via the `React.addons` global (e.g. `React.addons.TestUtils`).
