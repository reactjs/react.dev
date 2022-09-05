/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

const toHtml = require('hast-util-to-html');
const visit = require('unist-util-visit');

module.exports = function generateToc(options) {
  return function transformer(tree, vfile) {
    let toc = [];
    visit(tree, ['element', 'jsx'], (node) => {
      if (node.type === 'element') {
        if (node.tagName === 'h2' || node.tagName === 'h3') {
          const id = node.properties?.id;
          const depth = parseInt(node.tagName.charAt(1), 10);
          toc.push({url: '#' + id, depth, html: toHtml(node.children)});
        }
      } else if (node.type === 'jsx') {
        // This is a bit hacky. Match on the closing tag
        // because the opening tag could have attribute.
        if (node.value === '</Recap>') {
          toc.push({
            depth: 0,
            html: 'Recap',
            url: '#recap',
          });
        } else if (node.value === '</Challenges>') {
          toc.push({
            depth: 0,
            html: 'Challenges',
            url: '#challenges',
          });
        }
      }
    });
    if (toc.length > 0) {
      toc.unshift({
        depth: 1,
        html: 'Overview',
        url: '#',
      });
    }

    tree.children.push({
      type: 'export',
      value:
        'export const toc = [' +
        toc
          .map(
            (item) => `{
          url: ${JSON.stringify(item.url)},
          depth: ${JSON.stringify(item.depth)},
          jsx: <>${item.html}</>
        },`
          )
          .join('\n') +
        '];\n',
    });

    return tree;
  };
};
