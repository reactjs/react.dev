---
title: Installation
---

<Intro>
This guide will help you install and configure React Compiler in your React application.
</Intro>

<YouWillLearn>

* How to install React Compiler
* Basic configuration for different build tools
* How to verify your setup is working

</YouWillLearn>

## Prerequisites {/*prerequisites*/}

React Compiler is designed to work best with React 19, but it also supports React 17 and 18. Learn more about [React version compatibility](/reference/react-compiler/target).

## Installation {/*installation*/}

Install React Compiler as a `devDependency`:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

Or with Yarn:

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@latest
</TerminalBlock>

Or with pnpm:

<TerminalBlock>
pnpm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

## Basic Setup {/*basic-setup*/}

React Compiler is designed to work by default without any configuration. However, if you need to configure it in special circumstances (for example, to target React versions below 19), refer to the [compiler options reference](/reference/react-compiler/configuration).

The setup process depends on your build tool. React Compiler includes a Babel plugin that integrates with your build pipeline.

<Pitfall>
React Compiler must run **first** in your Babel plugin pipeline. The compiler needs the original source information for proper analysis, so it must process your code before other transformations.
</Pitfall>

### Babel {/*babel*/}

Create or update your `babel.config.js`:

```js {3}
module.exports = {
  plugins: [
    'babel-plugin-react-compiler', // must run first!
    // ... other plugins
  ],
  // ... other config
};
```

### Vite {/*vite*/}

If you use Vite, you can add the plugin to vite-plugin-react:

```js {3,9}
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```

Alternatively, if you prefer a separate Babel plugin for Vite:

<TerminalBlock>
npm install -D vite-plugin-babel
</TerminalBlock>

```js {2,11}
// vite.config.js
import babel from 'vite-plugin-babel';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    babel({
      babelConfig: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```

### Next.js {/*usage-with-nextjs*/}

Please refer to the [Next.js docs](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler) for more information.

### React Router {/*usage-with-react-router*/}
Install `vite-plugin-babel`, and add the compiler's Babel plugin to it:

<TerminalBlock>
npm install vite-plugin-babel
</TerminalBlock>

```js {3-4,16}
// vite.config.js
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import { reactRouter } from "@react-router/dev/vite";

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({
  plugins: [
    reactRouter(),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"], // if you use TypeScript
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
});
```

### Webpack {/*usage-with-webpack*/}

A community webpack loader is [now available here](https://github.com/SukkaW/react-compiler-webpack).

### Expo {/*usage-with-expo*/}

Please refer to [Expo's docs](https://docs.expo.dev/guides/react-compiler/) to enable and use the React Compiler in Expo apps.

### Metro (React Native) {/*usage-with-react-native-metro*/}

React Native uses Babel via Metro, so refer to the [Usage with Babel](#babel) section for installation instructions.

### Rspack {/*usage-with-rspack*/}

Please refer to [Rspack's docs](https://rspack.dev/guide/tech/react#react-compiler) to enable and use the React Compiler in Rspack apps.

### Rsbuild {/*usage-with-rsbuild*/}

Please refer to [Rsbuild's docs](https://rsbuild.dev/guide/framework/react#react-compiler) to enable and use the React Compiler in Rsbuild apps.


## ESLint Integration {/*eslint-integration*/}

React Compiler includes an ESLint rule that helps identify code that can't be optimized. When the ESLint rule reports an error, it means the compiler will skip optimizing that specific component or hook. This is safe: the compiler will continue optimizing other parts of your codebase. You don't need to fix all violations immediately. Address them at your own pace to gradually increase the number of optimized components.

Install the ESLint plugin:

<TerminalBlock>
npm install -D eslint-plugin-react-hooks@latest
</TerminalBlock>

If you haven't already configured eslint-plugin-react-hooks, follow the [installation instructions in the readme](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/README.md#installation). The compiler rules are available in the `recommended-latest` preset.

The ESLint rule will:
- Identify violations of the [Rules of React](/reference/rules)
- Show which components can't be optimized
- Provide helpful error messages for fixing issues

## Verify Your Setup {/*verify-your-setup*/}

After installation, verify that React Compiler is working correctly.

### Check React DevTools {/*check-react-devtools*/}

Components optimized by React Compiler will show a "Memo ✨" badge in React DevTools:

1. Install the [React Developer Tools](/learn/react-developer-tools) browser extension
2. Open your app in development mode
3. Open React DevTools
4. Look for the ✨ emoji next to component names

If the compiler is working:
- Components will show a "Memo ✨" badge in React DevTools
- Expensive calculations will be automatically memoized
- No manual `useMemo` is required

### Check Build Output {/*check-build-output*/}

You can also verify the compiler is running by checking your build output. The compiled code will include automatic memoization logic that the compiler adds automatically.

```js
import { c as _c } from "react/compiler-runtime";
export default function MyApp() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <div>Hello World</div>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

```

## Troubleshooting {/*troubleshooting*/}

### Opting out specific components {/*opting-out-specific-components*/}

If a component is causing issues after compilation, you can temporarily opt it out using the `"use no memo"` directive:

```js
function ProblematicComponent() {
  "use no memo";
  // Component code here
}
```

This tells the compiler to skip optimization for this specific component. You should fix the underlying issue and remove the directive once resolved.

For more troubleshooting help, see the [debugging guide](/learn/react-compiler/debugging).

## Next Steps {/*next-steps*/}

Now that you have React Compiler installed, learn more about:

- [React version compatibility](/reference/react-compiler/target) for React 17 and 18
- [Configuration options](/reference/react-compiler/configuration) to customize the compiler
- [Incremental adoption strategies](/learn/react-compiler/incremental-adoption) for existing codebases
- [Debugging techniques](/learn/react-compiler/debugging) for troubleshooting issues
- [Compiling Libraries guide](/reference/react-compiler/compiling-libraries) for compiling your React library
