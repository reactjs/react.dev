/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export async function register() {
  if (
    process.env.NODE_ENV !== 'development' ||
    process.env.NEXT_RUNTIME !== 'nodejs'
  ) {
    return;
  }
  const {registerDevContentWatcher} = await import('./instrumentation.node');
  registerDevContentWatcher();
}
