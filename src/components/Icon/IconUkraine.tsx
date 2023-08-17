/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {memo} from 'react';

export const IconUAFlag = memo<JSX.IntrinsicElements['svg']>(
  function IconUkraine(props) {
    return (
      <svg
        style={{
          marginTop: '0.5rem',
          marginLeft: '0.3rem',
          borderRadius: '0.2rem',
          rotate: '180deg',
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 3 2"
        width="1.33em"
        height="0.9em"
        // display={"Flex"}
        // fill="currentColor"
        {...props}>
        <path d="m0 1h3v1H0" fill="#0057B7" />
        <path d="m0 0h3v1H0" fill="#FFD700" />
      </svg>
    );
  }
);
