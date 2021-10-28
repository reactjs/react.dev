/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import cn from 'classnames';
import NextLink from 'next/link';
import {ExternalLink} from 'components/ExternalLink';

interface NavButtonLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function NavButtonLink({
  href,
  children,
  className,
}: NavButtonLinkProps) {
  const classes = cn(
    'mr-3 text-xs items-center border-b border-link border-opacity-0 hover:text-link hover:border-opacity-100',
    className
  );
  if (href.startsWith('https://')) {
    return (
      <ExternalLink href={href} className={classes}>
        {children}
      </ExternalLink>
    );
  }

  return (
    <NextLink href={href}>
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
      <a className={classes}>{children}</a>
    </NextLink>
  );
}
