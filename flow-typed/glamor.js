/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

declare module 'glamor' {
  declare module.exports: {
    css: {
      global: (...params: any) => void,
    },
  };
}

declare module 'glamor/react' {
  declare module.exports: {
    createElement: any,
    dom: any,
    vars: any,
    makeTheme: any,
    propMerge: Function,
  };
}
