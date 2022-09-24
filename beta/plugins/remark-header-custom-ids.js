/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

/*!
 * Based on 'gatsby-remark-autolink-headers'
 * Original Author: Kyle Mathews <mathews.kyle@gmail.com>
 * Updated by Jared Palmer;
 * Copyright (c) 2015 Gatsbyjs
 */

const toString = require('mdast-util-to-string');
const visit = require('unist-util-visit');
const slugs = require('github-slugger')();

function patch(context, key, value) {
  if (!context[key]) {
    context[key] = value;
  }
  return context[key];
}

const svgIcon = `<svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`;

module.exports = ({
  icon = svgIcon,
  className = `anchor`,
  maintainCase = false,
} = {}) => {
  slugs.reset();
  return function transformer(tree) {
    visit(tree, 'heading', (node) => {
      const children = node.children;
      let tail = children[children.length - 1];
      // Generate slugs on the fly (even if not specified in markdown)
      // so that it's possible to copy anchor links in newly written content.
      let id = slugs.slug(toString(node), maintainCase);
      // However, for committed docs, we'll extract slug from the headers.
      if (tail && tail.type === 'text' && tail.value === '/}') {
        tail = children[children.length - 2];
        if (tail && tail.type === 'emphasis') {
          // Use custom ID instead.
          id = toString(tail);
        }
      }

      const data = patch(node, 'data', {});

      patch(data, 'id', id);
      patch(data, 'htmlAttributes', {});
      patch(data, 'hProperties', {});
      patch(data.htmlAttributes, 'id', id);
      patch(data.hProperties, 'id', id);
    });
  };
};
