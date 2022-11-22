---
title: "react: Hooks"
---

React provides several built-in *Hooks* for features you can use from your components.

<InlineToc />

---

### State {/*state*/}

State lets a component "remember" information like user input.

```js
function MyComponent() {
  const [age, setAge] = useState(42);
  // ...
```

<APIGrid>

<APICard title="useState" path="/apis/react/useState">

Declares a state variable.

</APICard>

<APICard title="useReducer" path="/apis/react/useReducer">

Declares a state variable with a reducer.

</APICard>

</APIGrid>

---

### Context {/*context*/}

Context lets a component receive information from distant parents without passing it through every level.

```js
function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

<APICard title="useContext" path="/apis/react/useContext">

Reads and subscribes to a context.

</APICard>

---

### Refs {/*refs*/}

Refs let a component hold information that isn't used for rendering, like a DOM node or a timeout ID.

```js
function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

<APICard title="useRef" path="/apis/react/useRef">

Declares a ref.

</APICard>

---

### Effects {/*effects*/}

Effects let a component connect to and synchronize with external systems like browser APIs.

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
  	const connection = createConnection(roomId);
    connection.connect();
  	return () => connection.disconnect();
  }, [roomId]);
  // ...
```

<APICard title="useEffect" path="/apis/react/useEffect">

Lets a component connect to and synchronize with an external system.

</APICard>

<APIGrid>

<APICard title="useLayoutEffect" path="/apis/react/useLayoutEffect">

Like `useEffect`, but fires early enough to read layout information. Rarely used.

</APICard>

<APICard title="useInsertionEffect" path="/apis/react/useInsertionEffect">

Like `useEffect`, but fires early to insert CSS styles into the document. Rarely used.

</APICard>

</APIGrid>

---

## Performance {/*performance*/}

You can optimize rendering performance by skipping re-renders or marking them as interruptible transitions.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

<APIGrid>

<APICard title="useMemo" path="/apis/react/useMemo">

Lets you cache a calculation.

</APICard>

<APICard title="useCallback" path="/apis/react/useCallback">

Lets you cache a function definition.

</APICard>

<APICard title="useTransition" path="/apis/react/useTransition">

Lets you mark a state update as interruptible.

</APICard>

<APICard title="useDeferredValue" path="/apis/react/useDeferredValue">

Lets you defer updating a part of your tree.

</APICard>

</APIGrid>

---

## Other Hooks {/*other-hooks*/}

These Hooks serve different purposes and aren't commonly used in the application code.

<APIGrid>

<APICard title="useDebugValue" path="/apis/react/useDebugValue">

Lets you customize the label React DevTools displays for your custom Hook.

</APICard>

<APICard title="useId" path="/apis/react/useId">

Lets a component associate a unique ID with it. Typically used with accessibility APIs.

</APICard>

<APICard title="useImperativeHandle" path="/apis/react/useImperativeHandle">

Customizes the value the parent receives when it gets a ref to your component. Rarely used.

</APICard>

<APICard title="useSyncExternalStore" path="/apis/react/useSyncExternalStore">

Lets a component subscribe to a store.

</APICard>

</APIGrid>