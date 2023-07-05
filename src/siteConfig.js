/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

const siteConfig = {
  // --------------------------------------
  // Translations should replace these lines:
  languageCode: 'en',
  hasLegacySite: true,
  isRTL: false, // Do NOT ever set this to true. It is deprecated.
  // --------------------------------------
  copyright: `Copyright © ${new Date().getFullYear()} Facebook Inc. All Rights Reserved.`,
  repoUrl: 'https://github.com/facebook/react',
  twitterUrl: 'https://twitter.com/reactjs',
  algolia: {
    appId: '1FCF9AYYAT',
    apiKey: 'e8451218980a351815563de007648b00',
    indexName: 'beta-react',
  },
};

const rtlDetect = require('rtl-detect');
siteConfig.isRTL = rtlDetect.isRtlLang(siteConfig.languageCode);

exports.siteConfig = siteConfig;
