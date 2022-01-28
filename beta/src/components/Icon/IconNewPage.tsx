/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';

export const IconNewPage = React.memo<JSX.IntrinsicElements['svg']>(
  function IconNewPage(props) {
    return (
      <svg
        width="0.72em"
        height="0.72em"
        viewBox="0 0 13 13"
        xmlns="http://www.w3.org/2000/svg"
        {...props}>
        <path
          d="M4.72038 2.94824V4.28158H1.38704V11.6149H8.72038V8.28158H10.0537V12.2816C10.0537 12.4584 9.98347 12.628 9.85845 12.753C9.73343 12.878 9.56386 12.9482 9.38704 12.9482H0.720378C0.543567 12.9482 0.373997 12.878 0.248973 12.753C0.123949 12.628 0.0537109 12.4584 0.0537109 12.2816V3.61491C0.0537109 3.4381 0.123949 3.26853 0.248973 3.1435C0.373997 3.01848 0.543567 2.94824 0.720378 2.94824H4.72038ZM12.0537 0.948242V6.28158H10.7204V3.22358L5.52504 8.41958L4.58238 7.47691L9.77704 2.28158H6.72038V0.948242H12.0537Z"
          fill="currentColor"
        />
      </svg>
    );
  }
);

IconNewPage.displayName = 'IconNewPage';
