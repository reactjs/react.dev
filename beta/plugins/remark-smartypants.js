const visit = require('unist-util-visit');
const retext = require('retext');
const smartypants = require('retext-smartypants');

function check(parent) {
  if (parent.tagName === 'script') return false;
  if (parent.tagName === 'style') return false;
  return true;
}

module.exports = function (options) {
  const processor = retext().use(smartypants, options);

  function transformer(tree) {
    visit(tree, 'text', (node, index, parent) => {
      if (check(parent)) node.value = String(processor.processSync(node.value));
    });
  }

  return transformer;
};
