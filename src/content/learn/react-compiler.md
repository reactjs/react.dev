---
title: React Compiler
---

<Intro>
This page will give you an introduction to the new experimental React Compiler and how to try it out successfully.
</Intro>

<Wip>
These docs are still a work in progress. More documentation is available in the [React Compiler Working Group repo](https://github.com/reactwg/react-compiler/discussions), and will be upstreamed into these docs when they are more stable.
</Wip>

<YouWillLearn>

* Getting started with the compiler
* Installing the compiler and eslint plugin
* Troubleshooting

</YouWillLearn>

<Note>
React Compiler is a new experimental compiler that we've open sourced to get early feedback from the community. It still has rough edges and is not yet fully ready for production.

React Compiler requires React 19 Beta.
</Note>

React Compiler is a new experimental compiler that we've open sourced to get early feedback from the community. It is a build-time only tool that automatically optimizes your React app. It works with plain JavaScript, and understands the [Rules of React](/reference/rules), so you don't need to rewrite any code to use it.

The compiler also includes an [eslint plugin](#installing-eslint-plugin-react-compiler) that surfaces the analysis from the compiler right in your editor. The plugin runs independently of the compiler and can be used even if you aren't using the compiler in your app. We recommend all React developers to use this eslint plugin to help improve the quality of your codebase.

### What does the compiler do? {/*what-does-the-compiler-do*/}

The compiler understands your code at a deep level through its understanding of plain JavaScript semantics and the [Rules of React](/reference/rules). This allows it to add automatic optimizations to your code.

You may be familiar today with manual memoization through [`useMemo`](/reference/react/useMemo), [`useCallback`](/reference/react/useCallback), and [`React.memo`](/reference/react/memo). The compiler can automatically do this for you, if your code follows the [Rules of React](/reference/rules). If it detects breakages of the rules, it will automatically skip over just those components or hooks, and continue safely compiling other code.

If your codebase is already very well memoized, you might not expect to see major performance improvements with the compiler. However, in practice memoizing the correct dependencies that cause performance issues is tricky to get right by hand.

### Should I try out the compiler? {/*should-i-try-out-the-compiler*/}

Please note that the compiler is still experimental and has many rough edges. While it has been used in production at companies like Meta, rolling out the compiler to production for your app will depend on the health of your codebase and how well you've followed the [Rules of React](/reference/rules).

**You don't have to rush into using the compiler now. It's okay to wait until it reaches a stable release before adopting it.** However, we do appreciate trying it out in small experiments in your apps so that you can [provide feedback](#reporting-issues) to us to help make the compiler better.

## Getting Started {/*getting-started*/}

In addition to these docs, we recommend checking the [React Compiler Working Group](https://github.com/reactwg/react-compiler) for additional information and discussion about the compiler.

### Rolling out the compiler to your codebase {/*using-the-compiler-effectively*/}

#### Existing projects {/*existing-projects*/}
The compiler is designed to compile functional components and hooks that follow the [Rules of React](/reference/rules). It can also handle code that breaks those rules by bailing out (skipping over) those components or hooks. However, due to the flexible nature of JavaScript, the compiler cannot catch every possible violation and may compile with false negatives: that is, the compiler may accidentally compile a component/hook that breaks the Rules of React which can lead to undefined behavior.

For this reason, to adopt the compiler successfully on existing projects, we recommend running it on a small directory in your product code first. You can do this by configuring the compiler to only run on a specific set of directories:

```js {3}
const ReactCompilerConfig = {
  sources: (filename) => {
    return filename.indexOf('src/path/to/dir') !== -1;
  },
};
```

In rare cases, you can also configure the compiler to run in "opt-in" mode using the `compilationMode: "annotation"` option. This makes it so the compiler will only compile components and hooks annotated with a `"use memo"` directive. Please note that the `annotation` mode is a temporary one to aid early adopters, and that we don't intend for the `"use memo"` directive to be used for the long term.

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

If you're starting a new project, you can enable the compiler on your entire codebase, which is the default behavior.

## Installation {/*installation*/}

### Checking compatibility {/*checking-compatibility*/}

Prior to installing the compiler, you can first check to see if your codebase is compatible:

<TerminalBlock>
npx react-compiler-healthcheck
</TerminalBlock>

This script will:

- Check how many components can be successfully optimized: higher is better
- Check for `<StrictMode>` usage: having this enabled and followed means a higher chance that the [Rules of React](/reference/rules) are followed
- Check for incompatible library usage: known libaries that are incompatible with the compiler

As an example:

<TerminalBlock>
Successfully compiled 8 out of 9 components.
StrictMode usage not found.
Found no usage of incompatible libraries.
</TerminalBlock>

### Installing eslint-plugin-react-compiler {/*installing-eslint-plugin-react-compiler*/}

React Compiler also powers an eslint plugin. The eslint plugin can be used **independently** of the compiler, meaning you can use the eslint plugin even if you don't use the compiler.

<TerminalBlock>
npm install eslint-plugin-react-compiler
</TerminalBlock>

Then, add it to your eslint config:

```js
module.exports = {
  plugins: [
    'eslint-plugin-react-compiler',
  ],
  rules: {
    'react-compiler/react-compiler': "error",
  },
}
```

### Usage with Babel {/*usage-with-babel*/}

<TerminalBlock>
npm install babel-plugin-react-compiler
</TerminalBlock>

The compiler includes a Babel plugin which you can use in your build pipeline to run the compiler.

After installing, add it to your Babel config. Please note that it's critical that the compiler run **first** in the pipeline:

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

`babel-plugin-react-compiler` should run first before other Babel plugins as the compiler requires the input source information for sound analysis.

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

### Usage with Next.js {/*usage-with-nextjs*/}

Next.js has an experimental configuration to enable the React Compiler. It automatically ensures Babel is set up with `babel-plugin-react-compiler`.

- Install Next.js canary, which uses React 19 Release Candidate
- Install `babel-plugin-react-compiler`

<TerminalBlock>
npm install next@canary babel-plugin-react-compiler
</TerminalBlock>

Then configure the experimental option in `next.config.js`:

```js {4,5,6}
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

module.exports = nextConfig;
```

Using the experimental option ensures support for the React Compiler in:

- App Router
- Pages Router
- Webpack (default)
- Turbopack (opt-in through `--turbo`)


### Usage with Remix {/*usage-with-remix*/}
Install `vite-plugin-babel`, and add the compiler's Babel plugin to it:

<TerminalBlock>
npm install vite-plugin-babel
</TerminalBlock>

```js {2,14}
// vite.config.js
import babel from "vite-plugin-babel";

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({
  plugins: [
    remix({ /* ... */}),
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

To report issues, please first create a minimal repro on the [React Compiler Playground](https://playground.react.dev/) and include it in your bug report.

You can open issues in the [facebook/react](https://github.com/facebook/react/issues) repo.

You can also provide feedback in the React Compiler Working Group by applying to be a member. Please see [the README for more details on joining](https://github.com/reactwg/react-compiler).

### Common Issues {/*common-issues*/}

#### `(0 , _c) is not a function` error {/*0--_c-is-not-a-function-error*/}

This occurs during JavaScript module evaluation when you are not using React 19 Beta and up. To fix this, [upgrade your app to React 19 Beta](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) first.

### Debugging {/*debugging*/}

#### Checking if components have been optimized {/*checking-if-components-have-been-optimized*/}
##### React DevTools {/*react-devtools*/}

React Devtools (v5.0+) has built-in support for React Compiler and will display a "Memo ✨" badge next to components that have been optimized by the compiler.

##### Other issues {/*other-issues*/}

Please see https://github.com/reactwg/react-compiler/discussions/7.
