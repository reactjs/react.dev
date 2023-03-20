/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {memo} from 'react';

export const IconNote = memo<JSX.IntrinsicElements['svg']>(function IconNote({
  className,
}) {
  return (
    <svg
      className={className}
      width="2em"
      height="2em"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_40_48064)">
        <path
          d="M24 27C24 25.3431 25.3431 24 27 24H45C46.6569 24 48 25.3431 48 27C48 28.6569 46.6569 30 45 30H27C25.3431 30 24 28.6569 24 27Z"
          fill="currentColor"
        />
        <path
          d="M24 39C24 37.3431 25.3431 36 27 36H39C40.6569 36 42 37.3431 42 39C42 40.6569 40.6569 42 39 42H27C25.3431 42 24 40.6569 24 39Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 18C12 13.0294 16.0294 9 21 9H51C55.9706 9 60 13.0294 60 18V54C60 58.9706 55.9706 63 51 63H21C16.0294 63 12 58.9706 12 54V18ZM21 15H51C52.6569 15 54 16.3431 54 18V54C54 55.6569 52.6569 57 51 57H21C19.3431 57 18 55.6569 18 54V18C18 16.3431 19.3431 15 21 15Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_40_48064">
          <rect width="72" height="72" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
});
