/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

// $FlowFixMe Update Flow
import React, {useContext} from 'react';
import BannerContext from './BannerContext';
import {media} from 'theme';

export default function Banner() {
  const {banner, dismiss} = useContext(BannerContext);
  if (banner === null) {
    return null;
  }
  return (
    <div
      css={{
        height: banner.normalHeight,
        fontSize: 18,
        [media.lessThan('large')]: {
          fontSize: 16,
        },
        [media.lessThan('small')]: {
          height: banner.smallHeight,
          fontSize: 14,
        },
      }}>
      {banner.content(dismiss)}
    </div>
  );
}
