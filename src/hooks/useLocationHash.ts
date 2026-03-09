'use client';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useState} from 'react';

function getHashValue() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.location.hash.slice(1);
}

export function useLocationHash() {
  const [hash, setHash] = useState('');

  useEffect(() => {
    const updateHash = () => {
      setHash(getHashValue());
    };

    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => {
      window.removeEventListener('hashchange', updateHash);
    };
  }, []);

  return hash;
}
