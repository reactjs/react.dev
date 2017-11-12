const visit = require('unist-util-visit');
const {getLanguageCodeFromPath} = require('./utils');

// This file "localizes" static markdown links during build-time
// eg /path/to/file.html => /zh-CN/path/to/file.html
// This is so Gatbsy will prefetch the correct language content
module.exports = ({markdownAST, markdownNode, getNode}, pluginOptions) => {
  const parentNode = getNode(markdownNode.parent);
  const {relativePath} = parentNode;

  let languageCode = getLanguageCodeFromPath(relativePath);

  // Only convert links for pages that contain language codes.
  // TODO Does this upport linking from a Markdown page to a JavaScript page?
  // Or will it incorrectly try to localize the static page?
  if (languageCode !== null) {
    visit(markdownAST, `link`, node => {
      // Only prepand language code before root URLs (eg /path/to/file.html)
      // Ignore relative links (eg file.html)
      // And links to other domains (eg www.google.com)
      if (node.url.startsWith('/')) {
        node.url = `/${languageCode}${node.url}`;
      }
    });
  }
};
