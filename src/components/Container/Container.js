/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the CC-BY-4.0 license found
 * in the LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 * @flow
 */

'use strict';

import React from 'react';

import {media} from 'theme';

import type {Node} from 'react';

/**
 * This component wraps page content sections (eg header, footer, main).
 * It provides consistent margin and max width behavior.
 */
const Container = ({children}: {children: Node}) => (
  <div
    css={{
      paddingLeft: 20,
      paddingRight: 20,
      marginLeft: 'auto',
      marginRight: 'auto',

      [media.greaterThan('medium')]: {
        width: '90%',
      },

      [media.size('xxlarge')]: {
        maxWidth: 1260,
      },
    }}>
    {children}
  </div>
);

export default Container;
