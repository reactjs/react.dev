---
title: "use memo"
titleForTitleTag: "'use memo' directive"
---

<Intro>

`"use memo"` marks a function for React Compiler optimization.

</Intro>

<Note>

In most cases, you don't need `"use memo"`. It's primarily needed in `annotation` mode where you must explicitly mark functions for optimization. In `infer` mode, the compiler automatically detects components and hooks by their naming patterns (PascalCase for components, `use` prefix for hooks). If a component or hook isn't being compiled in `infer` mode, you should fix its naming convention rather than forcing compilation with `"use memo"`.

</Note>

<InlineToc />

---

## Reference {/*reference*/}

### `"use memo"` {/*use-memo*/}

Add `"use memo"` at the beginning of a function to mark it for React Compiler optimization.

```js {1}
function MyComponent() {
  "use memo";
  // ...
}
```

When a function contains `"use memo"`, the React Compiler will analyze and optimize it during build time. The compiler will automatically memoize values and components to prevent unnecessary re-computations and re-renders.

#### Caveats {/*caveats*/}

* `"use memo"` must be at the very beginning of a function body, before any imports or other code (comments are OK).
* The directive must be written with double or single quotes, not backticks.
* The directive must exactly match `"use memo"`.
* Only the first directive in a function is processed; additional directives are ignored.
* The effect of the directive depends on your [`compilationMode`](/reference/react-compiler/compilationMode) setting.

### How `"use memo"` marks functions for optimization {/*how-use-memo-marks*/}

In a React app that uses the React Compiler, functions are analyzed at build time to determine if they can be optimized. By default, the compiler automatically infers which components to memoize, but this can depend on your [`compilationMode`](/reference/react-compiler/compilationMode) setting if you've set it.

`"use memo"` explicitly marks a function for optimization, overriding the default behavior:

* In `annotation` mode: Only functions with `"use memo"` are optimized
* In `infer` mode: The compiler uses heuristics, but `"use memo"` forces optimization
* In `all` mode: Everything is optimized by default, making `"use memo"` redundant

The directive creates a clear boundary in your codebase between optimized and non-optimized code, giving you fine-grained control over the compilation process.

### When to use `"use memo"` {/*when-to-use*/}

You should consider using `"use memo"` when:

#### You're using annotation mode {/*annotation-mode-use*/}
In `compilationMode: 'annotation'`, the directive is required for any function you want optimized:

```js
// ✅ This component will be optimized
function OptimizedList() {
  "use memo";
  // ...
}

// ❌ This component won't be optimized
function SimpleWrapper() {
  // ...
}
```

#### You're gradually adopting React Compiler {/*gradual-adoption*/}
Start with `annotation` mode and selectively optimize stable components:

```js
// Start by optimizing leaf components
function Button({ onClick, children }) {
  "use memo";
  // ...
}

// Gradually move up the tree as you verify behavior
function ButtonGroup({ buttons }) {
  "use memo";
  // ...
}
```

---

## Usage {/*usage*/}

### Working with different compilation modes {/*compilation-modes*/}

The behavior of `"use memo"` changes based on your compiler configuration:

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'annotation' // or 'infer' or 'all'
    }]
  ]
};
```

#### Annotation mode {/*annotation-mode-example*/}
```js
// ✅ Optimized with "use memo"
function ProductCard({ product }) {
  "use memo";
  // ...
}

// ❌ Not optimized (no directive)
function ProductList({ products }) {
  // ...
}
```

#### Infer mode (default) {/*infer-mode-example*/}
```js
// Automatically memoized because this is named like a Component
function ComplexDashboard({ data }) {
  // ...
}

// Skipped: Is not named like a Component
function simpleDisplay({ text }) {
  // ...
}
```

In `infer` mode, the compiler automatically detects components and hooks by their naming patterns (PascalCase for components, `use` prefix for hooks). If a component or hook isn't being compiled in `infer` mode, you should fix its naming convention rather than forcing compilation with `"use memo"`.

---

## Troubleshooting {/*troubleshooting*/}

### Verifying optimization {/*verifying-optimization*/}

To confirm your component is being optimized:

1. Check the compiled output in your build
2. Use React DevTools to check for Memo ✨ badge

### See also {/*see-also*/}

* [`"use no memo"`](/reference/react-compiler/directives/use-no-memo) - Opt out of compilation
* [`compilationMode`](/reference/react-compiler/compilationMode) - Configure compilation behavior
* [React Compiler](/learn/react-compiler) - Getting started guide