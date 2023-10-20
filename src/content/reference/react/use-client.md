---
title: "'use client'"
canary: true
---

<Canary>

`'use client'` is needed only if you're [using React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) or building a library compatible with them.
</Canary>


<Intro>

`'use client'` marks which components render on the client.

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `'use client'` {/*use-client*/}

Add `'use client'` at the top of a file to mark the code to be evaluated on the client.

```js {1}
'use client';

import { useState } from 'react';

export default function RichTextEditor(props) {
  // ...
```

When a file marked with `'use client'` is imported from a Server Component, [compatible bundlers](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) will treat the module import as a boundary between server-run and client-run code.

<DeepDive>

#### Client and Server Rendering with React Server Components {/*client-and-server-rendering-with-react-server-components*/}

React's full-stack architecture vision is realized through the React Server Components (RSC) specification.

React Server Components lets you coordinate which components of your [render tree](/learn/understanding-your-ui-as-a-tree#the-render-tree) are rendered on the server or on the client. Server rendering is traditionally more performant and allows access to the back-end, while client rendering is necessary for adding interactivity into your components.

To use React Server Components, you need to use a compatible [React framework](/learn/start-a-new-react-project#bleeding-edge-react-frameworks). These frameworks will render your app on the server by default, unless specified otherwise.

`'use client'` is how we tell the React framework which component should be rendered on the client. We call components that render on the client, Client Components and server-rendered components, Server Components.

</DeepDive>

### Marking client code with `'use client'` {/*marking-client-components-with-use-client*/}

In a React app, components are often split into separate files, or [modules](/learn/importing-and-exporting-components#exporting-and-importing-a-component). 

For apps that use React Server Components, the app is server-rendered by default. `'use client'` marks which modules in the [module dependency tree](/learn/understanding-your-ui-as-a-tree#the-module-dependency-tree) are downloaded and evaluated on the client. When a server-rendered module imports a `'use client'` module, the `use client` module and all its transitive dependencies will be run on the client.

To better illustrate this, consider the following React Server Component app and its render and module dependency tree. 

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

import * as React from 'react';
import quotes from './quotes';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const quote = quotes[index];
  const next = () => setIndex((index + 1) % quotes.length);

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

```js quotes.js
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

<Diagram name="use_client_module_dependency" height={250} width={545} alt="A tree graph with the top node representing the module 'App.js'. 'App.js' has three children: 'Copyright.js', 'FancyText.js', and 'InspirationGenerator.js'. 'InspirationGenerator.js' has two children: 'FancyText.js' and 'inspirations.js'. The nodes under and including 'InspirationGenerator.js' have a yellow background color to signify that this sub-graph is client-rendered due to the 'use client' directive in 'InspirationGenerator.js'.">
`'use client'` segments the module dependency tree of the React Server Components app to mark `InspirationGenerator.js` and any of its dependencies as client-rendered.
</Diagram>

In the module dependency tree of the example app, the `'use client'` directive in `InspirationGenerator.js` marks that module and all of its transitive dependencies as client code. Only client-marked code will be bundled, downloaded and evaluated by the client.

Irregardless if a module exports a component, like `inspirations.js`, if a module is transitive dependency of a `'use client'` module, then it will only be evaluated on the client. 

In rendering, the framework will server-render the root component and continue through the [render tree](/learn/understanding-your-ui-as-a-tree#the-render-tree), opting-out of evaluating any code imported from client-marked code. 

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

1. A "component" can refer to a **component definition**.

```
// This is a definition of a component
function MyComponent() {
	return <p>My Component</p>
}
```

2. A "component" can also refer to a **component usage** of a definition. 
```
import MyComponent from './MyComponent';

function App() {
	// This is a usage of a component
	return <MyComponent />;
}
```

Often, the imprecision is not important when explaining concepts, but in this case it is.

When we talk about Server or Client Components, we are referring to component usages. Where a component is imported and used determines if it is a Server or Client Component, with one notable exception.

* If the component is imported and used in a Client Component, then the component usage is a Client Component.
* If the component is imported and used in a Server Component, then the component usage is a Server Component. 

The exception is if a component is defined in a module with a `'use client'` directive. In that case, regardless of where the component is imported and used, every component usage will be a Client Component. 

Looking back to the question of `FancyText`, it's now clear that a render tree is a tree of component usages. 

<Diagram name="use_client_render_tree" height={150} width={450} alt="A tree graph where each node represents a component and its children as child components. The top-level node is labelled 'App' and it has two child components 'InspirationGenerator' and 'FancyText'. 'InspirationGenerator' has two child components, 'FancyText' and 'Copyright'. Both 'InspirationGenerator' and its child component 'FancyText' are marked to be client-rendered.">A render tree is a tree of component usages.</Diagram>

The usage of `FancyText` as a child of `App`, marks that usage as a Server Component as root components are always Server Components. When `FancyText` is imported and used under `InspirationGenerator`, that usage of `FancyText` is a Client Component. 

This also means that the component definition for `FancyText` will both be evaluated on the server and also be downlaoded by the client to render its Client Component usage.

</DeepDive>

<DeepDive>

#### Why is `Copyright` a Server Component? {/*why-is-copyright-a-server-component*/}

`Copyright` is a Server Component because it is imported and used by the Server Component `App`. 

This may be unintuitive as `Copyright` is a child component of `InspirationGenerator`, which is a Client Component. 

This is because `InspirationGenerator` accepts [JSX as children props](/learn/passing-props-to-a-component#passing-jsx-as-children) but the actual import and usage of the component occurs within `App`, a Server Component, because it is a root component.

In a module dependency tree, a node that represents a module with a `'use client'` will mark every descendent node to be client-run -- however the same is not true for a Client Component in a render true.

</DeepDive>


### Passing props from Server to Client Components {/*passing-props-from-server-to-client-components*/}

As in any React app, parent components pass data to child components. As they are rendered in different environments, passing data from a Server Component to a Client Component requires extra consideration.

Prop values passed from a Server Component to Client Component must be serializable.

[TODO]: <> (Link to use server docs)

Serializable props include:
* Primitives
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), only symbols registered in the global Symbol registry via [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Iterables
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
* Plain [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), those created with [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), with serializable properties
* Client or Server Components
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Notably, these are not supported:
* [Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) that are not exported from client-marked modules or marked with `'use server'`
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Objects that are not an instance of [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), or [null-prototype objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Symbols not registered globally, ex. `Symbol('my new symbol')`

#### Caveats {/*caveats*/}

* `'use client'` must be at the very beginning of a file, above any imports or other code (comments are OK). They must be written with single or double quotes, but not backticks. 
* When a `'use client'` module is imported from another client-rendered module, the directive has no effect.
* When a component module contains a `'use client'` directive, any usage of that component is guaranteed to be a Client Component. However, a component can still be evaluated on the client even if it does not have a `'use client'` directive.
	* A component usage is considered a Client Component if it is defined in module with `'use client'` directive or it is a transitive dependency of a module that contains a `'use client'` directive. Otherwise, it is a Server Component. 
* Code that is marked for client evaluation is not limited to components. All code that is a part of the client module sub-tree is sent to and run by the client.
* When a server evaluated module imports values from a `'use client'` module, the values must either be a React component or [supported serializable prop values](#passing-props-from-server-to-client-components) to be passed to a Client Component. Any other use case will throw an exception.


## Usage {/*usage*/}

<Wip>
This section is a work in progress.

This API can be used in any framework that supports React Server Components. You may find additional documentation from them.
* [Next.js documentation](https://nextjs.org/docs/getting-started/react-essentials)
* More coming soon
</Wip>
