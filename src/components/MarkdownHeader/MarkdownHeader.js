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
          marginTop: 80,
          ...fonts.header,

          [media.size('medium')]: {
            marginTop: 60,
          },

          [media.lessThan('small')]: {
            marginTop: 40,
          },
        }}>
        {title}
      </h1>
    </Flex>
  );
};

export default MarkdownHeader;
