---
title: unmountComponentAtNode
---

<Deprecated>

This API will be removed in a future major version of React.

In React 18, `unmountComponentAtNode` was replaced by [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount).

</Deprecated>

<Intro>

`unmountComponentAtNode` removes a mounted React component from the DOM.

```js
unmountComponentAtNode(domNode)
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `unmountComponentAtNode(domNode)` {/*unmountcomponentatnode*/}

Call `unmountComponentAtNode` to remove a mounted React component from the DOM and clean up its event handlers and state.

```js
import { unmountComponentAtNode } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);

unmountComponentAtNode(domNode);
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

* `domNode`: A [DOM element.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React will remove a mounted React component from this element.

#### Returns<Trans>반환값</Trans> {/*returns*/}

`unmountComponentAtNode` returns `true` if a component was unmounted and `false` otherwise.

---

## Usage<Trans>사용법</Trans> {/*usage*/}

Call `unmountComponentAtNode` to remove a <CodeStep step={1}>mounted React component</CodeStep> from a <CodeStep step={2}>browser DOM node</CodeStep> and clean up its event handlers and state.

```js [[1, 5, "<App />"], [2, 5, "rootNode"], [2, 8, "rootNode"]]
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const rootNode = document.getElementById('root');
render(<App />, rootNode);

// ...
unmountComponentAtNode(rootNode);
```


### Removing a React app from a DOM element {/*removing-a-react-app-from-a-dom-element*/}

Occasionally, you may want to "sprinkle" React on an existing page, or a page that is not fully written in React. In those cases, you may need to "stop" the React app, by removing all of the UI, state, and listeners from the DOM node it was rendered to.

In this example, clicking "Render React App" will render a React app. Click "Unmount React App" to destroy it:

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <button id='render'>Render React App</button>
    <button id='unmount'>Unmount React App</button>
    <!-- This is the React App node -->
    <div id='root'></div>
  </body>
</html>
```

```js index.js active
import './styles.css';
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const domNode = document.getElementById('root');

document.getElementById('render').addEventListener('click', () => {
  render(<App />, domNode);
});

document.getElementById('unmount').addEventListener('click', () => {
  unmountComponentAtNode(domNode);
});
```

```js App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>
