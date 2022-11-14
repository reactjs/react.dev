---
title: Component
---

<Pitfall>

We recommend to define components as functions instead of classes. [See how to migrate.](#alternatives)

</Pitfall>

<Intro>

`Component` is the base class for the React components defined as [JavaScript classes.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) Class components are still supported by React, but we don't recommend using them in new code.

```js
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Usage {/*usage*/}

### Defining a class component {/*defining-a-class-component*/}

To define a React component as a class, extend the built-in `Component` class and define a [`render` method:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React will call your [`render`](#render) method whenever it needs to figure out what to display on the screen. Usually, you will return some [JSX](/learn/writing-markup-with-jsx) from it. Your `render` method should be a [pure function:](https://en.wikipedia.org/wiki/Pure_function) it should only calculate the JSX.

Similarly to [function components,](/learn/your-first-component#defining-a-component) a class component can [receive information by props](/learn/your-first-component#defining-a-component) from its parent component. However, the syntax for reading props is different. For example, if the parent component renders `<Greeting name="Taylor" />`, then you can read the `name` prop from [`this.props`](#props), like `this.props.name`:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

Note that Hooks (functions starting with `use`, like [`useState`](/apis/react/useState)) are not supported inside class components.

<Pitfall>

We recommend to define components as functions instead of classes. [See how to migrate.](#migrating-a-simple-component-from-a-class-to-a-function)

</Pitfall>

---

### Adding state to a class component {/*adding-state-to-a-class-component*/}

To add [state](/learn/state-a-components-memory) to a class, assign an object to a property called [`state`](#state). To update state, call [`this.setState`](#setstate).

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack> 

<Pitfall>

We recommend to define components as functions instead of classes. [See how to migrate.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Pitfall>

---

### Adding lifecycle methods to a class component {/*adding-lifecycle-methods-to-a-class-component*/}

There are a few special methods you can define on your class.

If you define the [`componentDidMount`](#componentdidmount) method, React will call it when your component is first added *(mounted)* to the screen. React will call [`componentDidUpdate`](#componentdidupdate) after your component re-renders due to changed props or state. React will call [`componentWillUnmount`](#componentwillunmount) after your component has been removed *(unmounted)* from the screen.

If you implement `componentDidMount`, you usually need to implement all three lifecycles to avoid bugs. For example, if `componentDidMount` reads some state or props, you also have to implement `componentDidUpdate` to handle their changes, and `componentWillUnmount` to clean up whatever `componentDidMount` was doing.

For example, this `ChatRoom` component keeps a chat connection synchronized with props and state:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Note that in development when [Strict Mode](/apis/react/StrictMode) is on, React will call `componentDidMount`, immediately call `componentWillUnmount`, and then call `componentDidMount` again. This helps you notice if you forgot to implement `componentWillUnmount` or if its logic doesn't fully "mirror" what `componentDidMount` does.

<Pitfall>

We recommend to define components as functions instead of classes. [See how to migrate.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Pitfall>

---

## Alternatives {/*alternatives*/}

### Migrating a simple component from a class to a function {/*migrating-a-simple-component-from-a-class-to-a-function*/}

Typically, you will [define components as functions](/learn/your-first-component#defining-a-component) instead.

For example, suppose you're converting this class to a function:

<Sandpack>

```js
import { Component } from 'react';

export default class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Sandpack>

Define a function called `Greeting`. This is where you will move the body of your `render` function.

```js
function Greeting() {
  // ... move the code from the render method here ...
}
```

Instead of `this.props.name`, define the `name` prop [using the destructuring syntax](/learn/passing-props-to-a-component) and read it directly:

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

Here is a complete example:

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

---

### Migrating a component with state from a class to a function {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

Suppose you're converting this class to a function:

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = (e) => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

Start by declaring a function with the necessary [state variables:](/apis/react/useState#adding-state-to-a-component)

```js {4-5}
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  // ...
```

Next, convert the event handlers:

```js {5-7,9-11}
function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }
  // ...
```

Finally, replace all references starting with `this` with the variables and functions you defined in your component. For example, replace `this.state.age` with `age`, and replace `this.handleNameChange` with `handleNameChange`.

Here is a fully converted component:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }

  return (
    <>
      <input
        value={name}
        onChange={handleNameChange}
      />
      <button onClick={handleAgeChange}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  )
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

---

### Migrating a component with lifecycle methods from a class to a function {/*migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function*/}

Suppose you're converting this component with lifecycle methods to a function:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

First, verify that your [`componentWillUnmount`](#componentwillunmount) does the opposite of [`componentDidMount`.](#componentdidmount) In the above example, that's true: it disconnects the connection that `componentDidMount` sets up. If such logic is missing, add it first.

Next, verify that your [`componentDidUpdate`](#componentdidupdate) method handles changes to any props and state you're using in `componentDidMount`. In the above example, `componentDidMount` calls `setupConnection` which reads `this.state.serverUrl` and `this.props.roomId`. This is why `componentDidUpdate` checks whether `this.state.serverUrl` and `this.props.roomId` have changed, and resets the connection if they did. If your `componentDidUpdate` logic is missing or doesn't handle changes to all relevant props and state, fix that first.

In the above example, the logic inside the lifecycle methods connects the component to a system outside of React (a chat server). To connect a component to an external system, [describe this logic as a single Effect:](/apis/react/useEffect#connecting-to-an-external-system)

```js {6-12}
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  // ...
}
```

This [`useEffect`](/api/useEffect) call is equivalent to the logic in the lifecycle methods above. If your lifecycle methods do multiple unrelated things, [split them into multiple independent Effects.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) Here is a complete example you can play with:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Note>

If your component does not synchronize with any external systems, [you might not need an Effect.](/learn/you-might-not-need-an-effect)

</Note>

---

### Migrating a component with context from a class to a function {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

In this example, the `Panel` and `Button` class components read [context](/learn/passing-data-deeply-with-context) from [`this.context`:](#context)

<Sandpack>

```js
import { createContext, Component } from 'react';

const ThemeContext = createContext(null);

class Panel extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'panel-' + theme;
    return (
      <section className={className}>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </section>
    );    
  }
}

class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

When you convert them to function components, replace `this.context` with [`useContext`](/apis/react/useContext) calls:

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

## Reference {/*reference*/}

<Pitfall>

We recommend to define components as functions instead of classes. [See how to migrate.](#alternatives)

</Pitfall>

### `Component` {/*component*/}

To define a React component as a class, extend the built-in `Component` class and define a [`render` method:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

Only the `render` method is required, other methods are optional.

[See more examples above.](#usage)

---

### `context` {/*context*/}

The [context](/learn/passing-data-deeply-with-context) of a class component is available as `this.context`. It is only available if you specify *which* context you want to receive using [`static contextType`](#static-contexttype) (modern) or [`static contextTypes`](#static-contexttypes) (deprecated).

A class component can only read one context at a time.

```js {2,5}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

```

<Note>

Reading `this.context` in class components is equivalent to [`useContext`](/apis/react/useContext) in function components.

[See how to migrate.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `props` {/*props*/}

The props passed to a class component are available as `this.props`.

```js {3}
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

<Greeting name="Taylor" />
```

<Note>

Reading `this.props` in class components is equivalent to [declaring props](/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component) in function components.

[See how to migrate.](#migrating-a-simple-component-from-a-class-to-a-function)

</Note>

---

### `state` {/*state*/}

The state of a class component is available as `this.state`. The `state` field must be an object. Do not mutate the state directly. If you wish to change the state, call `setState` with the new state.

```js {2-4,7-9,18}
class Counter extends Component {
  state = {
    age: 42,
  };

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleAgeChange}>
        Increment age
        </button>
        <p>You are {this.state.age}.</p>
      </>
    );
  }
}
```

<Note>

Defining `state` in class components is equivalent to calling [`useState`](/apis/react/useState) in function components.

[See how to migrate.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `constructor(props)` {/*constructor*/}

The [constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor) runs before your class component *mounts* (gets added to the screen). Typically, a constructor is only used for two purposes in React. It lets you declare state and [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) your class methods to the class instance:

```js {2-6}
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ...
  }
```

If you use modern JavaScript syntax, constructors are rarely needed. Instead, you can rewrite this code above using the [public class field syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields) which is supported both by modern browsers and tools like [Babel:](https://babeljs.io/)

```js {2,4}
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
```

A constructor should not contain any side effects or subscriptions.

#### Parameters {/*constructor-parameters*/}

* `props`: The component's initial props.

#### Returns {/*constructor-returns*/}

`constructor` should not return anything.

#### Caveats {/*constructor-caveats*/}

* Do not run any side effects or subscriptions in the constructor. Instead, use [`componentDidMount`](#componentdidmount) for that.

* Inside a constructor, you need to call `super(props)` before any other statement. If you don't do that, `this.props` will be `undefined` while the constructor runs, which can be confusing and cause bugs.

* Constructor is the only place where you can assign [`this.state`](#state) directly. In all other methods, you need to use [`this.setState()`](#setstate) instead. Do not call `setState` in the constructor.

* When you use [server rendering,](/apis/react-dom/server) the constructor will run on the server too, followed by the [`render`](#render) method. However, lifecycle methods like `componentDidMount` or `componentWillUnmount` will not run on the server.

* When [Strict Mode](/apis/react/StrictMode) is on, React will call `constructor` twice in development and then throw away one of the instances. This helps you notice the accidental side effects that need to be moved out of the `constructor`.

<Note>

There is no exact equivalent for `constructor` in function components. To declare state in a function component, call [`useState`.](/apis/react/useState) To avoid recalculating the initial state, [pass a function to `useState`.](/apis/react/useState#avoiding-recreating-the-initial-state)

</Note>

---

### `componentDidCatch(error, info)` {/*componentdidcatch*/}

If you define `componentDidCatch`, React will call it when some child component (including distant children) throws an error during rendering. This lets you log that error to an error reporting service in production.

Typically, it is used together with [`static getDerivedStateFromError`](#static-getderivedstatefromerror) which lets you update state in response to an error and display an error message to the user. A component with these methods is called an *error boundary.*

```js {12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

Then you can wrap a part of your component tree with it:

```js {1,3}
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

If `Profile` or its child component throws an error, `ErrorBoundary` will "catch" that error, display a fallback UI with the error message you've provided, and send a production error report to your error reporting service.

You don't need to wrap every component into a separate error boundary. When you think about the [granularity of error boundaries,](https://aweary.dev/fault-tolerance-react/) consider where it makes sense to display an error message. For example, in a messaging app, it makes sense to place an error boundary around the list of conversations. It also makes sense to place one around every individual message. However, it wouldn't make sense to place an error boundary around a person's avatar.

#### Parameters {/*componentdidcatch-parameters*/}

* `error`: The error that was thrown. In practice, it will usually be an instance of [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) but this is not guaranteed because JavaScript allows to [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) any value, including strings or even `null`.

* `info`: An object containing additional information about the error. Its `componentStack` field contains a stack trace with the component that threw, as well as the names and source locations of all its parent components. In production, the component names will be minified. If you set up production error reporting, you can decode the component stack using sourcemaps the same way as you would do for regular JavaScript error stacks.

#### Returns {/*componentdidcatch-returns*/}

`componentDidCatch` should not return anything.

#### Caveats {/*componentdidcatch-caveats*/}

* In the past, it was common to call `setState` inside `componentDidCatch` in order to update the UI and display the fallback error message. This is deprecated in favor of defining [`static getDerivedStateFromError`.](#static-getderivedstatefromerror)

* Production and development builds of React slightly differ in the way `componentDidCatch` handles errors. In development, the errors will bubble up to `window`, which means that any `window.onerror` or `window.addEventListener('error', callback)` will intercept the errors that have been caught by `componentDidCatch`. In production, instead, the errors will not bubble up, which means any ancestor error handler will only receive errors not explicitly caught by `componentDidCatch`.

<Note>

There is no direct equivalent for `componentDidCatch` in function components yet. If you'd like to avoid creating class components, write a single `ErrorBoundary` component like above and use it throughout your app. Alternatively, you can use the [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) package which does that for you.

</Note>

---

### `componentDidMount()` {/*componentdidmount*/}

If you define the `componentDidMount` method, React will call it when your component is first added *(mounted)* to the screen. This is a common place to start data fetching, set up subscriptions, or manipulate the DOM nodes.

If you implement `componentDidMount`, you usually need to implement other lifecycle methods to avoid bugs. For example, if `componentDidMount` reads some state or props, you also have to implement [`componentDidUpdate`](#componentdidupdate) to handle their changes, and [`componentWillUnmount`](#componentwillunmount) to clean up whatever `componentDidMount` was doing.

```js {6-8}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[See more examples.](#adding-lifecycle-methods-to-a-class-component)

#### Parameters {/*componentdidmount-parameters*/}

`componentDidMount` does not take any parameters.

#### Returns {/*componentdidmount-returns*/}

`componentDidMount` should not return anything.

#### Caveats {/*componentdidmount-caveats*/}

- When [Strict Mode](/apis/react/StrictMode) is on, in development React will call `componentDidMount`, then immediately call [`componentWillUnmount`,](#componentwillunmount) and then call `componentDidMount` again. This helps you notice if you forgot to implement `componentWillUnmount` or if its logic doesn't fully "mirror" what `componentDidMount` does.

- Although you may call [`setState`](#setstate) immediately in `componentDidMount`, it's best to avoid that when you can. It will trigger an extra rendering, but it will happen before the browser updates the screen. This guarantees that even though the [`render`](#render) will be called twice in this case, the user won't see the intermediate state. Use this pattern with caution because it often causes performance issues. In most cases, you should be able to assign the initial state in the [`constructor`](#constructor) instead. It can, however, be necessary for cases like modals and tooltips when you need to measure a DOM node before rendering something that depends on its size or position.

<Note>

For many use cases, defining `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` together in class components is equivalent to calling [`useEffect`](/apis/react/useEffect) in function components.

[See how to migrate.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `componentDidUpdate(prevProps, prevState, snapshot?)` {/*componentdidupdate*/}

If you define the `componentDidUpdate` method, React will call it immediately after your component has been re-rendered with updated props or state.  This method is not called for the initial render.

You can use it to manipulate the DOM after an update. This is also a common place to do network requests as long as you compare the current props to previous props (e.g. a network request may not be necessary if the props have not changed). Typically, you'd use it together with [`componentDidMount`](#componentdidmount) and [`componentWillUnmount`:](#componentwillunmount)

```js {10-18}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[See more examples.](#adding-lifecycle-methods-to-a-class-component)


#### Parameters {/*componentdidupdate-parameters*/}

* `prevProps`: Props before the update. Compare `prevProps` to [`this.props`](#props) to determine what changed.

* `prevState`: State before the update. Compare `prevState` to [`this.state`](#state) to determine what changed.

* `snapshot`: If you implemented [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate), `snapshot` will contain the value you returned from that method. Otherwise, it will be `undefined`.

#### Returns {/*componentdidupdate-returns*/}

`componentDidUpdate` should not return anything.

#### Caveats {/*componentdidupdate-caveats*/}

- The logic inside `componentDidUpdate` should usually be wrapped in conditions comparing `this.props` with `prevProps`, and `this.state` with `prevState`. Otherwise, there's a risk of creating infinite loops.

- Although you may call [`setState`](#setstate) immediately in `componentDidUpdate`, it's best to avoid that when you can. It will trigger an extra rendering, but it will happen before the browser updates the screen. This guarantees that even though the [`render`](#render) will be called twice in this case, the user won't see the intermediate state. This pattern often causes performance issues, but it may be necessary for rare cases like modals and tooltips when you need to measure a DOM node before rendering something that depends on its size or position.

<Note>

For many use cases, defining `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` together in class components is equivalent to calling [`useEffect`](/apis/react/useEffect) in function components.

[See how to migrate.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>
---

### `componentWillMount()` {/*componentwillmount*/}

<Deprecated>

This API has been renamed from `componentWillMount` to [`UNSAFE_componentWillMount`.](#unsafe_componentwillmount) The old name has been deprecated. In a future major version of React, only the new name will work.

Run the [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) to automatically update your components.

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>

This API has been renamed from `componentWillReceiveProps` to [`UNSAFE_componentWillReceiveProps`.](#unsafe_componentwillreceiveProps) The old name has been deprecated. In a future major version of React, only the new name will work.

Run the [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) to automatically update your components.

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

This API has been renamed from `componentWillUpdate` to [`UNSAFE_componentWillUpdate`.](#unsafe_componentwillupdate) The old name has been deprecated. In a future major version of React, only the new name will work.

Run the [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) to automatically update your components.

</Deprecated>
---

### `componentWillUnmount()` {/*componentwillunmount*/}

If you define the `componentWillUnmount` method, React will call it when your component is removed *(unmounted)* from the screen. This is a common place to cancel data fetching or remove subscriptions.

The logic inside `componentWillUnmount` should "mirror" the logic inside [`componentDidMount`.](#componentDidMount) For example, if `componentDidMount` sets up a subscription, `componentWillUnmount` should clean up that subscription. If the cleanup logic your `componentWillUnmount` reads some props or state, you will usually also need to implement [`componentDidUpdate`](#componentdidupdate) to clean up resources (such as subscriptions) corresponding to the old props and state.

```js {20-22}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[See more examples.](#adding-lifecycle-methods-to-a-class-component)

#### Parameters {/*componentwillunmount-parameters*/}

`componentWillUnmount` does not take any parameters.

#### Returns {/*componentwillunmount-returns*/}

`componentWillUnmount` should not return anything.

#### Caveats {/*componentwillunmount-caveats*/}

- When [Strict Mode](/apis/react/StrictMode) is on, in development React will call [`componentDidMount`,](#componentdidmount) then immediately call `componentWillUnmount`, and then call `componentDidMount` again. This helps you notice if you forgot to implement `componentWillUnmount` or if its logic doesn't fully "mirror" what `componentDidMount` does.

<Note>

For many use cases, defining `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` together in class components is equivalent to calling [`useEffect`](/apis/react/useEffect) in function components.

[See how to migrate.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `forceUpdate(callback?)` {/*forceupdate*/}

TODO

---

### `getSnapshotBeforeUpdate(prevProps, prevState)` {/*getsnapshotbeforeupdate*/}

TODO

---

### `render()` {/*render*/}

TODO

---

### `setState(nextState, callback?)` {/*setstate*/}

TODO

---

### `shouldComponentUpdate(prevProps, prevState)` {/*shouldcomponentupdate*/}

TODO

---

### `UNSAFE_componentWillMount()` {/*unsafe_componentwillmount*/}

TODO

---

### `UNSAFE_componentWillReceiveProps(nextProps)` {/*unsafe_componentwillreceiveprops*/}

TODO

---

### `UNSAFE_componentWillUpdate(nextProps, nextState)` {/*unsafe_componentwillupdate*/}

TODO

---

### `static childContextTypes` {/*static-childcontexttypes*/}

<Deprecated>

This API will be removed in a future major version of React. [Use `static contextType` instead.](#static-contexttype)

</Deprecated>

Lets you specify which [legacy context](https://reactjs.org/docs/legacy-context.html) is provided by this component.

---

### `static contextTypes` {/*static-contexttypes*/}

<Deprecated>

This API will be removed in a future major version of React. [Use `static contextType` instead.](#static-contexttype)

</Deprecated>

Lets you specify which [legacy context](https://reactjs.org/docs/legacy-context.html) is consumed by this component.

---

### `static contextType` {/*static-contexttype*/}

If you want to read [`this.context`](#context-instance-field) from your class component, you must specify which context it needs to read. The context you specify as the `static contextType` must be a value previously created by [`createContext`.](/apis/react/createContext)

```js {2}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}
```

<Note>

Reading `this.context` in class components is equivalent to [`useContext`](/apis/react/useContext) in function components.

[See how to migrate.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

You can define `static defaultProps` to set the default props for the class. They will be used for `undefined` and missing props, but not for `null` props.

For example, here is how you define that the `color` prop should default to `'blue'`:

```js {2-4}
class Button extends Component {
  static defaultProps = {
    color: 'blue'
  };

  render() {
    return <button className={this.props.color}>click me</button>;
  }
}
```

If the `color` prop is not provided or is `undefined`, it will be set by default to `'blue'`:

```js
<>
  {/* this.props.color is "blue" */}
  <Button />

  {/* this.props.color is "blue" */}
  <Button color={undefined} />

  {/* this.props.color is null */}
  <Button color={null} />

  {/* this.props.color is "red" */}
  <Button color="red" />
</>
```

<Note>

Defining `defaultProps` in class components is similar to using [default values](/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop) in function components.

</Note>

---

### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

TODO

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

TODO
