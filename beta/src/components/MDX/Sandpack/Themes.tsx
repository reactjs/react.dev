/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import tailwindConfig from '../../../../tailwind.config';

export const CustomTheme = {
  palette: {
    activeText: 'var(--theme-activeText)',
    defaultText: 'var(--theme-defaultText)',
    inactiveText: 'var(--theme-inactiveText)',
    activeBackground: 'var(--theme-activeBackground)',
    defaultBackground: 'var(--theme-defaultBackground)',
    inputBackground: 'var(--theme-inputBackground)',
    accent: 'var(--theme-accent)',
    errorBackground: 'var(--theme-errorBackground)',
    errorForeground: 'var(--theme-errorForeground)',
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
