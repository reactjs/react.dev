#!/usr/bin/env node

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Generates llms.txt and llms-full.txt for react.dev
 * Following spec: https://llmstxt.org/
 *
 * Usage:
 *   yarn llms                    # Generate both files manually
 *   yarn build                   # Automatically runs during build
 *
 * The files are generated from:
 *   - Sidebar configs: src/sidebarLearn.json, src/sidebarReference.json
 *   - Markdown content: src/content directory
 *
 * Output:
 *   - public/llms.txt (simple format with links)
 *   - public/llms-full.txt (full embedded content)
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const BASE_URL = 'https://react.dev';
const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Read sidebar configs
const sidebars = {
  learn: require(path.join(process.cwd(), 'src/sidebarLearn.json')),
  reference: require(path.join(process.cwd(), 'src/sidebarReference.json')),
  // community and blog are less critical for LLMs
};

/**
 * Extract frontmatter from markdown file
 */
function getMarkdownContent(filePath) {
  try {
    const fullPath = path.join(CONTENT_DIR, filePath);
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const {data, content} = matter(fileContent);
    return {frontmatter: data, content, raw: fileContent};
  } catch (err) {
    console.warn(`Could not read ${filePath}:`, err.message);
    return null;
  }
}

/**
 * Convert sidebar path to file path
 */
function pathToFile(urlPath) {
  // /learn -> learn/index.md
  // /learn/hooks -> learn/hooks.md
  const parts = urlPath.split('/').filter(Boolean);

  if (parts.length === 1) {
    return `${parts[0]}/index.md`;
  }

  return `${parts.join('/')}.md`;
}

/**
 * Recursively process routes from sidebar config
 */
function processRoutes(routes, indent = 0, output = [], fullOutput = []) {
  for (const route of routes) {
    // Skip section headers
    if (route.hasSectionHeader) continue;

    const {title, path: urlPath, routes: children} = route;

    if (urlPath) {
      const filePath = pathToFile(urlPath);
      const mdContent = getMarkdownContent(filePath);

      if (mdContent) {
        const {frontmatter, content} = mdContent;
        const description = frontmatter.description || '';

        // For llms.txt (simple format)
        const prefix = '  '.repeat(indent);
        const link = `[${title}](${BASE_URL}${urlPath})`;
        const line = description
          ? `${prefix}- ${link}: ${description}`
          : `${prefix}- ${link}`;
        output.push(line);

        // For llms-full.txt (embedded content)
        fullOutput.push('---');
        fullOutput.push(`title: "${title}"`);
        if (description) {
          fullOutput.push(`description: "${description}"`);
        }
        fullOutput.push(`url: "${BASE_URL}${urlPath}"`);
        fullOutput.push('---');
        fullOutput.push('');
        fullOutput.push(content.trim());
        fullOutput.push('');
      }
    }

    // Process children
    if (children && children.length > 0) {
      processRoutes(children, indent + 1, output, fullOutput);
    }
  }

  return {output, fullOutput};
}

/**
 * Generate llms.txt (simple format)
 */
function generateSimple() {
  const lines = ['# React'];
  lines.push('');
  lines.push('> The library for web and native user interfaces');
  lines.push('');

  // Learn section
  lines.push('## Learn React');
  lines.push('');
  const learnResult = processRoutes(sidebars.learn.routes || [], 0, [], []);
  lines.push(...learnResult.output);
  lines.push('');

  // Reference section
  lines.push('## API Reference');
  lines.push('');
  const refResult = processRoutes(sidebars.reference.routes || [], 0, [], []);
  lines.push(...refResult.output);

  return lines.join('\n');
}

/**
 * Generate llms-full.txt (embedded content)
 */
function generateFull() {
  const lines = ['# React Documentation'];
  lines.push('');
  lines.push('> The library for web and native user interfaces');
  lines.push('');

  const allContent = [];

  // Learn section
  const learnResult = processRoutes(sidebars.learn.routes || [], 0, [], []);
  allContent.push(...learnResult.fullOutput);

  // Reference section
  const refResult = processRoutes(sidebars.reference.routes || [], 0, [], []);
  allContent.push(...refResult.fullOutput);

  lines.push(...allContent);

  return lines.join('\n');
}

/**
 * Main
 */
function main() {
  console.log('Generating llms.txt...');
  const simpleContent = generateSimple();
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), simpleContent);
  console.log(
    `✓ Generated llms.txt (${(simpleContent.length / 1024).toFixed(1)}KB)`
  );

  console.log('Generating llms-full.txt...');
  const fullContent = generateFull();
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), fullContent);
  console.log(
    `✓ Generated llms-full.txt (${(fullContent.length / 1024).toFixed(1)}KB)`
  );
}

if (require.main === module) {
  main();
}
