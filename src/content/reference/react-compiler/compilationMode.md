---
title: compilationMode
---

<Intro>

The `compilationMode` option controls how the React Compiler selects which functions to compile.

</Intro>

```js
{
  compilationMode: 'infer' // or 'annotation', 'syntax', 'all'
}
```

<InlineToc />

---

## Reference {/*reference*/}

### `compilationMode` {/*compilationmode*/}

Controls the strategy for determining which functions the React Compiler will optimize.

#### Type {/*type*/}

```
'infer' | 'syntax' | 'annotation' | 'all'
```

#### Default value {/*default-value*/}

`'infer'`

#### Options {/*options*/}

- **`'infer'`** (default): The compiler uses intelligent heuristics to identify React components and hooks:
  - Functions explicitly annotated with `"use memo"` directive
  - Functions that are named like components (PascalCase) or hooks (`use` prefix) AND create JSX and/or call other hooks

- **`'annotation'`**: Only compile functions explicitly marked with the `"use memo"` directive. Ideal for incremental adoption.

- **`'syntax'`**: Only compile components and hooks that use Flow's [component](https://flow.org/en/docs/react/component-syntax/) and [hook](https://flow.org/en/docs/react/hook-syntax/) syntax.

- **`'all'`**: Compile all top-level functions. Not recommended as it may compile non-React functions.

#### Caveats {/*caveats*/}

- The `'infer'` mode requires functions to follow React naming conventions to be detected
- Using `'all'` mode may negatively impact performance by compiling utility functions
- The `'syntax'` mode requires Flow and won't work with TypeScript
- Regardless of mode, functions with `"use no memo"` directive are always skipped

---

## Usage {/*usage*/}

### Default inference mode {/*default-inference-mode*/}

The default `'infer'` mode works well for most codebases that follow React conventions:

```js
{
  compilationMode: 'infer'
}
```

With this mode, these functions will be compiled:

```js
// ✅ Compiled: Named like a component + returns JSX
function Button(props) {
  return <button>{props.label}</button>;
}

// ✅ Compiled: Named like a hook + calls hooks
function useCounter() {
  const [count, setCount] = useState(0);
  return [count, setCount];
}

// ✅ Compiled: Explicit directive
function expensiveCalculation(data) {
  "use memo";
  return data.reduce(/* ... */);
}

// ❌ Not compiled: Not a component/hook pattern
function calculateTotal(items) {
  return items.reduce((a, b) => a + b, 0);
}
```

### Incremental adoption with annotation mode {/*incremental-adoption*/}

For gradual migration, use `'annotation'` mode to only compile marked functions:

```js
{
  compilationMode: 'annotation'
}
```

Then explicitly mark functions to compile:

```js
// Only this function will be compiled
function ExpensiveList(props) {
  "use memo";
  return (
    <ul>
      {props.items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// This won't be compiled without the directive
function NormalComponent(props) {
  return <div>{props.content}</div>;
}
```

### Using Flow syntax mode {/*flow-syntax-mode*/}

If your codebase uses Flow instead of TypeScript:

```js
{
  compilationMode: 'syntax'
}
```

Then use Flow's component syntax:

```js
// Compiled: Flow component syntax
component Button(label: string) {
  return <button>{label}</button>;
}

// Compiled: Flow hook syntax
hook useCounter(initial: number) {
  const [count, setCount] = useState(initial);
  return [count, setCount];
}

// Not compiled: Regular function syntax
function helper(data) {
  return process(data);
}
```

### Opting out specific functions {/*opting-out*/}

Regardless of compilation mode, use `"use no memo"` to skip compilation:

```js
function ComponentWithSideEffects() {
  "use no memo"; // Prevent compilation

  // This component has side effects that shouldn't be memoized
  logToAnalytics('component_rendered');

  return <div>Content</div>;
}
```

---

## Troubleshooting {/*troubleshooting*/}

### Component not being compiled in infer mode {/*component-not-compiled-infer*/}

In `'infer'` mode, ensure your component follows React conventions:

```js
// ❌ Won't be compiled: lowercase name
function button(props) {
  return <button>{props.label}</button>;
}

// ✅ Will be compiled: PascalCase name
function Button(props) {
  return <button>{props.label}</button>;
}

// ❌ Won't be compiled: doesn't create JSX or call hooks
function useData() {
  return window.localStorage.getItem('data');
}

// ✅ Will be compiled: calls a hook
function useData() {
  const [data] = useState(() => window.localStorage.getItem('data'));
  return data;
}
```
