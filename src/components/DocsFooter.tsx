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
            <div className="grid grid-cols-1 gap-4 py-4 mx-auto max-w-7xl md:grid-cols-2 md:py-12">
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
    <NextLink
      href={href}
      className={cn(
        'flex gap-x-4 md:gap-x-6 items-center w-full md:min-w-80 md:w-fit md:max-w-md px-4 md:px-5 py-6 border-2 border-transparent text-base leading-base text-link dark:text-link-dark rounded-lg group focus:text-link dark:focus:text-link-dark focus:bg-highlight focus:border-link dark:focus:bg-highlight-dark dark:focus:border-link-dark focus:border-opacity-100 focus:border-2 focus:ring-1 focus:ring-offset-4 focus:ring-blue-40 active:ring-0 active:ring-offset-0 hover:bg-gray-5 dark:hover:bg-gray-80',
        {
          'flex-row-reverse justify-self-end text-end': type === 'Next',
        }
      )}>
      <IconNavArrow
        className="inline text-tertiary dark:text-tertiary-dark group-focus:text-link dark:group-focus:text-link-dark"
        displayDirection={type === 'Previous' ? 'start' : 'end'}
      />
      <div className="flex flex-col overflow-hidden">
        <span className="text-sm font-bold tracking-wide no-underline uppercase text-secondary dark:text-secondary-dark group-focus:text-link dark:group-focus:text-link-dark group-focus:text-opacity-100">
          {type}
        </span>
        <span className="text-lg break-words group-hover:underline">
          {title}
        </span>
      </div>
    </NextLink>
  );
}
