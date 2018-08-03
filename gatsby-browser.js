/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

'use strict';

// Import global styles
require('normalize.css');
require('./src/css/reset.css');
require('./src/prism-styles');
require('./src/css/algolia.css');

// A stub function is needed because gatsby won't load this file otherwise
// (https://github.com/gatsbyjs/gatsby/issues/6759)
exports.onClientEntry = () => {};
