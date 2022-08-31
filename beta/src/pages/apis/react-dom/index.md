---
title: ReactDOM APIs
---

<Wip>

This section is incomplete, please see the old docs for [ReactDOM](https://reactjs.org/docs/react-dom.html).

</Wip>


<Intro>

The ReactDOM package lets you render React components on a webpage.

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

You'll also need to install the same version of [React](/apis/react).

## Browser Support {/*browser-support*/}

ReactDOM supports all popular browsers, including Internet Explorer 9 and above. [Some polyfills are required](http://todo%20link%20to%20js%20environment%20requirements/) for older browsers such as IE 9 and IE 10.

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

### Client APIs {/*clientapis*/}

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

### Server APIs {/*serverapis*/}

<YouWillLearnCard title="renderToPipeableStream" path="/apis/react-dom/server/renderToPipeableStream">

Render a React element to a pipeable stream.

```js
renderToPipeableStream(element, options)
```

</YouWillLearnCard>

<YouWillLearnCard title="renderToReadableStream" path="/apis/react-dom/server/renderToReadableStream">

Render a React element to a Readable stream.

```js
renderToReadableStream(element, options)
```

</YouWillLearnCard>

<YouWillLearnCard title="renderToNodeStream" path="/apis/react-dom/server/renderToNodeStream">

Render a React element to a Node stream.

```js
renderToNodeStream(element)
```

</YouWillLearnCard>

<YouWillLearnCard title="renderToStaticNodeStream" path="/apis/react-dom/server/renderToStaticNodeStream">

Render a React element to a static Node stream.

```js
renderToStaticNodeStream(element)
```

</YouWillLearnCard>

<YouWillLearnCard title="renderToString" path="/apis/react-dom/server/renderToString">

Render a React element to a string.

```js
renderToString(element)
```

</YouWillLearnCard>

<YouWillLearnCard title="renderToStaticMarkup" path="/apis/react-dom/server/renderToStaticMarkup">

Render a React element to static markup.

```js
renderToStaticMarkup(element)
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

This section is incomplete and is still being written!
