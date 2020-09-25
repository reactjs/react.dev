---
title: "Introducing the New JSX Transform"
author: [lunaruan]
---

Although React 17 [doesn't contain new features](/blog/2020/08/10/react-v17-rc.html), it will provide support for a new version of the JSX transform. In this post, we will describe what it is and how to try it.

## What's a JSX Transform? {#whats-a-jsx-transform}

Browsers don't understand JSX out of the box, so most React users rely on a compiler like Babel or TypeScript to **transform JSX code into regular JavaScript**. Many preconfigured toolkits like Create React App or Next.js also include a JSX transform under the hood.

Together with the React 17 release, we've wanted to make a few improvements to the JSX transform, but we didn't want to break existing setups. This is why we [worked with Babel](https://babeljs.io/blog/2020/03/16/7.9.0#a-new-jsx-transform-11154httpsgithubcombabelbabelpull11154) to **offer a new, rewritten version of the JSX transform** for people who would like to upgrade.

Upgrading to the new transform is completely optional, but it has a few benefits:

* With the new transform, you can **use JSX without importing React**.
* Depending on your setup, its compiled output may **slightly improve the bundle size**.
* It will enable future improvements that **reduce the number of concepts** you need to learn React.

**This upgrade will not change the JSX syntax and is not required.** The old JSX transform will keep working as usual, and there are no plans to remove the support for it.


[React 17 RC](/blog/2020/08/10/react-v17-rc.html) already includes support for the new transform, so go give it a try! To make it easier to adopt, after React 17 is released, we also plan to backport its support to React 16.x, React 15.x, and React 0.14.x. You can find the upgrade instructions for different tools [below](#how-to-upgrade-to-the-new-jsx-transform).

Now let's take a closer look at the differences between the old and the new transform.

## What’s Different in the New Transform? {#whats-different-in-the-new-transform}

When you use JSX, the compiler transforms it into React function calls that the browser can understand. **The old JSX transform** turned JSX into `React.createElement(...)` calls.

For example, let's say your source code looks like this:

```js
import React from 'react';

function App() {
  return <h1>Hello World</h1>;
}
```

Under the hood, the old JSX transform turns it into regular JavaScript:

```js
import React from 'react';

function App() {
  return React.createElement('h1', null, 'Hello world');
}
```

>Note
>
>**Your source code doesn't need to change in any way.** We're describing how the JSX transform turns your JSX source code into the JavaScript code a browser can understand.

However, this is not perfect:

* Because JSX compiled into `React.createElement`, `React` needed to be in scope if you use JSX.
* There are some [performance improvements and simplifications](https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#motivation) that `React.createElement` does not allow.

To solve these issues, React 17 introduces two new entry points to the React package that are intended to only be used by compilers like Babel and TypeScript. Instead of transforming JSX to `React.createElement`, **the new JSX transform** automatically imports special functions from those new entry points in the React package and calls them.

Let's say that your source code looks like this:

```js
function App() {
  return <h1>Hello World</h1>;
}
```

This is what the new JSX transform compiles it to:

```js
// Inserted by a compiler (don't import it yourself!)
import {jsx as _jsx} from 'react/jsx-runtime';

function App() {
  return _jsx('h1', { children: 'Hello world' });
}
```

Note how our original code **did not need to import React** to use JSX anymore! (But we would still need to import React in order to use Hooks or other exports that React provides.)

**This change is fully compatible with all of the existing JSX code**, so you won't have to change your components. If you're curious, you can check out the [technical RFC](https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#detailed-design) for more details about how the new transform works.

> Note
>
> The functions inside `react/jsx-runtime` and `react/jsx-dev-runtime` must only be used by the compiler transform. If you need to manually create elements in your code, you should keep using `React.createElement`. It will continue to work and is not going away.

## How to Upgrade to the New JSX Transform {#how-to-upgrade-to-the-new-jsx-transform}

If you aren't ready to upgrade to the new JSX transform or if you are using JSX for another library, don't worry. The old transform will not be removed and will continue to be supported.

If you want to upgrade, you will need two things:

* **A version of React that supports the new transform** (currently, only [React 17 RC](/blog/2020/08/10/react-v17-rc.html) supports it, but after React 17.0 has been released, we plan to make additional compatible releases for 0.14.x, 15.x, and 16.x).
* **A compatible compiler** (see instructions for different tools below).

Since the new JSX transform doesn't require React to be in scope, [we've also prepared an automated script](#removing-unused-react-imports) that will remove the unnecessary imports from your codebase.

### Create React App {#create-react-app}

Create React App support [has been added](https://github.com/facebook/create-react-app/pull/9645) and will be available in the [upcoming v4.0 release](https://gist.github.com/iansu/4fab7a9bfa5fa6ebc87a908c62f5340b) which is currently in beta testing.

### Next.js {#nextjs}

Next.js [v9.5.3](https://github.com/vercel/next.js/releases/tag/v9.5.3)+ uses the new transform for compatible React versions.

### Gatsby {#gatsby}

Gatsby [v2.24.5](https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/CHANGELOG.md#22452-2020-08-28)+ uses the new transform for compatible React versions.

>Note
>
>If you get [this Gatsby error](https://github.com/gatsbyjs/gatsby/issues/26979) after upgrading to React `17.0.0-rc.2`, run `npm update` to fix it.

### Manual Babel Setup {#manual-babel-setup}

Support for the new JSX transform is available in Babel [v7.9.0](https://babeljs.io/blog/2020/03/16/7.9.0) and above.

First, you'll need to update to the latest Babel and plugin transform.

If you are using `@babel/plugin-transform-react-jsx`:

```bash
# for npm users
npm update @babel/core @babel/plugin-transform-react-jsx
```

```bash
# for yarn users
yarn upgrade @babel/core @babel/plugin-transform-react-jsx
```

If you are using `@babel/preset-react`:

```bash
# for npm users
npm update @babel/core @babel/preset-react
```

```bash
# for yarn users
yarn upgrade @babel/core @babel/preset-react
```

Currently, the old transform (`"runtime": "classic"`) is the default option. To enable the new transform, you can pass `{"runtime": "automatic"}` as an option to `@babel/plugin-transform-react-jsx` or `@babel/preset-react`:

```js
// If you are using @babel/preset-react
{
  "presets": [
    ["@babel/preset-react", {
      "runtime": "automatic"
    }]
  ]
}
```

```js
// If you're using @babel/plugin-transform-react-jsx
{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "runtime": "automatic"
    }]
  ]
}
```

Starting from Babel 8, `"automatic"` will be the default runtime for both plugins. For more information, check out the Babel documentation for [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) and [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react).

> Note
>
> If you use JSX with a library other than React, you can use [the `importSource` option](https://babeljs.io/docs/en/babel-preset-react#importsource) to import from that library instead -- as long as it provides the necessary entry points. Alternatively, you can keep using the classic transform which will continue to be supported.

### ESLint {#eslint}

If you are using [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react), the `react/jsx-uses-react` and `react/react-in-jsx-scope` rules are no longer necessary and can be turned off or removed.

```js
{
  // ...
  "rules": {
    // ...
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

### TypeScript {#typescript}

TypeScript supports the JSX transform in [v4.1 beta](https://devblogs.microsoft.com/typescript/announcing-typescript-4-1-beta/#jsx-factories).

### Flow {#flow}

Flow supports the new JSX transform in [v0.126.0](https://github.com/facebook/flow/releases/tag/v0.126.0) and up.

## Removing Unused React Imports {#removing-unused-react-imports}

Because the new JSX transform will automatically import the necessary `react/jsx-runtime` functions, React will no longer need to be in scope when you use JSX. This might lead to unused React imports in your code. It doesn't hurt to keep them, but if you'd like to remove them, we recommend running a [“codemod”](https://medium.com/@cpojer/effective-javascript-codemods-5a6686bb46fb) script to remove them automatically:

```bash
cd your_project
npx react-codemod update-react-imports
```

>Note
>
>If you're getting errors when running the codemod, try specifying a different JavaScript dialect when `npx react-codemod update-react-imports` asks you to choose one. In particular, at this moment the "JavaScript with Flow" setting supports newer syntax than the "JavaScript" setting even if you don't use Flow. [File an issue](https://github.com/reactjs/react-codemod/issues) if you run into problems.
>
>Keep in mind that the codemod output will not always match your project's coding style, so you might want to run [Prettier](https://prettier.io/) after the codemod finishes for consistent formatting.


Running this codemod will:

* Remove all unused React imports as a result of upgrading to the new JSX transform.
* Change all default React imports (i.e. `import React from "react"`) to destructured named imports (ex. `import { useState } from "react"`) which is the preferred style going into the future. This codemod **will not** affect the existing namespace imports (i.e. `import * as React from "react"`) which is also a valid style. The default imports will keep working in React 17, but in the longer term we encourage moving away from them.

For example,

```js
import React from 'react';

function App() {
  return <h1>Hello World</h1>;
}
```

will be replaced with

```js
function App() {
  return <h1>Hello World</h1>;
}
```

If you use some other import from React — for example, a Hook — then the codemod will convert it to a named import.

For example,

```js
import React from 'react';

function App() {
  const [text, setText] = React.useState('Hello World');
  return <h1>{text}</h1>;
}
```

will be replaced with

```js
import { useState } from 'react';

function App() {
  const [text, setText] = useState('Hello World');
  return <h1>{text}</h1>;
}
```

In addition to cleaning up unused imports, this will also help you prepare for a future major version of React (not React 17) which will support ES Modules and not have a default export.

## Thanks {#thanks}

We'd like to thank Babel, TypeScript, Create React App, Next.js, Gatsby, ESLint, and Flow maintainers for their help implementing and integrating the new JSX transform. We also want to thank the React community for their feedback and discussion on the related [technical RFC](https://github.com/reactjs/rfcs/pull/107).
