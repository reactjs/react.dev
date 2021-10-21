/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';

export const IconWarning = React.memo<JSX.IntrinsicElements['svg']>(
  function IconWarning({className}) {
    return (
      <svg
        className={className}
        width="1.33em"
        height="1.33em"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <g>
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"
            fill="currentColor"
          />
        </g>
      </svg>
    );
  }
);

IconWarning.displayName = 'IconWarning';
