/*!
 * Based on 'silvenon/remark-smartypants'
 * https://github.com/silvenon/remark-smartypants/pull/80
 */

const visit = require('unist-util-visit');
const retext = require('retext');
const smartypants = require('retext-smartypants');

function check(parent) {
  if (parent.tagName === 'script') return false;
  if (parent.tagName === 'style') return false;
  return true;
}

module.exports = function (options) {
  const processor = retext().use(smartypants, {
    ...options,
    // Do not replace ellipses, dashes, backticks because they change string
    // length, and we couldn't guarantee right splice of text in second visit of
    // tree
    ellipses: false,
    dashes: false,
    backticks: false,
  });

  const processor2 = retext().use(smartypants, {
    ...options,
    // Do not replace quotes because they are already replaced in the first
    // processor
    quotes: false,
  });

  function transformer(tree) {
    let allText = '';
    let startIndex = 0;
    const textOrInlineCodeNodes = [];

    visit(tree, ['text', 'inlineCode'], (node, _, parent) => {
      if (check(parent)) {
        if (node.type === 'text') allText += node.value;
        // for the case when inlineCode contains just one part of quote: `foo'bar`
        else allText += 'A'.repeat(node.value.length);
        textOrInlineCodeNodes.push(node);
      }
    });

    // Concat all text into one string, to properly replace quotes around non-"text" nodes
    allText = String(processor.processSync(allText));

    for (const node of textOrInlineCodeNodes) {
      const endIndex = startIndex + node.value.length;
      if (node.type === 'text') {
        const processedText = allText.slice(startIndex, endIndex);
        node.value = String(processor2.processSync(processedText));
      }
      startIndex = endIndex;
    }
  }

  return transformer;
};
