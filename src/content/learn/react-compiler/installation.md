---
title: Installation
---

<Intro>
This page will help you install React Compiler across major React frameworks.
</Intro>

<YouWillLearn>

* run healthcheck script
* npm install compiler and eslint plugin
* configuring directories

</YouWillLearn>

<Note>
React Compiler is a new experimental compiler that we've open sourced to get early feedback from the community. It still has rough edges and is not yet fully ready for production.
</Note>

## Checking compatibility {/*checking-compatibility*/}

Prior to installing the compiler, you should first check if your codebase is compatible:

<TerminalBlock>
npx react-compiler-healthcheck
</TerminalBlock>

TODO
- reserve npm name
- write out what this script should do
- implement script

## Installation {/*installation*/}

### Configure included directories {/*configure-included-directories*/}

Because React Compiler is still experimental, its usage is opt-in: you must pass the compiler a list of directories to compile.

```js
const ReactCompilerConfig = {
  includes: ['/path/to/dir', '/path/to/dir'],
};
```

### Usage with Babel {/*set-up-the-babel-plugin-react-compiler*/}

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
TODO

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