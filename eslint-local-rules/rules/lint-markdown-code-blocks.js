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

const SUPPORTED_LANGUAGES = new Set([
  'js',
  'jsx',
  'javascript',
  'ts',
  'tsx',
  'typescript',
]);

const EXPECTED_ERRORS_BLOCK_REGEX = /\{expectedErrors:\s*\{[^}]*\}\s*\}/g;

function getSortedUniqueNumbers(values) {
  return Array.from(new Set(values))
    .filter((value) => typeof value === 'number' && !Number.isNaN(value))
    .sort((a, b) => a - b);
}

function arraysEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function extractObjectSegment(metaText) {
  let index = 0;
  while (index < metaText.length && /\s/.test(metaText[index])) {
    index++;
  }

  if (metaText[index] !== '{') {
    return null;
  }

  let depth = 0;
  for (let i = index; i < metaText.length; i++) {
    const char = metaText[i];
    if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0) {
        return {
          leading: metaText.slice(0, index),
          object: metaText.slice(index, i + 1),
          rest: metaText.slice(i + 1),
        };
      }
    }
  }

  return null;
}

function updateExpectedErrorsBlock(block, reactCompilerEntry) {
  const reactCompilerRegex = /(['"])react-compiler\1\s*:\s*\[[^\]]*\]/;
  if (reactCompilerRegex.test(block)) {
    return block.replace(reactCompilerRegex, reactCompilerEntry);
  }

  const innerStart = block.indexOf('{');
  const innerEnd = block.lastIndexOf('}');
  if (innerStart === -1 || innerEnd === -1) {
    return block;
  }

  const inner = block.slice(innerStart + 1, innerEnd);
  const leadingWhitespace = inner.match(/^\s*/)[0];
  const trailingWhitespace = inner.match(/\s*$/)[0];
  const innerContent = inner.trim();

  let newInnerContent = reactCompilerEntry;
  if (innerContent) {
    newInnerContent = `${reactCompilerEntry}, ${innerContent}`;
  }

  return (
    `${block.slice(0, innerStart + 1)}` +
    `${leadingWhitespace}${newInnerContent}${trailingWhitespace}` +
    `${block.slice(innerEnd)}`
  );
}

function removeDuplicateExpectedErrorBlocks(metaText) {
  const matches = [...metaText.matchAll(EXPECTED_ERRORS_BLOCK_REGEX)];

  if (matches.length <= 1) {
    return metaText;
  }

  const first = matches[0];
  const before = metaText.slice(0, first.index);
  let after = metaText.slice(first.index + first[0].length);

  after = after.replace(EXPECTED_ERRORS_BLOCK_REGEX, '');
  if (/^\s{2,}/.test(after)) {
    after = ` ${after.trimStart()}`;
  }

  return `${before}${first[0]}${after}`;
}


function parseCodeBlockMetadata(meta) {
  if (!meta) return {};

  const expectedIndex = meta.indexOf('expectedErrors');
  if (expectedIndex === -1) {
    return {};
  }

  let start = expectedIndex;
  while (start >= 0 && meta[start] !== '{') {
    start--;
  }

  if (start < 0) {
    return {};
  }

  let depth = 0;
  let end = -1;
  for (let i = start; i < meta.length; i++) {
    const char = meta[i];
    if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end === -1) {
    return {};
  }

  const objectSource = meta.slice(start, end + 1);

  try {
    let jsonString = objectSource
      .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')
      .replace(/'([^']*)'/g, '"$1"');

    const parsed = JSON.parse(jsonString);

    if (parsed.expectedErrors && typeof parsed.expectedErrors === 'object') {
      const normalized = {};
      for (const [key, value] of Object.entries(parsed.expectedErrors)) {
        if (Array.isArray(value)) {
          normalized[key] = value.flat().filter((n) => typeof n === 'number');
        }
      }
      return {expectedErrors: normalized};
    }

    return {expectedErrors: {}};
  } catch (e) {
    return {expectedErrors: {}};
  }
}

function extractCodeBlocks(content, filePath) {
  const codeBlocks = [];
  const lines = content.split('\n');
  let inCodeBlock = false;
  let currentBlock = null;
  let blockStartLine = 0;
  let codeStartLine = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const codeBlockMatch = line.match(/^```(\w+)(.*)$/);

    if (codeBlockMatch && SUPPORTED_LANGUAGES.has(codeBlockMatch[1])) {
      inCodeBlock = true;
      blockStartLine = i + 1;
      codeStartLine = i + 2;

      const metaPart = codeBlockMatch[2].trim();
      const metadata = parseCodeBlockMetadata(metaPart);

      currentBlock = {
        code: '',
        lang: codeBlockMatch[1],
        metadata,
        filePath,
        position: {
          start: {line: blockStartLine, column: 0},
          end: {line: 0, column: 0},
        },
        codeStartLine,
        codeLines: [],
      };
    } else if (inCodeBlock && line === '```') {
      inCodeBlock = false;
      if (currentBlock && currentBlock.codeLines) {
        currentBlock.code = currentBlock.codeLines.join('\n');
        currentBlock.position.end = {line: i + 1, column: 0};
        codeBlocks.push(currentBlock);
        currentBlock = null;
      }
    } else if (inCodeBlock && currentBlock && currentBlock.codeLines) {
      currentBlock.codeLines.push(line);
    }
  }

  return codeBlocks;
}

