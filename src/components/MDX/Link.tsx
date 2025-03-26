/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import NextLink from 'next/link';
import cn from 'classnames';

import {ExternalLink} from 'components/ExternalLink';

function Link({
  href,
  className,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const classes =
    'inline text-link dark:text-link-dark border-b border-link border-opacity-0 hover:border-opacity-100 duration-100 ease-in transition leading-normal';

  if (!href) {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a href={href} className={className} {...props} />;
  }
  return (
    <>
      {href.startsWith('https://') ? (
        <ExternalLink href={href} className={cn(classes, className)} {...props}>
          {children}
        </ExternalLink>
      ) : href.startsWith('#') ? (
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        <a className={cn(classes, className)} href={href} {...props}>
          {children}
        </a>
      ) : (
        <NextLink href={href} className={cn(classes, className)} {...props}>
          {children}
        </NextLink>
      )}
    </>
  );
}

export default Link;
