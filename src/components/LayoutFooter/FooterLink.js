/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

'use strict';

import Link from 'gatsby-link';
import React from 'react';
import {colors} from 'theme';

const FooterLink = ({children, target, to}) => (
  <Link
    css={{
      lineHeight: 2,
      ':hover': {
        color: colors.brand,
      },
    }}
    to={to}
    target={target}>
    {children}
  </Link>
);

export default FooterLink;
