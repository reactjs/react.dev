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
          marginTop:
            'calc(40px + var(--survey-banner-height-normal) + var(--social-banner-height-normal))',
          ...fonts.header,

          [media.lessThan('small')]: {
            marginTop:
              'calc(40px + var(--survey-banner-height-small) + var(--social-banner-height-small))',
          },

          [media.size('medium')]: {
            marginTop:
              'calc(60px + var(--survey-banner-height-normal) + var(--social-banner-height-normal))',
          },

          [media.greaterThan('large')]: {
            marginTop:
              'calc(80px + var(--survey-banner-height-normal) + var(--social-banner-height-normal))',
          },
        }}>
        {title}
      </h1>
    </Flex>
  );
};

export default MarkdownHeader;
