---
title: Incremental Adoption
---

<Intro>
React Compiler can be adopted incrementally, allowing you to try it on specific parts of your codebase first. This guide shows you how to gradually roll out the compiler in existing projects.
</Intro>

<YouWillLearn>

* Why incremental adoption is recommended
* Using Babel overrides for directory-based adoption
* Using the "use memo" directive for opt-in compilation
* Using the "use no memo" directive to exclude components
* Runtime feature flags with gating
* Monitoring your adoption progress

</YouWillLearn>

## Why Incremental Adoption? {/*why-incremental-adoption*/}

While React Compiler is designed to handle most React code automatically, adopting it incrementally allows you to:

- Test the compiler on a small portion of your app first
- Identify and fix any Rules of React violations
- Build confidence before expanding to your entire codebase
- Minimize risk in production applications

## Approaches to Incremental Adoption {/*approaches-to-incremental-adoption*/}

There are three main approaches to adopt React Compiler incrementally:

1. **Babel overrides** - Apply the compiler to specific directories
2. **Opt-in with "use memo"** - Only compile components that explicitly opt in
3. **Runtime gating** - Control compilation with feature flags

All approaches allow you to test the compiler on specific parts of your application before full rollout.

## Directory-Based Adoption with Babel Overrides {/*directory-based-adoption*/}

Babel's `overrides` option lets you apply different plugins to different parts of your codebase. This is ideal for gradually adopting React Compiler directory by directory.

### Basic Configuration {/*basic-configuration*/}

Start by applying the compiler to a specific directory:

```js
// babel.config.js
module.exports = {
  plugins: [
    // Global plugins that apply to all files
  ],
  overrides: [
    {
      test: './src/modern/**/*.{js,jsx,ts,tsx}',
      plugins: [
        'babel-plugin-react-compiler'
      ]
    }
  ]
};
```

### Expanding Coverage {/*expanding-coverage*/}

As you gain confidence, add more directories:

```js
// babel.config.js
module.exports = {
  plugins: [
    // Global plugins
  ],
  overrides: [
    {
      test: ['./src/modern/**/*.{js,jsx,ts,tsx}', './src/features/**/*.{js,jsx,ts,tsx}'],
      plugins: [
        'babel-plugin-react-compiler'
      ]
    },
    {
      test: './src/legacy/**/*.{js,jsx,ts,tsx}',
      plugins: [
        // Different plugins for legacy code
      ]
    }
  ]
};
```

### With Compiler Options {/*with-compiler-options*/}

You can also configure compiler options per override:

```js
// babel.config.js
module.exports = {
  plugins: [],
  overrides: [
    {
      test: './src/experimental/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          compilationMode: 'annotation', // Only compile "use memo" components
          panicThreshold: 'NONE' // More permissive for experimental code
        }]
      ]
    },
    {
      test: './src/production/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          panicThreshold: 'CRITICAL_ERRORS' // Stricter for production code
        }]
      ]
    }
  ]
};
```


## Opt-in Mode with "use memo" {/*opt-in-mode-with-use-memo*/}

For maximum control, you can use `compilationMode: 'annotation'` to only compile components and hooks that explicitly opt in with the `"use memo"` directive.

<Note>
This approach gives you fine-grained control over individual components and hooks. It's useful when you want to test the compiler on specific components without affecting entire directories.
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

This gives you precise control over which components are compiled while you evaluate the compiler's impact.

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

## Troubleshooting Adoption {/*troubleshooting-adoption*/}

If you encounter issues during adoption:

1. Use `"use no memo"` to temporarily exclude problematic components
2. Check the [debugging guide](/learn/react-compiler/debugging) for common issues
3. Fix Rules of React violations identified by the ESLint plugin
4. Consider using `compilationMode: 'annotation'` for more gradual adoption

## Next Steps {/*next-steps*/}

- Read the [configuration guide](/reference/react-compiler/configuration) for more options
- Learn about [debugging techniques](/learn/react-compiler/debugging)
- Check the [API reference](/reference/react-compiler/configuration) for all compiler options