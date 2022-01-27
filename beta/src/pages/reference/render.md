---
title: render()
---

<Intro>

`render` renders a piece of [JSX](/learn/writing-markup-with-jsx) ("React element") into a browser DOM container node. It instructs React to change the DOM inside of the `container` so that it matches the passed JSX.

```js
render(<App />, container);
render(<App />, container, callback);
```

</Intro>

## Rendering the root component {/*rendering-the-root-component*/}

To call `render`, you need a piece of JSX and a DOM container:

<APIAnatomy>

<AnatomyStep title="React element">

The UI you want to render.

</AnatomyStep>

<AnatomyStep title="DOM container">

The DOM node you want to render your UI into. The container itself isn’t modified, only its children are.

</AnatomyStep>

```js [[1, 2, "<App />"], [2, 2, "container"]]
const container = document.getElementById('root');
render(<App />, container);
```

</APIAnatomy>

In apps fully built with React, you will do this once at the top level of your app--to render the "root" component.

<Sandpack>

```js index.js active
import './styles.css';
import {render} from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

```js App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>

<br />

## Rendering multiple roots {/*rendering-multiple-roots*/}

If you use ["sprinkles"](/learn/add-react-to-a-website) of React here and there, call `render` for each top-level piece of UI managed by React.

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
import { render } from 'react-dom';
import { Comments, Navigation } from './Components.js';

render(
  <Navigation />,
  document.getElementById('navigation')
);

render(
  <Comments />,
  document.getElementById('comments')
);
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

<br />

## Updating the rendered tree {/*updating-the-rendered-tree*/}

You can call `render` more than once on the same DOM node. As long as the component tree structure matches up with what was previously rendered, React will [preserve the state](/learn/preserving-and-resetting-state). Notice how you can type in the input:

<Sandpack>

```js index.js active
import {render} from 'react-dom';
import App from './App.js';

let i = 0;
setInterval(() => {
  render(
    <App counter={i} />,
    document.getElementById('root')
  );
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

You can destroy the rendered tree with [`unmountComponentAtNode()`](TODO).

<br />

## When not to use it {/*when-not-to-use-it*/}

* If your app uses server rendering and generates HTML on the server, use [`hydrate`](TODO) instead of `render`.
* If your app is fully built with React, you shouldn't need to use `render` more than once. If you want to render something in a different part of the DOM tree (for example, a modal or a tooltip), use [`createPortal`](TODO) instead.

<br />


## Behavior in detail {/*behavior-in-detail*/}

The first time you call `render`, any existing DOM elements inside `container` are replaced. If you call `render` again, React will update the DOM as necessary to reflect the latest JSX. React will decide which parts of the DOM can be reused and which need to be recreated by ["matching it up"](/learn/preserving-and-resetting-state) with the previously rendered tree. Calling `render` repeatedly is similar to calling `setState`--in both cases, React avoids unnecessary DOM updates.

You can pass a callback as the third argument. React will call it after your component is in the DOM.

If you render `<MyComponent />`, and `MyComponent` is a class component, `render` will return the instance of that class. In all other cases, it will return `null`.
