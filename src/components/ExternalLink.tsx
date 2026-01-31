/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */
import type {DetailedHTMLProps, AnchorHTMLAttributes} from 'react';

export function ExternalLink({
  href,
  target,
  children,
  ...props
}: DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) {
  return (
    <a href={href} target={target ?? '_blank'} rel="noopener" {...props}>
      {children}
    </a>
  );
}
