---
title: createContext
---

<Intro>

`createContext` lets you create a [Context](/learn/passing-data-deeply-with-context) that components can provide or read.

```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

Call `createContext` outside of any components to create a Context.

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `defaultValue`: The value that you want the Context to have when there is no matching Context provider in the tree above the component that reads Context. If you don't have any meaningful default value, specify `null`. The default value is meant as a "last resort" fallback. It is static and never changes over time.

#### Returns {/*returns*/}

`createContext` returns a Context object.

**The Context object itself does not hold any information.** It represents _which_ Context other components read or provide. Typically, you will use [`SomeContext.Provider`](#provider) in components above to specify the Context value, and call [`useContext(SomeContext)`](/reference/react/useContext) in components below to read it. The Context object has a few properties:

* `SomeContext.Provider` lets you provide the Context value to components.
* `SomeContext.Consumer` is an alternative and rarely used way to read the Context value.

---

### `SomeContext.Provider` {/*provider*/}

Wrap your components into a Context provider to specify the value of this Context for all components inside:

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

#### Props {/*provider-props*/}

* `value`: The value that you want to pass to all the components reading this Context inside this provider, no matter how deep. The Context value can be of any type. A component calling [`useContext(SomeContext)`](/reference/react/useContext) inside of the provider receives the `value` of the innermost corresponding Context provider above it.

---

### `SomeContext.Consumer` {/*consumer*/}

Before `useContext` existed, there was an older way to read Context:

```js
function Button() {
  // 🟡 Legacy way (not recommended)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

Although this older way still works, but **newly written code should read Context with [`useContext()`](/reference/react/useContext) instead:**

```js
function Button() {
  // ✅ Recommended way
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### Props {/*consumer-props*/}

* `children`: A function. React will call the function you pass with the current Context value determined by the same algorithm as [`useContext()`](/reference/react/useContext) does, and render the result you return from this function. React will also re-run this function and update the UI whenever the Context from the parent components changes.

---

## Usage {/*usage*/}

### Creating Context {/*creating-context*/}

Context lets components [pass information deep down](/learn/passing-data-deeply-with-context) without explicitly passing props.

Call `createContext` outside any components to create one or more Contexts.

```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext` returns a <CodeStep step={1}>Context object</CodeStep>. Components can read Context by passing it to [`useContext()`](/reference/react/useContext):

```js [[1, 2, "ThemeContext"], [1, 7, "AuthContext"]]
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

By default, the values they receive will be the <CodeStep step={3}>default values</CodeStep> you have specified when creating the Contexts. However, by itself this isn't useful because the default values never change.

Context is useful because you can **provide other, dynamic values from your components:**

```js {8-9,11-12}
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

Now the `Page` component and any components inside it, no matter how deep, will "see" the passed Context values. If the passed Context values change, React will re-render the components reading the Context as well.

[Read more about reading and providing Context and see examples.](/reference/react/useContext)

---

### Importing and exporting Context from a file {/*importing-and-exporting-context-from-a-file*/}

Often, components in different files will need access to the same Context. This is why it's common to declare Contexts in a separate file. Then you can use the [`export` statement](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) to make Context available for other files:

```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

Components declared in other files can then use the [`import`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import) statement to read or provide this Context:

```js {2}
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js {2}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

This works similar to [importing and exporting components.](/learn/importing-and-exporting-components)

---

## Troubleshooting {/*troubleshooting*/}

### I can't find a way to change the Context value {/*i-cant-find-a-way-to-change-the-context-value*/}


Code like this specifies the *default* Context value:

```js
const ThemeContext = createContext('light');
```

This value never changes. React only uses this value as a fallback if it can't find a matching provider above.

To make Context change over time, [add state and wrap components in a context provider.](/reference/react/useContext#updating-data-passed-via-context)

