---
title: Using TypeScript
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

TypeScript is a popular way to add type definitions to JavaScript codebases. Out of the box, TypeScript [supports JSX](/learn/writing-markup-with-jsx) and you can get full React support by adding [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) to your project.

</Intro>

<YouWillLearn>

* [TypeScript with React Components](/learn/typescript#typescript-with-react-components)
* [Typing common hooks](/learn/typescript#typing-hooks)
* [How to set up your editor](/learn/editor-setup)
* [How to install React Developer Tools](/learn/react-developer-tools)

</YouWillLearn>


All of the production-grade frameworks mentioned in [Start a New React Project](/learn/start-a-new-react-project) offer support for using TypeScript with React, we recommend consulting their documentation for more information on setup. This guide assumes you have your project configured to support writing `*.tsx` TypeScript React files, and have finished the Quick Start guide.

## TypeScript with React Components {/*typescript-with-react-components*/}

Writing TypeScript with React is very similar to writing JavaScript with React. The key difference when working with a component is that you can provide types for your component's props. These types can be used for correctness checking and providing inline documentation in editors.

Taking the [`MyButton` functional component](/learn#components) from the [Quick Start](/learn) guide, we can add a type describing the `title` for the button:

<Sandpack>

```tsx App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a button" />
    </div>
  );
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```
</Sandpack>

 <Note>

These sandboxes can handle TypeScript code, but they do not run the type-checker. This means you can amend the TypeScript sandboxes to learn, but you won't get any type errors or warnings. To get type-checking, you can use the [TypeScript Playground](https://www.typescriptlang.org/play) or use a more fully-featured online sandbox.

</Note>

This inline syntax is the simplest way to provide types for a functional component, though once you start to have a few fields to describe it can become unwieldy. Instead, you can use an `interface` or `type` to describe the component's props:

<Sandpack>

```tsx App.tsx active
interface MyButtonProps {
  /** The text to display inside the button */
  title: string;
  /** Whether the button can be interacted with */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a disabled button" disabled={true}/>
    </div>
  );
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

The type describing your component's props can be as simple or as complex as you need, though they should probably be an object type. You can learn about how TypeScript describes objects in [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) but you may also be interested in using [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) to describe a prop that can be one of a few different types and the [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) guide for more advanced use cases.


## Hooks {/*typing-hooks*/}

The type definitions from `@types/react-dom` include types for the built-in hooks, so you can use them in your components without any additional setup. They are built to take into account the code you write in your component, so you will get inferred types a lot of the time and ideally do not need to handle the minutiae of providing the types. However, we can look at a few examples of how to provide types for hooks.

### `useState` {/*typing-usestate*/}

The [`useState` hook](/reference/react/useReducer) will re-use the value passed in as the initial state to determine what the type of the value should be. For example:

```ts
const [enabled, setEnabled] = useState(false);
```

Will assign the type of `boolean` to `enabled`, and `setEnabled` will be a function accepting either a `boolean` argument, or a function that returns a `boolean`. If you want to explicitly provide a type for the state, you can do so by providing a type argument to the `useState` call:

```ts 
const [enabled, setEnabled] = useState<boolean>(false);
```

This isn't very useful in this case, but a common case where you may want to provide a type is when you have a union type. For example, `status` here can be one of a few different strings:

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

Or, as recommended in [Principles for structuring state](/learn/choosing-the-state-structure#principles-for-structuring-state), you can group related state as an object and describe the different possibilities via object types:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

The [`useReducer` hook](/reference/react/useReducer) is a more complex hook that takes a reducer function and an initial state. The types for the reducer function are inferred from the initial state. You can optionally provide a type argument to the `useReducer` call to provide a type for the state, but it is often better to set the type on the initial state instead:

<Sandpack>

```tsx App.tsx active
import {useReducer, useCallback} from 'react';

interface State {
   count: number 
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = useCallback(() => dispatch({ type: "setCount", value: state.count + 5 }), [state.count]);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  return (
    <div>
      <h1>Welcome to my counter</h1>

      <p>Count: {state.count}</p>
      <button onClick={addFive}>Add 5</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>


We are using TypeScript in a few key places:

 - `interface State` describes the shape of the reducer's state.
 - `type CounterAction` describes the different actions which can be dispatched to the reducer.
 - `const initialState: State` provides a type for the initial state, and also the type which is used by `useReducer` by default.
 - `stateReducer(state: State, action: CounterAction): State` sets the types for the reducer function's arguments and return value.

A more explicit alternative to setting the type on `initialState` is to provide a type argument to `useReducer`:

```ts
const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

The [`useContext` hook](/reference/react/useContext) is a technique for passing data down the component tree without having to pass props through components. It is used by creating a provider component and often by creating a hook to consume the value in a child component.

The type of the value provided by the context is inferred from the value passed to the `createContext` call:

<Sandpack>

```tsx App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext.Provider value={theme}>
      <MyComponent />
    </ThemeContext.Provider>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
    </div>
  )
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

This technique works when you have an obvious default value - but often with context you do not, and [in those cases `null` is an appropriate default value](/reference/react/useContext#specifying-a-fallback-default-value). However, you likely would not want `null` to be in the type when consuming the type, our recommendation is to have the hook do a runtime check for it's existence and throw an error when not present:

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// This is a simpler example, but you can imagine a more complex object here
type ComplexObject = {
  kind: string
};

// The context is created with `| null` in the type, to accurately reflect the default value.
const Context = createContext<ComplexObject | null>(null);

// The `| null` will be removed via the check in the hook.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
    <Context.Provider value={object}>
      <MyComponent />
    </Context.Provider>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>Current object: {object.kind}</p>
    </div>
  )
}
```

### `useRef` {/*typing-useref*/}

The [`useRef` hook](/reference/react/useRef) returns a mutable ref object whose `.current` property is initialized to the passed argument. The returned object will persist for the full lifetime of the component.

`useRef` is often used to access the underlying DOM element of a component, but it can also be used to store any mutable value.

When interacting with the DOM, the type of the ref should be set to the type of the underlying DOM element. The naming rule is `HTML` + the name of the element + `Element`, for example `HTMLDivElement` or `HTMLButtonElement`. You can see the full list from TypeScript 5.1 [here](https://github.com/microsoft/TypeScript/blob/a3773ec590c4f0308d546f0e65818cd0d12402f3/src/lib/dom.generated.d.ts#L26899-L27012). These are provided globally by the "DOM" lib, which is included by default in TypeScript projects.

<Sandpack>

```tsx App.tsx active
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef<HTMLButtonElement | null>(null);

  function handleClick() {
    // The ?. is used because of the `| null` above.
    inputRef?.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>


### `useMemo` / `useCallback` {/*typing-other-hooks*/}