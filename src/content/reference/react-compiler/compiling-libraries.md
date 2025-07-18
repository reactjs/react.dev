---
title: Compiling Libraries
---

<Intro>
This guide helps library authors understand how to use React Compiler to ship optimized library code to their users.
</Intro>

<InlineToc />

## Why Ship Compiled Code? {/*why-ship-compiled-code*/}

As a library author, you can compile your library code before publishing to npm. This provides several benefits:

- **Performance improvements for all users** - Your library users get optimized code even if they aren't using React Compiler yet
- **No configuration required by users** - The optimizations work out of the box
- **Consistent behavior** - All users get the same optimized version regardless of their build setup

## Setting Up Compilation {/*setting-up-compilation*/}

Add React Compiler to your library's build process:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@rc
</TerminalBlock>

Configure your build tool to compile your library. For example, with Babel:

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
{
  target: '17', // Minimum supported React version
}
```

## Testing Strategy {/*testing-strategy*/}

Test your library both with and without compilation to ensure compatibility. Run your existing test suite against the compiled code, and also create a separate test configuration that bypasses the compiler. This helps catch any issues that might arise from the compilation process and ensures your library works correctly in all scenarios.

## Troubleshooting {/*troubleshooting*/}

### Library doesn't work with older React versions {/*library-doesnt-work-with-older-react-versions*/}

If your compiled library throws errors in React 17 or 18:

1. Verify you've installed `react-compiler-runtime` as a dependency
2. Check that your `target` configuration matches your minimum supported React version
3. Ensure the runtime package is included in your published bundle

### Compilation conflicts with other Babel plugins {/*compilation-conflicts-with-other-babel-plugins*/}

Some Babel plugins may conflict with React Compiler:

1. Place `babel-plugin-react-compiler` early in your plugin list
2. Disable conflicting optimizations in other plugins
3. Test your build output thoroughly

### Runtime module not found {/*runtime-module-not-found*/}

If users see "Cannot find module 'react-compiler-runtime'":

1. Ensure the runtime is listed in `dependencies`, not `devDependencies`
2. Check that your bundler includes the runtime in the output
3. Verify the package is published to npm with your library

## Next Steps {/*next-steps*/}

- Learn about [debugging techniques](/learn/react-compiler/debugging) for compiled code
- Check the [configuration options](/reference/react-compiler/configuration) for all compiler options
- Explore [compilation modes](/reference/react-compiler/compilationMode) for selective optimization