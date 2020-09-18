---
title: "React v17.0 Release Candidate: Support for New JSX Transform"
author: [lunaruan]
--- 

Although React 17 [doesn’t contain new features](https://reactjs.org/blog/2020/08/10/react-v17-rc.html), it provides support for a new JSX transform. In this post, we will describe these changes and provide steps so you can try the transform.

Browsers don’t understand JSX out of the box, so you need a compiler like Babel or TypeScript to transform JSX code into regular JavaScript. Toolkits like Create React App or Next.js also use the same tools under the hood.

We wanted to make a few improvements to the JSX transform, but we didn’t want to break existing setups, so worked with Babel to offer a new [JSX transform](https://babeljs.io/blog/2020/03/16/7.9.0#a-new-jsx-transform-11154-https-githubcom-babel-babel-pull-11154) for people who would like to upgrade.

The new transform is completely optional and has a few benefits:

* You can now **use JSX without importing React**.
* Depending on your setup, its compiled output may **slightly improve the bundle size**.
* In the long run, this will enable future improvements that **reduce the number of concepts** you need to learn React.

**This upgrade will not change JSX and is not required.** React supports the new JSX transform in 17.0. We also plan to backport it to React 16.14, 15.7, and 0.14.10 once React 17.0 is released. You can find the upgrade instructions for different tools below.

## How Does JSX Work?

When you use JSX, the compiler transforms it into React function calls that the browser can understand. For example, with the old JSX transform, compilers transformed JSX into `React.createElement(...)`.

For example,

```js
import React from 'react';

function App() {
   return <h1>Hello World</h1>;
}
```

would be transformed to

```js
import React from 'react';

function App() {
  return React.createElement('h1', null, 'Hello world');
}
```

However, this is not perfect:

* Because JSX compiled into `React.createElement`, the React library always needed to be in scope if you use JSX. 
* There are some [performance improvements and simplifications](https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#motivation) that `React.createElement` does not allow.

To solve these issues, React 17 introduces two new entry points to the React package that are intended to only be used by compilers like Babel and TypeScript. Instead of transforming JSX to `React.createElement`, the new transform imports special functions from those entry points. These functions will automatically be imported so **React no longer needs to be in scope** to use JSX.

For example,

```js
function App() {
  return <h1>Hello World</h1>;
}
```

will now transform into

```js
// Inserted by a compiler (don't import it yourself!)
import {jsx as _jsx} from 'react/jsx-runtime';

function App() {
   return _jsx('h1', ...);
}
```

This change is fully compatible with all of the existing JSX code, so you won’t have to change your components. If you’re curious, you can check out the [technical RFC](https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#detailed-design) for more details about how the new transform works.

> The functions inside react/jsx-runtime and react/jsx-dev-runtime are not meant to be used outside of a compiler transform. If you need to manually create elements in your code, you should keep using `React.createElement`. It will continue to work and is not going away.

## How to Upgrade to the New JSX Transform

If you aren’t ready to upgrade to the new JSX transform or if you are using JSX for another library, don’t worry. The old transform will not be removed and will continue to be supported.

If you want to upgrade, you will need two things:

* A version of React that supports the new transform (React 17.0+, 16.14, 15.7, or 0.14.10).
* A compatible compiler (see instructions for different tools below).

Since the new JSX transform doesn’t require React to be in scope, we’ve prepared an automated script that will remove the unnecessary imports from your codebase. 

### Create React App

Create React App support [has been added](https://github.com/facebook/create-react-app/pull/9645) and will available in the upcoming v4.0 release.

### Next

Next support [has been added](https://github.com/vercel/next.js/pull/16603) and will be available in Next v9.5.3.

### Gatsby

Gatsby will automatically use the new transform for compatible React releases starting with the [version v2.24.52](https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/CHANGELOG.md#22452-2020-08-28).

### Manual Babel Setup

Support for the new JSX transform is available in Babel [v7.9.0](https://babeljs.io/blog/2020/03/16/7.9.0) and above.

First, you’ll need to update to the latest Babel and plugin transform.

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

```json
// If you are using @babel/preset-react
{
    "presets": [
        ["@babel/preset-react", {
            "runtime": "automatic"
        }]
    ]
}
```

```json
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

### ESLint

If you are using [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react), the `react/jsx-uses-react` and `react/react-in-jsx-scope` rules are no longer necessary and can be turned off or removed. 

```json
"rules": {
     "react/jsx-uses-react": "off",
     "react/react-in-jsx-scope": "off"   
}
```

### TypeScript

TypeScript support for the JSX transform is currently in progress and will be available soon! You can track the progress [here](https://github.com/microsoft/TypeScript/issues/34547).

### Flow

Flow supports the new JSX transform in [v0.126.0](https://github.com/facebook/flow/releases/tag/v0.126.0) and up.

## Removing Unused React Imports

Because the new JSX transform will automatically import the necessary react/jsx-runtime functions, React will no longer need to be in scope when you use JSX. This might lead to unused React imports. To help you remove them, we recommend running a [“codemod”](https://medium.com/@cpojer/effective-javascript-codemods-5a6686bb46fb) script to removes them automatically.

```bash
 cd your_project
 npx react-codemod update-react-imports
```

Running this codemod will

* Remove all unused React imports as a result of upgrading to the new JSX transform.
* Change all default React imports (i.e. `import React from "react"`) to destructured named imports (ex. `import { useState } from "react"`) which is the preferred style going into the future. This codemod **will not** destructure already existing named imports (i.e. `import * as React from “react”`)

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
  const [text, useText] = React.useState('Hello World');
  return <h1>{text}</h1>;
}
```

will be replaced with

```js
import { useState } from 'react';

function App() {
  const [text, useText] = useState('Hello World');
  return <h1>{text}</h1>;
}
```

In addition to cleaning up unused imports, this will also help you prepare for a future major version of React which will support ES Modules and not have a default export.

## Installation

We encourage you to try React 17.0 Release Candidate soon and raise any [issues](https://github.com/facebook/react/issues) for the problems you might encounter in the migration. **Keep in mind that a release candidate is more likely to contain bugs than a stable release, so don’t deploy it to production yet.**

To install React 17 RC with npm, run:

```bash
npm install react@17.0.0-rc.1 react-dom@17.0.0-rc.1
```

To install React 17 RC with Yarn, run:

```bash
yarn add react@17.0.0-rc.1 react-dom@17.0.0-rc.1
```
