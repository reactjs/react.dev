/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

'use strict';

const {
  getLanguageCodeFromPath,
  getLanguageFromLanguageAndRegion,
} = require('./utils');

/** Params
{
  node: {
    id: "...",
    children: [],
    parent: "...",
    internal: {
      content: "...",
      contentDigest: "0351d452c1fabfe0eaec3faa9a60cde3",
      type: "MarkdownRemark",
      owner: "gatsby-transformer-remark"
    },
    frontmatter: {
      title: "...",
      order: 1,
      parent: "/path/to/parent/file/file.md"
    },
    fileAbsolutePath: "/path/to/file.md"
  }
}
 */
module.exports = exports.onCreateNode = ({
  node,
  boundActionCreators,
  getNode,
}) => {
  const {createNodeField} = boundActionCreators;

  switch (node.internal.type) {
    case 'MarkdownRemark':
      // Parent node is owned by the 'gatsby-source-filesystem' plug-in
      const {relativePath, sourceInstanceName} = getNode(node.parent);

      // We only need to attribute language metadata for "translated" sources
      if (sourceInstanceName === 'translated') {
        const languageCode = getLanguageCodeFromPath(relativePath);
        const language = getLanguageFromLanguageAndRegion(languageCode);

        createNodeField({
          node,
          name: 'language',
          value: language,
        });

        createNodeField({
          node,
          name: 'languageCode',
          value: languageCode,
        });
      }
      return;
  }
};
