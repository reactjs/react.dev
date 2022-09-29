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
}: JSX.IntrinsicElements['a'] & ButtonLinkProps) {
  const classes = cn(
    className,
    'inline-flex font-bold items-center border-2 border-transparent outline-none focus:ring-1 focus:ring-offset-2 focus:ring-link active:bg-link active:text-white active:ring-0 active:ring-offset-0 leading-normal',
    {
      'bg-link text-white hover:bg-opacity-80': type === 'primary',
      'bg-secondary-button dark:bg-secondary-button-dark text-primary dark:text-primary-dark hover:text-link focus:bg-link focus:text-white focus:border-link focus:border-2':
        type === 'secondary',
      'text-lg rounded-lg p-4': size === 'lg',
      'text-base rounded-lg px-4 py-1.5': size === 'md',
    }
  );
  return (
    <NextLink href={href as string}>
      <a className={classes} {...props} aria-label={label} target={target}>
        {children}
      </a>
    </NextLink>
  );
}

export default ButtonLink;
