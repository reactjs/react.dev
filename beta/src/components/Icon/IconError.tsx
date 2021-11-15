/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';

export const IconError = React.memo<JSX.IntrinsicElements['svg']>(
  function IconError({className}) {
    return (
      <svg
        className={className}
        width="1.33em"
        height="1.33em"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <circle cx="10.1626" cy="9.99951" r="9.47021" fill="currentColor" />
        <path d="M6.22705 5.95996L14.2798 14.0127" stroke="white" />
        <path d="M14.2798 5.95996L6.22705 14.0127" stroke="white" />
      </svg>
    );
  }
);

IconError.displayName = 'IconError';
