/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {SandpackFiles} from '@codesandbox/sandpack-react/unstyled';
import {
  REACT_REFRESH_INIT_SOURCE,
  REACT_REFRESH_RUNTIME_SOURCE,
  RSC_CLIENT_SOURCE,
  RSDW_CLIENT_SOURCE,
  WEBPACK_SHIM_SOURCE,
  WORKER_BUNDLE_MODULE_SOURCE,
} from './sandpack-rsc/generatedSources';

function hideFiles(files: SandpackFiles): SandpackFiles {
  return Object.fromEntries(
    Object.entries(files).map(([name, code]) => [
      name,
      typeof code === 'string' ? {code, hidden: true} : {...code, hidden: true},
    ])
  );
}

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

export const templateRSC: SandpackFiles = {
  ...hideFiles({
    '/public/index.html': indexHTML,
    '/src/index.js': indexEntry,
    '/src/__react_refresh_init__.js': REACT_REFRESH_INIT_SOURCE,
    '/src/rsc-client.js': RSC_CLIENT_SOURCE,
    '/src/rsc-server.js': WORKER_BUNDLE_MODULE_SOURCE,
    '/src/__webpack_shim__.js': WEBPACK_SHIM_SOURCE,
    // RSDW client as a Sandpack local dependency (bypasses Babel bundler)
    '/node_modules/react-server-dom-webpack/package.json':
      '{"name":"react-server-dom-webpack","main":"index.js"}',
    '/node_modules/react-server-dom-webpack/client.browser.js':
      RSDW_CLIENT_SOURCE,
    // react-refresh runtime as a Sandpack local dependency
    '/node_modules/react-refresh/package.json':
      '{"name":"react-refresh","main":"runtime.js"}',
    '/node_modules/react-refresh/runtime.js': REACT_REFRESH_RUNTIME_SOURCE,
    '/package.json': JSON.stringify(
      {
        name: 'react.dev',
        version: '0.0.0',
        main: '/src/index.js',
        dependencies: {
          react: '19.2.4',
          'react-dom': '19.2.4',
        },
      },
      null,
      2
    ),
  }),
};
