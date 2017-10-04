/**
 * Copyright 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails react-core
*/

'use strict';

import navCommunity from '../../content/community/nav.yml';
import navDocs from '../../content/docs/nav.yml';
import navTutorial from '../../content/tutorial/nav.yml';

const sectionListDocs = navDocs.map(item => ({
  ...item,
  directory: 'docs',
}));

const sectionListCommunity = navCommunity.map(item => ({
  ...item,
  directory: 'community',
}));

export {
  sectionListCommunity,
  sectionListDocs,
  navTutorial as sectionListTutorial,
};
