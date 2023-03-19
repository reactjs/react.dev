/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
      features: {
        'custom-properties': false,
      },
    },
  },
}
