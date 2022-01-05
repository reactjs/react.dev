/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {IconInspect} from '../../Icon/IconInspect';
export interface ResetButtonProps {
  onClick: () => void;
}

export const DevToolsButton: React.FC<ResetButtonProps> = ({onClick}) => {
  return (
    <button
      className="text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1"
      onClick={onClick}
      title="Open React devtools"
      type="button">
      <IconInspect className="inline mb-0.5 ml-1 mr-1 relative top-0.5" />{' '}
      Inspect
    </button>
  );
};
