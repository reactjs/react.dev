/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {IconRestart} from '../../Icon/IconRestart';
export interface ResetButtonProps {
  clientId?: string;
  onReset: () => void;
}

export const ResetButton: React.FC<ResetButtonProps> = ({
  clientId,
  onReset,
}) => {
  return (
    <button
      className="text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1"
      onClick={onReset}
      title="Reset Sandbox"
      type="button">
      <IconRestart className="inline mb-0.5 ml-1 mr-1 relative top-0.5" /> Reset
    </button>
  );
};
