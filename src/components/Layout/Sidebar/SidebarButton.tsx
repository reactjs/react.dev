/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import cn from 'classnames';
import {IconNavArrow} from 'components/Icon/IconNavArrow';

interface SidebarButtonProps {
  title: string;
  heading: boolean;
  level: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isExpanded?: boolean;
  isBreadcrumb?: boolean;
}

export function SidebarButton({
  title,
  heading,
  level,
  onClick,
  isExpanded,
  isBreadcrumb,
}: SidebarButtonProps) {
  return (
    <div
      className={cn({
        'my-1': heading || level === 1,
        'my-3': level > 1,
      })}>
      <button
        className={cn(
          'relative flex w-full items-center justify-between rounded-r-lg p-2 pr-2 pl-5 text-left hover:bg-gray-5 dark:hover:bg-gray-80',
          {
            'p-2 text-base': level > 1,
            'bg-highlight text-base font-bold text-link hover:bg-highlight hover:text-link dark:bg-highlight-dark dark:hover:bg-highlight-dark dark:hover:text-link-dark':
              !heading && isBreadcrumb && !isExpanded,
            'my-6 p-4 text-2xl font-bold lg:my-auto lg:text-sm': heading,
            'p-2 text-base font-bold text-primary hover:text-gray-70 dark:text-primary-dark':
              !heading && !isBreadcrumb,
            'text-primary dark:text-primary-dark': heading && !isBreadcrumb,
            'bg-card text-base font-bold text-primary dark:bg-card-dark dark:text-primary-dark':
              !heading && isExpanded,
          }
        )}
        onClick={onClick}>
        {title}
        {typeof isExpanded && !heading && (
          <span className="pr-2 text-gray-30">
            <IconNavArrow displayDirection={isExpanded ? 'down' : 'right'} />
          </span>
        )}
      </button>
    </div>
  );
}
