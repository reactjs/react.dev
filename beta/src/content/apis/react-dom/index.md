---
title: ReactDOM APIs
---

<Wip>

This section is incomplete, please see the old docs for [ReactDOM.](https://reactjs.org/docs/react-dom.html)

</Wip>


<Intro>

The ReactDOM package provides DOM-specific methods that your components can import.

</Intro>

Most of your components should *not* need to import this module.

## Installation {/*installation*/}

<PackageImport>

<TerminalBlock>

npm install react-dom

</TerminalBlock>

```js
// Importing a specific API:
import { createPortal } from 'react-dom';

// Importing all APIs together:
import * as ReactDOM from 'react-dom';
```

</PackageImport>

You'll also need to install the same version of [React.](/apis/react)

## Exports {/*exports*/}

### Portals {/*portals*/}

<YouWillLearnCard title="createPortal" path="/apis/react-dom/createPortal">

Create a portal.

```js
createPortal(child, container);
```

</YouWillLearnCard>

### Flushing {/*flushing*/}

<YouWillLearnCard title="flushSync" path="/apis/react-dom/flushSync">

Flush in progress updates.

```js
flushSync(() => {
  // ...
});
```

</YouWillLearnCard>

### Deprecated {/*deprecated*/}

<YouWillLearnCard title="render" path="/apis/react-dom/render">

Displays a React component inside a browser DOM node (deprecated).

```js
render(<App />, document.getElementById('root'));
```

</YouWillLearnCard>

<YouWillLearnCard title="hydrate" path="/apis/react-dom/hydrate">

Hydrate server-rendered HTMl (deprecated).

```js
hydrate(<App />, document.getElementById('root'));
```

</YouWillLearnCard>

## Entry points {/*entry-points*/}

<YouWillLearnCard title="ReactDOMClient APIs" path="/apis/react-dom/client">

The ReactDOMClient APIs let you render React components in the browser.

```js
import * as ReactDOMClient from 'react-dom/client';
```

</YouWillLearnCard>

<YouWillLearnCard title="ReactDOMServer APIs" path="/apis/react-dom/server">

The ReactDOMServer APIs let you render React components to HTML.

```js
import * as ReactDOMServer from 'react-dom/server';
```

</YouWillLearnCard>
