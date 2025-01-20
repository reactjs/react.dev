---
title: React Compiler
---

<Intro>
This page will give you an introduction to React Compiler and how to try it out successfully.
</Intro>

<Wip>
These docs are still a work in progress. More documentation is available in the [React Compiler Working Group repo](https://github.com/reactwg/react-compiler/discussions), and will be upstreamed into these docs when they are more stable.
</Wip>

<YouWillLearn>

* Getting started with the compiler
* Installing the compiler and ESLint plugin
* Troubleshooting

</YouWillLearn>

<Note>
React Compiler is a new compiler currently in Beta, that we've open sourced to get early feedback from the community. While it has been used in production at companies like Meta, rolling out the compiler to production for your app will depend on the health of your codebase and how well you’ve followed the [Rules of React](/reference/rules).

The latest Beta release can be found with the `@beta` tag, and daily experimental releases with `@experimental`.
</Note>

React Compiler is a new compiler that we've open sourced to get early feedback from the community. It is a build-time only tool that automatically optimizes your React app. It works with plain JavaScript, and understands the [Rules of React](/reference/rules), so you don't need to rewrite any code to use it.

The compiler also includes an [ESLint plugin](#installing-eslint-plugin-react-compiler) that surfaces the analysis from the compiler right in your editor. **We strongly recommend everyone use the linter today.** The linter does not require that you have the compiler installed, so you can use it even if you are not ready to try out the compiler.

The compiler is currently released as `beta`, and is available to try out on React 17+ apps and libraries. To install the Beta:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

Or, if you're using Yarn:

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

If you are not using React 19 yet, please see [the section below](#using-react-compiler-with-react-17-or-18) for further instructions.

### What does the compiler do? {/*what-does-the-compiler-do*/}

In order to optimize applications, React Compiler automatically memoizes your code. You may be familiar today with memoization through APIs such as `useMemo`, `useCallback`, and `React.memo`. With these APIs you can tell React that certain parts of your application don't need to recompute if their inputs haven't changed, reducing work on updates. While powerful, it's easy to forget to apply memoization or apply them incorrectly. This can lead to inefficient updates as React has to check parts of your UI that don't have any _meaningful_ changes.

The compiler uses its knowledge of JavaScript and React's rules to automatically memoize values or groups of values within your components and hooks. If it detects breakages of the rules, it will automatically skip over just those components or hooks, and continue safely compiling other code.

<Note>
React Compiler can statically detect when Rules of React are broken, and safely opt-out of optimizing just the affected components or hooks. It is not necessary for the compiler to optimize 100% of your codebase.
</Note>

If your codebase is already very well-memoized, you might not expect to see major performance improvements with the compiler. However, in practice memoizing the correct dependencies that cause performance issues is tricky to get right by hand.

<DeepDive>
#### What kind of memoization does React Compiler add? {/*what-kind-of-memoization-does-react-compiler-add*/}

The initial release of React Compiler is primarily focused on **improving update performance** (re-rendering existing components), so it focuses on these two use cases:

1. **Skipping cascading re-rendering of components**
    * Re-rendering `<Parent />` causes many components in its component tree to re-render, even though only `<Parent />` has changed
1. **Skipping expensive calculations from outside of React**
    * For example, calling `expensivelyProcessAReallyLargeArrayOfObjects()` inside of your component or hook that needs that data

#### Optimizing Re-renders {/*optimizing-re-renders*/}

React lets you express your UI as a function of their current state (more concretely: their props, state, and context). In its current implementation, when a component's state changes, React will re-render that component _and all of its children_ — unless you have applied some form of manual memoization with `useMemo()`, `useCallback()`, or `React.memo()`. For example, in the following example, `<MessageButton>` will re-render whenever `<FriendList>`'s state changes:

```javascript
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} online</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
```
[_See this example in the React Compiler Playground_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

React Compiler automatically applies the equivalent of manual memoization, ensuring that only the relevant parts of an app re-render as state changes, which is sometimes referred to as "fine-grained reactivity". In the above example, React Compiler determines that the return value of `<FriendListCard />` can be reused even as `friends` changes, and can avoid recreating this JSX _and_ avoid re-rendering `<MessageButton>` as the count changes.

#### Expensive calculations also get memoized {/*expensive-calculations-also-get-memoized*/}

The compiler can also automatically memoize for expensive calculations used during rendering:

```js
// **Not** memoized by React Compiler, since this is not a component or hook
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// Memoized by React Compiler since this is a component
function TableContainer({ items }) {
  // This function call would be memoized:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```
[_See this example in the React Compiler Playground_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

However, if `expensivelyProcessAReallyLargeArrayOfObjects` is truly an expensive function, you may want to consider implementing its own memoization outside of React, because:

- React Compiler only memoizes React components and hooks, not every function
- React Compiler's memoization is not shared across multiple components or hooks

So if `expensivelyProcessAReallyLargeArrayOfObjects` was used in many different components, even if the same exact items were passed down, that expensive calculation would be run repeatedly. We recommend [profiling](https://react.dev/reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) first to see if it really is that expensive before making code more complicated.
</DeepDive>

### Should I try out the compiler? {/*should-i-try-out-the-compiler*/}

Please note that the compiler is still in Beta and has many rough edges. While it has been used in production at companies like Meta, rolling out the compiler to production for your app will depend on the health of your codebase and how well you've followed the [Rules of React](/reference/rules).

**You don't have to rush into using the compiler now. It's okay to wait until it reaches a stable release before adopting it.** However, we do appreciate trying it out in small experiments in your apps so that you can [provide feedback](#reporting-issues) to us to help make the compiler better.

## Getting Started {/*getting-started*/}

In addition to these docs, we recommend checking the [React Compiler Working Group](https://github.com/reactwg/react-compiler) for additional information and discussion about the compiler.

### Installing eslint-plugin-react-compiler {/*installing-eslint-plugin-react-compiler*/}

React Compiler also powers an ESLint plugin. The ESLint plugin can be used **independently** of the compiler, meaning you can use the ESLint plugin even if you don't use the compiler.

<TerminalBlock>
npm install -D eslint-plugin-react-compiler@beta
</TerminalBlock>

Then, add it to your ESLint config:

```js
import reactCompiler from 'eslint-plugin-react-compiler'

export default [
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
]
```

Or, in the deprecated eslintrc config format:

```js
module.exports = {
  plugins: [
    'eslint-plugin-react-compiler',
  ],
  rules: {
    'react-compiler/react-compiler': 'error',
  },
}
```

The ESLint plugin will display any violations of the rules of React in your editor. When it does this, it means that the compiler has skipped over optimizing that component or hook. This is perfectly okay, and the compiler can recover and continue optimizing other components in your codebase.

<Note>
**You don't have to fix all ESLint violations straight away.** You can address them at your own pace to increase the amount of components and hooks being optimized, but it is not required to fix everything before you can use the compiler.
</Note>

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

When you have more confidence with rolling out the compiler, you can expand coverage to other directories as well and slowly roll it out to your whole app.

#### New projects {/*new-projects*/}

If you're starting a new project, you can enable the compiler on your entire codebase, which is the default behavior.

### Using React Compiler with React 17 or 18 {/*using-react-compiler-with-react-17-or-18*/}

React Compiler works best with React 19 RC. If you are unable to upgrade, you can install the extra `react-compiler-runtime` package which will allow the compiled code to run on versions prior to 19. However, note that the minimum supported version is 17.

<TerminalBlock>
npm install react-compiler-runtime@beta
</TerminalBlock>

You should also add the correct `target` to your compiler config, where `target` is the major version of React you are targeting:

```js {3}
// babel.config.js
const ReactCompilerConfig = {
  target: '18' // '17' | '18' | '19'
};

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig],
    ],
  };
};
```

### Using the compiler on libraries {/*using-the-compiler-on-libraries*/}

React Compiler can also be used to compile libraries. Because React Compiler needs to run on the original source code prior to any code transformations, it is not possible for an application's build pipeline to compile the libraries they use. Hence, our recommendation is for library maintainers to independently compile and test their libraries with the compiler, and ship compiled code to npm.

Because your code is pre-compiled, users of your library will not need to have the compiler enabled in order to benefit from the automatic memoization applied to your library. If your library targets apps not yet on React 19, specify a minimum [`target` and add `react-compiler-runtime` as a direct dependency](#using-react-compiler-with-react-17-or-18). The runtime package will use the correct implementation of APIs depending on the application's version, and polyfill the missing APIs if necessary.

Library code can often require more complex patterns and usage of escape hatches. For this reason, we recommend ensuring that you have sufficient testing in order to identify any issues that might arise from using the compiler on your library. If you identify any issues, you can always opt-out the specific components or hooks with the [`'use no memo'` directive](#something-is-not-working-after-compilation).

Similarly to apps, it is not necessary to fully compile 100% of your components or hooks to see benefits in your library. A good starting point might be to identify the most performance sensitive parts of your library and ensuring that they don't break the [Rules of React](/reference/rules), which you can use `eslint-plugin-react-compiler` to identify.

## Usage {/*installation*/}

### Babel {/*usage-with-babel*/}

<TerminalBlock>
npm install babel-plugin-react-compiler@beta
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

### Vite {/*usage-with-vite*/}

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

### Next.js {/*usage-with-nextjs*/}

Please refer to the [Next.js docs](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler) for more information.

### Remix {/*usage-with-remix*/}
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

### Webpack {/*usage-with-webpack*/}

A community Webpack loader is [now available here](https://github.com/SukkaW/react-compiler-webpack).

### Expo {/*usage-with-expo*/}

Please refer to [Expo's docs](https://docs.expo.dev/guides/react-compiler/) to enable and use the React Compiler in Expo apps.

### Metro (React Native) {/*usage-with-react-native-metro*/}

React Native uses Babel via Metro, so refer to the [Usage with Babel](#usage-with-babel) section for installation instructions.

### Rspack {/*usage-with-rspack*/}

Please refer to [Rspack's docs](https://rspack.dev/guide/tech/react#react-compiler) to enable and use the React Compiler in Rspack apps.

### Rsbuild {/*usage-with-rsbuild*/}

Please refer to [Rsbuild's docs](https://rsbuild.dev/guide/framework/react#react-compiler) to enable and use the React Compiler in Rsbuild apps.

## Troubleshooting {/*troubleshooting*/}

To report issues, please first create a minimal repro on the [React Compiler Playground](https://playground.react.dev/) and include it in your bug report. You can open issues in the [facebook/react](https://github.com/facebook/react/issues) repo.

You can also provide feedback in the React Compiler Working Group by applying to be a member. Please see [the README for more details on joining](https://github.com/reactwg/react-compiler).

### What does the compiler assume? {/*what-does-the-compiler-assume*/}

React Compiler assumes that your code:

1. Is valid, semantic JavaScript.
2. Tests that nullable/optional values and properties are defined before accessing them (for example, by enabling [`strictNullChecks`](https://www.typescriptlang.org/tsconfig/#strictNullChecks) if using TypeScript), i.e., `if (object.nullableProperty) { object.nullableProperty.foo }` or with optional-chaining `object.nullableProperty?.foo`.
3. Follows the [Rules of React](https://react.dev/reference/rules).

React Compiler can verify many of the Rules of React statically, and will safely skip compilation when it detects an error. To see the errors we recommend also installing [eslint-plugin-react-compiler](https://www.npmjs.com/package/eslint-plugin-react-compiler).

### How do I know my components have been optimized? {/*how-do-i-know-my-components-have-been-optimized*/}

[React DevTools](/learn/react-developer-tools) (v5.0+) and [React Native DevTools](https://reactnative.dev/docs/react-native-devtools) have built-in support for React Compiler and will display a "Memo ✨" badge next to components that have been optimized by the compiler.

### Something is not working after compilation {/*something-is-not-working-after-compilation*/}
If you have eslint-plugin-react-compiler installed, the compiler will display any violations of the rules of React in your editor. When it does this, it means that the compiler has skipped over optimizing that component or hook. This is perfectly okay, and the compiler can recover and continue optimizing other components in your codebase. **You don't have to fix all ESLint violations straight away.** You can address them at your own pace to increase the amount of components and hooks being optimized.

Due to the flexible and dynamic nature of JavaScript however, it's not possible to comprehensively detect all cases. Bugs and undefined behavior such as infinite loops may occur in those cases.

If your app doesn't work properly after compilation and you aren't seeing any ESLint errors, the compiler may be incorrectly compiling your code. To confirm this, try to make the issue go away by aggressively opting out any component or hook you think might be related via the [`"use no memo"` directive](#opt-out-of-the-compiler-for-a-component).

```js {2}
function SuspiciousComponent() {
  "use no memo"; // opts out this component from being compiled by React Compiler
  // ...
}
```

<Note>
#### `"use no memo"` {/*use-no-memo*/}

`"use no memo"` is a _temporary_ escape hatch that lets you opt-out components and hooks from being compiled by the React Compiler. This directive is not meant to be long lived the same way as eg [`"use client"`](/reference/rsc/use-client) is.

It is not recommended to reach for this directive unless it's strictly necessary. Once you opt-out a component or hook, it is opted-out forever until the directive is removed. This means that even if you fix the code, the compiler will still skip over compiling it unless you remove the directive.
</Note>

When you make the error go away, confirm that removing the opt out directive makes the issue come back. Then share a bug report with us (you can try to reduce it to a small repro, or if it's open source code you can also just paste the entire source) using the [React Compiler Playground](https://playground.react.dev) so we can identify and help fix the issue.

### Other issues {/*other-issues*/}

Please see https://github.com/reactwg/react-compiler/discussions/7.
