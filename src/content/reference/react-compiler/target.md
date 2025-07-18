---
title: target
---

<Intro>

The `target` option specifies which React version the compiler should generate code for.

</Intro>

```js
{
  target: '19' // or '18', '17'
}
```

<InlineToc />

---

## Reference {/*reference*/}

### `target` {/*target*/}

Configures the React version compatibility for the compiled output.

#### Type {/*type*/}

```
'17' | '18' | '19'
```

#### Default value {/*default-value*/}

`'19'`

#### Valid values {/*valid-values*/}

- **`'19'`**: Target React 19 (default). No additional runtime required.
- **`'18'`**: Target React 18. Requires `react-compiler-runtime` package.
- **`'17'`**: Target React 17. Requires `react-compiler-runtime` package.

#### Caveats {/*caveats*/}

- Always use string values, not numbers (e.g., `'17'` not `17`)
- Don't include patch versions (e.g., use `'18'` not `'18.2.0'`)
- React 19 includes built-in compiler runtime APIs
- React 17 and 18 require installing `react-compiler-runtime@rc`

---

## Usage {/*usage*/}

### Targeting React 19 (default) {/*targeting-react-19*/}

For React 19, no special configuration is needed:

```js
{
  // defaults to target: '19'
}
```

The compiler will use React 19's built-in runtime APIs:

```js
// Compiled output uses React 19's native APIs
import { c as _c } from 'react/compiler-runtime';
```

### Targeting React 17 or 18 {/*targeting-react-17-or-18*/}

For React 17 and React 18 projects, you need two steps:

1. Install the runtime package:

```bash
npm install react-compiler-runtime@rc
```

2. Configure the target:

```js
// For React 18
{
  target: '18'
}

// For React 17
{
  target: '17'
}
```

The compiler will use the polyfill runtime for both versions:

```js
// Compiled output uses the polyfill
import { c as _c } from 'react-compiler-runtime';
```

---

## Troubleshooting {/*troubleshooting*/}

### Runtime errors about missing compiler runtime {/*missing-runtime*/}

If you see errors like "Cannot find module 'react/compiler-runtime'":

1. Check your React version:
   ```bash
   npm why react
   ```

2. If using React 17 or 18, install the runtime:
   ```bash
   npm install react-compiler-runtime@rc
   ```

3. Ensure your target matches your React version:
   ```js
   {
     target: '18' // Must match your React major version
   }
   ```

### Runtime package not working {/*runtime-not-working*/}

Ensure the runtime package is:

1. Installed in your project (not globally)
2. Listed in your `package.json` dependencies
3. The correct version (`@rc` tag)
4. Not in `devDependencies` (it's needed at runtime)

### Checking compiled output {/*checking-output*/}

To verify the correct runtime is being used, note the different import (`react/compiler-runtime` for builtin, `react-compiler-runtime` standalone package for 17/18):

```js
// For React 19 (built-in runtime)
import { c } from 'react/compiler-runtime'
//                      ^

// For React 17/18 (polyfill runtime)
import { c } from 'react-compiler-runtime'
//                      ^
```