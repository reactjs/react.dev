/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import React from 'react';
import {media} from 'theme';

import type {Node} from 'react';

type Props = {
  children: Node,
  title?: string,
  layoutHasSidebar: boolean,
};

const FooterNav = ({children, title, layoutHasSidebar = false}: Props) => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '50%',
      paddingTop: 40,

      [media.size('sidebarFixed')]: {
        paddingTop: 0,
        width: '25%',
      },
    }}>
    <div
      css={{
        display: 'inline-flex',
        flexDirection: 'column',
      }}>
      {children}
    </div>
  </div>
);

export default FooterNav;
