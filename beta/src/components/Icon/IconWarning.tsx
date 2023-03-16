/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {memo} from 'react';

export const IconWarning = memo<JSX.IntrinsicElements['svg']>(
  function IconWarning({className}) {
    return (
      <svg
        className={className}
        width="2em"
        height="2em"
        viewBox="0 0 72 72"
        xmlns="http://www.w3.org/2000/svg">
        <g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M36 63C50.9117 63 63 50.9117 63 36C63 21.0883 50.9117 9 36 9C21.0883 9 9 21.0883 9 36C9 50.9117 21.0883 63 36 63ZM36 69C54.2254 69 69 54.2254 69 36C69 17.7746 54.2254 3 36 3C17.7746 3 3 17.7746 3 36C3 54.2254 17.7746 69 36 69ZM39.7515 47.9926C39.7515 49.7926 38.5015 50.9926 36.0015 50.9926C33.5015 50.9926 32.2515 49.7926 32.2515 47.9926C32.2515 46.1926 33.5015 44.9926 36.0015 44.9926C38.5015 44.9926 39.7515 46.1926 39.7515 47.9926ZM38.6265 23.6199C38.6265 22.1701 37.4512 20.9949 36.0015 20.9949C34.5517 20.9949 33.3765 22.1701 33.3765 23.6199V38.5443C33.3765 39.9941 34.5517 41.1693 36.0015 41.1693C37.4512 41.1693 38.6265 39.9941 38.6265 38.5443V23.6199Z"
            fill="currentColor"
          />
        </g>
      </svg>
    );
  }
);
