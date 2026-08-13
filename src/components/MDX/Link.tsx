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
import Link from 'next/link';
import cn from 'classnames';

import {ExternalLink} from 'components/ExternalLink';

function MDXLink({
  href,
  className,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const classes =
    'inline text-link dark:text-link-dark border-b border-link border-opacity-0 hover:border-opacity-100 duration-100 ease-in transition leading-normal';
  const modifiedChildren = Children.toArray(children).map((child: any) => {
    if (child.type?.mdxName && child.type?.mdxName === 'inlineCode') {
      return cloneElement(child, {
        isLink: true,
      });
    }
    return child;
  });

  if (!href) {
    return <a href={href} className={className} {...props} />;
  }
  return (
    <>
      {href.startsWith('https://') ? (
        <ExternalLink href={href} className={cn(classes, className)} {...props}>
          {modifiedChildren}
        </ExternalLink>
      ) : (
        <Link href={href} className={cn(classes, className)} {...props}>
          {modifiedChildren}
        </Link>
      )}
    </>
  );
}

export default MDXLink;
