/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import cn from 'classnames';
import NextLink from 'next/link';

interface ButtonLinkProps {
  size?: 'md' | 'lg';
  type?: 'primary' | 'secondary';
  label?: string;
  target?: '_self' | '_blank';
}

function ButtonLink({
  href,
  className,
  children,
  type = 'primary',
  size = 'md',
  label,
  target = '_self',
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & ButtonLinkProps) {
  const classes = cn(
    className,
    'active:scale-[.98] transition-transform inline-flex font-bold items-center outline-none focus:outline-none focus-visible:outline focus-visible:outline-link focus:outline-offset-2 focus-visible:dark:focus:outline-link-dark leading-snug',
    {
      'bg-link text-white hover:bg-opacity-80': type === 'primary',
      'text-primary dark:text-primary-dark shadow-secondary-button-stroke dark:shadow-secondary-button-stroke-dark hover:bg-gray-40/5 active:bg-gray-40/10 hover:dark:bg-gray-60/5 active:dark:bg-gray-60/10':
        type === 'secondary',
      'text-lg py-3 rounded-full px-4 sm:px-6': size === 'lg',
      'text-base rounded-full px-4 py-2': size === 'md',
    }
  );
  return (
    <NextLink
      href={href as string}
      className={classes}
      {...props}
      aria-label={label}
      target={target}>
      {children}
    </NextLink>
  );
}

export default ButtonLink;
