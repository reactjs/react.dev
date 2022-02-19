/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import NextLink from 'next/link';
import cn from 'classnames';

function Link({
  href,
  className,
  children,
  ...props
}: JSX.IntrinsicElements['a']) {
  return (
    // @ts-ignore
    <NextLink href={href}>
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
      <a className={className} {...props}>
        {children}
      </a>
    </NextLink>
  );
}

Link.displayName = 'Link';

export default Link;
