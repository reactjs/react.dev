---
title: Configuration
---

<Intro>
React Compiler is designed to work out of the box with no configuration needed. Most users will not need to configure the compiler. However, if you need to customize its behavior, various configuration options are available.
</Intro>

<YouWillLearn>

* Available configuration options
* How to configure the compiler

</YouWillLearn>

## Configuration Options Overview {/*configuration-options-overview*/}

React Compiler accepts several options to customize its behavior. See the [API reference](/reference/react/react-compiler) for detailed documentation of each option.

- **`compilationMode`** - Controls which functions to compile
- **`target`** - Specifies the React version for compatibility (17, 18, or 19)
- **`sources`** - Limits compilation to specific files or directories
- **`gating`** - Enables runtime feature flags for [incremental adoption](/learn/react-compiler/incremental-adoption)
- **`logger`** - Configures logging output for debugging
- **`panicThreshold`** - Sets when the compiler should halt on errors
- **`noEmit`** - Disables code generation

## Basic Configuration {/*basic-configuration*/}

Pass options to the Babel plugin:

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      target: '18', // For React 18 compatibility
    }],
  ],
};
```

## Framework Examples {/*framework-examples*/}

### Next.js {/*nextjs*/}

```js
// next.config.js
module.exports = {
  experimental: {
    reactCompiler: {
      target: '18',
    },
  },
};
```

### Vite {/*vite*/}

```js
// vite.config.js
export default {
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', { /* options */ }],
        ],
      },
    }),
  ],
};
```

## Learn More {/*learn-more*/}

For detailed documentation of all configuration options, see the [React Compiler API reference](/reference/react/react-compiler).

For incremental adoption strategies using these options, see the [incremental adoption guide](/learn/react-compiler/incremental-adoption).