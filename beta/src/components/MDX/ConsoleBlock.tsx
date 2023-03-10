/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {isValidElement} from 'react';
import * as React from 'react';
import cn from 'classnames';
import {IconWarning} from '../Icon/IconWarning';
import {IconError} from '../Icon/IconError';

type LogLevel = 'warning' | 'error' | 'info';

interface ConsoleBlockProps {
  level?: LogLevel;
  children: React.ReactNode;
}

const Box = ({
  width = '60px',
  height = '17px',
  className,
  customStyles,
}: {
  width?: string;
  height?: string;
  className?: string;
  customStyles?: Record<string, string>;
}) => (
  <div className={className} style={{width, height, ...customStyles}}></div>
);

function ConsoleBlock({level = 'error', children}: ConsoleBlockProps) {
  let message: React.ReactNode | null;
  if (typeof children === 'string') {
    message = children;
  } else if (isValidElement(children)) {
    message = children.props.children;
  }

  return (
    <div className="mb-4 text-secondary" translate="no">
      <div className="flex w-full rounded-t-lg bg-gray-200 dark:bg-gray-80">
        <div className="px-4 py-2 border-gray-300 dark:border-gray-90 border-r">
          <Box className="bg-gray-300 dark:bg-gray-90" width="15px" />
        </div>
        <div className="flex text-sm px-4">
          <div className="border-b-2 border-gray-300 dark:border-gray-90 dark:text-gray-30 text-gray-50">
            Console
          </div>
          <div className="px-4 py-2 flex">
            <Box className="mr-2 bg-gray-300 dark:bg-gray-90" />
            <Box className="mr-2 hidden md:block bg-gray-300 dark:bg-gray-90" />
            <Box className="hidden md:block bg-gray-300 dark:bg-gray-90" />
          </div>
        </div>
      </div>
      <div
        className={cn(
          'flex px-4 pt-4 pb-6 items-center content-center font-mono text-code rounded-b-md',
          {
            'bg-red-30 text-red-50 dark:text-red-30 bg-opacity-5':
              level === 'error',
            'bg-yellow-5 text-yellow-50': level === 'warning',
            'bg-gray-5 text-secondary dark:text-secondary-dark':
              level === 'info',
          }
        )}>
        {level === 'error' && <IconError className="self-start mt-1.5" />}
        {level === 'warning' && <IconWarning className="self-start mt-1" />}
        <div className="px-3">{message}</div>
      </div>
    </div>
  );
}

export default ConsoleBlock;
