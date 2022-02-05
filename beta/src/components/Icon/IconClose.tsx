/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';

export const IconClose = React.memo<JSX.IntrinsicElements['svg']>(
  function IconClose(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.33em"
        height="1.33em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}>
        <line x1={18} y1={6} x2={6} y2={18} />
        <line x1={6} y1={6} x2={18} y2={18} />
      </svg>
    );
  }
);

IconClose.displayName = 'IconClose';
