/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import React from 'react';
import {colors, fonts, darkModeColors} from 'theme';

import type {Node} from 'react';

const Header = ({children}: {children: Node}) => (
  <h1
    css={{
      color: colors.dark,
      marginRight: '5%',
      ...fonts.header,
      '.dark &': {
        color: darkModeColors.heading,
      },
    }}>
    {children}
  </h1>
);

export default Header;
