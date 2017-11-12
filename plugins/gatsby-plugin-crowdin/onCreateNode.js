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

module.exports = exports.onCreateNode = ({
  node,
  boundActionCreators,
  getNode,
}) => {
  const {createNodeField} = boundActionCreators;

  switch (node.internal.type) {
    case 'MarkdownRemark':
      const {relativePath} = getNode(node.parent);

      const languageCode = getLanguageCodeFromPath(relativePath);

      if (languageCode !== null) {
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
