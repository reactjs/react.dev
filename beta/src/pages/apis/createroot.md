---
title: createRoot
---

<Intro>

`createRoot` create a root to render or unmount.

```js
createRoot(container, options?)
```

</Intro>

- [Usage](#usage)
  - [Rendering the root component](#rendering-the-root-component)
  - [Rendering multiple roots](#rendering-multiple-roots)
- [Reference](#reference)
  - [`createRoot(container, options?)`](#createroot)

---

## Usage {/*usage*/}

Create a React root for the supplied container and return the root. The root can be used to render a React element into the DOM with `render`:

```js
const root = createRoot(container);
root.render(element);
````

### Rendering the root component {/*rendering-the-root-component*/}

In apps fully built with React, **you will usually only do this once at startup**--to render the "root" component.

<Sandpack>

```js index.js active
import './styles.css';
import {createRoot} from 'react-dom/client';
import App from './App.js';

const container = document.getElementById('root')
const root = createRoot(container);
root.render(<App />);
```

```js App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>

Usually you shouldn't need to call `render` again or to call it in more places. From this point on, React will be managing the DOM of your application. If you want to update the UI, your components can do this by [using state](/apis/usestate).

---

### Rendering multiple roots {/*rendering-multiple-roots*/}

If your page [isn't fully built with React](/learn/add-react-to-a-website), call `render` for each top-level piece of UI managed by React.

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

const navContainer = document.getElementById('navigation')
const navRoot = createRoot(navContainer);
navRoot.render(<Navigation />);

const commentsContainer = document.getElementById('comments')
const commentsRoot = createRoot(commentsContainer);
commentsRoot.render(<Comments />);
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

You can destroy the rendered trees with `unmount()`.

---

## Reference {/*reference*/}

### `createRoot(container, options?)` {/*createroot*/}

Call `createRoot` to create a React root for the supplied container and return the root. 

```js
const root = createRoot(container);
// ...
```

[See examples above.](#usage)

#### Parameters {/*parameters*/}

<!-- * `reactNode`: A *React node* that you want to display. This will usually be a piece of JSX like `<App />`, but you can also pass a React element constructed with [`createElement()`](/TODO), a string, a number, `null`, or `undefined`.  -->

* `container`: A [DOM element](https://developer.mozilla.org/en-US/docs/Web/API/Element). React will display the `element` you pass inside the `render` method. From this moment, React will manage the DOM inside the `container` and update it when your React tree changes.

* **optional** `options`: An object.

#### Returns {/*returns*/}

`render` and `unmount` method.

---