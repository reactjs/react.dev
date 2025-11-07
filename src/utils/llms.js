/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const BASE_URL = 'https://react.dev';
const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

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
function processRoutes(routes, indent = 0, output = []) {
  for (const route of routes) {
    // Skip section headers
    if (route.hasSectionHeader) continue;

    const {title, path: urlPath, routes: children} = route;

    if (urlPath) {
      const filePath = pathToFile(urlPath);
      const mdContent = getMarkdownContent(filePath);

      if (mdContent) {
        const {frontmatter} = mdContent;
        const description = frontmatter.description || '';

        // For llms.txt
        const prefix = '  '.repeat(indent);
        const link = `[${title}](${BASE_URL}${urlPath})`;
        const line = description
          ? `${prefix}- ${link}: ${description}`
          : `${prefix}- ${link}`;
        output.push(line);
      }
    }

    // Process children
    if (children && children.length > 0) {
      processRoutes(children, indent + 1, output);
    }
  }

  return output;
}

/**
 * Generate llms.txt content
 */
function generate(sidebars) {
  const lines = ['# React'];
  lines.push('');
  lines.push('> The library for web and native user interfaces');
  lines.push('');

  // Learn section
  lines.push('## Learn React');
  lines.push('');
  const learnResult = processRoutes(sidebars.learn.routes || [], 0, []);
  lines.push(...learnResult);
  lines.push('');

  // Reference section
  lines.push('## API Reference');
  lines.push('');
  const refResult = processRoutes(sidebars.reference.routes || [], 0, []);
  lines.push(...refResult);

  return lines.join('\n');
}

/**
 * Generate llms.txt file
 */
exports.generateLlmsTxt = function () {
  console.log('Generating llms.txt...');

  // Read sidebar configs
  const sidebars = {
    learn: require(path.join(process.cwd(), 'src/sidebarLearn.json')),
    reference: require(path.join(process.cwd(), 'src/sidebarReference.json')),
    // community and blog are less critical for LLMs
  };

  const content = generate(sidebars);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), content);
  console.log(`✓ Generated llms.txt (${(content.length / 1024).toFixed(1)}KB)`);
};
