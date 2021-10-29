/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import NextLink from 'next/link';
import * as React from 'react';
import cn from 'classnames';
import {removeFromLast} from 'utils/removeFromLast';
import {IconNavArrow} from './Icon/IconNavArrow';
import {RouteMeta} from './Layout/useRouteMeta';

export type DocsPageFooterProps = Pick<
  RouteMeta,
  'route' | 'nextRoute' | 'prevRoute'
>;

function areEqual(prevProps: DocsPageFooterProps, props: DocsPageFooterProps) {
  return prevProps.route?.path === props.route?.path;
}

export const DocsPageFooter = React.memo<DocsPageFooterProps>(
  function DocsPageFooter({nextRoute, prevRoute, route}) {
    if (!route || route?.heading) {
      return null;
    }

    return (
      <>
        {prevRoute?.path || nextRoute?.path ? (
          <>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 py-4 md:py-12">
              {prevRoute?.path ? (
                <FooterLink
                  type="Previous"
                  title={prevRoute.title}
                  href={removeFromLast(prevRoute.path, '.')}
                />
              ) : (
                <div />
              )}

              {nextRoute?.path ? (
                <FooterLink
                  type="Next"
                  title={nextRoute.title}
                  href={removeFromLast(nextRoute.path, '.')}
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
          'flex gap-x-4 md:gap-x-6 items-center w-full md:w-80 px-4 md:px-5 py-6 border-2 border-transparent text-base leading-base text-link dark:text-link-dark rounded-lg group focus:text-link dark:focus:text-link-dark focus:bg-highlight focus:border-link dark:focus:bg-highlight-dark dark:focus:border-link-dark focus:border-opacity-100 focus:border-2 focus:ring-1 focus:ring-offset-4 focus:ring-blue-40 active:ring-0 active:ring-offset-0 hover:bg-gray-5 dark:hover:bg-gray-80',
          {
            'flex-row-reverse justify-self-end text-right': type === 'Next',
          }
        )}>
        <IconNavArrow
          className="text-gray-30 dark:text-gray-50 inline group-focus:text-link dark:group-focus:text-link-dark"
          displayDirection={type === 'Previous' ? 'left' : 'right'}
        />
        <span>
          <span className="block no-underline text-sm tracking-wide text-secondary dark:text-secondary-dark uppercase font-bold group-focus:text-link dark:group-focus:text-link-dark group-focus:text-opacity-100">
            {type}
          </span>
          <span className="block text-lg group-hover:underline">{title}</span>
        </span>
      </a>
    </NextLink>
  );
}

DocsPageFooter.displayName = 'DocsPageFooter';
