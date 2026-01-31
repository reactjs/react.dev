/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {IconClose} from '../../Icon/IconClose';
export interface ClearButtonProps {
  onClear: () => void;
}

export function ClearButton({onClear}: ClearButtonProps) {
  return (
    <button
      className="text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1"
      onClick={onClear}
      title="Clear all edits and reload sandbox"
      type="button">
      <IconClose className="inline mx-1 relative" />
      <span className="hidden md:block">Clear</span>
    </button>
  );
}
