import {defineTemplate} from '@webcontainer/react';
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
  serverMode: 'shared',
  sharedFiles: {
    '/vite.config.js': {
      code: require('!raw-loader?esModule=false!./vite-react/vite.config.js') as string,
    },
  },
  appFiles: {
    '/index.html': {
      code: require('!raw-loader?esModule=false!./vite-react/index.html') as string,
    },
    '/src/index.jsx': {
      code: require('!raw-loader?esModule=false!./vite-react/src/index.jsx') as string,
    },
  },
  environment: {
    packageJson: JSON.stringify(viteReactPackageJson, null, 2),
    packageLockJson: JSON.stringify(viteReactPackageLockJson, null, 2),
    startCommand,
  },
});

export const viteRscTemplate = defineTemplate({
  id: 'vite-rsc',
  serverMode: 'shared',
  sharedFiles: {
    '/vite.config.js': {
      code: require('!raw-loader?esModule=false!./vite-rsc/vite.config.js') as string,
    },
    '/src/framework/entry.browser.jsx': {
      code: require('!raw-loader?esModule=false!./vite-rsc/src/framework/entry.browser.jsx') as string,
    },
    '/src/framework/entry.rsc.jsx': {
      code: require('!raw-loader?esModule=false!./vite-rsc/src/framework/entry.rsc.jsx') as string,
    },
    '/src/framework/entry.ssr.jsx': {
      code: require('!raw-loader?esModule=false!./vite-rsc/src/framework/entry.ssr.jsx') as string,
    },
    '/src/framework/request.jsx': {
      code: require('!raw-loader?esModule=false!./vite-rsc/src/framework/request.jsx') as string,
    },
  },
  appFiles: {
    '/src/root.jsx': {
      code: require('!raw-loader?esModule=false!./vite-rsc/src/root.jsx') as string,
    },
  },
  environment: {
    packageJson: JSON.stringify(viteRscPackageJson, null, 2),
    packageLockJson: JSON.stringify(viteRscPackageLockJson, null, 2),
    startCommand,
  },
});
