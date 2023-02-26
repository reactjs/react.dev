// @ts-nocheck

import {Linter} from 'eslint/lib/linter/linter';

import type {Diagnostic} from '@codemirror/lint';
import type {Text} from '@codemirror/text';

const getCodeMirrorPosition = (
  doc: Text,
  {line, column}: {line: number; column?: number}
): number => {
  return doc.line(line).from + (column ?? 0) - 1;
};

const linter = new Linter();

// HACK! Eslint requires 'esquery' using `require`, but there's no commonjs interop.
// because of this it tries to run `esquery.parse()`, while there's only `esquery.default.parse()`.
// This hack places the functions in the right place.
const esquery = require('esquery');
esquery.parse = esquery.default?.parse;
esquery.matches = esquery.default?.matches;

const reactRules = require('eslint-plugin-react-hooks').rules;
linter.defineRules({
  'react-hooks/rules-of-hooks': reactRules['rules-of-hooks'],
  'react-hooks/exhaustive-deps': reactRules['exhaustive-deps'],
});

const options = {
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {jsx: true},
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
  },
};

export const runESLint = (
  doc: Text
): {errors: any[]; codeMirrorErrors: Diagnostic[]} => {
  const codeString = doc.toString();
  const errors = linter.verify(codeString, options) as any[];

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
