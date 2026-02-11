/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {SandpackFiles} from '@codesandbox/sandpack-react/unstyled';

function hideFiles(files: SandpackFiles): SandpackFiles {
  return Object.fromEntries(
    Object.entries(files).map(([name, code]) => [
      name,
      typeof code === 'string' ? {code, hidden: true} : {...code, hidden: true},
    ])
  );
}

// --- Load RSC infrastructure files as raw strings via raw-loader ---
const RSC_SOURCE_FILES = {
  'webpack-shim':
    require('!raw-loader?esModule=false!./sandpack-rsc/sandbox-code/src/webpack-shim.js') as string,
  'rsc-client':
    require('!raw-loader?esModule=false!./sandpack-rsc/sandbox-code/src/rsc-client.js') as string,
  'worker-bundle': `export default ${JSON.stringify(
    require('!raw-loader?esModule=false!./sandpack-rsc/sandbox-code/src/worker-bundle.dist.js') as string
  )};`,
  'rsdw-client':
    require('!raw-loader?esModule=false!../../../../node_modules/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.production.js') as string,
};

// Entry point that bootstraps the RSC client pipeline.
const indexEntry = `
import './styles.css';
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

export const templateRSC: SandpackFiles = {
  ...hideFiles({
    '/public/index.html': indexHTML,
    '/src/index.js': indexEntry,
    '/src/rsc-client.js': RSC_SOURCE_FILES['rsc-client'],
    '/src/rsc-server.js': RSC_SOURCE_FILES['worker-bundle'],
    '/src/__webpack_shim__.js': RSC_SOURCE_FILES['webpack-shim'],
    // RSDW client as a Sandpack local dependency (bypasses Babel bundler)
    '/node_modules/react-server-dom-webpack/package.json':
      '{"name":"react-server-dom-webpack","main":"index.js"}',
    '/node_modules/react-server-dom-webpack/client.browser.js':
      RSC_SOURCE_FILES['rsdw-client'],
    '/package.json': JSON.stringify(
      {
        name: 'react.dev',
        version: '0.0.0',
        main: '/src/index.js',
        dependencies: {
          react: '^19.2.4',
          'react-dom': '^19.2.4',
        },
      },
      null,
      2
    ),
  }),
};
