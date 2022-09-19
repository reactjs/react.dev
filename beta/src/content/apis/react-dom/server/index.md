---
title: ReactDOMServer APIs
---

<Wip>

This section is incomplete, please see the old docs for [ReactDOM.](https://reactjs.org/docs/react-dom.html)

</Wip>


<Intro>

The ReactDOMServer APIs let you render React components to HTML.

</Intro>

Typically, you will run ReactDOMServer on the server to generate your app's initial HTML. You will either use it directly or a [framework](/learn/start-a-new-react-project#building-with-react-and-a-framework) may do it for you. Most of your components should *not* need to import this module.

## Installation {/*installation*/}

<PackageImport>

<TerminalBlock>

npm install react-dom

</TerminalBlock>

```js
// Importing a specific API:
import { renderToPipeableStream } from 'react-dom/server';

// Importing all APIs together:
import * as ReactDOMServer from 'react-dom/server';
```

</PackageImport>

You'll also need to install the same version of [React.](/apis/react)

## Exports {/*exports*/}

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
