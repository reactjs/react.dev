const visit = require('unist-util-visit');

// TODO Copy this helper method into a shared util
const getLanguageCodeFromPath = path => {
  const match = path.match(/^([a-z]{2}|[a-z]{2}-[A-Z]+)\//);

  return match ? match[1] : null;
};

module.exports = (
  {markdownAST, markdownNode, getNode},
  {defaultLanguageCode, defaultSourceName, translationsSourceName},
) => {
  const parentNode = getNode(markdownNode.parent);
  const {relativePath, sourceInstanceName} = parentNode;

  let languageCode = null;

  switch (sourceInstanceName) {
    case defaultSourceName:
      languageCode = defaultLanguageCode;
      break;
    case translationsSourceName:
      languageCode = getLanguageCodeFromPath(relativePath);
      break;
  }

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
