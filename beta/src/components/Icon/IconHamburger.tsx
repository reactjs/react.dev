/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';

export const IconHamburger = React.memo<JSX.IntrinsicElements['svg']>(
  function IconHamburger(props) {
    return (
      <svg
        width="1.33em"
        height="1.33em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    );
  }
);

IconHamburger.displayName = 'IconHamburger';
