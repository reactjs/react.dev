/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import tailwindConfig from '../../../../tailwind.config';

export const CustomTheme = {
  palette: {
    activeText: 'inherit',
    defaultText: 'inherit',
    inactiveText: 'inherit',
    activeBackground: 'inherit',
    defaultBackground: 'inherit',
    inputBackground: 'inherit',
    accent: 'inherit',
    errorBackground: 'inherit',
    errorForeground: 'inherit',
  },
  syntax: {
    plain: 'var(--theme-plain)',
    comment: 'var(--theme-comment)',
    keyword: 'var(--theme-keyword)',
    tag: 'var(--theme-tag)',
    punctuation: 'var(--theme-punctuation)',
    definition: 'var(--theme-definition)',
    property: 'var(--theme-property)',
    static: 'var(--theme-static)',
    string: 'var(--theme-string)',
  },
  typography: {
    bodyFont: tailwindConfig.theme.extend.fontFamily.sans.join(', '),
    monoFont: tailwindConfig.theme.extend.fontFamily.mono.join(', '),
    fontSize: tailwindConfig.theme.extend.fontSize.code,
    lineHeight: '24px',
  },
};
