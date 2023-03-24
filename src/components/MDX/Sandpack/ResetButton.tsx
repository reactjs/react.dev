/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {IconRestart} from '../../Icon/IconRestart';
export interface ResetButtonProps {
  onReset: () => void;
}

export function ResetButton({onReset}: ResetButtonProps) {
  return (
    <button
      className="mx-1 inline-flex items-center text-sm text-primary transition duration-100 ease-in hover:text-link dark:text-primary-dark"
      onClick={onReset}
      title="Reset Sandbox"
      type="button">
      <IconRestart className="relative ml-1 mr-1 inline" /> Reset
    </button>
  );
}
