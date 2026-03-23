import type {SandpackFile, SandpackFiles} from '@webcontainer/react';
import {defineTemplate} from '@webcontainer/react';

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
    require('!raw-loader?esModule=false!./rsc-framework/entry.browser.jsx') as string,
  'framework-entry-rsc':
    require('!raw-loader?esModule=false!./rsc-framework/entry.rsc.jsx') as string,
  'framework-entry-ssr':
    require('!raw-loader?esModule=false!./rsc-framework/entry.ssr.jsx') as string,
  'framework-error-boundary':
    require('!raw-loader?esModule=false!./rsc-framework/error-boundary.jsx') as string,
  request:
    require('!raw-loader?esModule=false!./rsc-framework/request.jsx') as string,
};

const ROOT = `import App from './App.jsx';
import './styles.css';

export function Root(props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite React RSC</title>
      </head>
      <body>
        <App {...props} />
      </body>
    </html>
  )
}`.trim();

const VITE_CONFIG = `import react from '@vitejs/plugin-react';
import rsc from '@vitejs/plugin-rsc';
import { defineConfig } from 'vite';

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
            index: './src/framework/entry.rsc.jsx',
          },
        },
      },
    },

    ssr: {
      build: {
        rollupOptions: {
          input: {
            index: './src/framework/entry.ssr.jsx',
          },
        },
      },
    },

    client: {
      build: {
        rollupOptions: {
          input: {
            index: './src/framework/entry.browser.jsx',
          },
        },
      },
    },
  },
});`.trim();