function hasRelevantCode(code) {
  const functionPattern = /^(export\s+)?(default\s+)?function\s+\w+/m;
  const arrowPattern =
    /^(export\s+)?(const|let|var)\s+\w+\s*=\s*(\([^)]*\)|\w+)\s*=>/m;
  const hasImports = /^import\s+/m.test(code);

  return functionPattern.test(code) || arrowPattern.test(code) || hasImports;
}

function runReactCompiler(code, filename) {
  if (!hasRelevantCode(code)) {
    return [];
  }

  const errors = [];
  const options = parsePluginOptions({
    ...COMPILER_OPTIONS,
  });

  const compilerLogger = {
    logEvent: (_, event) => {
      if (event.kind === 'CompileError') {
        const category = event.detail?.category;
        if (category === 'Todo' || category === 'Invariant') {
          return;
        }
        errors.push(event);
      }
    },
  };
  options.logger = compilerLogger;

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
  } catch (err) {
    return [];
  }

  return errors;
}

function extractErrorLocation(error) {
  const possibleLocs = [
    error.detail?.options?.details?.[0]?.loc,
    error.detail?.details?.[0]?.loc,
    error.detail?.loc,
    error.fnLoc,
  ];

  for (const loc of possibleLocs) {
    if (loc) {
      const line = loc.start?.line || loc.line || 1;
      const startColumn = loc.start?.column || 0;
      const endColumn = loc.end?.column || startColumn;
      return {line, startColumn, endColumn};
    }
  }

  return {line: 1, startColumn: 0, endColumn: 0};
}

