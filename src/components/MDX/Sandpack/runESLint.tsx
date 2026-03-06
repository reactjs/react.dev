/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-nocheck

import {Linter} from 'eslint-linter-browserify';

import type {Diagnostic} from '@codemirror/lint';
import type {Text} from '@codemirror/text';

const getCodeMirrorPosition = (
  doc: Text,
  {line, column}: {line: number; column?: number}
): number => {
  return doc.line(line).from + (column ?? 0) - 1;
};

const linter = new Linter();

const reactHooksPlugin = require('eslint-plugin-react-hooks-browser');

const options = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {jsx: true},
      },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
];

export const runESLint = (
  doc: Text
): {errors: any[]; codeMirrorErrors: Diagnostic[]} => {
  const codeString = doc.toString();
  const errors = linter.verify(codeString, options, {
    filename: 'SandpackEditor.jsx',
  }) as any[];

  const severity = {
    1: 'warning',
    2: 'error',
  };

  const codeMirrorErrors = errors
    .map((error) => {
      if (!error) return undefined;

      const from = getCodeMirrorPosition(doc, {
        line: error.line,
        column: error.column,
      });

      const to = getCodeMirrorPosition(doc, {
        line: error.endLine ?? error.line,
        column: error.endColumn ?? error.column,
      });

      return {
        ruleId: error.ruleId,
        from,
        to,
        severity: severity[error.severity],
        message: error.message,
      };
    })
    .filter(Boolean) as Diagnostic[];

  return {
    codeMirrorErrors,
    errors: errors.map((item) => {
      return {
        ...item,
        severity: severity[item.severity],
      };
    }),
  };
};
