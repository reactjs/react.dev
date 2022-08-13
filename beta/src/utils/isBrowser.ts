/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

// check if we're running in the browser
export function isBrowser() {
  return typeof window !== 'undefined';
}
