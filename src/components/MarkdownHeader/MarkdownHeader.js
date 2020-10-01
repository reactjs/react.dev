/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import Flex from 'components/Flex';
// $FlowFixMe Update Flow
import React from 'react';
import {colors, fonts, media} from 'theme';

const MarkdownHeader = ({title}: {title: string}) => {
  return (
    <Flex type="header" halign="space-between" valign="baseline">
      <h1
        css={{
          color: colors.dark,
          marginBottom: 0,
          marginTop: 'calc(40px + var(--banner-height-normal))',
          ...fonts.header,

          [media.lessThan('small')]: {
            marginTop: 'calc(40px + var(--banner-height-small))',
          },

          [media.size('medium')]: {
            marginTop: 'calc(60px + var(--banner-height-normal))',
          },

          [media.greaterThan('large')]: {
            marginTop: 'calc(80px + var(--banner-height-normal))',
          },
        }}>
        {title}
      </h1>
    </Flex>
  );
};

export default MarkdownHeader;
