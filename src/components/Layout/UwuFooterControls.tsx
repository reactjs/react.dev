/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

declare global {
  interface Window {
    __setUwu: (isUwu: boolean) => void;
  }
}

export function UwuFooterControls() {
  const classes =
    'block text-xs cursor-pointer hover:text-link hover:dark:text-link-dark hover:underline';

  return (
    <>
      <button
        type="button"
        className={`uwu-visible ${classes}`}
        onClick={() => window.__setUwu(false)}>
        no uwu plz
      </button>
      <button
        type="button"
        className={`uwu-hidden ${classes}`}
        onClick={() => window.__setUwu(true)}>
        uwu?
      </button>
    </>
  );
}
