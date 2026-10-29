---
title: Debugging and Troubleshooting
---

<Intro>
This guide helps you identify and fix issues when using React Compiler. Learn how to debug compilation problems and resolve common issues.
</Intro>

<YouWillLearn>

* The difference between compiler errors and runtime issues
* Common patterns that break compilation
* Step-by-step debugging workflow

</YouWillLearn>

## Understanding Compiler Behavior {/*understanding-compiler-behavior*/}

React Compiler is designed to handle code that follows the [Rules of React](/reference/rules). When it encounters code that might break these rules, it safely skips optimization rather than risk changing your app's behavior.

### Unsupported Syntax {/*unsupported-syntax*/}

Code can follow the Rules of React and still use syntax that the compiler doesn't support yet. With the default [`panicThreshold: 'none'`](/reference/react-compiler/panicThreshold), the compiler skips the affected component or Hook and continues building. The code runs normally, but without compiler optimizations.

For example, React Compiler 1.0 doesn't support these patterns:

- Conditional expressions (`condition ? a : b`), logical expressions (`&&`, `||`, `??`), and optional chaining (`?.`) inside a `try` block
- `throw` statements inside a `try` block
- `try` statements with a `finally` clause

These limitations can change between compiler versions. Some unsupported patterns aren't reported by ESLint. To see why a function was skipped in your version, configure the compiler's [`logger`](/reference/react-compiler/logger#detailed-error-logging) and inspect `CompileError` events.

Not every `try/catch` causes a skip. For example, calling `JSON.parse` inside `try` is supported, but adding a conditional expression causes this component to be skipped:

```js
function Preview({text}) {
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  return <div>{data?.name ?? 'No data'}</div>;
}
```

If you need this syntax, move the parsing logic into a standalone utility function. The compiler can then optimize the component that calls it:

```js
function parseData(text) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

function Preview({text}) {
  const data = parseData(text);
  return <div>{data?.name ?? 'No data'}</div>;
}
```

### Compiler Errors vs Runtime Issues {/*compiler-errors-vs-runtime-issues*/}

**Compiler errors** occur at build time and prevent your code from compiling. These are rare because the compiler is designed to skip problematic code rather than fail.

**Runtime issues** occur when compiled code behaves differently than expected. Most of the time, if you encounter an issue with React Compiler, it's a runtime issue. This typically happens when your code violates the Rules of React in subtle ways that the compiler couldn't detect, and the compiler mistakenly compiled a component it should have skipped.

When debugging runtime issues, focus your efforts on finding Rules of React violations in the affected components that were not detected by the ESLint rule. The compiler relies on your code following these rules, and when they're broken in ways it can't detect, that's when runtime problems occur.


## Common Breaking Patterns {/*common-breaking-patterns*/}

One of the main ways React Compiler can break your app is if your code was written to rely on memoization for correctness. This means your app depends on specific values being memoized to work properly. Since the compiler may memoize differently than your manual approach, this can lead to unexpected behavior like effects over-firing, infinite loops, or missing updates.

Common scenarios where this occurs:

- **Effects that rely on referential equality** - When effects depend on objects or arrays maintaining the same reference across renders
- **Dependency arrays that need stable references** - When unstable dependencies cause effects to fire too often or create infinite loops
- **Conditional logic based on reference checks** - When code uses referential equality checks for caching or optimization

## Debugging Workflow {/*debugging-workflow*/}

Follow these steps when you encounter issues:

### Compiler Build Errors {/*compiler-build-errors*/}

If you encounter a compiler error that unexpectedly breaks your build, this is likely a bug in the compiler. Report it to the [react/react](https://github.com/react/react/issues) repository with:
- The error message
- The code that caused the error
- Your React and compiler versions

### Runtime Issues {/*runtime-issues*/}

For runtime behavior issues:

### 1. Temporarily Disable Compilation {/*temporarily-disable-compilation*/}

Use `"use no memo"` to isolate whether an issue is compiler-related:

```js
function ProblematicComponent() {
  "use no memo"; // Skip compilation for this component
  // ... rest of component
}
```

If the issue disappears, it's likely related to a Rules of React violation.

You can also try removing manual memoization (useMemo, useCallback, memo) from the problematic component to verify that your app works correctly without any memoization. If the bug still occurs when all memoization is removed, you have a Rules of React violation that needs to be fixed.

### 2. Fix Issues Step by Step {/*fix-issues-step-by-step*/}

1. Identify the root cause (often memoization-for-correctness)
2. Test after each fix
3. Remove `"use no memo"` once fixed
4. Verify the component shows the ✨ badge in React DevTools

## Reporting Compiler Bugs {/*reporting-compiler-bugs*/}

If you believe you've found a compiler bug:

1. **Verify it's not a Rules of React violation** - Check with ESLint
2. **Create a minimal reproduction** - Isolate the issue in a small example
3. **Test without the compiler** - Confirm the issue only occurs with compilation
4. **File an [issue](https://github.com/react/react/issues/new?template=compiler_bug_report.yml)**:
   - React and compiler versions
   - Minimal reproduction code
   - Expected vs actual behavior
   - Any error messages

## Next Steps {/*next-steps*/}

- Review the [Rules of React](/reference/rules) to prevent issues
- Check the [incremental adoption guide](/learn/react-compiler/incremental-adoption) for gradual rollout strategies
