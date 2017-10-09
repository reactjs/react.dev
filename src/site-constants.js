/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule site-constants
 * @flow
 */

'use strict';

// NOTE: We can't just use `location.toString()` because when we are rendering
// the SSR part in node.js we won't have a proper location.
const urlRoot = 'https://reactjs.org';
const version = '16.0.0';
const babelURL = '//unpkg.com/babel-standalone@6.26.0/babel.min.js';
const algoliaURL = '//unpkg.com/docsearch.js@2.4.1/dist/cdn/docsearch.min.js';

export {urlRoot, version, babelURL, algoliaURL};
