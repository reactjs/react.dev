/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const remark = require('remark');
const externalLinks = require('remark-external-links'); // Add _target and rel to external links
const customHeaders = require('./remark-header-custom-ids'); // Custom header id's for i18n
const images = require('remark-images'); // Improved image syntax
const unrwapImages = require('remark-unwrap-images'); // Removes <p> wrapper around images
const smartyPants = require('./remark-smartypants'); // Cleans up typography
const html = require('remark-html');

module.exports = {
  remarkPlugins: [
    externalLinks,
    customHeaders,
    images,
    unrwapImages,
    smartyPants,
  ],
  markdownToHtml,
};

async function markdownToHtml(markdown) {
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
