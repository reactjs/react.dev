/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import cn from 'classnames';
import {IconNavArrow} from 'components/Icon/IconNavArrow';
import Link from 'next/link';
import {useIsMobile} from '../useMediaQuery';

interface SidebarLinkProps {
  href: string;
  selected?: boolean;
  title: string;
  level: number;
  icon?: React.ReactNode;
  heading?: boolean;
  isExpanded?: boolean;
  isBreadcrumb?: boolean;
  hideArrow?: boolean;
}

export function SidebarLink({
  href,
  selected = false,
  title,
  level,
  heading = false,
  isExpanded,
  isBreadcrumb,
  hideArrow,
}: SidebarLinkProps) {
  const ref = React.useRef<HTMLAnchorElement>(null);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (ref && ref.current && !!selected && !isMobile) {
      scrollIntoView(ref.current, {
        scrollMode: 'if-needed',
        block: 'center',
        inline: 'nearest',
      });
    }
  }, [ref, selected, isMobile]);

  return (
    <Link href={href}>
      <a
        ref={ref}
        title={title}
        aria-current={selected ? 'page' : undefined}
        className={cn(
          'p-2 pr-2 w-full rounded-none lg:rounded-r-lg text-left hover:bg-gray-5 dark:hover:bg-gray-80 relative flex items-center justify-between',
          {
            'my-6': heading,
            'text-primary dark:text-primary-dark': heading && !isBreadcrumb,
            'text-sm pl-6': level > 0,
            'pl-5': level < 2,
            'text-base font-bold': level === 0,
            'dark:text-primary-dark text-primary ': level === 0 && !selected,
            'text-base text-link dark:text-link-dark': level === 1 && selected,
            'dark:text-primary-dark text-primary': heading,
            'text-base text-secondary dark:text-secondary-dark':
              !selected && !heading,
            'text-base text-link dark:text-link-dark bg-highlight dark:bg-highlight-dark border-blue-40 hover:bg-highlight hover:text-link dark:hover:bg-highlight-dark dark:hover:text-link-dark':
              selected,
          }
        )}>
        {title}
        {isExpanded != null && !heading && !hideArrow && (
          <span
            className={cn('pr-1', {
              'text-link': isExpanded,
              'text-gray-30': !isExpanded,
            })}>
            <IconNavArrow displayDirection={isExpanded ? 'down' : 'right'} />
          </span>
        )}
      </a>
    </Link>
  );
}
