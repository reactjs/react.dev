---
title: React APIs
---

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

If you use React on the web, you'll also need the same version of [ReactDOM](/apis/reactdom).

## Exports {/*exports*/}

### State {/*state*/}

<YouWillLearnCard title="useState" path="/apis/usestate">

Declares a state variable.

```js
function MyComponent() {
  const [age, setAge] = useState(42);
  // ...
```

</YouWillLearnCard>

<YouWillLearnCard title="useReducer" path="/apis/usereducer">

Declares a state variable managed with a reducer.

```js
function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

</YouWillLearnCard>

### Context {/*context*/}

<YouWillLearnCard title="useContext" path="/apis/usecontext">

Reads and subscribes to a context.

```js
function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

</YouWillLearnCard>

<YouWillLearnCard title="createContext" path="/apis/createContext">

Creates a context that components can provide or read.

```js
const ThemeContext = createContext('light');
```

</YouWillLearnCard>

### Refs {/*refs*/}

<YouWillLearnCard title="useRef" path="/apis/useref">

Declares a ref.

```js
function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

</YouWillLearnCard>


This section is incomplete and is still being written!
