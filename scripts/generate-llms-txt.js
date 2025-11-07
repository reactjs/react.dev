#!/usr/bin/env node

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Generates llms.txt for react.dev
 * Following spec: https://llmstxt.org/
 *
 * Usage:
 *   yarn llms                    # Generate manually
 *   yarn build                   # Automatically runs during build
 *
 * The file is generated from:
 *   - Sidebar configs: src/sidebarLearn.json, src/sidebarReference.json
 *   - Markdown content: src/content directory
 *
 * Output:
 *   - public/llms.txt (format with links and descriptions)
 */

const {generateLlmsTxt} = require('../src/utils/llms');

generateLlmsTxt();
