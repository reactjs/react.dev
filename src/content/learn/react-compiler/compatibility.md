---
title: Backwards Compatibility
---

<Intro>
React Compiler works best with React 19, but it also supports React 17 and 18 with additional configuration.
</Intro>

<YouWillLearn>

* How to configure React Compiler for React 17 and 18

</YouWillLearn>

## Using React Compiler with React 17 or 18 {/*using-react-compiler-with-react-17-or-18*/}

React Compiler does not require any special configuration to work with React 19. For React 17 or 18, you need two things:

### 1. Install the runtime package {/*install-runtime-package*/}

<TerminalBlock>
npm install react-compiler-runtime@rc
</TerminalBlock>

### 2. Configure the target version {/*configure-target-version*/}

```js {5}
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      target: '18', // or '17' for React 17
    }],
  ],
};
```

Always use the major version number as a string for the `target` option. Use `'17'` not `17` or `'17.0.2'`.

## Framework-specific configuration {/*framework-specific-configuration*/}

### Next.js {/*nextjs*/}

```js {5}
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

```js {10}
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', { target: '17' }],
        ],
      },
    }),
  ],
});
```

