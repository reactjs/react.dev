/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import Flex from 'components/Flex';
// $FlowFixMe Update Flow
import React, {useContext} from 'react';
import {BannerContext} from 'components/Banner';
import {colors, fonts, media} from 'theme';

const MarkdownHeader = ({title}: {title: string}) => {
  const {banner} = useContext(BannerContext);
  return (
    <Flex type="header" halign="space-between" valign="baseline">
      <h1
        css={{
          color: colors.dark,
          marginBottom: 0,
          marginTop: 40 + (banner ? banner.normalHeight : 0),
          ...fonts.header,

          [media.lessThan('small')]: {
            marginTop: 40 + (banner ? banner.smallHeight : 0),
          },

          [media.size('medium')]: {
            marginTop: 60 + (banner ? banner.normalHeight : 0),
          },

          [media.greaterThan('large')]: {
            marginTop: 80 + (banner ? banner.normalHeight : 0),
          },
        }}>
        {title}
      </h1>
    </Flex>
  );
};

export default MarkdownHeader;
