/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

declare module 'gatsby-plugin-google-analytics' {
  declare module.exports: {
    trackCustomEvent: (...params: any) => void,
  };
}
