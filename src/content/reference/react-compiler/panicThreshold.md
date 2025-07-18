---
title: panicThreshold
---

<Intro>

The `panicThreshold` option controls how the React Compiler handles errors during compilation.

</Intro>

```js
{
  panicThreshold: 'none' // Recommended
}
```

<InlineToc />

---

## Reference {/*reference*/}

### `panicThreshold` {/*panicthreshold*/}

Determines whether compilation errors should fail the build or skip optimization.

#### Type {/*type*/}

```
'none' | 'critical_errors' | 'all_errors'
```

#### Default value {/*default-value*/}

`'none'`

#### Options {/*options*/}

- **`'none'`** (default, recommended): Skip components that can't be compiled and continue building
- **`'critical_errors'`**: Fail the build only on critical compiler errors
- **`'all_errors'`**: Fail the build on any compiler diagnostic

#### Caveats {/*caveats*/}

- Production builds should always use `'none'`
- Build failures prevent your application from building
- The compiler automatically detects and skips problematic code with `'none'`
- Higher thresholds are only useful during development for debugging

---

## Usage {/*usage*/}

### Production configuration (recommended) {/*production-configuration*/}

For production builds, always use `'none'`. This is the default value:

```js
{
  panicThreshold: 'none'
}
```

This ensures:
- Your build never fails due to compiler issues
- Components that can't be optimized run normally
- Maximum components get optimized
- Stable production deployments

### Development debugging {/*development-debugging*/}

Temporarily use stricter thresholds to find issues:

```js
const isDevelopment = process.env.NODE_ENV === 'development';

{
  panicThreshold: isDevelopment ? 'critical_errors' : 'none',
  logger: {
    logEvent(filename, event) {
      if (isDevelopment && event.kind === 'CompileError') {
        // ...
      }
    }
  }
}
```