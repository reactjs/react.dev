/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';

export function ExternalLink({
  href,
  target,
  children,
  ...props
}: JSX.IntrinsicElements['a']) {
  return (
    <a href={href} target={target ?? '_blank'} rel="noopener" {...props}>
      {children}
    </a>
  );
}

ExternalLink.displayName = 'ExternalLink';
