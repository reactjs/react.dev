/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

// $FlowExpectedError
import navCommunity from '../../content/community/nav.yml';
// $FlowExpectedError
import navDocs from '../../content/docs/nav.yml';
// $FlowExpectedError
import navTutorial from '../../content/tutorial/nav.yml';

const sectionListDocs = navDocs.map((item: Object): Object => ({
  ...item,
  directory: 'docs',
}));

const sectionListCommunity = navCommunity.map((item: Object): Object => ({
  ...item,
  directory: 'community',
}));

export {
  sectionListCommunity,
  sectionListDocs,
  navTutorial as sectionListTutorial,
};
