/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const lintMarkdownCodeBlocks = require('./rules/lint-markdown-code-blocks');

module.exports = {
  rules: {
    'lint-markdown-code-blocks': lintMarkdownCodeBlocks,
  },
};
