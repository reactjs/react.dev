---
title: Configuration
---

<Intro>

This page lists all configuration options available in React Compiler.

</Intro>

<Note>

For most apps, the default options should work out of the box. If you have a special need, you can use these advanced options.

</Note>

```js
// babel.config.js
module.exports = {
  plugins: [
    [
      'babel-plugin-react-compiler', {
        // compiler options
      }
    ]
  ]
};
```

---

## Compilation Control {/*compilation-control*/}

These options control *what* the compiler optimizes and *how* it selects components and hooks to compile.

* [`compilationMode`](/reference/react-compiler/compilationMode) controls the strategy for selecting functions to compile (e.g., all functions, only annotated ones, or intelligent detection).

```js
{
  compilationMode: 'annotation' // Only compile "use memo" functions
}
```

---

## Version Compatibility {/*version-compatibility*/}

React version configuration ensures the compiler generates code compatible with your React version.

[`target`](/reference/react-compiler/target) specifies which React version you're using (17, 18, or 19).

```js
// For React 18 projects
{
  target: '18' // Also requires react-compiler-runtime package
}
```

---

## Error Handling {/*error-handling*/}

These options control how the compiler responds to code that doesn't follow the [Rules of React](/reference/rules).

[`panicThreshold`](/reference/react-compiler/panicThreshold) determines whether to fail the build or skip problematic components.

```js
// Recommended for production
{
  panicThreshold: 'none' // Skip components with errors instead of failing the build
}
```

---

## Debugging {/*debugging*/}

Logging and analysis options help you understand what the compiler is doing.

[`logger`](/reference/react-compiler/logger) provides custom logging for compilation events.

```js
{
  logger: {
    logEvent(filename, event) {
      if (event.kind === 'CompileSuccess') {
        console.log('Compiled:', filename);
      }
    }
  }
}
```

---

## Feature Flags {/*feature-flags*/}

Conditional compilation lets you control when optimized code is used.

[`gating`](/reference/react-compiler/gating) enables runtime feature flags for A/B testing or gradual rollouts.

```js
{
  gating: {
    source: 'my-feature-flags',
    importSpecifierName: 'isCompilerEnabled'
  }
}
```

---

## Common Configuration Patterns {/*common-patterns*/}

### Default configuration {/*default-configuration*/}

For most React 19 applications, the compiler works without configuration:

```js
// babel.config.js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler'
  ]
};
```

### React 17/18 projects {/*react-17-18*/}

Older React versions need the runtime package and target configuration:

```bash
npm install react-compiler-runtime@rc
```

```js
{
  target: '18' // or '17'
}
```

### Incremental adoption {/*incremental-adoption*/}

Start with specific directories and expand gradually:

```js
{
  compilationMode: 'annotation' // Only compile "use memo" functions
}
```

