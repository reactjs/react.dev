/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */
exports.siteConfig = {
  version: '19.1',
  // --------------------------------------
  // Translations should replace these lines:
  languageCode: 'en',
  hasLegacySite: true,
  isRTL: false,
  // --------------------------------------
  copyright: `Copyright © ${new Date().getFullYear()} Facebook Inc. All Rights Reserved.`,
  repoUrl: 'https://github.com/facebook/react',
  twitterUrl: 'https://twitter.com/reactjs',
  algolia: {
    appId: '1FCF9AYYAT',
    apiKey: '1b7ad4e1c89e645e351e59d40544eda1',
    indexName: 'beta-react',
  },
};
