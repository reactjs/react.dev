/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import cn from 'classnames';
import * as React from 'react';
import {siteConfig} from 'siteConfig';
import {forwardRefWithAs} from 'utils/forwardRefWithAs';
export interface HeadingProps {
  className?: string;
  isPageAnchor?: boolean;
  children: React.ReactNode;
  id?: string;
  as?: any;
}

const Heading = forwardRefWithAs<HeadingProps, 'div'>(function Heading(
  {as: Comp = 'div', className, children, id, isPageAnchor = true, ...props},
  ref
) {
  let label = 'Link for this heading';
  if (typeof children === 'string') {
    label = 'Link for ' + children;
  }

  return (
    <Comp id={id} {...props} ref={ref} className={cn('mdx-heading', className)}>
      {children}
      {isPageAnchor && (
        <a
          href={`#${id}`}
          aria-label={label}
          title={label}
          className={cn(
            'mdx-header-anchor',
            Comp === 'h1' ? 'hidden' : 'inline-block'
          )}>
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 13 13"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-70 ml-2 h-5 w-5">
            <g fill="currentColor" fillRule="evenodd">
              <path d="M7.778 7.975a2.5 2.5 0 0 0 .347-3.837L6.017 2.03a2.498 2.498 0 0 0-3.542-.007 2.5 2.5 0 0 0 .006 3.543l1.153 1.15c.07-.29.154-.563.25-.773.036-.077.084-.16.14-.25L3.18 4.85a1.496 1.496 0 0 1 .002-2.12 1.496 1.496 0 0 1 2.12 0l2.124 2.123a1.496 1.496 0 0 1-.333 2.37c.16.246.42.504.685.752z" />
              <path d="M5.657 4.557a2.5 2.5 0 0 0-.347 3.837l2.108 2.108a2.498 2.498 0 0 0 3.542.007 2.5 2.5 0 0 0-.006-3.543L9.802 5.815c-.07.29-.154.565-.25.774-.036.076-.084.16-.14.25l.842.84c.585.587.59 1.532 0 2.122-.587.585-1.532.59-2.12 0L6.008 7.68a1.496 1.496 0 0 1 .332-2.372c-.16-.245-.42-.503-.685-.75z" />
            </g>
          </svg>
        </a>
      )}
    </Comp>
  );
});

Heading.displayName = 'Heading';

export const H1 = ({className, ...props}: HeadingProps) => (
  <Heading
    as="h1"
    className={cn(className, 'text-5xl font-bold leading-tight')}
    {...props}
  />
);

export const H2 = ({className, ...props}: HeadingProps) => (
  <Heading
    as="h2"
    className={cn(
      'text-3xl leading-10 text-primary dark:text-primary-dark font-bold my-6',
      className
    )}
    {...props}
  />
);
export const H3 = ({className, ...props}: HeadingProps) => (
  <Heading
    as="h3"
    className={cn(
      className,
      'text-2xl leading-9 text-primary dark:text-primary-dark font-bold my-6'
    )}
    {...props}
  />
);

export const H4 = ({className, ...props}: HeadingProps) => (
  <Heading
    as="h4"
    className={cn(className, 'text-xl font-bold leading-9 my-4')}
    {...props}
  />
);
