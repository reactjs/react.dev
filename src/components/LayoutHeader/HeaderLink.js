/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import {Link} from 'gatsby';
import React from 'react';
import {colors, media} from 'theme';

type Props = {
  isActive: boolean,
  title: string,
  to: string,
};

const HeaderLink = ({isActive, title, to}: Props) => (
  <Link css={[style, isActive && activeStyle]} to={to}>
    {title}
    {isActive && <span css={activeAfterStyle} />}
  </Link>
);

const style = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  color: colors.white,
  transition: 'color 0.2s ease-out',
  padding: '0 15px',
  fontWeight: 300,
  minHeight: 60,
  [media.between('small', 'large')]: {
    minHeight: 50,
  },
  [media.lessThan('small')]: {
    minHeight: 40,
  },

  ':focus': {
    outline: 0,
    backgroundColor: colors.lighter,
    color: colors.white,
  },

  [media.size('xsmall')]: {
    padding: '0 8px',
    fontSize: 14,
  },

  [media.between('small', 'medium')]: {
    padding: '0 10px',
  },

  [media.greaterThan('xlarge')]: {
    padding: '0 20px',
    fontSize: 18,

    ':hover:not(:focus)': {
      color: colors.brand,
    },
  },
};

const activeStyle = {
  color: colors.brand,

  [media.greaterThan('small')]: {
    position: 'relative',
  },
};

const activeAfterStyle = {
  [media.greaterThan('small')]: {
    position: 'absolute',
    bottom: -1,
    height: 4,
    background: colors.brand,
    left: 0,
    right: 0,
    zIndex: 1,
  },
};

export default HeaderLink;
