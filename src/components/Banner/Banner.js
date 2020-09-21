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
        fontSize: 20,
        padding: 20,
        textAlign: 'center',

        [media.lessThan('small')]: {
          height: banner.smallHeight,
        },
      }}>
      {banner.content(dismiss)}
    </div>
  );
}
