/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import NextLink from 'next/link';
import {memo} from 'react';
import cn from 'classnames';
import {IconNavArrow} from './Icon/IconNavArrow';
import type {RouteMeta} from './Layout/getRouteMeta';

export type DocsPageFooterProps = Pick<
  RouteMeta,
  'route' | 'nextRoute' | 'prevRoute'
>;

function areEqual(prevProps: DocsPageFooterProps, props: DocsPageFooterProps) {
  return prevProps.route?.path === props.route?.path;
}

export const DocsPageFooter = memo<DocsPageFooterProps>(
  function DocsPageFooter({nextRoute, prevRoute, route}) {
    if (!route || route?.heading) {
      return null;
    }

    return (
      <>
        {prevRoute?.path || nextRoute?.path ? (
          <>
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 py-4 md:grid-cols-2 md:py-12">
              {prevRoute?.path ? (
                <FooterLink
                  type="Previous"
                  title={prevRoute.title}
                  href={prevRoute.path}
                />
              ) : (
                <div />
              )}

              {nextRoute?.path ? (
                <FooterLink
                  type="Next"
                  title={nextRoute.title}
                  href={nextRoute.path}
                />
              ) : (
                <div />
              )}
            </div>
          </>
        ) : null}
      </>
    );
  },
  areEqual
);

function FooterLink({
  href,
  title,
  type,
}: {
  href: string;
  title: string;
  type: 'Previous' | 'Next';
}) {
  return (
    <NextLink href={href}>
      <a
        className={cn(
          'group flex w-full items-center gap-x-4 rounded-lg border-2 border-transparent px-4 py-6 text-base leading-base text-link hover:bg-gray-5 focus:border-2 focus:border-link focus:border-opacity-100 focus:bg-highlight focus:text-link focus:ring-1 focus:ring-blue-40 focus:ring-offset-4 active:ring-0 active:ring-offset-0 dark:text-link-dark dark:hover:bg-gray-80 dark:focus:border-link-dark dark:focus:bg-highlight-dark dark:focus:text-link-dark md:w-80 md:gap-x-6 md:px-5',
          {
            'flex-row-reverse justify-self-end text-right': type === 'Next',
          }
        )}>
        <IconNavArrow
          className="inline text-tertiary group-focus:text-link dark:text-tertiary-dark dark:group-focus:text-link-dark"
          displayDirection={type === 'Previous' ? 'left' : 'right'}
        />
        <span>
          <span className="block text-sm font-bold uppercase tracking-wide text-secondary no-underline group-focus:text-link group-focus:text-opacity-100 dark:text-secondary-dark dark:group-focus:text-link-dark">
            {type}
          </span>
          <span className="block text-lg group-hover:underline">{title}</span>
        </span>
      </a>
    </NextLink>
  );
}