function extractErrorReason(error) {
  return (
    error.detail?.options?.reason ||
    error.detail?.reason ||
    'Unknown React Compiler error'
  );
}

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
        let content = sourceCode.text;

        const commentMatch = content.match(/\/\* ([\s\S]*) \*\/$/);
        if (commentMatch) {
          content = commentMatch[1].replace(/\*\\\//g, '*/');
        }

        const codeBlocks = extractCodeBlocks(content, filename);

        for (const block of codeBlocks) {
          const errors = runReactCompiler(block.code, `${filename}#codeblock`);
          const expectedErrors =
            block.metadata.expectedErrors?.['react-compiler'] || [];

          const allErrorLines = new Set();
          const unexpectedErrors = [];

          for (const error of errors) {
            const location = extractErrorLocation(error);
            allErrorLines.add(location.line);

            if (!expectedErrors.includes(location.line)) {
              unexpectedErrors.push({error, location});
            }
          }

          let fixProvided = false;

          for (const {error, location} of unexpectedErrors) {
            const markdownLine =
              location.line > 1
                ? block.codeStartLine + location.line - 1
                : block.codeStartLine;

            const reason = extractErrorReason(error);

            let fix;
            let suggestions;

            const errorLines = getSortedUniqueNumbers(allErrorLines);
            const existingExpectedLines = getSortedUniqueNumbers(expectedErrors);
            const lines = content.split('\n');
            const codeBlockLineNum = block.position.start.line - 1;
            const currentLine = lines[codeBlockLineNum];

            const lineMatch = currentLine.match(/^```(\w+)(.*)$/);
            const metaPortion = lineMatch?.[2] || '';
            const metadataOccurrences = metaPortion.match(
              EXPECTED_ERRORS_BLOCK_REGEX
            );
            const hasDuplicateMetadata =
              metadataOccurrences && metadataOccurrences.length > 1;
            const hasExpectedErrorsMetadata = Boolean(metadataOccurrences);
            const needsUpdate = !arraysEqual(errorLines, existingExpectedLines);

            const shouldOfferFix =
              errorLines.length &&
              !fixProvided &&
              (needsUpdate || hasDuplicateMetadata || !hasExpectedErrorsMetadata);

            if (shouldOfferFix && lineMatch) {
              const lang = lineMatch[1];
              const metadata = `{expectedErrors: {'react-compiler': [${errorLines.join(
                ', '
              )}]}}`;
              const reactCompilerEntry = `'react-compiler': [${errorLines.join(
                ', '
              )}]`;

              let newLine;
              const objectSegment = extractObjectSegment(metaPortion);
              const hasObjectWithColon =
                objectSegment && /:/.test(objectSegment.object);

              if (hasObjectWithColon) {
                const {leading, object, rest} = objectSegment;
                const expectedErrorsRegex = /expectedErrors\s*:\s*\{[^}]*\}/;
                let updatedObject = object;

                const expectedMatch = object.match(expectedErrorsRegex);
                if (expectedMatch) {
                  const updatedExpected = updateExpectedErrorsBlock(
                    expectedMatch[0],
                    reactCompilerEntry
                  );
                  updatedObject = object.replace(
                    expectedMatch[0],
                    updatedExpected
                  );
                } else {
                  const objectWithoutBrace = object.slice(0, -1);
                  const hasContent = /\S/.test(objectWithoutBrace.replace('{', ''));
                  const insertion = hasContent
                    ? `, ${metadata.slice(1, -1)}`
                    : ` ${metadata.slice(1, -1)}`;
                  updatedObject = `${objectWithoutBrace}${insertion}}`;
                }

                let restMeta = rest;
                if (restMeta) {
                  restMeta = restMeta.replace(EXPECTED_ERRORS_BLOCK_REGEX, '');
                  if (/^\s{2,}/.test(restMeta)) {
                    restMeta = ` ${restMeta.trimStart()}`;
                  }
                }

                const combinedMeta = `${leading}${removeDuplicateExpectedErrorBlocks(
                  `${updatedObject}${restMeta || ''}`
                )}`;
                newLine = `\`\`\`${lang}${combinedMeta}`;
              } else {
                const metaLeading = metaPortion.match(/^\s*/)[0] || '';
                let restMeta = metaPortion.slice(metaLeading.length);
                if (restMeta) {
                  restMeta = restMeta.replace(EXPECTED_ERRORS_BLOCK_REGEX, '');
                  if (restMeta && !restMeta.startsWith(' ')) {
                    restMeta = ` ${restMeta.trimStart()}`;
                  }
                }
                const leadingSpace = metaLeading || ' ';
                newLine = `\`\`\`${lang}${leadingSpace}${metadata}${restMeta || ''}`;
              }

              const normalizedLine = removeDuplicateExpectedErrorBlocks(newLine);

              const startOfLine = lines
                .slice(0, codeBlockLineNum)
                .reduce((length, lineText) => length + lineText.length + 1, 0);
              const endOfLine = startOfLine + currentLine.length;

              const applyFix = (fixer) =>
                fixer.replaceTextRange([startOfLine, endOfLine], normalizedLine);

              fix = applyFix;
              suggestions = [
                {
                  desc: 'Add expectedErrors metadata to suppress these errors',
                  fix: applyFix,
                },
              ];
              fixProvided = true;
            }

            const reportData = {
              node,
              loc: {
                start: {
                  line: markdownLine,
                  column: location.startColumn,
                },
                end: {
                  line: markdownLine,
                  column: location.endColumn,
                },
              },
              message: `React Compiler error in code block: ${reason}`,
            };

            if (fix) {
              reportData.fix = fix;
            }

            if (suggestions) {
              reportData.suggest = suggestions;
            }

            context.report(reportData);
          }
        }
      },
    };
  },
};
