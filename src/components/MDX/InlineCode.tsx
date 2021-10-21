/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import cn from 'classnames';

interface InlineCodeProps {
  isLink: boolean;
}
function InlineCode({
  isLink,
  ...props
}: JSX.IntrinsicElements['code'] & InlineCodeProps) {
  return (
    <code
      className={cn(
        'inline text-code text-secondary dark:text-secondary-dark px-1 rounded-md no-underline',
        {
          'bg-gray-30 bg-opacity-10 py-px': !isLink,
          'bg-highlight dark:bg-highlight-dark py-0': isLink,
        }
      )}
      {...props}
    />
  );
}

InlineCode.displayName = 'InlineCode';

export default InlineCode;
