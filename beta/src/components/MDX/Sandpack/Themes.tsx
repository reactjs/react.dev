/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import { githubLightTheme, codesandboxDarkTheme, SandpackTheme } from '@codesandbox/sandpack-react';
import tailwindConfig from '../../../../tailwind.config';

export const GithubLightTheme: SandpackTheme = {
  ...githubLightTheme,

  typography: {
    ...githubLightTheme.typography,
    bodyFont: tailwindConfig.theme.extend.fontFamily.sans.join(', '),
    monoFont: tailwindConfig.theme.extend.fontFamily.mono.join(', '),
    fontSize: tailwindConfig.theme.extend.fontSize.code,
    lineHeight: '24px',
  },
};

export const CodesandboxDarkTheme: SandpackTheme = {
  ...codesandboxDarkTheme,

  typography: {
    ...codesandboxDarkTheme.typography,
    bodyFont: tailwindConfig.theme.extend.fontFamily.sans.join(', '),
    monoFont: tailwindConfig.theme.extend.fontFamily.mono.join(', '),
    fontSize: tailwindConfig.theme.extend.fontSize.code,
    lineHeight: '24px',
  },
};

export const CodeBlockLightTheme: SandpackTheme = {
  ...githubLightTheme,
  palette: {
    ...githubLightTheme.palette,
    defaultBackground: 'transparent',
  },
  typography: {
    ...githubLightTheme.typography,
    bodyFont: tailwindConfig.theme.extend.fontFamily.sans.join(', '),
    monoFont: tailwindConfig.theme.extend.fontFamily.mono.join(', '),
    fontSize: tailwindConfig.theme.extend.fontSize.code,
    lineHeight: '24px',
  },
};

export const CodeBlockDarkTheme: SandpackTheme = {
  ...codesandboxDarkTheme,
  palette: {
    ...codesandboxDarkTheme.palette,
    defaultBackground: 'transparent',
  },
  typography: {
    ...codesandboxDarkTheme.typography,
    bodyFont: tailwindConfig.theme.extend.fontFamily.sans.join(', '),
    monoFont: tailwindConfig.theme.extend.fontFamily.mono.join(', '),
    fontSize: tailwindConfig.theme.extend.fontSize.code,
    lineHeight: '24px',
  },
};