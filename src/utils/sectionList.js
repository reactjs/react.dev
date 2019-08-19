/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import navCommunity from 'content/community/nav.yml';
import navDocs from 'content/docs/nav.yml';
import navTutorial from 'content/tutorial/nav.yml';

const sectionListDocs = navDocs.map(
  (item): Object => ({
    ...item,
    directory: 'docs',
  }),
);

const sectionListCommunity = navCommunity.map(
  (item): Object => ({
    ...item,
    directory: 'community',
  }),
);

export {
  sectionListCommunity,
  sectionListDocs,
  navTutorial as sectionListTutorial,
};
