---
title: <StrictMode>
---


<Intro>

`StrictMode` is a component used to eagerly identify production issues in development.


```js
<StrictMode>
  <App />
</StrictMode>
```

</Intro>

<InlineToc />

---

## Usage {/*usage*/}

### Enabling strict mode for entire app {/*enabling-strict-mode-for-entire-app*/}

It's recommended to enable Strict Mode for your entire app where it is passed to `render`:

```js 
import {createRoot, StrictMode} from 'react';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <App/>
  </StrictMode>,
);
```

Strict Mode will enable additional development behaviors and warnings to all of its descendants in the component tree. These additional checks help catch issues in development before they happen in production, but do not run in production or change the behavior of your production app. Every Strict Mode check is designed to help you find problems early, before your users do.

<Note>

Strict mode checks are run in development mode only; *they do not impact the production build.*

</Note>

### Enabling strict mode for a part of the app {/*enabling-strict-mode-for-a-part-of-the-app*/}

You can also enable Strict Mode for any part of your application:

```js
import {StrictMode} from 'react';

function App() {
  return (
    <div>
      <Header />
      <StrictMode>
        <div>
          <ComponentOne />
          <ComponentTwo />
        </div>
      </StrictMode>
      <Footer />
    </div>
  );
}
```

In this example, Strict Mode checks will not be run against the `Header` and `Footer` components. However, `ComponentOne` and `ComponentTwo`, as well as all of their descendants, will have the checks.

### Fixing bugs discovered by double rendering {/*fixing-bugs-discovered-by-double-rendering*/}

TODO


### Fixing bugs discovered by re-running effects {/*fixing-bugs-discovered-by-re-running-effects*/}

TODO

### Fixing bugs with the legacy string ref API {/*fixing-bugs-with-the-legacy-string-ref-api*/}

TODO

### Fixing bugs with the legacy context API {/*fixing-bugs-with-the-legacy-context-api*/}

TODO

### Fixing bugs with unsafe lifecycle methods {/*fixing-bugs-with-unsafe-lifecycle-methods*/}

As explained in [this blog post](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html), certain legacy lifecycle methods are unsafe for use with concurrent React features. When Strict Mode is enabled, React compiles a list of all class components using the unsafe lifecycles, and logs a warning message with information about these components.

For example, the component below uses the `UNSAFE_componentWillMount` function to log when the component is mounted. This is a bug because after the component calls `UNSAFE_componentWillMount`, it suspends. When the data for suspense is ready, it renders and calls `UNSAFE_componentWillMount` again. This means the component logs "Mounted!" twice, even though it's only mounted once.

To see the issue, click "Show preview" below:

<Sandpack>

```js Preview.js active
import {Component, Suspense, lazy} from 'react';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

class Preview extends Component {
  UNSAFE_componentWillMount() {
    console.log('Mounted!');
  }

  render() {
    return (
      <>
        <h2>Preview</h2>
        <MarkdownPreview markdown={this.props.markdown} />
      </>
    );
  }
}

// Add a fixed delay so you can see the loading state
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}

export default Preview;
```

```js App.js
import { useState, Suspense } from 'react';
import Loading from './Loading.js';
import Preview from './Preview.js';

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Hello, **world**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Show preview
      </label>
      <hr />
      {showPreview && <Suspense fallback={<Loading />}><Preview markdown={markdown} /></Suspense>}
    </>
  );
}
```

```js Loading.js
export default function Loading() {
  return <p><i>Loading...</i></p>;
}
```

```js MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label {
  display: block;
}

input, textarea {
  margin-bottom: 10px;
}

body {
  min-height: 200px;
}
```

</Sandpack>

Fortunately, we're able to catch this issue early using Strict Mode which warns us:

<ConsoleBlock level="error">

<>
    <span>Warning: Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.</span>
    <br />
    <br />
    <span>Move code with side effects to componentDidMount, and set initial state in the constructor.</span>
    <br />
    <br />
    <span>Please update the following components: Preview</span>
</>

</ConsoleBlock>

Following the instructions in the error message and moving the `console.log` to `componentDidMount` fixes the issue. You can also fix the issue by re-writing the class component to hooks.

For more examples, check out [Migrating from Legacy Lifecycles](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles).

---


## Reference {/*reference*/}

### `StrictMode` {/*suspense*/}

Use `StrictMode` to enable additional development behaviors and warnings to all of its descendants in the component tree.

```js {5,7}
import { StrictMode } from 'react';

function App() {
  return (
    <StrictMode>
      <Component/>
    </StrictMode>
  )
}
```

[See examples above.](#usage)

#### Props {/*suspense-props*/}

- `StrictMode` accepts no props.

