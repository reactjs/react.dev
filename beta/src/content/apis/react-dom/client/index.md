---
title: ReactDOMClient APIs
---

<Intro>

The ReactDOMClient APIs let you render React components in the browser.

</Intro>

Typically, you will use ReactDOM at the top level of your app to display your components. You will either use it directly or a [framework](/learn/start-a-new-react-project#building-with-react-and-a-framework) may do it for you. Most of your components should *not* need to import this module.

## Installation {/*installation*/}

<PackageImport>

<TerminalBlock>

npm install react-dom

</TerminalBlock>

```js
// Importing a specific API:
import { createRoot } from 'react-dom/client';

// Importing all APIs together:
import * as ReactDOMClient from 'react-dom/client';
```

</PackageImport>

You'll also need to install the same version of [React.](/apis/react)

## Browser Support {/*browser-support*/}

ReactDOM supports all popular browsers, including Internet Explorer 9 and above. [Some polyfills are required](TODO:/link-to-js-environment-requirements) for older browsers such as IE 9 and IE 10.


## Exports {/*exports*/}

<YouWillLearnCard title="createRoot" path="/apis/react-dom/client/createRoot">

Create and render a React root.

```js
const root = createRoot(domNode);
root.render(<App />);
```

</YouWillLearnCard>

<YouWillLearnCard title="hydrateRoot" path="/apis/react-dom/client/hydrateRoot">

Hydrate server-rendered HTML.

```js
hydrateRoot(domNode, <App />);
```

</YouWillLearnCard>

