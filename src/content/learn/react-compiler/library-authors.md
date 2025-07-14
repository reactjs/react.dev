---
title: Library Authors Guide
---

<Intro>
This guide helps library authors understand how to use React Compiler to ship optimized library code to their users.
</Intro>

<YouWillLearn>

* Why libraries should ship compiled code
* How to set up compilation in your build pipeline
* Testing strategies for compiled libraries
* Publishing and documentation best practices

</YouWillLearn>

## Why Ship Compiled Code? {/*why-ship-compiled-code*/}

As a library author, you can compile your library code before publishing to npm. This provides several benefits:

- **Performance improvements for all users** - Your library users get optimized code without needing to enable the compiler themselves
- **No configuration required by users** - The optimizations work out of the box
- **Consistent behavior** - All users get the same optimized version regardless of their build setup

## Setting Up Compilation {/*setting-up-compilation*/}

Add React Compiler to your library's build process:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@rc
</TerminalBlock>

Configure your build tool to compile the library code. For example, with Babel:

```js
// babel.config.js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler',
  ],
  // ... other config
};
```

## Backwards Compatibility {/*backwards-compatibility*/}

If your library supports React versions below 19, you'll need additional configuration:

### 1. Install the runtime package {/*install-runtime-package*/}

We recommend installing react-compiler-runtime as a direct dependency:

<TerminalBlock>
npm install react-compiler-runtime@rc
</TerminalBlock>

```json
{
  "dependencies": {
    "react-compiler-runtime": "^19.1.0-rc.2"
  },
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0 || ^19.0.0"
  }
}
```

### 2. Configure the target version {/*configure-target-version*/}

Set the minimum React version your library supports:

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      target: '17', // Minimum React version
    }],
  ],
};
```

## Testing Strategy {/*testing-strategy*/}

Test your library both with and without compilation to ensure compatibility. Run your existing test suite against the compiled code, and also create a separate test configuration that bypasses the compiler. This helps catch any issues that might arise from the compilation process and ensures your library works correctly in all scenarios.

## Next Steps {/*next-steps*/}

- Learn about [debugging techniques](/learn/react-compiler/debugging) for compiled code
- Check the [API reference](/reference/react/react-compiler) for all compiler options