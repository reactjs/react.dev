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

const sourceNames = [
  'webpack-shim',
  'rsc-client',
  'react-refresh-init',
  'worker-bundle',
  'rsdw-client',
  'react-refresh-runtime',
] as const;

async function loadSource(name: typeof sourceNames[number]) {
  const response = await fetch(`/sandpack-rsc/${name}.js`);
  if (!response.ok) {
    throw new Error(`Could not load the ${name} Sandpack runtime source.`);
  }
  return response.text();
}

let templatePromise: Promise<SandpackFiles> | null = null;

export function loadTemplateRSC() {
  templatePromise ??= Promise.all(sourceNames.map(loadSource)).then(
    (values) => {
      const sources = Object.fromEntries(
        sourceNames.map((name, index) => [name, values[index]])
      );
      const reactRefreshModule = sources['react-refresh-runtime'].replace(
        /if \(process\.env\.NODE_ENV !== "production"\) \{/,
        '{'
      );
      return createTemplate({
        webpackShim: sources['webpack-shim'],
        rscClient: sources['rsc-client'],
        reactRefreshInit: sources['react-refresh-init'],
        workerBundle: sources['worker-bundle'],
        rsdwClient: sources['rsdw-client'],
        reactRefreshModule,
      });
    }
  );
  return templatePromise;
}

function createTemplate({
  webpackShim,
  rscClient,
  reactRefreshInit,
  workerBundle,
  rsdwClient,
  reactRefreshModule,
}: {
  webpackShim: string;
  rscClient: string;
  reactRefreshInit: string;
  workerBundle: string;
  rsdwClient: string;
  reactRefreshModule: string;
}): SandpackFiles {
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

  return hideFiles({
    '/public/index.html': indexHTML,
    '/src/index.js': indexEntry,
    '/src/__react_refresh_init__.js': reactRefreshInit,
    '/src/rsc-client.js': rscClient,
    '/src/rsc-server.js': `export default ${JSON.stringify(workerBundle)};`,
    '/src/__webpack_shim__.js': webpackShim,
    '/node_modules/react-server-dom-webpack/package.json':
      '{"name":"react-server-dom-webpack","main":"index.js"}',
    '/node_modules/react-server-dom-webpack/client.browser.js': rsdwClient,
    '/node_modules/react-refresh/package.json':
      '{"name":"react-refresh","main":"runtime.js"}',
    '/node_modules/react-refresh/runtime.js': reactRefreshModule,
    '/package.json': JSON.stringify(
      {
        name: 'react.dev',
        version: '0.0.0',
        main: '/src/index.js',
        dependencies: {
          react: '19.2.8',
          'react-dom': '19.2.8',
        },
      },
      null,
      2
    ),
  });
}
