/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import remarkGfm from 'remark-gfm';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const remark = require('remark');
const externalLinks = require('remark-external-links'); // Add _target and rel to external links
const customHeaders = require('./remark-header-custom-ids'); // Custom header id's for i18n
const images = require('remark-images'); // Improved image syntax
const unrwapImages = require('remark-unwrap-images'); // Removes <p> wrapper around images
const smartyPants = require('./remark-smartypants'); // Cleans up typography
const html = require('remark-html');

export const remarkPlugins = [
  remarkGfm,
  externalLinks,
  customHeaders,
  images,
  unrwapImages,
  smartyPants,
];

export async function markdownToHtml(markdown) {
  const result = await remark()
    .use(externalLinks)
    .use(customHeaders)
    .use(images)
    .use(unrwapImages)
    .use(smartyPants)
    .use(html)
    .process(markdown);
  return result.toString();
}
