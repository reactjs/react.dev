/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';

export function ExternalLink({
  href,
  target,
  ...props
}: JSX.IntrinsicElements['a']) {
  return (
    <a href={href} target={target ?? '_blank'} rel="noopener" {...props}>
      {props.children}
    </a>
  );
}

ExternalLink.displayName = 'ExternalLink';
