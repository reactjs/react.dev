/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Html, Head, Main, NextScript} from 'next/document';
import {siteConfig} from '../siteConfig';

const MyDocument = () => {
  return (
    <Html lang={siteConfig.languageCode}>
      <Head>
        <meta charSet="utf-8" />
      </Head>
      <body className="font-text font-medium antialiased text-lg bg-wash dark:bg-wash-dark text-secondary dark:text-secondary-dark leading-base">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;
