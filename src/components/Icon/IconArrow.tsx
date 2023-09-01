/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {memo} from 'react';
import cn from 'classnames';

export const IconArrow = memo<
  JSX.IntrinsicElements['svg'] & {
    /**
     * The direction the arrow should point.
     * `start` and `end` are relative to the current locale.
     * for example, in LTR, `start` is left and `end` is right.
     */
    displayDirection: 'start' | 'end' | 'right' | 'left' | 'up' | 'down';
  }
>(function IconArrow({displayDirection, className, ...rest}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1.33em"
      height="1.33em"
      fill="currentColor"
      {...rest}
      className={cn(className, {
        'rotate-180': displayDirection === 'right',
        'rotate-180 rtl:rotate-0': displayDirection === 'end',
      })}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M7.828 11H20v2H7.828l5.364 5.364-1.414 1.414L4 12l7.778-7.778 1.414 1.414z" />
    </svg>
  );
});
