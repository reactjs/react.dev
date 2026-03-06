'use client';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useSyncExternalStore} from 'react';

function getHashValue() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.location.hash.slice(1);
}

function subscribeToHashChange(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener('hashchange', callback);
  return () => {
    window.removeEventListener('hashchange', callback);
  };
}

export function useLocationHash() {
  return useSyncExternalStore(subscribeToHashChange, getHashValue, () => '');
}
