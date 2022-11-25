---
title: "react: Hooks"
---

<Intro>

*Hooks* let you use different React features from your components. You can either use the built-in Hooks or combine them to build your own. This page lists all the built-in Hooks in React.

</Intro>

<InlineToc />

---

## State Hooks {/*state-hooks*/}

[State](/learn/state-a-components-memory) lets a component "remember" information like user input. For example, a form component can use state to store the input value, while an image gallery component can use state to store the selected image index.

To add state to a component, use one of these Hooks:

* [`useState`](/apis/react/useState) declares a state variable that you can update directly.
* [`useReducer`](/apis/react/useReducer) declares a state variable with the update logic inside a [reducer function.](/learn/extracting-state-logic-into-a-reducer)

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

[See the `useState` page for more examples.](/apis/react/useState)

---

## Context Hooks {/*context-hooks*/}

[Context](/learn/passing-data-deeply-with-context) lets a component receive information from distant parents without [passing it as props.](/learn/passing-props-to-a-component) For example, your app's top-level component can pass the current UI theme to all components below, no matter how deep.

* [`useContext`](/apis/react/useContext) reads and subscribes to a context.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

[See the `useContext` page for more examples.](/apis/react/useContext)

---

## Ref Hooks {/*ref-hooks*/}

[Refs](/learn/referencing-values-with-refs) let a component hold some information that isn't used for rendering, like a DOM node or a timeout ID. Unlike with state, updating a ref does not re-render your component. Refs are an "escape hatch" from the React paradigm. They are useful when you need to work with non-React systems, such as the built-in browser APIs.

* [`useRef`](/apis/react/useRef) declares a ref. You can hold any value in it, but most often it's used to hold a DOM node.
* [`useImperativeHandle`](/apis/react/useImperativeHandle) lets you customize the ref exposed by your component. This is rarely used.

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

[See the `useRef` page for more examples.](/apis/react/useRef)

---

## Effect Hooks {/*effect-hooks*/}

[Effects](/learn/synchronizing-with-effects) let a component connect to and synchronize with external systems. This includes dealing with network, browser DOM, animations, widgets written using a different UI library, and in general any non-React code.

* [`useEffect`](/apis/react/useEffect) connects a component to an external system.

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

[See the `useEffect` page for more examples.](/apis/react/useEffect)

Effects are an "escape hatch" from the React paradigm. Don't use Effects to orchestrate the data flow of your application. If you're not interacting with an external system, [you might not need an Effect.](/learn/you-might-not-need-an-effect)

There are two variations of `useEffect` with differences in timing:

* [`useLayoutEffect`](/apis/react/useLayoutEffect) fires before the browser repaints the screen. You can measure layout here.
* [`useInsertionEffect`](/apis/react/useInsertionEffect) fires before React makes changes to the DOM. Libraries can insert dynamic CSS here.

They are rarely used.

---

## Performance Hooks {/*performance-hooks*/}

A common way to optimize re-rendering performance is to skip unnecessary work. For example, you can tell React to reuse a cached calculation or to skip a re-render if the data has not changed since the previous render.

To skip calculations and unnecessary re-rendering, use one of these Hooks:

- [`useMemo`](/apis/react/useMemo) lets you cache the result of an expensive calculation.
- [`useCallback`](/apis/react/useCallback) lets you cache a function definition before passing it down to an optimized component.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

[See the `useMemo` page for more examples.](/apis/react/useMemo)

Sometimes, you can't skip re-rendering because the screen actually needs to update. In that case, you can improve performance by separating urgent updates that must be synchronous (like typing into an input) from non-urgent updates which don't need to block the user interface (like updating a chart).

To prioritize rendering, use one of these Hooks:

- [`useTransition`](/apis/react/useTransition) lets you mark a state transition as non-urgent and allow other updates to interrupt it.
- [`useDeferredValue`](/apis/react/useDeferredValue) lets you defer updating a non-critical part of the UI and let other parts update first.

---

## Other Hooks {/*other-hooks*/}

These Hooks are mostly useful to library authors and aren't commonly used in the application code.

- [`useDebugValue`](/apis/react/useDebugValue) lets you customize the label React DevTools displays for your custom Hook.
- [`useId`](/apis/react/useId) lets a component associate a unique ID with itself. Typically used with accessibility APIs.
- [`useSyncExternalStore`](/apis/react/useSyncExternalStore) lets a component subscribe to an external store.
