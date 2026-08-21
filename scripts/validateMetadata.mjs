/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appDir = path.join(root, '.next', 'server', 'app');

function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

function getHead(html) {
  const end = html.indexOf('</head>');
  return end === -1 ? '' : html.slice(0, end + 7);
}

function getAttribute(tag, name) {
  return tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];
}

const pages = walk(appDir).filter(
  (file) =>
    file.endsWith('.html') &&
    !file.includes('[') &&
    !file.endsWith('_global-error.html')
);
const errors = [];

if (!fs.existsSync(path.join(root, 'public', 'rss.xml'))) {
  errors.push('public/rss.xml: missing generated RSS feed');
}

for (const file of pages) {
  const head = getHead(fs.readFileSync(file, 'utf8'));
  const relative = path.relative(appDir, file);
  const title = head.match(/<title>([^<]*)<\/title>/)?.[1];

  if (!title || title === ' – React') {
    errors.push(`${relative}: missing page title`);
  }

  if (file.endsWith('_not-found.html')) {
    if (!head.includes('<meta name="robots" content="noindex"')) {
      errors.push(`${relative}: missing noindex metadata`);
    }
  }

  const required = [
    'rel="canonical"',
    'hrefLang="x-default"',
    'property="og:title"',
    'property="og:url"',
    'property="og:image"',
    'name="twitter:card"',
    'name="twitter:title"',
    'name="twitter:image"',
  ];
  for (const marker of required) {
    if (!head.includes(marker)) {
      errors.push(`${relative}: missing ${marker}`);
    }
  }

  if (
    relative === 'index.html' &&
    !head.includes('<link rel="canonical" href="https://react.dev/"')
  ) {
    errors.push(
      `${relative}: homepage canonical URL is missing trailing slash`
    );
  }

  if (
    file.endsWith('_not-found.html') &&
    !head.includes(
      '<meta property="og:image" content="https://react.dev/images/og-unknown.png"'
    )
  ) {
    errors.push(`${relative}: incorrect not-found OG image`);
  }

  const ogImageTag = head.match(/<meta property="og:image"[^>]*>/)?.[0];
  const ogImage = ogImageTag && getAttribute(ogImageTag, 'content');
  if (ogImage) {
    const imagePath = path.join(root, 'public', new URL(ogImage).pathname);
    if (!fs.existsSync(imagePath)) {
      errors.push(`${relative}: missing OG image ${ogImage}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated metadata for ${pages.length} prerendered pages.`);
