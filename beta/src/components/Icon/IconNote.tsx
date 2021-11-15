/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';

export const IconNote = React.memo<JSX.IntrinsicElements['svg']>(
  function IconNote({className}) {
    return (
      <svg
        className={className}
        width="1em"
        height="1.05em"
        viewBox="0 0 18 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18 12.2632L12 18.2592L1.002 18.2632C0.737486 18.2642 0.483369 18.1603 0.295486 17.9741C0.107603 17.7879 0.00132309 17.5347 0 17.2702V1.25618C0 0.708184 0.445 0.263184 0.993 0.263184H17.007C17.555 0.263184 18 0.719183 18 1.26518V12.2632ZM16 2.26318H2V16.2632H10V11.2632C10 11.0183 10.09 10.7818 10.2527 10.5988C10.4155 10.4158 10.6397 10.2988 10.883 10.2702L11 10.2632L16 10.2622V2.26318ZM15.171 12.2622L12 12.2632V15.4322L15.171 12.2622Z"
          fill="currentColor"
        />
      </svg>
    );
  }
);

IconNote.displayName = 'IconNote';
