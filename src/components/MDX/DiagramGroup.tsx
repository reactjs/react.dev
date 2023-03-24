/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {ReactNode} from 'react';

interface DiagramGroupProps {
  children: ReactNode;
}

export function DiagramGroup({children}: DiagramGroupProps) {
  return (
    <div className="flex w-full flex-col items-start justify-center py-2 sm:flex-row sm:items-center sm:space-y-0 sm:p-0">
      {children}
    </div>
  );
}

export default DiagramGroup;
