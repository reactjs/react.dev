'use client';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useRef, useEffect} from 'react';
import * as React from 'react';
import cn from 'classnames';
import {IconNavArrow} from 'components/Icon/IconNavArrow';
import {IconCanary} from 'components/Icon/IconCanary';
import {IconExperimental} from 'components/Icon/IconExperimental';
import Link, {useLinkStatus} from 'next/link';

interface SidebarLinkProps {
  href: string;
  selected?: boolean;
  title: string;
  level: number;
  version?: 'canary' | 'major' | 'experimental' | 'rc';
  icon?: React.ReactNode;
  isExpanded?: boolean;
  hideArrow?: boolean;
}

function SidebarLinkContent({
  hideArrow,
  isExpanded,
  pending,
  selected,
  title,
  version,
  level,
}: Omit<SidebarLinkProps, 'href'> & {pending: boolean}) {
  return (
    <span
      className={cn(
        'p-2 pe-2 w-full rounded-none lg:rounded-e-2xl text-start hover:bg-gray-5 dark:hover:bg-gray-80 relative flex items-center justify-between',
        {
          'text-sm ps-6': level > 0,
          'ps-5': level < 2,
          'text-base font-bold': level === 0,
          'text-primary dark:text-primary-dark': level === 0 && !selected,
          'text-base text-secondary dark:text-secondary-dark':
            level > 0 && !selected,
          'text-base text-link dark:text-link-dark bg-highlight dark:bg-highlight-dark border-blue-40 hover:bg-highlight hover:text-link dark:hover:bg-highlight-dark dark:hover:text-link-dark':
            selected,
          'dark:bg-gray-70 bg-gray-3 dark:hover:bg-gray-70 hover:bg-gray-3':
            pending,
        }
      )}>
      <span>
        {title}{' '}
        {version === 'major' && (
          <span
            title="- This feature is available in React 19 beta and the React canary channel"
            className={`text-xs px-1 ms-1 rounded bg-gray-10 dark:bg-gray-40 dark:bg-opacity-20 text-gray-40 dark:text-gray-40`}>
            React 19
          </span>
        )}
        {version === 'canary' && (
          <IconCanary
            title=" - This feature is available in the latest Canary version of React"
            className="ms-1 text-gray-30 dark:text-gray-60 inline-block w-3.5 h-3.5 align-[-3px]"
          />
        )}
        {version === 'experimental' && (
          <IconExperimental
            title=" - This feature is available in the latest Experimental version of React"
            className="ms-1 text-gray-30 dark:text-gray-60 inline-block w-3.5 h-3.5 align-[-3px]"
          />
        )}
        {version === 'rc' && (
          <IconCanary
            title=" - This feature is available in the latest RC version"
            className="ms-1 text-gray-30 dark:text-gray-60 inline-block w-3.5 h-3.5 align-[-3px]"
          />
        )}
      </span>
      {isExpanded != null && !hideArrow ? (
        <span
          className={cn('pe-1', {
            'text-link dark:text-link-dark': isExpanded,
            'text-tertiary dark:text-tertiary-dark': !isExpanded,
          })}>
          <IconNavArrow displayDirection={isExpanded ? 'down' : 'end'} />
        </span>
      ) : null}
    </span>
  );
}

function PendingSidebarLinkContent(props: Omit<SidebarLinkProps, 'href'>) {
  const {pending} = useLinkStatus();
  return <SidebarLinkContent {...props} pending={pending} />;
}

export function SidebarLink({
  href,
  selected = false,
  title,
  version,
  level,
  isExpanded,
  hideArrow,
}: SidebarLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (selected && ref && ref.current) {
      // @ts-ignore
      if (typeof ref.current.scrollIntoViewIfNeeded === 'function') {
        // @ts-ignore
        ref.current.scrollIntoViewIfNeeded();
      }
    }
  }, [ref, selected]);

  let target = '';
  if (href.startsWith('https://')) {
    target = '_blank';
  }

  const contentProps = {
    hideArrow,
    isExpanded,
    level,
    selected,
    title,
    version,
  };

  if (target === '_blank') {
    return (
      <a
        href={href}
        ref={ref}
        title={title}
        target={target}
        rel="noreferrer noopener"
        aria-current={selected ? 'page' : undefined}
        className="block">
        <SidebarLinkContent {...contentProps} pending={false} />
      </a>
    );
  }

  return (
    <Link
      href={href}
      ref={ref}
      title={title}
      target={target}
      aria-current={selected ? 'page' : undefined}
      className="block">
      <PendingSidebarLinkContent {...contentProps} />
    </Link>
  );
}
