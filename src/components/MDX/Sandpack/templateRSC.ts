/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {SandpackFile, SandpackFiles} from '@webcontainer/react';

function hideFiles(
  files: Record<string, string | SandpackFile>
): SandpackFiles {
  return Object.fromEntries(
    Object.entries(files).map(([name, code]) => [
      name,
      typeof code === 'string' ? {code, hidden: true} : {...code, hidden: true},
    ])
  );
}

// --- Load RSC infrastructure files as raw strings via raw-loader ---
const RSC_SOURCE_FILES = {
  'framework-entry-browser':
    require('!raw-loader?esModule=false!./sandpack-rsc/sandbox-code/src/framework/entry.browser.tsx') as string,
  'framework-entry-rsc':
    require('!raw-loader?esModule=false!./sandpack-rsc/sandbox-code/src/framework/entry.rsc.tsx') as string,
  'framework-entry-ssr':
    require('!raw-loader?esModule=false!./sandpack-rsc/sandbox-code/src/framework/entry.ssr.tsx') as string,
  'framework-error-boundary':
    require('!raw-loader?esModule=false!./sandpack-rsc/sandbox-code/src/framework/error-boundary.tsx') as string,
};

// Load react-refresh runtime and strip the process.env.NODE_ENV guard
// so it works in Sandpack's bundler which may not replace process.env.
const reactRefreshRaw =
  require('!raw-loader?esModule=false!../../../../node_modules/next/dist/compiled/react-refresh/cjs/react-refresh-runtime.development.js') as string;

// Wrap as a CJS module that Sandpack can require.
// Strip the `if (process.env.NODE_ENV !== "production")` guard so the
// runtime always executes inside the sandbox.
const reactRefreshModule = reactRefreshRaw.replace(
  /if \(process\.env\.NODE_ENV !== "production"\) \{/,
  '{'
);

// Entry point that bootstraps the RSC client pipeline.
// __react_refresh_init__ must be imported BEFORE rsc-client so the
// DevTools hook stub exists before React's renderer loads.
const indexEntry = `
import './styles.css';
import './__react_refresh_init__';
import { initClient } from './rsc-client.js';
initClient();
`.trim();

const indexHTML = `
<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`.trim();

const VITE_CONFIG = `import react from '@vitejs/plugin-react'
import rsc from '@vitejs/plugin-rsc'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    rsc(),
    react(),
  ],

  environments: {
    rsc: {
      build: {
        rollupOptions: {
          input: {
            index: './src/framework/entry.rsc.tsx',
          },
        },
      },
    },

    ssr: {
      build: {
        rollupOptions: {
          input: {
            index: './src/framework/entry.ssr.tsx',
          },
        },
      },
    },

    client: {
      build: {
        rollupOptions: {
          input: {
            index: './src/framework/entry.browser.tsx',
          },
        },
      },
    },
  },
})`.trim();

export const templateRSC: SandpackFiles = {
  ...hideFiles({
    // '/public/index.html': indexHTML,
    // '/src/index.js': indexEntry,
    '/src/framework/entry.browser.tsx':
      RSC_SOURCE_FILES['framework-entry-browser'],
    '/src/framework/entry.rsc.tsx': RSC_SOURCE_FILES['framework-entry-rsc'],
    '/src/framework/entry.ssr.tsx': RSC_SOURCE_FILES['framework-entry-ssr'],
    '/src/framework/error-boundary.tsx':
      RSC_SOURCE_FILES['framework-error-boundary'],

    '/vite.config.js': VITE_CONFIG,
    '/package.json': JSON.stringify(
      {
        name: 'react.dev',
        version: '0.0.0',
        main: '/src/index.js',
        dependencies: {
          react: '19.2.4',
          'react-dom': '19.2.4',
        },
        devDependencies: {
          vite: '^6.0.0',
          '@vitejs/plugin-react': '^4.0.0',
          '@vitejs/plugin-rsc': '^0.5.21',
        },
      },
      null,
      2
    ),
  }),
};