export const viteRscTemplate = defineTemplate({
  id: 'vite-rsc',
  files: {
    ...hideFiles({
      '/src/framework/entry.browser.jsx':
        RSC_SOURCE_FILES['framework-entry-browser'],
      '/src/framework/entry.rsc.jsx': RSC_SOURCE_FILES['framework-entry-rsc'],
      '/src/framework/entry.ssr.jsx': RSC_SOURCE_FILES['framework-entry-ssr'],
      '/src/framework/error-boundary.jsx':
        RSC_SOURCE_FILES['framework-error-boundary'],
      '/src/framework/request.jsx': RSC_SOURCE_FILES['request'],
      '/src/root.jsx': ROOT,
      '/vite.config.js': VITE_CONFIG,
    }),
  },
  environment: {
    packageJson: JSON.stringify(
      {
        name: 'react.dev',
        private: true,
        type: 'module',
        scripts: {
          start: 'vite dev',
        },
        dependencies: {
          react: '19.2.4',
          'react-dom': '19.2.4',
        },
        devDependencies: {
          '@vitejs/plugin-react': '^4.0.0',
          '@vitejs/plugin-rsc': '^0.5.21',
          'rsc-html-stream': '^0.0.7',
          vite: '^6.0.0',
        },
      },
      null,
      2
    ),
    packageLockJson: JSON.stringify({
      name: 'react.dev',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': {
          name: 'react.dev',
          dependencies: {
            react: '19.2.4',
            'react-dom': '19.2.4',
          },
          devDependencies: {
            '@vitejs/plugin-react': '^4.0.0',
            '@vitejs/plugin-rsc': '^0.5.21',
            'rsc-html-stream': '^0.0.7',
            vite: '^6.0.0',
          },
        },
        'node_modules/@babel/code-frame': {
          version: '7.29.0',
          resolved:
            'https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.29.0.tgz',
          integrity:
            'sha512-9NhCeYjq9+3uxgdtp20LSiJXJvN0FeCtNGpJxuMFZ1Kv3cWUNb6DOhJwUvcVCzKGR66cw4njwM6hrJLqgOwbcw==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@babel/helper-validator-identifier': '^7.28.5',
            'js-tokens': '^4.0.0',
            picocolors: '^1.1.1',
          },
          engines: {
            node: '>=6.9.0',
          },
        },
        'node_modules/@babel/compat-data': {
          version: '7.29.0',
          resolved:
            'https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.29.0.tgz',
          integrity:
            'sha512-T1NCJqT/j9+cn8fvkt7jtwbLBfLC/1y1c7NtCeXFRgzGTsafi68MRv8yzkYSapBnFA6L3U2VSc02ciDzoAJhJg==',
          dev: true,
          license: 'MIT',
          engines: {
            node: '>=6.9.0',
          },
        },
        'node_modules/@babel/core': {
          version: '7.29.0',
          resolved: 'https://registry.npmjs.org/@babel/core/-/core-7.29.0.tgz',
          integrity:
            'sha512-CGOfOJqWjg2qW/Mb6zNsDm+u5vFQ8DxXfbM09z69p5Z6+mE1ikP2jUXw+j42Pf1XTYED2Rni5f95npYeuwMDQA==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@babel/code-frame': '^7.29.0',
            '@babel/generator': '^7.29.0',
            '@babel/helper-compilation-targets': '^7.28.6',
            '@babel/helper-module-transforms': '^7.28.6',
            '@babel/helpers': '^7.28.6',
            '@babel/parser': '^7.29.0',
            '@babel/template': '^7.28.6',
            '@babel/traverse': '^7.29.0',
            '@babel/types': '^7.29.0',
            '@jridgewell/remapping': '^2.3.5',
            'convert-source-map': '^2.0.0',
            debug: '^4.1.0',
            gensync: '^1.0.0-beta.2',
            json5: '^2.2.3',
            semver: '^6.3.1',
          },
          engines: {
            node: '>=6.9.0',
          },
          funding: {
            type: 'opencollective',
            url: 'https://opencollective.com/babel',
          },
        },
        'node_modules/@babel/generator': {
          version: '7.29.1',
          resolved:
            'https://registry.npmjs.org/@babel/generator/-/generator-7.29.1.tgz',
          integrity:
            'sha512-qsaF+9Qcm2Qv8SRIMMscAvG4O3lJ0F1GuMo5HR/Bp02LopNgnZBC/EkbevHFeGs4ls/oPz9v+Bsmzbkbe+0dUw==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@babel/parser': '^7.29.0',
            '@babel/types': '^7.29.0',
            '@jridgewell/gen-mapping': '^0.3.12',
            '@jridgewell/trace-mapping': '^0.3.28',
            jsesc: '^3.0.2',
          },
          engines: {
            node: '>=6.9.0',
          },
        },
        'node_modules/@babel/helper-compilation-targets': {
          version: '7.28.6',
          resolved:
            'https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.28.6.tgz',
          integrity:
            'sha512-JYtls3hqi15fcx5GaSNL7SCTJ2MNmjrkHXg4FSpOA/grxK8KwyZ5bubHsCq8FXCkua6xhuaaBit+3b7+VZRfcA==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@babel/compat-data': '^7.28.6',
            '@babel/helper-validator-option': '^7.27.1',
            browserslist: '^4.24.0',
            'lru-cache': '^5.1.1',
            semver: '^6.3.1',
          },
          engines: {
            node: '>=6.9.0',
          },
        },
        'node_modules/@babel/helper-globals': {
          version: '7.28.0',
          resolved:
            'https://registry.npmjs.org/@babel/helper-globals/-/helper-globals-7.28.0.tgz',
          integrity:
            'sha512-+W6cISkXFa1jXsDEdYA8HeevQT/FULhxzR99pxphltZcVaugps53THCeiWA8SguxxpSp3gKPiuYfSWopkLQ4hw==',
          dev: true,
          license: 'MIT',
          engines: {
            node: '>=6.9.0',
          },
        },
        'node_modules/@babel/helper-module-imports': {
          version: '7.28.6',
          resolved:
            'https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.28.6.tgz',
          integrity:
            'sha512-l5XkZK7r7wa9LucGw9LwZyyCUscb4x37JWTPz7swwFE/0FMQAGpiWUZn8u9DzkSBWEcK25jmvubfpw2dnAMdbw==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@babel/traverse': '^7.28.6',
            '@babel/types': '^7.28.6',
          },
          engines: {
            node: '>=6.9.0',
          },
        },
        'node_modules/@babel/helper-module-transforms': {
          version: '7.28.6',
          resolved:
            'https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.28.6.tgz',
          integrity:
            'sha512-67oXFAYr2cDLDVGLXTEABjdBJZ6drElUSI7WKp70NrpyISso3plG9SAGEF6y7zbha/wOzUByWWTJvEDVNIUGcA==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@babel/helper-module-imports': '^7.28.6',
            '@babel/helper-validator-identifier': '^7.28.5',
            '@babel/traverse': '^7.28.6',
          },
          engines: {
            node: '>=6.9.0',
          },
          peerDependencies: {
            '@babel/core': '^7.0.0',
          },
        },
        'node_modules/@babel/helper-plugin-utils': {
          version: '7.28.6',
          resolved:
            'https://registry.npmjs.org/@babel/helper-plugin-utils/-/helper-plugin-utils-7.28.6.tgz',
          integrity:
            'sha512-S9gzZ/bz83GRysI7gAD4wPT/AI3uCnY+9xn+Mx/KPs2JwHJIz1W8PZkg2cqyt3RNOBM8ejcXhV6y8Og7ly/Dug==',
          dev: true,
          license: 'MIT',
          engines: {
            node: '>=6.9.0',
          },
        },
        'node_modules/@babel/helper-string-parser': {
          version: '7.27.1',
          resolved:
            'https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.27.1.tgz',
          integrity:
            'sha512-qMlSxKbpRlAridDExk92nSobyDdpPijUq2DW6oDnUqd0iOGxmQjyqhMIihI9+zv4LPyZdRje2cavWPbCbWm3eA==',
          dev: true,
          license: 'MIT',
          engines: {
            node: '>=6.9.0',
          },
        },
        'node_modules/@babel/helper-validator-identifier': {
          version: '7.28.5',
          resolved:
            'https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.28.5.tgz',
          integrity:
            'sha512-qSs4ifwzKJSV39ucNjsvc6WVHs6b7S03sOh2OcHF9UHfVPqWWALUsNUVzhSBiItjRZoLHx7nIarVjqKVusUZ1Q==',
          dev: true,
          license: 'MIT',
          engines: {
            node: '>=6.9.0',
          },
        },
        'node_modules/@babel/helper-validator-option': {
          version: '7.27.1',
          resolved:
            'https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.27.1.tgz',
          integrity:
            'sha512-YvjJow9FxbhFFKDSuFnVCe2WxXk1zWc22fFePVNEaWJEu8IrZVlda6N0uHwzZrUM1il7NC9Mlp4MaJYbYd9JSg==',
          dev: true,
          license: 'MIT',
          engines: {
            node: '>=6.9.0',
          },
        },
        'node_modules/@babel/helpers': {
          version: '7.29.2',
          resolved:
            'https://registry.npmjs.org/@babel/helpers/-/helpers-7.29.2.tgz',
          integrity:
            'sha512-HoGuUs4sCZNezVEKdVcwqmZN8GoHirLUcLaYVNBK2J0DadGtdcqgr3BCbvH8+XUo4NGjNl3VOtSjEKNzqfFgKw==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@babel/template': '^7.28.6',
            '@babel/types': '^7.29.0',
          },
          engines: {
            node: '>=6.9.0',
          },
        },
        'node_modules/@babel/parser': {
          version: '7.29.2',
          resolved:
            'https://registry.npmjs.org/@babel/parser/-/parser-7.29.2.tgz',
          integrity:
            'sha512-4GgRzy/+fsBa72/RZVJmGKPmZu9Byn8o4MoLpmNe1m8ZfYnz5emHLQz3U4gLud6Zwl0RZIcgiLD7Uq7ySFuDLA==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@babel/types': '^7.29.0',
          },
          bin: {
            parser: 'bin/babel-parser.js',
          },
          engines: {
            node: '>=6.0.0',
          },
        },
        'node_modules/@babel/plugin-transform-react-jsx-self': {
          version: '7.27.1',
          resolved:
            'https://registry.npmjs.org/@babel/plugin-transform-react-jsx-self/-/plugin-transform-react-jsx-self-7.27.1.tgz',
          integrity:
            'sha512-6UzkCs+ejGdZ5mFFC/OCUrv028ab2fp1znZmCZjAOBKiBK2jXD1O+BPSfX8X2qjJ75fZBMSnQn3Rq2mrBJK2mw==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@babel/helper-plugin-utils': '^7.27.1',
          },
          engines: {
            node: '>=6.9.0',
          },
          peerDependencies: {
            '@babel/core': '^7.0.0-0',
          },
        },
        'node_modules/@babel/plugin-transform-react-jsx-source': {
          version: '7.27.1',
          resolved:
            'https://registry.npmjs.org/@babel/plugin-transform-react-jsx-source/-/plugin-transform-react-jsx-source-7.27.1.tgz',
          integrity:
            'sha512-zbwoTsBruTeKB9hSq73ha66iFeJHuaFkUbwvqElnygoNbj/jHRsSeokowZFN3CZ64IvEqcmmkVe89OPXc7ldAw==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@babel/helper-plugin-utils': '^7.27.1',
          },
          engines: {
            node: '>=6.9.0',
          },
          peerDependencies: {
            '@babel/core': '^7.0.0-0',
          },
        },
        'node_modules/@babel/template': {
          version: '7.28.6',
          resolved:
            'https://registry.npmjs.org/@babel/template/-/template-7.28.6.tgz',
          integrity:
            'sha512-YA6Ma2KsCdGb+WC6UpBVFJGXL58MDA6oyONbjyF/+5sBgxY/dwkhLogbMT2GXXyU84/IhRw/2D1Os1B/giz+BQ==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@babel/code-frame': '^7.28.6',
            '@babel/parser': '^7.28.6',
            '@babel/types': '^7.28.6',
          },
          engines: {
            node: '>=6.9.0',
          },
        },
        'node_modules/@babel/traverse': {
          version: '7.29.0',
          resolved:
            'https://registry.npmjs.org/@babel/traverse/-/traverse-7.29.0.tgz',
          integrity:
            'sha512-4HPiQr0X7+waHfyXPZpWPfWL/J7dcN1mx9gL6WdQVMbPnF3+ZhSMs8tCxN7oHddJE9fhNE7+lxdnlyemKfJRuA==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@babel/code-frame': '^7.29.0',
            '@babel/generator': '^7.29.0',
            '@babel/helper-globals': '^7.28.0',
            '@babel/parser': '^7.29.0',
            '@babel/template': '^7.28.6',
            '@babel/types': '^7.29.0',
            debug: '^4.3.1',
          },
          engines: {
            node: '>=6.9.0',
          },
        },
        'node_modules/@babel/types': {
          version: '7.29.0',
          resolved:
            'https://registry.npmjs.org/@babel/types/-/types-7.29.0.tgz',
          integrity:
            'sha512-LwdZHpScM4Qz8Xw2iKSzS+cfglZzJGvofQICy7W7v4caru4EaAmyUuO6BGrbyQ2mYV11W0U8j5mBhd14dd3B0A==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@babel/helper-string-parser': '^7.27.1',
            '@babel/helper-validator-identifier': '^7.28.5',
          },
          engines: {
            node: '>=6.9.0',
          },
        },
        'node_modules/@esbuild/aix-ppc64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.25.12.tgz',
          integrity:
            'sha512-Hhmwd6CInZ3dwpuGTF8fJG6yoWmsToE+vYgD4nytZVxcu1ulHpUQRAB1UJ8+N1Am3Mz4+xOByoQoSZf4D+CpkA==',
          cpu: ['ppc64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['aix'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/android-arm': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.25.12.tgz',
          integrity:
            'sha512-VJ+sKvNA/GE7Ccacc9Cha7bpS8nyzVv0jdVgwNDaR4gDMC/2TTRc33Ip8qrNYUcpkOHUT5OZ0bUcNNVZQ9RLlg==',
          cpu: ['arm'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['android'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/android-arm64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.25.12.tgz',
          integrity:
            'sha512-6AAmLG7zwD1Z159jCKPvAxZd4y/VTO0VkprYy+3N2FtJ8+BQWFXU+OxARIwA46c5tdD9SsKGZ/1ocqBS/gAKHg==',
          cpu: ['arm64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['android'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/android-x64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.25.12.tgz',
          integrity:
            'sha512-5jbb+2hhDHx5phYR2By8GTWEzn6I9UqR11Kwf22iKbNpYrsmRB18aX/9ivc5cabcUiAT/wM+YIZ6SG9QO6a8kg==',
          cpu: ['x64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['android'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/darwin-arm64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.25.12.tgz',
          integrity:
            'sha512-N3zl+lxHCifgIlcMUP5016ESkeQjLj/959RxxNYIthIg+CQHInujFuXeWbWMgnTo4cp5XVHqFPmpyu9J65C1Yg==',
          cpu: ['arm64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['darwin'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/darwin-x64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.25.12.tgz',
          integrity:
            'sha512-HQ9ka4Kx21qHXwtlTUVbKJOAnmG1ipXhdWTmNXiPzPfWKpXqASVcWdnf2bnL73wgjNrFXAa3yYvBSd9pzfEIpA==',
          cpu: ['x64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['darwin'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/freebsd-arm64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.25.12.tgz',
          integrity:
            'sha512-gA0Bx759+7Jve03K1S0vkOu5Lg/85dou3EseOGUes8flVOGxbhDDh/iZaoek11Y8mtyKPGF3vP8XhnkDEAmzeg==',
          cpu: ['arm64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['freebsd'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/freebsd-x64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.25.12.tgz',
          integrity:
            'sha512-TGbO26Yw2xsHzxtbVFGEXBFH0FRAP7gtcPE7P5yP7wGy7cXK2oO7RyOhL5NLiqTlBh47XhmIUXuGciXEqYFfBQ==',
          cpu: ['x64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['freebsd'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/linux-arm': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.25.12.tgz',
          integrity:
            'sha512-lPDGyC1JPDou8kGcywY0YILzWlhhnRjdof3UlcoqYmS9El818LLfJJc3PXXgZHrHCAKs/Z2SeZtDJr5MrkxtOw==',
          cpu: ['arm'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/linux-arm64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.25.12.tgz',
          integrity:
            'sha512-8bwX7a8FghIgrupcxb4aUmYDLp8pX06rGh5HqDT7bB+8Rdells6mHvrFHHW2JAOPZUbnjUpKTLg6ECyzvas2AQ==',
          cpu: ['arm64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/linux-ia32': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.25.12.tgz',
          integrity:
            'sha512-0y9KrdVnbMM2/vG8KfU0byhUN+EFCny9+8g202gYqSSVMonbsCfLjUO+rCci7pM0WBEtz+oK/PIwHkzxkyharA==',
          cpu: ['ia32'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/linux-loong64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.25.12.tgz',
          integrity:
            'sha512-h///Lr5a9rib/v1GGqXVGzjL4TMvVTv+s1DPoxQdz7l/AYv6LDSxdIwzxkrPW438oUXiDtwM10o9PmwS/6Z0Ng==',
          cpu: ['loong64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/linux-mips64el': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.25.12.tgz',
          integrity:
            'sha512-iyRrM1Pzy9GFMDLsXn1iHUm18nhKnNMWscjmp4+hpafcZjrr2WbT//d20xaGljXDBYHqRcl8HnxbX6uaA/eGVw==',
          cpu: ['mips64el'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/linux-ppc64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.25.12.tgz',
          integrity:
            'sha512-9meM/lRXxMi5PSUqEXRCtVjEZBGwB7P/D4yT8UG/mwIdze2aV4Vo6U5gD3+RsoHXKkHCfSxZKzmDssVlRj1QQA==',
          cpu: ['ppc64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/linux-riscv64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.25.12.tgz',
          integrity:
            'sha512-Zr7KR4hgKUpWAwb1f3o5ygT04MzqVrGEGXGLnj15YQDJErYu/BGg+wmFlIDOdJp0PmB0lLvxFIOXZgFRrdjR0w==',
          cpu: ['riscv64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/linux-s390x': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.25.12.tgz',
          integrity:
            'sha512-MsKncOcgTNvdtiISc/jZs/Zf8d0cl/t3gYWX8J9ubBnVOwlk65UIEEvgBORTiljloIWnBzLs4qhzPkJcitIzIg==',
          cpu: ['s390x'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/linux-x64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.25.12.tgz',
          integrity:
            'sha512-uqZMTLr/zR/ed4jIGnwSLkaHmPjOjJvnm6TVVitAa08SLS9Z0VM8wIRx7gWbJB5/J54YuIMInDquWyYvQLZkgw==',
          cpu: ['x64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/netbsd-arm64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.25.12.tgz',
          integrity:
            'sha512-xXwcTq4GhRM7J9A8Gv5boanHhRa/Q9KLVmcyXHCTaM4wKfIpWkdXiMog/KsnxzJ0A1+nD+zoecuzqPmCRyBGjg==',
          cpu: ['arm64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['netbsd'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/netbsd-x64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.25.12.tgz',
          integrity:
            'sha512-Ld5pTlzPy3YwGec4OuHh1aCVCRvOXdH8DgRjfDy/oumVovmuSzWfnSJg+VtakB9Cm0gxNO9BzWkj6mtO1FMXkQ==',
          cpu: ['x64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['netbsd'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/openbsd-arm64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.25.12.tgz',
          integrity:
            'sha512-fF96T6KsBo/pkQI950FARU9apGNTSlZGsv1jZBAlcLL1MLjLNIWPBkj5NlSz8aAzYKg+eNqknrUJ24QBybeR5A==',
          cpu: ['arm64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['openbsd'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/openbsd-x64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.25.12.tgz',
          integrity:
            'sha512-MZyXUkZHjQxUvzK7rN8DJ3SRmrVrke8ZyRusHlP+kuwqTcfWLyqMOE3sScPPyeIXN/mDJIfGXvcMqCgYKekoQw==',
          cpu: ['x64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['openbsd'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/openharmony-arm64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.25.12.tgz',
          integrity:
            'sha512-rm0YWsqUSRrjncSXGA7Zv78Nbnw4XL6/dzr20cyrQf7ZmRcsovpcRBdhD43Nuk3y7XIoW2OxMVvwuRvk9XdASg==',
          cpu: ['arm64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['openharmony'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/sunos-x64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.25.12.tgz',
          integrity:
            'sha512-3wGSCDyuTHQUzt0nV7bocDy72r2lI33QL3gkDNGkod22EsYl04sMf0qLb8luNKTOmgF/eDEDP5BFNwoBKH441w==',
          cpu: ['x64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['sunos'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/win32-arm64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.25.12.tgz',
          integrity:
            'sha512-rMmLrur64A7+DKlnSuwqUdRKyd3UE7oPJZmnljqEptesKM8wx9J8gx5u0+9Pq0fQQW8vqeKebwNXdfOyP+8Bsg==',
          cpu: ['arm64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['win32'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/win32-ia32': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.25.12.tgz',
          integrity:
            'sha512-HkqnmmBoCbCwxUKKNPBixiWDGCpQGVsrQfJoVGYLPT41XWF8lHuE5N6WhVia2n4o5QK5M4tYr21827fNhi4byQ==',
          cpu: ['ia32'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['win32'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@esbuild/win32-x64': {
          version: '0.25.12',
          resolved:
            'https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.25.12.tgz',
          integrity:
            'sha512-alJC0uCZpTFrSL0CCDjcgleBXPnCrEAhTBILpeAp7M/OFgoqtAetfBzX0xM00MUsVVPpVjlPuMbREqnZCXaTnA==',
          cpu: ['x64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['win32'],
          engines: {
            node: '>=18',
          },
        },
        'node_modules/@jridgewell/gen-mapping': {
          version: '0.3.13',
          resolved:
            'https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz',
          integrity:
            'sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@jridgewell/sourcemap-codec': '^1.5.0',
            '@jridgewell/trace-mapping': '^0.3.24',
          },
        },
        'node_modules/@jridgewell/remapping': {
          version: '2.3.5',
          resolved:
            'https://registry.npmjs.org/@jridgewell/remapping/-/remapping-2.3.5.tgz',
          integrity:
            'sha512-LI9u/+laYG4Ds1TDKSJW2YPrIlcVYOwi2fUC6xB43lueCjgxV4lffOCZCtYFiH6TNOX+tQKXx97T4IKHbhyHEQ==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@jridgewell/gen-mapping': '^0.3.5',
            '@jridgewell/trace-mapping': '^0.3.24',
          },
        },
        'node_modules/@jridgewell/resolve-uri': {
          version: '3.1.2',
          resolved:
            'https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz',
          integrity:
            'sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==',
          dev: true,
          license: 'MIT',
          engines: {
            node: '>=6.0.0',
          },
        },
        'node_modules/@jridgewell/sourcemap-codec': {
          version: '1.5.5',
          resolved:
            'https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz',
          integrity:
            'sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==',
          dev: true,
          license: 'MIT',
        },
        'node_modules/@jridgewell/trace-mapping': {
          version: '0.3.31',
          resolved:
            'https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz',
          integrity:
            'sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@jridgewell/resolve-uri': '^3.1.0',
            '@jridgewell/sourcemap-codec': '^1.4.14',
          },
        },
        'node_modules/@rolldown/pluginutils': {
          version: '1.0.0-beta.27',
          resolved:
            'https://registry.npmjs.org/@rolldown/pluginutils/-/pluginutils-1.0.0-beta.27.tgz',
          integrity:
            'sha512-+d0F4MKMCbeVUJwG96uQ4SgAznZNSq93I3V+9NHA4OpvqG8mRCpGdKmK8l/dl02h2CCDHwW2FqilnTyDcAnqjA==',
          dev: true,
          license: 'MIT',
        },
        'node_modules/@rollup/rollup-android-arm-eabi': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-android-arm-eabi/-/rollup-android-arm-eabi-4.60.0.tgz',
          integrity:
            'sha512-WOhNW9K8bR3kf4zLxbfg6Pxu2ybOUbB2AjMDHSQx86LIF4rH4Ft7vmMwNt0loO0eonglSNy4cpD3MKXXKQu0/A==',
          cpu: ['arm'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['android'],
        },
        'node_modules/@rollup/rollup-android-arm64': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-android-arm64/-/rollup-android-arm64-4.60.0.tgz',
          integrity:
            'sha512-u6JHLll5QKRvjciE78bQXDmqRqNs5M/3GVqZeMwvmjaNODJih/WIrJlFVEihvV0MiYFmd+ZyPr9wxOVbPAG2Iw==',
          cpu: ['arm64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['android'],
        },
        'node_modules/@rollup/rollup-darwin-arm64': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-darwin-arm64/-/rollup-darwin-arm64-4.60.0.tgz',
          integrity:
            'sha512-qEF7CsKKzSRc20Ciu2Zw1wRrBz4g56F7r/vRwY430UPp/nt1x21Q/fpJ9N5l47WWvJlkNCPJz3QRVw008fi7yA==',
          cpu: ['arm64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['darwin'],
        },
        'node_modules/@rollup/rollup-darwin-x64': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-darwin-x64/-/rollup-darwin-x64-4.60.0.tgz',
          integrity:
            'sha512-WADYozJ4QCnXCH4wPB+3FuGmDPoFseVCUrANmA5LWwGmC6FL14BWC7pcq+FstOZv3baGX65tZ378uT6WG8ynTw==',
          cpu: ['x64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['darwin'],
        },
        'node_modules/@rollup/rollup-freebsd-arm64': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-freebsd-arm64/-/rollup-freebsd-arm64-4.60.0.tgz',
          integrity:
            'sha512-6b8wGHJlDrGeSE3aH5mGNHBjA0TTkxdoNHik5EkvPHCt351XnigA4pS7Wsj/Eo9Y8RBU6f35cjN9SYmCFBtzxw==',
          cpu: ['arm64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['freebsd'],
        },
        'node_modules/@rollup/rollup-freebsd-x64': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-freebsd-x64/-/rollup-freebsd-x64-4.60.0.tgz',
          integrity:
            'sha512-h25Ga0t4jaylMB8M/JKAyrvvfxGRjnPQIR8lnCayyzEjEOx2EJIlIiMbhpWxDRKGKF8jbNH01NnN663dH638mA==',
          cpu: ['x64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['freebsd'],
        },
        'node_modules/@rollup/rollup-linux-arm-gnueabihf': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-linux-arm-gnueabihf/-/rollup-linux-arm-gnueabihf-4.60.0.tgz',
          integrity:
            'sha512-RzeBwv0B3qtVBWtcuABtSuCzToo2IEAIQrcyB/b2zMvBWVbjo8bZDjACUpnaafaxhTw2W+imQbP2BD1usasK4g==',
          cpu: ['arm'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
        },
        'node_modules/@rollup/rollup-linux-arm-musleabihf': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-linux-arm-musleabihf/-/rollup-linux-arm-musleabihf-4.60.0.tgz',
          integrity:
            'sha512-Sf7zusNI2CIU1HLzuu9Tc5YGAHEZs5Lu7N1ssJG4Tkw6e0MEsN7NdjUDDfGNHy2IU+ENyWT+L2obgWiguWibWQ==',
          cpu: ['arm'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
        },
        'node_modules/@rollup/rollup-linux-arm64-gnu': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-linux-arm64-gnu/-/rollup-linux-arm64-gnu-4.60.0.tgz',
          integrity:
            'sha512-DX2x7CMcrJzsE91q7/O02IJQ5/aLkVtYFryqCjduJhUfGKG6yJV8hxaw8pZa93lLEpPTP/ohdN4wFz7yp/ry9A==',
          cpu: ['arm64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
        },
        'node_modules/@rollup/rollup-linux-arm64-musl': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-linux-arm64-musl/-/rollup-linux-arm64-musl-4.60.0.tgz',
          integrity:
            'sha512-09EL+yFVbJZlhcQfShpswwRZ0Rg+z/CsSELFCnPt3iK+iqwGsI4zht3secj5vLEs957QvFFXnzAT0FFPIxSrkQ==',
          cpu: ['arm64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
        },
        'node_modules/@rollup/rollup-linux-loong64-gnu': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-linux-loong64-gnu/-/rollup-linux-loong64-gnu-4.60.0.tgz',
          integrity:
            'sha512-i9IcCMPr3EXm8EQg5jnja0Zyc1iFxJjZWlb4wr7U2Wx/GrddOuEafxRdMPRYVaXjgbhvqalp6np07hN1w9kAKw==',
          cpu: ['loong64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
        },
        'node_modules/@rollup/rollup-linux-loong64-musl': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-linux-loong64-musl/-/rollup-linux-loong64-musl-4.60.0.tgz',
          integrity:
            'sha512-DGzdJK9kyJ+B78MCkWeGnpXJ91tK/iKA6HwHxF4TAlPIY7GXEvMe8hBFRgdrR9Ly4qebR/7gfUs9y2IoaVEyog==',
          cpu: ['loong64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
        },
        'node_modules/@rollup/rollup-linux-ppc64-gnu': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-linux-ppc64-gnu/-/rollup-linux-ppc64-gnu-4.60.0.tgz',
          integrity:
            'sha512-RwpnLsqC8qbS8z1H1AxBA1H6qknR4YpPR9w2XX0vo2Sz10miu57PkNcnHVaZkbqyw/kUWfKMI73jhmfi9BRMUQ==',
          cpu: ['ppc64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
        },
        'node_modules/@rollup/rollup-linux-ppc64-musl': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-linux-ppc64-musl/-/rollup-linux-ppc64-musl-4.60.0.tgz',
          integrity:
            'sha512-Z8pPf54Ly3aqtdWC3G4rFigZgNvd+qJlOE52fmko3KST9SoGfAdSRCwyoyG05q1HrrAblLbk1/PSIV+80/pxLg==',
          cpu: ['ppc64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
        },
        'node_modules/@rollup/rollup-linux-riscv64-gnu': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-linux-riscv64-gnu/-/rollup-linux-riscv64-gnu-4.60.0.tgz',
          integrity:
            'sha512-3a3qQustp3COCGvnP4SvrMHnPQ9d1vzCakQVRTliaz8cIp/wULGjiGpbcqrkv0WrHTEp8bQD/B3HBjzujVWLOA==',
          cpu: ['riscv64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
        },
        'node_modules/@rollup/rollup-linux-riscv64-musl': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-linux-riscv64-musl/-/rollup-linux-riscv64-musl-4.60.0.tgz',
          integrity:
            'sha512-pjZDsVH/1VsghMJ2/kAaxt6dL0psT6ZexQVrijczOf+PeP2BUqTHYejk3l6TlPRydggINOeNRhvpLa0AYpCWSQ==',
          cpu: ['riscv64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
        },
        'node_modules/@rollup/rollup-linux-s390x-gnu': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-linux-s390x-gnu/-/rollup-linux-s390x-gnu-4.60.0.tgz',
          integrity:
            'sha512-3ObQs0BhvPgiUVZrN7gqCSvmFuMWvWvsjG5ayJ3Lraqv+2KhOsp+pUbigqbeWqueGIsnn+09HBw27rJ+gYK4VQ==',
          cpu: ['s390x'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
        },
        'node_modules/@rollup/rollup-linux-x64-gnu': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-linux-x64-gnu/-/rollup-linux-x64-gnu-4.60.0.tgz',
          integrity:
            'sha512-EtylprDtQPdS5rXvAayrNDYoJhIz1/vzN2fEubo3yLE7tfAw+948dO0g4M0vkTVFhKojnF+n6C8bDNe+gDRdTg==',
          cpu: ['x64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
        },
        'node_modules/@rollup/rollup-linux-x64-musl': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-linux-x64-musl/-/rollup-linux-x64-musl-4.60.0.tgz',
          integrity:
            'sha512-k09oiRCi/bHU9UVFqD17r3eJR9bn03TyKraCrlz5ULFJGdJGi7VOmm9jl44vOJvRJ6P7WuBi/s2A97LxxHGIdw==',
          cpu: ['x64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['linux'],
        },
        'node_modules/@rollup/rollup-openbsd-x64': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-openbsd-x64/-/rollup-openbsd-x64-4.60.0.tgz',
          integrity:
            'sha512-1o/0/pIhozoSaDJoDcec+IVLbnRtQmHwPV730+AOD29lHEEo4F5BEUB24H0OBdhbBBDwIOSuf7vgg0Ywxdfiiw==',
          cpu: ['x64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['openbsd'],
        },
        'node_modules/@rollup/rollup-openharmony-arm64': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-openharmony-arm64/-/rollup-openharmony-arm64-4.60.0.tgz',
          integrity:
            'sha512-pESDkos/PDzYwtyzB5p/UoNU/8fJo68vcXM9ZW2V0kjYayj1KaaUfi1NmTUTUpMn4UhU4gTuK8gIaFO4UGuMbA==',
          cpu: ['arm64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['openharmony'],
        },
        'node_modules/@rollup/rollup-win32-arm64-msvc': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-win32-arm64-msvc/-/rollup-win32-arm64-msvc-4.60.0.tgz',
          integrity:
            'sha512-hj1wFStD7B1YBeYmvY+lWXZ7ey73YGPcViMShYikqKT1GtstIKQAtfUI6yrzPjAy/O7pO0VLXGmUVWXQMaYgTQ==',
          cpu: ['arm64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['win32'],
        },
        'node_modules/@rollup/rollup-win32-ia32-msvc': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-win32-ia32-msvc/-/rollup-win32-ia32-msvc-4.60.0.tgz',
          integrity:
            'sha512-SyaIPFoxmUPlNDq5EHkTbiKzmSEmq/gOYFI/3HHJ8iS/v1mbugVa7dXUzcJGQfoytp9DJFLhHH4U3/eTy2Bq4w==',
          cpu: ['ia32'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['win32'],
        },
        'node_modules/@rollup/rollup-win32-x64-gnu': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-win32-x64-gnu/-/rollup-win32-x64-gnu-4.60.0.tgz',
          integrity:
            'sha512-RdcryEfzZr+lAr5kRm2ucN9aVlCCa2QNq4hXelZxb8GG0NJSazq44Z3PCCc8wISRuCVnGs0lQJVX5Vp6fKA+IA==',
          cpu: ['x64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['win32'],
        },
        'node_modules/@rollup/rollup-win32-x64-msvc': {
          version: '4.60.0',
          resolved:
            'https://registry.npmjs.org/@rollup/rollup-win32-x64-msvc/-/rollup-win32-x64-msvc-4.60.0.tgz',
          integrity:
            'sha512-PrsWNQ8BuE00O3Xsx3ALh2Df8fAj9+cvvX9AIA6o4KpATR98c9mud4XtDWVvsEuyia5U4tVSTKygawyJkjm60w==',
          cpu: ['x64'],
          dev: true,
          license: 'MIT',
          optional: true,
          os: ['win32'],
        },
        'node_modules/@types/babel__core': {
          version: '7.20.5',
          resolved:
            'https://registry.npmjs.org/@types/babel__core/-/babel__core-7.20.5.tgz',
          integrity:
            'sha512-qoQprZvz5wQFJwMDqeseRXWv3rqMvhgpbXFfVyWhbx9X47POIA6i/+dXefEmZKoAgOaTdaIgNSMqMIU61yRyzA==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@babel/parser': '^7.20.7',
            '@babel/types': '^7.20.7',
            '@types/babel__generator': '*',
            '@types/babel__template': '*',
            '@types/babel__traverse': '*',
          },
        },
        'node_modules/@types/babel__generator': {
          version: '7.27.0',
          resolved:
            'https://registry.npmjs.org/@types/babel__generator/-/babel__generator-7.27.0.tgz',
          integrity:
            'sha512-ufFd2Xi92OAVPYsy+P4n7/U7e68fex0+Ee8gSG9KX7eo084CWiQ4sdxktvdl0bOPupXtVJPY19zk6EwWqUQ8lg==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@babel/types': '^7.0.0',
          },
        },
        'node_modules/@types/babel__template': {
          version: '7.4.4',
          resolved:
            'https://registry.npmjs.org/@types/babel__template/-/babel__template-7.4.4.tgz',
          integrity:
            'sha512-h/NUaSyG5EyxBIp8YRxo4RMe2/qQgvyowRwVMzhYhBCONbW8PUsg4lkFMrhgZhUe5z3L3MiLDuvyJ/CaPa2A8A==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@babel/parser': '^7.1.0',
            '@babel/types': '^7.0.0',
          },
        },
        'node_modules/@types/babel__traverse': {
          version: '7.28.0',
          resolved:
            'https://registry.npmjs.org/@types/babel__traverse/-/babel__traverse-7.28.0.tgz',
          integrity:
            'sha512-8PvcXf70gTDZBgt9ptxJ8elBeBjcLOAcOtoO/mPJjtji1+CdGbHgm77om1GrsPxsiE+uXIpNSK64UYaIwQXd4Q==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@babel/types': '^7.28.2',
          },
        },
        'node_modules/@types/estree': {
          version: '1.0.8',
          resolved:
            'https://registry.npmjs.org/@types/estree/-/estree-1.0.8.tgz',
          integrity:
            'sha512-dWHzHa2WqEXI/O1E9OjrocMTKJl2mSrEolh1Iomrv6U+JuNwaHXsXx9bLu5gG7BUWFIN0skIQJQ/L1rIex4X6w==',
          dev: true,
          license: 'MIT',
        },
        'node_modules/@vitejs/plugin-react': {
          version: '4.7.0',
          resolved:
            'https://registry.npmjs.org/@vitejs/plugin-react/-/plugin-react-4.7.0.tgz',
          integrity:
            'sha512-gUu9hwfWvvEDBBmgtAowQCojwZmJ5mcLn3aufeCsitijs3+f2NsrPtlAWIR6OPiqljl96GVCUbLe0HyqIpVaoA==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@babel/core': '^7.28.0',
            '@babel/plugin-transform-react-jsx-self': '^7.27.1',
            '@babel/plugin-transform-react-jsx-source': '^7.27.1',
            '@rolldown/pluginutils': '1.0.0-beta.27',
            '@types/babel__core': '^7.20.5',
            'react-refresh': '^0.17.0',
          },
          engines: {
            node: '^14.18.0 || >=16.0.0',
          },
          peerDependencies: {
            vite: '^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0',
          },
        },
        'node_modules/@vitejs/plugin-rsc': {
          version: '0.5.21',
          resolved:
            'https://registry.npmjs.org/@vitejs/plugin-rsc/-/plugin-rsc-0.5.21.tgz',
          integrity:
            'sha512-uNayLT8IKvWoznvQyfwKuGiEFV28o7lxUDnw/Av36VCuGpDFZnMmvVCwR37gTvnSmnpul9V0tdJqY3tBKEaDqw==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@rolldown/pluginutils': '1.0.0-rc.5',
            'es-module-lexer': '^2.0.0',
            'estree-walker': '^3.0.3',
            'magic-string': '^0.30.21',
            periscopic: '^4.0.2',
            srvx: '^0.11.7',
            'strip-literal': '^3.1.0',
            'turbo-stream': '^3.1.0',
            vitefu: '^1.1.1',
          },
          peerDependencies: {
            react: '*',
            'react-dom': '*',
            'react-server-dom-webpack': '*',
            vite: '*',
          },
          peerDependenciesMeta: {
            'react-server-dom-webpack': {
              optional: true,
            },
          },
        },
        'node_modules/@vitejs/plugin-rsc/node_modules/@rolldown/pluginutils': {
          version: '1.0.0-rc.5',
          resolved:
            'https://registry.npmjs.org/@rolldown/pluginutils/-/pluginutils-1.0.0-rc.5.tgz',
          integrity:
            'sha512-RxlLX/DPoarZ9PtxVrQgZhPoor987YtKQqCo5zkjX+0S0yLJ7Vv515Wk6+xtTL67VONKJKxETWZwuZjss2idYw==',
          dev: true,
          license: 'MIT',
        },
        'node_modules/baseline-browser-mapping': {
          version: '2.10.10',
          resolved:
            'https://registry.npmjs.org/baseline-browser-mapping/-/baseline-browser-mapping-2.10.10.tgz',
          integrity:
            'sha512-sUoJ3IMxx4AyRqO4MLeHlnGDkyXRoUG0/AI9fjK+vS72ekpV0yWVY7O0BVjmBcRtkNcsAO2QDZ4tdKKGoI6YaQ==',
          dev: true,
          license: 'Apache-2.0',
          bin: {
            'baseline-browser-mapping': 'dist/cli.cjs',
          },
          engines: {
            node: '>=6.0.0',
          },
        },
        'node_modules/browserslist': {
          version: '4.28.1',
          resolved:
            'https://registry.npmjs.org/browserslist/-/browserslist-4.28.1.tgz',
          integrity:
            'sha512-ZC5Bd0LgJXgwGqUknZY/vkUQ04r8NXnJZ3yYi4vDmSiZmC/pdSN0NbNRPxZpbtO4uAfDUAFffO8IZoM3Gj8IkA==',
          dev: true,
          funding: [
            {
              type: 'opencollective',
              url: 'https://opencollective.com/browserslist',
            },
            {
              type: 'tidelift',
              url: 'https://tidelift.com/funding/github/npm/browserslist',
            },
            {
              type: 'github',
              url: 'https://github.com/sponsors/ai',
            },
          ],
          license: 'MIT',
          dependencies: {
            'baseline-browser-mapping': '^2.9.0',
            'caniuse-lite': '^1.0.30001759',
            'electron-to-chromium': '^1.5.263',
            'node-releases': '^2.0.27',
            'update-browserslist-db': '^1.2.0',
          },
          bin: {
            browserslist: 'cli.js',
          },
          engines: {
            node: '^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7',
          },
        },
        'node_modules/caniuse-lite': {
          version: '1.0.30001781',
          resolved:
            'https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001781.tgz',
          integrity:
            'sha512-RdwNCyMsNBftLjW6w01z8bKEvT6e/5tpPVEgtn22TiLGlstHOVecsX2KHFkD5e/vRnIE4EGzpuIODb3mtswtkw==',
          dev: true,
          funding: [
            {
              type: 'opencollective',
              url: 'https://opencollective.com/browserslist',
            },
            {
              type: 'tidelift',
              url: 'https://tidelift.com/funding/github/npm/caniuse-lite',
            },
            {
              type: 'github',
              url: 'https://github.com/sponsors/ai',
            },
          ],
          license: 'CC-BY-4.0',
        },
        'node_modules/convert-source-map': {
          version: '2.0.0',
          resolved:
            'https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz',
          integrity:
            'sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==',
          dev: true,
          license: 'MIT',
        },
        'node_modules/debug': {
          version: '4.4.3',
          resolved: 'https://registry.npmjs.org/debug/-/debug-4.4.3.tgz',
          integrity:
            'sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==',
          dev: true,
          license: 'MIT',
          dependencies: {
            ms: '^2.1.3',
          },
          engines: {
            node: '>=6.0',
          },
          peerDependenciesMeta: {
            'supports-color': {
              optional: true,
            },
          },
        },
        'node_modules/electron-to-chromium': {
          version: '1.5.321',
          resolved:
            'https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.5.321.tgz',
          integrity:
            'sha512-L2C7Q279W2D/J4PLZLk7sebOILDSWos7bMsMNN06rK482umHUrh/3lM8G7IlHFOYip2oAg5nha1rCMxr/rs6ZQ==',
          dev: true,
          license: 'ISC',
        },
        'node_modules/es-module-lexer': {
          version: '2.0.0',
          resolved:
            'https://registry.npmjs.org/es-module-lexer/-/es-module-lexer-2.0.0.tgz',
          integrity:
            'sha512-5POEcUuZybH7IdmGsD8wlf0AI55wMecM9rVBTI/qEAy2c1kTOm3DjFYjrBdI2K3BaJjJYfYFeRtM0t9ssnRuxw==',
          dev: true,
          license: 'MIT',
        },
        'node_modules/esbuild': {
          version: '0.25.12',
          resolved: 'https://registry.npmjs.org/esbuild/-/esbuild-0.25.12.tgz',
          integrity:
            'sha512-bbPBYYrtZbkt6Os6FiTLCTFxvq4tt3JKall1vRwshA3fdVztsLAatFaZobhkBC8/BrPetoa0oksYoKXoG4ryJg==',
          dev: true,
          hasInstallScript: true,
          license: 'MIT',
          bin: {
            esbuild: 'bin/esbuild',
          },
          engines: {
            node: '>=18',
          },
          optionalDependencies: {
            '@esbuild/aix-ppc64': '0.25.12',
            '@esbuild/android-arm': '0.25.12',
            '@esbuild/android-arm64': '0.25.12',
            '@esbuild/android-x64': '0.25.12',
            '@esbuild/darwin-arm64': '0.25.12',
            '@esbuild/darwin-x64': '0.25.12',
            '@esbuild/freebsd-arm64': '0.25.12',
            '@esbuild/freebsd-x64': '0.25.12',
            '@esbuild/linux-arm': '0.25.12',
            '@esbuild/linux-arm64': '0.25.12',
            '@esbuild/linux-ia32': '0.25.12',
            '@esbuild/linux-loong64': '0.25.12',
            '@esbuild/linux-mips64el': '0.25.12',
            '@esbuild/linux-ppc64': '0.25.12',
            '@esbuild/linux-riscv64': '0.25.12',
            '@esbuild/linux-s390x': '0.25.12',
            '@esbuild/linux-x64': '0.25.12',
            '@esbuild/netbsd-arm64': '0.25.12',
            '@esbuild/netbsd-x64': '0.25.12',
            '@esbuild/openbsd-arm64': '0.25.12',
            '@esbuild/openbsd-x64': '0.25.12',
            '@esbuild/openharmony-arm64': '0.25.12',
            '@esbuild/sunos-x64': '0.25.12',
            '@esbuild/win32-arm64': '0.25.12',
            '@esbuild/win32-ia32': '0.25.12',
            '@esbuild/win32-x64': '0.25.12',
          },
        },
        'node_modules/escalade': {
          version: '3.2.0',
          resolved: 'https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz',
          integrity:
            'sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==',
          dev: true,
          license: 'MIT',
          engines: {
            node: '>=6',
          },
        },
        'node_modules/estree-walker': {
          version: '3.0.3',
          resolved:
            'https://registry.npmjs.org/estree-walker/-/estree-walker-3.0.3.tgz',
          integrity:
            'sha512-7RUKfXgSMMkzt6ZuXmqapOurLGPPfgj6l9uRZ7lRGolvk0y2yocc35LdcxKC5PQZdn2DMqioAQ2NoWcrTKmm6g==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@types/estree': '^1.0.0',
          },
        },
        'node_modules/fdir': {
          version: '6.5.0',
          resolved: 'https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz',
          integrity:
            'sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==',
          dev: true,
          license: 'MIT',
          engines: {
            node: '>=12.0.0',
          },
          peerDependencies: {
            picomatch: '^3 || ^4',
          },
          peerDependenciesMeta: {
            picomatch: {
              optional: true,
            },
          },
        },
        'node_modules/fsevents': {
          version: '2.3.3',
          resolved: 'https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz',
          integrity:
            'sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==',
          dev: true,
          hasInstallScript: true,
          license: 'MIT',
          optional: true,
          os: ['darwin'],
          engines: {
            node: '^8.16.0 || ^10.6.0 || >=11.0.0',
          },
        },
        'node_modules/gensync': {
          version: '1.0.0-beta.2',
          resolved:
            'https://registry.npmjs.org/gensync/-/gensync-1.0.0-beta.2.tgz',
          integrity:
            'sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==',
          dev: true,
          license: 'MIT',
          engines: {
            node: '>=6.9.0',
          },
        },
        'node_modules/is-reference': {
          version: '3.0.3',
          resolved:
            'https://registry.npmjs.org/is-reference/-/is-reference-3.0.3.tgz',
          integrity:
            'sha512-ixkJoqQvAP88E6wLydLGGqCJsrFUnqoH6HnaczB8XmDH1oaWU+xxdptvikTgaEhtZ53Ky6YXiBuUI2WXLMCwjw==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@types/estree': '^1.0.6',
          },
        },
        'node_modules/js-tokens': {
          version: '4.0.0',
          resolved:
            'https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz',
          integrity:
            'sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==',
          dev: true,
          license: 'MIT',
        },
        'node_modules/jsesc': {
          version: '3.1.0',
          resolved: 'https://registry.npmjs.org/jsesc/-/jsesc-3.1.0.tgz',
          integrity:
            'sha512-/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==',
          dev: true,
          license: 'MIT',
          bin: {
            jsesc: 'bin/jsesc',
          },
          engines: {
            node: '>=6',
          },
        },
        'node_modules/json5': {
          version: '2.2.3',
          resolved: 'https://registry.npmjs.org/json5/-/json5-2.2.3.tgz',
          integrity:
            'sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==',
          dev: true,
          license: 'MIT',
          bin: {
            json5: 'lib/cli.js',
          },
          engines: {
            node: '>=6',
          },
        },
        'node_modules/lru-cache': {
          version: '5.1.1',
          resolved:
            'https://registry.npmjs.org/lru-cache/-/lru-cache-5.1.1.tgz',
          integrity:
            'sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==',
          dev: true,
          license: 'ISC',
          dependencies: {
            yallist: '^3.0.2',
          },
        },
        'node_modules/magic-string': {
          version: '0.30.21',
          resolved:
            'https://registry.npmjs.org/magic-string/-/magic-string-0.30.21.tgz',
          integrity:
            'sha512-vd2F4YUyEXKGcLHoq+TEyCjxueSeHnFxyyjNp80yg0XV4vUhnDer/lvvlqM/arB5bXQN5K2/3oinyCRyx8T2CQ==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@jridgewell/sourcemap-codec': '^1.5.5',
          },
        },
        'node_modules/ms': {
          version: '2.1.3',
          resolved: 'https://registry.npmjs.org/ms/-/ms-2.1.3.tgz',
          integrity:
            'sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==',
          dev: true,
          license: 'MIT',
        },
        'node_modules/nanoid': {
          version: '3.3.11',
          resolved: 'https://registry.npmjs.org/nanoid/-/nanoid-3.3.11.tgz',
          integrity:
            'sha512-N8SpfPUnUp1bK+PMYW8qSWdl9U+wwNWI4QKxOYDy9JAro3WMX7p2OeVRF9v+347pnakNevPmiHhNmZ2HbFA76w==',
          dev: true,
          funding: [
            {
              type: 'github',
              url: 'https://github.com/sponsors/ai',
            },
          ],
          license: 'MIT',
          bin: {
            nanoid: 'bin/nanoid.cjs',
          },
          engines: {
            node: '^10 || ^12 || ^13.7 || ^14 || >=15.0.1',
          },
        },
        'node_modules/node-releases': {
          version: '2.0.36',
          resolved:
            'https://registry.npmjs.org/node-releases/-/node-releases-2.0.36.tgz',
          integrity:
            'sha512-TdC8FSgHz8Mwtw9g5L4gR/Sh9XhSP/0DEkQxfEFXOpiul5IiHgHan2VhYYb6agDSfp4KuvltmGApc8HMgUrIkA==',
          dev: true,
          license: 'MIT',
        },
        'node_modules/periscopic': {
          version: '4.0.2',
          resolved:
            'https://registry.npmjs.org/periscopic/-/periscopic-4.0.2.tgz',
          integrity:
            'sha512-sqpQDUy8vgB7ycLkendSKS6HnVz1Rneoc3Rc+ZBUCe2pbqlVuCC5vF52l0NJ1aiMg/r1qfYF9/myz8CZeI2rjA==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@types/estree': '*',
            'is-reference': '^3.0.2',
            zimmerframe: '^1.0.0',
          },
        },
        'node_modules/picocolors': {
          version: '1.1.1',
          resolved:
            'https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz',
          integrity:
            'sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==',
          dev: true,
          license: 'ISC',
        },
        'node_modules/picomatch': {
          version: '4.0.3',
          resolved:
            'https://registry.npmjs.org/picomatch/-/picomatch-4.0.3.tgz',
          integrity:
            'sha512-5gTmgEY/sqK6gFXLIsQNH19lWb4ebPDLA4SdLP7dsWkIXHWlG66oPuVvXSGFPppYZz8ZDZq0dYYrbHfBCVUb1Q==',
          dev: true,
          license: 'MIT',
          engines: {
            node: '>=12',
          },
          funding: {
            url: 'https://github.com/sponsors/jonschlinkert',
          },
        },
        'node_modules/postcss': {
          version: '8.5.8',
          resolved: 'https://registry.npmjs.org/postcss/-/postcss-8.5.8.tgz',
          integrity:
            'sha512-OW/rX8O/jXnm82Ey1k44pObPtdblfiuWnrd8X7GJ7emImCOstunGbXUpp7HdBrFQX6rJzn3sPT397Wp5aCwCHg==',
          dev: true,
          funding: [
            {
              type: 'opencollective',
              url: 'https://opencollective.com/postcss/',
            },
            {
              type: 'tidelift',
              url: 'https://tidelift.com/funding/github/npm/postcss',
            },
            {
              type: 'github',
              url: 'https://github.com/sponsors/ai',
            },
          ],
          license: 'MIT',
          dependencies: {
            nanoid: '^3.3.11',
            picocolors: '^1.1.1',
            'source-map-js': '^1.2.1',
          },
          engines: {
            node: '^10 || ^12 || >=14',
          },
        },
        'node_modules/react': {
          version: '19.2.4',
          resolved: 'https://registry.npmjs.org/react/-/react-19.2.4.tgz',
          integrity:
            'sha512-9nfp2hYpCwOjAN+8TZFGhtWEwgvWHXqESH8qT89AT/lWklpLON22Lc8pEtnpsZz7VmawabSU0gCjnj8aC0euHQ==',
          license: 'MIT',
          engines: {
            node: '>=0.10.0',
          },
        },
        'node_modules/react-dom': {
          version: '19.2.4',
          resolved:
            'https://registry.npmjs.org/react-dom/-/react-dom-19.2.4.tgz',
          integrity:
            'sha512-AXJdLo8kgMbimY95O2aKQqsz2iWi9jMgKJhRBAxECE4IFxfcazB2LmzloIoibJI3C12IlY20+KFaLv+71bUJeQ==',
          license: 'MIT',
          dependencies: {
            scheduler: '^0.27.0',
          },
          peerDependencies: {
            react: '^19.2.4',
          },
        },
        'node_modules/react-refresh': {
          version: '0.17.0',
          resolved:
            'https://registry.npmjs.org/react-refresh/-/react-refresh-0.17.0.tgz',
          integrity:
            'sha512-z6F7K9bV85EfseRCp2bzrpyQ0Gkw1uLoCel9XBVWPg/TjRj94SkJzUTGfOa4bs7iJvBWtQG0Wq7wnI0syw3EBQ==',
          dev: true,
          license: 'MIT',
          engines: {
            node: '>=0.10.0',
          },
        },
        'node_modules/rollup': {
          version: '4.60.0',
          resolved: 'https://registry.npmjs.org/rollup/-/rollup-4.60.0.tgz',
          integrity:
            'sha512-yqjxruMGBQJ2gG4HtjZtAfXArHomazDHoFwFFmZZl0r7Pdo7qCIXKqKHZc8yeoMgzJJ+pO6pEEHa+V7uzWlrAQ==',
          dev: true,
          license: 'MIT',
          dependencies: {
            '@types/estree': '1.0.8',
          },
          bin: {
            rollup: 'dist/bin/rollup',
          },
          engines: {
            node: '>=18.0.0',
            npm: '>=8.0.0',
          },
          optionalDependencies: {
            '@rollup/rollup-android-arm-eabi': '4.60.0',
            '@rollup/rollup-android-arm64': '4.60.0',
            '@rollup/rollup-darwin-arm64': '4.60.0',
            '@rollup/rollup-darwin-x64': '4.60.0',
            '@rollup/rollup-freebsd-arm64': '4.60.0',
            '@rollup/rollup-freebsd-x64': '4.60.0',
            '@rollup/rollup-linux-arm-gnueabihf': '4.60.0',
            '@rollup/rollup-linux-arm-musleabihf': '4.60.0',
            '@rollup/rollup-linux-arm64-gnu': '4.60.0',
            '@rollup/rollup-linux-arm64-musl': '4.60.0',
            '@rollup/rollup-linux-loong64-gnu': '4.60.0',
            '@rollup/rollup-linux-loong64-musl': '4.60.0',
            '@rollup/rollup-linux-ppc64-gnu': '4.60.0',
            '@rollup/rollup-linux-ppc64-musl': '4.60.0',
            '@rollup/rollup-linux-riscv64-gnu': '4.60.0',
            '@rollup/rollup-linux-riscv64-musl': '4.60.0',
            '@rollup/rollup-linux-s390x-gnu': '4.60.0',
            '@rollup/rollup-linux-x64-gnu': '4.60.0',
            '@rollup/rollup-linux-x64-musl': '4.60.0',
            '@rollup/rollup-openbsd-x64': '4.60.0',
            '@rollup/rollup-openharmony-arm64': '4.60.0',
            '@rollup/rollup-win32-arm64-msvc': '4.60.0',
            '@rollup/rollup-win32-ia32-msvc': '4.60.0',
            '@rollup/rollup-win32-x64-gnu': '4.60.0',
            '@rollup/rollup-win32-x64-msvc': '4.60.0',
            fsevents: '~2.3.2',
          },
        },
        'node_modules/rsc-html-stream': {
          version: '0.0.7',
          resolved:
            'https://registry.npmjs.org/rsc-html-stream/-/rsc-html-stream-0.0.7.tgz',
          integrity:
            'sha512-v9+fuY7usTgvXdNl8JmfXCvSsQbq2YMd60kOeeMIqCJFZ69fViuIxztHei7v5mlMMa2h3SqS+v44Gu9i9xANZA==',
          dev: true,
          license: 'MIT',
        },
        'node_modules/scheduler': {
          version: '0.27.0',
          resolved:
            'https://registry.npmjs.org/scheduler/-/scheduler-0.27.0.tgz',
          integrity:
            'sha512-eNv+WrVbKu1f3vbYJT/xtiF5syA5HPIMtf9IgY/nKg0sWqzAUEvqY/xm7OcZc/qafLx/iO9FgOmeSAp4v5ti/Q==',
          license: 'MIT',
        },
        'node_modules/semver': {
          version: '6.3.1',
          resolved: 'https://registry.npmjs.org/semver/-/semver-6.3.1.tgz',
          integrity:
            'sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==',
          dev: true,
          license: 'ISC',
          bin: {
            semver: 'bin/semver.js',
          },
        },
        'node_modules/source-map-js': {
          version: '1.2.1',
          resolved:
            'https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz',
          integrity:
            'sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==',
          dev: true,
          license: 'BSD-3-Clause',
          engines: {
            node: '>=0.10.0',
          },
        },
        'node_modules/srvx': {
          version: '0.11.12',
          resolved: 'https://registry.npmjs.org/srvx/-/srvx-0.11.12.tgz',
          integrity:
            'sha512-AQfrGqntqVPXgP03pvBDN1KyevHC+KmYVqb8vVf4N+aomQqdhaZxjvoVp+AOm4u6x+GgNQY3MVzAUIn+TqwkOA==',
          dev: true,
          license: 'MIT',
          bin: {
            srvx: 'bin/srvx.mjs',
          },
          engines: {
            node: '>=20.16.0',
          },
        },
        'node_modules/strip-literal': {
          version: '3.1.0',
          resolved:
            'https://registry.npmjs.org/strip-literal/-/strip-literal-3.1.0.tgz',
          integrity:
            'sha512-8r3mkIM/2+PpjHoOtiAW8Rg3jJLHaV7xPwG+YRGrv6FP0wwk/toTpATxWYOW0BKdWwl82VT2tFYi5DlROa0Mxg==',
          dev: true,
          license: 'MIT',
          dependencies: {
            'js-tokens': '^9.0.1',
          },
          funding: {
            url: 'https://github.com/sponsors/antfu',
          },
        },
        'node_modules/strip-literal/node_modules/js-tokens': {
          version: '9.0.1',
          resolved:
            'https://registry.npmjs.org/js-tokens/-/js-tokens-9.0.1.tgz',
          integrity:
            'sha512-mxa9E9ITFOt0ban3j6L5MpjwegGz6lBQmM1IJkWeBZGcMxto50+eWdjC/52xDbS2vy0k7vIMK0Fe2wfL9OQSpQ==',
          dev: true,
          license: 'MIT',
        },
        'node_modules/tinyglobby': {
          version: '0.2.15',
          resolved:
            'https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.15.tgz',
          integrity:
            'sha512-j2Zq4NyQYG5XMST4cbs02Ak8iJUdxRM0XI5QyxXuZOzKOINmWurp3smXu3y5wDcJrptwpSjgXHzIQxR0omXljQ==',
          dev: true,
          license: 'MIT',
          dependencies: {
            fdir: '^6.5.0',
            picomatch: '^4.0.3',
          },
          engines: {
            node: '>=12.0.0',
          },
          funding: {
            url: 'https://github.com/sponsors/SuperchupuDev',
          },
        },
        'node_modules/turbo-stream': {
          version: '3.2.0',
          resolved:
            'https://registry.npmjs.org/turbo-stream/-/turbo-stream-3.2.0.tgz',
          integrity:
            'sha512-EK+bZ9UVrVh7JLslVFOV0GEMsociOqVOvEMTAd4ixMyffN5YNIEdLZWXUx5PJqDbTxSIBWw04HS9gCY4frYQDQ==',
          dev: true,
          license: 'MIT',
        },
        'node_modules/update-browserslist-db': {
          version: '1.2.3',
          resolved:
            'https://registry.npmjs.org/update-browserslist-db/-/update-browserslist-db-1.2.3.tgz',
          integrity:
            'sha512-Js0m9cx+qOgDxo0eMiFGEueWztz+d4+M3rGlmKPT+T4IS/jP4ylw3Nwpu6cpTTP8R1MAC1kF4VbdLt3ARf209w==',
          dev: true,
          funding: [
            {
              type: 'opencollective',
              url: 'https://opencollective.com/browserslist',
            },
            {
              type: 'tidelift',
              url: 'https://tidelift.com/funding/github/npm/browserslist',
            },
            {
              type: 'github',
              url: 'https://github.com/sponsors/ai',
            },
          ],
          license: 'MIT',
          dependencies: {
            escalade: '^3.2.0',
            picocolors: '^1.1.1',
          },
          bin: {
            'update-browserslist-db': 'cli.js',
          },
          peerDependencies: {
            browserslist: '>= 4.21.0',
          },
        },
        'node_modules/vite': {
          version: '6.4.1',
          resolved: 'https://registry.npmjs.org/vite/-/vite-6.4.1.tgz',
          integrity:
            'sha512-+Oxm7q9hDoLMyJOYfUYBuHQo+dkAloi33apOPP56pzj+vsdJDzr+j1NISE5pyaAuKL4A3UD34qd0lx5+kfKp2g==',
          dev: true,
          license: 'MIT',
          dependencies: {
            esbuild: '^0.25.0',
            fdir: '^6.4.4',
            picomatch: '^4.0.2',
            postcss: '^8.5.3',
            rollup: '^4.34.9',
            tinyglobby: '^0.2.13',
          },
          bin: {
            vite: 'bin/vite.js',
          },
          engines: {
            node: '^18.0.0 || ^20.0.0 || >=22.0.0',
          },
          funding: {
            url: 'https://github.com/vitejs/vite?sponsor=1',
          },
          optionalDependencies: {
            fsevents: '~2.3.3',
          },
          peerDependencies: {
            '@types/node': '^18.0.0 || ^20.0.0 || >=22.0.0',
            jiti: '>=1.21.0',
            less: '*',
            lightningcss: '^1.21.0',
            sass: '*',
            'sass-embedded': '*',
            stylus: '*',
            sugarss: '*',
            terser: '^5.16.0',
            tsx: '^4.8.1',
            yaml: '^2.4.2',
          },
          peerDependenciesMeta: {
            '@types/node': {
              optional: true,
            },
            jiti: {
              optional: true,
            },
            less: {
              optional: true,
            },
            lightningcss: {
              optional: true,
            },
            sass: {
              optional: true,
            },
            'sass-embedded': {
              optional: true,
            },
            stylus: {
              optional: true,
            },
            sugarss: {
              optional: true,
            },
            terser: {
              optional: true,
            },
            tsx: {
              optional: true,
            },
            yaml: {
              optional: true,
            },
          },
        },
        'node_modules/vitefu': {
          version: '1.1.2',
          resolved: 'https://registry.npmjs.org/vitefu/-/vitefu-1.1.2.tgz',
          integrity:
            'sha512-zpKATdUbzbsycPFBN71nS2uzBUQiVnFoOrr2rvqv34S1lcAgMKKkjWleLGeiJlZ8lwCXvtWaRn7R3ZC16SYRuw==',
          dev: true,
          license: 'MIT',
          workspaces: [
            'tests/deps/*',
            'tests/projects/*',
            'tests/projects/workspace/packages/*',
          ],
          peerDependencies: {
            vite: '^3.0.0 || ^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0-beta.0',
          },
          peerDependenciesMeta: {
            vite: {
              optional: true,
            },
          },
        },
        'node_modules/yallist': {
          version: '3.1.1',
          resolved: 'https://registry.npmjs.org/yallist/-/yallist-3.1.1.tgz',
          integrity:
            'sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==',
          dev: true,
          license: 'ISC',
        },
        'node_modules/zimmerframe': {
          version: '1.1.4',
          resolved:
            'https://registry.npmjs.org/zimmerframe/-/zimmerframe-1.1.4.tgz',
          integrity:
            'sha512-B58NGBEoc8Y9MWWCQGl/gq9xBCe4IiKM0a2x7GZdQKOW5Exr8S1W24J6OgM1njK8xCRGvAJIL/MxXHf6SkmQKQ==',
          dev: true,
          license: 'MIT',
        },
      },
    }),
    startCommand: ['npx', 'vite', '--port', '{{port}}'],
  },
});
