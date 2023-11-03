---
title: "'use client'"
titleForTitleTag: "'use client' directive"
canary: true
---

<Canary>

`'use client'` is needed only if you're [using React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) or building a library compatible with them.
</Canary>


<Intro>

`'use client'` lets you mark what code runs on the client.

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `'use client'` {/*use-client*/}

Add `'use client'` at the top of a file to mark the module and its transitive dependencies as client code.

```js {1}
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const date = formatDate(timestamp);
  // ...
  const editButton = <Button />;
  // ...
}
```

When a file marked with `'use client'` is imported from a Server Component, [compatible bundlers](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) will treat the module import as a boundary between server-run and client-run code.

As dependencies of `RichTextEditor`, `formatDate` and `Button` will also be evaluated on the client regardless of whether their modules contain a `'use client'` directive. Note that a single module may be evaluated on the server when imported from server code and on the client when imported from client code.

#### Caveats {/*caveats*/}

* `'use client'` must be at the very beginning of a file, above any imports or other code (comments are OK). They must be written with single or double quotes, but not backticks.
* When a `'use client'` module is imported from another client-rendered module, the directive has no effect.
* When a component module contains a `'use client'` directive, any usage of that component is guaranteed to be a Client Component. However, a component can still be evaluated on the client even if it does not have a `'use client'` directive.
	* A component usage is considered a Client Component if it is defined in module with `'use client'` directive or when it is a transitive dependency of a module that contains a `'use client'` directive. Otherwise, it is a Server Component.
