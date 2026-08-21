/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {defineConfig, globalIgnores} from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import typescriptEslint from 'typescript-eslint';
import markdownParser from './eslint-local-rules/parser.js';
import localRules from './eslint-local-rules/index.js';

export default defineConfig([
  ...nextVitals,
  {
    files: ['{src,plugins}/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'local-rules': localRules,
      '@typescript-eslint': typescriptEslint.plugin,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {varsIgnorePattern: '^_'},
      ],
      'react-hooks/exhaustive-deps': 'error',
      'react/no-unknown-property': ['error', {ignore: ['meta']}],
      'no-trailing-spaces': 'error',
    },
  },
  {
    files: ['src/content/**/*.md'],
    languageOptions: {
      parser: markdownParser,
      parserOptions: {
        sourceType: 'module',
      },
    },
    plugins: {
      'local-rules': localRules,
    },
    rules: {
      'local-rules/lint-markdown-code-blocks': 'error',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'scripts/**',
    'plugins/**',
    'next.config.js',
    '.claude/**',
    '**/worker-bundle.dist.js',
  ]),
]);
