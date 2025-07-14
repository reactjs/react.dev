---
title: React Compiler Options
---

<Intro>

React Compiler is a build-time tool that automatically optimizes your React application by adding memoization.

</Intro>

```js
// babel.config.js
module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig],
    ],
  };
};
```

<InlineToc />

---

## Reference {/*reference*/}

### Configuration Options {/*configuration-options*/}

The React Compiler accepts configuration options to control its behavior. These options are passed to the Babel plugin.

```js
const ReactCompilerConfig = {
  compilationMode: 'infer',
  target: '19',
  sources: (filename) => {
    return filename.indexOf('src/path/to/dir') !== -1;
  },
  // Additional options...
};
```

#### `compilationMode` {/*compilationmode*/}

Controls how the compiler selects functions for compilation.

- **Type:** `'infer' | 'syntax' | 'annotation' | 'all'`
- **Default:** `'infer'`

```js
const ReactCompilerConfig = {
  compilationMode: 'infer' // Default mode
};
```

**Options:**
- `'infer'` (default): The compiler will compile:
  - Functions explicitly annotated with `"use memo"` directive
  - Component and hook functions that are named like a component or hook _and_ create JSX and/or call other hooks
- `'syntax'`: Only compile components using [Flow component syntax](https://flow.org/en/docs/react/component-syntax/) and hooks using [Flow hook syntax](https://flow.org/en/docs/react/hook-syntax/)
- `'annotation'`: Only compile functions that are explicitly annotated with `"use memo"` directive. This can be useful if you are incrementally adopting the compiler.
- `'all'`: Compile all top-level functions (not recommended, as it may mistakenly compile non-React functions)

#### `target` {/*target*/}

Specifies the React version for compatibility.

- **Type:** `'17' | '18' | '19'`
- **Default:** `'19'`

```js
const ReactCompilerConfig = {
  target: '18'
};
```

When targeting older React versions, install `react-compiler-runtime`:

<TerminalBlock>
npm install react-compiler-runtime@rc
</TerminalBlock>

#### `sources` {/*sources*/}

Filters which files to compile, enabling incremental adoption. If overriden, you must manually ignore the node_modules directory as it is not recommended to compile transformed JS.

- **Type:** `string[] | (filename: string) => boolean`
- **Default:** Excludes `node_modules`

```js
// Compile specific directories
const ReactCompilerConfig = {
  sources: (filename) => {
    return filename.indexOf('src/components') !== -1;
  }
};

// Compile specific file patterns
const ReactCompilerConfig = {
  sources: ['src/**/*.jsx', 'src/**/*.tsx']
};
```

Alternatively, use Babel's builtin [`overrides`](https://babeljs.io/docs/options#overrides) option:

```js
  // babel.config.js
  module.exports = {
    plugins: [
      // Global plugins that run on all files
    ],
    overrides: [
      {
        test: "./src/specific-directory/**/*.{js,jsx,ts,tsx}",
        plugins: [
          "babel-plugin-react-compiler"
        ]
      }
    ]
  };
```

#### `panicThreshold` {/*panicthreshold*/}

Controls compiler behavior when encountering errors.

- **Type:** `'all_errors' | 'critical_errors' | 'none'`
- **Default:** `'none'`

```js
const ReactCompilerConfig = {
  panicThreshold: 'none' // Recommended for production
};
```

**Options:**
- `'none'` (recommended): The compiler automatically skips components and hooks that break the Rules of React, allowing the rest of your code to be optimized
- `'critical_errors'`: Causes build failures when critical errors are found
- `'all_errors'`: Causes build failures when any diagnostic errors are found

<Note>
**Important:** The default value `'none'` is the best choice for most applications. Using `'all_errors'` or `'critical_errors'` will cause build failures and should only be used for debugging during development. Production builds should always use `'none'`.
</Note>

#### `noEmit` {/*noemit*/}

Runs analysis without generating code.

- **Type:** `boolean`
- **Default:** `false`

```js
const ReactCompilerConfig = {
  noEmit: true // Analysis only, no code generation
};
```

#### `logger` {/*logger*/}

Provides custom logging for compiler events.

- **Type:** `Logger | null`
- **Default:** `null`

For example:

```ts
const ReactCompilerConfig = {
  logger: {
    logEvent(filename: string | null, event: LoggerEvent) {
      switch (event.kind) {
        case "CompileSuccess": {
          console.log("✨ React Compiler successfully compiled: ", filename);
          break;
        }
        case "CompileError": {
          console.warn("⚠️ React Compiler failed to compile: " + filename);
          console.warn(filename, JSON.stringify(event, null, 2));
        }
        default: {
          console.log(`React Compiler: ${filename}: ${event.kind}`);
        }
      }
    }
  }
};
```

#### `gating` {/*gating*/}

Enables conditional compilation based on an external feature flag.

- **Type:** `{ source: string, importSpecifierName: string } | null`
- **Default:** `null`

```js
const ReactCompilerConfig = {
  gating: {
    source: 'ReactCompilerFeatureFlag',
    importSpecifierName: 'isCompilerEnabled'
  }
};
```

When configured, the compiler creates two versions of each compiled function: one optimized and one original. The optimized version is conditionally used based on the imported feature flag.

**Example gating module implementation:**

```js
// ReactCompilerFeatureFlag.js
export function isCompilerEnabled() {
  // Your logic to determine if the compiler should be enabled
  return process.env.REACT_COMPILER_ENABLED === 'true' ||
    Math.random() < 0.5; // A/B testing example
}
```

With this configuration, compiled components will conditionally use optimizations:

```js
// Before compilation
function MyComponent(props) {
  return <div>{props.text}</div>;
}

// After compilation (simplified)
import { isCompilerEnabled } from 'ReactCompilerFeatureFlag';
import { c as _c } from 'react/compiler-runtime';

const MyComponent = isCompilerEnabled()
  ? function MyComponent(props) {
      const $ = _c(2);
      let t0;
      if ($[0] !== props.text) {
        t0 = <div>{props.text}</div>;
        $[0] = props.text;
        $[1] = t0;
      } else {
        t0 = $[1];
      }
      return t0;
    }
  : function MyComponent(props) {
      return <div>{props.text}</div>;
    };
```

### Directives {/*directives*/}

Directives are special string literals that control compiler behavior for specific functions.

#### `"use memo"` {/*use-memo*/}

Opts in a component or hook for compilation.

```js
function MyComponent() {
  "use memo";
  // This component will be optimized by the compiler
  return <div>{/* ... */}</div>;
}
```

**Usage:**
- Place at the beginning of the function body
- Forces compilation when using `compilationMode: 'annotation'`
- In `compilationMode: 'infer'`, explicitly marks function for optimization

#### `"use no memo"` {/*use-no-memo*/}

Opts out a component or hook from compilation.

```js
function MyComponent() {
  "use no memo";
  // This component will not be optimized by the compiler
  return <div>{/* ... */}</div>;
}
```

**Usage:**
- Place at the beginning of the function body
- Use when debugging compilation issues
- Temporary escape hatch, not meant for permanent use