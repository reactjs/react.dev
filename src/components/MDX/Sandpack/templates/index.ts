import {defineTemplate} from '@webcontainer/react';
import {hideFiles} from './utils';
import viteReactPackageJson from './vite-react/package-json.json';
import viteReactPackageLockJson from './vite-react/package-lock-json.json';
import viteRscPackageJson from './vite-rsc/package-json.json';
import viteRscPackageLockJson from './vite-rsc/package-lock-json.json';

const startCommand: [string, ...string[]] = [
  'npx',
  'vite',
  '--port',
  '{{port}}',
];

export const viteReactTemplate = defineTemplate({
  id: 'vite-react',
  files: hideFiles({
    '/vite.config.js':
      require('!raw-loader?esModule=false!./vite-react/vite.config.js') as string,
    '/index.html':
      require('!raw-loader?esModule=false!./vite-react/index.html') as string,
    '/src/index.jsx':
      require('!raw-loader?esModule=false!./vite-react/src/index.jsx') as string,
  }),
  environment: {
    packageJson: JSON.stringify(viteReactPackageJson),
    packageLockJson: JSON.stringify(viteReactPackageLockJson),
    startCommand,
  },
});

export const viteRscTemplate = defineTemplate({
  id: 'vite-rsc',
  files: hideFiles({
    '/src/framework/entry.browser.jsx':
      require('!raw-loader?esModule=false!./vite-rsc/src/framework/entry.browser.jsx') as string,
    '/src/framework/entry.rsc.jsx':
      require('!raw-loader?esModule=false!./vite-rsc/src/framework/entry.rsc.jsx') as string,
    '/src/framework/entry.ssr.jsx':
      require('!raw-loader?esModule=false!./vite-rsc/src/framework/entry.ssr.jsx') as string,
    '/src/framework/error-boundary.jsx':
      require('!raw-loader?esModule=false!./vite-rsc/src/framework/error-boundary.jsx') as string,
    '/src/framework/request.jsx':
      require('!raw-loader?esModule=false!./vite-rsc/src/framework/request.jsx') as string,
    '/src/root.jsx':
      require('!raw-loader?esModule=false!./vite-rsc/src/root.jsx') as string,
    '/vite.config.js':
      require('!raw-loader?esModule=false!./vite-rsc/vite.config.js') as string,
  }),
  environment: {
    packageJson: JSON.stringify(viteRscPackageJson),
    packageLockJson: JSON.stringify(viteRscPackageLockJson),
    startCommand,
  },
});
