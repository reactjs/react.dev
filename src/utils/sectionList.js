/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

'use strict';

import navCommunity from '../../content/community/nav.yml';
import navDocs from '../../content/docs/nav.yml';
import navTutorial from '../../content/tutorial/nav.yml';
import navAPI from '../../content/api/nav.yml';

const sectionListDocs = navDocs.map(item => ({
  ...item,
  directory: 'docs',
}));

const sectionListCommunity = navCommunity.map(item => ({
  ...item,
  directory: 'community',
}));

const sectionListAPI = navAPI.map(item => ({
  ...item,
  directory: 'api',
}));

export {
  sectionListCommunity,
  sectionListDocs,
  sectionListAPI,
  navTutorial as sectionListTutorial,
};
