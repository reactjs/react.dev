---
title: "use no memo"
titleForTitleTag: "'use no memo' directive"
---

<Intro>

`"use no memo"` prevents a function from being optimized by React Compiler.

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `"use no memo"` {/*use-no-memo*/}

Add `"use no memo"` at the beginning of a function to prevent React Compiler optimization.

```js {1}
function MyComponent() {
  "use no memo";
  // ...
}
```

When a function contains `"use no memo"`, the React Compiler will skip it entirely during optimization. This is useful as a temporary escape hatch when debugging or when dealing with code that doesn't work correctly with the compiler.

#### Caveats {/*caveats*/}

* `"use no memo"` must be at the very beginning of a function body, before any imports or other code (comments are OK).
* The directive must be written with double or single quotes, not backticks.
* The directive must exactly match `"use no memo"` or its alias `"use no forget"`.
* This directive takes precedence over all compilation modes and other directives.
* It's intended as a temporary debugging tool, not a permanent solution.

### How `"use no memo"` opts-out of optimization {/*how-use-no-memo-opts-out*/}

React Compiler analyzes your code at build time to apply optimizations. `"use no memo"` creates an explicit boundary that tells the compiler to skip a function entirely.

This directive takes precedence over all other settings:
* In `all` mode: The function is skipped despite the global setting
* In `infer` mode: The function is skipped even if heuristics would optimize it

The compiler treats these functions as if the React Compiler wasn't enabled, leaving them exactly as written.

### When to use `"use no memo"` {/*when-to-use*/}

`"use no memo"` should be used sparingly and temporarily. Common scenarios include:

#### Debugging compiler issues {/*debugging-compiler*/}
When you suspect the compiler is causing issues, temporarily disable optimization to isolate the problem:

```js
function ProblematicComponent({ data }) {
  "use no memo"; // TODO: Remove after fixing issue #123

  // Rules of React violations that weren't statically detected
  // ...
}
```

#### Third-party library integration {/*third-party*/}
When integrating with libraries that might not be compatible with the compiler:

```js
function ThirdPartyWrapper() {
  "use no memo";

  useThirdPartyHook(); // Has side effects that compiler might optimize incorrectly
  // ...
}
```

---

## Usage {/*usage*/}

The `"use no memo"` directive is placed at the beginning of a function body to prevent React Compiler from optimizing that function:

```js
function MyComponent() {
  "use no memo";
  // Function body
}
```

The directive can also be placed at the top of a file to affect all functions in that module:

```js
"use no memo";

// All functions in this file will be skipped by the compiler
```

`"use no memo"` at the function level overrides the module level directive.

---

## Troubleshooting {/*troubleshooting*/}

### Directive not preventing compilation {/*not-preventing*/}

If `"use no memo"` isn't working:

```js
// ❌ Wrong - directive after code
function Component() {
  const data = getData();
  "use no memo"; // Too late!
}

// ✅ Correct - directive first
function Component() {
  "use no memo";
  const data = getData();
}
```

Also check:
* Spelling - must be exactly `"use no memo"`
* Quotes - must use single or double quotes, not backticks

### Best practices {/*best-practices*/}

**Always document why** you're disabling optimization:

```js
// ✅ Good - clear explanation and tracking
function DataProcessor() {
  "use no memo"; // TODO: Remove after fixing rule of react violation
  // ...
}

// ❌ Bad - no explanation
function Mystery() {
  "use no memo";
  // ...
}
```

### See also {/*see-also*/}

* [`"use memo"`](/reference/react-compiler/directives/use-memo) - Opt into compilation
* [React Compiler](/learn/react-compiler) - Getting started guide