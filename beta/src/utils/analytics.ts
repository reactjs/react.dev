/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

let buffer: Array<any> = [];
let galite: null | Function = null;
let galitePromise: null | Promise<any> = null;

export function ga(...args: any[]): void {
  if (typeof galite === 'function') {
    galite.apply(null, args);
    return;
  }
  buffer.push(args);
  if (!galitePromise) {
    // @ts-ignore
    galitePromise = import('ga-lite').then((mod) => {
      galite = mod.default;
      galitePromise = null;
      buffer.forEach((args) => {
        mod.default.apply(null, args);
      });
      buffer = [];
    });
  }
}
