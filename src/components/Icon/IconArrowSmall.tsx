/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {memo} from 'react';
import cn from 'classnames';

export const IconArrowSmall = memo<
  JSX.IntrinsicElements['svg'] & {
    displayDirection: 'left' | 'right' | 'up' | 'down';
  }
>(function IconArrowSmall({displayDirection, className, ...rest}) {
  const classes = cn(className, {
    'rotate-180': displayDirection === 'left',
    'rotate-90': displayDirection === 'down',
  });
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classes}
      {...rest}>
      <path
        d="M6.86612 13.6161C6.37796 14.1043 6.37796 14.8957 6.86612 15.3839C7.35427 15.872 8.14572 15.872 8.63388 15.3839L13.1339 10.8839C13.622 10.3957 13.622 9.60428 13.1339 9.11612L8.63388 4.61612C8.14572 4.12797 7.35427 4.12797 6.86612 4.61612C6.37796 5.10428 6.37796 5.89573 6.86612 6.38388L10.4822 10L6.86612 13.6161Z"
        fill="currentColor"></path>
    </svg>
  );
});
