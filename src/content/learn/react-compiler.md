---
title: React Compiler
---

<Intro>
This page will give you an introduction to the new experimental React Compiler and how to try it out successfully.
</Intro>

<YouWillLearn>

* Getting started with the compiler
* Installing the compiler and eslint plugin
* Troubleshooting

</YouWillLearn>

<Note>
React Compiler is a new experimental compiler that we've open sourced to get early feedback from the community. It still has rough edges and is not yet fully ready for production.
</Note>

React Compiler is a new experimental compiler that we've open sourced to get early feedback from the community. It is a build-time only tool that automatically optimizes your React app. It works with plain JavaScript, and understands the [Rules of React](/reference/rules), so you don't need to rewrite any code to use it.

The compiler also includes an [eslint plugin](#installing-eslint-plugin-react-compiler) that surfaces the analysis from the compiler right in your editor. The plugin runs independently of the compiler and can be used even if you aren't using the compiler in your app. We recommend all React developers to use this eslint plugin to help improve the quality of your codebase.

### What does the compiler do? {/*what-does-the-compiler-do*/}

The compiler understands your code at a deep level through its understanding of plain JavaScript semantics and the [Rules of React](/reference/rules). This allows it to add automatic optimizations to your code.

#### Automatic Memoization {/*automatic-memoization*/}
The first optimization that we've added is **auto-memoization**. At time of writing, this is the only optimization available in React Compiler.

You may be familiar today with manual memoization through [`useMemo`](/reference/react/useMemo), [`useCallback`](/reference/react/useCallback), and [`React.memo`](/reference/react/memo). The compiler can automatically do this for you, if your code follows the [Rules of React](/reference/rules). If it detects breakages of the rules, it will automatically skip over just those components or hooks, and continue safely compiling other code.

If your codebase is already very well memoized, you might not expect to see major performance improvements with the compiler. However, in practice memoizing the correct dependencies that cause performance issues is tricky to get right by hand.

### Should I try out the compiler? {/*should-i-try-out-the-compiler*/}

Please note that the compiler is still experimental and has many rough edges. While it has been used in production at companies like Meta, rolling out the compiler to production for your app will depend on the health of your codebase and how well you've followed the [Rules of React](/reference/rules).

**You don't have to rush into using the compiler now. It's okay to wait until it reaches a stable release before adopting it.** However, we do appreciate trying it out in small experiments in your apps so that you can [provide feedback](#reporting-issues) to us to help make the compiler better.

## Getting Started {/*getting-started*/}

TODO
* General philosophy of the alpha (no node_modules, focus on apps first, libraries later)
* Running the healthcheck script
* Expectations
* Tradeoffs (bundle size, memory)

### How does the compiler make my app faster? {/*how-does-the-compiler-make-my-app-faster*/}

React Compiler is an optimizing compiler that optimizes your components and hooks. It is a single-file compiler, meaning that it only looks at the contents of a single file in order to perform its optimization.

The compiler was designed to understand JavaScript as it was originally written – meaning before the code has been through any other transform or compile step. It can also understand TypeScript and Flow syntax, but it won't preserve those types after it outputs the compiled code.

TODO explain why we don't compile node_modules

It works by bounding re-renders.

TODO Explain what a cascading render is and why it's bad for perf.

TODO diagrams
* Diagram of an component tree
* Show rerendering a tree with compiler on and off

The compiler builds up an understanding of which values need to be memoized in order to prevent cascading renders. Not every value used inside of a component or hook will be memoized.

When thinking about where the compiler can have the most impact, we tend to see the biggest differences in components higher up in the tree that have large children trees. If you prevent a parent component high up in the tree from re-rendering, it'll stop that cascading render.

For that reason, ...

* focus on product code first
* can also try on your internal component libraries

### Rolling out the compiler to your codebase {/*using-the-compiler-effectively*/}

TODO: actually implement `includes`

#### Existing projects {/*existing-projects*/}
The compiler is designed to compile functional components and hooks that follows the [Rules of React](/reference/rules). It can also handle code that breaks those rules by bailing out (skipping over) those components or hooks. However, due to the flexible nature of JavaScript, the compiler cannot catch every possible violation and may compile with false negatives: that is, the compiler may accidentally compile a component/hook that breaks the Rules of React which can lead to undefined behavior.

For this reason, to adopt the compiler successfully on existing projects, we recommend running it on a small directory in your product code first. You can do by configuring the compiler to only run on a list of glob patterns:

```js {2}
const ReactCompilerConfig = {
  includes: ['src/app/allowlisted_directory/*.tsx'],
};
```

You can also configure the compiler to run in "opt-in" mode using the `compilationMode: "annotation"` option. This makes it so the compiler will only compile components and hooks annotated with a `"use memo"` directive. Please note that the `annotation` mode is a temporary one to aid early adopters, and that we don't intend for the `"use memo"` directive to be used for the long term.

```js {2,7}
const ReactCompilerConfig = {
  compilationMode: "annotation",
};

// src/app.jsx
export default function App() {
  "use memo";
  // ...
}
```

When you have more confidence with rolling out the compiler, you can expand coverage to other directories as well and slowly roll it out to your whole app.

#### New projects {/*new-projects*/}

If you're starting a new project, you can enable the compiler on your entire codebase:

```js {2}
const ReactCompilerConfig = {
  includes: ['src/**/*.tsx'],
};
```

## Installation {/*installation*/}

TODO
* run healthcheck script
* npm install compiler and eslint plugin
* configuring directories

### Checking compatibility {/*checking-compatibility*/}

Prior to installing the compiler, you should first check if your codebase is compatible:

<TerminalBlock>
npx react-compiler-healthcheck
</TerminalBlock>

TODO
- reserve npm name
- write out what this script should do
- implement script

### Installing eslint-plugin-react-compiler {/*installing-eslint-plugin-react-compiler*/}

React Compiler also powers an eslint plugin. The eslint plugin can be used **independently** of the compiler, meaning you can use the eslint plugin even if you don't use the compiler.

<TerminalBlock>
npm install eslint-plugin-react-compiler
</TerminalBlock>

TODO: what else?



#### Configure included directories {/*configure-included-directories*/}

Because React Compiler is still experimental, its usage is opt-in: you must pass the compiler a list of directories to compile.

```js
const ReactCompilerConfig = {
  includes: ['/path/to/dir', '/path/to/dir'],
};
```

### Usage with Babel {/*usage-with-babel*/}

<TerminalBlock>
npm install babel-plugin-react-compiler
</TerminalBlock>

Although the React Compiler is largely decoupled from Babel, we currently only support a Babel integration, so this package includes a Babel plugin which you can use in your build pipeline to run the compiler.

TODO: add explanations for other frameworks

Then, add it to your Babel config:

```js {7}
// babel.config.js
const ReactCompilerConfig = { /* ... */ };

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig], // must run first!
      // ...
    ],
  };
};
```

Please note that the babel-plugin-react-compiler should run first before other Babel plugins or presets as the compiler requires the input source information for sound analysis.

### Usage with Vite {/*usage-with-vite*/}

If you use Vite, you can add the plugin to vite-plugin-react:

```js {10}
// vite.config.js
const ReactCompilerConfig = { /* ... */ };

export default defineConfig(() => {
  return {
    plugins: [
      react({
        babel: {
          plugins: [
            ["babel-plugin-react-compiler", ReactCompilerConfig],
          ],
        },
      }),
    ],
    // ...
  };
});
```

#### vite:import-analysis Failed to resolve import react-compiler-runtime {/*viteimport-analysis-failed-to-resolve-import-react-compiler-runtime*/}

If you see `vite:import-analysis Failed to resolve import react-compiler-runtime`, this error occurs when you use the [`enableUseMemoCachePolyfill`](/reference/react-compiler/options#enable-use-memo-cache-polyfill) compiler option. Because this option dynamically injects an import to `react-compiler-runtime`, we need to teach Vite how to resolve it:

```js {10-11}
// vite.config.js
const { resolve } = require('path');
const ReactCompilerConfig = { /* ... */ };

export default defineConfig(() => {
  return {
    // ...
    resolve: {
      alias: [
        {
          find: "react-compiler-runtime",
          replacement: resolve(__dirname, "./node_modules/react-compiler-runtime"),
        },
      ],
    },
  };
});
```

### Usage with Next.js {/*usage-with-nextjs*/}

First, [configure Babel](#usage-with-babel). Then, configure Webpack to resolve `react-compiler-runtime`, which is injected dynamically by the compiler:

TODO: verify that this is actually needed when installed with npm

```js
// .next.config.js
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, options) => {
    // ...
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-compiler-runtime": path.resolve(
        __dirname,
        "node_modules/react-comiler-runtime",
      ),
    };
    return config;
  },
};

module.exports = nextConfig;
```

### Usage with Remix {/*usage-with-remix*/}
TODO

### Usage with Webpack {/*usage-with-webpack*/}

You can create your own loader for React Compiler, like so:

```js
const ReactCompilerConfig = { /* ... */ };
const BabelPluginReactCompiler = require('babel-plugin-react-compiler');

function reactCompilerLoader(sourceCode, sourceMap) {
  // ...
  const result = transformSync(sourceCode, {
    // ...
    plugins: [
      [BabelPluginReactCompiler, ReactCompilerConfig],
    ],
  // ...
  });

  if (result === null) {
    this.callback(
      Error(
        `Failed to transform "${options.filename}"`
      )
    );
    return;
  }

  this.callback(
    null,
    result.code
    result.map === null ? undefined : result.map
  );
}

module.exports = reactCompilerLoader;
```

### Usage with Expo {/*usage-with-expo*/}

Expo uses Babel via Metro, so refer to the [Usage with Babel](#usage-with-babel) section for installation instructions.

### Usage with React Native (Metro) {/*usage-with-react-native-metro*/}

React Native uses Babel via Metro, so refer to the [Usage with Babel](#usage-with-babel) section for installation instructions.

## Troubleshooting {/*troubleshooting*/}

### Reporting Issues {/*reporting-issues*/}

To report issues, please first create a minimal repro on the [React Compiler Playground](https://0xeac7-forget.vercel.app/) and include it in your bug report.

You can open issues in the [facebook/react](https://github.com/facebook/react/issues) repo.

### Common Issues {/*common-issues*/}

#### `(0 , _react.unstable_useMemoCache) is not a function` error {/*0--_reactunstable_usememocache-is-not-a-function-error*/}

This occurs during JavaScript module evaluation when you are not using an experimental version of React that has this API, and you haven't enabled the `enableUseMemoCachePolyfill` compiler option.

To fix, either change your React version to an experimental one, or enable the polyfill.

### Known Issues {/*known-issues*/}

### Incompatible libraries {/*incompatible-libraries*/}

### Debugging {/*debugging*/}

#### Checking if components have been compiled {/*checking-if-components-have-been-compiled*/}
##### React DevTools {/*react-devtools*/}

React Devtools (v5.0+) has built-in support for the react compiler and will display a "Forget" badge against components that have been compiled by the compiler. Note that this only works if you're using the compiler with the experimental version of React, and not the polyfill.

##### Logger {/*logger*/}

The compiler exposes a logging interface to capture different diagnostics, including successful compilation. You can provide the logger to the compiler via the configuration.

```js
const ReactCompilerConfig = {
  logger: {
    log(filename, event) {
      if (event.kind === "CompileSuccess") {
        console.log(`Successfully compiled ${event.fnName} in ${filename}`)
      }
    }
  }
}
```

##### useEffect fires more frequently with the compiler {/*useeffect-fires-more-frequently-with-the-compiler*/}

If you notice your Effect running more frequently than anticipated, it could be due to a dependency that you previously memoized manually (using useMemo/useCallback) not being automatically memoized by the compiler.

The compiler applies several heuristics to decide which values need memoization to avoid unnecessary memory usage. However, this might sometimes result in a value that was previously memoized not being memoized now.

While this trade-off generally works well, it implies that developers should not rely on the compiler for memoizing a value correctly.

To prevent the compiler from dropping manual memoization and causing correctness issues, it will stop compilation of the component and bailout out if it cannot guarantee the memoization of existing manually memoized values.

##### Hooks are called conditionally {/*hooks-are-called-conditionally*/}

If your hooks don't start with the 'use' prefix, the compiler will consider them as regular functions and memoize them.  These memoized functions will only be called their dependencies change, causing this error.

To fix this error, rename your hook to start with an 'use' prefix.