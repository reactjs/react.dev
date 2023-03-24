/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

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
        'inline rounded-md px-1 text-code text-secondary no-underline dark:text-secondary-dark',
        {
          'bg-gray-30 bg-opacity-10 py-px': !isLink,
          'bg-highlight py-0 dark:bg-highlight-dark': isLink,
        }
      )}
      {...props}
    />
  );
}

export default InlineCode;
