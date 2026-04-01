/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {sandpackThemeFonts} from './generatedTheme';

export const CustomTheme = {
  colors: {
    accent: 'inherit',
    base: 'inherit',
    clickable: 'inherit',
    disabled: 'inherit',
    error: 'inherit',
    errorSurface: 'inherit',
    hover: 'inherit',
    surface1: 'inherit',
    surface2: 'inherit',
    surface3: 'inherit',
    warning: 'inherit',
    warningSurface: 'inherit',
  },
  syntax: {
    plain: 'inherit',
    comment: 'inherit',
    keyword: 'inherit',
    tag: 'inherit',
    punctuation: 'inherit',
    definition: 'inherit',
    property: 'inherit',
    static: 'inherit',
    string: 'inherit',
  },
  font: {
    body: sandpackThemeFonts.body,
    mono: sandpackThemeFonts.mono,
    size: sandpackThemeFonts.size,
    lineHeight: '24px',
  },
};
