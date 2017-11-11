/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

'use strict';

const {join, resolve} = require('path');
const webpack = require('webpack');

module.exports = ({config, stage}) => {
  // See https://github.com/FormidableLabs/react-live/issues/5
  config.plugin('ignore', () => new webpack.IgnorePlugin(/^(xor|props)$/));

  config.merge({
    resolve: {
      root: resolve(__dirname, '../src'),
      extensions: ['', '.js', '.jsx', '.json'],
      alias: {
        // TODO Remove this alias (and the one below) after plug-in release.
        'gatsby-plugin-crowdin': join(__dirname, '../plugins/gatsby-plugin-crowdin'),
      },
    },
  });
  return config;
};