/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {
  buildFenceLine,
  getCompilerExpectedLines,
  getSortedUniqueNumbers,
  hasCompilerEntry,
  metadataEquals,
  metadataHasExpectedErrorsToken,
  removeCompilerExpectedLines,
  setCompilerExpectedLines,
} = require('./metadata');
const {normalizeDiagnostics} = require('./diagnostics');
const {parseMarkdownFile} = require('./markdown');
const {runReactCompiler} = require('./react-compiler');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Run React Compiler on markdown code blocks',
      category: 'Possible Errors',
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [],
  },

  create(context) {
    return {
      Program(node) {
        const filename = context.getFilename();
        if (!filename.endsWith('.md') || !filename.includes('src/content')) {
          return;
        }

        const sourceCode = context.getSourceCode();
        const {blocks} = parseMarkdownFile(sourceCode.text, filename);
        // For each supported code block, run the compiler and reconcile metadata.
        for (const block of blocks) {
          const compilerResult = runReactCompiler(
            block.code,
            `${filename}#codeblock`
          );

          const expectedLines = getCompilerExpectedLines(block.metadata);
          const expectedLineSet = new Set(expectedLines);
          const diagnostics = normalizeDiagnostics(
            block,
            compilerResult.diagnostics
          );

          const errorLines = new Set();
          const unexpectedDiagnostics = [];

          for (const diagnostic of diagnostics) {
            const line = diagnostic.relativeStartLine;
            errorLines.add(line);
            if (!expectedLineSet.has(line)) {
              unexpectedDiagnostics.push(diagnostic);
            }
          }

          const normalizedErrorLines = getSortedUniqueNumbers(
            Array.from(errorLines)
          );
          const missingExpectedLines = expectedLines.filter(
            (line) => !errorLines.has(line)
          );

          const desiredMetadata = normalizedErrorLines.length
            ? setCompilerExpectedLines(block.metadata, normalizedErrorLines)
            : removeCompilerExpectedLines(block.metadata);

          // Compute canonical metadata and attach an autofix when it differs.
          const metadataChanged = !metadataEquals(
            block.metadata,
            desiredMetadata
          );
          const replacementLine = buildFenceLine(block.lang, desiredMetadata);
          const replacementDiffers = block.fence.rawText !== replacementLine;
          const applyReplacementFix = replacementDiffers
            ? (fixer) =>
                fixer.replaceTextRange(block.fence.range, replacementLine)
            : null;

          const hasDuplicateMetadata =
            block.metadata.hadDuplicateExpectedErrors;
          const hasExpectedErrorsMetadata = metadataHasExpectedErrorsToken(
            block.metadata
          );

          const shouldFixUnexpected =
            Boolean(applyReplacementFix) &&
            normalizedErrorLines.length > 0 &&
            (metadataChanged ||
              hasDuplicateMetadata ||
              !hasExpectedErrorsMetadata);

          let fixAlreadyAttached = false;

          for (const diagnostic of unexpectedDiagnostics) {
            const reportData = {
              node,
              loc: diagnostic.markdownLoc,
              message: diagnostic.message,
            };

            if (
              shouldFixUnexpected &&
              applyReplacementFix &&
              !fixAlreadyAttached
            ) {
              reportData.fix = applyReplacementFix;
              reportData.suggest = [
                {
                  desc: 'Add expectedErrors metadata to suppress these errors',
                  fix: applyReplacementFix,
                },
              ];
              fixAlreadyAttached = true;
            }

            context.report(reportData);
          }

          // Assert that expectedErrors is actually needed
          if (
            Boolean(applyReplacementFix) &&
            missingExpectedLines.length > 0 &&
            hasCompilerEntry(block.metadata)
          ) {
            const plural = missingExpectedLines.length > 1;
            const message = plural
              ? `React Compiler expected errors on lines ${missingExpectedLines.join(
                  ', '
                )} were not triggered`
              : `React Compiler expected error on line ${missingExpectedLines[0]} was not triggered`;

            const reportData = {
              node,
              loc: {
                start: {
                  line: block.position.start.line,
                  column: 0,
                },
                end: {
                  line: block.position.start.line,
                  column: block.fence.rawText.length,
                },
              },
              message,
            };

            if (!fixAlreadyAttached && applyReplacementFix) {
              reportData.fix = applyReplacementFix;
              fixAlreadyAttached = true;
            } else if (applyReplacementFix) {
              reportData.suggest = [
                {
                  desc: 'Remove stale expectedErrors metadata',
                  fix: applyReplacementFix,
                },
              ];
            }

            context.report(reportData);
          }
        }
      },
    };
  },
};
