/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 */

'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

// Import global styles
require('normalize.css');
require('./src/css/reset.css');
require('./src/prism-styles');
require('./src/css/algolia.css');

// Expose React and ReactDOM as globals for console playground
window.React = React;
window.ReactDOM = ReactDOM;

// A stub function is needed because gatsby won't load this file otherwise
// (https://github.com/gatsbyjs/gatsby/issues/6759)
exports.onClientEntry = () => {};
