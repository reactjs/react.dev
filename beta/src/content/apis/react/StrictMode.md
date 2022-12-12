---
title: <StrictMode>
---


<Intro>

`StrictMode` is a component used to eagerly identify production bugs in development.


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

React is designed around the concept of [keeping components pure](/learn/keeping-components-pure). React assumes that every component you write is a pure function. This means that React components you write must always return the same JSX given the same inputs.

Making sure every component is pure can be difficult. Strict Mode can help find these bugs in development by automatically double invoking these functions:

- Function component bodies
- State updater functions (the first argument to setState)
- Functions passed to useState, useMemo, or useReducer 
- Class component `constructor`, `render`, and `shouldComponentUpdate` methods
- Class component `static getDerivedStateFromProps` method

For example, the component below contains a bug which causes the component to render too many "Create Story" cards. This also causes a console error that two children have the same key "create":

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = '1'

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Note>

In React 17, React automatically modifies the console methods like `console.log()` to silence the logs in the second call to lifecycle functions. However, it may cause undesired behavior in certain cases where [a workaround can be used](https://github.com/facebook/react/issues/20090#issuecomment-715927125).

Starting from React 18, React does not suppress any logs. However, if you have React DevTools installed, the logs from the second call will appear slightly dimmed. React DevTools also offers a setting (off by default) to suppress them completely.

</Note>

This bug happens because the `StoryTray` function is not pure. By calling `push` on the received stories array (a prop!), it is mutating an object that was created before `StoryTray` started rendering.

If we shipped this bug to production, every update in the app would cause more "Create Story" cards to be created and users would report the bug. Strict Mode helps us find this bug in development by automatically re-rendering the component so we can see that multiple "Create Story" cards are created before we ship the change.

The simplest fix is to not touch the array at all, and render “Create Story” separately.

See the challenges section of [Keeping Components Pure](/learn/keeping-components-pure) for a full solution.

### Fixing bugs discovered by re-running effects {/*fixing-bugs-discovered-by-re-running-effects*/}

Strict Mode can also help find bugs in effects.

For example, the component below contains a bug that connects to a chat room multiple times without disconnecting. This Effect only runs on mount, so you might expect "✅ Connecting..." to be printed once in the console. However, if you check the console, "✅ Connecting..." gets printed twice.

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

It's printed twice because Strict Mode automatically unmounts and remounts components in development, but this simulation is exposing a real bug that users will hit in production.

To understand the production bug, imagine the `ChatRoom` component is a part of a larger app with many different screens. The user starts their journey on the `ChatRoom` page. The component mounts and calls `connection.connect()`. Then imagine the user navigates to another screen—for example, to the Settings page. The `ChatRoom` component unmounts. Finally, the user clicks Back and `ChatRoom` mounts again. This would set up a second connection—but the first connection was never destroyed!

If we shipped this bug to production, then as the user navigates across the app, the connections would keep piling up and we would get reports for real production bugs. Strict Mode helps us find is bug early, before users see them, by automatically simulating the production user behavior of navigating away from a component and back.

To fix the issue, return a cleanup function from your Effect.

See the [Adding Cleanup](learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) section of Synchronizing with Effects for a full solution.

### Fixing bugs with the legacy string ref API {/*fixing-bugs-with-the-legacy-string-ref-api*/}

If you worked with React before, you might be familiar with an older API in class components that allows ref attributes to be a string, like `"textInput"`, and the DOM node is accessed as `this.refs.textInput`. We advise against using String refs because they can cause subtle bugs, and will be removed in one of the future releases.

Strict Mode helps you fix bugs with legacy string refs by warning when they are used.

For example, the following component has a bug that throws an error when clicking "Focus the input":

<Sandpack>

```js
import { useRef, Component } from 'react';


class Form extends Component {
  handleClick = () => {
    console.log('hit', this.refs.textInput);
    // Warning: This is a bug in string refs!
    // This will not focus the input because the
    // "input" ref is attached to InputWithButton.
    this.refs.textInput.focus();
  }
  
  renderInput = () => {
    return (
      <input ref="textInput" />
    )
  }
  
  render() {
    return (
      <InputWithButton renderInput={this.renderInput} onClick={this.handleClick}/>
    );
  }
}

class InputWithButton extends Component {
  render() {
    return (
      <>
        {this.props.renderInput()}
        <button onClick={this.props.onClick}>
          Focus the input
        </button>
      </>
    )
  }
}
export default Form;
```

</Sandpack>

This bug happens because string refs do not work the way most people expect with the "render callback" pattern. When we pass `renderInput` to `InputWithButton`, you might expect that `this.refs.textInput` refers to the input with `ref="textInput"`, but that is not the case. Instead, the ref is attached inside the `InputWithButton` component, and can only be accessed with `this.refs.textInput` inside `InputWithButton`.

In React terms, we say that the string ref feature is not ["Composable"](/docs/design-principles.html#composition) because moving around components that use string refs can break components in unexpected ways. In this example, you expect the `inputText` ref defined inside the `Form` component to be accessible inside of that component, but it's not. That means components using string refs do not work well together, and are not "composable".

The original design for string refs was flawed for this reason [and others](https://github.com/facebook/react/pull/8333#issuecomment-271648615), so it's deprecated and React will remove it in a future version. Strict Mode helps us catch this bug in development, before users see it in production, by warning when string refs are used:

<ConsoleBlock level="error">

Warning: A string ref, "textInput", has been found within a strict mode tree. String refs are a source of potential bugs and should be avoided. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref

</ConsoleBlock>

To fix this error, either switch the class component to use [`createRef`](/apis/react/createRef), or convert the class component to a function component and use [`useRef`](/apis/react/useRef).

See [Manipulating the DOM with Refs](/learn/manipulating-the-dom-with-refs#example-focusing-a-text-input) for a full solution.

### Fixing bugs with the legacy context API {/*fixing-bugs-with-the-legacy-context-api*/}

If you worked with React before, you might be familiar with an older API in class components for creating context called the Legacy Context API. This API allowed for creating context on class components using a method called `getChildContext`, prop-types, and `this.context`.

Using Legacy Context can lead to bugs. For example, in the following example, switching the theme is broken: 

<Sandpack>

```js Header.js active
import { Component } from "react";
import PropTypes from "prop-types";

class SubHeader extends Component {
  render() {
    return (
      <p className={this.context.theme}>
        The current theme is: {this.context.theme}
      </p>
    );
  }
}

SubHeader.contextTypes = {
  theme: PropTypes.string
};

class Header extends Component {
  shouldComponentUpdate() {
    // Error: This is a bug with legacy context!
    // This component will never get context updates.
    return false;
  }
  render() {
    return (
      <>
        <h1 className={this.context.theme}>
          Welcome!
        </h1>
        <SubHeader />
      </>
    );
  }
}

Header.contextTypes = {
  theme: PropTypes.string
};

export default Header;
```
```js App.js
import { Component } from "react";
import PropTypes from "prop-types";
import Header from './Header.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { theme: "light" };
  }

  getChildContext() {
    return { theme: this.state.theme };
  }

  handleToggleTheme = () => {
    this.setState((state) => ({
      theme: state.theme === "light" ? "dark" : "light"
    }));

    document.getElementsByTagName('html')[0].className =
      this.state.theme === "light" ? "dark" : "light";
  };

  render() {
    return (
      <div
        className={`container ${this.state.theme}`}
      >
        <Header />
        <button onClick={this.handleToggleTheme}>Toggle Theme</button>
      </div>
    );
  }
}

App.childContextTypes = {
  theme: PropTypes.string
};

export default App;
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "prop-types": "15.8.1"
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
container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px;
}

.light {
    color: #000;
}

html.light, div.light {
    background-color: #FFF;
}

.dark {
    color: #FFF;
}

html.dark, div.dark {
    background-color: #000;
}
```

</Sandpack>

This bug happens because the Legacy Context API would not update children if `shouldCompoentUpdate` returned `false`. You might expect `this.context.theme` in the `SubHeader` component to always stay up to date with the current theme context. However, since the paren `Header` component returns `false` from `shouldComponentUpdate`, neither `Header` or any of it's descendents will receive context updates.

Strict Mode helps us find this bug in development by showing an error in the console:

<ConsoleBlock level="error">

<>
    <span>Warning: Legacy context API has been detected within a strict-mode tree.</span>
    <p>The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.</p>
    <p>Please update the following components: App, Header, SubHeader</p>
    <p>Learn more about this warning here: https://reactjs.org/link/legacy-context</p>
</>

</ConsoleBlock>

To fix this error, switch to the [`createContext`](http://localhost:3000/apis/react/createContext) API or the [`useContext`](/apis/react/useContext) hook.

For more information on using context, see [Passing Data Deeply with Context](http://localhost:3000/learn/passing-data-deeply-with-context).

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
    <p>Move code with side effects to componentDidMount, and set initial state in the constructor.</p>
    <p>Please update the following components: Preview</p>
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

