/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Html, Head, Main, NextScript} from 'next/document';
import {siteConfig} from '../siteConfig';
import {SharedRootBody, SharedRootHead} from '../components/_/root-layout';

const MyDocument = () => {
  return (
    <Html lang={siteConfig.languageCode} dir={siteConfig.isRTL ? 'rtl' : 'ltr'}>
      <Head />
      <SharedRootHead />
      <SharedRootBody>
        <Main />
        <NextScript />
      </SharedRootBody>
    </Html>
  );
};

export default MyDocument;
