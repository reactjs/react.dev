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
          'p-2 pe-2 ps-5 w-full rounded-e-lg text-start hover:bg-gray-5 dark:hover:bg-gray-80 relative flex items-center justify-between',
          {
            'p-2 text-base': level > 1,
            'text-link bg-highlight dark:bg-highlight-dark text-base font-bold hover:bg-highlight dark:hover:bg-highlight-dark hover:text-link dark:hover:text-link-dark':
              !heading && isBreadcrumb && !isExpanded,
            'p-4 my-6 text-2xl lg:my-auto lg:text-sm font-bold': heading,
            'p-2 hover:text-gray-70 text-base font-bold text-primary dark:text-primary-dark':
              !heading && !isBreadcrumb,
            'text-primary dark:text-primary-dark': heading && !isBreadcrumb,
            'text-primary dark:text-primary-dark text-base font-bold bg-card dark:bg-card-dark':
              !heading && isExpanded,
          }
        )}
        onClick={onClick}>
        {title}
        {typeof isExpanded && !heading && (
          <span className="pe-2 text-gray-30">
            <IconNavArrow displayDirection={isExpanded ? 'down' : 'end'} />
          </span>
        )}
      </button>
    </div>
  );
}
