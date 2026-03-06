import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import localRules from './eslint-local-rules/index.js';
import mdxParser from './eslint-local-rules/parser.js';

const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'dist/**',
      'out/**',
      '**/.*/**',
      'scripts/**',
      'plugins/**',
      '.claude/**',
      'worker-bundle.dist.js',
      'src/components/MDX/Sandpack/generatedHooksLint.ts',
      'src/components/MDX/Sandpack/sandpack-rsc/generatedSources.ts',
      'src/components/MDX/Sandpack/sandpack-rsc/sandbox-code/**',
      'next-env.d.ts',
      'next.config.js',
    ],
  },
  ...nextCoreWebVitals,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'local-rules': localRules,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {varsIgnorePattern: '^_'}],
      'react-hooks/exhaustive-deps': 'error',
      'react/no-unknown-property': ['error', {ignore: ['meta']}],
      'local-rules/lint-markdown-code-blocks': 'error',
    },
  },
  {
    files: ['src/content/**/*.md'],
    languageOptions: {
      parser: mdxParser,
      parserOptions: {
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'local-rules': localRules,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/no-unknown-property': 'off',
      'local-rules/lint-markdown-code-blocks': 'error',
    },
  },
];

export default config;
