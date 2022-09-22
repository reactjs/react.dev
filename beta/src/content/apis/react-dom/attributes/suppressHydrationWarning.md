---
title: suppressHydrationWarning
---

<Intro>

React expects that the rendered content is identical between the server and the client. It can patch up differences in text content, but you should treat mismatches as bugs and fix them. In development mode, **React warns about mismatches during hydration**. There are no guarantees that attribute differences will be patched up in case of mismatches. This is important for performance reasons because, in most apps, mismatches are rare, so validating all markup would be prohibitively expensive.

If a single element’s attribute or text content is unavoidably different between the server and the client (for example, a timestamp), you may silence the warning by adding `suppressHydrationWarning={true}` to the element. It only works one level deep and is intended to be an escape hatch. Don’t overuse it. Unless it’s text content, React still won’t attempt to patch it up, so it may remain inconsistent until future updates.

</Intro>

<InlineToc />

## Usage {/*usage*/}

### Using the `suppressHydrationWarning` attribute {/*using-the-suppressHydrationWarning-attribute*/}

In this example, the `Current Date` is different between the server and the client. In this situation you may get [hydration mismatch warning.](/apis/react-dom/hydrate#avoiding-unavoidable-hydration-mismatches)

To silence hydration warnings on an element, add `suppresshydrationWarning={true}`:

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Current Date: 01/01/2020</h1></div>
```

```js index.js
import './styles.css';
import {hydrate} from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js active
export default function App() {
  return (
    <>
      <h1 suppressHydrationWarning={true}>
        Current Date: {new Date().toLocaleDateString()}
      </h1>
    </>
  );
}
```

</Sandpack>
