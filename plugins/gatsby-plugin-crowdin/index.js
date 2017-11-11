const visit = require('unist-util-visit');
const {getLanguageCodeFromPath} = require('./utils');

module.exports = (
  {markdownAST, markdownNode, getNode},
  {defaultLanguageCode},
) => {
  const parentNode = getNode(markdownNode.parent);
  const {relativePath} = parentNode;

  let languageCode = getLanguageCodeFromPath(relativePath);

  if (languageCode !== null) {
    // Prepand language code before links with absolute URLs,
    // eg '/path/to/file.html' => '/en/path/to/file.js'
    visit(markdownAST, `link`, node => {
      if (node.url.startsWith('/')) {
        node.url = `/${languageCode}${node.url}`;
      }
    });
  }
};
