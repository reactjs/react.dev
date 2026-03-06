/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Children, cloneElement} from 'react';
import NextLink from 'next/link';
import cn from 'classnames';

import {ExternalLink} from 'components/ExternalLink';
import {getMDXName} from './getMDXName';

const ABSOLUTE_DOC_SECTIONS = [
  'blog',
  'community',
  'errors',
  'learn',
  'reference',
] as const;

function normalizeDocsHref(href: string) {
  if (
    href.startsWith('/') ||
    href.startsWith('#') ||
    href.startsWith('./') ||
    href.startsWith('../')
  ) {
    return href;
  }

  const matchesDocsPath = ABSOLUTE_DOC_SECTIONS.some(
    (section) => href === section || href.startsWith(`${section}/`)
  );

  return matchesDocsPath ? `/${href}` : href;
}

function Link({
  href,
  className,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const classes =
    'inline text-link dark:text-link-dark border-b border-link border-opacity-0 hover:border-opacity-100 duration-100 ease-in transition leading-normal';
  const modifiedChildren = Children.toArray(children).map((child: any) => {
    if (getMDXName(child) === 'code') {
      return cloneElement(child, {
        isLink: true,
      });
    }
    return child;
  });

  if (!href) {
    return <a href={href} className={className} {...props} />;
  }

  const normalizedHref = normalizeDocsHref(href);

  return (
    <>
      {normalizedHref.startsWith('https://') ? (
        <ExternalLink
          href={normalizedHref}
          className={cn(classes, className)}
          {...props}>
          {modifiedChildren}
        </ExternalLink>
      ) : normalizedHref.startsWith('#') ? (
        <a className={cn(classes, className)} href={normalizedHref} {...props}>
          {modifiedChildren}
        </a>
      ) : (
        <NextLink
          href={normalizedHref}
          className={cn(classes, className)}
          {...props}>
          {modifiedChildren}
        </NextLink>
      )}
    </>
  );
}

export default Link;
