/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {memo} from 'react';
import cn from 'classnames';

export const IconSolution = memo<JSX.IntrinsicElements['svg']>(
  function IconSolution({className}) {
    return (
      <svg
        className={cn('inline', className)}
        width="0.75em"
        height="0.75em"
        viewBox="0 0 13 13"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2.21908 8.74479V12.7448H0.885742V0.078125H7.14041C7.26418 0.0781911 7.3855 0.112714 7.49076 0.177827C7.59602 0.242939 7.68108 0.336071 7.73641 0.446792L8.21908 1.41146H12.2191C12.3959 1.41146 12.5655 1.4817 12.6905 1.60672C12.8155 1.73174 12.8857 1.90131 12.8857 2.07812V9.41146C12.8857 9.58827 12.8155 9.75784 12.6905 9.88286C12.5655 10.0079 12.3959 10.0781 12.2191 10.0781H7.96441C7.84063 10.0781 7.71932 10.0435 7.61406 9.97842C7.50879 9.91331 7.42374 9.82018 7.36841 9.70946L6.88574 8.74479H2.21908ZM2.21908 1.41146V7.41146H7.70974L8.37641 8.74479H11.5524V2.74479H7.39508L6.72841 1.41146H2.21908Z"
          fill="currentColor"
        />
      </svg>
    );
  }
);
