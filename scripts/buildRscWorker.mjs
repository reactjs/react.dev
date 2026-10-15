/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const sandboxBase = path.resolve(
  root,
  'src/components/MDX/Sandpack/sandpack-rsc/sandbox-code/src'
);

// 1. Bundle the server Worker runtime (React server build + RSDW/server.browser + Sucrase → IIFE)
// Minified because this runs inside a Web Worker (not parsed by Sandpack's Babel).
const workerOutfile = path.resolve(sandboxBase, 'worker-bundle.dist.js');
await esbuild.build({
  entryPoints: [path.resolve(sandboxBase, 'rsc-server.js')],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  conditions: ['react-server', 'browser'],
  outfile: workerOutfile,
  define: {'process.env.NODE_ENV': '"production"'},
  minify: true,
});

// Post-process worker bundle:
// Prepend the webpack shim so __webpack_require__ (used by react-server-dom-webpack)
// is defined before the IIFE evaluates. The shim sets globalThis.__webpack_require__,
// which is accessible as a bare identifier since globalThis IS the Worker's global scope.
let workerCode = fs.readFileSync(workerOutfile, 'utf8');

const shimPath = path.resolve(sandboxBase, 'webpack-shim.js');
const shimCode = fs.readFileSync(shimPath, 'utf8');
workerCode = shimCode + '\n' + workerCode;

fs.writeFileSync(workerOutfile, workerCode);
