---
title: React APIs
---

<Wip>

This section is incomplete, please see the old docs for [React](https://reactjs.org/docs/react-api.html).

</Wip>

<Intro>

The React package contains all the APIs necessary to define and use [components](/learn/your-first-component).

</Intro>

## Installation {/*installation*/}

It is available as [`react`](https://www.npmjs.com/package/react) on npm. You can also [add React to the page as a `<script>` tag](/learn/add-react-to-a-website).

<PackageImport>

<TerminalBlock>

npm install react

</TerminalBlock>

```js
// Importing a specific API:
import { useState } from 'react';

// Importing all APIs together:
import * as React from 'react';
```

</PackageImport>

If you use React on the web, you'll also need the same version of [ReactDOM](/apis/react-dom).

## Exports {/*exports*/}

### State {/*state*/}

<YouWillLearnCard title="useState" path="/apis/react/useState">

Declares a state variable.

```js
function MyComponent() {
  const [age, setAge] = useState(42);
  // ...
```

</YouWillLearnCard>

<YouWillLearnCard title="useReducer" path="/apis/react/useReducer">

Declares a state variable managed with a reducer.

```js
function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

</YouWillLearnCard>

### Context {/*context*/}

<YouWillLearnCard title="useContext" path="/apis/react/useContext">

Reads and subscribes to a context.

```js
function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

</YouWillLearnCard>

<YouWillLearnCard title="createContext" path="/apis/react/useContext">

Creates a context that components can provide or read.

```js
const ThemeContext = createContext('light');
```

</YouWillLearnCard>

### Refs {/*refs*/}


<YouWillLearnCard title="useRef" path="/apis/react/useRef">

Declares a ref.

```js
function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

</YouWillLearnCard>

<YouWillLearnCard title="forwardRef" path="/apis/react/forwardRef">

Create a component that forward the ref attribute:

```js
const Component = forwardRef((props, ref) => {
    // ...
});
```

</YouWillLearnCard>

<YouWillLearnCard title="useImperativeHandle" path="/apis/react/useImperativeHandle">

Customize instance value exposed to parent refs:

```js
useImperativeHandle(ref, () => {
  // ...        
});
```

</YouWillLearnCard>

<YouWillLearnCard title="createRef" path="/apis/react/createRef">

Create a ref (typically for class components):

```js
this.ref = createRef(); 
```

</YouWillLearnCard>

### Components {/*components*/}

<YouWillLearnCard title="React.Component" path="/apis/react/Component">

Define a components as a class:

```js
class MyComponent extends React.Component {
  // ...
}
```

</YouWillLearnCard>

<YouWillLearnCard title="React.PureComponent" path="/apis/react/PureComponent">

Define a pure component as a class:

```js
class MyComponent extends React.PureComponent {
    // ...
}
```

</YouWillLearnCard>

### Elements {/*elements*/}

<YouWillLearnCard title="Fragment" path="/apis/react/Fragment">

Return multiple elements:

```js
function MyComponent() {
    return (
        <>
            <h1>Title</h1>
            <h2>Subtitle</h2>
        </>
    );
}
```

</YouWillLearnCard>

<YouWillLearnCard title="Children" path="/apis/react/Children">

Utilities for dealing with `props.children`:

```js
React.Children.map(children, () => ([]));

React.Children.forEach(children, () => {});

React.Children.count(children);

React.Children.only(children);

React.Children.toArray(children);
```

</YouWillLearnCard>

<YouWillLearnCard title="createElement" path="/apis/react/createElement">

Create a React element:

```js
React.createElement('div', { title: 'Element'});
```

</YouWillLearnCard>

<YouWillLearnCard title="createFactory" path="/apis/react/createFactory">

Create a factory for React elements of a given type:

```js
React.createFactory('div');
```

</YouWillLearnCard>

<YouWillLearnCard title="cloneElement" path="/apis/react/cloneElement">

Clone a React element:

```js
React.cloneElement(element, props);
```

</YouWillLearnCard>

<YouWillLearnCard title="isValidElement" path="/apis/react/isValidElement">

Verifies the object is a React element:

```js
React.isValidElement(object)
```

</YouWillLearnCard>

### Suspense {/*suspense*/}

<YouWillLearnCard title="React.lazy" path="/apis/react/lazy">

Define a component that is loaded dynamically:

```js
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

</YouWillLearnCard>

<YouWillLearnCard title="Suspense" path="/apis/react/Suspense">

Define Suspense boundaries:

```js
<React.Suspense fallback={<Spinner />}>
  //...
</React.Suspense>
```

</YouWillLearnCard>

### Transitions {/*transitions*/}

<YouWillLearnCard title="startTransition" path="/apis/react/startTransition">

Mark updates as transitions:

```js
startTransition(() => {
  setState(c => c + 1);
});
```

</YouWillLearnCard>

<YouWillLearnCard title="useTransition" path="/apis/react/startTransition">

Mark updates as transitions with pending flags:

```js
const [isPending, startTransition] = useTransition();
```

</YouWillLearnCard>

<YouWillLearnCard title="useDeferredValue" path="/apis/react/useDeferredValue">

Defer to more urgent updates:

```js
const deferredValue = useDeferredValue(value);
```

</YouWillLearnCard>

### Effects {/*effects*/}

<YouWillLearnCard title="useEffect" path="/apis/react/useEffect">

Synchronize external state:

```js
useEffect(() => {
  const unsubscribe = socket.connect(props.userId);
    
  return () => {
    unsubscribe();
  }
}, [props.userId])
```

</YouWillLearnCard>

<YouWillLearnCard title="useLayoutEffect" path="/apis/react/useLayoutEffect">

Read layout DOM state:

```js
useLayoutEffect(() => {
  // Read DOM layout
})
```

</YouWillLearnCard>

<YouWillLearnCard title="useInsertionEffect" path="/apis/react/useInsertionEffect">

Insert styles into the DOM.

```js
useInsertionEffect(() => {
  // Insert styles
})
```

</YouWillLearnCard>

### Memoization {/*memoization*/}

<YouWillLearnCard title="useCallback" path="/apis/react/useCallback">

Return a memoized callback.

```js
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

</YouWillLearnCard>

<YouWillLearnCard title="useMemo" path="/apis/react/useMemo">

Return a memoized value.

```js
const value = useMemo(() => {
  return calculateValue(a, b);
}, [a, b]);
```

</YouWillLearnCard>

<YouWillLearnCard title="memo" path="/apis/react/memo">

Return a memoized component.

```js
const MyComponent = React.memo(function MyComponent(props) {
    // ...
});
```

</YouWillLearnCard>

### Subscribing {/*subscribing*/}

<YouWillLearnCard title="useSyncExternalStore" path="/apis/react/useSyncExternalStore">

Subscribe to external state.

```js
const state = useSyncExternalStore(subscribe, getSnapshot);
```

</YouWillLearnCard>

### Accessibility {/*accessibility*/}

<YouWillLearnCard title="useId" path="/apis/react/useId">

Generate unique IDs across the server and client:

```js
const id = useId();
```

</YouWillLearnCard>

### Debugging {/*devtools*/}

<YouWillLearnCard title="StrictMode" path="/apis/react/StrictMode">

Eagerly highlight potential problems.

```js
<StrictMode>{...}</StrictMode>
```

</YouWillLearnCard>

<YouWillLearnCard title="useDebugValue" path="/apis/react/useDebugValue">

Display a label for custom hooks.

```js
useDebugValue('Custom Label');
```

</YouWillLearnCard>


This section is incomplete and is still being written!

