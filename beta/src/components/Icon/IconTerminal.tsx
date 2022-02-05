/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';

export const IconTerminal = React.memo<JSX.IntrinsicElements['svg']>(
  function IconTerminal({className}) {
    return (
      <svg
        className={className}
        width="1em"
        height="1em"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2.40299 2.61279H14.403C14.5798 2.61279 14.7494 2.68303 14.8744 2.80806C14.9994 2.93308 15.0697 3.10265 15.0697 3.27946V13.9461C15.0697 14.1229 14.9994 14.2925 14.8744 14.4175C14.7494 14.5426 14.5798 14.6128 14.403 14.6128H2.40299C2.22618 14.6128 2.05661 14.5426 1.93159 14.4175C1.80657 14.2925 1.73633 14.1229 1.73633 13.9461V3.27946C1.73633 3.10265 1.80657 2.93308 1.93159 2.80806C2.05661 2.68303 2.22618 2.61279 2.40299 2.61279ZM8.403 10.6128V11.9461H12.403V10.6128H8.403ZM6.01233 8.61279L4.12699 10.4981L5.06966 11.4415L7.89833 8.61279L5.06966 5.78413L4.12699 6.72746L6.01233 8.61279Z"
          fill="currentColor"
        />
      </svg>
    );
  }
);

IconTerminal.displayName = 'IconTerminal';
