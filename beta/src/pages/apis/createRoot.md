---
title: createRoot
---

<Intro>

`createRoot` creates an object ("React root") that is able to render a piece of [JSX](/learn/writing-markup-with-jsx) ("React node") into a browser DOM node.

```js
const root = createRoot(domNode, options);
root.render(<App />);
```

</Intro>

- [Usage](#usage)
  - [Rendering a root component](#rendering-a-root-component)
  - [Rendering multiple roots](#rendering-multiple-roots)
  - [Updating a root component](#updating-a-root-component)
- [Reference](#reference)
  - [`createRoot(domNode, options?)`](#create-root)
  - [`root.render(reactNode)`](#root-render)
  - [`root.unmount()`](#root-unmount)

---

## Usage {/*usage*/}

Call `createRoot` to create a React root for a <CodeStep step={1}>browser DOM node</CodeStep>.

Then call `render` to display a <CodeStep step={2}>React component</CodeStep>.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import {createRoot} from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
````

Using `createRoot()` to hydrate a server-rendered container is not supported. Use [`hydrateRoot()`](/apis/hydrateRoot) instead.

<Note>

In apps fully built with React, **you will usually only create one "root", once at startup for your entire app**. If you use a framework, it might do this call for you.

</Note>

### Rendering a root component {/*rendering-a-root-component*/}
A React "root" is an object that wraps a DOM node and allows you to display a "root component" inside it.

Once a root is created, you can use it to display a root component using [`root.render`](#root-render).

<Sandpack>

```js index.js active
import './styles.css';
import {createRoot} from 'react-dom/client';
import App from './App.js';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(<App />);
```

```js App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>

Usually, you shouldn't need to call [`root.render`](#root-render) again or to call it in more places. From this point on, React will manage the DOM of your application. If you want to update the UI, your components can do this by [using state](/apis/usestate).

---

### Rendering multiple roots {/*rendering-multiple-roots*/}

If your page [isn't fully built with React](/learn/add-react-to-a-website), you can call `createRoot` multiple times to create a root for each top-level piece of UI managed by React. You can display different content in each root by calling [`root.render`](#root-render).

<Sandpack>

```html public/index.html
<nav id="navigation"></nav>
<main>
  <p>This paragraph is not rendered by React (open index.html to verify).</p>
  <section id="comments"></section>
</main>
```

```js index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode); 
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode); 
commentRoot.render(<Comments />);
```

```js Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Comments</h2>
      <Comment text="Hello!" author="Sophie" />
      <Comment text="How are you?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

You can destroy the rendered trees with [`root.unmount`](#root-unmount).

---

### Updating a root component {/*updating-a-root-component*/}

You can call `render` more than once on the same root. As long as the component tree structure matches up with what was previously rendered, React will [preserve the state](/learn/preserving-and-resetting-state). Notice how you can type in the input, which means that the updates from repeated `render` calls every second in this example are not destructive:

<Sandpack>

```js index.js active
import {createRoot} from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js App.js
export default function App({counter}) {
  return (
    <>
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

</Sandpack>

It is uncommon to call `render` multiple times. Usually, you'll [update state](/apis/usestate) inside one of the components instead.

---
## Reference {/*reference*/}

### `createRoot(domNode, options?)` {/*create-root*/}

Call `createRoot` to create a React root for displaying content inside a browser DOM element.

```js
const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React will create a root for the `domNode`, and take over managing the DOM inside it.

An app fully built with React will usually only have one `createRoot` call with its root component.  A page that uses "sprinkles" of React for parts of the page may have as many `render` calls as needed.

[See examples above.](#usage)

#### Parameters {/*parameters*/}


* `domNode`: A [DOM element](https://developer.mozilla.org/en-US/docs/Web/API/Element). React will create a root for this DOM element and allow you to call functions on it such as `render` to display rendered React content.

* **optional** `options`: A object contain options for this React root.

  * `onRecoverableError`: optional callback called when React automatically recovers from errors.
  * `identifierPrefix`: optional prefix React uses for ids generated by `React.useId`. Useful to avoid conflicts when using multiple roots on the same page. Must be the same prefix used on the server.

#### Returns {/*returns*/}

`createRoot` returns an object with two methods: [`render`](#root-render) and [`unmount`](#root-unmount).

#### Caveats {/*caveats*/}
* `createRoot()` controls the contents of the container node you pass in. Any existing DOM elements inside are replaced when render is called. Later calls use React’s DOM diffing algorithm for efficient updates.
* `createRoot()` does not modify the container node (only modifies the children of the container). It may be possible to insert a component to an existing DOM node without overwriting the existing children.
* If your app is server-rendered, using `createRoot()` is not supported. Use [`hydrateRoot()`](/apis/react-dom/client/hydrateRoot) instead.
* You'll likely have only one `createRoot` call in your app. If you use a framework, it might do this call for you.
* When you want to render a piece of JSX in a different part of the DOM tree that isn't a child of your component (for example, a modal or a tooltip), use [`createPortal`](/apis/react-dom/createPortal) instead of `createRoot`.

---

### `root.render(reactNode)` {/*root-render*/}

Call `root.render` to display a piece of [JSX](/learn/writing-markup-with-jsx) ("React node") into the React root's browser DOM node.

```js
root.render(<App />);
```

React will display `<App />` in the `root`, and take over managing the DOM inside it.

[See examples above.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: A *React node* that you want to display. This will usually be a piece of JSX like `<App />`, but you can also pass a React element constructed with [`createElement()`](/apis/react/createElement), a string, a number, `null`, or `undefined`.


#### Returns {/*returns*/}

`root.render` returns `undefined`.

#### Caveats {/*caveats*/}

* The first time you call `root.render`, React will clear all the existing HTML content inside the React root before rendering the React component into it.

* If your root's DOM node contains HTML generated by React on the server or during the build, use [`hydrateRoot()`](/apis/react-dom/client/hydrateRoot) instead, which attaches the event handlers to the existing HTML.

* If you call `render` on the same root more than once, React will update the DOM as necessary to reflect the latest JSX you passed. React will decide which parts of the DOM can be reused and which need to be recreated by ["matching it up"](/learn/preserving-and-resetting-state) with the previously rendered tree. Calling `render` on the same root again is similar to calling the [`set` function](/apis/usestate#setstate) on the root component: React avoids unnecessary DOM updates.

---

### `root.unmount()` {/*root-unmount*/}

Call `root.unmount` to destroy a rendered tree inside a React root.

```js
root.unmount();
```

An app fully built with React will usually not have any calls to `root.unmount`.

For pages that use React for parts of the page, it may be necessary to remove DOM nodes that React controls from the page. When removing those DOM nodes, you need to tell React to "stop" managing the content inside it by calling `root.unmount`.

Calling `root.unmount` will unmount all the components in the root and "detach" React from the root DOM node, including removing any event handlers or state in the tree. 


#### Parameters {/*parameters*/}

`root.unmount` does not accept any parameters.


#### Returns {/*returns*/}

`render` returns `null`.

#### Caveats {/*caveats*/}

* Calling `root.unmount` will unmount all the components in the tree and "detach" React from the root DOM node.

* Once you call `root.unmount` you cannot call `root.render` again on the root. Attempting to call `root.render` on an unmounted root will throw a "Cannot update an unmounted root" error.

---
