const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {ESLint} = require('eslint');
const plugin = require('..');

const FIXTURES_DIR = path.join(
  __dirname,
  'fixtures',
  'src',
  'content'
);

function createESLint({fix = false} = {}) {
  return new ESLint({
    useEslintrc: false,
    fix,
    plugins: {
      'local-rules': plugin,
    },
    overrideConfig: {
      processor: 'local-rules/markdown',
      plugins: ['local-rules'],
      rules: {
        'local-rules/lint-markdown-code-blocks': 'error',
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
  });
}

function readFixture(name) {
  return fs.readFileSync(path.join(FIXTURES_DIR, name), 'utf8');
}

async function lintFixture(name, {fix = false} = {}) {
  const eslint = createESLint({fix});
  const filePath = path.join(FIXTURES_DIR, name);
  const markdown = readFixture(name);
  const [result] = await eslint.lintText(markdown, {filePath});
  return result;
}

async function run() {
  const basicResult = await lintFixture('basic-error.md');
  assert.strictEqual(
    basicResult.messages.length,
    1,
    'expected one diagnostic'
  );
  assert(
    basicResult.messages[0].message.includes('Calling setState during render'),
    'expected message to mention setState during render'
  );

  const suppressedResult = await lintFixture('suppressed-error.md');
  assert.strictEqual(
    suppressedResult.messages.length,
    0,
    'expected suppression metadata to silence diagnostic'
  );

  const staleResult = await lintFixture('stale-expected-error.md');
  assert.strictEqual(
    staleResult.messages.length,
    1,
    'expected stale metadata error'
  );
  assert.strictEqual(
    staleResult.messages[0].message,
    'React Compiler expected error on line 3 was not triggered'
  );

  const duplicateResult = await lintFixture('duplicate-metadata.md');
  assert.strictEqual(
    duplicateResult.messages.length,
    2,
    'expected duplicate metadata to surface compiler diagnostic and stale metadata notice'
  );
  const duplicateFixed = await lintFixture('duplicate-metadata.md', {
    fix: true,
  });
  assert(
    duplicateFixed.output.includes(
      "{expectedErrors: {'react-compiler': [4]}}"
    ),
    'expected duplicates to be rewritten to a single canonical block'
  );
  assert(
    !duplicateFixed.output.includes('[99]'),
    'expected stale line numbers to be removed from metadata'
  );

  const mixedLanguageResult = await lintFixture('mixed-language.md');
  assert.strictEqual(
    mixedLanguageResult.messages.length,
    0,
    'expected non-js code fences to be ignored'
  );

  const malformedResult = await lintFixture('malformed-metadata.md');
  assert.strictEqual(
    malformedResult.messages.length,
    1,
    'expected malformed metadata to fall back to compiler diagnostics'
  );
  const malformedFixed = await lintFixture('malformed-metadata.md', {
    fix: true,
  });
  assert(
    malformedFixed.output.includes(
      "{expectedErrors: {'react-compiler': [4]}}"
    ),
    'expected malformed metadata to be replaced with canonical form'
  );
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