* Code that is marked for client evaluation is not limited to components. All code that is a part of the client module sub-tree is sent to and run by the client.
* When a server evaluated module imports values from a `'use client'` module, the values must either be a React component or [supported serializable prop values](#passing-props-from-server-to-client-components) to be passed to a Client Component. Any other use case will throw an exception.

### How `'use client'` marks client code {/*how-use-client-marks-client-code*/}

In a React app, components are often split into separate files, or [modules](/learn/importing-and-exporting-components#exporting-and-importing-a-component).

For apps that use React Server Components, the app is server-rendered by default. `'use client'` introduces a server-client boundary in the [module dependency tree](/learn/understanding-your-ui-as-a-tree#the-module-dependency-tree), effectively creating a subtree of client modules.

To better illustrate this, consider the following React Server Components app.

<Sandpack>

```js App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js InspirationGenerator.js
'use client';

import { useState } from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = useState(0);
  const quote = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational quote is:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js inspirations.js
export default [
  "Don’t let yesterday take up too much of today.” — Will Rogers",
  "Ambition is putting a ladder against the sky.",
  "A joy that's shared is a joy made double.",
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

In the module dependency tree of this example app, the `'use client'` directive in `InspirationGenerator.js` marks that module and all of its transitive dependencies as client modules. The subtree starting at `InspirationGenerator.js` is now marked as client modules.

<Diagram name="use_client_module_dependency" height={250} width={545} alt="A tree graph with the top node representing the module 'App.js'. 'App.js' has three children: 'Copyright.js', 'FancyText.js', and 'InspirationGenerator.js'. 'InspirationGenerator.js' has two children: 'FancyText.js' and 'inspirations.js'. The nodes under and including 'InspirationGenerator.js' have a yellow background color to signify that this sub-graph is client-rendered due to the 'use client' directive in 'InspirationGenerator.js'.">
`'use client'` segments the module dependency tree of the React Server Components app, marking `InspirationGenerator.js` and all of its dependencies as client-rendered.
</Diagram>

During render, the framework will server-render the root component and continue through the [render tree](/learn/understanding-your-ui-as-a-tree#the-render-tree), opting-out of evaluating any code imported from client-marked code.

The server-rendered portion of the render tree is then sent to the client. The client, with its client code downloaded, then completes rendering the rest of the tree.

<Diagram name="use_client_render_tree" height={250} width={500} alt="A tree graph where each node represents a component and its children as child components. The top-level node is labelled 'App' and it has two child components 'InspirationGenerator' and 'FancyText'. 'InspirationGenerator' has two child components, 'FancyText' and 'Copyright'. Both 'InspirationGenerator' and its child component 'FancyText' are marked to be client-rendered.">
The render tree for the React Server Components app. `InspirationGenerator` and its child component `FancyText` are components exported from client-marked code and considered Client Components.
</Diagram>

We introduce the following definitions:

* **Client Components** are components in a render tree that are rendered on the client.
* **Server Components** are components in a render tree that are rendered on the server.

Working through the example app, `App`, `FancyText` and `Copyright` are all server-rendered and considered Server Components. As `InspirationGenerator.js` and its transitive dependencies are marked as client code, the component `InspirationGenerator` and its child component `FancyText` are Client Components.

<DeepDive>
#### How is `FancyText` both a Server and a Client Component? {/*how-is-fancytext-both-a-server-and-a-client-component*/}

By the above definitions, the component `FancyText` is both a Server and Client Component, how can that be?

First, let's clarify that the term "component" is not very precise. Here are just two ways "component" can be understood:

1. A "component" can refer to a **component definition**. In most cases this will be a function.

```js
// This is a definition of a component
function MyComponent() {
  return <p>My Component</p>
}
```

2. A "component" can also refer to a **component usage** of its definition.
```js
import MyComponent from './MyComponent';

function App() {
  // This is a usage of a component
  return <MyComponent />;
}
```

Often, the imprecision is not important when explaining concepts, but in this case it is.

When we talk about Server or Client Components, we are referring to component usages.

* If the component is defined in a module with a `'use client'` directive, or the component is imported and called in a Client Component, then the component usage is a Client Component.
* Otherwise, the component usage is a Server Component.


<Diagram name="use_client_render_tree" height={150} width={450} alt="A tree graph where each node represents a component and its children as child components. The top-level node is labelled 'App' and it has two child components 'InspirationGenerator' and 'FancyText'. 'InspirationGenerator' has two child components, 'FancyText' and 'Copyright'. Both 'InspirationGenerator' and its child component 'FancyText' are marked to be client-rendered.">A render tree illustrates component usages.</Diagram>

Back to the question of `FancyText`, we see that the component definition does _not_ have a `'use client'` directive and it has two usages.

The usage of `FancyText` as a child of `App`, marks that usage as a Server Component. When `FancyText` is imported and called under `InspirationGenerator`, that usage of `FancyText` is a Client Component as `InspirationGenerator` contains a `'use client'` directive.

This means that the component definition for `FancyText` will both be evaluated on the server and also downloaded by the client to render its Client Component usage.

</DeepDive>

<DeepDive>

#### Why is `Copyright` a Server Component? {/*why-is-copyright-a-server-component*/}

Because `Copyright` is rendered as a child of the Client Component `InspirationGenerator`, you might be surprised that it is a Server Component.

Recall that `'use client'` defines the boundary between server and client code on the _module dependency tree_, not the render tree.

<Diagram name="use_client_module_dependency" height={200} width={500} alt="A tree graph with the top node representing the module 'App.js'. 'App.js' has three children: 'Copyright.js', 'FancyText.js', and 'InspirationGenerator.js'. 'InspirationGenerator.js' has two children: 'FancyText.js' and 'inspirations.js'. The nodes under and including 'InspirationGenerator.js' have a yellow background color to signify that this sub-graph is client-rendered due to the 'use client' directive in 'InspirationGenerator.js'.">
`'use client'` defines the boundary between server and client code on the module dependency tree.
</Diagram>

In the module dependency tree, we see that `App.js` imports and calls `Copyright` from the `Copyright.js` module. As `Copyright.js` does not contain a `'use client'` directive, the component usage is rendered on the server. `App` is rendered on the server as it is the root component.

Client Components can render Server Components because you can pass JSX as props. In this case, `InspirationGenerator` receives `Copyright` as [children](/learn/passing-props-to-a-component#passing-jsx-as-children). However, the `InspirationGenerator` module never directly imports the `Copyright` module nor calls the component, all of that is done by `App`. In fact, the `Copyright` component is fully executed before `InspirationGenerator` starts rendering.

The takeaway is that a parent-child render relationship between components does not guarantee the same render environment.

</DeepDive>

### When to use `'use client'` {/*when-to-use-use-client*/}

With `'use client'`, you can determine when components are Client Components. As Server Components are default, here is a brief overview of the advantages and limitations to Server Components to determine when you need to mark something as client rendered.

For simplicity, we talk about Server Components, but the same principles apply to all code in your app that is server run.

#### Advantages of Server Components {/*advantages*/}
* Server Components can reduce the amount of code sent and run by the client. Only client modules are bundled and evaluated by the client.
* Server Components benefit from running on the server. They can access the local filesystem and may experience low latency for data fetches and network requests.

#### Limitations of Server Components {/*limitations*/}
* Server Components cannot support interaction as event handlers must be registered and triggered by a client.
	* For example, event handlers like `onClick` can only be defined in Client Components.
* Server Components cannot use most Hooks.
	* When Server Components are rendered, their output is essentially a list of components for the client to render. Server Components do not persist in memory after render and cannot have their own state.

### Serializable types returned by Server Components {/*serializable-types*/}

As in any React app, parent components pass data to child components. As they are rendered in different environments, passing data from a Server Component to a Client Component requires extra consideration.

Prop values passed from a Server Component to Client Component must be serializable.

Serializable props include:
* Primitives
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), only symbols registered in the global Symbol registry via [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Iterables containing serializable values
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) and [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* Plain [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): those created with [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), with serializable properties
* Functions that are [server actions](/reference/react/use-server)
* Client or Server Component elements (JSX)
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Notably, these are not supported:
* [Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) that are not exported from client-marked modules or marked with [`'use server'`](/reference/react/use-server)
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Objects that are instances of any class (other than the built-ins mentioned) or objects with [a null prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Symbols not registered globally, ex. `Symbol('my new symbol')`


## Usage {/*usage*/}

### Building with interactivity and state {/*building-with-interactivity-and-state*/}

<Sandpack>

```js App.js
'use client';

import { useState } from 'react';

export default function Counter({initialValue = 0}) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Count Value: {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}
```

</Sandpack>

As `Counter` requires both the `useState` hook and event handlers to increment or decrement the value, this component must be a Client Component and will require a `'use client'` directive at the top.

In contrast, a component that renders UI without interaction will not need to be a Client Component.

```js
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
  const initialValue = await readFile('/path/to/counter_value');
  return <Counter initialValue={initialValue} />
}
```

For example, `Counter`'s parent component, `CounterContainer`, does not require `'use client'` as it is not interactive and does not use state. In addition, `CounterContainer` must be a Server Component as it reads from the local file system on the server, which is possible only in a Server Component.

There are also components that don't use any server or client-only features and can be agnostic to where they render. In our earlier example, `FancyText` is one such component.

```js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

In this case, we don't add the `'use client'` directive, resulting in `FancyText`'s _output_ (rather than its source code) to be sent to the browser when referenced from a Server Component. As demonstrated in the earlier Inspirations app example, `FancyText` is used as both a Server or Client Component, depending on where it is imported and used.

But if `FancyText`'s HTML output was large relative to its source code (including dependencies), it might be more efficient to force it to always be a Client Component. Components that return a long SVG path string are one case where it may be more efficient to force a component to be a Client Component.

### Using client APIs {/*using-client-apis*/}

Your React app may use client-specific APIs, such as the browser's APIs for web storage, audio and video manipulation, and device hardware, among [others](https://developer.mozilla.org/en-US/docs/Web/API).

In this example, the component uses [DOM APIs](https://developer.mozilla.org/en-US/docs/Glossary/DOM) to manipulate a [`canvas`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) element. Since those APIs are only available in the browser, it must be marked as a Client Component.

```js
'use client';

import {useRef, useEffect} from 'react';

export default function Circle() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.reset();
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.stroke();
  });
  return <canvas ref={ref} />;
}
```

### Using third-party libraries {/*using-third-party-libraries*/}

Often in a React app, you'll leverage third-party libraries to handle common UI patterns or logic.

These libraries may rely on component Hooks or client APIs. Third-party components that use any of the following React APIs must run on the client:
* [createContext](/reference/react/createContext)
* [`react`](/reference/react/hooks) and [`react-dom`](/reference/react-dom/hooks) Hooks, excluding [`use`](/reference/react/use) and [`useId`](/reference/react/useId)
* [forwardRef](/reference/react/forwardRef)
* [memo](/reference/react/memo)
* [startTransition](/reference/react/startTransition)
* If they use client APIs, ex. DOM insertion or native platform views

If these libraries have been updated to be compatible with React Server Components, then they will already include `'use client'` markers of their own, allowing you to use them directly from your Server Components. If a library hasn't been updated, or if a component needs props like event handlers that can only be specified on the client, you may need to add your own Client Component file in between the third-party Client Component and your Server Component where you'd like to use it.

[TODO]: <> (Troubleshooting - need use-cases)