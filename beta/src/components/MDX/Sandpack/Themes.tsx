/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {
  codesandboxDarkTheme,
  codesandboxLightTheme,
  SandpackTheme,
} from '@codesandbox/sandpack-react';
import tailwindConfig from '../../../../tailwind.config';

export const GithubLightTheme: SandpackTheme = {
  ...codesandboxLightTheme,
  palette: {
    activeText: '#24292e',
    defaultText: '#959da5',
    inactiveText: '#e4e7eb',
    activeBackground: '#e4e7eb',
    defaultBackground: '#ffffff',
    inputBackground: '#ffffff',
    accent: '#c8c8fa',
    errorBackground: '#ffcdca',
    errorForeground: '#811e18',
  },
  typography: {
    ...codesandboxLightTheme.typography,
    bodyFont: tailwindConfig.theme.extend.fontFamily.sans.join(', '),
    monoFont: tailwindConfig.theme.extend.fontFamily.mono.join(', '),
    fontSize: tailwindConfig.theme.extend.fontSize.code,
    lineHeight: '24px',
  },
};

export const NightOwlTheme: SandpackTheme = {
  ...codesandboxDarkTheme,
  palette: {
    activeText: '#FFFFFF',
    defaultText: '#999999',
    inactiveText: '#343434',
    activeBackground: '#343434',
    defaultBackground: '#16181D',
    inputBackground: '#242424',
    accent: '#6caedd',
    errorBackground: '#ffcdca',
    errorForeground: '#811e18',
  },
  typography: {
    ...codesandboxDarkTheme.typography,
    bodyFont: tailwindConfig.theme.extend.fontFamily.sans.join(', '),
    monoFont: tailwindConfig.theme.extend.fontFamily.mono.join(', '),
    fontSize: tailwindConfig.theme.extend.fontSize.code,
    lineHeight: '24px',
  },
};

export const CodeBlockLightTheme: SandpackTheme = {
  ...codesandboxLightTheme,
  palette: {
    ...codesandboxLightTheme.palette,
    defaultBackground: 'transparent',
  },
  typography: {
    ...codesandboxLightTheme.typography,
    bodyFont: tailwindConfig.theme.extend.fontFamily.sans.join(', '),
    monoFont: tailwindConfig.theme.extend.fontFamily.mono.join(', '),
    fontSize: tailwindConfig.theme.extend.fontSize.code,
    lineHeight: '24px',
  },
};
