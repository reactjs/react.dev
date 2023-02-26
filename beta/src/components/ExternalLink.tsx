/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

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
