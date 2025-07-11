---
title: Incremental Adoption
---

<Intro>
React Compiler can be adopted incrementally, allowing you to try it on specific parts of your codebase first. This guide shows you how to gradually roll out the compiler in existing projects.
</Intro>

<YouWillLearn>

* Why incremental adoption is recommended
* How to use the `sources` option for gradual rollout
* Using the "use no memo" directive
* Monitoring your adoption progress

</YouWillLearn>

## Why Incremental Adoption? {/*why-incremental-adoption*/}

While React Compiler is designed to handle most React code automatically, adopting it incrementally allows you to:

- Test the compiler on a small portion of your app first
- Identify and fix any Rules of React violations
- Build confidence before expanding to your entire codebase
- Minimize risk in production applications

## Directory-Based Rollout {/*directory-based-rollout*/}

The `sources` option lets you specify which files the compiler should process. This is the recommended approach for existing applications.

### Start Small {/*start-small*/}

Begin with a new feature or a well-tested part of your application:

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      sources: ['src/features/new-dashboard/**'],
    }],
  ],
};
```

### Expand Gradually {/*expand-gradually*/}

As you verify the compiler works well, add more directories:

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      sources: [
        'src/features/new-dashboard/**',
        'src/components/common/**',
        'src/hooks/**',
      ],
    }],
  ],
};
```

### Full Adoption {/*full-adoption*/}

Once you're confident, remove the `sources` option to compile your entire codebase:

```js
// babel.config.js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler', // Now compiles everything
  ],
};
```

## Opt-in Mode with "use memo" {/*opt-in-mode-with-use-memo*/}

For maximum control, you can use `compilationMode: 'annotation'` to only compile components and hooks that explicitly opt in with the `"use memo"` directive.

<Note>
This approach is more tedious as you need to add the directive to every component and hook you want to compile. It's only recommended when trying the compiler on a very small scale.
</Note>

### Annotation Mode Configuration {/*annotation-mode-configuration*/}

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'annotation',
    }],
  ],
};
```

### Using the Directive {/*using-the-directive*/}

Add `"use memo"` at the beginning of functions you want to compile:

```js
function TodoList({ todos }) {
  "use memo"; // Opt this component into compilation

  const sortedTodos = todos.slice().sort();

  return (
    <ul>
      {sortedTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

function useSortedData(data) {
  "use memo"; // Opt this hook into compilation

  return data.slice().sort();
}
```

With `compilationMode: 'annotation'`, you must:
- Add `"use memo"` to every component you want optimized
- Add `"use memo"` to every custom hook
- Remember to add it to new components

For most projects, the directory-based approach with `sources` is more practical.

## Runtime Feature Flags with Gating {/*runtime-feature-flags-with-gating*/}

The `gating` option enables you to control compilation at runtime using feature flags. This is useful for running A/B tests or gradually rolling out the compiler based on user segments.

### How Gating Works {/*how-gating-works*/}

The compiler wraps optimized code in a runtime check. If the gate returns `true`, the optimized version runs. Otherwise, the original code runs.

### Gating Configuration {/*gating-configuration*/}

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        source: 'ReactCompilerFeatureFlags',
        importSpecifierName: 'isCompilerEnabled',
      },
    }],
  ],
};
```

### Implementing the Feature Flag {/*implementing-the-feature-flag*/}

Create a module that exports your gating function:

```js
// ReactCompilerFeatureFlags.js
export function isCompilerEnabled() {
  // Use your feature flag system
  return getFeatureFlag('react-compiler-enabled');
}
```

### Example: Percentage-Based Rollout {/*example-percentage-based-rollout*/}

```js
// ReactCompilerFeatureFlags.js
export function isCompilerEnabled() {
  // Enable for 20% of users
  const userId = getUserId();
  return hashUserId(userId) % 100 < 20;
}
```

### Example: Environment-Based Gating {/*example-environment-based-gating*/}

```js
// ReactCompilerFeatureFlags.js
export function isCompilerEnabled() {
  // Enable in staging, disable in production initially
  return process.env.REACT_APP_ENV === 'staging';
}
```

### Performance Testing with Gating {/*performance-testing-with-gating*/}

Gating is particularly useful for measuring performance impact:

1. Enable the compiler for a subset of users
2. Compare metrics between compiled and non-compiled versions
3. Monitor for any issues or regressions
4. Gradually increase the rollout percentage

## Troubleshooting Adoption {/*troubleshooting-adoption*/}

If you encounter issues during adoption:

1. Use `"use no memo"` to temporarily exclude problematic components
2. Check the [debugging guide](/learn/react-compiler/debugging) for common issues
3. Fix Rules of React violations identified by the ESLint plugin
4. Consider adopting more gradually with a smaller `sources` pattern

## Next Steps {/*next-steps*/}

- Read the [configuration guide](/learn/react-compiler/configuration) for more options
- Learn about [debugging techniques](/learn/react-compiler/debugging)
- Check the [API reference](/reference/react/react-compiler) for all compiler options