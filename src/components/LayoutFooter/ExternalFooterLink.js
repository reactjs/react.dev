/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import React from 'react';
import {colors} from 'theme';
import ExternalLinkSvg from 'templates/components/ExternalLinkSvg';

import type {Node} from 'react';

type Props = {
  children: Node,
  href: string,
  target?: string,
  rel?: string,
};

const ExternalFooterLink = ({children, href, target, rel}: Props) => (
  <a
    css={{
      lineHeight: 2,
      ':hover': {
        color: colors.brand,
      },
    }}
    href={href}
    target={target}
    rel={rel}>
    {children}
    <ExternalLinkSvg
      cssProps={{
        verticalAlign: -2,
        display: 'inline-block',
        marginLeft: 5,
        color: colors.subtle,
      }}
    />
  </a>
);

export default ExternalFooterLink;
