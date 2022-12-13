/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {memo} from 'react';

export const IconLink = memo<JSX.IntrinsicElements['svg']>(function IconLink(
  props
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.33em"
      height="1.33em"
      viewBox="0 -2 24 24"
      fill="currentColor"
      {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
      />
    </svg>
  );
});
