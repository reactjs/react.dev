/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Html, Head, Main, NextScript} from 'next/document';

const MyDocument = () => {
  //  @todo specify language in HTML?
  return (
    <Html lang="en">
      <Head />
      <body className="font-sans antialiased text-lg bg-wash dark:bg-wash-dark text-secondary dark:text-secondary-dark leading-base">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;
