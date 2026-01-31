/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {transformFromAstSync} = require('@babel/core');
const {parse: babelParse} = require('@babel/parser');
const BabelPluginReactCompiler = require('babel-plugin-react-compiler').default;
const {
  parsePluginOptions,
  validateEnvironmentConfig,
} = require('babel-plugin-react-compiler');

const COMPILER_OPTIONS = {
  noEmit: true,
  panicThreshold: 'none',
  environment: validateEnvironmentConfig({
    validateRefAccessDuringRender: true,
    validateNoSetStateInRender: true,
    validateNoSetStateInEffects: true,
    validateNoJSXInTryStatements: true,
    validateNoImpureFunctionsInRender: true,
    validateStaticComponents: true,
    validateNoFreezingKnownMutableFunctions: true,
    validateNoVoidUseMemo: true,
    validateNoCapitalizedCalls: [],
    validateHooksUsage: true,
    validateNoDerivedComputationsInEffects: true,
  }),
};

function hasRelevantCode(code) {
  const functionPattern = /^(export\s+)?(default\s+)?function\s+\w+/m;
  const arrowPattern =
    /^(export\s+)?(const|let|var)\s+\w+\s*=\s*(\([^)]*\)|\w+)\s*=>/m;
  const hasImports = /^import\s+/m.test(code);

  return functionPattern.test(code) || arrowPattern.test(code) || hasImports;
}

function runReactCompiler(code, filename) {
  const result = {
    sourceCode: code,
    events: [],
  };

  if (!hasRelevantCode(code)) {
    return {...result, diagnostics: []};
  }

  const options = parsePluginOptions({
    ...COMPILER_OPTIONS,
  });

  options.logger = {
    logEvent: (_, event) => {
      if (event.kind === 'CompileError') {
        const category = event.detail?.category;
        if (category === 'Todo' || category === 'Invariant') {
          return;
        }
        result.events.push(event);
      }
    },
  };

  try {
    const ast = babelParse(code, {
      sourceFilename: filename,
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    transformFromAstSync(ast, code, {
      filename,
      highlightCode: false,
      retainLines: true,
      plugins: [[BabelPluginReactCompiler, options]],
      sourceType: 'module',
      configFile: false,
      babelrc: false,
    });
  } catch (error) {
    return {...result, diagnostics: []};
  }

  const diagnostics = [];

  for (const event of result.events) {
    if (event.kind !== 'CompileError') {
      continue;
    }

    const detail = event.detail;
    if (!detail) {
      continue;
    }

    const loc = typeof detail.primaryLocation === 'function'
      ? detail.primaryLocation()
      : null;

    if (loc == null || typeof loc === 'symbol') {
      continue;
    }

    const message = typeof detail.printErrorMessage === 'function'
      ? detail.printErrorMessage(result.sourceCode, {eslint: true})
      : detail.description || 'Unknown React Compiler error';

    diagnostics.push({detail, loc, message});
  }

  return {...result, diagnostics};
}

module.exports = {
  hasRelevantCode,
  runReactCompiler,
};
